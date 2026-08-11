import React from 'react';
import { Tags } from 'lucide-react';

export default function SourcesView({ sources }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-white tracking-tight">Groupes</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
          {sources.length} groupe{sources.length > 1 ? 's' : ''} · liste des sources d'achat
        </p>
      </div>

      {sources.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <Tags size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun groupe. Ajoutez-en depuis le formulaire d'objet.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sources.map(s => (
            <div key={s.id} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--montoya-accent)', color: '#fff' }}>
                <Tags size={18} />
              </div>
              <div className="text-[14px] font-semibold text-white truncate">{s.nom}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}