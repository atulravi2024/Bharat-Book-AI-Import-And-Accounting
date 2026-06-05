import React from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { ShieldAlert, DollarSign } from 'lucide-react';
import { CollapsibleCard } from '../../../Shared/CollapsibleCard';
import { RegularExpandedSections } from '../types';

interface RegularRcmLiabilityViewProps {
    expandedSections: RegularExpandedSections;
    onToggle: (sectionName: keyof RegularExpandedSections) => void;
}

export const RegularRcmLiabilityView: React.FC<RegularRcmLiabilityViewProps> = ({ expandedSections, onToggle }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                        {t("Option 5: Reverse Charge (RCM) Liabilities")}
                    </h4>
                    <p className="text-xs text-gray-450 mt-1">{t("Statutory liabilities and payment regulations defined under Section 9(3) and 9(4).")}</p>
                </div>
                <ShieldAlert className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>

            {/* Section A: Standard RCM Categories */}
            <CollapsibleCard
                title={t("Notified RCM Services (Section 9(3))")}
                description={t("Standard supply lists where tax liabilities shift to recipient")}
                isOpen={expandedSections.rcmCategories}
                onToggle={() => onToggle('rcmCategories')}
                icon={<ShieldAlert size={16} />}
            >
                <div className="space-y-3">
                    <p className="text-xs text-gray-500 leading-normal mb-2 font-bold">
                        {t("Standard transactions where tax is paid directly by the buyer under reverse charge rules:")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-lg">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                            <span>{t("Goods Transport Agency (GTA) services")}</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-lg">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                            <span>{t("Legal services from individual Advocates / Firms")}</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-lg">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                            <span>{t("Services provided by Corporate Directors")}</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-lg">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                            <span>{t("Security and rent-a-cab unregistered services")}</span>
                        </div>
                    </div>
                </div>
            </CollapsibleCard>

            {/* Section B: Standard RCM Payment Instructions */}
            <CollapsibleCard
                title={t("Statutory RCM Payment Instructions")}
                description={t("Mandatory cash payment offsets, self-invoicing rules and ITC options")}
                isOpen={expandedSections.rcmNoItcRestrictions}
                onToggle={() => onToggle('rcmNoItcRestrictions')}
                icon={<DollarSign size={16} />}
            >
                <div className="p-4 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-xl space-y-3">
                    <p className="text-xs text-gray-550 dark:text-gray-355 leading-relaxed font-semibold">
                        {t("Regular taxpayers discharging reverse charge tax duties must follow these mandatory requirements:")}
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-655 dark:text-gray-400 space-y-2.5 leading-relaxed font-bold">
                        <li>
                            <strong className="text-gray-800 dark:text-gray-150">{t("No Balance adjustment: ")}</strong>
                            {t("RCM tax liabilities CANNOT be paid or settled using available Input tax balances in the credit ledger. It must be paid solely in cash.")}
                        </li>
                        <li>
                            <strong className="text-gray-800 dark:text-gray-150">{t("Self-Invoiced Records: ")}</strong>
                            {t("Under Section 31(3)(f), the recipient must generate and issue a self-designed Tax Invoice for all RCM transactions on the purchase date.")}
                        </li>
                        <li>
                            <strong className="text-gray-800 dark:text-gray-150">{t("ITC Claim Eligibility: ")}</strong>
                            {t("The cash paid towards RCM tax can be claimed back fully as Input Tax Credit (ITC) in the same filing month, subject to standard Section 16/17 clauses.")}
                        </li>
                    </ul>
                </div>
            </CollapsibleCard>
        </div>
    );
};
