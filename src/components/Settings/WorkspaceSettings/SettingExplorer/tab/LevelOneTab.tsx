import React, { useState } from "react";
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
  Database,
  LayoutGrid,
  List
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
            {language === "hi" ? "सेटिंग्स के सभी मुख्य मॉड्यूलों की सूची और वर्तमान कवर स्थिति।" : "Overview of all top-level settings configurations and initialization scores."}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200/60 dark:border-gray-700/50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded-md transition-all ${
                viewMode === "grid" 
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              title={language === "hi" ? "ग्रिड व्यू" : "Grid Card View"}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded-md transition-all ${
                viewMode === "list" 
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              title={language === "hi" ? "सूची व्यू" : "List / Table View"}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
            {levels.length} {language === "hi" ? "रजिस्ट्रियां" : "Registries"}
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {levels.map((level) => {
            const isSelected = level.id === selectedLevelOneId;
            const totalSubpages = level.subpages.length;
            const avgProgress = Math.round(level.subpages.reduce((acc, sub) => acc + sub.progress, 0) / (totalSubpages || 1));

            return (
              <button
                key={level.id}
                onClick={() => onSelectLevelOne(level.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between h-auto min-h-[144px] ${
                  isSelected 
                    ? "bg-indigo-50/40 dark:bg-indigo-900/10 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/25" 
                    : "bg-white dark:bg-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800 border-gray-200/50 dark:border-gray-800/70"
                }`}
              >
                <div className="w-full flex-1 flex flex-col">
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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight mb-2.5">
                    {level.description}
                  </p>
                  
                  {/* Maximum level two subpages */}
                  <div className="flex flex-wrap gap-1 mt-auto pb-3">
                    {level.subpages.slice(0, 3).map(sub => (
                      <span key={sub.id} className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md truncate max-w-[85px] border border-slate-200/50 dark:border-gray-700/50">
                        {sub.label}
                      </span>
                    ))}
                    {level.subpages.length > 3 && (
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 px-1 py-0.5 flex items-center">
                        +{level.subpages.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full flex items-center justify-between pt-2 border-t border-slate-200/55 bg-transparent text-[9px] font-mono text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 mt-auto">
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
      ) : (
        <div className="border border-slate-200/60 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-850">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-gray-900/80 border-b border-slate-150 dark:border-gray-800 text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                <th className="py-2.5 px-4 font-bold">{language === "hi" ? "रजिस्ट्री" : "REGISTRY"}</th>
                <th className="py-2.5 px-4 hidden md:table-cell font-bold">{language === "hi" ? "विवरण" : "DESCRIPTION"}</th>
                <th className="py-2.5 px-4 text-center font-bold">{language === "hi" ? "उपश्रेणियां" : "SUBPAGES"}</th>
                <th className="py-2.5 px-4 text-right font-bold pr-6">{language === "hi" ? "पूर्णता प्रतिशत" : "PROGRESS"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-gray-850">
              {levels.map((level) => {
                const isSelected = level.id === selectedLevelOneId;
                const totalSubpages = level.subpages.length;
                const avgProgress = Math.round(level.subpages.reduce((acc, sub) => acc + sub.progress, 0) / (totalSubpages || 1));

                return (
                  <tr 
                    key={level.id}
                    onClick={() => onSelectLevelOne(level.id)}
                    className={`group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-all ${
                      isSelected ? "bg-indigo-50/20 dark:bg-indigo-900/5 font-bold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-800 dark:text-white max-w-[200px]">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-gray-850 border border-slate-100 dark:border-gray-750 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          {getIcon(level.iconName)}
                        </div>
                        <div className="min-w-0">
                          <div className={`font-black text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate ${isSelected ? "text-indigo-600 dark:text-indigo-450" : ""}`}>
                            {level.label}
                          </div>
                          <div className="md:hidden text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 line-clamp-1 font-normal">{level.description}</div>
                          
                          {/* Maximum subpages for mobile view */}
                          <div className="flex flex-wrap gap-1 mt-1.5 md:hidden">
                            {level.subpages.slice(0, 2).map(sub => (
                              <span key={sub.id} className="text-[8px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-800 px-1 py-0.5 rounded truncate max-w-[75px] border border-slate-200/50 dark:border-gray-700/50">
                                {sub.label}
                              </span>
                            ))}
                            {level.subpages.length > 2 && (
                              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 px-0.5 py-0.5 leading-none self-center">
                                +{level.subpages.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell max-w-sm">
                      <div className="truncate mb-1.5">{level.description}</div>
                      {/* Maximum subpages for desktop view */}
                      <div className="flex flex-wrap gap-1">
                        {level.subpages.slice(0, 3).map(sub => (
                          <span key={sub.id} className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md truncate max-w-[100px] border border-slate-200/50 dark:border-gray-700/50">
                            {sub.label}
                          </span>
                        ))}
                        {level.subpages.length > 3 && (
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 px-1 py-0.5 flex items-center">
                            +{level.subpages.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                        <Database className="w-3 h-3 text-slate-400" />
                        {totalSubpages}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right pr-6">
                      <div className="inline-flex items-center justify-end gap-3 w-full">
                        <div className="w-16 bg-slate-100 dark:bg-gray-800 rounded-full h-1.5 hidden sm:block overflow-hidden border border-slate-200/20">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              avgProgress === 100 ? "bg-emerald-500" : avgProgress > 50 ? "bg-amber-500" : "bg-slate-400"
                            }`} 
                            style={{ width: `${avgProgress}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded border leading-none ${
                          avgProgress === 100 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40" 
                            : avgProgress > 50 
                              ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40" 
                              : "bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        }`}>
                          {avgProgress}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
