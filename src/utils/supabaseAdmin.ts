import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Lazily creates the admin Supabase client.
 * This avoids crashing at build time when env vars aren't available.
 * Used ONLY in server-side API routes to bypass RLS.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url && !key) {
      throw new Error(
        "Env vars missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are both undefined."
      );
    }
    if (!url) {
      throw new Error(
        "Env var missing: NEXT_PUBLIC_SUPABASE_URL is undefined."
      );
    }
    if (!key) {
      throw new Error(
        "Env var missing: SUPABASE_SERVICE_ROLE_KEY is undefined."
      );
    }

    _supabaseAdmin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabaseAdmin;
}
