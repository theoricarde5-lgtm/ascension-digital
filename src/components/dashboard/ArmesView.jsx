import React, { useState, useMemo } from 'react';
import { Search, Plus, Swords, X, KeyRound, Undo2 } from 'lucide-react';
import StockHistory from '@/components/dashboard/StockHistory';

export default function ArmesView({ armes, onAdd, onDelete, onRent, onReturn, movements }) {
  const [query, setQuery] = useState('');
  const [activeStatut, setActiveStatut] = useState('Tous');
  const [modalOpen, setModalOpen] = useState(false);
  const [rentTarget, setRentTarget] = useState(null);

  const totalUnits = armes.reduce((s, a) => s + (a.quantite || 0), 0);
  const dispo = armes.filter(a => a.statut === 'Disponible').length;
  const louees = armes.filter(a => a.statut === 'Loué').length;

  const filtered = useMemo(() => {
    return armes.filter(a => {
      const matchStatut = activeStatut === 'Tous' || a.statut === activeStatut;
      const matchQuery = !query.trim() || a.nom.toLowerCase().includes(query.toLowerCase()) || (a.description || '').toLowerCase().includes(query.toLowerCase());
      return matchStatut && matchQuery;
    });
  }, [armes, activeStatut, query]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Location Armes</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {armes.length} arme{armes.length > 1 ? 's' : ''} · {dispo} dispo · {louees} en location · {totalUnits} unité{totalUnits > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--montoya-accent)' }}>
          <Plus size={16} /> Ajouter une arme
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 lg:w-[280px]"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une arme..."
            className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#fff' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {['Tous', 'Disponible', 'Loué', 'Rendu'].map(s => (
            <Pill key={s} label={s} active={activeStatut === s} onClick={() => setActiveStatut(s)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <Swords size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucune arme. Ajoutez votre première arme au catalogue.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => (
            <div key={a.id} className="rounded-2xl p-5 relative"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => onDelete(a)} title="Supprimer"
                className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ color: '#808080', background: '#121212' }}><X size={14} /></button>
              <div className="flex items-center gap-2 mb-1.5 pr-8">
                <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: '#808080' }}>{a.categorie || 'Sans catégorie'}</span>
                <StatutBadge statut={a.statut} />
              </div>
              <div className="text-[16px] font-semibold text-white mb-1">{a.nom}</div>
              {a.description && <div className="text-[12.5px] leading-snug mb-2" style={{ color: '#808080' }}>{a.description}</div>}
              {a.locataire && <div className="text-[11.5px] flex items-center gap-1.5" style={{ color: '#808080' }}><span style={{ color: '#666' }}>Loué à :</span> {a.locataire}</div>}
              <div className="flex items-center justify-between mt-3">
                <div className="text-[14px] font-bold text-white">{a.prix_location ? `${a.prix_location} $` : '—'}<span className="text-[11px] font-normal" style={{ color: '#666' }}> /location</span></div>
                {a.caution ? <div className="text-[11px]" style={{ color: '#808080' }}>Caution : {a.caution} $</div> : null}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setRentTarget(a)} disabled={a.statut === 'Loué'}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold transition-colors disabled:opacity-40"
                  style={{ background: '#1a1a1a', color: '#ff7a4d', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <KeyRound size={14} /> {a.statut === 'Loué' ? 'En location' : 'Louer'}
                </button>
                <button onClick={() => onReturn(a)} disabled={a.statut !== 'Loué'}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold transition-colors disabled:opacity-30"
                  style={{ background: '#1a1a1a', color: '#808080', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Undo2 size={14} /> Rendre
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AddModal onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} />
      )}

      {rentTarget && (
        <RentModal arme={rentTarget} onClose={() => setRentTarget(null)} onConfirm={(data) => { onRent?.(rentTarget, data); setRentTarget(null); }} />
      )}

      <StockHistory movements={movements} keyword="arme" title="Historique des armes" subtitle="Locations et mouvements d'armes" />
    </div>
  );
}

function StatutBadge({ statut }) {
  const map = {
    Disponible: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
    Loué: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    Rendu: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
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
  const [form, setForm] = useState({ nom: '', categorie: '', prix_location: '', caution: '', quantite: '', description: '' });
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
            <input name="categorie" value={form.categorie} onChange={handleChange} placeholder="Ex : Pistolet, Fusil..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
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

function RentModal({ arme, onClose, onConfirm }) {
  const [form, setForm] = useState({ locataire: '', date_debut: '', date_retour: '', caution: arme.caution || '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.locataire.trim()) return;
    onConfirm({
      locataire: form.locataire.trim(),
      date_debut: form.date_debut,
      date_retour: form.date_retour,
      caution: parseFloat(form.caution) || 0,
    });
  };
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[440px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[17px] font-semibold text-white">Louer — {arme.nom}</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#808080' }}>Prix location : {arme.prix_location || 0} $</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Locataire *</label>
            <input name="locataire" value={form.locataire} onChange={handleChange} required placeholder="Nom du locataire"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Date début</label>
            <input type="date" name="date_debut" value={form.date_debut} onChange={handleChange}
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Date retour</label>
            <input type="date" name="date_retour" value={form.date_retour} onChange={handleChange}
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Caution encaissée ($)</label>
            <input type="number" name="caution" value={form.caution} onChange={handleChange} placeholder="0"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: 'var(--montoya-accent)' }}>Confirmer la location</button>
          </div>
        </form>
      </div>
    </div>
  );
}