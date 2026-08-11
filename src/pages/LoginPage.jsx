import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const USERS = [
  { matricule: 'FERNANDO', nom: 'Fernando', role: 'Dev' },
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
    <div className="min-h-screen flex" style={{ background: '#0a0a0c' }}>
      {/* Left visual panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(160deg, #1a0d0a 0%, #0a0a0c 60%)' }}>
        <div className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ff473a 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ff7a4d 0%, transparent 70%)' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-lg"
            style={{ background: 'linear-gradient(135deg, #ff473a, #ff7a4d)' }}>M</div>
          <div className="text-[17px] font-bold text-white tracking-tight">Montoya</div>
        </div>

        <div className="relative">
          <div className="text-[44px] leading-[1.05] font-bold text-white tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            Le registre<br />de la maison.
          </div>
          <div className="text-[15px] mt-5 max-w-[340px] leading-relaxed" style={{ color: '#8a8a8f' }}>
            Gestion des objets, bijoux et outils premium — accès réservé.
          </div>
        </div>

        <div className="relative text-[12px]" style={{ color: '#5a5a5f' }}>
          © 2026 Montoya. Tous droits réservés.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #ff473a, #ff7a4d)' }}>M</div>
            <div className="text-[18px] font-bold text-white tracking-tight">Montoya</div>
          </div>

          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-white tracking-tight">Connexion</h1>
            <p className="text-[13.5px] mt-1.5" style={{ color: '#7a7a7f' }}>Entrez vos identifiants pour accéder au panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-medium mb-2" style={{ color: '#7a7a7f' }}>Matricule</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#5a5a5f' }} />
                <input value={matricule} onChange={(e) => setMatricule(e.target.value.toUpperCase())} required placeholder="Fernando"
                  className="w-full rounded-xl pl-10 pr-3.5 py-3 text-[14px] outline-none transition-colors focus:border-[#ff473a]"
                  style={{ background: '#141417', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }} />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-2" style={{ color: '#7a7a7f' }}>Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#5a5a5f' }} />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full rounded-xl pl-10 pr-11 py-3 text-[14px] outline-none transition-colors focus:border-[#ff473a]"
                  style={{ background: '#141417', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }} />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#5a5a5f' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div className="text-[12.5px] px-3.5 py-2.5 rounded-lg" style={{ color: '#ff7a6a', background: 'rgba(255,71,58,0.08)' }}>{error}</div>}
            <button type="submit" disabled={loading}
              className="group w-full rounded-xl py-3 text-[14px] font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg, #ff473a, #ff6a4d)' }}>
              {loading ? 'Connexion...' : 'Se connecter'}
              {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <div className="text-[12.5px] mt-8 text-center" style={{ color: '#5a5a5f' }}>
            Clique sur ta tête pour remplir ton matricule
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {USERS.map(u => (
              <button key={u.matricule} type="button" onClick={() => setMatricule(u.matricule)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                style={matricule === u.matricule
                  ? { background: 'rgba(255,71,58,0.1)', border: '1px solid #ff473a' }
                  : { background: '#141417', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-[16px]"
                  style={{ background: 'linear-gradient(135deg, #ff473a, #ff7a4d)' }}>
                  {initials(u.nom)}
                </div>
                <div className="text-[12.5px] font-semibold text-white text-center leading-tight">{u.nom}</div>
                <div className="text-[10.5px]" style={{ color: '#7a7a7f' }}>{u.role}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}