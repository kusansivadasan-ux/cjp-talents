import { createServerClient } from '@/lib/supabase/server'
import { AdminDashboard } from './AdminDashboard'
import type { WaitlistEntry } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getApplications(): Promise<WaitlistEntry[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/page] Supabase error:', error)
    return []
  }

  return (data ?? []) as WaitlistEntry[]
}

export default async function AdminPage() {
  const applications = await getApplications()

  const total = applications.length
  const pending = applications.filter((a) => a.status === 'pending').length
  const approved = applications.filter((a) => a.status === 'approved').length
  const rejected = applications.filter((a) => a.status === 'rejected').length
  const priority = applications.filter((a) => a.is_priority_review && a.status === 'pending').length

  return (
    <AdminDashboard
      applications={applications}
      stats={{ total, pending, approved, rejected, priority }}
    />
  )
}
