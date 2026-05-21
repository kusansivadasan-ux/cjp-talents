'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

const ERROR_MESSAGES: Record<string, string> = {
  no_code: 'The magic link was invalid. Please try again.',
  exchange_failed: 'Login failed. The link may have expired. Please try again.',
  not_admin: 'This email is not authorized to access the admin panel.',
}

export default function AdminLoginPage() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(errorParam ? ERROR_MESSAGES[errorParam] ?? 'Something went wrong.' : null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createBrowserClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${APP_URL}/admin/callback`,
        shouldCreateUser: false,
      },
    })

    setLoading(false)

    if (otpError) {
      // Supabase returns an error if the user doesn't exist when shouldCreateUser=false
      // but for security we show a generic message
      console.error('[login] OTP error:', otpError)
      setError('Failed to send magic link. Please check your email and try again.')
      return
    }

    setSent(true)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0D0D0D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#141414',
          border: '1px solid #2A2A2A',
          borderRadius: '12px',
          padding: '40px 32px',
        }}
      >
        {/* Logo / Brand */}
        <div style={{ marginBottom: '32px' }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#E8540A',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontFamily: 'inherit',
            }}
          >
            CJP Talents
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 700,
              color: '#F5E8D5',
              fontFamily: 'inherit',
            }}
          >
            Admin Login
          </h1>
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              marginBottom: '24px',
              padding: '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#FCA5A5',
            }}
          >
            {error}
          </div>
        )}

        {/* Sent confirmation */}
        {sent ? (
          <div
            style={{
              padding: '24px',
              backgroundColor: 'rgba(26, 107, 53, 0.15)',
              border: '1px solid rgba(26, 107, 53, 0.4)',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: '24px' }}>📬</p>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#F5E8D5',
              }}
            >
              Check your inbox
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#B0A090' }}>
              We sent a magic link to <strong style={{ color: '#F5E8D5' }}>{email}</strong>.
              Click it to log in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#B0A090',
                }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#F5E8D5',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%',
                height: '40px',
                backgroundColor: loading || !email ? '#6B3A20' : '#E8540A',
                color: '#0D0D0D',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s',
              }}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
