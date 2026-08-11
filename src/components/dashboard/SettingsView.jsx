import React, { useState, useRef } from 'react';
import { Settings, User, Bell, Palette, Shield, Info, Lock, Camera, Check } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { base44 } from '@/api/base44Client';

const PRESET_COLORS = ['#ff5722', '#9c27b0', '#000000', '#3b82f6', '#22c55e', '#eab308', '#ec4899', '#14b8a6', '#f43f5e', '#8b5cf6'];

export default function SettingsView({ currentUser, onChangePassword, onUpdateProfile }) {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [couleur, setCouleur] = useState(currentUser?.couleur || '#ff5722');
  const [photo, setPhoto] = useState(currentUser?.photo || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileRef = useRef(null);

  const initials = (nom) => (nom || '?').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhoto(file_url);
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Échec de l\'upload de la photo.' });
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);
    try {
      const res = await onUpdateProfile?.({ couleur, photo });
      if (res?.ok) {
        setProfileMsg({ type: 'success', text: 'Profil mis à jour avec succès.' });
      } else {
        setProfileMsg({ type: 'error', text: res?.error || 'Échec de la mise à jour.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Échec de la mise à jour.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });
    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setPwdMsg({ type: 'error', text: 'Tous les champs sont requis.' });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdMsg({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    if (pwd.next.length < 4) {
      setPwdMsg({ type: 'error', text: 'Le mot de passe doit faire au moins 4 caractères.' });
      return;
    }
    setPwdLoading(true);
    try {
      const res = await onChangePassword(pwd.current, pwd.next);
      if (res?.ok) {
        setPwdMsg({ type: 'success', text: 'Mot de passe modifié avec succès.' });
        setPwd({ current: '', next: '', confirm: '' });
      } else {
        setPwdMsg({ type: 'error', text: res?.error || 'Mot de passe actuel incorrect.' });
      }
    } catch (err) {
      setPwdMsg({ type: 'error', text: 'Échec de la modification.' });
    } finally {
      setPwdLoading(false);
    }
  };

  const Toggle = ({ on, onChange }) => (
    <button onClick={() => onChange(!on)}
      className="relative w-10 h-6 rounded-full transition-colors shrink-0"
      style={{ background: on ? '#ff5722' : 'rgba(255,255,255,0.12)' }}>
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: on ? '20px' : '2px' }} />
    </button>
  );

  const Section = ({ icon: Icon, title, children }) => (
    <div className="rounded-2xl p-5 mb-4" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,87,34,0.15)', color: '#ff5722' }}>
          <Icon size={16} />
        </div>
        <h3 className="text-[15px] font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, desc, children }) => (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="min-w-0 pr-4">
        <div className="text-[13px] text-white">{label}</div>
        {desc && <div className="text-[11.5px] mt-0.5" style={{ color: '#808080' }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-white tracking-tight flex items-center gap-3">
          <Settings size={26} style={{ color: '#ff5722' }} /> Paramètres
        </h1>
        <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>Préférences de l'application et du compte.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Section icon={User} title="Compte">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-[16px] overflow-hidden relative"
                style={{ background: couleur }}>
                {photo
                  ? <Image src={photo} fittingType="fill" className="w-full h-full" />
                  : initials(currentUser?.nom)}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">{currentUser?.nom || 'Utilisateur'}</div>
                <div className="text-[12px]" style={{ color: '#808080' }}>{currentUser?.matricule || '—'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 mb-4">
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium"
                style={{ background: currentUser?.role === 'Dev' ? '#9c27b01f' : '#ff57221f', color: currentUser?.role === 'Dev' ? '#9c27b0' : '#ff5722' }}>
                {currentUser?.role === 'Dev' ? '◆' : '●'} {currentUser?.role || 'Membre'}
              </span>
            </div>

            {/* Photo de profil */}
            <div className="mb-4">
              <label className="block text-xs font-medium mb-2" style={{ color: '#808080' }}>Photo de profil</label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-[18px] overflow-hidden relative shrink-0"
                  style={{ background: couleur }}>
                  {photo
                    ? <Image src={photo} fittingType="fill" className="w-full h-full" />
                    : initials(currentUser?.nom)}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={photoUploading}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px] font-medium disabled:opacity-60"
                  style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#ccc' }}>
                  <Camera size={15} /> {photoUploading ? 'Upload...' : 'Changer la photo'}
                </button>
                {photo && (
                  <button type="button" onClick={() => setPhoto('')}
                    className="text-[12px]" style={{ color: '#808080' }}>Retirer</button>
                )}
              </div>
            </div>

            {/* Couleur du profil */}
            <div className="mb-2">
              <label className="block text-xs font-medium mb-2" style={{ color: '#808080' }}>Couleur du profil</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(c => {
                  const selected = couleur.toLowerCase() === c.toLowerCase();
                  const isBlack = c === '#000000';
                  return (
                    <button key={c} type="button" onClick={() => setCouleur(c)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                      style={selected
                        ? { background: c, border: '2px solid #fff', transform: 'scale(1.1)' }
                        : isBlack
                          ? { background: c, border: '1px solid rgba(255,255,255,0.25)' }
                          : { background: c, border: '1px solid rgba(255,255,255,0.1)' }}>
                      {selected && <Check size={14} className="text-white" />}
                    </button>
                  );
                })}
                <label className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'conic-gradient(from 0deg, #ff5722, #eab308, #22c55e, #3b82f6, #9c27b0, #ff5722)' }}>
                  <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer" />
                </label>
              </div>
            </div>

            {profileMsg.text && (
              <div className="text-[12.5px] px-3.5 py-2.5 rounded-lg mt-3" style={{
                color: profileMsg.type === 'success' ? '#22c55e' : '#ff7a6a',
                background: profileMsg.type === 'success' ? 'rgba(34,197,94,0.08)' : 'rgba(255,71,58,0.08)'
              }}>{profileMsg.text}</div>
            )}
            <div className="flex justify-end mt-3">
              <button type="button" onClick={handleSaveProfile} disabled={profileLoading}
                className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                style={{ background: '#ff5722' }}>
                {profileLoading ? 'Enregistrement...' : 'Enregistrer le profil'}
              </button>
            </div>
          </Section>

          <Section icon={Bell} title="Notifications">
            <Row label="Notifications email" desc="Recevoir un email lors des mouvements">
              <Toggle on={notifEmail} onChange={setNotifEmail} />
            </Row>
            <Row label="Notifications push" desc="Alertes sur l'app mobile">
              <Toggle on={notifPush} onChange={setNotifPush} />
            </Row>
          </Section>
        </div>

        <div>
          <Section icon={Palette} title="Affichage">
            <Row label="Mode compact" desc="Réduit l'espacement des cartes">
              <Toggle on={compactMode} onChange={setCompactMode} />
            </Row>
            <Row label="Thème" desc="Sombre (par défaut)">
              <span className="text-[12px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#ccc' }}>Sombre</span>
            </Row>
          </Section>

          <Section icon={Shield} title="Sécurité">
            <Row label="Code PIN coffre" desc="Protège l'accès au coffre">
              <span className="text-[12px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Configuré</span>
            </Row>
            <Row label="Session" desc="Déconnexion automatique">
              <span className="text-[12px]" style={{ color: '#808080' }}>Manuelle</span>
            </Row>
          </Section>

          <Section icon={Lock} title="Changer le mot de passe">
            <form onSubmit={handlePwdSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Mot de passe actuel</label>
                <input type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                  className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none"
                  style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Nouveau mot de passe</label>
                <input type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                  className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none"
                  style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#808080' }}>Confirmer le nouveau mot de passe</label>
                <input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none"
                  style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
              </div>
              {pwdMsg.text && (
                <div className="text-[12.5px] px-3.5 py-2.5 rounded-lg" style={{
                  color: pwdMsg.type === 'success' ? '#22c55e' : '#ff7a6a',
                  background: pwdMsg.type === 'success' ? 'rgba(34,197,94,0.08)' : 'rgba(255,71,58,0.08)'
                }}>{pwdMsg.text}</div>
              )}
              <div className="flex justify-end">
                <button type="submit" disabled={pwdLoading}
                  className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                  style={{ background: '#ff5722' }}>
                  {pwdLoading ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
              </div>
            </form>
          </Section>

          <Section icon={Info} title="À propos">
            <div className="text-[12.5px] leading-relaxed" style={{ color: '#808080' }}>
              <div className="flex justify-between py-1"><span>Application</span><span style={{ color: '#ccc' }}>Famille Montoya</span></div>
              <div className="flex justify-between py-1"><span>Version</span><span style={{ color: '#ccc' }}>1.0.0</span></div>
              <div className="flex justify-between py-1"><span>© 2026</span><span style={{ color: '#ccc' }}>Montoya</span></div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}