import React from 'react';
import { motion } from 'motion/react';
import { KPIComponent, CustomTooltip } from './DashboardShared';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export const BankTab = ({ stats, isDemo }: any) => {
    return (
        <motion.div key="bank" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPIComponent label="Total Deposits" val={`₹${stats.vol.deposits.toLocaleString()}`} sub="Direct inflows" icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" isDemo={isDemo} />
                <KPIComponent label="Total Withdrawals" val={`₹${stats.vol.withdrawals.toLocaleString()}`} sub="Operational outflows" icon={TrendingDown} color="text-rose-600" bg="bg-rose-50" isDemo={isDemo} />
                <KPIComponent label="Bank Activity" val={stats.counts.bank} sub="Statement entries" icon={Activity} color="text-blue-600" bg="bg-blue-50" isDemo={isDemo} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 flex flex-col h-[450px] relative overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest dark:text-white">Cash Position Delta</h3>
                        {isDemo && <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-200 border border-amber-600 animate-pulse">Demo Stream</span>}
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <AreaChart data={stats.trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" height={36}/>
                                <Area type="monotone" dataKey="receipt" name="Deposits" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={3} />
                                <Area type="monotone" dataKey="payment" name="Withdrawals" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 flex flex-col relative overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest dark:text-white">Allocation</h3>
                        {isDemo && <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-lg border border-amber-200">Demo Ratio</span>}
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <RechartsPieChart>
                                <Pie 
                                    data={[
                                        { name: 'Withdrawals', value: stats.vol.withdrawals },
                                        { name: 'Deposits', value: stats.vol.deposits }
                                    ]} 
                                    innerRadius={70} 
                                    outerRadius={100} 
                                    dataKey="value" 
                                    stroke="none"
                                >
                                    <Cell fill="#EF4444" cornerRadius={6} />
                                    <Cell fill="#10B981" cornerRadius={6} />
                                </Pie>
                                <Tooltip />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center text-[10px] font-black text-rose-600 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div> Outflow
                        </div>
                        <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Inflow
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
