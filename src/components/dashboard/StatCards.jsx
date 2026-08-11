import React from 'react';
import { Box, Layers, Gem, ArrowUpRight } from 'lucide-react';

export default function StatCards({ objetsCount, totalUnits, categoriesCount, bijouxCount, onNavigate }) {
  const cards = [
    { accent: '#ff5722', icon: Box, value: objetsCount, label: 'Objets enregistrés', view: 'objets' },
    { accent: '#e8b923', icon: Gem, value: bijouxCount, label: 'Bijoux enregistrés', view: 'bijoux' },
    { accent: '#448aff', icon: Layers, value: totalUnits, label: 'Unités au total', view: 'objets' },
    { accent: '#9c27b0', icon: Layers, value: categoriesCount, label: 'Catégories', view: 'objets' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} onClick={() => onNavigate?.(c.view)} className="rounded-2xl p-5 relative overflow-hidden cursor-pointer"
            style={{ background: '#1c1c1c', borderTop: `3px solid ${c.accent}` }}>
            <button className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#808080' }}>
              <ArrowUpRight size={14} />
            </button>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${c.accent}22`, color: c.accent }}>
              <Icon size={20} />
            </div>
            <div className="text-[28px] font-bold text-white leading-none mb-1.5">{c.value}</div>
            <div className="text-[13px]" style={{ color: '#808080' }}>{c.label}</div>
          </div>
        );
      })}
    </div>
  );
}