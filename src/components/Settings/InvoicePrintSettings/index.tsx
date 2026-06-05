import { AccountingERPThemesSection } from './sections/AccountingERPThemesSection';
import { ColorSpectrumPalettesSection } from './sections/ColorSpectrumPalettesSection';
import { AestheticPresetsSection } from './sections/AestheticPresetsSection';
import { FontSelectionSection } from './sections/FontSelectionSection';
import { SpaceandMarginSection } from './sections/SpaceandMarginSection';
import { SectionSpecificStylingSection } from './sections/SectionSpecificStylingSection';
import { LayoutComponentsSection } from './sections/LayoutComponentsSection';
import { DataVisibilitySection } from './sections/DataVisibilitySection';
import { PageDimensionsSection } from './sections/PageDimensionsSection';
import { ItemSettingsSection } from './sections/ItemSettingsSection';
import { InformationPlannerSection } from './sections/InformationPlannerSection';
import { AdvancedPaginationHeadersSection } from './sections/AdvancedPaginationHeadersSection';

import { InfoIcon } from './VoucherPreviewComponent';
import { useLanguage } from '../../../context/LanguageContext';
import { Layout, Printer, Upload, Download, RotateCcw } from 'lucide-react';

import React from 'react';

import { INVOICE_FONTS } from './constants';
import { useInvoicePrintSettings } from './hooks/useInvoicePrintSettings';
import { PreviewPanel } from './components/PreviewPanel';

export const InvoicePrintSettings: React.FC<{ appMode?: string }> = ({ appMode = 'working' }) => {
  const { t } = useLanguage();
  const state = useInvoicePrintSettings();
  
  const {
      settings, setSettings, isSaved, 
      activeSection, toggleSection, resetSettingsForSection, resetAllSettings, toggleSetting,
      plannerPageType, setPlannerPageType,
      currentPage, setCurrentPage, totalPages, paginatedRows, absoluteStartIndex, itemPages,
      manualZoom, handleZoomIn, handleZoomOut, handleFullSize, handleResetZoom, previewScale,
      dummyHeader, dummyRows, dummyTotals,
      previewContainerRef, printRef,
      handleSave, handleExport, handleImportSettings
  } = state;

    const props = {
      settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
      plannerPageType, setPlannerPageType,
      INVOICE_FONTS, getSectionStyle: (key: string, baseClasses: string, overrides: any) => ({ className: baseClasses, style: overrides }),
      toggleSetting, calculatePageStats: () => null
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-0">
            {/* Configuration Section */}
            <div className="flex-1 space-y-6 relative z-10">
                <div className="bg-white rounded-[2rem] py-4 border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                    <div className="flex items-center gap-4 mb-8 px-8">
                        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <Layout size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight dark:text-white">Print Layout Configuration</h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customize what appears on your generated invoices and vouchers</p>
                        </div>
                    </div>

                    <div className="flex flex-col border-t border-gray-100 dark:border-gray-800">
                        <AccountingERPThemesSection {...props} />
                        <ColorSpectrumPalettesSection {...props} />
                        <AestheticPresetsSection {...props} />
                        <FontSelectionSection {...props} />
                        <SpaceandMarginSection {...props} />
                        <SectionSpecificStylingSection {...props} />
                        <LayoutComponentsSection {...props} />
                        <DataVisibilitySection {...props} />
                        <PageDimensionsSection {...props} />
                        <ItemSettingsSection {...props} />
                        <InformationPlannerSection {...props} />
                        <AdvancedPaginationHeadersSection {...props} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-4 px-8 dark:border-gray-800 relative z-50">
                        <div className={`transition-all duration-500 flex items-center justify-center gap-2 ${isSaved ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Settings Synchronized</span>
                        </div>
                        
                        <div className="form-grid gap-2 sm:gap-4 relative z-50">
                            <button 
                                id="test-print-button"
                                style={{ pointerEvents: 'auto', zIndex: 100 }}
                                onClick={(e) => { 
                                    e.preventDefault();
                                    window.print();
                                }}
                                className={`flex items-center justify-center gap-2 px-2 sm:px-5 py-4 ${appMode === 'demo' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-gray-700 border-gray-200'} border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 cursor-pointer group relative z-50`}
                                title={appMode === 'demo' ? "Demo Print (Watermarked)" : "Test Print"}
                            >
                                <Printer size={16} className={appMode === 'demo' ? 'animate-pulse' : ''} /> 
                                <span className="hidden sm:inline">
                                    {appMode === 'demo' ? 'DEMO PRINT' : 'TEST PRINT'}
                                </span>
                            </button>
                            <label 
                                className="flex items-center justify-center gap-2 px-2 sm:px-5 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm cursor-pointer dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700" 
                                title="Import Settings"
                            >
                                <Upload size={16} /> <span className="hidden lg:inline">IMPORT</span>
                                <input type="file" accept=".json" className="hidden" onChange={handleImportSettings} />
                            </label>
                            <button 
                                onClick={handleExport}
                                className="flex items-center justify-center gap-2 px-2 sm:px-5 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                                title="Export Settings"
                            >
                                <Download size={16} /> <span className="hidden lg:inline">EXPORT</span>
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-2 sm:px-5 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
                                title="Save Settings"
                            >
                                <Layout size={14} /> <span className="hidden sm:inline">SAVE</span>
                            </button>
                            <button 
                                onClick={resetAllSettings}
                                className="px-2 sm:px-5 py-4 bg-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 dark:bg-gray-800 dark:text-gray-300"
                                title="Default Settings"
                            >
                                <RotateCcw size={14} /> <span className="hidden xl:inline">DEFAULT</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4 items-start">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                        <InfoIcon size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Expert Formatting Tip</h4>
                        <p className="text-xs text-amber-700 font-medium leading-relaxed uppercase tracking-tighter opacity-80 italic">
                            {t("Disabling HSN/SAC and Tax details creates a cleaner \"Commercial Invoice\" look for non-taxable transactions.")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Live Preview Section */}
            <PreviewPanel 
                settings={settings}
                dummyHeader={dummyHeader}
                paginatedRows={paginatedRows}
                dummyRows={dummyRows}
                dummyTotals={dummyTotals}
                currentPage={currentPage}
                totalPages={totalPages}
                absoluteStartIndex={absoluteStartIndex}
                manualZoom={manualZoom}
                previewScale={previewScale}
                previewContainerRef={previewContainerRef}
                printRef={printRef}
                appMode={appMode}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleResetZoom={handleResetZoom}
                handleFullSize={handleFullSize}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};
