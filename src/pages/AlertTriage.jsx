import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter, AlertTriangle, TrendingUp, Users, ChevronUp, ChevronDown } from 'lucide-react';
import { mockAlerts } from '../data/mockAlerts';
import SeverityBadge, { StatusBadge } from '../components/ui/SeverityBadge';

// Generate triage-specific data
const triageData = mockAlerts.slice(0, 40).map(a => ({
  ...a,
  likelihood: Math.floor(Math.random() * 10 + 1),
  impact: Math.floor(Math.random() * 10 + 1),
  riskScore: Math.floor(Math.random() * 40 + 60),
  criticalityScore: Math.floor(Math.random() * 40 + 60),
  escalationSuggested: Math.random() > 0.6,
  estimatedTime: `${Math.floor(Math.random() * 4 + 1)}h`,
  priority: Math.floor(Math.random() * 40 + 1),
})).sort((a, b) => b.riskScore - a.riskScore);

const analystLoad = [
  { name: 'Alice Chen', assigned: 8, resolved: 5, capacity: 10 },
  { name: 'Bob Martinez', assigned: 6, resolved: 4, capacity: 8 },
  { name: 'Carol Kim', assigned: 10, resolved: 6, capacity: 10 },
  { name: 'David Singh', assigned: 4, resolved: 4, capacity: 8 },
  { name: 'Eve Johnson', assigned: 7, resolved: 3, capacity: 8 },
];

const riskColor = (score) => {
  if (score >= 90) return '#ff3366';
  if (score >= 75) return '#ffb800';
  if (score >= 60) return '#a855f7';
  return '#00d4ff';
};

const scatterData = triageData.map(a => ({
  x: a.likelihood,
  y: a.impact,
  z: a.riskScore,
  id: a.id,
  type: a.attackType,
  sev: a.severity,
}));

const CustomScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#111e35', border: '1px solid #1e3a5f', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#00d4ff', fontWeight: 600 }}>{d.id}</p>
      <p style={{ color: '#94a3b8' }}>{d.type}</p>
      <p style={{ color: '#ffb800' }}>Risk: {d.z}</p>
    </div>
  );
};

