import { WINE, WINE_LIGHT, BG3, BORDER, TEXT, MUTED, GOALS } from '../../constants';
import { fmt, fmtShort } from '../../utils';
import { Icon } from '../ui/Icon';

export function GoalBar({ total, isMobile }) {
  const currentGoalIdx = GOALS.findIndex((g) => total < g);
  const isMaxed = currentGoalIdx === -1;
  const nextGoal = isMaxed ? GOALS[GOALS.length - 1] : GOALS[currentGoalIdx];
  const prevGoal = currentGoalIdx <= 0 ? 0 : GOALS[currentGoalIdx - 1];
  const progress = isMaxed ? 100 : Math.min(100, ((total - prevGoal) / (nextGoal - prevGoal)) * 100);

  return (
    <div style={{
      background: BG3, border: `1px solid ${BORDER}`,
      borderRadius: 12, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      width: isMobile ? '100%' : undefined,
      minWidth: isMobile ? 0 : 320,
    }}>
      <Icon name="trophy" size={18} color={WINE} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginBottom: 6, letterSpacing: '0.04em' }}>
          <span>META</span>
          <span style={{ color: TEXT, fontWeight: 600, fontFamily: 'sans-serif' }}>{fmtShort(nextGoal)}</span>
        </div>
        <div style={{ height: 6, background: BORDER, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${WINE}, ${WINE_LIGHT})`,
            width: `${progress}%`, transition: 'width 0.8s ease',
            boxShadow: `0 0 8px ${WINE}88`,
          }} />
        </div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 4, fontFamily: 'sans-serif' }}>
          {fmt(total)} <span style={{ color: WINE }}>↑</span> {fmtShort(nextGoal)}
        </div>
      </div>
    </div>
  );
}
