-- ============================================
-- MILO PLATFORM: Migration V4 (Trigger Optimization)
-- Fixes race condition in profile creation by allowing
-- metadata-based role assignment.
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  target_role TEXT;
BEGIN
  -- Extract role from metadata or default to 'user'
  target_role := COALESCE(new.raw_user_meta_data->>'role', 'user');

  INSERT INTO public.profiles (id, email, display_name, username, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    target_role
  )
  ON CONFLICT (id) DO UPDATE 
  SET role = EXCLUDED.role,
      display_name = EXCLUDED.display_name,
      updated_at = now();
      
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
