import React from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { Building2, BookOpen, DollarSign, Info } from 'lucide-react';
import { CollapsibleCard } from '../../../Shared/CollapsibleCard';
import { RegularExpandedSections } from '../types';

interface RegularEligibilityViewProps {
    expandedSections: RegularExpandedSections;
    onToggle: (sectionName: keyof RegularExpandedSections) => void;
}

export const RegularEligibilityView: React.FC<RegularEligibilityViewProps> = ({ expandedSections, onToggle }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                        {t("Option 1: Registration Thresholds & Levy")}
                    </h4>
                    <p className="text-xs text-gray-450 mt-1">{t("Statutory registration limits under Section 22 and regular levy definitions.")}</p>
                </div>
                <Building2 className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>

            {/* Section 1: Standard Registration Limits */}
            <CollapsibleCard
                title={t("Statutory Registration Thresholds")}
                description={t("Annual aggregate turnover limit for mandatory GST registration")}
                isOpen={expandedSections.turnoverLimits}
                onToggle={() => onToggle('turnoverLimits')}
                icon={<Building2 size={16} />}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/40 rounded-xl">
                        <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">{t("Goods Supplier Limit")}</p>
                        <p className="text-xl font-mono font-black text-gray-850 dark:text-gray-100 mt-1">{t("₹40 Lakhs")}</p>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{t("Standard mandatory threshold limit for suppliers engaged exclusively in supply of goods.")}</p>
                    </div>

                    <div className="p-4 bg-blue-50/30 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/40 rounded-xl">
                        <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">{t("Services / Mixed Suppliers")}</p>
                        <p className="text-xl font-mono font-black text-gray-850 dark:text-gray-100 mt-1">{t("₹20 Lakhs")}</p>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{t("Mandatory registration limits for services or mixed (goods + service) business entities.")}</p>
                    </div>

                    <div className="p-4 bg-amber-50/30 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/40 rounded-xl">
                        <p className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">{t("Special Category States")}</p>
                        <p className="text-xl font-mono font-black text-gray-850 dark:text-gray-100 mt-1">{t("₹10 / ₹20 Lakhs")}</p>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{t("Reduced limits for northeastern hilly states like Mizoram, Manipur, Nagaland, and Tripura.")}</p>
                    </div>
                </div>
            </CollapsibleCard>

            {/* Section 2: Standard Levy & Tax brackets */}
            <CollapsibleCard
                title={t("Section 9: Standard Levy & Custom Rates")}
                description={t("Default CGST, SGST, IGST tax structures for regular filings")}
                isOpen={expandedSections.levyTaxRates}
                onToggle={() => onToggle('levyTaxRates')}
                icon={<DollarSign size={16} />}
            >
                <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/40 rounded-lg p-3 text-xs text-indigo-900 dark:text-indigo-400 space-y-2">
                    <p className="font-extrabold uppercase tracking-wider">{t("Standard Tax Tiers under CGST:")}</p>
                    <ul className="list-disc pl-5 space-y-2 font-bold text-gray-700 dark:text-gray-300">
                        <li>
                            <span className="text-indigo-750 dark:text-indigo-400">5.0%</span> {t("for Essential supplies, household provisions, coal, and generic goods.")}
                        </li>
                        <li>
                            <span className="text-indigo-750 dark:text-indigo-400">12.0%</span> {t("for Business utilities, mobile electronic devices, processed foods.")}
                        </li>
                        <li>
                            <span className="text-indigo-750 dark:text-indigo-400">18.0%</span> {t("for IT consulting software, capital assets, standard services (Default Rate).")}
                        </li>
                        <li>
                            <span className="text-indigo-750 dark:text-indigo-400">28.0%</span> {t("for luxury goods, automobiles, high-end electronics, aerated drinks.")}
                        </li>
                    </ul>
                </div>
            </CollapsibleCard>

            {/* Section 3: Mandatory Registrations under CGST Sec 24 */}
            <CollapsibleCard
                title={t("Mandatory Registrations (Section 24)")}
                description={t("Situations when GST registration is mandatory without any threshold boundaries")}
                isOpen={expandedSections.registrationMandatory}
                onToggle={() => onToggle('registrationMandatory')}
                icon={<BookOpen size={16} />}
            >
                <div className="space-y-3">
                    <p className="text-xs text-gray-550 dark:text-gray-355 leading-relaxed font-bold">
                        {t("Taxpayers matching any of the following items MUST register under Regular GST Scheme, even if their annual aggregate turnover is under the ₹20L/₹40L boundaries:")}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 font-bold text-gray-700 dark:text-gray-300 text-xs">
                        <li>
                            <strong className="text-indigo-600 dark:text-indigo-400">{t("Inter-State Suppliers: ")}</strong>
                            {t("Persons making any outward inter-state taxable supplies of goods.")}
                        </li>
                        <li>
                            <strong className="text-indigo-600 dark:text-indigo-400">{t("RCM Payers: ")}</strong>
                            {t("Persons who are required to pay tax under Reverse Charge Mechanism (RCM).")}
                        </li>
                        <li>
                            <strong className="text-indigo-600 dark:text-indigo-400">{t("E-Commerce Operators: ")}</strong>
                            {t("Electronic commerce actors who are mandated to collect tax source at source (TCS) under Section 52.")}
                        </li>
                        <li>
                            <strong className="text-indigo-600 dark:text-indigo-400">{t("Non-Resident Taxable Persons: ")}</strong>
                            {t("Non-residents supplying taxable goods or services occasionally inside India.")}
                        </li>
                    </ul>
                </div>
            </CollapsibleCard>
        </div>
    );
};
