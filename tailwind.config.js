/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050a14',
          secondary: '#0d1526',
          card: '#111e35',
          elevated: '#162240',
        },
        accent: {
          cyan: '#00d4ff',
          'cyan-dim': '#00a8cc',
          red: '#ff3366',
          'red-dim': '#cc2952',
          amber: '#ffb800',
          'amber-dim': '#cc9300',
          green: '#00ff88',
          'green-dim': '#00cc6a',
          purple: '#a855f7',
          'purple-dim': '#8844cc',
        },
        border: {
          DEFAULT: '#1e3a5f',
          bright: '#2a4f7f',
          glow: '#00d4ff33',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#64748b',
          dim: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-red': '0 0 20px rgba(255, 51, 102, 0.3)',
        'glow-amber': '0 0 20px rgba(255, 184, 0, 0.3)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(0, 212, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scan-line': 'scanLine 4s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 212, 255, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 212, 255, 0.5)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
