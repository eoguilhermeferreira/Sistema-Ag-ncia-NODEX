import { useState } from 'react';
import { WINE, BG3, BORDER, MUTED, TEXT } from '../../constants';
import { fmt } from '../../utils';
import { Btn } from '../ui/Btn';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { StatusBadge } from '../ui/StatusBadge';
import { inputStyle, selectStyle } from '../ui/inputStyle';

const STATUSES = ['A fazer', 'Em andamento', 'Concluído', 'Cancelado'];

const emptyForm = () => ({
  empresa: '',
  descricao: '',
  value: '',
  status: 'A fazer',
  date: new Date().toISOString().slice(0, 10),
});

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
  fontWeight: 600, fontSize: 13, borderRadius: 8, transition: 'all 0.18s ease',
};

export function ServicesSection({ services, setServices, isMobile }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [search, setSearch] = useState('');

  const openNew = () => { setForm(emptyForm()); setModal('new'); };
  const openEdit = (s) => {
    setForm({ empresa: s.empresa, descricao: s.descricao, value: String(s.value), status: s.status, date: s.date ?? '' });
    setModal(s.id);
  };

  const handleSave = () => {
    if (!form.empresa.trim() || !form.value) return;
    const entry = {
      id: modal === 'new' ? Date.now() : modal,
      empresa: form.empresa.trim(),
      descricao: form.descricao.trim(),
      value: parseFloat(form.value) || 0,
      status: form.status,
      date: form.date,
    };
    setServices(modal === 'new' ? [entry, ...services] : services.map((s) => (s.id === modal ? entry : s)));
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Excluir serviço?')) setServices(services.filter((s) => s.id !== id));
  };

  const filtered = services.filter(
    (s) => !search || s.empresa.toLowerCase().includes(search.toLowerCase()) || s.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 12, marginBottom: 24,
      }}>
        <div>
          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Serviços</div>
          <div style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>{services.length} serviços cadastrados</div>
        </div>
        <Btn onClick={openNew}><Icon name="plus" size={14} /> Novo Serviço</Btn>
      </div>

      <input
        placeholder="Buscar empresa ou descrição..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ ...inputStyle, maxWidth: 340, marginBottom: 20 }}
        onFocus={(e) => (e.target.style.borderColor = WINE)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />

      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 14, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Empresa', 'Descrição', 'Valor', 'Status', 'Data', ''].map((h) => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: MUTED, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: MUTED, fontSize: 14 }}>Nenhum serviço encontrado</td></tr>
            )}
            {filtered.map((s) => (
              <tr
                key={s.id}
                style={{ borderBottom: `1px solid ${BORDER}88`, transition: 'background 0.15s', background: 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff06')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 20px', fontWeight: 600, fontSize: 14 }}>{s.empresa}</td>
                <td style={{ padding: '14px 20px', color: MUTED, fontSize: 13, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.descricao || '—'}</td>
                <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#4CAF82', fontFamily: 'Arial' }}>{fmt(s.value)}</td>
                <td style={{ padding: '14px 20px' }}><StatusBadge status={s.status} /></td>
                <td style={{ padding: '14px 20px', color: MUTED, fontSize: 13, fontFamily: 'Arial' }}>
                  {s.date ? new Date(s.date + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(s)} style={{ ...btnBase, background: 'transparent', color: MUTED, padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: 6 }}>
                      <Icon name="edit" size={13} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} style={{ ...btnBase, background: 'transparent', color: '#e05050', padding: '6px 8px', border: '1px solid #3a1818', borderRadius: 6 }}>
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'new' ? 'Novo Serviço' : 'Editar Serviço'} onClose={() => setModal(null)}>
          <Field label="Empresa (Cliente)">
            <input
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              placeholder="Nome da empresa"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = WINE)}
              onBlur={(e) => (e.target.style.borderColor = BORDER)}
            />
          </Field>
          <Field label="Descrição">
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Descreva o serviço"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
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
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={selectStyle}
              onFocus={(e) => (e.target.style.borderColor = WINE)}
              onBlur={(e) => (e.target.style.borderColor = BORDER)}
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
            <Btn onClick={handleSave} disabled={!form.empresa.trim() || !form.value}>
              <Icon name="check" size={14} /> Salvar
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
