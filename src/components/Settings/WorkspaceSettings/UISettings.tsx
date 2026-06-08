import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { LayoutIcon, UndoIcon, ClearAllIcon, UploadIcon, CheckCircleIcon, SearchIcon, AdminIcon } from "../../icons/IconComponents";
import { Layout, Paintbrush, DollarSign, Globe, Layers, Sliders, Maximize, Download, Save } from "lucide-react";
import { LayoutDensityTab } from "./UISettingsTabs/LayoutDensityTab";
import { ColorThemeTab } from "./UISettingsTabs/ColorThemeTab";
import { DataDisplayTab } from "./UISettingsTabs/DataDisplayTab";
import { LocalizationTab } from "./UISettingsTabs/LocalizationTab";
import { AdvancedOptionsTab } from "./UISettingsTabs/AdvancedOptionsTab";
import { MaxCustomizationTab } from "./UISettingsTabs/MaxCustomizationTab";

export interface UISettingsProps {
  defaultSubtab?: string;
}

const getInitialSubtab = (tabProp?: string) => {
  if (!tabProp) return "layout";
  if (tabProp === "ui") return "layout";
  const sub = tabProp.replace("ui_", "");
  if (["layout", "color", "data", "localization", "more", "maximum"].includes(sub)) {
    return sub as any;
  }
  return "layout";
};

export const UISettings: React.FC<UISettingsProps> = ({ defaultSubtab }) => {
  const { t } = useLanguage();
  const [activeSubtab, setActiveSubtab] = useState<"layout" | "color" | "data" | "localization" | "more" | "maximum">(() =>
    getInitialSubtab(defaultSubtab)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [targetFormat, setTargetFormat] = useState<"json" | "csv">("json");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if (defaultSubtab) {
      setActiveSubtab(getInitialSubtab(defaultSubtab));
    }
  }, [defaultSubtab]);

  const subtabs = [
    { id: "layout" as const, label: t("Layout & Density"), icon: Layout },
    { id: "color" as const, label: t("Colors & Theme"), icon: Paintbrush },
    { id: "data" as const, label: t("Data Formats"), icon: DollarSign },
    { id: "localization" as const, label: t("Localization"), icon: Globe },
    { id: "more" as const, label: t("More Options"), icon: Sliders },
    { id: "maximum" as const, label: t("Maximum Design"), icon: Maximize },
  ];

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  const handleClear = () => {};
  const handleResetToDefault = () => {};
  const handleExportBackup = () => {};
  const handleCombinedImport = () => {};

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const isSearching = searchTerm.trim() !== "";
  
  // Dummy match counts since we don't have exact search fields configured yet
  // Bypass hasAnyMatch blocking for now so children handle their own visibility.
  const hasAnyMatch = true;

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
          <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
            <Layout className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("UI Settings")}</h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("Customize layouts, themes, and formats")}>
              {t("Customize layouts, themes, and formats")}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1 flex items-center">
          <div className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start shrink-0">
             {subtabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubtab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                      activeSubtab === tab.id 
                        ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeSubtab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
             })}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <SearchIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Search ui settings...")} 
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
              title={t("Clear search")}
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
               title={t("Simple Input and Output")}
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
             title={t("Import (JSON/CSV)")}
           >
             <UploadIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Import")}</span>
           </button>
           <button
             onClick={handleExportBackup}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
             title={t("Export")}
           >
             <Download className="w-3.5 h-3.5 shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Export")}</span>
           </button>
           <button
             onClick={handleClear}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 hidden lg:flex items-center justify-center gap-1.5 shrink-0"
             title={t("Clear All Fields")}
           >
             <ClearAllIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Clear")}</span>
           </button>
           <button
             onClick={handleResetToDefault}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
             title={t("Reset to Defaults")}
           >
             <UndoIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Reset")}</span>
           </button>
           <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>
           <button
             onClick={handleSave}
             className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
             title={isSaved ? t("Saved Configuration") : t("Save Configuration")}
           >
             {isSaved ? <CheckCircleIcon className="!text-[14px] flex items-center justify-center shrink-0 animate-bounce" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
             <span className="hidden lg:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
        <input
          type="file"
          accept={targetFormat === "json" ? ".json" : ".csv"}
          ref={fileInputRef}
          onChange={handleCombinedImport}
          className="hidden"
          id="uiHiddenFileInput"
        />

        <div className="space-y-0 text-left min-h-[400px]">
          {isSearching && !hasAnyMatch ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 border-dashed border-gray-200 dark:border-gray-800 p-6 h-full min-h-[300px]">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100/50 dark:border-indigo-500/20">
                <SearchIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t(`No matches in UI Settings`)}</h4>
              <button 
                onClick={() => handleSearchChange("")}
                className="mt-5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
              >
                {t("Clear Search")}
              </button>
            </div>
          ) : (
            <div className="p-4 sm:p-6 lg:p-8">
              {activeSubtab === "layout" && <LayoutDensityTab searchTerm={searchTerm} />}
              {activeSubtab === "color" && <ColorThemeTab searchTerm={searchTerm} />}
              {activeSubtab === "data" && <DataDisplayTab searchTerm={searchTerm} />}
              {activeSubtab === "localization" && <LocalizationTab searchTerm={searchTerm} />}
              {activeSubtab === "more" && <AdvancedOptionsTab searchTerm={searchTerm} />}
              {activeSubtab === "maximum" && <MaxCustomizationTab searchTerm={searchTerm} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

