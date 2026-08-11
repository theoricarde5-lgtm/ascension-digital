import React, { useState } from 'react';
import { Plus, X, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function CoffreView({ movements, onAdd, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);

  const solde = movements.reduce((s, m) => s + (m.type === 'depot' ? m.montant : -m.montant), 0);
  const totalDepots = movements.filter(m => m.type === 'depot').reduce((s, m) => s + m.montant, 0);
  const totalRetraits = movements.filter(m => m.type === 'retrait').reduce((s, m) => s + m.montant, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Registre de sommes</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {movements.length} mouvement{movements.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--montoya-accent)' }}>
          <Plus size={16} /> Ajouter un mouvement
        </button>
      </div>

      {/* Solde + stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl p-5" style={{ background: '#1c1c1c', borderTop: '3px solid #ff5722' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: '#ff572222', color: '#ff5722' }}>
            <Wallet size={20} />
          </div>
          <div className="text-[28px] font-bold text-white leading-none mb-1.5">{solde} $</div>
          <div className="text-[13px]" style={{ color: '#808080' }}>Solde du coffre</div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: '#1c1c1c', borderTop: '3px solid #448aff' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: '#448aff22', color: '#448aff' }}>
            <TrendingUp size={20} />
          </div>
          <div className="text-[28px] font-bold text-white leading-none mb-1.5">{totalDepots} $</div>
          <div className="text-[13px]" style={{ color: '#808080' }}>Total dépôts</div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: '#1c1c1c', borderTop: '3px solid #9c27b0' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: '#9c27b022', color: '#9c27b0' }}>
            <TrendingDown size={20} />
          </div>
          <div className="text-[28px] font-bold text-white leading-none mb-1.5">{totalRetraits} $</div>
          <div className="text-[13px]" style={{ color: '#808080' }}>Total retraits</div>
        </div>
      </div>

      {/* Movements list */}
      <div className="rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 className="text-[15px] font-semibold text-white mb-4">Mouvements</h2>
        {movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)', color: '#808080' }}>
              <Wallet size={26} />
            </div>
            <div className="text-[13.5px]" style={{ color: '#808080' }}>Aucun mouvement pour l'instant.</div>
          </div>
        ) : (
          movements.map((m, i) => {
            const isDepot = m.type === 'depot';
            return (
              <div key={m.id} className="flex items-center gap-3 py-3"
                style={{ borderBottom: i < movements.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="w-9 h-9 rounded-full flex-none flex items-center justify-center"
                  style={{ background: isDepot ? '#448aff22' : '#9c27b022', color: isDepot ? '#448aff' : '#9c27b0' }}>
                  {isDepot ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-white">{m.note}</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: '#808080' }}>
                    {isDepot ? 'Dépôt' : 'Retrait'}
                  </div>
                </div>
                <div className="text-[14px] font-bold" style={{ color: isDepot ? '#448aff' : '#9c27b0' }}>
                  {isDepot ? '+' : '-'}{m.montant} $
                </div>
                <button onClick={() => onDelete(m)} title="Supprimer"
                  className="w-7 h-7 rounded-lg flex-none flex items-center justify-center ml-2"
                  style={{ color: '#808080', background: '#121212' }}><X size={13} /></button>
              </div>
            );
          })
        )}
      </div>

      {modalOpen && (
        <AddMovementModal onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} />
      )}
    </div>
  );
}

function AddMovementModal({ onClose, onAdd }) {
  const [type, setType] = useState('depot');
  const [montant, setMontant] = useState('');
  const [note, setNote] = useState('');
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mt = parseFloat(montant);
    if (!mt || mt <= 0 || !note.trim()) return;
    onAdd({ type, montant: mt, note: note.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[440px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-semibold text-white">Ajouter un mouvement</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setType('depot')}
              className="rounded-xl py-2.5 text-[13px] font-semibold"
              style={type === 'depot' ? { background: '#448aff', color: '#fff' } : { background: '#121212', color: '#ccc', border: '1px solid rgba(255,255,255,0.08)' }}>
              Dépôt
            </button>
            <button type="button" onClick={() => setType('retrait')}
              className="rounded-xl py-2.5 text-[13px] font-semibold"
              style={type === 'retrait' ? { background: '#9c27b0', color: '#fff' } : { background: '#121212', color: '#ccc', border: '1px solid rgba(255,255,255,0.08)' }}>
              Retrait
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Montant ($) *</label>
            <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="0" min="1" required
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Motif *</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex : vente moto #2072039" required
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: '#ff5722' }}>Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}