import React, { useRef, useState } from "react";
import { SettingsIcon, CheckCircleIcon, UploadIcon, DownloadIcon, UndoIcon } from "../icons/IconComponents";

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

const defaultSettings = {
    // Form Layout - Desktop
    desktopLayoutType: "standard",
    desktopColumns: "3",
    desktopLabelPosition: "top",
    desktopInputSize: "medium",
    desktopShowBorders: true,
    desktopStickyHeader: true,
    
    // Form Layout - Tablet
    tabletLayoutType: "standard",
    tabletColumns: "2",
    tabletLabelPosition: "top",
    tabletInputSize: "medium",
    tabletShowBorders: true,
    tabletStickyHeader: false,
    
    // Form Layout - Mobile
    mobileLayoutType: "stacked",
    mobileColumns: "1",
    mobileLabelPosition: "top",
    mobileInputSize: "large",
    mobileShowBorders: false,
    mobileStickyHeader: true,
    
    // Form Defaults & Behaviors
    showAdditionalFields: true,
    requireApprovalOptions: false,
    autofillEnabled: true,
    showTooltips: true,
    dynamicValidation: true,
    highlightMandatory: true,
    autoSaveDrafts: false,
    floatingLabels: false,
  };

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
        {activeViewTab === "desktop" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
              Desktop Layout Defaults
            </h3>
             <div className="form-grid gap-6 mb-6">
              <div className="space-y-2">
                <label className="form-label">
                  Layout Type
                </label>
                <select
                  value={settings.desktopLayoutType}
                  onChange={(e) => updateSetting("desktopLayoutType", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="standard">Standard layout</option>
                  <option value="compact">Compact layout</option>
                  <option value="expanded">Expanded layout</option>
                  <option value="widescreen">Widescreen layout</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="form-label">
                  Columns
                </label>
                <select
                  value={settings.desktopColumns}
                  onChange={(e) => updateSetting("desktopColumns", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="2">2 Columns</option>
                  <option value="3">3 Columns</option>
                  <option value="4">4 Columns</option>
                  <option value="6">6 Columns</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="form-label">
                  Label Position
                </label>
                <select
                  value={settings.desktopLabelPosition}
                  onChange={(e) => updateSetting("desktopLabelPosition", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="top">Top aligned</option>
                  <option value="left">Left aligned</option>
                  <option value="floating">Floating labels</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="form-label">
                  Input Size
                </label>
                <select
                  value={settings.desktopInputSize}
                  onChange={(e) => updateSetting("desktopInputSize", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Display Toggles</h4>
              <Toggle 
                label="Show Custom Field Borders" 
                description="Display prominent borders around input fields"
                enabled={settings.desktopShowBorders} 
                onChange={(v) => updateSetting("desktopShowBorders", v)} 
              />
              <Toggle 
                label="Sticky Form Header" 
                description="Keep form action buttons visible while scrolling"
                enabled={settings.desktopStickyHeader} 
                onChange={(v) => updateSetting("desktopStickyHeader", v)} 
              />
            </div>
          </div>
        )}

        {activeViewTab === "tablet" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
              Tablet Layout Defaults
            </h3>
            <div className="form-grid gap-6 mb-6">
              <div className="space-y-2">
                <label className="form-label">
                  Layout Type
                </label>
                <select
                  value={settings.tabletLayoutType}
                  onChange={(e) => updateSetting("tabletLayoutType", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="standard">Standard layout</option>
                  <option value="compact">Compact layout</option>
                </select>
              </div>

               <div className="space-y-2">
                <label className="form-label">
                  Columns
                </label>
                <select
                  value={settings.tabletColumns}
                  onChange={(e) => updateSetting("tabletColumns", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="1">1 Column</option>
                  <option value="2">2 Columns</option>
                  <option value="3">3 Columns</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="form-label">
                  Label Position
                </label>
                <select
                  value={settings.tabletLabelPosition}
                  onChange={(e) => updateSetting("tabletLabelPosition", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="top">Top aligned</option>
                  <option value="floating">Floating labels</option>
                </select>
              </div>

               <div className="space-y-2">
                <label className="form-label">
                  Input Size
                </label>
                <select
                  value={settings.tabletInputSize}
                  onChange={(e) => updateSetting("tabletInputSize", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Display Toggles</h4>
              <Toggle 
                label="Show Custom Field Borders" 
                enabled={settings.tabletShowBorders} 
                onChange={(v) => updateSetting("tabletShowBorders", v)} 
              />
              <Toggle 
                label="Sticky Form Header" 
                enabled={settings.tabletStickyHeader} 
                onChange={(v) => updateSetting("tabletStickyHeader", v)} 
              />
            </div>
          </div>
        )}

        {activeViewTab === "mobile" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
              Mobile Layout Defaults
            </h3>
            <div className="form-grid gap-6 mb-6">
              <div className="space-y-2">
                <label className="form-label">
                  Layout Type
                </label>
                <select
                  value={settings.mobileLayoutType}
                  onChange={(e) => updateSetting("mobileLayoutType", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="stacked">Stacked layout</option>
                  <option value="compact">Compact layout</option>
                </select>
              </div>

               <div className="space-y-2">
                <label className="form-label">
                  Columns
                </label>
                <select
                  value={settings.mobileColumns}
                  onChange={(e) => updateSetting("mobileColumns", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="1">1 Column</option>
                  <option value="2">2 Columns (Half width)</option>
                </select>
              </div>

               <div className="space-y-2">
                <label className="form-label">
                  Label Position
                </label>
                <select
                  value={settings.mobileLabelPosition}
                  onChange={(e) => updateSetting("mobileLabelPosition", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="top">Top aligned</option>
                  <option value="floating">Floating labels</option>
                </select>
              </div>

               <div className="space-y-2">
                <label className="form-label">
                  Touch Target Size
                </label>
                <select
                  value={settings.mobileInputSize}
                  onChange={(e) => updateSetting("mobileInputSize", e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="medium">Medium (44px min)</option>
                  <option value="large">Large (56px min)</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Display Toggles</h4>
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
        )}

        {/* Behaviors */}
        {activeViewTab === "behaviors" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Form Behaviors & Options
            </h3>
            <div className="flex flex-col">
              <Toggle 
                label="Show Additional Fields By Default" 
                description="Automatically expand optional fields sections"
                enabled={settings.showAdditionalFields} 
                onChange={(v) => updateSetting("showAdditionalFields", v)} 
              />
              <Toggle 
                label="Require Approval Before Submit" 
                description="Enable multi-step form approval workflows"
                enabled={settings.requireApprovalOptions} 
                onChange={(v) => updateSetting("requireApprovalOptions", v)} 
              />
              <Toggle 
                label="Enable Form Autofill" 
                description="Predictive inputs and recent items"
                enabled={settings.autofillEnabled} 
                onChange={(v) => updateSetting("autofillEnabled", v)} 
              />
              <Toggle 
                label="Show Field Tooltips" 
                description="Display help text icons next to complex fields"
                enabled={settings.showTooltips} 
                onChange={(v) => updateSetting("showTooltips", v)} 
              />
              <Toggle 
                label="Real-time Dynamic Validation" 
                description="Validate fields immediately upon edit"
                enabled={settings.dynamicValidation} 
                onChange={(v) => updateSetting("dynamicValidation", v)} 
              />
              <Toggle 
                label="Highlight Mandatory Fields" 
                description="Make required fields visually distinct"
                enabled={settings.highlightMandatory} 
                onChange={(v) => updateSetting("highlightMandatory", v)} 
              />
              <Toggle 
                label="Auto-Save Drafts" 
                description="Automatically save form progress in background"
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
        )}
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-6">
        <div className="flex space-x-2 sm:space-x-4">
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            title="Import Settings"
          >
            <UploadIcon className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={handleExport}
            className="p-2 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            title="Export Settings"
          >
            <DownloadIcon className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            title="Reset Settings"
          >
            <UndoIcon className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all flex items-center shadow-lg ${isSaved ? "bg-green-500 text-white dark:bg-green-600 dark:shadow-green-900/50" : "bg-blue-600 hover:bg-blue-700 text-white dark:shadow-blue-900/50"} `}
        >
          {isSaved ? (
            <>
              <CheckCircleIcon className="mr-2" /> Saved!
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

