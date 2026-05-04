import { useState } from 'react';
import { WINE, BG3, BORDER, MUTED } from '../../constants';
import { fmt } from '../../utils';
import { Btn } from '../ui/Btn';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { inputStyle } from '../ui/inputStyle';

const emptyForm = () => ({
  type: 'Entrada',
  descricao: '',
  value: '',
  date: new Date().toISOString().slice(0, 10),
});

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
  fontWeight: 600, fontSize: 13, borderRadius: 8, transition: 'all 0.18s ease',
};

function SummaryCard({ label, value, color }) {
  return (
    <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '14px 14px 0 0' }} />
      <div style={{ fontSize: 11, color: MUTED, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: 'Arial' }}>{value}</div>
    </div>
  );
}

export function CashSection({ cashEntries, setCashEntries, isMobile }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const saldo = cashEntries.reduce((s, c) => c.type === 'Entrada' ? s + c.value : s - c.value, 0);
  const totalEntradas = cashEntries.filter((c) => c.type === 'Entrada').reduce((s, c) => s + c.value, 0);
  const totalSaidas = cashEntries.filter((c) => c.type === 'Saída').reduce((s, c) => s + c.value, 0);

  const openNew = () => { setForm(emptyForm()); setModal('new'); };
  const openEdit = (c) => {
    setForm({ type: c.type, descricao: c.descricao, value: String(c.value), date: c.date ?? '' });
    setModal(c.id);
  };

  const handleSave = () => {
    if (!form.descricao.trim() || !form.value) return;
    const entry = {
      id: modal === 'new' ? Date.now() : modal,
      type: form.type,
      descricao: form.descricao.trim(),
      value: parseFloat(form.value) || 0,
      date: form.date,
    };
    setCashEntries(modal === 'new' ? [entry, ...cashEntries] : cashEntries.map((c) => (c.id === modal ? entry : c)));
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Excluir movimentação?')) setCashEntries(cashEntries.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 12, marginBottom: 24,
      }}>
        <div>
          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Gestão de Caixa</div>
          <div style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Controle financeiro</div>
        </div>
        <Btn onClick={openNew}><Icon name="plus" size={14} /> Nova Movimentação</Btn>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <SummaryCard label="Saldo Atual" value={fmt(saldo)} color={saldo >= 0 ? '#4CAF82' : '#e05050'} />
        <SummaryCard label="Total Entradas" value={fmt(totalEntradas)} color="#4CAF82" />
        <SummaryCard label="Total Saídas" value={fmt(totalSaidas)} color="#e05050" />
      </div>

      {/* Table */}
      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 14, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Tipo', 'Descrição', 'Valor', 'Data', ''].map((h) => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: MUTED, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cashEntries.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: MUTED, fontSize: 14 }}>Nenhuma movimentação cadastrada</td></tr>
            )}
            {cashEntries.map((c) => {
              const entryColor = c.type === 'Entrada' ? '#4CAF82' : '#e05050';
              return (
                <tr
                  key={c.id}
                  style={{ borderBottom: `1px solid ${BORDER}88`, transition: 'background 0.15s', background: 'transparent' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff06')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: entryColor }}>
                      <Icon name={c.type === 'Entrada' ? 'arrow_up' : 'arrow_down'} size={13} color={entryColor} />
                      {c.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: MUTED, fontSize: 13 }}>{c.descricao}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: entryColor, fontFamily: 'Arial' }}>
                    {c.type === 'Saída' ? '-' : '+'}{fmt(c.value)}
                  </td>
                  <td style={{ padding: '14px 20px', color: MUTED, fontSize: 13, fontFamily: 'Arial' }}>
                    {c.date ? new Date(c.date + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(c)} style={{ ...btnBase, background: 'transparent', color: MUTED, padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: 6 }}>
                        <Icon name="edit" size={13} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} style={{ ...btnBase, background: 'transparent', color: '#e05050', padding: '6px 8px', border: '1px solid #3a1818', borderRadius: 6 }}>
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <Modal title={modal === 'new' ? 'Nova Movimentação' : 'Editar Movimentação'} onClose={() => setModal(null)}>
          <Field label="Tipo">
            <div style={{ display: 'flex', gap: 10 }}>
              {['Entrada', 'Saída'].map((t) => {
                const isSelected = form.type === t;
                const tColor = t === 'Entrada' ? '#4CAF82' : '#e05050';
                return (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    style={{
                      ...btnBase, flex: 1, justifyContent: 'center', padding: '10px',
                      background: isSelected ? tColor + '22' : 'transparent',
                      border: `1px solid ${isSelected ? tColor : BORDER}`,
                      color: isSelected ? tColor : MUTED,
                    }}
                  >
                    <Icon name={t === 'Entrada' ? 'arrow_up' : 'arrow_down'} size={14} color={isSelected ? tColor : MUTED} />
                    {t}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Descrição">
            <input
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Ex: Pagamento cliente, Aluguel..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = WINE)}
              onBlur={(e) => (e.target.style.borderColor = BORDER)}
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Valor (R$)">
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="0,00"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = WINE)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              />
            </Field>
            <Field label="Data">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = WINE)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              />
            </Field>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
            <Btn onClick={handleSave} disabled={!form.descricao.trim() || !form.value}>
              <Icon name="check" size={14} /> Salvar
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
