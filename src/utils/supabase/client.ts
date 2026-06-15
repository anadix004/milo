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
 * Usage:
 *   import { createClient } from '@/utils/supabase/client'
 *   const supabase = createClient()
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-milo.supabase.co"
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
  return createBrowserClient(url, key)
}
