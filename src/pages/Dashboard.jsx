import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import StatCards from '@/components/dashboard/StatCards';
import RecentObjets from '@/components/dashboard/RecentObjets';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [objets, setObjets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [o, c] = await Promise.all([
          base44.entities.Objet.list('-created_date', 6),
          base44.entities.Categorie.list(),
        ]);
        setObjets(o);
        setCategories(c);
      } catch (e) {
        // entities may be empty / just created
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalUnits = objets.reduce((s, o) => s + (o.quantite || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: '#121212' }}>
      <Sidebar active="dashboard" />
      <main className="ml-[72px] px-6 lg:px-10 py-6">
        <TopBar query={query} setQuery={setQuery} />

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
      </main>
    </div>
  );
}