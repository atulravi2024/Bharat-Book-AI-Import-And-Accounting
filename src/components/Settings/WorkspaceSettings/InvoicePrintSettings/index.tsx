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
import { useLanguage } from "../../../../context/LanguageContext";
import { Layout, Printer, Upload, Download, RotateCcw, Search, ChevronDown, Trash2, CheckCircle2, Save } from 'lucide-react';

import React, { useRef } from 'react';

import { INVOICE_FONTS } from './constants';
import { useInvoicePrintSettings } from './hooks/useInvoicePrintSettings';
import { PreviewPanel } from './components/PreviewPanel';

export const InvoicePrintSettings: React.FC<{ appMode?: string }> = ({ appMode = 'working' }) => {
  const { t } = useLanguage();
  const state = useInvoicePrintSettings();
  const [activeTab, setActiveTab] = React.useState<'design' | 'structure' | 'content'>('design');

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const isToolbarHidden = isSearchFocused || searchQuery.length > 0;
  const [fileFormat, setFileFormat] = React.useState<'JSON' | 'CSV'>('JSON');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const checkOverride = () => {
      const override = localStorage.getItem('bharat_book_invoiceprint_subtab_override');
      if (override) {
        let targetTab: any = null;
        if (['design', 'pdf_header'].includes(override)) targetTab = 'design';
        else if (['structure', 'letterhead'].includes(override)) targetTab = 'structure';
        else if (['content', 'receipt_print'].includes(override)) targetTab = 'content';
        
        if (targetTab) {
          setActiveTab(targetTab);
        }
        localStorage.removeItem('bharat_book_invoiceprint_subtab_override');
      }
    };
    checkOverride();
    window.addEventListener('bharat_book_invoiceprint_subtab_trigger', checkOverride);
    return () => window.removeEventListener('bharat_book_invoiceprint_subtab_trigger', checkOverride);
  }, []);
  
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
      toggleSetting, calculatePageStats: () => null, searchTerm: searchQuery
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-0">
            {/* Configuration Section */}
            <div className="flex-1 space-y-4 relative z-10 w-full min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
                    <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
                            <Layout className="w-5 h-5" /> 
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider truncate leading-tight">
                                {t("Print Layout")}
                            </h2>
                            <p className="text-[10px] xs:text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 truncate whitespace-nowrap">
                                {t("Customize appearances on generated invoices")}
                            </p>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1 flex items-center">
                        <div className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start min-w-0 scroll-smooth">
                            <button 
                                onClick={() => setActiveTab('design')}
                                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                    activeTab === 'design' 
                                        ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                                }`}
                            >
                                <span>{t("Design")}</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('structure')}
                                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                    activeTab === 'structure' 
                                        ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                                }`}
                            >
                                <span>{t("Layout")}</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('content')}
                                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                    activeTab === 'content' 
                                        ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                                }`}
                            >
                                <span>{t("Data")}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dynamic Search & Compact Universal Actions Toolbar row */}
                <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in">
                  <div className="flex-1 min-w-0 relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      placeholder={t("Search configurations...")} 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        title={t("Clear search")}
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-2" />
                      </button>
                    )}
                  </div>

                  <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto ${isToolbarHidden ? "hidden" : "flex"}`}>
                    
                    <button 
                        id="test-print-button-toolbar"
                        onClick={(e) => { 
                            e.preventDefault();
                            window.print();
                        }}
                        className={`px-2 sm:px-3 py-1.5 text-[11px] font-bold ${appMode === 'demo' ? 'text-amber-600 dark:text-amber-500' : 'text-gray-650 dark:text-gray-300'} hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0`}
                        title={appMode === 'demo' ? "Demo Print (Watermarked)" : "Test Print"}
                    >
                        <Printer className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden md:inline leading-none">{t("Print")}</span>
                    </button>

                    <div className="relative inline-flex items-center shrink-0">
                      <select
                        value={fileFormat}
                        onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
                        className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-150 dark:border-gray-750 hover:border-gray-350 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Simple Input and Output")}
                      >
                        <option value="JSON" className="bg-white dark:bg-gray-850">JSON</option>
                        <option value="CSV" className="bg-white dark:bg-gray-850">CSV</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                      title={t("Import Configurations")}
                    >
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden md:inline leading-none">{t("Import")}</span>
                    </button>
                    <input type="file" accept={fileFormat === 'JSON' ? ".json" : ".csv"} className="hidden" ref={fileInputRef} onChange={handleImportSettings} />

                    <button
                      onClick={handleExport}
                      className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                      title={t("Export Configurations")}
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden md:inline leading-none">{t("Export")}</span>
                    </button>

                    <button
                      onClick={resetAllSettings}
                      className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                      title={t("Reset Defaults")}
                    >
                      <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden md:inline leading-none">{t("Reset")}</span>
                    </button>

                    <button
                      onClick={handleSave}
                      className="px-2 sm:px-3 py-1.5 text-[11px] font-extrabold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                      title={t("Save Config")}
                    >
                      {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 animate-bounce" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
                      <span className="hidden md:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[1.5rem] py-4 border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                    <div className="flex flex-col">
                        {activeTab === 'design' && (
                            <div className="animate-in fade-in duration-300">
                                <AccountingERPThemesSection {...props} />
                                <ColorSpectrumPalettesSection {...props} />
                                <AestheticPresetsSection {...props} />
                                <FontSelectionSection {...props} />
                                <SectionSpecificStylingSection {...props} />
                            </div>
                        )}
                        {activeTab === 'structure' && (
                            <div className="animate-in fade-in duration-300">
                                <SpaceandMarginSection {...props} />
                                <LayoutComponentsSection {...props} />
                                <PageDimensionsSection {...props} />
                            </div>
                        )}
                        {activeTab === 'content' && (
                            <div className="animate-in fade-in duration-300">
                                <DataVisibilitySection {...props} />
                                <ItemSettingsSection {...props} />
                                <InformationPlannerSection {...props} />
                                <AdvancedPaginationHeadersSection {...props} />
                            </div>
                        )}
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

