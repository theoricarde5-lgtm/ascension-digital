import React, { useState } from 'react';
import { Plus, X, Shield, Trash2, Check, Ban, UserX } from 'lucide-react';

export const VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'objets', label: 'Objets' },
  { id: 'bijoux', label: 'Bijoux' },
  { id: 'outils', label: 'Stock Outils' },
  { id: 'coffre', label: 'Coffre' },
  { id: 'parametres', label: 'Paramètres' },
  { id: 'permissions', label: 'Permissions' },
];

export const ACTIONS = [
  { id: 'action_bannir', label: 'Bannir', icon: Ban },
  { id: 'action_exclure', label: 'Exclure', icon: UserX },
];

export default function PermissionsView({ roles, onAdd, onUpdate, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);

  const togglePerm = (role, viewId) => {
    const perms = role.permissions || [];
    const next = perms.includes(viewId) ? perms.filter(p => p !== viewId) : [...perms, viewId];
    onUpdate(role.id, { permissions: next });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Rôles & Permissions</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {roles.length} rôle{roles.length > 1 ? 's' : ''} défini{roles.length > 1 ? 's' : ''} · Accès réservé au rôle Dev
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: '#ff5722' }}>
          <Plus size={16} /> Ajouter un rôle
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <Shield size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun rôle. Créez votre premier rôle.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {roles.map(r => (
            <div key={r.id} className="rounded-2xl p-5"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(255,87,34,0.15)', color: '#ff5722' }}>
                    <Shield size={16} />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-white">{r.nom}</div>
                    <div className="text-[11.5px]" style={{ color: '#808080' }}>
                      {(r.permissions || []).length} accès autorisé{(r.permissions || []).length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <button onClick={() => onDelete(r)} title="Supprimer le rôle"
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ color: '#808080', background: '#121212' }}><Trash2 size={14} /></button>
              </div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#666' }}>Accès aux vues</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {VIEWS.map(v => {
                  const active = (r.permissions || []).includes(v.id);
                  return (
                    <button key={v.id} onClick={() => togglePerm(r, v.id)}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors"
                      style={active
                        ? { background: '#ff5722', color: '#fff' }
                        : { background: '#121212', color: '#808080', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {active && <Check size={11} />}{v.label}
                    </button>
                  );
                })}
              </div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#666' }}>Actions</div>
              <div className="flex flex-wrap gap-2">
                {ACTIONS.map(a => {
                  const active = (r.permissions || []).includes(a.id);
                  const Icon = a.icon;
                  return (
                    <button key={a.id} onClick={() => togglePerm(r, a.id)}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors"
                      style={active
                        ? { background: '#9c27b0', color: '#fff' }
                        : { background: '#121212', color: '#808080', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Icon size={12} />{a.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <RoleModal onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} />
      )}
    </div>
  );
}

function RoleModal({ onClose, onAdd }) {
  const [nom, setNom] = useState('');
  const [perms, setPerms] = useState(['dashboard']);

  const toggle = (id) => setPerms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    onAdd({ nom: nom.trim(), permissions: perms });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[460px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-semibold text-white">Nouveau rôle</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Nom du rôle *</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Ex : Membre"
            className="w-full rounded-xl px-3 py-2.5 text-[13px] mb-4 outline-none"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
          <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#666' }}>Accès aux vues</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {VIEWS.map(v => {
              const active = perms.includes(v.id);
              return (
                <button type="button" key={v.id} onClick={() => toggle(v.id)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
                  style={active
                    ? { background: '#ff5722', color: '#fff' }
                    : { background: '#121212', color: '#808080', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {active && <Check size={11} />}{v.label}
                </button>
              );
            })}
          </div>
          <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#666' }}>Actions</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {ACTIONS.map(a => {
              const active = perms.includes(a.id);
              const Icon = a.icon;
              return (
                <button type="button" key={a.id} onClick={() => toggle(a.id)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
                  style={active
                    ? { background: '#9c27b0', color: '#fff' }
                    : { background: '#121212', color: '#808080', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Icon size={12} />{a.label}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: '#ff5722' }}>Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
}