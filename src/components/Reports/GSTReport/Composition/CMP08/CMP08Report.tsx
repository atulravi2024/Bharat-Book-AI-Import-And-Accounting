import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
    FileText, CheckCircle, Landmark, Sparkles, FileCheck, Info 
} from 'lucide-react';

interface CMP08ReportProps {
    useSampleData: boolean;
    onToggleSampleData?: (enabled: boolean) => void;
}

export const CMP08Report: React.FC<CMP08ReportProps> = ({ useSampleData }) => {
    const { t, formatNumber } = useLanguage();

    // Shared Electronic Cash Ledger Balance using localstorage to keep states fully in sync
    const [cashLedger, setCashLedger] = useState(() => {
        const saved = localStorage.getItem('composition_cash_ledger');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return { igst: 210000, cgst: 145000, sgst: 145000, cess: 15000 };
    });

    useEffect(() => {
        localStorage.setItem('composition_cash_ledger', JSON.stringify(cashLedger));
    }, [cashLedger]);

    // Active quarterly CMP-08 state
    const [compCmp08Data, setCompCmp08Data] = useState({
        quarter: 'Q1 (Apr-Jun)',
        financialYear: '2025-26',
        outwardSupplies: '1500000',
        rcmSupplies: '120000',
        taxRate: '1.0', // 1% for traders & manufacturers, 5% restaurants, 6% other service providers
        filed: false,
        paymentDate: '',
        arn: ''
    });

    // Custom row state for CMP-08 listings
    const [compCmp08List, setCompCmp08List] = useState([
        { id: '1', fy: '2024-25', quarter: 'Q1', outward: 1450000, rcm: 80000, rate: 1, cgst: 7650, sgst: 7650, status: 'Filed', date: '25-Jul-2024' },
        { id: '2', fy: '2024-25', quarter: 'Q2', outward: 1680000, rcm: 95000, rate: 1, cgst: 8875, sgst: 8875, status: 'Filed', date: '22-Oct-2024' },
        { id: '3', fy: '2024-25', quarter: 'Q3', outward: 1820050, rcm: 110000, rate: 1, cgst: 9650, sgst: 9650, status: 'Filed', date: '21-Jan-2025' },
        { id: '4', fy: '2024-25', quarter: 'Q4', outward: 1950000, rcm: 152000, rate: 1, cgst: 10510, sgst: 10510, status: 'Filed', date: '24-Apr-2025' }
    ]);

    const handleFileCmp08 = () => {
        const outwardVal = Number(compCmp08Data.outwardSupplies);
        const rcmVal = Number(compCmp08Data.rcmSupplies);
        const ratePct = parseFloat(compCmp08Data.taxRate);

        const cgstPay = Math.round((outwardVal * (ratePct / 100)) / 2 + (rcmVal * 0.05) / 2);
        const sgstPay = Math.round((outwardVal * (ratePct / 100)) / 2 + (rcmVal * 0.05) / 2);

        // Check cash ledger balances
        if (cashLedger.cgst < cgstPay || cashLedger.sgst < sgstPay) {
            alert(t("Insufficient balance in your Electronic Cash Ledger! Required: CGST ₹{cgst}, SGST ₹{sgst}. Please Head to the e-Ledger tab in Compliance tools to deposit first.", { cgst: formatNumber(cgstPay), sgst: formatNumber(sgstPay) }));
            return;
        }

        // Deduct from cash ledger
        const newLedger = {
            ...cashLedger,
            cgst: cashLedger.cgst - cgstPay,
            sgst: cashLedger.sgst - sgstPay
        };
        setCashLedger(newLedger);

        const randArn = `CP0827${Math.floor(100000 + Math.random() * 900000)}B`;
        const todayStr = new Date().toISOString().split('T')[0];

        setCompCmp08Data(prev => ({
            ...prev,
            filed: true,
            paymentDate: todayStr,
            arn: randArn
        }));

        // Insert log in list
        const newLog = {
            id: String(Date.now()),
            fy: compCmp08Data.financialYear,
            quarter: compCmp08Data.quarter.split(' ')[0],
            outward: outwardVal,
            rcm: rcmVal,
            rate: ratePct,
            cgst: cgstPay,
            sgst: sgstPay,
            status: 'Filed',
            date: todayStr
        };
        setCompCmp08List([newLog, ...compCmp08List]);

        alert(t("Form GST CMP-08 was successfully authorized using Electronic Cash Ledger offsets. ARN {arn} issued.", { arn: randArn }));
    };

    return (
        <div className="space-y-6">
            {/* Top Status & Balance Banner */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                            {t("Form GST CMP-08")}
                        </span>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                            {t("Quarterly Self-Assessed Tax Form")}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {t("Lodge self-assessed tax records and clear quarterly compounding tax offsets in compliance with Rule 62.")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 text-xs">
                        <Landmark size={14} className="text-emerald-600" />
                        <div>
                            <span className="font-bold block text-[10px] uppercase text-emerald-500">{t("Ledger Cash Balance")}</span>
                            <span className="font-mono font-bold">₹{formatNumber(cashLedger.cgst + cashLedger.sgst + cashLedger.igst)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Box */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs dark:bg-gray-800 dark:border-gray-800">
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">{t("CMP-08: Statement for Payment of Self-Assessed Tax")}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{t("Quarterly payment declaration for self-assessed supplies under Rule 62.")}</p>
                        </div>
                        <Sparkles className="text-indigo-600 animate-pulse" size={18} />
                    </div>

                    {/* Calculated Outputs Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3 p-4 bg-gray-50/50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-750">
                            <p className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400">{t("Filing Configuration")}</p>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-450 block">{t("Financial Year")}</label>
                                    <select
                                        value={compCmp08Data.financialYear}
                                        onChange={(e) => setCompCmp08Data({ ...compCmp08Data, financialYear: e.target.value })}
                                        className="w-full text-xs mt-1 px-2.5 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden dark:border-gray-700 font-bold"
                                    >
                                        <option value="2025-26">FY 2025-26</option>
                                        <option value="2024-25">FY 2024-25</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-450 block">{t("Quarter Selector")}</label>
                                    <select
                                        value={compCmp08Data.quarter}
                                        onChange={(e) => setCompCmp08Data({ ...compCmp08Data, quarter: e.target.value })}
                                        className="w-full text-xs mt-1 px-2.5 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden dark:border-gray-700 font-bold"
                                    >
                                        <option value="Q1 (Apr-Jun)">Q1 (Apr-Jun)</option>
                                        <option value="Q2 (Jul-Sep)">Q2 (Jul-Sep)</option>
                                        <option value="Q3 (Oct-Dec)">Q3 (Oct-Dec)</option>
                                        <option value="Q4 (Jan-Mar)">Q4 (Jan-Mar)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-450 block">{t("Dealer Category Tax Rate")}</label>
                                <select
                                    value={compCmp08Data.taxRate}
                                    onChange={(e) => setCompCmp08Data({ ...compCmp08Data, taxRate: e.target.value })}
                                    className="w-full text-xs mt-1 px-2.5 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden dark:border-gray-700 focus:border-indigo-500"
                                >
                                    <option value="1.0">1.0% Outward (Traders and Manufacturers)</option>
                                    <option value="5.0">5.0% Outward (Restaurant Services)</option>
                                    <option value="6.0">6.0% Outward (Other Service Providers - Sec 10(2A))</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-450 block">{t("Outward taxable supplies (including exempt)")}</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={compCmp08Data.outwardSupplies}
                                        onChange={(e) => setCompCmp08Data({ ...compCmp08Data, outwardSupplies: e.target.value })}
                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-450 block">{t("Inward supplies attracting Reverse Charge (RCM)")}</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={compCmp08Data.rcmSupplies}
                                        onChange={(e) => setCompCmp08Data({ ...compCmp08Data, rcmSupplies: e.target.value })}
                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Calculation Output Card */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold">₹</div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-indigo-200 bg-indigo-950/40 px-2.5 py-0.5 rounded">
                                        {t("Reckoned Tax Liability")}
                                    </span>
                                    <span className="text-indigo-300 text-xs font-bold">{compCmp08Data.quarter}</span>
                                </div>

                                {/* Calculation Formula Results */}
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center text-gray-300">
                                        <span>{t("Outward Supplies CGST ({rate}%)", { rate: (parseFloat(compCmp08Data.taxRate) / 2).toFixed(2) })}</span>
                                        <span className="font-mono">₹{formatNumber(Math.round((Number(compCmp08Data.outwardSupplies) * (parseFloat(compCmp08Data.taxRate) / 100)) / 2))}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-300">
                                        <span>{t("Outward Supplies SGST ({rate}%)", { rate: (parseFloat(compCmp08Data.taxRate) / 2).toFixed(2) })}</span>
                                        <span className="font-mono">₹{formatNumber(Math.round((Number(compCmp08Data.outwardSupplies) * (parseFloat(compCmp08Data.taxRate) / 100)) / 2))}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-300 border-b border-indigo-805 pb-1">
                                        <span>{t("Inward Supplies RCM Liability (5% RCM average)")}</span>
                                        <span className="font-mono">₹{formatNumber(Math.round(Number(compCmp08Data.rcmSupplies) * 0.05))}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 text-sm font-bold">
                                        <span>{t("Total Central Tax (CGST)")}</span>
                                        <span className="font-mono font-black text-amber-300">
                                            ₹{formatNumber(
                                                Math.round((Number(compCmp08Data.outwardSupplies) * (parseFloat(compCmp08Data.taxRate) / 100)) / 2 + (Number(compCmp08Data.rcmSupplies) * 0.05) / 2)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span>{t("Total State Tax (SGST)")}</span>
                                        <span className="font-mono font-black text-amber-300">
                                            ₹{formatNumber(
                                                Math.round((Number(compCmp08Data.outwardSupplies) * (parseFloat(compCmp08Data.taxRate) / 100)) / 2 + (Number(compCmp08Data.rcmSupplies) * 0.05) / 2)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-indigo-850">
                                {compCmp08Data.filed ? (
                                    <div className="p-3 bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 rounded-lg text-xs flex items-center justify-between gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                            <div>
                                                <p className="font-bold">{t("Statement Filed Successfully")}</p>
                                                <p className="text-[10px] text-gray-400">ARN: {compCmp08Data.arn}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-mono leading-none">{compCmp08Data.paymentDate}</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleFileCmp08}
                                        className="w-full py-2.5 bg-indigo-505 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <FileCheck size={14} />
                                        {t("Authorize and File CMP-08")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CMP-08 Historical records */}
                    <div className="space-y-3">
                        <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">{t("Form CMP-08 Filing History Log")}</h5>
                        <div className="overflow-x-auto border rounded-xl dark:border-gray-700">
                            <table className="w-full text-xs text-left whitespace-nowrap">
                                <thead className="bg-gray-50 dark:bg-gray-950/40 text-gray-500 font-bold border-b dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-center">{t("Quarter")}</th>
                                        <th className="px-4 py-2">{t("Financial Year")}</th>
                                        <th className="px-4 py-2 text-right">{t("Outward Taxable")}</th>
                                        <th className="px-4 py-2 text-right">{t("Inward RCM")}</th>
                                        <th className="px-4 py-2 text-right">{t("Tax CGST/SGST")}</th>
                                        <th className="px-4 py-2 text-center">{t("Filing Status")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                                    {compCmp08List.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40">
                                            <td className="px-4 py-2.5 text-center font-bold text-gray-800 dark:text-white">{row.quarter}</td>
                                            <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">FY {row.fy}</td>
                                            <td className="px-4 py-2.5 text-right font-mono text-gray-800 dark:text-gray-200">₹{formatNumber(row.outward)}</td>
                                            <td className="px-4 py-2.5 text-right font-mono text-gray-500">₹{formatNumber(row.rcm)}</td>
                                            <td className="px-4 py-2.5 text-right font-mono text-indigo-650 dark:text-indigo-400 font-semibold">₹{formatNumber(row.cgst)} + ₹{formatNumber(row.sgst)}</td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span className="px-2 py-0.5 rounded text-[9px] uppercase font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                    {t(row.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
