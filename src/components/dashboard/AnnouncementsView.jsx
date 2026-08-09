import React from 'react';
import { dateStr } from '@/lib/coffre';

export default function AnnouncementsView({ announcements }) {
  return (
    <>
      <div className="mb-[18px] mt-2">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Annonces</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Toutes les annonces publiées sur le panel.</p>
      </div>
      <div className="flex flex-col gap-4">
        {announcements.length === 0 ? (
          <div className="rounded-[22px] p-[22px] text-[12.5px] text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#6C6479' }}>
            Aucune annonce pour l'instant.
          </div>
        ) : (
          announcements.map(a => (
            <div key={a.id} className="rounded-[22px] p-[22px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div className="pl-3.5" style={{ borderLeft: '3px solid', borderImage: 'linear-gradient(120deg, #8B5CF6, #F472B6) 1' }}>
                <div className="font-bold text-[15px] mb-1">{a.title}</div>
                <div className="text-[11px] mb-2" style={{ color: '#6C6479' }}>{a.author} · {a.date || dateStr(a.created_date)}</div>
                <div className="text-[13px] leading-[1.6]" style={{ color: '#A79FB5' }}>{a.body}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}