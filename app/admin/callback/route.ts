import { NextRequest, NextResponse } from 'next/server'
import { createSSRRouteClient } from '@/lib/supabase/ssr'
import { isAdmin } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/admin/login?error=no_code', request.url))
  }

  const { supabase, response } = createSSRRouteClient(request)

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.session) {
    console.error('[admin/callback] Exchange error:', error)
    return NextResponse.redirect(new URL('/admin/login?error=exchange_failed', request.url))
  }

  // Verify this email is in the admin allowlist
  if (!isAdmin(data.session.user.email)) {
    // Sign out immediately — no access
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/admin/login?error=not_admin', request.url))
  }

  // Success — redirect to admin dashboard
  const redirectResponse = NextResponse.redirect(new URL('/admin', request.url))

  // Forward any set-cookie headers from the SSR client
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return redirectResponse
}
