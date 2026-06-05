import { useLanguage } from '../../../context/LanguageContext';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, Download, Printer, Calendar, 
  ArrowRight
} from 'lucide-react';
import { ParsedVoucher, VoucherType } from '../../../app/types';
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
import { ComplianceRegistries } from './ComplianceRegistries';
import { CMP08Report } from './Composition/CMP08/CMP08Report';
import { GSTR4Report } from './Composition/GSTR4/GSTR4Report';
import { GSTR4AReport } from './Composition/GSTR4A/GSTR4AReport';
import { CMP02Report } from './Composition/CMP02/CMP02Report';
import { CMP04Report } from './Composition/CMP04/CMP04Report';
import { CompositionGuidelines } from './Composition/Guidelines/CompositionGuidelines';
import { RegularGuidelines } from './Regular/Guidelines';
import { GSTSummary } from './GSTSummary';
import { DateRangeSelector, calculateDateRange, DateRangeOption } from '../../shared/DateRangeSelector';

interface GSTReportViewProps {
  vouchers: ParsedVoucher[];
  activeSamples?: string[];
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
}

export const GSTReportView: React.FC<GSTReportViewProps> = ({ vouchers, activeSamples, defaultTab, onTabChange }) => {
  const { t, formatNumber  } = useLanguage();

  const [activeTab, setActiveTab] = useState<'filing' | 'summary' | 'gst_summary' | 'invoice_detail' | 'hsn_detail' | 'generate_gst' | 'gstr2b_report' | 'gstr3b_report' | 'gstr9_report' | 'gstr9c_report' | 'cmp08_report_tab' | 'gstr4_report_tab' | 'gstr4a_report_tab' | 'cmp02_report_tab' | 'cmp04_report_tab' | 'composition_rules_tab' | 'regular_rules_tab' | 'compliance_registries_tab' | 'others_report'>((defaultTab as any) || 'generate_gst');
  
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
  
  const [quickDateOption, setQuickDateOption] = useState<DateRangeOption>('lastMonth');
  const [selectedReportType, setSelectedReportType] = useState('GSTR-1');
  
  const [dateRange, setDateRange] = useState(() => calculateDateRange('lastMonth'));

  useEffect(() => {
      setDateRange(calculateDateRange('lastMonth'));
      setQuickDateOption('lastMonth');
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
       const narrationStr = String(v.narration?.value || '');
       const narrationExplicityB2B = narrationStr.includes('B2B');
       const isB2B = hasGstin || narrationExplicityB2B;
       
       const isB2CL = narrationStr.includes('B2C Large');
       const isB2CS = narrationStr.includes('B2C Small');
       const isExport = narrationStr.includes('Export');
       const isExempt = narrationStr.includes('Exempt');

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
            const pNameStr = String(v.partyName?.value || '');
            const narrStr = String(v.narration?.value || '');
            if (pNameStr.includes('Inter-state') || narrStr.includes('Inter-state') || narrStr.includes('IGST') || narrStr.includes('Export')) {
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
            const narrStr = String(v.narration?.value || '');
            const isB2B = hasGstin || narrStr.includes('B2B');
            const isB2CL = narrStr.includes('B2C Large');
            const isB2CS = narrStr.includes('B2C Small');
            const isExport = narrStr.includes('Export');
            const isExempt = narrStr.includes('Exempt');

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
      <header className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <DateRangeSelector dateRange={dateRange} onChange={setDateRange} defaultOption="lastMonth" />
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-800 print-area">
        <div className="mb-6 w-full min-w-0 no-print">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center dark:text-gray-100">
                    <FileText className="mr-2 text-blue-600" size={20} />
                    {activeTab === 'summary' && t('GSTR1 Summary')}
                    {activeTab === 'gst_summary' && t('GST Summary')}
                    {activeTab === 'filing' && t('GSTR-1 Filing')}
                    {activeTab === 'invoice_detail' && t('GSTR1 Invoices')}
                    {activeTab === 'hsn_detail' && t('GSTR1 HSN')}
                    {activeTab === 'gstr2b_report' && t('GSTR-2B Report')}
                    {activeTab === 'gstr3b_report' && t('GSTR-3B Report')}
                    {activeTab === 'gstr9_report' && t('GSTR-9 Report')}
                    {activeTab === 'gstr9c_report' && t('GSTR-9C Report')}
                    {activeTab === 'cmp08_report_tab' && t('Form GST CMP-08')}
                    {activeTab === 'gstr4_report_tab' && t('Form GSTR-4 (Annual)')}
                    {activeTab === 'gstr4a_report_tab' && t('Form GSTR-4A (Inward)')}
                    {activeTab === 'cmp02_report_tab' && t('Form GST CMP-02 (Opt-In)')}
                    {activeTab === 'cmp04_report_tab' && t('Form GST CMP-04 (Opt-Out)')}
                    {activeTab === 'composition_rules_tab' && t('Composition Scheme Rules')}
                    {activeTab === 'regular_rules_tab' && t('Regular Taxpayer Rules')}
                    {activeTab === 'compliance_registries_tab' && t('Auxiliary Compliance Registries')}
                    {activeTab === 'generate_gst' && t('Generate GST Report')}
                  </h2>
                  <div className="flex space-x-2 self-start md:self-center">
                    <button 
                      onClick={handleExport}
                      className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                      title="Download Report"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.currentTarget.blur(); setTimeout(() => window.print(), 100); }}
                      className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                      title="Print Report"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-lg mt-3 w-full gap-1 overflow-x-auto custom-scrollbar dark:bg-gray-800">
                <button 
                    id="gst-tab-generate_gst"
                    onClick={() => handleTabChange('generate_gst')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'generate_gst' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('Generate GST')}
                </button>
                <button 
                    id="gst-tab-gst_summary"
                    onClick={() => handleTabChange('gst_summary')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gst_summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GST Summary')}
                </button>
                <button 
                    id="gst-tab-summary"
                    onClick={() => handleTabChange('summary')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR1 Summary')}
                </button>
                <button 
                    id="gst-tab-filing"
                    onClick={() => handleTabChange('filing')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'filing' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR1 Filing')}
                </button>
                <button 
                    id="gst-tab-invoice_detail"
                    onClick={() => handleTabChange('invoice_detail')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'invoice_detail' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR1 Invoice')}
                </button>
                <button 
                    id="gst-tab-hsn_detail"
                    onClick={() => handleTabChange('hsn_detail')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'hsn_detail' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR1 HSN')}
                </button>
                <button 
                    id="gst-tab-gstr2b_report"
                    onClick={() => handleTabChange('gstr2b_report')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr2b_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR-2B')}
                </button>
                <button 
                    id="gst-tab-gstr3b_report"
                    onClick={() => handleTabChange('gstr3b_report')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr3b_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR-3B')}
                </button>
                <button 
                    id="gst-tab-gstr9_report"
                    onClick={() => handleTabChange('gstr9_report')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr9_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR-9')}
                </button>
                <button 
                    id="gst-tab-gstr9c_report"
                    onClick={() => handleTabChange('gstr9c_report')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr9c_report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR-9C')}
                </button>
                <button 
                    id="gst-tab-cmp08_report_tab"
                    onClick={() => handleTabChange('cmp08_report_tab')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'cmp08_report_tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('CMP-08')}
                </button>
                <button 
                    id="gst-tab-gstr4_report_tab"
                    onClick={() => handleTabChange('gstr4_report_tab')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr4_report_tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR-4')}
                </button>
                <button 
                    id="gst-tab-gstr4a_report_tab"
                    onClick={() => handleTabChange('gstr4a_report_tab')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'gstr4a_report_tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('GSTR-4A')}
                </button>
                <button 
                    id="gst-tab-cmp02_report_tab"
                    onClick={() => handleTabChange('cmp02_report_tab')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'cmp02_report_tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('CMP-02')}
                </button>
                <button 
                    id="gst-tab-cmp04_report_tab"
                    onClick={() => handleTabChange('cmp04_report_tab')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'cmp04_report_tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('CMP-04')}
                </button>
                <button 
                    id="gst-tab-composition_rules_tab"
                    onClick={() => handleTabChange('composition_rules_tab')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'composition_rules_tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('Composition Rules')}
                </button>
                <button 
                    id="gst-tab-regular_rules_tab"
                    onClick={() => handleTabChange('regular_rules_tab')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'regular_rules_tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('Regular Rules')}
                </button>
                <button 
                    id="gst-tab-compliance_registries_tab"
                    onClick={() => handleTabChange('compliance_registries_tab')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'compliance_registries_tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
                >
                    {t('Compliance Registries')}
                </button>
              </div>
            </div>
        </div>

        {activeTab === 'gst_summary' && <GSTSummary vouchers={filteredVouchers} />}
        {activeTab === 'filing' && <GSTR1Report summary={gstr1Summary} />}
        {activeTab === 'summary' && <GSTRR1Summary summary={gstr1Summary} />}
        {activeTab === 'invoice_detail' && <InvoiceDetailReport vouchers={gstr1Data} />}
        {activeTab === 'hsn_detail' && <HSNDetailReport summary={gstr1Summary} />}
        {activeTab === 'gstr2b_report' && <GSTR2BReport useSampleData={activeSamples ? activeSamples.includes('gstr2b') || true : true} onToggleSampleData={() => {}} />}
        {activeTab === 'gstr3b_report' && <GSTR3BReport useSampleData={activeSamples ? activeSamples.includes('gstr3b') || true : true} onToggleSampleData={() => {}} />}
        {activeTab === 'gstr9_report' && <GSTR9Report useSampleData={activeSamples ? activeSamples.includes('gstr9') || true : true} onToggleSampleData={() => {}} />}
        {activeTab === 'gstr9c_report' && <GSTR9CReport useSampleData={activeSamples ? activeSamples.includes('gstr9c') || true : true} onToggleSampleData={() => {}} />}
        {activeTab === 'cmp08_report_tab' && <CMP08Report useSampleData={activeSamples ? activeSamples.includes('others') || true : true} />}
        {activeTab === 'gstr4_report_tab' && <GSTR4Report useSampleData={activeSamples ? activeSamples.includes('others') || true : true} />}
        {activeTab === 'gstr4a_report_tab' && <GSTR4AReport useSampleData={activeSamples ? activeSamples.includes('others') || true : true} />}
        {activeTab === 'cmp02_report_tab' && <CMP02Report useSampleData={activeSamples ? activeSamples.includes('others') || true : true} />}
        {activeTab === 'cmp04_report_tab' && <CMP04Report useSampleData={activeSamples ? activeSamples.includes('others') || true : true} />}
        {activeTab === 'composition_rules_tab' && <CompositionGuidelines useSampleData={activeSamples ? activeSamples.includes('others') || true : true} />}
        {activeTab === 'regular_rules_tab' && <RegularGuidelines useSampleData={activeSamples ? activeSamples.includes('others') || true : true} />}
        {activeTab === 'compliance_registries_tab' && <ComplianceRegistries useSampleData={activeSamples ? activeSamples.includes('others') || true : true} />}
        {activeTab === 'generate_gst' && (
          <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 dark:bg-gray-900 dark:border-gray-600">
            <div className="mb-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{t("Generate GST Report")}</h3>
            </div>
            <select
                value={quickDateOption || ''}
                onChange={(e) => {
                    if (e.target.value) {
                         const option = e.target.value as DateRangeOption;
                         setDateRange(calculateDateRange(option));
                         setQuickDateOption(option);
                    }
                }}
                className="form-input text-xs font-bold mb-4 block"
            >
                <option value="">{t("Select Period")}</option>
                <option value="currentMonth">{t("Current Month")}</option>
                <option value="lastMonth">{t("Last Month")}</option>
                <option value="currentYear">{t("Current Year")}</option>
                <option value="lastYear">{t("Last Year")}</option>
            </select>
            <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="form-input text-xs font-bold mb-6 block"
            >
                <option value="GSTR-1">{t("GSTR-1")}</option>
                <option value="GSTR-2B">{t("GSTR-2B")}</option>
                <option value="GSTR-3B">{t("GSTR-3B")}</option>
                <option value="GSTR-9">{t("GSTR-9")}</option>
                <option value="GSTR-9C">{t("GSTR-9C")}</option>
                <option value="cmp08">{t("Form GST CMP-08")}</option>
                <option value="gstr4">{t("Form GSTR-4 (Annual)")}</option>
                <option value="gstr4a">{t("Form GSTR-4A (Inward)")}</option>
                <option value="cmp02">{t("Form GST CMP-02 (Opt-In)")}</option>
                <option value="cmp04">{t("Form GST CMP-04 (Opt-Out)")}</option>
                <option value="comprules">{t("Composition Guidelines")}</option>
                <option value="regrules">{t("Regular Guidelines")}</option>
                <option value="others">{t("Others")}</option>
            </select>
            <div className="form-grid gap-2 mb-6">
              <button 
                  onClick={() => {
                      if (selectedReportType === 'GSTR-1') setActiveTab('summary');
                      else if (selectedReportType === 'GSTR-2B') setActiveTab('gstr2b_report');
                      else if (selectedReportType === 'GSTR-3B') setActiveTab('gstr3b_report');
                      else if (selectedReportType === 'GSTR-9') setActiveTab('gstr9_report');
                      else if (selectedReportType === 'GSTR-9C') setActiveTab('gstr9c_report');
                      else if (selectedReportType === 'cmp08') setActiveTab('cmp08_report_tab');
                      else if (selectedReportType === 'gstr4') setActiveTab('gstr4_report_tab');
                      else if (selectedReportType === 'gstr4a') setActiveTab('gstr4a_report_tab');
                      else if (selectedReportType === 'cmp02') setActiveTab('cmp02_report_tab');
                      else if (selectedReportType === 'cmp04') setActiveTab('cmp04_report_tab');
                      else if (selectedReportType === 'comprules') setActiveTab('composition_rules_tab');
                      else if (selectedReportType === 'regrules') setActiveTab('regular_rules_tab');
                      else if (selectedReportType === 'others') setActiveTab('others_report');
                  }}
                  className="px-2 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 truncate"
              >
                  {t('View')}
              </button>
              <button 
                  onClick={handleExport}
                  className="px-2 py-2 bg-gray-800 text-white rounded-lg font-bold text-xs hover:bg-gray-900 truncate"
              >{t("Export")}</button>
            </div>

            <p className="text-sm text-gray-500 mt-4 dark:text-gray-400">{t("Generate GST filing reports based on the selected period and company criteria.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
