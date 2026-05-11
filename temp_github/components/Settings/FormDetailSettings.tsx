import React, { useState } from "react";
import { SettingsIcon, CheckCircleIcon } from "../icons/IconComponents";

export const FormDetailSettings: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [settings, setSettings] = useState({
    showAdditionalFields: true,
    requireApprovalOptions: false,
    formLayoutType: "standard",
    autofillEnabled: true,
    defaultColumns: "3",
  });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="mr-3 text-blue-600" /> Form Detail Settings
        </h2>
        <button
          onClick={handleSave}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all flex items-center shadow-lg ${isSaved ? "bg-green-500 text-white shadow-green-200" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"} `}
        >
          {isSaved ? (
            <>
              <CheckCircleIcon className="mr-2" /> Saved!
            </>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
              Form Layout Type
            </label>
            <select
              value={settings.formLayoutType}
              onChange={(e) =>
                setSettings({ ...settings, formLayoutType: e.target.value })
              }
              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="standard">Standard layout</option>
              <option value="compact">Compact layout</option>
              <option value="expanded">Expanded layout</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
              Default Columns
            </label>
            <select
              value={settings.defaultColumns}
              onChange={(e) =>
                setSettings({ ...settings, defaultColumns: e.target.value })
              }
              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="1">1 Column</option>
              <option value="2">2 Columns</option>
              <option value="3">3 Columns</option>
              <option value="4">4 Columns</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl mt-8">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
            Form Defaults
          </h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAdditionalFields}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    showAdditionalFields: e.target.checked,
                  })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 bg-white border-gray-300"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Show Additional Form Fields By Default
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireApprovalOptions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireApprovalOptions: e.target.checked,
                  })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 bg-white border-gray-300"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Require Approval Options Before Form Submit
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autofillEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autofillEnabled: e.target.checked,
                  })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 bg-white border-gray-300"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Enable Form Autofill and Recommendations
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
