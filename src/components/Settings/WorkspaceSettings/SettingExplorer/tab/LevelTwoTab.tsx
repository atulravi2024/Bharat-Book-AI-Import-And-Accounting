import React from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LevelTwoConfig } from "../types";
import { CheckCircle, Activity, ChevronRight, Layers } from "lucide-react";

interface LevelTwoTabProps {
  subpages: LevelTwoConfig[];
  selectedLevelTwoId: string;
  onSelectLevelTwo: (id: string) => void;
  levelOneLabel: string;
}

export const LevelTwoTab: React.FC<LevelTwoTabProps> = ({
  subpages = [],
  selectedLevelTwoId,
  onSelectLevelTwo,
  levelOneLabel
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-2.5">
        <div className="space-y-0.5">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
            {language === "hi" ? "स्तर २: उपश्रेणी इंडेक्स" : "LEVEL 2: SUBPAGE INDEX"}
          </h3>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {language === "hi" 
              ? `${levelOneLabel} के अंतर्गत उपलब्ध कॉन्सर्टेड सब-पेज सेटिंग्स।` 
              : `Available subpage sections operating under ${levelOneLabel}.`}
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
          {subpages.length} {language === "hi" ? "दस्तावेज" : "Sections"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {subpages.map((sub) => {
          const isSelected = sub.id === selectedLevelTwoId;
          const activeTabsCount = sub.tabs.length;
          const configuredTabsCount = sub.tabs.filter(t => t.status === "Configured").length;

          return (
            <button
              key={sub.id}
              onClick={() => onSelectLevelTwo(sub.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between h-auto min-h-[140px] ${
                isSelected 
                  ? "bg-emerald-50/20 dark:bg-emerald-900/10 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/25" 
                  : "bg-white dark:bg-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800 border-gray-200/50 dark:border-gray-800/70"
              }`}
            >
              <div className="w-full flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-[12px] font-black text-slate-800 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {sub.label}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-550">
                      {configuredTabsCount}/{activeTabsCount}
                    </span>
                    <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transitions-all duration-300"
                        style={{ width: `${sub.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight mb-2.5">
                  {sub.description}
                </p>

                {/* Maximum parameters preview */}
                <div className="flex flex-wrap gap-1 mt-auto pb-3">
                  {sub.tabs.slice(0, 3).map(tab => (
                    <span key={tab.id} className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md truncate max-w-[100px] border border-slate-200/50 dark:border-gray-700/50" title={tab.label}>
                      {tab.label}
                    </span>
                  ))}
                  {sub.tabs.length > 3 && (
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 px-1 py-0.5 flex items-center">
                      +{sub.tabs.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full flex items-center justify-between pt-2 border-t border-slate-200/50 bg-transparent text-[9px] font-mono text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 mt-auto">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {activeTabsCount} {language === "hi" ? "कॉन्फ़िगरेशन टैब" : "Interactive Tabs"}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};
