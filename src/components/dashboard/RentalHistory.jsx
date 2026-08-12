import React, { useState, useMemo } from 'react';
import { Search, Trash2, KeyRound, Undo2, CheckCircle2, Clock } from 'lucide-react';

export default function RentalHistory({ locations, userRole, onDelete, onDeleteAll }) {
  const [query, setQuery] = useState('');
  const [activeStatut, setActiveStatut] = useState('Tous');
  const [confirmAll, setConfirmAll] = useState(false);

  const filtered = useMemo(() => {
    return locations.filter(l => {
      const matchStatut = activeStatut === 'Tous' || l.statut === activeStatut;
      const matchQuery = !query.trim() ||
        (l.arme_nom || '').toLowerCase().includes(query.toLowerCase()) ||
        (l.locataire || '').toLowerCase().includes(query.toLowerCase());
      return matchStatut && matchQuery;
    });
  }, [locations, activeStatut, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [filtered]);

  const isDev = userRole === 'Dev';

  const formatDate = (d) => {
    if (!d) return '—';
    try {
      const date = new Date(d);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) { return d; }
  };

  const optionLabel = (opt) => {
    const map = { total: 'Total encaissé', caution: 'Caution encaissée', location: 'Location encaissée', none: 'Sans encaissement' };
    return map[opt] || '—';
  };

  return (
    <div className="mt-8 rounded-2xl p-5" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-[17px] font-semibold text-white flex items-center gap-2">
            <KeyRound size={17} style={{ color: 'var(--montoya-accent)' }} /> Historique des locations
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: '#808080' }}>Toutes les locations d'armes, encaissées ou non</p>
        </div>
        {isDev && locations.length > 0 && (
          <button onClick={() => setConfirmAll(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium"
            style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <Trash2 size={13} /> Tout supprimer
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 flex-1"
          style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={14} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher arme ou locataire..."
            className="bg-transparent text-[12.5px] flex-1 outline-none" style={{ color: '#fff' }} />
        </div>
        <div className="flex gap-2">
          {['Tous', 'En cours', 'Rendu'].map(s => (
            <button key={s} onClick={() => setActiveStatut(s)}
              className="rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap"
              style={activeStatut === s ? { background: 'var(--montoya-accent)', color: '#fff' } : { background: '#121212', color: '#ccc', border: '1px solid rgba(255,255,255,0.06)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <KeyRound size={22} />
          </div>
          <div className="text-[13px]" style={{ color: '#808080' }}>Aucune location enregistrée.</div>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {sorted.map(l => {
            const enCours = l.statut === 'En cours';
            return (
              <div key={l.id} className="rounded-xl p-3.5 flex items-center gap-3"
                style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={enCours ? { background: 'rgba(245,158,11,0.12)', color: '#fbbf24' } : { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }}>
                  {enCours ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13.5px] font-semibold text-white truncate">{l.arme_nom}</span>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={enCours ? { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' } : { background: 'rgba(100,116,139,0.15)', color: '#94a3b8' }}>
                      {l.statut}
                    </span>
                  </div>
                  <div className="text-[11.5px] mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: '#808080' }}>
                    <span>Locataire : <span style={{ color: '#ccc' }}>{l.locataire}</span></span>
                    <span style={{ color: '#444' }}>·</span>
                    <span>Du {formatDate(l.date_debut)} au {formatDate(l.date_retour)}</span>
                  </div>
                  {!enCours && (
                    <div className="text-[11px] mt-1 flex items-center gap-1.5" style={{ color: '#808080' }}>
                      <Undo2 size={11} /> {optionLabel(l.option_retour)}
                      {l.montant_encaisse > 0 && <span style={{ color: '#4ade80' }}>· {l.montant_encaisse} $</span>}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[12px] font-semibold text-white">{(l.prix_location || 0) + (l.caution || 0)} $</div>
                  <div className="text-[10px]" style={{ color: '#666' }}>loc {l.prix_location || 0} · caut {l.caution || 0}</div>
                </div>
                {isDev && (
                  <button onClick={() => onDelete?.(l)} title="Supprimer"
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ color: '#808080', background: '#1c1c1c' }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {confirmAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setConfirmAll(false)}>
          <div className="w-full max-w-[380px] rounded-2xl p-5" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[15px] font-semibold text-white mb-2">Supprimer tout l'historique ?</h3>
            <p className="text-[12.5px] mb-4" style={{ color: '#808080' }}>Cette action supprimera les {locations.length} location(s) enregistrée(s). irréversible.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmAll(false)} className="rounded-xl px-4 py-2 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
              <button onClick={async () => { await onDeleteAll?.(locations); setConfirmAll(false); }} className="rounded-xl px-4 py-2 text-[13px] font-semibold text-white" style={{ background: '#ef4444' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}