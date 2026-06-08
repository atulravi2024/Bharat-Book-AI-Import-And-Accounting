import React from 'react';
import { Shield, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { SystemLog } from "../types";

interface SecurityAuditLogsViewProps {
  t: (key: string) => string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  systemLogs: SystemLog[];
  setSystemLogs: React.Dispatch<React.SetStateAction<SystemLog[]>>;
}

export const SecurityAuditLogsView: React.FC<SecurityAuditLogsViewProps> = ({
  t,
  expandedSection,
  setExpandedSection,
  systemLogs,
  setSystemLogs,
}) => {
  const isOpen = expandedSection === 'securityAudit';

  return (
    <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'securityAudit')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-amber-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Access Control & Security Audit Logs")}</h4>
            <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Live tracking record of administrative commands and root state mutations")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING LOGS")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-900 pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">{t("Administrator Activity Registers")}</h4>
              <p className="text-[10px] text-gray-450 dark:text-gray-500 mt-1">{t("Real-time telemetry logging of modifications to critical core ledger indices.")}</p>
            </div>
            <button 
              onClick={() => {
                setSystemLogs([
                  { time: new Date().toISOString().replace('T', ' ').substring(0, 19), event: 'Audit Logs Manually Purged', user: 'Atul Ravi (SA)', status: 'Rotated' }
                ]);
              }}
              className="h-7 text-[10px] font-bold px-3 rounded-lg border border-gray-200 dark:border-gray-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-1 bg-white dark:bg-gray-950"
            >
              <Trash2 className="w-3 h-3" /> {t("Flush Logs")}
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-100 dark:border-gray-900 rounded-xl bg-gray-50/50 dark:bg-gray-900/35">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-900 bg-gray-50/75 dark:bg-gray-900/50 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <th className="p-3">Time Event (UTC)</th>
                  <th className="p-3">{t("Audit Event Context")}</th>
                  <th className="p-3">{t("Initiating Operator")}</th>
                  <th className="p-3 text-right">{t("Verification")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-900 font-mono text-[11px] text-gray-650 dark:text-gray-350">
                {systemLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-white dark:hover:bg-gray-950/50 transition duration-100">
                    <td className="p-3 font-semibold text-gray-400">{log.time}</td>
                    <td className="p-3 font-semibold text-gray-850 dark:text-gray-100">{log.event}</td>
                    <td className="p-3">{log.user}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        log.status === 'Success' || log.status === 'Balanced' || log.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30'
                          : log.status === 'Optimized' || log.status === 'Complete'
                          ? 'bg-indigo-50 dark:bg-indigo-950/35 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30'
                          : 'bg-amber-50 dark:bg-amber-950/35 text-amber-600 dark:text-amber-400 border border-amber-100/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
