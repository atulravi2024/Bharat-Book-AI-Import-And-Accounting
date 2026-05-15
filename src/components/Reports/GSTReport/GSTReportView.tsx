
import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, Download, Printer, Calendar, 
  ArrowRight
} from 'lucide-react';
import { ParsedVoucher, VoucherType } from '../../../types';
import * as XLSX from 'xlsx';
import { getFiscalYearDates } from '../../../services/aiService';
import { GSTR1Report } from '../FinancialReport/GSTR1Report';
import { GSTRR1Summary } from './GSTR1/GSTRR1Summary';
import { HSNDetailReport } from './GSTR1/HSNDetailReport';
import { InvoiceDetailReport } from './GSTR1/InvoiceDetailReport';
import { GSTR2BReport } from './GSTR2B/GSTR2BReport';
import { GSTR3BReport } from './GSTR3B/GSTR3BReport';
import { GSTR9Report } from './GSTR9/GSTR9Report';
import { GSTR9CReport } from './GSTR9C/GSTR9CReport';
import { OtherGSTReports } from './Others/OtherGSTReports';

interface GSTReportViewProps {
  vouchers: ParsedVoucher[];
  activeSamples?: string[];
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
}

export const GSTReportView: React.FC<GSTReportViewProps> = ({ vouchers, activeSamples, defaultTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<'filing' | 'summary' | 'invoice_detail' | 'hsn_detail' | 'generate_gst' | 'gstr2b_report' | 'gstr3b_report' | 'gstr9_report' | 'gstr9c_report' | 'others_report'>((defaultTab as any) || 'generate_gst');
  
  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab as any);
    }
  }, [defaultTab, activeTab]);

  useEffect(() => {
    const scrollToTab = () => {
      const el = document.getElementById(`gst-tab-${activeTab}`);
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

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  
  const [quickDateOption, setQuickDateOption] = useState<'currentMonth' | 'lastMonth' | 'currentYear' | 'lastYear' | null>('lastMonth');
  const [selectedReportType, setSelectedReportType] = useState('GSTR-1');
  
  const calculateDates = (option: 'currentMonth' | 'lastMonth' | 'currentYear' | 'lastYear') => {
      const now = new Date();
      let from, to;
      
      const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
      };
      
      switch(option) {
          case 'currentMonth':
              from = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
              to = formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
              break;
          case 'lastMonth':
              from = formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
              to = formatDate(new Date(now.getFullYear(), now.getMonth(), 0));
              break;
          case 'currentYear':
              from = `${now.getFullYear()}-04-01`;
              to = `${now.getFullYear() + 1}-03-31`;
              break;
          case 'lastYear':
              from = `${now.getFullYear() - 1}-04-01`;
              to = `${now.getFullYear()}-03-31`;
              break;
      }
      return { from: from!, to: to! };
  };

  const setQuickDate = (option: 'currentMonth' | 'lastMonth' | 'currentYear' | 'lastYear') => {
      setQuickDateOption(option);
      setDateRange(calculateDates(option));
  };
  
  const [dateRange, setDateRange] = useState(() => {
    return calculateDates('lastMonth');
  });

  useEffect(() => {
      setQuickDate('lastMonth');
  }, []);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      if (v.isSample) return true; // Always include sample data regardless of date filter
      
      if (!dateRange.from && !dateRange.to) return true;
      
      const dateStr = String(v.date?.value || '').trim();
      if (!dateStr) return false;

      let vDate = new Date(dateStr);
      
      // If invalid, try DD-MM-YYYY or DD/MM/YYYY
      if (isNaN(vDate.getTime())) {
          const parts = dateStr.split(/[-/]/);
          if (parts.length === 3) {
             let year = parts[2];
             if (year.length === 2) year = '20' + year; // handle YY
             vDate = new Date(`${year}-${parts[1]}-${parts[0]}`);
          }
      }
      
      if (isNaN(vDate.getTime())) return true; // Keep if we can't parse

      const year = vDate.getFullYear();
      const month = String(vDate.getMonth() + 1).padStart(2, '0');
      const day = String(vDate.getDate()).padStart(2, '0');
      const compareDate = `${year}-${month}-${day}`;
      
      if (dateRange.from && compareDate < dateRange.from) return false;
      if (dateRange.to && compareDate > dateRange.to) return false;
      
      return true;
    });
  }, [vouchers, dateRange]);

  const gstr1Data = useMemo(() => {
    return filteredVouchers.filter(v => {
      if (!v.isSample) return (v.type === VoucherType.Sales || v.type === VoucherType.CreditNote || v.type === VoucherType.DebitNote);
      return v.sampleSetId === 'gstr1' && activeSamples?.includes('gstr1');
    });
  }, [filteredVouchers, activeSamples]);

  const gstr1Summary = useMemo(() => {
    let totalTaxable = 0;
    let totalTax = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalSales = 0;
    
    const hsnMap = new Map<string, any>();
    const taxRateSummary = new Map<number, any>();

    gstr1Data.forEach(v => {
       const isCreditNote = v.type === VoucherType.CreditNote;
       const isDebitNote = v.type === VoucherType.DebitNote;
       const sign = isCreditNote ? -1 : 1;
       
       const hasGstin = !!v.gstin?.value && String(v.gstin.value).trim().length > 0;
       const narrationExplicityB2B = v.narration?.value?.includes('B2B');
       const isB2B = hasGstin || narrationExplicityB2B;
       
       const isB2CL = v.narration?.value?.includes('B2C Large');
       const isB2CS = v.narration?.value?.includes('B2C Small');
       const isExport = v.narration?.value?.includes('Export');
       const isExempt = v.narration?.value?.includes('Exempt');

       let recType = 'B2C Small'; // Default
       if (isExport) recType = 'Export';
       else if (isExempt) recType = 'Exempt';
       else if (isB2B) {
           if (isCreditNote) recType = 'B2B Credit Note';
           else if (isDebitNote) recType = 'B2B Debit Note';
           else recType = 'B2B';
       }
       else if (isB2CL) recType = 'B2C Large';
       else if (isB2CS) recType = 'B2C Small';
       else if (isCreditNote || isDebitNote) recType = 'B2C Small'; 
       else recType = 'B2C Small';
       
       if (v.items && v.items.length > 0) {
           v.items.forEach(item => {
               const qty = Number(item.quantity?.value || 0) * sign;
               const total = Number(item.total?.value || 0) * sign;
               const tax = Number(item.tax?.value || 0) * sign;
               const cgst = Number(item.cgst?.value || 0) * sign;
               const sgst = Number(item.sgst?.value || 0) * sign;
               const igst = Number(item.igst?.value || 0) * sign;
               const taxable = total - tax;
               const hsn = String(item.hsn?.value || 'Unknown');
               const taxRate = Number(item.taxRate?.value || 0);
               
               totalSales += total;
               totalTaxable += taxable;
               totalTax += tax;
               totalCgst += cgst;
               totalSgst += sgst;
               totalIgst += igst;
               
               if (!taxRateSummary.has(taxRate)) {
                   taxRateSummary.set(taxRate, { taxable: 0, tax: 0, cgst: 0, sgst: 0, igst: 0 });
               }
               const trRecord = taxRateSummary.get(taxRate)!;
               trRecord.taxable += taxable;
               trRecord.tax += tax;
               trRecord.cgst += cgst;
               trRecord.sgst += sgst;
               trRecord.igst += igst;

               const hsnKey = `${hsn}_${recType}`;

               if (!hsnMap.has(hsnKey)) {
                   hsnMap.set(hsnKey, {
                       hsn: hsn,
                       type: recType,
                       uom: String(item.uom?.value || 'NOS'),
                       desc: String(item.name?.value || ''),
                       qty: 0,
                       taxable: 0,
                       tax: 0,
                       cgst: 0,
                       sgst: 0,
                       igst: 0,
                       taxRate: taxRate
                   });
               }
               const record = hsnMap.get(hsnKey)!;
               record.qty += qty;
               record.taxable += taxable;
               record.tax += tax;
               record.cgst += cgst;
               record.sgst += sgst;
               record.igst += igst;
           });
       } else {
            const total = Number(v.amount?.value || 0) * sign;
            const tax = total - (total / 1.18);
            const taxable = total - tax;
            totalSales += total;
            totalTaxable += taxable;
            totalTax += tax;
            let vCgst = 0, vSgst = 0, vIgst = 0;
            if (v.partyName?.value?.includes('Inter-state') || v.narration?.value?.includes('Inter-state') || v.narration?.value?.includes('IGST') || v.narration?.value?.includes('Export')) {
                totalIgst += tax;
                vIgst = tax;
            } else {
                totalCgst += tax / 2;
                totalSgst += tax / 2;
                vCgst = tax / 2;
                vSgst = tax / 2;
            }
            const fallbackTr = tax > 0 ? 18 : 0;
            if (!taxRateSummary.has(fallbackTr)) {
                taxRateSummary.set(fallbackTr, { taxable: 0, tax: 0, cgst: 0, sgst: 0, igst: 0 });
            }
            const fbRc = taxRateSummary.get(fallbackTr)!;
            fbRc.taxable += taxable;
            fbRc.tax += tax;
            fbRc.cgst += vCgst;
            fbRc.sgst += vSgst;
            fbRc.igst += vIgst;
        }
    });

    return {
        totalSales,
        totalTaxable,
        totalTax,
        totalCgst,
        totalSgst,
        totalIgst,
        totalInvoices: gstr1Data.length,
        hsnData: Array.from(hsnMap.values()),
        groupedHsnData: Array.from(hsnMap.values()).reduce((acc, hsn) => {
            let key = hsn.type;
            if (key === 'B2C Large' || key === 'B2C Small' || key === 'B2C') key = 'B2C';
            if (!acc[key]) acc[key] = [];
            acc[key].push(hsn);
            return acc;
        }, {} as Record<string, Array<any>>),
        taxRateData: Array.from(taxRateSummary.entries()).map(([rate, data]) => ({ rate, ...data })).sort((a,b) => a.rate - b.rate),
        groupedInvoices: gstr1Data.reduce((acc, v) => {
            const isCreditNote = v.type === VoucherType.CreditNote;
            const isDebitNote = v.type === VoucherType.DebitNote;
            
            const hasGstin = !!v.gstin?.value && String(v.gstin.value).trim().length > 0;
            const isB2B = hasGstin || v.narration?.value?.includes('B2B');
            const isB2CL = v.narration?.value?.includes('B2C Large');
            const isB2CS = v.narration?.value?.includes('B2C Small');
            const isExport = v.narration?.value?.includes('Export');
            const isExempt = v.narration?.value?.includes('Exempt');

            let typeStr = 'B2C Small';
            if (isExport) typeStr = 'Export';
            else if (isExempt) typeStr = 'Exempt';
            else if (isB2B) {
                if (isCreditNote) typeStr = 'B2B Credit Note';
                else if (isDebitNote) typeStr = 'B2B Debit Note';
                else typeStr = 'B2B';
            }
            else if (isB2CL) typeStr = 'B2C Large';
            else if (isB2CS) typeStr = 'B2C Small';
            else if (isCreditNote || isDebitNote) typeStr = 'B2C Small';
            else typeStr = 'B2C Small';

            if (!acc[typeStr]) acc[typeStr] = [];
            acc[typeStr].push(v);
            return acc;
        }, {} as Record<string, ParsedVoucher[]>)
    };
  }, [gstr1Data]);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(gstr1Data.map(v => ({
      ID: v.id,
      Date: v.date?.value,
      'Invoice No': v.invoiceNumber?.value,
      Party: v.partyName?.value || v.narration?.value,
      Amount: v.amount?.value,
      Type: v.type
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'GSTR-1');
    XLSX.writeFile(workbook, `Bharat_Book_GST_Report.xlsx`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 font-display dark:text-white">Statutory GST Hub</h1>
        <p className="text-gray-500 mt-2 font-medium dark:text-gray-400">Generate compliance-ready GSTR reports and monitor tax liabilities.</p>
      </header>
      <header className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <div className="flex bg-white dark:bg-gray-800 items-center p-1 md:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none w-fit">
           <div className="flex items-center px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-nowrap">
               <Calendar size={14} className="mr-1.5 text-gray-400 hidden sm:block" />
               {quickDateOption === 'currentMonth' ? 'Current Month' :
                quickDateOption === 'lastMonth' ? 'Last Month' :
                quickDateOption === 'currentYear' ? 'Current Year' :
                quickDateOption === 'lastYear' ? 'Last Year' :
                'Custom Period'}
           </div>
           <div className="flex items-center px-2">
             <input
              type="date"
              className="text-[10px] sm:text-xs font-medium outline-none text-gray-700 dark:text-gray-300 bg-transparent cursor-pointer"
              value={dateRange.from}
              onChange={e => {
                  setQuickDateOption(null);
                  setDateRange(prev => ({ ...prev, from: e.target.value }));
              }}
             />
             <span className="mx-1 sm:mx-2 text-gray-300">-</span>
             <input 
              type="date" 
              className="text-[10px] sm:text-xs font-medium outline-none text-gray-700 bg-transparent cursor-pointer dark:text-gray-200" 
              value={dateRange.to}
              onChange={e => {
                  setQuickDateOption(null);
                  setDateRange(prev => ({ ...prev, to: e.target.value }));
              }}
             />
           </div>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 dark:bg-gray-800 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 flex items-center dark:text-gray-100">
                <FileText className="mr-2 text-blue-600" size={20} />
                {activeTab === 'summary' && 'GSTR1 Summary'}
                {activeTab === 'filing' && 'GSTR-1 Filing'}
                {activeTab === 'invoice_detail' && 'GSTR1 Invoices'}
                {activeTab === 'hsn_detail' && 'GSTR1 HSN'}
                {activeTab === 'gstr2b_report' && 'GSTR-2B Report'}
                {activeTab === 'gstr3b_report' && 'GSTR-3B Report'}
                {activeTab === 'gstr9_report' && 'GSTR-9 Report'}
                {activeTab === 'gstr9c_report' && 'GSTR-9C Report'}
                {activeTab === 'others_report' && 'Other GST Reports'}
                {activeTab === 'generate_gst' && 'Generate GST Report'}
              </h2>
              <div className="flex bg-gray-100 p-1 rounded-lg mt-3 w-full gap-1 overflow-x-auto custom-scrollbar dark:bg-gray-800">
                <button 
                    id="gst-tab-generate_gst"
                    onClick={() => handleTabChange('generate_gst')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'generate_gst' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    Generate GST
                </button>
                <button 
                    id="gst-tab-summary"
                    onClick={() => handleTabChange('summary')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    GSTR1 Summary
                </button>
                <button 
                    id="gst-tab-filing"
                    onClick={() => handleTabChange('filing')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'filing' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    GSTR1 Filing
                </button>
                <button 
                    id="gst-tab-invoice_detail"
                    onClick={() => handleTabChange('invoice_detail')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'invoice_detail' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    GSTR1 Invoice
                </button>
                <button 
                    id="gst-tab-hsn_detail"
                    onClick={() => handleTabChange('hsn_detail')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'hsn_detail' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    GSTR1 HSN
                </button>
                <button 
                    id="gst-tab-gstr2b_report"
                    onClick={() => handleTabChange('gstr2b_report')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr2b_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    GSTR-2B
                </button>
                <button 
                    id="gst-tab-gstr3b_report"
                    onClick={() => handleTabChange('gstr3b_report')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr3b_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    GSTR-3B
                </button>
                <button 
                    id="gst-tab-gstr9_report"
                    onClick={() => handleTabChange('gstr9_report')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr9_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    GSTR-9
                </button>
                <button 
                    id="gst-tab-gstr9c_report"
                    onClick={() => handleTabChange('gstr9c_report')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr9c_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    GSTR-9C
                </button>
                <button 
                    id="gst-tab-others_report"
                    onClick={() => handleTabChange('others_report')}
                    className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'others_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    Others
                </button>
              </div>
            </div>
            <div className="flex space-x-2 self-start md:self-center">
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

        {activeTab === 'filing' && <GSTR1Report summary={gstr1Summary} />}
        {activeTab === 'summary' && <GSTRR1Summary summary={gstr1Summary} />}
        {activeTab === 'invoice_detail' && <InvoiceDetailReport vouchers={gstr1Data} />}
        {activeTab === 'hsn_detail' && <HSNDetailReport summary={gstr1Summary} />}
        {activeTab === 'gstr2b_report' && <GSTR2BReport useSampleData={!!activeSamples?.includes('gstr2b')} onToggleSampleData={() => {}} />}
        {activeTab === 'gstr3b_report' && <GSTR3BReport useSampleData={!!activeSamples?.includes('gstr3b')} onToggleSampleData={() => {}} />}
        {activeTab === 'gstr9_report' && <GSTR9Report useSampleData={!!activeSamples?.includes('gstr9')} onToggleSampleData={() => {}} />}
        {activeTab === 'gstr9c_report' && <GSTR9CReport useSampleData={!!activeSamples?.includes('gstr9c')} onToggleSampleData={() => {}} />}
        {activeTab === 'others_report' && <OtherGSTReports useSampleData={!!activeSamples?.includes('others')} onToggleSampleData={() => {}} />}
        {activeTab === 'generate_gst' && (
          <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 dark:bg-gray-900 dark:border-gray-600">
            <div className="mb-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Generate GST Report</h3>
            </div>
            <select
                value={quickDateOption || ''}
                onChange={(e) => {
                    if (e.target.value) {
                         setQuickDate(e.target.value as any);
                    }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 block dark:border-gray-700 dark:bg-gray-800"
            >
                <option value="">Select Period</option>
                <option value="currentMonth">Current Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="currentYear">Current Year</option>
                <option value="lastYear">Last Year</option>
            </select>
            <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 block dark:border-gray-700 dark:bg-gray-800"
            >
                <option value="GSTR-1">GSTR-1</option>
                <option value="GSTR-2B">GSTR-2B</option>
                <option value="GSTR-3B">GSTR-3B</option>
                <option value="GSTR-9">GSTR-9</option>
                <option value="GSTR-9C">GSTR-9C</option>
                <option value="others">Others</option>
            </select>
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button 
                  onClick={() => {
                      if (selectedReportType === 'GSTR-1') setActiveTab('summary');
                      else if (selectedReportType === 'GSTR-2B') setActiveTab('gstr2b_report');
                      else if (selectedReportType === 'GSTR-3B') setActiveTab('gstr3b_report');
                      else if (selectedReportType === 'GSTR-9') setActiveTab('gstr9_report');
                      else if (selectedReportType === 'GSTR-9C') setActiveTab('gstr9c_report');
                      else if (selectedReportType === 'others') setActiveTab('others_report');
                  }}
                  className="px-2 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 truncate"
              >
                  View
              </button>
              <button 
                  onClick={handleExport}
                  className="px-2 py-2 bg-gray-800 text-white rounded-lg font-bold text-xs hover:bg-gray-900 truncate"
              >
                  Export
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4 dark:text-gray-400">Generate GST filing reports based on the selected period and company criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
