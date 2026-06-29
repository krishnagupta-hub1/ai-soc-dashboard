import { useState } from 'react';
import { GitBranch, ChevronDown, AlertCircle, Link, Clock, CheckCircle, Database, Cpu, BookOpen, Target } from 'lucide-react';
import { rcaIncidents } from '../data/mockRCA';
import SeverityBadge, { StatusBadge } from '../components/ui/SeverityBadge';

const phaseColors = {
  Reconnaissance: '#00d4ff',
  'Initial Access': '#ffb800',
  'Credential Access': '#a855f7',
  'Lateral Movement': '#ff3366',
  Collection: '#f97316',
  Exfiltration: '#ff3366',
  Detection: '#00ff88',
};

const sevBg = {
  critical: 'rgba(255,51,102,0.12)',
  high: 'rgba(255,184,0,0.12)',
  medium: 'rgba(168,85,247,0.12)',
  low: 'rgba(0,212,255,0.12)',
  info: 'rgba(100,116,139,0.12)',
};

function ConfidenceRing({ value }) {
  const pct = Math.round(value * 100);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 90 ? '#00ff88' : pct >= 75 ? '#ffb800' : '#ff3366';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="90" height="90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#1e3a5f" strokeWidth="6" />
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div className="absolute text-center">
        <p className="text-lg font-bold" style={{ color }}>{pct}%</p>
        <p className="text-xs text-text-muted" style={{ fontSize: 9 }}>Confidence</p>
      </div>
    </div>
  );
}

export default function RootCauseAnalysis() {
  const [selectedId, setSelectedId] = useState(rcaIncidents[0].id);
  const incident = rcaIncidents.find(i => i.id === selectedId);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Root Cause Analysis</h2>
          <p className="text-sm text-text-muted">RAG + LLM powered incident investigation</p>
        </div>
        {/* Incident selector */}
        <div className="relative">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="input-dark pr-8 appearance-none cursor-pointer font-medium"
            style={{ minWidth: 320 }}
          >
            {rcaIncidents.map(inc => (
              <option key={inc.id} value={inc.id}>{inc.id} — {inc.title.slice(0, 45)}...</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#64748b' }} />
        </div>
      </div>

      {incident && (
        <>
          {/* Incident header */}
          <div className="glass-card p-5" style={{ border: '1px solid rgba(255,51,102,0.2)', background: 'linear-gradient(135deg, rgba(255,51,102,0.05), rgba(17,30,53,0.95))' }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>{incident.id}</span>
                  <SeverityBadge severity={incident.severity} />
                  <StatusBadge status={incident.status} />
                </div>
                <h3 className="text-base font-bold text-text-primary">{incident.title}</h3>
                <p className="text-xs text-text-muted mt-1">
                  {incident.attackType} · {new Date(incident.timestamp).toLocaleString()}
                </p>
              </div>
              <ConfidenceRing value={incident.confidence} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* LLM root cause analysis */}
            <div className="lg:col-span-2 space-y-4">
              {/* Root cause */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={16} style={{ color: '#00d4ff' }} />
                  <h3 className="text-sm font-semibold text-text-primary">LLM Root Cause Analysis</h3>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>GPT-4o-RAG</span>
                </div>
                <div className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line"
                  style={{ background: '#060e1c', border: '1px solid #1e3a5f', color: '#94a3b8' }}>
                  {incident.rootCause}
                </div>
              </div>

              {/* Attack chain */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch size={16} style={{ color: '#a855f7' }} />
                  <h3 className="text-sm font-semibold text-text-primary">Attack Chain</h3>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, #00d4ff, #ff3366)' }} />
                  <div className="space-y-3">
                    {incident.attackChain.map((step, i) => {
                      const phaseCol = phaseColors[step.phase] || '#64748b';
                      const sevBgColor = sevBg[step.severity] || sevBg.info;
                      return (
                        <div key={step.step} className="flex gap-4 pl-10 relative">
                          {/* Node */}
                          <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full border-2 flex-shrink-0"
                            style={{ background: phaseCol, borderColor: phaseCol, boxShadow: `0 0 8px ${phaseCol}` }} />
                          <div className="flex-1 p-3 rounded-lg" style={{ background: sevBgColor, border: `1px solid ${phaseCol}22` }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold" style={{ color: phaseCol }}>Step {step.step}: {step.phase}</span>
                              {step.mitre && (
                                <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff' }}>{step.mitre}</span>
                              )}
                            </div>
                            <p className="text-xs" style={{ color: '#94a3b8' }}>{step.description}</p>
                            <p className="text-xs font-mono mt-1" style={{ color: '#475569' }}>
                              {new Date(step.timestamp).toLocaleTimeString('en-US', { hour12: false })} UTC
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Database size={16} style={{ color: '#ffb800' }} />
                  <h3 className="text-sm font-semibold text-text-primary">Related Evidence ({incident.relatedEvidence.length})</h3>
                </div>
                <div className="space-y-2">
                  {incident.relatedEvidence.map(ev => (
                    <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                      <span className="text-xs px-2 py-0.5 rounded font-mono"
                        style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff' }}>{ev.type}</span>
                      <span className="font-mono text-xs" style={{ color: '#a855f7' }}>{ev.id}</span>
                      <span className="text-xs flex-1" style={{ color: '#94a3b8' }}>{ev.description}</span>
                      <SeverityBadge severity={ev.severity} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Similar incidents */}
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} style={{ color: '#ffb800' }} />
                  <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Similar Incidents</h3>
                </div>
                <div className="space-y-2">
                  {incident.similarIncidents.map(sim => (
                    <div key={sim.id} className="p-3 rounded-lg cursor-pointer hover:bg-white/[0.03] transition-colors"
                      style={{ border: '1px solid #1e3a5f' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs" style={{ color: '#00d4ff' }}>{sim.id}</span>
                        <span className="text-xs font-bold" style={{ color: '#00ff88' }}>{Math.round(sim.similarity * 100)}% match</span>
                      </div>
                      <p className="text-xs text-text-secondary">{sim.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-text-muted">{sim.date}</span>
                        <span className="text-xs" style={{ color: sim.outcome === 'Blocked' ? '#00ff88' : '#ff3366' }}>{sim.outcome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RAG sources */}
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} style={{ color: '#a855f7' }} />
                  <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">RAG Sources</h3>
                </div>
                <div className="space-y-2">
                  {incident.ragSources.map((src, i) => (
                    <div key={i} className="p-3 rounded-lg" style={{ border: '1px solid #1e3a5f' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                          {src.type}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: '#00d4ff' }}>{Math.round(src.relevance * 100)}%</span>
                      </div>
                      <p className="text-xs text-text-secondary">{src.source}</p>
                      <div className="h-1 rounded-full mt-1.5" style={{ background: '#1e3a5f' }}>
                        <div className="h-full rounded-full" style={{ width: `${src.relevance * 100}%`, background: '#a855f7' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LLM metadata */}
              <div className="glass-card p-4" style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={14} style={{ color: '#00d4ff' }} />
                  <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Analysis Metadata</h3>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    ['Model', 'GPT-4o + RAG'],
                    ['Documents Retrieved', incident.ragSources.length],
                    ['Evidence Items', incident.relatedEvidence.length],
                    ['Similar Incidents', incident.similarIncidents.length],
                    ['Confidence', `${Math.round(incident.confidence * 100)}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span style={{ color: '#64748b' }}>{k}</span>
                      <span style={{ color: '#94a3b8', fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
