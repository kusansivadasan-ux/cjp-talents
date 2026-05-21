import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/lib/supabase/ssr'
import { createServerClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin/auth'
import { sendRejectionEmail } from '@/lib/email/templates'
import type { WaitlistEntry } from '@/lib/types'

export async function POST(request: NextRequest) {
  // 1. Verify admin session
  const ssrClient = await createSSRClient()
  const { data: { session } } = await ssrClient.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Parse body
  let body: { id?: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // 3. Update waitlist row with service-role client
  const supabase = createServerClient()
  const { data: entry, error } = await supabase
    .from('waitlist')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      review_notes: body.notes ?? null,
    })
    .eq('id', body.id)
    .select()
    .single()

  if (error) {
    console.error('[reject] Supabase error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // 4. Fire-and-forget rejection email
  sendRejectionEmail(entry as WaitlistEntry).catch((err) => {
    console.error('[reject] Failed to send rejection email:', err)
  })

  return NextResponse.json({ entry })
}
