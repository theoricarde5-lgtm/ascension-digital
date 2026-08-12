import React, { useState, useMemo } from 'react';
import { Search, Crosshair, Sword, Coins, Shield, ChevronRight, Plus, X, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const CATEGORIES = [
  { key: 'feu', label: 'Armes à feu', icon: Crosshair, color: '#ff7a4d', match: (c) => (c || '').toLowerCase().includes('feu') },
  { key: 'blanche', label: 'Armes blanches', icon: Sword, color: '#94a3b8', match: (c) => (c || '').toLowerCase().includes('blanche') },
  { key: 'gilet', label: 'Gilets par balles', icon: Shield, color: '#4ade80', match: (c) => (c || '').toLowerCase().includes('gilet') },
];

export default function ArsenalView({ armes, movements, onAdd, onDelete, argent, onAddArgent, onDeleteArgent }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [argentModal, setArgentModal] = useState(null);

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

  const argentBalance = useMemo(() => {
    return (argent || []).reduce((s, m) => s + (m.type === 'depot' ? (m.montant || 0) : -(m.montant || 0)), 0);
  }, [argent]);

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
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight flex items-center gap-2.5">
            <Crosshair size={24} style={{ color: 'var(--montoya-accent)' }} /> Arsenal
          </h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>Vue réservée Dev & Teniente — inventaire classé par catégorie</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--montoya-accent)' }}>
          <Plus size={16} /> Ajouter une arme
        </button>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

      {/* Private money counter - separate from public coffre */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: '#1c1c1c', border: '1px solid rgba(251,191,36,0.25)' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
              <Coins size={20} />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">Argent privé (Arsenal)</div>
              <div className="text-[11.5px]" style={{ color: '#808080' }}>Compteur séparé du coffre public — visible Dev & Teniente uniquement</div>
            </div>
          </div>
          <div className="text-[24px] font-bold" style={{ color: argentBalance >= 0 ? '#fbbf24' : '#f87171' }}>
            {argentBalance.toLocaleString('fr-FR')} $
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setArgentModal('depot')}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-semibold"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
            <ArrowDownCircle size={15} /> Dépôt
          </button>
          <button onClick={() => setArgentModal('retrait')}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-semibold"
            style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
            <ArrowUpCircle size={15} /> Retrait
          </button>
        </div>

        {(argent || []).length > 0 && (
          <div className="mt-4 space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
            {[...argent].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 30).map(m => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: '#121212' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={m.type === 'depot' ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80' } : { background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>
                  {m.type === 'depot' ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-white truncate">{m.note || (m.type === 'depot' ? 'Dépôt' : 'Retrait')}</div>
                  <div className="text-[10.5px]" style={{ color: '#666' }}>{new Date(m.created_date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="text-[12.5px] font-semibold" style={m.type === 'depot' ? { color: '#4ade80' } : { color: '#f87171' }}>
                  {m.type === 'depot' ? '+' : '−'}{m.montant} $
                </div>
                <button onClick={() => onDeleteArgent?.(m)} title="Supprimer"
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ color: '#666' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
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
                <div key={a.id} className="rounded-xl p-4 relative" style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <button onClick={() => onDelete?.(a)} title="Supprimer"
                    className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center" style={{ color: '#808080', background: '#1c1c1c' }}>
                    <X size={12} />
                  </button>
                  <div className="flex items-center gap-2 mb-1.5 pr-6">
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

      {modalOpen && (
        <AddArmeModal onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd?.(data); setModalOpen(false); }} />
      )}

      {argentModal && (
        <ArgentModal mode={argentModal} onClose={() => setArgentModal(null)} onConfirm={(data) => { onAddArgent?.(data); setArgentModal(null); }} />
      )}
    </div>
  );
}

function AddArmeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ nom: '', categorie: '', prix_location: '', caution: '', quantite: '', description: '', id_argent: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim()) return;
    onAdd({
      nom: form.nom.trim(),
      categorie: form.categorie.trim(),
      description: form.description.trim(),
      prix_location: parseFloat(form.prix_location) || 0,
      caution: parseFloat(form.caution) || 0,
      quantite: parseInt(form.quantite) || 1,
      id_argent: form.id_argent.trim(),
    });
  };
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[480px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-semibold text-white">Ajouter une arme</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Nom *</label>
            <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom de l'arme"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Catégorie</label>
            <select name="categorie" value={form.categorie} onChange={handleChange} className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle}>
              <option value="">— Choisir —</option>
              <option value="Arme à feu">Arme à feu</option>
              <option value="Arme blanche">Arme blanche</option>
              <option value="Gilet par balles">Gilet par balles</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Prix location ($)</label>
            <input name="prix_location" type="number" value={form.prix_location} onChange={handleChange} placeholder="0"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Caution ($)</label>
            <input name="caution" type="number" value={form.caution} onChange={handleChange} placeholder="0"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Quantité</label>
            <input name="quantite" type="number" value={form.quantite} onChange={handleChange} placeholder="1"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>ID de l'arme</label>
            <input name="id_argent" value={form.id_argent} onChange={handleChange} placeholder="Référence / ID arme"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Détails..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px] resize-none min-h-[60px]" style={inputStyle} />
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

function ArgentModal({ mode, onClose, onConfirm }) {
  const [montant, setMontant] = useState('');
  const [note, setNote] = useState('');
  const isDepot = mode === 'depot';
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  const handleSubmit = (e) => {
    e.preventDefault();
    const m = parseFloat(montant);
    if (!m || m <= 0) return;
    onConfirm({ type: mode, montant: m, note: note.trim() || (isDepot ? 'Dépôt' : 'Retrait') });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[400px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-semibold text-white flex items-center gap-2">
            {isDepot ? <ArrowDownCircle size={18} style={{ color: '#4ade80' }} /> : <ArrowUpCircle size={18} style={{ color: '#f87171' }} />}
            {isDepot ? 'Dépôt argent' : 'Retrait argent'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Montant ($) *</label>
            <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} required placeholder="0" autoFocus
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Note</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Motif..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white"
              style={{ background: isDepot ? '#4ade80' : '#f87171' }}>
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}