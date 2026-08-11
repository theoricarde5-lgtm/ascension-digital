import React from 'react';
import { LayoutGrid, Box, Gem, Wallet, Wrench, LogOut } from 'lucide-react';

export default function Sidebar({ active = 'dashboard', onNavigate }) {
  const items = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'objets', icon: Box, label: 'Objets' },
    { id: 'bijoux', icon: Gem, label: 'Bijoux' },
    { id: 'outils', icon: Wrench, label: 'Stock Outils' },
    { id: 'coffre', icon: Wallet, label: 'Coffre' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] flex flex-col items-center py-5 z-30"
      style={{ background: '#121212', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-8 font-bold text-white text-lg"
        style={{ background: 'linear-gradient(135deg, #ff5722, #ff7a4d)' }}>
        C
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-2 flex-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          return (
            <button key={it.id} onClick={() => onNavigate?.(it.id)} title={it.label}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
              style={isActive
                ? { background: '#ff5722', color: '#fff' }
                : { color: '#808080' }}>
              <Icon size={20} />
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button title="Déconnexion"
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ color: '#808080' }}>
        <LogOut size={20} />
      </button>
    </aside>
  );
}