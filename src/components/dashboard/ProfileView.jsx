import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { User as UserIcon, Phone, Save, Loader2 } from 'lucide-react';

export default function ProfileView({ user, onUpdated }) {
  const [username, setUsername] = useState(user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F5F3F9' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await base44.auth.updateMe({ username: username.trim(), phone: phone.trim() });
      setSaved(true);
      onUpdated && onUpdated();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-[18px] mt-2 text-center">
        <h1 className="font-display text-[26px] font-bold tracking-tight">Profil</h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#A79FB5' }}>Personnalise ton identité dans le coffre.</p>
      </div>

      <div className="max-w-[520px] mx-auto rounded-[22px] p-[26px]"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>

        <div className="flex items-center gap-3.5 mb-6 justify-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-white text-[18px]"
            style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>
            {(username || user?.full_name || 'F').charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="font-display text-[16px] font-bold">{username || user?.full_name || 'Membre'}</div>
            <div className="text-[12px]" style={{ color: '#6C6479' }}>{user?.email}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#A79FB5' }}>Nom d'utilisateur</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6C6479' }} />
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ex : Fernando"
                className="w-full rounded-[11px] pl-9 pr-3 py-2.5 text-[13px]" style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#A79FB5' }}>Numéro</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6C6479' }} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ex : +33 6 12 34 56 78"
                className="w-full rounded-[11px] pl-9 pr-3 py-2.5 text-[13px]" style={inputStyle} />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="rounded-[11px] px-4 py-2.5 text-[13px] font-bold text-white inline-flex items-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)' }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Enregistrer
            </button>
            {saved && <span className="text-[12px]" style={{ color: '#4ADE80' }}>Profil mis à jour ✓</span>}
          </div>
        </form>
      </div>
    </>
  );
}