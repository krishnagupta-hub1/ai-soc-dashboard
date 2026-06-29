import { useState } from 'react';
import { ClipboardList, Download, Printer, Clock, AlertTriangle, Shield, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { mockReports, reportStats } from '../data/mockReports';
import SeverityBadge, { StatusBadge } from '../components/ui/SeverityBadge';

const sevTimelineColor = { critical: '#ff3366', high: '#ffb800', medium: '#a855f7', low: '#00d4ff', info: '#64748b' };

function handlePrint(report) {
  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #333; padding: 40px; max-width: 900px; margin: 0 auto; }
          h1 { font-size: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { font-size: 15px; margin-top: 24px; color: #555; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; }
          .meta-item { background: #f5f5f5; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
          .meta-item .label { color: #888; font-size: 10px; margin-bottom: 2px; }
          .timeline-item { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 12px; }
          .badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; display: inline-block; }
          ul { font-size: 13px; line-height: 1.8; }
          @media print { @page { margin: 20mm; } }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <p style="color:#888;font-size:13px;">Generated: ${new Date(report.generatedAt).toLocaleString()} | Analyst: ${report.analyst} | Reviewed by: ${report.reviewedBy || 'N/A'}</p>
        <h2>Executive Summary</h2>
        <p style="font-size:13px;line-height:1.7;">${report.executiveSummary}</p>
        <h2>Incident Timeline</h2>
        ${report.timeline.map(t => `<div class="timeline-item"><strong>${new Date(t.time).toLocaleTimeString()}</strong> — ${t.event}</div>`).join('')}
        <h2>Recommendations</h2>
        <ul>${(report.recommendations || []).map(r => `<li>${r}</li>`).join('')}</ul>
        <h2>Indicators of Compromise</h2>
        ${(report.iocList || []).map(ioc => `<div class="timeline-item"><strong>${ioc.type}:</strong> ${ioc.value} — ${ioc.description}</div>`).join('')}
        <h2>Lessons Learned</h2>
        <ul>${(report.lessonsLearned || []).map(l => `<li>${l}</li>`).join('')}</ul>
        <script>window.print(); window.close();</script>
      </body>
    </html>
  `);
  win.document.close();
}

function ReportViewer({ report }) {
  const [openSection, setOpenSection] = useState('summary');
  const sections = ['summary', 'timeline', 'assets', 'recommendations', 'iocs', 'breach'];
  const sectionLabel = { summary: 'Executive Summary', timeline: 'Attack Timeline', assets: 'Affected Assets', recommendations: 'Recommendations', iocs: 'Indicators of Compromise', breach: 'Data Breach Details' };

  return (
    <div className="space-y-3">
      {/* Report meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ['Report ID', report.id],
          ['Generated', new Date(report.generatedAt).toLocaleDateString()],
          ['Analyst', report.analyst],
          ['Status', report.status],
        ].map(([k, v]) => (
          <div key={k} className="p-3 rounded-lg" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
            <p className="text-xs text-text-muted mb-0.5">{k}</p>
            <p className="text-sm font-medium text-text-primary">{v}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      {sections.map(sec => (
        <div key={sec} className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
            onClick={() => setOpenSection(openSection === sec ? null : sec)}
          >
            <span className="text-sm font-semibold text-text-primary">{sectionLabel[sec]}</span>
            {openSection === sec ? <ChevronDown size={14} style={{ color: '#64748b' }} /> : <ChevronRight size={14} style={{ color: '#64748b' }} />}
          </button>
          {openSection === sec && (
            <div className="px-5 pb-5 pt-1 border-t border-border">
              {sec === 'summary' && (
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{report.executiveSummary}</p>
              )}
              {sec === 'timeline' && (
                <div className="relative mt-2">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, #00d4ff, #ff3366)' }} />
                  <div className="space-y-2">
                    {report.timeline.map((t, i) => (
                      <div key={i} className="flex gap-4 pl-8 relative">
                        <div className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full"
                          style={{ background: sevTimelineColor[t.severity] || '#64748b', boxShadow: `0 0 6px ${sevTimelineColor[t.severity] || '#64748b'}` }} />
                        <div>
                          <p className="text-xs font-mono text-text-muted">{new Date(t.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                          <p className="text-xs text-text-secondary mt-0.5">{t.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sec === 'assets' && (
                <div className="space-y-2 mt-1">
                  {report.affectedAssets.map(a => (
                    <div key={a.asset} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                      <SeverityBadge severity={a.severity} />
                      <span className="text-sm font-medium text-text-primary">{a.asset}</span>
                      <span className="text-xs text-text-muted ml-auto">{a.impact}</span>
                    </div>
                  ))}
                </div>
              )}
              {sec === 'recommendations' && (
                <ul className="space-y-1.5 mt-1">
                  {(report.recommendations || []).map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span style={{ color: '#00d4ff', flexShrink: 0 }}>→</span>
                      <span style={{ color: '#94a3b8' }}>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sec === 'iocs' && (
                <div className="space-y-2 mt-1">
                  {(report.iocList || []).map((ioc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg font-mono text-xs" style={{ background: '#060e1c', border: '1px solid #1e3a5f' }}>
                      <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>{ioc.type}</span>
                      <span style={{ color: '#ff3366' }}>{ioc.value}</span>
                      <span style={{ color: '#64748b' }}>— {ioc.description}</span>
                    </div>
                  ))}
                </div>
              )}
              {sec === 'breach' && report.dataBreachDetails && (
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    ['Records Affected', report.dataBreachDetails.recordsAffected?.toLocaleString()],
                    ['GDPR Article 33', report.dataBreachDetails.gdprArticle33 ? 'Required' : 'Not Required'],
                    ['Notification', report.dataBreachDetails.notificationRequired ? 'Required' : 'Not Required'],
                    ['Law Enforcement', report.dataBreachDetails.lawEnforcementNotified ? 'Notified' : 'Not Yet'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-lg" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                      <p className="text-xs text-text-muted mb-0.5">{k}</p>
                      <p className="text-sm font-medium text-text-primary">{v}</p>
                    </div>
                  ))}
                  <div className="col-span-2 p-3 rounded-lg" style={{ background: '#0d1526', border: '1px solid #1e3a5f' }}>
                    <p className="text-xs text-text-muted mb-1">Data Types Exposed</p>
                    <div className="flex flex-wrap gap-1">
                      {(report.dataBreachDetails.dataTypes || []).map(dt => (
                        <span key={dt} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,51,102,0.1)', color: '#ff3366', border: '1px solid rgba(255,51,102,0.2)' }}>{dt}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function IncidentReports() {
  const [selectedId, setSelectedId] = useState(mockReports[0].id);
  const report = mockReports.find(r => r.id === selectedId);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Incident Reports</h2>
          <p className="text-sm text-text-muted">Automated forensic documentation and export</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost flex items-center gap-2 text-sm" onClick={() => report && handlePrint(report)}>
            <Printer size={14} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', val: reportStats.totalReports, color: '#00d4ff' },
          { label: 'This Month', val: reportStats.thisMonth, color: '#a855f7' },
          { label: 'Data Breach Reports', val: reportStats.withDataBreach, color: '#ff3366' },
          { label: 'Avg Generation Time', val: reportStats.avgGenerationTime, color: '#00ff88' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass-card p-4 text-center" style={{ border: `1px solid ${color}22` }}>
            <p className="text-2xl font-bold" style={{ color }}>{val}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Report list */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted px-1">Reports</h3>
          {mockReports.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className="w-full text-left p-4 rounded-xl transition-all"
              style={{
                background: selectedId === r.id ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selectedId === r.id ? 'rgba(0,212,255,0.3)' : '#1e3a5f'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <SeverityBadge severity={r.severity} />
                <StatusBadge status={r.status} />
              </div>
              <p className="text-xs font-mono" style={{ color: '#00d4ff' }}>{r.id}</p>
              <p className="text-xs text-text-primary mt-0.5 font-medium leading-tight">{r.title.slice(0, 60)}...</p>
              <p className="text-xs text-text-muted mt-1">{r.analyst} · {new Date(r.generatedAt).toLocaleDateString()}</p>
            </button>
          ))}
        </div>

        {/* Report content */}
        <div className="lg:col-span-3">
          {report ? (
            <>
              <div className="glass-card p-5 mb-4"
                style={{ border: '1px solid rgba(0,212,255,0.15)', background: 'linear-gradient(135deg, rgba(0,212,255,0.03), rgba(17,30,53,0.95))' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={report.severity} />
                      <StatusBadge status={report.status} />
                      {report.dataBreachDetails?.notificationRequired && (
                        <span className="badge-critical">Data Breach</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-text-primary leading-tight">{report.title}</h3>
                    <p className="text-xs text-text-muted mt-1">
                      {report.analyst} · Reviewed by {report.reviewedBy} · {new Date(report.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-bold" style={{ color: '#ff3366' }}>{report.technicalDetails?.cvssScore}</p>
                    <p className="text-xs text-text-muted">CVSS Score</p>
                  </div>
                </div>
              </div>
              <ReportViewer report={report} />
            </>
          ) : (
            <div className="glass-card p-20 text-center">
              <FileText size={40} style={{ color: '#1e3a5f', margin: '0 auto 16px' }} />
              <p className="text-text-muted">Select a report to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
