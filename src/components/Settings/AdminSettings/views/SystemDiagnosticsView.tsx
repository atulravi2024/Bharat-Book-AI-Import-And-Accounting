import React from 'react';
import { HardDrive, ChevronDown, ChevronUp, Info, RefreshCw } from 'lucide-react';

interface SystemDiagnosticsViewProps {
  t: (key: string) => string;
  storageUsed: string;
  storagePercent: number;
  quotaTextColor: string;
  quotaIndicatorColor: string;
  calculateStorage: () => void;
  metricItems: Array<{
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }>;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
}

export const SystemDiagnosticsView: React.FC<SystemDiagnosticsViewProps> = ({
  t,
  storageUsed,
  storagePercent,
  quotaTextColor,
  quotaIndicatorColor,
  calculateStorage,
  metricItems,
  expandedSection,
  setExpandedSection,
}) => {
  const isOpen = expandedSection === 'diagnostics';

  return (
    <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'diagnostics')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("System Diagnostics & Storage")}</h4>
            <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Allocation indexes and active table records stats")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-5 animate-in fade-in duration-150">
          
          {/* Storage diagnostics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  {t("Sandboxed Database Usage")}
                </span>
                <span className={`font-bold ${quotaTextColor}`}>
                  {storageUsed} / 5.00 MB ({storagePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${quotaIndicatorColor}`}
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                {t("Bharat Book index parameters are held locally in standard Key-Value tables. Ensure browser storage permission is not auto-purged.")}
              </p>
            </div>
            
            <div className="flex justify-end md:justify-center items-center">
              <button
                onClick={calculateStorage}
                className="inline-flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 px-3.5 py-1.5 rounded-xl text-[11px] font-bold hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 transition shadow-xs"
              >
                <RefreshCw className="w-3 h-3 text-indigo-500" />
                {t("Refresh Storage Counts")}
              </button>
            </div>
          </div>

          {/* Metrical statistics block */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {metricItems.map((met) => (
              <div key={met.label} className={`rounded-xl p-3 border ${met.bg} flex items-center justify-between`}>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide">{met.label}</span>
                  <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{met.value}</p>
                </div>
                <div className={`p-1.5 rounded-lg bg-white dark:bg-gray-900/80 shadow-xs ${met.color}`}>
                  <met.icon className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};
