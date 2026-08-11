import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatCards from '@/components/dashboard/StatCards';
import ChartsRow from '@/components/dashboard/ChartsRow';
import BottomRow from '@/components/dashboard/BottomRow';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [objets, bijoux, movements] = await Promise.all([
          base44.entities.Objet.list(),
          base44.entities.Bijou.list(),
          base44.entities.Movement.list(),
        ]);
        setData({ objets, bijoux, movements });
      } catch {
        setData({ objets: [], bijoux: [], movements: [] });
      }
    })();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9FC' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: '#FF5722', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const { objets, bijoux, movements } = data;
  const solde = movements.reduce((s, m) => s + (m.type === 'depot' ? m.montant : -m.montant), 0);
  const valeurObjets = objets.reduce((s, o) => s + (o.prix || 0) * (o.quantite || 0), 0);
  const valeurBijoux = bijoux.reduce((s, b) => s + (b.prix || 0) * (b.quantite || 0), 0);
  const valeurTotale = Math.round(valeurObjets + valeurBijoux);
  const recentObjets = objets[0];

  return (
    <div className="min-h-screen" style={{ background: '#F7F9FC' }}>
      <Sidebar />
      <main className="md:ml-[72px] p-5 lg:p-7">
        <div className="rounded-2xl p-5 lg:p-7" style={{ background: '#FFFFFF', boxShadow: '0 6px 24px -8px rgba(100,116,139,0.2)' }}>
          <Header />
          <StatCards objets={objets.length} bijoux={bijoux.length} solde={solde} valeurTotale={valeurTotale} />
          <ChartsRow />
          <BottomRow recentObjets={recentObjets} />
        </div>
      </main>
    </div>
  );
}