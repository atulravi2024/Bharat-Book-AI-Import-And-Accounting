import React from 'react';
import { motion } from 'motion/react';
import { KPIComponent, CustomTooltip, SafeResponsiveContainer } from './DashboardShared';
import { TrendingUp, Activity, Target } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export const SalesTab = ({ stats, isDemo }: any) => {
    return (
        <motion.div key="sales" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <KPIComponent label="Sales Revenue" val={`₹${stats.vol.sales.toLocaleString()}`} sub={`${stats.counts.sales} Vouchers`} icon={TrendingUp} color="text-blue-600" bg="bg-blue-50" isDemo={isDemo} />
                <KPIComponent label="Averaging" val={`₹${(stats.vol.sales / (stats.counts.sales || 1)).toFixed(0)}`} sub="Per Invoice" icon={Activity} color="text-indigo-600" bg="bg-indigo-50" isDemo={isDemo} />
                <KPIComponent label="Growth" val="+12.5%" sub="MoM Deviation" icon={Target} color="text-emerald-600" bg="bg-emerald-50" isDemo={isDemo} />
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 h-[400px] relative dark:bg-gray-800 dark:border-gray-700">
                {isDemo && <div className="absolute top-6 right-8 z-10"><span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-200 border border-amber-600 animate-pulse">DEMO</span></div>}
                <SafeResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <BarChart data={stats.trendData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </SafeResponsiveContainer>
            </div>
        </motion.div>
    );
};
