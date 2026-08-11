import React from 'react';
import { Package } from 'lucide-react';
import { fmt } from '@/lib/coffre';

export default function RecentObjets({ objets, onSeeAll }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <Package size={16} style={{ color: '#ff5722' }} />
          <h2 className="text-[15px] font-semibold text-white">Objets récents</h2>
        </div>
        <button onClick={onSeeAll} className="text-[13px] font-medium" style={{ color: '#ff5722' }}>Tout voir</button>
      </div>

      <div className="px-6 py-16 text-center">
        {objets.length === 0 ? (
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun objet pour l'instant.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {objets.slice(0, 6).map(o => (
              <div key={o.id} className="rounded-xl p-4"
                style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#808080' }}>{o.categorie || 'Sans catégorie'}</div>
                <div className="text-[15px] font-semibold text-white mb-1">{o.nom}</div>
                {o.description && <div className="text-[12px] leading-snug mb-2" style={{ color: '#808080' }}>{o.description}</div>}
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[14px] font-bold text-white">{o.prix ? fmt(o.prix) : '—'}</div>
                  {o.quantite ? <div className="text-[11px]" style={{ color: '#808080' }}>Qté : {o.quantite}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}