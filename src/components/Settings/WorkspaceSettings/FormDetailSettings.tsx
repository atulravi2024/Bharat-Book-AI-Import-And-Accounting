import React, { useRef, useState } from "react";
import { useFormSettings, defaultSettings } from "../../../app/useFormSettings";
import { useLanguage } from "../../../context/LanguageContext";
import { 
  InfoIcon, CheckCircleIcon, UploadIcon, UndoIcon, ClearAllIcon, 
  LayoutIcon, MapIcon, SettingsIcon, SaveIcon, SearchIcon, DownloadIcon 
} from "../../icons/IconComponents";
import { Monitor, Tablet, Smartphone, Sliders } from "lucide-react";

import { DesktopTab } from "./FormDetailSettingsTabs/DesktopTab";
import { TabletTab } from "./FormDetailSettingsTabs/TabletTab";
import { MobileTab } from "./FormDetailSettingsTabs/MobileTab";
import { BehaviorsTab } from "./FormDetailSettingsTabs/BehaviorsTab";

export const FormDetailSettings: React.FC = () => {
  const { t } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"desktop" | "tablet" | "mobile" | "behaviors" >("desktop");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_form_settings");
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    return defaultSettings;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [targetFormat, setTargetFormat] = useState<"json" | "csv">("json");

  const dispatchUpdateEvent = () => {
    window.dispatchEvent(new Event("bharat_book_form_settings_updated"));
  };

  const handleSave = () => {
    localStorage.setItem("bharat_book_form_settings", JSON.stringify(settings));
    dispatchUpdateEvent();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.setItem("bharat_book_form_settings", JSON.stringify(defaultSettings));
    dispatchUpdateEvent();
  };

  const handleClear = () => {
    const cleared = Object.keys(defaultSettings).reduce((acc: any, key: string) => {
      acc[key] = (typeof (defaultSettings as any)[key] === 'boolean') ? false : "";
      return acc;
    }, {});
    setSettings(cleared);
    localStorage.setItem("bharat_book_form_settings", JSON.stringify(cleared));
    dispatchUpdateEvent();
  };

  const handleExportBackup = () => {
    if (targetFormat === "json") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "form_detail_settings_backup.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Setting,Value\n";
      Object.entries(settings).forEach(([key, value]) => {
        csvContent += `${key},"${String(value).replace(/"/g, '""')}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", encodedUri);
      downloadAnchor.setAttribute("download", "form_detail_settings_backup.csv");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  const handleCombinedImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        let parsed: any = {};
        if (file.name.endsWith(".csv")) {
          const lines = content.split("\n");
          lines.forEach((line) => {
            const [key, ...rest] = line.split(",");
            if (key && rest.length > 0) {
              let val = rest.join(",").trim();
              if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1);
              }
              parsed[key.trim()] = val;
            }
          });
        } else {
          parsed = JSON.parse(content);
        }

        const nextSettings = { ...settings };
        Object.keys(defaultSettings).forEach((key) => {
          if (parsed[key] !== undefined) {
            let val = parsed[key];
            if (val === "true") val = true;
            if (val === "false") val = false;
            nextSettings[key] = val;
          }
        });

        setSettings(nextSettings);
        localStorage.setItem("bharat_book_form_settings", JSON.stringify(nextSettings));
        dispatchUpdateEvent();
      } catch (err) {
        console.error("Failed to parse file", err);
        alert("Failed to parse file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    const checkFieldMatch = (labelKey: string, extraTerms: string[]) => {
      const q = query.toLowerCase().trim();
      const labelText = t(labelKey).toLowerCase();
      if (labelText.includes(q)) return true;
      return extraTerms.some(term => {
        const termTranslated = t(term).toLowerCase();
        return term.toLowerCase().includes(q) || termTranslated.includes(q);
      });
    };

    const dMatch = 
      checkFieldMatch("Primary Form Layout", ["layout", "grid", "stacked", "primary", "align", "संरेखित", "ग्रिड", "स्टैक्ड"]) ||
      checkFieldMatch("Enable Split Pane", ["split", "pane", "pane layout", "screen", "विभाजित", "स्प्लिट"]) ||
      checkFieldMatch("Input Field Size", ["size", "input", "compact", "comfortable", "spacious", "आकार", "चौड़ाई", "छोटा", "मध्यम", "बड़ा"]);

    const tMatch = 
      checkFieldMatch("Enable Touch Spacing", ["touch", "spacing", "padding", "comfortable", "टच", "स्पेसिंग", "पैडिंग"]) ||
      checkFieldMatch("Force Full Width", ["full", "width", "expand", "100%", "पूर्ण", "चौड़ाई"]) ||
      checkFieldMatch("Show Clear Buttons", ["clear", "buttons", "icon", "x", "साफ़", "बटन"]);

    const mMatch = 
      checkFieldMatch("Modal Behavior", ["modal", "behavior", "popup", "fullscreen", "पॉप-अप", "पूर्ण स्क्रीन"]) ||
      checkFieldMatch("Show Custom Field Borders", ["custom", "field", "borders", "सीमा", "बॉर्डर"]) ||
      checkFieldMatch("Sticky Action Bar", ["sticky", "action", "bar", "bottom", "सेंक", "चिपचिपा", "एक्शन"]);

    const bMatch = 
      checkFieldMatch("Real-time Validation", ["realtime", "validation", "errors", "type", "सत्यापन", "त्रुटि"]) ||
      checkFieldMatch("Auto-capitalize Names", ["capitalize", "names", "first", "letter", "अक्षर", "बड़ा"]) ||
      checkFieldMatch("Auto-save Drafts", ["save", "drafts", "progress", "automatic", "सहेजें", "मस्यौदा"]) ||
      checkFieldMatch("Use Floating Labels Global Override", ["floating", "labels", "override", "फ़्लोटिंग", "लेबल"]);

    if (activeViewTab === "desktop" && !dMatch) {
      if (tMatch) setActiveViewTab("tablet");
      else if (mMatch) setActiveViewTab("mobile");
      else if (bMatch) setActiveViewTab("behaviors");
    } else if (activeViewTab === "tablet" && !tMatch) {
      if (dMatch) setActiveViewTab("desktop");
      else if (mMatch) setActiveViewTab("mobile");
      else if (bMatch) setActiveViewTab("behaviors");
    } else if (activeViewTab === "mobile" && !mMatch) {
      if (dMatch) setActiveViewTab("desktop");
      else if (tMatch) setActiveViewTab("tablet");
      else if (bMatch) setActiveViewTab("behaviors");
    } else if (activeViewTab === "behaviors" && !bMatch) {
      if (dMatch) setActiveViewTab("desktop");
      else if (tMatch) setActiveViewTab("tablet");
      else if (mMatch) setActiveViewTab("mobile");
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

  const updateSetting = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const showDesktopLayout = isFieldVisible("Primary Form Layout", ["layout", "grid", "stacked", "primary", "align", "संरेखित", "ग्रिड", "स्टैक्ड"]);
  const showDesktopSplit = isFieldVisible("Enable Split Pane", ["split", "pane", "pane layout", "screen", "विभाजित", "स्प्लिट"]);
  const showDesktopInputSize = isFieldVisible("Input Field Size", ["size", "input", "compact", "comfortable", "spacious", "आकार", "चौड़ाई", "छोटा", "मध्यम", "बड़ा"]);

  const showTabletTouchPadding = isFieldVisible("Enable Touch Spacing", ["touch", "spacing", "padding", "comfortable", "टच", "स्पेसिंग", "पैडिंग"]);
  const showTabletFullWidth = isFieldVisible("Force Full Width", ["full", "width", "expand", "100%", "पूर्ण", "चौड़ाई"]);
  const showTabletClearButtons = isFieldVisible("Show Clear Buttons", ["clear", "buttons", "icon", "x", "साफ़", "बटन"]);

  const showMobileModal = isFieldVisible("Modal Behavior", ["modal", "behavior", "popup", "fullscreen", "पॉप-अप", "पूर्ण स्क्रीन"]);
  const showMobileShowBorders = isFieldVisible("Show Custom Field Borders", ["custom", "field", "borders", "सीमा", "बॉर्डर"]);
  const showMobileSticky = isFieldVisible("Sticky Action Bar", ["sticky", "action", "bar", "bottom", "सेंक", "चिपचिपा", "एक्शन"]);

  const showRealtimeValidation = isFieldVisible("Real-time Validation", ["realtime", "validation", "errors", "type", "सत्यापन", "त्रुटि"]);
  const showAutoCapitalize = isFieldVisible("Auto-capitalize Names", ["capitalize", "names", "first", "letter", "अक्षर", "बड़ा"]);
  const showAutoSaveDrafts = isFieldVisible("Auto-save Drafts", ["save", "drafts", "progress", "automatic", "सहेजें", "मस्यौदा"]);
  const showFloatingLabels = isFieldVisible("Use Floating Labels Global Override", ["floating", "labels", "override", "फ़्लोटिंग", "लेबल"]);

  const isSearching = searchQuery.trim() !== "";
  const hasDesktopMatches = showDesktopLayout || showDesktopSplit || showDesktopInputSize;
  const hasTabletMatches = showTabletTouchPadding || showTabletFullWidth || showTabletClearButtons;
  const hasMobileMatches = showMobileModal || showMobileShowBorders || showMobileSticky;
  const hasBehaviorsMatches = showRealtimeValidation || showAutoCapitalize || showAutoSaveDrafts || showFloatingLabels;

  const hasAnyMatch = hasDesktopMatches || hasTabletMatches || hasMobileMatches || hasBehaviorsMatches;

  const desktopMatchCount = isSearching ? ((showDesktopLayout ? 1 : 0) + (showDesktopSplit ? 1 : 0) + (showDesktopInputSize ? 1 : 0)) : 0;
  const tabletMatchCount = isSearching ? ((showTabletTouchPadding ? 1 : 0) + (showTabletFullWidth ? 1 : 0) + (showTabletClearButtons ? 1 : 0)) : 0;
  const mobileMatchCount = isSearching ? ((showMobileModal ? 1 : 0) + (showMobileShowBorders ? 1 : 0) + (showMobileSticky ? 1 : 0)) : 0;
  const behaviorsMatchCount = isSearching ? ((showRealtimeValidation ? 1 : 0) + (showAutoCapitalize ? 1 : 0) + (showAutoSaveDrafts ? 1 : 0) + (showFloatingLabels ? 1 : 0)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row matching layout rules */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
          <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
            <SettingsIcon className="!text-[20px] flex items-center justify-center text-indigo-650 dark:text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("Form Detail Settings")}</h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("Manage fields alignment, layout and UI behavior defaults on devices")}>
              {t("Manage fields alignment, layout and UI behavior defaults")}
            </p>
          </div>
        </div>

        <div className="min-w-0 mt-0 flex-1 flex items-center justify-end">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1 shadow-sm overflow-x-auto custom-scrollbar w-auto max-w-full scrollbar-none">
             <button
               onClick={() => setActiveViewTab('desktop')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start relative ${
                 activeViewTab === 'desktop' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Monitor className={`w-3.5 h-3.5 shrink-0 ${activeViewTab === 'desktop' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> 
               <span>{t("Desktop")}</span>
               {isSearching && (
                 <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                   activeViewTab === "desktop" 
                     ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                     : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                 }`}>
                   {desktopMatchCount}
                 </span>
               )}
             </button>
             <button
               onClick={() => setActiveViewTab('tablet')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start relative ${
                 activeViewTab === 'tablet' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Tablet className={`w-3.5 h-3.5 shrink-0 ${activeViewTab === 'tablet' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> 
               <span>{t("Tablet")}</span>
               {isSearching && (
                 <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                   activeViewTab === "tablet" 
                     ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                     : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                 }`}>
                   {tabletMatchCount}
                 </span>
               )}
             </button>
             <button
               onClick={() => setActiveViewTab('mobile')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start relative ${
                 activeViewTab === 'mobile' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Smartphone className={`w-3.5 h-3.5 shrink-0 ${activeViewTab === 'mobile' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> 
               <span>{t("Mobile")}</span>
               {isSearching && (
                 <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                   activeViewTab === "mobile" 
                     ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                     : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                 }`}>
                   {mobileMatchCount}
                 </span>
               )}
             </button>
             <button
               onClick={() => setActiveViewTab('behaviors')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start relative ${
                 activeViewTab === 'behaviors' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Sliders className={`w-3.5 h-3.5 shrink-0 ${activeViewTab === 'behaviors' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> 
               <span>{t("Behaviors")}</span>
               {isSearching && (
                 <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                   activeViewTab === "behaviors" 
                     ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                     : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                 }`}>
                   {behaviorsMatchCount}
                 </span>
               )}
             </button>
          </div>
        </div>
      </div>

      {/* Modern Compact Same-Row Actions search bar row */}
      <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <SearchIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Search form settings...")} 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchQuery && (
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

        <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${(isSearchFocused || searchQuery) ? "hidden sm:flex" : "flex"}`}>
             <input 
               type="file"
               accept={targetFormat === "json" ? ".json" : ".csv"}
               ref={fileInputRef}
               onChange={handleCombinedImport}
               className="hidden"
             />
             <div className="relative inline-flex items-center shrink-0">
               <select
                 value={targetFormat}
                 onChange={(e) => setTargetFormat(e.target.value as "json" | "csv")}
                 className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
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
               className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
               title={t("Import (JSON/CSV)")}
             >
               <UploadIcon className="!text-[14px] flex items-center justify-center shrink-0" />
               <span className="hidden lg:inline leading-none">{t("Import")}</span>
             </button>
             <button
               onClick={handleExportBackup}
               className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
               title={t("Export")}
             >
               <DownloadIcon className="!text-[14px] flex items-center justify-center shrink-0" />
               <span className="hidden lg:inline leading-none">{t("Export")}</span>
             </button>
             <button
               onClick={handleClear}
               className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
               title={t("Clear All Fields")}
             >
               <ClearAllIcon className="!text-[14px] flex items-center justify-center shrink-0" />
               <span className="hidden lg:inline leading-none">{t("Clear")}</span>
             </button>
             <button
               onClick={handleReset}
               className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
               title={t("Reset to Defaults")}
             >
               <UndoIcon className="!text-[14px] flex items-center justify-center shrink-0" />
               <span className="hidden lg:inline leading-none">{t("Reset")}</span>
             </button>
             <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>
             <button
               onClick={handleSave}
               className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
               title={isSaved ? t("Saved Configuration") : t("Save Configuration")}
             >
               {isSaved ? <CheckCircleIcon className="!text-[14px] flex items-center justify-center shrink-0 animate-bounce" /> : <SaveIcon className="!text-[14px] flex items-center justify-center shrink-0" />}
               <span className="hidden lg:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
             </button>
        </div>
      </div>

      {/* Main Settings Body Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/80 shadow-xs overflow-hidden">
        <div className="p-6">
          {hasAnyMatch ? (
            <>
              {activeViewTab === "desktop" && (
                hasDesktopMatches ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <DesktopTab 
                      settings={settings} 
                      handleSettingChange={updateSetting} 
                      showDesktopLayout={showDesktopLayout}
                      showDesktopSplit={showDesktopSplit}
                      showDesktopInputSize={showDesktopInputSize}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100/50 dark:border-indigo-500/20">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No matches in Desktop Layout")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("However, matches are found in other categories. Select a category below to see its matches:")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {hasTabletMatches && (
                        <button onClick={() => setActiveViewTab("tablet")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Tablet className="w-3.5 h-3.5" />
                          <span>{t("Tablet")} ({tabletMatchCount})</span>
                        </button>
                      )}
                      {hasMobileMatches && (
                        <button onClick={() => setActiveViewTab("mobile")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{t("Mobile")} ({mobileMatchCount})</span>
                        </button>
                      )}
                      {hasBehaviorsMatches && (
                        <button onClick={() => setActiveViewTab("behaviors")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>{t("Behaviors")} ({behaviorsMatchCount})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {activeViewTab === "tablet" && (
                hasTabletMatches ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <TabletTab 
                      settings={settings} 
                      handleSettingChange={updateSetting} 
                      showTabletTouchPadding={showTabletTouchPadding}
                      showTabletFullWidth={showTabletFullWidth}
                      showTabletClearButtons={showTabletClearButtons}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100/50 dark:border-indigo-500/20">
                      <Tablet className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No matches in Tablet Optimization")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("However, matches are found in other categories. Select a category below to see its matches:")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {hasDesktopMatches && (
                        <button onClick={() => setActiveViewTab("desktop")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Monitor className="w-3.5 h-3.5" />
                          <span>{t("Desktop")} ({desktopMatchCount})</span>
                        </button>
                      )}
                      {hasMobileMatches && (
                        <button onClick={() => setActiveViewTab("mobile")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{t("Mobile")} ({mobileMatchCount})</span>
                        </button>
                      )}
                      {hasBehaviorsMatches && (
                        <button onClick={() => setActiveViewTab("behaviors")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>{t("Behaviors")} ({behaviorsMatchCount})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {activeViewTab === "mobile" && (
                hasMobileMatches ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <MobileTab 
                      settings={settings} 
                      handleSettingChange={updateSetting} 
                      showMobileModal={showMobileModal}
                      showMobileShowBorders={showMobileShowBorders}
                      showMobileSticky={showMobileSticky}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100/50 dark:border-indigo-500/20">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No matches in Mobile Ergonomics")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("However, matches are found in other categories. Select a category below to see its matches:")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {hasDesktopMatches && (
                        <button onClick={() => setActiveViewTab("desktop")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Monitor className="w-3.5 h-3.5" />
                          <span>{t("Desktop")} ({desktopMatchCount})</span>
                        </button>
                      )}
                      {hasTabletMatches && (
                        <button onClick={() => setActiveViewTab("tablet")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Tablet className="w-3.5 h-3.5" />
                          <span>{t("Tablet")} ({tabletMatchCount})</span>
                        </button>
                      )}
                      {hasBehaviorsMatches && (
                        <button onClick={() => setActiveViewTab("behaviors")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>{t("Behaviors")} ({behaviorsMatchCount})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {activeViewTab === "behaviors" && (
                hasBehaviorsMatches ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <BehaviorsTab 
                      settings={settings} 
                      handleSettingChange={updateSetting} 
                      showRealtimeValidation={showRealtimeValidation}
                      showAutoCapitalize={showAutoCapitalize}
                      showAutoSaveDrafts={showAutoSaveDrafts}
                      showFloatingLabels={showFloatingLabels}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100/50 dark:border-indigo-500/20">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No matches in Behaviors")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("However, matches are found in other categories. Select a category below to see its matches:")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {hasDesktopMatches && (
                        <button onClick={() => setActiveViewTab("desktop")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Monitor className="w-3.5 h-3.5" />
                          <span>{t("Desktop")} ({desktopMatchCount})</span>
                        </button>
                      )}
                      {hasTabletMatches && (
                        <button onClick={() => setActiveViewTab("tablet")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Tablet className="w-3.5 h-3.5" />
                          <span>{t("Tablet")} ({tabletMatchCount})</span>
                        </button>
                      )}
                      {hasMobileMatches && (
                        <button onClick={() => setActiveViewTab("mobile")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-bold text-gray-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-lg shadow-sm transition-all active:scale-95">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{t("Mobile")} ({mobileMatchCount})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4 border border-gray-150 dark:border-gray-750">
                <SearchIcon className="w-5 h-5 animate-pulse text-gray-400" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No settings found")}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{t("No form settings matched your search query. Try typing another term.")}</p>
              <button 
                onClick={() => handleSearchChange("")}
                className="mt-5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
              >
                {t("Clear Search")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
