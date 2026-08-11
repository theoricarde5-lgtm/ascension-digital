import React from 'react';
import { LogOut, Edit3 } from 'lucide-react';

export default function TopNav({ currentView, onViewChange, role, onRoleChange, user, onOpenForm, onLogout }) {
  const pills = [
    { id: 'dashboard', label: 'Espace personnel' },
    { id: 'objets', label: 'Objet' },
    { id: 'inventaire', label: 'Inventaire' },
    { id: 'categories', label: 'Catégories' },
    { id: 'bijoux', label: 'Bijoux' },
    { id: 'bijoux-inventaire', label: 'Inv. Bijoux' },
    { id: 'bijoux-categories', label: 'Cat. Bijoux' },
    { id: 'requests', label: 'Demandes' },
    { id: 'logs', label: 'Logs' },
    { id: 'announcements', label: 'Annonces' },
  ];

  return (
    <div className="flex items-center justify-between gap-5 py-[22px]">
      <div className="flex items-center gap-2.5">
        <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center font-display font-bold text-white text-[15px]"
          style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)', boxShadow: '0 8px 18px -6px rgba(139,92,246,0.55)' }}>M</div>
        <div className="font-display font-bold text-[15px]">Montoya</div>
      </div>

      <div className="hidden md:flex items-center gap-1 rounded-full p-1"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        {pills.map(p => (
          <button key={p.id} onClick={() => onViewChange(p.id)}
            className="px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors"
            style={currentView === p.id
              ? { background: 'linear-gradient(120deg, #8B5CF6, #F472B6)', color: '#fff' }
              : { color: '#A79FB5' }}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <select value={role} onChange={(e) => onRoleChange(e.target.value)} title="Simuler le rôle connecté"
          className="rounded-full px-3 py-2 text-xs font-semibold cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#A79FB5' }}>
          <option value="Jefe">Rôle : Jefe</option>
          <option value="Soldat">Rôle : Soldat</option>
        </select>
        <button onClick={onOpenForm} title="Formulaire"
          className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#A79FB5' }}>
          <Edit3 size={15} />
        </button>
        <button onClick={onLogout} title="Déconnexion"
          className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#A79FB5' }}>
          <LogOut size={15} />
        </button>
        <div className="flex items-center gap-2.5 pl-1.5 pr-3.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="w-7 h-7 rounded-full" style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }} />
          <div>
            <div className="text-[12.5px] font-semibold">{user?.full_name || 'Fernando'}</div>
            <div className="text-[10px]" style={{ color: '#6C6479' }}>{role} · #01</div>
          </div>
        </div>
      </div>
    </div>
  );
}