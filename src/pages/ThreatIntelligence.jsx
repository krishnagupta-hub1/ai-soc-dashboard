import { useState } from 'react';
import { Globe, Shield, BookOpen, Database, AlertCircle, ChevronDown, ChevronRight, ExternalLink, Clock } from 'lucide-react';
import { mitreAttackTechniques, cisaAdvisories, historicalIncidents, securityPlaybooks, vulnerabilities, threatActors } from '../data/mockThreatIntel';
import SeverityBadge from '../components/ui/SeverityBadge';

const tabs = [
  { id: 'mitre', label: 'MITRE ATT&CK', icon: Target },
  { id: 'cisa', label: 'CISA Advisories', icon: AlertCircle },
  { id: 'historical', label: 'Historical Incidents', icon: Clock },
  { id: 'playbooks', label: 'Playbooks', icon: BookOpen },
  { id: 'cve', label: 'Vulnerabilities', icon: Database },
  { id: 'actors', label: 'Threat Actors', icon: Globe },
];

import { Target } from 'lucide-react';

function MitreMatrix({ techniques }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {techniques.map(t => (
          <div key={t.id} className="glass-card p-4 hover:scale-[1.01] transition-transform"
            style={{ border: `1px solid ${t.detected ? 'rgba(255,51,102,0.2)' : 'rgba(30,58,95,0.5)'}` }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>{t.id}</span>
                  <SeverityBadge severity={t.severity} />
                  {t.detected && (
                    <span className="badge-critical">Detected</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{t.tactic}</p>
              </div>
              {t.detected && (
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold" style={{ color: '#ff3366' }}>{t.count}</p>
                  <p className="text-xs text-text-muted">events</p>
                </div>
              )}
            </div>
            <p className="text-xs text-text-muted mt-2 leading-relaxed line-clamp-2">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaybookAccordion({ playbooks }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {playbooks.map(pb => (
        <div key={pb.id} className="glass-card overflow-hidden" style={{ border: '1px solid #1e3a5f' }}>
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
            onClick={() => setOpen(open === pb.id ? null : pb.id)}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={16} style={{ color: '#00d4ff', flexShrink: 0 }} />
              <div>
                <p className="text-sm font-semibold text-text-primary">{pb.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted">{pb.category}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: pb.automatable ? 'rgba(0,255,136,0.1)' : 'rgba(255,184,0,0.1)', color: pb.automatable ? '#00ff88' : '#ffb800' }}>
                    {pb.automatable ? '⚡ Automatable' : '👤 Manual'}
                  </span>
                  <span className="text-xs text-text-muted">ETA: {pb.estimatedTime}</span>
                </div>
              </div>
            </div>
            {open === pb.id ? <ChevronDown size={16} style={{ color: '#64748b' }} /> : <ChevronRight size={16} style={{ color: '#64748b' }} />}
          </button>
          {open === pb.id && (
            <div className="px-5 pb-4" style={{ borderTop: '1px solid #1e3a5f' }}>
              <ol className="mt-3 space-y-2">
                {pb.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>{i + 1}</span>
                    <span style={{ color: '#94a3b8' }}>{step}</span>
                  </li>
                ))}
              </ol>
              <button className="btn-primary mt-4 text-xs">Execute Playbook</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ThreatIntelligence() {
  const [activeTab, setActiveTab] = useState('mitre');

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Threat Intelligence</h2>
        <p className="text-sm text-text-muted">Integrated cybersecurity knowledge base — MITRE ATT&CK, CISA, CVEs, Playbooks</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-3 text-center" style={{ border: '1px solid rgba(255,51,102,0.2)' }}>
          <p className="text-2xl font-bold" style={{ color: '#ff3366' }}>{mitreAttackTechniques.filter(t => t.detected).length}</p>
          <p className="text-xs text-text-muted mt-0.5">MITRE Techniques Detected</p>
        </div>
        <div className="glass-card p-3 text-center" style={{ border: '1px solid rgba(255,184,0,0.2)' }}>
          <p className="text-2xl font-bold" style={{ color: '#ffb800' }}>{cisaAdvisories.length}</p>
          <p className="text-xs text-text-muted mt-0.5">Active CISA Advisories</p>
        </div>
        <div className="glass-card p-3 text-center" style={{ border: '1px solid rgba(168,85,247,0.2)' }}>
          <p className="text-2xl font-bold" style={{ color: '#a855f7' }}>{vulnerabilities.filter(v => !v.patched).length}</p>
          <p className="text-xs text-text-muted mt-0.5">Unpatched CVEs</p>
        </div>
        <div className="glass-card p-3 text-center" style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
          <p className="text-2xl font-bold" style={{ color: '#00d4ff' }}>{threatActors.filter(a => a.active).length}</p>
          <p className="text-xs text-text-muted mt-0.5">Active Threat Actors</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap" style={{ borderBottom: '1px solid #1e3a5f' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all relative"
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

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'mitre' && <MitreMatrix techniques={mitreAttackTechniques} />}

        {activeTab === 'cisa' && (
          <div className="space-y-3">
            {cisaAdvisories.map(adv => (
              <div key={adv.id} className="glass-card p-5" style={{ border: `1px solid ${adv.severity === 'Critical' ? 'rgba(255,51,102,0.2)' : 'rgba(255,184,0,0.15)'}` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>{adv.id}</span>
                      <SeverityBadge severity={adv.severity} />
                      <span className="text-xs" style={{ color: '#ff3366', fontWeight: 700 }}>CVSS {adv.cvss}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">{adv.title}</h4>
                    <p className="text-xs text-text-muted mt-1">{adv.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {adv.affectedSystems.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-text-muted">{adv.date}</p>
                    <button className="mt-2 flex items-center gap-1 text-xs" style={{ color: '#00d4ff' }}>
                      View <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'historical' && (
          <div className="space-y-3">
            {historicalIncidents.map(inc => (
              <div key={inc.id} className="glass-card p-4 flex items-start gap-4">
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: inc.severity === 'Critical' ? '#ff3366' : '#ffb800' }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs" style={{ color: '#00d4ff' }}>{inc.id}</span>
                    <SeverityBadge severity={inc.severity} />
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>{inc.type}</span>
                    <span className="text-xs" style={{ color: inc.resolved ? '#00ff88' : '#ff3366' }}>{inc.resolved ? '✓ Resolved' : '⚠ Ongoing'}</span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary">{inc.title}</p>
                  <p className="text-xs text-text-muted mt-1">{inc.impact}</p>
                </div>
                <div className="text-xs text-text-muted flex-shrink-0">{inc.date}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'playbooks' && <PlaybookAccordion playbooks={securityPlaybooks} />}

        {activeTab === 'cve' && (
          <div className="glass-card overflow-hidden">
            <div className="overflow-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>CVE ID</th>
                    <th>CVSS</th>
                    <th>Severity</th>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Patched</th>
                    <th>Exploited</th>
                  </tr>
                </thead>
                <tbody>
                  {vulnerabilities.map(v => (
                    <tr key={v.cve}>
                      <td><span className="font-mono text-xs" style={{ color: '#00d4ff' }}>{v.cve}</span></td>
                      <td>
                        <span className="font-bold text-sm" style={{ color: v.cvss >= 9 ? '#ff3366' : v.cvss >= 7 ? '#ffb800' : '#a855f7' }}>
                          {v.cvss}
                        </span>
                      </td>
                      <td><SeverityBadge severity={v.severity} /></td>
                      <td><span className="text-xs text-text-secondary">{v.product}</span></td>
                      <td><span className="text-xs text-text-muted">{v.description}</span></td>
                      <td>
                        <span className={v.patched ? '' : 'badge-critical'} style={{ color: v.patched ? '#00ff88' : undefined, fontSize: 12, fontWeight: 600 }}>
                          {v.patched ? '✓ Yes' : '✗ No'}
                        </span>
                      </td>
                      <td>
                        {v.exploited && <span className="badge-critical">Active</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'actors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatActors.map(actor => (
              <div key={actor.name} className="glass-card p-5" style={{ border: `1px solid ${actor.active ? 'rgba(255,51,102,0.2)' : 'rgba(30,58,95,0.5)'}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-text-primary">{actor.name}</p>
                    <p className="text-xs text-text-muted">{actor.origin} · {actor.motivation}</p>
                  </div>
                  <span className={actor.active ? 'badge-critical' : 'badge-info'}>{actor.active ? 'Active' : 'Dormant'}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {actor.techniques.map(t => (
                    <span key={t} className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.15)' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
