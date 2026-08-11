import React from 'react';
import { Box, Package } from 'lucide-react';

export default function RecentObjets({ objets }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Box size={18} style={{ color: '#ff5722' }} />
          <h2 className="text-[15px] font-semibold text-white">Objets récents</h2>
        </div>
        <button className="text-[13px] font-medium" style={{ color: '#ff5722' }}>Tout voir</button>
      </div>

      {objets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)', color: '#808080' }}>
            <Package size={26} />
          </div>
          <div className="text-[13.5px]" style={{ color: '#808080' }}>Aucun objet pour l'instant.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {objets.map((o) => (
            <div key={o.id} className="rounded-xl p-4" style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#808080' }}>{o.categorie || 'Sans catégorie'}</div>
              <div className="text-[15px] font-semibold text-white mb-1">{o.nom}</div>
              {o.description && <div className="text-[12.5px] leading-snug" style={{ color: '#808080' }}>{o.description}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}