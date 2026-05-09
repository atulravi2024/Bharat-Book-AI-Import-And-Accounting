import React from 'react';
import { motion } from 'motion/react';
import { KPIComponent, CustomTooltip } from './DashboardShared';
import { Package, ShieldCheck, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export const PurchaseTab = ({ stats, isDemo }: any) => {
    return (
        <motion.div key="purchase" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPIComponent label="Total Purchase" val={`₹${stats.vol.purchase.toLocaleString()}`} sub={`${stats.counts.purchase} Orders`} icon={Package} color="text-amber-600" bg="bg-amber-50" isDemo={isDemo} />
                <KPIComponent label="Inventory Cost" val="Moderate" sub="Evaluation based" icon={ShieldCheck} color="text-emerald-600" bg="bg-emerald-50" isDemo={isDemo} />
                <KPIComponent label="Procurement Rate" val="Stable" sub="Price stability" icon={Activity} color="text-indigo-600" bg="bg-indigo-50" isDemo={isDemo} />
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 h-[400px] relative dark:bg-gray-800 dark:border-gray-700">
                {isDemo && <div className="absolute top-6 right-8 z-10"><span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-200 border border-amber-600 animate-pulse">Demo Projection</span></div>}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="purchase" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
