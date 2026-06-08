import React, { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { Maximize, Grid, Percent, SlidersHorizontal, Sliders } from "lucide-react";
import { useSearchFilter } from "./hooks/useSearchFilter";

export const MaxCustomizationTab: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible } = useSearchFilter(searchTerm);
  const [maxGridZoom, setMaxGridZoom] = useState<"85" | "100" | "115">("100");
  const [borderWeight, setBorderWeight] = useState<"thin" | "medium" | "thick">("thin");
  const [isMaxMode, setIsMaxMode] = useState(false);

  const showZoom = isFieldVisible("Maximum Sheet Workspace Scaling", ["zoom", "scale", "responsive", "size"]);
  const showBorder = isFieldVisible("Grid Outline Weight Options", ["border", "grid", "outline", "weight", "thickness"]);
  const showMax = isFieldVisible("Enable Maximum Performance Mode", ["max", "performance", "mode", "engine"]);

  if (!showZoom && !showBorder && !showMax) return null;

  return (
    <div className="space-y-6">
      {/* Maximum Responsive Grid Zoom settings */}
      {showZoom && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-500" />
            {t("Maximum Sheet Workspace Scaling")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Fine-tune layout zoom parameters to achieve maximum readability or display density on high resolution displays.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "85", label: t("High Efficiency (85%)"), desc: t("For extra dense displays. Fit up to 40% more rows on widescreen table grids.") },
            { id: "100", label: t("Standard Scaled (100%)"), desc: t("Normal baseline proportions. Carefully optimized for high accessibility layouts.") },
            { id: "115", label: t("Enlarged Text (115%)"), desc: t("Best for projectors or laptop/tablet users looking for absolute visual comfort.") }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMaxGridZoom(item.id as any)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                maxGridZoom === item.id
                  ? "border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 dark:border-emerald-500"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[12px] font-bold text-gray-900 dark:text-white">{item.label}</span>
                <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300 px-1.5 py-0.5 rounded">{item.id}%</span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 leading-tight">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Grid Border Style & Outline weight */}
      {showBorder && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Grid className="w-4 h-4 text-indigo-500" />
            {t("Grid Outline Weight Options")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Select structural outline thickness for layout boxes and border separating widgets.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "thin", label: t("Thin Border (1px)"), desc: t("A minimalist, ultra-clean modern slate border for premium styling.") },
            { id: "medium", label: t("Medium Border (1.5px)"), desc: t("Gives structure great clarity without crowding columns on small devices.") },
            { id: "thick", label: t("Legacy Strong (2px)"), desc: t("Deep structural contrast. Recommended for retro or tactical terminal templates.") }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setBorderWeight(item.id as any)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                borderWeight === item.id
                  ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 dark:border-indigo-500"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[12px] font-bold text-gray-900 dark:text-white">{item.label}</span>
                <span className={`h-2.5 rounded ${borderWeight === item.id ? "bg-indigo-600 dark:bg-indigo-400" : "bg-gray-300 dark:bg-gray-700"} ${
                  item.id === "thin" ? "w-4" : item.id === "medium" ? "w-6" : "w-8"
                }`} />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 leading-tight">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Extreme Max Ingestion Density Switcher */}
      {showMax && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div className="max-w-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 mt-0.5 animate-[pulse_2s_infinite]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-[13px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t("Enable Maximum Performance Mode")}
              <span className="text-[9px] font-bold font-mono tracking-widest text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full uppercase dark:bg-orange-500/10 dark:text-orange-400 dark:border-none">
                {t("Maximum")}
              </span>
            </h5>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              {t("Instructs the AI engine and virtual ledger parser to prioritize extreme loading speeds over visual fade-in layout transitions.")}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsMaxMode(!isMaxMode)}
          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isMaxMode ? "bg-orange-500" : "bg-gray-200 dark:bg-gray-700"}`}
        >
          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isMaxMode ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      )}
    </div>
  );
};
