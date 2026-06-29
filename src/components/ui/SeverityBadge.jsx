export default function SeverityBadge({ severity, size = 'sm' }) {
  const s = severity?.toLowerCase();
  const classMap = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
    info: 'badge-info',
    normal: 'badge-info',
  };
  return (
    <span className={classMap[s] || 'badge-info'}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = status?.toLowerCase();
  const styles = {
    open: { bg: 'rgba(255,51,102,0.12)', color: '#ff3366', border: 'rgba(255,51,102,0.3)' },
    'in progress': { bg: 'rgba(255,184,0,0.12)', color: '#ffb800', border: 'rgba(255,184,0,0.3)' },
    investigating: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', border: 'rgba(168,85,247,0.3)' },
    resolved: { bg: 'rgba(0,255,136,0.12)', color: '#00ff88', border: 'rgba(0,255,136,0.3)' },
    escalated: { bg: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: 'rgba(0,212,255,0.3)' },
    'false positive': { bg: 'rgba(100,116,139,0.12)', color: '#64748b', border: 'rgba(100,116,139,0.3)' },
    active: { bg: 'rgba(0,255,136,0.12)', color: '#00ff88', border: 'rgba(0,255,136,0.3)' },
    pending: { bg: 'rgba(255,184,0,0.12)', color: '#ffb800', border: 'rgba(255,184,0,0.3)' },
    applied: { bg: 'rgba(0,255,136,0.12)', color: '#00ff88', border: 'rgba(0,255,136,0.3)' },
    final: { bg: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: 'rgba(0,212,255,0.3)' },
  };
  const style = styles[s] || styles.open;
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
    >
      {status}
    </span>
  );
}
