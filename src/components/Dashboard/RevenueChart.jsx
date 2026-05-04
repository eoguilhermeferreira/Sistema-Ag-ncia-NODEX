import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { WINE, BG2, BG3, BORDER, TEXT, MUTED } from '../../constants';
import { fmt, fmtShort } from '../../utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const btnBase = {
  display: 'inline-flex', alignItems: 'center',
  border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
  fontWeight: 600, letterSpacing: '0.04em', borderRadius: 8, transition: 'all 0.18s ease',
};

const GRAN_OPTS = [
  { v: 'day', l: 'Dia' },
  { v: 'week', l: 'Semana' },
  { v: 'month', l: 'Mês' },
];

export function RevenueChart({ services, dateFrom, dateTo }) {
  const [granularity, setGranularity] = useState('day');

  const chartData = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom + 'T00:00:00') : new Date('2020-01-01');
    const to = dateTo ? new Date(dateTo + 'T23:59:59') : new Date('2099-01-01');

    const filtered = services
      .filter((s) => s.status === 'Concluído' && s.date)
      .filter((s) => {
        const d = new Date(s.date + 'T00:00:00');
        return d >= from && d <= to;
      });

    const getKey = (dateStr) => {
      const d = new Date(dateStr + 'T00:00:00');
      if (granularity === 'day') return dateStr;
      if (granularity === 'week') {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const mon = new Date(d);
        mon.setDate(diff);
        return mon.toISOString().slice(0, 10);
      }
      return dateStr.slice(0, 7);
    };

    const map = {};
    filtered.forEach((s) => {
      const k = getKey(s.date);
      map[k] = (map[k] ?? 0) + s.value;
    });

    const keys = Object.keys(map).sort();
    const labels = keys.map((k) => {
      if (granularity === 'month') {
        const [y, m] = k.split('-');
        return new Date(+y, +m - 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      }
      if (granularity === 'week') {
        return `Sem. ${new Date(k + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`;
      }
      return new Date(k + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    });

    return { labels, values: keys.map((k) => map[k]) };
  }, [services, dateFrom, dateTo, granularity]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Faturamento',
        data: chartData.values,
        borderColor: WINE,
        borderWidth: 2.5,
        pointBackgroundColor: WINE,
        pointBorderColor: '#0A0A0A',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return WINE + '00';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, WINE + '55');
          gradient.addColorStop(1, WINE + '00');
          return gradient;
        },
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: BG3,
        borderColor: BORDER, borderWidth: 1,
        titleColor: MUTED, bodyColor: TEXT,
        callbacks: { label: (ctx) => fmt(ctx.raw) },
      },
    },
    scales: {
      x: { grid: { color: BORDER }, ticks: { color: MUTED, font: { family: 'Syne' } } },
      y: {
        grid: { color: BORDER + '88' },
        ticks: { color: MUTED, font: { family: 'Syne' }, callback: (v) => fmtShort(v) },
      },
    },
  };

  return (
    <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Faturamento</div>
        <div style={{ display: 'flex', gap: 4, background: BG2, borderRadius: 8, padding: 3 }}>
          {GRAN_OPTS.map((o) => (
            <button
              key={o.v}
              onClick={() => setGranularity(o.v)}
              style={{
                ...btnBase,
                background: granularity === o.v ? WINE : 'transparent',
                color: granularity === o.v ? TEXT : MUTED,
                padding: '6px 14px', fontSize: 12,
              }}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 260 }}>
        {chartData.labels.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: 13 }}>
            Sem dados para exibir
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}
