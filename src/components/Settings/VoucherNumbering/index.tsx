import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  Calculator, FileCheck, Layers, Save, Upload, Download, RotateCcw, CheckCircle2 
} from 'lucide-react';
import { useVoucherNumbering } from './hooks/useVoucherNumbering';
import { AccountingVoucherTab } from './views/AccountingVoucherTab';
import { InventoryVoucherTab } from './views/InventoryVoucherTab';

interface VoucherNumberingSettingsProps {
  defaultTab?: 'accounting' | 'inventory';
  onTabChange?: (tab: 'accounting' | 'inventory') => void;
}

export const VoucherNumberingSettings: React.FC<VoucherNumberingSettingsProps> = ({ 
  defaultTab, 
  onTabChange 
}) => {
  const { t } = useLanguage();
  const {
    settings,
    isSaved,
    collapsedStates,
    handleSave,
    resetAllSettings,
    handleExport,
    handleImportSettings,
    handleSettingChange,
    toggleCollapse
  } = useVoucherNumbering();

  const [internalTab, setInternalTab] = useState<'accounting' | 'inventory'>(() => {
    const override = localStorage.getItem('bharat_book_vouchernumbering_subtab_override');
    if (override === 'accounting' || override === 'inventory') {
      localStorage.removeItem('bharat_book_vouchernumbering_subtab_override');
      return override;
    }
    try {
      const saved = localStorage.getItem('bharat_book_navigation_defaults');
      if (saved) {
        const { page, subPage, subSubPage } = JSON.parse(saved);
        if (page === 'settings' && subPage === 'vouchernumbering' && (subSubPage === 'accounting' || subSubPage === 'inventory')) {
          return subSubPage as 'accounting' | 'inventory';
        }
      }
    } catch (e) {}
    return 'accounting';
  });

  const activeTab = defaultTab || internalTab;

  const setActiveTab = (tab: 'accounting' | 'inventory') => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
    
    // Also update navigation defaults so it persists in the workspace context
    try {
      const saved = localStorage.getItem('bharat_book_navigation_defaults');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.page === 'settings' && parsed.subPage === 'vouchernumbering') {
          parsed.subSubPage = tab;
          localStorage.setItem('bharat_book_navigation_defaults', JSON.stringify(parsed));
          window.dispatchEvent(new Event('bharat_book_navigation_sync'));
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handleOverride = () => {
      const override = localStorage.getItem('bharat_book_vouchernumbering_subtab_override');
      if (override === 'accounting' || override === 'inventory') {
        setInternalTab(override);
        localStorage.removeItem('bharat_book_vouchernumbering_subtab_override');
      }
    };
    window.addEventListener('bharat_book_vouchernumbering_subtab_trigger', handleOverride);
    return () => {
      window.removeEventListener('bharat_book_vouchernumbering_subtab_trigger', handleOverride);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row matching SupportSettings layout */}
      <div className="flex flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-[0.6rem] bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-100/50 dark:border-purple-500/20">
            <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{t("Voucher Numbering")}</h2>
            <p className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t("Configure series, starting codes and prefixes")}</p>
          </div>
        </div>

        <div className="min-w-0 mt-0 flex-1 flex items-center justify-between md:justify-end gap-3">
          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] bg-gray-50 dark:bg-gray-800/50 px-3 py-2 md:py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shrink-0">
            <span className="text-gray-500 dark:text-gray-400 font-semibold">{t("BHARAT BOOK")}</span>
            <div className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-700 pl-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200" />
              <span className="text-gray-700 dark:text-gray-300 font-bold tracking-tight">{t("SECURE MODE")}</span>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1 shadow-sm md:shadow-none overflow-x-auto custom-scrollbar w-full md:w-auto max-w-full snap-x">
             <button
               onClick={() => setActiveTab('accounting')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                 activeTab === 'accounting' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <FileCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'accounting' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> {t("Accounting")}
             </button>
             <button
               onClick={() => setActiveTab('inventory')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                 activeTab === 'inventory' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Layers className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'inventory' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> {t("Inventory")}
             </button>
          </div>
        </div>
      </div>

      {/* Main Settings Body Cards */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {activeTab === 'accounting' ? (
            <AccountingVoucherTab 
              settings={settings}
              collapsedStates={collapsedStates}
              handleSettingChange={handleSettingChange}
              toggleCollapse={toggleCollapse}
            />
          ) : (
            <InventoryVoucherTab 
              settings={settings}
              collapsedStates={collapsedStates}
              handleSettingChange={handleSettingChange}
              toggleCollapse={toggleCollapse}
            />
          )}
        </div>

        {/* Global Save/Export Actions Footer */}
        <div className="p-4 bg-gray-50/50 dark:bg-gray-950/40 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label 
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              title="Import Settings"
            >
              <Upload size={14} /> <span>{t("Import")}</span>
              <input type="file" accept=".json" className="hidden" onChange={handleImportSettings} />
            </label>
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-800"
              title="Export Settings"
            >
              <Download size={14} /> <span>{t("Export")}</span>
            </button>
            <button 
              onClick={resetAllSettings}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs font-bold transition-all active:scale-95"
              title="Reset defaults"
            >
              <RotateCcw size={14} /> <span>{t("Reset Defaults")}</span>
            </button>
          </div>

          <button 
            onClick={handleSave}
            className={`flex items-center justify-center px-5 py-2 rounded-lg text-xs font-black transition-all shadow-sm active:scale-95 ${
              isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/10' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/10'
            }`}
            title="Save settings"
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={14} className="mr-1.5 animate-bounce" />
                <span>{t("Changes Saved")}</span>
              </>
            ) : (
              <>
                <Save size={14} className="mr-1.5" />
                <span>{t("Save Changes")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
