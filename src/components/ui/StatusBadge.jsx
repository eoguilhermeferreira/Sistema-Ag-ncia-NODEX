import { STATUS_COLORS } from '../../constants';

export function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] ?? '#888';
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
      background: color + '22',
      color,
      border: `1px solid ${color}44`,
    }}>
      {status}
    </span>
  );
}
