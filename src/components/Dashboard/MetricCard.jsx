import { WINE, BG3, BORDER, MUTED, TEXT } from '../../constants';

export function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: BG3, border: `1px solid ${BORDER}`,
      borderRadius: 14, padding: '22px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: accent ?? WINE, borderRadius: '14px 14px 0 0',
      }} />
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: MUTED, textTransform: 'uppercase', marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: TEXT, fontFamily: 'Arial' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
