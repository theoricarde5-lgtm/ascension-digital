import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import HeroSection from '@/components/dashboard/HeroSection';
import RecentObjets from '@/components/dashboard/RecentObjets';
import MovementsPanel from '@/components/dashboard/MovementsPanel';
import LogsView from '@/components/dashboard/LogsView';
import RequestModal from '@/components/dashboard/RequestModal';
import Toast from '@/components/dashboard/Toast';
import RequestsView from '@/components/dashboard/RequestsView';
import AnnouncementsView from '@/components/dashboard/AnnouncementsView';
import ObjetsView from '@/components/dashboard/ObjetsView';
import InventoryView from '@/components/dashboard/InventoryView';
import CategoriesView from '@/components/dashboard/CategoriesView';
import BijouxView from '@/components/dashboard/BijouxView';
import BijouxInventoryView from '@/components/dashboard/BijouxInventoryView';
import BijouxCategoriesView from '@/components/dashboard/BijouxCategoriesView';
import UsersView from '@/components/dashboard/UsersView';
import ProfileView from '@/components/dashboard/ProfileView';

import { fmt } from '@/lib/coffre';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('Soldat');
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [movements, setMovements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [requests, setRequests] = useState([]);
  const [objets, setObjets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bijoux, setBijoux] = useState([]);
  const [categorieBijoux, setCategorieBijoux] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  const loadData = useCallback(async () => {
    const mv = await base44.entities.Movement.list('-created_date');
    setMovements(mv);
    const lg = await base44.entities.LogEntry.list('-created_date');
    setLogs(lg);
    const an = await base44.entities.Announcement.list('-created_date');
    setAnnouncements(an);
    const reqs = await base44.entities.Request.list('-created_date');
    setRequests(reqs);
    const objs = await base44.entities.Objet.list('-created_date');
    setObjets(objs);
    const cats = await base44.entities.Categorie.list('-created_date');
    setCategories(cats);
    const bjx = await base44.entities.Bijou.list('-created_date');
    setBijoux(bjx);
    const catBjx = await base44.entities.CategorieBijou.list('-created_date');
    setCategorieBijoux(catBjx);
    await loadPermissions();
  }, []);

  const loadPermissions = useCallback(async () => {
    let perms = await base44.entities.Permission.list('-created_date');
    const existingRoles = perms.map(p => p.role);
    const defaults = [
      { role: 'Administrateur', movements: true, movements_add: true, movements_delete: true, objets: true, objets_add: true, objets_delete: true, bijoux: true, bijoux_add: true, bijoux_delete: true, categories: true, categories_add: true, categories_delete: true, bijouxCategories: true, bijouxCategories_add: true, bijouxCategories_delete: true },
      { role: 'Jefe', movements: true, movements_add: true, movements_delete: true, objets: true, objets_add: true, objets_delete: true, bijoux: true, bijoux_add: true, bijoux_delete: true, categories: true, categories_add: true, categories_delete: true, bijouxCategories: true, bijouxCategories_add: true, bijouxCategories_delete: true },
      { role: 'Soldat', movements: false, movements_add: false, movements_delete: false, objets: true, objets_add: false, objets_delete: false, bijoux: true, bijoux_add: false, bijoux_delete: false, categories: true, categories_add: false, categories_delete: false, bijouxCategories: true, bijouxCategories_add: false, bijouxCategories_delete: false },
    ].filter(d => !existingRoles.includes(d.role));
    if (defaults.length > 0) {
      await base44.entities.Permission.bulkCreate(defaults);
      perms = await base44.entities.Permission.list('-created_date');
    }
    setPermissions(perms);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        setRole(me?.coffre_role || 'Administrateur');
      } catch (e) { /* non connecté */ }
      try { await loadData(); } catch (e) { /* ignore */ }
      try {
        const us = await base44.entities.User.list('-created_date');
        setUsers(us);
      } catch (e) { /* non admin */ }
      setLoading(false);
    })();
  }, [loadData]);

  const userName = user?.full_name || 'Fernando Montoya';

  const handleAddMovement = async (type, montant, note) => {
    if (!can('movements_add')) return;
    await base44.entities.Movement.create({ type, montant, note });
    await base44.entities.LogEntry.create({
      action: 'Ajout',
      detail: `${type === 'depot' ? 'Dépôt' : 'Retrait'} de ${fmt(montant)} — "${note}"`,
      user: userName, role,
    });
    await loadData();
  };

  const handleDeleteMovement = async (m) => {
    if (!can('movements_delete')) return;
    await base44.entities.Movement.delete(m.id);
    await base44.entities.LogEntry.create({
      action: 'Suppression',
      detail: `${m.type === 'depot' ? 'Dépôt' : 'Retrait'} de ${fmt(m.montant)} — "${m.note}"`,
      user: userName, role,
    });
    await loadData();
  };

  const handleSubmitRequest = async (type, subject, message) => {
    await base44.entities.Request.create({ type, subject, message });
    setModalOpen(false);
    showToast('Formulaire envoyé');
  };

  const handleAddObjet = async (data) => {
    await base44.entities.Objet.create(data);
    await loadData();
  };
  const handleDeleteObjet = async (o) => {
    await base44.entities.Objet.delete(o.id);
    await loadData();
  };

  const handleAddCategorie = async (nom) => {
    await base44.entities.Categorie.create({ nom });
    await loadData();
  };
  const handleDeleteCategorie = async (c) => {
    await base44.entities.Categorie.delete(c.id);
    await loadData();
  };

  const handleAddBijou = async (data) => {
    await base44.entities.Bijou.create(data);
    await loadData();
  };
  const handleDeleteBijou = async (b) => {
    await base44.entities.Bijou.delete(b.id);
    await loadData();
  };
  const handleAddCategorieBijou = async (nom) => {
    await base44.entities.CategorieBijou.create({ nom });
    await loadData();
  };
  const handleDeleteCategorieBijou = async (c) => {
    await base44.entities.CategorieBijou.delete(c.id);
    await loadData();
  };

  const handleUpdateUserRole = async (u, coffre_role) => {
    await base44.entities.User.update(u.id, { coffre_role });
    const us = await base44.entities.User.list('-created_date');
    setUsers(us);
    if (u.id === user?.id) setRole(coffre_role);
  };

  const handleUpdatePermission = async (perm, key, value) => {
    await base44.entities.Permission.update(perm.id, { [key]: value });
    await loadPermissions();
  };

  const can = (key) => {
    const p = permissions.find(x => x.role === role);
    if (!p) return role === 'Jefe' || role === 'Administrateur';
    if ((key.endsWith('_add') || key.endsWith('_delete')) && p[key] === undefined) {
      const base = key.replace(/_(add|delete)$/, '');
      return !!p[base];
    }
    return !!p[key];
  };

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const handleProfileUpdated = async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
    } catch (e) { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#121212' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#ff5722' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#121212', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar
        currentView={currentView} onViewChange={setCurrentView}
        role={role} isAdmin={user?.role === 'admin'} onLogout={handleLogout}
      />

      <div className="pl-[76px]">
        <TopBar user={user} role={role} onOpenForm={() => setModalOpen(true)} />

        <main className="px-8 py-6 max-w-[1200px] mx-auto">
          {currentView === 'dashboard' && (
            <>
              <HeroSection objets={objets} categories={categories} />
              <RecentObjets objets={objets} onSeeAll={() => setCurrentView('objets')} />
            </>
          )}

          {currentView === 'comptabilite' && (
            <div className="max-w-[860px] mx-auto">
              <MovementsPanel canAdd={can('movements_add')} canDelete={can('movements_delete')} movements={movements} onAdd={handleAddMovement} onDelete={handleDeleteMovement} />
            </div>
          )}

          {currentView === 'logs' && (role === 'Jefe' || role === 'Administrateur') && <LogsView logs={logs} />}

          {currentView === 'objets' && <ObjetsView objets={objets} categories={categories} onAdd={handleAddObjet} onDelete={handleDeleteObjet} canAdd={can('objets_add')} canDelete={can('objets_delete')} />}

          {currentView === 'inventaire' && <InventoryView objets={objets} />}

          {currentView === 'categories' && <CategoriesView categories={categories} onAdd={handleAddCategorie} onDelete={handleDeleteCategorie} canAdd={can('categories_add')} canDelete={can('categories_delete')} />}

          {currentView === 'bijoux' && <BijouxView bijoux={bijoux} categories={categorieBijoux} onAdd={handleAddBijou} onDelete={handleDeleteBijou} canAdd={can('bijoux_add')} canDelete={can('bijoux_delete')} />}

          {currentView === 'bijoux-inventaire' && <BijouxInventoryView bijoux={bijoux} />}

          {currentView === 'bijoux-categories' && <BijouxCategoriesView categories={categorieBijoux} onAdd={handleAddCategorieBijou} onDelete={handleDeleteCategorieBijou} canAdd={can('bijouxCategories_add')} canDelete={can('bijouxCategories_delete')} />}

          {currentView === 'requests' && <RequestsView requests={requests} />}

          {currentView === 'announcements' && <AnnouncementsView announcements={announcements} />}

          {currentView === 'users' && <UsersView users={users} currentUser={user} onUpdateRole={handleUpdateUserRole} permissions={permissions} onUpdatePermission={handleUpdatePermission} />}

          {currentView === 'profile' && <ProfileView user={user} onUpdated={handleProfileUpdated} />}
        </main>
      </div>

      <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmitRequest} />
      <Toast show={toast.show} message={toast.message} />
    </div>
  );
}