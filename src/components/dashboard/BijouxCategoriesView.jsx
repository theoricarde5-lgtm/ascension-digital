import React, { useState } from 'react';

export default function BijouxCategoriesView({ categories, onAdd, onDelete, canAdd, canDelete }) {
  const [nom, setNom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    onAdd(nom.trim());
    setNom('');
  };

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' };

  return (
    <>
      <div className="mb-[18px] mt-2">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Catégories Bijoux</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Nomme tes catégories de bijoux manuellement.</p>
      </div>

      {canAdd && (
      <form onSubmit={handleSubmit} className="rounded-[22px] p-[22px] mb-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#A79FB5' }}>Nom de la catégorie</label>
          <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex : Bague, Collier, Bracelet..."
            className="w-full rounded-[11px] px-3 py-2.5 text-[13px]" style={inputStyle} />
        </div>
        <button type="submit" className="rounded-[11px] px-4 py-2.5 text-[13px] font-bold text-white sm:self-end"
          style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>Ajouter</button>
      </form>
      )}

      {categories.length === 0 ? (
        <div className="rounded-[22px] p-[22px] text-[12.5px] text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#6C6479' }}>
          Aucune catégorie pour l'instant.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {categories.map(c => (
            <div key={c.id} className="flex items-center gap-2 rounded-full pl-3.5 pr-2 py-1.5"
              style={{ background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <span className="text-[13px] font-semibold" style={{ color: '#C7B3FA' }}>{c.nom}</span>
              {canDelete && (
              <button onClick={() => onDelete(c)} title="Supprimer"
                className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-xs"
                style={{ color: '#C7B3FA', background: 'rgba(255,255,255,0.06)' }}>✕</button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}