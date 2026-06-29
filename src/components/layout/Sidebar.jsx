import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Brain, Bell, Filter,
  Globe, GitBranch, Lightbulb, ClipboardList, Settings,
  ChevronLeft, ChevronRight, Shield, Activity, Zap
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { path: '/logs', icon: FileText, label: 'Log Management', badge: '500' },
  { path: '/anomalies', icon: Brain, label: 'Anomaly Detection', badge: '80' },
  { path: '/alerts', icon: Bell, label: 'Alert Management', badge: '12', badgeColor: 'red' },
  { path: '/triage', icon: Filter, label: 'Alert Triage', badge: '5', badgeColor: 'amber' },
  { path: '/threat-intel', icon: Globe, label: 'Threat Intelligence', badge: null },
  { path: '/rca', icon: GitBranch, label: 'Root Cause Analysis', badge: null },
  { path: '/recommendations', icon: Lightbulb, label: 'Recommendations', badge: '3', badgeColor: 'green' },
  { path: '/reports', icon: ClipboardList, label: 'Incident Reports', badge: null },
  { path: '/admin', icon: Settings, label: 'System Admin', badge: null },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-40"
      style={{
        width: collapsed ? '72px' : '260px',
        background: 'linear-gradient(180deg, #0a1628 0%, #060e1c 100%)',
        borderRight: '1px solid #1e3a5f',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border" style={{ minHeight: 72 }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #00d4ff22, #00d4ff44)', border: '1px solid #00d4ff44' }}>
          <Shield size={20} style={{ color: '#00d4ff' }} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold text-sm tracking-wider" style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.4)' }}>
              AI-SOC
            </div>
            <div className="text-xs text-text-muted tracking-widest">PLATFORM v2.0</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors"
          style={{ background: '#1e3a5f', color: '#64748b' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Status indicator */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)' }}>
          <span className="status-dot online animate-pulse-slow" />
          <span className="text-xs font-medium" style={{ color: '#00ff88' }}>System Online</span>
          <Activity size={12} className="ml-auto" style={{ color: '#00ff88' }} />
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 group relative"
              style={{
                background: isActive ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: isActive ? '#00d4ff' : '#94a3b8',
                borderLeft: isActive ? '2px solid #00d4ff' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(0,212,255,0.05)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <item.icon
                size={18}
                style={{ flexShrink: 0, filter: isActive ? 'drop-shadow(0 0 6px #00d4ff)' : 'none' }}
              />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className="ml-auto text-xs px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        background: item.badgeColor === 'red'
                          ? 'rgba(255,51,102,0.2)' : item.badgeColor === 'amber'
                          ? 'rgba(255,184,0,0.2)' : item.badgeColor === 'green'
                          ? 'rgba(0,255,136,0.2)' : 'rgba(0,212,255,0.15)',
                        color: item.badgeColor === 'red'
                          ? '#ff3366' : item.badgeColor === 'amber'
                          ? '#ffb800' : item.badgeColor === 'green'
                          ? '#00ff88' : '#00d4ff',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{
                    background: item.badgeColor === 'red' ? '#ff3366' : '#00d4ff',
                    color: '#fff',
                    fontSize: '9px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        {collapsed ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', color: '#050a14', fontWeight: 700, fontSize: 12 }}>
            AC
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', color: '#050a14', fontWeight: 700, fontSize: 12 }}>
              AC
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-text-primary">Alice Chen</div>
              <div className="text-xs text-text-muted">Senior Analyst</div>
            </div>
            <Zap size={14} className="ml-auto" style={{ color: '#ffb800' }} />
          </div>
        )}
      </div>
    </aside>
  );
}
