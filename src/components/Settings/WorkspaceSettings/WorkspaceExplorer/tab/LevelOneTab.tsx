import React from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LevelOneConfig } from "../types";
import { 
  Settings, 
  Paintbrush, 
  DollarSign, 
  Globe, 
  Sliders, 
  Maximize, 
  FileText,
  ChevronRight,
  Database
} from "lucide-react";

interface LevelOneTabProps {
  levels: LevelOneConfig[];
  selectedLevelOneId: string;
  onSelectLevelOne: (id: string) => void;
}

export const LevelOneTab: React.FC<LevelOneTabProps> = ({
  levels,
  selectedLevelOneId,
  onSelectLevelOne
}) => {
  const { language } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "settings": return <Settings className="w-5 h-5 text-indigo-500" />;
      case "paint": return <Paintbrush className="w-5 h-5 text-pink-500" />;
      case "dollar": return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case "globe": return <Globe className="w-5 h-5 text-blue-500" />;
      case "sliders": return <Sliders className="w-5 h-5 text-amber-500" />;
      case "maximize": return <Maximize className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-2.5">
        <div className="space-y-0.5">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
            {language === "hi" ? "स्तर १: मुख्य व्यवस्थापन इंडेक्स" : "LEVEL 1: MAIN REGISTRY INDEX"}
          </h3>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-450">
            {language === "hi" ? "वर्कस्पेस के सभी मुख्य मॉड्यूलों की सूची और वर्तमान कवर स्थिति।" : "Overview of all top-level workspace configurations and initialization scores."}
          </p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
          {levels.length} {language === "hi" ? "रजिस्ट्रियां" : "Registries"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {levels.map((level) => {
          const isSelected = level.id === selectedLevelOneId;
          const totalSubpages = level.subpages.length;
          const avgProgress = Math.round(level.subpages.reduce((acc, sub) => acc + sub.progress, 0) / (totalSubpages || 1));

          return (
            <button
              key={level.id}
              onClick={() => onSelectLevelOne(level.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between h-36 ${
                isSelected 
                  ? "bg-indigo-50/40 dark:bg-indigo-900/10 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/25" 
                  : "bg-white dark:bg-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800 border-gray-200/50 dark:border-gray-800/70"
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-gray-850 border border-slate-100 dark:border-gray-750 flex items-center justify-center shrink-0">
                    {getIcon(level.iconName)}
                  </div>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                    avgProgress === 100 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40" 
                      : avgProgress > 50 
                        ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40" 
                        : "bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800"
                  }`}>
                    {avgProgress}% {language === "hi" ? "पूर्ण" : "READY"}
                  </span>
                </div>
                <h4 className="text-[12px] font-black text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {level.label}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                  {level.description}
                </p>
              </div>

              <div className="w-full flex items-center justify-between pt-2 border-t border-slate-200/55 bg-transparent text-[9px] font-mono text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {totalSubpages} {language === "hi" ? "उपश्रेणियां" : "Subpages"}
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
