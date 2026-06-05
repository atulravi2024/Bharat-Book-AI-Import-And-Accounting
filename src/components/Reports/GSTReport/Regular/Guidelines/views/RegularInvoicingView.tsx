import React from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { FileText, AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import { CollapsibleCard } from '../../../Shared/CollapsibleCard';
import { RegularExpandedSections } from '../types';

interface RegularInvoicingViewProps {
    expandedSections: RegularExpandedSections;
    onToggle: (sectionName: keyof RegularExpandedSections) => void;
}

export const RegularInvoicingView: React.FC<RegularInvoicingViewProps> = ({ expandedSections, onToggle }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                        {t("Option 3: Regular Invoicing & HSN Rules")}
                    </h4>
                    <p className="text-xs text-gray-450 mt-1">{t("Tax invoice parameters, Rule 46 compliance, e-Invoice thresholds, and HSN codes.")}</p>
                </div>
                <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>

            {/* Section A: Standard Tax Invoice Rule 46 */}
            <CollapsibleCard
                title={t("Rule 46: Regular Tax Invoice parameters")}
                description={t("Mandatory statutory components needed on every standard Tax Invoice")}
                isOpen={expandedSections.regularInvoice}
                onToggle={() => onToggle('regularInvoice')}
                icon={<CheckCircle2 size={16} />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-xl space-y-2">
                        <p className="font-extrabold text-xs text-gray-800 dark:text-gray-150 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                            <CheckCircle2 size={14} />
                            {t("Required Metadata & Headings")}
                        </p>
                        <p className="text-xs text-gray-500 leading-normal leading-relaxed">
                            {t("A Tax Invoice MUST have - Consecutive Serial Number, Date of issue, Supplier GSTIN & Address, Recipient GSTIN & Billing/Shipping Address (where registered).")}
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-xl space-y-2">
                        <p className="font-extrabold text-xs text-gray-800 dark:text-gray-150 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                            <CheckCircle2 size={14} />
                            {t("Tax Breakdown Disclosure")}
                        </p>
                        <p className="text-xs text-gray-500 leading-normal leading-relaxed">
                            {t("Explicit division of CGST/SGST (intra-state transfers) or IGST (inter-state transfers), description of commodities, quantity supplied, unit rate, and total values.")}
                        </p>
                    </div>
                </div>
            </CollapsibleCard>

            {/* Section B: e-Invoice Thresholds */}
            <CollapsibleCard
                title={t("Mandatory e-Invoicing Limit (₹5 Crores)")}
                description={t("Taxpayer aggregate turnover limits for compulsory e-Invoice IRN registration")}
                isOpen={expandedSections.eInvoiceThreshold}
                onToggle={() => onToggle('eInvoiceThreshold')}
                icon={<AlertOctagon size={16} className="text-amber-500" />}
            >
                <div className="p-4 bg-amber-50/20 dark:bg-amber-950/10 border border-dashed border-amber-200 dark:border-amber-900 rounded-xl space-y-2">
                    <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-400 px-2 py-0.5 rounded">
                        {t("CRITICAL THRESHOLD")}
                    </span>
                    <p className="text-xs text-gray-550 dark:text-gray-355 leading-relaxed font-bold">
                        {t("e-Invoicing is mandatory for all regular businesses if their aggregate annual turnover exceeds")}
                        <strong className="text-indigo-700 dark:text-indigo-400"> {t("₹5 Crores")}</strong>
                        {t(" in any preceding financial year since 2517-18 (Phase VI implemented with effect from 1st August 2023).")}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                        {t("Note: Invoices not validated through the Invoice Registration Portal (IRP) generating a valid IRN and Signed QR Code are treated as legally invalid invoices.")}
                    </p>
                </div>
            </CollapsibleCard>

            {/* Section C: HSN Digit Rules */}
            <CollapsibleCard
                title={t("HSN Digit Rules (Notification 78/2020)")}
                description={t("Compulsory HSN digits requirement structured around aggregate business turnover")}
                isOpen={expandedSections.hsnRequirements}
                onToggle={() => onToggle('hsnRequirements')}
                icon={<Info size={16} />}
            >
                <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/40 rounded-lg p-4 text-xs text-indigo-900 dark:text-indigo-400 space-y-3">
                    <p className="font-extrabold uppercase tracking-wide">{t("HSN Coding Mandates:")}</p>
                    <ul className="list-disc pl-5 space-y-2.5 text-gray-700 dark:text-gray-300 font-bold">
                        <li>
                            <strong className="text-indigo-700 dark:text-indigo-400">{t("Up to ₹5 Crores Turnover: ")}</strong>
                            {t("Minimum 4 Digits are mandatory on B2B invoices. (B2C invoicing is optional).")}
                        </li>
                        <li>
                            <strong className="text-indigo-700 dark:text-indigo-400">{t("Above ₹5 Crores Turnover: ")}</strong>
                            {t("Minimum 6 Digits are mandatory for both B2B and B2C invoices.")}
                        </li>
                        <li>
                            <strong className="text-indigo-700 dark:text-indigo-400">{t("Import / Export items: ")}</strong>
                            {t("8 Digits HSN are mandatory regardless of company aggregate turnover.")}
                        </li>
                    </ul>
                </div>
            </CollapsibleCard>
        </div>
    );
};
