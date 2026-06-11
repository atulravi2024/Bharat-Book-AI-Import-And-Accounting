import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Inbox, ListTodo } from 'lucide-react';
import { colorThemes } from './utils';

interface TabsTabProps {
  language: string;
  selectedSubpageId: string | null;
  selectedSubpage: any;
  availableTabs: any[];
  setActiveSubTab?: (tab: 'modules' | 'drafts' | 'archives') => void;
  getTabTheme: (id: string) => { gradient: string; text: string; bg: string; hover: string };
}

export const TabsTab: React.FC<TabsTabProps> = ({
  language,
  selectedSubpageId,
  selectedSubpage,
  availableTabs,
  setActiveSubTab,
  getTabTheme
}) => {
  return (
    <motion.div
      key="archives"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="space-y-4"
    >
      {!selectedSubpageId ? (
        <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 p-8 sm:p-12 text-center rounded-2xl space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/35 border border-blue-100 dark:border-blue-900/20 text-blue-600 dark:text-blue-450 flex items-center justify-center mx-auto shadow-xs">
            <ListTodo className="w-6 h-6 animate-pulse" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-base font-black text-slate-800 dark:text-white">
              {language === 'hi' ? 'कोई उपपृष्ठ चयनित नहीं है' : 'No Subpage Selected'}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
              {language === 'hi' 
                ? 'विशिष्ट टैब देखने के लिए कृपया Subpages टैब से किसी उपपृष्ठ का चयन करें।' 
                : 'Please select a subpage from the \'Subpages\' tab to explore its specific tabs.'}
            </p>
          </div>
          <button
            onClick={() => setActiveSubTab?.('drafts')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>{language === 'hi' ? 'उपपृष्ठों पर लौटें' : 'Return to Subpages'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setActiveSubTab?.('drafts')}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                {selectedSubpage?.title} <span className="text-slate-400 dark:text-slate-500 mx-1">›</span> {language === 'hi' ? 'टैब' : 'Tabs'}
              </h4>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTabs.map((tab, index) => {
              const TabIcon = tab.icon || Inbox;
              const theme = colorThemes[(index + 3) % colorThemes.length];
              return (
                <div
                  key={tab.id}
                  className="flex flex-col text-left bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 hover:border-blue-500/40 rounded-2xl transition-all duration-300 hover:shadow-md relative overflow-hidden group h-full justify-between"
                >
                  {/* Card Interactive Area */}
                  <button 
                    onClick={tab.action}
                    className="p-6 pb-2 text-left w-full h-full cursor-pointer focus:outline-none"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 dark:bg-slate-700/10 rounded-full blur-2xl group-hover:scale-125 transition-transform -z-10 pointer-events-none" />
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} text-white flex items-center justify-center shadow-md shrink-0`}>
                        <TabIcon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h4 className={`text-sm font-black text-slate-800 dark:text-white flex items-center gap-1 transition-colors ${theme.text.startsWith('text-') ? `group-hover:${theme.text} dark:group-hover:${theme.text.replace('text-', 'text-')}` : theme.text} truncate`}>
                          {tab.title}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
                          {tab.desc}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Direct Launch Buttons Footer */}
                  <div className="px-6 pb-4 pt-3 flex items-center gap-3">
                    <button 
                      onClick={tab.action}
                      className={`flex-1 py-2 ${theme.bg} ${theme.hover} ${theme.text.startsWith('text-') ? theme.text : 'text-emerald-600'} dark:text-emerald-450 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer`}
                      title={language === 'hi' ? 'टैब लॉन्च करें' : 'Launch Tab'}
                    >
                      <span>{language === 'hi' ? 'टैब पर जाएं' : 'Go to Tab'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
