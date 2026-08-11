import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const USERS = [
  { matricule: 'JD', nom: 'Julio Delgado', role: 'Patron' },
  { matricule: 'PH', nom: 'Paco Hernandez', role: 'Co-Patron' },
  { matricule: 'ZS', nom: 'Zéphyr Sterling', role: 'Responsable Event' },
  { matricule: 'KD', nom: 'Keyla Delgado', role: 'Responsable' },
  { matricule: 'SU', nom: 'Shkëlze Uka', role: 'Responsable' },
  { matricule: 'DF', nom: 'Demetrius Flenory', role: 'Vendeur/euse Supérieur(e)' },
  { matricule: 'IB', nom: 'Issa Blackys', role: 'Vendeur/euse Supérieur(e)' },
  { matricule: 'JM', nom: 'Jason Montelis', role: 'Vendeur/euse Supérieur(e)' },
  { matricule: 'MR', nom: 'Malik Reed', role: 'Vendeur/euse Supérieur(e)' },
  { matricule: 'JC', nom: 'Joe Cortes', role: 'Vendeur/euse' },
  { matricule: 'SV', nom: 'Soren Veyron', role: 'Vendeur/euse' },
  { matricule: 'HH', nom: 'Hakime Hernandez', role: 'Vendeur/euse Novice' },
  { matricule: 'IU', nom: 'Isalia Uka', role: 'Vendeur/euse Novice' },
  { matricule: 'NN', nom: 'Noah Norev', role: 'Vendeur/euse Novice' },
  { matricule: 'SW', nom: 'Stella West', role: 'Vendeur/euse Novice' },
  { matricule: 'JW', nom: 'Jordan Wallace', role: 'Vendeur/euse Novice' },
];

const initials = (nom) => nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

export default function LoginPage() {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await base44.functions.invoke('loginCheck', { matricule, password });
      if (res.data?.ok) {
        sessionStorage.setItem('ls_user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        setError(res.data?.error || 'Connexion échouée');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4" style={{ background: '#0f1115' }}>
      <div className="w-full max-w-[420px] rounded-2xl p-7" style={{ background: '#1a1c21' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg" style={{ background: '#ff473a' }}>LS</div>
          <div>
            <div className="text-[18px] font-bold text-white leading-tight">LS Motorcycles</div>
            <div className="text-[12.5px]" style={{ color: '#808080' }}>Panel de gestion</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: '#808080' }}>Matricule</label>
            <input value={matricule} onChange={(e) => setMatricule(e.target.value.toUpperCase())} required placeholder="Ex : ZEN"
              className="w-full rounded-xl px-3.5 py-3 text-[14px] outline-none" style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: '#808080' }}>Mot de passe</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-xl px-3.5 py-3 pr-11 text-[14px] outline-none" style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
              <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#808080' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <div className="text-[12.5px]" style={{ color: '#ff473a' }}>{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full rounded-xl py-3 text-[14px] font-bold text-white disabled:opacity-60" style={{ background: '#ff473a' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>

      <div className="text-[13px] mt-7 mb-4 text-center" style={{ color: '#808080' }}>
        Clique sur ta tête pour remplir ton matricule
      </div>

      <div className="w-full max-w-[900px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {USERS.map(u => (
          <button key={u.matricule} type="button" onClick={() => setMatricule(u.matricule)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors"
            style={matricule === u.matricule
              ? { background: 'rgba(255,71,58,0.12)', border: '1px solid #ff473a' }
              : { background: 'transparent', border: '1px solid transparent' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-[18px]" style={{ background: '#ff473a' }}>
              {initials(u.nom)}
            </div>
            <div className="text-[13px] font-semibold text-white text-center leading-tight">{u.nom}</div>
            <div className="text-[11px] text-center" style={{ color: '#808080' }}>{u.role}</div>
          </button>
        ))}
      </div>
    </div>
  );
}