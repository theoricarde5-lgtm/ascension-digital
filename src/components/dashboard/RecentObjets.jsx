import React from 'react';
import { Package } from 'lucide-react';
import { fmt } from '@/lib/coffre';

export default function RecentObjets({ objets, onSeeAll }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(149,165,180,0.25)' }}>
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid #ECEFF4' }}>
        <div className="flex items-center gap-2">
          <Package size={16} style={{ color: '#FF5733' }} />
          <h2 className="text-[15px] font-semibold" style={{ color: '#2C3E50' }}>Objets récents</h2>
        </div>
        <button onClick={onSeeAll} className="text-[13px] font-medium" style={{ color: '#FF5733' }}>Tout voir</button>
      </div>

      <div className="px-6 py-8">
        {objets.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: '#EFF2F7' }}>
              <Package size={20} style={{ color: '#95A5A6' }} />
            </div>
            <div className="text-[13.5px]" style={{ color: '#95A5A6' }}>Aucun objet pour l'instant.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {objets.slice(0, 6).map(o => (
              <div key={o.id} className="rounded-xl p-4"
                style={{ background: '#FBFBFB', border: '1px solid #ECEFF4' }}>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#95A5A6' }}>{o.categorie || 'Sans catégorie'}</div>
                <div className="text-[15px] font-semibold mb-1" style={{ color: '#2C3E50' }}>{o.nom}</div>
                {o.description && <div className="text-[12px] leading-snug mb-2" style={{ color: '#95A5A6' }}>{o.description}</div>}
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[14px] font-bold" style={{ color: '#2C3E50' }}>{o.prix ? fmt(o.prix) : '—'}</div>
                  {o.quantite ? <div className="text-[11px]" style={{ color: '#95A5A6' }}>Qté : {o.quantite}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}