
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, Printer, Calendar, 
  ArrowRight, BarChart3, List, TrendingUp, History, Clock, AlertTriangle, Layers,
  Tag, Database, MapPin, Box, AlertCircle, ShieldCheck
} from 'lucide-react';
import { ParsedVoucher, VoucherType } from '../../../app/types';
import * as XLSX from 'xlsx';
import { getFiscalYearDates } from '../../../services/aiService';
import { RateAnalysis } from './RateAnalysis';
import { SummaryReport } from './SummaryReport';
import { StockSubPage } from './StockSubPage';
import { DateRangeSelector } from '../../shared/DateRangeSelector';

interface ItemReportViewProps {
  vouchers: ParsedVoucher[];
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
}

type ItemReportTab = 
  | 'summary' | 'analysis' | 'movement' | 'aging' | 'reorder' 
  | 'category' | 'hsn' | 'tax' | 'brand' | 'location' 
  | 'unit' | 'batch' | 'negative' | 'fast_moving' | 'slow_moving' 
  | 'profitability' | 'valuation' | 'top_selling' | 'dead_stock' 
  | 'reconciliation' | 'procurement' | 'price_list' | 'lead_time';

export const ItemReportView: React.FC<ItemReportViewProps> = ({ vouchers, defaultTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<ItemReportTab>((defaultTab as any) || 'analysis');
  const [dateRange, setDateRange] = useState(() => {
    let fmt = 'April to March (Indian Standard)';
    try {
        const stored = localStorage.getItem('bharat_book_app_settings');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.fiscalYear) fmt = parsed.fiscalYear;
        }
    } catch(e) {}
    return getFiscalYearDates(fmt);
  });

  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab as any);
    }
  }, [defaultTab, activeTab]);

  useEffect(() => {
    const scrollToTab = () => {
      const el = document.getElementById(`item-tab-${activeTab}`);
      const container = el?.closest('.overflow-x-auto') as HTMLElement;
      if (el && container) {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        if (cRect.width === 0 || eRect.width === 0) return;
        
        const offset = (eRect.left + eRect.width / 2) - (cRect.left + cRect.width / 2);
        
        // Use scrollBy to shift the view relative to current state
        if (Math.abs(offset) > 2) {
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
      }
    };

    // Attempt scrolling multiple times to allow for rendering/layout shifts
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

  const handleTabChange = (tab: ItemReportTab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      if (v.isSample) {
          const allowedSamples = ['item_vouchers', 'stock_summary', 'item_movement', 'low_stock', 'inventory_valuation'];
          if (!v.sampleSetId || !allowedSamples.includes(v.sampleSetId)) return false;
          return true; // Always include its OWN sample data regardless of date filter
      }
      const date = String(v.date?.value || '');
      if (!dateRange.from && !dateRange.to) return true;
      if (dateRange.from && date < dateRange.from) return false;
      if (dateRange.to && date > dateRange.to) return false;
      return true;
    });
  }, [vouchers, dateRange]);

  const itemRateAnalysis = useMemo(() => {
    const stats: Record<string, {
      name: string;
      lastPurchaseRate: number;
      lastSalesRate: number;
      totalPurchaseVal: number;
      totalPurchaseQty: number;
      totalSalesVal: number;
      totalSalesQty: number;
    }> = {};

    const listToAnalyze = filteredVouchers.length > 0 ? filteredVouchers : vouchers;
    const sorted = [...listToAnalyze].sort((a, b) => String(a.date?.value || '').localeCompare(String(b.date?.value || '')));

    sorted.forEach(v => {
      if (!v.items) return;
      const isPurchase = v.type === VoucherType.Purchase;
      const isSales = v.type === VoucherType.Sales;

      v.items.forEach(item => {
        const name = String(item.name?.value || 'Unknown');
        if (!stats[name]) {
          stats[name] = { 
            name, lastPurchaseRate: 0, lastSalesRate: 0, 
            totalPurchaseVal: 0, totalPurchaseQty: 0, 
            totalSalesVal: 0, totalSalesQty: 0 
          };
        }

        const rate = Number(item.rate?.value || 0);
        const qty = Number(item.quantity?.value || 0);

        if (isPurchase) {
          stats[name].lastPurchaseRate = rate;
          stats[name].totalPurchaseVal += (rate * qty);
          stats[name].totalPurchaseQty += qty;
        } else if (isSales) {
          stats[name].lastSalesRate = rate;
          stats[name].totalSalesVal += (rate * qty);
          stats[name].totalSalesQty += qty;
        }
      });
    });

    return Object.values(stats).map(s => ({
      ...s,
      avgPurchaseRate: s.totalPurchaseQty > 0 ? s.totalPurchaseVal / s.totalPurchaseQty : 0,
      avgSalesRate: s.totalSalesQty > 0 ? s.totalSalesVal / s.totalSalesQty : 0
    }));
  }, [vouchers, dateRange]);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(itemRateAnalysis.map(item => {
        const margin = item.avgSalesRate > 0 ? ((item.avgSalesRate - item.avgPurchaseRate) / item.avgSalesRate) * 100 : 0;
        return {
            "Item Name": item.name,
            "Last Purchase Rate": item.lastPurchaseRate,
            "Avg Purchase Rate": item.avgPurchaseRate,
            "Last Sales Rate": item.lastSalesRate,
            "Avg Sales Rate": item.avgSalesRate,
            "Margin (%)": margin.toFixed(2) + "%"
        };
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ITEM_RATE_ANALYSIS");
    XLSX.writeFile(workbook, `Bharat_Book_Item_Rate_Analysis.xlsx`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <header className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <DateRangeSelector dateRange={dateRange} onChange={setDateRange} defaultOption="currentFY" />
      </header>

      {/* Sub-page Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-800">
        <div className="flex border-b overflow-x-auto whitespace-nowrap bg-gray-50/50 custom-scrollbar">
          {[
            { id: 'summary', label: 'Stock Summary', icon: List },
            { id: 'analysis', label: 'Rate Analysis', icon: TrendingUp },
            { id: 'movement', label: 'Stock Movement', icon: History },
            { id: 'aging', label: 'Stock Aging', icon: Clock },
            { id: 'reorder', label: 'Reorder List', icon: AlertTriangle },
            { id: 'category', label: 'Category View', icon: Layers },
            { id: 'hsn', label: 'HSN/SAC Summary', icon: Tag },
            { id: 'tax', label: 'Tax Rate Wise', icon: Database },
            { id: 'brand', label: 'Brand Analysis', icon: ShieldCheck },
            { id: 'location', label: 'Location View', icon: MapPin },
            { id: 'unit', label: 'Unit Wise', icon: Box },
            { id: 'batch', label: 'Batch Wise', icon: Clock },
            { id: 'negative', label: 'Negative Stock', icon: AlertCircle },
            { id: 'fast_moving', label: 'Fast Moving', icon: TrendingUp },
            { id: 'slow_moving', label: 'Slow Moving', icon: History },
            { id: 'profitability', label: 'Item Profitability', icon: TrendingUp },
            { id: 'valuation', label: 'Stock Valuation', icon: Database },
            { id: 'top_selling', label: 'Top Selling', icon: TrendingUp },
            { id: 'dead_stock', label: 'Dead Stock', icon: AlertCircle },
            { id: 'reconciliation', label: 'Reconciliation', icon: ShieldCheck },
            { id: 'procurement', label: 'Procurement', icon: Box },
            { id: 'price_list', label: 'Price List', icon: Tag },
            { id: 'lead_time', label: 'Lead Time', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              id={`item-tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id as ItemReportTab)}
              className={`flex items-center px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/30' 
                  : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-100/50'
              }`}
            >
              <tab.icon size={14} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 min-h-[400px]">
          {activeTab === 'summary' && (
            <SummaryReport 
              data={itemRateAnalysis} 
              onExport={handleExport} 
            />
          )}

          {activeTab === 'analysis' && (
            <RateAnalysis 
              data={itemRateAnalysis} 
              onExport={handleExport} 
            />
          )}

          {activeTab !== 'analysis' && activeTab !== 'summary' && (
            <StockSubPage 
              title={activeTab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              description={`Detailed inventory analysis and tracking for ${activeTab.replace('_', ' ')}.`}
              onExport={handleExport}
              vouchers={filteredVouchers}
              reportType={activeTab}
            />
          )}

          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-[10px] text-gray-500 italic dark:bg-gray-900 dark:text-gray-400">
            * All data is processed in real-time from your vouchers. Report updates automatically as new data is imported.
          </div>
        </div>
      </div>
    </div>
  );
};
