import { describe, it, expect } from 'vitest'
import { buildReferralCode } from '../referral'

describe('buildReferralCode', () => {
  it('uses first 5 chars of name uppercased', () => {
    const code = buildReferralCode('Kusan Sivadasan', 47)
    expect(code).toBe('KUSAN47')
  })

  it('handles names shorter than 5 chars', () => {
    const code = buildReferralCode('Anu', 12)
    expect(code).toBe('ANU12')
  })

  it('strips spaces from the name prefix', () => {
    const code = buildReferralCode('A B C D E F', 99)
    expect(code).toBe('ABCDE99')
  })

  it('strips non-alpha characters', () => {
    const code = buildReferralCode('Rāhul123', 55)
    expect(code.endsWith('55')).toBe(true)
    expect(/^[A-Z]+55$/.test(code)).toBe(true)
  })

  it('pads single-digit suffix to 2 digits', () => {
    const code = buildReferralCode('Priya', 5)
    expect(code).toBe('PRIYA05')
  })
})
