'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'

interface AdminHeaderProps {
  email: string
}

export function AdminHeader({ email }: AdminHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <header
      style={{
        backgroundColor: '#141414',
        borderBottom: '1px solid #2A2A2A',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
          href="/admin"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#E8540A',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          CJP Talents Admin
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#6B6B6B' }}>{email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 14px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#B0A090',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
