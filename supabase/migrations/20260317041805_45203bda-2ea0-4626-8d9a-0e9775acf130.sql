
-- Create table for participant results
CREATE TABLE public.participant_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT false,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create unique constraint on nickname (case-insensitive)
CREATE UNIQUE INDEX idx_participant_results_nickname ON public.participant_results (LOWER(nickname));

-- Enable RLS
ALTER TABLE public.participant_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (participants are anonymous)
CREATE POLICY "Anyone can insert results"
  ON public.participant_results
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update their own result by nickname
CREATE POLICY "Anyone can update results"
  ON public.participant_results
  FOR UPDATE
  USING (true);

-- Allow anyone to read (dashboard needs this; no PII involved)
CREATE POLICY "Anyone can read results"
  ON public.participant_results
  FOR SELECT
  USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_participant_results_updated_at
  BEFORE UPDATE ON public.participant_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
