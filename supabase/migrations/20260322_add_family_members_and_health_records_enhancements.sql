-- Create family_members table if not exists
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age TEXT,
  gender TEXT,
  phone_number TEXT,
  abha_id TEXT,
  doctor_view_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Create policies for family_members
DROP POLICY IF EXISTS "Users can view own family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can insert own family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can update own family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete own family members" ON public.family_members;

CREATE POLICY "Users can view own family members"
  ON public.family_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own family members"
  ON public.family_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family members"
  ON public.family_members FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own family members"
  ON public.family_members FOR DELETE
  USING (auth.uid() = user_id);

-- Create medicine_reminders table if not exists
CREATE TABLE IF NOT EXISTS public.medicine_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  dosage TEXT,
  times TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for medicine_reminders
DROP POLICY IF EXISTS "Users can view own medicine reminders" ON public.medicine_reminders;
DROP POLICY IF EXISTS "Users can insert own medicine reminders" ON public.medicine_reminders;
DROP POLICY IF EXISTS "Users can update own medicine reminders" ON public.medicine_reminders;
DROP POLICY IF EXISTS "Users can delete own medicine reminders" ON public.medicine_reminders;

CREATE POLICY "Users can view own medicine reminders"
  ON public.medicine_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medicine reminders"
  ON public.medicine_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medicine reminders"
  ON public.medicine_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medicine reminders"
  ON public.medicine_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Add columns to health_records table if not exists
ALTER TABLE public.health_records
  ADD COLUMN IF NOT EXISTS family_member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS raw_gemini_response JSONB;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_family_member_id ON public.health_records(family_member_id);
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_user_id ON public.medicine_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_family_member_id ON public.medicine_reminders(family_member_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
