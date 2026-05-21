import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { MEMBER_COUNT_SEED } from '@/lib/constants'

export const revalidate = 30

export async function GET() {
  const supabase = createServerClient()
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return NextResponse.json({ count: MEMBER_COUNT_SEED })
  }

  return NextResponse.json({ count: MEMBER_COUNT_SEED + (count ?? 0) })
}
