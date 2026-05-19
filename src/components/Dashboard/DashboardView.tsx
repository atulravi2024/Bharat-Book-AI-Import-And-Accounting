
import React, { useMemo, useState } from 'react';
import { MainTab } from './components/MainTab';
import { SalesTab } from './components/SalesTab';
import { PurchaseTab } from './components/PurchaseTab';
import { PaymentTab } from './components/PaymentTab';
import { ReceiptsTab } from './components/ReceiptsTab';
import { BankTab } from './components/BankTab';
import { JournalTab } from './components/JournalTab';
import { ContraTab } from './components/ContraTab';
import { TransactionFlow } from './components/TransactionFlow';
import { motion, AnimatePresence } from 'motion/react';
import { ParsedVoucher, VoucherType, Confidence } from '../../types';
import { 
  TrendingUp, TrendingDown, FileText, Users,
  ArrowUpRight, ArrowDownRight, Clock, 
  CreditCard, Receipt, Repeat, Activity, Layers, Target, ShieldCheck,
  Package, Zap, ShieldAlert, CheckCircle
} from 'lucide-react';

interface DashboardViewProps {
  vouchers: ParsedVoucher[];
  onNavigateToView: (view: 'vouchers' | 'import' | 'ledger-master' | 'item-master') => void;
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
}

type DashboardTab = 'overview' | 'sales' | 'purchase' | 'payment' | 'receipts' | 'journal' | 'contra' | 'bank' | 'inventory';

