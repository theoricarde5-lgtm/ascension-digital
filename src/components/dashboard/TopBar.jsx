import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopBar({ query, setQuery }) {
  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      {/* Search */}
      <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 w-full max-w-[360px]"
        style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Search size={16} style={{ color: '#808080' }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..."
          className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#fff' }} />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center relative"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)', color: '#ccc' }}>
          <Bell size={17} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ background: '#ff5722' }} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: '#ff5722' }}>T</div>
          <div className="hidden sm:block leading-tight">
            <div className="text-[13.5px] font-semibold text-white">Théo _</div>
            <div className="text-[11.5px]" style={{ color: '#808080' }}>Membre</div>
          </div>
        </div>
      </div>
    </header>
  );
}