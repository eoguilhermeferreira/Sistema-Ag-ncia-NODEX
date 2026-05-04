import { useState } from 'react';
import { WINE, TEXT, BORDER, DEFAULT_SERVICES, DEFAULT_CASH } from './constants';
import { load, save } from './utils';
import { useIsMobile } from './hooks/useIsMobile';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { DashboardSection } from './components/Dashboard/DashboardSection';
import { ServicesSection } from './components/Services/ServicesSection';
import { CashSection } from './components/Cash/CashSection';

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
  fontWeight: 600, fontSize: 13, borderRadius: 8, transition: 'all 0.18s ease',
};

function HamburgerIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function App() {
  const isMobile = useIsMobile();
  const [authed, setAuthed] = useState(() => load('nodex_session', false));
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [services, setServices_] = useState(() => load('nodex_services', DEFAULT_SERVICES));
  const [cashEntries, setCashEntries_] = useState(() => load('nodex_cash', DEFAULT_CASH));

  const setServices = (v) => { setServices_(v); save('nodex_services', v); };
  const setCashEntries = (v) => { setCashEntries_(v); save('nodex_cash', v); };

  const login = () => { save('nodex_session', true); setAuthed(true); };
  const logout = () => { save('nodex_session', false); setAuthed(false); };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ services, cashEntries }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nodex-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.services) setServices(data.services);
        if (data.cashEntries) setCashEntries(data.cashEntries);
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const sidebarWidth = isMobile ? 0 : collapsed ? 64 : 240;

  if (!authed) return <Login onLogin={login} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={logout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isMobile={isMobile}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Mobile top bar */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 56, zIndex: 90,
          background: '#0D0D0D', borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ ...btnBase, background: 'transparent', color: TEXT, padding: 8, border: `1px solid ${BORDER}`, borderRadius: 8 }}
          >
            <HamburgerIcon size={18} color={TEXT} />
          </button>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            <span style={{ color: TEXT }}>NODE</span>
            <span style={{ color: WINE }}>X</span>
          </div>
        </div>
      )}

      <main style={{
        marginLeft: sidebarWidth,
        flex: 1,
        padding: isMobile ? '72px 16px 24px' : '40px 48px',
        minHeight: '100vh',
        background: 'transparent',
        transition: 'margin-left 0.25s ease',
        minWidth: 0,
      }}>
        {active === 'dashboard' && <DashboardSection services={services} cashEntries={cashEntries} isMobile={isMobile} />}
        {active === 'services' && <ServicesSection services={services} setServices={setServices} isMobile={isMobile} />}
        {active === 'cash' && <CashSection cashEntries={cashEntries} setCashEntries={setCashEntries} isMobile={isMobile} />}
      </main>
    </div>
  );
}
