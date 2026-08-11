import React from 'react';
import { LayoutGrid, Wallet, Package, Boxes, Folder, Gem, Layers, Tags, Inbox, ScrollText, Megaphone, User, Users, LogOut } from 'lucide-react';

export default function Sidebar({ currentView, onViewChange, role, isAdmin, onLogout }) {
  const items = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Espace personnel' },
    { id: 'comptabilite', icon: Wallet, label: 'Comptabilité' },
    { id: 'objets', icon: Package, label: 'Objets' },
    { id: 'inventaire', icon: Boxes, label: 'Inventaire' },
    { id: 'categories', icon: Folder, label: 'Catégories' },
    { id: 'bijoux', icon: Gem, label: 'Bijoux' },
    { id: 'bijoux-inventaire', icon: Layers, label: 'Inv. Bijoux' },
    { id: 'bijoux-categories', icon: Tags, label: 'Cat. Bijoux' },
    { id: 'requests', icon: Inbox, label: 'Demandes' },
    ...((role === 'Jefe' || role === 'Administrateur') ? [{ id: 'logs', icon: ScrollText, label: 'Logs' }] : []),
    { id: 'announcements', icon: Megaphone, label: 'Annonces' },
    { id: 'profile', icon: User, label: 'Profil' },
    ...(isAdmin ? [{ id: 'users', icon: Users, label: 'Utilisateurs' }] : []),
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[76px] flex flex-col items-center py-5 z-20"
      style={{ background: '#121212', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-lg mb-6"
        style={{ background: '#ff5722' }}>M</div>
      <nav className="flex flex-col gap-2 flex-1 w-full items-center">
        {items.map(it => {
          const Icon = it.icon;
          const active = currentView === it.id;
          return (
            <button key={it.id} title={it.label} onClick={() => onViewChange(it.id)}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
              style={active ? { background: 'rgba(255,87,34,0.12)', color: '#ff5722' } : { color: '#808080' }}>
              <Icon size={20} />
            </button>
          );
        })}
      </nav>
      <button title="Déconnexion" onClick={onLogout}
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors hover:text-white"
        style={{ color: '#808080' }}>
        <LogOut size={20} />
      </button>
    </aside>
  );
}