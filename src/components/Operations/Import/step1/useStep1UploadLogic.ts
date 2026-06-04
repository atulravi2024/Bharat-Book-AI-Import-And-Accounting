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
  const [importCategory, setImportCategory] = useState<ImportCategory>('bank');
  const [masterType, setMasterType] = useState<MasterType>('ledgers');
  const [selectedOtherCategory, setSelectedOtherCategory] = useState<string>(
    initialSettings?.selectedOtherCategory && [
      'employees_payroll', 
      'fixed_assets', 
      'currency_rates', 
      'projects_wbs', 
      'barcodes_units', 
      'discount_rules', 
      'custom_dirs', 
      'custom'
    ].includes(initialSettings.selectedOtherCategory)
      ? initialSettings.selectedOtherCategory
      : 'employees_payroll'
  );
  const [customCategoryName, setCustomCategoryName] = useState<string>(initialSettings?.customCategoryName || '');
  const [selectedSettingsSubpage, setSelectedSettingsSubpage] = useState<string>('pref_general');
  const [showMapping, setShowMapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [taxSampleType, setTaxSampleType] = useState<'with_data' | 'without_data'>('without_data');
  const [gstSyncStatus, setGstSyncStatus] = useState<{
    status: 'idle' | 'syncing' | 'success' | 'error';
    message?: string;
    blankPath?: string;
    filledPath?: string;
  }>({ status: 'idle' });

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

  // Synchronize GST uploaded files to the backend /public/Tax_Sample_Data folder
  useEffect(() => {
    if (file && importCategory === 'tax_related') {
      setGstSyncStatus({ status: 'syncing', message: 'Syncing uploaded compliance schema...' });
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const contentDataUrl = e.target?.result as string;
          let contentBase64 = '';
          if (contentDataUrl && contentDataUrl.includes('base64,')) {
            contentBase64 = contentDataUrl.split('base64,')[1];
          } else {
            // Fallback for unexpected formats
            contentBase64 = btoa(unescape(encodeURIComponent(contentDataUrl)));
          }

          const response = await fetch("/api/gst/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              fileName: file.name,
              contentBase64: contentBase64,
              voucherType: voucherType
            })
          });
          const result = await response.json();
          if (result.status === 'success') {
            setGstSyncStatus({
              status: 'success',
              message: result.message,
              blankPath: result.blankPath || result.filledPath,
              filledPath: result.filledPath
            });
          } else {
            setGstSyncStatus({
              status: 'error',
              message: result.error || 'Failed to sync schema files'
            });
          }
        } catch (err: any) {
          setGstSyncStatus({
            status: 'error',
            message: err.message || 'Network sync error'
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setGstSyncStatus({ status: 'idle' });
    }
  }, [file, importCategory, voucherType]);

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
      onNext(file, voucherType, mappings, {
        ...parsingSettings,
        selectedOtherCategory: (importCategory === 'ledger_master' || importCategory === 'item_master') ? masterType : selectedOtherCategory,
        customCategoryName
      }, selectedBank);
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
    } else if (importCategory === 'transaction_voucher') {
      const validTransactionVouchers = [
        VoucherType.Purchase,
        VoucherType.Sales,
        VoucherType.Payment,
        VoucherType.Receipt,
        VoucherType.Journal,
        VoucherType.Contra,
        VoucherType.CreditNote,
        VoucherType.DebitNote
      ];
      if (!validTransactionVouchers.includes(voucherType)) {
        setVoucherType(VoucherType.Sales);
      }
    } else if (importCategory === 'item_voucher') {
      const validItemVouchers = [
        VoucherType.StockJournal,
        VoucherType.PhysicalStock,
        VoucherType.ItemConsumption,
        VoucherType.ItemScrap,
        VoucherType.Interlocation,
        VoucherType.RejectionIn,
        VoucherType.RejectionOut
      ];
      if (!validItemVouchers.includes(voucherType)) {
        setVoucherType(VoucherType.StockJournal);
      }
    } else if (importCategory === 'ledger_master') {
      setMasterType('ledgers');
    } else if (importCategory === 'item_master') {
      setMasterType('items');
    } else if (importCategory === 'tax_related') {
      const validTaxVouchers = [
        VoucherType.GSTR1,
        VoucherType.GSTR3B,
        VoucherType.GSTR2A,
        VoucherType.GSTR2B,
        VoucherType.GSTR9,
        VoucherType.GSTR9A,
        VoucherType.GSTR9B,
        VoucherType.GSTR9C,
        VoucherType.GSTR4,
        VoucherType.GSTR4A,
        VoucherType.GSTR4B,
        VoucherType.CMP08
      ];
      if (!validTaxVouchers.includes(voucherType)) {
        setVoucherType(VoucherType.GSTR1);
      }
    }
  }, [importCategory, voucherType]);

  // Define templates for Preview tab
  const templateConfig: TemplateConfig = useMemo(() => {
    let title = '';
    let description = '';
    let headers: string[] = [];
    let sampleRows: Record<string, string>[] = [];
    let instructions: string[] = [];

    if (importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher') {
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
        case VoucherType.StockJournal:
          headers = ['Date', 'ReferenceNo', 'ItemName', 'SourceGodown', 'QuantityIn', 'DestGodown', 'QuantityOut', 'Rate', 'Narration'];
          sampleRows = [
            { Date: '2026-05-01', ReferenceNo: 'STKJK-001', ItemName: 'Premium Steel Sheet', SourceGodown: 'Raw Material Store', QuantityIn: '100', DestGodown: 'Assembly Godown', QuantityOut: '100', Rate: '450.00', Narration: 'Transfer material for fabrication production' }
          ];
          instructions = [
            'Dates should preferably be in YYYY-MM-DD or DD-MM-YYYY format.',
            'Specify the exact matching source and destination warehouse locations or godowns.',
            'Ensure item name exactly matches the item master definitions.'
          ];
          break;
        case VoucherType.PhysicalStock:
          headers = ['Date', 'GodownCode', 'ItemName', 'ActualStockCount', 'RecordedStock', 'Variance', 'AuditorName'];
          sampleRows = [
            { Date: '2026-05-15', GodownCode: 'WH-OUPU', ItemName: 'Copper Wire Reel', ActualStockCount: '45', RecordedStock: '42', Variance: '3', AuditorName: 'Aman Kumar' }
          ];
          instructions = [
            'Enter physical stock audits conducted at standard milestones.',
            'Include the Variance column representing the deviation between system stock and physical count.'
          ];
          break;
        case VoucherType.ItemConsumption:
          headers = ['Date', 'ReferenceNo', 'ProjectOrCostCenter', 'ItemCode', 'ItemName', 'QuantityConsumed', 'UnitCost', 'TotalValue'];
          sampleRows = [
            { Date: '2026-05-12', ReferenceNo: 'CONS-901', ProjectOrCostCenter: 'Project Neo Fabrication', ItemCode: 'M-ST-18', ItemName: 'Grade-A Steel Rods', QuantityConsumed: '500', UnitCost: '180.00', TotalValue: '90000.00' }
          ];
          instructions = [
            'Stock consumption transactions record materials deducted directly from assets without sales.',
            'Linked Cost Centers or project references help track expense allocations.'
          ];
          break;
        case VoucherType.ItemScrap:
          headers = ['Date', 'ScrapReference', 'ItemName', 'QuantityScrapped', 'Reason', 'ScrapValueCollected'];
          sampleRows = [
            { Date: '2026-05-20', ScrapReference: 'SCRAP-04', ItemName: 'Damaged ABS Enclosure', QuantityScrapped: '120', Reason: 'Molding defect / QA Reject', ScrapValueCollected: '1200.00' }
          ];
          instructions = [
            'Use to log physical stock write-offs and scrap metal/plastic recovery transactions.',
            'Define clear defect or rejection reasons to build quality audit reports.'
          ];
          break;
        case VoucherType.Interlocation:
          headers = ['Date', 'TransferID', 'ItemName', 'FromLocation', 'ToLocation', 'QuantityTransferred', 'TransitCarrier'];
          sampleRows = [
            { Date: '2026-05-24', TransferID: 'XFER-8201', ItemName: 'High-Tensile Bolts Pack', FromLocation: 'Central Hub - Sector 4', ToLocation: 'Retail Store Room', QuantityTransferred: '50', TransitCarrier: 'Swift Logistics' }
          ];
          instructions = [
            'Specify moving stock across internal locations on specific transfer IDs.',
            'Carrier names help track materials in-transit during continuous delivery audits.'
          ];
          break;
        case VoucherType.RejectionIn:
        case VoucherType.RejectionOut:
          headers = ['Date', 'RejectionID', 'PartyName', 'ItemName', 'QuantityRejected', 'ReasonForRejection', 'OriginalInvoiceNo'];
          sampleRows = [
            { Date: '2026-05-26', RejectionID: 'REJIN-442', PartyName: 'Nippon Electronics Ltd', ItemName: 'Power Cord 1.5m', QuantityRejected: '15', ReasonForRejection: 'Wrong connector model shipped', OriginalInvoiceNo: 'INV-4921' }
          ];
          instructions = [
            'Logs physical stock returned by customer (Rejection In) or sent back to suppliers (Rejection Out) prior to billing adjustments.',
            'Provide original invoice numbers for seamless automated correlation.'
          ];
          break;
        case VoucherType.CreditNote:
          headers = ['Date', 'CreditNoteNumber', 'OriginalInvoiceNumber', 'Amount', 'PartyName', 'ItemName', 'ItemQuantity', 'ItemRate', 'TaxRate', 'Narration'];
          sampleRows = [
            { Date: '2026-05-18', CreditNoteNumber: 'CN-2026-001', OriginalInvoiceNumber: 'INV-2026-001', Amount: '2500.00', PartyName: 'Ramesh Automation', ItemName: 'Tally Course Premium', ItemQuantity: '1', ItemRate: '2500.00', TaxRate: '18%', Narration: 'Sales return due to duplicate purchase' }
          ];
          instructions = [
            'Dates should preferably be in YYYY-MM-DD or DD-MM-YYYY format.',
            'Maintain Credit Note Number along with the original Invoice Number for automated correlation.',
            'Ensure the target Party is already existing or mapped in the ledger master.'
          ];
          break;
        case VoucherType.DebitNote:
          headers = ['Date', 'DebitNoteNumber', 'OriginalInvoiceNumber', 'Amount', 'SupplierName', 'ItemName', 'ItemQuantity', 'ItemRate', 'TaxRate', 'Narration'];
          sampleRows = [
            { Date: '2026-05-19', DebitNoteNumber: 'DN-2026-002', OriginalInvoiceNumber: 'PINV-2026-441', Amount: '4200.00', SupplierName: 'Bharat Book Agency', ItemName: 'Premium Accounting Books', ItemQuantity: '10', ItemRate: '420.00', TaxRate: '5%', Narration: 'Purchase return for defective material or item damage' }
          ];
          instructions = [
            'Dates should preferably be in YYYY-MM-DD or DD-MM-YYYY format.',
            'Specify the Debit Note Number (sometimes called Purchase Note Number) to reflect standard returns.',
            'Provide the Supplier or Party Name carefully to ensure accurate automatic supplier ledger posting.'
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
    } else if (importCategory === 'ledger_master' || importCategory === 'item_master') {
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
    } else if (importCategory === 'tax_related') {
      title = `GST compliance: ${voucherType} format`;
      description = `Visual outline structure for uploading official GSTR GST sheets for compliance ingestion pipelines.`;
      
      switch (voucherType) {
        case VoucherType.GSTR1:
          headers = ['GSTIN of Supplier', 'Trade/Legal Name', 'Invoice Number', 'Invoice Date', 'Invoice Value', 'Place Of Supply', 'Tax Rate', 'Taxable Value', 'IGST Amount', 'CGST Amount', 'SGST Amount'];
          sampleRows = [
            { 'GSTIN of Supplier': '27AAAAA1111A1Z1', 'Trade/Legal Name': 'Acme General Traders Pvt Ltd', 'Invoice Number': 'INV-2026-10492', 'Invoice Date': '2026-05-01', 'Invoice Value': '118000.00', 'Place Of Supply': '27-Maharashtra', 'Tax Rate': '18%', 'Taxable Value': '100000.00', 'IGST Amount': '0.00', 'CGST Amount': '9000.00', 'SGST Amount': '9000.00' }
          ];
          break;
        case VoucherType.GSTR2A:
        case VoucherType.GSTR2B:
          headers = ['GSTIN of Supplier', 'Trade/Legal Name', 'Invoice Type', 'Invoice Number', 'Invoice Date', 'Invoice Value', 'Place Of Supply', 'Tax Rate', 'Taxable Value', 'Integrated Tax', 'Central Tax', 'State/UT Tax', 'ITC Availability'];
          sampleRows = [
            { 'GSTIN of Supplier': '27AAAAA1111A1Z1', 'Trade/Legal Name': 'Acme General Traders Pvt Ltd', 'Invoice Type': 'Regular', 'Invoice Number': 'INV-2026-10492', 'Invoice Date': '2026-05-01', 'Invoice Value': '118000.00', 'Place Of Supply': '27-Maharashtra', 'Tax Rate': '18%', 'Taxable Value': '100000.00', 'Integrated Tax': '0.00', 'Central Tax': '9000.00', 'State/UT Tax': '9000.00', 'ITC Availability': 'Available' }
          ];
          break;
        case VoucherType.GSTR4:
          headers = ['GSTIN of Taxpayer', 'Trade Name', 'Financial Year', 'Aggregate Turnover', 'Tax Rate (%)', 'Taxable Value', 'Integrated Tax', 'Central Tax', 'State/UT Tax', 'Cess'];
          sampleRows = [
            { 'GSTIN of Taxpayer': '27BBBBB2222B2Z2', 'Trade Name': 'Krishna Grocers & Retailers', 'Financial Year': '2025-26', 'Aggregate Turnover': '750000.00', 'Tax Rate (%)': '1%', 'Taxable Value': '750000.00', 'Integrated Tax': '0.00', 'Central Tax': '3750.00', 'State/UT Tax': '3750.00', 'Cess': '0.00' }
          ];
          break;
        case VoucherType.GSTR4A:
          headers = ['GSTIN of Supplier', 'Supplier Name', 'Invoice Number', 'Invoice Date', 'Invoice Value', 'Tax Rate', 'Taxable Value', 'Integrated Tax', 'Central Tax', 'State/UT Tax'];
          sampleRows = [
            { 'GSTIN of Supplier': '27AAAAA1111A1Z1', 'Supplier Name': 'Acme Distributors Ltd', 'Invoice Number': 'INV-902-SUP', 'Invoice Date': '2026-04-12', 'Invoice Value': '52500.00', 'Tax Rate': '5%', 'Taxable Value': '50000.00', 'Integrated Tax': '0.00', 'Central Tax': '1250.00', 'State/UT Tax': '1250.00' }
          ];
          break;
        case VoucherType.GSTR4B:
          headers = ['GSTIN of Supplier', 'Invoice Number', 'Invoice Date', 'Invoice Value', 'Taxable Value', 'Integrated Tax Amount', 'Central Tax Amount', 'State Tax Amount'];
          sampleRows = [
            { 'GSTIN of Supplier': '27CCCCC3333C3Z3', 'Invoice Number': 'TX-401', 'Invoice Date': '2026-05-05', 'Invoice Value': '12000.00', 'Taxable Value': '10000.00', 'Integrated Tax Amount': '0.00', 'Central Tax Amount': '1000.00', 'State Tax Amount': '1000.00' }
          ];
          break;
        case VoucherType.CMP08:
          headers = ['GSTIN', 'Tax Period Quarter', 'Outward Taxable Supplies', 'Tax Rate (%)', 'Integrated Tax Payable', 'Central Tax Payable', 'State/UT Tax Payable', 'Interest Paid'];
          sampleRows = [
            { 'GSTIN': '27BBBBB2222B2Z2', 'Tax Period Quarter': 'Q1-2026', 'Outward Taxable Supplies': '180000.00', 'Tax Rate (%)': '1.0%', 'Integrated Tax Payable': '0.00', 'Central Tax Payable': '900.00', 'State/UT Tax Payable': '900.00', 'Interest Paid': '0.00' }
          ];
          break;
        default:
          headers = ['GSTIN', 'Tax Period', 'Filing Date', 'Total Taxable Value', 'Total Tax Liability', 'Total ITC Availed', 'Interest/Late Fee Paid'];
          sampleRows = [
            { 'GSTIN': '27AAAAA1111A1Z1', 'Tax Period': '05-2026', 'Filing Date': '2026-05-20', 'Total Taxable Value': '500000.00', 'Total Tax Liability': '90000.00', 'Total ITC Availed': '85000.00', 'Interest/Late Fee Paid': '0.00' }
          ];
      }
      instructions = [
        'Select the GSTR compliance sheet format matching your GST official portal exports.',
        'Ensure separate allocations of CGST, SGST, and IGST match Indian state routing codes.'
      ];
    } else if (importCategory === 'settings') {
      const displayLabel = (selectedSettingsSubpage || '').replace(/_/g, ' ').toUpperCase();
      title = `${displayLabel} Profile Config`;
      description = `Visual outline mapping to ingest custom configurations, behavior flags, and parameter rules for the ${displayLabel} subpage.`;
      headers = ['GroupSection', 'ParamKeyName', 'TargetValue', 'ValidationPattern', 'DescriptionMark'];
      sampleRows = [
        { GroupSection: 'General_Default', ParamKeyName: 'POSTING_AUTO_COMMIT', TargetValue: 'TRUE', ValidationPattern: '^(TRUE|FALSE)$', DescriptionMark: 'Commit transactions automatically upon validation completion.' },
        { GroupSection: 'Alert_Config', ParamKeyName: 'ERROR_THRESHOLD_PERCENT', TargetValue: '10.0', ValidationPattern: '^[0-9]+(\\.[0-9]+)?$', DescriptionMark: 'Warning threshold for exception count in single file uploads.' }
      ];
      instructions = [
        'Make sure rule keys precisely match internal parameters of the target subpage configuration.',
        'Values must strictly comply with the regular expression rules.'
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

    if (importCategory === 'tax_related' && taxSampleType === 'without_data') {
      sampleRows = [];
    }

    return { title, description, headers, sampleRows, instructions };
  }, [importCategory, voucherType, masterType, selectedSettingsSubpage, taxSampleType]);

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
    { id: 'choose', title: (importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher') ? t("Voucher") : (importCategory === 'ledger_master' || importCategory === 'item_master') ? t("Master") : importCategory === 'bank' ? t("Bank") : importCategory === 'tax_related' ? t("GST Tax") : importCategory === 'settings' ? t("Settings") : t("Choose") },
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
    selectedOtherCategory,
    setSelectedOtherCategory,
    customCategoryName,
    setCustomCategoryName,
    selectedSettingsSubpage,
    setSelectedSettingsSubpage,
    templateConfig,
    handleDownloadTemplate,
    steps,
    currentStepIndex,
    taxSampleType,
    setTaxSampleType,
    gstSyncStatus
  };
};
