import React from 'react';
import { Search, Bell, Gift } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[24px] font-bold" style={{ color: '#1E293B' }}>Dashboard</h1>
        <p className="text-[12.5px]" style={{ color: '#94A3B8' }}>Bienvenue sur votre coffre</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2.5 w-[260px]"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 8px -2px rgba(100,116,139,0.18)' }}>
          <Search size={16} style={{ color: '#94A3B8' }} />
          <input placeholder="search here...." className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#1E293B' }} />
        </div>

        <button className="relative w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 8px -2px rgba(100,116,139,0.18)' }}>
          <Gift size={18} style={{ color: '#64748B' }} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: '#FF5722' }}>2</span>
        </button>
        <button className="relative w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 8px -2px rgba(100,116,139,0.18)' }}>
          <Bell size={18} style={{ color: '#64748B' }} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: '#FF5722' }}>3</span>
        </button>

        <div className="flex items-center gap-2.5 rounded-xl pl-2 pr-3 py-1.5"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 8px -2px rgba(100,116,139,0.18)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #FF5722, #FF8A65)' }}>M</div>
          <div className="hidden sm:block leading-tight">
            <div className="text-[13px] font-semibold" style={{ color: '#1E293B' }}>mango</div>
            <div className="text-[11px]" style={{ color: '#94A3B8' }}>Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}