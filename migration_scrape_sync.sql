-- ============================================
-- MILO: Scrape & Sync Migration
-- Adds source_url column for deduplication.
-- Run in Supabase Dashboard → SQL Editor
-- ============================================

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Partial unique index: only one row per unique URL
CREATE UNIQUE INDEX IF NOT EXISTS events_source_url_unique
  ON public.events (source_url)
  WHERE source_url IS NOT NULL;
