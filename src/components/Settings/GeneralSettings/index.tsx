
import React, { useState } from 'react';
import { AppearanceTab } from './tab/AppearanceTab';
import { RegionalTab } from './tab/RegionalTab';
import { SystemCoreTab } from './tab/SystemCoreTab';
import { useLanguage } from '../../../context/LanguageContext';
import { InfoIcon, CheckCircleIcon, UploadIcon, UndoIcon, ClearAllIcon, LayoutIcon, MapIcon, SettingsIcon, SaveIcon, SearchIcon } from '../../icons/IconComponents';

interface GeneralSettingsProps {
    theme: string;
    setTheme: (val: string) => void;
    language: string;
    setLanguage: (val: string) => void;
    dateFormat: string;
    setDateFormat: (val: string) => void;
    timezone: string;
    setTimezone: (val: string) => void;
    autoLock: string;
    setAutoLock: (val: string) => void;
    density: string;
    setDensity: (val: string) => void;
    animations: string;
    setAnimations: (val: string) => void;
    soundEffects: string;
    setSoundEffects: (val: string) => void;
    keyboardShortcuts: string;
    setKeyboardShortcuts: (val: string) => void;
    weekStartsOn: string;
    setWeekStartsOn: (val: string) => void;
    paginationSize: string;
    setPaginationSize: (val: string) => void;
    showSystemInfo: string;
    setShowSystemInfo: (val: string) => void;
    displayId: string;
    setDisplayId: (val: string) => void;
    appMode: string;
    setAppMode: (val: string) => void;
    handleSave: () => void;
    handleLoad: () => void;
    handleDeleteAll: () => void;
    handleReset: () => void;
    handleClear: () => void;
    isSaved: boolean;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    theme, setTheme,
    language, setLanguage,
    dateFormat, setDateFormat,
    timezone, setTimezone,
    autoLock, setAutoLock,
    density, setDensity,
    animations, setAnimations,
    soundEffects, setSoundEffects,
    keyboardShortcuts, setKeyboardShortcuts,
    weekStartsOn, setWeekStartsOn,
    paginationSize, setPaginationSize,
    showSystemInfo, setShowSystemInfo,
    displayId, setDisplayId,
    appMode, setAppMode,
    handleSave, handleLoad, handleDeleteAll, handleReset, handleClear, isSaved
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"appearance" | "regional" | "system">("appearance");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return;

    const checkFieldMatch = (labelKey: string, extraTerms: string[]) => {
      const q = query.toLowerCase().trim();
      const labelText = t(labelKey).toLowerCase();
      if (labelText.includes(q)) return true;
      return extraTerms.some(term => {
        const termTranslated = t(term).toLowerCase();
        return term.toLowerCase().includes(q) || termTranslated.includes(q);
      });
    };

    const appMatch = 
      checkFieldMatch("Theme Mode", ["theme", "mode", "color", "dark", "light", "system", "default", "थीम", "लाइट", "डार्क"]) ||
      checkFieldMatch("Display Density", ["density", "compact", "standard", "comfortable", "spacing", "table", "घनत्व", "टेबल", "स्पेसिंग", "Controls spacing across tables"]) ||
      checkFieldMatch("UI Animations", ["animation", "ui", "motion", "smooth", "fast", "एनीमेशन", "मोशन", "Enabled (Smooth)", "Disabled (Fast)"]) ||
      checkFieldMatch("Sound Effects", ["sound", "effects", "audio", "mute", "enabled", "disabled", "आवाज", "ध्वनि", "ऑडियो"]);

    const regMatch = 
      checkFieldMatch("Display Language", ["language", "display", "en", "hi", "hinglish", "English", "Hindi", "Hinglish", "भाषा", "हिंदी", "अंग्रेजी", "हिंग्लिश"]) ||
      checkFieldMatch("Date Format", ["date", "format", "dd", "mm", "yyyy", "दिनांक", "तारीख"]) ||
      checkFieldMatch("Default Timezone", ["timezone", "default", "asia", "kolkata", "utc", "gmt", "time", "समय", "टाइमजोन", "Asia/Kolkata (IST)", "UTC / GMT"]) ||
      checkFieldMatch("Start Week On", ["week", "starts", "on", "sunday", "monday", "सप्ताह", "रविवार", "सोमवार", "Sunday", "Monday"]);

