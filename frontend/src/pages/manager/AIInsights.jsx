import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart2,
  TrendingUp,
  Cpu,
  AlertTriangle,
  Brain,
  ShieldCheck,
  CheckCircle,
  Recycle,
  Trash2,
} from 'lucide-react';

function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)].join(', ');
}

// ─── Placeholder stat card ────────────────────────────────────────────────────
function StatCard({ label, value, accent, icon }) {
  return (
    <div
      style={{
        background: `rgba(${hexToRgb(accent)}, 0.08)`,
        border: `1px solid rgba(${hexToRgb(accent)}, 0.25)`,
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: accent }}>
        {icon}
        <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

// ─── Chart placeholder ────────────────────────────────────────────────────────
function ChartPlaceholder({ label, height = '140px' }) {
  return (
    <div
      style={{
        height,
        background: 'rgba(255,255,255,0.03)',
        border: '1px dashed rgba(255,255,255,0.12)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
      }}
    >
      <BarChart2 size={28} style={{ opacity: 0.3 }} />
      <span>{label}</span>
      <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>Data loads from backend aggregation</span>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon, children, accent = '#6366f1' }) {
  return (
    <div
      className="panel-card"
      style={{ marginBottom: '1.25rem', border: `1px solid rgba(${hexToRgb(accent)}, 0.2)` }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          paddingBottom: '0.7rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <span style={{ color: accent }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Placeholder AI prediction distribution ───────────────────────────────────
function AIPredictionRow({ label, value, color }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.45rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <span style={{ width: '100px', fontSize: '0.82rem', fontWeight: 600, color }}>{label}</span>
      <div
        style={{
          flex: 1,
          height: '6px',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ width: value, height: '100%', borderRadius: '4px', background: color }} />
      </div>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', width: '32px', textAlign: 'right' }}>—</span>
    </div>
  );
}

export const AIInsights = () => {
  const navigate = useNavigate();

  // All values will come from a backend aggregation endpoint in a later task
  const stats = {
    totalInspected: '—',
    normal: '—',
    reusable: '—',
    scrap: '—',
    aiSuggestedNormal: '—',
    aiSuggestedReusable: '—',
    aiSuggestedScrap: '—',
    managerOverrides: '—',
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          id="btn-insights-back"
          className="btn btn-secondary"
          onClick={() => navigate('/manager')}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Brain size={20} style={{ color: '#c084fc' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>AI Insights</h2>
        </div>
      </div>

      {/* Info banner */}
      <div
        style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '10px',
          padding: '0.85rem 1.1rem',
          marginBottom: '1.5rem',
          fontSize: '0.84rem',
          color: 'var(--text-muted)',
        }}
      >
        <strong style={{ color: '#6366f1' }}>ℹ Note:</strong> All statistics are calculated from MongoDB
        aggregation on the backend. Placeholder values (—) will be replaced once the backend insights API is
        implemented.
      </div>

      {/* ── Inspection overview ──────────────────────────────────────────── */}
      <Section title="Inspection Overview" icon={<Cpu size={16} />} accent="#6366f1">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <StatCard label="Total Inspected" value={stats.totalInspected} accent="#6366f1" icon={<Cpu size={14} />} />
          <StatCard label="Normal" value={stats.normal} accent="#34d399" icon={<CheckCircle size={14} />} />
          <StatCard label="Reusable" value={stats.reusable} accent="#f59e0b" icon={<Recycle size={14} />} />
          <StatCard label="Scrap" value={stats.scrap} accent="#f87171" icon={<Trash2 size={14} />} />
        </div>
      </Section>

      {/* ── Status distribution chart ────────────────────────────────────── */}
      <Section title="Status Distribution" icon={<BarChart2 size={16} />} accent="#34d399">
        <ChartPlaceholder label="Final Status Distribution Chart" height="160px" />
      </Section>

      {/* ── Defect trends by item type ───────────────────────────────────── */}
      <Section title="Defect Trends by Item Type" icon={<TrendingUp size={16} />} accent="#f59e0b">
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Item Type', 'Defect Count', 'Avg Confidence', 'Most Common Status'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.65rem 1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['PCB', 'IC', 'Connector', 'Cable'].map((type) => (
                <tr key={type} style={{ borderBottom: '1px solid var(--border-color)', opacity: 0.5 }}>
                  <td style={{ padding: '0.65rem 1rem', fontWeight: 700 }}>{type}</td>
                  <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>—</td>
                  <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>—</td>
                  <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '0.6rem 1rem', color: 'var(--text-muted)', fontSize: '0.77rem', borderTop: '1px solid var(--border-color)' }}>
            Rows will populate from backend aggregation
          </div>
        </div>
      </Section>

      {/* ── Common defect categories ─────────────────────────────────────── */}
      <Section title="Common Defect Categories" icon={<AlertTriangle size={16} />} accent="#f87171">
        <ChartPlaceholder label="Top Defect Categories (from AI descriptions)" height="130px" />
      </Section>

      {/* ── AI prediction statistics ─────────────────────────────────────── */}
      <Section title="AI Prediction Statistics" icon={<Brain size={16} />} accent="#c084fc">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 0.85rem' }}>
          Distribution of AI suggested statuses across all completed inspections.
        </p>
        <AIPredictionRow label="NORMAL" value="0%" color="#34d399" />
        <AIPredictionRow label="REUSABLE" value="0%" color="#f59e0b" />
        <AIPredictionRow label="SCRAP" value="0%" color="#f87171" />
        <div style={{ marginTop: '0.85rem' }}>
          <ChartPlaceholder label="AI Confidence Distribution" height="110px" />
        </div>
      </Section>

      {/* ── Manager overrides ────────────────────────────────────────────── */}
      <Section title="Manager Overrides" icon={<ShieldCheck size={16} />} accent="#22d3ee">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 0.85rem' }}>
          Compares AI suggested status vs manager final status to show override frequency.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
          <StatCard label="AI → Manager Overrides" value={stats.managerOverrides} accent="#22d3ee" icon={<ShieldCheck size={14} />} />
          <StatCard label="Override Rate" value="—%" accent="#6366f1" icon={<BarChart2 size={14} />} />
        </div>
        <ChartPlaceholder label="AI Suggested vs Manager Final Status" height="130px" />
      </Section>

      {/* ── Inventory status trends ──────────────────────────────────────── */}
      <Section title="Inventory Status Trends" icon={<TrendingUp size={16} />} accent="#34d399">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 0.85rem' }}>
          Historical trend of Normal, Reusable, and Scrap inventory counts over time.
        </p>
        <ChartPlaceholder label="Inventory Trend Line Chart" height="180px" />
      </Section>
    </div>
  );
};
