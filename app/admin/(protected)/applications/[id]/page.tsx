import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import type { WaitlistEntry } from '@/lib/types'
import { ApplicationActions } from './actions'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getApplication(id: string): Promise<WaitlistEntry | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as WaitlistEntry
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'rgba(234, 179, 8, 0.1)', text: '#EAB308', border: 'rgba(234, 179, 8, 0.3)' },
  approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params
  const entry = await getApplication(id)

  if (!entry) {
    notFound()
  }

  const statusStyle = STATUS_STYLES[entry.status] ?? STATUS_STYLES.pending

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back link */}
      <Link
        href="/admin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#6B6B6B',
          textDecoration: 'none',
          marginBottom: '24px',
        }}
      >
        ← Back to applications
      </Link>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '36px',
                fontWeight: 800,
                color: '#E8540A',
              }}
            >
              #{entry.display_number}
            </span>
            {entry.is_priority_review && (
              <span
                style={{
                  padding: '2px 10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#A855F7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Priority Review
              </span>
            )}
          </div>
          <h1
            style={{
              margin: '0 0 6px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#F5E8D5',
            }}
          >
            {entry.full_name}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#6B6B6B' }}>
            Applied {new Date(entry.created_at).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <span
          style={{
            padding: '6px 16px',
            backgroundColor: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            color: statusStyle.text,
            textTransform: 'capitalize',
          }}
        >
          {entry.status}
        </span>
      </div>

      {/* Details Card */}
      <div
        style={{
          backgroundColor: '#141414',
          border: '1px solid #2A2A2A',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #2A2A2A',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Application Details
          </h2>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Field label="Full Name" value={entry.full_name} />
          <Field label="Email" value={entry.email} />
          <Field label="Mobile" value={entry.mobile} />
          <Field label="City" value={entry.city} />
          <Field label="State" value={entry.state} />
          <Field label="Education" value={entry.education ?? '—'} />
          <Field label="College / Institution" value={entry.college ?? '—'} />
          <Field label="Domain" value={entry.domain ?? '—'} />
          <Field label="Purpose" value={entry.purpose.charAt(0).toUpperCase() + entry.purpose.slice(1)} />
          <Field label="Referred By" value={entry.referred_by ?? '—'} />
          <Field label="Referral Code" value={entry.referral_code} mono />
        </div>
        {/* Skills */}
        {entry.skills && entry.skills.length > 0 && (
          <div style={{ padding: '0 20px 20px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {entry.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: '3px 10px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#B0A090',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Aspiration */}
        {entry.aspiration && (
          <div style={{ padding: '0 20px 20px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Aspiration</p>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: '#B0A090',
                lineHeight: 1.6,
                padding: '12px 16px',
                backgroundColor: '#1A1A1A',
                borderRadius: '6px',
                border: '1px solid #2A2A2A',
              }}
            >
              {entry.aspiration}
            </p>
          </div>
        )}
      </div>

      {/* Approval Info (if approved) */}
      {entry.status === 'approved' && (
        <div
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Approval Info
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Field label="Approved At" value={entry.reviewed_at ? new Date(entry.reviewed_at).toLocaleString('en-IN') : '—'} />
            <Field label="Invite Tokens" value={String(entry.invite_tokens)} />
            <Field label="Tokens Used" value={String(entry.tokens_used)} />
          </div>
        </div>
      )}

      {/* Rejection Notes (if rejected) */}
      {entry.status === 'rejected' && entry.review_notes && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Rejection Notes
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#B0A090', lineHeight: 1.6 }}>
            {entry.review_notes}
          </p>
        </div>
      )}

      {/* Actions (Approve / Reject) */}
      {entry.status === 'pending' && (
        <ApplicationActions id={entry.id} />
      )}
    </div>
  )
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <p
        style={{
          margin: '0 0 4px',
          fontSize: '11px',
          color: '#6B6B6B',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: '14px',
          color: '#F5E8D5',
          fontFamily: mono ? 'monospace' : 'inherit',
        }}
      >
        {value}
      </p>
    </div>
  )
}
