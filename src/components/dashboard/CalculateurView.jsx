import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calculator, Check, X, Plus } from 'lucide-react';
import { AddModal as AddObjetModal } from '@/components/dashboard/ObjetsView';

export default function CalculateurView({ objets = [], bijoux = [], categories = [], catObjets = [], sources = [], onAddBijou, onAddObjet, onAddSource, onValidate }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState({}); // { key: { prix, quantite } }
  const [activeType, setActiveType] = useState('Tous');
  const [modalOpen, setModalOpen] = useState(false);
  const [objetModalOpen, setObjetModalOpen] = useState(false);

  // Build a unified list of objets + bijoux only
  const items = useMemo(() => {
    const list = [];
    objets.forEach(o => list.push({ key: `objet-${o.id}`, id: o.id, nom: o.nom, type: 'Objet', categorie: o.categorie, prixDefaut: o.prix || 0, quantite: o.quantite || 0 }));
    bijoux.forEach(b => list.push({ key: `bijou-${b.id}`, id: b.id, nom: b.nom, type: 'Bijou', categorie: b.categorie, prixDefaut: b.prix || 0, quantite: b.quantite || 0 }));
    return list;
  }, [objets, bijoux]);

  const types = ['Tous', 'Objet', 'Bijou'];

  const filtered = useMemo(() => {
    return items.filter(it => {
      const matchType = activeType === 'Tous' || it.type === activeType;
      const matchQuery = !query.trim() || it.nom.toLowerCase().includes(query.toLowerCase()) || (it.categorie || '').toLowerCase().includes(query.toLowerCase());
      return matchType && matchQuery;
    });
  }, [items, activeType, query]);

  const toggle = (key, prixDefaut, quantiteDefaut) => {
    setSelected(prev => {
      const next = { ...prev };
      if (next[key] !== undefined) delete next[key];
      else next[key] = { prix: prixDefaut || 0, quantite: Math.max(1, quantiteDefaut || 1), vendeur: '' };
      return next;
    });
  };

  const setPrice = (key, value) => {
    setSelected(prev => ({ ...prev, [key]: { ...prev[key], prix: parseFloat(value) || 0 } }));
  };

  const setQuantite = (key, value) => {
    setSelected(prev => ({ ...prev, [key]: { ...prev[key], quantite: Math.max(0, parseInt(value) || 0) } }));
  };

  const setVendeur = (key, value) => {
    setSelected(prev => ({ ...prev, [key]: { ...prev[key], vendeur: value } }));
  };

  const selectedKeys = Object.keys(selected);
  const total = selectedKeys.reduce((s, k) => s + ((selected[k].prix || 0) * (selected[k].quantite || 0)), 0);
  const count = selectedKeys.length;

  const clearAll = () => setSelected({});

  const handleValidate = () => {
    if (count === 0) return;
    const details = selectedKeys.map(k => {
      const it = items.find(i => i.key === k);
      const s = selected[k];
      return `${it?.nom || k} (x${s.quantite} @ ${s.prix}$${s.vendeur ? ` → ${s.vendeur}` : ''})`;
    }).join(' · ');
    onValidate?.({ total, count, details, items: selectedKeys.map(k => {
      const it = items.find(i => i.key === k);
      const s = selected[k];
      return { nom: it?.nom, type: it?.type, prix: s.prix, quantite: s.quantite, vendeur: s.vendeur, sousTotal: s.prix * s.quantite };
    }) });
    setSelected({});
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Calculateur</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            Cochez les objets, ajustez les prix — le total se calcule automatiquement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setObjetModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
            style={{ background: 'var(--montoya-accent)' }}>
            <Plus size={16} /> Ajouter un objet
          </button>
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
            style={{ background: 'var(--montoya-accent)' }}>
            <Plus size={16} /> Ajouter un bijou
          </button>
        </div>
      </div>

      {/* Total card */}
      <div className="rounded-2xl p-5 mb-6 flex items-center justify-between"
        style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--montoya-accent)', color: '#fff' }}>
            <Calculator size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#808080' }}>Total calculé</div>
            <div className="text-[13px]" style={{ color: '#ccc' }}>{count} objet{count > 1 ? 's' : ''} sélectionné{count > 1 ? 's' : ''}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[28px] font-bold text-white">{total.toLocaleString('fr-FR')} $</div>
          {count > 0 && (
            <div className="flex items-center gap-2">
              <button onClick={clearAll} className="rounded-xl px-3 py-2 text-[12px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Tout effacer</button>
              <button onClick={handleValidate} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-semibold text-white" style={{ background: 'var(--montoya-accent)' }}>
                <Check size={14} /> Valider
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 lg:w-[280px]"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..."
            className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#fff' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className="rounded-full px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap transition-colors"
              style={activeType === t ? { background: 'var(--montoya-accent)', color: '#fff' } : { background: '#1c1c1c', color: '#ccc', border: '1px solid rgba(255,255,255,0.06)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <Calculator size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun objet à afficher.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(it => {
            const isChecked = selected[it.key] !== undefined;
            return (
              <div key={it.key}
                className="rounded-2xl p-4 transition-all"
                style={{
                  background: isChecked ? 'rgba(255,87,34,0.08)' : '#1c1c1c',
                  border: isChecked ? '1px solid var(--montoya-accent)' : '1px solid rgba(255,255,255,0.06)'
                }}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggle(it.key, it.prixDefaut, it.quantite)}
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                    style={isChecked ? { background: 'var(--montoya-accent)', color: '#fff' } : { background: '#121212', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {isChecked && <Check size={14} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: '#121212', color: '#808080' }}>{it.type}</span>
                      {it.categorie && <span className="text-[10px]" style={{ color: '#666' }}>{it.categorie}</span>}
                    </div>
                    <div className="text-[14px] font-semibold text-white truncate">{it.nom}</div>
                    {it.quantite ? <div className="text-[11px] mt-0.5" style={{ color: '#808080' }}>Stock : {it.quantite}</div> : null}
                  </div>
                </div>
                {isChecked && (
                  <div className="mt-3 pl-9 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: '#808080' }}>Prix</span>
                        <input type="number" value={selected[it.key].prix} onChange={(e) => setPrice(it.key, e.target.value)}
                          className="flex-1 rounded-lg px-2.5 py-1.5 text-[13px] w-full"
                          style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
                        <span className="text-[12px] font-semibold" style={{ color: '#fff' }}>$</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: '#808080' }}>Qté</span>
                        <input type="number" min="0" value={selected[it.key].quantite} onChange={(e) => setQuantite(it.key, e.target.value)}
                          className="flex-1 rounded-lg px-2.5 py-1.5 text-[13px] w-full"
                          style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px]" style={{ color: '#808080' }}>Racheté à</span>
                      <select value={selected[it.key].vendeur} onChange={(e) => setVendeur(it.key, e.target.value)}
                        className="flex-1 rounded-lg px-2.5 py-1.5 text-[13px] w-full"
                        style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
                        <option value="">— Choisir —</option>
                        {sources.map(s => <option key={s.id} value={s.nom}>{s.nom}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <AddBijouModal categories={categories} onClose={() => setModalOpen(false)} onAdd={(data) => { onAddBijou?.(data); setModalOpen(false); }} />
      )}

      {objetModalOpen && (
        <AddObjetModal categories={catObjets} sources={sources} onAddSource={onAddSource} onClose={() => setObjetModalOpen(false)} onAdd={(data) => { onAddObjet?.(data); setObjetModalOpen(false); }} title="Ajouter un objet" />
      )}
    </div>
  );
}

function AddBijouModal({ categories, onClose, onAdd }) {
  const [form, setForm] = useState({ nom: '', categorie: '', prix: '', quantite: '', description: '' });
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
    });
  };
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[480px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-semibold text-white">Ajouter un bijou</h3>
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