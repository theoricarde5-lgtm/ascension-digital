import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import TopNav from '@/components/dashboard/TopNav';
import HeroSection from '@/components/dashboard/HeroSection';
import ChipStrip from '@/components/dashboard/ChipStrip';
import MovementsPanel from '@/components/dashboard/MovementsPanel';
import SidePanel from '@/components/dashboard/SidePanel';
import LogsView from '@/components/dashboard/LogsView';
import RequestModal from '@/components/dashboard/RequestModal';
import Toast from '@/components/dashboard/Toast';
import RequestsView from '@/components/dashboard/RequestsView';
import AnnouncementsView from '@/components/dashboard/AnnouncementsView';
import { fmt } from '@/lib/coffre';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('Comptable');
  const [currentView, setCurrentView] = useState('dashboard');
  const [movements, setMovements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [announcement, setAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [requests, setRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  const loadData = useCallback(async () => {
    const [mv, lg, an, reqs] = await Promise.all([
      base44.entities.Movement.list('-created_date'),
      base44.entities.LogEntry.list('-created_date'),
      base44.entities.Announcement.list('-created_date'),
      base44.entities.Request.list('-created_date'),
    ]);
    setMovements(mv);
    setLogs(lg);
    setAnnouncements(an);
    setAnnouncement(an[0] || null);
    setRequests(reqs);
  }, []);

  useEffect(() => {
    (async () => {
      try { const me = await base44.auth.me(); setUser(me); } catch (e) { /* non connecté */ }
      try { await loadData(); } catch (e) { /* ignore */ }
      setLoading(false);
    })();
  }, [loadData]);

  const userName = user?.full_name || 'Fernando Montoya';

  const handleAddMovement = async (type, montant, note) => {
    if (role !== 'Comptable') return;
    await base44.entities.Movement.create({ type, montant, note });
    await base44.entities.LogEntry.create({
      action: 'Ajout',
      detail: `${type === 'depot' ? 'Dépôt' : 'Retrait'} de ${fmt(montant)} — "${note}"`,
      user: userName, role,
    });
    await loadData();
  };

  const handleDeleteMovement = async (m) => {
    if (role !== 'Comptable') return;
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

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const solde = movements.reduce((s, m) => s + (m.type === 'depot' ? m.montant : -m.montant), 0);
  const totalDepot = movements.filter(m => m.type === 'depot').reduce((s, m) => s + m.montant, 0);
  const totalRetrait = movements.filter(m => m.type === 'retrait').reduce((s, m) => s + m.montant, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0B12' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#8B5CF6' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#0D0B12', color: '#F5F3F9', fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed -top-[260px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: 'linear-gradient(120deg, #8B5CF6, #F472B6)', opacity: 0.14, filter: 'blur(120px)' }} />

      <div className="relative z-10 max-w-[1180px] mx-auto px-7 pb-[60px]">
        <TopNav
          currentView={currentView} onViewChange={setCurrentView}
          role={role} onRoleChange={setRole}
          user={user} onOpenForm={() => setModalOpen(true)} onLogout={handleLogout}
        />

        {currentView === 'dashboard' && (
          <>
            <HeroSection solde={solde} totalDepot={totalDepot} totalRetrait={totalRetrait} movementCount={movements.length} userName={userName} />
            <ChipStrip />
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
              <MovementsPanel role={role} movements={movements} onAdd={handleAddMovement} onDelete={handleDeleteMovement} />
              <SidePanel announcement={announcement} onOpenForm={() => setModalOpen(true)} />
            </div>
          </>
        )}

        {currentView === 'logs' && <LogsView logs={logs} />}

        {currentView === 'requests' && <RequestsView requests={requests} />}

        {currentView === 'announcements' && <AnnouncementsView announcements={announcements} />}
      </div>

      <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmitRequest} />
      <Toast show={toast.show} message={toast.message} />
    </div>
  );
}