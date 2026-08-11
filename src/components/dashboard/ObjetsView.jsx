import React, { useState, useMemo } from 'react';
import { Search, Plus, Package, X } from 'lucide-react';
import StockHistory from '@/components/dashboard/StockHistory';

export default function ObjetsView({ objets, categories, onAdd, onDelete, movements }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Tous');
  const [modalOpen, setModalOpen] = useState(false);

  const totalUnits = objets.reduce((s, o) => s + (o.quantite || 0), 0);

  const filtered = useMemo(() => {
    return objets.filter(o => {
      const matchCat = activeCat === 'Tous' || o.categorie === activeCat;
      const matchQuery = !query.trim() || o.nom.toLowerCase().includes(query.toLowerCase()) || (o.description || '').toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [objets, activeCat, query]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Registre d'objets</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {objets.length} objet{objets.length > 1 ? 's' : ''} · {totalUnits} unité{totalUnits > 1 ? 's' : ''} au total
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--montoya-accent)' }}>
          <Plus size={16} /> Ajouter un objet
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 lg:w-[280px]"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un objet..."
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
            <Package size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun objet. Ajoutez votre premier objet au registre.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(o => (
            <div key={o.id} className="rounded-2xl p-5 relative"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => onDelete(o)} title="Supprimer"
                className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ color: '#808080', background: '#121212' }}><X size={14} /></button>
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5 pr-8" style={{ color: '#808080' }}>{o.categorie || 'Sans catégorie'}</div>
              <div className="text-[16px] font-semibold text-white mb-1">{o.nom}</div>
              {o.description && <div className="text-[12.5px] leading-snug mb-3" style={{ color: '#808080' }}>{o.description}</div>}
              {o.vendeur && <div className="text-[11.5px] mt-2 flex items-center gap-1.5" style={{ color: '#808080' }}><span style={{ color: '#666' }}>Vendeur :</span> {o.vendeur}</div>}
              <div className="flex items-center justify-between mt-3">
                <div className="text-[15px] font-bold text-white">{o.prix ? `${o.prix} $` : '—'}</div>
                {o.quantite ? <div className="text-[11px]" style={{ color: '#808080' }}>Qté : {o.quantite}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AddModal categories={categories} onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} title="Ajouter un objet" />
      )}

      <StockHistory movements={movements} keyword="objet" title="Historique des objets" subtitle="Tous les ajouts d'objets au registre" />
    </div>
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className="rounded-full px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap transition-colors"
      style={active ? { background: 'var(--montoya-accent)', color: '#fff' } : { background: '#1c1c1c', color: '#ccc', border: '1px solid rgba(255,255,255,0.06)' }}>
      {label}
    </button>
  );
}

export function AddModal({ categories, onClose, onAdd, title }) {
  const [form, setForm] = useState({ nom: '', categorie: '', prix: '', quantite: '', description: '', vendeur: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim()) return;
    onAdd({
      nom: form.nom.trim(),
      categorie: form.categorie.trim(),
      description: form.description.trim(),
      prix: parseFloat(form.prix) || 0,
      quantite: parseInt(form.quantite) || 0,
      vendeur: form.vendeur.trim(),
    });
  };
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[480px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Nom *</label>
            <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Catégorie</label>
            <select name="categorie" value={form.categorie} onChange={handleChange} className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle}>
              <option value="">— Choisir —</option>
              {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Prix ($)</label>
            <input name="prix" type="number" value={form.prix} onChange={handleChange} placeholder="0"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Quantité</label>
            <input name="quantite" type="number" value={form.quantite} onChange={handleChange} placeholder="0"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Racheté à</label>
            <select name="vendeur" value={form.vendeur} onChange={handleChange} className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle}>
              <option value="">— Choisir —</option>
              {['SBC', 'CBLOCK', 'HTB', 'BLOODLINE', 'CUARDRA', 'MADRAZO'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Détails..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px] resize-none min-h-[70px]" style={inputStyle} />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: 'var(--montoya-accent)' }}>Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}