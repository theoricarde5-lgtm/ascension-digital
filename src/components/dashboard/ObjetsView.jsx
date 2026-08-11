import React, { useState } from 'react';
import { fmt } from '@/lib/coffre';

export default function ObjetsView({ objets, categories, onAdd, onDelete, canEdit }) {
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
    setForm({ nom: '', categorie: '', prix: '', quantite: '', description: '' });
  };

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' };

  return (
    <>
      <div className="mb-[18px] mt-2">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Objet</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Ajoute et consulte tes objets manuellement.</p>
      </div>

      {canEdit && (
      <form onSubmit={handleSubmit}
        className="rounded-[22px] p-[22px] mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <Field label="Nom *"><input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom de l'objet" className="w-full rounded-[11px] px-3 py-2.5 text-[13px]" style={inputStyle} /></Field>
        <Field label="Catégorie">
          <select name="categorie" value={form.categorie} onChange={handleChange} className="w-full rounded-[11px] px-3 py-2.5 text-[13px]" style={inputStyle}>
            <option value="">— Choisir une catégorie —</option>
            {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
          </select>
        </Field>
        <Field label="Prix ($)"><input name="prix" type="number" value={form.prix} onChange={handleChange} placeholder="0" className="w-full rounded-[11px] px-3 py-2.5 text-[13px]" style={inputStyle} /></Field>
        <Field label="Quantité"><input name="quantite" type="number" value={form.quantite} onChange={handleChange} placeholder="0" className="w-full rounded-[11px] px-3 py-2.5 text-[13px]" style={inputStyle} /></Field>
        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Description"><textarea name="description" value={form.description} onChange={handleChange} placeholder="Détails de l'objet..." className="w-full rounded-[11px] px-3 py-2.5 text-[13px] resize-vertical min-h-[70px]" style={inputStyle} /></Field>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <button type="submit" className="rounded-[11px] px-4 py-2.5 text-[13px] font-bold text-white"
            style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>Ajouter l'objet</button>
        </div>
      </form>
      )}

      {objets.length === 0 ? (
        <div className="rounded-[22px] p-[22px] text-[12.5px] text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#6C6479' }}>
          Aucun objet pour l'instant.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {objets.map(o => (
            <div key={o.id} className="rounded-[22px] p-[18px] relative"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
              {canEdit && (
              <button onClick={() => onDelete(o)} title="Supprimer"
                className="absolute top-3 right-3 w-[22px] h-[22px] rounded-[7px] flex items-center justify-center text-xs"
                style={{ color: '#6C6479' }}>✕</button>
              )}
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5 pr-6" style={{ color: '#6C6479' }}>{o.categorie || 'Sans catégorie'}</div>
              <div className="font-display text-[16px] font-bold mb-0.5">{o.nom}</div>
              {o.description && <div className="text-[12.5px] leading-[1.5] mb-3" style={{ color: '#A79FB5' }}>{o.description}</div>}
              <div className="flex items-center justify-between mt-3">
                <div className="font-display text-[15px] font-bold">{o.prix ? fmt(o.prix) : '—'}</div>
                {o.quantite ? <div className="text-[11px]" style={{ color: '#6C6479' }}>Qté : {o.quantite}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#A79FB5' }}>{label}</label>
      {children}
    </div>
  );
}