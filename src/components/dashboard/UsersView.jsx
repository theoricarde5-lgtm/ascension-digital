import React from 'react';
import { Shield } from 'lucide-react';

export default function UsersView({ users, currentUser, onUpdateRole }) {
  return (
    <div className="max-w-[940px] mx-auto text-center">
      <div className="flex items-center justify-center gap-2.5 mb-2">
        <Shield size={20} style={{ color: '#C7B3FA' }} />
        <h1 className="font-display text-[22px] font-bold">Gestion des rôles</h1>
      </div>
      <p className="text-[13.5px] mb-7" style={{ color: '#A79FB5' }}>
        Assigne le rôle <b>Jefe</b> (accès complet) ou <b>Soldat</b> (lecture seule) à chaque membre.
      </p>

      <div className="rounded-[22px] p-[22px] text-left" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        {users.length === 0 ? (
          <div className="text-[12.5px] text-center py-[18px]" style={{ color: '#6C6479' }}>Aucun utilisateur.</div>
        ) : (
          users.map((u, i) => (
            <div key={u.id} className="flex items-center gap-3 py-3"
              style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <div className="w-9 h-9 rounded-full flex-none flex items-center justify-center text-xs font-bold font-display text-white"
                style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>
                {(u.full_name || u.email || '?').slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold">
                  {u.full_name || u.email}
                  {u.id === currentUser?.id && <span className="ml-2 text-[10px] font-bold uppercase" style={{ color: '#C7B3FA' }}>Toi</span>}
                </div>
                <div className="text-[11.5px] mt-0.5" style={{ color: '#6C6479' }}>{u.email}</div>
              </div>
              <select value={u.coffre_role || 'Soldat'} onChange={(e) => onUpdateRole(u, e.target.value)}
                className="rounded-full px-3 py-2 text-xs font-semibold cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' }}>
                <option value="Jefe">Jefe</option>
                <option value="Soldat">Soldat</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}