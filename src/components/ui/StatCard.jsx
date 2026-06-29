import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'cyan', trend, trendValue, className = '' }) {
  const colorMap = {
    cyan: { text: '#00d4ff', bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)', glow: '0 0 20px rgba(0,212,255,0.1)' },
    red: { text: '#ff3366', bg: 'rgba(255,51,102,0.08)', border: 'rgba(255,51,102,0.2)', glow: '0 0 20px rgba(255,51,102,0.1)' },
    amber: { text: '#ffb800', bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.2)', glow: '0 0 20px rgba(255,184,0,0.1)' },
    green: { text: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.2)', glow: '0 0 20px rgba(0,255,136,0.1)' },
    purple: { text: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', glow: '0 0 20px rgba(168,85,247,0.1)' },
  };
  const c = colorMap[color] || colorMap.cyan;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#ff3366' : trend === 'down' ? '#00ff88' : '#64748b';

  return (
    <div
      className={`glass-card p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200 ${className}`}
      style={{ border: `1px solid ${c.border}`, boxShadow: c.glow }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748b' }}>{title}</p>
          <p className="text-3xl font-bold mt-1" style={{ color: c.text, textShadow: `0 0 20px ${c.text}44` }}>
            {value}
          </p>
          {subtitle && <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>{subtitle}</p>}
        </div>
        {Icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <Icon size={22} style={{ color: c.text }} />
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: trendColor }}>
          <TrendIcon size={13} />
          <span>{trendValue}</span>
          <span style={{ color: '#64748b' }}>vs last 24h</span>
        </div>
      )}
    </div>
  );
}
