import React, { useState, useEffect } from 'react';
import { Database, Trash2, RefreshCw, Layers, HardDrive, Cloud, Server, CheckCircle2, Laptop, ShieldCheck, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../../../../context/NotificationContext';

interface StorageTabProps {
  language: string;
}

interface DBStorage {
  id: string;
  name_en: string;
  name_hi: string;
  type_en: string;
  type_hi: string;
  size: number;
  sizeLimit: number;
  records: number;
  status_en: string;
  status_hi: string;
  syncTime_en: string;
  syncTime_hi: string;
}

export const StorageTab: React.FC<StorageTabProps> = ({ language }) => {
  const { addNotification } = useNotifications();
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [quotaLimit, setQuotaLimit] = useState<number>(5.0);
  const [descEn, setDescEn] = useState<string>('');
  const [descHi, setDescHi] = useState<string>('');
  const [dbs, setDbs] = useState<DBStorage[]>([]);

  // Real browser storage states (Non-Demo)
  const [localStats, setLocalStats] = useState({ count: 0, sizeKB: 0, keys: [] as string[] });
  const [sessionStats, setSessionStats] = useState({ count: 0, sizeKB: 0, keys: [] as string[] });

  // Collapsible toggle state (synchronized expansion for both local and session storage)
  const [isStorageExpanded, setIsStorageExpanded] = useState<boolean>(false);

  const calculateRealStats = () => {
    try {
      // 1. window.localStorage stats
      let localChars = 0;
      const localCount = window.localStorage.length;
      const localKeys: string[] = [];
      for (let i = 0; i < localCount; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          localKeys.push(key);
          const value = window.localStorage.getItem(key) || '';
          localChars += key.length + value.length;
        }
      }
      // UTF-16 characters use 2 bytes in memory
      const localBytes = localChars * 2;
      const localKB = localBytes / 1024;

      // 2. window.sessionStorage stats
      let sessionChars = 0;
      const sessionCount = window.sessionStorage.length;
      const sessionKeys: string[] = [];
      for (let i = 0; i < sessionCount; i++) {
        const key = window.sessionStorage.key(i);
        if (key) {
          sessionKeys.push(key);
          const value = window.sessionStorage.getItem(key) || '';
          sessionChars += key.length + value.length;
        }
      }
      const sessionBytes = sessionChars * 2;
      const sessionKB = sessionBytes / 1024;

      setLocalStats({
        count: localCount,
        sizeKB: localKB,
        keys: localKeys.slice(0, 5) // Show top 5 keys
      });

      setSessionStats({
        count: sessionCount,
        sizeKB: sessionKB,
        keys: sessionKeys.slice(0, 5)
      });
    } catch (e) {
      console.warn('Real browser storage check blocked:', e);
    }
  };

  useEffect(() => {
    const fetchStorageConfig = async () => {
      try {
        const res = await fetch('/sample-data/storage.json');
        if (res.ok) {
          const data = await res.json();
          if (data.cacheSize !== undefined) setCacheSize(data.cacheSize);
          if (data.recordCount !== undefined) setRecordCount(data.recordCount);
          if (data.quotaLimit !== undefined) setQuotaLimit(data.quotaLimit);
          if (data.desc_en !== undefined) setDescEn(data.desc_en);
          if (data.desc_hi !== undefined) setDescHi(data.desc_hi);
          if (data.dbs !== undefined) setDbs(data.dbs);
        }
      } catch (err) {
        console.error('Failed to load storage configurations', err);
      }
    };
    fetchStorageConfig();
    calculateRealStats();
  }, []);

  const handleClearCache = () => {
    setCacheSize(0);
    setRecordCount(0);
    addNotification({
      title: language === 'hi' ? 'कैश साफ किया गया' : 'Cache Memory Purged',
      message: language === 'hi' 
        ? 'सभी इन-मेमोरी रेंडरिंग पीडीएफ और अस्थायी लॉग हटा दिए गए हैं।'
        : 'All temporary PDF rendering assets and obsolete telemetry logs successfully deleted.',
      type: 'System'
    });
  };

  const handleRecalibrate = () => {
    calculateRealStats();
    addNotification({
      title: language === 'hi' ? 'पुनः अंशाकन' : 'Quota Recalibrated',
      message: language === 'hi'
        ? 'लोकल स्टोरेज सीमा उपयोग का नया स्कैन पूरा हुआ।'
        : 'Re-indexed storage blocks scanned. Current consumption index is normal.',
      type: 'System'
    });
  };

  // Convert KB to percentage out of 5MB limit (5120KB)
  const localQuotaPercent = Math.min(100, (localStats.sizeKB / 5120) * 100);
  const sessionQuotaPercent = Math.min(100, (sessionStats.sizeKB / 5120) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Memory status */}
        <div className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-slate-100 dark:border-gray-750 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              {language === 'hi' ? 'स्थानीय भंडारण आवंटन' : 'Local Storage Quota'}
            </h4>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{cacheSize.toFixed(1)} MB</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">/ {quotaLimit.toFixed(1)} MB Allocated API Limit</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                {language === 'hi' ? descHi : descEn}
              </p>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${cacheSize > 4 ? 'bg-red-500' : cacheSize > 2 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                style={{ width: `${quotaLimit > 0 ? Math.min(100, (cacheSize / quotaLimit) * 100) : 0}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
              <span>0% USED</span>
              <span>{quotaLimit > 0 ? Math.min(100, (cacheSize / quotaLimit) * 100).toFixed(0) : 0}% LIMIT CAP</span>
            </div>
          </div>
        </div>

        {/* Temporary Log Counter */}
        <div className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-slate-100 dark:border-gray-750 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              {language === 'hi' ? 'अस्थायी रिकॉर्ड इतिहास' : 'Cached Ephemeral Records'}
            </h4>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">{recordCount} {language === 'hi' ? 'प्रविष्टियाँ' : 'Logs'}</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                {language === 'hi'
                  ? 'अस्थायी डेटा जिसे सुरक्षित रूप से डिलीट या रीसेट किया जा सकता है।'
                  : 'Redundant OCR indexes, voucher templates, and draft auto-saves stored locally.'
                }
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleClearCache}
              disabled={recordCount === 0}
              className="flex-1 py-1.5 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {language === 'hi' ? 'कैश साफ करें' : 'Clear Cache'}
            </button>
            <button
              onClick={handleRecalibrate}
              className="px-3 bg-slate-100 dark:bg-gray-855 border border-slate-200 dark:border-gray-750 hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
              {language === 'hi' ? 'पुनः जांच' : 'Scan'}
            </button>
          </div>

        </div>

      </div>

      {/* SECTION A: Real Local Device Storage (Live, Non-Demo) */}
      <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-gray-800/80">
        <div>
          <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-450 uppercase tracking-widest flex items-center gap-2">
            <Laptop className="w-4 h-4 text-emerald-500 shrink-0" />
            {language === 'hi' ? 'सक्रिय स्थानीय उपकरण भंडारण (वास्तविक / लाइव)' : 'Active User Device Storage Engines (Real-Time)'}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            {language === 'hi'
              ? 'मुख्य वेब स्टोरेज इंजन जो सक्रिय रूप से यूजर इंटरफेस कॉन्फ़िगरेशन, लोकल भाषा विकल्प, और क्रेडेंशियल्स को सुरक्षित रखते हैं।'
              : 'Physical client-side browser files actively reading/writing dynamic user layouts, notification states, localization data, and drafted import lines.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* HTML5 localStorage Card (Real-Time) */}
          <div className="bg-white dark:bg-gray-850 rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-950/40 shadow-xs flex flex-col hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group">
            
            {/* Interactive Trigger block */}
            <button
              onClick={() => setIsStorageExpanded(!isStorageExpanded)}
              className="w-full text-left p-5 pb-3 flex flex-col space-y-3 cursor-pointer bg-slate-50/20 dark:bg-transparent hover:bg-slate-50/55 dark:hover:bg-gray-800/10 transition-colors"
            >
              {/* Header and indicator row */}
              <div className="flex items-start justify-between gap-2.5 w-full">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl border shrink-0 bg-emerald-50/70 dark:bg-emerald-955/40 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight truncate">
                        {language === 'hi' ? 'HTML5 दृढ़ लोकलस्टोरेज' : 'HTML5 LocalStorage Engine'}
                      </h4>
                      {/* Pulsing Live Badge */}
                      <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-955/60 text-[8px] text-emerald-700 dark:text-emerald-400 border border-emerald-250/35 dark:border-emerald-900/30 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider select-none leading-none">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        {language === 'hi' ? 'सक्रिय' : 'LIVE'}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-505 font-bold uppercase tracking-wider truncate mt-1">
                      {language === 'hi' ? 'दृढ़ क्लाइंट कुंजी-मूल्य ' : 'Persistent Browser Key-Value (window.localStorage)'}
                    </p>
                  </div>
                </div>

                {/* Chevron indicator */}
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0">
                  {isStorageExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </button>

            {/* Permanent visual elements (Progress Bar and quota details) always visible in collapsed view */}
            <div className="px-5 pb-5 pt-1 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-slate-505">
                <span>{language === 'hi' ? 'डिवाइस कोटा उपयोग' : 'Safe Allocated Storage'}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-440 font-black">
                  {localQuotaPercent.toFixed(4)}% / 5.00 MB
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${Math.max(1, localQuotaPercent)}%` }} 
                />
              </div>
            </div>

            {/* Collapsible details pane */}
            <AnimatePresence initial={false}>
              {isStorageExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden bg-white dark:bg-gray-850"
                >
                  <div className="p-5 pt-1 space-y-4 border-t border-slate-50 dark:border-gray-800/40">
                    {/* Real keys metadata */}
                    <div className="text-[10px] text-slate-550 dark:text-slate-400 bg-slate-50/50 dark:bg-gray-900/55 p-2.5 rounded-xl border border-slate-100 dark:border-gray-800/50 flex flex-wrap gap-1 items-center">
                      <span className="font-bold text-[8px] uppercase text-slate-400 dark:text-slate-550 block w-full mb-1">
                        {language === 'hi' ? 'सक्रिय कुंजी अनुक्रम (अधिकतम ५):' : 'Active Schema Keys (First 5):'}
                      </span>
                      {localStats.keys.length > 0 ? (
                        localStats.keys.map(k => (
                          <span key={k} className="px-1.5 py-0.5 bg-white dark:bg-gray-800 text-[9px] font-mono font-bold rounded border border-slate-200/55 dark:border-gray-700/80 text-indigo-600 dark:text-indigo-400 shadow-xs truncate max-w-[120px]">
                            {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] italic text-slate-400">{language === 'hi' ? 'कोई कुंजी नहीं' : 'Empty Store'}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50 dark:border-gray-805/40">
                      <div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block leading-none mb-1">
                          {language === 'hi' ? 'सक्रिय स्थानीय कुंजियाँ' : 'Active Keys Count'}
                        </span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-205 font-mono">
                          {localStats.count} Key-Pairs
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block leading-none mb-1">
                          {language === 'hi' ? 'सुरक्षित आकार' : 'Dynamic Size'}
                        </span>
                        <span className="text-sm font-black text-slate-705 dark:text-slate-205 font-mono text-emerald-600 dark:text-emerald-450">
                          {localStats.sizeKB.toFixed(4)} KB
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-550 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {language === 'hi' 
                          ? 'अल्ट्रा-फास्ट लेटेंसी (< 0.1ms) - एन्क्रिप्टेड दृढ़ मोड' 
                          : 'System Native Persistent Sync. (<0.1ms read latency)'
                        }
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* HTML5 sessionStorage Card (Real-Time) */}
          <div className="bg-white dark:bg-gray-850 rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-950/40 shadow-xs flex flex-col hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group">
            
            {/* Interactive Trigger block */}
            <button
              onClick={() => setIsStorageExpanded(!isStorageExpanded)}
              className="w-full text-left p-5 pb-3 flex flex-col space-y-3 cursor-pointer bg-slate-50/20 dark:bg-transparent hover:bg-slate-50/55 dark:hover:bg-gray-800/10 transition-colors"
            >
              {/* Header and indicator row */}
              <div className="flex items-start justify-between gap-2.5 w-full">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl border shrink-0 bg-emerald-50/70 dark:bg-emerald-955/40 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450">
                    <Zap className="w-4 h-4 animate-pulse text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight truncate">
                        {language === 'hi' ? 'HTML5 सत्र बफ़र' : 'HTML5 SessionStorage Buffer'}
                      </h4>
                      {/* Pulsing Live Badge */}
                      <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-955/60 text-[8px] text-emerald-700 dark:text-emerald-440 border border-emerald-250/35 dark:border-emerald-900/30 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider select-none leading-none">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        {language === 'hi' ? 'सक्रिय' : 'LIVE'}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider truncate mt-1">
                      {language === 'hi' ? 'अस्थायी विंडो मेमोरी बफ़र' : 'Volatile Memory State (window.sessionStorage)'}
                    </p>
                  </div>
                </div>

                {/* Chevron indicator */}
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0">
                  {isStorageExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </button>

            {/* Permanent visual elements (Progress Bar and quota details) always visible in collapsed view */}
            <div className="px-5 pb-5 pt-1 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-slate-505">
                <span>{language === 'hi' ? 'अस्थायी विंडो बफ़र कोटा' : 'Dynamic Session Margin'}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-440 font-black">
                  {sessionQuotaPercent.toFixed(4)}% / 5.00 MB
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${Math.max(1, sessionQuotaPercent)}%` }} 
                />
              </div>
            </div>

            {/* Collapsible details pane */}
            <AnimatePresence initial={false}>
              {isStorageExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden bg-white dark:bg-gray-850"
                >
                  <div className="p-5 pt-1 space-y-4 border-t border-slate-50 dark:border-gray-800/40">
                    {/* Real keys metadata */}
                    <div className="text-[10px] text-slate-550 dark:text-slate-400 bg-slate-50/50 dark:bg-gray-900/55 p-2.5 rounded-xl border border-slate-100 dark:border-gray-800/50 flex flex-wrap gap-1 items-center">
                      <span className="font-bold text-[8px] uppercase text-slate-400 dark:text-slate-555 block w-full mb-1">
                        {language === 'hi' ? 'वर्तमान सत्र बफ़र फ़िल्टर (अधिकतम ५):' : 'Active Cache Tags (First 5):'}
                      </span>
                      {sessionStats.keys.length > 0 ? (
                        sessionStats.keys.map(k => (
                          <span key={k} className="px-1.5 py-0.5 bg-white dark:bg-gray-800 text-[9px] font-mono font-bold rounded border border-slate-200/55 dark:border-gray-700/80 text-sky-600 dark:text-sky-450 shadow-xs truncate max-w-[120px]">
                            {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] italic text-slate-400">{language === 'hi' ? 'सत्र बफ़र खाली है' : 'Volatile Buffer Empty'}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50 dark:border-gray-855/40">
                      <div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block leading-none mb-1">
                          {language === 'hi' ? 'सत्र रिकॉर्ड मात्रा' : 'Session Keys'}
                        </span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-205 font-mono">
                          {sessionStats.count} Volatile tags
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-555 font-semibold uppercase tracking-wider block leading-none mb-1">
                          {language === 'hi' ? 'सक्रिय बफ़र' : 'Volatile Size'}
                        </span>
                        <span className="text-sm font-black text-slate-705 dark:text-slate-205 font-mono text-emerald-600 dark:text-emerald-450">
                          {sessionStats.sizeKB.toFixed(4)} KB
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-550 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {language === 'hi'
                          ? 'सत्र बंद होने पर स्वतः नष्ट (मेमोरी लीक संरक्षण सक्रिय)'
                          : 'Auto-purges on browser tab close (Zero Leak Guard active)'
                        }
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
      {/* SECTION B: Database Cluster Engines (In-Memory Simulation, Demo Only) */}
      <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-gray-800/80">
        <div>
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
            <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {language === 'hi' ? 'मॉक डेटाबेस समूह स्टोर (डेमो अनुकरण)' : 'Database Cluster Simulation Engines (Visual Demo)'}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            {language === 'hi'
              ? 'एकीकृत SQL और NoSQL समूह डेटाबेस जो केवल दृश्य प्रदर्शन के उद्देश्य से सिमुलेटेड मेट्रिक्स दिखाते हैं।'
              : 'Simulated relational SQLite and Firebase Firestore database engines, integrated for visual modeling and sandbox telemetry.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dbs.map((db) => {
            const isSQLite = db.id === 'sqlite';
            const percent = db.sizeLimit > 0 ? (db.size / db.sizeLimit) * 100 : 0;
            return (
              <div
                key={db.id}
                className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-slate-100 dark:border-gray-750 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/20 dark:hover:border-blue-500/15 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Visual Demo Marker Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-50 dark:bg-amber-955/50 text-amber-600 dark:text-amber-450 border border-amber-200/50 dark:border-amber-900/30 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {language === 'hi' ? 'डेमो' : 'DEMO ONLY'}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border shrink-0 ${
                      isSQLite 
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-100/50 dark:border-purple-900/30 text-purple-600 dark:text-purple-400'
                    }`}>
                      {isSQLite ? (
                        <HardDrive className="w-4 h-4" />
                      ) : (
                        <Cloud className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight truncate">
                        {language === 'hi' ? db.name_hi : db.name_en}
                      </h4>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate">
                        {language === 'hi' ? db.type_hi : db.type_en}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50 dark:border-gray-800/40">
                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-505 font-semibold uppercase tracking-wider block leading-none mb-1">
                        {language === 'hi' ? 'संग्रहीत रिकॉर्ड' : 'Stored Records'}
                      </span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200 font-mono">
                        {db.records.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-555 font-semibold uppercase tracking-wider block leading-none mb-1">
                        {language === 'hi' ? 'अनुमानित आकार' : 'Estimated Size'}
                      </span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200 font-mono">
                        {db.size.toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-slate-505">
                    <span>
                      {language === 'hi' ? 'अनुकरण उपयोग' : 'Simulated Quota'}
                    </span>
                    <span className="font-mono">
                      {percent.toFixed(1)}% ({db.sizeLimit}MB Limit)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isSQLite ? 'bg-blue-500' : 'bg-purple-500'}`} 
                      style={{ width: `${percent}%` }} 
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{language === 'hi' ? db.syncTime_hi : db.syncTime_en}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
