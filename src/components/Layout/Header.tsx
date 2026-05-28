
import React, { useState } from 'react';
import {
  SearchIcon,
  NotificationsIcon,
  AccountIcon,
  SunIcon,
  MoonIcon
} from '../icons/IconComponents';
import { ThemeProvider, useTheme } from './ThemeContext';
import { GlobalSearch } from '../Search/GlobalSearch';
import { MainView } from '../../types';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  pageTitle: string;
  onMenuClick?: () => void;
  onViewChange?: (view: MainView, settingsTab?: string, usersSubTab?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuClick, onViewChange }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-premium-slate-100 dark:border-gray-700 sticky top-0 z-[60]">
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-12 md:h-14 relative">
          
          <div className={`flex items-center ${isSearchExpanded ? 'hidden md:flex' : 'flex'}`}>
            {onMenuClick && (
              <button 
                onClick={onMenuClick}
                className="md:hidden mr-2 sm:mr-4 p-2 sm:p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-premium-slate-100 dark:hover:bg-gray-700 transition-all border border-transparent hover:border-premium-slate-200 dark:hover:border-gray-600"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}
            <h1 className="text-base sm:text-lg md:text-xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-none truncate max-w-[140px] sm:max-w-[200px] md:max-w-xs capitalize">{t(pageTitle)}</h1>
          </div>
          
          <div className={`md:hidden flex items-center justify-end flex-1 pr-2 ${isSearchExpanded ? 'hidden' : 'flex'}`}>
            <button onClick={() => setIsSearchExpanded(true)} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-premium-slate-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-all">
               <SearchIcon />
            </button>
          </div>

          <div className={`flex-1 justify-center px-0 md:px-10 ${isSearchExpanded ? 'flex absolute inset-0 z-50 bg-white/95 dark:bg-gray-800/95 items-center px-4 md:px-0' : 'hidden md:flex'}`}>
            <div className="max-w-md w-full flex items-center gap-2">
              {isSearchExpanded && (
                <button onClick={() => setIsSearchExpanded(false)} className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
              <GlobalSearch 
                onViewChange={onViewChange} 
                isSearchExpanded={isSearchExpanded} 
                setIsSearchExpanded={setIsSearchExpanded}
              />
            </div>
          </div>

          <div className={`items-center space-x-1 sm:space-x-2 ${isSearchExpanded ? 'hidden md:flex' : 'flex'}`}>
            <NotificationDropdown onViewChange={onViewChange} />
            <button
              onClick={handleToggle}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl text-gray-400 hover:bg-premium-slate-50 dark:hover:bg-gray-700 hover:text-amber-500 transition-all"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <span className="text-lg sm:text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
            <div className="h-5 sm:h-6 w-px bg-premium-slate-100 dark:bg-gray-600 mx-1 sm:mx-2"></div>
            <ProfileDropdown onViewChange={onViewChange} />
          </div>
        </div>
      </div>
    </header>
  );
};
