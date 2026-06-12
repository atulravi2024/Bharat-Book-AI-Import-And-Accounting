import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Home,
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Clock,
  LayoutGrid,
  Search,
  X,
  Download,
  Upload,
  RotateCcw,
  Save,
  Trash2,
  ChevronDown,
  ArrowLeft,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MainView, ParsedVoucher } from '../../app/types';
import { getCurrentUser } from '../../utils/security';
import { useNotifications } from '../../context/NotificationContext';
import { getNavigationSchema } from '../../app/navigationSchema';

// Subpage imports
import { IndexSubpage } from './IndexSubpage';
import { ActivitySubpage } from './ActivitySubpage';
import { SecuritySubpage } from './SecuritySubpage';
import { InfoSubpage } from './InfoSubpage';

interface HomeViewProps {
  setView: (view: MainView) => void;
  allVouchers: ParsedVoucher[];
  partyMasters: any[];
  ledgerMasters: any[];
  itemMasters: any[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  setView,
  allVouchers = [],
  partyMasters = [],
  ledgerMasters = [],
  itemMasters = []
}) => {
  const { language, setLanguage } = useLanguage();
  const { addNotification } = useNotifications();
  
  // State-driven subpage routing (hub is the first view / index)
  const [activeSubpage, setActiveSubpage] = useState<'hub' | 'info' | 'telemetry' | 'security'>(() => {
    const saved = localStorage.getItem('bharat_book_home_active_tab');
    if (saved === 'info' || saved === 'telemetry' || saved === 'security') return saved;
    return 'hub';
  });

  useEffect(() => {
    const checkNav = () => {
      try {
        const savedNav = localStorage.getItem('bharat_book_navigation_defaults');
        if (savedNav) {
          const { page, subPage } = JSON.parse(savedNav);
          if (page === 'index') {
            if (subPage === 'info' || subPage === 'telemetry' || subPage === 'security' || subPage === 'hub') {
              setActiveSubpage(subPage);
            }
          }
        }
      } catch (e) {}
    };
    checkNav();
  }, []);

  useEffect(() => {
    const handleSubpageTrigger = () => {
      const subOverride = localStorage.getItem('bharat_book_index_subpage_override');
      if (subOverride === 'hub' || subOverride === 'info' || subOverride === 'telemetry' || subOverride === 'security') {
        setActiveSubpage(subOverride);
        localStorage.removeItem('bharat_book_index_subpage_override');
      }
    };
    handleSubpageTrigger();
    window.addEventListener('bharat_book_index_subpage_trigger', handleSubpageTrigger);
    return () => {
      window.removeEventListener('bharat_book_index_subpage_trigger', handleSubpageTrigger);
    };
  }, []);
  
  const [currentTime, setCurrentTime] = useState<string>('');
  const [resetKey, setResetKey] = useState<number>(0);
  
  const currentUser = getCurrentUser();

  // Dynamic live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className="max-w-7xl mx-auto w-full min-h-screen px-4 py-6 md:py-8 space-y-5">
      
      {/* Row 1: Premium Dynamic Compact Tab Selection Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto overflow-y-hidden custom-scrollbar pb-3 w-full flex items-center justify-start shrink-0 mb-5 bg-transparent">
        <div className="flex flex-row space-x-2 min-w-max px-1">
          <button
            onClick={() => {
              setActiveSubpage('hub');
              localStorage.setItem('bharat_book_home_active_tab', 'hub');
            }}
            className={`flex-shrink-0 flex items-center gap-3 p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm uppercase tracking-wider whitespace-nowrap border border-transparent cursor-pointer ${
              activeSubpage === 'hub'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/50'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 shadow-sm border border-gray-150/40 dark:border-gray-750/30'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{language === 'hi' ? 'इंडेक्स' : 'INDEX'}</span>
          </button>

          <button
            onClick={() => {
              setActiveSubpage('info');
              localStorage.setItem('bharat_book_home_active_tab', 'info');
            }}
            className={`flex-shrink-0 flex items-center gap-3 p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm uppercase tracking-wider whitespace-nowrap border border-transparent cursor-pointer ${
              activeSubpage === 'info'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/50'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 shadow-sm border border-gray-150/40 dark:border-gray-750/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hi' ? 'आंकड़े' : 'INFO'}</span>
          </button>

          <button
            onClick={() => {
              setActiveSubpage('telemetry');
              localStorage.setItem('bharat_book_home_active_tab', 'telemetry');
            }}
            className={`flex-shrink-0 flex items-center gap-3 p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm uppercase tracking-wider whitespace-nowrap border border-transparent cursor-pointer ${
              activeSubpage === 'telemetry'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/50'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 shadow-sm border border-gray-150/40 dark:border-gray-750/30'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{language === 'hi' ? 'गतिविधि' : 'ACTIVITY'}</span>
          </button>

          <button
            onClick={() => {
              setActiveSubpage('security');
              localStorage.setItem('bharat_book_home_active_tab', 'security');
            }}
            className={`flex-shrink-0 flex items-center gap-3 p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm uppercase tracking-wider whitespace-nowrap border border-transparent cursor-pointer ${
              activeSubpage === 'security'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/50'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 shadow-sm border border-gray-150/40 dark:border-gray-750/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'hi' ? 'सुरक्षा' : 'SECURITY'}</span>
          </button>
        </div>
      </div>

      {/* Row 4: Independent Subpage Screens Content Container */}
      <div className="w-full min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubpage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="w-full"
          >
            {activeSubpage === 'hub' && (
              <IndexSubpage 
                key={`index-subpage-${resetKey}`}
                setView={setView}
                onNavigateToSubpage={(sub) => {
                  setActiveSubpage(sub);
                  localStorage.setItem('bharat_book_home_active_tab', sub);
                }}
              />
            )}

            {activeSubpage === 'info' && (
              <InfoSubpage 
                allVouchers={allVouchers}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                itemMasters={itemMasters}
              />
            )}
            
            {activeSubpage === 'telemetry' && (
              <ActivitySubpage 
                allVouchers={allVouchers}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                itemMasters={itemMasters}
              />
            )}

            {activeSubpage === 'security' && (
              <SecuritySubpage />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
