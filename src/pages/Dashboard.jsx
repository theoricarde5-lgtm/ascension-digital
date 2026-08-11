import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import ObjetsRegistry from '@/components/dashboard/ObjetsRegistry';

export default function Dashboard() {
  const [objets, setObjets] = useState(null);
  const [categories, setCategories] = useState([]);

  const load = async () => {
    const [o, c] = await Promise.all([
      base44.entities.Objet.list('-created_date'),
      base44.entities.Categorie.list(),
    ]);
    setObjets(o);
    setCategories(c);
  };

  useEffect(() => { load(); }, []);

  if (!objets) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9FC' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: '#FF5722', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const handleAdd = async (data) => {
    await base44.entities.Objet.create(data);
    await load();
  };

  const handleDelete = async (o) => {
    await base44.entities.Objet.delete(o.id);
    await load();
  };

  return (
    <div className="min-h-screen" style={{ background: '#F7F9FC' }}>
      <Sidebar />
      <main className="md:ml-[72px] p-5 lg:p-7">
        <div className="rounded-2xl p-5 lg:p-7" style={{ background: '#FFFFFF', boxShadow: '0 6px 24px -8px rgba(100,116,139,0.2)' }}>
          <Header />
          <ObjetsRegistry objets={objets} categories={categories} onAdd={handleAdd} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}