    const sysMatch = 
      checkFieldMatch("Display ID Prefix", ["id", "prefix", "display", "invoice", "numbering", "आईडी", "प्रिक्स", "BBE-JV-001"]) ||
      checkFieldMatch("Application Mode", ["app", "mode", "application", "demo", "sandbox", "production", "live", "डेमो", "प्रोडक्शन", "DEMO (Sandboxed)", "Production (Live)"]) ||
      checkFieldMatch("System Info View", ["system", "info", "view", "details", "show", "hide", "सिستم", "जानकारी", "Show Details", "Hide Details"]) ||
      checkFieldMatch("Auto-Lock Timeout", ["auto", "lock", "timeout", "minutes", "hour", "never", "सुरक्षा", "लॉक", "टाइमआउट", "5 Minutes", "15 Minutes", "30 Minutes", "1 Hour", "Never"]) ||
      checkFieldMatch("Pagination Size", ["pagination", "size", "items", "page", "पेजिनेशन", "साइज", "10 items", "25 items", "50 items", "100 items"]) ||
      checkFieldMatch("Keyboard Shortcuts", ["keyboard", "shortcuts", "hotkeys", "कीबोर्ड", "शॉर्टकट", "Enabled", "Disabled"]);

    if (activeTab === "appearance" && !appMatch) {
      if (regMatch) setActiveTab("regional");
      else if (sysMatch) setActiveTab("system");
    } else if (activeTab === "regional" && !regMatch) {
      if (appMatch) setActiveTab("appearance");
      else if (sysMatch) setActiveTab("system");
    } else if (activeTab === "system" && !sysMatch) {
      if (appMatch) setActiveTab("appearance");
      else if (regMatch) setActiveTab("regional");
    }
  };

  const isFieldVisible = (labelKey: string, extraTerms: string[] = []) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const labelText = t(labelKey).toLowerCase();
    if (labelText.includes(query)) return true;
    return extraTerms.some(term => {
      const termTranslated = t(term).toLowerCase();
      return term.toLowerCase().includes(query) || termTranslated.includes(query);
    });
  };

  const showTheme = isFieldVisible("Theme Mode", ["theme", "mode", "color", "dark", "light", "system", "default", "थीम", "लाइट", "डार्क"]);
  const showDensity = isFieldVisible("Display Density", ["density", "compact", "standard", "comfortable", "spacing", "table", "घनत्व", "टेबल", "स्पेसिंग", "Controls spacing across tables"]);
  const showAnimations = isFieldVisible("UI Animations", ["animation", "ui", "motion", "smooth", "fast", "एनीमेशन", "मोशन", "Enabled (Smooth)", "Disabled (Fast)"]);
  const showSoundEffects = isFieldVisible("Sound Effects", ["sound", "effects", "audio", "mute", "enabled", "disabled", "आवाज", "ध्वनि", "ऑडियो"]);

  const showLanguage = isFieldVisible("Display Language", ["language", "display", "en", "hi", "hinglish", "English", "Hindi", "Hinglish", "भाषा", "हिंदी", "अंग्रेजी", "हिंग्लिश"]);
  const showDateFormat = isFieldVisible("Date Format", ["date", "format", "dd", "mm", "yyyy", "दिनांक", "तारीख"]);
  const showTimezone = isFieldVisible("Default Timezone", ["timezone", "default", "asia", "kolkata", "utc", "gmt", "time", "समय", "टाइमजोन", "Asia/Kolkata (IST)", "UTC / GMT"]);
  const showWeekStartsOn = isFieldVisible("Start Week On", ["week", "starts", "on", "sunday", "monday", "सप्ताह", "रविवार", "सोमवार", "Sunday", "Monday"]);

  const showDisplayId = isFieldVisible("Display ID Prefix", ["id", "prefix", "display", "invoice", "numbering", "आईडी", "प्रिक्स", "BBE-JV-001"]);
  const showAppMode = isFieldVisible("Application Mode", ["app", "mode", "application", "demo", "sandbox", "production", "live", "डेमो", "प्रोडक्शन", "DEMO (Sandboxed)", "Production (Live)"]);
  const showSystemInfoField = isFieldVisible("System Info View", ["system", "info", "view", "details", "show", "hide", "सिستم", "जानकारी", "Show Details", "Hide Details"]);
  const showAutoLock = isFieldVisible("Auto-Lock Timeout", ["auto", "lock", "timeout", "minutes", "hour", "never", "सुरक्षा", "लॉक", "टाइमआउट", "5 Minutes", "15 Minutes", "30 Minutes", "1 Hour", "Never"]);
  const showPaginationSize = isFieldVisible("Pagination Size", ["pagination", "size", "items", "page", "पेजिनेशन", "साइज", "10 items", "25 items", "50 items", "100 items"]);
  const showKeyboardShortcuts = isFieldVisible("Keyboard Shortcuts", ["keyboard", "shortcuts", "hotkeys", "कीबोर्ड", "शॉर्टकट", "Enabled", "Disabled"]);

  const isSearching = searchQuery.trim() !== "";
  const hasAppearanceMatches = showTheme || showDensity || showAnimations || showSoundEffects;
  const hasRegionalMatches = showLanguage || showDateFormat || showTimezone || showWeekStartsOn;
  const hasSystemMatches = showDisplayId || showAppMode || showSystemInfoField || showAutoLock || showPaginationSize || showKeyboardShortcuts;
  const hasAnyMatch = hasAppearanceMatches || hasRegionalMatches || hasSystemMatches;

  const appearanceMatchCount = isSearching ? ((showTheme ? 1 : 0) + (showDensity ? 1 : 0) + (showAnimations ? 1 : 0) + (showSoundEffects ? 1 : 0)) : 0;
  const regionalMatchCount = isSearching ? ((showLanguage ? 1 : 0) + (showDateFormat ? 1 : 0) + (showTimezone ? 1 : 0) + (showWeekStartsOn ? 1 : 0)) : 0;
  const systemMatchCount = isSearching ? ((showDisplayId ? 1 : 0) + (showAppMode ? 1 : 0) + (showSystemInfoField ? 1 : 0) + (showAutoLock ? 1 : 0) + (showPaginationSize ? 1 : 0) + (showKeyboardShortcuts ? 1 : 0)) : 0;

  const tabs = [
    { id: "appearance" as const, label: t("Appearance"), icon: LayoutIcon },
    { id: "regional" as const, label: t("Regional"), icon: MapIcon },
    { id: "system" as const, label: t("System Core"), icon: SettingsIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 max-w-full">
          <div className="w-10 h-10 rounded-[0.6rem] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-500/20">
            <InfoIcon className="!text-[20px] flex items-center justify-center text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("General Settings")}</h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("Manage structural preferences and system behaviors.")}>
              {t("Manage structural preferences and system behaviors.")}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto min-w-0 flex-1 flex justify-center sm:justify-end items-center gap-3">
          <div className="w-full sm:w-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full snap-x border border-gray-200/40 dark:border-gray-700/40 justify-start shrink-0">
             {tabs.map((tab) => {
                const Icon = tab.icon;
                const matchCount = tab.id === 'appearance' ? appearanceMatchCount : tab.id === 'regional' ? regionalMatchCount : systemMatchCount;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                      activeTab === tab.id 
                        ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm scale-[1.01]' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <Icon className={`!text-[15px] flex items-center justify-center transition-colors ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className="leading-none">{tab.label}</span>
                    {isSearching && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                        activeTab === tab.id 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {matchCount}
                      </span>
                    )}
                  </button>
                );
             })}
          </div>
        </div>
      </div>
 
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in">
        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Search general settings...")} 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              title={t("Clear search")}
            >
              <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-row flex-nowrap items-center justify-start gap-1 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0 w-full sm:w-auto overflow-x-auto custom-scrollbar">
             <button
               onClick={handleLoad}
               className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
               title={t("Load")}
             >
               <UploadIcon className="!text-[16px] flex items-center justify-center shrink-0" />
               <span className="hidden sm:inline leading-none">{t("Load")}</span>
             </button>
             <button
               onClick={handleClear}
               className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
               title={t("Clear")}
             >
               <ClearAllIcon className="!text-[16px] flex items-center justify-center shrink-0" />
               <span className="hidden sm:inline leading-none">{t("Clear")}</span>
             </button>
             <button
               onClick={handleReset}
               className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
               title={t("Reset")}
             >
               <UndoIcon className="!text-[16px] flex items-center justify-center shrink-0" />
               <span className="hidden sm:inline leading-none">{t("Reset")}</span>
             </button>
             <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>
             <button
               onClick={handleSave}
               className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
               title={isSaved ? t("Saved") : t("Save")}
             >
               {isSaved ? <CheckCircleIcon className="!text-[16px] flex items-center justify-center shrink-0 animate-bounce" /> : <SaveIcon className="!text-[16px] flex items-center justify-center shrink-0" />}
               <span className="hidden sm:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
             </button>
           </div>
      </div>


         <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200/60 dark:border-gray-800 shadow-sm relative overflow-hidden animate-in fade-in duration-300 min-h-[400px]">
        {isSearching ? (
          hasAnyMatch ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {activeTab === "appearance" && (
                hasAppearanceMatches ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-500/20">
                        <LayoutIcon className="!text-[18px] flex items-center justify-center" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Appearance & UI")}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Customize User Interface")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <AppearanceTab 
                        theme={theme} setTheme={setTheme}
                        density={density} setDensity={setDensity}
                        animations={animations} setAnimations={setAnimations}
                        soundEffects={soundEffects} setSoundEffects={setSoundEffects}
                        showTheme={showTheme} showDensity={showDensity}
                        showAnimations={showAnimations} showSoundEffects={showSoundEffects}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 border border-blue-100/50 dark:border-blue-500/20">
                      <LayoutIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No matches in Appearance")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("However, matches are found in other categories. Select a category below to see its matches:")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {hasRegionalMatches && (
                        <button onClick={() => setActiveTab("regional")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <MapIcon className="w-3.5 h-3.5" />
                          <span>{t("Regional")} ({regionalMatchCount})</span>
                        </button>
                      )}
                      {hasSystemMatches && (
                        <button onClick={() => setActiveTab("system")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <SettingsIcon className="w-3.5 h-3.5" />
                          <span>{t("System Core")} ({systemMatchCount})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {activeTab === "regional" && (
                hasRegionalMatches ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-500/20">
                        <MapIcon className="!text-[18px] flex items-center justify-center" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Regional Formats")}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Localization Options")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <RegionalTab 
                        language={language} setLanguage={setLanguage}
                        dateFormat={dateFormat} setDateFormat={setDateFormat}
                        timezone={timezone} setTimezone={setTimezone}
                        weekStartsOn={weekStartsOn} setWeekStartsOn={setWeekStartsOn}
                        showLanguage={showLanguage} showDateFormat={showDateFormat}
                        showTimezone={showTimezone} showWeekStartsOn={showWeekStartsOn}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-100/50 dark:border-emerald-500/20">
                      <MapIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No matches in Regional")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("However, matches are found in other categories. Select a category below to see its matches:")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {hasAppearanceMatches && (
                        <button onClick={() => setActiveTab("appearance")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <LayoutIcon className="w-3.5 h-3.5" />
                          <span>{t("Appearance")} ({appearanceMatchCount})</span>
                        </button>
                      )}
                      {hasSystemMatches && (
                        <button onClick={() => setActiveTab("system")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <SettingsIcon className="w-3.5 h-3.5" />
                          <span>{t("System Core")} ({systemMatchCount})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {activeTab === "system" && (
                hasSystemMatches ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-500/20">
                        <SettingsIcon className="!text-[18px] flex items-center justify-center" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("System Core Features")}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Advanced Operations")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <SystemCoreTab 
                        displayId={displayId} setDisplayId={setDisplayId}
                        appMode={appMode} setAppMode={setAppMode}
                        showSystemInfo={showSystemInfo} setShowSystemInfo={setShowSystemInfo}
                        autoLock={autoLock} setAutoLock={setAutoLock}
                        paginationSize={paginationSize} setPaginationSize={setPaginationSize}
                        keyboardShortcuts={keyboardShortcuts} setKeyboardShortcuts={setKeyboardShortcuts}
                        showDisplayId={showDisplayId} showAppMode={showAppMode}
                        showSystemInfoField={showSystemInfoField} showAutoLock={showAutoLock}
                        showPaginationSize={showPaginationSize} showKeyboardShortcuts={showKeyboardShortcuts}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3 border border-orange-100/50 dark:border-orange-500/20">
                      <SettingsIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No matches in System Core")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("However, matches are found in other categories. Select a category below to see its matches:")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {hasAppearanceMatches && (
                        <button onClick={() => setActiveTab("appearance")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <LayoutIcon className="w-3.5 h-3.5" />
                          <span>{t("Appearance")} ({appearanceMatchCount})</span>
                        </button>
                      )}
                      {hasRegionalMatches && (
                        <button onClick={() => setActiveTab("regional")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <MapIcon className="w-3.5 h-3.5" />
                          <span>{t("Regional")} ({regionalMatchCount})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4 border border-gray-150 dark:border-gray-750">
                <SearchIcon className="w-5 h-5 animate-pulse text-gray-400" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No settings found")}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{t("No general settings matched your search query. Try typing another term.")}</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
              >
                {t("Clear Search")}
              </button>
            </div>
          )
        ) : (
          <>
            {activeTab === "appearance" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-500/20">
                    <LayoutIcon className="!text-[18px] flex items-center justify-center" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Appearance & UI")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Customize User Interface")}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AppearanceTab 
                    theme={theme} setTheme={setTheme}
                    density={density} setDensity={setDensity}
                    animations={animations} setAnimations={setAnimations}
                    soundEffects={soundEffects} setSoundEffects={setSoundEffects}
                    showTheme={true} showDensity={true}
                    showAnimations={true} showSoundEffects={true}
                  />
                </div>
              </div>
            )}

            {activeTab === "regional" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-500/20">
                    <MapIcon className="!text-[18px] flex items-center justify-center" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Regional Formats")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Localization Options")}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <RegionalTab 
                    language={language} setLanguage={setLanguage}
                    dateFormat={dateFormat} setDateFormat={setDateFormat}
                    timezone={timezone} setTimezone={setTimezone}
                    weekStartsOn={weekStartsOn} setWeekStartsOn={setWeekStartsOn}
                    showLanguage={true} showDateFormat={true}
                    showTimezone={true} showWeekStartsOn={true}
                  />
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-500/20">
                    <SettingsIcon className="!text-[18px] flex items-center justify-center" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("System Core Features")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Advanced Operations")}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <SystemCoreTab 
                    displayId={displayId} setDisplayId={setDisplayId}
                    appMode={appMode} setAppMode={setAppMode}
                    showSystemInfo={showSystemInfo} setShowSystemInfo={setShowSystemInfo}
                    autoLock={autoLock} setAutoLock={setAutoLock}
                    paginationSize={paginationSize} setPaginationSize={setPaginationSize}
                    keyboardShortcuts={keyboardShortcuts} setKeyboardShortcuts={setKeyboardShortcuts}
                    showDisplayId={true} showAppMode={true}
                    showSystemInfoField={true} showAutoLock={true}
                    showPaginationSize={true} showKeyboardShortcuts={true}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
