import React from 'react';

export default function SidePanel({ announcement, onOpenForm }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="rounded-[22px] p-[22px] text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        {announcement ? (
          <div className="pl-3.5" style={{ borderLeft: '3px solid', borderImage: 'linear-gradient(120deg, #8B5CF6, #F472B6) 1' }}>
            <div className="font-bold text-[13.5px] mb-1">{announcement.title}</div>
            <div className="text-[11px] mb-2" style={{ color: '#6C6479' }}>{announcement.author} · {announcement.date}</div>
            <div className="text-[12.5px] leading-[1.55]" style={{ color: '#A79FB5' }}>{announcement.body}</div>
          </div>
        ) : (
          <div className="text-[12.5px]" style={{ color: '#6C6479' }}>Aucune annonce pour l'instant.</div>
        )}
      </div>

      <button onClick={onOpenForm} className="rounded-2xl px-5 py-[18px] text-left text-white transition-transform hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>
        <h3 className="font-display text-[14.5px] font-bold mb-1">Faire une demande</h3>
        <p className="text-xs opacity-90">Ouvrir le formulaire de contact</p>
      </button>
    </div>
  );
}