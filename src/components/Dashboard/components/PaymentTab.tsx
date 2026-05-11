import React from 'react';
import { motion } from 'motion/react';
import { KPIComponent, CustomTooltip } from './DashboardShared';
import { CreditCard, Target, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

export const PaymentTab = ({ stats, isDemo }: any) => {
    return (
        <motion.div key="payment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPIComponent label="Total Payments" val={`₹${stats.vol.payment.toLocaleString()}`} sub={`${stats.counts.payment} Payouts`} icon={CreditCard} color="text-rose-600" bg="bg-rose-50" isDemo={isDemo} />
                <KPIComponent label="Liabilities Met" val="94%" sub="Completion rate" icon={Target} color="text-emerald-600" bg="bg-emerald-50" isDemo={isDemo} />
                <KPIComponent label="Frequency" val="Regular" sub="Weekly settlement" icon={Activity} color="text-blue-600" bg="bg-blue-50" isDemo={isDemo} />
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 h-[400px] relative dark:bg-gray-800 dark:border-gray-700">
                {isDemo && <div className="absolute top-6 right-8 z-10"><span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-200 border border-amber-600 animate-pulse">Demo Projection</span></div>}
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="payment" stroke="#EF4444" strokeWidth={4} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
