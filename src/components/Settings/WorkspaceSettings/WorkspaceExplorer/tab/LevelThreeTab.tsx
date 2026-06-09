import React from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LevelThreeConfig } from "../types";
import { 
  BadgeCheck, 
  HelpCircle, 
  Clock, 
  ToggleLeft, 
  ToggleRight, 
  ChevronDown, 
  Edit3,
  Calendar
} from "lucide-react";

interface LevelThreeTabProps {
  tabs: LevelThreeConfig[];
  onUpdateValue: (tabId: string, newValue: string | boolean) => void;
  levelTwoLabel: string;
}

export const LevelThreeTab: React.FC<LevelThreeTabProps> = ({
  tabs = [],
  onUpdateValue,
  levelTwoLabel
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-2.5">
        <div className="space-y-0.5">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
            {language === "hi" ? "स्तर ३: कॉन्फ़िगरेशन एवं टैब विवरण" : "LEVEL 3: TAB CONFIGURATION REGISTRY"}
          </h3>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {language === "hi" 
              ? `${levelTwoLabel} के अंतर्निहित विशिष्ट क्रेडेंशियल एवं इंटरैक्टिव पैरामीटर्स।` 
              : `Interactive parameters and specific configurations managed within ${levelTwoLabel}.`}
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
          {tabs.length} {language === "hi" ? "पैरामीटर" : "Params"}
        </div>
      </div>

      <div className="space-y-3">
        {tabs.map((tab) => {
          return (
            <div 
              key={tab.id}
              className="bg-white dark:bg-gray-850 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800/70 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    tab.status === "Configured" 
                      ? "bg-emerald-500 animate-pulse" 
                      : tab.status === "Pending" 
                        ? "bg-amber-500" 
                        : "bg-gray-350 dark:bg-gray-600"
                  }`} />
                  <h4 className="text-[12px] font-bold text-slate-800 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    {tab.label}
                  </h4>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm border font-extrabold uppercase ${
                    tab.status === "Configured"
                      ? "bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/10"
                      : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/10"
                  }`}>
                    {tab.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {tab.description}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[9px] font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === "hi" ? "अंतिम संशोधन:" : "Last Changed:"} {tab.lastUpdated}</span>
                </div>
              </div>

              {/* Dynamic Interactive Input Control */}
              <div className="flex items-center justify-end shrink-0 min-w-[200px]">
                {tab.type === "toggle" && (
                  <button
                    onClick={() => onUpdateValue(tab.id, !tab.currentValue)}
                    className="flex items-center gap-2 cursor-pointer focus:outline-none"
                  >
                    <span className="text-[10px] font-mono text-slate-400">
                      {tab.currentValue 
                        ? (language === "hi" ? "सक्षम" : "ENABLED") 
                        : (language === "hi" ? "अक्षम" : "DISABLED")
                      }
                    </span>
                    {tab.currentValue ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400 Dark:text-gray-600" />
                    )}
                  </button>
                )}

                {tab.type === "select" && (
                  <div className="relative w-full md:w-44">
                    <select
                      value={tab.currentValue as string}
                      onChange={(e) => onUpdateValue(tab.id, e.target.value)}
                      className="w-full pl-2.5 pr-8 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-black text-gray-700 dark:text-gray-300 outline-none cursor-pointer appearance-none"
                    >
                      {tab.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-white dark:bg-gray-850">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                )}

                {tab.type === "input" && (
                  <div className="relative w-full md:w-44 flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2">
                    <Edit3 className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
                    <input
                      type="text"
                      value={tab.currentValue as string}
                      onChange={(e) => onUpdateValue(tab.id, e.target.value)}
                      className="w-full py-1.5 bg-transparent text-[11px] font-black text-gray-700 dark:text-gray-300 outline-none placeholder:text-gray-400"
                    />
                  </div>
                )}

                {tab.type === "info" && (
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                    {tab.currentValue}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
