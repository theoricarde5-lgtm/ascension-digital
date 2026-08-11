import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Box, Gem, Wallet, Wrench, LogOut, Package, Shield, Users, ScrollText, Settings } from 'lucide-react';

export default function Sidebar({ active = 'dashboard', onNavigate, userRole }) {
  const navigate = useNavigate();
  const [openInv, setOpenInv] = useState(false);
  const [openDev, setOpenDev] = useState(false);
  const invRef = useRef(null);
  const devRef = useRef(null);
  const isDev = userRole === 'Dev';

  const handleLogout = () => {
    sessionStorage.removeItem('ls_user');
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const handler = (e) => {
      if (invRef.current && !invRef.current.contains(e.target)) setOpenInv(false);
      if (devRef.current && !devRef.current.contains(e.target)) setOpenDev(false);
    };
    if (openInv || openDev) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openInv, openDev]);

  const inventoryItems = [
    { id: 'objets', icon: Box, label: 'Objets' },
    { id: 'bijoux', icon: Gem, label: 'Bijoux' },
    { id: 'outils', icon: Wrench, label: 'Stock Outils' },
  ];
  const isInventoryActive = inventoryItems.some(i => i.id === active);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] flex flex-col items-center py-5 z-30"
      style={{ background: '#121212', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-8 font-bold text-white text-lg"
        style={{ background: 'linear-gradient(135deg, #ff5722, #ff7a4d)' }}>
        M
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-2 flex-1 w-full items-center">
        {/* Dashboard - top level */}
        <button onClick={() => onNavigate?.('dashboard')} title="Dashboard"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'dashboard' ? { background: '#ff5722', color: '#fff' } : { color: '#808080' }}>
          <LayoutGrid size={20} />
        </button>

        {/* Separator */}
        <div className="w-8 h-px my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Inventaire dropdown */}
        <div className="relative" ref={invRef}>
          <button onClick={() => setOpenInv(o => !o)} title="Inventaire"
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
            style={isInventoryActive || openInv ? { background: '#ff5722', color: '#fff' } : { color: '#808080' }}>
            <Package size={20} />
          </button>
          {openInv && (
            <div className="absolute left-[52px] top-0 w-[190px] rounded-xl py-2 z-50"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#666' }}>Inventaire</div>
              {inventoryItems.map(it => {
                const Icon = it.icon;
                const isActive = active === it.id;
                return (
                  <button key={it.id} onClick={() => { onNavigate?.(it.id); setOpenInv(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={isActive ? { color: '#fff', background: 'rgba(255,87,34,0.15)' } : { color: '#ccc' }}>
                    <Icon size={15} /> {it.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Coffre - top level */}
        <button onClick={() => onNavigate?.('coffre')} title="Coffre"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'coffre' ? { background: '#ff5722', color: '#fff' } : { color: '#808080' }}>
          <Wallet size={20} />
        </button>

        {/* Separator */}
        <div className="w-8 h-px my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Paramètres - visible to all */}
        <button onClick={() => onNavigate?.('parametres')} title="Paramètres"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'parametres' ? { background: '#ff5722', color: '#fff' } : { color: '#808080' }}>
          <Settings size={20} />
        </button>

        {/* Dev section - separated, dropdown */}
        {isDev && (
          <>
            <div className="w-8 h-px my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="relative" ref={devRef}>
              <button onClick={() => setOpenDev(o => !o)} title="Dev · Administration"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                style={(active === 'permissions' || active === 'comptes' || active === 'logs' || openDev) ? { background: '#9c27b0', color: '#fff' } : { color: '#808080' }}>
                <Shield size={20} />
              </button>
              {openDev && (
                <div className="absolute left-[52px] top-0 w-[200px] rounded-xl py-2 z-50"
                  style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#666' }}>Dev · Admin</div>
                  <button onClick={() => { onNavigate?.('permissions'); setOpenDev(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={active === 'permissions' ? { color: '#fff', background: 'rgba(156,39,176,0.2)' } : { color: '#ccc' }}>
                    <Shield size={15} /> Rôles & Permissions
                  </button>
                  <button onClick={() => { onNavigate?.('comptes'); setOpenDev(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={active === 'comptes' ? { color: '#fff', background: 'rgba(156,39,176,0.2)' } : { color: '#ccc' }}>
                    <Users size={15} /> Comptes
                  </button>
                  <button onClick={() => { onNavigate?.('logs'); setOpenDev(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={active === 'logs' ? { color: '#fff', background: 'rgba(156,39,176,0.2)' } : { color: '#ccc' }}>
                    <ScrollText size={15} /> Logs
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Logout */}
      <button title="Déconnexion" onClick={handleLogout}
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ color: '#808080' }}>
        <LogOut size={20} />
      </button>
    </aside>
  );
}