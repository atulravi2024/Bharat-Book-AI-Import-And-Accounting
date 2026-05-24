import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Shield, Compass, HelpCircle, LifeBuoy } from 'lucide-react';
import { AccountIcon } from '../icons/IconComponents';
import { MainView } from '../../types';
import { ManagedUser, INITIAL_USERS } from '../Settings/UserSettings';

interface ProfileDropdownProps {
  onViewChange?: (view: MainView, settingsTab?: string, usersSubTab?: string) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentLoggedInUserId = localStorage.getItem('bharat_book_current_logged_in_user_id');
  
  const storedUsers = localStorage.getItem('bharat_book_managed_users');
  const users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
  const loggedInUser: ManagedUser = users.find((u: ManagedUser) => u.id === currentLoggedInUserId) || users[0] || INITIAL_USERS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (view: MainView, settingsTab?: string, usersSubTab?: string) => {
    if (onViewChange) {
      onViewChange(view, settingsTab, usersSubTab);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    
    // Update session logout time
    const currentSessionId = localStorage.getItem('bharat_book_current_session_id');
    if (currentSessionId) {
      const existingSessions = JSON.parse(localStorage.getItem('bharat_book_sessions') || '[]');
      const sessionIndex = existingSessions.findIndex((s: any) => s.id === currentSessionId);
      if (sessionIndex >= 0) {
         existingSessions[sessionIndex].logoutTime = Date.now();
         localStorage.setItem('bharat_book_sessions', JSON.stringify(existingSessions));
      }
      localStorage.removeItem('bharat_book_current_session_id');
    }

    localStorage.removeItem('bharat_book_current_logged_in_user_id');
    localStorage.removeItem('bharat_book_session_start');
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-1 rounded-2xl text-gray-500 hover:bg-premium-slate-50 dark:hover:bg-gray-700 transition-all border border-transparent focus:outline-none dark:text-gray-400"
        title="Account & Settings"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-100 dark:shadow-blue-900/50">
          <AccountIcon className="text-base sm:text-lg flex items-center justify-center" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 py-2 z-[70] animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-black text-gray-900 dark:text-white capitalize">{loggedInUser.name}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">{loggedInUser.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-100 dark:border-blue-800/50">
               <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
               <span className="text-[9px] font-black tracking-widest uppercase text-blue-700 dark:text-blue-400">{loggedInUser.role}</span>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => handleNavigate('settings', 'users', 'my-account')}
              className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <div>
                 <p className="text-xs font-bold text-gray-700 dark:text-gray-200">My Profile</p>
                 <p className="text-[10px] text-gray-400 font-medium">Account settings & details</p>
              </div>
            </button>
            <button
              onClick={() => handleNavigate('settings', 'users', 'directory')}
              className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Compass className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <div>
                 <p className="text-xs font-bold text-gray-700 dark:text-gray-200">Company Directory</p>
                 <p className="text-[10px] text-gray-400 font-medium">Manage team & invites</p>
              </div>
            </button>
            <button
              onClick={() => handleNavigate('settings', 'firm')}
              className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <div>
                 <p className="text-xs font-bold text-gray-700 dark:text-gray-200">System Preferences</p>
                 <p className="text-[10px] text-gray-400 font-medium">Billing, taxes & general</p>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 py-2">
            <button
              onClick={() => handleNavigate('settings', 'help')}
              className="w-full px-4 py-2 text-left flex items-center space-x-3 text-gray-655 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <div>
                 <p className="text-xs font-bold">Help Center</p>
                 <p className="text-[9px] text-gray-400">Knowledgebase & documents</p>
              </div>
            </button>
            <button
              onClick={() => handleNavigate('settings', 'support', 'tickets')}
              className="w-full px-4 py-2 text-left flex items-center space-x-3 text-gray-655 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <LifeBuoy className="w-4 h-4 text-violet-500" />
              <div>
                 <p className="text-xs font-bold text-violet-600 dark:text-violet-400">Support & Tickets</p>
                 <p className="text-[9px] text-violet-450 dark:text-violet-500">AI Support chat & submit tickets</p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left flex items-center space-x-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors mt-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-bold">Log out securely</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

