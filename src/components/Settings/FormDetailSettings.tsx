import React, { useRef, useState, useEffect } from "react";
import { SettingsIcon, CheckCircleIcon, UploadIcon, DownloadIcon, UndoIcon } from "../icons/IconComponents";
import { useFormSettings, defaultSettings } from "../../useFormSettings";

const Toggle = ({ enabled, onChange, label, description }: { enabled: boolean; onChange: (v: boolean) => void; label: string; description?: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
    <div className="flex flex-col mr-4">
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>
      {description && <span className="text-xs text-gray-500 mt-0.5">{description}</span>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
        enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

import { DesktopTab } from "./FormDetailSettingsTabs/DesktopTab";
import { TabletTab } from "./FormDetailSettingsTabs/TabletTab";
import { MobileTab } from "./FormDetailSettingsTabs/MobileTab";
import { BehaviorsTab } from "./FormDetailSettingsTabs/BehaviorsTab";
export const FormDetailSettings: React.FC = () => {
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
    // Reset the input so the same file could be imported again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="mr-3 text-blue-600" /> Form Detail Settings
        </h2>
      </div>

      <div className="flex overflow-x-auto space-x-2 mb-8 pb-2 scrollbar-none border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setActiveViewTab("desktop")}
          className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeViewTab === "desktop" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
        >
          Desktop View
        </button>
        <button
          onClick={() => setActiveViewTab("tablet")}
          className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeViewTab === "tablet" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
        >
          Tablet View
        </button>
        <button
          onClick={() => setActiveViewTab("mobile")}
          className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeViewTab === "mobile" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
        >
          Mobile View
        </button>
        <button
          onClick={() => setActiveViewTab("behaviors")}
          className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeViewTab === "behaviors" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
        >
          Form Behaviors
        </button>
      </div>

      <div className="space-y-8">
       
          {activeViewTab === "desktop" && <DesktopTab settings={settings} handleSettingChange={updateSetting} />}
          {activeViewTab === "tablet" && <TabletTab settings={settings} handleSettingChange={updateSetting} />}
          {activeViewTab === "mobile" && <MobileTab settings={settings} handleSettingChange={updateSetting} />}
          {activeViewTab === "behaviors" && <BehaviorsTab settings={settings} handleSettingChange={updateSetting} />}
</div>
    </div>
  );
};

