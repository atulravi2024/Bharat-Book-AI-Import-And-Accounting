import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info, ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface GSTR9ReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR9Report: React.FC<GSTR9ReportProps> = ({ useSampleData, onToggleSampleData }) => {
  const { t, formatNumber  } = useLanguage();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'outward' | 'itc' | 'itc_reconcile' | 'tax_paid'>('outward');

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/g9_data.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR9 sample data", err);
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
                        <FileText className="mr-2 text-indigo-600" size={20} />
                        {t("GSTR-9 Annual GST Return")}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">
                        {t("Annual reconciliation of outward, inward supplies and tax liabilities filed during the FY")}
                    </p>
                </div>
                {data && (
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 dark:bg-gray-900/40 dark:border-gray-750">
                        <div><span className="text-gray-400">{t("GSTIN:")}</span> <span className="font-bold text-gray-750 dark:text-gray-300">{data.gstin}</span></div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div><span className="text-gray-400">{t("FY:")}</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{data.fy}</span></div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div><span className="text-gray-400">{t("Audit Status:")}</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.audit_required ? t("Statutory Audit Required (u/s 35)") : t("Regular filing")}</span></div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="space-y-6">
                    {/* Navigation Tab rail */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-thin whitespace-nowrap bg-white p-1 rounded-xl shadow-xs dark:bg-gray-800">
                        <button
                            onClick={() => setActiveSection('outward')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSection === 'outward' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {t("Outward Supplies (Part II)")}
                        </button>
                        <button
                            onClick={() => setActiveSection('itc')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSection === 'itc' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {t("ITC Details (Part III)")}
                        </button>
                        <button
                            onClick={() => setActiveSection('itc_reconcile')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSection === 'itc_reconcile' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {t("GSTR-2B vs 3B Comparison")}
                        </button>
                        <button
                            onClick={() => setActiveSection('tax_paid')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSection === 'tax_paid' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {t("Taxes Paid (Part IV)")}
                        </button>
                    </div>

                    {/* Part II: Outward Supplies */}
                    {activeSection === 'outward' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                                <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                    {t("Details of Outward Supplies declared during the Financial Year")}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold w-1/3">{t("Nature of Outward Supply")}</th>
                                                <th className="px-4 py-3 font-semibold text-right">{t("Taxable Value")}</th>
                                                <th className="px-4 py-3 font-semibold text-right text-indigo-600">{t("Integrated Tax (IGST)")}</th>
                                                <th className="px-4 py-3 font-semibold text-right text-blue-600">{t("Central Tax (CGST)")}</th>
                                                <th className="px-4 py-3 font-semibold text-right text-blue-600">{t("State/UT Tax (SGST)")}</th>
                                                <th className="px-4 py-3 font-semibold text-right">{t("Cess Amount")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {[
                                                { key: 'b2c', label: 'Supplies made to Consumers and Unregistered (B2C)' },
                                                { key: 'b2b', label: 'Supplies made to Registered Entities (B2B)' },
                                                { key: 'zero_rated_with_pay', label: 'Exports on Payment of Integrated Tax' },
                                                { key: 'zero_rated_without_pay', label: 'Exports under LUT/Bond (Without payment)' },
                                                { key: 'sez_with_pay', label: 'Supplies made to SEZ Units on payment' },
                                                { key: 'deemed_exports', label: 'Deemed Exports reported in returns' },
                                                { key: 'advances_unadjusted', label: 'Unadjusted Advances (GST paid but not invoiced)' },
                                                { key: 'inward_rcm_payable', label: 'Inward supplies on which Tax is payable on Reverse Charge (RCM)' }
                                            ].map((row) => {
                                                const val = data.outward_supplies?.[row.key] || { taxable_val: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 };
                                                return (
                                                    <tr key={row.key} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t(row.label)}</td>
                                                        <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-bold">₹{formatNumber(Number(val.taxable_val))}</td>
                                                        <td className="px-4 py-3 text-right text-indigo-600 font-semibold">₹{formatNumber(Number(val.igst))}</td>
                                                        <td className="px-4 py-3 text-right text-blue-600 font-semibold">₹{formatNumber(Number(val.cgst))}</td>
                                                        <td className="px-4 py-3 text-right text-blue-600 font-semibold">₹{formatNumber(Number(val.sgst))}</td>
                                                        <td className="px-4 py-3 text-right text-gray-500">₹{formatNumber(Number(val.cess))}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                                <h3 className="font-bold text-gray-800 mb-4 dark:text-gray-100">{t("Exempt, Nil-Rated and Non-GST Outward Supplies")}</h3>
                                <div className="form-grid gap-4">
                                    <div className="p-4 bg-gray-55/40 rounded-lg border border-gray-100 dark:bg-gray-900/30 dark:border-gray-700 text-center">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t("Exempted Volume")}</p>
                                        <p className="text-xl font-extrabold text-gray-750 mt-1 dark:text-gray-100">₹{formatNumber(Number(data.exempt_outward?.exempted))}</p>
                                    </div>
                                    <div className="p-4 bg-gray-55/40 rounded-lg border border-gray-100 dark:bg-gray-900/30 dark:border-gray-700 text-center">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t("Nil Rated Volume")}</p>
                                        <p className="text-xl font-extrabold text-gray-755 mt-1 dark:text-gray-100">₹{formatNumber(Number(data.exempt_outward?.nil_rated))}</p>
                                    </div>
                                    <div className="p-4 bg-gray-55/40 rounded-lg border border-gray-100 dark:bg-gray-900/30 dark:border-gray-700 text-center">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t("Non-GST supplies")}</p>
                                        <p className="text-xl font-extrabold text-gray-755 mt-1 dark:text-gray-100">₹{formatNumber(Number(data.exempt_outward?.non_gst))}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Part III: ITC Details */}
                    {activeSection === 'itc' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                            <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                {t("Details of Input Tax Credit (ITC) availed/booked during the FY")}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold w-1/3">{t("ITC Nature/Component Category")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-indigo-600">{t("Integrated Tax (IGST)")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-blue-600">{t("Central Tax (CGST)")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-blue-600">{t("State/UT Tax (SGST)")}</th>
                                            <th className="px-4 py-3 font-semibold text-right">{t("Cess Amount")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {[
                                            { key: 'inputs', label: 'A. Inputs (Regular Goods / Raw Material books)' },
                                            { key: 'capital_goods', label: 'B. Capital Goods (Plant, Property & Machinery assets)' },
                                            { key: 'input_services', label: 'C. Input Services (Consultancy, utilities and operational fees)' },
                                            { key: 'rcm_inputs', label: 'D. Inward supplies on Reverse Charge RCM paid & claimed' }
                                        ].map((row) => {
                                            const val = data.availed_itc?.[row.key] || { igst: 0, cgst: 0, sgst: 0, cess: 0 };
                                            return (
                                                <tr key={row.key} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                                    <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t(row.label)}</td>
                                                    <td className="px-4 py-3 text-right text-indigo-600 font-medium">₹{formatNumber(Number(val.igst))}</td>
                                                    <td className="px-4 py-3 text-right text-blue-600 font-medium">₹{formatNumber(Number(val.cgst))}</td>
                                                    <td className="px-4 py-3 text-right text-blue-600 font-medium">₹{formatNumber(Number(val.sgst))}</td>
                                                    <td className="px-4 py-3 text-right text-gray-500">₹{formatNumber(Number(val.cess))}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-indigo-50/20 dark:bg-indigo-900/10 font-bold">
                                            <td className="px-4 py-3.5 text-gray-850 dark:text-gray-100">{t("Total Consolidated Annual Return ITC Claimed")}</td>
                                            <td className="px-4 py-3.5 text-right text-indigo-600">
                                                ₹{formatNumber((Object.values(data.availed_itc || {}) as any[]).reduce((acc: number, cur: any) => acc + Number(cur.igst || 0), 0))}
                                            </td>
                                            <td className="px-4 py-3.5 text-right text-blue-600">
                                                ₹{formatNumber((Object.values(data.availed_itc || {}) as any[]).reduce((acc: number, cur: any) => acc + Number(cur.cgst || 0), 0))}
                                            </td>
                                            <td className="px-4 py-3.5 text-right text-blue-600">
                                                ₹{formatNumber((Object.values(data.availed_itc || {}) as any[]).reduce((acc: number, cur: any) => acc + Number(cur.sgst || 0), 0))}
                                            </td>
                                            <td className="px-4 py-3.5 text-right text-gray-600 dark:text-gray-400">
                                                ₹{formatNumber((Object.values(data.availed_itc || {}) as any[]).reduce((acc: number, cur: any) => acc + Number(cur.cess || 0), 0))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ITC Comparison: GSTR-2B vs 3B */}
                    {activeSection === 'itc_reconcile' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                                <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                    {t("Other ITC Matching (GSTR-2B vs GSTR-3B Annual Ledger reconcile variance)")}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold w-1/3">{t("Financial Description")}</th>
                                                <th className="px-4 py-3 font-semibold text-right text-indigo-600">{t("IGST Credit")}</th>
                                                <th className="px-4 py-3 font-semibold text-right text-blue-600">{t("CGST Credit")}</th>
                                                <th className="px-4 py-3 font-semibold text-right text-blue-600">{t("SGST Credit")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            <tr>
                                                <td className="px-4 py-3.5 font-semibold text-gray-700 dark:text-gray-300">{t("ITC as per auto-drafted GSTR-2B Statement")}</td>
                                                <td className="px-4 py-3.5 text-right text-indigo-600 font-medium">₹{formatNumber(Number(data.itc_comparison?.as_per_gstr2b?.igst))}</td>
                                                <td className="px-4 py-3.5 text-right text-blue-600 font-medium">₹{formatNumber(Number(data.itc_comparison?.as_per_gstr2b?.cgst))}</td>
                                                <td className="px-4 py-3.5 text-right text-blue-600 font-medium">₹{formatNumber(Number(data.itc_comparison?.as_per_gstr2b?.sgst))}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3.5 font-semibold text-gray-700 dark:text-gray-300">{t("ITC declared and availed inside GSTR-3B monthly filings")}</td>
                                                <td className="px-4 py-3.5 text-right text-indigo-650 font-medium">₹{formatNumber(Number(data.itc_comparison?.availed_in_gstr3b?.igst))}</td>
                                                <td className="px-4 py-3.5 text-right text-blue-650 font-medium">₹{formatNumber(Number(data.itc_comparison?.availed_in_gstr3b?.cgst))}</td>
                                                <td className="px-4 py-3.5 text-right text-blue-650 font-medium">₹{formatNumber(Number(data.itc_comparison?.availed_in_gstr3b?.sgst))}</td>
                                            </tr>
                                            <tr className="bg-amber-50/10 dark:bg-amber-950/5 font-extrabold">
                                                <td className="px-4 py-4 text-amber-800 dark:text-amber-400">{t("Unreconciled Variance (Excess Claimed in 3B / Pending vendor upload)")}</td>
                                                <td className="px-4 py-4 text-right text-rose-655 text-rose-500">
                                                    ₹{formatNumber(Number(data.itc_comparison?.difference?.igst))}
                                                </td>
                                                <td className="px-4 py-4 text-right text-rose-655 text-rose-500">
                                                    ₹{formatNumber(Number(data.itc_comparison?.difference?.cgst))}
                                                </td>
                                                <td className="px-4 py-4 text-right text-rose-655 text-rose-500">
                                                    ₹{formatNumber(Number(data.itc_comparison?.difference?.sgst))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3.5 dark:bg-amber-950/20 dark:border-amber-900/30">
                                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                                <div className="text-xs">
                                    <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">{t("Officer Reconciliation Insight Comments")}</h4>
                                    <p className="text-amber-700 font-medium leading-relaxed dark:text-amber-350">{t(data.itc_comparison?.remarks)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Part IV: Taxes paid */}
                    {activeSection === 'tax_paid' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                            <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                {t("Part IV: Details of Tax Paid as declared in returns filed during the Financial Year")}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">{t("Tax Ledger Description")}</th>
                                            <th className="px-4 py-3 font-semibold text-right">{t("Tax Payable")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-emerald-600">{t("Paid in Cash")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-indigo-650">{t("Paid on ITC Credit Adjustment")}</th>
                                            <th className="px-4 py-3 font-semibold text-right text-blue-600">{t("Total Tax Paid")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {data.tax_payable_vs_paid?.map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                                <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t(row.head)}</td>
                                                <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-bold">₹{formatNumber(Number(row.payable))}</td>
                                                <td className="px-4 py-3 text-right text-emerald-600 font-semibold bg-emerald-50/5">₹{formatNumber(Number(row.paid_cash))}</td>
                                                <td className="px-4 py-3 text-right text-indigo-650 font-semibold bg-indigo-50/5">₹{formatNumber(Number(row.paid_itc))}</td>
                                                <td className="px-4 py-3 text-right text-blue-700 font-bold">₹{formatNumber(Number(row.paid_cash) + Number(row.paid_itc))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                    <Info className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium dark:text-gray-400">{t("No GSTR-9 annual sample data loaded. Activate testing datasets inside your settings panel.")}</p>
                </div>
            )}
        </div>
    );
};
