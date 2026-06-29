import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Public paths that redirect to dashboard if already logged in
  const isAuthRoute = path.startsWith('/auth')
  
  // Protected paths that require authentication
  const isProtectedRoute = path.startsWith('/complete-profile') || path.startsWith('/admin')

  if (isAuthRoute) {
    if (user && !path.startsWith('/auth/callback')) {
      return NextResponse.redirect(new URL('/explore', request.url))
    }
    return supabaseResponse
  }

  if (isProtectedRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    if (path.startsWith('/admin')) {
      // Check admin status. In Supabase, custom metadata or fetching the role is needed.
      // Since we indexed `profiles.role`, we should fetch it here or rely on app_metadata.
      // Let's rely on the DB query for absolute certainty as middleware runs in Edge and can query via REST
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role ?? 'user'
      const isAdmin = role === 'admin' || role === 'owner' || role === 'team'

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/explore', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
