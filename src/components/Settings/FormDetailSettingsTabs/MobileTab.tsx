import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

const Toggle = ({ enabled, onChange, label, description }: { enabled: boolean; onChange: (v: boolean) => void; label: string; description?: string }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <div className="flex flex-col mr-4">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t(label)}</span>
        {description && <span className="text-xs text-gray-500 mt-0.5">{t(description)}</span>}
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
};

interface MobileTabProps {
  settings: any;
  handleSettingChange: (key: string, val: any) => void;
}

export const MobileTab: React.FC<MobileTabProps> = ({ settings, handleSettingChange }) => {
  const { t } = useLanguage();
  const updateSetting = (key: string, val: any) => handleSettingChange(key, val);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{t("Mobile Ergonomics")}</h4>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t("Modal Behavior")}</label>
            <select
              value={settings.mobileModalMode || "fullscreen"}
              onChange={(e) => updateSetting("mobileModalMode", e.target.value)}
              className="w-full p-4 bg-white dark:bg-gray-900 border-none rounded-2xl shadow-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="popup">{t("Pop-up Mode")}</option>
              <option value="fullscreen">{t("Full Screen Mode")}</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{t("Display Toggles")}</h4>
          <Toggle 
            label="Show Custom Field Borders" 
            enabled={settings.mobileShowBorders} 
            onChange={(v) => updateSetting("mobileShowBorders", v)} 
          />
          <Toggle 
            label="Sticky Action Bar" 
            description="Keep save/cancel buttons at bottom of screen"
            enabled={settings.mobileStickyHeader} 
            onChange={(v) => updateSetting("mobileStickyHeader", v)} 
          />
        </div>
      </div>
    </div>
  );
};
