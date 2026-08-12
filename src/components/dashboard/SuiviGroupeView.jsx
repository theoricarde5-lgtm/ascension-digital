import React, { useState, useMemo } from 'react';
import { Plus, X, FileText, Search, Trash2, Calendar, MapPin, Users, Tag, ClipboardList, CheckCircle2, NotebookPen } from 'lucide-react';

const TYPE_STYLE = {
  Réunion: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
  Patrouille: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  Transaction: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  Mission: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  Entraînement: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
  Autre: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
};

export default function SuiviGroupeView({ fiches, onAdd, onDelete, userRole, currentUser }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('Tous');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return fiches.filter(f => {
      const matchType = activeType === 'Tous' || f.type_activite === activeType;
      const q = query.toLowerCase();
      const matchQuery = !q || (f.groupe || '').toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q) || (f.lieu || '').toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [fiches, activeType, query]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Suivi de groupe</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {fiches.length} fiche{fiches.length > 1 ? 's' : ''} · Générez une fiche automatique après remplissage du formulaire
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--montoya-accent)' }}>
          <Plus size={16} /> Nouvelle fiche
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 lg:w-[280px]"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une fiche..."
            className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#fff' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill label="Tous" active={activeType === 'Tous'} onClick={() => setActiveType('Tous')} />
          {Object.keys(TYPE_STYLE).map(t => (
            <Pill key={t} label={t} active={activeType === t} onClick={() => setActiveType(t)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <NotebookPen size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucune fiche. Créez votre première fiche de suivi.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(f => {
            const s = TYPE_STYLE[f.type_activite] || TYPE_STYLE.Autre;
            return (
              <button key={f.id} onClick={() => setSelected(f)}
                className="rounded-2xl p-5 relative text-left transition-transform hover:scale-[1.02]"
                style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={(e) => { e.stopPropagation(); onDelete(f); }} title="Supprimer"
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ color: '#808080', background: '#121212' }}><Trash2 size={14} /></button>
                <div className="flex items-center gap-2 mb-2 pr-8">
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider"
                    style={{ background: s.bg, color: s.color }}>
                    {f.type_activite}
                  </span>
                </div>
                <div className="text-[16px] font-semibold text-white mb-1">{f.groupe}</div>
                <div className="flex items-center gap-3 text-[11.5px] flex-wrap" style={{ color: '#808080' }}>
                  {f.date && <span className="flex items-center gap-1"><Calendar size={12} /> {f.date}</span>}
                  {f.lieu && <span className="flex items-center gap-1"><MapPin size={12} /> {f.lieu}</span>}
                </div>
                {f.description && <div className="text-[12.5px] leading-snug mt-2 line-clamp-2" style={{ color: '#aaa' }}>{f.description}</div>}
              </button>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <FicheModal onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} auteur={currentUser?.nom} />
      )}

      {selected && (
        <FicheDetail fiche={selected} onClose={() => setSelected(null)} />
      )}
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

function FicheModal({ onClose, onAdd, auteur }) {
  const [form, setForm] = useState({
    groupe: '', date: new Date().toISOString().slice(0, 10), lieu: '', membres: '',
    type_activite: 'Réunion', description: '', resultat: '', notes: ''
  });
  const [done, setDone] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.groupe.trim()) return;
    onAdd({ ...form, auteur: auteur || '' });
  };
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[560px] rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[17px] font-semibold text-white">Nouvelle fiche de suivi</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#808080' }}>Remplissez les champs — la fiche est générée automatiquement</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Groupe / Nom *</label>
            <input name="groupe" value={form.groupe} onChange={handleChange} required placeholder="Ex : Los Diablos"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange}
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Lieu</label>
            <input name="lieu" value={form.lieu} onChange={handleChange} placeholder="Ex : Quartier Sud"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Membres présents</label>
            <input name="membres" value={form.membres} onChange={handleChange} placeholder="Ex : Fernando, Diego, Lucia"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Type d'activité</label>
            <select name="type_activite" value={form.type_activite} onChange={handleChange} className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle}>
              {Object.keys(TYPE_STYLE).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Détails de l'activité..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px] resize-none min-h-[70px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Résultat</label>
            <textarea name="resultat" value={form.resultat} onChange={handleChange} placeholder="Issue / conclusion..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px] resize-none min-h-[60px]" style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Notes complémentaires</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Remarques..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px] resize-none min-h-[50px]" style={inputStyle} />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: 'var(--montoya-accent)' }}>
              <CheckCircle2 size={15} /> Générer la fiche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FicheDetail({ fiche, onClose }) {
  const s = TYPE_STYLE[fiche.type_activite] || TYPE_STYLE.Autre;
  const rows = [
    { icon: Tag, label: 'Type', value: fiche.type_activite },
    { icon: Calendar, label: 'Date', value: fiche.date },
    { icon: MapPin, label: 'Lieu', value: fiche.lieu },
    { icon: Users, label: 'Membres présents', value: fiche.membres },
    { icon: ClipboardList, label: 'Description', value: fiche.description },
    { icon: CheckCircle2, label: 'Résultat', value: fiche.resultat },
    { icon: NotebookPen, label: 'Notes', value: fiche.notes },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[560px] rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--montoya-accent)', color: '#fff' }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-white">{fiche.groupe}</h3>
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider mt-0.5"
                style={{ background: s.bg, color: s.color }}>{fiche.type_activite}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <div className="flex flex-col gap-3">
          {rows.map(r => {
            const Icon = r.icon;
            if (!r.value) return null;
            return (
              <div key={r.label} className="rounded-xl p-3.5" style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#808080' }}>
                  <Icon size={12} /> {r.label}
                </div>
                <div className="text-[13px] text-white whitespace-pre-wrap">{r.value}</div>
              </div>
            );
          })}
          {fiche.auteur && (
            <div className="text-[11.5px] pt-2" style={{ color: '#666' }}>Fiche rédigée par {fiche.auteur}</div>
          )}
        </div>
      </div>
    </div>
  );
}