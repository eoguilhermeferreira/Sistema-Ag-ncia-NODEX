import { MUTED } from '../../constants';

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.08em', color: MUTED,
        textTransform: 'uppercase', marginBottom: 8,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}
