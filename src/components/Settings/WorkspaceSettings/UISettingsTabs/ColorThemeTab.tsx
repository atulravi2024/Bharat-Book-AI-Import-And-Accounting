import React, { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { Paintbrush, Moon, Sun, Monitor, Check } from "lucide-react";
import { useSearchFilter } from "./hooks/useSearchFilter";
import { useUISettings } from "../hooks/useUISettings";

export const ColorThemeTab: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible } = useSearchFilter(searchTerm);
  const { settings, setSettings } = useUISettings();
  const { selectedTheme, colorMode } = settings;

  const setSelectedTheme = (val: any) => setSettings(prev => ({ ...prev, selectedTheme: val }));
  const setColorMode = (val: any) => setSettings(prev => ({ ...prev, colorMode: val }));

  const themesPreset = [
    { id: "standard", name: t("Classic Amber-Blue"), primary: "bg-blue-600", secondary: "bg-amber-500", colors: ["#2563eb", "#d97706"] },
    { id: "coal", name: t("Charcoal Slate"), primary: "bg-gray-800", secondary: "bg-teal-500", colors: ["#1f2937", "#0d9488"] },
    { id: "cobalt", name: t("Cobalt ERP Premium"), primary: "bg-indigo-700", secondary: "bg-purple-500", colors: ["#4338ca", "#a855f7"] },
    { id: "emerald", name: t("Financial Mint"), primary: "bg-emerald-600", secondary: "bg-cyan-500", colors: ["#059669", "#06b6d4"] },
  ];

  const showPalettes = isFieldVisible("Application Design Palettes", ["color", "theme", "palette", "accent"]);
  const showContrast = isFieldVisible("Contrast & Dark Theme Support", ["dark mode", "light mode", "system", "contrast", "theme"]);

  if (!showPalettes && !showContrast) return null;

  return (
    <div className="space-y-6">
      {/* Palette preset choices */}
      {showPalettes && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-amber-500" />
            {t("Application Design Palettes")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Select the accent colors and custom palette combinations to brand your ledger environment.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {themesPreset.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedTheme(p.id as any)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                selectedTheme === p.id
                  ? "border-amber-500 bg-amber-50/5 dark:bg-amber-950/10 ring-2 ring-amber-500/10"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-1">
                  <div className={`w-3 h-3 rounded-full ${p.primary}`} />
                  <div className={`w-3 h-3 rounded-full ${p.secondary}`} />
                </div>
                {selectedTheme === p.id && (
                  <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <div className="mt-auto">
                <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight">{p.name}</p>
                <div className="flex gap-1.5 mt-1.5">
                  {p.colors.map((c, i) => (
                    <span 
                      key={i} 
                      className="text-[9px] font-mono select-none px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Dark/Light mode overrides */}
      {showContrast && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            {t("Contrast & Dark Theme Support")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Enable native theme switching preferences directly on your browser environment.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "light", label: t("Light Mode"), desc: t("Crisp light paper themes optimized for daytime billing runs."), icon: Sun },
            { id: "dark", label: t("Deep Dark Mode"), desc: t("Eye-safe dark canvas designed for long technical parsing sessions."), icon: Moon },
            { id: "system", label: t("Follow System"), desc: t("Automatically adapt colors based on your operating system preferences."), icon: Monitor }
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setColorMode(mode.id as any)}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  colorMode === mode.id
                    ? "border-blue-600 bg-blue-50/25 dark:bg-blue-950/10 dark:border-blue-500 ring-2 ring-blue-500/10"
                    : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorMode === mode.id ? "bg-blue-100 dark:bg-blue-500/25 text-blue-600" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-900 dark:text-white-800 leading-snug">{mode.label}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">{mode.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
};
