import React from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
    Info, 
    Building2, 
    Calendar, 
    FileText, 
    ShieldAlert, 
    AlertOctagon
} from 'lucide-react';
import { useRegularGuidelines } from './hooks/useRegularGuidelines';
import { RegularGuidelinesProps } from './types';

// Views
import { RegularGuidelinesBanner } from './views/RegularGuidelinesBanner';
import { RegularEligibilityView } from './views/RegularEligibilityView';
import { RegularFilingCycleView } from './views/RegularFilingCycleView';
import { RegularInvoicingView } from './views/RegularInvoicingView';
import { RegularItcClaimsView } from './views/RegularItcClaimsView';
import { RegularRcmLiabilityView } from './views/RegularRcmLiabilityView';

export const RegularGuidelines: React.FC<RegularGuidelinesProps> = () => {
    const { t } = useLanguage();
    
    const {
        activeOption,
        setActiveOption,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isTopBannerCollapsed,
        setIsTopBannerCollapsed,
        expandedSections,
        toggleSection,
        expandAllCurrentOptionSections,
        collapseAllCurrentOptionSections
    } = useRegularGuidelines();

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Top Stat Banner with Collapsible Detail Toggle */}
            <RegularGuidelinesBanner 
                isCollapsed={isTopBannerCollapsed} 
                onToggle={() => setIsTopBannerCollapsed(!isTopBannerCollapsed)} 
            />

            {/* Ingestion & Guideline Workspace Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT SIDEBAR: Option Ingestor Navigator (Collapsible layout) */}
                <div className={`${isSidebarCollapsed ? 'hidden lg:hidden' : 'lg:col-span-4'} bg-white rounded-xl border border-gray-100 p-4 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-3 transition-all duration-300`}>
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider block border-b pb-2">
                        {t("Choose regular Option")}
                    </h4>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveOption('eligibility')}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-bold flex items-start gap-3 ${
                                activeOption === 'eligibility'
                                    ? 'bg-indigo-50/60 border-indigo-200 text-indigo-850 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400'
                                    : 'bg-transparent border-gray-100 hover:border-gray-200 text-gray-600 hover:text-gray-800 dark:border-gray-750 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <Building2 size={16} className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div className="flex-1">
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 1: Threshold limits")}</p>
                                <p className="text-[10px] text-gray-450 mt-0.5 font-normal">{t("Aggregate limits & mandatory registration circumstances.")}</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveOption('calendars')}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-bold flex items-start gap-3 ${
                                activeOption === 'calendars'
                                    ? 'bg-indigo-50/60 border-indigo-200 text-indigo-850 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400'
                                    : 'bg-transparent border-gray-100 hover:border-gray-200 text-gray-600 hover:text-gray-800 dark:border-gray-750 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <Calendar size={16} className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div className="flex-1">
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 2: Return Calendars")}</p>
                                <p className="text-[10px] text-gray-455 mt-0.5 font-normal">{t("Monthly/Quarterly GSTR-1, 2B, 3B returns dates.")}</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveOption('invoicing')}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-bold flex items-start gap-3 ${
                                activeOption === 'invoicing'
                                    ? 'bg-indigo-50/60 border-indigo-200 text-indigo-850 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400'
                                    : 'bg-transparent border-gray-100 hover:border-gray-200 text-gray-600 hover:text-gray-800 dark:border-gray-750 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <FileText size={16} className="mt-0.5 text-indigo-650 dark:text-indigo-400 shrink-0" />
                            <div className="flex-1">
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 3: Regular Invoices")}</p>
                                <p className="text-[10px] text-gray-455 mt-0.5 font-normal">{t("Rule 46 limits, e-Invoicing & HSN mandates.")}</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveOption('itc')}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-bold flex items-start gap-3 ${
                                activeOption === 'itc'
                                    ? 'bg-indigo-50/60 border-indigo-200 text-indigo-850 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400'
                                    : 'bg-transparent border-gray-100 hover:border-gray-200 text-gray-600 hover:text-gray-800 dark:border-gray-750 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <ShieldAlert size={16} className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div className="flex-1">
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 4: ITC claim regulations")}</p>
                                <p className="text-[10px] text-gray-455 mt-0.5 font-normal">{t("Section 16, 17(5) blocked credit, GSTR-2B matching.")}</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveOption('rcm')}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-bold flex items-start gap-3 ${
                                activeOption === 'rcm'
                                    ? 'bg-indigo-50/60 border-indigo-200 text-indigo-850 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400'
                                    : 'bg-transparent border-gray-100 hover:border-gray-200 text-gray-600 hover:text-gray-800 dark:border-gray-750 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <AlertOctagon size={16} className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div className="flex-1">
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 5: Regular RCM rules")}</p>
                                <p className="text-[10px] text-gray-455 mt-0.5 font-normal">{t("Cash payment parameters, self-invoicing and offsets.")}</p>
                            </div>
                        </button>
                    </div>

                    <div className="bg-amber-50/65 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/60 dark:text-amber-400 mt-4 leading-normal flex items-start gap-2">
                        <Info size={14} className="mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>{t("Caution: Under the Regular Scheme, Input Tax Credit claims mapping must match GSTR-2B entries exactly in each monthly GSTR-3B filings cycle.")}</span>
                    </div>
                </div>

                {/* RIGHT COLUMN: Active Option Statutory Handbook Content */}
                <div className={`${isSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'} bg-white rounded-xl border border-gray-100 p-6 shadow-xs dark:bg-gray-800 dark:border-gray-800 min-h-[480px] space-y-4 transition-all duration-300`}>
                    
                    {/* Expand / Collapse All controllers inside active subpage */}
                    <div className="flex items-center justify-between bg-gray-50/60 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 p-2.5 rounded-lg text-xs gap-3 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                            {t("Interactive Handbook Panel")}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="px-2 py-1 text-[10px] font-extrabold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 dark:bg-gray-850 dark:hover:bg-gray-850 dark:border-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center gap-1.5"
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${isSidebarCollapsed ? 'bg-indigo-600' : 'bg-gray-400'}`}></span>
                                {isSidebarCollapsed ? t("Show Option Selectors") : t("Maximize View")}
                            </button>
                            <button
                                type="button"
                                onClick={expandAllCurrentOptionSections}
                                className="px-2 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50/50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 border border-gray-200 dark:border-gray-700 rounded-md transition-colors"
                            >
                                {t("Expand All")}
                            </button>
                            <button
                                type="button"
                                onClick={collapseAllCurrentOptionSections}
                                className="px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-md transition-colors"
                            >
                                {t("Collapse All")}
                            </button>
                        </div>
                    </div>

                    {/* Active Screen Selection Options */}
                    {activeOption === 'eligibility' && (
                        <RegularEligibilityView 
                            expandedSections={expandedSections} 
                            onToggle={toggleSection} 
                        />
                    )}

                    {activeOption === 'calendars' && (
                        <RegularFilingCycleView 
                            expandedSections={expandedSections} 
                            onToggle={toggleSection} 
                        />
                    )}

                    {activeOption === 'invoicing' && (
                        <RegularInvoicingView 
                            expandedSections={expandedSections} 
                            onToggle={toggleSection} 
                        />
                    )}

                    {activeOption === 'itc' && (
                        <RegularItcClaimsView 
                            expandedSections={expandedSections} 
                            onToggle={toggleSection} 
                        />
                    )}

                    {activeOption === 'rcm' && (
                        <RegularRcmLiabilityView 
                            expandedSections={expandedSections} 
                            onToggle={toggleSection} 
                        />
                    )}

                </div>

            </div>
        </div>
    );
};
