import React from 'react';
import { Activity, Cpu } from 'lucide-react';

interface AuditLogsTabProps {
  activities: any[];
  language: string;
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({
  activities = [],
  language
}) => {
  return (
    <div className="bg-white dark:bg-gray-850 border border-slate-100 dark:border-gray-750 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-gray-800/60 pb-3">
        <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          {language === 'hi' ? 'ऑडिट गतिविधि लॉग' : 'Decentralized Activity Logs'}
        </h4>
        <span className="text-[10px] bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase tracking-widest shrink-0">
          {activities.length} Records In Buffer
        </span>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((act) => (
            <div key={act.id} className="flex gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-850/80 transition-all border border-slate-100/50 dark:border-gray-800/20">
              <div className="p-2 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700/60 rounded-lg text-slate-600 dark:text-slate-400 shrink-0 self-start">
                <Cpu className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-850 dark:text-slate-200">{act.info}</p>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 px-2 py-0.5 rounded shadow-xs leading-none">
                    {act.time}
                  </span>
                </div>
                {act.details && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wide bg-white/40 dark:bg-gray-950/20 p-2 rounded border border-slate-50 dark:border-gray-800/40 select-all">
                    {act.details}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {act.action} • UNIT: {act.type}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50/50 dark:bg-gray-800/40 p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 font-sans">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {language === 'hi'
                ? 'खोज से मिलती कोई गतिविधि नहीं मिली।'
                : 'No activity log records match your current search term.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
