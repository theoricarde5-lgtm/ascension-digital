import React, { useState } from 'react';
import { Tags, Plus, X } from 'lucide-react';

export default function SourcesView({ sources, onAdd }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    setSaving(true);
    try { await onAdd(nom); setNom(''); setModalOpen(false); } catch (e) {}
    setSaving(false);
  };

  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

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
          {sources.map(s => (
            <div key={s.id} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--montoya-accent)', color: '#fff' }}>
                <Tags size={18} />
              </div>
              <div className="text-[14px] font-semibold text-white truncate">{s.nom}</div>
            </div>
          ))}
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