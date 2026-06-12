import React from 'react';

interface SystemHealthTabProps {
  language: string;
}

export const SystemHealthTab: React.FC<SystemHealthTabProps> = ({
  language
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-350">
      
      <div className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-slate-100 dark:border-gray-750 shadow-xs space-y-3">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-none">CPU Processing Load</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800 dark:text-white">0.02%</span>
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wide">Optimized</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full w-[3%]" />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          {language === 'hi'
            ? 'इन-मेमोरी इंडेक्सिंग बहुत स्थिर है, कोई ओवरहेड नहीं पाया गया।'
            : 'Extremely fast parsing times with minimal background script overhead.'
          }
        </p>
      </div>

      <div className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-slate-100 dark:border-gray-750 shadow-xs space-y-3">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-none">In-Memory Sync State</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800 dark:text-white">Connected</span>
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wide">Pristine</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[100%]" />
        </div>
        <p className="text-[10px] text-slate-505 dark:text-slate-400 font-semibold leading-relaxed">
          {language === 'hi'
            ? 'सुरक्षित स्थानीय बफर क्लाउड सिंक्रोनाइजेशन के साथ लाइव जुड़ा हुआ है।'
            : 'Real-time state keeps persistent caches mirrored flawlessly.'
          }
        </p>
      </div>

      <div className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-slate-100 dark:border-gray-750 shadow-xs space-y-3">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-none">Ledger Reconciliation Integrity</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800 dark:text-white">100.0%</span>
          <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wide">Verified</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-[100%]" />
        </div>
        <p className="text-[10px] text-slate-505 dark:text-slate-400 font-semibold leading-relaxed">
          {language === 'hi'
            ? 'सभी बहीखाते डबल-एंट्री नियमों के अनुकूल हैं।'
            : 'Double-entry constraints are strictly synchronized without orphans.'
          }
        </p>
      </div>

    </div>
  );
};
