
import React from 'react';
import {
  SearchIcon,
  NotificationsIcon,
  AccountIcon,
  SunIcon,
  MoonIcon
} from '../icons/IconComponents';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  pageTitle: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-premium-slate-100 dark:border-gray-700 sticky top-0 z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            {onMenuClick && (
              <button 
                onClick={onMenuClick}
                className="md:hidden mr-3 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-premium-slate-50 dark:hover:bg-gray-700 transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-none truncate max-w-[150px] sm:max-w-xs">{pageTitle}</h1>
          </div>
          
          <div className="hidden lg:flex flex-1 justify-center px-10">
            <div className="max-w-md w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <SearchIcon className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-14 pr-6 py-4 bg-premium-slate-50 dark:bg-gray-700 border-none transition-all rounded-3xl leading-5 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 focus:bg-white dark:bg-gray-600 sm:text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200"
                  placeholder="Global Command Search..."
                  type="search"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-400 hover:bg-premium-slate-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-all">
              <NotificationsIcon className="scale-110" />
            </button>
            <button
              onClick={handleToggle}
              className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-400 hover:bg-premium-slate-50 dark:hover:bg-gray-700 hover:text-amber-500 transition-all"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
            <div className="h-8 w-px bg-premium-slate-100 dark:bg-gray-600 mx-2"></div>
            <button className="flex items-center p-1 rounded-2xl text-gray-500 hover:bg-premium-slate-50 dark:hover:bg-gray-700 transition-all border border-transparent hover:border-premium-slate-100 dark:hover:border-gray-500">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/50">
                  <AccountIcon />
               </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
