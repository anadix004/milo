-- ============================================
-- MILO PLATFORM: Migration V2 (Polish & Features)
-- ============================================

-- 1. ADD PERSISTENCE TO PROFILES
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_ghost BOOLEAN DEFAULT false;

-- 2. MESSAGES TABLE (REAL-TIME CHAT)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
CREATE POLICY "Anyone can view messages"
  ON public.messages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.messages;
CREATE POLICY "Authenticated users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- 3. RSVPS TABLE (ACTIVITY TRACKING)
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('join', 'bookmark')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, profile_id, type)
);

-- Enable RLS for RSVPs
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- RSVPs policies
DROP POLICY IF EXISTS "Users can view their own RSVPs" ON public.rsvps;
CREATE POLICY "Users can view their own RSVPs"
  ON public.rsvps FOR SELECT
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can manage their own RSVPs" ON public.rsvps;
CREATE POLICY "Users can manage their own RSVPs"
  ON public.rsvps FOR ALL
  USING (auth.uid() = profile_id);

-- 4. ENABLE REALTIME
-- Note: You may need to enable this in the Supabase Dashboard UI 
-- (Database -> Replication -> supabase_realtime publication)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
