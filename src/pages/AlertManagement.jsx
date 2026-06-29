import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, Search, Filter, Eye, Check, AlertTriangle, X, ChevronDown, Download } from 'lucide-react';
import { mockAlerts, alertSummary, alertTrend } from '../data/mockAlerts';
import SeverityBadge, { StatusBadge } from '../components/ui/SeverityBadge';
import Modal from '../components/ui/Modal';

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['All', 'Open', 'In Progress', 'Investigating', 'Resolved', 'Escalated', 'False Positive'];
const PAGE_SIZE = 20;

export default function AlertManagement() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [alerts, setAlerts] = useState(mockAlerts);

  const filtered = alerts.filter(a => {
    if (severity !== 'All' && a.severity !== severity) return false;
    if (status !== 'All' && a.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.id.toLowerCase().includes(q) || a.attackType.toLowerCase().includes(q) || a.sourceIp.includes(q);
    }
    return true;
  });

  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const bulkAction = (newStatus) => {
    setAlerts(prev => prev.map(a => selectedIds.has(a.id) ? { ...a, status: newStatus } : a));
    setSelectedIds(new Set());
  };

  const trendLast7 = alertTrend.slice(-7);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Alert Management</h2>
          <p className="text-sm text-text-muted">Monitor and manage all security incidents</p>
        </div>
        <button className="btn-ghost flex items-center gap-2 text-sm">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Total', val: alertSummary.total, color: '#00d4ff' },
          { label: 'Open', val: alertSummary.open, color: '#ff3366' },
          { label: 'Critical', val: alertSummary.critical, color: '#ff3366' },
          { label: 'In Progress', val: alertSummary.inProgress, color: '#ffb800' },
          { label: 'Resolved', val: alertSummary.resolved, color: '#00ff88' },
          { label: 'Escalated', val: alertSummary.escalated, color: '#a855f7' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass-card p-3 text-center" style={{ border: `1px solid ${color}22` }}>
            <p className="text-2xl font-bold" style={{ color }}>{val}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Alert volume chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Alert Volume — Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={trendLast7}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#111e35', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="critical" name="Critical" fill="#ff3366" stackId="a" />
            <Bar dataKey="high" name="High" fill="#ffb800" stackId="a" />
            <Bar dataKey="medium" name="Medium" fill="#a855f7" stackId="a" />
            <Bar dataKey="low" name="Low" fill="#00d4ff" stackId="a" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
          <input type="text" placeholder="Search alerts, IPs, attack types..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} className="input-dark pl-9" />
        </div>
        <div className="relative">
          <select value={severity} onChange={e => { setSeverity(e.target.value); setPage(0); }}
            className="input-dark pr-8 appearance-none cursor-pointer" style={{ minWidth: 130 }}>
            {SEVERITIES.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#64748b' }} />
        </div>
        <div className="relative">
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}
            className="input-dark pr-8 appearance-none cursor-pointer" style={{ minWidth: 150 }}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#64748b' }} />
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{selectedIds.size} selected</span>
            <button onClick={() => bulkAction('Resolved')} className="btn-ghost text-xs px-2 py-1">
              <Check size={12} className="inline mr-1" />Resolve
            </button>
            <button onClick={() => bulkAction('Escalated')} className="text-xs px-2 py-1 rounded transition-colors"
              style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
              Escalate
            </button>
          </div>
        )}
        <span className="text-xs text-text-muted self-center ml-auto">{filtered.length} alerts</span>
      </div>

      {/* Alert table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '440px' }}>
          <table className="data-table">
            <thead className="sticky top-0 z-10">
              <tr>
                <th><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? new Set(pageData.map(a => a.id)) : new Set())} /></th>
                <th>Alert ID</th>
                <th>Severity</th>
                <th>Attack Type</th>
                <th>Source IP</th>
                <th>Target Asset</th>
                <th>MITRE</th>
                <th>Confidence</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Analyst</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((alert, i) => (
                <tr key={alert.id} style={{ animation: `fadeIn 0.15s ease-out ${i * 0.01}s both` }}>
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.has(alert.id)} onChange={() => toggleSelect(alert.id)} />
                  </td>
                  <td><span className="font-mono text-xs" style={{ color: '#00d4ff' }}>{alert.id}</span></td>
                  <td><SeverityBadge severity={alert.severity} /></td>
                  <td><span className="text-xs font-medium text-text-primary">{alert.attackType}</span></td>
                  <td><span className="font-mono text-xs text-text-muted">{alert.sourceIp}</span></td>
                  <td><span className="text-xs text-text-secondary">{alert.targetAsset}</span></td>
                  <td><span className="font-mono text-xs" style={{ color: '#a855f7' }}>{alert.mitre}</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="w-14 h-1.5 rounded-full" style={{ background: '#1e3a5f' }}>
                        <div className="h-full rounded-full" style={{ width: `${alert.confidenceScore}%`, background: alert.confidenceScore >= 90 ? '#ff3366' : '#ffb800' }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>{alert.confidenceScore}%</span>
                    </div>
                  </td>
                  <td><span className="font-mono text-xs text-text-muted">{formatTime(alert.timestamp)}</span></td>
                  <td><StatusBadge status={alert.status} /></td>
                  <td><span className="text-xs text-text-secondary">{alert.analyst}</span></td>
                  <td>
                    <button onClick={() => setSelected(alert)} className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ color: '#475569' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-text-muted">Page {page + 1} of {totalPages}</span>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40">Prev</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {/* Alert detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Alert — ${selected?.id}`} width="780px">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Alert ID', selected.id], ['Severity', selected.severity],
                ['Attack Type', selected.attackType], ['Status', selected.status],
                ['Source IP', selected.sourceIp], ['Target Asset', selected.targetAsset],
                ['MITRE Technique', selected.mitre], ['Confidence', `${selected.confidenceScore}%`],
                ['Analyst', selected.analyst], ['Systems Affected', selected.affectedSystems],
                ['Related Logs', selected.relatedLogs], ['First Seen', formatTime(selected.firstSeen)],
              ].map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                  <p className="text-xs text-text-muted mb-0.5">{k}</p>
                  <p className="text-sm font-medium text-text-primary">{v}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#060e1c', border: '1px solid #1e3a5f' }}>
              <p className="text-xs text-text-muted mb-1.5">Description</p>
              <p className="text-sm text-text-primary">{selected.description}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary text-sm flex-1">Investigate</button>
              <button className="btn-ghost text-sm flex-1">Escalate</button>
              <button className="btn-ghost text-sm flex-1" style={{ color: '#00ff88', borderColor: 'rgba(0,255,136,0.3)' }}>Resolve</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
