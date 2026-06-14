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
import { ParsedVoucher, VoucherType, Confidence } from '../../app/types';
import { useLanguage } from '../../context/LanguageContext';
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
  const { t, formatNumber } = useLanguage();
  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);

  React.useEffect(() => {
    const loadHidden = () => {
      const stored = localStorage.getItem("bharat_book_hidden_report_tabs");
      if (stored) {
        try {
          setHiddenTabs(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setHiddenTabs([]);
      }
    };
    loadHidden();
    window.addEventListener("bharat_book_report_tabs_trigger", loadHidden);
    return () => {
      window.removeEventListener("bharat_book_report_tabs_trigger", loadHidden);
    };
  }, []);

  const getInitialTab = (): DashboardTab => {
    let tab = defaultTab as string;
    if (tab === 'main') tab = 'overview';
    return (tab as DashboardTab) || 'overview';
  };
  const [activeTab, setActiveTab ] = useState<DashboardTab>(getInitialTab());

  React.useEffect(() => {
    const checkId = `dash_${activeTab === 'receipts' ? 'receipts' : activeTab}`;
    if (hiddenTabs.includes(checkId)) {
      const order: DashboardTab[] = ['overview', 'sales', 'purchase', 'payment', 'receipts', 'bank', 'journal', 'contra'];
      for (const tId of order) {
        const oId = `dash_${tId === 'receipts' ? 'receipts' : tId}`;
        if (!hiddenTabs.includes(oId)) {
          setActiveTab(tId);
          break;
        }
      }
    }
  }, [hiddenTabs, activeTab]);

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
    const errorRateNum = vouchers.length > 0 ? (vouchers.filter((v: any) => v.confidence === "low").length / vouchers.length * 100) : 0;
    const advanceMetrics = {
        processingSpeed: vouchers.length > 0 ? `${formatNumber(1.2)}s` : `${formatNumber(0.0)}s`,
        errorRate: `${formatNumber(errorRateNum, { maximumFractionDigits: 1 })}%`,
        activeUsers: formatNumber(4),
        avgCompletion: `${formatNumber(98.2)}%`,
        userActivity: [
            { user: "Atul Ravi", action: "Bulk Import", count: 24, time: "2h ago" },
            { user: "System AI", action: "Auto-Mapping", count: 156, time: "Now" },
            { user: "Admin", action: "Review", count: 12, time: "1h ago" }
        ]
    };

    // Masters Analysis
    const getTopMasters = (collection: string, typeFilter?: string) => {
      const counts: Record<string, number> = {};
      const filtered = typeFilter ? vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\s_]+/g, '') === typeFilter.toLowerCase()) : vouchers;
      filtered.forEach(v => {
        const val = String((v as any)[collection]?.value || '');
        if (val) counts[val] = (counts[val] || 0) + Number((v as any).amount?.value || 1); // By volume if amount exists
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));
    };

    return {
      totalVouchers: vouchers.length,
      vol,
      counts,
      trendData,
      typeDistribution,
      advanceMetrics,
      topParties: getTopMasters('partyName'),
      topLedgers: getTopMasters('ledger'),
      topPartiesSales: getTopMasters('partyName', 'sales'),
      topPartiesPurchase: getTopMasters('partyName', 'purchase'),
      topLedgersReceipt: getTopMasters('partyName', 'receipt'), 
      topLedgersPayment: getTopMasters('partyName', 'payment'), 
      topLedgersContra: getTopMasters('partyName', 'contra'), 
      topLedgersJournal: getTopMasters('ledger', 'journal'),
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
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{t(label)}</span>
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
            <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm border border-premium-slate-100 dark:border-gray-700 overflow-x-auto custom-scrollbar h-fit w-full sm:w-auto">
              {!hiddenTabs.includes("dash_overview") && <div><TabButton id="overview" label={t("Overview")} icon={Layers} /></div>}
              {!hiddenTabs.includes("dash_sales") && <div><TabButton id="sales" label={t("Sales")} icon={TrendingUp} /></div>}
              {!hiddenTabs.includes("dash_purchase") && <div><TabButton id="purchase" label={t("Purchase")} icon={Package} /></div>}
              {!hiddenTabs.includes("dash_payment") && <div><TabButton id="payment" label={t("Payment")} icon={CreditCard} /></div>}
              {!hiddenTabs.includes("dash_receipts") && <div><TabButton id="receipts" label={t("Receipt")} icon={Receipt} /></div>}
              {!hiddenTabs.includes("dash_bank") && <div><TabButton id="bank" label={t("Bank Report")} icon={ArrowDownRight} /></div>}
              {!hiddenTabs.includes("dash_journal") && <div><TabButton id="journal" label={t("Journal")} icon={FileText} /></div>}
              {!hiddenTabs.includes("dash_contra") && <div><TabButton id="contra" label={t("Contra")} icon={Repeat} /></div>}
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
