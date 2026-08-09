import React from 'react';

export default function Toast({ show, message }) {
  return (
    <div className="fixed bottom-[26px] left-1/2 -translate-x-1/2 px-5 py-3 rounded-[11px] text-[13px] font-semibold flex items-center gap-2 z-[200] transition-all duration-200"
      style={{
        background: '#17141F', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9',
        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        opacity: show ? 1 : 0, pointerEvents: 'none',
        transform: show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
      }}>
      <span className="w-2 h-2 rounded-full" style={{ background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
      {message}
    </div>
  );
}