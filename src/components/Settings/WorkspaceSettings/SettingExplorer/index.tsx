import { getExpandedLevels } from "./levelsData";
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { LevelOneConfig } from "./types";
import { LevelOneTab } from "./tab/LevelOneTab";
import { LevelTwoTab } from "./tab/LevelTwoTab";
import { LevelThreeTab } from "./tab/LevelThreeTab";
import { 
  Network, 
  RotateCcw, 
  Save, 
  FolderSync, 
  Trash2,
  CheckCircle2,
  Search,
  Eye,
  Settings,
  Info,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  FileJson,
  FileText
} from "lucide-react";

export const SettingExplorer: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [targetFormat, setTargetFormat] = useState<"json" | "csv">("json");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Default comprehensive hierarchy database structured precisely by levels representing real ERP registry configurations
  const getInitialLevels = (): LevelOneConfig[] => getExpandedLevels(language);


  const [levels, setLevels] = useState<LevelOneConfig[]>(() => {
    const saved = localStorage.getItem("bharat_book_workspace_explorer_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getInitialLevels();
      }
    }
    return getInitialLevels();
  });

  const [activeLevelOneId, setActiveLevelOneId] = useState<string>("general");
  const [activeLevelTwoId, setActiveLevelTwoId] = useState<string>("general_pref");
  const [activeTab, setActiveTab] = useState<"level_one" | "level_two" | "level_three">("level_one");

  useEffect(() => {
    const checkOverride = () => {
      const override = localStorage.getItem('bharat_book_workspace_subtab_override');
      if (override) {
        if (["general", "ui", "firm"].includes(override)) {
          setActiveLevelOneId(override);
          setActiveTab("level_one");
        } else {
          // If it matches a subpage id, let's find which LevelOne has it
          for (const l1 of levels) {
            const found = l1.subpages.find(s => s.id === override);
            if (found) {
              setActiveLevelOneId(l1.id);
              setActiveLevelTwoId(override);
              setActiveTab("level_two");
              break;
            }
          }
        }
        localStorage.removeItem('bharat_book_workspace_subtab_override');
      }
    };
    checkOverride();
    window.addEventListener('bharat_book_workspace_subtab_trigger', checkOverride);
    return () => window.removeEventListener('bharat_book_workspace_subtab_trigger', checkOverride);
  }, [levels]);

  const activeLevelOne = levels.find(l => l.id === activeLevelOneId) || levels[0];
  const activeLevelTwo = activeLevelOne?.subpages.find(s => s.id === activeLevelTwoId) || activeLevelOne?.subpages[0];

  useEffect(() => {
    if (activeLevelOne) {
      const firstSubpage = activeLevelOne.subpages[0];
      if (firstSubpage && !activeLevelOne.subpages.some(s => s.id === activeLevelTwoId)) {
        setActiveLevelTwoId(firstSubpage.id);
      }
    }
  }, [activeLevelOneId, activeLevelTwoId]);

  const handleUpdateLevelThreeValue = (tabId: string, newValue: string | boolean) => {
    const updatedLevels = levels.map((l1) => {
      return {
        ...l1,
        subpages: l1.subpages.map((l2) => {
          let hasChange = false;
          const updatedTabs = l2.tabs.map((l3) => {
            if (l3.id === tabId) {
              hasChange = true;
              return {
                ...l3,
                currentValue: newValue,
                status: "Configured" as const,
                lastUpdated: new Date().toISOString().substring(0, 10)
              };
            }
            return l3;
          });

          if (hasChange) {
            // Recalculate progress: percentage of Configured tabs
            const configuredCount = updatedTabs.filter(t => t.status === "Configured").length;
            const progress = Math.round((configuredCount / updatedTabs.length) * 100);
            return {
              ...l2,
              tabs: updatedTabs,
              progress
            };
          }
          return l2;
        })
      };
    });

    setLevels(updatedLevels);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (targetFormat === "json") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(levels, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "bharat_book_master_config.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else if (targetFormat === "csv") {
      const rows = [["Level", "Subpage", "Parameter", "Value"]];
      levels.forEach(l1 => {
        l1.subpages.forEach(l2 => {
          l2.tabs.forEach(p => {
             rows.push([l1.label, l2.label, p.label, String(p.currentValue)]);
          })
        })
      });
      const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(item => `"${item}"`).join(",")).join("\n");
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", encodeURI(csvContent));
      downloadAnchorNode.setAttribute("download", "bharat_book_master_config.csv");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        if (Array.isArray(obj)) {
          setLevels(obj as LevelOneConfig[]);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        }
      } catch (error) {
        console.error("Invalid Configuration File");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    localStorage.setItem("bharat_book_workspace_explorer_data", JSON.stringify(levels));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    const fresh = getInitialLevels();
    setLevels(fresh);
    localStorage.setItem("bharat_book_workspace_explorer_data", JSON.stringify(fresh));
  };

  const handleClear = () => {
    const cleared = levels.map((l1) => ({
      ...l1,
      subpages: l1.subpages.map((l2) => ({
        ...l2,
        progress: 0,
        tabs: l2.tabs.map((l3) => ({
          ...l3,
          currentValue: l3.type === "toggle" ? false : "",
          status: "Pending" as const,
          lastUpdated: new Date().toISOString().substring(0, 10)
        }))
      }))
    }));
    setLevels(cleared as LevelOneConfig[]);
  };

  const filteredLevels = levels.filter((l1) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const l1Match = l1.label.toLowerCase().includes(term) || l1.description.toLowerCase().includes(term);
    const subpageMatch = l1.subpages.some(l2 => 
      l2.label.toLowerCase().includes(term) || 
      l2.description.toLowerCase().includes(term) ||
      l2.tabs.some(l3 => l3.label.toLowerCase().includes(term) || l3.description.toLowerCase().includes(term))
    );
    return l1Match || subpageMatch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      
      {/* Compact Header Row matching premium design style representing mobile stacked & desktop single row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden justify-between">
        <div className="flex items-center gap-3 shrink-0 sm:max-w-[40%]">
          <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
            <Network className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">
              {language === "hi" ? "सेटिंग्स एक्सप्लोरर" : "Setting Explorer"}
            </h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate whitespace-nowrap">
              {language === "hi" ? "व्यापक सिस्टम रजिस्ट्री, वैश्विक व्यवहार और उन्नत कॉन्फ़िगरेशन पैरामीटर।" : "Comprehensive system registry, global behaviors, and advanced module parameters."}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1 flex justify-end">
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar w-auto border border-gray-200/40 dark:border-gray-700/40 shrink-0 justify-end">
            {[
              { id: "level_one", label: language === "hi" ? "स्तर १: मुख्य" : "Level 1: Registry" },
              { id: "level_two", label: language === "hi" ? "स्तर २: उपश्रेणी" : "Level 2: Sub-pages" },
              { id: "level_three", label: language === "hi" ? "स्तर ३: क्रेडेंशियल्स" : "Level 3: Parameters" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start cursor-pointer ${
                    isActive 
                      ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm font-black' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30 font-bold'
                  }`}
                >
                  <span className="leading-none">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Compact Action Controls Header Row */}
      <div className="bg-white dark:bg-gray-900 p-2 sm:p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm flex flex-row items-center justify-between gap-3 overflow-hidden">
        
        {/* Search Input widget */}
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={language === "hi" ? "रजिस्ट्री सेटिंग्स खोजें..." : "Search registry settings..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-750 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/35 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500"
            >
              ×
            </button>
          )}
        </div>

        {/* Compact same-row Action controls */}
        <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${(isSearchFocused || searchTerm) ? "hidden sm:flex" : "flex"}`}>
           <div className="relative inline-flex items-center shrink-0">
             <select
               value={targetFormat}
               onChange={(e) => setTargetFormat(e.target.value as "json" | "csv")}
               className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
               title={language === "hi" ? "इनपुट और आउटपुट प्रारूप" : "Input and Output Format"}
             >
               <option value="json" className="bg-white dark:bg-gray-800">{language === "hi" ? "JSON" : "JSON"}</option>
               <option value="csv" className="bg-white dark:bg-gray-800">{language === "hi" ? "CSV" : "CSV"}</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
               <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                 <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
               </svg>
             </div>
           </div>
           
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportChange} 
            accept={targetFormat === "json" ? ".json" : ".csv"} 
            className="hidden" 
          />
           <button
             onClick={handleImportClick}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
             title={language === "hi" ? "आयात कॉन्फ़िग" : "Import Config"}
           >
             <Upload className="w-3.5 h-3.5 shrink-0" />
             <span className="hidden lg:inline leading-none">{language === "hi" ? "आयात करें" : "Import"}</span>
           </button>
           
           <button
             onClick={handleExport}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
             title={language === "hi" ? "निर्यात कॉन्फ़िग" : "Export Config"}
           >
             <Download className="w-3.5 h-3.5 shrink-0" />
             <span className="hidden lg:inline leading-none">{language === "hi" ? "निर्यात करें" : "Export"}</span>
           </button>

           <button
             onClick={handleClear}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
             title={language === "hi" ? "सारे बदलाव हटाएं / साफ करें" : "Delete / Clear Changes"}
           >
             <Trash2 className="w-3.5 h-3.5 shrink-0" />
             <span className="hidden lg:inline leading-none">{language === "hi" ? "साफ करें" : "Clear"}</span>
           </button>

           <button
             onClick={handleReset}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
             title={language === "hi" ? "पूर्वनियत रीसेट" : "Reset Defaults"}
           >
             <RotateCcw className="w-3.5 h-3.5 shrink-0" />
             <span className="hidden lg:inline leading-none">{language === "hi" ? "रीसेट" : "Reset"}</span>
           </button>

           <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-700 mx-1 shrink-0"></div>

           <button
             onClick={handleSave}
             className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer ${
               isSaved 
                 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100" 
                 : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 border border-transparent"
             }`}
             title={language === "hi" ? "बदलाव सहेजें" : "Save Changes"}
           >
             {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-bounce shrink-0" /> : <Save className="w-4 h-4 shrink-0" strokeWidth={2} />}
             <span className="hidden lg:inline leading-none">
               {isSaved 
                 ? (language === "hi" ? "सहेजा गया" : "Saved") 
                 : (language === "hi" ? "सहेजें" : "Save")
               }
             </span>
           </button>
        </div>
      </div>

      {/* Main Levels tab split views wrapper */}
      <div className="space-y-4">
        {activeTab === "level_one" && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-4 rounded-xl shadow-xs animate-in fade-in duration-200">
            <LevelOneTab 
              levels={filteredLevels}
              selectedLevelOneId={activeLevelOneId}
              onSelectLevelOne={(id) => {
                setActiveLevelOneId(id);
                const firstSub = levels.find(l => l.id === id)?.subpages[0];
                if (firstSub) setActiveLevelTwoId(firstSub.id);
                setActiveTab("level_two");
              }}
            />
          </div>
        )}

        {activeTab === "level_two" && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-4 rounded-xl shadow-xs animate-in fade-in duration-200">
            {activeLevelOne ? (
              <LevelTwoTab 
                subpages={activeLevelOne.subpages}
                selectedLevelTwoId={activeLevelTwoId}
                onSelectLevelTwo={(id) => {
                  setActiveLevelTwoId(id);
                  setActiveTab("level_three");
                }}
                levelOneLabel={activeLevelOne.label}
              />
            ) : (
              <div className="text-center py-10 flex flex-col items-center justify-center space-y-2">
                <Info className="w-8 h-8 text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === "hi" ? "कृपया पहले स्तर १ पर जाएं और एक मुख्य श्रेणी चुनें।" : "Please go to Level 1 and select a main category first."}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "level_three" && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-5 rounded-2xl shadow-sm animate-in fade-in duration-200">
            {activeLevelTwo ? (
              <LevelThreeTab 
                tabs={activeLevelTwo.tabs}
                onUpdateValue={handleUpdateLevelThreeValue}
                levelTwoLabel={activeLevelTwo.label}
              />
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-3">
                <Network className="w-10 h-10 text-slate-400 dark:text-slate-500 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-350 uppercase tracking-wide">
                  {language === "hi" ? "कोई उपश्रेणी चयनित नहीं है" : "NO SUBPAGE SELECTED"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-450 max-w-sm">
                  {language === "hi" 
                    ? "पहले स्तर २ पर वापस जाएं और विशिष्ट मापदंडों को देखने के लिए एक उपश्रेणी का चयन करें।" 
                    : "Please return to Level 2 and select a subpage first to view its parameters."
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
