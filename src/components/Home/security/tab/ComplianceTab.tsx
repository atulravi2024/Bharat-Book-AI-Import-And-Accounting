import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';

interface ComplianceTabProps {
  language: string;
}

export const ComplianceTab: React.FC<ComplianceTabProps> = ({
  language
}) => {
  return (
    <div className="bg-white dark:bg-gray-850 border border-slate-100 dark:border-gray-750 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5 leading-none">
        <Lock className="w-4 h-4 text-slate-500" />
        GDPR Zero-Retention Compliance Agreement
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
        <div className="space-y-1.5 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
          <h5 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            NO LOGGING GUIDELINES
          </h5>
          <p>Our servers never cache file assets, personal tax identifiers, or bank transactions to persistent databases without your active user authorization.</p>
        </div>

        <div className="space-y-1.5 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
          <h5 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            RAM SANDBOX ENVIRONMENT
          </h5>
          <p>All AI analysis parsing operations are performed using transactional, private instances. Your private credentials never leak into other models.</p>
        </div>

        <div className="space-y-1.5 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
          <h5 className="font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            USER CONTROL SOVEREIGNTY
          </h5>
          <p>You have full data custody. Purge, clean, delete, resetting or re-indexing files completely removes tracks instantly, ensuring complete privacy.</p>
        </div>
      </div>
    </div>
  );
};
