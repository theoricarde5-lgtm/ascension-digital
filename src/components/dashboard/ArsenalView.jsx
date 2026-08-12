import React, { useState, useMemo } from 'react';
import { Search, Crosshair, Sword, Coins, Shield, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { key: 'feu', label: 'Armes à feu', icon: Crosshair, color: '#ff7a4d', match: (c) => (c || '').toLowerCase().includes('feu') },
  { key: 'blanche', label: 'Armes blanches', icon: Sword, color: '#94a3b8', match: (c) => (c || '').toLowerCase().includes('blanche') },
  { key: 'argent', label: 'Argent', icon: Coins, color: '#fbbf24', match: (c) => (c || '').toLowerCase().includes('argent') },
  { key: 'gilet', label: 'Gilets par balles', icon: Shield, color: '#4ade80', match: (c) => (c || '').toLowerCase().includes('gilet') },
];

export default function ArsenalView({ armes, movements }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState(null);

  const grouped = useMemo(() => {
    const groups = {};
    CATEGORIES.forEach(cat => { groups[cat.key] = []; });
    armes.forEach(a => {
      CATEGORIES.forEach(cat => {
        if (cat.match(a.categorie)) groups[cat.key].push(a);
      });
    });
    return groups;
  }, [armes]);

  const coffreBalance = useMemo(() => {
    return movements.reduce((s, m) => s + (m.type === 'depot' ? (m.montant || 0) : -(m.montant || 0)), 0);
  }, [movements]);

  const filteredList = useMemo(() => {
    if (!activeCat) return [];
    const list = grouped[activeCat] || [];
    if (!query.trim()) return list;
    return list.filter(a =>
      a.nom.toLowerCase().includes(query.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(query.toLowerCase()) ||
      (a.locataire || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [activeCat, grouped, query]);

  const activeCategory = CATEGORIES.find(c => c.key === activeCat);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-white tracking-tight flex items-center gap-2.5">
          <Crosshair size={24} style={{ color: 'var(--montoya-accent)' }} /> Arsenal
        </h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>Vue réservée Dev & Teniente — inventaire classé par catégorie</p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const list = grouped[cat.key] || [];
          const count = list.length;
          const units = list.reduce((s, a) => s + (a.quantite || 0), 0);
          const louees = list.filter(a => a.statut === 'Loué').length;
          const isActive = activeCat === cat.key;
          return (
            <button key={cat.key} onClick={() => setActiveCat(isActive ? null : cat.key)}
              className="rounded-2xl p-5 text-left transition-all"
              style={{
                background: isActive ? '#222' : '#1c1c1c',
                border: isActive ? `1px solid ${cat.color}` : '1px solid rgba(255,255,255,0.06)',
              }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${cat.color}1a`, color: cat.color }}>
                  <Icon size={19} />
                </div>
                <ChevronRight size={16} style={{ color: '#666' }} />
              </div>
              <div className="text-[14px] font-semibold text-white mb-0.5">{cat.label}</div>
              <div className="text-[11.5px] flex items-center gap-2" style={{ color: '#808080' }}>
                <span>{count} type{count > 1 ? 's' : ''}</span>
                <span style={{ color: '#444' }}>·</span>
                <span>{units} unité{units > 1 ? 's' : ''}</span>
              </div>
              {louees > 0 && (
                <div className="text-[10.5px] mt-1.5" style={{ color: '#fbbf24' }}>{louees} en location</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Argent detail card */}
      <div className="rounded-2xl p-5 mb-6 flex items-center justify-between"
        style={{ background: '#1c1c1c', border: '1px solid rgba(251,191,36,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
            <Coins size={20} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white">Solde du coffre</div>
            <div className="text-[11.5px]" style={{ color: '#808080' }}>Total des dépôts et retraits enregistrés</div>
          </div>
        </div>
        <div className="text-[22px] font-bold" style={{ color: coffreBalance >= 0 ? '#fbbf24' : '#f87171' }}>
          {coffreBalance.toLocaleString('fr-FR')} $
        </div>
      </div>

      {/* Detail list when a category is selected */}
      {activeCat && activeCategory && (
        <div className="rounded-2xl p-5" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-[16px] font-semibold text-white flex items-center gap-2">
              <activeCategory.icon size={17} style={{ color: activeCategory.color }} /> {activeCategory.label}
              <span className="text-[12px] font-normal" style={{ color: '#808080' }}>({filteredList.length})</span>
            </h2>
            <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 lg:w-[260px]"
              style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Search size={14} style={{ color: '#808080' }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..."
                className="bg-transparent text-[12.5px] flex-1 outline-none" style={{ color: '#fff' }} />
            </div>
          </div>

          {filteredList.length === 0 ? (
            <div className="py-10 text-center text-[13px]" style={{ color: '#808080' }}>
              Aucun élément dans cette catégorie.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredList.map(a => (
                <div key={a.id} className="rounded-xl p-4" style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#808080' }}>{a.categorie || '—'}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={a.statut === 'Loué' ? { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' } : { background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                      {a.statut}
                    </span>
                  </div>
                  <div className="text-[14px] font-semibold text-white mb-1">{a.nom}</div>
                  {a.locataire && <div className="text-[11px] mb-1" style={{ color: '#808080' }}>Loué à : {a.locataire}</div>}
                  {a.id_argent && <div className="text-[11px] mb-1" style={{ color: '#808080' }}>ID arme : {a.id_argent}</div>}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[13px] font-bold text-white">{a.prix_location ? `${a.prix_location} $` : '—'}</div>
                    <div className="text-[11px]" style={{ color: '#808080' }}>Qté : {a.quantite || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}