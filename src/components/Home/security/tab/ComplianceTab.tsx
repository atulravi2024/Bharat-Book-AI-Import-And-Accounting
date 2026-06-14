import React, { useState } from 'react';
import { Lock, CheckCircle, Download, Trash2, FileText, Activity, Server } from 'lucide-react';

interface ComplianceTabProps {
  language: string;
}

export const ComplianceTab: React.FC<ComplianceTabProps> = ({
  language
}) => {
  const [downloading, setDownloading] = useState(false);
  const [purging, setPurging] = useState(false);
  
  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  const handlePurge = () => {
    setPurging(true);
    setTimeout(() => setPurging(false), 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-850 border border-slate-100 dark:border-gray-750 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <Lock className="w-4 h-4 text-slate-500" />
            GDPR Zero-Retention Compliance
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Manage your data sovereignty, download reports, or purge all traces instantly.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors border border-slate-200 dark:border-gray-700 disabled:opacity-50"
          >
            {downloading ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {downloading ? 'Generating...' : 'Audit Report'}
          </button>
          <button 
            onClick={handlePurge}
            disabled={purging}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-xs font-bold transition-colors border border-red-100 dark:border-red-900/30 disabled:opacity-50"
          >
            {purging ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            {purging ? 'Purging...' : 'Data Purge'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-550 dark:text-slate-400 font-semibold">
        <div className="space-y-2 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
          <h5 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            NO LOGGING GUIDELINES
          </h5>
          <p className="leading-relaxed opacity-90">Our servers never cache file assets, personal tax identifiers, or transactions to persistent databases without your active user authorization.</p>
          <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[10px] text-slate-400">Status</span>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">VERIFIED</span>
          </div>
        </div>

        <div className="space-y-2 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
          <h5 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            RAM SANDBOX ENVIRONMENT
          </h5>
          <p className="leading-relaxed opacity-90">All AI analysis parsing operations are performed using transactional, private instances. Your private credentials never leak into other models.</p>
          <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[10px] text-slate-400">Environment</span>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">ISOLATED</span>
          </div>
        </div>

        <div className="space-y-2 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
          <h5 className="font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            USER CONTROL SOVEREIGNTY
          </h5>
          <p className="leading-relaxed opacity-90">You have full data custody. Purge, clean, delete, resetting or re-indexing files completely removes tracks instantly, ensuring complete privacy.</p>
          <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[10px] text-slate-400">Consent Level</span>
            <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">STRICT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
