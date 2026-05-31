import { useState, useEffect, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { VoucherType } from '../../../../app/types';

interface UseFieldMapperProps {
  file: File | null;
  isStructuredFile: boolean;
  voucherType: VoucherType;
}

export const useFieldMapper = ({ file, isStructuredFile, voucherType }: UseFieldMapperProps) => {
  const [headerRowIndex, setHeaderRowIndex] = useState<number | undefined>(undefined);
  const [isMappingExpanded, setIsMappingExpanded] = useState(false);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[][]>([]);
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
        console.error("Failed to load metadata in useFieldMapper hook", e);
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
  }, [mappingKeys, fileHeaders, synonymsData]);

  const extractHeaders = useCallback((targetFile: File, requestedRowIndex?: number) => {
    const fileName = targetFile.name.toLowerCase();
    
    if (fileName.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          let data = JSON.parse(text);
          let rawRows: any[] = [];
          if (Array.isArray(data)) {
            rawRows = data;
          } else if (typeof data === 'object' && data !== null) {
            const keyWithArray = Object.keys(data).find(key => Array.isArray(data[key]));
            rawRows = keyWithArray ? data[keyWithArray] : [data];
          }
          if (rawRows.length > 0) {
            const keys = Object.keys(rawRows[0]);
            setFileHeaders(keys);
            setPreviewData(rawRows.slice(0, 5).map(row => keys.map(k => row[k])));
          }
        } catch (err) {
          console.error("Failed to parse JSON for preview");
        }
      };
      reader.readAsText(targetFile);
      return;
    }
    
    if (fileName.endsWith('.xml')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, "text/xml");
          const root = xmlDoc.documentElement;
          const rawRows: any[] = [];
          for (let i = 0; i < Math.min(10, root.children.length); i++) {
            const node = root.children[i];
            const rowObj: Record<string, any> = {};
            for (let j = 0; j < node.children.length; j++) {
              const child = node.children[j];
              rowObj[child.tagName] = child.textContent;
            }
            rawRows.push(rowObj);
          }
          if (rawRows.length > 0) {
            const keys = Object.keys(rawRows[0]);
            setFileHeaders(keys);
            setPreviewData(rawRows.slice(0, 5).map(row => keys.map(k => row[k])));
          }
        } catch (err) {
          console.error("Failed to parse XML for preview");
        }
      };
      reader.readAsText(targetFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        let rows: any[][] = [];
        try {
          const arrayBuffer = new Uint8Array(data as ArrayBuffer);
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        } catch (err) {
          console.error("Failed to read file buffer", err);
          return;
        }
        
        let targetRowIndex = requestedRowIndex !== undefined ? requestedRowIndex : 0;
        
        // Auto-detect header row if no specific row was requested
        if (requestedRowIndex === undefined) {
          const commonHeaderKeywords = metaData?.commonHeaderKeywords || ['date', 'amount', 'narration', 'description', 'reference', 'withdrawal', 'deposit', 'balance', 'particulars', 'invoice', 'party'];
          let bestMatchScore = -1;
          let bestRowIndex = 0;
          let firstNonEmptyRowIndex = -1;
          
          // Scan first 15 rows to find the one with the most likely headers
          for (let i = 0; i < Math.min(15, rows.length); i++) {
            if (!rows[i] || rows[i].length === 0) continue;
            
            const rowValues = rows[i].map(v => String(v || '').trim().toLowerCase());
            const nonEmptyCount = rowValues.filter(v => v.length > 0).length;
            if (nonEmptyCount >= 2 && firstNonEmptyRowIndex === -1) {
              firstNonEmptyRowIndex = i;
            }

            const rowStr = rows[i].map(String).join(' ').toLowerCase();
            let score = 0;
            commonHeaderKeywords.forEach((keyword: string) => {
              if (rowStr.includes(keyword)) score++;
            });
            
            if (score > bestMatchScore) {
              bestMatchScore = score;
              bestRowIndex = i;
            }
          }
          
          // If we found a row with at least 1 common header keyword, use it
          if (bestMatchScore >= 1) {
            targetRowIndex = bestRowIndex;
            setHeaderRowIndex(bestRowIndex);
          } else if (firstNonEmptyRowIndex !== -1) {
            targetRowIndex = firstNonEmptyRowIndex;
            setHeaderRowIndex(firstNonEmptyRowIndex);
          }
        }

        if (rows.length > targetRowIndex) {
          const headerIndices: number[] = [];
          const headers = rows[targetRowIndex].map((h, index) => {
            const val = String(h || '').trim();
            if (val) { headerIndices.push(index); }
            return val;
          }).filter(Boolean);

          setFileHeaders(headers);
          
          // Extract up to 5 sample rows for preview, pulling only the columns that have headers
          const sampleData = rows.slice(targetRowIndex + 1, Math.min(targetRowIndex + 6, rows.length))
            .map(row => headerIndices.map(idx => row[idx] !== undefined ? row[idx] : ''));
          setPreviewData(sampleData);
        } else {
          setFileHeaders([]);
          setPreviewData([]);
        }
      }
    };
    reader.readAsArrayBuffer(targetFile);
  }, [metaData]);

  useEffect(() => {
    if (file && isStructuredFile) {
      extractHeaders(file, headerRowIndex);
    } else {
      setFileHeaders([]);
      setPreviewData([]);
    }
  }, [file, isStructuredFile, extractHeaders, headerRowIndex]);

  const clearMappings = useCallback(() => {
    setMappings(mappingKeys);
  }, [mappingKeys]);

  return {
    headerRowIndex,
    setHeaderRowIndex,
    isMappingExpanded,
    setIsMappingExpanded,
    fileHeaders,
    setFileHeaders,
    previewData,
    setPreviewData,
    mappings,
    setMappings,
    metaData,
    clearMappings,
  };
};
