import React, { useState } from 'react';
import { KeyRound, Check, Eye, EyeOff } from 'lucide-react';

export default function PasswordsView({ comptes, onUpdatePassword }) {
  const [drafts, setDrafts] = useState({}); // { [id]: newPassword }
  const [show, setShow] = useState({}); // { [id]: bool }
  const [saved, setSaved] = useState({}); // { [id]: bool }

  const setDraft = (id, value) => setDrafts(d => ({ ...d, [id]: value }));
  const toggleShow = (id) => setShow(s => ({ ...s, [id]: !s[id] }));

  const save = async (c) => {
    const pwd = (drafts[c.id] || '').trim();
    if (!pwd) return;
    await onUpdatePassword?.(c, pwd);
    setSaved(s => ({ ...s, [c.id]: true }));
    setDrafts(d => ({ ...d, [c.id]: '' }));
    setTimeout(() => setSaved(s => ({ ...s, [c.id]: false })), 2000);
  };

  const saveAll = async () => {
    const entries = comptes
      .map(c => ({ c, pwd: (drafts[c.id] || '').trim() }))
      .filter(x => x.pwd);
    for (const { c, pwd } of entries) {
      await onUpdatePassword?.(c, pwd);
      setDrafts(d => ({ ...d, [c.id]: '' }));
    }
    if (entries.length) {
      setSaved(s => {
        const next = { ...s };
        entries.forEach(x => { next[x.c.id] = true; });
        return next;
      });
      setTimeout(() => setSaved({}), 2000);
    }
  };

  const pendingCount = Object.values(drafts).filter(v => v && v.trim()).length;
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Mots de passe</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            Modifiez le mot de passe de chaque compte enregistré.
          </p>
        </div>
        <button onClick={saveAll} disabled={!pendingCount}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-40"
          style={{ background: '#9c27b0' }}>
          <Check size={16} /> Tout enregistrer {pendingCount ? `(${pendingCount})` : ''}
        </button>
      </div>

      {comptes.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <KeyRound size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun compte à modifier.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {comptes.map(c => {
            const isSaved = saved[c.id];
            const value = drafts[c.id] || '';
            return (
              <div key={c.id} className="rounded-2xl p-4"
                style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-white truncate">{c.nom}</div>
                    <div className="text-[11px]" style={{ color: '#808080' }}>{c.matricule} · {c.role}</div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ background: '#121212', color: '#808080' }}>
                    Actuel : {c.password}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input type={show[c.id] ? 'text' : 'password'} value={value}
                      onChange={(e) => setDraft(c.id, e.target.value)}
                      placeholder="Nouveau mot de passe"
                      className="w-full rounded-xl px-3 py-2.5 pr-9 text-[13px]" style={inputStyle} />
                    <button type="button" onClick={() => toggleShow(c.id)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: '#808080' }}>
                      {show[c.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <button onClick={() => save(c)} disabled={!value.trim()}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold text-white whitespace-nowrap disabled:opacity-40"
                    style={{ background: isSaved ? '#16a34a' : '#9c27b0' }}>
                    {isSaved ? <><Check size={14} /> OK</> : 'Enregistrer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}