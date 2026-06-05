import React, { useState } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
    Search, Filter 
} from 'lucide-react';

interface GSTR4AReportProps {
    useSampleData: boolean;
    onToggleSampleData?: (enabled: boolean) => void;
}

export const GSTR4AReport: React.FC<GSTR4AReportProps> = ({ useSampleData }) => {
    const { t, formatNumber } = useLanguage();

    // GSTR-4A Inward Statement State
    const [compGstr4AData] = useState([
        { id: 'IN4A-101', supplierGstin: '27AAACG4344D1Z2', name: 'Maharashtra Steel Industries', invNo: 'MSI-25-882', date: '2025-05-12', value: 185000, rcmApplicable: 'Yes', rate: '18%', cgst: 16650, sgst: 16650, status: 'Awaiting Match' },
        { id: 'IN4A-102', supplierGstin: '27AABCD6711E2ZO', name: 'Logistics World Express', invNo: 'LWE-25-441', date: '2025-05-18', value: 34000, rcmApplicable: 'Yes', rate: '5%', cgst: 850, sgst: 850, status: 'Awaiting Match' },
        { id: 'IN4A-103', supplierGstin: '07AAACB1114A2ZP', name: 'Delhi Packing Kraft Corp', invNo: 'DPK-25-015', date: '2025-05-25', value: 95000, rcmApplicable: 'No', rate: '12%', cgst: 5700, sgst: 5700, status: 'Auto-Matched' },
        { id: 'IN4A-104', supplierGstin: '27BBBCY1122D1Z0', name: 'Kushal Engineering Castings', invNo: 'KEC-25-991', date: '2025-06-01', value: 163000, rcmApplicable: 'Yes', rate: '18%', cgst: 14670, sgst: 14670, status: 'Awaiting Match' }
    ]);

    const [gstr4aSearch, setGstr4aSearch] = useState('');

    // Filtered GSTR-4A results
    const filteredGstr4A = compGstr4AData.filter(item => {
        const query = gstr4aSearch.toLowerCase().trim();
        if (!query) return true;
        return (
            item.name.toLowerCase().includes(query) ||
            item.supplierGstin.toLowerCase().includes(query) ||
            item.invNo.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            {/* Top Stat Banner */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                    {t("Form GSTR-4A")}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                    {t("Supplier Auto-Draft Inwards Desk")}
                </h3>
                <p className="text-xs text-gray-500">
                    {t("Review auto-drafted statements detailing standard GSTR-1 transactions uploaded by regular sellers.")}
                </p>
            </div>

            {/* Inward workspace */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs dark:bg-gray-800 dark:border-gray-800">
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("Form GSTR-4A: Auto-Drafted Supplier Inward Invoices")}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{t("Auto-drafted read-only statement compiled from standard B2B GSTR-1 returns filed by suppliers.")}</p>
                        </div>
                        <Search className="text-indigo-600" size={18} />
                    </div>

                    {/* Search bar and Filters */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder={t("Filter by Supplier name, GSTIN, invoice...")}
                                value={gstr4aSearch}
                                onChange={(e) => setGstr4aSearch(e.target.value)}
                                className="w-full text-xs pl-8 pr-3 py-1.5 border rounded-lg bg-gray-50/50 dark:bg-gray-850 dark:border-gray-700 outline-hidden focus:border-indigo-505 dark:text-white"
                            />
                        </div>
                        <button className="px-3 py-1.5 border text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center gap-1.5 text-gray-650 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900">
                            <Filter size={12} />
                            {t("All Records")}
                        </button>
                    </div>

                    {/* Main GSTR-4A table */}
                    <div className="overflow-x-auto border rounded-xl dark:border-gray-700">
                        <table className="w-full text-xs text-left whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-gray-950/40 text-gray-500 font-bold border-b dark:border-gray-700">
                                <tr>
                                    <th className="px-4 py-2.5">{t("Supplier details")}</th>
                                    <th className="px-4 py-2.5">{t("Challan/Inv No")}</th>
                                    <th className="px-4 py-2.5 text-right">{t("Total Value")}</th>
                                    <th className="px-4 py-2.5 text-center">{t("Seller GST Rate")}</th>
                                    <th className="px-4 py-2.5 text-right">{t("IGST/CGST/SGST")}</th>
                                    <th className="px-4 py-2.5 text-center">{t("RCM Flag")}</th>
                                    <th className="px-4 py-2.5 text-center">{t("Matching State")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                                {filteredGstr4A.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-400">
                                            {t("No auto-drafted invoices found matching your query.")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredGstr4A.map(row => (
                                        <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40">
                                            <td className="px-4 py-3">
                                                <p className="font-extrabold text-gray-800 dark:text-white">{row.name}</p>
                                                <p className="font-mono text-[10px] text-gray-400 mt-0.5">{row.supplierGstin}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-gray-700 dark:text-gray-350">{row.invNo}</p>
                                                <p className="font-mono text-[9.5px] text-gray-400">{row.date}</p>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-gray-800 dark:text-gray-200">₹{formatNumber(row.value)}</td>
                                            <td className="px-4 py-3 text-center text-gray-500 font-bold">{row.rate}</td>
                                            <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                                                ₹{formatNumber(row.cgst)} + ₹{formatNumber(row.sgst)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase ${
                                                    row.rcmApplicable === 'Yes'
                                                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/25 dark:text-rose-450'
                                                        : 'bg-gray-50 text-gray-500 dark:bg-gray-905'
                                                }`}>
                                                    {t(row.rcmApplicable)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-[4px] text-[9.5px] font-bold ${
                                                    row.status === 'Auto-Matched'
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400'
                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400'
                                                }`}>
                                                    {t(row.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
