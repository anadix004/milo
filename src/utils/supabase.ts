/**
 * @/utils/supabase.ts
 *
 * PHASE 4 FIX: Legacy module-level export — kept for backward compatibility.
 *
 * Files that import { supabase } from '@/utils/supabase':
 *   - src/app/sitemap.ts         (server-side, just needs data access)
 *   - src/app/(pages)/city/[slug]/page.tsx (server component)
 *
 * The original version used createClient() from @supabase/supabase-js directly.
 * This works but bypasses cookie-based auth (no session on server renders).
 * For sitemap.ts and city pages this is acceptable since they only read public
 * event data (no auth required). We keep the legacy export but switch the
 * underlying client to use the same env vars as the ssr clients.
 *
 * Long-term: migrate these callers to the server client from @/utils/supabase/server.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Module-level singleton — safe for server-side public data reads.
// Do NOT use this in Client Components. Use @/utils/supabase/client instead.
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
