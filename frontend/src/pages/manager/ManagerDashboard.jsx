import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Cpu,
  Package,
  Recycle,
  Trash2,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight,
} from 'lucide-react';

// ─── Reusable stat card ───────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent, sub }) {
  return (
    <div
      className="panel-card"
      style={{
        background: `rgba(${hexToRgb(accent)}, 0.07)`,
        border: `1px solid rgba(${hexToRgb(accent)}, 0.25)`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: accent }}>
        {icon}
        <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>
      )}
    </div>
  );
}

// Hex → "r, g, b" for rgba()
function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
  ].join(', ');
}

// ─── Placeholder data (will be replaced by API response in a later task) ─────
const PLACEHOLDER_STATS = {
  inventory: {
    total: '—',
    normal: '—',
    reusable: '—',
    scrap: '—',
  },
  requests: {
    pending: '—',
    approved: '—',
    rejected: '—',
  },
};

const PLACEHOLDER_ACTIVITY = [
  { id: 'REQ-0001', employee: 'Loading…', item: '—', status: 'PENDING_MANAGER_REVIEW', ai: 'COMPLETED', time: '—' },
  { id: 'REQ-0002', employee: 'Loading…', item: '—', status: 'APPROVED', ai: 'COMPLETED', time: '—' },
];

// Status chip colour map
const STATUS_COLORS = {
  PENDING_MANAGER_REVIEW: '#f59e0b',
  APPROVED: '#34d399',
  REJECTED: '#f87171',
  AI_FAILED: '#f87171',
};

export const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // In a later task these will come from an API call
  const stats = PLACEHOLDER_STATS;
  const recentActivity = PLACEHOLDER_ACTIVITY;

  return (
    <div className="dashboard-container">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div className="brand-badge" style={{ background: 'rgba(192,132,252,0.15)' }}>
          <Cpu size={22} style={{ color: '#c084fc' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>ScrapSense</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Manager Dashboard
          </p>
        </div>
      </div>

      {/* ── Welcome ──────────────────────────────────────────────────────── */}
      <div className="panel-card" style={{ marginBottom: '1.75rem', padding: '1.1rem 1.4rem' }}>
        <p style={{ margin: 0, fontSize: '1rem' }}>
          👋 Welcome,{' '}
          <strong style={{ color: '#c084fc' }}>{user?.name ?? 'Manager'}</strong>
        </p>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
          Review inspection requests, monitor inventory, and track AI analysis outcomes.
        </p>
      </div>

      {/* ── Inventory stats ───────────────────────────────────────────────── */}
      <div className="section-header" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} style={{ color: '#34d399' }} />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Inventory Overview</h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Data will load from backend
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <StatCard icon={<Package size={16} />} label="Total" value={stats.inventory.total} accent="#6366f1" sub="Physical units" />
        <StatCard icon={<CheckCircle size={16} />} label="Normal" value={stats.inventory.normal} accent="#34d399" sub="Ready to use" />
        <StatCard icon={<Recycle size={16} />} label="Reusable" value={stats.inventory.reusable} accent="#f59e0b" sub="Repairable" />
        <StatCard icon={<Trash2 size={16} />} label="Scrap" value={stats.inventory.scrap} accent="#f87171" sub="Disposed" />
      </div>

      {/* ── Request stats ─────────────────────────────────────────────────── */}
      <div className="section-header" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardList size={16} style={{ color: '#f59e0b' }} />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Inspection Requests</h2>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <StatCard icon={<Clock size={16} />} label="Pending" value={stats.requests.pending} accent="#f59e0b" sub="Awaiting review" />
        <StatCard icon={<CheckCircle size={16} />} label="Approved" value={stats.requests.approved} accent="#34d399" sub="Confirmed" />
        <StatCard icon={<XCircle size={16} />} label="Rejected" value={stats.requests.rejected} accent="#f87171" sub="Declined" />
      </div>

      {/* ── Recent activity ───────────────────────────────────────────────── */}
      <div className="section-header" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={16} style={{ color: '#22d3ee' }} />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Recent Inspection Activity</h2>
        </div>
        <button
          id="btn-view-all-requests"
          className="btn btn-secondary"
          onClick={() => navigate('/manager/review')}
          style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
        >
          <span>View All</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Request ID', 'Employee', 'Item', 'AI Status', 'Request Status', ''].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: '1px solid var(--border-color)', opacity: 0.6 }}
                >
                  <td style={{ padding: '0.7rem 1rem', fontWeight: 700, color: 'var(--text-subtle)' }}>
                    {row.id}
                  </td>
                  <td style={{ padding: '0.7rem 1rem' }}>{row.employee}</td>
                  <td style={{ padding: '0.7rem 1rem' }}>{row.item}</td>
                  <td style={{ padding: '0.7rem 1rem' }}>
                    <span
                      className="role-pill"
                      style={{
                        fontSize: '0.7rem',
                        background: row.ai === 'COMPLETED' ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
                        color: row.ai === 'COMPLETED' ? '#34d399' : '#f87171',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '6px',
                      }}
                    >
                      {row.ai}
                    </span>
                  </td>
                  <td style={{ padding: '0.7rem 1rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        background: `rgba(${hexToRgb(STATUS_COLORS[row.status] || '#6366f1')}, 0.15)`,
                        color: STATUS_COLORS[row.status] || '#6366f1',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}
                    >
                      {row.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.7rem 1rem' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/manager/requests/${row.id}`)}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inventory distribution placeholder chart area */}
        <div
          style={{
            padding: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <TrendingUp size={18} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Inventory distribution chart will be rendered here when backend data is available.
          </span>
        </div>
      </div>
    </div>
  );
};
