
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { VoucherType, ParsingSettings } from '../../../types';

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

  const [activeMobileTab, setActiveMobileTab] = useState<'upload' | 'info'>('upload');

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="md:hidden flex space-x-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shrink-0">
        <button
          onClick={() => setActiveMobileTab('upload')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeMobileTab === 'upload' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Upload & Map
        </button>
        <button
          onClick={() => setActiveMobileTab('info')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeMobileTab === 'info' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Info & Settings
        </button>
      </div>

      <div className="form-grid flex-1 min-h-0 flex flex-col md:grid gap-4 sm:gap-6 overflow-hidden pb-4 md:pb-0">
        <div className={`flex-1 md:col-span-2 bg-white dark:bg-gray-800 px-5 sm:px-10 py-6 sm:py-9 rounded-3xl sm:rounded-[2.5rem] border border-premium-slate-100 dark:border-gray-700 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none flex-col min-h-0 overflow-y-auto custom-scrollbar relative group/main shrink-0 md:shrink ${activeMobileTab === 'upload' ? 'flex' : 'hidden md:flex'}`}>

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm" role="alert">
              <div className="shrink-0 p-2 bg-red-100 rounded-xl mr-4">
                <InfoIcon className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <p className="font-black uppercase tracking-widest text-[10px] mb-1">Critical Processing Error</p>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <button onClick={clearError} className="shrink-0 p-2 hover:bg-red-100 rounded-xl transition-colors">
                <CancelIcon className="text-xl" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-10 shrink-0">
             <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none font-display dark:text-white">Data Entry Origin</h2>
                <div className="flex items-center mt-3 space-x-2">
                    <div className="flex -space-x-1">
                        {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full border border-white ${i === 1 ? 'bg-blue-400' : 'bg-gray-200'} dark:bg-gray-700`}></div>)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600/80 bg-blue-50/50 px-2 py-0.5 rounded-full border border-blue-100/50">Pipeline Alpha</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Classify document & ingest record</p>
                </div>
             </div>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5 px-1">
                <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">System Classification</label>
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
                      : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:bg-premium-slate-50 hover:text-blue-600 active:scale-95'
                  }`}
                >
                  <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${voucherType === item.type ? `w-full ${item.accent}` : 'w-0 bg-blue-400'}`}></div>
                  <item.icon className={`text-xl mb-2 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-0.5 ${voucherType === item.type ? 'scale-110 -translate-y-0.5' : ''}`} />
                  <span className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{item.type}</span>
                </button>
              ))}
            </div>
            
            {voucherType === VoucherType.BankStatement && (
              <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start">
                  <InfoIcon className="text-indigo-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900">Raw Bank Import</h4>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      Importing a bank statement will automatically extract individual transaction lines. 
                      These will be presented as individual vouchers for your review and ledger mapping.
                    </p>
                  </div>
                </div>

                <div className="form-field-wrapper">
<label className="form-label px-1">Select Bank Source (Mandatory)</label>
                  <select 
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="">-- Choose Indian Major Bank --</option>
                    {bankMasters.map(bank => (
                      <option key={bank.name} value={bank.name}>{bank.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'} dark:border-gray-600 dark:bg-gray-800`}
          >
            <div className="flex flex-col items-center">
              <UploadFileIcon className="text-5xl text-gray-400 mb-4" />
              <p className="mb-2 text-gray-600 dark:text-gray-300">Drag & drop files here</p>
              <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">PDF, Excel, JPG, PNG</p>
              <label htmlFor="file-upload" className="cursor-pointer bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                Browse Files
              </label>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png"/>
            </div>
          </div>
          
          {file && (
            <div className="mt-8 p-6 bg-premium-slate-50 rounded-[2rem] border border-premium-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-start">
                    <div className="shrink-0 w-16 h-16 bg-white rounded-2xl border border-premium-slate-200 flex items-center justify-center shadow-sm dark:bg-gray-800 dark:border-gray-600">
                        {React.cloneElement(getFileIcon(file.name) as React.ReactElement, { className: 'text-3xl ' + (getFileIcon(file.name) as React.ReactElement).props.className })}
                    </div>
                    <div className="ml-5 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-black text-gray-900 truncate tracking-tight dark:text-white">{file.name}</h4>
                            <span className="shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-md tracking-widest border border-blue-200">Live Asset</span>
                        </div>
                        <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <span className="text-[10px] uppercase font-bold tracking-widest mr-1.5 opacity-50">Type</span>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{file.name.split('.').pop()?.toUpperCase() || 'Unknown'}</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <span className="text-[10px] uppercase font-bold tracking-widest mr-1.5 opacity-50">Volume</span>
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
          
          {file && (
            <div className="mt-8 border-t pt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Source Options</h3>
                {isStructuredFile && (
                  <button 
                    onClick={() => setShowMapping(!showMapping)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <EditIcon className="mr-1 text-base" />
                    {showMapping ? 'Hide Mapping' : 'Manual Column Mapping'}
                  </button>
                )}
              </div>
              
              {showMapping && isStructuredFile ? (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300 dark:bg-gray-900 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4 dark:border-gray-700">
                    <div className="flex items-start">
                      <SettingsIcon className="text-blue-500 mr-2 mt-0.5 scale-90" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">Identify Header Row</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Choose which row contains column names</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                      <span className="text-xs font-medium text-gray-500 ml-2 dark:text-gray-400">Row Index:</span>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={headerRowIndex}
                        onChange={(e) => setHeaderRowIndex(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 p-1 text-center font-bold text-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <InfoIcon className="text-blue-500 mr-2 mt-0.5" />
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Map the columns from your Excel file to the corresponding fields in Bharat Book. 
                      Our AI will use these hints to improve parsing accuracy.
                    </p>
                  </div>
                  
                  <div className="form-grid gap-4">
                    {Object.keys(mappings).map((targetField) => (
                      <div key={targetField}>
                        <label className="form-label tracking-wider dark:text-gray-400">
                          {targetField.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <select 
                          value={mappings[targetField]}
                          onChange={(e) => setMappings(prev => ({ ...prev, [targetField]: e.target.value }))}
                          className="form-input text-sm border-gray-300 rounded focus:ring-1 dark:border-gray-600"
                        >
                          <option value="">-- Auto-detect --</option>
                          {(fileHeaders.length > 0 ? fileHeaders : []).map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={clearMappings}
                      className="text-xs font-semibold text-gray-500 hover:text-red-500 flex items-center transition-colors px-3 py-1.5 rounded-md hover:bg-red-50 dark:text-gray-400"
                    >
                      <UndoIcon className="mr-1.5 text-sm" />
                      Clear All Mappings
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                  {previewContent}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`flex-1 md:flex-none flex-col bg-blue-50 p-4 sm:p-6 rounded-xl space-y-4 overflow-y-auto scrollbar-thin shrink-0 md:shrink border border-blue-100 ${activeMobileTab === 'info' ? 'flex' : 'hidden md:flex'}`}>
          <div>
            <div className="flex items-center text-blue-700 mb-4">
              <InfoIcon className="mr-3 text-2xl" />
              <h3 className="text-lg font-bold">AI Suggestions</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside dark:text-gray-300">
              <li>For best results, upload clear, high-resolution images or machine-readable PDFs.</li>
              <li>Ensure the voucher type matches the uploaded document.</li>
              <li>Our AI will attempt to automatically recognize all fields.</li>
              {file && <li className="font-semibold text-green-700 mt-4">AI analysis ready. Proceed to the next step to review extracted data.</li>}
            </ul>
          </div>

          <div className="pt-6 border-t border-blue-200">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center text-blue-800 font-bold hover:text-blue-900 transition-colors w-full justify-between"
            >
              <div className="flex items-center">
                <SettingsIcon className="mr-2" />
                Advanced Parsing Settings
              </div>
              <EditIcon className={`text-sm transform transition-transform ${showSettings ? 'rotate-90' : ''}`} />
            </button>

            {showSettings && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-white/40 p-4 rounded-xl border border-blue-100/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <label className="block text-xs font-black text-blue-700 uppercase tracking-wider">OCR Sensitivity ({parsingSettings.ocrSensitivity}%)</label>
                      <div className="group relative">
                        <InfoIcon className="w-3.5 h-3.5 text-blue-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3 bg-gray-900/95 backdrop-blur shadow-2xl text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 border border-gray-700">
                          <p className="font-bold mb-1 text-blue-400 uppercase tracking-tighter">OCR Precision Engine</p>
                          <p className="leading-relaxed opacity-90">Higher sensitivity (80%+) triggers deep multi-pass scanning for blurry text, handwritten notes, or low-contrast backgrounds. Use lower values for fast processing of clean digital PDFs.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={parsingSettings.ocrSensitivity}
                    onChange={(e) => setParsingSettings(prev => ({ ...prev, ocrSensitivity: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-blue-500 font-bold mt-1">
                    <span>Performance Focus</span>
                    <span>Accuracy Focus</span>
                  </div>
                  <p className="text-[10px] text-blue-600/70 mt-3 italic leading-relaxed">
                    <strong>Impact:</strong> Low sensitivity is faster for clean digital PDFs. High sensitivity (80%+) is required for handwritten notes or mobile snapshots.
                  </p>
                </div>

                <div className="bg-white/40 p-4 rounded-xl border border-blue-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-xs font-black text-blue-700 uppercase tracking-wider">AI Model Engine</label>
                    <div className="group relative">
                      <InfoIcon className="w-3.5 h-3.5 text-blue-400 cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3 bg-gray-900/95 backdrop-blur shadow-2xl text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 border border-gray-700">
                        <p className="font-bold mb-1 text-blue-400 uppercase tracking-tighter">Model Intelligence</p>
                        <p className="leading-relaxed opacity-90"><strong>Flash</strong> is optimized for speed (&lt;5s). <strong>Pro</strong> handles complex multi-page logic &amp; multi-column tables. Select based on document complexity and volume.</p>
                      </div>
                    </div>
                  </div>
                  <select 
                    value={parsingSettings.aiModel}
                    onChange={(e) => setParsingSettings(prev => ({ ...prev, aiModel: e.target.value as any }))}
                    className="form-input text-sm font-bold border-blue-200 shadow-sm"
                  >
                    <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Default - Balanced)</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Deep Reasoning & Multi-page)</option>
                    <option value="Vision Transformer-L">Vision Transformer-L (Best for Complex Tables)</option>
                  </select>
                  <p className="text-[10px] text-blue-600/70 mt-3 italic leading-relaxed">
                    <strong>Impact:</strong> <strong>Flash</strong> provides sub-5s response times. <strong>Pro</strong> is recommended for legal documents or multi-page invoices with hundreds of line items.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-blue-100/50">
                  <div className="text-xs pr-4">
                    <p className="font-bold text-blue-800">Experimental Vision Engine</p>
                    <p className="text-[10px] text-blue-600 font-medium">Enhanced layout recovery & tabular structure detection</p>
                  </div>
                  <button 
                    onClick={() => setParsingSettings(prev => ({ ...prev, experimentalFeatures: !prev.experimentalFeatures }))}
                    className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${parsingSettings.experimentalFeatures ? 'bg-blue-600 shadow-inner' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${parsingSettings.experimentalFeatures ? 'left-7' : 'left-1'} dark:bg-gray-800`} />
                  </button>
                </div>

                <div className="bg-white/40 p-4 rounded-xl border border-blue-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-xs font-black text-blue-700 uppercase tracking-wider">Custom Extraction Cues</label>
                    <div className="group relative">
                      <InfoIcon className="w-3.5 h-3.5 text-blue-400 cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3 bg-gray-900/95 backdrop-blur shadow-2xl text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 border border-gray-700">
                        <p className="font-bold mb-1 text-blue-400 uppercase tracking-tighter">Context Steering</p>
                        <p className="leading-relaxed opacity-90">Directly guide the AI's logic. (e.g., "Look for party GSTIN in header", "Ignore totals if they include tax"). These cues significantly improve accuracy for non-standard formats.</p>
                      </div>
                    </div>
                  </div>
                  <textarea 
                    value={parsingSettings.customInstructions}
                    onChange={(e) => setParsingSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
                    placeholder="e.g. 'Always look for GSTIN in the footer', 'Ignore previous balance in total'..."
                    className="form-input h-24 text-sm font-medium p-4 border-blue-200 resize-none placeholder-blue-300 shadow-inner"
                  />
                  <p className="text-[10px] text-blue-600/70 mt-3 italic leading-relaxed">
                    <strong>Impact:</strong> These instructions are injected into the AI prompt. Use them to clarify ambiguous fields or handle specific accounting quirks of certain vendors.
                  </p>
                </div>

                <div className="bg-white/40 p-4 rounded-xl border border-blue-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-xs font-black text-blue-700 uppercase tracking-wider">Custom AI Instructions</label>
                    <div className="group relative">
                      <InfoIcon className="w-3.5 h-3.5 text-blue-400 cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3 bg-gray-900/95 backdrop-blur shadow-2xl text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 border border-gray-700">
                        <p className="font-bold mb-1 text-blue-400 uppercase tracking-tighter">AI Processing Rule</p>
                        <p className="leading-relaxed opacity-90">Custom AI instructions specific to the parsing process. These are appended to the main prompt.</p>
                      </div>
                    </div>
                  </div>
                  <textarea 
                    value={parsingSettings.customAiInstructions || ''}
                    onChange={(e) => setParsingSettings(prev => ({ ...prev, customAiInstructions: e.target.value }))}
                    placeholder="Input custom AI instructions for the parsing process..."
                    className="form-input h-24 text-sm font-medium p-4 border-blue-200 resize-none placeholder-blue-300 shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t">
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            <CancelIcon className="mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Next
                <ArrowForwardIcon className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
