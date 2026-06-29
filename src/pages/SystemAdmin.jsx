import { useState } from 'react';
import {
  Settings, Users, Key, Database, Cpu, Activity,
  Plus, Edit2, Trash2, Eye, EyeOff, Check, X,
  Shield, Server, Wifi, HardDrive, AlertTriangle
} from 'lucide-react';

const tabs = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'rbac', label: 'Access Control', icon: Key },
  { id: 'api', label: 'API Management', icon: Wifi },
  { id: 'models', label: 'Model Config', icon: Cpu },
  { id: 'sources', label: 'Data Sources', icon: Database },
  { id: 'logs', label: 'System Logs', icon: Activity },
];

const mockUsers = [
  { id: 1, name: 'Alice Chen', email: 'alice@corp.com', role: 'Senior Analyst', status: 'Active', lastLogin: '2026-06-29T18:30:00Z', mfa: true },
  { id: 2, name: 'Bob Martinez', email: 'bob@corp.com', role: 'Analyst', status: 'Active', lastLogin: '2026-06-29T17:15:00Z', mfa: true },
  { id: 3, name: 'Carol Kim', email: 'carol@corp.com', role: 'SOC Manager', status: 'Active', lastLogin: '2026-06-29T16:00:00Z', mfa: true },
  { id: 4, name: 'David Singh', email: 'david@corp.com', role: 'Analyst', status: 'Active', lastLogin: '2026-06-29T14:45:00Z', mfa: false },
  { id: 5, name: 'Eve Johnson', email: 'eve@corp.com', role: 'Junior Analyst', status: 'Inactive', lastLogin: '2026-06-28T09:00:00Z', mfa: true },
  { id: 6, name: 'Admin User', email: 'admin@corp.com', role: 'Administrator', status: 'Active', lastLogin: '2026-06-29T20:00:00Z', mfa: true },
];

const rbacMatrix = {
  roles: ['Junior Analyst', 'Analyst', 'Senior Analyst', 'SOC Manager', 'Administrator'],
  permissions: [
    { name: 'View Dashboard', junior: true, analyst: true, senior: true, manager: true, admin: true },
    { name: 'View Logs', junior: true, analyst: true, senior: true, manager: true, admin: true },
    { name: 'Export Logs', junior: false, analyst: true, senior: true, manager: true, admin: true },
    { name: 'Manage Alerts', junior: false, analyst: true, senior: true, manager: true, admin: true },
    { name: 'View RCA', junior: false, analyst: true, senior: true, manager: true, admin: true },
    { name: 'Apply Recommendations', junior: false, analyst: false, senior: true, manager: true, admin: true },
    { name: 'Generate Reports', junior: false, analyst: true, senior: true, manager: true, admin: true },
    { name: 'System Configuration', junior: false, analyst: false, senior: false, manager: false, admin: true },
    { name: 'User Management', junior: false, analyst: false, senior: false, manager: true, admin: true },
    { name: 'API Management', junior: false, analyst: false, senior: false, manager: false, admin: true },
  ],
};

const apiEndpoints = [
  { id: 'API-001', name: 'Log Ingestion API', url: '/api/v1/logs', method: 'POST', status: 'Active', rps: 1247, keyRequired: true },
  { id: 'API-002', name: 'Alert API', url: '/api/v1/alerts', method: 'GET/POST', status: 'Active', rps: 342, keyRequired: true },
  { id: 'API-003', name: 'Anomaly Detection API', url: '/api/v1/detect', method: 'POST', status: 'Active', rps: 89, keyRequired: true },
  { id: 'API-004', name: 'RCA API', url: '/api/v1/rca', method: 'POST', status: 'Active', rps: 12, keyRequired: true },
  { id: 'API-005', name: 'Threat Intel Feed', url: '/api/v1/intel', method: 'GET', status: 'Degraded', rps: 5, keyRequired: false },
  { id: 'API-006', name: 'Report Generation API', url: '/api/v1/reports', method: 'GET/POST', status: 'Active', rps: 3, keyRequired: true },
];

const dataSources = [
  { id: 'DS-001', name: 'Apache Web Server', type: 'Syslog', host: 'web-01.corp.com:514', status: 'Connected', eps: 234, format: 'CEF' },
  { id: 'DS-002', name: 'Cisco Firewall', type: 'Syslog', host: '10.0.0.1:514', status: 'Connected', eps: 567, format: 'RFC5424' },
  { id: 'DS-003', name: 'Windows AD', type: 'WinEvt', host: 'dc01.corp.com', status: 'Connected', eps: 1200, format: 'EVTX' },
  { id: 'DS-004', name: 'AWS CloudTrail', type: 'API', host: 's3://ct-logs', status: 'Connected', eps: 89, format: 'JSON' },
  { id: 'DS-005', name: 'MySQL Database', type: 'JDBC', host: 'db01.corp.com:3306', status: 'Connected', eps: 45, format: 'SQL Audit' },
  { id: 'DS-006', name: 'IDS/IPS Sensor', type: 'Syslog', host: '10.0.0.50:5514', status: 'Disconnected', eps: 0, format: 'Snort Alert' },
];

