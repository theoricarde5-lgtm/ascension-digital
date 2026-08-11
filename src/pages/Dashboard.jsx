import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import StatCards from '@/components/dashboard/StatCards';
import RecentObjets from '@/components/dashboard/RecentObjets';
import ObjetsView from '@/components/dashboard/ObjetsView';
import BijouxView from '@/components/dashboard/BijouxView';
import CoffreView from '@/components/dashboard/CoffreView';
import OutilsView from '@/components/dashboard/OutilsView';
import PermissionsView from '@/components/dashboard/PermissionsView';
import ComptesView from '@/components/dashboard/ComptesView';
import LogsView from '@/components/dashboard/LogsView';
import SettingsView from '@/components/dashboard/SettingsView';
import SourcesView from '@/components/dashboard/SourcesView';
import ArmesView from '@/components/dashboard/ArmesView';

export default function Dashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [objets, setObjets] = useState([]);
  const [bijoux, setBijoux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catBijoux, setCatBijoux] = useState([]);
  const [movements, setMovements] = useState([]);
  const [outils, setOutils] = useState([]);
  const [catOutils, setCatOutils] = useState([]);
  const [roles, setRoles] = useState([]);
  const [comptes, setComptes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sources, setSources] = useState([]);
  const [armes, setArmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('ls_user');
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--montoya-accent', currentUser?.couleur || '#ff5722');
  }, [currentUser]);

  const logAction = useCallback(async (action, details = '') => {
    try {
      const user = currentUser?.nom || 'Inconnu';
      await base44.entities.Log.create({ action, details, user });
    } catch (e) {}
  }, [currentUser]);

  const loadAll = useCallback(async () => {
    try {
      const [o, b, c, cb, mv, ou, co, rl, cp, lg, src, ar] = await Promise.all([
        base44.entities.Objet.list('-created_date', 50),
        base44.entities.Bijou.list('-created_date', 50),
        base44.entities.Categorie.list(),
        base44.entities.CategorieBijou.list(),
        base44.entities.Movement.list('-created_date', 50),
        base44.entities.Outil.list('-created_date', 50),
        base44.entities.CategorieOutil.list(),
        base44.entities.Role.list('-created_date', 50),
        base44.entities.Compte.list('-created_date', 50),
        base44.entities.Log.list('-created_date', 100),
        base44.entities.Source.list(),
        base44.entities.Arme.list('-created_date', 50),
      ]);
      setObjets(o);
      setBijoux(b);
      setCategories(c);
      setCatBijoux(cb);
      setMovements(mv);
      setOutils(ou);
      setCatOutils(co);
      setRoles(rl);
      setComptes(cp);
      setLogs(lg);
      setSources(src);
      setArmes(ar);
    } catch (e) {
      // entities may be empty / just created
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem('ls_user')) {
      navigate('/', { replace: true });
      return;
    }
    loadAll();
  }, [loadAll, navigate]);

  // Real-time subscriptions: any change (local, other tab, webhook) updates instantly
  useEffect(() => {
    if (!sessionStorage.getItem('ls_user')) return;
    const subscribeEntity = (entity, setter) => entity.subscribe((event) => {
      if (event.type === 'create') setter(prev => [event.data, ...prev]);
      else if (event.type === 'update') setter(prev => prev.map(x => (x.id === event.data.id ? event.data : x)));
      else if (event.type === 'delete') setter(prev => prev.filter(x => x.id !== event.data.id));
    });
    const unsubs = [
      subscribeEntity(base44.entities.Objet, setObjets),
      subscribeEntity(base44.entities.Bijou, setBijoux),
      subscribeEntity(base44.entities.Outil, setOutils),
      subscribeEntity(base44.entities.Movement, setMovements),
      subscribeEntity(base44.entities.Categorie, setCategories),
      subscribeEntity(base44.entities.CategorieBijou, setCatBijoux),
      subscribeEntity(base44.entities.CategorieOutil, setCatOutils),
      subscribeEntity(base44.entities.Role, setRoles),
      subscribeEntity(base44.entities.Compte, setComptes),
      subscribeEntity(base44.entities.Log, setLogs),
      subscribeEntity(base44.entities.Source, setSources),
      subscribeEntity(base44.entities.Arme, setArmes),
    ];
    return () => unsubs.forEach(u => u && u());
  }, []);

  const addRole = async (data) => { await base44.entities.Role.create(data); await logAction('Création rôle', `Rôle "${data.nom}" créé`); await loadAll(); };
  const updateRole = async (id, data) => { try { await base44.entities.Role.update(id, data); } catch (e) {} await loadAll(); };
  const deleteRole = async (r) => { try { await base44.entities.Role.delete(r.id); await logAction('Suppression rôle', `Rôle "${r.nom}" supprimé`); } catch (e) {} await loadAll(); };
  const addCompte = async (data) => { await base44.entities.Compte.create(data); await logAction('Création compte', `Compte "${data.nom}" (${data.matricule}) — ${data.role}`); await loadAll(); };
  const deleteCompte = async (c) => { try { await base44.entities.Compte.delete(c.id); await logAction('Suppression compte', `Compte "${c.nom}" (${c.matricule}) supprimé`); } catch (e) {} await loadAll(); };

  const addSource = async (nom) => { try { await base44.entities.Source.create({ nom: nom.trim() }); } catch (e) {} await loadAll(); };
  const addArme = async (data) => {
    await base44.entities.Arme.create(data);
    try {
      await base44.entities.Movement.create({
        type: 'depot',
        montant: data.caution || 0,
        note: `Caution arme : ${data.nom}`
      });
    } catch (e) {}
    await logAction('Ajout arme', `${data.nom}${data.categorie ? ` (${data.categorie})` : ''}`);
    await loadAll();
  };
  const deleteArme = async (a) => { try { await base44.entities.Arme.delete(a.id); await logAction('Suppression arme', `${a.nom}`); } catch (e) {} await loadAll(); };
  const louerArme = async (a, data) => {
    try {
      await base44.entities.Arme.update(a.id, {
        statut: 'Loué',
        locataire: data.locataire,
        date_debut: data.date_debut,
        date_retour: data.date_retour,
        caution: data.caution,
      });
      await logAction('Location arme', `${a.nom} → ${data.locataire}`);
    } catch (e) {}
    await loadAll();
  };
  const rendreArme = async (a) => {
    try {
      await base44.entities.Arme.update(a.id, {
        statut: 'Disponible',
        locataire: '',
        date_debut: '',
        date_retour: '',
      });
      const total = (a.caution || 0) + (a.prix_location || 0);
      await base44.entities.Movement.create({
        type: 'depot',
        montant: total,
        note: `Retour arme : ${a.nom} (${a.locataire || ''}) — caution ${a.caution || 0}€ + location ${a.prix_location || 0}€`
      });
      await logAction('Retour arme', `${a.nom} — encaissé ${total}€ (caution + location)`);
    } catch (e) {}
    await loadAll();
  };
  const addObjet = async (data) => {
    await base44.entities.Objet.create(data);
    try {
      await base44.entities.Movement.create({
        type: 'retrait',
        montant: (data.prix || 0) * (data.quantite || 0),
        note: `Achat objet : ${data.nom}${data.categorie ? ` (${data.categorie})` : ''}`
      });
    } catch (e) {}
    await logAction('Ajout objet', `${data.nom}${data.categorie ? ` (${data.categorie})` : ''} — ${data.quantite || 0} × ${data.prix || 0}€`);
    await loadAll();
  };
  const deleteObjet = async (o) => { try { await base44.entities.Objet.delete(o.id); await logAction('Suppression objet', `${o.nom}`); } catch (e) {} await loadAll(); };
  const addBijou = async (data) => {
    await base44.entities.Bijou.create(data);
    try {
      await base44.entities.Movement.create({
        type: 'retrait',
        montant: (data.prix || 0) * (data.quantite || 0),
        note: `Achat bijou : ${data.nom}${data.categorie ? ` (${data.categorie})` : ''}`
      });
    } catch (e) {}
    await logAction('Ajout bijou', `${data.nom}${data.categorie ? ` (${data.categorie})` : ''} — ${data.quantite || 0} × ${data.prix || 0}€`);
    await loadAll();
  };
  const deleteBijou = async (b) => { try { await base44.entities.Bijou.delete(b.id); await logAction('Suppression bijou', `${b.nom}`); } catch (e) {} await loadAll(); };
  const addMovement = async (data) => { await base44.entities.Movement.create(data); await logAction(data.type === 'depot' ? 'Dépôt coffre' : 'Retrait coffre', `${data.montant}€${data.note ? ` — ${data.note}` : ''}`); await loadAll(); };
  const deleteMovement = async (m) => { try { await base44.entities.Movement.delete(m.id); await logAction('Suppression mouvement', `${m.type} ${m.montant}€`); } catch (e) {} await loadAll(); };
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
    await logAction('Ajout outil', `${data.nom}${data.categorie ? ` (${data.categorie})` : ''} — ${data.quantite || 0} × ${data.prix || 0}€`);
    await loadAll();
  };
  const deleteOutil = async (o) => { try { await base44.entities.Outil.delete(o.id); await logAction('Suppression outil', `${o.nom}`); } catch (e) {} await loadAll(); };
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
      await logAction('Vente outil', `${o.nom} (x${qty}) — ${salePrice * qty}€`);
    } catch (e) {}
    await loadAll();
  };

  const updateProfile = useCallback(async ({ couleur, photo }) => {
    try {
      const matches = await base44.entities.Compte.filter({ matricule: currentUser?.matricule });
      const me = matches[0];
      if (!me) return { ok: false, error: 'Compte introuvable.' };
      await base44.entities.Compte.update(me.id, { couleur, photo });
      const updated = { ...currentUser, couleur, photo };
      sessionStorage.setItem('ls_user', JSON.stringify(updated));
      setCurrentUser(updated);
      await logAction('Mise à jour profil', `Photo ${photo ? 'modifiée' : 'retirée'} · Couleur ${couleur}`);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Échec de la mise à jour.' };
    }
  }, [currentUser, logAction]);

  const changePassword = useCallback(async (currentPwd, newPwd) => {
    try {
      const matches = await base44.entities.Compte.filter({ matricule: currentUser?.matricule });
      const me = matches[0];
      if (!me) return { ok: false, error: 'Compte introuvable.' };
      if (me.password !== currentPwd) return { ok: false, error: 'Mot de passe actuel incorrect.' };
      await base44.entities.Compte.update(me.id, { password: newPwd });
      await logAction('Changement mot de passe', `Compte ${me.nom} (${me.matricule})`);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Échec de la modification.' };
    }
  }, [currentUser, logAction]);

  const totalUnits = objets.reduce((s, o) => s + (o.quantite || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: '#121212' }}>
      <Sidebar active={view} onNavigate={setView} userRole={currentUser?.role} />
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
          <ObjetsView objets={objets} categories={categories} sources={sources} onAdd={addObjet} onDelete={deleteObjet} movements={movements} onAddSource={addSource} />
        )}

        {view === 'bijoux' && (
          <BijouxView bijoux={bijoux} categories={catBijoux} onAdd={addBijou} onDelete={deleteBijou} movements={movements} />
        )}

        {view === 'outils' && (
          <OutilsView outils={outils} categories={catOutils} onAdd={addOutil} onDelete={deleteOutil} onSell={sellOutil} movements={movements} />
        )}

        {view === 'coffre' && (
          <CoffreView movements={movements} onAdd={addMovement} onDelete={deleteMovement} />
        )}

        {view === 'permissions' && (
          <PermissionsView roles={roles} onAdd={addRole} onUpdate={updateRole} onDelete={deleteRole} />
        )}

        {view === 'comptes' && (
          <ComptesView comptes={comptes} roles={roles} onAdd={addCompte} onDelete={deleteCompte} />
        )}

        {view === 'logs' && currentUser?.role === 'Dev' && (
          <LogsView logs={logs} />
        )}

        {view === 'parametres' && (
          <SettingsView currentUser={currentUser} onChangePassword={changePassword} onUpdateProfile={updateProfile} />
        )}

        {view === 'groupes' && (
          <SourcesView sources={sources} onAdd={addSource} />
        )}

        {view === 'armes' && (
          <ArmesView armes={armes} onAdd={addArme} onDelete={deleteArme} onRent={louerArme} onReturn={rendreArme} movements={movements} />
        )}
      </main>
    </div>
  );
}