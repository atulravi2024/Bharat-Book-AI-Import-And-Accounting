import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { LayoutIcon } from "../icons/IconComponents";
import { Layout, Paintbrush, DollarSign, Globe, Layers, Sliders, Maximize } from "lucide-react";
import { LayoutDensityTab } from "./UISettingsTabs/LayoutDensityTab";
import { ColorThemeTab } from "./UISettingsTabs/ColorThemeTab";
import { DataDisplayTab } from "./UISettingsTabs/DataDisplayTab";
import { LocalizationTab } from "./UISettingsTabs/LocalizationTab";
import { AdvancedOptionsTab } from "./UISettingsTabs/AdvancedOptionsTab";
import { MaxCustomizationTab } from "./UISettingsTabs/MaxCustomizationTab";

export interface UISettingsProps {
  defaultSubtab?: string;
}

const getInitialSubtab = (tabProp?: string) => {
  if (!tabProp) return "layout";
  if (tabProp === "ui") return "layout";
  const sub = tabProp.replace("ui_", "");
  if (["layout", "color", "data", "localization", "more", "maximum"].includes(sub)) {
    return sub as any;
  }
  return "layout";
};

export const UISettings: React.FC<UISettingsProps> = ({ defaultSubtab }) => {
  const { t } = useLanguage();
  const [activeSubtab, setActiveSubtab] = useState<"layout" | "color" | "data" | "localization" | "more" | "maximum">(() =>
    getInitialSubtab(defaultSubtab)
  );

  React.useEffect(() => {
    if (defaultSubtab) {
      setActiveSubtab(getInitialSubtab(defaultSubtab));
    }
  }, [defaultSubtab]);

  const subtabs = [
    { id: "layout" as const, label: t("Layout & Density"), icon: Layout },
    { id: "color" as const, label: t("Colors & Theme"), icon: Paintbrush },
    { id: "data" as const, label: t("Data Formats"), icon: DollarSign },
    { id: "localization" as const, label: t("Localization"), icon: Globe },
    { id: "more" as const, label: t("More Options"), icon: Sliders },
    { id: "maximum" as const, label: t("Maximum Design"), icon: Maximize },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row matching high premium ERP style of Bharat Book */}
      <div className="flex flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
            <Layout className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{t("UI Settings")}</h2>
            <p className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t("Optimize and customize visual grids, responsive layouts, data masks, and theme variables")}</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shrink-0">
          <span className="text-gray-500 dark:text-gray-400 font-semibold">{t("BHARAT BOOK")}</span>
          <div className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-700 pl-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200" />
            <span className="text-gray-700 dark:text-gray-300 font-bold tracking-tight">{t("SECURE MODE")}</span>
          </div>
        </div>
      </div>

      {/* Responsive Horizontal Action Scroll Bar for Subpages */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-2 rounded-2xl shadow-sm flex items-center justify-between overflow-hidden">
        <div className="w-full flex items-center bg-gray-50/50 dark:bg-gray-800/30 p-1 rounded-xl overflow-x-auto custom-scrollbar gap-1 snap-x">
          {subtabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubtab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubtab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                  isActive
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm border border-gray-200/40 dark:border-gray-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Screen Area */}
      <div className="bg-gray-50/40 dark:bg-gray-950/35 rounded-3xl p-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeSubtab === "layout" && <LayoutDensityTab />}
        {activeSubtab === "color" && <ColorThemeTab />}
        {activeSubtab === "data" && <DataDisplayTab />}
        {activeSubtab === "localization" && <LocalizationTab />}
        {activeSubtab === "more" && <AdvancedOptionsTab />}
        {activeSubtab === "maximum" && <MaxCustomizationTab />}
      </div>
    </div>
  );
};
