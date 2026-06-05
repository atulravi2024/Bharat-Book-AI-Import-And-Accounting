import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info, ArrowUpRight, ArrowDownLeft, ShieldCheck, Wallet, RefreshCw } from 'lucide-react';

interface GSTR3BReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR3BReport: React.FC<GSTR3BReportProps> = ({ useSampleData, onToggleSampleData }) => {
  const { t, formatNumber  } = useLanguage();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeSubSection, setActiveSubSection] = useState<'3.1' | '3.2' | '4' | '5' | '6'>('3.1');

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/g3b_data.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR3B sample data", err);
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
                        {t("GSTR-3B Summary Return")}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">
                        {t("Self-declared monthly summary of outward supplies, input tax credit claimed and tax paid")}
                    </p>
                </div>
                {data && (
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 dark:bg-gray-900/40 dark:border-gray-700">
                        <div><span className="text-gray-400">{t("GSTIN:")}</span> <span className="font-bold text-gray-700 dark:text-gray-300">{data.gstin}</span></div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div><span className="text-gray-400">{t("FY:")}</span> <span className="font-bold text-gray-700 dark:text-gray-300">{data.fy}</span></div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div><span className="text-gray-400">{t("Period:")}</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{data.tax_period}</span></div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="space-y-6">
                    {/* Horizontal Navigation for GSTR-3B Forms */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-thin whitespace-nowrap bg-white p-1 rounded-xl shadow-xs dark:bg-gray-800">
                        <button
                            onClick={() => setActiveSubSection('3.1')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubSection === '3.1' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            3.1 {t("Outward & RCM Inward")}
                        </button>
                        <button
                            onClick={() => setActiveSubSection('3.2')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubSection === '3.2' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            3.2 {t("Inter-State Supplies")}
                        </button>
                        <button
                            onClick={() => setActiveSubSection('4')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubSection === '4' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            4. {t("Eligible ITC")}
                        </button>
                        <button
                            onClick={() => setActiveSubSection('5')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubSection === '5' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            5. {t("Nil/Exempt Inward")}
                        </button>
                        <button
                            onClick={() => setActiveSubSection('6')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubSection === '6' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            6. {t("Payment of Tax")}
                        </button>
                    </div>

                    {/* Section 3.1: Details of Outward and RCM Inward Supplies */}
                    {activeSubSection === '3.1' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                            <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                {t("3.1 Details of Outward Supplies and Inward Supplies Liable to Reverse Charge")}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3 font-bold w-1/3">{t("Nature of Supplies")}</th>
                                            <th className="px-4 py-3 font-bold text-right">{t("Total Taxable Value")}</th>
                                            <th className="px-4 py-3 font-bold text-right text-indigo-600">{t("Integrated Tax (IGST)")}</th>
                                            <th className="px-4 py-3 font-bold text-right text-blue-600">{t("Central Tax (CGST)")}</th>
                                            <th className="px-4 py-3 font-bold text-right text-blue-600">{t("State/UT Tax (SGST)")}</th>
                                            <th className="px-4 py-3 font-bold text-right">{t("Cess")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {[
                                            { key: 'outward_taxable_supplies', label: '(a) Outward Taxable Supplies (Other than Zero Rated, Nil Rated, Exempted)' },
                                            { key: 'outward_zero_rated', label: '(b) Outward Taxable Supplies (Zero Rated)' },
                                            { key: 'other_outward_supplies', label: '(c) Other Outward Supplies (Nil Rated, Exempted)' },
                                            { key: 'inward_reverse_charge', label: '(d) Inward Supplies Liable to Reverse Charge' },
                                            { key: 'non_gst_outward', label: '(e) Non-GST Outward Supplies' }
                                        ].map((row) => {
                                            const item = data.section_3_1?.[row.key] || { taxable_value: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 };
                                            return (
                                                <tr key={row.key} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t(row.label)}</td>
                                                    <td className="px-4 py-3 text-right font-medium text-gray-800 dark:text-gray-100">₹{formatNumber(Number(item.taxable_value))}</td>
                                                    <td className="px-4 py-3 text-right text-indigo-600 font-medium">₹{formatNumber(Number(item.igst))}</td>
                                                    <td className="px-4 py-3 text-right text-blue-600 font-medium">₹{formatNumber(Number(item.cgst))}</td>
                                                    <td className="px-4 py-3 text-right text-blue-600 font-medium">₹{formatNumber(Number(item.sgst))}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">₹{formatNumber(Number(item.cess))}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Section 3.2: Inter-State Supplies */}
                    {activeSubSection === '3.2' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                                <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                    {t("3.2 Supplies Made to Unregistered Persons")}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 font-bold">{t("Place of Supply (State/UT)")}</th>
                                                <th className="px-4 py-3 font-bold text-right">{t("Total Taxable Value")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-indigo-600">{t("Amount of Integrated Tax (IGST)")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {data.section_3_2?.unregistered_persons?.length > 0 ? (
                                                data.section_3_2.unregistered_persons.map((sup: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{sup.state}</td>
                                                        <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-semibold">₹{formatNumber(Number(sup.taxable_val))}</td>
                                                        <td className="px-4 py-3 text-right text-indigo-600 font-bold">₹{formatNumber(Number(sup.igst))}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">{t("No transactions reported under this block")}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                                <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                    {t("Supplies Made to Composition Taxable Persons")}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 font-bold">{t("Place of Supply (State/UT)")}</th>
                                                <th className="px-4 py-3 font-bold text-right">{t("Total Taxable Value")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-indigo-600">{t("Amount of Integrated Tax (IGST)")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {data.section_3_2?.composition_taxable?.length > 0 ? (
                                                data.section_3_2.composition_taxable.map((sup: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{sup.state}</td>
                                                        <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-semibold">₹{formatNumber(sup.taxable_val)}</td>
                                                        <td className="px-4 py-3 text-right text-indigo-600 font-bold">₹{formatNumber(sup.igst)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">{t("No transactions reported under this block")}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Eligible ITC */}
                    {activeSubSection === '4' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                                <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300 flex justify-between items-center">
                                    <span>(A) {t("ITC Available (whether in full or part)")}</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-[9px] font-black">{t("Asset Claims")}</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 font-bold w-1/3">{t("Inward Services / Purchases")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-indigo-600">{t("Integrated Tax (IGST)")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-blue-600">{t("Central Tax (CGST)")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-blue-600">{t("State/UT Tax (SGST)")}</th>
                                                <th className="px-4 py-3 font-bold text-right">{t("Cess")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {[
                                                { key: 'import_goods', label: '1. Import of Goods' },
                                                { key: 'import_services', label: '2. Import of Services' },
                                                { key: 'inward_rcm', label: '3. Inward Supplies Liable to Reverse Charge (other than 1 & 2)' },
                                                { key: 'isd', label: '4. Inward Supplies from Input Service Distributor (ISD)' },
                                                { key: 'all_other_itc', label: '5. All other ITC' }
                                            ].map((row) => {
                                                const val = data.section_4?.itc_available?.[row.key] || { igst: 0, cgst: 0, sgst: 0, cess: 0 };
                                                return (
                                                    <tr key={row.key} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t(row.label)}</td>
                                                        <td className="px-4 py-3 text-right text-indigo-650 font-bold">₹{formatNumber(Number(val.igst))}</td>
                                                        <td className="px-4 py-3 text-right text-blue-650 font-bold">₹{formatNumber(Number(val.cgst))}</td>
                                                        <td className="px-4 py-3 text-right text-blue-650 font-bold">₹{formatNumber(Number(val.sgst))}</td>
                                                        <td className="px-4 py-3 text-right text-gray-500">₹{formatNumber(Number(val.cess))}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                                <div className="p-4 bg-rose-50/50 border-b border-gray-150 font-bold text-rose-800 text-xs dark:bg-rose-950/25 dark:border-rose-900/30 dark:text-rose-300 flex justify-between items-center">
                                    <span>(B) {t("ITC Reversed / Ineligible")}</span>
                                    <span className="text-rose-600 dark:text-rose-400 uppercase tracking-widest text-[9px] font-black">{t("Deductions u/r 42/43 & u/s 17(5)")}</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 font-bold w-1/3">{t("Reversal Reasons")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-indigo-600">{t("IGST")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-blue-600">{t("CGST")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-blue-600">{t("SGST")}</th>
                                                <th className="px-4 py-3 font-bold text-right">{t("Cess")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("1. As per Rules 42 & 43 of CGST/SGST Rules")}</td>
                                                <td className="px-4 py-3 text-right text-indigo-600">₹{formatNumber(Number(data.section_4?.itc_reversed?.rule_42_43?.igst))}</td>
                                                <td className="px-4 py-3 text-right text-blue-600">₹{formatNumber(Number(data.section_4?.itc_reversed?.rule_42_43?.cgst))}</td>
                                                <td className="px-4 py-3 text-right text-blue-600">₹{formatNumber(Number(data.section_4?.itc_reversed?.rule_42_43?.sgst))}</td>
                                                <td className="px-4 py-3 text-right text-gray-500">₹{formatNumber(Number(data.section_4?.itc_reversed?.rule_42_43?.cess))}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("2. Others")}</td>
                                                <td className="px-4 py-3 text-right text-indigo-600">₹{formatNumber(Number(data.section_4?.itc_reversed?.others?.igst))}</td>
                                                <td className="px-4 py-3 text-right text-blue-600">₹{formatNumber(Number(data.section_4?.itc_reversed?.others?.cgst))}</td>
                                                <td className="px-4 py-3 text-right text-blue-600">₹{formatNumber(Number(data.section_4?.itc_reversed?.others?.sgst))}</td>
                                                <td className="px-4 py-3 text-right text-gray-500">₹{formatNumber(Number(data.section_4?.itc_reversed?.others?.cess))}</td>
                                            </tr>
                                            <tr className="bg-rose-50/20 dark:bg-rose-950/10 font-bold">
                                                <td className="px-4 py-3 text-rose-800 dark:text-rose-300">{t("3. Ineligible ITC - Section 17(5) Blocked Credits")}</td>
                                                <td className="px-4 py-3 text-right text-indigo-600 font-extrabold">₹{formatNumber(Number(data.section_4?.ineligible_itc?.section_17_5?.igst))}</td>
                                                <td className="px-4 py-3 text-right text-blue-600 font-extrabold">₹{formatNumber(Number(data.section_4?.ineligible_itc?.section_17_5?.cgst))}</td>
                                                <td className="px-4 py-3 text-right text-blue-600 font-extrabold">₹{formatNumber(Number(data.section_4?.ineligible_itc?.section_17_5?.sgst))}</td>
                                                <td className="px-4 py-3 text-right text-gray-500">₹{formatNumber(Number(data.section_4?.ineligible_itc?.section_17_5?.cess))}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 5: Values of exempt, nil-rated and non-GST inward supplies */}
                    {activeSubSection === '5' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                            <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                {t("5. Values of Exempt, Nil-Rated and Non-GST Inward Supplies")}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3 font-bold w-1/2">{t("Nature of Inward Supplies")}</th>
                                            <th className="px-4 py-3 font-bold text-right">{t("Inter-State Supplies")}</th>
                                            <th className="px-4 py-3 font-bold text-right">{t("Intra-State Supplies")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        <tr>
                                            <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("1. From a supplier under composition scheme, Exempt and Nil-Rated purchase supplies")}</td>
                                            <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-medium">₹{formatNumber(Number(data.section_5?.inter_state?.exempt) + Number(data.section_5?.inter_state?.nil_rated))}</td>
                                            <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-medium">₹{formatNumber(Number(data.section_5?.intra_state?.exempt) + Number(data.section_5?.intra_state?.nil_rated))}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("2. Non-GST inward supplies")}</td>
                                            <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-medium">₹{formatNumber(Number(data.section_5?.inter_state?.non_gst))}</td>
                                            <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-medium">₹{formatNumber(Number(data.section_5?.intra_state?.non_gst))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Section 6: Payment of Tax */}
                    {activeSubSection === '6' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                                <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-700 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300">
                                    {t("6.1 Payment of Tax (Auto-reckoned and integrated with Electronic Ledger caches)")}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 font-bold">{t("Tax Description")}</th>
                                                <th className="px-4 py-3 font-bold text-right">{t("Tax Payable")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-indigo-600">{t("Paid by IGST Credit")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-blue-650">{t("Paid by CGST Credit")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-blue-650">{t("Paid by SGST Credit")}</th>
                                                <th className="px-4 py-3 font-bold text-right text-emerald-600">{t("Paid in Cash")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {data.section_6_1?.map((row: any, i: number) => (
                                                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                                    <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t(row.tax_head)}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(Number(row.payable))}</td>
                                                    <td className="px-4 py-3 text-right text-indigo-650 font-medium">₹{formatNumber(Number(row.paid_by_itc?.igst))}</td>
                                                    <td className="px-4 py-3 text-right text-blue-650 font-medium">₹{formatNumber(Number(row.paid_by_itc?.cgst))}</td>
                                                    <td className="px-4 py-3 text-right text-blue-650 font-medium">₹{formatNumber(Number(row.paid_by_itc?.sgst))}</td>
                                                    <td className="px-4 py-3 text-right text-emerald-600 font-extrabold bg-emerald-50/10 dark:bg-emerald-950/5">₹{formatNumber(Number(row.paid_cash))}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="form-grid gap-4 md:grid-cols-2">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-4 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                                    <div className="p-3 bg-emerald-500 rounded-lg text-white">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-700 dark:text-emerald-400">{t("Total Credit Settled")}</p>
                                        <p className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300">
                                            ₹{formatNumber(
                                                data.section_6_1?.reduce((acc: number, cur: any) => 
                                                    acc + Number(cur.paid_by_itc?.igst || 0) + Number(cur.paid_by_itc?.cgst || 0) + Number(cur.paid_by_itc?.sgst || 0), 0
                                                ) || 0
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-4 dark:bg-indigo-950/20 dark:border-indigo-900/30">
                                    <div className="p-3 bg-indigo-500 rounded-lg text-white">
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-indigo-700 dark:text-indigo-400">{t("Paid via Cash Ledger")}</p>
                                        <p className="text-xl font-extrabold text-indigo-800 dark:text-indigo-300">
                                            ₹{formatNumber(
                                                data.section_6_1?.reduce((acc: number, cur: any) => acc + Number(cur.paid_cash || 0), 0) || 0
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                    <Info className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium dark:text-gray-400">{t("No GSTR-3B sample data loaded. Enable sample datasets inside the configuration dashboard.")}</p>
                </div>
            )}
        </div>
    );
};