const systemLogEntries = [
  { time: '20:00:15', level: 'INFO', component: 'Log Ingestion', msg: 'Processed 1,247 events in batch #8842' },
  { time: '19:55:02', level: 'INFO', component: 'BERT-SOC', msg: 'Model inference completed — 99 samples, avg latency 43ms' },
  { time: '19:52:33', level: 'WARNING', component: 'Threat Intel', msg: 'Feed sync delayed — retrying in 15 minutes' },
  { time: '19:45:11', level: 'INFO', component: 'Alert Engine', msg: 'Alert ALERT-0120 generated — Brute Force, confidence 92%' },
  { time: '19:30:00', level: 'INFO', component: 'System', msg: 'Health check passed — all services operational' },
  { time: '19:15:44', level: 'ERROR', component: 'IDS/IPS Feed', msg: 'Connection to DS-006 lost — attempting reconnect' },
  { time: '19:14:59', level: 'INFO', component: 'RAG Engine', msg: 'Knowledge base indexed — 4,521 documents' },
  { time: '19:00:00', level: 'INFO', component: 'System', msg: 'Hourly backup completed — 2.3GB, SHA256: a94a8fe...' },
];

const levelColor = { INFO: '#00d4ff', WARNING: '#ffb800', ERROR: '#ff3366', DEBUG: '#64748b' };

