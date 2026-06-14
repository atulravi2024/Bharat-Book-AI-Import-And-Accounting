import React, { useState, useEffect } from 'react';

interface SystemHealthTabProps {
  language: string;
}

interface HealthIndicator {
  id: string;
  name_en: string;
  name_hi: string;
  value: string;
  status_en: string;
  status_hi: string;
  percentage: number;
  barColor: string;
  description_en: string;
  description_hi: string;
}

export const SystemHealthTab: React.FC<SystemHealthTabProps> = ({
  language
}) => {
  const [indicators, setIndicators] = useState<HealthIndicator[]>([]);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/sample-data/health.json');
        if (res.ok) {
          const data = await res.json();
          setIndicators(data);
        }
      } catch (err) {
        console.error('Failed to load system health configurations', err);
      }
    };
    fetchHealth();
  }, []);

  if (indicators.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-850 rounded-2xl border border-slate-100 dark:border-gray-750">
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
          {language === 'hi' ? 'स्वास्थ्य विवरण डिकोड हो रहा है...' : 'Decoding health metrics...'}
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-350">
      {indicators.map((ind) => (
        <div key={ind.id} className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-slate-100 dark:border-gray-750 shadow-xs space-y-3">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-none">
            {language === 'hi' ? ind.name_hi : ind.name_en}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 dark:text-white">{ind.value}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${
              ind.id === 'integrity' ? 'text-indigo-500' : 'text-emerald-500'
            }`}>
              {language === 'hi' ? ind.status_hi : ind.status_en}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className={`${ind.barColor} h-full`} style={{ width: `${ind.percentage}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            {language === 'hi' ? ind.description_hi : ind.description_en}
          </p>
        </div>
      ))}
    </div>
  );
};
