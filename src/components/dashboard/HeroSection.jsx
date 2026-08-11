import React from 'react';
import { Package, Boxes, Layers, ArrowUpRight } from 'lucide-react';

export default function HeroSection({ objets, categories }) {
  const totalUnits = objets.reduce((s, o) => s + (o.quantite || 0), 0);
  const cards = [
    { icon: Package, value: objets.length, label: 'Objets enregistrés', color: '#ff5722' },
    { icon: Boxes, value: totalUnits, label: 'Unités au total', color: '#2196f3' },
    { icon: Layers, value: categories.length, label: 'Catégories', color: '#9c27b0' },
  ];

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[28px] font-bold text-white tracking-tight">Bonjour 👋</h1>
        <p className="text-[14px] mt-1" style={{ color: '#808080' }}>Voici votre registre d'objets partagé.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="rounded-2xl p-5 relative"
              style={{ background: '#1c1c1c', borderTop: `3px solid ${c.color}` }}>
              <ArrowUpRight size={16} className="absolute top-4 right-4" style={{ color: '#808080' }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${c.color}1a`, color: c.color }}>
                <Icon size={20} />
              </div>
              <div className="text-[28px] font-bold text-white">{c.value}</div>
              <div className="text-[13px] mt-0.5" style={{ color: '#808080' }}>{c.label}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}