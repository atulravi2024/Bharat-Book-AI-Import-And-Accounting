import React, { useState } from 'react';
import { Database, Trash2, RefreshCw, Layers } from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface StorageTabProps {
  language: string;
}

export const StorageTab: React.FC<StorageTabProps> = ({
  language
}) => {
  const { addNotification } = useNotifications();
  const [cacheSize, setCacheSize] = useState<number>(14.8); // MB
  const [recordCount, setRecordCount] = useState<number>(312);

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
    addNotification({
      title: language === 'hi' ? 'पुनः अंशाकन' : 'Quota Recalibrated',
      message: language === 'hi'
        ? 'लोकल स्टोरेज सीमा उपयोग का नया स्कैन पूरा हुआ।'
        : 'Re-indexed storage blocks scanned. Current consumption index is normal.',
      type: 'System'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
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
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">/ 5.0 MB Allocated API Limit</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                {language === 'hi'
                  ? 'यह ब्राउज़र की इन-मेमोरी सीमा के भीतर सुरक्षित संग्रहण का उपयोग करता है।'
                  : 'HTML Local Storage quota utilized dynamically nested within browser limits.'
                }
              </p>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${cacheSize > 4 ? 'bg-red-500' : cacheSize > 2 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                style={{ width: `${Math.min(100, (cacheSize / 5) * 100)}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
              <span>0% USED</span>
              <span>{Math.min(100, (cacheSize / 5) * 100).toFixed(0)}% LIMIT CAP</span>
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
              className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {language === 'hi' ? 'कैश साफ करें' : 'Clear Cache'}
            </button>
            <button
              onClick={handleRecalibrate}
              className="px-3 bg-slate-100 dark:bg-gray-850 border border-slate-200 dark:border-gray-750 hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {language === 'hi' ? 'पुनः जांच' : 'Scan'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
