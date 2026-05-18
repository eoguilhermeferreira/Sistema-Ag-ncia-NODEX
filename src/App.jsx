import { useState, useEffect, useRef, useCallback } from 'react';
import { WINE, TEXT, BORDER, DEFAULT_SERVICES, DEFAULT_CASH } from './constants';
import { load, save } from './utils';
import { useIsMobile } from './hooks/useIsMobile';
import { supabase, isConfigured } from './lib/supabase';
import {
  fetchServices,
  fetchCashEntries,
  upsertServices,
  upsertCashEntries,
  deleteService,
  deleteCashEntry,
  diffArrays,
} from './lib/db';
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

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0A0A0A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em' }}>
        <span style={{ color: '#F0EDE8' }}>NODE</span>
        <span style={{ color: '#7B1226' }}>X</span>
      </div>
      <div style={{
        width: 32, height: 32,
        border: '3px solid #242424',
        borderTopColor: '#7B1226',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

export function App() {
  const isMobile = useIsMobile();
  const [authed, setAuthed] = useState(() => load('nodex_session', false));
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [services, setServices_] = useState(() => load('nodex_services', DEFAULT_SERVICES));
  const [cashEntries, setCashEntries_] = useState(() => load('nodex_cash', DEFAULT_CASH));

  // Refs so async closures always see the latest values
  const servicesRef = useRef(services);
  const cashRef = useRef(cashEntries);
  useEffect(() => { servicesRef.current = services; }, [services]);
  useEffect(() => { cashRef.current = cashEntries; }, [cashEntries]);

  // Skip realtime events triggered by our own writes
  const skipRealtimeRef = useRef(false);

  /* ── initial load from Supabase ─────────────── */
  const loadFromSupabase = useCallback(async () => {
    if (!isConfigured) return;
    try {
      setLoading(true);
      const [svcs, cash] = await Promise.all([fetchServices(), fetchCashEntries()]);
      setServices_(svcs);
      setCashEntries_(cash);
      save('nodex_services', svcs);
      save('nodex_cash', cash);
    } catch (err) {
      console.error('[NODEX] Supabase fetch error, using local cache:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadFromSupabase();
  }, [authed, loadFromSupabase]);

  /* ── realtime subscriptions ─────────────────── */
  useEffect(() => {
    if (!authed || !isConfigured) return;

    const channel = supabase
      .channel('nodex-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        if (skipRealtimeRef.current) return;
        fetchServices()
          .then((svcs) => { setServices_(svcs); save('nodex_services', svcs); })
          .catch(() => {});
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cash_entries' }, () => {
        if (skipRealtimeRef.current) return;
        fetchCashEntries()
          .then((cash) => { setCashEntries_(cash); save('nodex_cash', cash); })
          .catch(() => {});
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [authed]);

  /* ── write helpers with Supabase sync ───────── */
  const setServices = useCallback(async (newArr) => {
    const oldArr = servicesRef.current;
    setServices_(newArr);
    save('nodex_services', newArr);

    if (!isConfigured) return;
    const { upserted, deleted } = diffArrays(oldArr, newArr);
    skipRealtimeRef.current = true;
    try {
      await Promise.all([
        upserted.length ? upsertServices(upserted) : null,
        ...deleted.map((item) => deleteService(item.id)),
      ].filter(Boolean));
    } catch (err) {
      console.error('[NODEX] services sync error:', err);
    } finally {
      setTimeout(() => { skipRealtimeRef.current = false; }, 500);
    }
  }, []);

  const setCashEntries = useCallback(async (newArr) => {
    const oldArr = cashRef.current;
    setCashEntries_(newArr);
    save('nodex_cash', newArr);

    if (!isConfigured) return;
    const { upserted, deleted } = diffArrays(oldArr, newArr);
    skipRealtimeRef.current = true;
    try {
      await Promise.all([
        upserted.length ? upsertCashEntries(upserted) : null,
        ...deleted.map((item) => deleteCashEntry(item.id)),
      ].filter(Boolean));
    } catch (err) {
      console.error('[NODEX] cash_entries sync error:', err);
    } finally {
      setTimeout(() => { skipRealtimeRef.current = false; }, 500);
    }
  }, []);

  /* ── auth ───────────────────────────────────── */
  const login = () => { save('nodex_session', true); setAuthed(true); };
  const logout = () => { save('nodex_session', false); setAuthed(false); };

  /* ── export / import ────────────────────────── */
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
  if (loading) return <LoadingScreen />;

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
