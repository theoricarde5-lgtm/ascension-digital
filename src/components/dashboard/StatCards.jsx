import React from 'react';
import { Package, Gem, Wallet, TrendingUp } from 'lucide-react';

export default function StatCards({ objets, bijoux, solde, valeurTotale }) {
  const cards = [
    { label: "Objets enregistrés", value: objets, icon: Package, color: '#FF5722' },
    { label: "Bijoux enregistrés", value: bijoux, icon: Gem, color: '#2196F3' },
    { label: "Solde du coffre", value: `$${solde.toLocaleString()}`, icon: Wallet, color: '#9C27B0' },
    { label: "Valeur totale", value: `$${valeurTotale.toLocaleString()}`, icon: TrendingUp, color: '#4CAF50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="relative rounded-2xl p-5 overflow-hidden"
            style={{ background: '#FFFFFF', boxShadow: '0 4px 16px -6px rgba(100,116,139,0.25)' }}>
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: c.color }} />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[12px] font-medium mb-2" style={{ color: '#94A3B8' }}>{c.label}</div>
                <div className="text-[26px] font-bold" style={{ color: '#1E293B' }}>{c.value}</div>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${c.color}1A`, color: c.color }}>
                <Icon size={22} strokeWidth={1.8} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}