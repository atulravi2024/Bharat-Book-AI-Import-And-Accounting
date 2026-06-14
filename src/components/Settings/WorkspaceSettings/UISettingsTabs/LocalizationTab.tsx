import React, { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { Globe, Type, Check } from "lucide-react";
import { useSearchFilter } from "./hooks/useSearchFilter";
import { useUISettings } from "../hooks/useUISettings";

export const LocalizationTab: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => {
  const { t, language, setLanguage } = useLanguage();
  const { isFieldVisible } = useSearchFilter(searchTerm);
  const { settings, setSettings } = useUISettings();
  const { fontFamily } = settings;

  const setFontFamily = (val: any) => setSettings(prev => ({ ...prev, fontFamily: val }));

  const fontOptions = [
    { id: "inter", label: "Inter UI & Systems", desc: "Clean modern, highly readable sans-serif optimized for numbers." },
    { id: "space", label: "Space Grotesk Accent", desc: "Tech-forward futuristic display headings for neat card grids." },
    { id: "jetbrains", label: "JetBrains Mono Technical", desc: "Monospaced technical columns for pristine financial code tags." }
  ];

  const showLanguage = isFieldVisible("System Language & Dialect", ["language", "dialect", "english", "hindi", "hinglish"]);
  const showTypo = isFieldVisible("Typography Pairings", ["font", "text", "typography", "typeface"]);

  if (!showLanguage && !showTypo) return null;

  return (
    <div className="space-y-6">
      {/* Primary Language */}
      {showLanguage && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            {t("System Language & Dialect")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Set the workspace interface and translation dialect across billing sheets.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "en", label: "English (US)", desc: "Formal business English terminology throughout operations." },
            { id: "hi", label: "हिंदी (Hindi)", desc: "सरकारी जीएसटी दस्तावेज़ीकरण के अनुकूल आधिकारिक हिंदी शब्दावली।" },
            { id: "hinglish", label: "Hinglish (Hinglish)", desc: "Everyday conversational English-Hindi blend for comfortable use." }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage && setLanguage(lang.id as any)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                language === lang.id
                  ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 dark:border-indigo-500"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[12px] font-bold text-gray-900 dark:text-white">{lang.label}</span>
                {language === lang.id && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal mt-2">{lang.desc}</p>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Font Family Preferences */}
      {showTypo && (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-500" />
            {t("Typography Pairings")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Configure default typeface assets loaded per browser viewport.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {fontOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setFontFamily(f.id as any)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                fontFamily === f.id
                  ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 dark:border-blue-500"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[12px] font-bold text-gray-900 dark:text-white">{f.label}</span>
                <span className="text-[10px] font-mono select-none px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {f.id}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};
