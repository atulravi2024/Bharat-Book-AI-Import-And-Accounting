import React, { useState, useEffect } from "react";
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
  Info
} from "lucide-react";

export const WorkspaceExplorer: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Default mock hierarchy database structured precisely by levels
  const getInitialLevels = (): LevelOneConfig[] => [
    {
      id: "general",
      label: language === "hi" ? "सामान्य सेटिंग्स" : "General Settings",
      description: language === "hi" ? "भाषा, थीम, सुरक्षा लॉक और पंक्ति अनुकूलन" : "Interface languages, density scales, safety locks and local zones",
      iconName: "settings",
      subpages: [
        {
          id: "general_pref",
          label: language === "hi" ? "इंटरफ़ेस प्राथमिकताएं" : "System Interface Preferences",
          description: language === "hi" ? "थीम अनुकूलन, ध्वनि प्रभाव और प्रदर्शन संकेतक" : "Display styling options, default sound effects and transition animations",
          progress: 80,
          tabs: [
            {
              id: "gen_theme",
              label: language === "hi" ? "इंटरफ़ेस डार्क/लाइट थीम" : "Interface Active Theme",
              description: language === "hi" ? "डार्क मोड या लाइट मोड" : "Adjust workspace between system dark mode and slate-white theme",
              status: "Configured",
              lastUpdated: "2026-06-09",
              type: "select",
              currentValue: "Light Theme",
              options: ["Light Theme", "Dark Theme", "System Default"]
            },
            {
              id: "gen_sounds",
              label: language === "hi" ? "ऑडियो अलर्ट संकेत" : "Haptic Sound Overrides",
              description: language === "hi" ? "ऑपरेशन पूर्ण होने पर ध्वनियां सक्षम करें" : "Toggle interface confirmation chime alerts",
              status: "Configured",
              lastUpdated: "2026-06-08",
              type: "toggle",
              currentValue: true
            },
            {
              id: "gen_animations",
              label: language === "hi" ? "मोशन एनिमेशन प्रभाव" : "UI Transitions & Animations",
              description: language === "hi" ? "पृष्ठ संक्रमण सहज मोशन" : "Smooth transition visual motion during navigation and menus",
              status: "Pending",
              lastUpdated: "2026-06-09",
              type: "toggle",
              currentValue: false
            }
          ]
        },
        {
          id: "general_security",
          label: language === "hi" ? "ऑटो सुरक्षा लॉक" : "Inactivity Security Controls",
          description: language === "hi" ? "निष्क्रियता सुरक्षा और लॉकआउट अवधि" : "Periodic session logout parameters for dormant systems",
          progress: 100,
          tabs: [
            {
              id: "sec_lock_time",
              label: language === "hi" ? "ऑटो-लॉकआउट अंतराल मिनट" : "Auto Lock Trigger Interval",
              description: language === "hi" ? "निष्क्रिय होने पर लॉक करने का समय" : "Duration in minutes of total user inactivity before force lockout",
              status: "Configured",
              lastUpdated: "2026-06-09",
              type: "select",
              currentValue: "15 minutes",
              options: ["5 minutes", "15 minutes", "30 minutes", "1 hour"]
            },
            {
              id: "sec_dual_auth",
              label: language === "hi" ? "बहु-स्तरीय प्रमाणीकरण" : "Multi-factor Vault Verification",
              description: language === "hi" ? "महत्वपूर्ण ऑपरेशन्स पर सुरक्षा कोड सत्यापन" : "Prompts secondary auth before executing massive deletions or data imports",
              status: "Configured",
              lastUpdated: "2026-06-07",
              type: "toggle",
              currentValue: true
            }
          ]
        }
      ]
    },
    {
      id: "ui",
      label: language === "hi" ? "यूआई लेआउट और रंग" : "UI Schemes & Theme",
      description: language === "hi" ? "लेआउट घनत्व, प्राथमिक रंग पैलेट और स्थानिक विड्थ" : "Navigation layouts, density controls and brand color palettes",
      iconName: "paint",
      subpages: [
        {
          id: "ui_density",
          label: language === "hi" ? "साइडबार और बटन घनत्व" : "Toolbar Spacing & Density",
          description: language === "hi" ? "घनत्व का स्केल (सहज बनाम सघन)" : "Controls grid rows and navigation panel spacing heights",
          progress: 50,
          tabs: [
            {
              id: "dens_mode",
              label: language === "hi" ? "घनत्व लेआउट प्रकार" : "Active Grid Density Mode",
              description: language === "hi" ? "घनत्व विनिर्देश का चयन करें" : "Compact layout (dense lists) versus comfortable (high padding)",
              status: "Configured",
              lastUpdated: "2026-06-09",
              type: "select",
              currentValue: "Compact Mode",
              options: ["Comfortable Mode", "Compact Mode", "Ultra Dense Mode"]
            },
            {
              id: "dens_sidebar_collapse",
              label: language === "hi" ? "साइडबार संकुचन मोड" : "Sidebar Icon-Only Behavior",
              description: language === "hi" ? "साइडबार को केवल आइकन विनिर्देश पर छोटा करें" : "Minimize left navigator permanently to optimize worksheet area",
              status: "Pending",
              lastUpdated: "2026-06-05",
              type: "toggle",
              currentValue: false
            }
          ]
        },
        {
          id: "ui_palette",
          label: language === "hi" ? "रंग योजनाएं" : "Primary Branding Colorway",
          description: language === "hi" ? "हेडर थीम और प्राथमिक ब्रांड का मुख्य शेड" : "Adjust main visual identity tint and highlights across screens",
          progress: 100,
          tabs: [
            {
              id: "col_accent",
              label: language === "hi" ? "प्राथमिक यूआई मुख्य रंग" : "Primary Accent Palette",
              description: language === "hi" ? "सक्रिय नियंत्रणों के लिए रंग हाइलाइट" : "Main visual color applied to headers, primary action buttons, and accents",
              status: "Configured",
              lastUpdated: "2026-06-09",
              type: "select",
              currentValue: "Classic Navy",
              options: ["Classic Navy", "Teal Fusion", "Deep Emerald", "Cosmic Slate"]
            }
          ]
        }
      ]
    },
    {
      id: "firm",
      label: language === "hi" ? "ऑडिट फर्म विनिर्देश" : "Firm & Company Profile",
      description: language === "hi" ? "कंपनी की मूल जानकारी, जीएसटी नंबर और वित्तीय वर्ष प्रबंधन" : "Company metadata, corporate addresses and fiscal cycles",
      iconName: "dollar",
      subpages: [
        {
          id: "firm_profile",
          label: language === "hi" ? "फाइलिंग और कॉर्पोरेट प्रोफाइल" : "Enterprise Identity Registration",
          description: language === "hi" ? "फर्म का कानूनी नाम और व्यापारिक रिकॉर्ड नंबर" : "Corporate registry profiles and official taxation identities",
          progress: 100,
          tabs: [
            {
              id: "reg_name",
              label: language === "hi" ? "फर्म का पंजीकृत कानूनी नाम" : "Registered Legal Trade Name",
              description: language === "hi" ? "बहीखाता और बिलिंग प्रलेखन के लिए कानूनी नाम" : "Authorized parent corporate organization title used in GST invoices",
              status: "Configured",
              lastUpdated: "2026-06-09",
              type: "input",
              currentValue: "BHARAT BOOK AUDITS PVT LTD"
            },
            {
              id: "reg_gstin",
              label: language === "hi" ? "जीएसटीआईएन (GSTIN) पहचान संख्या" : "GSTIN Registration Master ID",
              description: language === "hi" ? "आधिकारिक १५-अंकीय कराधान पहचान विनिर्देश" : "Government issues identity tag for compliance documentation and tracking",
              status: "Configured",
              lastUpdated: "2026-06-06",
              type: "input",
              currentValue: "07AAAAA1111A1Z1"
            }
          ]
        }
      ]
    }
  ];

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

  useEffect(() => {
    const checkOverride = () => {
      const override = localStorage.getItem('bharat_book_workspace_subtab_override');
      if (override) {
        if (["general", "ui", "firm"].includes(override)) {
          setActiveLevelOneId(override);
        } else {
          // If it matches a subpage id, let's find which LevelOne has it
          for (const l1 of levels) {
            const found = l1.subpages.find(s => s.id === override);
            if (found) {
              setActiveLevelOneId(l1.id);
              setActiveLevelTwoId(override);
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
  }, [activeLevelOneId]);

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
    setLevels(cleared);
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
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
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-750 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/35 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500"
            >
              ×
            </button>
          )}
        </div>

        {/* Compact same-row Action controls */}
        <div className="flex flex-row items-center gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0">
          <button
            onClick={handleReset}
            className="px-2.5 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-red-650 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            title={language === "hi" ? "पूर्वनियत रीसेट" : "Reset Defaults"}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline leading-none">{language === "hi" ? "रीसेट" : "Reset"}</span>
          </button>

          <button
            onClick={handleClear}
            className="px-2.5 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-orange-655 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            title={language === "hi" ? "सारे मान साफ करें" : "Clear Values"}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline leading-none">{language === "hi" ? "साफ करें" : "Clear"}</span>
          </button>

          <div className="hidden sm:block w-px h-3.5 bg-gray-350 dark:bg-gray-600 mx-1 shrink-0" />

          <button
            onClick={handleSave}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer ${
              isSaved 
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" 
                : "bg-indigo-650 text-white hover:bg-indigo-700"
            }`}
            title={language === "hi" ? "बदलाव सहेजें" : "Save Changes"}
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-bounce" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline leading-none">
              {isSaved 
                ? (language === "hi" ? "सहेजा गया" : "Saved") 
                : (language === "hi" ? "सुरक्षित करें" : "Save")
              }
            </span>
          </button>
        </div>
      </div>

      {/* Main Levels Hierarchy Layout Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Level One and Level Two Registry Directories */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Level One Component Sheet */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-4 rounded-xl shadow-xs">
            <LevelOneTab 
              levels={filteredLevels}
              selectedLevelOneId={activeLevelOneId}
              onSelectLevelOne={(id) => {
                setActiveLevelOneId(id);
                const firstSub = levels.find(l => l.id === id)?.subpages[0];
                if (firstSub) setActiveLevelTwoId(firstSub.id);
              }}
            />
          </div>

          {/* Level Two Component Sheet (Dynamically driven by selected Level One) */}
          {activeLevelOne && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-4 rounded-xl shadow-xs">
              <LevelTwoTab 
                subpages={activeLevelOne.subpages}
                selectedLevelTwoId={activeLevelTwoId}
                onSelectLevelTwo={(id) => setActiveLevelTwoId(id)}
                levelOneLabel={activeLevelOne.label}
              />
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Level Three Detailed Parameters Sheet */}
        <div className="lg:col-span-8">
          {activeLevelTwo ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-4">
              <LevelThreeTab 
                tabs={activeLevelTwo.tabs}
                onUpdateValue={handleUpdateLevelThreeValue}
                levelTwoLabel={activeLevelTwo.label}
              />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200/55 dark:border-gray-800 p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3">
              <Network className="w-10 h-10 text-slate-400 dark:text-slate-500 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-350 uppercase tracking-wide">
                {language === "hi" ? "रजिस्ट्री उपश्रेणी का चयन करें" : "SELECT REGISTRY SUBPAGE"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                {language === "hi" 
                  ? "विशिष्ट टैब क्रेडेंशियल्स और लाइव संपादन पैरामीटर देखने के लिए बाईं ओर से एक उपश्रेणी का चयन करें।" 
                  : "Pick any Level 2 subpage under active registries on the left column to populate the detailed parameters sheet."
                }
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
