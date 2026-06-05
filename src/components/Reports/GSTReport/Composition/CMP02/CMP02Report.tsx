import React, { useState } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
    CheckCircle, FileSignature 
} from 'lucide-react';

interface CMP02ReportProps {
    useSampleData: boolean;
    onToggleSampleData?: (enabled: boolean) => void;
}

export const CMP02Report: React.FC<CMP02ReportProps> = ({ useSampleData }) => {
    const { t, formatNumber } = useLanguage();

    // CMP-02 Eligibility & Application opt-in Option State
    const [cmp02Form, setCmp02Form] = useState({
        fy: '2026-27',
        estimatedTurnover: '8500000',
        category: 'Manufacturer', // Manufacturer, Trader, Restaurant, Service Provider
        declarationAccepted: false,
        submitted: false,
        arn: ''
    });

    return (
        <div className="space-y-6">
            {/* Top Stat Banner */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                    {t("Form GST CMP-02")}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                    {t("Intimation of Scheme Option")}
                </h3>
                <p className="text-xs text-gray-500">
                    {t("Lodge intimations to levy corporate taxes as flat flat-rate compositions under Section 10.")}
                </p>
            </div>

            {/* Application Workspace */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs dark:bg-gray-800 dark:border-gray-800">
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("CMP-02: Form of Intimation to Exercise Option under Section 10")}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{t("Register to transition from standard taxing onto simplified flat-rate composition schedules.")}</p>
                        </div>
                        <FileSignature className="text-indigo-600 animate-pulse" size={18} />
                    </div>

                    {cmp02Form.submitted ? (
                        <div className="p-8 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-center space-y-3 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/60 animate-fade-in">
                            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                            <h5 className="font-black text-sm">{t("Opt-In Intimation Successfully Logged!")}</h5>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                {t("Form GST CMP-02 successfully lodged on GSTN portal. Your company category transitioned onto dynamic flat rates for {fyPeriod}.", { fyPeriod: cmp02Form.fy })}
                            </p>
                            <p className="font-mono text-xs font-black text-indigo-755 bg-white/60 dark:bg-gray-905/60 py-2 rounded-lg max-w-sm mx-auto">
                                {t("ARN Number:")} {cmp02Form.arn}
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!cmp02Form.declarationAccepted) {
                                    alert(t("Please accept structural verification declarations."));
                                    return;
                                }
                                const randArn = `CP0227${Math.floor(100000 + Math.random() * 900000)}B`;
                                setCmp02Form(prev => ({ ...prev, submitted: true, arn: randArn }));
                                alert(t("Opt-In statement submitted successfully. Flat Composition rates apply for financial year {fyPeriod}.", { fyPeriod: cmp02Form.fy }));
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Financial period choice")}</label>
                                    <select
                                        value={cmp02Form.fy}
                                        onChange={(e) => setCmp02Form({ ...cmp02Form, fy: e.target.value })}
                                        className="w-full text-xs mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 font-bold focus:border-indigo-505"
                                    >
                                        <option value="2026-27">FY 2026-27 (Upcoming Cycle)</option>
                                        <option value="2025-26">FY 2025-26</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Business Activity Category")}</label>
                                    <select
                                        value={cmp02Form.category}
                                        onChange={(e) => setCmp02Form({ ...cmp02Form, category: e.target.value })}
                                        className="w-full text-xs mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 focus:border-indigo-505"
                                    >
                                        <option value="Manufacturer">Manufacturer (1% Levy)</option>
                                        <option value="Trader">Retail Trader/Traders (1% Levy)</option>
                                        <option value="Restaurant">Restaurant (5% Levy)</option>
                                        <option value="Service Provider">Mixed Service practitioner (6% Sec 10(2A) Levy)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 block">{t("Estimated Aggregate Turnover INR")}</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={cmp02Form.estimatedTurnover}
                                        onChange={(e) => setCmp02Form({ ...cmp02Form, estimatedTurnover: e.target.value })}
                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono font-bold"
                                    />
                                </div>
                            </div>

                            {/* Verification list */}
                            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs border dark:bg-slate-900/40 dark:border-gray-750">
                                <p className="font-extrabold text-gray-700 dark:text-gray-350">{t("Verify Eligibility Checklist:")}</p>
                                <div className="space-y-1.5 text-gray-550 dark:text-gray-400">
                                    <p className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{t("Aggregate turnover doesn't exceed 1.5 Crores INR (75 Lakhs for Special Category States)")}</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-605 shrink-0 mt-0.5" />
                                        <span>{t("No execution of interstate outward taxable supplies of goods or services")}</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-605 shrink-0 mt-0.5" />
                                        <span>{t("No distribution of tobacco, pan masala, ice-cream, aerated waters, or non-taxable petroleum")}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Declaration check */}
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="cmp02dec"
                                    checked={cmp02Form.declarationAccepted}
                                    onChange={(e) => setCmp02Form({ ...cmp02Form, declarationAccepted: e.target.checked })}
                                    className="rounded border mt-1 shrink-0 cursor-pointer text-indigo-600 focus:ring-indigo-505"
                                />
                                <label htmlFor="cmp02dec" className="text-[10px] text-gray-500 leading-normal select-none cursor-pointer">
                                    {t("I hereby verify that my business is eligible under Section 10 rules list and declarations are valid. I will refrain from executing interstate sales or distributing unlisted non-composition materials.")}
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition-all"
                            >
                                {t("Authorize and Lodge Opt-In Application")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
