import React, { useState } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
    CheckCircle, ShieldAlert 
} from 'lucide-react';

interface CMP04ReportProps {
    useSampleData: boolean;
    onToggleSampleData?: (enabled: boolean) => void;
}

export const CMP04Report: React.FC<CMP04ReportProps> = ({ useSampleData }) => {
    const { t, formatNumber } = useLanguage();

    // CMP-04 Withdrawal opt-out Option State
    const [cmp04Form, setCmp04Form] = useState({
        fy: '2025-26',
        reason: 'To exceed threshold limit (over 1.5 Crores INR)',
        effectiveDate: '2025-07-01',
        declarationAccepted: false,
        submitted: false,
        arn: ''
    });

    return (
        <div className="space-y-6">
            {/* Top Stat Banner */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded dark:bg-rose-950/40 dark:text-rose-450">
                    {t("Form GST CMP-04")}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                    {t("Withdrawal from Composition Scheme")}
                </h3>
                <p className="text-xs text-gray-500">
                    {t("Lodge notices of voluntary or required withdrawal from the composition regime and transitional schedules.")}
                </p>
            </div>

            {/* Application Workspace */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs dark:bg-gray-800 dark:border-gray-800">
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("CMP-04: Notice of Withdrawal from Composition Scheme Workspace")}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{t("Report structural withdrawal or voluntary opt-out to transfer onto regular tax schedules.")}</p>
                        </div>
                        <ShieldAlert className="text-rose-500" size={18} />
                    </div>

                    {cmp04Form.submitted ? (
                        <div className="p-8 bg-rose-50 text-rose-800 rounded-xl border border-rose-100 text-center space-y-3 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900 animate-fade-in">
                            <CheckCircle className="w-12 h-12 text-rose-500 mx-auto" />
                            <h5 className="font-black text-sm">{t("Withdrawal Intimation Logged Successfully!")}</h5>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                {t("Composition limits successfully waived. Business status shifted to standard GST schedules starting {effDate}.", { effDate: cmp04Form.effectiveDate })}
                            </p>
                            <p className="font-mono text-xs font-black text-rose-650 bg-white/60 dark:bg-gray-900/60 py-2 rounded-lg max-w-sm mx-auto">
                                ARN: {cmp04Form.arn}
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!cmp04Form.declarationAccepted) {
                                    alert(t("Please accept the statutory conversion rules first."));
                                    return;
                                }
                                const randArn = `CW0427${Math.floor(100000 + Math.random() * 900000)}P`;
                                setCmp04Form(prev => ({ ...prev, submitted: true, arn: randArn }));
                                alert(t("LODGED. Form GST CMP-04 registered starting {effDate}. File standard monthly GSTR-1 & GSTR-3B registers.", { effDate: cmp04Form.effectiveDate }));
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Effective Date of Withdrawal")}</label>
                                    <input
                                        type="date"
                                        value={cmp04Form.effectiveDate}
                                        onChange={(e) => setCmp04Form({ ...cmp04Form, effectiveDate: e.target.value })}
                                        className="w-full text-xs mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 font-bold focus:border-indigo-505"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Financial Period Cycle")}</label>
                                    <select
                                        value={cmp04Form.fy}
                                        onChange={(e) => setCmp04Form({ ...cmp04Form, fy: e.target.value })}
                                        className="w-full text-xs mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 focus:border-indigo-505"
                                    >
                                        <option value="2025-26">FY 2025-26</option>
                                        <option value="2024-25">FY 2024-25</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 block">{t("Reason for Opt-Out Intimation Choice")}</label>
                                <select
                                    value={cmp04Form.reason}
                                    onChange={(e) => setCmp04Form({ ...cmp04Form, reason: e.target.value })}
                                    className="w-full text-xs mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 focus:border-indigo-505"
                                >
                                    <option value="To exceed threshold limit (over 1.5 Crores INR)">Exceeded aggregate turnover limit (&gt; 1.5 Crores INR)</option>
                                    <option value="Voluntary conversion to standard cycle">Voluntary Conversion to regular taxing scheme</option>
                                    <option value="Excusable manufacturing change constraints">Interstate outward supplies or e-commerce channeling transition</option>
                                </select>
                            </div>

                            {/* Warning detail */}
                            <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100 text-xs text-rose-850 dark:bg-slate-900 dark:border-rose-950 dark:text-rose-400 leading-relaxed">
                                ℹ️ <strong>{t("Compliance Warning:")}</strong> {t("Upon submission under CMP-04, you must file Form GST ITC-01 summarizing raw material stock, in-process goods, and semi-finished stock within 30 days to transfer input credits legally.")}
                            </div>

                            {/* Declaration */}
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="cmp04dec"
                                    checked={cmp04Form.declarationAccepted}
                                    onChange={(e) => setCmp04Form({ ...cmp04Form, declarationAccepted: e.target.checked })}
                                    className="rounded border mt-1 shrink-0 cursor-pointer text-indigo-600 focus:ring-indigo-505"
                                />
                                <label htmlFor="cmp04dec" className="text-[10px] text-gray-500 leading-normal select-none cursor-pointer">
                                    {t("I hereby confirm structural withdrawal from the composition regime and acknowledge my liability to collect and deposit tax as a regular dealer from the chosen date.")}
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg transition-all"
                            >
                                {t("Lodge Voluntary Scheme Withdrawal Option")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
