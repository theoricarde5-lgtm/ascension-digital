import React from 'react';

export default function ChipStrip() {
  const chips = [
    { label: 'Indicateur 4', value: '0 %', accent: true },
    { label: 'Indicateur 5', value: '0 %', accent: true },
    { label: 'Indicateur 6', value: '$0', accent: false },
    { label: 'Indicateur 7', value: '0', accent: false },
  ];
  return (
    <div className="flex gap-3 overflow-x-auto my-6 pb-1">
      {chips.map((c, i) => (
        <div key={i} className="flex-none min-w-[150px] rounded-[11px] px-4 py-[13px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6C6479' }}>{c.label}</div>
          <div className="font-display text-[17px] font-bold"
            style={c.accent
              ? { background: 'linear-gradient(120deg, #8B5CF6, #F472B6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
              : { color: '#F5F3F9' }}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}