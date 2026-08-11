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

  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' };

  return (
    <div className="rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h2 className="text-[16px] font-semibold text-white mb-5">Mouvements du coffre</h2>

      {!canAdd && !canDelete && (
        <div className="text-[12.5px] mb-5 px-4 py-3 rounded-xl"
          style={{ color: '#808080', background: '#121212', border: '1px dashed rgba(255,255,255,0.08)' }}>
          🔒 Tu n'as pas la permission de modifier la comptabilité. Tu es en lecture seule.
        </div>
      )}

      {canAdd && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-[110px_120px_1fr_auto] gap-2 mb-5">
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle}>
            <option value="depot">Dépôt</option>
            <option value="retrait">Retrait</option>
          </select>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="Montant $" min="1" required
            className="rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Motif (ex : vente moto #2072039)" required
            className="rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          <button type="submit" className="rounded-xl px-4 text-[13px] font-semibold text-white"
            style={{ background: '#ff5722' }}>Ajouter</button>
        </form>
      )}

      {movements.length === 0 ? (
        <div className="text-[13px] text-center py-12" style={{ color: '#808080' }}>Aucun mouvement pour l'instant.</div>
      ) : (
        movements.map((m, i) => {
          const isDepot = m.type === 'depot';
          return (
            <div key={m.id} className="flex items-center gap-3 py-3"
              style={{ borderBottom: i < movements.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div className="w-9 h-9 rounded-full flex-none flex items-center justify-center text-xs font-bold text-white"
                style={{ background: isDepot ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)', color: isDepot ? '#4ade80' : '#f87171' }}>
                {initials(m.note)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-white">{m.note}</div>
                <div className="text-[11.5px] mt-0.5" style={{ color: '#808080' }}>{dateStr(m.created_date)}</div>
              </div>
              <div className="text-right flex-none">
                <div className="text-[13px] font-bold" style={{ color: isDepot ? '#4ade80' : '#f87171' }}>
                  {isDepot ? '+' : '-'}{fmt(m.montant)}
                </div>
              </div>
              {canDelete && (
                <button onClick={() => onDelete(m)} title="Supprimer"
                  className="w-[22px] h-[22px] rounded-md flex-none flex items-center justify-center ml-2 text-xs"
                  style={{ color: '#808080' }}>✕</button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}