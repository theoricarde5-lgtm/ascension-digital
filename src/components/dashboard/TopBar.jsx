import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopBar({ user, role, onOpenForm }) {
  const name = user?.full_name || user?.username || 'Fernando Montoya';
  const initial = (name[0] || 'F').toUpperCase();
  return (
    <header className="flex items-center justify-between gap-4 py-5 px-8 sticky top-0 z-10"
      style={{ background: '#F4F6F9' }}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: '#FF5733' }}>
          <span className="text-white text-[14px]">›</span>
        </div>
        <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#2C3E50' }}>Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-full px-4 py-2.5 w-full max-w-[280px]"
          style={{ background: '#EFF2F7' }}>
          <Search size={16} style={{ color: '#95A5A6' }} />
          <input placeholder="search here...." className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#2C3E50' }} />
        </div>
        <button onClick={onOpenForm} title="Faire une demande"
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: '#FFFFFF', border: '1px solid #ECEFF4', color: '#95A5A6' }}>
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
            style={{ background: '#FF5733' }}>2</span>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: '#FF5733' }}>{initial}</div>
          <div className="leading-tight">
            <div className="text-[13.5px] font-semibold" style={{ color: '#2C3E50' }}>{name}</div>
            <div className="text-[11.5px]" style={{ color: '#95A5A6' }}>{role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}