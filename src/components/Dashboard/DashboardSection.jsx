import { useState, useEffect, useRef } from 'react';
import { WINE, BG3, BORDER, MUTED, GOALS } from '../../constants';
import { fmt, fmtShort, load, save, launchConfetti } from '../../utils';
import { inputStyle } from '../ui/inputStyle';
import { Btn } from '../ui/Btn';
import { GoalBar } from './GoalBar';
import { MetricCard } from './MetricCard';
import { RevenueChart } from './RevenueChart';

export function DashboardSection({ services, cashEntries, isMobile }) {
  const today = new Date().toISOString().slice(0, 10);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState(today);
  const [toast, setToast] = useState(null);
  const prevGoalRef = useRef(load('nodex_last_goal', -1));

  const totalBruto = services.reduce((s, x) => s + x.value, 0);

  useEffect(() => {
    const currentGoalIdx = GOALS.findIndex((g) => totalBruto < g);
    const achieved = currentGoalIdx <= 0 ? 0 : GOALS[currentGoalIdx - 1];
    const prev = prevGoalRef.current;
    if (achieved > prev && achieved > 0) {
      save('nodex_last_goal', achieved);
      prevGoalRef.current = achieved;
      setTimeout(() => {
        launchConfetti();
        setToast({ msg: `🎉 Meta de ${fmtShort(achieved)} atingida!`, sub: 'Parabéns pelo crescimento!' });
        setTimeout(() => setToast(null), 4000);
      }, 300);
    }
  }, [totalBruto]);

  const inRange = (item) => {
    if (!item.date) return true;
    const d = new Date(item.date + 'T00:00:00');
    if (dateFrom && d < new Date(dateFrom + 'T00:00:00')) return false;
    if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false;
    return true;
  };

  const filteredSvcs = services.filter(inRange);
  const filteredCash = cashEntries.filter(inRange);

  const bruto = filteredSvcs.reduce((s, x) => s + x.value, 0);
  const despesas = filteredCash.filter((c) => c.type === 'Saída').reduce((s, x) => s + x.value, 0);
  const liquido = bruto - despesas;
  const entradas = filteredCash.filter((c) => c.type === 'Entrada').reduce((s, x) => s + x.value, 0);
  const lucro = entradas - despesas;

  const concluidos = filteredSvcs.filter((s) => s.status === 'Concluído').length;
  const pendentes = filteredSvcs.filter((s) => s.status === 'Em andamento').length;
  const afazer = filteredSvcs.filter((s) => s.status === 'A fazer').length;

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 16, marginBottom: 28,
      }}>
        <div>
          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Dashboard</div>
          <div style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Visão geral do negócio</div>
        </div>
        <GoalBar total={totalBruto} isMobile={isMobile} />
      </div>

      {/* Date filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Período:</span>
        <input
          type="date" value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={{ ...inputStyle, width: isMobile ? '100%' : 160, flex: isMobile ? '1 1 140px' : undefined }}
          onFocus={(e) => (e.target.style.borderColor = WINE)}
          onBlur={(e) => (e.target.style.borderColor = '#242424')}
        />
        <span style={{ color: MUTED }}>→</span>
        <input
          type="date" value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={{ ...inputStyle, width: isMobile ? '100%' : 160, flex: isMobile ? '1 1 140px' : undefined }}
          onFocus={(e) => (e.target.style.borderColor = WINE)}
          onBlur={(e) => (e.target.style.borderColor = '#242424')}
        />
        {(dateFrom || dateTo !== today) && (
          <Btn variant="ghost" small onClick={() => { setDateFrom(''); setDateTo(today); }}>Limpar</Btn>
        )}
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
        <MetricCard label="Faturamento Bruto" value={fmt(bruto)} sub="Serviços no período" accent={WINE} />
        <MetricCard label="Faturamento Líquido" value={fmt(liquido)} sub="Bruto - despesas" accent="#4A90D9" />
        <MetricCard label="Lucro" value={fmt(lucro)} sub="Entradas - saídas" accent="#4CAF82" />
        <MetricCard label="Concluídos" value={concluidos} sub="Serviços" accent="#4CAF82" />
        <MetricCard label="Em Andamento" value={pendentes} sub="Serviços" accent="#F5A623" />
        <MetricCard label="A Fazer" value={afazer} sub="Serviços" accent="#4A90D9" />
      </div>

      <RevenueChart services={services} dateFrom={dateFrom} dateTo={dateTo} isMobile={isMobile} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24,
          right: isMobile ? 16 : 32,
          left: isMobile ? 16 : 'auto',
          zIndex: 9000,
          background: BG3, border: `1px solid ${WINE}66`,
          borderRadius: 14, padding: '18px 28px',
          boxShadow: `0 24px 48px rgba(0,0,0,0.7), 0 0 0 1px ${WINE}33`,
          animation: 'slideUp 0.3s ease',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{toast.msg}</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{toast.sub}</div>
        </div>
      )}
    </div>
  );
}
