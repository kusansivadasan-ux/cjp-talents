export interface WaitlistEntry {
  id: string
  full_name: string
  email: string
  mobile: string
  city: string
  state: string
  education: string | null
  college: string | null
  domain: string | null
  skills: string[]
  purpose: 'job' | 'cofounder' | 'both'
  aspiration: string | null
  referral_code: string
  referred_by: string | null
  is_priority_review: boolean
  status: 'pending' | 'approved' | 'rejected'
  invite_tokens: number
  tokens_used: number
  reviewed_at: string | null
  review_notes: string | null
  display_number: number
  created_at: string
  converted: boolean
}

export interface SignupPayload {
  full_name: string
  email: string
  mobile: string
  city: string
  state: string
  education?: string
  college?: string
  domain?: string
  skills: string[]
  purpose: 'job' | 'cofounder' | 'both'
  aspiration?: string
  referred_by?: string
  is_priority_review: boolean
}

export interface SignupResponse {
  display_number: number
  referral_code: string
}
