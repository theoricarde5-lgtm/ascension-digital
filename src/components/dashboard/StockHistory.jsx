import React, { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

export default function StockHistory({ movements, keyword = 'outil', title = 'Historique du stock', subtitle = 'Tous les ajouts et ventes du stock d\'outils' }) {
  const history = useMemo(() => {
    return (movements || [])
      .filter(m => (m.note || '').toLowerCase().includes(keyword.toLowerCase()))
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [movements, keyword]);

  return (
    <div className="mt-8 rounded-2xl p-5" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#ff572222', color: '#ff5722' }}>
          <History size={18} />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-white">{title}</h3>
          <p className="text-[12px]" style={{ color: '#808080' }}>{subtitle}</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-10 text-center text-[13px]" style={{ color: '#808080' }}>
          Aucun mouvement enregistré pour le moment.
        </div>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {history.map(m => {
            const isDepot = m.type === 'depot';
            const label = (m.note || '').startsWith('Vente') ? 'Vente'
              : (m.note || '').startsWith('Achat') ? 'Ajout (achat)'
              : (m.note || '').startsWith('Sortie') ? 'Sortie'
              : m.type;
            return (
              <div key={m.id} className="flex items-center gap-3 py-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: isDepot ? '#1f3d2a' : '#3d2a1f', color: isDepot ? '#4ade80' : '#ff7a4d' }}>
                  {isDepot ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white truncate">{m.note}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: '#808080' }}>
                    {new Date(m.created_date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · {label}
                  </div>
                </div>
                <div className="text-[14px] font-bold shrink-0" style={{ color: isDepot ? '#4ade80' : '#ff7a4d' }}>
                  {isDepot ? '+' : '−'}{m.montant || 0} $
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}