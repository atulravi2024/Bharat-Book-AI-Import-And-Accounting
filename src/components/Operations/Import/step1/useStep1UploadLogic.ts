import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { VoucherType, ParsingSettings } from '../../../../app/types';
import { sanitizeModelId } from '../../../../services/geminiService';
import { useLanguage } from '../../../../context/LanguageContext';

// Import newly decoupled sub-hooks
import { useFilePreview } from './useFilePreview';
import { useErpConnector } from './useErpConnector';
import { useFieldMapper } from './useFieldMapper';
import { UseStep1UploadLogicProps, ImportCategory, MasterType, TemplateConfig } from './types';

export const useStep1UploadLogic = ({
  onNext,
  isLoading,
  initialSettings,
  initialVoucherType,
  ledgerMasters = [],
  activeTab: propActiveTab,
  onTabChange,
  onImportCategoryChange,
}: UseStep1UploadLogicProps) => {
  const { t } = useLanguage();

  // 1. File Selector and Preview State (Hook 1)
  const {
    file,
    setFile,
    isDragOver,
    setIsDragOver,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    isStructuredFile,
  } = useFilePreview();

  // 2. Voucher Class and Category States (Local)
  const [voucherType, setVoucherType] = useState<VoucherType>(initialVoucherType || VoucherType.Purchase);
  const [selectedBank, setSelectedBank] = useState('');
  const [importCategory, setImportCategory] = useState<ImportCategory>('voucher');
  const [masterType, setMasterType] = useState<MasterType>('ledgers');
  const [showMapping, setShowMapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const bankMasters = useMemo(() => {
    return ledgerMasters.filter(m => m.group === 'Bank Accounts');
  }, [ledgerMasters]);

  const [parsingSettings, setParsingSettings] = useState<ParsingSettings>(initialSettings || {
    ocrSensitivity: 75,
    aiModel: 'Gemini 1.5 Flash',
    experimentalFeatures: false,
    customInstructions: '',
    customAiInstructions: '',
  });

  // 3. Field and Synonym Mapper Logic (Hook 2)
  const {
    headerRowIndex,
    setHeaderRowIndex,
    isMappingExpanded,
    setIsMappingExpanded,
    fileHeaders,
    setFileHeaders,
    previewData,
    mappings,
    setMappings,
    metaData,
    clearMappings,
  } = useFieldMapper({ file, isStructuredFile, voucherType });

  // 4. ERP Integrations Logic (Hook 3)
  const {
    activeSection,
    setActiveSection,
    productionEnv,
    setProductionEnv,
    productionApiUrl,
    setProductionApiUrl,
    productionApiKey,
    setProductionApiKey,
    syncMode,
    setSyncMode,
    isSyncingLedger,
    setIsSyncingLedger,
    testConnectionStatus,
    testConnectionMessage,
    handleTestConnection,
  } = useErpConnector();

  // Ensure default model is configured based on ledger source behavior
  const lastVoucherTypeRef = useRef<VoucherType | null>(null);

  useEffect(() => {
    if (lastVoucherTypeRef.current !== voucherType) {
      lastVoucherTypeRef.current = voucherType;
      try {
        const saved = localStorage.getItem('bharat_book_app_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.aiSettings) {
            const isBank = voucherType === VoucherType.BankStatement;
            const targetModelId = isBank 
              ? sanitizeModelId(parsed.aiSettings.bankingModel || 'gemini-2.5-flash')
              : sanitizeModelId(parsed.aiSettings.voucherModel || 'gemini-2.5-flash');
            
            setParsingSettings(prev => ({
              ...prev,
              aiModel: targetModelId
            }));
          }
        }
      } catch (e) {
        console.error("Error setting default model for voucher status:", e);
      }
    }
  }, [voucherType]);

  // Auto-detect voucher type based on headers and filename
  useEffect(() => {
    if (fileHeaders.length > 0 || file) {
      const lowerHeaders = fileHeaders.map(h => h.toLowerCase());
      const fileName = (file?.name || '').toLowerCase();
      
      const bankKeywords = metaData?.bankKeywords || ['withdrawal', 'deposit', 'closing balance', 'value date', 'txn date', 'particulars'];
      const matchesBankHeaders = bankKeywords.filter((k: string) => lowerHeaders.some(h => h.includes(k))).length >= 3;
      const matchesBankName = fileName.includes('bank') || fileName.includes('statement') || fileName.includes('txn') || fileName.includes('ledger');
      
      if ((matchesBankHeaders || (matchesBankName && fileHeaders.length > 0)) && voucherType !== VoucherType.BankStatement) {
        setVoucherType(VoucherType.BankStatement);
      }
    }
  }, [fileHeaders, file, metaData, voucherType]);

  const handleSubmit = () => {
    if (file) {
      if (voucherType === VoucherType.BankStatement && !selectedBank) {
        alert('Please select a bank name before proceeding.');
        return;
      }
      onNext(file, voucherType, mappings, parsingSettings, selectedBank);
    }
  };

  const [localActiveTab, setLocalActiveTab] = useState<'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings'>('type');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = (tab: 'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings') => {
    setLocalActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  useEffect(() => {
    if (onImportCategoryChange) {
      onImportCategoryChange(importCategory);
    }
  }, [importCategory, onImportCategoryChange]);

  useEffect(() => {
    if (importCategory === 'bank') {
      setVoucherType(VoucherType.BankStatement);
    } else if (importCategory === 'voucher' && voucherType === VoucherType.BankStatement) {
      setVoucherType(VoucherType.Purchase);
    }
  }, [importCategory, voucherType]);

  // Define templates for Preview tab
  const templateConfig: TemplateConfig = useMemo(() => {
    let title = '';
    let description = '';
    let headers: string[] = [];
    let sampleRows: Record<string, string>[] = [];
    let instructions: string[] = [];

    if (importCategory === 'voucher') {
      title = `${voucherType} Ingestion Template`;
      description = `Visual layout and standard structure for ${voucherType} document upload. Use these columns in your Excel/CSV for automated schema mapping.`;
      
      switch (voucherType) {
        case VoucherType.Purchase:
        case VoucherType.Sales:
          headers = ['Date', 'InvoiceNumber', 'Amount', 'ItemName', 'ItemQuantity', 'ItemRate', 'ItemTaxRate', 'ItemTotalAmount'];
          sampleRows = [
            { Date: '2026-05-01', InvoiceNumber: 'INV-2026-001', Amount: '12500.00', ItemName: 'Tally Course Premium', ItemQuantity: '1', ItemRate: '12500.00', ItemTaxRate: '18%', ItemTotalAmount: '14750.00' },
            { Date: '2026-05-03', InvoiceNumber: 'INV-2026-002', Amount: '450.00', ItemName: 'Accounting Practice Book', ItemQuantity: '2', ItemRate: '225.00', ItemTaxRate: '5%', ItemTotalAmount: '472.50' }
          ];
          instructions = [
            'Dates should preferably be in YYYY-MM-DD or DD-MM-YYYY format.',
            'Ensure the Total Invoice value dynamically includes your Item Total + Taxes.',
            'Taxes can be written either as percentage (e.g. 18%) or raw integers.'
          ];
          break;
        case VoucherType.Payment:
        case VoucherType.Receipt:
          headers = ['Date', 'Amount', 'PaymentMode', 'ReferenceNo', 'BankDetails', 'Narration'];
          sampleRows = [
            { Date: '2026-05-10', Amount: '8500.00', PaymentMode: 'NEFT', ReferenceNo: 'N2026543210', BankDetails: 'SBI A/C 9876', Narration: 'Paid office monthly internet expense' },
            { Date: '2026-05-12', Amount: '15000.00', PaymentMode: 'UPI', ReferenceNo: 'UPI9831049281', BankDetails: 'HDFC Current A/C', Narration: 'Received advance subscription fee' }
          ];
          instructions = [
            'PaymentMode values standardizes into: UPI, NEFT, RTGS, Cash, Cheque, Card.',
            'ReferenceNo maps directly into UTR / Instrument number for quick bank reconciliations.',
            'Keep your Narrations professional for robust downstream search matching.'
          ];
          break;
        case VoucherType.Journal:
          headers = ['Date', 'Amount', 'DebitLedger', 'CreditLedger', 'Narration'];
          sampleRows = [
            { Date: '2026-05-15', Amount: '2500.00', DebitLedger: 'Office Depreciation A/C', CreditLedger: 'Furniture Asset A/C', Narration: 'Monthly asset depreciation calculation' },
            { Date: '2026-05-18', Amount: '4200.00', DebitLedger: 'Salary Outstanding A/C', CreditLedger: 'Employee Benefit Expense', Narration: 'Accrued unpaid staff incentives' }
          ];
          instructions = [
            'Ensure that both Credit and Debit ledgers already exist in your chart of accounts to prevent import blocks.',
            'Use standard nomenclature for Ledgers matching Tally/ERP structure.'
          ];
          break;
        case VoucherType.Contra:
          headers = ['Date', 'Amount', 'FromAccount', 'ToAccount', 'ReferenceNo', 'Narration'];
          sampleRows = [
            { Date: '2026-05-20', Amount: '50000.00', FromAccount: 'SBI Bank A/C', ToAccount: 'Petty Cash Account', ReferenceNo: 'CHQ-981024', Narration: 'Withdrawn physical cash for office maintenance' }
          ];
          instructions = [
            'Contra transactions are strictly internal transfers between Bank and Cash accounts.',
            'Both From and To accounts must be tagged under Bank Accounts or Cash-in-hand groups.'
          ];
          break;
        case VoucherType.BankStatement:
          headers = ['Date', 'Narration', 'ReferenceNo', 'PaymentMode', 'WithdrawalAmount', 'DepositAmount', 'ClosingBalance'];
          sampleRows = [
            { Date: '2026-05-22', Narration: 'UPI-M-PAY-RAMESH-SBI7654', ReferenceNo: 'SB83192410', PaymentMode: 'UPI', WithdrawalAmount: '120.00', DepositAmount: '', ClosingBalance: '4840.00' },
            { Date: '2026-05-24', Narration: 'INTEREST CREDIT RECEIVED', ReferenceNo: 'INT839123049', PaymentMode: 'DIRECT', WithdrawalAmount: '', DepositAmount: '780.00', ClosingBalance: '5620.00' }
          ];
          instructions = [
            'Specify separate columns for Withdrawals (Debit) and Deposits (Credit) as issued by standard bank statements.',
            'Provide chronological transactions sequentially for continuous closing balance updates.'
          ];
          break;
        default:
          headers = ['Date', 'Amount', 'Narration'];
          sampleRows = [
            { Date: '2026-05-01', Amount: '1000.00', Narration: 'Sample Ingestion Transaction record' }
          ];
          instructions = [
            'Enter date, currency amount and short remark summaries.'
          ];
      }
    } else if (importCategory === 'master') {
      title = `${masterType.charAt(0).toUpperCase() + masterType.slice(1)} Ingestion Model`;
      description = `Visual field structure for uploading physical ${masterType} master files.`;
      
      switch (masterType) {
        case 'ledgers':
          headers = ['Name', 'Group', 'OpeningBalance', 'Address', 'Phone', 'Email', 'GSTIN'];
          sampleRows = [
            { Name: 'Acme General Traders Pvt Ltd', Group: 'Sundry Debtors', OpeningBalance: '45000.00 Dr', Address: '72, MG Road, Mumbai', Phone: '9876543210', Email: 'sales@acme-traders.com', GSTIN: '27AAAAA1111A1Z1' },
            { Name: 'HDFC Bank Accounts', Group: 'Bank Accounts', OpeningBalance: '820491.50 Dr', Address: 'Khar Branch, Mumbai', Phone: '', Email: '', GSTIN: '' }
          ];
          instructions = [
            'Ensure the Ledger Name is unique and does not collide with existing entries.',
            'The Group name must correspond directly to standard accounting groups (e.g., Sundry Debtors, Sundry Creditors, Indirect Expenses, Direct Expenses).'
          ];
          break;
        case 'items':
          headers = ['ItemName', 'SKU', 'Category', 'BaseUnit', 'OpeningQuantity', 'OpeningRate', 'GstRate', 'HsnCode'];
          sampleRows = [
            { ItemName: 'Optima Laser Pointer Pro', SKU: 'LP-OPT-01', Category: 'Office Stationery', BaseUnit: 'PCS', OpeningQuantity: '250', OpeningRate: '120.00', GstRate: '18%', HsnCode: '90132000' }
          ];
          instructions = [
            'Specify the BaseUnit (e.g. PCS, KGS, BOX, NOS) standard definitions.',
            'Include a HSN Code for accurate automated tax mapping on invoices.'
          ];
          break;
        default: // costCenters, priceList
          headers = ['Name', 'Code', 'Category', 'Description'];
          sampleRows = [
            { Name: 'South Sales Division', Code: 'CC-SOUTH', Category: 'Marketing Department', Description: 'Sales and marketing operations in south regions' }
          ];
          instructions = [
            'Map cost allocation items and internal categories precisely.'
          ];
      }
    } else if (importCategory === 'bank') {
      title = `Bank Statement Standard Structure`;
      description = `Standard columns format for ingesting general raw bank state records directly.`;
      headers = ['Date', 'Narration', 'ReferenceNo', 'WithdrawalAmount', 'DepositAmount', 'ClosingBalance'];
      sampleRows = [
        { Date: '2026-05-15', Narration: 'RTGS-NQR-8491-DELHI-MFRS', ReferenceNo: 'RTGS8291049281', WithdrawalAmount: '0.00', DepositAmount: '125000.00', ClosingBalance: '135600.00' }
      ];
      instructions = [
        'Select SBI, HDFC, ICICI, etc. sources to run specific custom matching templates.',
        'Withdrawal reflects amount debited, Deposit reflects amount credited.'
      ];
    } else {
      title = `Miscellaneous Import Ingest Map`;
      description = `Standard table matrix configuration layout for custom other files.`;
      headers = ['ColumnA', 'ColumnB', 'ColumnC'];
      sampleRows = [
        { ColumnA: 'Row Value Alpha 1', ColumnB: 'Row Value Alpha 2', ColumnC: 'Row Value Alpha 3' }
      ];
      instructions = [
        'Organize columns cleanly with unique headers.'
      ];
    }

    return { title, description, headers, sampleRows, instructions };
  }, [importCategory, voucherType, masterType]);

  const handleDownloadTemplate = () => {
    const { headers, sampleRows } = templateConfig;
    const headerRow = headers.join(',');
    const dataRows = sampleRows.map(row => 
      headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headerRow, ...dataRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BharatBook_${templateConfig.title.replace(/\s+/g, '_')}_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const steps = useMemo(() => [
    { id: 'type', title: t("Import") },
    { id: 'choose', title: importCategory === 'voucher' ? t("Voucher") : importCategory === 'master' ? t("Master") : importCategory === 'bank' ? t("Bank") : t("Choose") },
    { id: 'preview', title: t("Template") },
    { id: 'upload', title: t("Upload") },
    { id: 'mapping', title: t("Map Data") },
    { id: 'settings', title: t("Settings") }
  ], [t, importCategory]);

  const currentStepIndex = steps.findIndex(s => s.id === activeTab);

  return {
    file,
    setFile,
    voucherType,
    setVoucherType,
    selectedBank,
    setSelectedBank,
    isDragOver,
    setIsDragOver,
    showMapping,
    setShowMapping,
    showSettings,
    setShowSettings,
    headerRowIndex,
    setHeaderRowIndex,
    isMappingExpanded,
    setIsMappingExpanded,
    bankMasters,
    parsingSettings,
    setParsingSettings,
    activeSection,
    setActiveSection,
    productionEnv,
    setProductionEnv,
    productionApiUrl,
    setProductionApiUrl,
    productionApiKey,
    setProductionApiKey,
    syncMode,
    setSyncMode,
    isSyncingLedger,
    setIsSyncingLedger,
    testConnectionStatus,
    testConnectionMessage,
    handleTestConnection,
    fileHeaders,
    previewData,
    mappings,
    setMappings,
    isStructuredFile,
    handleFileChange,
    clearMappings,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit,
    activeTab,
    setActiveTab,
    importCategory,
    setImportCategory,
    masterType,
    setMasterType,
    templateConfig,
    handleDownloadTemplate,
    steps,
    currentStepIndex
  };
};