export default function AlertTriage() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Alert Triage</h2>
          <p className="text-sm text-text-muted">AI-prioritized incident queue — reducing analyst fatigue</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <TrendingUp size={14} style={{ color: '#ffb800' }} />
            <span className="text-xs font-semibold text-text-primary">Priority Score Active</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Critical Priority', val: triageData.filter(a => a.riskScore >= 90).length, color: '#ff3366' },
          { label: 'Escalation Needed', val: triageData.filter(a => a.escalationSuggested).length, color: '#ffb800' },
          { label: 'Avg Risk Score', val: Math.round(triageData.reduce((s, a) => s + a.riskScore, 0) / triageData.length), color: '#a855f7' },
          { label: 'Open Queue', val: triageData.length, color: '#00d4ff' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass-card p-4" style={{ border: `1px solid ${color}22` }}>
            <p className="text-2xl font-bold" style={{ color }}>{val}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Risk matrix + analyst load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk matrix */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-1">Risk Matrix</h3>
          <p className="text-xs text-text-muted mb-3">Likelihood vs. Impact — bubble size = risk score</p>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis type="number" dataKey="x" name="Likelihood" domain={[0, 11]} tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false} tickLine={false} label={{ value: 'Likelihood', fill: '#64748b', fontSize: 10, position: 'insideBottom', offset: -2 }} />
              <YAxis type="number" dataKey="y" name="Impact" domain={[0, 11]} tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false} tickLine={false} label={{ value: 'Impact', fill: '#64748b', fontSize: 10, angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomScatterTooltip />} />
              <Scatter data={scatterData}>
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={riskColor(entry.z)} opacity={0.8} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-2 text-xs">
            {[['Critical (≥90)', '#ff3366'], ['High (≥75)', '#ffb800'], ['Medium (≥60)', '#a855f7'], ['Low', '#00d4ff']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                <span style={{ color: '#64748b' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analyst workload */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Analyst Workload</h3>
          <div className="space-y-3">
            {analystLoad.map(analyst => {
              const utilization = Math.round((analyst.assigned / analyst.capacity) * 100);
              const color = utilization >= 90 ? '#ff3366' : utilization >= 70 ? '#ffb800' : '#00ff88';
              return (
                <div key={analyst.name} className="p-3 rounded-lg" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: `${color}22`, color }}>
                        {analyst.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-text-primary">{analyst.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold" style={{ color }}>{utilization}% capacity</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#1e3a5f' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${utilization}%`, background: color, boxShadow: `0 0 6px ${color}44` }} />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-text-muted">
                    <span>{analyst.assigned} assigned</span>
                    <span>{analyst.resolved} resolved today</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority queue */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">Priority Investigation Queue</h3>
          <p className="text-xs text-text-muted mt-0.5">Sorted by AI-calculated risk score</p>
        </div>
        <div className="divide-y divide-border" style={{ maxHeight: '480px', overflowY: 'auto' }}>
          {triageData.slice(0, 20).map((alert, i) => (
            <div key={alert.id}>
              <div
                className="flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
                onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
              >
                {/* Priority rank */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ background: i < 3 ? 'rgba(255,51,102,0.1)' : 'rgba(255,184,0,0.08)', color: i < 3 ? '#ff3366' : '#ffb800' }}>
                  #{i + 1}
                </div>

                {/* Alert info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono" style={{ color: '#00d4ff' }}>{alert.id}</span>
                    <SeverityBadge severity={alert.severity} />
                    {alert.escalationSuggested && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-semibold"
                        style={{ background: 'rgba(255,184,0,0.1)', color: '#ffb800', border: '1px solid rgba(255,184,0,0.2)' }}>
                        ↑ Escalate
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{alert.attackType} → {alert.targetAsset}</p>
                </div>

                {/* Scores */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-text-muted">Risk Score</p>
                    <p className="text-sm font-bold" style={{ color: riskColor(alert.riskScore) }}>{alert.riskScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted">Criticality</p>
                    <p className="text-sm font-bold" style={{ color: riskColor(alert.criticalityScore) }}>{alert.criticalityScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted">Est. Time</p>
                    <p className="text-sm font-semibold text-text-primary">{alert.estimatedTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted">Analyst</p>
                    <p className="text-xs text-text-secondary">{alert.analyst.split(' ')[0]}</p>
                  </div>
                  {expandedId === alert.id ? <ChevronUp size={14} style={{ color: '#64748b' }} /> : <ChevronDown size={14} style={{ color: '#64748b' }} />}
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === alert.id && (
                <div className="px-5 py-3" style={{ background: 'rgba(0,212,255,0.03)', borderTop: '1px solid #1e3a5f33' }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="p-2 rounded-lg text-center" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                      <p className="text-xs text-text-muted">Likelihood</p>
                      <p className="text-sm font-bold" style={{ color: '#ffb800' }}>{alert.likelihood}/10</p>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                      <p className="text-xs text-text-muted">Impact</p>
                      <p className="text-sm font-bold" style={{ color: '#ff3366' }}>{alert.impact}/10</p>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                      <p className="text-xs text-text-muted">Confidence</p>
                      <p className="text-sm font-bold" style={{ color: '#a855f7' }}>{alert.confidenceScore}%</p>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                      <p className="text-xs text-text-muted">MITRE</p>
                      <p className="text-sm font-bold" style={{ color: '#00d4ff' }}>{alert.mitre}</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary">{alert.description}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="btn-primary text-xs px-3 py-1.5">Investigate Now</button>
                    <button className="btn-ghost text-xs px-3 py-1.5">Assign Analyst</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
