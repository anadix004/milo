-- ============================================================
-- IDEMPOTENT MIGRATION: Robust RSVP constraint setup (SEC-04)
-- Run this in Supabase Dashboard → SQL Editor
--
-- This script works whether or not the 'rsvps' table already exists.
-- ============================================================

-- 1. Create the table with the correct unique constraint if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'join',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, profile_id, type)
);

-- 2. Enable RLS if creating the table for the first time
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 3. Setup standard RLS policies if not already present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rsvps' AND policyname = 'Users can read their own RSVPs') THEN
        CREATE POLICY "Users can read their own RSVPs" ON public.rsvps FOR SELECT USING (auth.uid() = profile_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rsvps' AND policyname = 'Users can insert their own RSVPs') THEN
        CREATE POLICY "Users can insert their own RSVPs" ON public.rsvps FOR INSERT WITH CHECK (auth.uid() = profile_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rsvps' AND policyname = 'Users can delete their own RSVPs') THEN
        CREATE POLICY "Users can delete their own RSVPs" ON public.rsvps FOR DELETE USING (auth.uid() = profile_id);
    END IF;
END $$;

-- 4. If table already existed with the old constraint, drop it and add the new one
ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_event_id_profile_id_key;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'rsvps_event_id_profile_id_type_key'
    ) THEN
        ALTER TABLE public.rsvps 
        ADD CONSTRAINT rsvps_event_id_profile_id_type_key UNIQUE (event_id, profile_id, type);
    END IF;
END $$;
