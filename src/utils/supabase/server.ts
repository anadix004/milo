/**
 * @/utils/supabase/server.ts
 *
 * PHASE 4 FIX: Server-side Supabase client factory.
 *
 * Used by:
 *   - Route Handlers (app/api/*)
 *   - Server Components (async page.tsx files)
 *   - middleware.ts (already uses createServerClient directly from @supabase/ssr)
 *
 * @/lib/supabase-server.ts re-exports from here so existing imports work.
 *
 * Why async? The cookies() API in Next.js App Router is async since Next.js 15.
 * Wrapping in an async function ensures we await cookies() before passing to
 * createServerClient, preventing the "cookies accessed before headers" error.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-milo.supabase.co"
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from Server Component — cookies are read-only.
            // This is expected and safe to ignore; the middleware handles
            // refreshing the session cookie.
          }
        },
      },
    }
  )
}
