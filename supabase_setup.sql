-- ============================================
-- MILO PLATFORM: Fresh Database Setup (RE-RUNNABLE)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  username TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'team', 'user')),
  city TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies (DROP first to be re-runnable)
DROP POLICY IF EXISTS "Public profiles are visible to everyone" ON public.profiles;
CREATE POLICY "Public profiles are visible to everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can do anything" ON public.profiles;
CREATE POLICY "Service role can do anything"
  ON public.profiles
  USING (auth.role() = 'service_role');

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  "cityId" TEXT,
  date TEXT,
  price TEXT DEFAULT 'Free',
  category TEXT DEFAULT 'Culture',
  image TEXT,
  video_url TEXT,
  venue_address TEXT,
  ticket_links JSONB DEFAULT '[]',
  aadhaar_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events policies
DROP POLICY IF EXISTS "Verified events are visible to everyone" ON public.events;
CREATE POLICY "Verified events are visible to everyone"
  ON public.events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
CREATE POLICY "Authenticated users can insert events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- SEC-01 FIX: Only the event owner or admin/owner-role users can update events
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events"
  ON public.events FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
  );

-- SEC-01 FIX: Only the event owner or admin/owner-role users can delete events
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;
CREATE POLICY "Users can delete their own events"
  ON public.events FOR DELETE
  USING (
    auth.uid() = user_id
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
  );

-- 3. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, username, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CREATE STORAGE BUCKET FOR EVENT ASSETS
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-assets', 'event-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Anyone can view event assets" ON storage.objects;
CREATE POLICY "Anyone can view event assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-assets');

DROP POLICY IF EXISTS "Authenticated users can upload event assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload event assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-assets' AND auth.uid() IS NOT NULL);

-- ============================================
-- DB-01 FIX: Missing RSVPS table
-- ============================================

CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'join',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, profile_id)
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own RSVPs" ON public.rsvps;
CREATE POLICY "Users can read their own RSVPs"
  ON public.rsvps FOR SELECT
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert their own RSVPs" ON public.rsvps;
CREATE POLICY "Users can insert their own RSVPs"
  ON public.rsvps FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can delete their own RSVPs" ON public.rsvps;
CREATE POLICY "Users can delete their own RSVPs"
  ON public.rsvps FOR DELETE
  USING (auth.uid() = profile_id);

-- ============================================
-- DB-01 FIX: Missing AVATARS storage bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Done! Your fresh Milo backend is ready.
