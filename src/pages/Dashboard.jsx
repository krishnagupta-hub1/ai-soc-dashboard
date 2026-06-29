import { useState, useEffect, useRef } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Database, AlertTriangle, Shield, Activity,
  Server, Cpu, HardDrive, Wifi, Eye, TrendingUp,
  AlertCircle, CheckCircle, Clock, Zap
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import SeverityBadge from '../components/ui/SeverityBadge';
import { alertTrend, attackDistribution, mockAlerts } from '../data/mockAlerts';

const TOOLTIP_STYLE = {
  contentStyle: { background: '#111e35', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e2e8f0', fontSize: 12 },
  labelStyle: { color: '#94a3b8' },
};

const recentEvents = [
  { id: 1, time: '18:45:22', msg: 'Brute force attack detected — 23k attempts from 47 IPs', sev: 'critical', icon: AlertCircle },
  { id: 2, time: '18:23:01', msg: 'Successful credential compromise — jdoe@corp.com via VPN', sev: 'critical', icon: AlertCircle },
  { id: 3, time: '17:55:14', msg: 'Port scan from 103.24.77.88 — 65k ports in 8 minutes', sev: 'high', icon: AlertTriangle },
  { id: 4, time: '17:32:09', msg: 'SQL injection blocked — /api/v2/users/search endpoint', sev: 'high', icon: AlertTriangle },
  { id: 5, time: '16:45:33', msg: 'DDoS mitigation triggered — 85k req/s absorbed', sev: 'medium', icon: AlertTriangle },
  { id: 6, time: '16:12:07', msg: 'BERT-SOC model accuracy: 97.43% — daily benchmark passed', sev: 'info', icon: CheckCircle },
  { id: 7, time: '15:30:00', msg: 'SSL certificate renewed — web-server-01.corp.com', sev: 'info', icon: CheckCircle },
  { id: 8, time: '14:22:45', msg: 'XSS payload blocked — customer portal login form', sev: 'medium', icon: AlertTriangle },
];

const systemHealth = [
  { name: 'BERT-SOC Model', status: 'online', metric: '97.4%', label: 'Accuracy', icon: Cpu },
  { name: 'XGBoost Model', status: 'online', metric: '95.2%', label: 'Accuracy', icon: Cpu },
  { name: 'RAG Engine', status: 'online', metric: '< 2s', label: 'Latency', icon: Zap },
  { name: 'Log Ingestion API', status: 'online', metric: '1,247 eps', label: 'Events/sec', icon: Activity },
  { name: 'Threat Intel Feed', status: 'warning', metric: '2h ago', label: 'Last Sync', icon: Wifi },
  { name: 'Database Cluster', status: 'online', metric: '99.99%', label: 'Uptime', icon: HardDrive },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111e35', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ color: '#94a3b8', marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [liveCount, setLiveCount] = useState(500);
  const [alertCount, setAlertCount] = useState(120);
  const [liveEvents, setLiveEvents] = useState(recentEvents);
  const timerRef = useRef(null);

  const lastWeekTrend = alertTrend.slice(-7);
  const trendData = alertTrend.slice(-14);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 5 + 1));
      if (Math.random() > 0.7) {
        setAlertCount(c => c + 1);
        const newEv = {
          id: Date.now(),
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          msg: recentEvents[Math.floor(Math.random() * 3)].msg,
          sev: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)],
          icon: AlertCircle,
        };
        setLiveEvents(ev => [newEv, ...ev.slice(0, 7)]);
      }
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, []);

  const sevColor = { critical: '#ff3366', high: '#ffb800', medium: '#a855f7', info: '#64748b' };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Security Operations Center</h2>
          <p className="text-sm text-text-muted mt-0.5">Real-time threat monitoring and incident response</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.2)' }}>
          <span className="status-dot" style={{ background: '#ff3366', boxShadow: '0 0 6px rgba(255,51,102,0.8)', animation: 'pulse 1.5s infinite' }} />
          <span className="text-xs font-semibold" style={{ color: '#ff3366' }}>THREAT LEVEL: HIGH</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Logs Ingested" value={liveCount.toLocaleString()} subtitle="All sources combined" icon={Database} color="cyan" trend="up" trendValue="+12.4%" />
        <StatCard title="Alerts Generated" value={alertCount} subtitle="Last 7 days" icon={AlertTriangle} color="amber" trend="up" trendValue="+8 today" />
        <StatCard title="Critical Incidents" value="7" subtitle="Requiring immediate action" icon={AlertCircle} color="red" trend="up" trendValue="+2 new" />
        <StatCard title="Threats Blocked" value="1,847" subtitle="Auto-mitigated by AI" icon={Shield} color="green" trend="down" trendValue="-3.2%" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Threat trend */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-text-primary">Threat Trends</h3>
              <p className="text-xs text-text-muted mt-0.5">Alerts by severity over last 14 days</p>
            </div>
            <TrendingUp size={16} style={{ color: '#00d4ff' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradCrit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb800" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ffb800" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="#ff3366" fill="url(#gradCrit)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="high" name="High" stroke="#ffb800" fill="url(#gradHigh)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="medium" name="Medium" stroke="#a855f7" fill="url(#gradMed)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attack distribution */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-text-primary">Attack Types</h3>
              <p className="text-xs text-text-muted mt-0.5">Distribution by category</p>
            </div>
            <Eye size={16} style={{ color: '#00d4ff' }} />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={attackDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {attackDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#111e35', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {attackDistribution.slice(0, 5).map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span style={{ color: '#94a3b8' }}>{d.name}</span>
                </div>
                <span style={{ color: d.color, fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent events */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Live Security Events</h3>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#00ff88' }}>
              <span className="status-dot online animate-pulse-slow" />
              Live
            </span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {liveEvents.map((ev, i) => (
              <div
                key={ev.id}
                className="flex gap-3 p-3 rounded-lg transition-all"
                style={{
                  background: i === 0 ? `rgba(${ev.sev === 'critical' ? '255,51,102' : ev.sev === 'high' ? '255,184,0' : '168,85,247'},0.05)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${i === 0 ? (ev.sev === 'critical' ? 'rgba(255,51,102,0.15)' : 'rgba(255,184,0,0.15)') : 'transparent'}`,
                  animation: i === 0 ? 'fadeIn 0.3s ease-out' : 'none',
                }}
              >
                <ev.icon size={14} style={{ color: sevColor[ev.sev] || '#64748b', flexShrink: 0, marginTop: 2 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-secondary truncate">{ev.msg}</p>
                  <p className="text-xs text-text-muted mt-0.5 font-mono">{ev.time}</p>
                </div>
                <SeverityBadge severity={ev.sev} />
              </div>
            ))}
          </div>
        </div>

        {/* System health */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">System Health</h3>
            <Server size={16} style={{ color: '#00d4ff' }} />
          </div>
          <div className="space-y-3">
            {systemHealth.map(sys => (
              <div key={sys.name} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: sys.status === 'online' ? 'rgba(0,255,136,0.1)' : 'rgba(255,184,0,0.1)' }}>
                  <sys.icon size={15} style={{ color: sys.status === 'online' ? '#00ff88' : '#ffb800' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{sys.name}</p>
                  <p className="text-xs text-text-muted">{sys.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: sys.status === 'online' ? '#00ff88' : '#ffb800' }}>
                    {sys.metric}
                  </p>
                  <span className={`text-xs ${sys.status === 'online' ? '' : ''}`}
                    style={{ color: sys.status === 'online' ? '#00ff8888' : '#ffb80088' }}>
                    {sys.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
