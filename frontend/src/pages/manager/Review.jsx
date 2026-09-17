import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardList,
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Status config
const STATUS_META = {
  PENDING_MANAGER_REVIEW: { label: 'Pending Review', color: '#f59e0b', icon: <Clock size={12} /> },
  APPROVED: { label: 'Approved', color: '#34d399', icon: <CheckCircle size={12} /> },
  REJECTED: { label: 'Rejected', color: '#f87171', icon: <XCircle size={12} /> },
  AI_FAILED: { label: 'AI Failed', color: '#f87171', icon: <XCircle size={12} /> },
};

const AI_STATUS_COLORS = {
  PROCESSING: '#f59e0b',
  COMPLETED: '#34d399',
  FAILED: '#f87171',
};

const SUGGESTED_COLORS = {
  NORMAL: '#34d399',
  REUSABLE: '#f59e0b',
  SCRAP: '#f87171',
};

function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)].join(', ');
}

// ─── Placeholder empty state ──────────────────────────────────────────────────
function EmptyState() {
  return (
    <tr>
      <td colSpan={9} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
        <ClipboardList size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 0.75rem' }} />
        <p style={{ margin: 0 }}>No inspection requests yet.</p>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
          Requests will appear here once employees submit inspections.
        </p>
      </td>
    </tr>
  );
}

export const Review = () => {
  const navigate = useNavigate();

  // Filter state — will drive API query parameters in a later task
  const [filters, setFilters] = useState({
    requestStatus: '',
    itemType: '',
    finalStatus: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  });

  // In a later task, requests will come from an API call
  const requests = []; // empty until backend is wired

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () =>
    setFilters({ requestStatus: '', itemType: '', finalStatus: '', dateFrom: '', dateTo: '', search: '' });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          id="btn-review-back"
          className="btn btn-secondary"
          onClick={() => navigate('/manager')}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardList size={20} style={{ color: '#f59e0b' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Inspection Requests</h2>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <div
        className="panel-card"
        style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filters</span>
          <button
            id="btn-clear-filters"
            className="btn btn-secondary"
            onClick={clearFilters}
            style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
          >
            Clear
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="filter-search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Request ID / Employee…"
              style={{
                width: '100%',
                paddingLeft: '2rem',
                paddingRight: '0.75rem',
                paddingTop: '0.45rem',
                paddingBottom: '0.45rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'inherit',
                fontSize: '0.84rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Request Status */}
          <select
            id="filter-request-status"
            name="requestStatus"
            value={filters.requestStatus}
            onChange={handleFilterChange}
            style={{ padding: '0.45rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'inherit', fontSize: '0.84rem' }}
          >
            <option value="">All Statuses</option>
            <option value="PENDING_MANAGER_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="AI_FAILED">AI Failed</option>
          </select>

          {/* Item Type */}
          <input
            id="filter-item-type"
            name="itemType"
            value={filters.itemType}
            onChange={handleFilterChange}
            placeholder="Item Type (e.g. PCB)"
            style={{ padding: '0.45rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'inherit', fontSize: '0.84rem' }}
          />

          {/* Final Status */}
          <select
            id="filter-final-status"
            name="finalStatus"
            value={filters.finalStatus}
            onChange={handleFilterChange}
            style={{ padding: '0.45rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'inherit', fontSize: '0.84rem' }}
          >
            <option value="">All Final Statuses</option>
            <option value="NORMAL">NORMAL</option>
            <option value="REUSABLE">REUSABLE</option>
            <option value="SCRAP">SCRAP</option>
          </select>

          {/* Date from */}
          <input
            id="filter-date-from"
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            style={{ padding: '0.45rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'inherit', fontSize: '0.84rem' }}
          />

          {/* Date to */}
          <input
            id="filter-date-to"
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            style={{ padding: '0.45rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'inherit', fontSize: '0.84rem' }}
          />
        </div>
      </div>

      {/* ── Requests table ───────────────────────────────────────────────── */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {[
                  'Request ID',
                  'Employee',
                  'Item ID',
                  'Item Type',
                  'Qty',
                  'AI Status',
                  'AI Suggested',
                  'Request Status',
                  'Created At',
                  'Action',
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <EmptyState />
              ) : (
                requests.map((req) => {
                  const sm = STATUS_META[req.requestStatus] || {};
                  return (
                    <tr key={req.requestId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 700 }}>{req.requestId}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{req.employeeName}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{req.itemId}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{req.itemType}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{req.quantity}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        <Chip label={req.aiStatus} color={AI_STATUS_COLORS[req.aiStatus]} />
                      </td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        {req.aiPrediction?.suggestedStatus ? (
                          <Chip label={req.aiPrediction.suggestedStatus} color={SUGGESTED_COLORS[req.aiPrediction.suggestedStatus]} />
                        ) : '—'}
                      </td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        <Chip label={sm.label || req.requestStatus} color={sm.color || '#6366f1'} />
                      </td>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        <button
                          id={`btn-view-request-${req.requestId}`}
                          className="btn btn-secondary"
                          onClick={() => navigate(`/manager/requests/${req.requestId}`)}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <span>Review</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function Chip({ label, color }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.7rem',
        fontWeight: 600,
        padding: '0.15rem 0.55rem',
        borderRadius: '6px',
        background: `rgba(${hexToRgb(color)}, 0.15)`,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
