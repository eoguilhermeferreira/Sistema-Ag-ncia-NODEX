import { WINE, TEXT, MUTED, BORDER } from '../../constants';

const base = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Syne, sans-serif',
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: '0.04em',
  borderRadius: 8,
  transition: 'all 0.18s ease',
};

const variants = {
  primary: (small) => ({ background: WINE, color: TEXT, padding: small ? '8px 16px' : '11px 22px' }),
  ghost: (small) => ({ background: 'transparent', color: MUTED, border: `1px solid ${BORDER}`, padding: small ? '7px 15px' : '10px 21px' }),
  danger: (small) => ({ background: '#1a0a0a', color: '#e05050', border: '1px solid #3a1818', padding: small ? '7px 15px' : '10px 21px' }),
};

export function Btn({ children, onClick, variant = 'primary', small, fullWidth, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        ...variants[variant](small),
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}
