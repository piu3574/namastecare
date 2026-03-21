import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jsarrbcvnyrnyekvkjev.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzYXJyYmN2bnlybnlla3ZramV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMTIwNjIsImV4cCI6MjA4OTY4ODA2Mn0.u8n8cWh6qK-7xTSdxsbMX_XqcGZ9RkKOuh-HbTJiwVU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
