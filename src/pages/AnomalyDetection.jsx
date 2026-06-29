import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, Legend
} from 'recharts';
import { Brain, Zap, Target, TrendingUp, Eye, Activity } from 'lucide-react';
import { mockAnomalies, modelPerformance, anomalyTimeline, categoryDistribution } from '../data/mockAnomalies';
import SeverityBadge from '../components/ui/SeverityBadge';
import Modal from '../components/ui/Modal';

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? '#ff3366' : pct >= 75 ? '#ffb800' : pct >= 60 ? '#a855f7' : '#00d4ff';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1e3a5f' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span className="text-xs font-mono font-semibold w-9 text-right" style={{ color }}>{pct}%</span>
    </div>
  );
}

const radarData = [
  { subject: 'Accuracy', BERT: 97.4, XGBoost: 95.2, Ensemble: 98.1 },
  { subject: 'Precision', BERT: 96.1, XGBoost: 93.9, Ensemble: 97.0 },
  { subject: 'Recall', BERT: 98.2, XGBoost: 96.1, Ensemble: 98.9 },
  { subject: 'F1 Score', BERT: 97.2, XGBoost: 95.0, Ensemble: 97.9 },
  { subject: 'AUC-ROC', BERT: 99.3, XGBoost: 97.9, Ensemble: 99.6 },
];

export default function AnomalyDetection() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const displayed = filter === 'all' ? mockAnomalies
    : filter === 'anomaly' ? mockAnomalies.filter(a => a.isAnomaly)
    : mockAnomalies.filter(a => !a.isAnomaly);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Anomaly Detection</h2>
          <p className="text-sm text-text-muted">AI-powered classification — BERT-SOC + XGBoost Ensemble</p>
        </div>
        <div className="flex gap-2">
          {['all', 'anomaly', 'normal'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded text-xs font-medium capitalize transition-all"
              style={{
                background: filter === f ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.03)',
                color: filter === f ? '#00d4ff' : '#64748b',
                border: `1px solid ${filter === f ? '#00d4ff44' : '#1e3a5f'}`,
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Model performance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(modelPerformance).map(m => (
          <div key={m.name} className="glass-card p-4"
            style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain size={16} style={{ color: '#00d4ff' }} />
                <span className="text-sm font-semibold text-text-primary">{m.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold"
                style={{ background: 'rgba(0,255,136,0.12)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>
                {m.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[['Accuracy', m.accuracy], ['Precision', m.precision], ['Recall', m.recall], ['F1', m.f1]].map(([k, v]) => (
                <div key={k} className="p-2 rounded" style={{ background: '#0d1526' }}>
                  <p className="text-xs text-text-muted">{k}</p>
                  <p className="text-sm font-bold" style={{ color: '#00d4ff' }}>{(v * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
              <span>Latency: <span style={{ color: '#ffb800' }}>{m.latency}</span></span>
              <span>AUC: <span style={{ color: '#a855f7' }}>{(m.auc * 100).toFixed(1)}%</span></span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Timeline */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Anomaly Timeline (48h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={anomalyTimeline.slice(-24)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111e35', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="anomalies" name="Anomalies" stroke="#ff3366" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="normal" name="Normal" stroke="#00d4ff" strokeWidth={2} dot={false} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Model radar */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Model Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e3a5f" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="BERT-SOC" dataKey="BERT" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} />
              <Radar name="XGBoost" dataKey="XGBoost" stroke="#ffb800" fill="#ffb800" fillOpacity={0.1} />
              <Radar name="Ensemble" dataKey="Ensemble" stroke="#00ff88" fill="#00ff88" fillOpacity={0.1} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category distribution */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Attack Category Distribution</h3>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={categoryDistribution} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip contentStyle={{ background: '#111e35', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {categoryDistribution.map((entry, i) => (
                <rect key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Detected Anomalies ({displayed.length})</h3>
          <Activity size={15} style={{ color: '#00d4ff' }} />
        </div>
        <div className="overflow-auto" style={{ maxHeight: '380px' }}>
          <table className="data-table">
            <thead className="sticky top-0 z-10">
              <tr>
                <th>ID</th>
                <th>Timestamp</th>
                <th>Category</th>
                <th>Model</th>
                <th>Confidence</th>
                <th>Source IP</th>
                <th>Logs</th>
                <th>Alert</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((a, i) => (
                <tr key={a.id} style={{ animation: `fadeIn 0.15s ease-out ${i * 0.01}s both` }}>
                  <td><span className="font-mono text-xs" style={{ color: '#00d4ff' }}>{a.id}</span></td>
                  <td><span className="font-mono text-xs text-text-muted">{formatTime(a.timestamp)}</span></td>
                  <td>
                    <span className="text-xs font-medium" style={{ color: a.isAnomaly ? '#ff3366' : '#00ff88' }}>
                      {a.category}
                    </span>
                  </td>
                  <td><span className="text-xs text-text-muted">{a.model}</span></td>
                  <td style={{ minWidth: 140 }}><ConfidenceBar value={a.confidence} /></td>
                  <td><span className="font-mono text-xs text-text-muted">{a.sourceIp}</span></td>
                  <td><span className="text-xs text-text-muted">{a.logCount}</span></td>
                  <td>
                    {a.alertGenerated
                      ? <span className="badge-critical">Yes</span>
                      : <span className="badge-info">No</span>
                    }
                  </td>
                  <td>
                    <button onClick={() => setSelected(a)}
                      className="w-6 h-6 rounded flex items-center justify-center"
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
      </div>

      {/* Detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Anomaly Detail — ${selected?.id}`}>
        {selected && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: selected.isAnomaly ? 'rgba(255,51,102,0.05)' : 'rgba(0,255,136,0.05)', border: `1px solid ${selected.isAnomaly ? 'rgba(255,51,102,0.2)' : 'rgba(0,255,136,0.2)'}` }}>
              <p className="text-xs text-text-muted">Classification</p>
              <p className="text-lg font-bold mt-1" style={{ color: selected.isAnomaly ? '#ff3366' : '#00ff88' }}>
                {selected.isAnomaly ? '⚠ ANOMALY DETECTED' : '✓ NORMAL TRAFFIC'}
              </p>
              <p className="text-sm text-text-secondary mt-1">{selected.category} — Confidence: {(selected.confidence * 100).toFixed(1)}%</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(selected.features).map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                  <p className="text-xs text-text-muted capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm font-semibold text-text-primary mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2">Classification Probabilities</p>
              <div className="space-y-2">
                {Object.entries(selected.classifications).map(([cat, prob]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#94a3b8' }}>{cat}</span>
                      <span style={{ color: '#00d4ff' }}>{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#1e3a5f' }}>
                      <div className="h-full rounded-full" style={{ width: `${prob * 100}%`, background: '#00d4ff55' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
