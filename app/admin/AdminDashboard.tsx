'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { WaitlistEntry } from '@/lib/types'

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected' | 'priority'

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
  priority: number
}

interface AdminDashboardProps {
  applications: WaitlistEntry[]
  stats: Stats
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(234, 179, 8, 0.15)', text: '#EAB308' },
  approved: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22C55E' },
  rejected: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' },
}

export function AdminDashboard({ applications, stats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = applications

    // Tab filter
    if (activeTab === 'priority') {
      list = list.filter((a) => a.is_priority_review && a.status === 'pending')
    } else if (activeTab !== 'all') {
      list = list.filter((a) => a.status === activeTab)
    }

    // Search filter
    const q = search.toLowerCase().trim()
    if (q) {
      list = list.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.mobile.includes(q)
      )
    }

    return list
  }, [applications, activeTab, search])

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'approved', label: 'Approved', count: stats.approved },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
    { key: 'priority', label: 'Priority Review', count: stats.priority },
  ]

  return (
    <div>
      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatCard label="Total Signups" value={stats.total} color="#E8540A" />
        <StatCard label="Pending Review" value={stats.pending} color="#EAB308" />
        <StatCard label="Approved" value={stats.approved} color="#22C55E" />
        <StatCard label="Priority Review" value={stats.priority} color="#A855F7" />
      </div>

      {/* Filter Tabs + Search */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: activeTab === tab.key ? '#E8540A' : '#2A2A2A',
                backgroundColor: activeTab === tab.key ? 'rgba(232, 84, 10, 0.1)' : '#1A1A1A',
                color: activeTab === tab.key ? '#E8540A' : '#B0A090',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {tab.label}
              <span
                style={{
                  marginLeft: '6px',
                  fontSize: '11px',
                  opacity: 0.7,
                }}
              >
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search name, email, mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            height: '36px',
            padding: '0 12px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#F5E8D5',
            outline: 'none',
            width: '260px',
            maxWidth: '100%',
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#141414',
          border: '1px solid #2A2A2A',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
                {['#', 'Name', 'Email', 'Mobile', 'City', 'Purpose', 'Status', 'Applied'].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#6B6B6B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: '48px 16px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#4A4A4A',
                    }}
                  >
                    No applications found
                  </td>
                </tr>
              ) : (
                filtered.map((app, idx) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? '1px solid #1E1E1E' : 'none',
                      transition: 'background-color 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#1A1A1A'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <Link
                        href={`/admin/applications/${app.id}`}
                        style={{ textDecoration: 'none', display: 'block' }}
                      >
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#E8540A',
                          }}
                        >
                          #{app.display_number}
                        </span>
                        {app.is_priority_review && (
                          <span
                            style={{
                              marginLeft: '6px',
                              fontSize: '10px',
                              color: '#A855F7',
                            }}
                          >
                            ★
                          </span>
                        )}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link
                        href={`/admin/applications/${app.id}`}
                        style={{ textDecoration: 'none', display: 'block' }}
                      >
                        <span style={{ fontSize: '14px', color: '#F5E8D5', fontWeight: 500 }}>
                          {app.full_name}
                        </span>
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '13px', color: '#B0A090' }}>{app.email}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '13px', color: '#B0A090' }}>{app.mobile}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '13px', color: '#B0A090' }}>{app.city}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#1A1A1A',
                          color: '#B0A090',
                          textTransform: 'capitalize',
                        }}
                      >
                        {app.purpose}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          padding: '3px 10px',
                          borderRadius: '4px',
                          backgroundColor: STATUS_COLORS[app.status]?.bg ?? '#1A1A1A',
                          color: STATUS_COLORS[app.status]?.text ?? '#B0A090',
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                        {new Date(app.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ marginTop: '12px', fontSize: '12px', color: '#4A4A4A' }}>
        Showing {filtered.length} of {stats.total} applications
      </p>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        backgroundColor: '#141414',
        border: '1px solid #2A2A2A',
        borderRadius: '10px',
        padding: '20px 24px',
      }}
    >
      <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: '32px', fontWeight: 700, color }}>
        {value}
      </p>
    </div>
  )
}
