import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { Layout, Settings, FileText, Database, ArrowLeftRight, Cpu, Download, Save, Maximize } from "lucide-react";
import { LayoutIcon, UndoIcon, ClearAllIcon, UploadIcon, CheckCircleIcon, SearchIcon } from "../../icons/IconComponents";
import { SettingsFilterTab } from "./UIFilterSettings/tab/SettingsFilterTab";
import { ReportsFilterTab } from "./UIFilterSettings/tab/ReportsFilterTab";
import { MastersFilterTab } from "./UIFilterSettings/tab/MastersFilterTab";
import { TransactionsFilterTab } from "./UIFilterSettings/tab/TransactionsFilterTab";
import { OperationsFilterTab } from "./UIFilterSettings/tab/OperationsFilterTab";
import { UIFilterType } from "./UIFilterSettings/types";
import { HorizontalScrollArea } from "../../shared/HorizontalScrollArea";

export const UIFilterSettings: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab ] = useState<UIFilterType>("masters");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [targetFormat, setTargetFormat] = useState<"json" | "csv">("json");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const checkOverride = () => {
      const override = localStorage.getItem('bharat_book_uifilter_subtab_override');
      if (override) {
        if (["masters", "transactions", "operations", "reports", "settings"].includes(override)) {
          setActiveTab(override as UIFilterType);
        }
        localStorage.removeItem('bharat_book_uifilter_subtab_override');
      }
    };
    checkOverride();
    window.addEventListener('bharat_book_uifilter_subtab_trigger', checkOverride);
    return () => window.removeEventListener('bharat_book_uifilter_subtab_trigger', checkOverride);
  }, []);

  const tabsConfig = [
    { id: "masters", label: "Masters", icon: Database },
    { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
    { id: "operations", label: "Operations", icon: Cpu },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings }
  ] as const;

  const handleSearchChange = (val: string) => setSearchTerm(val);
  const handleClear = () => setSearchTerm("");

  const handleResetToDefault = () => {
    // Dispatch an event instructing all children to "Show All"
    window.dispatchEvent(new Event('bharat_book_uifilter_reset'));
  };

  const handleClearAll = () => {
     // Dispatch an event instructing all children to "Hide All (Except Essential)"
     window.dispatchEvent(new Event('bharat_book_uifilter_hide_all'));
  };

  const handleExportBackup = () => {
    // Generate a backup by querying all filter storages
    const data = {
      masters: JSON.parse(localStorage.getItem("bharat_book_hidden_masters_tabs") || "[]"),
      transactions: JSON.parse(localStorage.getItem("bharat_book_hidden_transactions_tabs") || "[]"),
      operations: JSON.parse(localStorage.getItem("bharat_book_hidden_operations_tabs") || "[]"),
      reports: JSON.parse(localStorage.getItem("bharat_book_hidden_report_tabs") || "[]"),
      settings: JSON.parse(localStorage.getItem("bharat_book_hidden_settings_tabs") || "[]"),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bharat_book_ui_filters_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleCombinedImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonObj = JSON.parse(e.target?.result as string);
        if (jsonObj.masters) localStorage.setItem("bharat_book_hidden_masters_tabs", JSON.stringify(jsonObj.masters));
        if (jsonObj.transactions) localStorage.setItem("bharat_book_hidden_transactions_tabs", JSON.stringify(jsonObj.transactions));
        if (jsonObj.operations) localStorage.setItem("bharat_book_hidden_operations_tabs", JSON.stringify(jsonObj.operations));
        if (jsonObj.reports) localStorage.setItem("bharat_book_hidden_report_tabs", JSON.stringify(jsonObj.reports));
        if (jsonObj.settings) localStorage.setItem("bharat_book_hidden_settings_tabs", JSON.stringify(jsonObj.settings));
        
        // Dispatch to reload all tabs
        window.dispatchEvent(new Event('bharat_book_uifilter_reload'));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (error) {
        console.error("Error parsing filter Settings JSON", error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSave = () => {
    // Actually all saves are done inline inside child tabs immediately, but we can animate a saved status here
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Settings Page Header - Desktop/Tablet: inline single row, mobile: stacked layout */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-905 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Title & Icon container */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-[0.6rem] bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-100/50 dark:border-amber-500/20">
            <Layout className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("UI Filter")}</h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5 truncate whitespace-nowrap" title={t("Show or hide sub-pages to design custom workspace navigation structures.")}>
              {t("Show or hide sub-pages to design custom workspace navigation structures.")}
            </p>
          </div>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="w-full sm:w-auto overflow-x-auto custom-scrollbar flex-nowrap pb-1 sm:pb-0">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center gap-1 w-max min-w-max ml-auto sm:ml-0 md:ml-auto">
            {tabsConfig.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
                      isActive
                        ? "bg-white text-blue-600 shadow-xs dark:bg-gray-700 dark:text-blue-400"
                        : "text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    <IconComp className="w-3 h-3" />
                    {t(tab.label)}
                  </button>
                );
              })}
            </div>
        </div>
      </div>

      {/* Action Toolbar Header */}
      <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <SearchIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Search filters...")} 
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-3 h-3 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${(isSearchFocused || searchTerm) ? "hidden sm:flex" : "flex"}`}>
           <div className="relative inline-flex items-center shrink-0">
             <select
               value={targetFormat}
               onChange={(e) => setTargetFormat(e.target.value as "json" | "csv")}
               className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
             >
               <option value="json" className="bg-white dark:bg-gray-800">{t("JSON")}</option>
               <option value="csv" className="bg-white dark:bg-gray-800">{t("CSV")}</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
               <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                 <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
               </svg>
             </div>
           </div>
           <button
             onClick={() => fileInputRef.current?.click()}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
           >
             <UploadIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Import")}</span>
           </button>
           <button
             onClick={handleExportBackup}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
           >
             <Download className="w-3.5 h-3.5 shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Export")}</span>
           </button>
           <button
             onClick={handleClearAll}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 hidden lg:flex items-center justify-center gap-1.5 shrink-0"
             title={t("Hide All Optional Fields")}
           >
             <ClearAllIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Clear")}</span>
           </button>
           <button
             onClick={handleResetToDefault}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
             title={t("Restore Default Visibility")}
           >
             <UndoIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Reset")}</span>
           </button>
           <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>
           <button
             onClick={handleSave}
             className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
           >
             {isSaved ? <CheckCircleIcon className="!text-[14px] flex items-center justify-center shrink-0 animate-bounce" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
             <span className="hidden lg:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
           </button>
        </div>
      </div>
      
      <input
        type="file"
        accept={targetFormat === "json" ? ".json" : ".csv"}
        ref={fileInputRef}
        onChange={handleCombinedImport}
        className="hidden"
      />

      {/* Main Tab View container */}
      <div className="bg-white dark:bg-gray-905 rounded-xl border border-gray-200/60 dark:border-gray-800/80 p-4 sm:p-5 min-h-[400px]">
        {activeTab === "masters" && <MastersFilterTab searchTerm={searchTerm} />}
        {activeTab === "transactions" && <TransactionsFilterTab searchTerm={searchTerm} />}
        {activeTab === "operations" && <OperationsFilterTab searchTerm={searchTerm} />}
        {activeTab === "reports" && <ReportsFilterTab searchTerm={searchTerm} />}
        {activeTab === "settings" && <SettingsFilterTab searchTerm={searchTerm} />}
      </div>
    </div>
  );
};

