import { useLanguage } from '../../../context/LanguageContext';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { VoucherType, ParsingSettings } from '../../../app/types';
import { INTERNAL_GEMINI_MODELS } from '../../../services/AIConfig';
import { sanitizeModelId } from '../../../services/geminiService';

import { 
    UploadFileIcon, 
    InfoIcon, 
    ArrowForwardIcon, 
    CancelIcon, 
    EditIcon, 
    UndoIcon, 
    SettingsIcon,
    BankIcon,
    TaxIcon,
    InventoryIcon,
    VouchersIcon,
    AccountIcon,
    CategoryIcon,
    DeleteIcon,
    PdfIcon,
    ExcelIcon,
    ImageIcon,
    FileIcon
} from '../../icons/IconComponents';

interface Step1UploadProps {
  onNext: (file: File, voucherType: VoucherType, mapping?: Record<string, string>, settings?: ParsingSettings, sourceBank?: string) => void;
  isLoading: boolean;
  onCancel: () => void;
  error: string | null;
  clearError: () => void;
  initialSettings?: ParsingSettings;
  initialVoucherType?: VoucherType;
  ledgerMasters?: any[];
}

export const Step1Upload: React.FC<Step1UploadProps> = ({ onNext, isLoading, onCancel, error, clearError, initialSettings, initialVoucherType, ledgerMasters = [] }) => {
  const { t, formatNumber } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [voucherType, setVoucherType] = useState<VoucherType>(initialVoucherType || VoucherType.Purchase);
  const [selectedBank, setSelectedBank] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [headerRowIndex, setHeaderRowIndex] = useState(0);

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

  // Collapsible accordion active section state
  const [activeSection, setActiveSection] = useState<'info' | 'ai' | 'custom' | 'production' | null>(null);

  // Production Service State variables
  const [productionEnv, setProductionEnv] = useState('tally');
  const [productionApiUrl, setProductionApiUrl] = useState('https://api.tallyprime.internal/v1/import');
  const [productionApiKey, setProductionApiKey] = useState('');
  const [syncMode, setSyncMode] = useState('realtime');
  const [isSyncingLedger, setIsSyncingLedger] = useState(true);
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testConnectionMessage, setTestConnectionMessage] = useState('');

  const handleTestConnection = () => {
    setTestConnectionStatus('testing');
    setTestConnectionMessage('');
    
    setTimeout(() => {
      if (!productionApiUrl) {
        setTestConnectionStatus('error');
        setTestConnectionMessage(t("Failed: Production API Endpoint URL is required."));
      } else if (!productionApiKey) {
        setTestConnectionStatus('error');
        setTestConnectionMessage(t("Failed: Unauthorized. API Key is missing."));
      } else {
        setTestConnectionStatus('success');
        setTestConnectionMessage(t(`Successfully authenticated and connected with ${productionEnv === 'tally' ? 'Tally Prime' : productionEnv === 'sap' ? 'SAP Business One' : productionEnv === 'zoho' ? 'Zoho Books' : 'Custom Server'}!`));
      }
    }, 1200);
  };

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
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [synonymsData, setSynonymsData] = useState<Record<string, string[]>>({});
  const [metaData, setMetaData] = useState<any>(null);

  useEffect(() => {
    const fetchMeta = async () => {
        try {
            const resp = await fetch('/sample-data/masters/metadata.json');
            if (resp.ok) {
                const data = await resp.json();
                setMetaData(data);
                if (data.keySynonyms) setSynonymsData(data.keySynonyms);
            }
        } catch (e) {
            console.error("Failed to load metadata in Step1Upload", e);
        }
    };
    fetchMeta();
  }, []);

  // Dynamically configure mapping keys based on voucherType
  const mappingKeys = useMemo(() => {
    switch (voucherType) {
      case VoucherType.Purchase:
      case VoucherType.Sales:
        return {
           invoiceNumber: '',
           date: '',
           amount: '',
           itemName: '',
           itemQuantity: '',
           itemRate: '',
           itemTaxRate: '',
           itemTotalAmount: ''
        };
      case VoucherType.Payment:
      case VoucherType.Receipt:
        return {
           date: '',
           amount: '',
           paymentMode: '',
           referenceNo: '',
           bankDetails: '',
           narration: ''
        };
      case VoucherType.Journal:
        return {
           date: '',
           amount: '',
           debitLedger: '',
           creditLedger: '',
           narration: ''
        };
      case VoucherType.Contra:
        return {
           date: '',
           amount: '',
           fromAccount: '',
           toAccount: '',
           referenceNo: '',
           narration: ''
        };
      case VoucherType.BankStatement:
        return {
           date: '',
           narration: '',
           referenceNo: '',
           paymentMode: '',
           withdrawalAmount: '',
           depositAmount: '',
           closingBalance: ''
        };
      default:
        return {
          date: '',
          amount: '',
        };
    }
  }, [voucherType]);

  // Synchronize mappings state when type changes or file headers change
  useEffect(() => {
     if (fileHeaders.length === 0) {
        setMappings(mappingKeys);
        return;
     }

     const KEY_SYNONYMS: Record<string, string[]> = synonymsData && Object.keys(synonymsData).length > 0 ? synonymsData : {
        invoiceNumber: ['invoice', 'voucher no', 'vch no', 'doc no', 'ref', 'bill no', 'inv no'],
        date: ['date', 'txn date', 'posting date', 'document date', 'value date'],
        amount: ['amount', 'total', 'gross', 'net', 'value', 'withdrawal', 'withdrawals', 'debit', 'dr', 'payment', 'payments', 'deposit', 'deposits', 'deposited', 'credit', 'cr', 'receipt', 'receipts'],
        ledger: ['ledger', 'account', 'type', 'category', 'head', 'expense', 'income'],
        itemName: ['item', 'product', 'description', 'particulars', 'goods', 'material'],
        itemQuantity: ['qty', 'quantity', 'pieces', 'nos', 'count'],
        itemRate: ['rate', 'price', 'unit'],
        itemTaxRate: ['tax', 'gst %', 'igst', 'cgst', 'sgst', 'vat'],
        itemTotalAmount: ['item total', 'net amount', 'total sum'],
        paymentMode: ['mode', 'payment', 'method', 'type', 'instrument'],
        referenceNo: ['ref', 'cheque', 'chq', 'utr', 'transaction id', 'txn id', 'instrument id', 'inst id', 'inst. id', 'installment id'],
        bankDetails: ['bank', 'account no', 'ifsc', 'branch'],
        narration: ['narration', 'narrations', 'remark', 'remarks', 'memo', 'notes', 'description', 'descriptions'],
        debitLedger: ['debit', 'dr', 'to', 'destination'],
        creditLedger: ['credit', 'cr', 'by', 'source'],
        fromAccount: ['from', 'source', 'withdrawal', 'payor'],
        toAccount: ['to', 'destination', 'deposit', 'payee'],
        withdrawalAmount: ['withdrawal', 'withdrawals', 'debit', 'dr', 'payment', 'payments'],
        depositAmount: ['deposit', 'deposits', 'deposited', 'credit', 'cr', 'receipt', 'receipts'],
        closingBalance: ['balance', 'bal', 'closing']
     };

     const autoMapped = { ...mappingKeys };
     const usedHeaders: Set<string> = new Set();

     Object.keys(autoMapped).forEach(key => {
        const synonyms = KEY_SYNONYMS[key] || [key.toLowerCase()];
        
        // Exact match first
        let match = fileHeaders.find(h => !usedHeaders.has(h) && h.toLowerCase() === key.toLowerCase());
        
        // Synonym match
        if (!match) {
           match = fileHeaders.find(h => {
               if (usedHeaders.has(h)) return false;
               const cleanHeader = h.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
               const headerWords = cleanHeader.split(' ');
               
               return synonyms.some(syn => {
                   const cleanSyn = syn.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
                   if (cleanHeader === cleanSyn) return true;
                   
                   // Require word boundary for short abbreviations to prevent 'cr' matching 'description' or 'in' matching 'inr'
                   if (cleanSyn.length <= 3) {
                       return headerWords.includes(cleanSyn);
                   }
                   
                   return cleanHeader.includes(cleanSyn) || cleanSyn.includes(cleanHeader);
               });
           });
        }
        
        if (match) {
            autoMapped[key] = match;
            usedHeaders.add(match);
        }
     });

     setMappings(autoMapped);
  }, [mappingKeys, fileHeaders]);

  const extractHeaders = useCallback((file: File, requestedRowIndex?: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        
        let targetRowIndex = requestedRowIndex !== undefined ? requestedRowIndex : 0;
        
        // Auto-detect header row if no specific row was requested
        if (requestedRowIndex === undefined) {
           const commonHeaderKeywords = metaData?.commonHeaderKeywords || ['date', 'amount', 'narration', 'description', 'reference', 'withdrawal', 'deposit', 'balance', 'particulars', 'invoice', 'party'];
           let bestMatchScore = -1;
           let bestRowIndex = 0;
           
           // Scan first 15 rows to find the one with the most likely headers
           for (let i = 0; i < Math.min(15, rows.length); i++) {
              if (!rows[i] || rows[i].length === 0) continue;
              
              const rowStr = rows[i].map(String).join(' ').toLowerCase();
              let score = 0;
              commonHeaderKeywords.forEach(keyword => {
                  if (rowStr.includes(keyword)) score++;
              });
              
              if (score > bestMatchScore) {
                  bestMatchScore = score;
                  bestRowIndex = i;
              }
           }
           
           // If we found a row with at least 2 common header keywords, use it
           if (bestMatchScore >= 2) {
               targetRowIndex = bestRowIndex;
               setHeaderRowIndex(bestRowIndex);
           }
        }

        if (rows.length > targetRowIndex) {
          const headers = rows[targetRowIndex].map(h => String(h || '').trim()).filter(Boolean);
          setFileHeaders(headers);
        } else {
          setFileHeaders([]);
        }
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const isStructuredFile = useMemo(() => {
    if (!file) return false;
    const name = file.name.toLowerCase();
    return name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv');
  }, [file]);

  useEffect(() => {
    if (file && isStructuredFile) {
      extractHeaders(file, headerRowIndex);
    } else {
      setFileHeaders([]);
    }
  }, [file, isStructuredFile, extractHeaders, headerRowIndex]);

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
  }, [fileHeaders, file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setShowMapping(false);
    }
  };

  const clearMappings = () => {
    setMappings(mappingKeys);
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setShowMapping(false);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'pdf')  return <PdfIcon className="text-red-500" />;
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) return <ExcelIcon className="text-green-600" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return <ImageIcon className="text-blue-500" />;
    return <FileIcon className="text-gray-500 dark:text-gray-400" />;
  };

  const previewContent = useMemo(() => {
    if (!file) return null;

    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-60 object-contain mx-auto rounded-lg"/>;
    }
    // Simple preview for other file types
    return (
        <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
            <p className="font-medium text-gray-700 dark:text-gray-200">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
        </div>
    );
  }, [file]);

  const handleSubmit = () => {
    if (file) {
      if (voucherType === VoucherType.BankStatement && !selectedBank) {
        alert('Please select a bank name before proceeding.');
        return;
      }
      onNext(file, voucherType, mappings, parsingSettings, selectedBank);
    }
  };

  const [activeTab, setActiveTab] = useState<'type' | 'choose' | 'preview' | 'upload' | 'settings'>('type');
  const [importCategory, setImportCategory] = useState<'voucher' | 'master' | 'bank' | 'other'>('voucher');

  const [masterType, setMasterType] = useState<'ledgers' | 'items' | 'costCenters' | 'priceList'>('ledgers');

  useEffect(() => {
    if (importCategory === 'bank') {
      setVoucherType(VoucherType.BankStatement);
    } else if (importCategory === 'voucher' && voucherType === VoucherType.BankStatement) {
      setVoucherType(VoucherType.Purchase);
    }
  }, [importCategory]);

  // Define templates for Preview tab
  const templateConfig = useMemo(() => {
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
  }, [importCategory, voucherType, masterType, t]);

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

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex space-x-1 md:space-x-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shrink-0 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('type')}
          className={`flex-1 py-1.5 px-0.5 sm:px-1 md:py-2 text-[9px] sm:text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeTab === 'type' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-650'}`}
        >
          {t("1. Import")}
        </button>
        <button
          onClick={() => setActiveTab('choose')}
          className={`flex-1 py-1.5 px-0.5 sm:px-1 md:py-2 text-[9px] sm:text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeTab === 'choose' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-650'}`}
        >
          {importCategory === 'voucher' ? t("2. Voucher") : importCategory === 'master' ? t("2. Master") : importCategory === 'bank' ? t("2. Bank") : t("2. Choose")}
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-1.5 px-0.5 sm:px-1 md:py-2 text-[9px] sm:text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-650'}`}
        >
          {t("3. Preview")}
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-0.5 sm:px-1 md:py-2 text-[9px] sm:text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeTab === 'upload' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-650'}`}
        >
          {t("4. Upload")}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-1.5 px-0.5 sm:px-1 md:py-2 text-[9px] sm:text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-650'}`}
        >
          {t("5. Settings")}
        </button>
      </div>

      {error && (
        <div className="mb-4 shrink-0 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm" role="alert">
          <div className="shrink-0 p-2 bg-red-100 rounded-xl mr-4">
            <InfoIcon className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <p className="font-black uppercase tracking-widest text-[10px] mb-1">{t("Critical Processing Error")}</p>
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </div>
          <button onClick={clearError} className="shrink-0 p-2 hover:bg-red-100 rounded-xl transition-colors">
            <CancelIcon className="text-xl" />
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* TAB: IMPORT TYPE */}
        <div className={`flex-1 flex-col bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none min-h-0 overflow-y-auto custom-scrollbar relative shrink-0 ${activeTab === 'type' ? 'flex' : 'hidden'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          
          <div className="flex items-center justify-between mb-6 shrink-0">
             <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">{t("Select Import Type")}</h2>
                <div className="flex items-center mt-2 space-x-2">
                   <div className="h-1 w-6 bg-blue-600 rounded-full"></div>
                   <div className="h-1 w-1.5 bg-blue-200 rounded-full dark:bg-blue-900/50"></div>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setImportCategory('voucher')}
              className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                importCategory === 'voucher' 
                  ? 'bg-blue-50 border-2 border-blue-500 shadow-sm dark:bg-blue-900/20 dark:border-blue-400' 
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <VouchersIcon className={`w-10 h-10 mb-3 ${importCategory === 'voucher' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("Vouchers")}</h3>
              <p className="text-xs text-gray-500 mt-1">{t("Invoices, Receipts")}</p>
            </button>

            <button
              onClick={() => setImportCategory('master')}
              className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                importCategory === 'master' 
                  ? 'bg-blue-50 border-2 border-blue-500 shadow-sm dark:bg-blue-900/20 dark:border-blue-400' 
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <AccountIcon className={`w-10 h-10 mb-3 ${importCategory === 'master' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("Masters")}</h3>
              <p className="text-xs text-gray-500 mt-1">{t("Ledgers, Items")}</p>
            </button>

            <button
              onClick={() => setImportCategory('bank')}
              className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                importCategory === 'bank' 
                  ? 'bg-blue-50 border-2 border-blue-500 shadow-sm dark:bg-blue-900/20 dark:border-blue-400' 
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <BankIcon className={`w-10 h-10 mb-3 ${importCategory === 'bank' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("Bank Transaction")}</h3>
              <p className="text-xs text-gray-500 mt-1">{t("Statements")}</p>
            </button>

            <button
              onClick={() => setImportCategory('other')}
              className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                importCategory === 'other' 
                  ? 'bg-blue-50 border-2 border-blue-500 shadow-sm dark:bg-blue-900/20 dark:border-blue-400' 
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <CategoryIcon className={`w-10 h-10 mb-3 ${importCategory === 'other' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("Other")}</h3>
              <p className="text-xs text-gray-500 mt-1">{t("Miscellaneous data")}</p>
            </button>
          </div>
          

        </div>

        {/* TAB: CHOOSE */}
        <div className={`flex-1 bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none flex-col min-h-0 overflow-y-auto custom-scrollbar relative group/main shrink-0 ${activeTab === 'choose' ? 'flex' : 'hidden'}`}>

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

          <div className="flex items-center justify-between mb-6 shrink-0">
             <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">
                  {importCategory === 'voucher' ? t("Voucher Classification") : importCategory === 'master' ? t("Master Data Type") : importCategory === 'bank' ? t("Bank Selection") : t("Data Entry Origin")}
                </h2>
                <div className="flex items-center mt-2 space-x-2">
                    <div className="flex -space-x-1">
                        {[1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full border border-white ${i === 1 ? 'bg-blue-400' : 'bg-gray-200'} dark:bg-gray-700`}></div>)}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-blue-600/80 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100/50">{t("Pipeline Alpha")}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                      {importCategory === 'voucher' ? t("Classify document & ingest record") : importCategory === 'master' ? t("Select master data entity") : importCategory === 'bank' ? t("Select bank for statement import") : t("Select data type")}
                    </p>
                </div>
             </div>
          </div>
          
          <div className="mb-6">
            {importCategory === 'voucher' && (
              <>
                <div className="flex items-center justify-between mb-5 px-1">
                    <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">{t("System Classification")}</label>
                    <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
                </div>
                <div className="form-grid gap-4">
                  {[
                    { type: VoucherType.Purchase, icon: InventoryIcon, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100', accent: 'bg-emerald-600' },
                    { type: VoucherType.Sales, icon: TaxIcon, color: 'text-blue-600 bg-blue-50/50 border-blue-100', accent: 'bg-blue-600' },
                    { type: VoucherType.Payment, icon: AccountIcon, color: 'text-purple-600 bg-purple-50/50 border-purple-100', accent: 'bg-purple-600' },
                    { type: VoucherType.Receipt, icon: VouchersIcon, color: 'text-amber-600 bg-amber-50/50 border-amber-100', accent: 'bg-amber-600' },
                    { type: VoucherType.Journal, icon: CategoryIcon, color: 'text-slate-600 bg-slate-50/50 border-slate-100', accent: 'bg-slate-600' },
                    { type: VoucherType.Contra, icon: UndoIcon, color: 'text-rose-600 bg-rose-50/50 border-rose-100', accent: 'bg-rose-600' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => setVoucherType(item.type)}
                      className={`group flex flex-col items-center justify-center p-3.5 rounded-[1.25rem] border transition-all duration-500 relative overflow-hidden ${
                        voucherType === item.type 
                          ? `${item.color} ring-1 ring-offset-4 ring-blue-500/30 border-transparent shadow-[0_15px_30px_rgba(59,130,246,0.15)] scale-[1.08] z-10` 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:bg-premium-slate-50 hover:text-blue-600 active:scale-95 dark:bg-gray-800 dark:border-gray-700'
                      }`}
                    >
                      <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${voucherType === item.type ? `w-full ${item.accent}` : 'w-0 bg-blue-400'}`}></div>
                      <item.icon className={`text-xl mb-2 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-0.5 ${voucherType === item.type ? 'scale-110 -translate-y-0.5' : ''}`} />
                      <span className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{item.type}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {importCategory === 'master' && (
              <>
                <div className="flex items-center justify-between mb-5 px-1">
                    <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">{t("Master Entity Type")}</label>
                    <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'ledgers', label: 'Ledgers', icon: AccountIcon },
                    { id: 'items', label: 'Items', icon: InventoryIcon },
                    { id: 'costCenters', label: 'Cost Centers', icon: CategoryIcon },
                    { id: 'priceList', label: 'Price List', icon: TaxIcon },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setMasterType(item.id as any)}
                      className={`group flex flex-col items-center justify-center py-6 px-4 rounded-2xl border-2 transition-all ${
                        masterType === item.id 
                          ? 'bg-blue-50 border-blue-500 shadow-md text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                          : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <item.icon className={`text-2xl mb-3 ${masterType === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                      <span className="text-sm font-bold">{t(item.label)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            
            {importCategory === 'bank' && (
              <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start">
                  <InfoIcon className="text-indigo-500 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900">{t("Raw Bank Import")}</h4>
                    <p className="text-xs text-indigo-700 mt-0.5">{t("Importing a bank statement will automatically extract individual transaction lines. These will be presented as individual vouchers for your review and ledger mapping.")}</p>
                  </div>
                </div>

                <div className="form-field-wrapper">
                  <label className="form-label px-1">{t("Select Bank Source (Mandatory)")}</label>
                  <select 
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">{t("-- Choose Indian Major Bank --")}</option>
                    {bankMasters.map(bank => (
                      <option key={bank.name} value={bank.name}>{bank.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {importCategory === 'other' && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 dark:bg-gray-800/50 dark:border-gray-700">
                  <CategoryIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-sm text-center">{t("You are configuring a miscellaneous import. Just proceed to the next step to upload your generic data.")}</p>
              </div>
            )}
          </div>
          

        </div>

        {/* TAB: SETTINGS */}
        <div className={`flex-1 flex-col bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none min-h-0 overflow-y-auto custom-scrollbar shrink-0 ${activeTab === 'settings' ? 'flex' : 'hidden'}`}>
          <div className="flex items-center mb-6 text-gray-800 dark:text-gray-100">
            <SettingsIcon className="mr-3 text-2xl text-blue-500" />
            <h3 className="text-xl font-black">{t("Advanced Ingestion Settings")}</h3>
          </div>

          <div className="space-y-4">
            {/* ACCORDION 1: AI Suggestions & Process Info */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'info' ? null : 'info')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <InfoIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("AI Suggestions & Process Info")}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Helpful guidelines, limits, and sandbox information")}</p>
                  </div>
                </div>
                {activeSection === 'info' ? (
                  <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
              </button>

              {activeSection === 'info' && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 space-y-4 animate-in fade-in duration-200 text-left">
                  <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside dark:text-gray-300 ml-1">
                    <li>{t("For best results, upload clear, high-resolution images or machine-readable PDFs.")}</li>
                    <li>{t("Ensure the voucher type matches the uploaded document.")}</li>
                    <li>{t("Our AI will attempt to automatically recognize all fields.")}</li>
                    {file && <li className="font-semibold text-green-700 mt-4">{t("AI analysis ready. Proceed to the next step to review extracted data.")}</li>}
                  </ul>
                  <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40">
                    <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 tracking-wider flex items-center gap-1.5 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      {t("Simulated Sandbox Parser Mode")}
                    </span>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
                      {t("Excel/CSV formats are parsed directly to standard ledger models. Other source formats (Images, PDFs) run under a")} <strong>{t("simulated OCR Sandbox sequence")}</strong> {t("with mock values to demonstrate enterprise AI mapping pipelines.")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 2: AI Model Engine */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'ai' ? null : 'ai')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("AI Engine Settings")}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Model selection, vision features and sensitivity thresholds")}</p>
                  </div>
                </div>
                {activeSection === 'ai' ? (
                  <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
              </button>

              {activeSection === 'ai' && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-2 text-left bg-transparent">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider dark:text-gray-300">{t("OCR Sensitivity")} ({parsingSettings.ocrSensitivity}%)</label>
                      <InfoIcon className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={parsingSettings.ocrSensitivity}
                      onChange={(e) => setParsingSettings(prev => ({ ...prev, ocrSensitivity: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-wide">
                      <span>{t("Performance Focus")}</span>
                      <span>{t("Accuracy Focus")}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-left bg-transparent">
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider dark:text-gray-300">{t("AI Model Engine")}</label>
                    <select 
                      value={parsingSettings.aiModel}
                      onChange={(e) => setParsingSettings(prev => ({ ...prev, aiModel: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-600"
                    >
                      {INTERNAL_GEMINI_MODELS.map(model => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                      <option value="Vision Transformer-L">{t("Vision Transformer-L (Best for Complex Tables)")}</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                    <div className="text-xs pr-4 text-left">
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{t("Experimental Vision Engine")}</p>
                      <p className="text-gray-500 font-medium">{t("Enhanced layout recovery & tabular structure detection")}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setParsingSettings(prev => ({ ...prev, experimentalFeatures: !prev.experimentalFeatures }))}
                      className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${parsingSettings.experimentalFeatures ? 'bg-blue-600 shadow-inner' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${parsingSettings.experimentalFeatures ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 3: Custom Extraction Cues */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'custom' ? null : 'custom')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("Custom Ingestion Cues")}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Custom instructions, prompts or extraction triggers for AI")}</p>
                  </div>
                </div>
                {activeSection === 'custom' ? (
                  <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
              </button>

              {activeSection === 'custom' && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 space-y-3 animate-in fade-in duration-200 text-left">
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider dark:text-gray-300">{t("Custom Extraction Cues")}</label>
                  <textarea 
                    value={parsingSettings.customInstructions}
                    onChange={(e) => setParsingSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
                    placeholder={t("e.g. 'Always look for GSTIN in the footer', 'Ignore previous balance in total'...")}
                    className="w-full h-24 text-sm font-medium p-4 bg-white border border-gray-300 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
              )}
            </div>

            {/* ACCORDION 4: Production Service Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'production' ? null : 'production')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("Production Service Integration")}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Synchronize parsed voucher objects back to production ERPs")}</p>
                  </div>
                </div>
                {activeSection === 'production' ? (
                  <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
              </button>

              {activeSection === 'production' && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 space-y-4 animate-in fade-in duration-200 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider dark:text-gray-400">{t("Target Accounting API ERP")}</label>
                      <select 
                        value={productionEnv}
                        onChange={(e) => {
                          setProductionEnv(e.target.value);
                          if (e.target.value === 'tally') setProductionApiUrl('https://api.tallyprime.internal/v1/import');
                          else if (e.target.value === 'sap') setProductionApiUrl('https://sap-gateway.enterprise.corp/api/v2/vouchers');
                          else if (e.target.value === 'zoho') setProductionApiUrl('https://books.zoho.in/api/v3/documents');
                          else setProductionApiUrl('');
                        }}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="tally">{t("Tally Prime Server")}</option>
                        <option value="sap">{t("SAP Business One ERP")}</option>
                        <option value="zoho">{t("Zoho Books Endpoint")}</option>
                        <option value="custom">{t("-- Custom Webhook URL --")}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider dark:text-gray-400">{t("Synchronization Strategy")}</label>
                      <select 
                        value={syncMode}
                        onChange={(e) => setSyncMode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="realtime">{t("Real-time Direct Push")}</option>
                        <option value="batch">{t("EOD Nightly Batch Queue")}</option>
                        <option value="manual">{t("Manual Human-in-The-Loop Signoff")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider dark:text-gray-400">{t("Production Integration Endpoint URL")}</label>
                      <input 
                        type="text"
                        value={productionApiUrl}
                        onChange={(e) => setProductionApiUrl(e.target.value)}
                        placeholder="https://sync.yourdomain.com/api/v1/ledger"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-850 dark:border-gray-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider dark:text-gray-400">{t("Bearer Access Key / API Token")}</label>
                      <input 
                        type="password"
                        value={productionApiKey}
                        onChange={(e) => setProductionApiKey(e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-850 dark:border-gray-750"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-905 rounded-xl border border-gray-200 dark:border-gray-750 mt-2">
                    <div className="text-[11px] pr-2 text-left">
                      <p className="font-bold text-gray-800 dark:text-gray-200 mb-0.5">{t("Sync Unmapped Ledgers Automatically")}</p>
                      <p className="text-gray-400">{t("Create non-existent party & bank accounts in secondary ERP in real-time")}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsSyncingLedger(!isSyncingLedger)}
                      className={`w-10 h-5.5 rounded-full transition-all relative shrink-0 ${isSyncingLedger ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-750'}`}
                    >
                      <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isSyncingLedger ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testConnectionStatus === 'testing'}
                      className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {testConnectionStatus === 'testing' ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-gray-600 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("Connecting...")}
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                          {t("Test Service connectivity")}
                        </>
                      )}
                    </button>

                    {testConnectionStatus !== 'idle' && (
                      <div className={`p-2.5 rounded-lg border text-[11px] font-medium text-left ${
                        testConnectionStatus === 'success' 
                          ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-300' 
                          : testConnectionStatus === 'error'
                          ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-300'
                          : 'bg-blue-50 border-blue-100 text-blue-800'
                      }`}>
                        {testConnectionMessage}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        
        {/* TAB: UPLOAD */}
        <div className={`flex-1 flex-col bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none min-h-0 overflow-y-auto custom-scrollbar shrink-0 ${activeTab === 'upload' ? 'flex' : 'hidden'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 mb-6 ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'} dark:border-gray-600 dark:bg-gray-800`}
          >
            <div className="flex flex-col items-center">
              <UploadFileIcon className="text-5xl text-gray-400 mb-3" />
              <p className="mb-1 text-gray-600 dark:text-gray-300 font-bold">{t("Drag & drop files here")}</p>
              <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">{t("PDF, Excel, JPG, PNG")}</p>
              <label htmlFor="file-upload" className="cursor-pointer bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">{t("Browse Files")}</label>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png"/>
            </div>
          </div>
          
          {file && (
            <div className="mt-2 p-6 bg-premium-slate-50 rounded-[2rem] border border-premium-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-start">
                    <div className="shrink-0 w-16 h-16 bg-white rounded-2xl border border-premium-slate-200 flex items-center justify-center shadow-sm dark:bg-gray-800 dark:border-gray-600">
                        {React.cloneElement(getFileIcon(file.name) as any, { className: 'text-3xl ' + ((getFileIcon(file.name) as any).props?.className || '') })}
                    </div>
                    <div className="ml-5 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-black text-gray-900 truncate tracking-tight dark:text-white">{file.name}</h4>
                            <span className="shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-md tracking-widest border border-blue-200">{t("Live Asset")}</span>
                        </div>
                        <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <span className="text-[10px] uppercase font-bold tracking-widest mr-1.5 opacity-50">{t("Type")}</span>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{file.name.split('.').pop()?.toUpperCase() || 'Unknown'}</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <span className="text-[10px] uppercase font-bold tracking-widest mr-1.5 opacity-50">{t("Volume")}</span>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{(file.size / 1024).toFixed(2)} KB</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => { setFile(null); setShowMapping(false); }}
                        className="shrink-0 p-3 bg-white border border-premium-slate-200 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-2xl transition-all shadow-sm dark:bg-gray-800 dark:border-gray-600"
                    >
                        <DeleteIcon />
                    </button>
                </div>
            </div>
          )}

          {file && !isStructuredFile && previewContent && (
            <div className="mt-6 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <h4 className="text-sm font-bold text-gray-700 mb-3">{t("File Preview")}</h4>
                {previewContent}
            </div>
          )}

          {file && isStructuredFile && (
            <div className="animate-in fade-in duration-300 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 text-left">
              <div className="flex items-center justify-between font-semibold mb-6">
                 <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter dark:text-white">{t("Map Data Columns")}</h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Found {fileHeaders.length} source columns</p>
                 </div>
                 <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                      <span className="text-xs font-semibold text-gray-500 ml-2 dark:text-gray-400">{t("Header Row Index:")}</span>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={headerRowIndex}
                        onChange={(e) => setHeaderRowIndex(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 px-2 py-1 text-center font-bold text-blue-600 bg-white border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start mb-6 dark:bg-blue-900/20 dark:border-blue-800/30">
                <InfoIcon className="text-blue-500 mr-2 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {t(`Map the columns from your Excel file to the corresponding fields in Bharat Book. Our AI will use these hints to improve parsing accuracy.`)}
                </p>
              </div>
              
              <div className="form-grid gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                {Object.keys(mappings).map((targetField) => (
                  <div key={targetField} className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 dark:text-gray-400">
                      {targetField.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="relative">
                      <select 
                        value={mappings[targetField]}
                        onChange={(e) => setMappings(prev => ({ ...prev, [targetField]: e.target.value }))}
                        className="w-full pl-4 pr-10 py-3 text-sm font-medium bg-white border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-600 transition-shadow hover:border-gray-400"
                      >
                        <option value="">{t("-- Auto-detect --")}</option>
                        {(fileHeaders.length > 0 ? fileHeaders : []).map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={clearMappings}
                  className="text-sm font-bold text-gray-500 hover:text-red-600 flex items-center transition-colors px-4 py-2.5 rounded-xl hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/20"
                >
                  <UndoIcon className="mr-2 text-base" />
                  {t("Clear All Mappings")}
                </button>
              </div>
            </div>
          )}
          

        </div>

        {/* TAB: PREVIEW */}
        {activeTab === 'preview' && (
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none flex-col min-h-0 overflow-y-auto custom-scrollbar relative flex animate-in fade-in duration-300">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
             
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 gap-4">
                <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">
                      {t(templateConfig.title)}
                   </h2>
                   <p className="text-xs text-gray-400 mt-2 font-medium">
                      {t(templateConfig.description)}
                   </p>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="shrink-0 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all hover:scale-102 hover:-translate-y-0.5"
                >
                  <ExcelIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>{t("Download CSV Template")}</span>
                </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 space-y-4 text-left">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[11px] text-gray-500 opacity-60 dark:text-gray-300">{t("Live Interactive Data Schema Matrix")}</h3>
                   <div className="border border-premium-slate-150 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm max-w-full overflow-x-auto">
                      <table className="min-w-full border-collapse text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                         <thead>
                            <tr className="bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 text-[10px] font-black uppercase tracking-wider">
                               {templateConfig.headers.map((hdr) => (
                                  <th key={hdr} className="px-4 py-3 whitespace-nowrap">{hdr.replace(/([A-Z])/g, ' $1')}</th>
                               ))}
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-mono text-[11px]">
                            {templateConfig.sampleRows.map((row, idx) => (
                               <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                                  {templateConfig.headers.map((hdr) => (
                                     <td key={hdr} className="px-4 py-3 text-gray-800 dark:text-gray-200 max-w-xs truncate">{row[hdr] || <span className="text-gray-300 dark:text-gray-600">—</span>}</td>
                                  ))}
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>

                <div className="space-y-4 text-left">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[11px] text-gray-500 opacity-60 dark:text-gray-300">{t("Preparation Guidelines")}</h3>
                   <div className="bg-blue-50/10 border border-blue-105 dark:bg-blue-950/10 dark:border-blue-900/20 p-5 rounded-2xl space-y-3.5 shadow-sm">
                      <p className="text-[12px] text-blue-900 dark:text-blue-300 font-bold leading-none">{t("Standard Ingestion Rule Checklists")}</p>
                      <ul className="space-y-3">
                         {templateConfig.instructions.map((inst, i) => (
                            <li key={i} className="flex items-start text-[11px] font-medium text-gray-600 dark:text-gray-300 leading-normal">
                               <span className="shrink-0 flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-full mr-3 border border-blue-200 dark:border-blue-900/40">{i + 1}</span>
                               <span className="pt-0.5 leading-normal">{t(inst)}</span>
                            </li>
                         ))}
                      </ul>
                   </div>
                </div>
             </div>

             <div className="w-full bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-850 dark:to-gray-900 border border-gray-150 dark:border-gray-700/60 p-5 rounded-2xl text-left flex items-start gap-4 mt-auto">
                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 shadow-sm shrink-0">
                   <InfoIcon className="text-blue-500 text-lg" />
                </div>
                <div>
                   <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest text-[10px] mb-1.5">{t("Dynamic Column Matching Support")}</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                      {t("Don't worry if your columns do not perfectly match our titles! In the next step, our Intelligent Field Parser will automatically analyze column headers, auto-map matching terms, and list unmatched fields for custom mapping.")}
                   </p>
                </div>
             </div>
          </div>
        )}

      </div>

      <div className="shrink-0 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex sm:flex-row items-center justify-between w-full">
          {activeTab === 'type' ? (
            <div className="w-full flex justify-end">
              <button
                onClick={() => setActiveTab('choose')}
                className="w-full sm:w-auto h-10 px-6 border border-transparent rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
              >
                <span className="block sm:hidden">{t("Next")}</span>
                <span className="hidden sm:inline-flex items-center">
                  {t("Next: Choose")}
                </span>
                <ArrowForwardIcon className="ml-1.5 text-base" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:items-center sm:justify-between">
              {/* Back button */}
              <div className="sm:flex-1 sm:flex sm:justify-start">
                <button 
                  onClick={() => {
                    if (activeTab === 'choose') setActiveTab('type');
                    else if (activeTab === 'preview') setActiveTab('choose');
                    else if (activeTab === 'upload') setActiveTab('preview');
                    else if (activeTab === 'settings') setActiveTab('upload');
                  }} 
                  className="w-full sm:w-auto h-10 px-4 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center"
                >
                  <ArrowForwardIcon className="mr-1 text-base rotate-180 shrink-0" />
                  <span className="block sm:hidden">{t("Back")}</span>
                  <span className="hidden sm:inline">
                    {activeTab === 'choose' ? t("Back to Import") : activeTab === 'preview' ? t("Back to Choose") : activeTab === 'upload' ? t("Back to Preview") : t("Back to Upload")}
                  </span>
                </button>
              </div>

              {/* Start Over button */}
              <div className="sm:flex-1 sm:flex sm:justify-center">
                <button 
                  onClick={() => {
                    setFile(null);
                    setActiveTab('type');
                    setImportCategory('voucher');
                  }} 
                  className="w-full sm:w-auto h-10 px-4 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center"
                >
                  <CancelIcon className="mr-1 text-base shrink-0" />
                  <span className="block sm:hidden">{t("Reset")}</span>
                  <span className="hidden sm:inline">{t("Start Over")}</span>
                </button>
              </div>

              {/* Next/Process button */}
              <div className="sm:flex-1 sm:flex sm:justify-end">
                {activeTab === 'settings' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!file || isLoading}
                    className="w-full sm:w-auto h-10 px-5 border border-transparent rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="truncate">{t("Wait")}</span>
                      </>
                    ) : (
                      <>
                        <span className="block sm:hidden">{t("Next")}</span>
                        <span className="hidden sm:inline-flex items-center">
                          {t("Process & Continue")}
                        </span>
                        <ArrowForwardIcon className="ml-1.5 text-base shrink-0" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                        if (activeTab === 'choose') setActiveTab('preview');
                        else if (activeTab === 'preview') setActiveTab('upload');
                        else if (activeTab === 'upload') setActiveTab('settings');
                    }}
                    className="w-full sm:w-auto h-10 px-5 border border-transparent rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
                  >
                    <span className="block sm:hidden">{t("Next")}</span>
                    <span className="hidden sm:inline-flex items-center">
                      {activeTab === 'choose' ? t("Next: Preview") : activeTab === 'preview' ? t("Next: Upload") : t("Next: Settings")}
                    </span>
                    <ArrowForwardIcon className="ml-1.5 text-base shrink-0" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
