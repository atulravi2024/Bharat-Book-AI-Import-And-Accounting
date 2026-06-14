import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  Percent, ShieldCheck, CheckCircle2, Coins, Calculator, FileText, Download, Printer
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Import local types
import { TdsClaimRecord, TaxRegime, TaxTab } from './types';

// Import subpage component views
import { AdvanceTaxPlanner } from './views/AdvanceTaxPlanner';
import { TdsLedgerView } from './views/TdsLedgerView';
import { TaxProjectionEngine } from './views/TaxProjectionEngine';
import { TdsTcsCalculator } from './views/TdsTcsCalculator';
import { PresumptiveTaxPlanner } from './views/PresumptiveTaxPlanner';
import { DepreciationPlanner } from './views/DepreciationPlanner';
import { ComplianceTracker } from './views/ComplianceTracker';
import { TaxLossTracker } from './views/TaxLossTracker';
import { LUTApplication } from './LUTApplication';
import { ELedgerSimulator } from './ELedgerSimulator';
import { KpiDashboardView } from './views/KpiDashboardView';
import { WorkspaceInfoView } from './views/WorkspaceInfoView';

export interface TaxReportViewProps {
  defaultTab?: string | null;
  onTabChange?: (tab: any) => void;
}

export const TaxReportView: React.FC<TaxReportViewProps> = ({ defaultTab, onTabChange }) => {
  const { t, formatNumber } = useLanguage();

  // Selection states
  const [assessmentYear, setAssessmentYear] = useState('2026-27');
  const [activeTabState, setActiveTabState] = useState<TaxTab>('kpis');
  const activeTab = (defaultTab as TaxTab) || activeTabState;
  const setActiveTab = (tab: TaxTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setActiveTabState(tab);
    }
  };

  const [hiddenReports, setHiddenReports] = useState<string[]>([]);

  useEffect(() => {
    const loadHidden = () => {
      const stored = localStorage.getItem("bharat_book_hidden_report_tabs");
      if (stored) {
        try {
          setHiddenReports(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setHiddenReports([]);
      }
    };
    loadHidden();
    window.addEventListener("bharat_book_report_tabs_trigger", loadHidden);
    return () => {
      window.removeEventListener("bharat_book_report_tabs_trigger", loadHidden);
    };
  }, []);

  const taxTabs = [
    { id: 'kpis', label: 'Tax KPIs' },
    { id: 'advance-tax', label: 'Advance Tax' },
    { id: 'tds-ledger', label: 'TDS Ledger' },
    { id: 'tax-projection', label: 'Projections' },
    { id: 'tds-tcs-calculator', label: 'TDS/TCS Calc' },
    { id: 'presumptive-tax', label: 'Presumptive Tax' },
    { id: 'depreciation-schedule', label: 'Depreciation' },
    { id: 'compliance-tracker', label: 'Expense Audit' },
    { id: 'tax-loss-tracker', label: 'Loss Set-Off' },
    { id: 'lut-application', label: 'LUT Application' },
    { id: 'eledger-simulator', label: 'e-Ledger Sim' },
    { id: 'info', label: 'Workspace Guide' },
  ];

  const visibleTaxTabs = taxTabs.filter(t => !hiddenReports.includes(`tax_${t.id}`));

  useEffect(() => {
    if (visibleTaxTabs.length > 0 && !visibleTaxTabs.some(t => t.id === activeTab)) {
      setActiveTab(visibleTaxTabs[0].id as TaxTab);
    }
  }, [visibleTaxTabs, activeTab]);

  // Projection States (kept in sync in parent so metrics remain dynamically reactive!)
  const [salesRevenue, setSalesRevenue] = useState<number>(45000000);
  const [otherIncome, setOtherIncome] = useState<number>(1200005);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(31500000);
  const [depreciationSec32, setDepreciationSec32] = useState<number>(1800000);
  const [deductionsUnderVI, setDeductionsUnderVI] = useState<number>(450000);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>('sec115baa'); // corporate tax flat rate Section 115BAA

  // Direct Tax TDS claims records
  const [tdsRecords] = useState<TdsClaimRecord[]>([
    { id: 'TDS-001', tan: 'MUMB12024E', deductor: 'BHARAT BOOK EXPORTS DIRECT', section: '194Q', rate: 1.0, baseAmount: 18500000, taxAmount: 185000, status: 'Matched', date: '2026-05-18' },
    { id: 'TDS-002', tan: 'DELH78921A', deductor: 'MACMILLAN EDUCATION ASIA', section: '194C', rate: 2.0, baseAmount: 4200000, taxAmount: 84000, status: 'Matched', date: '2026-05-24' },
    { id: 'TDS-003', tan: 'BLR34900B2', deductor: 'OXFORD UNIVERSITY PRESS REIMB', section: '194J', rate: 10.0, baseAmount: 2500000, taxAmount: 250000, status: 'Pending Verification', date: '2026-06-02' },
    { id: 'TDS-004', tan: 'PUNE98177D', deductor: 'TATA MCGRAW HILL ACQUISITION', section: '194Q', rate: 1.0, baseAmount: 12100000, taxAmount: 121000, status: 'Matched', date: '2026-06-04' },
  ]);

  // Reactive calculations
  const grossProfit = salesRevenue + otherIncome;
  const netOperatingProfit = grossProfit - operatingExpenses - depreciationSec32;
  const netTaxableIncome = Math.max(0, netOperatingProfit - deductionsUnderVI);

  // Corporate Rates Effective Flat: Sec 115BAA choice flat 22% rate + 10% surcharge + 4% cess = 25.168% effective
  const taxRatePercent = taxRegime === 'sec115baa' ? 25.168 : 31.20; // Regular rate flat of 30% plus cess/surcharges = ~31.2%
  const totalTaxComputed = (netTaxableIncome * taxRatePercent) / 100;
  
  // Tax Paid under TDS/TCS (matched values offset)
  const matchedTdsTotal = tdsRecords
    .filter(r => r.status === 'Matched')
    .reduce((sum, r) => sum + r.taxAmount, 0);

  const outstandingAdvanceTax = Math.max(0, totalTaxComputed - matchedTdsTotal);

  const handleExport = () => {
    // Export TDS Records for auditing or Projections summary
    const worksheet = XLSX.utils.json_to_sheet(tdsRecords.map(r => ({
      ID: r.id,
      Deductor: r.deductor,
      TAN: r.tan,
      Section: r.section,
      Rate: `${r.rate}%`,
      'Base Amount': r.baseAmount,
      'Tax Amount': r.taxAmount,
      Status: r.status,
      'Filing Date': r.date
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TDS Records');
    
    // Add another sheet with projections
    const projData = [
      { Metric: 'Projected Revenue/Sales', Value: salesRevenue },
      { Metric: 'Other Business Income', Value: otherIncome },
      { Metric: 'Operating Expenses', Value: operatingExpenses },
      { Metric: 'Sec 32 Depreciation Allowance', Value: depreciationSec32 },
      { Metric: 'Total Gross Profit', Value: grossProfit },
      { Metric: 'Net Operating Profit', Value: netOperatingProfit },
      { Metric: 'Net Taxable Income', Value: netTaxableIncome },
      { Metric: 'Active Tax Regime', Value: taxRegime === 'sec115baa' ? 'Section 115BAA (25.168%)' : 'Regular Corporate Rate (31.20%)' },
      { Metric: 'Total Tax Computed', Value: totalTaxComputed },
      { Metric: 'TDS matched credit offset', Value: matchedTdsTotal },
      { Metric: 'Net Outstanding Advance Tax', Value: outstandingAdvanceTax },
    ];
    const projSheet = XLSX.utils.json_to_sheet(projData);
    XLSX.utils.book_append_sheet(workbook, projSheet, 'Corporate Tax Projections');

    XLSX.writeFile(workbook, `Bharat_Book_Tax_Report_${assessmentYear}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 p-4 sm:p-6" id="tax-report-root">
      
      {/* Premium Header - Compact Design */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm dark:bg-gray-800 dark:border-gray-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-gray-800 flex items-center dark:text-gray-100 uppercase tracking-wider font-sans">
            <Percent className="mr-2 text-blue-600 animate-pulse" size={18} />
            {t("Corporate Tax Center")}
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <label className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-450 tracking-wider">{t("Assessment Period:")}</label>
          <select 
            value={assessmentYear} 
            onChange={(e) => setAssessmentYear(e.target.value)}
            className="text-xs font-bold border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:border-blue-500 text-gray-800 dark:bg-gray-901 dark:border-gray-700 dark:text-gray-200 outline-hidden cursor-pointer"
          >
            <option value="2026-27">AY 2026-27 (FY 2025-26)</option>
            <option value="2027-28">AY 2027-28 (FY 2026-27)</option>
          </select>
        </div>
      </div>

      {/* Modern Card Container replicating GSTReport layout & structure */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 dark:bg-gray-800 dark:border-gray-800 print-area">
        <div className="mb-6 w-full min-w-0 no-print">
          <div className="flex flex-col min-w-0 flex-1">
            {/* Header Title reflecting active child view & prints controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center dark:text-gray-100">
                <FileText className="mr-2 text-blue-600" size={20} />
                {activeTab === 'kpis' && t('Tax Analytics Dashboard')}
                {activeTab === 'advance-tax' && t('Advance Corporate Tax Planner')}
                {activeTab === 'tds-ledger' && t('Direct TDS Matching Ledger')}
                {activeTab === 'tax-projection' && t('Interactive Income Projection Engine')}
                {activeTab === 'tds-tcs-calculator' && t('TDS / TCS Liabilities Calculator')}
                {activeTab === 'presumptive-tax' && t('Presumptive Taxation Scheduler')}
                {activeTab === 'depreciation-schedule' && t('Section 32 Asset Depreciation Schedule')}
                {activeTab === 'compliance-tracker' && t('Direct Tax Disallowance Compliance Auditor')}
                {activeTab === 'tax-loss-tracker' && t('Carry Forward & Loss Set-Off Ledgers')}
                {activeTab === 'lut-application' && t('RFD-11 Letter of Undertaking')}
                {activeTab === 'eledger-simulator' && t('e-Ledger Sandbox Console')}
                {activeTab === 'info' && t('Regulatory Workspace Guidelines')}
              </h3>
              <div className="flex space-x-2 self-start md:self-center">
                <button 
                  onClick={handleExport}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 cursor-pointer"
                  title="Download Reports Ledger"
                >
                  <Download size={18} />
                </button>
                <button 
                  onClick={(e) => { e.currentTarget.blur(); setTimeout(() => window.print(), 100); }}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 cursor-pointer"
                  title="Print Workspace"
                >
                  <Printer size={18} />
                </button>
              </div>
            </div>
            {/* Gray scrollable horizontal pill bar matching GST layout */}
            <div 
              className="flex flex-nowrap items-center bg-gray-100 p-1.5 rounded-lg mt-4 w-full gap-1.5 overflow-x-auto custom-scrollbar dark:bg-gray-900 border border-transparent dark:border-gray-700 select-none scroll-smooth"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {visibleTaxTabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`tax-tab-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TaxTab)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400' 
                      : 'text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.id === 'tds-tcs-calculator' ? (
                    <span className="flex items-center gap-1">
                      <Calculator size={10} />
                      {t(tab.label)}
                    </span>
                  ) : (
                    t(tab.label)
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab views with nice top padding/borders matching current card flow */}
        <div className="border-t border-slate-100 pt-6 dark:border-gray-700">
          {activeTab === 'kpis' && (
            <KpiDashboardView 
              grossProfit={grossProfit}
              taxRegime={taxRegime}
              taxRatePercent={taxRatePercent}
              totalTaxComputed={totalTaxComputed}
              outstandingAdvanceTax={outstandingAdvanceTax}
              matchedTdsTotal={matchedTdsTotal}
              netTaxableIncome={netTaxableIncome}
              setActiveTab={setActiveTab}
              formatNumber={formatNumber}
            />
          )}
          {activeTab === 'advance-tax' && (
            <AdvanceTaxPlanner outstandingAdvanceTax={outstandingAdvanceTax} />
          )}
          {activeTab === 'tds-ledger' && (
            <TdsLedgerView tdsRecords={tdsRecords} matchedTdsTotal={matchedTdsTotal} />
          )}
          {activeTab === 'tax-projection' && (
            <TaxProjectionEngine 
              salesRevenue={salesRevenue}
              setSalesRevenue={setSalesRevenue}
              otherIncome={otherIncome}
              setOtherIncome={setOtherIncome}
              operatingExpenses={operatingExpenses}
              setOperatingExpenses={setOperatingExpenses}
              depreciationSec32={depreciationSec32}
              setDepreciationSec32={setDepreciationSec32}
              deductionsUnderVI={deductionsUnderVI}
              setDeductionsUnderVI={setDeductionsUnderVI}
              taxRegime={taxRegime}
              setTaxRegime={setTaxRegime}
              
              grossProfit={grossProfit}
              netTaxableIncome={netTaxableIncome}
              taxRatePercent={taxRatePercent}
              totalTaxComputed={totalTaxComputed}
              matchedTdsTotal={matchedTdsTotal}
              outstandingAdvanceTax={outstandingAdvanceTax}
            />
          )}
          {activeTab === 'tds-tcs-calculator' && (
            <TdsTcsCalculator />
          )}
          {activeTab === 'presumptive-tax' && (
            <PresumptiveTaxPlanner />
          )}
          {activeTab === 'depreciation-schedule' && (
            <DepreciationPlanner />
          )}
          {activeTab === 'compliance-tracker' && (
            <ComplianceTracker />
          )}
          {activeTab === 'tax-loss-tracker' && (
            <TaxLossTracker />
          )}
          {activeTab === 'lut-application' && (
            <LUTApplication />
          )}
          {activeTab === 'eledger-simulator' && (
            <ELedgerSimulator />
          )}
          {activeTab === 'info' && (
            <WorkspaceInfoView />
          )}
        </div>
      </div>

    </div>
  );
};
