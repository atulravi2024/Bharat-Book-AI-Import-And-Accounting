import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import { getTabIcon, colorThemes } from './utils';

interface TabsTabProps {
  language: string;
  selectedSubpageId: string | null;
  selectedSubpage: any;
  availableTabs: any[];
  setActiveSubTab: (tab: any) => void;
  getTabTheme: (id: string) => { gradient: string; text: string; bg: string; hover: string; };
}

export const TabsTab: React.FC<TabsTabProps> = ({
  language,
  selectedSubpageId,
  selectedSubpage,
  availableTabs,
  setActiveSubTab,
  getTabTheme,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => {
            setActiveSubTab('drafts');
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {selectedSubpage?.label || 'Subpage'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'hi' ? 'संचालन के लिए उपयुक्त अनुभाग चुनें' : 'Select a functional tab module'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {availableTabs.map((ssp, index) => {
            const isDone = false; // Add actual logic if needed
            const idToCompare = ssp.id.toLowerCase();
            const theme = colorThemes[index % colorThemes.length];
            const TabIcon = getTabIcon(idToCompare, isDone);
            return (
              <motion.div
                key={ssp.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`flex flex-col text-left bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 ${theme.hoverBorder} rounded-2xl transition-all duration-300 hover:shadow-md relative overflow-hidden group h-full justify-between`}
              >
                {/* Clickable Card Body */}
                <button
                  onClick={ssp.action}
                  className="p-5 pb-2 text-left w-full h-full cursor-pointer focus:outline-none flex-1 min-w-0"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 dark:bg-slate-700/10 rounded-full blur-2xl group-hover:scale-125 transition-transform -z-10 pointer-events-none" />
                  <div className="w-full flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg shrink-0 bg-gradient-to-br ${theme.gradient} text-white shadow-xs`}>
                      <TabIcon className="w-4 h-4" />
                    </div>
                    {isDone && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        {language === 'hi' ? 'पूर्ण' : 'DONE'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className={`font-black text-sm transition-colors ${theme.text.split(' ').map((c: string) => `group-hover:${c}`).join(' ')}`}>
                      {ssp.label || ssp.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
                      {ssp.desc}
                    </p>
                  </div>
                </button>

                {/* Direct Action Button Footer */}
                <div className="px-5 pb-4 pt-3 w-full animate-fade-in">
                  <button 
                    onClick={ssp.action}
                    className={`w-full py-2 ${theme.bg} ${theme.hover} text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                    title={language === 'hi' ? 'टैब लॉन्च करें' : 'Launch Tab'}
                  >
                    <span>{language === 'hi' ? 'टैब पर जाएं' : 'Go to Tab'}</span>
                    <ArrowLeft className="w-3.5 h-3.5 shrink-0 rotate-180" />
                  </button>
                </div>
              </motion.div>
            );
          })}
          {availableTabs.length === 0 && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl"
            >
              <p className="text-sm font-semibold">{language === 'hi' ? 'कोई टैब नहीं मिला' : 'No tabs found'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
