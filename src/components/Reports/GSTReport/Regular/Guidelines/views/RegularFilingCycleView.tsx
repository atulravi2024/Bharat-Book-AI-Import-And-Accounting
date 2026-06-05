import React from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { Calendar, AlertOctagon, Info } from 'lucide-react';
import { CollapsibleCard } from '../../../Shared/CollapsibleCard';
import { RegularExpandedSections } from '../types';

interface RegularFilingCycleViewProps {
    expandedSections: RegularExpandedSections;
    onToggle: (sectionName: keyof RegularExpandedSections) => void;
}

export const RegularFilingCycleView: React.FC<RegularFilingCycleViewProps> = ({ expandedSections, onToggle }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                    <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100 uppercase tracking-wide">
                        {t("Option 2: Filing Return Calendars")}
                    </h4>
                    <p className="text-xs text-gray-450 mt-1">{t("Statutory returns, due dates, filing cycles (Monthly/QRMP), and penalties.")}</p>
                </div>
                <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>

            {/* Section A: GSTR-1 */}
            <CollapsibleCard
                title={t("Form GSTR-1 (Outward Supplies Return)")}
                description={t("Statement of outward supplies details of goods or services")}
                isOpen={expandedSections.gstr1Form}
                onToggle={() => onToggle('gstr1Form')}
                icon={<span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>}
                badge={<span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded">{t("Monthly / Quarterly")}</span>}
            >
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {t("Statement of GST-registered taxpayers to report outward B2B and B2C sales invoice details. Due date guidelines:")}
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-700 dark:text-gray-300 space-y-1.5 font-bold">
                        <li><strong className="text-indigo-600 dark:text-indigo-400">{t("Monthly filing cycle: ")}</strong> {t("11th day of the succeeding month.")}</li>
                        <li><strong className="text-indigo-600 dark:text-indigo-400">{t("QRMP filing cycle (IFF): ")}</strong> {t("13th day of the month following the quarter.")}</li>
                    </ul>
                </div>
            </CollapsibleCard>

            {/* Section B: GSTR-2B */}
            <CollapsibleCard
                title={t("Form GSTR-2B (Static Inward ITC Statement)")}
                description={t("System generated static statement mapping eligible input credit")}
                isOpen={expandedSections.gstr2bForm}
                onToggle={() => onToggle('gstr2bForm')}
                icon={<span className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></span>}
                badge={<span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-450 px-2 py-0.5 rounded">{t("Auto-drafted")}</span>}
            >
                <p className="text-xs text-gray-500 leading-relaxed">
                    {t("A static auto-drafted statement indicating the availability of ITC for each GSTIN. It is generated on the ")}
                    <strong className="text-indigo-600 dark:text-indigo-400">{t("14th of every month")}</strong>
                    {t(", and cannot be modified by the taxpayer. This is the statutory document for input tax credit reconciliation.")}
                </p>
            </CollapsibleCard>

            {/* Section C: GSTR-3B */}
            <CollapsibleCard
                title={t("Form GSTR-3B (Periodic Summary Return)")}
                description={t("Mandatory summary of taxable outward/inward supplies and tax payments")}
                isOpen={expandedSections.gstr3bForm}
                onToggle={() => onToggle('gstr3bForm')}
                icon={<span className="w-2 h-2 bg-amber-500 rounded-full mt-2"></span>}
                badge={<span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded">{t("Tax Settlement")}</span>}
            >
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {t("A self-declared summary return filed by regular taxpayers to discharge liabilities and report claimed credits.")}
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-750 dark:text-gray-300 space-y-1.5 font-bold">
                        <li><strong className="text-indigo-600 dark:text-indigo-400">{t("Monthly filing cycle: ")}</strong> {t("20th day of the succeeding month.")}</li>
                        <li><strong className="text-indigo-600 dark:text-indigo-400">{t("Quarterly (QRMP) filing cycle: ")}</strong> {t("22nd or 24th day of the month following the quarter, based on state jurisdiction.")}</li>
                    </ul>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold bg-amber-50/40 dark:bg-amber-950/20 p-2 rounded border border-amber-100/50 dark:border-amber-900/30 flex items-start gap-1.5 matches-caution">
                        <Info size={12} className="mt-0.5 shrink-0" />
                        <span>{t("Late payment interest: Calculated at 18% p.a. on the net cash tax liability from the day following the due date.")}</span>
                    </p>
                </div>
            </CollapsibleCard>

            {/* Section D: GSTR-9 */}
            <CollapsibleCard
                title={t("Form GSTR-9 (Annual Consolidated Return)")}
                description={t("Consolidated statement summarizing fiscal sales, ITC and tax paid")}
                isOpen={expandedSections.gstr9Form}
                onToggle={() => onToggle('gstr9Form')}
                icon={<span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>}
                badge={<span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded">{t("Annual Return")}</span>}
            >
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {t("The annual compliance report compiles all monthly/quarterly filings of GSTR-1 and GSTR-3B of the preceding fiscal. It is due on or before:")}
                    </p>
                    <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 rounded-lg p-2.5 font-mono text-center text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase">
                        {t("31st December following the close of the financial year")}
                    </div>
                    <p className="text-[11px] text-rose-700 dark:text-rose-455 font-bold bg-rose-50/40 dark:bg-rose-950/20 p-2 rounded border border-rose-100/50 dark:border-rose-900/30 flex items-start gap-1.5">
                        <AlertOctagon size={12} className="mt-0.5 shrink-0" />
                        <span>{t("Late Fee: ₹200/day (₹100 CGST + ₹100 SGST) capped at a maximum of 0.25% of turnover in the respective State.")}</span>
                    </p>
                </div>
            </CollapsibleCard>
        </div>
    );
};
