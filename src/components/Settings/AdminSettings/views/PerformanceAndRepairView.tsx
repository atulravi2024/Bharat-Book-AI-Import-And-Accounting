import React from 'react';
import { Gauge, ChevronDown, ChevronUp, Play, RefreshCw, CheckCircle2, Check } from 'lucide-react';

interface PerformanceAndRepairViewProps {
  t: (key: string) => string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  benchmarkMs: number | null;
  benchmarkRating: string;
  benchmarkRunning: boolean;
  runPerformanceProbe: () => void;
  handleDatabaseRepairAudit: () => void;
}

export const PerformanceAndRepairView: React.FC<PerformanceAndRepairViewProps> = ({
  t,
  expandedSection,
  setExpandedSection,
  benchmarkMs,
  benchmarkRating,
  benchmarkRunning,
  runPerformanceProbe,
  handleDatabaseRepairAudit,
}) => {
  const isOpen = expandedSection === 'benchmark';

  return (
    <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'benchmark')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-650 dark:text-emerald-400 flex items-center justify-center">
            <Gauge className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("IO Latency Speed & DB Repair")}</h4>
            <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Benchmark localStorage throughput and clean empty indexes")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Benchmarking Card */}
            <div className="bg-gray-50/55 dark:bg-gray-900/30 rounded-xl p-4 border border-gray-100 dark:border-gray-900/75 flex flex-col justify-between">
              <div className="space-y-1.5 mb-4">
                <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-indigo-500" /> {t("Thread IO Throughput Test")}
                </h5>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t("Performs 600 parallel synchronous row writes, active scanner readings and deletion queries to estimate browser sandbox execution latency.")}
                </p>
                
                {benchmarkMs !== null && (
                  <div className="bg-white dark:bg-gray-950 rounded-lg p-2.5 border border-gray-100 dark:border-gray-900 mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400 font-medium">Operation Delay:</span>
                      <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400">{benchmarkMs} ms</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400 font-medium">Rating Level:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{benchmarkRating}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={runPerformanceProbe}
                disabled={benchmarkRunning}
                className="w-full h-8 inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl transition shadow-xs disabled:opacity-50"
              >
                {benchmarkRunning ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" /> {t("Measuring Channels...")}
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" /> {t("Boot Operation Speed Benchmark")}
                  </>
                )}
              </button>
            </div>

            {/* DB Index Optimiser Card */}
            <div className="bg-gray-50/55 dark:bg-gray-900/30 rounded-xl p-4 border border-gray-100 dark:border-gray-900/75 flex flex-col justify-between">
              <div className="space-y-1.5 mb-4">
                <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t("DB Index Audit & Key Repair")}
                </h5>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t("Scans vouchers, item catalogs, and client records for duplications. Cleans whitespace gaps, purges hanging orphan objects, and re-sorts index tags for smooth performance.")}
                </p>
              </div>

              <button
                onClick={handleDatabaseRepairAudit}
                className="w-full h-8 inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-100/50 border border-gray-200 text-gray-750 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 text-[10px] font-bold rounded-xl transition shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {t("Start Index Audit & Repair")}
              </button>
            </div>

          </div>
          
        </div>
      )}
    </div>
  );
};
