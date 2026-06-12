import React, { useState, useEffect } from 'react';
import { ParsedVoucher } from '../../../../app/types';
import { 
  BarChart, Users, BookOpen, Clock, Activity, Target, Download, CheckCircle, RefreshCw, Layers
} from 'lucide-react';

interface OverviewTabProps {
  allVouchers: ParsedVoucher[];
  partyMasters: any[];
  ledgerMasters: any[];
  itemMasters: any[];
  searchTerm: string;
  language: string;
}

interface ActivityItem {
  id: string;
  type: string;
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
  timestamp_en: string;
  timestamp_hi: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  allVouchers,
  partyMasters,
  ledgerMasters,
  itemMasters,
  searchTerm,
  language
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/sample-data/overview.json');
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (e) {
        console.error("Failed to load overview sample data", e);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sample card components summarizing data */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-750 shadow-sm flex items-start gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/40 p-2 rounded-lg">
            <BarChart className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">{language === 'hi' ? 'कुल वाउचर' : 'Total Vouchers'}</p>
            <p className="text-xl font-bold dark:text-white">{allVouchers.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-755 shadow-sm flex items-start gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-900/40 p-2 rounded-lg">
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">{language === 'hi' ? 'कुल पार्टियां' : 'Total Parties'}</p>
            <p className="text-xl font-bold dark:text-white">{partyMasters.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-750 shadow-sm flex items-start gap-3">
          <div className="bg-purple-50 dark:bg-purple-900/40 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">{language === 'hi' ? 'कुल लेजर' : 'Total Ledgers'}</p>
            <p className="text-xl font-bold dark:text-white">{ledgerMasters.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-750 shadow-sm flex items-start gap-3">
          <div className="bg-rose-50 dark:bg-rose-900/40 p-2 rounded-lg">
            <Target className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">{language === 'hi' ? 'कुल आइटम' : 'Total Items'}</p>
            <p className="text-xl font-bold dark:text-white">{itemMasters.length}</p>
          </div>
        </div>
      </div>
      
      {/* Dynamic list loaded from sample-data/overview.json */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-750 shadow-sm">
        <h3 className="text-sm font-bold mb-4 dark:text-white">
          {language === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity Overview'}
        </h3>
        {activities.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60 space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3.5 pt-4 first:pt-0">
                <div className={`p-2 rounded-lg shrink-0 ${
                  act.type === 'sync' ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/30' :
                  act.type === 'audit' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30' :
                  'bg-purple-50 text-purple-500 dark:bg-purple-900/30'
                }`}>
                  {act.type === 'sync' ? <RefreshCw className="w-4 h-4" /> :
                   act.type === 'audit' ? <CheckCircle className="w-4 h-4" /> :
                   <Layers className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200">
                      {language === 'hi' ? act.title_hi : act.title_en}
                    </p>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono font-medium shrink-0">
                      {language === 'hi' ? act.timestamp_hi : act.timestamp_en}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    {language === 'hi' ? act.desc_hi : act.desc_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-100 dark:border-gray-700/50 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
            <div className="text-center">
              <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {language === 'hi' ? 'गतिविधि लोड हो रही है...' : 'Loading recent activity overview...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
