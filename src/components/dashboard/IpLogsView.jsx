import React, { useState, useMemo } from 'react';
import { Search, Globe, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export default function IpLogsView({ logs, onDelete, onDeleteAll, userRole }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Tous');
  const isDev = userRole === 'Dev';

  const filtered = useMemo(() => {
    return logs.filter(l => {
      const matchF = filter === 'Tous' || (filter === 'OK' && l.succes) || (filter === 'KO' && !l.succes);
      const q = query.toLowerCase();
      const matchQ = !q || (l.ip || '').toLowerCase().includes(q) || (l.nom || '').toLowerCase().includes(q) || (l.matricule || '').toLowerCase().includes(q);
      return matchF && matchQ;
    });
  }, [logs, filter, query]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Logs IP</h1>
          <p className="text-[13.5px] mt-1" style={{ color: '#808080' }}>
            {logs.length} connexion{logs.length > 1 ? 's' : ''} tracée{logs.length > 1 ? 's' : ''} · Accès réservé au rôle Dev
          </p>
        </div>
        {isDev && logs.length > 0 && (
          <button onClick={() => onDeleteAll?.(logs)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold"
            style={{ color: '#f87171', background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Trash2 size={16} /> Tout supprimer
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 lg:w-[300px]"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: '#808080' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="IP, nom, matricule..."
            className="bg-transparent text-[13px] flex-1 outline-none" style={{ color: '#fff' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {['Tous', 'OK', 'KO'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="rounded-full px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap transition-colors"
              style={filter === s ? { background: '#9c27b0', color: '#fff' } : { background: '#1c1c1c', color: '#ccc', border: '1px solid rgba(255,255,255,0.06)' }}>
              {s === 'OK' ? 'Réussies' : s === 'KO' ? 'Échouées' : s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#808080' }}>
            <Globe size={26} />
          </div>
          <div className="text-[14px]" style={{ color: '#808080' }}>Aucune connexion tracée pour le moment.</div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: '#666', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">IP</th>
                  <th className="px-4 py-3">Compte</th>
                  <th className="px-4 py-3">Matricule</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">User-Agent</th>
                  {isDev && <th className="px-4 py-3"></th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3">
                      {l.succes
                        ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#4ade80' }}><CheckCircle2 size={13} /> OK</span>
                        : <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#f87171' }}><XCircle size={13} /> KO</span>}
                    </td>
                    <td className="px-4 py-3 text-[12.5px] font-mono" style={{ color: '#60a5fa' }}>{l.ip || '—'}</td>
                    <td className="px-4 py-3 text-[12.5px] text-white">{l.nom || '—'}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#808080' }}>{l.matricule || '—'}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#808080' }}>{new Date(l.created_date).toLocaleString('fr-FR')}</td>
                    <td className="px-4 py-3 text-[11px] max-w-[220px] truncate" style={{ color: '#666' }} title={l.user_agent || ''}>{l.user_agent || '—'}</td>
                    {isDev && (
                      <td className="px-4 py-3">
                        <button onClick={() => onDelete?.(l)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: '#808080', background: '#121212' }}><Trash2 size={13} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}