import { useState, useEffect, useMemo } from 'react';
import { ParsedVoucher, VoucherField, Confidence, VoucherType } from '../../../../app/types';
import { allowedFieldsSchema } from './types';

export const useCorrectionLogic = (
  vouchers: ParsedVoucher[],
  setVouchers: React.Dispatch<React.SetStateAction<ParsedVoucher[]>>,
  partyMasters: any[],
  ledgerMasters: any[],
  itemMasters: any[],
  uomMasters: any[],
  voucherType: VoucherType,
  allVouchers: ParsedVoucher[] = [],
  onSaveDraft: (vouchers: ParsedVoucher[]) => void,
  propActiveTab?: 'unmap' | 'missing' | 'automate',
  onTabChange?: (tab: 'unmap' | 'missing' | 'automate') => void
) => {
  const [activeVoucherIndex, setActiveVoucherIndex] = useState(0);
  const [localActiveTab, setLocalActiveTab] = useState<'unmap' | 'missing' | 'automate'>('automate');
  const activeTab = propActiveTab || localActiveTab;

  const setActiveTab = (tab: 'unmap' | 'missing' | 'automate') => {
    setLocalActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [expandedRateGroups, setExpandedRateGroups] = useState<Record<number, boolean>>({});
  const [newlyAddedItemIndex, setNewlyAddedItemIndex] = useState<number | null>(null);
  const [isTaxAnalysisExpanded, setIsTaxAnalysisExpanded] = useState(true);
  const [activeRowMenuIndex, setActiveRowMenuIndex] = useState<number | null>(null);

  // Categorize vouchers based on unmapped, missing masters, or automated matches
  const categorizedVouchers = useMemo(() => {
    const unmap: ParsedVoucher[] = [];
    const missing: ParsedVoucher[] = [];
    const automate: ParsedVoucher[] = [];

    (vouchers || []).forEach(v => {
      const fields = [v.partyName, v.ledger, v.toAccount, v.fromAccount];
      const hasValue = fields.some(f => f?.value && String(f.value).trim().length > 0);
      const hasMismatch = fields.some(f => f?.value && f.isMismatch);
      
      const isAutomated = hasValue && !hasMismatch;
      const isMissing = hasValue && hasMismatch;

      if (isAutomated) {
        automate.push(v);
      } else if (isMissing) {
        missing.push(v);
      } else {
        unmap.push(v);
      }
    });

    return { unmap, missing, automate };
  }, [vouchers]);

  // Current filtered list based on tab
  const tabVouchers = categorizedVouchers[activeTab];
  
  // Ensure we don't have an out-of-bounds index when switching tabs
  useEffect(() => {
    if (activeVoucherIndex >= tabVouchers.length) {
      setActiveVoucherIndex(0);
    }
  }, [activeTab, tabVouchers.length, activeVoucherIndex]);

  const activeVoucher = tabVouchers[activeVoucherIndex];

  const allItemNames = useMemo(() => {
    const currentVoucherItems = (vouchers || []).flatMap(v => (v.items || []).map(i => i.name?.value ? String(i.name.value) : ''));
    const historicalItems = (allVouchers || []).flatMap(v => (v.items || []).map(i => i.name?.value ? String(i.name.value) : ''));
    const masterItems = (itemMasters || []).map(m => m.name);
    return Array.from(new Set([...currentVoucherItems, ...historicalItems, ...masterItems])).filter(Boolean);
  }, [vouchers, allVouchers, itemMasters]);

  const safeNum = (val: any) => {
    const num = Number(val);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  const safeRound = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  const parseNumericValue = (val: any) => {
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  useEffect(() => {
    // Initial validation for essential fields and master linking across all vouchers
    const validatedVouchers = (vouchers || []).map(v => {
      const updatedV = { ...v };

      // Auto-sync bank amounts on load to prevent validation errors
      if (v.origin === 'bank') {
        const w = Number(v.withdrawalAmount?.value || 0);
        const d = Number(v.depositAmount?.value || 0);
        const currentAmt = Number(v.amount?.value || 0);
        if (currentAmt === 0 && (w > 0 || d > 0)) {
          updatedV.amount = { 
            value: w || d, 
            confidence: Confidence.High, 
            isMismatch: false, 
            suggestion: 'Auto-populated from Bank amounts' 
          };
        }
      }

      const essentialFields = (() => {
        switch(v.type) {
          case VoucherType.Purchase:
          case VoucherType.Sales: return ['date', 'amount', 'ledger', 'invoiceNumber', 'partyName'];
          case VoucherType.Payment:
          case VoucherType.Receipt: return ['date', 'amount'];
          case VoucherType.Journal: return ['date', 'amount', 'debitLedger', 'creditLedger'];
          case VoucherType.Contra: return ['date', 'amount', 'fromAccount', 'toAccount'];
          case VoucherType.BankStatement: return ['date', 'narration', 'amount', 'partyName'];
          default: return ['date', 'amount'];
        }
      })();

      essentialFields.forEach(key => {
        const fieldData = updatedV[key as keyof ParsedVoucher] as VoucherField;
        if (!fieldData) return;
        const field = { ...fieldData };
        const isEmpty = !String(field.value || '').trim() || (key === 'amount' && Number(field.value) <= 0);
        
        if (isEmpty) {
          field.isMismatch = true;
          field.suggestion = `${key.replace(/([A-Z])/g, ' $1')} is required for ${v.type} posting. Please provide a valid value.`;
        } else if (key === 'partyName') {
          const s = String(field.value).toLowerCase();
          const party = partyMasters.find(m => m.name.toLowerCase() === s);
          if (!party) {
            field.isMismatch = true;
            // Enhanced suggestion: Check for fuzzy matches
            const fuzzyMatch = partyMasters.find(m => {
              const name = m.name.toLowerCase();
              return name.includes(s) || s.includes(name);
            });
            field.suggestion = fuzzyMatch 
              ? `"${field.value}" not found. Did you mean "${fuzzyMatch.name}"? If not, use the Create and link button to add it.`
              : `"${field.value}" is not in your masters. Use the Create and link button to link it for future vouchers.`;
          }
        } else if (['ledger', 'debitLedger', 'creditLedger', 'fromAccount', 'toAccount'].includes(key)) {
          const s = String(field.value).toLowerCase();
          const ledger = ledgerMasters.find(m => m.name?.toLowerCase() === s);
          if (!ledger) {
            field.isMismatch = true;
            const fuzzyMatch = ledgerMasters.find(m => {
              const name = m.name?.toLowerCase() || '';
              return name.includes(s) || s.includes(name);
            });
            field.suggestion = fuzzyMatch
              ? `Ledger mismatch. Suggested: "${fuzzyMatch.name}". Alternatively, use Create and link to add ${field.value}.`
              : `Ledger "${field.value}" is untracked. Click Create and link to add it to your chart of accounts.`;
          }
        } else {
          // Provide explicit clears for when changes cascade into validity
          field.isMismatch = false;
          field.suggestion = undefined;
        }
        
        (updatedV[key as keyof ParsedVoucher] as any) = field;
      });

      // Item Validation in initial load
      if (updatedV.items) {
        updatedV.items = (updatedV.items || []).map(item => {
          const validatedItem = { ...item };
          
          // Name validation
          if (!validatedItem.name || !String(validatedItem.name.value).trim()) {
            validatedItem.name = { ...(validatedItem.name || { value: '', confidence: Confidence.High }), isMismatch: true, suggestion: 'Item name is required' };
          }
          
          // Rate validation
          if (!validatedItem.rate || Number(validatedItem.rate.value) <= 0) {
            validatedItem.rate = { ...(validatedItem.rate || { value: 0, confidence: Confidence.High }), isMismatch: true, suggestion: 'Rate must be a positive number' };
          } else {
            validatedItem.rate = { ...validatedItem.rate, isMismatch: false, suggestion: undefined };
          }
          
          // Quantity validation
          if (!validatedItem.quantity || Number(validatedItem.quantity.value) <= 0) {
            validatedItem.quantity = { ...(validatedItem.quantity || { value: 0, confidence: Confidence.High }), isMismatch: true, suggestion: 'Quantity must be a positive number' };
          } else {
            validatedItem.quantity = { ...validatedItem.quantity, isMismatch: false, suggestion: undefined };
          }
          
          // UOM validation
          const isContra = voucherType === VoucherType.Contra;
          const hasNoUom = !validatedItem.uom || !String(validatedItem.uom.value).trim();
          if (!isContra && hasNoUom) {
            validatedItem.uom = { ...(validatedItem.uom || { value: '', confidence: Confidence.High }), isMismatch: true, suggestion: 'Unit of measurement (UOM) is required' };
          } else if (!hasNoUom) {
            validatedItem.uom = { ...validatedItem.uom, isMismatch: false, suggestion: undefined };
          }
          
          return validatedItem;
        });
      }

      return updatedV;
    });
    
    // Check if initial validation changed any isMismatch states or suggestions
    const hasInitialErrors = validatedVouchers.some((v, idx) => {
      const original = vouchers[idx];
      if (!original) return true;
      
      // Check voucher fields
      const voucherFieldsChanged = Object.keys(v).some(key => {
        if (key === 'items' || key === 'id' || key === 'type') return false;
        const vField = v[key as keyof ParsedVoucher] as VoucherField;
        const oField = original[key as keyof ParsedVoucher] as VoucherField;
        
        if (!vField || !oField) return vField !== oField;
        return vField.isMismatch !== oField.isMismatch || vField.suggestion !== oField.suggestion;
      });

      if (voucherFieldsChanged) return true;

      // Check items
      if ((v.items?.length || 0) !== (original.items?.length || 0)) return true;
      return (v.items || []).some((item, iIndex) => {
        const oItem = (original.items || [])[iIndex];
        if (!oItem) return true;
        return ['name', 'rate', 'quantity', 'uom'].some(fieldName => {
          const vF = (item as any)[fieldName] as VoucherField;
          const oF = (oItem as any)[fieldName] as VoucherField;
          if (!vF || !oF) return vF !== oF;
          return vF.isMismatch !== oF.isMismatch || vF.suggestion !== oF.suggestion;
        });
      });
    });

    if (hasInitialErrors) {
      setVouchers(validatedVouchers);
    }
  }, [partyMasters, ledgerMasters]);

  const handleAddItem = () => {
    if (!activeVoucher) return;
    
    const ledgerValue = String(activeVoucher.ledger?.value || '');
    const gstinValue = String(activeVoucher.gstin?.value || '');
    const isInterFromGstin = gstinValue.length >= 2 && gstinValue.substring(0, 2) !== '27';
    // Use supplyType if set, otherwise fallback to logic
    const isInterState = activeVoucher.supplyType?.value === 'Inter-State' || 
                        ledgerValue.includes('IGST') || ledgerValue.includes('Inter') || isInterFromGstin;
    const defaultTaxType = isInterState ? 'IGST' : 'CGST/SGST';

    const newItem = {
      name: { value: '', confidence: Confidence.High },
      quantity: { value: 1, confidence: Confidence.High },
      rate: { value: 0, confidence: Confidence.High },
      uom: { value: 'Nos', confidence: Confidence.High },
      taxRate: { value: 18, confidence: Confidence.High },
      taxType: { value: defaultTaxType, confidence: Confidence.High },
      tax: { value: 0, confidence: Confidence.High },
      total: { value: 0, confidence: Confidence.High }
    };

    const newVouchers = vouchers.map(v => {
      if (v.id === activeVoucher.id) {
        const updatedItems = [...v.items, newItem];
        return { ...v, items: updatedItems };
      }
      return v;
    });

    setVouchers(newVouchers);
    setNewlyAddedItemIndex(newVouchers.find(v => v.id === activeVoucher.id)?.items.length! - 1);
  };

  const handleDuplicateItem = (itemIndex: number) => {
    if (!activeVoucher) return;
    const itemToDuplicate = activeVoucher.items[itemIndex];
    if (!itemToDuplicate) return;
    const newItem = JSON.parse(JSON.stringify(itemToDuplicate));
    
    const newVouchers = vouchers.map(v => {
      if (v.id === activeVoucher.id) {
        const updatedItems = [...v.items];
        updatedItems.splice(itemIndex + 1, 0, newItem);
        
        // Recalculate Voucher-level totals
        const voucherTax = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.tax?.value), 0));
        const voucherTotal = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.total?.value), 0));
        
        return { 
          ...v, 
          items: updatedItems,
          tax: { ...v.tax, value: voucherTax, confidence: Confidence.High },
          amount: { ...v.amount, value: voucherTotal, confidence: Confidence.High }
        };
      }
      return v;
    });

    setVouchers(newVouchers);
    setActiveRowMenuIndex(null);
  };

  const handleDeleteItem = (itemIndex: number) => {
    if (!activeVoucher || activeVoucher.items.length <= 1) return;
    
    const newVouchers = vouchers.map(v => {
      if (v.id === activeVoucher.id) {
        const updatedItems = [...v.items];
        updatedItems.splice(itemIndex, 1);
        
        // Recalculate Voucher-level totals
        const voucherTax = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.tax?.value), 0));
        const voucherTotal = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.total?.value), 0));
        
        return { 
          ...v, 
          items: updatedItems,
          tax: { ...v.tax, value: voucherTax, confidence: Confidence.High },
          amount: { ...v.amount, value: voucherTotal, confidence: Confidence.High }
        };
      }
      return v;
    });

    setVouchers(newVouchers);
    setActiveRowMenuIndex(null);
  };

  const toggleRateGroup = (rate: number) => {
    setExpandedRateGroups(prev => ({
      ...prev,
      [rate]: !prev[rate]
    }));
  };

  const handleFieldChange = (voucherId: string, fieldName: string, newValue: string | number, itemIndex?: number, masterData?: any) => {
    const newVouchers = vouchers.map(v => {
      if (v.id === voucherId) {
        let updatedVoucher = { ...v };
        
        if (itemIndex !== undefined && v.items[itemIndex]) {
          const updatedItems = [...v.items];
          const item = { ...updatedItems[itemIndex] };
          
          const fieldKey = fieldName as keyof typeof item;
          if (item[fieldKey] && typeof item[fieldKey] === 'object') {
            (item as any)[fieldKey] = { ...(item[fieldKey] as object), value: newValue };
          } else {
            (item as any)[fieldKey] = { value: newValue, confidence: Confidence.High };
          }
          
          // Item-level Validations
          if (fieldName === 'rate' || fieldName === 'quantity') {
            const val = safeNum(newValue);
            const fk = fieldName as 'rate' | 'quantity';
            if (val <= 0) {
              item[fk] = { ...item[fk], isMismatch: true, suggestion: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be a positive number` };
            } else {
              item[fk] = { ...item[fk], isMismatch: false, suggestion: undefined };
            }
          }

          if (fieldName === 'name') {
            if (!String(newValue).trim()) {
              item.name = { ...item.name, isMismatch: true, suggestion: 'Item name is required' };
            } else {
              item.name = { ...item.name, isMismatch: false, suggestion: undefined };
            }
          }

          if (fieldName === 'uom') {
            const isContra = voucherType === VoucherType.Contra;
            const isEmpty = !String(newValue).trim();
            if (isEmpty && !isContra) {
              item.uom = { ...(item.uom || { value: '', confidence: Confidence.High }), isMismatch: true, suggestion: 'Unit of measurement (UOM) is required' };
            } else {
              item.uom = { ...(item.uom || { value: '', confidence: Confidence.High }), value: newValue, isMismatch: false, suggestion: undefined };
            }
          }

          // Recalculate item totals if quantity, rate, taxRate, or tax change
          if (['quantity', 'rate', 'taxRate', 'tax'].includes(fieldName)) {
            const qty = safeNum(item.quantity?.value);
            const rateVal = safeNum(item.rate?.value);
            const taxRateVal = safeNum(item.taxRate?.value);
            
            const net = safeRound(qty * rateVal);
            let tax = safeNum(item.tax?.value);

            if (fieldName !== 'tax') {
              tax = safeRound((net * taxRateVal) / 100);
              item.tax = { ...item.tax, value: tax, confidence: Confidence.High, isMismatch: false };
            } else {
              item.tax = { ...item.tax, value: tax, confidence: Confidence.High, isMismatch: false };
            }

            if (fieldName === 'taxRate') {
              if (taxRateVal <= 0) {
                item.taxRate = { 
                  ...item.taxRate, 
                  isMismatch: true, 
                  suggestion: taxRateVal < 0 ? 'Tax rate cannot be negative' : 'Zero tax rate detected. Please verify if this is correct.' 
                };
              } else {
                item.taxRate = { ...item.taxRate, isMismatch: false, suggestion: undefined };
              }
            }

            const total = safeRound(net + tax);
            item.total = { ...item.total, value: total, confidence: Confidence.High, isMismatch: false };
          }
          
          updatedItems[itemIndex] = item;
          updatedVoucher.items = updatedItems;

          // Recalculate Voucher-level totals based on items
          const voucherTax = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.tax?.value), 0));
          const voucherTotal = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.total?.value), 0));
          
          updatedVoucher.tax = { ...updatedVoucher.tax, value: voucherTax, confidence: Confidence.High };
          updatedVoucher.amount = { ...updatedVoucher.amount, value: voucherTotal, confidence: Confidence.High };

          // Re-validate totals
          const isAmountEmpty = !String(updatedVoucher.amount.value).trim();
          if (isAmountEmpty) {
            updatedVoucher.amount = { ...updatedVoucher.amount, isMismatch: true, suggestion: 'Voucher amount is required' };
          } else {
            updatedVoucher.amount = { ...updatedVoucher.amount, isMismatch: false, suggestion: undefined };
          }
        } else if (fieldName === 'type') {
          updatedVoucher = { 
            ...v, 
            type: newValue as VoucherType
          };
        } else {
          const isNumericField = ['amount', 'tax', 'withdrawalAmount', 'depositAmount', 'closingBalance'].includes(fieldName);
          const val = isNumericField ? parseNumericValue(newValue) : newValue;
          const targetField = (updatedVoucher as any)[fieldName] || { value: '', confidence: Confidence.High, isMismatch: false };
          
          updatedVoucher = { 
            ...v, 
            [fieldName]: { ...targetField, value: val } 
          };

          if (fieldName === 'supplyType') {
            const isInterState = String(val) === 'Inter-State';
            const newTaxType = isInterState ? 'IGST' : 'CGST/SGST';
            updatedVoucher.items = (updatedVoucher.items || []).map(item => ({
              ...item,
              taxType: {
                ...(item.taxType || { confidence: Confidence.High }),
                value: newTaxType,
                isMismatch: false,
                suggestion: 'Updated to match supply classification'
              }
            }));
          }

          // Validation for essential fields
          const essentialFields = (() => {
            switch(updatedVoucher.type) {
              case VoucherType.Purchase:
              case VoucherType.Sales: return ['date', 'amount', 'ledger', 'invoiceNumber', 'partyName'];
              case VoucherType.Payment:
              case VoucherType.Receipt: return ['date', 'amount'];
              case VoucherType.Journal: return ['date', 'amount', 'debitLedger', 'creditLedger'];
              case VoucherType.Contra: return ['date', 'amount', 'fromAccount', 'toAccount'];
              case VoucherType.BankStatement: return ['date', 'narration'];
              default: return ['date', 'amount'];
            }
          })();

          if (essentialFields.includes(fieldName)) {
            const isEmpty = !String(val).trim() || (fieldName === 'amount' && safeNum(val) <= 0);
            
            if (isEmpty) {
              (updatedVoucher[fieldName as keyof ParsedVoucher] as VoucherField).isMismatch = true;
              (updatedVoucher[fieldName as keyof ParsedVoucher] as VoucherField).suggestion = `${fieldName.replace(/([A-Z])/g, ' $1')} is required and cannot be empty`;
            } else {
              (updatedVoucher[fieldName as keyof ParsedVoucher] as VoucherField).isMismatch = false;
              (updatedVoucher[fieldName as keyof ParsedVoucher] as VoucherField).suggestion = undefined;
            }
          }

          // Auto-identify voucher type and populate amount/reference for bank statement origins
          if (v.origin === 'bank' && ['depositAmount', 'withdrawalAmount', 'narration', 'amount', 'referenceNo'].includes(fieldName)) {
            const dAmount = safeNum(updatedVoucher.depositAmount?.value);
            const wAmount = safeNum(updatedVoucher.withdrawalAmount?.value);
            const descStr = String(updatedVoucher.narration?.value || '').toLowerCase();
            
            const bankSum = dAmount || wAmount;
            if (bankSum > 0) {
              updatedVoucher.amount = { 
                value: bankSum, 
                confidence: Confidence.High, 
                isMismatch: false, 
                suggestion: 'Auto-synced from Bank fields' 
              };
            }

            if (!updatedVoucher.referenceNo?.value) {
              const refMatch = descStr.match(/ref[:.\s]+([a-zA-Z0-9]+)/i) || 
                               descStr.match(/(?:upi|imps|neft|rtgs|chq)[\/-]+([a-zA-Z0-9]+)/i);
              if (refMatch && refMatch[1]) {
                updatedVoucher.referenceNo = { value: refMatch[1], confidence: Confidence.High };
              }
            }
          }

          // If user manually changes total voucher amount or tax, check for consistency with items
          if ((fieldName === 'amount' || fieldName === 'tax') && updatedVoucher.items && updatedVoucher.items.length > 0) {
            const itemsTotal = safeRound(updatedVoucher.items.reduce((sum, i) => sum + safeNum(i.total?.value), 0));
            const itemsTax = safeRound(updatedVoucher.items.reduce((sum, i) => sum + safeNum(i.tax?.value), 0));
            
            if (fieldName === 'amount' && val !== itemsTotal) {
              updatedVoucher.amount = { ...updatedVoucher.amount, isMismatch: true, suggestion: `Total ₹${val} does not match items sum ₹${itemsTotal}` };
            } else if (fieldName === 'tax' && val !== itemsTax) {
              updatedVoucher.tax = { ...updatedVoucher.tax, isMismatch: true, suggestion: `Tax ₹${val} does not match items tax sum ₹${itemsTax}` };
            }
          }
        }

        // Auto-population logic
        if (masterData) {
          if (masterData.gstin) {
            updatedVoucher.gstin = { 
              ...(updatedVoucher.gstin || { confidence: Confidence.High, isMismatch: false }), 
              value: masterData.gstin,
              confidence: Confidence.High,
              isMismatch: false,
              suggestion: `Fetched from Master: ${masterData.name}`
            };
          }
          if (masterData.state || masterData.placeOfSupply) {
            updatedVoucher.placeOfSupply = {
              ...(updatedVoucher.placeOfSupply || { confidence: Confidence.High, isMismatch: false }),
              value: masterData.state || masterData.placeOfSupply,
              confidence: Confidence.High,
              isMismatch: false
            };
          }
          if (masterData.taxRate !== undefined) {
            const currentTotal = safeNum(updatedVoucher.amount?.value);
            const currentTax = safeNum(updatedVoucher.tax?.value);
            const baseAmount = safeRound(currentTotal - currentTax);
            
            const taxRateVal = safeNum(masterData.taxRate);
            const newTax = safeRound((baseAmount * taxRateVal) / 100);
            
            updatedVoucher.tax = { 
              ...updatedVoucher.tax, 
              value: newTax, 
              confidence: Confidence.High,
              isMismatch: false,
              suggestion: `Applied ${taxRateVal}% default tax for ${masterData.name}` 
            };
            updatedVoucher.amount = {
              ...updatedVoucher.amount,
              value: safeRound(baseAmount + newTax),
              confidence: Confidence.High,
              isMismatch: false
            };
          }
          if (masterData.terms) {
            updatedVoucher.partyName = {
              ...updatedVoucher.partyName,
              suggestion: `Credit Terms: ${masterData.terms}`
            };
          }
        }

        // Cascade supply-based tax rules for consistency
        if (updatedVoucher.items && ['ledger', 'gstin', 'partyName', 'placeOfSupply', 'billingState'].includes(fieldName)) {
          const ledgerVal = String(updatedVoucher.ledger?.value || '').toLowerCase();
          const gstinVal = String(updatedVoucher.gstin?.value || '');
          const posVal = String(updatedVoucher.placeOfSupply?.value || '').toLowerCase();
          
          const isInterFromGstin = gstinVal.length >= 2 && gstinVal.substring(0, 2) !== '27';
          const isInterFromPos = !!posVal && !posVal.includes('27') && !posVal.includes('maharashtra') && !posVal.includes('mh');
          
          const hasIgstKeyword = ledgerVal.includes('igst') || ledgerVal.includes('inter');
          const hasCgstKeyword = ledgerVal.includes('cgst') || ledgerVal.includes('sgst') || ledgerVal.includes('local') || ledgerVal.includes('intra') || (ledgerVal.includes('gst') && !ledgerVal.includes('igst'));
          
          let isInterState = isInterFromGstin || isInterFromPos;
          if (hasIgstKeyword) {
            isInterState = true;
          } else if (hasCgstKeyword) {
            isInterState = false;
          }

          const newSupplyType = isInterState ? 'Inter-State' : 'Intra-State';
          const newTaxType = isInterState ? 'IGST' : 'CGST/SGST';
          
          updatedVoucher.supplyType = {
            value: newSupplyType,
            confidence: Confidence.High,
            isMismatch: false,
            suggestion: `Auto-detected based on ${fieldName}`
          };

          updatedVoucher.items = updatedVoucher.items.map(item => {
            if (item.taxType?.value !== newTaxType) {
              return {
                ...item,
                taxType: {
                  ...(item.taxType || { confidence: Confidence.High }),
                  value: newTaxType,
                  isMismatch: false,
                  suggestion: `Auto-updated based on ${isInterState ? 'Inter-state' : 'Intra-state'} classification`
                }
              };
            }
            return item;
          });
        }
        
        // Log to AuditLogs
        let oldValue: any = '(Empty)';
        if (itemIndex !== undefined && v.items[itemIndex]) {
          oldValue = (v.items[itemIndex] as any)[fieldName]?.value;
        } else {
          oldValue = (v as any)[fieldName]?.value;
        }

        if (oldValue !== newValue) {
          const logEntry = {
            id: Date.now().toString() + Math.random().toString(16),
            action: 'Modified' as const,
            timestamp: new Date().toISOString(),
            author: 'Current User',
            changes: [{
              field: itemIndex !== undefined ? `Item ${itemIndex + 1} ${fieldName}` : fieldName,
              oldValue,
              newValue
            }]
          };
          updatedVoucher.auditLogs = [logEntry, ...(updatedVoucher.auditLogs || [])];
        }
        
        return updatedVoucher;
      }
      return v;
    });
    setVouchers(newVouchers);
  };

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    onSaveDraft(vouchers);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const hasItemsAndTax = !!activeVoucher && (activeVoucher.type === VoucherType.Purchase || activeVoucher.type === VoucherType.Sales);
  
  const hasErrors = (vouchers || []).some(v => {
    const vHasItems = (v.type === VoucherType.Purchase || v.type === VoucherType.Sales);
    let schema = [...(allowedFieldsSchema[v.type] || allowedFieldsSchema[VoucherType.Purchase])];
    if (v.origin === 'bank') {
      if (!schema.includes('withdrawalAmount')) schema.push('withdrawalAmount');
      if (!schema.includes('depositAmount')) schema.push('depositAmount');
      if (!schema.includes('closingBalance')) schema.push('closingBalance');
      if (!schema.includes('narration')) schema.push('narration');
    }
    
    const topLevelHasErrors = Object.entries(v || {}).some(([key, field]) => {
      if (!schema.includes(key)) return false;
      return typeof field === 'object' && field !== null && !Array.isArray(field) && (field as any).isMismatch;
    });
    
    return topLevelHasErrors || (vHasItems && (v.items || []).some(item => Object.values(item || {}).some(field => typeof field === 'object' && field !== null && !Array.isArray(field) && (field as any).isMismatch)));
  });

  const getTaxAnalysis = () => {
    if (!hasItemsAndTax || !activeVoucher || !activeVoucher.items) return [];
    const groups: Record<number, { taxableValue: number; taxAmount: number; items: { name: string; taxable: number; tax: number }[] }> = {};
    
    activeVoucher.items.forEach(item => {
      if (!item.taxRate || !item.quantity || !item.rate || !item.tax || !item.name) return;
      const rate = safeNum(item.taxRate.value);
      const qty = safeNum(item.quantity.value);
      const price = safeNum(item.rate.value);
      const taxable = safeRound(qty * price);
      const tax = safeNum(item.tax.value);
      
      if (!groups[rate]) {
        groups[rate] = { taxableValue: 0, taxAmount: 0, items: [] };
      }
      groups[rate].taxableValue = safeRound(groups[rate].taxableValue + taxable);
      groups[rate].taxAmount = safeRound(groups[rate].taxAmount + tax);
      groups[rate].items.push({
        name: String(item.name.value),
        taxable,
        tax
      });
    });
    
    return Object.entries(groups)
      .map(([rate, data]) => ({ rate: Number(rate), ...data }))
      .sort((a, b) => a.rate - b.rate);
  };

  const taxAnalysis = getTaxAnalysis();
  const totalTaxableAmount = safeRound(taxAnalysis.reduce((sum, group) => sum + group.taxableValue, 0));

  const totalCgst = safeRound(activeVoucher?.items?.reduce((sum, item) => 
    sum + (item.taxType?.value === 'CGST/SGST' ? safeNum(item.tax?.value) / 2 : 0), 0) || 0);
  const totalSgst = safeRound(activeVoucher?.items?.reduce((sum, item) => 
    sum + (item.taxType?.value === 'CGST/SGST' ? safeNum(item.tax?.value) / 2 : 0), 0) || 0);
  const totalIgst = safeRound(activeVoucher?.items?.reduce((sum, item) => 
    sum + (item.taxType?.value === 'IGST' ? safeNum(item.tax?.value) : 0), 0) || 0);
  const hasIgst = activeVoucher?.items?.some(item => item.taxType?.value === 'IGST') || false;

  return {
    activeVoucherIndex,
    setActiveVoucherIndex,
    activeTab,
    setActiveTab,
    saveStatus,
    setSaveStatus,
    expandedRateGroups,
    setExpandedRateGroups,
    toggleRateGroup,
    newlyAddedItemIndex,
    setNewlyAddedItemIndex,
    isTaxAnalysisExpanded,
    setIsTaxAnalysisExpanded,
    activeRowMenuIndex,
    setActiveRowMenuIndex,
    categorizedVouchers,
    tabVouchers,
    activeVoucher,
    allItemNames,
    handleAddItem,
    handleDuplicateItem,
    handleDeleteItem,
    handleFieldChange,
    handleSaveDraft,
    hasItemsAndTax,
    hasErrors,
    taxAnalysis,
    totalTaxableAmount,
    totalCgst,
    totalSgst,
    totalIgst,
    hasIgst,
    safeNum,
    safeRound
  };
};
