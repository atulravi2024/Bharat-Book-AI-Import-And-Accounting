import React, { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { Layout, Maximize2, Minimize2, Sidebar } from "lucide-react";
import { useSearchFilter } from "./hooks/useSearchFilter";

export const LayoutDensityTab: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible } = useSearchFilter(searchTerm);
  const [density, setDensity] = useState<"compact" | "standard" | "spacious">("compact");
  const [sidebarStyle, setSidebarStyle] = useState<"expanded" | "collapsed" | "hover">("expanded");
  const [showStatusIndicator, setShowStatusIndicator] = useState(true);

  const showDensity = isFieldVisible("Interface Density", ["compact", "standard", "spacious", "layout"]);
  const showSidebar = isFieldVisible("Sidebar Navigation Behavior", ["expanded", "hover", "collapsed", "sidebar"]);
  const showStatus = isFieldVisible("Header Environment Details", ["frame", "status", "indicator", "header"]);

  if (!showDensity && !showSidebar && !showStatus) return null;

  return (
    <div className="space-y-6">
      {/* Visual Density Selector */}
      {showDensity && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-500" />
            {t("Interface Density")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Adjust the spacing, margins, and padding density across the Bharat Book ERP workspace.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "compact", label: t("High Density (Compact)"), desc: t("Optimized for heavy ledger operations and financial grids. Maximize viewport data."), icon: Minimize2 },
            { id: "standard", label: t("Balanced (Standard)"), desc: t("Comfortable balance of readability and information presentation. Standard spacing."), icon: Layout },
            { id: "spacious", label: t("Editorial (Spacious)"), desc: t("Enriched padding and generous negative spaces for easier, clean navigation."), icon: Maximize2 }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setDensity(option.id as any)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between h-32 transition-all ${
                  density === option.id
                    ? "border-blue-600 bg-blue-50/25 dark:bg-blue-900/10 dark:border-blue-500 ring-2 ring-blue-500/10"
                    : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${density === option.id ? "bg-blue-100 dark:bg-blue-500/25 text-blue-600" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${density === option.id ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                    {density === option.id && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-snug">{option.label}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal mt-0.5 mt-auto line-clamp-2">{option.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Navigation Layout Choice */}
      {showSidebar && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sidebar className="w-4 h-4 text-indigo-500" />
            {t("Sidebar Navigation Behavior")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Control how the primary navigation behaves when switching between workspace modules.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "expanded", label: t("Fixed Sidebar"), desc: t("Keep the main sidebar always open with visual icons and titles alongside your content view.") },
            { id: "hover", label: t("Auto-Collapsing"), desc: t("Autocollapse into a small mini-strip of icons and slide-expand smoothly on cursor hover.") },
            { id: "collapsed", label: t("Icon-Only Mode"), desc: t("Minimize sidebar footprint permanently to clean icons, maximizing horizontal workspace sheet width.") }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSidebarStyle(option.id as any)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                sidebarStyle === option.id
                  ? "border-indigo-600 bg-indigo-50/25 dark:bg-indigo-950/10 dark:border-indigo-500 ring-2 ring-indigo-500/10"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`text-[11px] font-black tracking-widest uppercase ${sidebarStyle === option.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>{option.id}</span>
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${sidebarStyle === option.id ? "border-indigo-500 text-indigo-500" : "border-gray-300"}`} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-snug">{option.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal line-clamp-2 mt-0.5">{option.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Frame Status Lines */}
      {showStatus && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div className="max-w-md">
          <h5 className="text-[13px] font-bold text-gray-900 dark:text-white">{t("Header Environment Details")}</h5>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            {t("Toggle the display of the application build version, environment modes, or developer meta tags in headers of simple sheets.")}
          </p>
        </div>
        <button 
          onClick={() => setShowStatusIndicator(!showStatusIndicator)}
          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showStatusIndicator ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
        >
          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showStatusIndicator ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      )}
    </div>
  );
};
