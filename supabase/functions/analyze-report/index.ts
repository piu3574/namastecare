// supabase/functions/analyze-report/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

type GeminiPart = { text: string };
type GeminiContent = { role: string; parts: GeminiPart[] };

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required env vars");
}

async function callGemini(prompt: string): Promise<any> {
  const contents: GeminiContent[] = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini error:", res.status, text);
    throw new Error("Gemini API error: " + res.status);
  }

  return res.json();
}

serve(async (req) => {
  try {
    // 1) Auth: get bearer token
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing bearer token" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // 2) Create anon client with user's JWT for token validation
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // 3) Validate user token
    const {
      data: { user },
      error: userError,
    } = await anonClient.auth.getUser();

    if (userError || !user) {
      console.error("auth.getUser error:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const userId = user.id;

    // 4) Create service role client for database and storage operations
    const serviceRoleClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 5) Parse form-data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const familyMemberId = (formData.get("family_member_id") as string | null) || null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "Missing file in request" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // 6) Upload file to Storage bucket
    const fileExt = file.name.split(".").pop() || "bin";
    const filePath = `reports/${userId}/${crypto.randomUUID()}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const { data: uploadData, error: uploadError } = await serviceRoleClient.storage
      .from("health_records")
      .upload(filePath, bytes, {
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload file" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const fileUrl = uploadData?.path ?? filePath;

    // 7) Call Gemini to analyze (simple text prompt — adjust as you like)
    const geminiPrompt = `You are a medical assistant AI. Read this medical report and provide:
- A short summary
- Key findings
- Any red flags or things to discuss with a doctor.

The report file name is: ${file.name}.
(You don't see the file content here; assume the app will send extracted text in a future version.)`;

    const geminiRaw = await callGemini(geminiPrompt);

    // Extract some text from the Gemini response
    const candidates = geminiRaw.candidates?.[0];
    const summaryText =
      candidates?.content?.parts?.map((p: any) => p.text).join("\n") ||
      "No summary generated.";

    // 8) Insert row into health_records
    const { data: insertData, error: insertError } = await serviceRoleClient
      .from("health_records")
      .insert({
        user_id: userId,
        family_member_id: familyMemberId,
        report_name: file.name,
        report_date: new Date().toISOString(),
        status: "completed",
        summary: summaryText,
        ai_summary: summaryText,
        flags: [],
        original_filename: file.name,
        file_url: fileUrl,
        raw_gemini_response: geminiRaw,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save record" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        record: insertData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
