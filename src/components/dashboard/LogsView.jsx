import React, { useState, useMemo } from 'react';
import { ScrollText, Search } from 'lucide-react';

const ACTION_STYLES = {
  'Ajout objet': { color: '#ff5722', icon: '📦' },
  'Suppression objet': { color: '#ff473a', icon: '🗑️' },
  'Ajout bijou': { color: '#ff5722', icon: '💎' },
  'Suppression bijou': { color: '#ff473a', icon: '🗑️' },
  'Ajout outil': { color: '#ff5722', icon: '🔧' },
  'Suppression outil': { color: '#ff473a', icon: '🗑️' },
  'Vente outil': { color: '#22c55e', icon: '💰' },
  'Dépôt coffre': { color: '#22c55e', icon: '⬇️' },
  'Retrait coffre': { color: '#ff473a', icon: '⬆️' },
  'Suppression mouvement': { color: '#808080', icon: '🗑️' },
  'Création compte': { color: '#9c27b0', icon: '👤' },
  'Suppression compte': { color: '#ff473a', icon: '🗑️' },
  'Création rôle': { color: '#9c27b0', icon: '🛡️' },
  'Suppression rôle': { color: '#ff473a', icon: '🗑️' },
  'Connexion': { color: '#3b82f6', icon: '🔑' },
};

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function LogsView({ logs }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const actionTypes = useMemo(() => {
    const set = new Set(logs.map(l => l.action));
    return ['all', ...Array.from(set)];
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (filter !== 'all' && l.action !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (l.details || '').toLowerCase().includes(q) || (l.user || '').toLowerCase().includes(q) || (l.action || '').toLowerCase().includes(q);
    });
  }, [logs, query, filter]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight flex items-center gap-3">
            <ScrollText size={26} style={{ color: '#9c27b0' }} /> Logs
          </h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {logs.length} activité{logs.length > 1 ? 's' : ''} enregistrée{logs.length > 1 ? 's' : ''} — accès réservé Dev
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#5a5a5f' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher dans les logs..."
            className="w-full rounded-xl pl-10 pr-3.5 py-2.5 text-[13px] outline-none"
            style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }} />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl px-3.5 py-2.5 text-[13px] outline-none"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }}>
          {actionTypes.map(t => (
            <option key={t} value={t}>{t === 'all' ? 'Toutes les actions' : t}</option>
          ))}
        </select>
      </div>

      {/* Logs list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <ScrollText size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucune activité à afficher.</div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {filtered.map(l => {
              const st = ACTION_STYLES[l.action] || { color: '#808080', icon: '•' };
              return (
                <div key={l.id} className="flex items-start gap-3.5 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[15px] shrink-0"
                    style={{ background: `${st.color}1a`, border: `1px solid ${st.color}33` }}>
                    {st.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold" style={{ color: st.color }}>{l.action}</span>
                      {l.user && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#aaa' }}>
                          {l.user}
                        </span>
                      )}
                    </div>
                    {l.details && <div className="text-[12.5px] mt-1" style={{ color: '#aaa' }}>{l.details}</div>}
                    <div className="text-[11px] mt-1" style={{ color: '#666' }}>{formatDate(l.created_date)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}