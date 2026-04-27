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

    if (!url || !key || key === "undefined" || key === "null") {
      const missing = [];
      if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!key || key === "undefined" || key === "null") missing.push("SUPABASE_SERVICE_ROLE_KEY");
      
      throw new Error(
        `Critical: Supabase Admin configuration missing or invalid. Missing: ${missing.join(", ")}. Ensure these are set in your environment variables.`
      );
    }

    try {
      _supabaseAdmin = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
    } catch (err) {
      throw new Error(`Failed to initialize Supabase Admin client: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }
  return _supabaseAdmin;
}
