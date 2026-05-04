import { BG3, BORDER, MUTED } from '../../constants';
import { Icon } from './Icon';

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
  fontWeight: 600, fontSize: 13, borderRadius: 8, transition: 'all 0.18s ease',
};

export function Modal({ title, onClose, children, wide }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: BG3, border: `1px solid ${BORDER}`,
          borderRadius: 16, padding: 'clamp(20px,4vw,32px)',
          width: '100%', maxWidth: wide ? 560 : 480,
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ ...btnBase, background: 'transparent', color: MUTED, padding: 4 }}>
            <Icon name="close" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
