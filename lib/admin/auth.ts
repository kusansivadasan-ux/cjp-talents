import { createSSRClient } from '@/lib/supabase/ssr'

/**
 * Returns the list of allowed admin emails from the ADMIN_EMAILS env var.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Returns true if the email is in the ADMIN_EMAILS allowlist.
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}

/**
 * Reads the current session from cookies.
 * Returns { session, user } or null if not authenticated.
 */
export async function getAdminSession() {
  const supabase = await createSSRClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null
  return session
}
