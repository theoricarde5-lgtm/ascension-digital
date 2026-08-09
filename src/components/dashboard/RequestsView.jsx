import React from 'react';
import { dateStr } from '@/lib/coffre';

export default function RequestsView({ requests }) {
  return (
    <>
      <div className="mb-[18px] mt-2">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Demandes</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Toutes les demandes envoyées via le formulaire.</p>
      </div>
      <div className="rounded-[22px] p-[22px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <h2 className="font-display text-[15.5px] font-bold mb-4">Toutes les demandes</h2>
        {requests.length === 0 ? (
          <div className="text-[12.5px] text-center py-[18px]" style={{ color: '#6C6479' }}>Aucune demande pour l'instant.</div>
        ) : (
          requests.map((r, i) => (
            <div key={r.id} className="py-3" style={{ borderBottom: i < requests.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="flex-none text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.14)', color: '#C7B3FA' }}>{r.type}</span>
                <div className="text-[13.5px] font-semibold flex-1">{r.subject}</div>
                <div className="flex-none text-[11.5px]" style={{ color: '#6C6479' }}>{dateStr(r.created_date)}</div>
              </div>
              <div className="text-[12.5px] leading-[1.55] pl-1" style={{ color: '#A79FB5' }}>{r.message}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}