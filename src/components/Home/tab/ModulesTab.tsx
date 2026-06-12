import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FolderOpen, Layers } from 'lucide-react';
import { MainView } from '../../../app/types';
import { colorThemes } from './utils';

interface ModulesTabProps {
  language: string;
  actionTiles: any[];
  addNotification: (notification: any) => void;
  setView: (view: MainView) => void;
  handleExploreMainPage: (mainPageId: string) => void;
  schema: any;
}

export const ModulesTab: React.FC<ModulesTabProps> = ({
  language,
  actionTiles,
  addNotification,
  setView,
  handleExploreMainPage,
  schema
}) => {
  return (
    <motion.div
      key="modules"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actionTiles.length > 0 ? (
          actionTiles.map((tile, index) => {
            const IconComponent = tile.icon || Layers;
            const theme = colorThemes[index % colorThemes.length];
            return (
              <div
                key={tile.id}
                className={`flex flex-col text-left bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 ${theme.hoverBorder} rounded-2xl transition-all duration-300 hover:shadow-md relative overflow-hidden group h-full justify-between`}
              >
                {/* Clickable Card Body for Subpage Drill-down */}
                <button 
                  onClick={() => handleExploreMainPage(tile.id)}
                  className="p-6 pb-2 text-left w-full h-full cursor-pointer focus:outline-none"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 dark:bg-slate-700/10 rounded-full blur-2xl group-hover:scale-125 transition-transform -z-10 pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} text-white flex items-center justify-center shadow-md shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h4 className={`text-sm font-black text-slate-800 dark:text-white flex items-center gap-1 transition-colors ${theme.text.split(' ').map((c: string) => `group-hover:${c}`).join(' ')} truncate`}>
                        {tile.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
                        {tile.desc}
                      </p>
                    </div>
                  </div>
                </button>
                
                {/* Direct Launch Button Footer */}
                <div className="px-6 pb-4 pt-3 flex items-center gap-3 w-full animate-fade-in">
                  <button 
                    onClick={tile.onClick}
                    className={`${(schema.subPages[tile.id] || []).length > 0 ? 'w-1/2' : 'w-full'} py-2 ${theme.bg} ${theme.hover} text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                    title={language === 'hi' ? 'मुख्य पृष्ठ लॉन्च करें' : 'Launch Main Page'}
                  >
                    <span className="truncate">{language === 'hi' ? 'मुख्य पृष्ठ पर जाएं' : 'Go to Main Page'}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                  {(schema.subPages[tile.id] || []).length > 0 && (
                    <button 
                      onClick={() => handleExploreMainPage(tile.id)}
                      className={`w-1/2 py-2 ${theme.btnSecondary} text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                      title={language === 'hi' ? 'उपपृष्ठ खोजें' : 'Explore Subpages'}
                    >
                      <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{language === 'hi' ? 'उपपृष्ठ खोजें' : 'Explore Subpages'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-slate-50/50 dark:bg-gray-800/40 p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-750">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 animate-pulse">
              {language === 'hi' 
                ? 'अफ़सोस! आपकी खोज से मेल खाता कोई क्रेडेंशियल नहीं मिला।' 
                : 'No dynamic index modules match your current filtering criteria.'
              }
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
