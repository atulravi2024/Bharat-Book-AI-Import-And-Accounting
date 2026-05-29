import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { motion } from 'motion/react';
import { KPIComponent, CustomTooltip, SafeResponsiveContainer, COLORS } from './DashboardShared';
import { Repeat, ShieldCheck, Activity } from 'lucide-react';
import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell } from 'recharts';

export const ContraTab = ({ stats, isDemo }: any) => { 
    const { t, formatNumber } = useLanguage();
    return (
        <motion.div key="contra" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPIComponent label={t("Total Transfers")} val={`₹${formatNumber(Number(stats.vol.contra))}`} sub={t("Total value")} icon={Repeat} color="text-purple-600" bg="bg-purple-50" isDemo={isDemo} />
                <KPIComponent label={t("Transfer Count")} val={formatNumber(stats.counts.contra)} sub={t("Total transactions")} icon={ShieldCheck} color="text-blue-600" bg="bg-blue-50" isDemo={isDemo} />
                <KPIComponent label={t("Average Transfer")} val={`₹${formatNumber(stats.counts.contra > 0 ? stats.vol.contra / stats.counts.contra : 0, { maximumFractionDigits: 0 })}`} sub={t("Per transfer")} icon={Activity} color="text-emerald-600" bg="bg-emerald-50" isDemo={isDemo} />
                <KPIComponent label={t("Cash Deposits")} val={`₹${formatNumber(stats.vol.deposits)}`} sub={t("To bank reserves")} icon={ShieldCheck} color="text-indigo-600" bg="bg-indigo-50" isDemo={isDemo} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 h-[400px] relative dark:bg-gray-800 dark:border-gray-700">
                    {isDemo && <div className="absolute top-6 right-8 z-10"><span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-200 border border-amber-600 animate-pulse">{t("DEMO")}</span></div>}
                    <h3 className="text-gray-500 font-medium mb-6 uppercase tracking-wider text-xs">{t("Contra Transactions Trend")}</h3>
                    <SafeResponsiveContainer width="100%" height="80%" minWidth={1} minHeight={1}>
                        <AreaChart data={stats.trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorContra" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="step" dataKey="contra" name={t("Contra Transactions")} stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorContra)" />
                        </AreaChart>
                    </SafeResponsiveContainer>
                </div>
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 h-[400px] relative flex flex-col dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-gray-500 font-medium mb-2 uppercase tracking-wider text-xs">{t("Top Target Banks")}</h3>
                    {stats.topLedgersContra?.length > 0 ? (
                        <div className="flex-1 min-h-0 relative">
                            <SafeResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <PieChart>
                                    <Pie
                                        data={stats.topLedgersContra}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.topLedgersContra.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </SafeResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 italic">
                            {t("No sufficient data")}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
