import React, { useState } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
    Info, 
    Building2, 
    Calendar, 
    DollarSign, 
    AlertOctagon, 
    FileText, 
    ShieldAlert, 
    CheckCircle2, 
    HelpCircle,
    BookOpen,
    Users,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface CompositionGuidelinesProps {
    useSampleData: boolean;
    onToggleSampleData?: (enabled: boolean) => void;
}

interface CollapsibleCardProps {
    title: string;
    description?: string;
    isOpen: boolean;
    onToggle: () => void;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

// Highly stylized collapsible container component that fits the premium ERP context
const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ 
    title, 
    description,
    isOpen, 
    onToggle, 
    icon, 
    badge, 
    children, 
    className = "" 
}) => {
    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 ${isOpen ? 'shadow-xs border-indigo-100/80 dark:border-indigo-900/60 ring-1 ring-indigo-50/30 dark:ring-indigo-950/20' : 'hover:border-gray-200 dark:hover:border-gray-750'} ${className}`}>
            <button
                type="button"
                onClick={onToggle}
                className={`w-full flex items-start justify-between p-4 text-left transition-colors select-none ${isOpen ? 'bg-indigo-50/10 dark:bg-indigo-950/5 border-b border-gray-50 dark:border-gray-800/80' : ''}`}
            >
                <div className="flex items-start gap-3 mr-4">
                    {icon && <div className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">{icon}</div>}
                    <div>
                        <h5 className="font-extrabold text-xs text-gray-800 dark:text-gray-150 uppercase tracking-wide">
                            {title}
                        </h5>
                        {description && (
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-normal">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {badge}
                    <div className="p-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-750 group-hover:bg-gray-100 transition-colors">
                        {isOpen ? (
                            <ChevronUp size={14} className="text-gray-500 dark:text-gray-450 shrink-0" />
                        ) : (
                            <ChevronDown size={14} className="text-gray-500 dark:text-gray-450 shrink-0" />
                        )}
                    </div>
                </div>
            </button>
            
            {isOpen && (
                <div className="p-4 bg-white dark:bg-gray-901 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-850">
                    {children}
                </div>
            )}
        </div>
    );
};

export const CompositionGuidelines: React.FC<CompositionGuidelinesProps> = ({ useSampleData }) => {
    const { t } = useLanguage();
    
    // Controlled user screen navigation designated as "Options" under core guidelines
    const [activeOption, setActiveOption] = useState<'eligibility' | 'calendars' | 'invoicing' | 'restrictions' | 'rcm'>('eligibility');

    // Controls for collapsibles on the entire page level
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
    const [isTopBannerCollapsed, setIsTopBannerCollapsed] = useState<boolean>(false);

    // Granular states for accordion collapse under each subpage
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        // Option 1 Sections
        turnoverLimits: true,
        aggregateFormula: true,
        taxRates: true,
        
        // Option 2 Sections
        cmp08Form: true,
        gstr4Form: false,
        gstr4aForm: false,
        cmp02Form: false,
        cmp04Form: false,

        // Option 3 Sections
        invoiceProhibition: true,
        checklistRules: true,
        buyerCreditNotice: false,

        // Option 4 Sections
        outwardBans: true,
        prohibitedSectors: true,

        // Option 5 Sections
        zeroItcClaims: true,
        rcmLiability: true
    });

    const toggleSection = (sectionName: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const expandAllCurrentOptionSections = () => {
        const optionKeys: Record<typeof activeOption, string[]> = {
            eligibility: ['turnoverLimits', 'aggregateFormula', 'taxRates'],
            calendars: ['cmp08Form', 'gstr4Form', 'gstr4aForm', 'cmp02Form', 'cmp04Form'],
            invoicing: ['invoiceProhibition', 'checklistRules', 'buyerCreditNotice'],
            restrictions: ['outwardBans', 'prohibitedSectors'],
            rcm: ['zeroItcClaims', 'rcmLiability']
        };

        const currentKeys = optionKeys[activeOption];
        setExpandedSections(prev => {
            const next = { ...prev };
            currentKeys.forEach(k => { next[k] = true; });
            return next;
        });
    };

    const collapseAllCurrentOptionSections = () => {
        const optionKeys: Record<typeof activeOption, string[]> = {
            eligibility: ['turnoverLimits', 'aggregateFormula', 'taxRates'],
            calendars: ['cmp08Form', 'gstr4Form', 'gstr4aForm', 'cmp02Form', 'cmp04Form'],
            invoicing: ['invoiceProhibition', 'checklistRules', 'buyerCreditNotice'],
            restrictions: ['outwardBans', 'prohibitedSectors'],
            rcm: ['zeroItcClaims', 'rcmLiability']
        };

        const currentKeys = optionKeys[activeOption];
        setExpandedSections(prev => {
            const next = { ...prev };
            currentKeys.forEach(k => { next[k] = false; });
            return next;
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Top Stat Banner with Collapsible Detail Toggle */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-2 relative overflow-hidden transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                            {t("Filing Calendars & Rules")}
                        </span>
                        <h3 className="text-xl font-bold text-gray-850 dark:text-gray-100 mt-1">
                            {t("Composition Statutory Guidelines Desk")}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsTopBannerCollapsed(!isTopBannerCollapsed)}
                        className="self-start sm:self-center px-2.5 py-1 text-[10px] font-extrabold text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-750 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md transition-colors flex items-center gap-1.5"
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isTopBannerCollapsed ? 'bg-indigo-600' : 'bg-emerald-500'}`}></span>
                        {isTopBannerCollapsed ? t("Show Guidelines Intro") : t("Collapse Info")}
                    </button>
                </div>
                {!isTopBannerCollapsed && (
                    <p className="text-xs text-gray-500 pt-2 border-t border-gray-50 dark:border-gray-750 animate-fadeIn font-normal">
                        {t("Review eligibility limits, compliance calendars, invoicing mandates, prohibited items, and reverse charge instructions.")}
                    </p>
                )}
            </div>

            {/* Ingestion & Guideline Workspace Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT SIDEBAR: Option Ingestor Navigator (Collapsible layout) */}
                <div className={`${isSidebarCollapsed ? 'hidden lg:hidden' : 'lg:col-span-4'} bg-white rounded-xl border border-gray-100 p-4 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-3 transition-all duration-300`}>
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider block border-b pb-2">
                        {t("Choose Guideline Option")}
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
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 1: Eligibility & Limits")}</p>
                                <p className="text-[10px] text-gray-405 mt-0.5 font-normal">{t("Aggregate turnover limits & service thresholds.")}</p>
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
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 2: Forms & Calendars")}</p>
                                <p className="text-[10px] text-gray-455 mt-0.5 font-normal">{t("Quarterly statements and GSTR-4 dates.")}</p>
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
                            <FileText size={16} className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div className="flex-1">
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 3: Invoicing Rules")}</p>
                                <p className="text-[10px] text-gray-455 mt-0.5 font-normal">{t("Bill of Supply rules and required headers.")}</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveOption('restrictions')}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-bold flex items-start gap-3 ${
                                activeOption === 'restrictions'
                                    ? 'bg-indigo-50/60 border-indigo-200 text-indigo-850 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400'
                                    : 'bg-transparent border-gray-100 hover:border-gray-200 text-gray-600 hover:text-gray-800 dark:border-gray-750 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <AlertOctagon size={16} className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div className="flex-1">
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 4: Negative List")}</p>
                                <p className="text-[10px] text-gray-455 mt-0.5 font-normal">{t("Interstate bans and manufacturer restrictions.")}</p>
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
                            <ShieldAlert size={16} className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div className="flex-1">
                                <p className="font-extrabold text-[11px] uppercase tracking-wide">{t("Option 5: RCM & ITC Rules")}</p>
                                <p className="text-[10px] text-gray-455 mt-0.5 font-normal">{t("No inward ITC and normal RCM rates.")}</p>
                            </div>
                        </button>
                    </div>

                    <div className="bg-amber-50/65 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/60 dark:text-amber-400 mt-4 leading-normal flex items-start gap-2">
                        <Info size={14} className="mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>{t("Caution: Opting into the scheme results in standard aggregate invoice limitations. Make sure to consult your professional CA before changing scheme declarations.")}</span>
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
                                className="px-2 py-1 text-[10px] font-extrabold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center gap-1.5"
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

                    {/* Option 1 Detail Pane */}
                    {activeOption === 'eligibility' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div>
                                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                                        {t("Option 1: Scheme Ingestion Eligibility & Turnover Limits")}
                                    </h4>
                                    <p className="text-xs text-gray-450 mt-1">{t("Statutory thresholds and criteria defined under CGST Section 10.")}</p>
                                </div>
                                <Building2 className="text-indigo-600 dark:text-indigo-400" size={20} />
                            </div>

                            {/* Section 1: Statutory Turnover Limits (MADE COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Statutory Ingestion Turnover Limits")}
                                description={t("Annual aggregate turnover boundaries defined by Section 10")}
                                isOpen={expandedSections.turnoverLimits}
                                onToggle={() => toggleSection('turnoverLimits')}
                                icon={<Building2 size={16} />}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/40 rounded-xl">
                                        <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">{t("General States limit")}</p>
                                        <p className="text-xl font-mono font-black text-gray-850 dark:text-gray-100 mt-1">{t("₹1.5 Crores")}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 leading-normal leading-relaxed">{t("Aggregate financial year turnover limit for manufacturers and traders.")}</p>
                                    </div>

                                    <div className="p-4 bg-blue-50/30 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/40 rounded-xl">
                                        <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">{t("Special States limit")}</p>
                                        <p className="text-xl font-mono font-black text-gray-850 dark:text-gray-100 mt-1">{t("₹75 Lakhs")}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 leading-normal leading-relaxed">{t("Applies inside Arunachal, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Uttarakhand.")}</p>
                                    </div>

                                    <div className="p-4 bg-amber-50/30 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/40 rounded-xl">
                                        <p className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">{t("Service Providers")}</p>
                                        <p className="text-xl font-mono font-black text-gray-850 dark:text-gray-100 mt-1">{t("₹50 Lakhs")}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 leading-normal leading-relaxed">{t("Threshold limit for purely service suppliers/mixed providers under Sec 10(2A).")}</p>
                                    </div>
                                </div>
                            </CollapsibleCard>

                            {/* Section 1A: Formula for Aggregate Valuation (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Formula for Aggregate Valuation")}
                                description={t("How your global turnover is tracked under GST rules")}
                                isOpen={expandedSections.aggregateFormula}
                                onToggle={() => toggleSection('aggregateFormula')}
                                icon={<BookOpen size={16} />}
                            >
                                <div className="space-y-3">
                                    <p className="text-xs text-gray-550 dark:text-gray-350 leading-relaxed font-bold">
                                        {t("Aggregate Turnover = (ALL Taxable Supplies + Exempt Supplies + Exports + Interstate Supplies of same PAN) minus (CGST + SGST + IGST + UTGST + Value of Inward RCM purchases).")}
                                    </p>
                                    <p className="text-[11px] text-gray-400 leading-normal">
                                        {t("Note: When checking eligibility, the aggregate turnover of the preceding financial year receives standard evaluation. If turnover cuts above the limit during any ongoing financial year, scheme privileges collapse immediately on that date.")}
                                    </p>
                                </div>
                            </CollapsibleCard>

                            {/* Section 1B: Tax Rate Limits (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Tax Rate Prescribed Limits (Schedule 10)")}
                                description={t("Mandated statutory rates per business category type")}
                                isOpen={expandedSections.taxRates}
                                onToggle={() => toggleSection('taxRates')}
                                icon={<DollarSign size={16} />}
                            >
                                <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/40 rounded-lg p-3 text-xs text-indigo-900 dark:text-indigo-400 space-y-2">
                                    <p className="font-extrabold uppercase tracking-wider">{t("Tax Class Outlines")}:</p>
                                    <ul className="list-disc pl-5 space-y-2 font-bold text-gray-700 dark:text-gray-300">
                                        <li>
                                            <span className="text-indigo-750 dark:text-indigo-400">1.0%</span> {t("for Manufacturers & Traders (0.5% Central + 0.5% State Tax on generic turnover)")}
                                        </li>
                                        <li>
                                            <span className="text-indigo-750 dark:text-indigo-400">5.0%</span> {t("for Restaurants not dispensing alcohol (2.5% Central + 2.5% State Tax)")}
                                        </li>
                                        <li>
                                            <span className="text-indigo-750 dark:text-indigo-400">6.0%</span> {t("for Service Providers / Mixed Practitioners (3.0% Central + 3.0% State tax limit)")}
                                        </li>
                                    </ul>
                                </div>
                            </CollapsibleCard>
                        </div>
                    )}

                    {/* Option 2 Detail Pane */}
                    {activeOption === 'calendars' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div>
                                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                                        {t("Option 2: Forms & Filing Calendars")}
                                    </h4>
                                    <p className="text-xs text-gray-450 mt-1">{t("Statutory forms, due dates and late payment penalties.")}</p>
                                </div>
                                <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
                            </div>

                            {/* Section 2A: FORM GST CMP-08 (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("FORM GST CMP-08")}
                                description={t("Self-Assessed Outward Tax Payment Statement")}
                                isOpen={expandedSections.cmp08Form}
                                onToggle={() => toggleSection('cmp08Form')}
                                icon={<span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>}
                                badge={<span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded">{t("Quarterly")}</span>}
                            >
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {t("Quarterly Self-Assessed Tax statement of liability. Due on or before the ")}
                                        <strong className="text-indigo-600 dark:text-indigo-400">{t("18th day of the month following the quarter")}</strong>.
                                    </p>
                                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold bg-amber-50/40 dark:bg-amber-950/20 p-2 rounded border border-amber-100/50 dark:border-amber-900/30 flex items-start gap-1.5 matches-caution">
                                        <Info size={12} className="mt-0.5 shrink-0" />
                                        <span>{t("Penalty: Interest applies at 18% p.a. on delayed payments starting from the due date.")}</span>
                                    </p>
                                </div>
                            </CollapsibleCard>

                            {/* Section 2B: FORM GSTR-4 (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("FORM GSTR-4 (Annual Return)")}
                                description={t("Compulsory yearly statutory return declaration")}
                                isOpen={expandedSections.gstr4Form}
                                onToggle={() => toggleSection('gstr4Form')}
                                icon={<span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>}
                                badge={<span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded">{t("Annual")}</span>}
                            >
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {t("Annual Return summarising outward supply volume, inward supplies of RCM, and tax calculations. Due on or before ")}
                                        <strong className="text-indigo-600 dark:text-indigo-400">{t("30th April following the close of the financial year")}</strong>.
                                    </p>
                                    <p className="text-[11px] text-rose-700 dark:text-rose-450 font-bold bg-rose-50/40 dark:bg-rose-950/20 p-2 rounded border border-rose-100/50 dark:border-rose-900/30 flex items-start gap-1.5 matches-caution">
                                        <AlertOctagon size={12} className="mt-0.5 shrink-0" />
                                        <span>{t("Late Fee: ₹100/day under CGST + ₹100/day under SGST (capped at a statutory maximum of ₹5,000 total).")}</span>
                                    </p>
                                </div>
                            </CollapsibleCard>

                            {/* Section 2C: FORM GSTR-4A (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("FORM GSTR-4A")}
                                description={t("Auto-drafted inward ledger compiled by systemic filings")}
                                isOpen={expandedSections.gstr4aForm}
                                onToggle={() => toggleSection('gstr4aForm')}
                                icon={<span className="w-2 h-2 bg-indigo-505 rounded-full mt-2"></span>}
                                badge={<span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-405 px-2 py-0.5 rounded">{t("Auto-drafted")}</span>}
                            >
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {t("Auto-drafted inward ledger compiled automatically by the system from supplies declared by vendor outward bills in GSTR-1/5. Used for periodic internal ingestion reconciliation.")}
                                </p>
                            </CollapsibleCard>

                            {/* Section 2D: FORM GST CMP-02 (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("FORM GST CMP-02")}
                                description={t("Submitting formal declaration to opt into composition scheme")}
                                isOpen={expandedSections.cmp02Form}
                                onToggle={() => toggleSection('cmp02Form')}
                                icon={<span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>}
                                badge={<span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded">{t("Opt-In")}</span>}
                            >
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {t("Intimation to levy composition tax under Sec 10. Must be lodged on the GST Portal prior to the commencement of the financial year for which the scheme option is exercised.")}
                                </p>
                            </CollapsibleCard>

                            {/* Section 2E: FORM GST CMP-04 (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("FORM GST CMP-04")}
                                description={t("Withdrawing from the composition scheme option")}
                                isOpen={expandedSections.cmp04Form}
                                onToggle={() => toggleSection('cmp04Form')}
                                icon={<span className="w-2 h-2 bg-rose-500 rounded-full mt-2"></span>}
                                badge={<span className="text-[9px] font-black uppercase text-rose-700 bg-rose-50 dark:bg-rose-955/40 dark:text-rose-400 px-2 py-0.5 rounded">{t("Opt-Out")}</span>}
                            >
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {t("Intimation of withdrawal from the composition scheme. Must be filed within ")}
                                        <strong className="text-rose-600 dark:text-rose-450">{t("7 days")}</strong>
                                        {t(" from the date the aggregate turnover exceeds statutory limits or when decided voluntarily.")}
                                    </p>
                                </div>
                            </CollapsibleCard>
                        </div>
                    )}

                    {/* Option 3 Detail Pane */}
                    {activeOption === 'invoicing' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div>
                                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                                        {t("Option 3: Invoicing Compliance Rules")}
                                    </h4>
                                    <p className="text-xs text-gray-450 mt-1">{t("Statutory invoice formats, mandatory headers, and display mandates.")}</p>
                                </div>
                                <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
                            </div>

                            {/* Section 3A: Strict Invoicing Prohibition (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Strict Invoicing Prohibition")}
                                description={t("Why composition dealers are barred from issuing regular Tax Invoices")}
                                isOpen={expandedSections.invoiceProhibition}
                                onToggle={() => toggleSection('invoiceProhibition')}
                                icon={<AlertOctagon size={16} className="text-amber-500" />}
                            >
                                <div className="p-4 bg-amber-50/20 dark:bg-amber-955/10 border border-dashed border-amber-200 dark:border-amber-900 rounded-xl space-y-2">
                                    <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-400 px-2 py-0.5 rounded">
                                        {t("CRITICAL RULE")}
                                    </span>
                                    <p className="text-xs text-gray-550 dark:text-gray-355 leading-relaxed font-bold">
                                        {t("Composition dealers are strictly barred from issuing a standard 'Tax Invoice'. Because they cannot collect GST taxes from receivers, they must issue a 'Bill of Supply' instead of a regular tax invoice.")}
                                    </p>
                                </div>
                            </CollapsibleCard>

                            {/* Section 3B: Mandatory Compliance Checklist (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Mandatory Invoicing Compliance checklist")}
                                description={t("Statutory components required, phrase details and board disclosures")}
                                isOpen={expandedSections.checklistRules}
                                onToggle={() => toggleSection('checklistRules')}
                                icon={<CheckCircle2 size={16} />}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50/50 dark:bg-gray-901 border border-gray-100 dark:border-gray-750 rounded-xl space-y-2">
                                        <p className="font-extrabold text-xs text-gray-800 dark:text-gray-150 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                                            <CheckCircle2 size={14} />
                                            {t("Mandatory Statement Header")}
                                        </p>
                                        <p className="text-xs text-gray-500 leading-normal leading-relaxed mb-2">
                                            {t("Every Bill of Supply issued by a composition dealer must mention the following statutory phrase at the top:")}
                                        </p>
                                        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-2.5 text-center rounded text-[10px] font-black font-mono text-indigo-700 dark:text-indigo-400 uppercase leading-relaxed">
                                            {t('"Composition taxable person, not eligible to collect tax on supplies"')}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50/50 dark:bg-gray-901 border border-gray-100 dark:border-gray-750 rounded-xl space-y-2">
                                        <p className="font-extrabold text-xs text-gray-800 dark:text-gray-150 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                                            <CheckCircle2 size={14} />
                                            {t("Board Disclosures")}
                                        </p>
                                        <p className="text-xs text-gray-500 leading-normal leading-relaxed">
                                            {t("The statutory words 'Composition Taxable Person' must be printed clearly on every notice board, signage, or company poster displayed at your principal place of business and every auxiliary branch.")}
                                        </p>
                                    </div>
                                </div>
                            </CollapsibleCard>

                            {/* Section 3C: Important Buyer Notice (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Important Buyer Notice")}
                                description={t("How your tax scheme affects buyers claiming Input Tax Credits")}
                                isOpen={expandedSections.buyerCreditNotice}
                                onToggle={() => toggleSection('buyerCreditNotice')}
                                icon={<Info size={16} />}
                            >
                                <div className="p-4 bg-gray-50/60 dark:bg-gray-900 border border-gray-150 dark:border-gray-750 rounded-xl space-y-2 text-xs text-gray-600 dark:text-gray-450 leading-relaxed font-semibold">
                                    <p className="font-black text-gray-850 dark:text-gray-100 uppercase text-[10px] tracking-wider text-rose-500">{t("Important Buyer Notice:")}</p>
                                    <p>{t("Buyers purchasing items from Composition Dealers are formally blocked from claiming any Input Tax Credit (ITC) for such inwards, since no GST is mentioned or collection applied inside the Bill of Supply.")}</p>
                                </div>
                            </CollapsibleCard>
                        </div>
                    )}

                    {/* Option 4 Detail Pane */}
                    {activeOption === 'restrictions' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div>
                                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                                        {t("Option 4: Prohibited Under Section 10 - Negative List")}
                                    </h4>
                                    <p className="text-xs text-gray-450 mt-1">{t("Transactions, items, and manufacturers excluded from opting into the Scheme.")}</p>
                                </div>
                                <AlertOctagon className="text-rose-600 dark:text-rose-450" size={20} />
                            </div>

                            {/* Section 4A: Strict Outward Transaction Bins (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Strict Outward Transaction Bins")}
                                description={t("Major transaction bans on supply methods, channels and locations")}
                                isOpen={expandedSections.outwardBans}
                                onToggle={() => toggleSection('outwardBans')}
                                icon={<AlertOctagon size={16} className="text-rose-500" />}
                            >
                                <div className="p-4 bg-rose-50/20 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-950 rounded-xl space-y-2">
                                    <ul className="list-disc pl-5 text-xs text-gray-650 dark:text-gray-400 space-y-3 leading-relaxed">
                                        <li>
                                            <strong className="text-gray-800 dark:text-gray-150">{t("No Interstate Outward Supplies: ")}</strong>
                                            {t("Dealers cannot supply products or services to any buyer located outside of their home state. Note: receiving interstate purchases is permitted.")}
                                        </li>
                                        <li>
                                            <strong className="text-gray-800 dark:text-gray-150">{t("No E-Commerce Supplies: ")}</strong>
                                            {t("Cannot dispense any goods or services through an Electronic Commerce Operator (ECO) who collects TCS under Section 52.")}
                                        </li>
                                        <li>
                                            <strong className="text-gray-800 dark:text-gray-150">{t("No Non-GST Goods: ")}</strong>
                                            {t("Cannot supply items excluded from the GST net (such as human consumption liquor or petrol/crude products).")}
                                        </li>
                                    </ul>
                                </div>
                            </CollapsibleCard>

                            {/* Section 4B: Prohibited Manufacturing Sectors (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Prohibited Manufacturing Sectors")}
                                description={t("List of blocked processing industries that do not qualify for composition")}
                                isOpen={expandedSections.prohibitedSectors}
                                onToggle={() => toggleSection('prohibitedSectors')}
                                icon={<Building2 size={16} />}
                            >
                                <div className="space-y-3">
                                    <p className="text-xs text-gray-500 leading-normal mb-3">
                                        {t("Taxpayers manufacturing any of the following items are strictly disallowed from using the composition platform:")}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-lg">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                                            <span>{t("Ice cream or other cocoa-frozen foods")}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-lg">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                                            <span>{t("Pan Masala, Gutkha, & Tobacco")}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-lg">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                                            <span>{t("Aerated Waters & Soft Drink syrups")}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 dark:bg-gray-905 border border-gray-100 dark:border-gray-750 rounded-lg">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                                            <span>{t("Fly ash bricks, tiles & building bricks")}</span>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleCard>
                        </div>
                    )}

                    {/* Option 5 Detail Pane */}
                    {activeOption === 'rcm' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div>
                                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                                        {t("Option 5: Reverse Charge & Input Credit Restrictions")}
                                    </h4>
                                    <p className="text-xs text-gray-450 mt-1">{t("Mandatory RCM tax payments, tax invoices, and standard credit blocks.")}</p>
                                </div>
                                <ShieldAlert className="text-indigo-600 dark:text-indigo-400" size={20} />
                            </div>

                            {/* Section 5A: Zero Input Tax Credit (ITC) (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Zero Input Tax Credit (ITC)")}
                                description={t("Why all purchase tax payments are classified as pure cost expenses")}
                                isOpen={expandedSections.zeroItcClaims}
                                onToggle={() => toggleSection('zeroItcClaims')}
                                icon={<ShieldAlert size={16} />}
                            >
                                <div className="p-4 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl space-y-1">
                                    <p className="text-xs text-indigo-950/90 dark:text-indigo-300 leading-relaxed font-bold">
                                        {t("Under Sec 10 of the GST Act, composition dealers are absolutely barred from claiming or availing Input Tax Credit (ITC) on all inward purchases. All taxes paid on incoming purchases must be recognized directly as business cost elements.")}
                                    </p>
                                </div>
                            </CollapsibleCard>

                            {/* Section 5B: Reverse Charge Mechanism (RCM) Liability (COLLAPSIBLE) */}
                            <CollapsibleCard
                                title={t("Reverse Charge Mechanism (RCM) Liability")}
                                description={t("Special statutory payments on reverse charges in physical cash")}
                                isOpen={expandedSections.rcmLiability}
                                onToggle={() => toggleSection('rcmLiability')}
                                icon={<DollarSign size={16} />}
                            >
                                <div className="p-4 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-xl space-y-3">
                                    <p className="text-xs text-gray-550 dark:text-gray-355 leading-relaxed font-semibold">
                                        {t("If a composition dealer purchases goods or services subject to Reverse Charge (such as GTA, legal services, raw imports, or purchases from unregistered vendors under Section 9(4)), the dealer must discharge this tax liability:")}
                                    </p>
                                    <ul className="list-disc pl-5 text-xs text-gray-655 dark:text-gray-400 space-y-2 leading-relaxed font-bold">
                                        <li>
                                            <strong className="text-gray-800 dark:text-gray-150">{t("Apply Regular Rates: ")}</strong>
                                            {t("The tax must be discharged at the normal standard rate (e.g. 5%, 12%, 18%, 28%) applicable to the specific service or good, and NOT the low composition rates (1% or 5%).")}
                                        </li>
                                        <li>
                                            <strong className="text-gray-800 dark:text-gray-150">{t("No ITC Offsets: ")}</strong>
                                            {t("No ITC can be availed on the RCM tax paid. The cash ledger payment is a direct outward expense.")}
                                        </li>
                                        <li>
                                            <strong className="text-gray-800 dark:text-gray-150">{t("Cash Settlement: ")}</strong>
                                            {t("RCM taxes must be discharged purely in cash using Card/UPI/Challan ledgers, and can never be adjusted from other balances.")}
                                        </li>
                                    </ul>
                                </div>
                            </CollapsibleCard>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};
