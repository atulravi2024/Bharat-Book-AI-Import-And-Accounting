import React, { useState, useEffect } from "react";
import {
  SettingsIcon, AccountIcon, NotificationsIcon, SecurityIcon, InfoIcon,
  AIToolsIcon, AdminIcon, CodeIcon, LayoutIcon
} from "../../../icons/IconComponents";
import { HelpCircle, LifeBuoy } from "lucide-react";

export const SettingsTabs = ({ activeTab, handleTabChange, t }: { activeTab: string, handleTabChange: (t: string) => void, t: any }) => {
  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);

  useEffect(() => {
    const loadHidden = () => {
      const stored = localStorage.getItem("bharat_book_hidden_settings_tabs");
      if (stored) {
        try {
          setHiddenTabs(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setHiddenTabs([]);
      }
    };

    loadHidden();
    
    // Wire up events so tab updates are instantly reactive
    window.addEventListener("bharat_book_settings_tabs_trigger", loadHidden);
    return () => {
      window.removeEventListener("bharat_book_settings_tabs_trigger", loadHidden);
    };
  }, []);

  const getTabClass = (tab: string) => {
    const base = "flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap border border-transparent";
    const isActive = activeTab === tab || (tab === "ui" && activeTab?.startsWith("ui_"));
    if (isActive) {
      if (["setting_categories", "firm", "general", "ui", "uifilter", "navigation", "help", "support", "about"].includes(tab)) {
        return `${base} bg-blue-600 text-white shadow-lg dark:shadow-blue-900/50`;
      }
      return `${base} bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/50`;
    }
    return `${base} bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`;
  };

  const tabs = [
    { id: "setting_categories", icon: SettingsIcon, label: "Category Settings" },
    { id: "workspace", icon: SettingsIcon, label: "Setting Explorer" },
    { id: "firm", icon: AdminIcon, label: "Firm" },
    { id: "general", icon: SettingsIcon, label: "General" },
    { id: "ui", icon: LayoutIcon, label: "UI" },
    { id: "uifilter", icon: LayoutIcon, label: "UI Filter" },
    { id: "formdetails", icon: LayoutIcon, label: "Form Detail" },
    { id: "navigation", icon: SettingsIcon, label: "App Defaults" },
    { id: "vouchernumbering", icon: SettingsIcon, label: "Voucher Numbering" },
    { id: "invoiceprint", icon: LayoutIcon, label: "Invoice & Print" },
    { id: "users", icon: AccountIcon, label: "Users" },
    { id: "alerts", icon: NotificationsIcon, label: "Alert Channel" },
    { id: "security", icon: SecurityIcon, label: "Security" },
    { id: "privacy", icon: InfoIcon, label: "Privacy" },
    { id: "imports", icon: SettingsIcon, label: "Import Rules" },
    { id: "mapping", icon: SettingsIcon, label: "Mapping" },
    { id: "ai", icon: AIToolsIcon, label: "AI Engines" },
    { id: "admin", icon: AdminIcon, label: "Admin" },
    { id: "data", icon: CodeIcon, label: "Data Explorer" },
    { id: "help", icon: HelpCircle, label: "Help Center", iconSizing: "w-4 h-4" },
    { id: "support", icon: LifeBuoy, label: "Support", iconSizing: "w-4 h-4" },
    { id: "about", icon: InfoIcon, label: "About", iconSizing: "w-4 h-4" },
  ];

  // Filter out any hidden tabs, keeping 'uifilter' and 'setting_categories' permanently accessible
  const visibleTabs = tabs.filter(t => !hiddenTabs.includes(t.id) || t.id === "uifilter" || t.id === "setting_categories");

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto overflow-y-hidden custom-scrollbar pb-1">
      <div className="flex flex-row space-x-2 min-w-max px-1">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`settings-tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              className={getTabClass(tab.id)}
            >
              <Icon className={`mr-3 ${tab.iconSizing || ""}`} /> {t(tab.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
