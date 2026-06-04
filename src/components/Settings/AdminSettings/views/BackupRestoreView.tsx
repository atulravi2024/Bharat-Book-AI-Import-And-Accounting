import React from 'react';
import { Shield, ChevronDown, ChevronUp, Info, Download, Upload } from 'lucide-react';

interface BackupRestoreViewProps {
  t: (key: string) => string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  handleBackup: () => void;
  handleRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BackupRestoreView: React.FC<BackupRestoreViewProps> = ({
  t,
  expandedSection,
  setExpandedSection,
  handleBackup,
  handleRestore,
}) => {
  const isOpen = expandedSection === 'backup';

  return (
    <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'backup')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Data Backups, Exports & Restore")}</h4>
            <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Secure local data schema extraction & snapshot restoring")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-155">
          <div className="bg-emerald-50/30 border border-emerald-100/40 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-emerald-800 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-950/20 leading-relaxed">
            <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">{t("Disaster Recovery Framework")}</span>
              {t("Downloading a backup generates a plain JSON extract of all existing ledger setups, transactions, statements, and key variables. Restoring will patch these entries directly.")}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleBackup}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              {t("Download Full JSON Backup")}
            </button>
            
            <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition shadow-xs">
              <Upload className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span>{t("Upload & Restore Backup")}</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleRestore}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
