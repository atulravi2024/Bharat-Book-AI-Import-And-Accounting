import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Layers } from 'lucide-react';
import { MainView } from '../../app/types';
import { AnimatePresence } from 'motion/react';
import { getNavigationSchema } from '../../app/navigationSchema';

// Subpage Tab Imports
import { ModulesTab } from './tab/ModulesTab';
import { DraftsTab } from './tab/DraftsTab';
import { TabsTab } from './tab/TabsTab';

// Shared styling and config utils
import { 
  mainIcons, 
  mainColors, 
  getSubTheme, 
  getTabTheme, 
  getSubIcon, 
  getTabIcon 
} from './tab/utils';

interface IndexSubpageProps {
  setView: (view: MainView) => void;
  searchTerm?: string;
  onNavigateToSubpage: (subpage: 'telemetry' | 'security' | 'info') => void;
  activeSubTab?: 'modules' | 'drafts' | 'archives';
  setActiveSubTab?: (tab: 'modules' | 'drafts' | 'archives') => void;
}

export const IndexSubpage: React.FC<IndexSubpageProps> = ({
  setView,
  searchTerm = "",
  activeSubTab = 'modules',
  setActiveSubTab
}) => {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();

  // Selection States for drill-down approach
  const [selectedMainPageId, setSelectedMainPageId] = useState<string | null>(null);
  const [selectedSubpageId, setSelectedSubpageId] = useState<string | null>(null);

  const t = (key: string) => key; // Default translation to English keys
  const schema = getNavigationSchema(t);

  const allTiles = schema.pages.map(page => {
    return {
      id: page.id,
      title: page.label,
      desc: language === 'hi' ? 'मॉड्यूल पर नेविगेट करें' : 'Navigate to module',
      icon: mainIcons[page.id] || Layers,
      color: mainColors[page.id] || 'from-slate-600 to-slate-800',
      tag: language === 'hi' ? 'पेज' : 'Page',
      onClick: () => {
        if (page.id === 'index') {
          // It's the hub itself
          addNotification({
            type: 'System',
            title: language === 'hi' ? 'नेविगेशन हब' : 'Navigation Hub',
            message: language === 'hi' ? 'आप पहले से ही नेविगेशन हब पर हैं।' : 'You are currently on the Navigation Hub.'
          });
        } else {
          setView(page.id as MainView);
        }
      },
      subpages: (schema.subPages[page.id] || []).map(sp => {
        const descText = language === 'hi'
          ? `${sp.label} क्रेडेंशियल और सूची का प्रबंधन करें`
          : `Manage and configure registers for ${sp.label} module.`;
        return {
          id: sp.id,
          title: sp.label,
          desc: descText,
          icon: getSubIcon(sp.id),
          parentModuleId: page.id,
          parentModuleTitle: page.label,
          tabs: (schema.subSubPages[sp.id] || []).map(ssp => {
            const sspDesc = language === 'hi'
              ? `${ssp.label} के लिए विस्तृत क्रेडेंशियल रजिस्टर डेटा`
              : `Access detailed bookkeeping logs for ${ssp.label}.`;
            return {
              id: ssp.id,
              title: ssp.label,
              desc: sspDesc,
              icon: getTabIcon(ssp.id),
              action: () => {
                 const navOverride: any = {
                   page: page.id,
                   subPage: sp.id,
                   subSubPage: ssp.id
                 };
                 
                 localStorage.setItem('bharat_book_nav_override', JSON.stringify(navOverride));
                 setView(page.id as MainView);
              }
            };
          })
        };
      })
    };
  });

  // Dynamic search filtering with deep hierarchy support
  const actionTiles = allTiles.filter(tile => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    const titleMatch = tile.title.toLowerCase().includes(term);
    const descMatch = tile.desc.toLowerCase().includes(term);
    const tagMatch = tile.tag.toLowerCase().includes(term);
    
    // Check if any subpages or tabs under this tile match
    const subpageMatch = tile.subpages.some(sp => {
      const spTitle = sp.title.toLowerCase();
      const spDesc = sp.desc.toLowerCase();
      const sspMatch = sp.tabs.some(ssp => ssp.title.toLowerCase().includes(term) || ssp.desc.toLowerCase().includes(term));
      return spTitle.includes(term) || spDesc.includes(term) || sspMatch;
    });

    return titleMatch || descMatch || tagMatch || subpageMatch;
  });

  const handleExploreMainPage = (mainPageId: string) => {
    setSelectedMainPageId(mainPageId);
    setActiveSubTab?.('drafts'); // Subpages tab
  };

  const handleExploreSubpage = (mainPageId: string | null, subpage: any) => {
    const actualMainPageId = mainPageId || subpage.parentModuleId;
    if (subpage.tabs.length === 0) {
      // Direct jump
      const navOverride = {
        page: actualMainPageId,
        subPage: subpage.id
      };
      localStorage.setItem('bharat_book_nav_override', JSON.stringify(navOverride));
      setView(actualMainPageId as MainView);
    } else {
      setSelectedSubpageId(subpage.id);
      setActiveSubTab?.('archives'); // Tabs tab
    }
  };

  const allSubpagesFromAllTiles = allTiles.flatMap(tile => tile.subpages);
  const selectedMainPage = allTiles.find(t => t.id === selectedMainPageId);
  const availableSubpages = selectedMainPage ? selectedMainPage.subpages : allSubpagesFromAllTiles;

  // Filter Subpages (Drafts)
  const filteredSubpages = availableSubpages.filter(sub => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    const titleMatch = sub.title.toLowerCase().includes(term);
    const descMatch = sub.desc.toLowerCase().includes(term);
    
    const tabMatch = sub.tabs.some(t => t.title.toLowerCase().includes(term) || t.desc.toLowerCase().includes(term));
    return titleMatch || descMatch || tabMatch;
  });

  let selectedSubpage = null;
  for (const tile of allTiles) {
    const sub = tile.subpages.find(s => s.id === selectedSubpageId);
    if (sub) {
      selectedSubpage = sub;
      break;
    }
  }
  const availableTabs = selectedSubpage ? selectedSubpage.tabs : [];

  // Filter Tabs
  const filteredTabs = availableTabs.filter(tab => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    return tab.title.toLowerCase().includes(term) || tab.desc.toLowerCase().includes(term);
  });

  // Local/Global Match Check for Warning Cards
  const hasModulesMatch = actionTiles.length > 0;
  const hasSubpagesMatch = filteredSubpages.length > 0;
  const hasTabsMatch = filteredTabs.length > 0;

  // Let's compute global matches counts across the entire schema
  const globalModulesCount = allTiles.filter(tile => {
    if (!searchTerm) return false;
    const term = searchTerm.toLowerCase().trim();
    const mainMatch = tile.title.toLowerCase().includes(term) || tile.desc.toLowerCase().includes(term) || tile.tag.toLowerCase().includes(term);
    const subMatch = tile.subpages.some(sp => sp.title.toLowerCase().includes(term) || sp.desc.toLowerCase().includes(term) || sp.tabs.some(ssp => ssp.title.toLowerCase().includes(term) || ssp.desc.toLowerCase().includes(term)));
    return mainMatch || subMatch;
  }).length;

  let globalSubpagesCount = 0;
  allTiles.forEach(tile => {
    tile.subpages.forEach(sp => {
      if (!searchTerm) return;
      const term = searchTerm.toLowerCase().trim();
      const mainMatch = sp.title.toLowerCase().includes(term) || sp.desc.toLowerCase().includes(term);
      const tabMatch = sp.tabs.some(ssp => ssp.title.toLowerCase().includes(term) || ssp.desc.toLowerCase().includes(term));
      if (mainMatch || tabMatch) {
        globalSubpagesCount++;
      }
    });
  });

  let globalTabsCount = 0;
  allTiles.forEach(tile => {
    tile.subpages.forEach(sp => {
      sp.tabs.forEach(ssp => {
        if (!searchTerm) return;
        const term = searchTerm.toLowerCase().trim();
        if (ssp.title.toLowerCase().includes(term) || ssp.desc.toLowerCase().includes(term)) {
          globalTabsCount++;
        }
      });
    });
  });

  const renderZeroMatchesCard = (currentCategory: string) => {
    const hasOtherMatches = globalModulesCount > 0 || globalSubpagesCount > 0 || globalTabsCount > 0;
    
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-slate-200 dark:border-gray-700 p-8 sm:p-12 text-center rounded-2xl space-y-4 max-w-2xl mx-auto shadow-sm animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-gray-750 border border-slate-100 dark:border-gray-700 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6 shrink-0 text-slate-400" />
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-black text-slate-800 dark:text-white">
            {language === 'hi'
              ? `[${currentCategory}] श्रेणी में कोई मिलान नहीं मिला`
              : `No matches in [${currentCategory}]`}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
            {language === 'hi'
              ? `सक्रिय फ़िल्टर लागू है। श्रेणी "[${currentCategory}]" के अंतर्गत कोई भी वस्तु आपकी खोज क्वेरी "${searchTerm}" से मेल नहीं खाती है।`
              : `Active filter applied. No items under the "[${currentCategory}]" category match your query "${searchTerm}".`}
          </p>
        </div>

        {hasOtherMatches && (
          <div className="pt-2 border-t border-slate-100 dark:border-gray-700/60 mt-4 space-y-3">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
              {language === 'hi'
                ? 'हालाँकि, अन्य श्रेणियों में मिलान पाए गए हैं। तुरंत कूदने के लिए नीचे चुनें:'
                : 'Matches found in other categories. Select a category below to jump instantly:'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {globalModulesCount > 0 && (
                <button
                  onClick={() => setActiveSubTab?.('modules')}
                  className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black transition-all cursor-pointer border border-blue-150/40 dark:border-blue-900/20 shadow-xs"
                >
                  {language === 'hi' ? 'मुख्य पृष्ठ' : 'Main Page'} ({globalModulesCount})
                </button>
              )}
              {globalSubpagesCount > 0 && (
                <button
                  onClick={() => setActiveSubTab?.('drafts')}
                  className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-450 rounded-xl text-xs font-black transition-all cursor-pointer border border-indigo-150/40 dark:border-indigo-900/20 shadow-xs"
                >
                  {language === 'hi' ? 'उपपृष्ठ' : 'Subpages'} ({globalSubpagesCount})
                </button>
              )}
              {globalTabsCount > 0 && (
                <button
                  onClick={() => setActiveSubTab?.('archives')}
                  className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-450 rounded-xl text-xs font-black transition-all cursor-pointer border border-emerald-150/40 dark:border-emerald-900/25 shadow-xs"
                >
                  {language === 'hi' ? 'टैब' : 'Tabs'} ({globalTabsCount})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="w-full">
        <AnimatePresence mode="wait">
          
          {/* ----- Main Page Tab (Level 1) ----- */}
          {activeSubTab === 'modules' && (
            hasModulesMatch ? (
              <ModulesTab
                language={language}
                actionTiles={actionTiles}
                addNotification={addNotification}
                setView={setView}
                handleExploreMainPage={handleExploreMainPage}
                schema={schema}
              />
            ) : (
              renderZeroMatchesCard(language === 'hi' ? 'मुख्य पृष्ठ' : 'Main Page')
            )
          )}

          {/* ----- Subpages Tab (Level 2) ----- */}
          {activeSubTab === 'drafts' && (
            !hasSubpagesMatch ? (
              renderZeroMatchesCard(language === 'hi' ? 'उपपृष्ठ' : 'Subpages')
            ) : (
              <DraftsTab
                language={language}
                selectedMainPageId={selectedMainPageId}
                selectedMainPage={selectedMainPage}
                availableSubpages={filteredSubpages}
                setView={setView}
                setActiveSubTab={setActiveSubTab}
                handleExploreSubpage={handleExploreSubpage}
                getSubTheme={getSubTheme}
              />
            )
          )}

          {/* ----- Tabs Tab (Level 3) ----- */}
          {activeSubTab === 'archives' && (
            selectedSubpageId && !hasTabsMatch ? (
              renderZeroMatchesCard(language === 'hi' ? 'टैब' : 'Tabs')
            ) : (
              <TabsTab
                language={language}
                selectedSubpageId={selectedSubpageId}
                selectedSubpage={selectedSubpage}
                availableTabs={filteredTabs}
                setActiveSubTab={setActiveSubTab}
                getTabTheme={getTabTheme}
              />
            )
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
