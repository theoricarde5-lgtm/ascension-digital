import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopBar({ user, role, onOpenForm }) {
  const name = user?.full_name || user?.username || 'Fernando Montoya';
  const initial = (name[0] || 'F').toUpperCase();
  return (
    <header className="flex items-center justify-between gap-4 py-5 px-8 sticky top-0 z-10"
      style={{ background: '#121212' }}>
      <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 w-full max-w-[320px]"
        style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Search size={16} style={{ color: '#808080' }} />
        <input placeholder="Rechercher..." className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#fff' }} />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onOpenForm} title="Faire une demande"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:text-white"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)', color: '#808080' }}>
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: '#ff5722' }}>{initial}</div>
          <div className="leading-tight">
            <div className="text-[13.5px] font-semibold text-white">{name}</div>
            <div className="text-[11.5px]" style={{ color: '#808080' }}>{role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}