import React from "react";

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

interface BehaviorsTabProps {
  settings: any;
  handleSettingChange: (key: string, val: any) => void;
}

export const BehaviorsTab: React.FC<BehaviorsTabProps> = ({ settings, handleSettingChange }) => {
  const updateSetting = (key: string, val: any) => handleSettingChange(key, val);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Input Validation</h4>
          <Toggle 
            label="Real-time Validation" 
            description="Show errors immediately as you type instead of on submit"
            enabled={settings.realtimeValidation} 
            onChange={(v) => updateSetting("realtimeValidation", v)} 
          />
          <Toggle 
            label="Auto-capitalize Names" 
            description="Automatically capitalize the first letter of names/titles"
            enabled={settings.autoCapitalize} 
            onChange={(v) => updateSetting("autoCapitalize", v)} 
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Form Mechanics</h4>
          <Toggle 
            label="Auto-save Drafts" 
            description="Automatically save form progress every 30 seconds"
            enabled={settings.autoSaveDrafts} 
            onChange={(v) => updateSetting("autoSaveDrafts", v)} 
          />
          <Toggle 
            label="Use Floating Labels Global Override" 
            description="Force floating labels on all devices regardless of layout type"
            enabled={settings.floatingLabels} 
            onChange={(v) => updateSetting("floatingLabels", v)} 
          />
        </div>
      </div>
    </div>
  );
};
