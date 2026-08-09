import React from 'react';
import { dateStr } from '@/lib/coffre';

export default function LogsView({ logs }) {
  return (
    <>
      <div className="mb-[18px] mt-2">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Logs de la comptabilité</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Historique complet des actions effectuées sur le coffre.</p>
      </div>
      <div className="rounded-[22px] p-[22px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <h2 className="font-display text-[15.5px] font-bold mb-4">Toutes les actions</h2>
        {logs.length === 0 ? (
          <div className="text-[12.5px] text-center py-[18px]" style={{ color: '#6C6479' }}>Aucune action enregistrée pour l'instant.</div>
        ) : (
          logs.map((l, i) => (
            <div key={l.id} className="flex items-center gap-3 py-3 text-[12.5px]"
              style={{ borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <span className="flex-none text-[10.5px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                style={{ background: l.action === 'Ajout' ? 'rgba(74,222,128,0.14)' : 'rgba(251,113,133,0.14)', color: l.action === 'Ajout' ? '#4ADE80' : '#FB7185' }}>
                {l.action}
              </span>
              <div className="flex-1" style={{ color: '#A79FB5' }}>
                <b style={{ color: '#F5F3F9', fontWeight: 600 }}>{l.user}</b> ({l.role}) — {l.detail}
              </div>
              <div className="flex-none text-[11.5px] text-right" style={{ color: '#6C6479' }}>{dateStr(l.created_date)}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}