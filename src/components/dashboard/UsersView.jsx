import React from 'react';
import { Shield, Phone } from 'lucide-react';
import { dateStr } from '@/lib/coffre';

const ROLES = [
  { key: 'Administrateur', color: '#F472B6' },
  { key: 'Jefe', color: '#C7B3FA' },
  { key: 'Soldat', color: '#A79FB5' },
];

const GROUPS = [
  {
    title: 'Comptabilité (mouvements)',
    perms: [
      { key: 'movements', label: 'Voir les mouvements' },
      { key: 'movements_add', label: 'Ajouter un mouvement' },
      { key: 'movements_delete', label: 'Supprimer un mouvement' },
    ],
  },
  {
    title: 'Inventaire',
    perms: [
      { key: 'objets', label: 'Objets' },
      { key: 'bijoux', label: 'Bijoux' },
      { key: 'categories', label: 'Catégories' },
      { key: 'bijouxCategories', label: 'Cat. Bijoux' },
    ],
  },
];

export default function UsersView({ users, currentUser, onUpdateRole, permissions, onUpdatePermission }) {
  const rolePerm = (r) => permissions.find(p => p.role === r) || {};

  const Toggle = ({ perm, permKey }) => {
    const val = !!(perm && perm[permKey]);
    return (
      <button onClick={() => perm && onUpdatePermission(perm, permKey, !val)}
        className="w-[42px] h-[24px] rounded-full relative transition-colors"
        style={{ background: val ? 'linear-gradient(120deg, #8B5CF6, #F472B6)' : 'rgba(255,255,255,0.10)' }}>
        <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all"
          style={{ left: val ? '21px' : '3px' }} />
      </button>
    );
  };

  return (
    <div className="max-w-[940px] mx-auto text-center">
      <div className="flex items-center justify-center gap-2.5 mb-2">
        <Shield size={20} style={{ color: '#C7B3FA' }} />
        <h1 className="font-display text-[22px] font-bold">Gestion des rôles</h1>
      </div>
      <p className="text-[13.5px] mb-7" style={{ color: '#A79FB5' }}>
        Configure ce que chaque rôle peut faire, puis assigne le rôle à chaque membre.
      </p>

      <div className="rounded-[22px] p-[22px] mb-5 text-left" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <h2 className="font-display text-[15.5px] font-bold mb-4 text-center">Permissions par rôle</h2>
        <div className="space-y-5">
          {GROUPS.map(g => (
            <div key={g.title}>
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#6C6479' }}>{g.title}</div>
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-5 gap-y-3 items-center justify-items-center">
                <div />
                {ROLES.map(r => (
                  <div key={r.key} className="text-[11px] font-bold uppercase tracking-wider" style={{ color: r.color }}>{r.key}</div>
                ))}
                {g.perms.map(p => (
                  <React.Fragment key={p.key}>
                    <div className="text-[13px] font-semibold justify-self-start">{p.label}</div>
                    {ROLES.map(r => <Toggle key={r.key} perm={rolePerm(r.key)} permKey={p.key} />)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[22px] p-[22px] text-left" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <h2 className="font-display text-[15.5px] font-bold mb-4 text-center">Membres</h2>
        {users.length === 0 ? (
          <div className="text-[12.5px] text-center py-[18px]" style={{ color: '#6C6479' }}>Aucun utilisateur.</div>
        ) : (
          users.map((u, i) => (
            <div key={u.id} className="flex items-center gap-3 py-3"
              style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <div className="w-9 h-9 rounded-full flex-none flex items-center justify-center text-xs font-bold font-display text-white"
                style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>
                {(u.username || u.full_name || u.email || '?').slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold">
                  {u.username || u.full_name || u.email}
                  {u.id === currentUser?.id && <span className="ml-2 text-[10px] font-bold uppercase" style={{ color: '#C7B3FA' }}>Toi</span>}
                </div>
                <div className="text-[11.5px] mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: '#6C6479' }}>
                  <span className="truncate">{u.email}</span>
                  {u.phone && <span className="inline-flex items-center gap-1"><Phone size={10} />{u.phone}</span>}
                  <span>· inscrit {dateStr(u.created_date)}</span>
                </div>
              </div>
              <select value={u.coffre_role || 'Soldat'} onChange={(e) => onUpdateRole(u, e.target.value)}
                className="rounded-full px-3 py-2 text-xs font-semibold cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' }}>
                <option value="Administrateur">Administrateur</option>
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