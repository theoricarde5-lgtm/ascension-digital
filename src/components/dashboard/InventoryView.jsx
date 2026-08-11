import React from 'react';
import { fmt } from '@/lib/coffre';

export default function InventoryView({ objets }) {
  const totalQuantite = objets.reduce((s, o) => s + (o.quantite || 0), 0);
  const totalValeur = objets.reduce((s, o) => s + (o.prix || 0) * (o.quantite || 0), 0);

  return (
    <>
      <div className="mb-[18px] mt-2">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Inventaire</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Tous les objets enregistrés, en tableau récapitulatif.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Stat label="Objets" value={String(objets.length)} />
        <Stat label="Quantité totale" value={String(totalQuantite)} />
        <Stat label="Valeur totale" value={fmt(totalValeur)} />
      </div>

      <div className="rounded-[22px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        {objets.length === 0 ? (
          <div className="text-[12.5px] text-center py-[26px]" style={{ color: '#6C6479' }}>Aucun objet enregistré pour l'instant.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                <Th>Nom</Th>
                <Th>Catégorie</Th>
                <Th align="right">Prix unitaire</Th>
                <Th align="right">Quantité</Th>
                <Th align="right">Valeur</Th>
              </tr>
            </thead>
            <tbody>
              {objets.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: i < objets.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <Td>
                    <span className="font-semibold">{o.nom}</span>
                    {o.description && <span className="block text-[11px] mt-0.5" style={{ color: '#6C6479' }}>{o.description}</span>}
                  </Td>
                  <Td>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.14)', color: '#C7B3FA' }}>
                      {o.categorie || 'Sans catégorie'}
                    </span>
                  </Td>
                  <Td align="right">{o.prix ? fmt(o.prix) : '—'}</Td>
                  <Td align="right">{o.quantite || 0}</Td>
                  <Td align="right" className="font-semibold">{fmt((o.prix || 0) * (o.quantite || 0))}</Td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                <Td className="font-bold" colSpan={3}>Total</Td>
                <Td align="right" className="font-bold">{totalQuantite}</Td>
                <Td align="right" className="font-bold">{fmt(totalValeur)}</Td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
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

function Th({ children, align = 'left' }) {
  return (
    <th className="px-[18px] py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#6C6479', textAlign: align }}>
      {children}
    </th>
  );
}

function Td({ children, align = 'left', className = '', colSpan }) {
  return (
    <td className={`px-[18px] py-3.5 text-[13px] ${className}`} style={{ textAlign: align }} colSpan={colSpan}>
      {children}
    </td>
  );
}