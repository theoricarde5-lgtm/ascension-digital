import React, { useState } from 'react';
import { fmt, initials, dateStr } from '@/lib/coffre';

export default function MovementsPanel({ canAdd, canDelete, movements, onAdd, onDelete }) {
  const [type, setType] = useState('depot');
  const [montant, setMontant] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mt = parseFloat(montant);
    if (!mt || mt <= 0 || !note.trim()) return;
    onAdd(type, mt, note.trim());
    setMontant('');
    setNote('');
  };

  return (
    <div className="rounded-[22px] p-[22px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
      <h2 className="font-display text-[15.5px] font-bold mb-4 text-center">Mouvements du coffre</h2>

      {!canAdd && !canDelete && (
        <div className="text-[12.5px] mb-4 px-3.5 py-3 rounded-[11px]"
          style={{ color: '#6C6479', background: 'rgba(255,255,255,0.07)', border: '1px dashed rgba(255,255,255,0.10)' }}>
          🔒 Tu n'as pas la permission de modifier la comptabilité. Tu es en lecture seule.
        </div>
      )}

      {canAdd && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-[100px_110px_1fr_auto] gap-2 mb-4">
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="rounded-[11px] px-3 py-2.5 text-[13px]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' }}>
            <option value="depot">Dépôt</option>
            <option value="retrait">Retrait</option>
          </select>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="Montant $" min="1" required
            className="rounded-[11px] px-3 py-2.5 text-[13px]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' }} />
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Motif (ex : vente moto #2072039)" required
            className="rounded-[11px] px-3 py-2.5 text-[13px]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' }} />
          <button type="submit" className="rounded-[11px] px-4 text-[13px] font-bold text-white"
            style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>Ajouter</button>
        </form>
      )}

      {movements.length === 0 ? (
        <div className="text-[12.5px] text-center py-[18px]" style={{ color: '#6C6479' }}>Aucun mouvement pour l'instant.</div>
      ) : (
        movements.map((m, i) => {
          const isDepot = m.type === 'depot';
          return (
            <div key={m.id} className="flex items-center gap-3 py-3"
              style={{ borderBottom: i < movements.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <div className="w-9 h-9 rounded-full flex-none flex items-center justify-center text-xs font-bold font-display text-white"
                style={{ background: isDepot ? 'linear-gradient(135deg, rgba(74,222,128,0.55), rgba(74,222,128,0.25))' : 'linear-gradient(135deg, rgba(251,113,133,0.55), rgba(251,113,133,0.25))' }}>
                {initials(m.note)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold">{m.note}</div>
                <div className="text-[11.5px] mt-0.5" style={{ color: '#6C6479' }}>{dateStr(m.created_date)}</div>
              </div>
              <div className="text-right flex-none">
                <div className="text-[12px] font-bold" style={{ color: isDepot ? '#4ADE80' : '#FB7185' }}>
                  {isDepot ? '+' : '-'}{fmt(m.montant)}
                </div>
              </div>
              {canDelete && (
                <button onClick={() => onDelete(m)} title="Supprimer"
                  className="w-[22px] h-[22px] rounded-[7px] flex-none flex items-center justify-center ml-2 text-xs"
                  style={{ color: '#6C6479' }}>✕</button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}