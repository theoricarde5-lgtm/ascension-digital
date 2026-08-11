import React from 'react';
import { fmt } from '@/lib/coffre';

export default function BijouxInventoryView({ bijoux }) {
  const totalQuantite = bijoux.reduce((s, o) => s + (o.quantite || 0), 0);
  const totalValeur = bijoux.reduce((s, o) => s + (o.prix || 0) * (o.quantite || 0), 0);

  return (
    <>
      <div className="mb-[18px] mt-2">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Inventaire Bijoux</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Chaque bijou possède sa propre colonne, avec ses attributs en lignes.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Stat label="Bijoux" value={String(bijoux.length)} />
        <Stat label="Quantité totale" value={String(totalQuantite)} />
        <Stat label="Valeur totale" value={fmt(totalValeur)} />
      </div>

      {bijoux.length === 0 ? (
        <div className="rounded-[22px] p-[22px] text-[12.5px] text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#6C6479' }}>
          Aucun bijou enregistré pour l'instant.
        </div>
      ) : (
        <div className="rounded-[22px] overflow-x-auto" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="px-[18px] py-3.5 text-[11px] font-bold uppercase tracking-wider sticky left-0 z-10"
                  style={{ color: '#6C6479', background: 'rgba(13,11,18,0.95)' }}>Attribut</th>
                {bijoux.map(o => (
                  <th key={o.id} className="px-[18px] py-3.5 text-[13px] font-display font-bold align-bottom"
                    style={{ borderLeft: '1px solid rgba(255,255,255,0.10)' }}>
                    {o.nom}
                    {o.description && <span className="block text-[11px] font-normal mt-0.5" style={{ color: '#6C6479' }}>{o.description}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Catégorie" items={bijoux} render={o => (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.14)', color: '#C7B3FA' }}>
                  {o.categorie || 'Sans catégorie'}
                </span>
              )} />
              <Row label="Prix unitaire" items={bijoux} render={o => o.prix ? fmt(o.prix) : '—'} />
              <Row label="Quantité" items={bijoux} render={o => o.quantite || 0} />
              <Row label="Valeur" items={bijoux} render={o => fmt((o.prix || 0) * (o.quantite || 0))} bold />
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Row({ label, items, render, bold }) {
  return (
    <tr style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
      <td className="px-[18px] py-3.5 text-[11px] font-bold uppercase tracking-wider sticky left-0 z-10"
        style={{ color: '#6C6479', background: 'rgba(13,11,18,0.95)' }}>{label}</td>
      {items.map(o => (
        <td key={o.id} className={`px-[18px] py-3.5 text-[13px] ${bold ? 'font-bold' : ''}`}
          style={{ borderLeft: '1px solid rgba(255,255,255,0.10)' }}>
          {render(o)}
        </td>
      ))}
    </tr>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl px-[18px] py-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
      <div className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6C6479' }}>{label}</div>
      <div className="font-display text-[19px] font-bold">{value}</div>
    </div>
  );
}