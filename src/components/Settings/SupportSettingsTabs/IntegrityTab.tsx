import React from 'react';
import { HardDrive, RefreshCw, CheckCircle, ActivityIcon, AlertTriangle, Sparkles, Wifi, Activity, Clock } from 'lucide-react';

export const IntegrityTab = ({
  dbStats, repairState, handleQuickRepair, handleFlushCache, executeFullDiagnosticSuite, diagnosticSuiteStatus, diagnosticSteps
}: any) => {
  return (
    <>
      {/* VIEW 2: INTEGRITY SUITE */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 space-y-2 sm:space-y-0">
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight">Validation Pipeline</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Trigger core integrity tests across modules.</p>
              </div>
              <button
                onClick={executeFullDiagnosticSuite}
                disabled={diagnosticSuiteStatus === 'running'}
                className="px-4 py-2 bg-gray-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${diagnosticSuiteStatus === 'running' ? 'animate-spin' : ''}`} />
                {diagnosticSuiteStatus === 'running' ? 'Running Analytics...' : 'Run Diagnostics'}
              </button>
            </div>

            <div className="grid gap-2">
              {diagnosticSteps.map((step, idx) => (
                <div key={step.id} className="bg-gray-50/50 dark:bg-gray-800/20 border border-gray-200/60 dark:border-gray-800 rounded-lg p-3 flex items-center justify-between gap-3 group hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3 w-full overflow-hidden">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border ${
                      step.status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
                      step.status === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' :
                      step.status === 'running' ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 animate-pulse' :
                      'bg-white border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
                    }`}>
                      {idx === 0 && <HardDrive className="w-3.5 h-3.5" />}
                      {idx === 1 && <Sparkles className="w-3.5 h-3.5" />}
                      {idx === 2 && <Wifi className="w-3.5 h-3.5" />}
                      {idx === 3 && <Activity className="w-3.5 h-3.5" />}
                      {idx === 4 && <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
                        {step.name}
                        {step.status === 'success' && <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-[9px] uppercase tracking-wider">Pass</span>}
                        {step.status === 'warning' && <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 text-[9px] uppercase tracking-wider">Warn</span>}
                      </p>
                      <p className={`text-[11px] font-medium mt-0.5 truncate tracking-wide ${step.result ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{step.result || 'Awaiting dispatch'}</p>
                    </div>
                  </div>
                  <div className="shrink-0 pl-2">
                    {step.status === 'running' && <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
    </>
  );
};
