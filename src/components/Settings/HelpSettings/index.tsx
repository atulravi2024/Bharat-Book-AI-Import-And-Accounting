import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { HelpCircle, Settings, Sparkles, BookOpen } from 'lucide-react';
import { useHelpSearch } from './hooks/useHelpSearch';
import { ExplorerSegment } from './views/ExplorerSegment';
import { FaqSegment } from './views/FaqSegment';
import { TrainerSegment } from './views/TrainerSegment';

export const HelpSettings: React.FC = () => {
  const { t } = useLanguage();
  const searchProps = useHelpSearch();

  const {
    activeSegment,
    setActiveSegment,
  } = searchProps;

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[0.6rem] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-500/20">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{t("Help Center")}</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t("Knowledge Hub & Intelligent Manual")}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2 w-full md:w-auto mt-3 md:mt-0">
          <div className="flex items-center justify-between md:justify-start gap-2 font-mono text-[10px] bg-gray-50 dark:bg-gray-800/50 px-3 py-2 md:py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shrink-0">
            <span className="text-gray-500 dark:text-gray-400 font-semibold">{t("BHARAT BOOK")}</span>
            <div className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-700 pl-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200" />
              <span className="text-gray-700 dark:text-gray-300 font-bold tracking-tight">{t("SECURE MODE")}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 md:flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shrink-0 gap-1 shadow-sm md:shadow-none">
             <button
               onClick={() => setActiveSegment('explorer')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeSegment === 'explorer' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Settings className="w-3 h-3" /> {t("Explorer")}
             </button>
             <button
               onClick={() => setActiveSegment('trainer')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeSegment === 'trainer' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Sparkles className="w-3 h-3" /> {t("Trainer")}
             </button>
             <button
               onClick={() => setActiveSegment('faq')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeSegment === 'faq' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <BookOpen className="w-3 h-3" /> {t("Knowledge")}
             </button>
          </div>
        </div>
      </div>

      {activeSegment === 'explorer' && (
        <ExplorerSegment 
          t={t}
          selectedFeatureId={searchProps.selectedFeatureId}
          setSelectedFeatureId={searchProps.setSelectedFeatureId}
          explorerGroups={searchProps.explorerGroups}
          toggleExpGroup={searchProps.toggleExpGroup}
        />
      )}

      {activeSegment === 'faq' && (
        <FaqSegment 
          t={t}
          searchQuery={searchProps.searchQuery}
          setSearchQuery={searchProps.setSearchQuery}
          selectedCategory={searchProps.selectedCategory}
          setSelectedCategory={searchProps.setSelectedCategory}
          expandedArticle={searchProps.expandedArticle}
          setExpandedArticle={searchProps.setExpandedArticle}
          filteredArticles={searchProps.filteredArticles}
        />
      )}

      {activeSegment === 'trainer' && (
        <TrainerSegment 
          t={t}
          selectedTrainerId={searchProps.selectedTrainerId}
          setSelectedTrainerId={searchProps.setSelectedTrainerId}
          testUserRole={searchProps.testUserRole}
          setTestUserRole={searchProps.setTestUserRole}
          selectedCol={searchProps.selectedCol}
          matchedFields={searchProps.matchedFields}
          sampleColumns={searchProps.sampleColumns}
          targetFields={searchProps.targetFields}
          handleDragCol={searchProps.handleDragCol}
          handlePairFields={searchProps.handlePairFields}
          resetSimulator={searchProps.resetSimulator}
          rawNarration={searchProps.rawNarration}
          setRawNarration={searchProps.setRawNarration}
          cleanUPI={searchProps.cleanUPI}
          cleanCHQ={searchProps.cleanCHQ}
          cleansedIgnore={searchProps.cleansedIgnore}
          aiEngine={searchProps.aiEngine}
          aiTemperature={searchProps.aiTemperature}
          simulatedTime={searchProps.simulatedTime}
          workStart={searchProps.workStart}
          workEnd={searchProps.workEnd}
          gstinValue={searchProps.gstinValue}
          compiledSimVoucher={searchProps.compiledSimVoucher}
          compileCleansedNarrationOutput={searchProps.compileCleansedNarrationOutput}
          getSimulatedAiMatchingOutput={searchProps.getSimulatedAiMatchingOutput}
          getWorkingHoursSimulationStatus={searchProps.getWorkingHoursSimulationStatus}
          getGSTINStateCodeSimulation={searchProps.getGSTINStateCodeSimulation}
        />
      )}
    </div>
  );
};
