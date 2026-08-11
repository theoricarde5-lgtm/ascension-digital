import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import StatCards from '@/components/dashboard/StatCards';
import RecentObjets from '@/components/dashboard/RecentObjets';
import ObjetsView from '@/components/dashboard/ObjetsView';
import BijouxView from '@/components/dashboard/BijouxView';
import CoffreView from '@/components/dashboard/CoffreView';
import OutilsView from '@/components/dashboard/OutilsView';

export default function Dashboard() {
  const [view, setView] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [objets, setObjets] = useState([]);
  const [bijoux, setBijoux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catBijoux, setCatBijoux] = useState([]);
  const [movements, setMovements] = useState([]);
  const [outils, setOutils] = useState([]);
  const [catOutils, setCatOutils] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      const [o, b, c, cb, mv, ou, co] = await Promise.all([
        base44.entities.Objet.list('-created_date', 50),
        base44.entities.Bijou.list('-created_date', 50),
        base44.entities.Categorie.list(),
        base44.entities.CategorieBijou.list(),
        base44.entities.Movement.list('-created_date', 50),
        base44.entities.Outil.list('-created_date', 50),
        base44.entities.CategorieOutil.list(),
      ]);
      setObjets(o);
      setBijoux(b);
      setCategories(c);
      setCatBijoux(cb);
      setMovements(mv);
      setOutils(ou);
      setCatOutils(co);
    } catch (e) {
      // entities may be empty / just created
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const addObjet = async (data) => { await base44.entities.Objet.create(data); await loadAll(); };
  const deleteObjet = async (o) => { try { await base44.entities.Objet.delete(o.id); } catch (e) {} await loadAll(); };
  const addBijou = async (data) => { await base44.entities.Bijou.create(data); await loadAll(); };
  const deleteBijou = async (b) => { try { await base44.entities.Bijou.delete(b.id); } catch (e) {} await loadAll(); };
  const addMovement = async (data) => { await base44.entities.Movement.create(data); await loadAll(); };
  const deleteMovement = async (m) => { try { await base44.entities.Movement.delete(m.id); } catch (e) {} await loadAll(); };
  const addOutil = async (data) => {
    const existing = outils.find(o => o.nom.trim().toLowerCase() === (data.nom || '').trim().toLowerCase());
    if (existing) {
      try {
        await base44.entities.Outil.update(existing.id, {
          quantite: (existing.quantite || 0) + (data.quantite || 0),
          prix: data.prix || existing.prix,
          categorie: data.categorie || existing.categorie,
          description: data.description || existing.description,
          vendeur: data.vendeur || existing.vendeur,
        });
      } catch (e) {}
    } else {
      await base44.entities.Outil.create(data);
    }
    await loadAll();
  };
  const deleteOutil = async (o) => { try { await base44.entities.Outil.delete(o.id); } catch (e) {} await loadAll(); };
  const sellOutil = async (o, qte, prix) => {
    const qty = Math.max(1, parseInt(qte) || 1);
    const newQte = Math.max(0, (o.quantite || 0) - qty);
    const isLast = newQte === 0;
    const salePrice = parseFloat(prix) || 0;
    try {
      await base44.entities.Outil.update(o.id, {
        quantite: newQte,
        statut: isLast ? 'Vendu' : (o.statut || 'Disponible')
      });
      await base44.entities.Movement.create({
        type: 'depot',
        montant: salePrice * qty,
        note: `Vente outil : ${o.nom} (x${qty})`
      });
    } catch (e) {}
    await loadAll();
  };

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
              bijouxCount={loading ? '—' : bijoux.length}
              onNavigate={setView}
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

        {view === 'outils' && (
          <OutilsView outils={outils} categories={catOutils} onAdd={addOutil} onDelete={deleteOutil} onSell={sellOutil} movements={movements} />
        )}

        {view === 'coffre' && (
          <CoffreView movements={movements} onAdd={addMovement} onDelete={deleteMovement} />
        )}
      </main>
    </div>
  );
}