import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { generateUniqueReferralCode } from '@/lib/referral'

const schema = z.object({
  full_name: z.string().min(2, 'Name too short').max(100),
  email: z.string().email('Invalid email'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  city: z.string().min(2).max(100),
  state: z.string().min(2),
  education: z.string().optional(),
  college: z.string().optional(),
  domain: z.string().optional(),
  skills: z.array(z.string()).default([]),
  purpose: z.enum(['job', 'cofounder', 'both']),
  aspiration: z.string().max(120).optional(),
  referred_by: z.string().optional(),
  is_priority_review: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const data = result.data
  const supabase = createServerClient()

  // If signup came via a personal invite token, consume one token from the inviter
  let isPriority = data.is_priority_review
  if (isPriority && data.referred_by) {
    const { data: inviter } = await supabase
      .from('waitlist')
      .select('id, invite_tokens, tokens_used')
      .eq('referral_code', data.referred_by)
      .eq('status', 'approved')
      .maybeSingle()

    if (!inviter || inviter.tokens_used >= inviter.invite_tokens) {
      isPriority = false // inviter has no tokens — downgrade to standard review
    } else {
      await supabase
        .from('waitlist')
        .update({ tokens_used: inviter.tokens_used + 1 })
        .eq('id', inviter.id)
    }
  }

  const referral_code = await generateUniqueReferralCode(data.full_name, supabase)

  const { data: entry, error } = await supabase
    .from('waitlist')
    .insert({
      full_name: data.full_name,
      email: data.email,
      mobile: data.mobile,
      city: data.city,
      state: data.state,
      education: data.education ?? null,
      college: data.college ?? null,
      domain: data.domain ?? null,
      skills: data.skills,
      purpose: data.purpose,
      aspiration: data.aspiration ?? null,
      referred_by: data.referred_by ?? null,
      is_priority_review: isPriority,
      referral_code,
    })
    .select('display_number, referral_code')
    .single()

  if (error) {
    if (error.code === '23505') {
      const field = error.message.includes('email') ? 'email' : 'mobile number'
      return NextResponse.json(
        { error: `This ${field} is already registered.` },
        { status: 409 }
      )
    }
    console.error('Supabase insert error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    display_number: entry.display_number,
    referral_code: entry.referral_code,
  })
}
