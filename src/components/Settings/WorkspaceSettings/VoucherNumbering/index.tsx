import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { 
  Calculator, FileCheck, Layers, Save, Upload, Download, RotateCcw, CheckCircle2, Search, Trash2, ChevronDown
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

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [exportFormat, setExportFormat] = useState<"JSON" | "CSV">("JSON");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      {/* Compact Header Row matching premium layout */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden justify-between animate-in fade-in">
        <div className="flex items-center gap-3 shrink-0 sm:max-w-[30%]">
          <div className="w-10 h-10 rounded-[0.6rem] bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-100/50 dark:border-purple-500/20">
            <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("Voucher Numbering")}</h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate whitespace-nowrap">{t("Configure series, starting codes and prefixes")}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 flex justify-end">
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar w-auto  border border-gray-200/40 dark:border-gray-700/40 shrink-0 justify-end">
             <button
               onClick={() => setActiveTab('accounting')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                 activeTab === 'accounting' ? 'bg-white dark:bg-gray-75 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/35'
               }`}
             >
               <FileCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'accounting' ? 'text-purple-600 dark:text-purple-400' : ''}`} /> {t("Accounting")}
             </button>
             <button
               onClick={() => setActiveTab('inventory')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                 activeTab === 'inventory' ? 'bg-white dark:bg-gray-75 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/35'
               }`}
             >
               <Layers className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'inventory' ? 'text-purple-600 dark:text-purple-400' : ''}`} /> {t("Inventory")}
             </button>
          </div>
        </div>
      </div>

      {/* File import input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportSettings}
        accept={exportFormat === "JSON" ? ".json" : ".csv"}
        className="hidden"
      />

      {/* Search and Action Toolbar Row */}
      <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Search voucher types...")} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-900/40 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              title={t("Clear search")}
            >
              <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Action Controls Toolbar - hidden on mobile during search to maximize typing width */}
        <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${(isSearchFocused || searchQuery) ? "hidden sm:flex" : "flex"}`}>
          {/* Format Selector Dropdown */}
          <div className="relative inline-flex items-center shrink-0">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as "JSON" | "CSV")}
              className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-purple-600 rounded-lg border border-gray-150 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
              title={t("Simple Input and Output")}
            >
              <option value="JSON" className="bg-white dark:bg-gray-800">JSON</option>
              <option value="CSV" className="bg-white dark:bg-gray-800">CSV</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Import Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-purple-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Import Settings")}
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Import")}</span>
          </button>

          {/* Export Button - Dynamically dependent on picker but label remains static as Export */}
          <button
            onClick={() => handleExport(exportFormat)}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-655 dark:text-gray-300 hover:text-purple-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Export")}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Export")}</span>
          </button>

          {/* Clear Button (HIDDEN on mobile & tablet) */}
          <button
            onClick={() => setSearchQuery("")}
            className="hidden lg:flex px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-655 dark:text-gray-300 hover:text-amber-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 items-center justify-center gap-1.5 shrink-0"
            title={t("Clear search query")}
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-none">{t("Clear")}</span>
          </button>

          {/* Reset Defaults Button */}
          <button
            onClick={resetAllSettings}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-655 dark:text-gray-300 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Reset Settings")}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Reset")}</span>
          </button>

          {/* Save Configuration Button */}
          <button
            onClick={handleSave}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-700 rounded-lg transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Save Configuration")}
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 animate-bounce" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
            <span className="hidden md:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
          </button>
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
              searchTerm={searchQuery}
            />
          ) : (
            <InventoryVoucherTab 
              settings={settings}
              collapsedStates={collapsedStates}
              handleSettingChange={handleSettingChange}
              toggleCollapse={toggleCollapse}
              searchTerm={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};
