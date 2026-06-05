import React from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
    Info 
} from 'lucide-react';

interface CompositionGuidelinesProps {
    useSampleData: boolean;
    onToggleSampleData?: (enabled: boolean) => void;
}

export const CompositionGuidelines: React.FC<CompositionGuidelinesProps> = ({ useSampleData }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            {/* Top Stat Banner */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                    {t("Filing Calendars & Rules")}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                    {t("Composition Statutory Guidelines Desk")}
                </h3>
                <p className="text-xs text-gray-500">
                    {t("View forms schedule, tax rates list, filing constraints and standard due date compliance calendars.")}
                </p>
            </div>

            {/* Guideline module */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs dark:bg-gray-800 dark:border-gray-800">
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-3 font-semibold">
                        <div>
                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("Composition Scheme Statutory Parameters Option")}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{t("Deadlines, rules, forms and rates checklist prescribed under SGST/CGST Act Section 10.")}</p>
                        </div>
                        <Info className="text-indigo-600 animate-pulse" size={18} />
                    </div>

                    {/* Table of different Forms */}
                    <div className="space-y-4">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("Form Register Reference Book")}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50/50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
                                <p className="font-bold text-xs text-gray-800 dark:text-gray-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                    {t("FORM GST CMP-08")}
                                </p>
                                <p className="text-xs text-gray-500 leading-normal">
                                    {t("Quarterly Statement of payment of self-assessed tax. Due on the 18th of the month following the end of the quarter. Late fees: ₹100/day up to a maximum of ₹5,000.")}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50/50 dark:bg-gray-905 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
                                <p className="font-bold text-xs text-gray-800 dark:text-gray-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                    {t("FORM GSTR-4 (Annual)")}
                                </p>
                                <p className="text-xs text-gray-500 leading-normal">
                                    {t("Annual Return for Composition Dealers summarizing aggregate supplies, inward RCM details, and taxes. Due on 30th April following the close of the financial year.")}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50/50 dark:bg-gray-905 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
                                <p className="font-bold text-xs text-gray-805 dark:text-gray-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                    {t("FORM GSTR-4A (Auto-Drafted)")}
                                </p>
                                <p className="text-xs text-gray-500 leading-normal">
                                    {t("Auto-drafted outward supplies compiled dynamically based on suppliers' records under Form GSTR-1/5. Contains reverse charge details.")}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50/50 dark:bg-gray-905 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
                                <p className="font-bold text-xs text-gray-805 dark:text-gray-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                    {t("FORM GST CMP-02 (Opt-In)")}
                                </p>
                                <p className="text-xs text-gray-500 leading-normal">
                                    {t("Intimation of option to levy composition tax under Sec 10. Must be lodged prior to the commencement of the financial year for which the scheme option is exercised.")}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs text-indigo-850 dark:bg-indigo-950/20 dark:border-indigo-950 dark:text-indigo-400 space-y-2 animate-fade-in">
                            <p className="font-black uppercase tracking-wider">{t("Tax Rate Prescribed Limits (Schedule 10)")}:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>1%</strong> {t("for Manufacturers & retail traders (0.5% Central + 0.5% State Tax)")}</li>
                                <li><strong>5%</strong> {t("for Restaurants not serving alcohol (2.5% Central + 2.5% State Tax)")}</li>
                                <li><strong>6%</strong> {t("for Mixed Service providers, builders and small service practitioners (3% Central + 3% State Tax)")}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
