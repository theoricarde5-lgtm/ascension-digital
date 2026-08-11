import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import StatCards from '@/components/dashboard/StatCards';
import RecentObjets from '@/components/dashboard/RecentObjets';
import ObjetsView from '@/components/dashboard/ObjetsView';
import BijouxView from '@/components/dashboard/BijouxView';

export default function Dashboard() {
  const [view, setView] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [objets, setObjets] = useState([]);
  const [bijoux, setBijoux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catBijoux, setCatBijoux] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      const [o, b, c, cb] = await Promise.all([
        base44.entities.Objet.list('-created_date', 50),
        base44.entities.Bijou.list('-created_date', 50),
        base44.entities.Categorie.list(),
        base44.entities.CategorieBijou.list(),
      ]);
      setObjets(o);
      setBijoux(b);
      setCategories(c);
      setCatBijoux(cb);
    } catch (e) {
      // entities may be empty / just created
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const addObjet = async (data) => { await base44.entities.Objet.create(data); await loadAll(); };
  const deleteObjet = async (o) => { await base44.entities.Objet.delete(o.id); await loadAll(); };
  const addBijou = async (data) => { await base44.entities.Bijou.create(data); await loadAll(); };
  const deleteBijou = async (b) => { await base44.entities.Bijou.delete(b.id); await loadAll(); };

  const totalUnits = objets.reduce((s, o) => s + (o.quantite || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: '#121212' }}>
      <Sidebar active={view} onNavigate={setView} />
      <main className="ml-[72px] px-6 lg:px-10 py-6">
        <TopBar query={query} setQuery={setQuery} />

        {view === 'dashboard' && (
          <>
            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-white tracking-tight">Bonjour 👋</h1>
              <p className="text-[14px] mt-1" style={{ color: '#808080' }}>Voici votre registre d'objets partagé.</p>
            </div>
            <StatCards
              objetsCount={loading ? '—' : objets.length}
              totalUnits={loading ? '—' : totalUnits}
              categoriesCount={loading ? '—' : categories.length}
            />
            <RecentObjets objets={loading ? [] : objets} />
          </>
        )}

        {view === 'objets' && (
          <ObjetsView objets={objets} categories={categories} onAdd={addObjet} onDelete={deleteObjet} />
        )}

        {view === 'bijoux' && (
          <BijouxView bijoux={bijoux} categories={catBijoux} onAdd={addBijou} onDelete={deleteBijou} />
        )}

        {view === 'coffre' && (
          <div className="rounded-2xl py-20 flex flex-col items-center justify-center text-center"
            style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[14px]" style={{ color: '#808080' }}>Coffre — à venir.</div>
          </div>
        )}
      </main>
    </div>
  );
}