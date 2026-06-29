import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, width = '680px' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="glass-card-elevated w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          maxWidth: width,
          maxHeight: '90vh',
          border: '1px solid #2a4f7f',
          boxShadow: '0 0 60px rgba(0,212,255,0.1), 0 25px 50px rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: '#1e3a5f', color: '#94a3b8' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,51,102,0.15)'; e.currentTarget.style.color = '#ff3366'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1e3a5f'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
