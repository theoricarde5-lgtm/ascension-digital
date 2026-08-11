import React from 'react';
import { fmt } from '@/lib/coffre';

export default function HeroSection({ solde, totalDepot, totalRetrait, movementCount, userName }) {
  const sparks = [35, 55, 40, 70, 50, 85, 65, 100];
  return (
    <>
      <div className="mb-[18px] mt-2 text-center">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Bonjour, {userName?.split(' ')[0] || 'Fernando'}</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Voici l'état du coffre de l'entreprise.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[18px] max-w-[940px] mx-auto">
        <div className="rounded-[22px] p-[26px] relative overflow-hidden flex flex-col justify-between min-h-[230px]"
          style={{ background: 'linear-gradient(165deg, rgba(139,92,246,0.18), rgba(244,114,182,0.06)), rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="absolute -right-[60px] -top-[60px] w-[220px] h-[220px] rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)', opacity: 0.18, filter: 'blur(50px)' }} />
          <div className="relative">
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#A79FB5' }}>Solde du coffre</div>
            <div className="font-display text-[42px] font-extrabold mt-2.5 tracking-tight">{fmt(solde)}</div>
            <div className="text-[12.5px] mt-1.5" style={{ color: '#A79FB5' }}>
              {movementCount} mouvement{movementCount > 1 ? 's' : ''} enregistré{movementCount > 1 ? 's' : ''}
            </div>
          </div>
          <div className="flex items-end gap-[5px] h-[44px] mt-[18px] relative">
            {sparks.map((h, i) => (
              <span key={i} className="block w-[7px] rounded-t"
                style={{ height: `${h}%`, background: 'linear-gradient(120deg, #8B5CF6, #F472B6)', opacity: i === sparks.length - 1 ? 1 : 0.55 }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <MiniCard label="Total déposé" value={fmt(totalDepot)} icon="↑" />
          <MiniCard label="Total retiré" value={fmt(totalRetrait)} icon="↓" />
        </div>
      </div>
    </>
  );
}

function MiniCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl px-[18px] py-4 flex items-center justify-between"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6C6479' }}>{label}</div>
        <div className="font-display text-[19px] font-bold">{value}</div>
      </div>
      <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px]"
        style={{ background: 'rgba(139,92,246,0.14)', color: '#C7B3FA' }}>{icon}</div>
    </div>
  );
}