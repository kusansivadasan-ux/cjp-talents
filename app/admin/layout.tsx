import { redirect } from 'next/navigation'
import { createSSRClient } from '@/lib/supabase/ssr'
import { isAdmin } from '@/lib/admin/auth'
import { AdminHeader } from './AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSSRClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Not logged in → redirect to login
  if (!session) {
    redirect('/admin/login')
  }

  // Logged in but not admin → access denied page
  if (!isAdmin(session.user.email)) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0D0D0D',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '400px',
            width: '100%',
            backgroundColor: '#141414',
            border: '1px solid #2A2A2A',
            borderRadius: '12px',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 8px', fontSize: '32px' }}>🚫</p>
          <h1
            style={{
              margin: '0 0 12px',
              fontSize: '20px',
              fontWeight: 700,
              color: '#F5E8D5',
              fontFamily: 'inherit',
            }}
          >
            Access Denied
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#B0A090' }}>
            {session.user.email} is not authorized to access the admin panel.
          </p>
          <LogoutButton />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0D' }}>
      <AdminHeader email={session.user.email!} />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {children}
      </main>
    </div>
  )
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        style={{
          padding: '8px 20px',
          backgroundColor: '#1A1A1A',
          border: '1px solid #2A2A2A',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#B0A090',
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
    </form>
  )
}
