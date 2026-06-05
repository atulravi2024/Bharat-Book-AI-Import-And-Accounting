import React from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { ShieldAlert, AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import { CollapsibleCard } from '../../../Shared/CollapsibleCard';
import { RegularExpandedSections } from '../types';

interface RegularItcClaimsViewProps {
    expandedSections: RegularExpandedSections;
    onToggle: (sectionName: keyof RegularExpandedSections) => void;
}

export const RegularItcClaimsView: React.FC<RegularItcClaimsViewProps> = ({ expandedSections, onToggle }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                        {t("Option 4: Inward ITC Claims & Reconciliation")}
                    </h4>
                    <p className="text-xs text-gray-450 mt-1">{t("Statutory constraints of Section 16, blocked credits Section 17(5), and GSTR-2B reconciliation.")}</p>
                </div>
                <ShieldAlert className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>

            {/* Section A: Section 16 eligibility parameters */}
            <CollapsibleCard
                title={t("Section 16: Core ITC Claim Conditions")}
                description={t("Mandatory statutory items required to confirm an invoice credit claim")}
                isOpen={expandedSections.section16Rules}
                onToggle={() => onToggle('section16Rules')}
                icon={<CheckCircle2 size={16} />}
            >
                <div className="space-y-3">
                    <p className="text-xs text-gray-500 leading-normal font-semibold">
                        {t("To avail standard Input Tax Credit (ITC) for any inward supply, four conditions must be satisfied concurrently:")}
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-700 dark:text-gray-300 font-bold">
                        <li>
                            <strong className="text-indigo-700 dark:text-indigo-400">{t("Possession of Invoice: ")}</strong>
                            {t("Taxpayer must hold a valid Tax Invoice, Debit Note, or bill of entry document issued by the registered vendor.")}
                        </li>
                        <li>
                            <strong className="text-indigo-700 dark:text-indigo-400">{t("Receipt of Goods/Services: ")}</strong>
                            {t("The taxpayer must have actually received the underlying commodities or services.")}
                        </li>
                        <li>
                            <strong className="text-indigo-700 dark:text-indigo-400">{t("Tax Payment by Vendor: ")}</strong>
                            {t("The underlying tax must have been actually paid to the Government, either in cash or through ITC offset by the vendor.")}
                        </li>
                        <li>
                            <strong className="text-indigo-700 dark:text-indigo-400">{t("Filing of Return: ")}</strong>
                            {t("The recipient must have filed their regular summary return in Form GSTR-3B.")}
                        </li>
                    </ol>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold bg-amber-50/40 dark:bg-amber-950/20 p-2.5 rounded border border-amber-100/50 dark:border-amber-900/30">
                        {t("180 Days Rule: The recipient must make full payment to the supplier for the goods/services along with tax within 180 days of the invoice date. If not paid, the claimed credit must be added to outward tax liability with interest.")}
                    </p>
                </div>
            </CollapsibleCard>

            {/* Section B: Blocked Credits 17(5) */}
            <CollapsibleCard
                title={t("Section 17(5): Blocked Credit Lists")}
                description={t("Standard purchases and services on which Input Tax Credit is strictly prohibited")}
                isOpen={expandedSections.blockCredits17_5}
                onToggle={() => onToggle('blockCredits17_5')}
                icon={<AlertOctagon size={16} className="text-rose-500" />}
            >
                <div className="p-4 bg-rose-50/20 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-950 rounded-xl space-y-2">
                    <p className="font-extrabold text-xs text-rose-800 dark:text-rose-400 uppercase tracking-wider">{t("Blocked Credit Categories:")}</p>
                    <ul className="list-disc pl-5 text-xs text-gray-650 dark:text-gray-400 space-y-3 leading-relaxed font-bold">
                        <li>
                            <strong className="text-gray-800 dark:text-gray-150">{t("Motor Vehicles: ")}</strong>
                            {t("ITC blocked on passenger vehicles with seating capacity <= 13 (unless supplied or used for driving/transit businesses).")}
                        </li>
                        <li>
                            <strong className="text-gray-800 dark:text-gray-150">{t("Food, Catering & Club: ")}</strong>
                            {t("Blocked on Food and beverages, outdoor catering, beauty treatment, health services, travel benefits, life/health insurance, and gym memberships.")}
                        </li>
                        <li>
                            <strong className="text-gray-800 dark:text-gray-150">{t("Gifts & Free Samples: ")}</strong>
                            {t("No ITC on commodities lost, stolen, destroyed, written off, or supplied as free samples or gifts.")}
                        </li>
                        <li>
                            <strong className="text-gray-800 dark:text-gray-150">{t("Works Contract Services: ")}</strong>
                            {t("Blocked when supplied for construction of an immovable property (other than plant & machinery under corporate books).")}
                        </li>
                    </ul>
                </div>
            </CollapsibleCard>

            {/* Section C: GSTR-2B Matching Rule 36(4) */}
            <CollapsibleCard
                title={t("GSTR-2B Reconciliation Rule 36(4)")}
                description={t("Strict credit claim restrictions aligned with supplier returns uploads")}
                isOpen={expandedSections.itcReconciliation}
                onToggle={() => onToggle('itcReconciliation')}
                icon={<Info size={16} />}
            >
                <div className="p-4 bg-gray-50/60 dark:bg-gray-900 border border-gray-150 dark:border-gray-750 rounded-xl space-y-2 text-xs text-gray-650 dark:text-gray-400 leading-relaxed font-semibold">
                    <p className="font-black text-gray-850 dark:text-gray-100 uppercase text-[10px] tracking-wider text-rose-500">{t("Rec Rule 36(4):")}</p>
                    <p>{t("Effective from 1st January 2022, provisional ITC claims are completely abolished. Taxpayers can claim Input Tax Credit on inward purchases ONLY if those details are uploaded by suppliers in GSTR-1 and subsequently visualised in the static auto-drafted GSTR-2B statement of the recipient. Monthly reconciliation is mandatory.")}</p>
                </div>
            </CollapsibleCard>
        </div>
    );
};
