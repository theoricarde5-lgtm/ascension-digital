import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calculator, Check, X } from 'lucide-react';

export default function CalculateurView({ objets = [], bijoux = [], outils = [], armes = [] }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState({}); // { key: prix }
  const [activeType, setActiveType] = useState('Tous');

  // Build a unified list of all inventory items
  const items = useMemo(() => {
    const list = [];
    objets.forEach(o => list.push({ key: `objet-${o.id}`, id: o.id, nom: o.nom, type: 'Objet', categorie: o.categorie, prixDefaut: o.prix || 0, quantite: o.quantite || 0 }));
    bijoux.forEach(b => list.push({ key: `bijou-${b.id}`, id: b.id, nom: b.nom, type: 'Bijou', categorie: b.categorie, prixDefaut: b.prix || 0, quantite: b.quantite || 0 }));
    outils.forEach(o => list.push({ key: `outil-${o.id}`, id: o.id, nom: o.nom, type: 'Outil', categorie: o.categorie, prixDefaut: o.prix || 0, quantite: o.quantite || 0 }));
    armes.forEach(a => list.push({ key: `arme-${a.id}`, id: a.id, nom: a.nom, type: 'Arme', categorie: a.categorie, prixDefaut: a.prix_location || 0, quantite: a.quantite || 0 }));
    return list;
  }, [objets, bijoux, outils, armes]);

  const types = ['Tous', 'Objet', 'Bijou', 'Outil', 'Arme'];

  const filtered = useMemo(() => {
    return items.filter(it => {
      const matchType = activeType === 'Tous' || it.type === activeType;
      const matchQuery = !query.trim() || it.nom.toLowerCase().includes(query.toLowerCase()) || (it.categorie || '').toLowerCase().includes(query.toLowerCase());
      return matchType && matchQuery;
    });
  }, [items, activeType, query]);

  const toggle = (key, prixDefaut) => {
    setSelected(prev => {
      const next = { ...prev };
      if (next[key] !== undefined) delete next[key];
      else next[key] = prixDefaut || 0;
      return next;
    });
  };

  const setPrice = (key, value) => {
    setSelected(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const selectedKeys = Object.keys(selected);
  const total = selectedKeys.reduce((s, k) => s + (selected[k] || 0), 0);
  const count = selectedKeys.length;

  const clearAll = () => setSelected({});

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Calculateur</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            Cochez les objets, ajustez les prix — le total se calcule automatiquement.
          </p>
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
            <button onClick={clearAll} className="rounded-xl px-3 py-2 text-[12px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Tout effacer</button>
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
                  <button onClick={() => toggle(it.key, it.prixDefaut)}
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
                  <div className="mt-3 flex items-center gap-2 pl-9">
                    <span className="text-[11px]" style={{ color: '#808080' }}>Prix</span>
                    <input type="number" value={selected[it.key]} onChange={(e) => setPrice(it.key, e.target.value)}
                      className="flex-1 rounded-lg px-2.5 py-1.5 text-[13px] w-full"
                      style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
                    <span className="text-[12px] font-semibold" style={{ color: '#fff' }}>$</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}