import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Box, Gem, Wallet, Wrench, LogOut, Package, Shield, Users, ScrollText, Settings, Tags, Swords, Calculator, KeyRound, Crosshair, FlaskConical, Globe } from 'lucide-react';

export default function Sidebar({ active = 'dashboard', onNavigate, userRole }) {
  const navigate = useNavigate();
  const [openInv, setOpenInv] = useState(false);
  const [openDev, setOpenDev] = useState(false);
  const invRef = useRef(null);
  const devRef = useRef(null);
  const isDev = userRole === 'Dev';
  const canArsenal = userRole === 'Dev' || userRole === 'Teniente';

  const playNavSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      // Courte mélodie mexicaine (vibora del mar / mariachi) en La mineur
      // notes: A4 C5 E5 C5 A4 — type "square" pour un côté cuivre
      const notes = [
        { f: 440.00, t: 0.00, d: 0.12 }, // A4
        { f: 523.25, t: 0.12, d: 0.12 }, // C5
        { f: 659.25, t: 0.24, d: 0.16 }, // E5
        { f: 523.25, t: 0.40, d: 0.12 }, // C5
        { f: 440.00, t: 0.52, d: 0.18 }, // A4
      ];
      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);
      master.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.02);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.75);
      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);
        g.gain.setValueAtTime(0.0001, ctx.currentTime + n.t);
        g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + n.t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n.t + n.d);
        osc.connect(g);
        g.connect(master);
        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d + 0.02);
      });
      setTimeout(() => ctx.close(), 900);
    } catch (e) {}
  };

  const handleNavigate = (id) => {
    playNavSound();
    onNavigate?.(id);
  };

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
    { id: 'armes', icon: Swords, label: 'Location Armes' },
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
        <button onClick={() => handleNavigate('dashboard')} title="Dashboard"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'dashboard' ? { background: 'var(--montoya-accent)', color: '#fff' } : { color: '#808080' }}>
          <LayoutGrid size={20} />
        </button>

        {/* Separator */}
        <div className="w-8 h-px my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Inventaire dropdown */}
        <div className="relative" ref={invRef}>
          <button onClick={() => setOpenInv(o => !o)} title="Inventaire"
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
            style={isInventoryActive || openInv ? { background: 'var(--montoya-accent)', color: '#fff' } : { color: '#808080' }}>
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
                  <button key={it.id} onClick={() => { handleNavigate(it.id); setOpenInv(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={isActive ? { color: '#fff', background: 'rgba(255,87,34,0.15)' } : { color: '#ccc' }}>
                    <Icon size={15} /> {it.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Contrebande - just below Inventaire */}
        <button onClick={() => handleNavigate('contrebande')} title="Contrebande"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'contrebande' ? { background: 'var(--montoya-accent)', color: '#fff' } : { color: '#808080' }}>
          <FlaskConical size={20} />
        </button>

        {/* Coffre - top level */}
        <button onClick={() => handleNavigate('coffre')} title="Coffre"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'coffre' ? { background: 'var(--montoya-accent)', color: '#fff' } : { color: '#808080' }}>
          <Wallet size={20} />
        </button>

        {/* Groupes - top level */}
        <button onClick={() => handleNavigate('groupes')} title="Groupes"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'groupes' ? { background: 'var(--montoya-accent)', color: '#fff' } : { color: '#808080' }}>
          <Tags size={20} />
        </button>

        {/* Calculateur - top level */}
        <button onClick={() => handleNavigate('calculateur')} title="Calculateur"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'calculateur' ? { background: 'var(--montoya-accent)', color: '#fff' } : { color: '#808080' }}>
          <Calculator size={20} />
        </button>

        {/* Arsenal - Dev & Teniente only */}
        {canArsenal && (
          <button onClick={() => handleNavigate('arsenal')} title="Arsenal"
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
            style={active === 'arsenal' ? { background: 'var(--montoya-accent)', color: '#fff' } : { color: '#808080' }}>
            <Crosshair size={20} />
          </button>
        )}

        {/* Separator */}
        <div className="w-8 h-px my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Paramètres - visible to all */}
        <button onClick={() => handleNavigate('parametres')} title="Paramètres"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
          style={active === 'parametres' ? { background: 'var(--montoya-accent)', color: '#fff' } : { color: '#808080' }}>
          <Settings size={20} />
        </button>

        {/* Dev section - separated, dropdown */}
        {isDev && (
          <>
            <div className="w-8 h-px my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="relative" ref={devRef}>
              <button onClick={() => setOpenDev(o => !o)} title="Dev · Administration"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                style={(active === 'permissions' || active === 'comptes' || active === 'logs' || active === 'passwords' || active === 'iplogs' || openDev) ? { background: '#9c27b0', color: '#fff' } : { color: '#808080' }}>
                <Shield size={20} />
              </button>
              {openDev && (
                <div className="absolute left-[52px] top-0 w-[200px] rounded-xl py-2 z-50"
                  style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#666' }}>Dev · Admin</div>
                  <button onClick={() => { handleNavigate('permissions'); setOpenDev(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={active === 'permissions' ? { color: '#fff', background: 'rgba(156,39,176,0.2)' } : { color: '#ccc' }}>
                    <Shield size={15} /> Rôles & Permissions
                  </button>
                  <button onClick={() => { handleNavigate('comptes'); setOpenDev(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={active === 'comptes' ? { color: '#fff', background: 'rgba(156,39,176,0.2)' } : { color: '#ccc' }}>
                    <Users size={15} /> Comptes
                  </button>
                  <button onClick={() => { handleNavigate('logs'); setOpenDev(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={active === 'logs' ? { color: '#fff', background: 'rgba(156,39,176,0.2)' } : { color: '#ccc' }}>
                    <ScrollText size={15} /> Logs
                  </button>
                  <button onClick={() => { handleNavigate('passwords'); setOpenDev(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={active === 'passwords' ? { color: '#fff', background: 'rgba(156,39,176,0.2)' } : { color: '#ccc' }}>
                    <KeyRound size={15} /> Mots de passe
                  </button>
                  <button onClick={() => { handleNavigate('iplogs'); setOpenDev(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left"
                    style={active === 'iplogs' ? { color: '#fff', background: 'rgba(156,39,176,0.2)' } : { color: '#ccc' }}>
                    <Globe size={15} /> Logs IP
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