import React from 'react';
import { motion } from 'motion/react';
import { KPIComponent, COLORS, CustomTooltip, SafeResponsiveContainer } from './DashboardShared';
import { FileText, Zap, ShieldAlert, Users, ShieldCheck, Activity, TrendingUp, Package, ArrowDownRight, CreditCard, Receipt, Repeat } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { TransactionFlow } from './TransactionFlow';
import { useLanguage } from '../../../context/LanguageContext';

export const MainTab = ({ stats, isDemo, colors = COLORS }: any) => {
    const activeColors = colors || COLORS;
    const { t, formatNumber } = useLanguage();
    return (
        <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPIComponent label={t("Total Volume")} val={formatNumber(stats.totalVouchers)} sub={t("Documents ingested")} icon={FileText} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/30" isDemo={isDemo} />
                <KPIComponent label={t("Total Sales")} val={`₹${formatNumber(Number(stats.vol.sales))}`} sub={t("Revenue generated")} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/30" isDemo={isDemo} />
                <KPIComponent label={t("Total Purchase")} val={`₹${formatNumber(Number(stats.vol.purchase))}`} sub={t("Capital expenditure")} icon={Package} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/30" isDemo={isDemo} />
                <KPIComponent label={t("Raw Bank Status")} val={formatNumber(stats.counts.rawBank)} sub={t("Records to classify")} icon={ArrowDownRight} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/30" isDemo={isDemo} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-premium-slate-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Zap size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">{t('Latency Avg')}</p>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white font-display">{stats.advanceMetrics.processingSpeed}</h4>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter mt-1">{t('Extraction cycle')}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-premium-slate-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <ShieldAlert size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">{t('Error Rate')}</p>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white font-display">{stats.advanceMetrics.errorRate}</h4>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter mt-1">{t('Quality divergence')}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-premium-slate-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Users size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">{t('Active Operatives')}</p>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white font-display">{stats.advanceMetrics.activeUsers}</h4>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter mt-1">{t('Current session')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm dark:shadow-none border border-premium-slate-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{t('Performance Trajectory')}</h3>
                        {isDemo && <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg dark:shadow-amber-900/50 border border-amber-600 animate-pulse">{t("DEMO")}</span>}
                    </div>
                    <div className="h-[400px]">
                        <SafeResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <AreaChart data={stats.trendData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="sales" name={t('Sales')} stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.05} strokeWidth={3} />
                                <Area type="monotone" dataKey="purchase" name={t('Purchase')} stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.05} strokeWidth={3} />
                            </AreaChart>
                        </SafeResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm dark:shadow-none border border-premium-slate-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{t('Distribution')}</h3>
                        {isDemo && <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-amber-200 dark:border-amber-700">{t("DEMO")}</span>}
                    </div>
                    <div className="h-[300px]">
                        <SafeResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <RechartsPieChart>
                                <Pie data={stats.typeDistribution} innerRadius={60} outerRadius={90} dataKey="value" stroke="none" cornerRadius={4}>
                                    {stats.typeDistribution.map((_: any, i: number) => <Cell key={i} fill={activeColors[i % activeColors.length]} />)}
                                </Pie>
                                <Tooltip />
                            </RechartsPieChart>
                        </SafeResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                        {stats.typeDistribution.map((item: any, i: number) => (
                            <div key={i} className="flex items-center text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: activeColors[i % activeColors.length] }}></div>
                                {t(item.name)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm dark:shadow-none border border-premium-slate-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{t('Operative Pulse')}</h3>
                        {isDemo && <span className="text-[8px] font-black text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-700 uppercase tracking-tighter">{t("DEMO")}</span>}
                    </div>
                    <div className="space-y-4">
                        {stats.advanceMetrics.userActivity.map((act: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                                        {act.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-900 dark:text-white">{act.user}</p>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">{t(act.action)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-900 dark:text-white">{formatNumber(act.count)} {t("units")}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t(act.time)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 flex flex-col justify-center items-center text-center dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 font-display dark:text-white">{t('System Integrity')}</h3>
                    <p className="text-sm text-gray-500 font-medium max-w-xs mt-2 dark:text-gray-400">{t("All extraction engines are operating within nominal parameters. Real-time auditing is active.")}</p>
                    <div className="mt-6 flex gap-4">
                        <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{t("Healthy")}</div>
                        <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest dark:bg-gray-800 dark:text-gray-300">v4.2.0-stable</div>
                    </div>
                </div>
            </div>
            <TransactionFlow />
        </motion.div>
    );
};
