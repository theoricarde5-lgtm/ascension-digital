import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { base44 } from '@/api/base44Client';

const initials = (nom) => nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

export default function LoginPage() {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const GRADE_ORDER = { Dev: 0, Teniente: 1, Capitaine: 2, Membre: 3 };

  useEffect(() => {
    base44.entities.Compte.list('-created_date', 50)
      .then(list => setUsers([...list].sort((a, b) => (GRADE_ORDER[a.role] ?? 9) - (GRADE_ORDER[b.role] ?? 9) || a.nom.localeCompare(b.nom))))
      .catch(() => setUsers([]));
  }, []);

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
        style={{ background: '#0a0a0c' }}>
        <Image src="https://media.base44.com/images/public/6a78e21367f0139109c57ae6/8986f0f76_image.png"
          fittingType="fill" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(26,13,10,0.82) 0%, rgba(10,10,12,0.88) 60%)' }} />
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
            Famille<br />Montoya
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

          <div className="flex items-center gap-3 mt-8">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="text-[11px] font-medium tracking-wide uppercase" style={{ color: '#5a5a5f' }}>Sélection rapide</div>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {users.map(u => {
              const selected = matricule === u.matricule;
              const getRoleStyle = (role) => {
                if (role === 'Dev') return { accent: '#9c27b0', grad: '#b561d4' };
                if (role === 'Teniente') return { accent: '#000000', grad: '#3a3a3a' };
                return { accent: '#ff473a', grad: '#ff7a4d' };
              };
              const { accent, grad } = getRoleStyle(u.role);
              const isBlack = accent === '#000000';
              return (
                <button key={u.matricule} type="button" onClick={() => setMatricule(u.matricule)}
                  className="group relative flex items-center gap-3 p-3.5 rounded-2xl transition-all overflow-hidden"
                  style={selected
                    ? { background: 'rgba(255,255,255,0.04)', border: `1px solid ${accent}`, boxShadow: `0 0 0 1px ${accent}22` }
                    : { background: '#141417', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(circle at top right, ${accent}14, transparent 60%)` }} />
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-[15px] shrink-0 overflow-hidden"
                    style={{ background: u.photo ? '#141417' : `linear-gradient(135deg, ${accent}, ${grad})` }}>
                    {u.photo
                      ? <Image src={u.photo} fittingType="fit" quality={100} className="w-full h-full" />
                      : initials(u.nom)}
                  </div>
                  <div className="relative flex-1 min-w-0 text-left">
                    <div className="text-[13.5px] font-semibold text-white truncate">{u.nom}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={isBlack
                          ? { background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }
                          : { background: `${accent}1f`, color: accent }}>
                        {u.role === 'Dev' ? '◆' : '●'} {u.role}
                      </span>
                    </div>
                  </div>
                  {selected && (
                    <div className="relative w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: accent }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}