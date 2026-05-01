-- ============================================
-- MILO PLATFORM: Migration V3 (Missing Tables)
-- Fixes bugs identified in the comprehensive audit
-- ============================================

-- 1. BOOKMARKS TABLE
-- Used to "Save" or "Bookmark" events on the radar
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, event_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = profile_id);


-- 2. VIBE_CHECKS TABLE
-- Used for the story-like "Vibe Check" feature on event pages
CREATE TABLE IF NOT EXISTS public.vibe_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  user_name TEXT,
  user_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vibe_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vibe checks are visible to everyone" ON public.vibe_checks;
CREATE POLICY "Vibe checks are visible to everyone"
  ON public.vibe_checks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can post vibes" ON public.vibe_checks;
CREATE POLICY "Authenticated users can post vibes"
  ON public.vibe_checks FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins or owners can delete vibes" ON public.vibe_checks;
CREATE POLICY "Admins or owners can delete vibes"
  ON public.vibe_checks FOR DELETE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
    OR auth.uid() = profile_id
  );

-- Verify and Grant Permissions
GRANT ALL ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
GRANT ALL ON public.vibe_checks TO authenticated;
GRANT ALL ON public.vibe_checks TO service_role;
GRANT SELECT ON public.vibe_checks TO anon;
