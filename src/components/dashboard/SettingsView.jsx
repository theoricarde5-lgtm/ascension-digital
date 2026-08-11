import React, { useState } from 'react';
import { Settings, User, Bell, Palette, Shield, Info } from 'lucide-react';

export default function SettingsView({ currentUser }) {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

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
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-[16px]"
                style={{ background: '#ff5722' }}>
                {(currentUser?.nom || '?').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">{currentUser?.nom || 'Utilisateur'}</div>
                <div className="text-[12px]" style={{ color: '#808080' }}>{currentUser?.matricule || '—'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium"
                style={{ background: currentUser?.role === 'Dev' ? '#9c27b01f' : '#ff57221f', color: currentUser?.role === 'Dev' ? '#9c27b0' : '#ff5722' }}>
                {currentUser?.role === 'Dev' ? '◆' : '●'} {currentUser?.role || 'Membre'}
              </span>
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