import React, { useState, useMemo } from 'react';
import { Search, Plus, Gem, X } from 'lucide-react';
import { AddModal } from '@/components/dashboard/ObjetsView';

export default function BijouxView({ bijoux, categories, onAdd, onDelete }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Tous');
  const [modalOpen, setModalOpen] = useState(false);

  const totalUnits = bijoux.reduce((s, b) => s + (b.quantite || 0), 0);

  const filtered = useMemo(() => {
    return bijoux.filter(b => {
      const matchCat = activeCat === 'Tous' || b.categorie === activeCat;
      const matchQuery = !query.trim() || b.nom.toLowerCase().includes(query.toLowerCase()) || (b.description || '').toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [bijoux, activeCat, query]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Registre de bijoux</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {bijoux.length} bijou{bijoux.length > 1 ? 'x' : ''} · {totalUnits} unité{totalUnits > 1 ? 's' : ''} au total
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: '#ff5722' }}>
          <Plus size={16} /> Ajouter un bijou
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 lg:w-[280px]"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un bijou..."
            className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#fff' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill label="Tous" active={activeCat === 'Tous'} onClick={() => setActiveCat('Tous')} />
          {categories.map(c => (
            <Pill key={c.id} label={c.nom} active={activeCat === c.nom} onClick={() => setActiveCat(c.nom)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <Gem size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun bijou. Ajoutez votre premier bijou au registre.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => (
            <div key={b.id} className="rounded-2xl p-5 relative"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => onDelete(b)} title="Supprimer"
                className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ color: '#808080', background: '#121212' }}><X size={14} /></button>
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5 pr-8" style={{ color: '#808080' }}>{b.categorie || 'Sans catégorie'}</div>
              <div className="text-[16px] font-semibold text-white mb-1">{b.nom}</div>
              {b.description && <div className="text-[12.5px] leading-snug mb-3" style={{ color: '#808080' }}>{b.description}</div>}
              <div className="flex items-center justify-between mt-3">
                <div className="text-[15px] font-bold text-white">{b.prix ? `${b.prix} $` : '—'}</div>
                {b.quantite ? <div className="text-[11px]" style={{ color: '#808080' }}>Qté : {b.quantite}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AddModal categories={categories} onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} title="Ajouter un bijou" />
      )}
    </div>
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className="rounded-full px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap transition-colors"
      style={active ? { background: '#ff5722', color: '#fff' } : { background: '#1c1c1c', color: '#ccc', border: '1px solid rgba(255,255,255,0.06)' }}>
      {label}
    </button>
  );
}