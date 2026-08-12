import React, { useState } from 'react';
import { Plus, X, Trash2, User, Ban, UserX, RotateCcw, Globe } from 'lucide-react';
import { Image } from '@/components/ui/image';

const getRoleStyle = (role) => {
  if (role === 'Dev') return { accent: '#9c27b0', grad: '#b561d4' };
  if (role === 'Teniente') return { accent: '#000000', grad: '#3a3a3a' };
  return { accent: '#ff5722', grad: '#ff7a4d' };
};

const STATUT_STYLE = {
  Actif: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  Banni: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  Exclu: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
};

export default function ComptesView({ comptes, roles, onAdd, onDelete, onUpdate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [ipTarget, setIpTarget] = useState(null);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Comptes</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {comptes.length} compte{comptes.length > 1 ? 's' : ''} enregistré{comptes.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: '#9c27b0' }}>
          <Plus size={16} /> Créer un compte
        </button>
      </div>

      {comptes.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <User size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucun compte. Créez le premier compte.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comptes.map(c => {
            const { accent, grad } = getRoleStyle(c.role);
            const isBlack = accent === '#000000';
            return (
              <div key={c.id} className="rounded-2xl p-5 relative"
                style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => onDelete(c)} title="Supprimer"
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ color: '#808080', background: '#121212' }}><Trash2 size={14} /></button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-[15px] overflow-hidden"
                    style={{ background: c.photo ? '#1c1c1c' : `linear-gradient(135deg, ${accent}, ${grad})` }}>
                    {c.photo
                      ? <Image src={c.photo} fittingType="fit" quality={100} className="w-full h-full" />
                      : c.nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-white truncate">{c.nom}</div>
                    <div className="text-[11.5px]" style={{ color: '#808080' }}>{c.matricule}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium"
                    style={isBlack
                      ? { background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }
                      : { background: `${accent}1f`, color: accent }}>
                    {c.role === 'Dev' ? '◆' : '●'} {c.role}
                  </span>
                  {c.statut && c.statut !== 'Actif' && (() => {
                    const s = STATUT_STYLE[c.statut] || STATUT_STYLE.Actif;
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider"
                        style={{ background: s.bg, color: s.color }}>
                        {c.statut}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex gap-2 mt-3">
                  {c.statut === 'Banni' ? (
                    <button onClick={() => onUpdate?.(c, { statut: 'Actif' })}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors"
                      style={{ background: '#121212', color: '#4ade80', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <RotateCcw size={13} /> Réactiver
                    </button>
                  ) : (
                    <button onClick={() => onUpdate?.(c, { statut: 'Banni' })}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors"
                      style={{ background: '#121212', color: '#f87171', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Ban size={13} /> Bannir
                    </button>
                  )}
                  {c.statut === 'Exclu' ? (
                    <button onClick={() => onUpdate?.(c, { statut: 'Actif' })}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors"
                      style={{ background: '#121212', color: '#4ade80', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <RotateCcw size={13} /> Réintégrer
                    </button>
                  ) : (
                    <button onClick={() => onUpdate?.(c, { statut: 'Exclu' })}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors"
                      style={{ background: '#121212', color: '#fbbf24', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <UserX size={13} /> Exclure
                    </button>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setIpTarget(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors"
                    style={{ background: '#121212', color: c.ip_bannie ? '#f87171' : '#60a5fa', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Globe size={13} /> {c.ip_bannie ? `IP: ${c.ip_bannie}` : 'Bannir IP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <AddModal roles={roles} onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} />
      )}

      {ipTarget && (
        <IpModal compte={ipTarget} onClose={() => setIpTarget(null)} onConfirm={(ip) => { onUpdate?.(ipTarget, { ip_bannie: ip }); setIpTarget(null); }} onLift={() => { onUpdate?.(ipTarget, { ip_bannie: '' }); setIpTarget(null); }} />
      )}
    </div>
  );
}

function IpModal({ compte, onClose, onConfirm, onLift }) {
  const [ip, setIp] = useState(compte.ip_bannie || '');
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ip.trim()) return;
    onConfirm(ip.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[420px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[17px] font-semibold text-white">Bannir IP — {compte.nom}</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#808080' }}>Bloque la connexion depuis cette adresse IP</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Adresse IP *</label>
          <input value={ip} onChange={(e) => setIp(e.target.value)} required placeholder="Ex : 192.168.1.10"
            className="w-full rounded-xl px-3 py-2.5 text-[13px] mb-4 outline-none" style={inputStyle} />
          <div className="flex justify-end gap-2">
            {compte.ip_bannie && (
              <button type="button" onClick={onLift} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#4ade80', background: '#121212', border: '1px solid rgba(255,255,255,0.06)' }}>Lever le ban</button>
            )}
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: '#60a5fa' }}>Bannir</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddModal({ roles, onClose, onAdd }) {
  const [form, setForm] = useState({ nom: '', matricule: '', password: '', role: 'Membre' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.matricule.trim() || !form.password.trim()) return;
    onAdd({
      nom: form.nom.trim(),
      matricule: form.matricule.trim().toUpperCase(),
      password: form.password.trim(),
      role: form.role,
    });
  };
  const inputStyle = { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-[440px] rounded-2xl p-6" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-semibold text-white">Créer un compte</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Nom complet *</label>
            <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Ex : Fernando"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Matricule *</label>
            <input name="matricule" value={form.matricule} onChange={handleChange} required placeholder="Ex : FERNANDO"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Mot de passe *</label>
            <input name="password" value={form.password} onChange={handleChange} required placeholder="Code d'accès"
              className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Rôle</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl px-3 py-2.5 text-[13px]" style={inputStyle}>
              <option value="Dev">Dev (admin)</option>
              <option value="Membre">Membre</option>
              {roles.map(r => (
                <option key={r.id} value={r.nom}>{r.nom}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-medium" style={{ color: '#ccc', background: '#121212' }}>Annuler</button>
            <button type="submit" className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: '#9c27b0' }}>Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
}