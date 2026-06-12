import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FolderOpen, Layers } from 'lucide-react';
import { MainView } from '../../../app/types';
import { colorThemes } from './utils';

interface DraftsTabProps {
  language: string;
  selectedMainPageId: string | null;
  selectedMainPage: any;
  availableSubpages: any[];
  setView: (view: MainView) => void;
  setActiveSubTab?: (tab: 'modules' | 'drafts' | 'archives') => void;
  handleExploreSubpage: (mainPageId: string | null, subpage: any) => void;
  getSubTheme: (id: string) => { gradient: string; text: string; bg: string; hover: string };
}

export const DraftsTab: React.FC<DraftsTabProps> = ({
  language,
  selectedMainPageId,
  selectedMainPage,
  availableSubpages,
  setView,
  setActiveSubTab,
  handleExploreSubpage,
  getSubTheme
}) => {
  return (
    <motion.div
      key="drafts"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          {selectedMainPageId && (
            <button 
              onClick={() => setActiveSubTab?.('modules')}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          )}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
              {selectedMainPageId ? (
                <>
                  {selectedMainPage?.title} <span className="text-slate-400 dark:text-slate-500 mx-1">›</span> {language === 'hi' ? 'उपपृष्ठ सूची' : 'Subpages List'}
                </>
              ) : (
                <>{language === 'hi' ? 'सभी प्रोजेक्ट उपपृष्ठ' : 'All Project Subpages'}</>
              )}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSubpages.length > 0 ? (
            availableSubpages.map((sub, index) => {
              const SubIcon = sub.icon || FolderOpen;
              const theme = colorThemes[index % colorThemes.length];
              return (
                <div
                  key={`${sub.parentModuleId || ''}-${sub.id}-${index}`}
                  className={`flex flex-col text-left bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 ${theme.hoverBorder} rounded-2xl transition-all duration-300 hover:shadow-md relative overflow-hidden group h-full justify-between`}
                >
                  {/* Card Interactive Area for Drill-down / Exploration */}
                  <button 
                    onClick={() => handleExploreSubpage(selectedMainPageId, sub)}
                    className="p-6 pb-2 text-left w-full h-full cursor-pointer focus:outline-none"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 dark:bg-slate-700/10 rounded-full blur-2xl group-hover:scale-125 transition-transform -z-10 pointer-events-none" />
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} text-white flex items-center justify-center shadow-md shrink-0`}>
                        <SubIcon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-black text-slate-800 dark:text-white flex items-center gap-1 transition-colors ${theme.text.split(' ').map((c: string) => `group-hover:${c}`).join(' ')} truncate`}>
                            {sub.title}
                          </h4>
                          {!selectedMainPageId && sub.parentModuleTitle && (
                            <span className="text-[9px] bg-slate-50 dark:bg-gray-750 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-gray-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                              {sub.parentModuleTitle}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
                          {sub.desc}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Dual Action Buttons Footer */}
                  <div className="px-6 pb-4 pt-3 flex items-center gap-3 w-full animate-fade-in">
                    <button 
                      onClick={() => {
                        const targetPageId = selectedMainPageId || sub.parentModuleId;
                        const navOverride = {
                          page: targetPageId,
                          subPage: sub.id
                        };
                        localStorage.setItem('bharat_book_nav_override', JSON.stringify(navOverride));
                        setView(targetPageId as MainView);
                      }}
                      className={`${sub.tabs.length > 0 ? 'w-1/2' : 'w-full'} py-2 ${theme.bg} ${theme.hover} text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                      title={language === 'hi' ? 'उपपृष्ठ लॉन्च करें' : 'Launch Subpage'}
                    >
                      <span className="truncate">{language === 'hi' ? 'उपपृष्ठ पर जाएं' : 'Go to Sub Page'}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                    {sub.tabs.length > 0 && (
                      <button 
                        onClick={() => handleExploreSubpage(selectedMainPageId, sub)}
                        className={`w-1/2 py-2 ${theme.btnSecondary} text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                        title={language === 'hi' ? 'टैब खोजें' : 'Explore Tabs'}
                      >
                        <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{language === 'hi' ? 'टैब खोजें' : 'Explore Tabs'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-slate-50/50 dark:bg-gray-800/40 p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-750">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 animate-pulse">
                {language === 'hi' ? 'कोई उपपृष्ठ नहीं मिला।' : 'No subpages available.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
