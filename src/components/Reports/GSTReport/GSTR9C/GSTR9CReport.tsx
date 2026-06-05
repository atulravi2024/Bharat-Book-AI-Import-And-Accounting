import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info, CheckCircle, Scale, PenTool, ShieldAlert } from 'lucide-react';

interface GSTR9CReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR9CReport: React.FC<GSTR9CReportProps> = ({ useSampleData, onToggleSampleData }) => {
  const { t, formatNumber  } = useLanguage();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [subTab, setSubTab] = useState<'turnover' | 'tax' | 'itc' | 'recommendation'>('turnover');

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/g9c_data.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR9C sample data", err);
                    setLoading(false);
                });
        } else {
            setData(null);
        }
    }, [useSampleData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center dark:text-gray-100">
                        <FileText className="mr-2 text-indigo-650 text-indigo-600" size={20} />
                        {t("GSTR-9C Audited Reconciliation Statement")}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">
                        {t("Dual reconciliation of physical financial audits vs filed annual returns (GSTR-9) certified by CA audit team")}
                    </p>
                </div>
                {data && (
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 dark:bg-gray-900/40 dark:border-gray-750">
                        <div><span className="text-gray-400">{t("Auditor:")}</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{data.auditor_name}</span></div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div><span className="text-gray-400">{t("FY:")}</span> <span className="font-bold text-gray-700 dark:text-gray-300">{data.fy}</span></div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="space-y-6">
                    {/* Secondary Navigation tabs */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-thin whitespace-nowrap bg-white p-1 rounded-xl shadow-xs dark:bg-gray-800">
                        <button
                            onClick={() => setSubTab('turnover')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${subTab === 'turnover' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {t("Turnover Reconciliation (Part II)")}
                        </button>
                        <button
                            onClick={() => setSubTab('tax')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${subTab === 'tax' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {t("Rate-wise Tax Reconciliation (Part III)")}
                        </button>
                        <button
                            onClick={() => setSubTab('itc')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${subTab === 'itc' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {t("ITC Credit Reconciliation (Part IV)")}
                        </button>
                        <button
                            onClick={() => setSubTab('recommendation')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${subTab === 'recommendation' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {t("Auditor Recommendations (Part V)")}
                        </button>
                    </div>

                    {/* Turnover Reconciliation Block */}
                    {subTab === 'turnover' && (
                        <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                            <div className="p-4 bg-indigo-50/40 border-b border-gray-150 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-750 dark:text-gray-300">
                                {t("Reconciliation of Gross Turnover as per Audited Books with Return Filings")}
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-xs text-gray-600 font-semibold dark:text-gray-350">{t("Gross Turnover as per Audited Financial Statements")}</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">₹{formatNumber(Number(data.turnover_reconciliation?.audited_financial_turnover))}</span>
                                </div>

                                <div className="pl-4 pr-2 py-1 bg-emerald-50/30 border-l-2 border-emerald-500 rounded dark:bg-emerald-950/5">
                                    <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-450 mb-1">{t("Additions for unaddressed items during books closing:")}</p>
                                    {data.turnover_reconciliation?.additions?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center py-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                                            <span>• {t(item.particulars)}</span>
                                            <span className="font-semibold">+ ₹{formatNumber(Number(item.amount))}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pl-4 pr-2 py-1 bg-amber-50/30 border-l-2 border-amber-500 rounded dark:bg-amber-950/5">
                                    <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-450 mb-1">{t("Deductions for prior overlaps & provisions:")}</p>
                                    {data.turnover_reconciliation?.deductions?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center py-1.5 text-xs text-amber-800 dark:text-amber-300">
                                            <span>• {t(item.particulars)}</span>
                                            <span className="font-semibold">- ₹{formatNumber(Number(item.amount))}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center py-3 px-4 mt-6 bg-indigo-50 border border-indigo-150 rounded-xl dark:bg-indigo-950/25 dark:border-indigo-900/30">
                                    <div>
                                        <h4 className="font-extrabold text-indigo-900 text-xs dark:text-indigo-300">{t("Reconciled Gross Annual Turnover (Calculated)")}</h4>
                                        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">{t("Matches computed target statements")}</p>
                                    </div>
                                    <span className="text-base font-black text-indigo-900 dark:text-indigo-305">₹{formatNumber(Number(data.turnover_reconciliation?.reconciled_turnover))}</span>
                                </div>

                                <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-xs text-gray-650 font-bold dark:text-gray-350">{t("Turnover actually declared in Annual Return (GSTR-9)")}</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(Number(data.turnover_reconciliation?.announced_gstr9_turnover))}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 bg-gray-50 border border-gray-100 px-4 rounded-xl dark:bg-gray-900 dark:border-gray-750">
                                    <span className="text-xs font-extrabold text-gray-700 dark:text-gray-250 flex items-center gap-1.5">
                                        <Scale size={16} className="text-emerald-500" />
                                        {t("Unreconciled Gross Audit Difference")}
                                    </span>
                                    <span className={`text-sm font-black ${data.turnover_reconciliation?.unreconciled_turnover > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                        ₹{formatNumber(Number(data.turnover_reconciliation?.unreconciled_turnover))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rate-Wise Tax Liability Reconciliation */}
                    {subTab === 'tax' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                            <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                {t("Rate-wise Taxable supplies and liabilities declared in physical books vs returns")}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">{t("Tax Percentage Rate")}</th>
                                            <th className="px-4 py-3 font-semibold text-right">{t("Taxable Turnover")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-indigo-600">{t("Tax Payable as per Books")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-blue-600">{t("Tax Actually Settled in GSTR-9")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-emerald-600">{t("Reconciliation Variance")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {data.tax_liability_reconciliation?.map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                                <td className="px-4 py-3.5 font-bold text-gray-700 dark:text-gray-300">{t(row.rate)}</td>
                                                <td className="px-4 py-3.5 text-right font-medium text-gray-800 dark:text-gray-100">₹{formatNumber(Number(row.taxable_val))}</td>
                                                <td className="px-4 py-3.5 text-right text-indigo-600 font-semibold bg-indigo-50/5">₹{formatNumber(Number(row.liability_audited))}</td>
                                                <td className="px-4 py-3.5 text-right text-blue-700 font-semibold bg-blue-50/5">₹{formatNumber(Number(row.liability_paid))}</td>
                                                <td className="px-4 py-3.5 text-right font-bold text-emerald-600">₹{formatNumber(Number(row.variance))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ITC Credit Reconciliation */}
                    {subTab === 'itc' && (
                        <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm dark:bg-gray-800 dark:border-gray-850 space-y-4">
                            <h3 className="font-bold text-gray-800 border-b pb-2.5 dark:text-gray-100 text-xs">{t("Reconciliation of Net Input Tax Credit (ITC) as per Audited Books & Returns")}</h3>
                            
                            <div className="space-y-3 text-xs leading-relaxed">
                                <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-650 font-medium dark:text-gray-350">{t("ITC Booked as per Audited Financial Statements")}</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-150">₹{formatNumber(Number(data.itc_reconciliation?.itc_as_per_audited_books))}</span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-650 font-medium dark:text-gray-350">{t("Add: ITC booked but claimed path in prior Financial Year")}</span>
                                    <span className="font-semibold text-emerald-600">+ ₹{formatNumber(Number(data.itc_reconciliation?.itc_in_transit_prior_fy))}</span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-650 font-medium dark:text-gray-350">{t("Less: ITC booked in current year but deferred for next year (In Transit)")}</span>
                                    <span className="font-semibold text-rose-600">- ₹{formatNumber(Number(data.itc_reconciliation?.itc_in_transit_current_fy))}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 bg-indigo-50/50 px-4 rounded-xl border border-indigo-100 mt-4 dark:bg-indigo-950/20 dark:border-indigo-900/30">
                                    <span className="font-bold text-indigo-900 dark:text-indigo-300">{t("Computed Net Credit reconcilable (Calculated)")}</span>
                                    <span className="font-black text-indigo-900 dark:text-indigo-305 text-sm">₹{formatNumber(Number(data.itc_reconciliation?.reconciled_books_itc))}</span>
                                </div>

                                <div className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-650 font-medium dark:text-gray-350">{t("Credit Declared in GSTR-9 Annual Return")}</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-150">₹{formatNumber(Number(data.itc_reconciliation?.gstr9_declared_itc))}</span>
                                </div>

                                <div className="flex justify-between items-center py-2.5">
                                    <span className="text-gray-650 font-bold dark:text-gray-350">{t("Unreconciled ITC Difference")}</span>
                                    <span className="font-extrabold text-emerald-600">₹{formatNumber(Number(data.itc_reconciliation?.unreconciled_itc))}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Part V: Auditor's recommendations */}
                    {subTab === 'recommendation' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                                <div className="flex items-center gap-3 border-b pb-4 mb-4 dark:border-gray-700">
                                    <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                        <PenTool size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{t("Part V - Auditor Certification Remarks")}</h3>
                                        <p className="text-xs text-gray-400">{t("Auditing team's general opinion regarding book-keeping tally and reconciliation variances")}</p>
                                    </div>
                                </div>
                                <p className="text-gray-650 text-xs leading-relaxed bg-gray-50 p-4 rounded-xl font-medium dark:bg-gray-900 dark:text-gray-300 dark:border-gray-750">
                                    {t(data.itc_reconciliation?.audit_recommendation)}
                                </p>
                            </div>

                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3.5 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                                <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                                <div className="text-xs">
                                    <h4 className="font-bold text-emerald-800 dark:text-emerald-450 mb-1">{t("Certification Status")}</h4>
                                    <p className="text-emerald-700 leading-relaxed dark:text-emerald-350">{t("Verified Success. No non-reconciled material variances, understatements or missing tax obligations detected for this fiscal cycle. Tally is certified compliant with GST Audit rules.")}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                    <Info className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium dark:text-gray-400">{t("No GSTR-9C dual audited data loaded. Load sample database from configuration profile.")}</p>
                </div>
            )}
        </div>
    );
};
