import React from 'react';
import { LayoutGrid, Gem, Wallet, BarChart3, Globe, Settings, FileText, CalendarDays, File } from 'lucide-react';

const navItems = [
  { icon: LayoutGrid, active: true },
  { icon: Gem },
  { icon: Wallet },
  { icon: BarChart3 },
  { icon: Globe },
  { icon: FileText },
  { icon: CalendarDays },
  { icon: File },
  { icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col items-center gap-2 py-6 px-3 fixed left-0 top-0 h-screen" style={{ width: '72px' }}>
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 text-white font-bold text-lg"
        style={{ background: 'linear-gradient(135deg, #FF5722, #FF8A65)' }}>A</div>
      {navItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <button key={i}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
            style={item.active
              ? { background: '#FFF', color: '#FF5722', boxShadow: '0 4px 12px -4px rgba(255,87,34,0.35)' }
              : { color: '#9AA5B1' }}>
            <Icon size={20} strokeWidth={1.8} />
          </button>
        );
      })}
    </aside>
  );
}