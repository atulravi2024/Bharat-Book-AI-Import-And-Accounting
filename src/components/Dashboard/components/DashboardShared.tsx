import React from 'react';
import { FileText } from 'lucide-react';

export const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6'];

export const KPIComponent = ({ label, val, sub, icon: Icon, color, bg, isDemo }: any) => (
  <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-premium-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] group hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700">
    <div className={`absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 ${bg} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700`}></div>
    <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} ${color} rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
        <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
      </div>
      {isDemo && (
        <div className="flex flex-col items-end">
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-500 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-200 animate-pulse border border-amber-600">Demo Mode</span>
          <span className="hidden sm:block text-[8px] font-bold text-amber-500 mt-1 uppercase tracking-tighter">Simulated Analytics</span>
        </div>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 sm:mb-2">{label}</p>
      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 font-display tracking-tight leading-none truncate max-w-[200px] sm:max-w-none dark:text-white">{val}</h3>
      <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 sm:mt-4 sm:opacity-60 group-hover:opacity-100 transition-opacity dark:text-gray-400">
        {sub}
      </p>
    </div>
  </div>
);

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-2xl border border-premium-slate-100 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{label}</p>
        <div className="space-y-2">
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider dark:text-gray-300">{entry.name}</span>
                    </div>
                    <span className="text-xs font-black text-gray-900 font-display dark:text-white">₹{Number(entry.value).toLocaleString('en-IN')}</span>
                </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export const SimpleTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-black text-white uppercase tracking-widest">{payload[0].name}</p>
          <p className="text-xs font-black text-blue-400 font-display mt-1">{payload[0].value} Units</p>
        </div>
      );
    }
    return null;
};
