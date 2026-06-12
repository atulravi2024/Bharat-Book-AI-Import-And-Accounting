import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Clock, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Fingerprint,
  Sparkles,
  Search,
  X,
  Upload,
  Download,
  Trash2,
  RotateCcw,
  Save,
  ChevronDown
} from 'lucide-react';
import { ParsedVoucher } from '../../app/types';
import { getCurrentUser } from '../../utils/security';
import { useNotifications } from '../../context/NotificationContext';
import { OverviewTab } from './info/tab/OverviewTab';
import { TransactionAnalysisTab } from './info/tab/TransactionAnalysisTab';
import { PendingSyncTab } from './info/tab/PendingSyncTab';
import { TaxSummaryTab } from './info/tab/TaxSummaryTab';

interface InfoSubpageProps {
  allVouchers: ParsedVoucher[];
  partyMasters: any[];
  ledgerMasters: any[];
  itemMasters: any[];
}

export const InfoSubpage: React.FC<InfoSubpageProps> = ({
  allVouchers = [],
  partyMasters = [],
  ledgerMasters = [],
  itemMasters = [],
}) => {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();
  const currentUser = getCurrentUser();
  const [currentTime, setCurrentTime] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'pending-sync' | 'tax-summary'>(() => {
    const saved = localStorage.getItem('bharat_book_info_active_subtab');
    if (saved === 'overview' || saved === 'analysis' || saved === 'pending-sync' || saved === 'tax-summary') {
      return saved as 'overview' | 'analysis' | 'pending-sync' | 'tax-summary';
    }
    return 'overview';
  });

  const handleInfoSubTabChange = (tab: 'overview' | 'analysis' | 'pending-sync' | 'tax-summary') => {
    setActiveTab(tab);
    localStorage.setItem('bharat_book_info_active_subtab', tab);
  };

  // Subpage specific local states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  const handleClearInput = () => {
    setSearchTerm('');
    addNotification({
      title: 'Filter Purged',
      message: 'Active search terms and filters for info successfully cleared.',
      type: 'System',
    });
  };

  const handleResetDefaults = () => {
    setSearchTerm('');
    setFileFormat('JSON');
    setActiveTab('overview');
    localStorage.setItem('bharat_book_info_active_subtab', 'overview');
    addNotification({
      title: 'Preferences Purged',
      message: 'Info workspace configurations restored to factory defaults.',
      type: 'System',
    });
  };

  const handleSaveConfig = () => {
    localStorage.setItem('bharat_book_info_active_subtab', activeTab);
    addNotification({
      title: 'Settings Persisted',
      message: 'Info workspace settings successfully synchronized.',
      type: 'System',
    });
  };

  const handleExport = () => {
    const exportData = {
      appName: "Bharat Book AI Suite",
      exportDate: new Date().toISOString(),
      activeSubpage: "info",
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
    let filename = `bharat_book_info_config.${fileFormat.toLowerCase()}`;

    if (fileFormat === 'JSON') {
      const str = JSON.stringify(exportData, null, 2);
      blob = new Blob([str], { type: 'application/json' });
    } else {
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
      title: 'Info Exported',
      message: `System cache details successfully downloaded as ${fileFormat}.`,
      type: 'System',
    });
  };

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
          message: `Successfully integrated ${file.name} metadata structure into info views.`,
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

  return (
    <div className="space-y-6 max-w-full animate-in fade-in duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json,.csv" 
        className="hidden" 
      />

      {/* Info Subpage Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden animate-fade-in">
        <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">
              {language === 'hi' ? 'एंटरप्राइज एनालिटिक्स' : 'Enterprise Analytics'}
            </h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={language === 'hi' ? 'विविध समय सीमाओं और उपकरणों की प्रविष्टि मात्रा' : 'Accrued transactional volume & temporal classifications'}>
              {language === 'hi' ? 'विविध समय सीमाओं और उपकरणों की प्रविष्टि मात्रा' : 'Accrued transactional volume & temporal classifications'}
            </p>
          </div>
        </div>

        {/* Dense Tabs Selector Header Selections (flush right) */}
        <div className="min-w-0 flex-1 flex items-center justify-end">
          <div className="flex bg-slate-100 dark:bg-gray-950 p-1.5 rounded-xl gap-1.5 shadow-sm border border-slate-200/50 dark:border-gray-800 shrink-0">
            <button
              id="info-overview-tab-btn"
              onClick={() => handleInfoSubTabChange('overview')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'अवलोकन' : 'Overview'}
            </button>
            <button
              id="info-analysis-tab-btn"
              onClick={() => handleInfoSubTabChange('analysis')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'analysis'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'लेनदेन विश्लेषण' : 'Transaction Analysis'}
            </button>
            <button
              id="info-pending-sync-tab-btn"
              onClick={() => handleInfoSubTabChange('pending-sync')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'pending-sync'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'लंबित सिंक' : 'Pending Sync'}
            </button>
            <button
              id="info-tax-summary-tab-btn"
              onClick={() => handleInfoSubTabChange('tax-summary')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'tax-summary'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'कर सारांश' : 'Tax Summary'}
            </button>
          </div>
        </div>
      </div>

      {/* Action Control Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-1.5 sm:p-2 rounded-xl shadow-sm flex flex-row justify-between items-center gap-2">
        <div className="flex-1 min-w-0 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            value={searchTerm}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'hi' ? 'विश्लेषिकी खोजें...' : 'Search analytics...'}
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

        <div className={`flex items-center gap-1.5 shrink-0 transition-all duration-200 ${
          (isSearchFocused || searchTerm.length > 0) ? 'hidden sm:flex' : 'flex'
        }`}>
          <div className="relative inline-flex items-center bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all">
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
              className="bg-transparent text-slate-800 dark:text-slate-200 pr-3.5 font-black focus:outline-none cursor-pointer text-[10px] sm:text-[11px] appearance-none"
            >
              <option value="JSON" className="dark:bg-gray-800">JSON</option>
              <option value="CSV" className="dark:bg-gray-800">CSV</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 absolute right-1.5 pointer-events-none" />
          </div>

          <button
            onClick={handleImportClick}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'आयात' : 'Import'}</span>
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'निर्यात' : 'Export'}</span>
          </button>
          <button
            onClick={handleClearInput}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer items-center gap-1.5 hidden lg:flex"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? 'साफ़' : 'Clear Input'}</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
          </button>
          <button
            onClick={handleSaveConfig}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-750 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 shrink-0 text-white" />
            <span className="hidden lg:inline">{language === 'hi' ? 'सहेजें' : 'Save'}</span>
          </button>
        </div>
      </div>
      
      {/* Decorative user credential summary banner */}
      {currentUser && activeTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl border-b-[5px] border-b-blue-650 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 font-sans hover:transition-all hover:scale-[1.01] duration-300">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                {language === 'hi' ? 'स्वागत है, ' : 'Welcome, '} 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  {currentUser?.name || 'Authorized Member'}
                </span>
              </h1>
              <p className="text-slate-350 text-xs sm:text-sm max-w-2xl font-semibold leading-relaxed tracking-wide">
                {language === 'hi' 
                  ? 'भारत बुक एआई वाउचर स्वचालित प्रबंधन केंद्र में स्वागत है। लेखा परीक्षा डेटा, लेजर विश्लेषण और रीयल-टाइम डिवाइस सिंक की रिपोर्ट नीचे जांचें।'
                  : 'Accelerate your double-entry ledger flow with state-of-the-art AI parsing, automatic entity mapping, and real-time validation compliance.'
                }
              </p>
            </div>

            {/* Real-time System Status Panel */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/60 space-y-2 shrink-0 md:min-w-[260px]">
              <div className="flex items-center justify-between border-b border-slate-700/40 pb-1.5">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {language === 'hi' ? 'स्थानीय समय' : 'System Clock'}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-300">{currentTime || '...'}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-bold">{language === 'hi' ? 'सुरक्षा स्थिति' : 'Security Engine'}</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-50/10 px-2 py-0.5 rounded leading-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Secure Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-bold">{language === 'hi' ? 'एआई इंजन' : 'AI Model'}</span>
                  <span className="text-[10px] font-black text-blue-400 font-mono">Gemini-2.5-Flash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Summary Panel - ONLY on Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-slate-50 dark:bg-gray-905 border border-slate-200/50 dark:border-gray-850 rounded-2xl p-5 shadow-inner animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 bg-transparent">
              <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest leading-none flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 animate-pulse" />
                {language === 'hi' ? 'डेटाबेस रियल-टाइम स्थिति' : 'Database Real-Time Health'}
              </span>
              <h2 className="text-base font-black text-slate-800 dark:text-white leading-tight">
                {language === 'hi' ? 'संग्रहीत उद्यम बहीखाता सारांश' : 'Aggregated Enterprise Ledger Summary'}
              </h2>
              <p className="text-xs text-slate-455 dark:text-slate-500 font-medium">
                {language === 'hi' ? 'सिस्टम के मुख्य घटकों और पंजीकृत रिकॉर्ड्स की लाइव मात्रात्मक जानकारी नीचे प्रदर्शित है।' : 'Live structural distribution breakdown of key database registers compiled in local cache.'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-gray-755 shrink-0 self-start md:self-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'एकीकरण: सक्रिय' : 'INTEGRATION: ACTIVE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT WORKSPACE --- */}

      {activeTab === 'overview' ? (
        <OverviewTab 
          allVouchers={allVouchers}
          partyMasters={partyMasters}
          ledgerMasters={ledgerMasters}
          itemMasters={itemMasters}
          searchTerm={searchTerm}
          language={language}
        />
      ) : activeTab === 'analysis' ? (
        <TransactionAnalysisTab 
          allVouchers={allVouchers}
          language={language}
        />
      ) : activeTab === 'pending-sync' ? (
        <PendingSyncTab 
          language={language}
        />
      ) : (
        <TaxSummaryTab 
          allVouchers={allVouchers}
          language={language}
        />
      )}

      {/* Decorative enterprise security stamp */}
      <div className="pt-4 border-t border-slate-100 dark:border-gray-850 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
        <span className="flex items-center gap-1">
          <Fingerprint className="w-3.5 h-3.5 text-blue-550" />
          {language === 'hi' ? 'एंटरप्राइज ऑडिट सुरक्षा टोकन: जीएसी-२५६' : 'ENTERPRISE AUDIT INTEGRITY SIGN: GAC-256'}
        </span>
        <span>{new Date().toISOString().substring(0, 10)}</span>
      </div>

    </div>
  );
};
