'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ApplicationActionsProps {
  id: string
}

export function ApplicationActions({ id }: ApplicationActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectNotes, setRejectNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleApprove() {
    setLoading('approve')
    setError(null)

    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? 'Approval failed')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  async function handleReject() {
    setLoading('reject')
    setError(null)

    try {
      const res = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, notes: rejectNotes }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? 'Rejection failed')
      }

      setShowRejectModal(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      {/* Action Buttons */}
      <div
        style={{
          backgroundColor: '#141414',
          border: '1px solid #2A2A2A',
          borderRadius: '10px',
          padding: '20px',
        }}
      >
        <h2
          style={{
            margin: '0 0 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#6B6B6B',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Review Decision
        </h2>

        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#FCA5A5',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            style={{
              padding: '10px 24px',
              backgroundColor: loading === 'approve' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#22C55E',
              cursor: loading !== null ? 'not-allowed' : 'pointer',
              opacity: loading !== null && loading !== 'approve' ? 0.5 : 1,
            }}
          >
            {loading === 'approve' ? 'Approving...' : '✓ Approve'}
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            disabled={loading !== null}
            style={{
              padding: '10px 24px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#EF4444',
              cursor: loading !== null ? 'not-allowed' : 'pointer',
              opacity: loading !== null ? 0.5 : 1,
            }}
          >
            ✕ Reject
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowRejectModal(false)
          }}
        >
          <div
            style={{
              backgroundColor: '#141414',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '28px',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            <h2
              style={{
                margin: '0 0 8px',
                fontSize: '18px',
                fontWeight: 700,
                color: '#F5E8D5',
              }}
            >
              Reject Application
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6B6B6B' }}>
              Optionally add a note explaining the rejection. This will be included in the email to the applicant.
            </p>

            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#F5E8D5',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: '20px',
              }}
            />

            {error && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#FCA5A5',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={loading === 'reject'}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#B0A090',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading === 'reject'}
                style={{
                  padding: '8px 18px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#EF4444',
                  cursor: loading === 'reject' ? 'not-allowed' : 'pointer',
                }}
              >
                {loading === 'reject' ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
