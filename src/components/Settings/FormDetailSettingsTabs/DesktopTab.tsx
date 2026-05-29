import React from "react";
import { useLanguage } from '../../../context/LanguageContext';

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

interface DesktopTabProps {
  settings: any;
  handleSettingChange: (key: string, val: any) => void;
}

export const DesktopTab: React.FC<DesktopTabProps> = ({ settings, handleSettingChange }) => {
  const { t } = useLanguage();
  const updateSetting = (key: string, val: any) => handleSettingChange(key, val);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{t("Layout Options")}</h4>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t("Primary Form Layout")}</label>
            <select
              value={settings.desktopLayout || "grid"}
              onChange={(e) => updateSetting("desktopLayout", e.target.value)}
              className="w-full p-4 bg-white dark:bg-gray-900 border-none rounded-2xl shadow-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="grid">{t("Side-by-Side (Grid)")}</option>
              <option value="stacked">{t("Vertical (Stacked)")}</option>
            </select>
            <p className="text-xs text-gray-500 mt-2 ml-2">{t("Controls how labels and inputs align.")}</p>
          </div>
          <Toggle 
            label="Enable Split Pane" 
            description="Allows master forms to open in a split-screen layout"
            enabled={settings.desktopSplitPane} 
            onChange={(v) => updateSetting("desktopSplitPane", v)} 
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{t("Sizing")}</h4>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t("Input Field Size")}</label>
            <select
              value={settings.desktopInputSize || "md"}
              onChange={(e) => updateSetting("desktopInputSize", e.target.value)}
              className="w-full p-4 bg-white dark:bg-gray-900 border-none rounded-2xl shadow-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="sm">{t("Compact (Small)")}</option>
              <option value="md">{t("Comfortable (Medium)")}</option>
              <option value="lg">{t("Spacious (Large)")}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
