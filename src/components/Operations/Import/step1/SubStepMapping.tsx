import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    InfoIcon, 
    SettingsIcon, 
    UndoIcon 
} from '../../../icons/IconComponents';

interface SubStepMappingProps {
  file: File | null;
  isStructuredFile: boolean;
  fileHeaders: string[];
  headerRowIndex: number | undefined;
  setHeaderRowIndex: (idx: number) => void;
  isMappingExpanded: boolean;
  setIsMappingExpanded: (expanded: boolean) => void;
  mappings: Record<string, string>;
  setMappings: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  clearMappings: () => void;
}

export const SubStepMapping: React.FC<SubStepMappingProps> = ({
  file,
  isStructuredFile,
  fileHeaders,
  headerRowIndex,
  setHeaderRowIndex,
  isMappingExpanded,
  setIsMappingExpanded,
  mappings,
  setMappings,
  clearMappings,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none min-h-0 overflow-y-auto custom-scrollbar shrink-0 text-left">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      
      {file && isStructuredFile ? (
        <div className="animate-in fade-in duration-300 text-left">
          <div className="flex flex-col min-[600px]:flex-row min-[600px]:items-center justify-between font-semibold mb-6 gap-4">
             <div>
                <h3 className="text-xl min-[600px]:text-2xl font-black text-gray-900 tracking-tighter dark:text-white">{t("Map Data Columns")}</h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Found {fileHeaders.length} source columns</p>
             </div>
             <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                  <span className="text-xs font-semibold text-gray-500 ml-1 dark:text-gray-400">{t("Header Row Index:")}</span>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={headerRowIndex ?? 0}
                    onChange={(e) => setHeaderRowIndex(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 px-2 py-1 text-center font-bold text-blue-600 bg-white border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
          </div>
          
          <div className="bg-blue-50/50 p-3 min-[600px]:p-4 rounded-xl border border-blue-105 flex items-start mb-6 dark:bg-blue-900/20 dark:border-blue-800/30">
            <InfoIcon className="text-blue-500 mr-2 mt-0.5 shrink-0" />
            <p className="text-xs min-[600px]:text-sm text-blue-805 dark:text-blue-300 font-medium">
              {t(`Map the columns from your Excel file to the corresponding fields in Bharat Book. Our AI will use these hints to improve parsing accuracy.`)}
            </p>
          </div>

          {/* Field Mappings Accordion */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
            <button
              type="button"
              onClick={() => setIsMappingExpanded(!isMappingExpanded)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("Field Configuration")}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Configure explicit mappings. You can leave most on Auto-detect.")}</p>
                </div>
              </div>
              {isMappingExpanded ? (
                <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-500 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                </svg>
              )}
            </button>

            {isMappingExpanded && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {Object.keys(mappings).map((targetField) => (
                    <div key={targetField} className="flex flex-col">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 dark:text-gray-400">
                        {targetField.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <div className="relative">
                        <select 
                          value={mappings[targetField]}
                          onChange={(e) => setMappings(prev => ({ ...prev, [targetField]: e.target.value }))}
                          className="w-full pl-4 pr-10 py-2.5 min-[600px]:py-3 text-sm font-medium bg-white border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-600 transition-shadow hover:border-gray-400"
                        >
                          <option value="">{t("-- Auto-detect --")}</option>
                          {(fileHeaders.length > 0 ? fileHeaders : []).map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-end">
                  <button 
                    onClick={clearMappings}
                    className="text-[11px] min-[600px]:text-sm font-bold text-gray-500 hover:text-red-600 flex items-center transition-colors px-3 py-2 min-[600px]:px-4 min-[600px]:py-2.5 rounded-xl hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/20 cursor-pointer"
                  >
                    <UndoIcon className="mr-1.5 min-[600px]:mr-2 text-base" />
                    {t("Clear All Mappings")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
         <div className="flex-1 flex flex-col items-center justify-center pt-8 md:pt-16 px-4">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
            <InfoIcon className="text-blue-500 text-3xl" />
          </div>
          <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-2">{t("No Mapping Required")}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md font-medium">
            {t("You haven't uploaded an Excel/CSV file, or the file doesn't require column mapping. You can proceed to Next.")}
          </p>
        </div>
      )}
    </div>
  );
};
