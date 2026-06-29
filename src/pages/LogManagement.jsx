import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Search, Download, RefreshCw, Filter, Eye, X, ChevronDown } from 'lucide-react';
import { mockLogs, logStats, logTrendData } from '../data/mockLogs';
import SeverityBadge from '../components/ui/SeverityBadge';
import Modal from '../components/ui/Modal';

const SOURCES = ['All Sources', 'Apache Server', 'Nginx Server', 'Windows Auth', 'Cisco Firewall', 'AWS CloudTrail', 'MySQL DB', 'IDS/IPS'];
const SEVERITIES = ['All', 'critical', 'high', 'medium', 'low', 'info'];
const PAGE_SIZE = 25;

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export default function LogManagement() {
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('All Sources');
  const [severity, setSeverity] = useState('All');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [liveLogs, setLiveLogs] = useState(mockLogs);

  // Real-time log streaming simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const sources = ['Apache Server', 'Nginx Server', 'Cisco Firewall'];
      const messages = [
        'New connection established from 203.0.113.15',
        'Failed authentication attempt detected',
        'Firewall rule triggered — blocked TCP/22',
        'Anomalous traffic pattern detected',
      ];
      const sevs = ['critical', 'high', 'medium', 'low', 'info'];
      const newLog = {
        id: `LOG-${String(Date.now()).slice(-6)}`,
        timestamp: new Date().toISOString(),
        source: sources[Math.floor(Math.random() * sources.length)],
        severity: sevs[Math.floor(Math.random() * sevs.length)],
        type: 'Network',
        message: messages[Math.floor(Math.random() * messages.length)],
        sourceIp: `10.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        destIp: '192.168.1.1',
        port: Math.floor(Math.random() * 65535),
        protocol: 'TCP',
        rawLog: `[LIVE] ${new Date().toISOString()} — ${messages[0]}`,
      };
      setLiveLogs(prev => [newLog, ...prev.slice(0, 499)]);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filtered = liveLogs.filter(l => {
    if (source !== 'All Sources' && l.source !== source) return false;
    if (severity !== 'All' && l.severity !== severity) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.message.toLowerCase().includes(q) || l.sourceIp.includes(q) || l.id.toLowerCase().includes(q);
    }
    return true;
  });

  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleExport = () => {
    const csv = ['ID,Timestamp,Source,Severity,Type,Message,SourceIP,Protocol']
      .concat(filtered.slice(0, 500).map(l =>
        `${l.id},${l.timestamp},${l.source},${l.severity},${l.type},"${l.message}",${l.sourceIp},${l.protocol}`
      )).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'soc_logs.csv'; a.click();
  };

  const sevColor = { critical: '#ff3366', high: '#ffb800', medium: '#a855f7', low: '#00d4ff', info: '#64748b' };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Log Management</h2>
          <p className="text-sm text-text-muted">Real-time security event log analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded"
            style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88' }}>
            <span className="status-dot online animate-pulse-slow" />
            Streaming
          </span>
          <button className="btn-ghost flex items-center gap-2" onClick={handleExport}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(logStats.bySeverity).map(([sev, count]) => (
          <div key={sev} className="glass-card p-3 text-center"
            style={{ border: `1px solid ${sevColor[sev]}22` }}>
            <p className="text-2xl font-bold" style={{ color: sevColor[sev] }}>{count}</p>
            <p className="text-xs capitalize mt-0.5" style={{ color: '#64748b' }}>{sev}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Log Volume by Hour (24h)</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={logTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#111e35', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="critical" stackId="a" fill="#ff3366" radius={[0,0,0,0]} />
            <Bar dataKey="high" stackId="a" fill="#ffb800" />
            <Bar dataKey="medium" stackId="a" fill="#a855f7" />
            <Bar dataKey="low" stackId="a" fill="#00d4ff" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-48 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search logs, IPs, message..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="input-dark pl-9"
            />
          </div>
          {/* Source filter */}
          <div className="relative">
            <select
              value={source}
              onChange={e => { setSource(e.target.value); setPage(0); }}
              className="input-dark pr-8 appearance-none cursor-pointer"
              style={{ minWidth: 160 }}
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#64748b' }} />
          </div>
          {/* Severity filter */}
          <div className="flex gap-1">
            {SEVERITIES.map(s => (
              <button key={s}
                onClick={() => { setSeverity(s); setPage(0); }}
                className="px-3 py-1.5 rounded text-xs font-medium transition-all capitalize"
                style={{
                  background: severity === s ? (sevColor[s] ? `${sevColor[s]}22` : 'rgba(0,212,255,0.15)') : 'rgba(255,255,255,0.03)',
                  color: severity === s ? (sevColor[s] || '#00d4ff') : '#64748b',
                  border: `1px solid ${severity === s ? (sevColor[s] ? `${sevColor[s]}44` : '#00d4ff44') : '#1e3a5f'}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Results count */}
          <span className="text-xs text-text-muted self-center ml-auto">
            {filtered.length.toLocaleString()} results
          </span>
        </div>
      </div>

      {/* Log table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '420px' }}>
          <table className="data-table">
            <thead className="sticky top-0 z-10">
              <tr>
                <th>ID</th>
                <th>Timestamp</th>
                <th>Source</th>
                <th>Severity</th>
                <th>Type</th>
                <th>Message</th>
                <th>Source IP</th>
                <th>Protocol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((log, i) => (
                <tr key={log.id} style={{ animation: `fadeIn 0.15s ease-out ${i * 0.01}s both` }}>
                  <td><span className="font-mono text-xs" style={{ color: '#00d4ff' }}>{log.id}</span></td>
                  <td><span className="font-mono text-xs text-text-muted">{formatTime(log.timestamp)}</span></td>
                  <td><span className="text-xs text-text-secondary">{log.source}</span></td>
                  <td><SeverityBadge severity={log.severity} /></td>
                  <td><span className="text-xs text-text-muted">{log.type}</span></td>
                  <td><span className="text-xs text-text-primary truncate" style={{ maxWidth: 280, display: 'block' }}>{log.message}</span></td>
                  <td><span className="font-mono text-xs text-text-muted">{log.sourceIp}</span></td>
                  <td><span className="text-xs" style={{ color: '#a855f7' }}>{log.protocol}</span></td>
                  <td>
                    <button
                      onClick={() => setSelected(log)}
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                      style={{ color: '#475569' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-text-muted">
            Page {page + 1} of {totalPages} — showing {pageData.length} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40">Prev</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {/* Log detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Log Detail — ${selected?.id}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Log ID', selected.id],
                ['Timestamp', formatTime(selected.timestamp)],
                ['Source', selected.source],
                ['Severity', selected.severity],
                ['Type', selected.type],
                ['Protocol', selected.protocol],
                ['Source IP', selected.sourceIp],
                ['Dest IP', selected.destIp],
                ['Port', selected.port],
                ['User', selected.user || 'N/A'],
                ['Bytes', selected.bytes?.toLocaleString()],
                ['Country', selected.country],
              ].map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                  <p className="text-xs text-text-muted mb-1">{k}</p>
                  <p className="text-sm font-medium text-text-primary">{v}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#060e1c', border: '1px solid #1e3a5f' }}>
              <p className="text-xs text-text-muted mb-2">Message</p>
              <p className="text-sm text-text-primary">{selected.message}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#060e1c', border: '1px solid #1e3a5f' }}>
              <p className="text-xs text-text-muted mb-2">Raw Log</p>
              <pre className="text-xs font-mono" style={{ color: '#00d4ff', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{selected.rawLog}</pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
