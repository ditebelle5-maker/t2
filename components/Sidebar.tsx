import React, { useState, useRef, useEffect } from 'react';
import type { ViewType, User, Theme } from '../types';
import { AgentIcon, ContentIcon, CommunityIcon, MenuIcon, UserIcon, ThemeIcon, SettingsIcon, AdminIcon, LogoutIcon, SunIcon } from './icons';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  user: User;
  setUser: (user: User) => void;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const navItems = [
  { id: 'agentes', label: 'Agentes', icon: AgentIcon, admin: false },
  { id: 'conteudo', label: 'Conteúdo', icon: ContentIcon, admin: false },
  { id: 'comunidade', label: 'Comunidade', icon: CommunityIcon, admin: false },
  { id: 'admin', label: 'Painel de Controle', icon: AdminIcon, admin: true },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, user, setUser, onLogout, theme, setTheme }) => {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);
  
  const handleLogoutClick = () => {
    setProfileMenuOpen(false);
    onLogout();
  };

  const profileMenuItems = [
    { label: 'Perfil', icon: UserIcon, action: () => { setProfileModalOpen(true); setProfileMenuOpen(false); } },
    { label: 'Configurações', icon: SettingsIcon, action: () => { setSettingsModalOpen(true); setProfileMenuOpen(false); } },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const isActive = activeView === item.id;
    return (
      <button
        onClick={() => setActiveView(item.id as ViewType)}
        className={`group relative flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500 ${
          isActive
            ? 'bg-gray-100 text-blue-600 dark:bg-zinc-900 dark:text-white'
            : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-zinc-100'
        } ${isCollapsed ? 'justify-center' : ''}`}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        <span className={
            isCollapsed
            ? 'absolute left-full ml-4 px-3 py-1.5 whitespace-nowrap bg-gray-800 text-white text-sm font-medium rounded-lg shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-10'
            : 'ml-4'
        }>
            {item.label}
        </span>
      </button>
    );
  };
  
  return (
    <>
      <div className={`relative flex flex-col bg-white dark:bg-black text-gray-800 dark:text-zinc-200 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center h-16 shrink-0 ${isCollapsed ? 'justify-center' : 'px-4'}`}>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            (!item.admin || user.role === 'admin') && <NavLink key={item.id} item={item} />
          ))}
        </nav>
        <div className={`px-4 py-4 mt-auto border-t border-gray-200 dark:border-zinc-800`}>
           {isProfileMenuOpen && (
              <div 
                ref={profileMenuRef}
                className={`absolute bottom-20 ${isCollapsed ? 'left-20' : 'left-4'} z-20 w-60 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl animate-fade-in-up-fast`}>
                  <div className="p-2">
                      {profileMenuItems.map(item => (
                          <button key={item.label} onClick={item.action} className="w-full flex items-center px-3 py-2.5 text-sm text-gray-800 dark:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                              <item.icon className="w-5 h-5 mr-4 text-gray-500 dark:text-zinc-400" />
                              <span>{item.label}</span>
                          </button>
                      ))}
                      <div className="h-px my-2 bg-gray-200 dark:bg-zinc-800" />
                      <button onClick={handleLogoutClick} className="w-full flex items-center px-3 py-2.5 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500">
                          <LogoutIcon className="w-5 h-5 mr-4" />
                          <span>Sair</span>
                      </button>
                  </div>
              </div>
           )}
           <button
              ref={profileButtonRef}
              onClick={() => setProfileMenuOpen(prev => !prev)}
              className={`group relative flex items-center w-full p-2 text-sm font-medium text-left text-gray-800 dark:text-zinc-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-500 ${isCollapsed ? 'justify-center' : ''}`}
           >
              <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 object-cover shrink-0" />
              <div className={
                isCollapsed
                ? 'absolute left-full ml-4 px-3 py-1.5 whitespace-nowrap bg-gray-800 text-white text-sm font-medium rounded-lg shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-10'
                : 'ml-3'
              }>
                 {isCollapsed ? user.name : (
                    <div>
                        <p className="font-semibold text-base text-gray-900 dark:text-white">{user.name}</p>
                    </div>
                 )}
              </div>
           </button>
        </div>
      </div>
      {isProfileModalOpen && <ProfileModal onClose={() => setProfileModalOpen(false)} user={user} onSave={setUser} />}
      {isSettingsModalOpen && <SettingsModal onClose={() => setSettingsModalOpen(false)} theme={theme} setTheme={setTheme} />}
    </>
  );
};

export default Sidebar;