import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Package,
  AlertTriangle,
  Brain,
  ShieldCheck,
  MessageSquare,
  CheckCircle,
  XCircle,
  Recycle,
  Trash2,
} from 'lucide-react';

function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)].join(', ');
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon, children, accent = '#6366f1' }) {
  return (
    <div
      className="panel-card"
      style={{
        marginBottom: '1rem',
        border: `1px solid rgba(${hexToRgb(accent)}, 0.2)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
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

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '0.35rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        gap: '1rem',
      }}
    >
      <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', flexShrink: 0 }}>{label}</span>
      <span
        style={{
          fontSize: '0.84rem',
          fontWeight: 600,
          textAlign: 'right',
          fontFamily: mono ? 'monospace' : 'inherit',
          wordBreak: 'break-all',
        }}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}

// ─── AI analysis sub-section ──────────────────────────────────────────────────
function AISection({ title, result, confidence, explanation, resultColors }) {
  const color = resultColors?.[result] || '#6366f1';
  return (
    <div
      style={{
        background: `rgba(${hexToRgb(color)}, 0.06)`,
        border: `1px solid rgba(${hexToRgb(color)}, 0.2)`,
        borderRadius: '10px',
        padding: '0.9rem 1rem',
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.3rem 1rem', fontSize: '0.82rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Result</span>
        <span
          style={{
            fontWeight: 700,
            color,
          }}
        >
          {result || '—'}
        </span>
        {confidence !== undefined && (
          <>
            <span style={{ color: 'var(--text-muted)' }}>Confidence</span>
            <span>
              {confidence !== null ? `${Math.round(confidence * 100)}%` : '—'}
            </span>
          </>
        )}
        <span style={{ color: 'var(--text-muted)', alignSelf: 'flex-start' }}>Explanation</span>
        <span style={{ color: 'var(--text-muted)', fontStyle: explanation ? 'normal' : 'italic' }}>
          {explanation || 'No explanation provided'}
        </span>
      </div>
    </div>
  );
}

// ─── Status button ────────────────────────────────────────────────────────────
function StatusButton({ label, value, selected, color, icon, onClick }) {
  return (
    <button
      id={`btn-final-status-${value}`}
      onClick={() => onClick(value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.55rem 1rem',
        borderRadius: '8px',
        border: `2px solid ${selected ? color : 'rgba(255,255,255,0.1)'}`,
        background: selected ? `rgba(${hexToRgb(color)}, 0.15)` : 'rgba(255,255,255,0.04)',
        color: selected ? color : 'var(--text-muted)',
        fontWeight: 700,
        fontSize: '0.88rem',
        cursor: 'pointer',
        transition: 'all 0.15s',
        flex: 1,
        justifyContent: 'center',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Placeholder request shape (replaced by API in a later task) ──────────────
const PLACEHOLDER_REQUEST = null;

export const RequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  // In a later task, this will be populated by: useEffect(() => fetchRequest(requestId), [requestId])
  const request = PLACEHOLDER_REQUEST;

  const [finalStatus, setFinalStatus] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!finalStatus) return;
    // In a later task, this will call PATCH /api/manager/requests/:requestId/review
    setSubmitting(true);
    console.log('Manager decision:', { finalStatus, comments, requestId });
    setTimeout(() => {
      setSubmitting(false);
      alert('Manager review API will be connected in a later task.');
    }, 500);
  };

  // ── Placeholder UI when no request is loaded yet ──────────────────────────
  const placeholderBanner = (
    <div
      style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '0.85rem 1.1rem',
        marginBottom: '1.25rem',
        fontSize: '0.84rem',
        color: '#f59e0b',
      }}
    >
      ⚠ Viewing layout placeholder for request <strong>{requestId}</strong>. Real data will load once the backend
      review API is implemented.
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          id="btn-back-to-review"
          className="btn btn-secondary"
          onClick={() => navigate('/manager/review')}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: '#f59e0b' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
            Request Details — {requestId}
          </h2>
        </div>
      </div>

      {!request && placeholderBanner}

      {/* ── Employee information ────────────────────────────────────────── */}
      <Section title="Employee Information" icon={<User size={16} />} accent="#22d3ee">
        <InfoRow label="Employee Name" value={request?.employeeName} />
        <InfoRow label="Employee ID" value={request?.employeeId} mono />
      </Section>

      {/* ── Item information ────────────────────────────────────────────── */}
      <Section title="Item Information" icon={<Package size={16} />} accent="#6366f1">
        <InfoRow label="Item ID" value={request?.itemId} mono />
        <InfoRow label="Item Type" value={request?.itemType} />
        <InfoRow label="Quantity" value={request?.quantity} />
      </Section>

      {/* ── Defect description ──────────────────────────────────────────── */}
      <Section title="Defect Report" icon={<AlertTriangle size={16} />} accent="#f59e0b">
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.85rem',
            color: request?.defectDescription ? 'inherit' : 'var(--text-muted)',
            fontStyle: request?.defectDescription ? 'normal' : 'italic',
            minHeight: '3rem',
          }}
        >
          {request?.defectDescription || 'No defect description available.'}
        </div>
      </Section>

      {/* ── AI analysis ─────────────────────────────────────────────────── */}
      <Section title="AI Analysis" icon={<Brain size={16} />} accent="#c084fc">
        <AISection
          title="Damage Detection"
          result={request?.aiPrediction?.damageDetection?.result}
          confidence={request?.aiPrediction?.damageDetection?.confidence}
          explanation={request?.aiPrediction?.damageDetection?.explanation}
          resultColors={{ DAMAGED: '#f87171', NOT_DAMAGED: '#34d399', UNCERTAIN: '#f59e0b' }}
        />
        <AISection
          title="Material Validation"
          result={request?.aiPrediction?.materialValidation?.result}
          confidence={request?.aiPrediction?.materialValidation?.confidence}
          explanation={request?.aiPrediction?.materialValidation?.explanation}
          resultColors={{ CONSISTENT: '#34d399', INCONSISTENT: '#f87171', UNCERTAIN: '#f59e0b' }}
        />
        <AISection
          title="Reason Consistency"
          result={request?.aiPrediction?.reasonConsistency?.result}
          confidence={request?.aiPrediction?.reasonConsistency?.confidence}
          explanation={request?.aiPrediction?.reasonConsistency?.explanation}
          resultColors={{ CONSISTENT: '#34d399', INCONSISTENT: '#f87171', UNCERTAIN: '#f59e0b' }}
        />

        {/* AI suggested status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: 'rgba(192, 132, 252, 0.08)',
            border: '1px solid rgba(192, 132, 252, 0.2)',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI Suggested Status</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.95rem',
              color:
                request?.aiPrediction?.suggestedStatus === 'SCRAP'
                  ? '#f87171'
                  : request?.aiPrediction?.suggestedStatus === 'REUSABLE'
                  ? '#f59e0b'
                  : '#34d399',
            }}
          >
            {request?.aiPrediction?.suggestedStatus ?? '—'}
          </span>
        </div>
      </Section>

      {/* ── Manager decision ────────────────────────────────────────────── */}
      <Section title="Manager Decision" icon={<ShieldCheck size={16} />} accent="#34d399">
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            margin: '0 0 1rem',
            lineHeight: 1.5,
          }}
        >
          You must explicitly choose the final inventory status. The AI recommendation does{' '}
          <strong>not</strong> automatically become the final status.
        </p>

        {/* Status selector */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
          <StatusButton
            label="NORMAL"
            value="NORMAL"
            selected={finalStatus === 'NORMAL'}
            color="#34d399"
            icon={<CheckCircle size={15} />}
            onClick={setFinalStatus}
          />
          <StatusButton
            label="REUSABLE"
            value="REUSABLE"
            selected={finalStatus === 'REUSABLE'}
            color="#f59e0b"
            icon={<Recycle size={15} />}
            onClick={setFinalStatus}
          />
          <StatusButton
            label="SCRAP"
            value="SCRAP"
            selected={finalStatus === 'SCRAP'}
            color="#f87171"
            icon={<Trash2 size={15} />}
            onClick={setFinalStatus}
          />
        </div>

        {/* Comments */}
        <div style={{ marginBottom: '1.1rem' }}>
          <label
            htmlFor="manager-comments"
            style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}
          >
            <MessageSquare size={14} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
            Manager Comments
          </label>
          <textarea
            id="manager-comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments or reasoning for your decision…"
            rows={4}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'inherit',
              fontSize: '0.84rem',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Confirm */}
        <button
          id="btn-confirm-decision"
          onClick={handleConfirm}
          disabled={!finalStatus || submitting}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '0.7rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            opacity: !finalStatus || submitting ? 0.5 : 1,
            cursor: !finalStatus || submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Submitting…' : 'Confirm Decision'}
        </button>

        {!finalStatus && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'center' }}>
            Select a final status above to enable submission.
          </p>
        )}
      </Section>
    </div>
  );
};
