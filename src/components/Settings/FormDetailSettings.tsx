import React, { useRef, useState } from "react";
import { useFormSettings, defaultSettings } from "../../app/useFormSettings";
import { useLanguage } from '../../context/LanguageContext';
import { 
  Settings, Monitor, Tablet, Smartphone, Sliders,
  Save, RotateCcw, Upload, Download, CheckCircle2
} from "lucide-react";

import { DesktopTab } from "./FormDetailSettingsTabs/DesktopTab";
import { TabletTab } from "./FormDetailSettingsTabs/TabletTab";
import { MobileTab } from "./FormDetailSettingsTabs/MobileTab";
import { BehaviorsTab } from "./FormDetailSettingsTabs/BehaviorsTab";

export const FormDetailSettings: React.FC = () => {
  const { t } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"desktop" | "tablet" | "mobile" | "behaviors">("desktop");
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

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const exportFileDefaultName = 'form-detail-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataStr);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const nextSettings = { ...settings, ...json };
        setSettings(nextSettings);
        localStorage.setItem("bharat_book_form_settings", JSON.stringify(nextSettings));
        dispatchUpdateEvent();
      } catch (err) {
        console.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row matching SupportSettings layout */}
      <div className="flex flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{t("Form Detail Settings")}</h2>
            <p className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t("Manage fields alignment, layout and UI behavior defaults on devices")}</p>
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
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1 shadow-sm md:shadow-none overflow-x-auto custom-scrollbar w-full md:w-auto max-w-full snap-x scrollbar-none">
             <button
               onClick={() => setActiveViewTab('desktop')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                 activeViewTab === 'desktop' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Monitor className={`w-3.5 h-3.5 shrink-0 ${activeViewTab === 'desktop' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> <span>{t("Desktop")}</span>
             </button>
             <button
               onClick={() => setActiveViewTab('tablet')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                 activeViewTab === 'tablet' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Tablet className={`w-3.5 h-3.5 shrink-0 ${activeViewTab === 'tablet' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> <span>{t("Tablet")}</span>
             </button>
             <button
               onClick={() => setActiveViewTab('mobile')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                 activeViewTab === 'mobile' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Smartphone className={`w-3.5 h-3.5 shrink-0 ${activeViewTab === 'mobile' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> <span>{t("Mobile")}</span>
             </button>
             <button
               onClick={() => setActiveViewTab('behaviors')}
               className={`flex items-center gap-1.5 px-3 py-1.5 md:min-w-[100px] justify-center rounded text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                 activeViewTab === 'behaviors' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Sliders className={`w-3.5 h-3.5 shrink-0 ${activeViewTab === 'behaviors' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> <span>{t("Behaviors")}</span>
             </button>
          </div>
        </div>
      </div>

      {/* Main Settings Body Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800/80 shadow-xs overflow-hidden">
        <div className="p-6">
          <div className="space-y-8">
            {activeViewTab === "desktop" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <DesktopTab settings={settings} handleSettingChange={updateSetting} />
              </div>
            )}
            {activeViewTab === "tablet" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <TabletTab settings={settings} handleSettingChange={updateSetting} />
              </div>
            )}
            {activeViewTab === "mobile" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <MobileTab settings={settings} handleSettingChange={updateSetting} />
              </div>
            )}
            {activeViewTab === "behaviors" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <BehaviorsTab settings={settings} handleSettingChange={updateSetting} />
              </div>
            )}
          </div>
        </div>

        {/* Global Save/Export Actions Footer */}
        <div className="p-4 bg-gray-50/50 dark:bg-gray-950/40 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label 
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              title="Import Settings"
            >
              <Upload size={14} /> <span>{t("Import")}</span>
              <input type="file" ref={fileInputRef} accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-800"
              title="Export Settings"
            >
              <Download size={14} /> <span>{t("Export")}</span>
            </button>
            <button 
              onClick={handleReset}
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