export const DashboardView: React.FC<DashboardViewProps> = ({ vouchers, onNavigateToView, defaultTab, onTabChange }) => {
  const getInitialTab = (): DashboardTab => {
    let tab = defaultTab as string;
    if (tab === 'main') tab = 'overview';
    return (tab as DashboardTab) || 'overview';
  };
  const [activeTab, setActiveTab] = useState<DashboardTab>(getInitialTab());
  const [colors, setColors] = useState<string[]>(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6']);

  React.useEffect(() => {
    const loadMeta = async () => {
        try {
            const metaResp = await fetch('/sample-data/masters/metadata.json');
            if (metaResp.ok) {
                const meta = await metaResp.json();
                if (meta.dashboardColors) setColors(meta.dashboardColors);
            }
        } catch (e) {
            console.error("Failed to load dashboard colors", e);
        }
    };
    loadMeta();
  }, []);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const isDemo = vouchers.some(v => v.sampleSetId === 'demo_vouchers' || v.isSample);

  const stats = useMemo(() => {
    // Volume calculations
    const vol = {
      sales: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Sales'.toLowerCase()).reduce((sum, v) => sum + Number(v.amount?.value || 0), 0),
      purchase: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Purchase'.toLowerCase()).reduce((sum, v) => sum + Number(v.amount?.value || 0), 0),
      payment: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Payment'.toLowerCase()).reduce((sum, v) => sum + Number(v.amount?.value || 0), 0),
      receipt: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Receipt'.toLowerCase()).reduce((sum, v) => sum + Number(v.amount?.value || 0), 0),
      contra: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Contra'.toLowerCase()).reduce((sum, v) => sum + Number(v.amount?.value || 0), 0),
      journal: vouchers.filter(v => typeof v.type === 'string' && ['journal', 'general'].includes(v.type.toLowerCase().replace(/[\s_]+/g, ''))).reduce((sum, v) => sum + Number(v.amount?.value || 0), 0),
      withdrawals: vouchers.reduce((sum, v) => sum + Number(v.withdrawalAmount?.value || 0), 0),
      deposits: vouchers.reduce((sum, v) => sum + Number(v.depositAmount?.value || 0), 0),
    };
    
    const hasLedgerOrParty = (v: ParsedVoucher) => {
        const hasParty = !!v.partyName?.value;
        const hasFromAccount = !!v.fromAccount?.value;
        const hasToAccount = !!v.toAccount?.value;
        return hasParty || hasFromAccount || hasToAccount;
    };
    
    const counts = {
        sales: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Sales'.toLowerCase()).length,
        purchase: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Purchase'.toLowerCase()).length,
        payment: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Payment'.toLowerCase()).length,
        receipt: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Receipt'.toLowerCase()).length,
        journal: vouchers.filter(v => typeof v.type === 'string' && ['journal', 'general'].includes(v.type.toLowerCase().replace(/[\s_]+/g, ''))).length,
        contra: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === 'Contra'.toLowerCase()).length,
        bank: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'bankstatement' || !!v.withdrawalAmount || !!v.depositAmount).length,
        rawBank: vouchers.filter(v => (typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'bankstatement' || !!v.withdrawalAmount || !!v.depositAmount) && !hasLedgerOrParty(v)).length,
    };

    // Trends grouping
    const dateGroups = vouchers.reduce((acc: any, v) => {
      const d = (v.date?.value || 'N/A').toString().split('T')[0];
      if (!acc[d]) acc[d] = { date: d, sales: 0, purchase: 0, payment: 0, receipt: 0, journal: 0, contra: 0 };
      if (typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'sales') acc[d].sales += Number(v.amount?.value || 0);
      if (typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'purchase') acc[d].purchase += Number(v.amount?.value || 0);
      if (typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'payment') acc[d].payment += Number(v.amount?.value || 0);
      if (typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'receipt') acc[d].receipt += Number(v.amount?.value || 0);
      if (typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'journal') acc[d].journal += Number(v.amount?.value || 0);
      if (typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'contra') acc[d].contra += Number(v.amount?.value || 0);
      return acc;
    }, {});

    const trendData = Object.values(dateGroups)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10);

    const typeDistribution = Object.values(VoucherType).map(type => ({
      name: type,
      value: vouchers.filter(v => v.type === type).length
    })).filter(item => item.value > 0);

    // Advanced Metrics
    const advanceMetrics = {
        processingSpeed: vouchers.length > 0 ? "1.2s" : "0.0s",
        errorRate: vouchers.length > 0 ? (vouchers.filter(v => v.confidence === "low").length / vouchers.length * 100).toFixed(1) + "%" : "0.0%",
        activeUsers: 4,
        avgCompletion: "98.2%",
        userActivity: [
            { user: "Atul Ravi", action: "Bulk Import", count: 24, time: "2h ago" },
            { user: "System AI", action: "Auto-Mapping", count: 156, time: "Now" },
            { user: "Admin", action: "Review", count: 12, time: "1h ago" }
        ]
    };

    // Masters Analysis
    const getTopMasters = (collection: string) => {
      const counts: Record<string, number> = {};
      vouchers.forEach(v => {
        const val = String((v as any)[collection]?.value || '');
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
    };

    return {
      totalVouchers: vouchers.length,
      vol,
      counts,
      trendData,
      typeDistribution,
      advanceMetrics,
      topParties: getTopMasters('partyName'),
      topLedgers: getTopMasters('ledger')
    };
  }, [vouchers]);

  const TabButton = ({ id, label, icon: Icon }: { id: DashboardTab, label: string, icon: any }) => (
    <button 
      id={`dashboard-tab-${id}`}
      onClick={() => handleTabChange(id)}
      className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 transition-all relative whitespace-nowrap ${
        activeTab === id 
          ? 'text-blue-600' 
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={14} className="sm:w-4 sm:h-4 mr-2 sm:mr-3" />
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{label}</span>
      {activeTab === id && (
        <motion.div 
          layoutId="activeTabUnderline"
          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
        />
      )}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
      {/* Dynamic Header */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8 pb-12">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm border border-premium-slate-100 dark:border-gray-700 overflow-x-auto custom-scrollbar h-fit snap-x w-full sm:w-auto">
              <div className="snap-start"><TabButton id="overview" label="Overview" icon={Layers} /></div>
              <div className="snap-start"><TabButton id="sales" label="Sales" icon={TrendingUp} /></div>
              <div className="snap-start"><TabButton id="purchase" label="Purchase" icon={Package} /></div>
              <div className="snap-start"><TabButton id="payment" label="Payment" icon={CreditCard} /></div>
              <div className="snap-start"><TabButton id="receipts" label="Receipt" icon={Receipt} /></div>
              <div className="snap-start"><TabButton id="bank" label="Bank Report" icon={ArrowDownRight} /></div>
              <div className="snap-start"><TabButton id="journal" label="Journal" icon={FileText} /></div>
              <div className="snap-start"><TabButton id="contra" label="Contra" icon={Repeat} /></div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <MainTab stats={stats} isDemo={isDemo} colors={colors} />}
            {activeTab === 'sales' && <SalesTab stats={stats} isDemo={isDemo} colors={colors} />}
            {activeTab === 'purchase' && <PurchaseTab stats={stats} isDemo={isDemo} colors={colors} />}
            {activeTab === 'payment' && <PaymentTab stats={stats} isDemo={isDemo} colors={colors} />}
            {activeTab === 'receipts' && <ReceiptsTab stats={stats} isDemo={isDemo} colors={colors} />}
            {activeTab === 'bank' && <BankTab stats={stats} isDemo={isDemo} colors={colors} />}
            {activeTab === 'journal' && <JournalTab stats={stats} isDemo={isDemo} colors={colors} />}
            {activeTab === 'contra' && <ContraTab stats={stats} isDemo={isDemo} colors={colors} />}
          </AnimatePresence>


        </div>
      </div>
    </div>
  );
};

const KPIComponent = ({ label, val, sub, icon: Icon, color, bg, isDemo }: any) => (
  <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-premium-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] group hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700">
    <div className={`absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 ${bg} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700`}></div>
    <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} ${color} rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
        <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
      </div>
      {isDemo && (
        <div className="flex flex-col items-end">
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-500 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-200 animate-pulse border border-amber-600">DEMO</span>
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

const MastersList = ({ title, data, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center dark:text-white">
        <Icon size={18} className={`mr-3 ${color}`} /> {title}
      </h3>
      <div className="space-y-6">
        {data.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center">
              <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center text-xs font-black group-hover:scale-110 transition-transform`}>
                {p.name.charAt(0)}
              </div>
              <div className="ml-4 flex flex-col">
                  <span className="text-xs font-black text-gray-900 truncate max-w-[150px] uppercase tracking-wide leading-none mb-1 dark:text-white">{p.name}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Partner</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-900 mb-2 uppercase tracking-widest dark:text-white">{p.count} Vectors</span>
              <div className="w-24 h-1.5 bg-gray-50 rounded-full overflow-hidden border border-premium-slate-50 dark:bg-gray-900">
                <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${(p.count / (data[0]?.count || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-center text-gray-400 py-8 text-[10px] font-black uppercase tracking-widest">Awaiting Transaction Cycles</p>}
      </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
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

const SimpleTooltip = ({ active, payload }: any) => {
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
