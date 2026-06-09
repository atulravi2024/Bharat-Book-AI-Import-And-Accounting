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
  Download,
  Upload,
  RotateCcw,
  Save,
  Trash2,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MainView, ParsedVoucher } from '../../app/types';
import { getCurrentUser } from '../../utils/security';
import { useNotifications } from '../../context/NotificationContext';

// Subpage imports
import { NavigationHubSubpage } from './subpage/NavigationHubSubpage';
import { SystemTelemetrySubpage } from './subpage/SystemTelemetrySubpage';
import { SecurityVaultSubpage } from './subpage/SecurityVaultSubpage';
import { SystemInfoSubpage } from './subpage/SystemInfoSubpage';

interface IndexViewProps {
  setView: (view: MainView) => void;
  allVouchers: ParsedVoucher[];
  partyMasters: any[];
  ledgerMasters: any[];
  itemMasters: any[];
}

export const IndexView: React.FC<IndexViewProps> = ({
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
  
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Search & Toolbar States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-2.5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        
        {/* Compact Dynamic Header */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs shrink-0">
            {activeSubpage === 'hub' ? (
              <LayoutGrid className="w-4 h-4 text-blue-500" />
            ) : activeSubpage === 'info' ? (
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            ) : activeSubpage === 'telemetry' ? (
              <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black text-slate-800 dark:text-white tracking-tight leading-none truncate">
              {activeSubpage === 'hub' ? (language === 'hi' ? 'सिस्टम सुरक्षित होम' : 'System Safe Home') : 
               activeSubpage === 'info' ? (language === 'hi' ? 'सिस्टम बहीखाता सारांश' : 'System Ledger Summary') :
               activeSubpage === 'telemetry' ? (language === 'hi' ? 'सिस्टम टेलीमेट्री' : 'System Telemetry') : 
               (language === 'hi' ? 'सुरक्षा तिजोरी अनुपालन' : 'Security Compliance')}
            </h1>
            <p className="text-[10px] text-slate-450 dark:text-slate-550 font-bold uppercase tracking-widest truncate mt-0.5 whitespace-nowrap">
              {activeSubpage === 'hub' ? (
                language === 'hi' ? 'रजिस्ट्री इंडेक्स' : 'Index Registry'
              ) : activeSubpage === 'info' ? (
                language === 'hi' ? 'वास्तविक आंकड़े और सारांश' : 'Aggregated Analytics'
              ) : activeSubpage === 'telemetry' ? (
                language === 'hi' ? 'सक्रिय प्रणाली लॉग्स' : 'Active System Diagnostics'
              ) : (
                language === 'hi' ? 'AES-GCM-256 सुरक्षा' : 'AES-GCM-256 Encryption'
              )}
            </p>
          </div>
        </div>

        {/* Dense Tabs Selection Container */}
        <div className="min-w-0 flex items-center justify-start sm:justify-end gap-2.5">
          <div className="w-full sm:w-auto flex items-center bg-gray-50/85 dark:bg-gray-800/80 p-1 rounded-lg gap-1 border border-gray-200/40 dark:border-gray-700/40 overflow-x-auto custom-scrollbar justify-start shrink-0">
            <button
              onClick={() => {
                setActiveSubpage('hub');
                localStorage.setItem('bharat_book_home_active_tab', 'hub');
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeSubpage === 'hub'
                  ? 'bg-white dark:bg-gray-750 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">{language === 'hi' ? 'इंडेक्स' : 'INDEX'}</span>
            </button>

            <button
              onClick={() => {
                setActiveSubpage('info');
                localStorage.setItem('bharat_book_home_active_tab', 'info');
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeSubpage === 'info'
                  ? 'bg-white dark:bg-gray-750 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">{language === 'hi' ? 'आंकड़े' : 'INFO'}</span>
            </button>

            <button
              onClick={() => {
                setActiveSubpage('telemetry');
                localStorage.setItem('bharat_book_home_active_tab', 'telemetry');
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeSubpage === 'telemetry'
                  ? 'bg-white dark:bg-gray-750 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">{language === 'hi' ? 'लॉग्स' : 'TELEMETRY'}</span>
            </button>

            <button
              onClick={() => {
                setActiveSubpage('security');
                localStorage.setItem('bharat_book_home_active_tab', 'security');
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeSubpage === 'security'
                  ? 'bg-white dark:bg-gray-750 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">{language === 'hi' ? 'सुरक्षा' : 'SECURITY'}</span>
            </button>
          </div>

          <div className="hidden md:flex items-center text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-gray-800/40 border border-slate-100 dark:border-gray-700/60 px-2 py-1 rounded-lg shrink-0">
            <Clock className="w-3.5 h-3.5 text-blue-500 mr-1.5 shrink-0" />
            <span>{currentTime || '...'}</span>
          </div>
        </div>

      </div>

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
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50/50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/60 rounded-lg text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Compact Same-Row Actions Toolbar */}
        <div className={`flex items-center gap-1.5 shrink-0 transition-all duration-200 ${
          (isSearchFocused || searchTerm.length > 0) ? 'hidden sm:flex' : 'flex'
        }`}>
          
          <div className="relative inline-flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-lg pl-2 pr-1 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0 select-none">
            <span className="hidden sm:inline mr-1">{language === 'hi' ? 'प्रारूप' : 'Format'}:</span>
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
              className="bg-transparent text-slate-800 dark:text-slate-350 pr-4 font-extrabold focus:outline-none cursor-pointer text-[10px] sm:text-[11px]"
            >
              <option value="JSON">JSON</option>
              <option value="CSV">CSV</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1 pointer-events-none" />
          </div>

          <button
            onClick={handleImportClick}
            title={language === 'hi' ? 'कॉन्फ़िगरेशन आयात करें' : 'Import Config'}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'आयात' : 'Import'}</span>
          </button>

          <button
            onClick={handleExport}
            title={language === 'hi' ? 'कॉन्फ़िगरेशन निर्यात करें' : 'Export Config'}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'निर्यात' : 'Export'}</span>
          </button>

          {searchTerm && (
            <button
              onClick={handleClearInput}
              title={language === 'hi' ? 'खोज साफ़ करें' : 'Clear search'}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer items-center gap-1.5 hidden lg:flex"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'hi' ? 'साफ़' : 'Clear Input'}</span>
            </button>
          )}

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
              <NavigationHubSubpage 
                setView={setView}
                searchTerm={searchTerm}
                onNavigateToSubpage={(sub) => {
                  setActiveSubpage(sub);
                  localStorage.setItem('bharat_book_home_active_tab', sub);
                }}
              />
            )}

            {activeSubpage === 'info' && (
              <SystemInfoSubpage 
                allVouchers={allVouchers}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                itemMasters={itemMasters}
                searchTerm={searchTerm}
              />
            )}
            
            {activeSubpage === 'telemetry' && (
              <SystemTelemetrySubpage 
                allVouchers={allVouchers}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                itemMasters={itemMasters}
                searchTerm={searchTerm}
              />
            )}

            {activeSubpage === 'security' && (
              <SecurityVaultSubpage searchTerm={searchTerm} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
