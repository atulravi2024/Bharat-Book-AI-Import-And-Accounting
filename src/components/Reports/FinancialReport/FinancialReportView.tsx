import { useLanguage } from '../../../context/LanguageContext';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Download, Printer, Calendar, 
  Search, ArrowRight, BarChart3
} from 'lucide-react';
import { ParsedVoucher, VoucherType } from '../../../app/types';
import * as XLSX from 'xlsx';
import { getFiscalYearDates } from '../../../services/aiService';
import { ProfitAndLoss } from './ProfitAndLoss';
import { BalanceSheet } from './BalanceSheet';
import { CashFlow } from './CashFlow';
import { BankFlow } from './BankFlow';
import { TrialBalance } from './TrialBalance';
import { SalesRegister } from './SalesRegister';
import { PurchaseRegister } from './PurchaseRegister';
import { GSTR1Report } from './GSTR1Report';
import { DateRangeSelector } from '../../shared/DateRangeSelector';

const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

interface ReportsViewProps {
  vouchers: ParsedVoucher[];
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
  activeSamples?: string[];
}

type ReportType = 'pl' | 'bs' | 'cash_flow' | 'bank_flow' | 'trial_balance' | 'sales' | 'purchase';

export const ReportsView: React.FC<ReportsViewProps> = ({ vouchers, defaultTab, onTabChange, activeSamples }) => {
  const { t, formatNumber  } = useLanguage();

  const [activeTab, setActiveTab] = useState<ReportType>((defaultTab as ReportType) || 'pl');
  
  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
        setActiveTab(defaultTab as ReportType);
    }
  }, [defaultTab, activeTab]);

  useEffect(() => {
    const scrollToTab = () => {
      const el = document.getElementById(`report-tab-${activeTab}`);
      const container = el?.closest('.overflow-x-auto') as HTMLElement;
      if (el && container) {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        if (cRect.width === 0 || eRect.width === 0) return;
        
        const offset = (eRect.left + eRect.width / 2) - (cRect.left + cRect.width / 2);
        
        if (Math.abs(offset) > 2) {
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
      }
    };

    scrollToTab();
    const t1 = setTimeout(scrollToTab, 100);
    const t2 = setTimeout(scrollToTab, 300);
    const t3 = setTimeout(scrollToTab, 500);
    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
    };
  }, [activeTab]);

  const handleTabClick = (id: ReportType) => {
    setActiveTab(id);
    if (onTabChange) onTabChange(id);
  };

  const [dateRange, setDateRange] = useState(() => {
    let fmt = 'April to March (Indian Standard)';
    try {
        const stored = localStorage.getItem('bharat_book_app_settings');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.fiscalYear) fmt = parsed.fiscalYear;
        }
    } catch(e) {}
    
    // Auto-detect if we have sample data from 2024 and adjust initial range
    const hasSampleData = vouchers.some(v => v.sampleSetId);
    if (hasSampleData) {
        return { from: '2024-04-01', to: '2025-03-31' };
    }
    
    return getFiscalYearDates(fmt);
  });

  // Sync date range if sample data is loaded later
  useEffect(() => {
    const hasSampleData = vouchers.some(v => v.isSample);
    if (hasSampleData && dateRange.from > '2024-04-01') {
        setDateRange({ from: '2024-04-01', to: '2025-03-31' });
    }
  }, [vouchers, dateRange.from]);

  const filteredVouchersTemp = useMemo(() => {
    return vouchers.filter(v => {
      if (v.isSample) return true; // Always include sample data regardless of date filter
      const date = String(v.date?.value || '');
      if (dateRange.from && date < dateRange.from) return false;
      if (dateRange.to && date > dateRange.to) return false;
      return true;
    });
  }, [vouchers, dateRange]);
  
  const filteredVouchers = filteredVouchersTemp;

  const plSummary = useMemo(() => {
    let source = filteredVouchers.filter(v => {
      if (v.isSample) {
        return (v.sampleSetId === 'profit_loss' || v.sampleSetId === 'financial_vouchers') && activeSamples?.includes(v.sampleSetId);
      }
      return true; // Include all real data
    });
    
    const sales = source
      .filter(v => v.type === VoucherType.Sales)
      .reduce((sum, v) => sum + Number(v.amount?.value || 0), 0);
    
    const purchases = source
      .filter(v => v.type === VoucherType.Purchase)
      .reduce((sum, v) => sum + Number(v.amount?.value || 0), 0);
      
    const expenses = source
      .filter(v => v.type === VoucherType.Payment)
      .reduce((sum, v) => sum + Number(v.amount?.value || 0), 0);
      
    return {
      revenue: sales,
      cogs: purchases * 0.8, // Static assumption for mockup
      grossProfit: sales - (purchases * 0.8),
      operatingExpenses: expenses,
      netProfit: sales - (purchases * 0.8) - expenses
    };
  }, [filteredVouchers, activeSamples]);

  const salesRegister = useMemo(() => {
    let source = filteredVouchers;
    return source.filter(v => {
      if (v.isSample) return v.sampleSetId === 'sales_register' && activeSamples?.includes('sales_register');
      return v.type === VoucherType.Sales;
    });
  }, [filteredVouchers, activeSamples]);

  const purchaseRegister = useMemo(() => {
    let source = filteredVouchers;
    return source.filter(v => {
      if (v.isSample) return v.sampleSetId === 'purchase_register' && activeSamples?.includes('purchase_register');
      return v.type === VoucherType.Purchase;
    });
  }, [filteredVouchers, activeSamples]);

  const balanceSheetData = useMemo(() => {
    let source = filteredVouchers;
    return source.filter(v => {
      if (v.isSample) return v.sampleSetId === 'balance_sheet' && activeSamples?.includes('balance_sheet');
      return String(v.narration?.value || '').toLowerCase().includes('balance sheet');
    });
  }, [filteredVouchers, activeSamples]);

  const bsSummary = useMemo(() => {
    const balances = new Map<string, number>();

    balanceSheetData.forEach(v => {
      const amt = Number(v.amount?.value || 0);
      const debit = String(v.debitLedger?.value || '');
      const credit = String(v.creditLedger?.value || '');

      const ignored = ['Trading A/c', 'Profit & Loss A/c', 'Purchases A/c', 'Sales A/c', 'Freight & Forwarding A/c', ''];

      if (debit && !ignored.includes(debit)) {
         balances.set(debit, (balances.get(debit) || 0) + amt);
      }
      
      if (credit && !ignored.includes(credit)) {
         balances.set(credit, (balances.get(credit) || 0) - amt);
      }
    });

    const assets: {name: string, amount: number}[] = [];
    const liabilities: {name: string, amount: number}[] = [];
    let totalAssets = 0;
    let totalLiabilities = 0;

    balances.forEach((balance, name) => {
       if (balance > 0) {
           assets.push({ name, amount: balance });
           totalAssets += balance;
       } else if (balance < 0) {
           liabilities.push({ name, amount: Math.abs(balance) });
           totalLiabilities += Math.abs(balance);
       }
    });

    const difference = totalAssets - totalLiabilities;
    if (difference > 0) {
       liabilities.push({ name: 'Profit & Loss A/c (Net Profit)', amount: difference });
       totalLiabilities += difference;
    } else if (difference < 0) {
       assets.push({ name: 'Profit & Loss A/c (Net Loss)', amount: Math.abs(difference) });
       totalAssets += Math.abs(difference);
    }

    return { 
        assets: assets.sort((a,b) => b.amount - a.amount), 
        liabilities: liabilities.sort((a,b) => b.amount - a.amount), 
        totalAssets, 
        totalLiabilities 
    };
  }, [balanceSheetData]);

  const cashFlowData = useMemo(() => {
    let source = filteredVouchers;
    return source.filter(v => {
      if (v.isSample) return v.sampleSetId === 'cash_flow' && activeSamples?.includes('cash_flow');
      return v.paymentMode || v.type === VoucherType.Receipt || v.type === VoucherType.Payment;
    });
  }, [filteredVouchers, activeSamples]);

  const bankFlowData = useMemo(() => {
    let source = filteredVouchers;
    
    return source.filter(v => {
      // If it's a sample, ONLY include it if it's the specific bank_flow sample
      if (v.isSample) {
        return v.sampleSetId === 'bank_flow' && activeSamples?.includes('bank_flow');
      }
      
      // If it's real data (not a sample), including it if it's bank-related
      // Safety check: ignore IDs that look like our samples
      const id = String(v.id || '');
      const looksLikeSampleId = 
        id.startsWith('bf-') || id.startsWith('bnk-') || id.startsWith('raw-') || 
        id.startsWith('rv-') || id.startsWith('am-') || id.startsWith('mm-') ||
        id.startsWith('uid-') || id.startsWith('tc-') || id.startsWith('rc-');
      if (looksLikeSampleId) return false;

      return v.type === VoucherType.BankStatement || v.origin === 'bank';
    });
  }, [filteredVouchers, activeSamples]);

  const trialBalanceData = useMemo(() => {
    let source = filteredVouchers;
    return source.filter(v => {
      if (v.isSample) return v.sampleSetId === 'trial_balance' && activeSamples?.includes('trial_balance');
      return v.type === VoucherType.Journal;
    });
  }, [filteredVouchers, activeSamples]);

  const trials = trialBalanceData;

  const handleExport = () => {
    let dataToExport = filteredVouchers;
    if (activeTab === 'sales') dataToExport = salesRegister;
    else if (activeTab === 'purchase') dataToExport = purchaseRegister;
    else if (activeTab === 'bs') dataToExport = balanceSheetData;
    else if (activeTab === 'cash_flow') dataToExport = cashFlowData;
    else if (activeTab === 'bank_flow') dataToExport = bankFlowData;
    else if (activeTab === 'trial_balance') dataToExport = trialBalanceData;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(v => ({
      ID: v.id,
      Date: v.date?.value,
      Party: v.partyName?.value || v.narration?.value,
      Amount: v.amount?.value || v.withdrawalAmount?.value || v.depositAmount?.value,
      Type: v.type
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab.toUpperCase());
    XLSX.writeFile(workbook, `Bharat_Book_${activeTab.toUpperCase()}_Report.xlsx`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <DateRangeSelector dateRange={dateRange} onChange={setDateRange} defaultOption="currentFY" />
      </header>

      {/* Report Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-800">
        <div className="flex border-b overflow-x-auto whitespace-nowrap bg-gray-50/50 custom-scrollbar">
          {[
            { id: 'pl', label: 'Profit & Loss', icon: <TrendingUpIcon /> },
            { id: 'bs', label: 'Balance Sheet', icon: <BarChart3 size={16} /> },
            { id: 'cash_flow', label: 'Cash Flow', icon: <BarChart3 size={16} /> },
            { id: 'bank_flow', label: 'Bank Flow', icon: <BarChart3 size={16} /> },
            { id: 'trial_balance', label: 'Trial Balance', icon: <FileText size={16} /> },
            { id: 'sales', label: 'Sales Register', icon: <BarChart3 size={16} /> },
            { id: 'purchase', label: 'Purchase Register', icon: <BarChart3 size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              id={`report-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id as ReportType)}
              className={`flex items-center px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              } dark:bg-gray-800 dark:text-gray-400`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {t(tab.label)}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {activeTab === 'pl' && t('Income Statement (P&L)')}
                {activeTab === 'bs' && t('Balance Sheet (Position Statement)')}
                {activeTab === 'cash_flow' && t('Cash Flow Statement')}
                {activeTab === 'bank_flow' && t('Bank Flow (Statement Analysis)')}
                {activeTab === 'trial_balance' && t('Trial Balance')}
                {activeTab === 'sales' && t('Sales Register')}
                {activeTab === 'purchase' && t('Purchase Register')}
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handleExport}
                  className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300"
                  title="Download Report"
                >
                  <Download size={18} />
                </button>
                <button 
                  onClick={() => window.print()}
                  className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300"
                  title="Print Report"
                >
                  <Printer size={18} />
                </button>
              </div>
          </div>

          {activeTab === 'pl' && <ProfitAndLoss summary={plSummary} />}

          {activeTab === 'sales' && <SalesRegister data={salesRegister} />}
          
          {activeTab === 'purchase' && <PurchaseRegister data={purchaseRegister} />}

          {activeTab === 'bs' && <BalanceSheet summary={bsSummary} />}

          {activeTab === 'cash_flow' && <CashFlow data={cashFlowData} />}
          
          {activeTab === 'bank_flow' && <BankFlow data={bankFlowData} />}
          
          {activeTab === 'trial_balance' && <TrialBalance data={trialBalanceData} />}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
