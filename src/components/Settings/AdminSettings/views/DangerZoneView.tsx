import React from 'react';
import { AlertTriangle, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface DangerZoneViewProps {
  t: (key: string) => string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  showConfirm: string | null;
  setShowConfirm: (confirm: string | null) => void;
  wipeData: (type: 'vouchers' | 'masters' | 'all' | 'cache') => void;
}

export const DangerZoneView: React.FC<DangerZoneViewProps> = ({
  t,
  expandedSection,
  setExpandedSection,
  showConfirm,
  setShowConfirm,
  wipeData,
}) => {
  const isOpen = expandedSection === 'danger';

  return (
    <div className="border border-rose-100 dark:border-rose-950/60 rounded-2xl overflow-hidden bg-rose-50/10 dark:bg-rose-955/5 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'danger')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-rose-900 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-450 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-rose-800 dark:text-rose-400">{t("System Destruction & Maintenance")}</h4>
            <p className="text-[10px] font-normal text-rose-700/70 dark:text-rose-400/60 mt-0.5">{t("Irreversible data purge algorithms and total system resets")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-rose-500/10 text-rose-600 border border-rose-500/25 dark:bg-rose-950/45 dark:text-rose-450 shrink-0 font-extrabold">{t("REAL WORKING/DESTRUCTIVE")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-rose-400/80" /> : <ChevronDown className="w-4 h-4 text-rose-400/80" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-rose-100 dark:border-rose-950/20 space-y-4 animate-in fade-in duration-155 bg-white dark:bg-gray-950">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Clear Cache */}
            <div className="border border-gray-100 dark:border-gray-900 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/45 flex flex-col justify-between">
              <div className="mb-3">
                <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("Flush Cached Session Drafts")}</h5>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {t("Clears temporary draft vouchers and persistent configurations without touching master ledgers or transactions.")}
                </p>
              </div>
              {showConfirm === 'cache' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => wipeData('cache')} 
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition"
                  >
                    {t("Confirm Flush")}
                  </button>
                  <button 
                    onClick={() => setShowConfirm(null)} 
                    className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-semibold py-1.5 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t("Abort")}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConfirm('cache')} 
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 dark:bg-gray-900 dark:hover:bg-rose-950/20 border border-gray-200 dark:border-gray-800 text-[10px] font-bold py-1.5 rounded-xl text-rose-600 hover:border-rose-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t("Wipe Cache")}
                </button>
              )}
            </div>

            {/* Box 2: Clear Vouchers */}
            <div className="border border-gray-100 dark:border-gray-900 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/45 flex flex-col justify-between">
              <div className="mb-3">
                <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("Purge Transactional Ledger Vouchers")}</h5>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {t("Instantly drops all Sales, Purchases, Receipts, Payments, and Journal entries. It does not delete parties or master items.")}
                </p>
              </div>
              {showConfirm === 'vouchers' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => wipeData('vouchers')} 
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition"
                  >
                    {t("Confirm Wipe")}
                  </button>
                  <button 
                    onClick={() => setShowConfirm(null)} 
                    className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-semibold py-1.5 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t("Abort")}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConfirm('vouchers')} 
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 dark:bg-gray-900 dark:hover:bg-rose-950/20 border border-gray-200 dark:border-gray-800 text-[10px] font-bold py-1.5 rounded-xl text-rose-600 hover:border-rose-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t("Wipe Vouchers")}
                </button>
              )}
            </div>

            {/* Box 3: Clear Masters */}
            <div className="border border-gray-100 dark:border-gray-900 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/45 flex flex-col justify-between">
              <div className="mb-3">
                <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("Unbind Party & Inventory Masters")}</h5>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {t("Removes all configurations of item cataloging, master stock catalogs, account definitions, and registered client contacts.")}
                </p>
              </div>
              {showConfirm === 'masters' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => wipeData('masters')} 
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition"
                  >
                    {t("Confirm Wipe")}
                  </button>
                  <button 
                    onClick={() => setShowConfirm(null)} 
                    className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-semibold py-1.5 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t("Abort")}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConfirm('masters')} 
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 dark:bg-gray-900 dark:hover:bg-rose-950/20 border border-gray-250 dark:border-gray-800 text-[10px] font-bold py-1.5 rounded-xl text-rose-600 hover:border-rose-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t("Wipe Masters")}
                </button>
              )}
            </div>

            {/* Box 4: Factory Reset */}
            <div className="border border-rose-100 dark:border-rose-900/50 rounded-xl p-4 bg-rose-50/30 dark:bg-rose-950/5 flex flex-col justify-between">
              <div className="mb-3">
                <h5 className="text-[11px] font-bold text-rose-700 dark:text-rose-450 uppercase tracking-wider font-extrabold text-orange-650">{t("Complete Factory Reset")}</h5>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {t("Destroys everything. Resets configurations, account tokens, files, and clears absolute index registers safely.")}
                </p>
              </div>
              {showConfirm === 'all' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => wipeData('all')} 
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition"
                  >
                    {t("Confirm Reset")}
                  </button>
                  <button 
                    onClick={() => setShowConfirm(null)} 
                    className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-semibold py-1.5 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t("Abort")}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConfirm('all')} 
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-xl shadow-xs transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> {t("Dry Run Reset")}
                </button>
              )}
            </div>

          </div>
          
          <p className="text-[10px] text-gray-400 italic text-center leading-normal">
            * Warning: These actions immediately bypass standard verification backups and update browser tables.
          </p>
        </div>
      )}
    </div>
  );
};
