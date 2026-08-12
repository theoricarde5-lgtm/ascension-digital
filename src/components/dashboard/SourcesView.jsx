import React, { useState, useMemo } from 'react';
import { Tags, Plus, X, ArrowLeft, Box, Gem, Trash2 } from 'lucide-react';

export default function SourcesView({ sources, onAdd, objets = [], bijoux = [], transactions = [], onDeleteTransaction }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    setSaving(true);
    try { await onAdd(nom); setNom(''); setModalOpen(false); } catch (e) {}
    setSaving(false);
  };

  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  const txs = useMemo(() => {
    if (!selected) return [];
    const list = [];
    objets.filter(o => o.vendeur === selected.nom).forEach(o => list.push({
      id: `o-${o.id}`, type: 'Objet', nom: o.nom, categorie: o.categorie,
      prix: o.prix || 0, quantite: o.quantite || 0, date: o.created_date,
    }));
    bijoux.filter(b => b.vendeur === selected.nom).forEach(b => list.push({
      id: `b-${b.id}`, type: 'Bijou', nom: b.nom, categorie: b.categorie,
      prix: b.prix || 0, quantite: b.quantite || 0, date: b.created_date, source: 'Registre',
    }));
    transactions.filter(t => t.vendeur === selected.nom).forEach(t => list.push({
      id: `t-${t.id}`, rawId: t.id, type: t.type || 'Transaction', nom: t.nom, categorie: t.categorie || '',
      prix: t.prix || 0, quantite: t.quantite || 0, date: t.created_date, source: t.source || 'Calculateur',
    }));
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selected, objets, bijoux, transactions]);

  const totalAchats = txs.reduce((s, t) => s + (t.prix * t.quantite), 0);

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-2 mb-5 text-[13px] font-medium" style={{ color: '#808080' }}>
          <ArrowLeft size={16} /> Retour aux groupes
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--montoya-accent)', color: '#fff' }}>
            <Tags size={22} />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-white tracking-tight">{selected.nom}</h1>
            <p className="text-[13px] mt-0.5" style={{ color: '#808080' }}>
              {txs.length} transaction{txs.length > 1 ? 's' : ''} · Total racheté : {totalAchats.toLocaleString('fr-FR')} $
            </p>
          </div>
        </div>

        {txs.length === 0 ? (
          <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
            style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
              <Tags size={26} />
            </div>
            <div className="text-[14px]" style={{ color: '#808080' }}>Aucune transaction pour ce groupe.</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {txs.map(t => {
              const sousTotal = t.prix * t.quantite;
              const Icon = t.type === 'Objet' ? Box : Gem;
              return (
                <div key={t.id} className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#121212', color: '#808080' }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: '#121212', color: '#808080' }}>{t.type}</span>
                      {t.source && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(255,87,34,0.15)', color: 'var(--montoya-accent)' }}>{t.source}</span>}
                      {t.categorie && <span className="text-[10px]" style={{ color: '#666' }}>{t.categorie}</span>}
                    </div>
                    <div className="text-[14px] font-semibold text-white truncate">{t.nom}</div>
                    <div className="text-[11px]" style={{ color: '#808080' }}>
                      {t.date ? new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'} · {t.quantite} × {t.prix} $
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[15px] font-bold text-white whitespace-nowrap">{sousTotal.toLocaleString('fr-FR')} $</div>
                    {t.rawId && onDeleteTransaction && (
                      <button onClick={() => onDeleteTransaction({ id: t.rawId, nom: t.nom, vendeur: selected.nom })}
                        title="Supprimer la transaction"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:brightness-125"
                        style={{ color: '#808080', background: '#121212' }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Groupes</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {sources.length} groupe{sources.length > 1 ? 's' : ''} · liste des sources d'achat
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--montoya-accent)' }}>
          <Plus size={16} /> Ajouter un groupe
        </button>
      </div>

      {sources.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <Tags size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun groupe. Ajoutez-en un pour commencer.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sources.map(s => {
            const count = objets.filter(o => o.vendeur === s.nom).length + bijoux.filter(b => b.vendeur === s.nom).length + transactions.filter(t => t.vendeur === s.nom).length;
            return (
              <button key={s.id} onClick={() => setSelected(s)}
                className="rounded-2xl p-4 flex items-center gap-3 text-left transition-colors hover:brightness-110"
                style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--montoya-accent)', color: '#fff' }}>
                  <Tags size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-white truncate">{s.nom}</div>
                  <div className="text-[11px]" style={{ color: '#808080' }}>{count} transaction{count > 1 ? 's' : ''}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-[400px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-semibold text-white">Ajouter un groupe</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Nom du groupe *</label>
                <input value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Ex : NOUVEAU GROUPE"
                  className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
              </div>
              <div className="flex justify-end gap-2 mt-1">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
                <button type="submit" disabled={saving} className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60" style={{ background: 'var(--montoya-accent)' }}>{saving ? 'Ajout...' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}