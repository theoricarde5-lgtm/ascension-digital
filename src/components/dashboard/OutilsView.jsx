import React, { useState, useMemo } from 'react';
import { Search, Plus, Wrench, X, ShoppingCart } from 'lucide-react';
import StockHistory from '@/components/dashboard/StockHistory';

export default function OutilsView({ outils, categories, onAdd, onDelete, onSell, onUpdate, movements }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Tous');
  const [modalOpen, setModalOpen] = useState(false);
  const [sellTarget, setSellTarget] = useState(null);
  const [editId, setEditId] = useState(null);

  const totalUnits = outils.reduce((s, o) => s + (o.quantite || 0), 0);

  const filtered = useMemo(() => {
    return outils.filter(o => {
      const matchCat = activeCat === 'Tous' || o.categorie === activeCat;
      const matchQuery = !query.trim() || o.nom.toLowerCase().includes(query.toLowerCase()) || (o.description || '').toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [outils, activeCat, query]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Stock Outils</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {outils.length} article{outils.length > 1 ? 's' : ''} · {totalUnits} unité{totalUnits > 1 ? 's' : ''} au total
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--montoya-accent)' }}>
          <Plus size={16} /> Ajouter au stock
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 lg:w-[280px]"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher dans le stock..."
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
            <Wrench size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Stock vide. Ajoutez votre premier article.</div>
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
              {editId === o.id ? (
                <EditInline outil={o} onSave={(data) => { onUpdate?.(o, data); setEditId(null); }} onCancel={() => setEditId(null)} />
              ) : (
                <>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-[15px] font-bold text-white">{o.prix ? `${o.prix} $` : '—'}</div>
                    {o.quantite ? <div className="text-[11px]" style={{ color: '#808080' }}>Qté : {o.quantite}</div> : null}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => setSellTarget(o)} disabled={!o.quantite}
                      className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold transition-colors disabled:opacity-40"
                      style={{ background: (o.quantite && o.statut !== 'Vendu') ? '#1a1a1a' : '#161616', color: (o.quantite && o.statut !== 'Vendu') ? '#ff7a4d' : '#666', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <ShoppingCart size={14} /> {o.statut === 'Vendu' && (!o.quantite) ? 'Épuisé' : 'Vendre'}
                    </button>
                    <button onClick={() => setEditId(o.id)}
                      className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold"
                      style={{ background: '#1a1a1a', color: '#ccc', border: '1px solid rgba(255,255,255,0.06)' }}>
                      Modifier
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AddModal categories={categories} onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} title="Ajouter au stock" />
      )}

      {sellTarget && (
        <SellModal outil={sellTarget} onClose={() => setSellTarget(null)} onConfirm={(qte, prix) => { onSell?.(sellTarget, qte, prix); setSellTarget(null); }} />
      )}

      <StockHistory movements={movements} />
    </div>
  );
}

function SellModal({ outil, onClose, onConfirm }) {
  const [qte, setQte] = useState(1);
  const [prix, setPrix] = useState(outil.prix || '');
  const max = outil.quantite || 0;
  const total = (parseFloat(prix) || 0) * (parseInt(qte) || 0);
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Math.min(Math.max(1, parseInt(qte) || 1), max);
    onConfirm(qty, parseFloat(prix) || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[440px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[17px] font-semibold text-white">Vendre — {outil.nom}</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#808080' }}>Stock disponible : {max}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Quantité</label>
            <input type="number" min="1" max={max} value={qte} onChange={(e) => setQte(e.target.value)} required
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Prix unitaire ($)</label>
            <input type="number" min="0" step="0.01" value={prix} onChange={(e) => setPrix(e.target.value)} required
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2 rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-[12px]" style={{ color: '#808080' }}>Total de la vente</span>
            <span className="text-[15px] font-bold text-white">{total} $</span>
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: '#ff5722' }}>Confirmer la vente</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditInline({ outil, onSave, onCancel }) {
  const [prix, setPrix] = useState(outil.prix ?? '');
  const [quantite, setQuantite] = useState(outil.quantite ?? '');
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };
  const submit = (e) => {
    e.preventDefault();
    onSave({ prix: parseFloat(prix) || 0, quantite: parseInt(quantite) || 0 });
  };
  return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-medium mb-1" style={{ color: '#808080' }}>Prix ($)</label>
          <input type="number" min="0" step="0.01" value={prix} onChange={(e) => setPrix(e.target.value)} autoFocus
            className="w-full rounded-lg px-2.5 py-2 text-[13px]" style={inputStyle} />
        </div>
        <div>
          <label className="block text-[10px] font-medium mb-1" style={{ color: '#808080' }}>Quantité</label>
          <input type="number" min="0" value={quantite} onChange={(e) => setQuantite(e.target.value)}
            className="w-full rounded-lg px-2.5 py-2 text-[13px]" style={inputStyle} />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-lg px-3 py-2 text-[12px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
        <button type="submit" className="flex-1 rounded-lg px-3 py-2 text-[12px] font-semibold text-white" style={{ background: 'var(--montoya-accent)' }}>Enregistrer</button>
      </div>
    </form>
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
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Vendeur (à qui on l'achète)</label>
            <input name="vendeur" value={form.vendeur} onChange={handleChange} placeholder="Ex : BricoDépôt"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Détails..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px] resize-none min-h-[70px]" style={inputStyle} />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: '#ff5722' }}>Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}