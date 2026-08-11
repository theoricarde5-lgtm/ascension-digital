import React from 'react';
import { Package, Boxes, Layers, ArrowUpRight } from 'lucide-react';

export default function HeroSection({ objets, categories }) {
  const totalUnits = objets.reduce((s, o) => s + (o.quantite || 0), 0);
  const cards = [
    { icon: Package, value: objets.length, label: 'Objets enregistrés', color: '#FF5733' },
    { icon: Boxes, value: totalUnits, label: 'Unités au total', color: '#33A1FF' },
    { icon: Layers, value: categories.length, label: 'Catégories', color: '#8E44AD' },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[24px] font-bold tracking-tight" style={{ color: '#2C3E50' }}>Bonjour 👋</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#95A5A6' }}>Voici votre registre d'objets partagé.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="rounded-2xl p-5 relative"
              style={{ background: '#FFFFFF', borderTop: `3px solid ${c.color}`, boxShadow: '0 6px 18px -6px rgba(149,165,180,0.25)' }}>
              <ArrowUpRight size={16} className="absolute top-4 right-4" style={{ color: '#C5CED6' }} />
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${c.color}14`, color: c.color }}>
                <Icon size={20} />
              </div>
              <div className="text-[28px] font-bold" style={{ color: '#2C3E50' }}>{c.value}</div>
              <div className="text-[12.5px] mt-0.5" style={{ color: '#95A5A6' }}>{c.label}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}