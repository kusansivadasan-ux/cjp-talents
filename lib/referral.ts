import type { SupabaseClient } from '@supabase/supabase-js'

export function buildReferralCode(fullName: string, suffix: number): string {
  const prefix = fullName
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 5)
    .toUpperCase()
  const paddedSuffix = suffix.toString().padStart(2, '0')
  return `${prefix}${paddedSuffix}`
}

export async function generateUniqueReferralCode(
  fullName: string,
  supabase: SupabaseClient
): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const suffix = Math.floor(Math.random() * 90) + 10 // 10-99
    const code = buildReferralCode(fullName, suffix)
    const { data } = await supabase
      .from('waitlist')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle()
    if (!data) return code
  }
  // Fallback: timestamp-based suffix avoids infinite loop
  return buildReferralCode(fullName, Date.now() % 90 + 10)
}
