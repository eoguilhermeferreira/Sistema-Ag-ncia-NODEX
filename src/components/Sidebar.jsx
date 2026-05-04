import { WINE, TEXT, MUTED, BORDER } from '../constants';
import { Icon } from './ui/Icon';

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
  fontWeight: 600, fontSize: 13, letterSpacing: '0.04em',
  borderRadius: 8, transition: 'all 0.18s ease',
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'services', label: 'Serviços', icon: 'services' },
  { id: 'cash', label: 'Gestão de Caixa', icon: 'cash' },
];

function HamburgerIcon({ open, size = 20, color = 'currentColor' }) {
  return open ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CollapseIcon({ collapsed }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {collapsed
        ? <polyline points="9 18 15 12 9 6" />
        : <polyline points="15 18 9 12 15 6" />}
    </svg>
  );
}

export function Sidebar({ active, setActive, onLogout, collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile, onExport, onImport }) {
  const width = isMobile ? 240 : collapsed ? 64 : 240;

  const handleNav = (id) => {
    setActive(id);
    if (isMobile) setMobileOpen(false);
  };

  const isIconOnly = collapsed && !isMobile;

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99, backdropFilter: 'blur(2px)' }}
        />
      )}

      <div style={{
        width,
        minHeight: '100vh',
        background: '#0D0D0D',
        borderRight: `1px solid ${BORDER}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        zIndex: 100,
        transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'width 0.25s ease, transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: isIconOnly ? '28px 0 24px' : '28px 24px 24px',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center',
          justifyContent: isIconOnly ? 'center' : 'space-between',
        }}>
          {(!collapsed || isMobile) ? (
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
                <span style={{ color: TEXT }}>NODE</span><span style={{ color: WINE }}>X</span>
              </div>
              <div style={{ color: MUTED, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2, fontFamily: 'Arial', fontSize: 7 }}>
                AGÊNCIA DE MARKETING DIGITAL
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              <span style={{ color: TEXT }}>N</span><span style={{ color: WINE }}>X</span>
            </div>
          )}

          {!isMobile ? (
            <button onClick={() => setCollapsed(!collapsed)} style={{ ...btnBase, background: 'transparent', color: MUTED, padding: 6, border: `1px solid ${BORDER}`, borderRadius: 7 }}>
              <CollapseIcon collapsed={collapsed} />
            </button>
          ) : (
            <button onClick={() => setMobileOpen(false)} style={{ ...btnBase, background: 'transparent', color: MUTED, padding: 6, border: `1px solid ${BORDER}`, borderRadius: 7 }}>
              <HamburgerIcon open size={16} color={MUTED} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: isIconOnly ? '16px 8px' : '16px 12px' }}>
          {NAV.map((n) => {
            const isActive = active === n.id;
            return (
              <button
                key={n.id}
                onClick={() => handleNav(n.id)}
                title={isIconOnly ? n.label : undefined}
                style={{
                  ...btnBase,
                  width: '100%',
                  justifyContent: isIconOnly ? 'center' : 'flex-start',
                  padding: isIconOnly ? '12px' : '11px 14px',
                  marginBottom: 4, borderRadius: 10, fontSize: 14,
                  background: isActive ? `${WINE}22` : 'transparent',
                  color: isActive ? TEXT : MUTED,
                  border: isActive ? `1px solid ${WINE}44` : '1px solid transparent',
                  position: 'relative',
                }}
              >
                {isActive && !collapsed && (
                  <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: WINE, borderRadius: '0 2px 2px 0' }} />
                )}
                <Icon name={n.icon} size={16} color={isActive ? WINE : MUTED} />
                {(!collapsed || isMobile) && n.label}
              </button>
            );
          })}
        </nav>

        {/* Backup / Restore */}
        <div style={{ padding: isIconOnly ? '12px 8px' : '12px 12px', borderTop: `1px solid ${BORDER}` }}>
          {(!collapsed || isMobile) && (
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: MUTED, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
              Dados
            </div>
          )}
          <button
            onClick={onExport}
            title="Exportar dados"
            style={{
              ...btnBase, width: '100%',
              justifyContent: isIconOnly ? 'center' : 'flex-start',
              padding: isIconOnly ? '10px' : '9px 14px',
              marginBottom: 4, borderRadius: 10, fontSize: 13,
              background: 'transparent', color: MUTED, border: '1px solid transparent',
            }}
          >
            <Icon name="download" size={15} color={MUTED} />
            {(!collapsed || isMobile) && 'Exportar dados'}
          </button>

          <label
            title="Importar dados"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%',
              justifyContent: isIconOnly ? 'center' : 'flex-start',
              padding: isIconOnly ? '10px' : '9px 14px',
              borderRadius: 10, fontSize: 13,
              background: 'transparent', color: MUTED,
              cursor: 'pointer', fontFamily: 'Syne, sans-serif',
              fontWeight: 600, letterSpacing: '0.04em', boxSizing: 'border-box',
            }}
          >
            <Icon name="upload" size={15} color={MUTED} />
            {(!collapsed || isMobile) && 'Importar dados'}
            <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Logout */}
        <div style={{ padding: isIconOnly ? '16px 8px' : '16px 12px', borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={onLogout}
            title={isIconOnly ? 'Sair' : undefined}
            style={{
              ...btnBase, width: '100%',
              justifyContent: isIconOnly ? 'center' : 'flex-start',
              padding: isIconOnly ? '12px' : '11px 14px',
              background: 'transparent', color: MUTED, border: '1px solid transparent',
              borderRadius: 10, fontSize: 14,
            }}
          >
            <Icon name="logout" size={16} color={MUTED} />
            {(!collapsed || isMobile) && 'Sair'}
          </button>
        </div>
      </div>
    </>
  );
}
