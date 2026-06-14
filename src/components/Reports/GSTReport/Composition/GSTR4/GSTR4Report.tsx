import React, { useState } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
    FileText, CheckCircle, Briefcase, FileCheck 
} from 'lucide-react';

interface GSTR4ReportProps {
    useSampleData: boolean;
    onToggleSampleData?: (enabled: boolean) => void;
}

export const GSTR4Report: React.FC<GSTR4ReportProps> = ({ useSampleData }) => {
    const { t, formatNumber } = useLanguage();

    // GSTR-4 Annual Return Form Option State
    const [compGstr4Data, setCompGstr4Data] = useState({
        financialYear: '2025-26',
        outwardTaxable: '6950000',
        inwardRcm: '477000',
        taxRate: '1.0',
        filed: false,
        reconciled: false,
        otp: '',
        isSigning: false,
        arn: ''
    });

    const [compGstr4Archive, setCompGstr4Archive] = useState([
        { id: 'G4-2023', fy: '2023-24', outward: 5800000, rcm: 320000, cgst: 30600, sgst: 30600, status: 'Filed', date: '28-Apr-24' },
        { id: 'G4-2024', fy: '2024-25', outward: 6900050, rcm: 437000, cgst: 36685, sgst: 36685, status: 'Filed', date: '29-Apr-25' }
    ]);

    return (
        <div className="space-y-6">
            {/* Top Stat Banner */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                    {t("Form GSTR-4")}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                    {t("Composition Annual Return Desk")}
                </h3>
                <p className="text-xs text-gray-500">
                    {t("File consolidated annual declarations, reconcile quarterly outputs and sign statutory annual statements.")}
                </p>
            </div>

            {/* Input and Action Module */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs dark:bg-gray-800 dark:border-gray-800">
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("GSTR-4: Composition Annual Return Workspace")}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{t("Consolidated annual declaration statement for composition suppliers under Section 44.")}</p>
                        </div>
                        <Briefcase className="text-indigo-600" size={18} />
                    </div>

                    {/* Action controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 p-4 bg-gray-50/50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-750">
                            <p className="text-[10px] uppercase font-black tracking-widest text-[#2f3542] dark:text-indigo-400">{t("Return Parameter Setup")}</p>
                            
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 block">{t("Filing Period Year")}</label>
                                <select
                                    value={compGstr4Data.financialYear}
                                    onChange={(e) => setCompGstr4Data({ ...compGstr4Data, financialYear: e.target.value })}
                                    className="w-full text-xs mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden dark:border-gray-700 font-extrabold focus:border-indigo-505"
                                >
                                    <option value="2025-26">FY 2025-26 (Drafting)</option>
                                    <option value="2024-25">FY 2024-25 (Archived)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 block">{t("Aggregate Outward Supplies FY (Dynamic Sum)")}</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={compGstr4Data.outwardTaxable}
                                        onChange={(e) => setCompGstr4Data({ ...compGstr4Data, outwardTaxable: e.target.value })}
                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono font-bold text-gray-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 block">{t("Adjusted Inward Supplies Attracting RCM Sum")}</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={compGstr4Data.inwardRcm}
                                        onChange={(e) => setCompGstr4Data({ ...compGstr4Data, inwardRcm: e.target.value })}
                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono focus:border-indigo-505"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCompGstr4Data(prev => ({ ...prev, reconciled: true }));
                                        alert(t("CMP-08 quarterly aggregates matched against outward Sales Vouchers successfully. All discrepancies resolved. Ready for DSC signing."));
                                    }}
                                    className="w-full py-2 border hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-all dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
                                >
                                    {t("Reconcile CMP-08")}
                                </button>
                            </div>
                        </div>

                        {/* OTP Verification & Form Filing Simulator */}
                        <div className="bg-gradient-to-br from-indigo-50/50 to-slate-105 dark:from-slate-900 dark:to-gray-950 rounded-xl p-5 border border-indigo-100 dark:border-gray-800 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2 dark:border-gray-805">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-700 dark:text-indigo-400">{t("Verification Console")}</span>
                                    <span className="text-[10.5px] font-bold text-gray-500">{t("Form GSTR-4 Sign")}</span>
                                </div>

                                <div className="space-y-1 text-xs">
                                    <p className="font-bold text-gray-700 dark:text-gray-300">{t("Declared Tax Obligations summary:")}</p>
                                    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg space-y-1 font-mono text-[10.5px] border dark:border-gray-700">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t("Annual Outward Tax:")}</span>
                                            <span className="font-bold text-gray-850 dark:text-white">₹{formatNumber(Math.round(Number(compGstr4Data.outwardTaxable) * 0.01))}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t("RCM Tax Inward:")}</span>
                                            <span className="font-bold text-gray-850 dark:text-white">₹{formatNumber(Math.round(Number(compGstr4Data.inwardRcm) * 0.05))}</span>
                                        </div>
                                        <div className="flex justify-between pt-1 border-t text-indigo-600 dark:text-indigo-400 font-bold dark:border-gray-800">
                                            <span>{t("Consolidated Tax Balance:")}</span>
                                            <span>₹{formatNumber(Math.round(Number(compGstr4Data.outwardTaxable) * 0.01 + Number(compGstr4Data.inwardRcm) * 0.05))}</span>
                                        </div>
                                    </div>
                                </div>

                                {compGstr4Data.filed ? (
                                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 text-xs dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
                                        <p className="font-bold flex items-center gap-1.5">
                                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                                            {t("Successfully Filed for Period {period}", { period: compGstr4Data.financialYear })}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1">ARN: {compGstr4Data.arn}</p>
                                    </div>
                                ) : compGstr4Data.isSigning ? (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-400 block">{t("Enter EVC OTP code (Sent to registered mobile/email)")}</label>
                                        <input
                                            type="text"
                                            placeholder="123456"
                                            value={compGstr4Data.otp}
                                            onChange={(e) => setCompGstr4Data({ ...compGstr4Data, otp: e.target.value })}
                                            className="w-full text-center tracking-widest font-mono text-base font-black px-3 py-1 border rounded-lg bg-white dark:bg-gray-850 dark:border-gray-700 outline-hidden focus:border-indigo-500 text-gray-850 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!compGstr4Data.otp) {
                                                    alert(t("Please enter OTP code for digital signature verification."));
                                                    return;
                                                }
                                                const randArn = `CP4A27${Math.floor(100000 + Math.random() * 900000)}B`;
                                                const todayStr = new Date().toISOString().split('T')[0];

                                                setCompGstr4Data(prev => ({
                                                    ...prev,
                                                    filed: true,
                                                    isSigning: false,
                                                    arn: randArn
                                                }));

                                                setCompGstr4Archive([
                                                    {
                                                        id: `G4-${Date.now()}`,
                                                        fy: compGstr4Data.financialYear,
                                                        outward: Number(compGstr4Data.outwardTaxable),
                                                        rcm: Number(compGstr4Data.inwardRcm),
                                                        cgst: Math.round((Number(compGstr4Data.outwardTaxable) * 0.01) / 2),
                                                        sgst: Math.round((Number(compGstr4Data.outwardTaxable) * 0.01) / 2),
                                                        status: 'Filed',
                                                        date: todayStr
                                                    },
                                                    ...compGstr4Archive
                                                ]);

                                                alert(t("Annual return GSTR-4 filed successfully with ARN {arn}!", { arn: randArn }));
                                            }}
                                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition-all"
                                        >
                                            {t("Verify OTP & Submit Return")}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={!compGstr4Data.reconciled}
                                        onClick={() => {
                                            setCompGstr4Data(prev => ({ ...prev, isSigning: true }));
                                        }}
                                        className={`w-full py-2.5 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            compGstr4Data.reconciled
                                                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <FileCheck size={14} />
                                        {t("File Annual Return with OTP (EVC)")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filed Archives */}
                    <div className="space-y-3">
                        <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">{t("Form GSTR-4 Filed Archives")}</h5>
                        <div className="overflow-x-auto border rounded-xl dark:border-gray-700">
                            <table className="w-full text-xs text-left whitespace-nowrap">
                                <thead className="bg-gray-50 dark:bg-gray-950/40 text-gray-500 font-bold border-b dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-2">{t("Financial Period")}</th>
                                        <th className="px-4 py-2 text-right">{t("Sales Consolidated")}</th>
                                        <th className="px-4 py-2 text-right">{t("Inwards RCM")}</th>
                                        <th className="px-4 py-2 text-right">{t("Taxes (CGST/SGST)")}</th>
                                        <th className="px-4 py-2 text-center">{t("Filing Date")}</th>
                                        <th className="px-4 py-2 text-center">{t("Status")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                                    {compGstr4Archive.map(row => (
                                        <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40">
                                            <td className="px-4 py-2.5 font-bold text-gray-800 dark:text-white">FY {row.fy}</td>
                                            <td className="px-4 py-2.5 text-right font-mono text-gray-800 dark:text-gray-200">₹{formatNumber(row.outward)}</td>
                                            <td className="px-4 py-2.5 text-right font-mono text-gray-500">₹{formatNumber(row.rcm)}</td>
                                            <td className="px-4 py-2.5 text-right font-mono text-indigo-650 dark:text-indigo-400">₹{formatNumber(row.cgst)} + ₹{formatNumber(row.sgst)}</td>
                                            <td className="px-4 py-2.5 text-center text-gray-500 font-mono">{row.date}</td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span className="px-2 py-0.5 rounded text-[9px] uppercase font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">{t(row.status)}</span>
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
