import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  ShieldCheck, Lock, CheckCircle, Globe, Settings,
  Search, X, Upload, Download, Trash2, RotateCcw, Save, ChevronDown
} from 'lucide-react';

// Tab imports
import { EncryptionTab } from './security/tab/EncryptionTab';
import { LanguageTab } from './security/tab/LanguageTab';
import { ComplianceTab } from './security/tab/ComplianceTab';

interface SecuritySubpageProps {}

export const SecuritySubpage: React.FC<SecuritySubpageProps> = () => {
  const { language, setLanguage } = useLanguage();
  const { addNotification } = useNotifications();

  // Tab State
  const [activeTab, setActiveTab] = useState<'encryption' | 'language' | 'compliance'>('encryption');

  // Toolbar state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearInput = () => {
    setSearchTerm('');
    addNotification({
      title: 'Filter Purged',
      message: 'Active search terms for security cleared.',
      type: 'System',
    });
  };

  const handleResetDefaults = () => {
    setSearchTerm('');
    setFileFormat('JSON');
    addNotification({
      title: 'Preferences Purged',
      message: 'Security workspace configurations restored to factory defaults.',
      type: 'System',
    });
  };

  const handleSaveConfig = () => {
    addNotification({
      title: 'Settings Persisted',
      message: 'Security workspace settings successfully synchronized.',
      type: 'System',
    });
  };

  const handleExport = () => {
    addNotification({
      title: 'Security Exported',
      message: `Security cache successfully downloaded as ${fileFormat}.`,
      type: 'System',
    });
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addNotification({
      title: 'Import Success',
      message: `Successfully integrated ${file.name} metadata into security views.`,
      type: 'System',
    });
    e.target.value = '';
  };

  const term = searchTerm.toLowerCase();

  const showEncryptionCard = !term || 
    "cryptographic safe encryption end-to-end active shield local sandbox raw extracted records".toLowerCase().includes(term);

  const showLocalizationCard = !term ||
    "system settings language panel global locale settings localization dynamic display languages locale".toLowerCase().includes(term);

  const showGDPRCard = !term ||
    "gdpr zero-retention compliance agreement zero logging sandbox environment sovereignty private".toLowerCase().includes(term);

  const anyVisible = showEncryptionCard || showLocalizationCard || showGDPRCard;

  return (
    <div className="space-y-6 max-w-full animate-in fade-in duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json,.csv" 
        className="hidden" 
      />

      {/* Security Subpage Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden animate-fade-in">
        <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">
              {language === 'hi' ? 'सुरक्षा एवं नियंत्रण' : 'Security & Workspace Control'}
            </h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={language === 'hi' ? 'सुरक्षा प्रोटोकॉल क्रेडेंशियल्स और अनुपालन' : 'Active encryption keys, locale translation, and sandbox parameters'}>
              {language === 'hi' ? 'सुरक्षा प्रोटोकॉल क्रेडेंशियल्स और अनुपालन' : 'Active encryption keys, locale translation, and sandbox parameters'}
            </p>
          </div>
        </div>

        {/* Dense Tabs Selector Header Selections (flush right) */}
        <div className="min-w-0 flex-1 flex items-center justify-end">
          <div className="flex bg-slate-100 dark:bg-gray-950 p-1.5 rounded-xl gap-1.5 shadow-sm border border-slate-200/50 dark:border-gray-800 shrink-0">
            <button
              id="security-encryption-tab-btn"
              onClick={() => setActiveTab('encryption')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'encryption'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'एन्क्रिप्शन' : 'Encryption'}
            </button>
            <button
              id="security-language-tab-btn"
              onClick={() => setActiveTab('language')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'language'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'भाषा' : 'Language'}
            </button>
            <button
              id="security-compliance-tab-btn"
              onClick={() => setActiveTab('compliance')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'compliance'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'अनुपालन' : 'Compliance'}
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
            placeholder={language === 'hi' ? 'सुरक्षा मापदंड या नीतियां...' : 'Search security compliance...'}
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

        <div className={`flex items-center gap-1.5 shrink-0 transition-all duration-250 ${
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
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 dark:text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer items-center gap-1.5 hidden lg:flex"
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
      
      {searchTerm ? (
        anyVisible ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {showEncryptionCard && <EncryptionTab language={language} />}
              {showLocalizationCard && <LanguageTab language={language} setLanguage={setLanguage} />}
            </div>
            {showGDPRCard && <ComplianceTab language={language} />}
          </div>
        ) : (
          <div className="bg-slate-50/50 dark:bg-gray-800/40 p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'खोज से मिलता कोई सुरक्षा नियम नहीं मिला।'
                : 'No security compliance features matched your current search term.'
              }
            </p>
          </div>
        )
      ) : (
        <div className="animate-in fade-in duration-300">
          {activeTab === 'encryption' && <EncryptionTab language={language} />}
          {activeTab === 'language' && <LanguageTab language={language} setLanguage={setLanguage} />}
          {activeTab === 'compliance' && <ComplianceTab language={language} />}
        </div>
      )}

    </div>
  );
};
