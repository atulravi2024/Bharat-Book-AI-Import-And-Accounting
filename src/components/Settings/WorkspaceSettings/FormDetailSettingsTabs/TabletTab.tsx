import React from "react";
import { useLanguage } from "../../../../context/LanguageContext";

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

interface TabletTabProps {
  settings: any;
  handleSettingChange: (key: string, val: any) => void;
  showTabletTouchPadding?: boolean;
  showTabletFullWidth?: boolean;
  showTabletClearButtons?: boolean;
}

export const TabletTab: React.FC<TabletTabProps> = ({ 
  settings, 
  handleSettingChange,
  showTabletTouchPadding = true,
  showTabletFullWidth = true,
  showTabletClearButtons = true
}) => {
  const { t } = useLanguage();
  const updateSetting = (key: string, val: any) => handleSettingChange(key, val);

  const hasTabletOptimization = showTabletTouchPadding || showTabletFullWidth;
  const hasInputControls = showTabletClearButtons;

  if (!hasTabletOptimization && !hasInputControls) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasTabletOptimization && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{t("Tablet Optimization")}</h4>
            {showTabletTouchPadding && (
              <Toggle 
                label="Enable Touch Spacing" 
                description="Increases padding and tap targets for touchscreens"
                enabled={settings.tabletTouchPadding} 
                onChange={(v) => updateSetting("tabletTouchPadding", v)} 
              />
            )}
            {showTabletFullWidth && (
              <Toggle 
                label="Force Full Width" 
                description="Expand forms to 100% width on tablet screens"
                enabled={settings.tabletFullWidth} 
                onChange={(v) => updateSetting("tabletFullWidth", v)} 
              />
            )}
          </div>
        )}
        {hasInputControls && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">{t("Input Controls")}</h4>
            {showTabletClearButtons && (
              <Toggle 
                label="Show Clear Buttons" 
                description="Display a clear icon (x) inside input fields"
                enabled={settings.tabletShowClearButtons} 
                onChange={(v) => updateSetting("tabletShowClearButtons", v)} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
