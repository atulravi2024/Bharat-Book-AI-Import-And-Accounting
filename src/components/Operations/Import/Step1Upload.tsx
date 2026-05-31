import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { VoucherType, ParsingSettings } from '../../../app/types';
import { Check } from 'lucide-react';
import { 
    InfoIcon, 
    ArrowForwardIcon, 
    CancelIcon,
} from '../../icons/IconComponents';

import { useStep1UploadLogic } from './step1/useStep1UploadLogic';
import { SubStepType } from './step1/SubStepType';
import { SubStepChoose } from './step1/SubStepChoose';
import { SubStepPreview } from './step1/SubStepPreview';
import { SubStepUpload } from './step1/SubStepUpload';
import { SubStepMapping } from './step1/SubStepMapping';
import { SubStepSettings } from './step1/SubStepSettings';

interface Step1UploadProps {
  onNext: (file: File, voucherType: VoucherType, mapping?: Record<string, string>, settings?: ParsingSettings, sourceBank?: string) => void;
  isLoading: boolean;
  onCancel: () => void;
  error: string | null;
  clearError: () => void;
  initialSettings?: ParsingSettings;
  initialVoucherType?: VoucherType;
  ledgerMasters?: any[];
  activeTab?: 'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings';
  onTabChange?: (tab: 'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings') => void;
  onImportCategoryChange?: (category: 'voucher' | 'master' | 'bank' | 'other') => void;
  hideStepper?: boolean;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({ 
  onNext, 
  isLoading, 
  onCancel, 
  error, 
  clearError,
  initialSettings,
  initialVoucherType,
  ledgerMasters = [],
  activeTab: propActiveTab,
  onTabChange,
  onImportCategoryChange,
  hideStepper = false
}) => {
  const { t } = useLanguage();

  const {
    file,
    setFile,
    voucherType,
    setVoucherType,
    selectedBank,
    setSelectedBank,
    isDragOver,
    headerRowIndex,
    setHeaderRowIndex,
    isMappingExpanded,
    setIsMappingExpanded,
    bankMasters,
    parsingSettings,
    setParsingSettings,
    activeSection,
    setActiveSection,
    productionEnv,
    setProductionEnv,
    productionApiUrl,
    setProductionApiUrl,
    productionApiKey,
    setProductionApiKey,
    syncMode,
    setSyncMode,
    isSyncingLedger,
    setIsSyncingLedger,
    testConnectionStatus,
    testConnectionMessage,
    handleTestConnection,
    fileHeaders,
    previewData,
    mappings,
    setMappings,
    isStructuredFile,
    handleFileChange,
    clearMappings,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit,
    activeTab,
    setActiveTab,
    importCategory,
    setImportCategory,
    masterType,
    setMasterType,
    templateConfig,
    handleDownloadTemplate,
    steps,
    currentStepIndex
  } = useStep1UploadLogic({
    onNext,
    isLoading,
    initialSettings,
    initialVoucherType,
    ledgerMasters,
    activeTab: propActiveTab,
    onTabChange,
    onImportCategoryChange
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!hideStepper && (
        <div className="mb-4 md:mb-8 mt-2 shrink-0 px-2 md:px-8">
          {/* Mobile Compact Stepper */}
          <div className="md:hidden flex flex-col justify-center space-y-1 mb-2 px-1">
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">{t("Step")} {currentStepIndex + 1} {t("of")} {steps.length}</span>
                <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md leading-none">{steps[currentStepIndex].title}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                     style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  ></div>
              </div>
          </div>

          {/* Desktop Detailed Stepper */}
          <div className="hidden md:flex items-center justify-between w-full relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 dark:bg-gray-700 z-0 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-blue-600 dark:bg-blue-500 z-0 transition-all duration-500 ease-in-out rounded-full"
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <button
                    onClick={() => setActiveTab(step.id as any)}
                    className={`w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-[10px] md:text-xs lg:text-sm font-bold border-2 transition-all duration-300 cursor-pointer ${
                      isCurrent
                        ? 'border-blue-600 text-blue-600 bg-white dark:bg-gray-800 ring-4 ring-blue-50 dark:ring-blue-900/30 font-bold'
                        : isCompleted
                        ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 dark:bg-blue-600 dark:border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-505'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-white" strokeWidth={3} /> : (index + 1)}
                  </button>
                  <div className={`absolute -bottom-6 w-max text-[8.5px] min-[375px]:text-[10px] md:text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
                    isCurrent ? 'text-blue-600 dark:text-blue-400 font-bold' : isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 shrink-0 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm" role="alert">
          <div className="shrink-0 p-2 bg-red-100 rounded-xl mr-4 animate-bounce">
            <InfoIcon className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0 pr-8 text-left">
            <p className="font-black uppercase tracking-widest text-[10px] mb-1">{t("Critical Processing Error")}</p>
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </div>
          <button onClick={clearError} className="shrink-0 p-2 hover:bg-red-100 rounded-xl transition-colors cursor-pointer">
            <CancelIcon className="text-xl" />
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'type' && (
          <SubStepType
            importCategory={importCategory}
            setImportCategory={setImportCategory}
          />
        )}

        {activeTab === 'choose' && (
          <SubStepChoose
            importCategory={importCategory}
            voucherType={voucherType}
            setVoucherType={setVoucherType}
            masterType={masterType}
            setMasterType={setMasterType}
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            bankMasters={bankMasters}
          />
        )}

        {activeTab === 'preview' && (
          <SubStepPreview
            templateConfig={templateConfig}
            handleDownloadTemplate={handleDownloadTemplate}
          />
        )}

        {activeTab === 'upload' && (
          <SubStepUpload
            file={file}
            setFile={setFile}
            isDragOver={isDragOver}
            isStructuredFile={isStructuredFile}
            fileHeaders={fileHeaders}
            previewData={previewData}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleFileChange={handleFileChange}
          />
        )}

        {activeTab === 'mapping' && (
          <SubStepMapping
            file={file}
            isStructuredFile={isStructuredFile}
            fileHeaders={fileHeaders}
            headerRowIndex={headerRowIndex}
            setHeaderRowIndex={setHeaderRowIndex}
            isMappingExpanded={isMappingExpanded}
            setIsMappingExpanded={setIsMappingExpanded}
            mappings={mappings}
            setMappings={setMappings}
            clearMappings={clearMappings}
          />
        )}

        {activeTab === 'settings' && (
          <SubStepSettings
            file={file}
            parsingSettings={parsingSettings}
            setParsingSettings={setParsingSettings}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            productionEnv={productionEnv}
            setProductionEnv={setProductionEnv}
            syncMode={syncMode}
            setSyncMode={setSyncMode}
            productionApiUrl={productionApiUrl}
            setProductionApiUrl={setProductionApiUrl}
            productionApiKey={productionApiKey}
            setProductionApiKey={setProductionApiKey}
            isSyncingLedger={isSyncingLedger}
            setIsSyncingLedger={setIsSyncingLedger}
            handleTestConnection={handleTestConnection}
            testConnectionStatus={testConnectionStatus}
            testConnectionMessage={testConnectionMessage}
          />
        )}
      </div>

      <div className="sticky bottom-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 shadow-[0_-10px_25px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_25px_-12px_rgba(0,0,0,0.8)] mt-auto shrink-0">
        <div className="flex sm:flex-row items-center justify-between w-full">
          {activeTab === 'type' ? (
            <div className="w-full flex justify-end">
              <button
                onClick={() => setActiveTab('choose')}
                className="w-full sm:w-auto h-10 px-6 border border-transparent rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer"
              >
                <span className="block sm:hidden">{t("Next")}</span>
                <span className="hidden sm:inline-flex items-center">
                  {t("Next: Choose")}
                </span>
                <ArrowForwardIcon className="ml-1.5 text-base" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:items-center sm:justify-between">
              {/* Back button */}
              <div className="col-span-1 sm:flex-1 sm:flex sm:justify-start">
                <button 
                  onClick={() => {
                    if (activeTab === 'choose') setActiveTab('type');
                    else if (activeTab === 'preview') setActiveTab('choose');
                    else if (activeTab === 'upload') setActiveTab('preview');
                    else if (activeTab === 'mapping') setActiveTab('upload');
                    else if (activeTab === 'settings') {
                       if (file && isStructuredFile) setActiveTab('mapping');
                       else setActiveTab('upload');
                    }
                  }} 
                  className="w-full sm:w-auto h-10 px-0.5 sm:px-4 border border-gray-300 rounded-lg text-[10px] sm:text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <ArrowForwardIcon className="mr-0.5 sm:mr-1 text-sm sm:text-base rotate-180 shrink-0" />
                  <span className="truncate">{t("Back")}</span>
                </button>
              </div>

              {/* Start Over button */}
              <div className="col-span-1 sm:flex-1 sm:flex sm:justify-center">
                <button 
                  onClick={() => {
                    setFile(null);
                    setActiveTab('type');
                    setImportCategory('voucher');
                  }} 
                  className="w-full sm:w-auto h-10 px-0.5 sm:px-4 border border-gray-300 rounded-lg text-[10px] sm:text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <CancelIcon className="mr-0.5 sm:mr-1 text-sm sm:text-base shrink-0 animate-spin-once" />
                  <span className="truncate">{t("Start Over")}</span>
                </button>
              </div>

              {/* Next/Process button */}
              <div className="col-span-1 sm:flex-1 sm:flex sm:justify-end mt-0">
                {activeTab === 'settings' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!file || isLoading}
                    className="w-full sm:w-auto h-10 px-0.5 sm:px-5 border border-transparent rounded-lg text-[10px] sm:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white shrink-0" xmlns="http://www.w3.org/2500/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="truncate">{t("Wait")}</span>
                      </>
                    ) : (
                      <>
                        <span className="truncate sm:hidden">{t("Process")}</span>
                        <span className="hidden sm:inline-flex items-center">
                          {t("Process & Continue")}
                        </span>
                        <ArrowForwardIcon className="ml-1 sm:ml-1.5 text-sm sm:text-base shrink-0" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                        if (activeTab === 'choose') setActiveTab('preview');
                        else if (activeTab === 'preview') setActiveTab('upload');
                        else if (activeTab === 'upload') {
                           if (file && isStructuredFile) setActiveTab('mapping');
                           else setActiveTab('settings');
                        }
                        else if (activeTab === 'mapping') setActiveTab('settings');
                    }}
                    className="w-full sm:w-auto h-10 px-0.5 sm:px-5 border border-transparent rounded-lg text-[10px] sm:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    <span className="truncate sm:hidden">{t("Next")}</span>
                    <span className="hidden sm:inline-flex items-center">
                      {activeTab === 'choose' ? t("Next: Template") : activeTab === 'preview' ? t("Next: Upload") : activeTab === 'upload' ? (file && isStructuredFile ? t("Next: Map Data") : t("Next: Settings")) : t("Next: Settings")}
                    </span>
                    <ArrowForwardIcon className="ml-1 sm:ml-1.5 text-sm sm:text-base shrink-0" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
