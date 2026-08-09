import React, { useState, useEffect } from 'react';

export default function RequestModal({ open, onClose, onSubmit }) {
  const [type, setType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !subject.trim() || !message.trim()) return;
    onSubmit(type, subject.trim(), message.trim());
    setType(''); setSubject(''); setMessage('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-5"
      style={{ background: 'rgba(5,4,9,0.62)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-[460px] rounded-[22px]"
        style={{ background: '#17141F', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px rgba(0,0,0,0.55)' }}>
        <div className="flex justify-between items-center px-[22px] py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="font-display text-base font-bold">Nouveau formulaire</div>
          <button onClick={onClose} className="w-[30px] h-[30px] rounded-[11px] flex items-center justify-center text-[15px]"
            style={{ color: '#A79FB5', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="px-[22px] py-[22px] flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#A79FB5' }}>Type de demande</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required
              className="w-full rounded-[11px] px-3 py-2.5 text-[13.5px]"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' }}>
              <option value="" disabled>Choisir un type</option>
              <option>Demande générale</option>
              <option>Réclamation</option>
              <option>Suggestion</option>
              <option>Signalement d'un bug</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#A79FB5' }}>Sujet</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Résume ta demande en quelques mots" required
              className="w-full rounded-[11px] px-3 py-2.5 text-[13.5px]"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#A79FB5' }}>Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Décris ta demande en détail..." required
              className="w-full rounded-[11px] px-3 py-2.5 text-[13.5px] resize-vertical min-h-[90px]"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' }} />
          </div>
          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-[11px] text-[13px] font-semibold"
              style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)', color: '#F5F3F9' }}>Annuler</button>
            <button type="submit" className="px-4 py-2.5 rounded-[11px] text-[13px] font-bold text-white"
              style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  );
}