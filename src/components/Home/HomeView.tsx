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
import { IndexSubpage } from './subpage/IndexSubpage';
import { TelemetrySubpage } from './subpage/TelemetrySubpage';
import { SecuritySubpage } from './subpage/SecuritySubpage';
import { InfoSubpage } from './subpage/InfoSubpage';

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

  const [hubActiveSubTab, setHubActiveSubTab] = useState<'modules' | 'drafts' | 'archives'>('modules');

  useEffect(() => {
    const checkNav = () => {
      try {
        const savedNav = localStorage.getItem('bharat_book_navigation_defaults');
        if (savedNav) {
          const { page, subPage, subSubPage } = JSON.parse(savedNav);
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

  useEffect(() => {
    const handleSubtabTrigger = () => {
      const override = localStorage.getItem('bharat_book_index_subsubpage_override');
      if (override === 'modules' || override === 'drafts' || override === 'archives') {
        setHubActiveSubTab(override);
        localStorage.removeItem('bharat_book_index_subsubpage_override');
      }
    };
    handleSubtabTrigger();
    window.addEventListener('bharat_book_index_subsubpage_trigger', handleSubtabTrigger);
    return () => {
      window.removeEventListener('bharat_book_index_subsubpage_trigger', handleSubtabTrigger);
    };
  }, []);
  
  const [currentTime, setCurrentTime] = useState<string>('');
  const [resetKey, setResetKey] = useState<number>(0);
  
  // Search & Toolbar States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = getCurrentUser();

  // Dynamic search matching function
  const getMatchCounts = React.useCallback((term: string) => {
    if (!term.trim()) return { modules: 0, drafts: 0, archives: 0 };
    const query = term.toLowerCase().trim();
    const tDummy = (key: string) => key;
    const schema = getNavigationSchema(tDummy);

    // Modules matching
    let modulesCount = 0;
    schema.pages.forEach(p => {
      const label = p.label.toLowerCase();
      const pageId = p.id.toLowerCase();
      const isMatch = label.includes(query) || pageId.includes(query) || (language === 'hi' ? 'मुख्य पृष्ठ' : 'page').toLowerCase().includes(query);
      if (isMatch) {
         modulesCount++;
         return;
      }
      const sps = schema.subPages[p.id] || [];
      const anySpMatch = sps.some(sp => {
        const spLabel = sp.label.toLowerCase();
        if (spLabel.includes(query)) return true;
        const ssps = schema.subSubPages[sp.id] || [];
        return ssps.some(ssp => ssp.label.toLowerCase().includes(query));
      });
      if (anySpMatch) {
        modulesCount++;
      }
    });

    // Subpages (drafts) matching
    let draftsCount = 0;
    schema.pages.forEach(p => {
      const sps = schema.subPages[p.id] || [];
      sps.forEach(sp => {
        const label = sp.label.toLowerCase();
        const pathMatch = sp.id.toLowerCase().includes(query);
        const subSubPages = schema.subSubPages[sp.id] || [];
        const isMatch = label.includes(query) || pathMatch || subSubPages.some(ssp => ssp.label.toLowerCase().includes(query));
        if (isMatch) {
          draftsCount++;
        }
      });
    });

    // Tabs (archives) matching
    let archivesCount = 0;
    schema.pages.forEach(p => {
      const sps = schema.subPages[p.id] || [];
      sps.forEach(sp => {
        const ssps = schema.subSubPages[sp.id] || [];
        ssps.forEach(ssp => {
          const label = ssp.label.toLowerCase();
          const pathMatch = ssp.id.toLowerCase().includes(query);
          if (label.includes(query) || pathMatch) {
            archivesCount++;
          }
        });
      });
    });

    return { modules: modulesCount, drafts: draftsCount, archives: archivesCount };
  }, [language]);

  const matchCounts = React.useMemo(() => {
    return getMatchCounts(searchTerm);
  }, [searchTerm, getMatchCounts]);

  // Auto-Aligning & Tab Auto-Switching Protocol (Background Sync)
  useEffect(() => {
    if (activeSubpage !== 'hub' || !searchTerm.trim()) return;
    
    const currentMatches = hubActiveSubTab === 'modules' ? matchCounts.modules :
                           hubActiveSubTab === 'drafts' ? matchCounts.drafts :
                           matchCounts.archives;
                           
    if (currentMatches === 0) {
      if (matchCounts.modules > 0) {
        setHubActiveSubTab('modules');
      } else if (matchCounts.drafts > 0) {
        setHubActiveSubTab('drafts');
      } else if (matchCounts.archives > 0) {
        setHubActiveSubTab('archives');
      }
    }
  }, [searchTerm, activeSubpage, matchCounts.modules, matchCounts.drafts, matchCounts.archives, hubActiveSubTab]);

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

  // Handle Export Configuration Trigger
  const handleExport = () => {
    const exportData = {
      appName: "Bharat Book AI Suite",
      exportDate: new Date().toISOString(),
      activeSubpage: activeSubpage,
      language: language,
      counts: {
        totalVouchers: allVouchers.length,
        partyMasters: partyMasters.length,
        ledgerRules: ledgerMasters.length,
        inventoryItems: itemMasters.length
      },
      integrityCheck: "PASS",
    };

    let blob: Blob;
    let filename = `bharat_book_home_config.${fileFormat.toLowerCase()}`;

    if (fileFormat === 'JSON') {
      const str = JSON.stringify(exportData, null, 2);
      blob = new Blob([str], { type: 'application/json' });
    } else {
      // CSV format conversion
      const csvLines = [
        ["Parameter", "Value"],
        ["Application Name", exportData.appName],
        ["Export Date", exportData.exportDate],
        ["Active Subpage", exportData.activeSubpage],
        ["Codec Language", exportData.language],
        ["Total Patches Count", exportData.counts.totalVouchers],
        ["Master Vendor Count", exportData.counts.partyMasters],
        ["Ledger Accounts Count", exportData.counts.ledgerRules],
        ["Inventory Materials Count", exportData.counts.inventoryItems],
        ["Integrity Verification", exportData.integrityCheck],
      ];
      const str = csvLines.map(line => line.map(cell => `"${cell}"`).join(",")).join("\n");
      blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      title: 'Configuration Exported',
      message: `System cache details successfully downloaded as ${fileFormat}.`,
      type: 'System',
    });
  };

  // Handle Import Configuration Triggers
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        addNotification({
          title: 'Import Success',
          message: `Successfully integrated ${file.name} metadata structure into index views.`,
          type: 'System',
        });
      } catch (err) {
        addNotification({
          title: 'Import Failed',
          message: 'Error processing structure map configurations.',
          type: 'Alert',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Save Configuration State
  const handleSaveConfig = () => {
    localStorage.setItem('bharat_book_home_active_tab', activeSubpage);
    localStorage.setItem('bharat_book_home_file_format', fileFormat);
    
    addNotification({
      title: 'Settings Persisted',
      message: 'Home workspace settings and viewing preferences successfully synchronized.',
      type: 'System',
    });
  };

  // Default configuration restores
  const handleResetDefaults = () => {
    setSearchTerm('');
    setFileFormat('JSON');
    setLanguage('en');
    setActiveSubpage('hub');
    setHubActiveSubTab('modules');
    setResetKey(prev => prev + 1);
    localStorage.setItem('bharat_book_home_active_tab', 'hub');

    addNotification({
      title: 'Preferences Purged',
      message: 'Workspace configurations and dynamic local settings restored to factory defaults.',
      type: 'System',
    });
  };

  // Clear search bar
  const handleClearInput = () => {
    setSearchTerm('');
    addNotification({
      title: 'Filter Purged',
      message: 'Active search terms and filters successfully cleared.',
      type: 'System',
    });
  };

  return (
    <div className="max-w-7xl mx-auto w-full min-h-screen px-4 py-6 md:py-8 space-y-5">
      
      {/* Hidden native input for custom file loader */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json,.csv" 
        className="hidden" 
      />

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
            <span>{language === 'hi' ? 'लॉग्स' : 'TELEMETRY'}</span>
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

      {activeSubpage === 'hub' && (
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
              <Layers className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">
                {language === 'hi' ? 'इंडेक्स सब-पेज कैटलॉग' : 'Index Subpage Catalog'}
              </h2>
              <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={language === 'hi' ? 'सुरक्षित वित्तीय और बही क्रेडेंशियल प्रबंधन' : 'Secure bookkeeping registries & modular integrations'}>
                {language === 'hi' ? 'सुरक्षित वित्तीय और बही क्रेडेंशियल प्रबंधन' : 'Secure bookkeeping registries & modular integrations'}
              </p>
            </div>
          </div>

          {/* Dense Tabs Selector Header Selections (flush right) */}
          <div className="min-w-0 flex-1 flex items-center">
            <div className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start min-w-0 scroll-smooth">
              <button
                onClick={() => setHubActiveSubTab('modules')}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  hubActiveSubTab === 'modules'
                    ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                }`}
              >
                {language === 'hi' ? 'मुख्य पृष्ठ' : 'Main Page'}
                {searchTerm.trim() !== '' && ` (${matchCounts.modules})`}
              </button>
              <button
                onClick={() => setHubActiveSubTab('drafts')}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  hubActiveSubTab === 'drafts'
                    ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                }`}
              >
                {language === 'hi' ? 'उपपृष्ठ' : 'Subpages'}
                {searchTerm.trim() !== '' && ` (${matchCounts.drafts})`}
              </button>
              <button
                onClick={() => setHubActiveSubTab('archives')}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  hubActiveSubTab === 'archives'
                    ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                }`}
              >
                {language === 'hi' ? 'टैब' : 'Tabs'}
                {searchTerm.trim() !== '' && ` (${matchCounts.archives})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row 2: Comprehensive Search Routing & Action Control Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-1.5 sm:p-2 rounded-xl shadow-sm flex flex-row justify-between items-center gap-2">
        
        {/* Search Input Container */}
        <div className="flex-1 min-w-0 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            value={searchTerm}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeSubpage === 'hub' ? (language === 'hi' ? 'इंडेक्स मॉड्यूल खोजें...' : 'Search index modules...') :
              activeSubpage === 'telemetry' ? (language === 'hi' ? 'लॉग्स और ऑडिट खोजें...' : 'Search audit telemetry logs...') :
              (language === 'hi' ? 'सुरक्षा मापदंड या नीतियां...' : 'Search security compliance...')
            }
            className="w-full pl-9 pr-8 py-1.5 bg-gray-50/50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/60 rounded-lg text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono tracking-tight"
          />
          {searchTerm && (
            <button
              onClick={handleClearInput}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={language === 'hi' ? 'खोज साफ़ करें' : 'Clear search'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Compact Same-Row Actions Toolbar */}
        <div className={`flex items-center gap-1.5 shrink-0 transition-all duration-200 ${
          (isSearchFocused || searchTerm.length > 0) ? 'hidden sm:flex' : 'flex'
        }`}>
          
          <div 
            className="relative inline-flex items-center bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
            title="Simple Input and Output"
          >
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
              title="Simple Input and Output"
              aria-label="Simple Input and Output"
              className="bg-transparent text-slate-800 dark:text-slate-200 pr-3.5 font-black focus:outline-none cursor-pointer text-[10px] sm:text-[11px] appearance-none"
            >
              <option value="JSON" className="dark:bg-gray-800">JSON</option>
              <option value="CSV" className="dark:bg-gray-800">CSV</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 absolute right-1.5 pointer-events-none" />
          </div>

          <button
            onClick={handleImportClick}
            title={language === 'hi' ? 'कॉन्फ़िगरेशन आयात करें (Simple Input and Output)' : 'Import Config (Simple Input and Output)'}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'आयात' : 'Import'}</span>
          </button>

          <button
            onClick={handleExport}
            title={language === 'hi' ? 'कॉन्फ़िगरेशन निर्यात करें (Simple Input and Output)' : 'Export Config (Simple Input and Output)'}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'निर्यात' : 'Export'}</span>
          </button>

          <button
            onClick={handleClearInput}
            title={language === 'hi' ? 'खोज साफ़ करें' : 'Clear Input'}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer items-center gap-1.5 hidden lg:flex"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? 'साफ़' : 'Clear Input'}</span>
          </button>

          <button
            onClick={handleResetDefaults}
            title={language === 'hi' ? 'डिफ़ॉल्ट पर रीसेट करें' : 'Reset defaults'}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
          </button>

          <button
            onClick={handleSaveConfig}
            title={language === 'hi' ? 'सहेजें' : 'Save Config'}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-750 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 shrink-0 text-white" />
            <span className="hidden lg:inline">{language === 'hi' ? 'सहेजें' : 'Save'}</span>
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
                searchTerm={searchTerm}
                activeSubTab={hubActiveSubTab}
                setActiveSubTab={setHubActiveSubTab}
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
                searchTerm={searchTerm}
              />
            )}
            
            {activeSubpage === 'telemetry' && (
              <TelemetrySubpage 
                allVouchers={allVouchers}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                itemMasters={itemMasters}
                searchTerm={searchTerm}
              />
            )}

            {activeSubpage === 'security' && (
              <SecuritySubpage searchTerm={searchTerm} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
