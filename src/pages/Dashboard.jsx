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
import PasswordsView from '@/components/dashboard/PasswordsView';
import SettingsView from '@/components/dashboard/SettingsView';
import SourcesView from '@/components/dashboard/SourcesView';
import ArmesView from '@/components/dashboard/ArmesView';
import CalculateurView from '@/components/dashboard/CalculateurView';
import ArsenalView from '@/components/dashboard/ArsenalView';
import ContrebandeView from '@/components/dashboard/ContrebandeView';
import IpLogsView from '@/components/dashboard/IpLogsView';
import SuiviGroupeView from '@/components/dashboard/SuiviGroupeView';

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
  const [locations, setLocations] = useState([]);
  const [arsenalArgent, setArsenalArgent] = useState([]);
  const [contrebande, setContrebande] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ipLogs, setIpLogs] = useState([]);
  const [fichesSuivi, setFichesSuivi] = useState([]);
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
      const [o, b, c, cb, mv, ou, co, rl, cp, lg, src, ar, tr, locs, aa, cb2, ips, fs] = await Promise.all([
        base44.entities.Objet.list('-created_date', 500),
        base44.entities.Bijou.list('-created_date', 500),
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
        base44.entities.Transaction.list('-created_date', 200),
        base44.entities.LocationArme.list('-created_date', 200),
        base44.entities.ArsenalArgent.list('-created_date', 200),
        base44.entities.Contrebande.list('-created_date', 500),
        base44.entities.IpLog.list('-created_date', 200),
        base44.entities.FicheSuivi.list('-created_date', 500),
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
      setTransactions(tr);
      setLocations(locs);
      setArsenalArgent(aa);
      setContrebande(cb2);
      setIpLogs(ips);
      setFichesSuivi(fs);
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
      subscribeEntity(base44.entities.Transaction, setTransactions),
      subscribeEntity(base44.entities.LocationArme, setLocations),
      subscribeEntity(base44.entities.ArsenalArgent, setArsenalArgent),
      subscribeEntity(base44.entities.Contrebande, setContrebande),
      subscribeEntity(base44.entities.IpLog, setIpLogs),
      subscribeEntity(base44.entities.FicheSuivi, setFichesSuivi),
    ];
    return () => unsubs.forEach(u => u && u());
  }, []);

  const addRole = async (data) => { await base44.entities.Role.create(data); await logAction('Création rôle', `Rôle "${data.nom}" créé`); await loadAll(); };
  const updateRole = async (id, data) => { try { await base44.entities.Role.update(id, data); } catch (e) {} await loadAll(); };
  const deleteRole = async (r) => { try { await base44.entities.Role.delete(r.id); await logAction('Suppression rôle', `Rôle "${r.nom}" supprimé`); } catch (e) {} await loadAll(); };
  const addCompte = async (data) => { await base44.entities.Compte.create(data); await logAction('Création compte', `Compte "${data.nom}" (${data.matricule}) — ${data.role}`); await loadAll(); };
  const updateCompte = async (c, data) => {
    try {
      await base44.entities.Compte.update(c.id, data);
      if (data.statut) await logAction('Mise à jour compte', `${c.nom} → ${data.statut}`);
    } catch (e) {}
    await loadAll();
  };
  const deleteCompte = async (c) => { try { await base44.entities.Compte.delete(c.id); await logAction('Suppression compte', `Compte "${c.nom}" (${c.matricule}) supprimé`); } catch (e) {} await loadAll(); };
  const updateComptePassword = async (c, password) => {
    try {
      await base44.entities.Compte.update(c.id, { password });
      await logAction('Modification mot de passe', `Compte "${c.nom}" (${c.matricule})`);
    } catch (e) {}
    await loadAll();
  };

  const addSource = async (nom) => { try { await base44.entities.Source.create({ nom: nom.trim() }); } catch (e) {} await loadAll(); };
  const deleteTransaction = async (t) => { try { await base44.entities.Transaction.delete(t.id); await logAction('Suppression transaction', `${t.nom || ''}${t.vendeur ? ` (${t.vendeur})` : ''}`); } catch (e) {} await loadAll(); };
  const addArme = async (data) => {
    await base44.entities.Arme.create(data);
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
      await base44.entities.LocationArme.create({
        arme_nom: a.nom,
        arme_id: a.id,
        locataire: data.locataire,
        date_debut: data.date_debut,
        date_retour: data.date_retour,
        caution: data.caution || 0,
        prix_location: a.prix_location || 0,
        statut: 'En cours',
      });
      await logAction('Location arme', `${a.nom} → ${data.locataire}`);
    } catch (e) {}
    await loadAll();
  };
  const rendreArme = async (a, option) => {
    try {
      await base44.entities.Arme.update(a.id, {
        statut: 'Disponible',
        locataire: '',
        date_debut: '',
        date_retour: '',
      });
      const caution = a.caution || 0;
      const location = a.prix_location || 0;
      let montant = 0;
      let label = '';
      if (option && option !== 'none') {
        if (option === 'caution') { montant = caution; label = `caution ${caution}$`; }
        else if (option === 'location') { montant = location; label = `location ${location}$`; }
        else if (option === 'total') { montant = caution + location; label = `caution ${caution}$ + location ${location}$`; }
        await base44.entities.Movement.create({
          type: 'depot',
          montant,
          note: `Retour arme : ${a.nom} (${a.locataire || ''}) — ${label}`
        });
        await logAction('Retour arme', `${a.nom} — encaissé ${label}`);
      } else {
        await logAction('Retour arme', `${a.nom} — sans encaissement`);
      }
      // Mettre à jour la location correspondante
      try {
        const locs = await base44.entities.LocationArme.filter({ arme_id: a.id, statut: 'En cours' });
        if (locs.length) {
          await base44.entities.LocationArme.update(locs[0].id, {
            statut: 'Rendu',
            option_retour: option || 'none',
            montant_encaisse: montant,
            date_retour_effective: new Date().toISOString(),
          });
        }
      } catch (e) {}
    } catch (e) {}
    await loadAll();
  };
  const deleteLocation = async (l) => { try { await base44.entities.LocationArme.delete(l.id); } catch (e) {} await loadAll(); };
  const addArsenalArgent = async (data) => {
    try {
      await base44.entities.ArsenalArgent.create(data);
      await logAction(data.type === 'depot' ? 'Dépôt argent Arsenal' : 'Retrait argent Arsenal', `${data.montant}$${data.note ? ` — ${data.note}` : ''}`);
    } catch (e) {}
    await loadAll();
  };
  const deleteArsenalArgent = async (m) => { try { await base44.entities.ArsenalArgent.delete(m.id); } catch (e) {} await loadAll(); };
  const addContrebande = async (data) => {
    await base44.entities.Contrebande.create(data);
    await logAction('Ajout contrebande', `${data.nom}${data.type ? ` (${data.type})` : ''} — ${data.quantite || 0} × ${data.prix || 0}$`);
    await loadAll();
  };
  const sellContrebande = async (c, qte, prix) => {
    const qty = Math.max(1, parseInt(qte) || 1);
    const newQte = Math.max(0, (c.quantite || 0) - qty);
    const salePrice = parseFloat(prix) || 0;
    try {
      await base44.entities.Contrebande.update(c.id, {
        quantite: newQte,
        statut: newQte === 0 ? 'Vendu' : (c.statut || 'Disponible')
      });
      await base44.entities.Movement.create({
        type: 'depot',
        montant: salePrice * qty,
        note: `Vente contrebande : ${c.nom}${c.type ? ` (${c.type})` : ''} (x${qty})`
      });
      await logAction('Vente contrebande', `${c.nom} (x${qty}) — ${salePrice * qty}$`);
    } catch (e) {}
    await loadAll();
  };
  const deleteContrebande = async (c) => { try { await base44.entities.Contrebande.delete(c.id); await logAction('Suppression contrebande', `${c.nom}`); } catch (e) {} await loadAll(); };
  const deleteIpLog = async (l) => { try { await base44.entities.IpLog.delete(l.id); } catch (e) {} await loadAll(); };
  const deleteIpLogsBatch = async (list) => {
    try {
      await base44.entities.IpLog.deleteMany({ id: { $in: list.map(l => l.id) } });
      await logAction('Suppression logs IP', `${list.length} entrée(s)`);
    } catch (e) {}
    await loadAll();
  };
  const addFicheSuivi = async (data) => {
    await base44.entities.FicheSuivi.create(data);
    await logAction('Création fiche suivi', `${data.groupe}${data.type_activite ? ` (${data.type_activite})` : ''}`);
    await loadAll();
  };
  const deleteFicheSuivi = async (f) => { try { await base44.entities.FicheSuivi.delete(f.id); await logAction('Suppression fiche suivi', `${f.groupe}`); } catch (e) {} await loadAll(); };
  const deleteLocationsBatch = async (list) => {
    try {
      await base44.entities.LocationArme.deleteMany({ id: { $in: list.map(l => l.id) } });
      await logAction('Suppression historique locations', `${list.length} location(s)`);
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
  const deleteMovementsBatch = async (list) => {
    try {
      await base44.entities.Movement.deleteMany({ id: { $in: list.map(m => m.id) } });
      await logAction('Suppression historique', `${list.length} mouvement(s)`);
    } catch (e) {}
    await loadAll();
  };
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
  const updateOutil = async (o, data) => {
    try {
      await base44.entities.Outil.update(o.id, data);
      await logAction('Modification outil', `${o.nom} → prix ${data.prix}€ · qté ${data.quantite}`);
    } catch (e) {}
    await loadAll();
  };
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

  const validateCalculateur = useCallback(async ({ total, count, details, items }) => {
    try {
      await base44.entities.Movement.create({
        type: 'retrait',
        montant: total,
        note: `Calcul validé : ${count} objet${count > 1 ? 's' : ''} — ${details}`
      });
      if (items && items.length) {
        await base44.entities.Transaction.bulkCreate(
          items.filter(it => it.vendeur).map(it => ({
            nom: it.nom || '',
            type: it.type || '',
            categorie: '',
            prix: it.prix || 0,
            quantite: it.quantite || 0,
            vendeur: it.vendeur,
            source: 'Calculateur',
          }))
        );
      }
      await logAction('Calcul validé (débit coffre)', `${count} objet${count > 1 ? 's' : ''} — ${total}€`);
    } catch (e) {}
    await loadAll();
  }, [logAction, loadAll]);

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
    <div className="min-h-screen relative" style={{
      backgroundImage: `linear-gradient(rgba(10,10,10,0.82), rgba(10,10,10,0.88)), url('https://media.base44.com/images/public/6a78e21367f0139109c57ae6/f095f1825_image.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
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
          <ObjetsView objets={objets} categories={categories} sources={sources} onAdd={addObjet} onDelete={deleteObjet} movements={movements} onAddSource={addSource} userRole={currentUser?.role} onDeleteMovement={deleteMovement} onDeleteMovements={deleteMovementsBatch} />
        )}

        {view === 'bijoux' && (
          <BijouxView bijoux={bijoux} categories={catBijoux} sources={sources} onAddSource={addSource} onAdd={addBijou} onDelete={deleteBijou} movements={movements} userRole={currentUser?.role} onDeleteMovement={deleteMovement} onDeleteMovements={deleteMovementsBatch} />
        )}

        {view === 'outils' && (
          <OutilsView outils={outils} categories={catOutils} onAdd={addOutil} onDelete={deleteOutil} onSell={sellOutil} onUpdate={updateOutil} movements={movements} userRole={currentUser?.role} onDeleteMovement={deleteMovement} onDeleteMovements={deleteMovementsBatch} />
        )}

        {view === 'coffre' && (
          <CoffreView movements={movements} onAdd={addMovement} onDelete={deleteMovement} />
        )}

        {view === 'permissions' && (
          <PermissionsView roles={roles} onAdd={addRole} onUpdate={updateRole} onDelete={deleteRole} />
        )}

        {view === 'comptes' && (
          <ComptesView comptes={comptes} roles={roles} onAdd={addCompte} onDelete={deleteCompte} onUpdate={updateCompte} />
        )}

        {view === 'logs' && currentUser?.role === 'Dev' && (
          <LogsView logs={logs} />
        )}

        {view === 'passwords' && currentUser?.role === 'Dev' && (
          <PasswordsView comptes={comptes} onUpdatePassword={updateComptePassword} />
        )}

        {view === 'parametres' && (
          <SettingsView currentUser={currentUser} onChangePassword={changePassword} onUpdateProfile={updateProfile} />
        )}

        {view === 'groupes' && (
          <SourcesView sources={sources} onAdd={addSource} objets={objets} bijoux={bijoux} transactions={transactions} onDeleteTransaction={deleteTransaction} />
        )}

        {view === 'suivi' && (
          <SuiviGroupeView fiches={fichesSuivi} onAdd={addFicheSuivi} onDelete={deleteFicheSuivi} userRole={currentUser?.role} currentUser={currentUser} groups={sources} onAddGroup={addSource} />
        )}

        {view === 'armes' && (
          <ArmesView armes={armes} onAdd={addArme} onDelete={deleteArme} onRent={louerArme} onReturn={rendreArme} movements={movements} userRole={currentUser?.role} onDeleteMovement={deleteMovement} onDeleteMovements={deleteMovementsBatch} locations={locations} onDeleteLocation={deleteLocation} onDeleteLocations={deleteLocationsBatch} />
        )}

        {view === 'calculateur' && (
          <CalculateurView objets={objets} bijoux={bijoux} categories={catBijoux} catObjets={categories} sources={sources} onAddBijou={addBijou} onAddObjet={addObjet} onAddSource={addSource} onValidate={validateCalculateur} />
        )}

        {view === 'arsenal' && (currentUser?.role === 'Dev' || currentUser?.role === 'Teniente') && (
          <ArsenalView armes={armes} movements={movements} onAdd={addArme} onDelete={deleteArme} argent={arsenalArgent} onAddArgent={addArsenalArgent} onDeleteArgent={deleteArsenalArgent} />
        )}

        {view === 'contrebande' && (
          <ContrebandeView items={contrebande} onAdd={addContrebande} onDelete={deleteContrebande} onSell={sellContrebande} movements={movements} userRole={currentUser?.role} onDeleteMovement={deleteMovement} onDeleteMovements={deleteMovementsBatch} />
        )}

        {view === 'iplogs' && currentUser?.role === 'Dev' && (
          <IpLogsView logs={ipLogs} onDelete={deleteIpLog} onDeleteAll={deleteIpLogsBatch} userRole={currentUser?.role} />
        )}
      </main>
    </div>
  );
}