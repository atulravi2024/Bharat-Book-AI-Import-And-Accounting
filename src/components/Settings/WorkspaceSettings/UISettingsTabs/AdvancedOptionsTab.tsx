import React, { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { Sparkles, Sliders, Zap, Trash2, Check } from "lucide-react";
import { useSearchFilter } from "./hooks/useSearchFilter";
import { useUISettings } from "../hooks/useUISettings";

export const AdvancedOptionsTab: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible } = useSearchFilter(searchTerm);
  const { settings, setSettings, resetSettings } = useUISettings();
  const { hardwareAcceleration, reducedMotion, cacheSize } = settings;

  const setHardwareAcceleration = (val: any) => setSettings(prev => ({ ...prev, hardwareAcceleration: val }));
  const setReducedMotion = (val: any) => setSettings(prev => ({ ...prev, reducedMotion: val }));
  const setCacheSize = (val: any) => setSettings(prev => ({ ...prev, cacheSize: val }));

  const handlePurgeCache = () => {
    localStorage.removeItem("bharat_book_ui_settings");
    resetSettings();
    window.location.reload();
  };

  const showPerf = isFieldVisible("Performance & Heavy Rendering", ["performance", "render", "speed", "hardware", "gpu"]);
  const showCache = isFieldVisible("Memory Cache & Data Buffers", ["memory", "cache", "buffer"]);
  const showClear = isFieldVisible("Clear In-Browser Cache Temp Files", ["clear", "purge", "trash", "delete"]);

  if (!showPerf && !showCache && !showClear) return null;

  return (
    <div className="space-y-6">
      {/* Performance Toggles */}
      {showPerf && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 animate-[pulse_1.5s_infinite]" />
            {t("Performance & Heavy Rendering")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Fine-tune graphics rendering performance and custom in-browser caching for thousands of active cells.")}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30">
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{t("Hardware Acceleration Overlay")}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{t("Leverage GPU acceleration for smoother animations and large transitions.")}</p>
            </div>
            <button 
              onClick={() => setHardwareAcceleration(!hardwareAcceleration)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${hardwareAcceleration ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${hardwareAcceleration ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30">
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{t("Reduced Micro-Motions")}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{t("Disable fluid fade and scaling transitions for maximum browser scrolling speed.")}</p>
            </div>
            <button 
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${reducedMotion ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${reducedMotion ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Local Buffer limit */}
      {showCache && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" />
            {t("Memory Cache & Data Buffers")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Control how many imported Excel row previews are stored in short-term RAM memory cache.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "10", title: t("Light Cache"), size: t("10 MB limit"), desc: t("Optimized for devices with limited memory. Clears entries aggressively.") },
            { id: "50", title: t("Standard Buffers"), size: t("50 MB limit"), desc: t("Recommended for everyday ERP ledger and bank statement analysis operations.") },
            { id: "100", title: t("Max Capacity Load"), size: t("100 MB limit"), desc: t("Best for premium systems processing infinite billing sheets simultaneously.") }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCacheSize(item.id as any)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                cacheSize === item.id
                  ? "border-blue-600 bg-blue-50/20 dark:bg-blue-900/10 dark:border-blue-500"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[12px] font-bold text-gray-900 dark:text-white">{item.title}</span>
                <span className="text-[9px] font-mono font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded">{item.size}</span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 leading-tight">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Clear cached files */}
      {showClear && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h5 className="text-[13px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            {t("Clear In-Browser Cache Temp Files")}
          </h5>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            {t("Purge all locally saved UI state data, and stored JSON configurations, reclaiming critical resources.")}
          </p>
        </div>
        <button onClick={handlePurgeCache} className="flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono text-red-600 hover:text-white hover:bg-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-600 border border-red-200/50 rounded-xl transition-all">
          <Trash2 className="w-3.5 h-3.5" />
          {t("Purge Temporary Files")}
        </button>
      </div>
      )}
    </div>
  );
};
