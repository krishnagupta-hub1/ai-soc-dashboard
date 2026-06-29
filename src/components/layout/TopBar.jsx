import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, RefreshCw, ChevronRight } from 'lucide-react';

const pageTitles = {
  '/': { title: 'Dashboard Overview', subtitle: 'Real-time security posture' },
  '/logs': { title: 'Log Management', subtitle: 'Security event logs' },
  '/anomalies': { title: 'Anomaly Detection', subtitle: 'AI-powered threat classification' },
  '/alerts': { title: 'Alert Management', subtitle: 'Security incident alerts' },
  '/triage': { title: 'Alert Triage', subtitle: 'Incident prioritization' },
  '/threat-intel': { title: 'Threat Intelligence', subtitle: 'External knowledge base' },
  '/rca': { title: 'Root Cause Analysis', subtitle: 'RAG + LLM investigation' },
  '/recommendations': { title: 'Recommendations', subtitle: 'AI mitigation strategies' },
  '/reports': { title: 'Incident Reports', subtitle: 'Forensic documentation' },
  '/admin': { title: 'System Administration', subtitle: 'Platform configuration' },
};

export default function TopBar() {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [alertCount] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const page = pageTitles[location.pathname] || pageTitles['/'];

  return (
    <header
      className="flex items-center gap-4 px-6 py-3 sticky top-0 z-30"
      style={{
        background: 'rgba(5, 10, 20, 0.95)',
        borderBottom: '1px solid #1e3a5f',
        backdropFilter: 'blur(10px)',
        minHeight: 64,
      }}
    >
      {/* Breadcrumb + title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-0.5">
          <span>AI-SOC</span>
          <ChevronRight size={12} />
          <span style={{ color: '#00d4ff' }}>{page.title}</span>
        </div>
        <h1 className="text-base font-semibold text-text-primary truncate">{page.title}</h1>
      </div>

      {/* Live clock */}
      <div className="hidden md:flex flex-col items-end">
        <div className="text-sm font-mono font-semibold" style={{ color: '#00d4ff' }}>
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div className="text-xs text-text-muted">
          {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border hidden md:block" />

      {/* Refresh */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{ background: '#0d1526', border: '1px solid #1e3a5f', color: '#64748b' }}
        title="Refresh data"
        onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; e.currentTarget.style.borderColor = '#00d4ff44'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#1e3a5f'; }}
      >
        <RefreshCw size={15} />
      </button>

      {/* Alerts bell */}
      <button
        className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{ background: '#0d1526', border: '1px solid #1e3a5f', color: '#94a3b8' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#ff3366'; e.currentTarget.style.borderColor = '#ff336644'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#1e3a5f'; }}
      >
        <Bell size={15} />
        {alertCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
            style={{ background: '#ff3366', color: '#fff', fontSize: '9px', boxShadow: '0 0 8px rgba(255,51,102,0.6)' }}
          >
            {alertCount}
          </span>
        )}
      </button>

      {/* Live status */}
      <div
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)' }}
      >
        <span className="status-dot online animate-pulse-slow" />
        <span className="text-xs font-medium" style={{ color: '#00ff88' }}>LIVE</span>
      </div>
    </header>
  );
}
