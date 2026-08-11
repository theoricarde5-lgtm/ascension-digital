import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PinGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const verify = async (value) => {
    setChecking(true);
    try {
      const res = await base44.functions.invoke('verifyCoffrePin', { pin: value });
      if (res.data?.valid) {
        setUnlocked(true);
        setError(false);
      } else {
        setError(true);
        setEntry('');
      }
    } catch (e) {
      setError(true);
      setEntry('');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (entry.length < 4) return;
    verify(entry);
  };

  const press = (d) => {
    if (entry.length >= 6 || checking) return;
    const next = entry + d;
    setEntry(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => verify(next), 120);
    }
  };

  const back = () => { setEntry(entry.slice(0, -1)); setError(false); };

  if (unlocked) return children;

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: '#0D0B12', color: '#F5F3F9', fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed -top-[200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)', opacity: 0.16, filter: 'blur(110px)' }} />

      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-[340px] px-6 text-center">
        <div className="w-[52px] h-[52px] rounded-[15px] mx-auto mb-5 flex items-center justify-center font-display font-bold text-white text-[20px]"
          style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)', boxShadow: '0 10px 24px -8px rgba(139,92,246,0.6)' }}>M</div>
        <h1 className="font-display text-[22px] font-bold tracking-tight">Accès à la compta</h1>
        <p className="text-[13px] mt-1.5 mb-7" style={{ color: '#A79FB5' }}>Saisis le code PIN pour entrer.</p>

        <div className="flex items-center justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className="w-[14px] h-[14px] rounded-full transition-colors"
              style={entry.length > i
                ? { background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }
                : { background: 'rgba(255,255,255,0.10)' }} />
          ))}
        </div>

        {error && <div className="text-[12px] mb-4" style={{ color: '#FB7185' }}>Code incorrect, réessaie.</div>}

        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
          {['1','2','3','4','5','6','7','8','9'].map(d => (
            <button key={d} type="button" disabled={checking} onClick={() => press(d)}
              className="h-[58px] rounded-[14px] font-display text-[20px] font-semibold transition-colors disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>{d}</button>
          ))}
          <div />
          <button type="button" disabled={checking} onClick={() => press('0')}
            className="h-[58px] rounded-[14px] font-display text-[20px] font-semibold transition-colors disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>0</button>
          <button type="button" disabled={checking} onClick={back}
            className="h-[58px] rounded-[14px] flex items-center justify-center transition-colors disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#A79FB5' }}>
            <Delete size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}