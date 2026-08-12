import React, { useState, useMemo } from 'react';
import { Search, FlaskConical, X, DollarSign, Plus } from 'lucide-react';
import StockHistory from '@/components/dashboard/StockHistory';

export default function ContrebandeView({ items, onAdd, onDelete, onSell, movements, userRole, onDeleteMovement, onDeleteMovements }) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('Tous');
  const [sellTarget, setSellTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const totalUnits = items.reduce((s, o) => s + (o.quantite || 0), 0);
  const gazCount = items.filter(i => i.type === 'Gaz Bz').length;
  const plaqueCount = items.filter(i => i.type === 'Fausse plaque').length;

  const filtered = useMemo(() => {
    return items.filter(o => {
      const matchType = activeType === 'Tous' || o.type === activeType;
      const matchQuery = !query.trim() || o.nom.toLowerCase().includes(query.toLowerCase()) || (o.description || '').toLowerCase().includes(query.toLowerCase());
      return matchType && matchQuery;
    });
  }, [items, activeType, query]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight flex items-center gap-2.5">
            <FlaskConical size={22} style={{ color: 'var(--montoya-accent)' }} /> Contrebande
          </h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {items.length} article{items.length > 1 ? 's' : ''} · {gazCount} Gaz Bz · {plaqueCount} Fausses plaques · {totalUnits} unité{totalUnits > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--montoya-accent)' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 lg:w-[280px]"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..."
            className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#fff' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {['Tous', 'Gaz Bz', 'Fausse plaque'].map(s => (
            <Pill key={s} label={s} active={activeType === s} onClick={() => setActiveType(s)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <FlaskConical size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun article. Ajoutez votre premier élément.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(o => (
            <div key={o.id} className="rounded-2xl p-5 relative"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => onDelete(o)} title="Supprimer"
                className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ color: '#808080', background: '#121212' }}><X size={14} /></button>
              <div className="flex items-center gap-2 mb-1.5 pr-8">
                <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={o.type === 'Gaz Bz'
                    ? { background: 'rgba(168,85,247,0.15)', color: '#c084fc' }
                    : { background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                  {o.type || '—'}
                </span>
                <StatutBadge statut={o.statut} />
              </div>
              <div className="text-[16px] font-semibold text-white mb-1">{o.nom}</div>
              {o.description && <div className="text-[12.5px] leading-snug mb-3" style={{ color: '#808080' }}>{o.description}</div>}
              {o.vendeur && <div className="text-[11.5px] mt-2 flex items-center gap-1.5" style={{ color: '#808080' }}><span style={{ color: '#666' }}>Vendeur :</span> {o.vendeur}</div>}
              <div className="flex items-center justify-between mt-3">
                <div className="text-[15px] font-bold text-white">{o.prix ? `${o.prix} $` : '—'}</div>
                {o.quantite ? <div className="text-[11px]" style={{ color: '#808080' }}>Qté : {o.quantite}</div> : null}
              </div>
              <button onClick={() => setSellTarget(o)} disabled={(o.quantite || 0) <= 0}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold transition-colors disabled:opacity-30"
                style={{ background: '#1a1a1a', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                <DollarSign size={14} /> Vendre
              </button>
            </div>
          ))}
        </div>
      )}

      {sellTarget && (
        <SellModal item={sellTarget} onClose={() => setSellTarget(null)} onConfirm={(qte, prix) => { onSell?.(sellTarget, qte, prix); setSellTarget(null); }} />
      )}

      {modalOpen && (
        <AddModal onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} />
      )}

      <StockHistory movements={movements} keyword="contrebande" title="Historique de la contrebande" subtitle="Ventes et mouvements liés au stock" userRole={userRole} onDelete={onDeleteMovement} onDeleteAll={onDeleteMovements} />
    </div>
  );
}

function StatutBadge({ statut }) {
  const map = {
    Disponible: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
    Réservé: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    Vendu: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
  };
  const s = map[statut] || map.Disponible;
  return <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{statut}</span>;
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

function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ nom: '', type: 'Gaz Bz', prix: '', quantite: '', description: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim()) return;
    onAdd({
      nom: form.nom.trim(),
      type: form.type,
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
          <h3 className="text-[17px] font-semibold text-white">Ajouter un article</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Nom *</label>
            <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle}>
              <option value="Gaz Bz">Gaz Bz</option>
              <option value="Fausse plaque">Fausse plaque</option>
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

function SellModal({ item, onClose, onConfirm }) {
  const [qte, setQte] = useState(1);
  const [prix, setPrix] = useState(item.prix || 0);
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };
  const total = (parseInt(qte) || 0) * (parseFloat(prix) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Math.max(1, parseInt(qte) || 1);
    if (qty > (item.quantite || 0)) return;
    onConfirm(qty, parseFloat(prix) || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[420px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[17px] font-semibold text-white">Vendre — {item.nom}</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#808080' }}>Stock disponible : {item.quantite || 0}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Quantité *</label>
            <input type="number" value={qte} onChange={(e) => setQte(e.target.value)} min="1" max={item.quantite || 1} required
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Prix unitaire ($)</label>
            <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="0"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2 rounded-xl px-4 py-3" style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span style={{ color: '#808080' }}>Total encaissé</span>
              <span className="text-white">{total} $</span>
            </div>
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: '#4ade80' }}>Confirmer la vente</button>
          </div>
        </form>
      </div>
    </div>
  );
}