export default function SystemAdmin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(mockUsers);
  const [showKey, setShowKey] = useState({});
  const [modelThresholds, setModelThresholds] = useState({ bert: 0.75, xgboost: 0.80, ensemble: 0.70 });

  const toggleKey = (id) => setShowKey(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-text-primary">System Administration</h2>
        <p className="text-sm text-text-muted">Platform configuration, user management, and monitoring</p>
      </div>

      {/* System status bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', val: users.length, color: '#00d4ff', icon: Users },
          { label: 'Active Sessions', val: 4, color: '#00ff88', icon: Activity },
          { label: 'API Calls Today', val: '128K', color: '#a855f7', icon: Wifi },
          { label: 'System Uptime', val: '99.98%', color: '#ffb800', icon: Server },
        ].map(({ label, val, color, icon: Icon }) => (
          <div key={label} className="glass-card p-4" style={{ border: `1px solid ${color}22` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold" style={{ color }}>{val}</p>
                <p className="text-xs text-text-muted mt-0.5">{label}</p>
              </div>
              <Icon size={18} style={{ color: `${color}88` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap" style={{ borderBottom: '1px solid #1e3a5f' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all"
            style={{
              color: activeTab === tab.id ? '#00d4ff' : '#64748b',
              borderBottom: activeTab === tab.id ? '2px solid #00d4ff' : '2px solid transparent',
              marginBottom: '-1px',
            }}>
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {/* User Management */}
        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">Users ({users.length})</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5">
                <Plus size={12} /> Add User
              </button>
            </div>
            <div className="overflow-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>MFA</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-text-primary">{u.name}</span>
                        </div>
                      </td>
                      <td><span className="text-xs font-mono text-text-muted">{u.email}</span></td>
                      <td>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs font-semibold" style={{ color: u.status === 'Active' ? '#00ff88' : '#ff3366' }}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        {u.mfa
                          ? <span className="badge-low" style={{ color: '#00ff88', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>Enabled</span>
                          : <span className="badge-critical">Disabled</span>
                        }
                      </td>
                      <td><span className="font-mono text-xs text-text-muted">{new Date(u.lastLogin).toLocaleDateString()}</span></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: '#475569' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                            <Edit2 size={12} />
                          </button>
                          <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: '#475569' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ff3366'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RBAC */}
        {activeTab === 'rbac' && (
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">Role-Based Access Control Matrix</h3>
              <p className="text-xs text-text-muted mt-0.5">Permissions per role</p>
            </div>
            <div className="overflow-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Permission</th>
                    {rbacMatrix.roles.map(r => <th key={r} className="text-center">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rbacMatrix.permissions.map(perm => (
                    <tr key={perm.name}>
                      <td className="font-medium" style={{ color: '#e2e8f0' }}>{perm.name}</td>
                      {['junior', 'analyst', 'senior', 'manager', 'admin'].map(role => (
                        <td key={role} className="text-center">
                          {perm[role]
                            ? <Check size={14} style={{ color: '#00ff88', margin: '0 auto' }} />
                            : <X size={14} style={{ color: '#ff336655', margin: '0 auto' }} />
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* API Management */}
        {activeTab === 'api' && (
          <div className="space-y-3">
            {apiEndpoints.map(api => (
              <div key={api.id} className="glass-card p-4" style={{ border: `1px solid ${api.status === 'Active' ? 'rgba(0,255,136,0.12)' : 'rgba(255,184,0,0.2)'}` }}>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>{api.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded font-semibold"
                        style={{ background: api.method.includes('POST') ? 'rgba(0,255,136,0.1)' : 'rgba(0,212,255,0.08)', color: api.method.includes('POST') ? '#00ff88' : '#00d4ff' }}>
                        {api.method}
                      </span>
                      <span className="text-xs" style={{ color: api.status === 'Active' ? '#00ff88' : '#ffb800' }}>● {api.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-text-primary">{api.name}</p>
                    <p className="font-mono text-xs mt-0.5" style={{ color: '#a855f7' }}>{api.url}</p>
                  </div>
                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <p className="text-xs text-text-muted">Req/sec</p>
                      <p className="text-sm font-bold" style={{ color: '#00d4ff' }}>{api.rps}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Auth Key</p>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs" style={{ color: '#64748b' }}>
                          {showKey[api.id] ? 'sk-live-abc123' : '••••••••••••'}
                        </span>
                        <button onClick={() => toggleKey(api.id)} style={{ color: '#475569' }}>
                          {showKey[api.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                    <button className="btn-ghost text-xs">Revoke</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Model Config */}
        {activeTab === 'models' && (
          <div className="space-y-4">
            {[
              { key: 'bert', name: 'BERT-SOC Transformer', desc: 'Fine-tuned BERT model for security log classification' },
              { key: 'xgboost', name: 'XGBoost Classifier', desc: 'Gradient boosting for fast anomaly detection' },
              { key: 'ensemble', name: 'Ensemble Model', desc: 'Combined BERT + XGBoost with voting classifier' },
            ].map(m => (
              <div key={m.key} className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Cpu size={16} style={{ color: '#00d4ff' }} />
                      <h4 className="text-sm font-bold text-text-primary">{m.name}</h4>
                      <span className="badge-low" style={{ color: '#00ff88', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>Active</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{m.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-ghost text-xs">Retrain</button>
                    <button className="btn-ghost text-xs" style={{ color: '#ff3366', borderColor: 'rgba(255,51,102,0.3)' }}>Disable</button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: '#94a3b8' }}>Detection Threshold</span>
                    <span style={{ color: '#00d4ff', fontWeight: 700 }}>{(modelThresholds[m.key] * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range" min="50" max="99" step="1"
                    value={modelThresholds[m.key] * 100}
                    onChange={e => setModelThresholds(prev => ({ ...prev, [m.key]: e.target.value / 100 }))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(90deg, #00d4ff ${modelThresholds[m.key] * 100}%, #1e3a5f ${modelThresholds[m.key] * 100}%)` }}
                  />
                  <div className="flex justify-between text-xs mt-0.5" style={{ color: '#475569' }}>
                    <span>50% (Sensitive)</span>
                    <span>99% (Conservative)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data Sources */}
        {activeTab === 'sources' && (
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">Data Sources ({dataSources.length})</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5"><Plus size={12} /> Add Source</button>
            </div>
            <div className="overflow-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Host</th>
                    <th>Format</th>
                    <th>Events/sec</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSources.map(ds => (
                    <tr key={ds.id}>
                      <td><span className="font-mono text-xs" style={{ color: '#00d4ff' }}>{ds.id}</span></td>
                      <td><span className="text-sm font-medium text-text-primary">{ds.name}</span></td>
                      <td><span className="text-xs text-text-muted">{ds.type}</span></td>
                      <td><span className="font-mono text-xs" style={{ color: '#a855f7' }}>{ds.host}</span></td>
                      <td><span className="text-xs text-text-muted">{ds.format}</span></td>
                      <td><span className="text-sm font-bold" style={{ color: '#00d4ff' }}>{ds.eps}</span></td>
                      <td>
                        <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: ds.status === 'Connected' ? '#00ff88' : '#ff3366' }}>
                          <span className="status-dot" style={{ background: ds.status === 'Connected' ? '#00ff88' : '#ff3366' }} />
                          {ds.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: '#475569' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}><Edit2 size={12} /></button>
                          <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: '#475569' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ff3366'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Logs */}
        {activeTab === 'logs' && (
          <div className="glass-card overflow-hidden" style={{ border: '1px solid #1e3a5f' }}>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">System Audit Logs</h3>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#00ff88' }}>
                <span className="status-dot online animate-pulse-slow" />
                Live
              </span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1.5" style={{ background: '#060e1c', maxHeight: '400px', overflowY: 'auto' }}>
              {systemLogEntries.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span style={{ color: '#475569', flexShrink: 0 }}>{log.time}</span>
                  <span className="font-bold px-1.5 py-0.5 rounded text-xs" style={{
                    background: `${levelColor[log.level]}15`,
                    color: levelColor[log.level],
                    flexShrink: 0,
                    alignSelf: 'center',
                    fontSize: 10,
                  }}>{log.level}</span>
                  <span style={{ color: '#a855f7', flexShrink: 0 }}>[{log.component}]</span>
                  <span style={{ color: '#94a3b8' }}>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
