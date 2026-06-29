/**
 * @/utils/supabase/client.ts
 *
 * PHASE 4 FIX: Consolidated browser-side Supabase client factory.
 *
 * Root cause of original issue:
 *   - @/utils/supabase.ts exported a module-level singleton:
 *       export const supabase = createClient(url, key)
 *     This works but is not SSR-safe and doesn't support cookie-based auth
 *     across server/client boundaries.
 *   - @/utils/supabase/client.ts was missing from the repo but imported by
 *     every component (AuthContext, EventListing, EventSubmission, etc.).
 *     The @supabase/ssr package requires createBrowserClient() for client
 *     components and createServerClient() for server components/Route Handlers.
 *
 * Fix:
 *   - Use @supabase/ssr's createBrowserClient() which handles cookie storage,
 *     token refresh, and works correctly in both client components and pages.
 *   - Export a createClient() factory (not a singleton) so AuthContext can
 *     wrap it in useMemo([]) to prevent the re-subscription loop (Phase 2 fix).
 *
 * Chrome fix (2026-06):
 *   - createBrowserClient reads the session from document.cookie on every
 *     request to attach an Authorization header. Chrome's storage partitioning
 *     causes this cookie read to hang indefinitely for public queries.
 *   - createPublicClient() uses the plain @supabase/supabase-js client with no
 *     cookie storage. Use it for public tables (events). Use createClient() for
 *     anything that needs the user session (rsvps, bookmarks, profiles).
 */

import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-milo.supabase.co"
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

/** Full SSR-aware client — use for auth-gated queries (rsvps, bookmarks, profile). */
export function createClient() {
  return createBrowserClient(url, key)
}

/**
 * Lightweight public client — use for public tables (events) that only need the anon key.
 * Does NOT read/write cookies, so it never hangs in Chrome's strict storage mode.
 * Module-level singleton is safe here since it holds no user state.
 */
let _publicClient: ReturnType<typeof createSupabaseClient> | null = null
export function createPublicClient() {
  if (!_publicClient) {
    _publicClient = createSupabaseClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  }
  return _publicClient
}
