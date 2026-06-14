-- ============================================================
-- MIGRATION: Fix RSVP unique constraint (SEC-04)
-- Run this in Supabase Dashboard → SQL Editor
--
-- WHY: The old UNIQUE(event_id, profile_id) constraint meant
-- a user could only have ONE rsvp row per event. Upserting a
-- 'bookmark' after a 'join' would silently overwrite the join.
--
-- FIX: Drop the old constraint, add a new one that includes
-- 'type' so join + bookmark coexist as separate rows.
-- ============================================================

-- Step 1: Drop the old two-column unique constraint
ALTER TABLE public.rsvps
  DROP CONSTRAINT IF EXISTS rsvps_event_id_profile_id_key;

-- Step 2: Add the new three-column unique constraint
ALTER TABLE public.rsvps
  ADD CONSTRAINT rsvps_event_id_profile_id_type_key
  UNIQUE (event_id, profile_id, type);
