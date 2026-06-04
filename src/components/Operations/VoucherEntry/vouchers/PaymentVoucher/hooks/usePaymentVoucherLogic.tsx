import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { getNextVoucherNumber, incrementVoucherNumber } from '../../../../../../services/voucherNumbering';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { VoucherEntryViewProps } from '../types';
import { VoucherType } from '../../../../../../app/types';
import { NotificationType } from '../../../../../ui/Notification';
import { calculateRowAmountBeforePreTaxRoundOff, calculateRowAmount, getRowPostTaxDiscount, getRowRoundOff, getRowPreTaxRoundOff, calculateRowNetAmount } from '../../VoucherCalculations';


const safeJsonParse = <T,>(jsonString: string | null, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  try { return JSON.parse(jsonString) as T; } 
  catch (e) { return defaultValue; }
};

export const usePaymentVoucherLogic = (props: VoucherEntryViewProps) => {
  const { defaultType, initialVoucher, itemMasters = [], ledgerMasters = [], partyMasters = [], vouchers = [], onUpdateItemMaster, onAddItemMaster, onSaveEntry, onDeleteEntry, onOpenPrintSettings } = props;
  const { t, formatNumber } = useLanguage();

  const activeTab = 'payment' as string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setActiveTab = (tab: string) => {};
  
  

  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanningRowIndex, setScanningRowIndex] = useState<number | null>(null);
  
  const handleBarcodeScanned = (decodedText: string) => {
    setShowScanner(false);
    const item = itemMasters?.find(i => 
      i.name?.toLowerCase() === decodedText.toLowerCase() || 
      i.sku?.toLowerCase() === decodedText.toLowerCase() ||
      i.barcode?.toLowerCase() === decodedText.toLowerCase()
    );
    const matchedName = item ? (item.name || item.item_name) : decodedText;

    if (scanningRowIndex !== null && scanningRowIndex >= 0) {
      handleItemOrSkuChange(scanningRowIndex, matchedName, 'itemName');
    } else {
      const emptyRowIndex = rows.findIndex(r => !r.itemName);
      if (emptyRowIndex !== -1) {
        handleItemOrSkuChange(emptyRowIndex, matchedName, 'itemName');
      } else {
        const newIndex = rows.length;
        setRows([...rows, { id: Date.now(), itemName: matchedName }]);
        setTimeout(() => handleItemOrSkuChange(newIndex, matchedName, 'itemName'), 0);
      }
    }
  };
  
  React.useEffect(() => {
    if (initialVoucher) {
      setCurrentRecordId(initialVoucher.id || null);
      if (initialVoucher.header && initialVoucher.rows) {
        // Re-derive supplyType so loading a voucher correctly shows IGST/CGST
        const loadedHeader = { ...initialVoucher.header };
        const place = String(loadedHeader.placeOfSupply?.value || loadedHeader.placeOfSupply || '').trim().toLowerCase();
        const gstin = String(loadedHeader.gstNumber?.value || loadedHeader.gstNumber || '').trim();
        if (place) {
          const isLocal = ['maharashtra', 'mh', '27'].some(s => place.includes(s));
          loadedHeader.supplyType = isLocal ? 'Intra-State' : 'Inter-State';
        } else if (gstin.length >= 2) {
          loadedHeader.supplyType = gstin.substring(0, 2) !== '27' ? 'Inter-State' : 'Intra-State';
        }
        setHeaderDetails(loadedHeader);
        setRows(initialVoucher.rows);
        setActiveTab(initialVoucher.type || defaultType || 'sales');
      } else {
        const typeFromInit = (typeof initialVoucher.type === 'string' ? initialVoucher.type.toLowerCase().replace(/ /g, '_') : initialVoucher.type) || defaultType;
        if (typeFromInit) setActiveTab(typeFromInit);

        // Extract GST-critical fields from imported voucher data
        const importedPlaceOfSupply = initialVoucher.placeOfSupply?.value || initialVoucher.placeOfSupply || '';
        const importedGstin = initialVoucher.gstin?.value || initialVoucher.gstin || initialVoucher.gstNumber?.value || initialVoucher.gstNumber || '';
        const importedSupplyType = initialVoucher.supplyType?.value || initialVoucher.supplyType || '';
        let computedSupplyType = 'Intra-State';
        const posLower = String(importedPlaceOfSupply || '').trim().toLowerCase();
        if (posLower) {
          const isLocal = ['maharashtra', 'mh', '27'].some(s => posLower.includes(s));
          computedSupplyType = isLocal ? 'Intra-State' : 'Inter-State';
        } else if (importedGstin.length >= 2) {
          computedSupplyType = importedGstin.substring(0, 2) !== '27' ? 'Inter-State' : 'Intra-State';
        } else if (importedSupplyType) {
          computedSupplyType = importedSupplyType;
        }

        setHeaderDetails(prev => ({
          ...prev,
          voucherDate: initialVoucher.date?.value || initialVoucher.date || prev.voucherDate,
          voucherNumber: initialVoucher.invoiceNumber?.value || initialVoucher.invoiceNumber || getNextVoucherNumber(typeFromInit || 'sales') || '',
          partyName: initialVoucher.partyName?.value || initialVoucher.partyName || prev.partyName,
          narration: initialVoucher.narration?.value || initialVoucher.narration || prev.narration,
          placeOfSupply: importedPlaceOfSupply,
          gstNumber: importedGstin,
          supplyType: computedSupplyType,
        }));
        
        const isInventoryType = ['sales', 'purchase', 'debit_note', 'credit_note'].includes(typeFromInit || 'sales');
        
        if (isInventoryType) {
            if (initialVoucher.items && initialVoucher.items.length > 0) {
              setRows(initialVoucher.items.map((it: any, i: number) => ({
                id: Date.now() + i,
                itemName: it.name?.value || it.name || '',
                qty: it.quantity?.value || it.quantity || '',
                rate: it.rate?.value || it.rate || '',
                amount: it.amount?.value || it.amount || '',
              })));
            } else {
              setRows([{ id: Date.now() }, { id: Date.now() + 1 }]);
            }
        } else {
            // Accounting type
            if (initialVoucher.items && initialVoucher.items.length > 0) {
              setRows(initialVoucher.items.map((it: any, i: number) => ({
                id: Date.now() + i,
                crDr: it.crDr?.value || it.crDr || (['payment', 'contra'].includes(typeFromInit || activeTab) && i === 0 ? 'Cr' : ['receipt'].includes(typeFromInit || activeTab) && i === 0 ? 'Dr' : typeof it.amount?.value === 'number' && it.amount.value < 0 ? 'Cr' : 'Dr'),
                ledgerName: it.ledgerName?.value || it.ledgerName || it.name?.value || it.name || '',
                amount: Math.abs(it.amount?.value || it.amount || 0) || '',
              })));
            } else {
              setRows([
                { id: Date.now(), crDr: ['payment', 'contra'].includes(typeFromInit || activeTab) ? 'Cr' : 'Dr', ledgerName: initialVoucher.ledger?.value || initialVoucher.ledger || '', amount: initialVoucher.amount?.value || initialVoucher.amount || '' },
                { id: Date.now() + 1, crDr: ['payment', 'contra'].includes(typeFromInit || activeTab) ? 'Dr' : 'Cr' }
              ]);
            }
        }
      }
    } else if (defaultType) {
      setActiveTab(defaultType);
      setRows([{id: Date.now()}, {id: Date.now() + 1}]);
    }
  }, [defaultType, initialVoucher]);

  const [rows, setRows] = useState<any[]>([{ id: Date.now() }, { id: Date.now() + 1 }]);

  const handleItemOrSkuChange = (rowIndex: number, value: string, field: 'itemName' | 'sku') => {
    const newRows = [...rows];
    const row = newRows[rowIndex];
    
    if (field === 'itemName') {
      row.itemName = value;
    } else {
      row.sku = value;
    }
    
    // Find item in masters by name, sku, or barcode
    const item = itemMasters.find(i => 
      (i.name || i.item_name) === value || 
      i.sku === value || 
      i.barcode === value
    );
    
    if (item) {
      if (field === 'sku') {
        row.itemName = item.name || item.item_name || '';
      } else {
        row.sku = item.sku || '';
      }
      row.barcode = item.barcode || '';
      row.hsn = item.hsnCode || item.hsn_sac || item.gst_hsn || '';
      row.tax = item.taxRate || '18';
      row.rate = item.sellingPrice || item.price || item.sales_rate || item.purchase_rate || '';
      row.category = item.category || '';
      row.subcategory = item.subcategory || '';
      row.brand = item.brand || '';
      row.color = item.color || '';
      row.variant = item.variant || '';
      row.size = item.size || '';
      row.dimension = item.dimension || '';
      row.material = item.material || '';
    }
    setRows(newRows);
  };

  const tabs = [
    { id: 'sales', label: 'Sales', type: VoucherType.Sales },
    { id: 'purchase', label: 'Purchase', type: VoucherType.Purchase },
    { id: 'payment', label: 'Payment', type: VoucherType.Payment },
    { id: 'receipt', label: 'Receipt', type: VoucherType.Receipt },
    { id: 'journal', label: 'Journal', type: VoucherType.Journal },
    { id: 'contra', label: 'Contra', type: VoucherType.Contra },
    { id: 'debit_note', label: 'Debit Note', type: VoucherType.DebitNote },
    { id: 'credit_note', label: 'Credit Note', type: VoucherType.CreditNote },
  ];

  const [headerDetails, setHeaderDetails] = useState<any>({
    voucherDate: new Date().toISOString().substring(0, 10),
    voucherNumber: getNextVoucherNumber(defaultType || 'sales') || '',
    referenceNo: '',
    partyName: '',
    placeOfSupply: '',
    cashBankAccount: '',
    instrumentNo: '',
    instrumentDate: '',
    narration: '',
    roundingType: 'auto',
    roundingValue: '',
    isEWayBillRequired: false,
    vehicleNo: '',
    transporterName: '',
    distance: '',
    aadhaarNo: '',
    panNo: '',
    billingPartyName: '',
    billingAddress: '',
    billingState: '',
    billingStateCode: '',
    billingPinCode: '',
    billingContact: '',
    shippingPartyName: '',
    shippingAddress: '',
    shippingState: '',
    shippingStateCode: '',
    shippingPinCode: '',
    shippingContact: '',
    shippingContactPerson: '',
    shippingMobileNumber: '',
    shippingWhatsappNumber: '',
    shippingEmailId: '',
    isShippingSameAsBilling: true,
    poNumber: '',
    poDate: '',
    creditPeriod: '',
    priceLevel: 'Standard',
    gstNumber: '',
    partyType: 'Regular',
    entityCategory: 'Customer',
    businessRole: 'Trader',
    supplyType: 'Intra-State',
    contactPerson: '',
    mobileNumber: '',
    whatsappNumber: '',
    emailId: '',
  });

  const [systemStamp] = useState(new Date().toLocaleString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  }));

  useEffect(() => {
    if (headerDetails.isShippingSameAsBilling) {
      setHeaderDetails(prev => ({
        ...prev,
        shippingPartyName: prev.billingPartyName,
        shippingAddress: prev.billingAddress,
        shippingState: prev.billingState,
        shippingStateCode: prev.billingStateCode,
        shippingPinCode: prev.billingPinCode,
        shippingContact: prev.billingContact,
        shippingContactPerson: prev.contactPerson,
        shippingMobileNumber: prev.mobileNumber,
        shippingWhatsappNumber: prev.whatsappNumber,
        shippingEmailId: prev.emailId,
      }));
    }
  }, [
    headerDetails.isShippingSameAsBilling, 
    headerDetails.billingPartyName, 
    headerDetails.billingAddress, 
    headerDetails.billingState, 
    headerDetails.billingStateCode, 
    headerDetails.billingPinCode,
    headerDetails.billingContact,
    headerDetails.contactPerson,
    headerDetails.mobileNumber,
    headerDetails.whatsappNumber,
    headerDetails.emailId
  ]);

  useEffect(() => {
    if (!headerDetails.partyName) return;
    const selectedParty = partyMasters.find(p => p.name === headerDetails.partyName);
    if (selectedParty) {
      setHeaderDetails(prev => ({ 
        ...prev, 
        placeOfSupply: selectedParty.state || '',
        billingState: selectedParty.state || '',
        billingAddress: selectedParty.address || '',
        billingPinCode: selectedParty.pincode || '',
        gstNumber: selectedParty.gstin || '',
        panNo: selectedParty.pan || (selectedParty.gstin && selectedParty.gstin.length >= 12 ? selectedParty.gstin.substring(2, 12) : ''),
        creditPeriod: selectedParty.creditDays || '',
        billingPartyName: selectedParty.name,
        contactPerson: selectedParty.contactPerson || '',
        mobileNumber: selectedParty.mobile || '',
        whatsappNumber: selectedParty.whatsapp || '',
        emailId: selectedParty.email || ''
      }));
    }
  }, [headerDetails.partyName, partyMasters]);

  useEffect(() => {
    // Update default business role when entity category changes
    let defaultRole = 'Trader';
    if (headerDetails.entityCategory === 'Vendor') {
      defaultRole = 'Supplier';
    }
    setHeaderDetails(prev => ({ ...prev, businessRole: defaultRole }));
  }, [headerDetails.entityCategory]);

  useEffect(() => {
    // Auto-detect supply type based on Place of Supply
    // Assuming company base state is Maharashtra for this implementation
    const baseState = "Maharashtra";
    const currentPlace = String(headerDetails.placeOfSupply?.value || headerDetails.placeOfSupply || '').trim();
    
    if (!currentPlace) {
      handleHeaderChange('supplyType', 'Intra-State');
      return;
    }

    const isInterState = currentPlace.toLowerCase() !== baseState.toLowerCase();
    handleHeaderChange('supplyType', isInterState ? 'Inter-State' : 'Intra-State');
  }, [headerDetails.placeOfSupply]);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Default entity category based on active tab
    let category = 'Customer';
    let role = 'Trader';
    
    if (activeTab === 'purchase' || activeTab === 'debit_note') {
      category = 'Vendor';
      role = 'Supplier';
    } else if (activeTab === 'sales' || activeTab === 'credit_note') {
      category = 'Customer';
      role = 'Trader';
    } else if (activeTab === 'journal') {
      category = 'Both';
      role = 'Trader';
    } else {
      category = 'Internal';
      role = 'Trader';
    }

    setHeaderDetails(prev => ({
        ...prev,
        voucherNumber: getNextVoucherNumber(activeTab) || '',
        entityCategory: category,
        businessRole: role
    }));
    setFormError(null);
  }, [activeTab]);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [saveOptionsOpen, setSaveOptionsOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [expandedRowSection, setExpandedRowSection] = useState<string | null>(null);

  const parseSafe = (val: any): number => {
    if (typeof val === 'string') {
        val = val.replace(/,/g, '');
    }
    const parsed = parseFloat(val);
    return isFinite(parsed) && !isNaN(parsed) ? parsed : 0;
  };

  const calculateRowAmountBeforePreTaxRoundOff = (row: any) => {
    const qty = parseSafe(row.qty);
    const rate = parseSafe(row.rate);
    
    let amount = qty * rate;
    
    const pct = parseSafe(row.discountPct);
    if (pct > 0) {
      amount = amount - (amount * (pct / 100));
    }
    
    const amt = parseSafe(row.discountAmount);
    if (amt > 0) {
      amount = amount - amt;
    }
    
    const discountStr = (row.discount || '').toString();
    if (discountStr) {
      if (discountStr.includes('%')) {
        const legacyPct = parseSafe(discountStr.replace('%', ''));
        amount = amount - (amount * (legacyPct / 100));
      } else {
        amount = amount - parseSafe(discountStr);
      }
    }
    
    return isFinite(amount) && !isNaN(amount) ? Math.max(0, amount) : 0;
  };

  const getRowPreTaxRoundOff = (row: any) => {
    const roundType = row.preTaxRoundType || 'none';
    if (roundType === 'manual') {
      return parseSafe(row.preTaxRoundOff);
    }
    if (roundType === 'none') {
        return 0;
    }

    const amountBeforeRound = calculateRowAmountBeforePreTaxRoundOff(row);
    let roundedAmount = amountBeforeRound;
    if (roundType === 'normal') {
      roundedAmount = Math.round(amountBeforeRound);
    } else if (roundType === 'up') {
      roundedAmount = Math.ceil(amountBeforeRound);
    } else if (roundType === 'down') {
      roundedAmount = Math.floor(amountBeforeRound);
    }

    return roundedAmount - amountBeforeRound;
  };

  const calculateRowAmount = (row: any) => {
    return calculateRowAmountBeforePreTaxRoundOff(row) + getRowPreTaxRoundOff(row);
  };

  const getRowPostTaxDiscount = (row: any) => {
    let amt = 0;
    const taxableAmount = calculateRowAmount(row);
    const taxPct = parseSafe(row.tax || '18');
    const taxAmount = taxableAmount * (taxPct / 100);
    const postTaxGross = taxableAmount + taxAmount;

    const ptPct = parseSafe(row.postTaxDiscountPct);
    if (ptPct > 0) amt += (postTaxGross * (ptPct / 100));

    const ptAmt = parseSafe(row.postTaxDiscountAmount);
    if (ptAmt > 0) amt += ptAmt;

    return amt;
  };

  const getRowRoundOff = (row: any) => {
    const roundType = row.roundType || 'none';
    if (roundType === 'manual') {
      return parseSafe(row.roundOff);
    }
    if (roundType === 'none') {
        return 0;
    }

    const taxableAmount = calculateRowAmount(row);
    const taxPct = parseSafe(row.tax || '18');
    const taxAmount = taxableAmount * (taxPct / 100);
    const postTaxGross = taxableAmount + taxAmount;
    
    const ptAmt = getRowPostTaxDiscount(row);
    const amountBeforeRound = postTaxGross - ptAmt;

    let roundedAmount = amountBeforeRound;
    if (roundType === 'normal') {
      roundedAmount = Math.round(amountBeforeRound);
    } else if (roundType === 'up') {
      roundedAmount = Math.ceil(amountBeforeRound);
    } else if (roundType === 'down') {
      roundedAmount = Math.floor(amountBeforeRound);
    }

    return roundedAmount - amountBeforeRound;
  };

  const calculateRowNetAmount = (row: any) => {
    const taxableAmount = calculateRowAmount(row);
    const taxPct = parseSafe(row.tax || '18');
    const taxAmount = taxableAmount * (taxPct / 100);
    const postTaxGross = taxableAmount + taxAmount;
    
    const ptAmt = getRowPostTaxDiscount(row);
    const roundO = getRowRoundOff(row);
    
    const total = postTaxGross - ptAmt + roundO;
    return isFinite(total) && !isNaN(total) ? total : 0;
  };

  const totals = React.useMemo(() => {
    if (activeTab === 'sales' || activeTab === 'purchase' || activeTab === 'debit_note' || activeTab === 'credit_note') {
      const subtotal = rows.reduce((sum, row) => {
        const qty = parseFloat(row.qty) || 0;
        const rate = parseFloat(row.rate) || 0;
        return sum + (qty * rate);
      }, 0);

      const preTaxDiscount = rows.reduce((sum, row) => {
        const subtotalRow = (parseFloat(row.qty) || 0) * (parseFloat(row.rate) || 0);
        const beforeRound = calculateRowAmountBeforePreTaxRoundOff(row);
        return sum + (subtotalRow - beforeRound);
      }, 0);

      const amountAfterDiscount = rows.reduce((sum, row) => sum + calculateRowAmount(row), 0);

      const taxAmount = rows.reduce((sum, row) => {
        const amt = calculateRowAmount(row);
        const taxPct = parseFloat(row.tax || '18') || 0;
        return sum + (amt * (taxPct / 100));
      }, 0);

      // Compute supply type inline from source data — never rely on stale headerDetails.supplyType
      const _place = String(headerDetails.placeOfSupply?.value || headerDetails.placeOfSupply || '').trim().toLowerCase();
      const _ledger = (headerDetails.salesLedger || headerDetails.purchaseLedger || '').toLowerCase();
      const _gstin = String(headerDetails.gstNumber?.value || headerDetails.gstNumber || '').trim();
      let computedIsInterState = headerDetails.supplyType === 'Inter-State'; // fallback
      if (_ledger.includes('igst') || _ledger.includes('inter')) {
        computedIsInterState = true;
      } else if (_ledger.includes('cgst') || _ledger.includes('sgst') || _ledger.includes('local') || _ledger.includes('intra') || (_ledger.includes('gst') && !_ledger.includes('igst'))) {
        computedIsInterState = false;
      } else if (_place) {
        computedIsInterState = !['maharashtra', 'mh', '27'].some(s => _place.includes(s));
      } else if (_gstin.length >= 2) {
        computedIsInterState = _gstin.substring(0, 2) !== '27';
      } else {
        computedIsInterState = false;
      }
      const isInterState = computedIsInterState;
      const cgst = isInterState ? 0 : taxAmount / 2;
      const sgst = isInterState ? 0 : taxAmount / 2;
      const igst = isInterState ? taxAmount : 0;

      const postTaxDiscountSum = rows.reduce((sum, row) => sum + getRowPostTaxDiscount(row), 0);
      const rowRoundOffs = rows.reduce((sum, row) => sum + getRowRoundOff(row), 0);
      const preTaxRoundOffs = rows.reduce((sum, row) => sum + getRowPreTaxRoundOff(row), 0);
      let taxableOtherAdjustmentAmount = 0;
      if (headerDetails.taxableOtherAdjustmentPct) {
        taxableOtherAdjustmentAmount += amountAfterDiscount * (parseFloat(headerDetails.taxableOtherAdjustmentPct) / 100);
      }
      if (headerDetails.taxableOtherAdjustment) {
        taxableOtherAdjustmentAmount += parseFloat(headerDetails.taxableOtherAdjustment) || 0;
      }

      let nonTaxableOtherAdjustmentAmount = 0;
      if (headerDetails.nonTaxableOtherAdjustmentPct) {
        nonTaxableOtherAdjustmentAmount += amountAfterDiscount * (parseFloat(headerDetails.nonTaxableOtherAdjustmentPct) / 100);
      }
      if (headerDetails.nonTaxableOtherAdjustment) {
        nonTaxableOtherAdjustmentAmount += parseFloat(headerDetails.nonTaxableOtherAdjustment) || 0;
      }

      let nonTaxableVoucherDiscountAmt = 0;
      if (headerDetails.nonTaxableVoucherDiscountPct) {
        nonTaxableVoucherDiscountAmt += amountAfterDiscount * (parseFloat(headerDetails.nonTaxableVoucherDiscountPct) / 100);
      }
      if (headerDetails.nonTaxableVoucherDiscountAmount) {
        nonTaxableVoucherDiscountAmt += parseFloat(headerDetails.nonTaxableVoucherDiscountAmount) || 0;
      }

      let voucherDiscountAmt = 0;
      if (headerDetails.voucherDiscountPct) {
        voucherDiscountAmt += amountAfterDiscount * (parseFloat(headerDetails.voucherDiscountPct) / 100);
      }
      if (headerDetails.voucherDiscountAmount) {
        voucherDiscountAmt += parseFloat(headerDetails.voucherDiscountAmount) || 0;
      }

      const preRoundValue = amountAfterDiscount + taxAmount - postTaxDiscountSum + rowRoundOffs + taxableOtherAdjustmentAmount + nonTaxableOtherAdjustmentAmount - voucherDiscountAmt - nonTaxableVoucherDiscountAmt;
      let grandTotalRound = Math.round(preRoundValue);
      let globalRoundOff = grandTotalRound - preRoundValue;

      if (headerDetails.roundingType === 'none') {
        grandTotalRound = preRoundValue;
        globalRoundOff = 0;
      } else if (headerDetails.roundingType === 'manual') {
        globalRoundOff = parseFloat(headerDetails.roundingValue) || 0;
        grandTotalRound = preRoundValue + globalRoundOff;
      } else if (headerDetails.roundingType === 'up') {
        grandTotalRound = Math.ceil(preRoundValue);
        globalRoundOff = grandTotalRound - preRoundValue;
      } else if (headerDetails.roundingType === 'down') {
        grandTotalRound = Math.floor(preRoundValue);
        globalRoundOff = grandTotalRound - preRoundValue;
      }

      return { 
        subtotal, 
        amountAfterDiscount,
        discount: preTaxDiscount, 
        postTaxDiscount: postTaxDiscountSum,
        voucherDiscount: voucherDiscountAmt + nonTaxableVoucherDiscountAmt,
        taxableVoucherDiscount: voucherDiscountAmt,
        nonTaxableVoucherDiscount: nonTaxableVoucherDiscountAmt,
        cgst, 
        sgst, 
        igst, 
        roundOff: globalRoundOff + rowRoundOffs + preTaxRoundOffs, 
        otherAdjustment: taxableOtherAdjustmentAmount,
        nonTaxableAdjustment: nonTaxableOtherAdjustmentAmount,
        grandTotal: grandTotalRound,
        computedSupplyType: isInterState ? 'Inter-State' : 'Intra-State'
      };
    } else {
      const getCrDr = (r: any, i: number) => r.crDr || (activeTab === 'payment' && i === 0 ? 'Cr' : activeTab === 'payment' ? 'Dr' : activeTab === 'receipt' && i === 0 ? 'Dr' : activeTab === 'receipt' ? 'Cr' : activeTab === 'journal' ? 'Dr' : 'Cr');
      const drTotal = rows.filter((r, i) => getCrDr(r, i) === 'Dr').reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
      const crTotal = rows.filter((r, i) => getCrDr(r, i) === 'Cr').reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
      
      const total = activeTab === 'payment' ? crTotal : (activeTab === 'receipt' ? drTotal : Math.max(drTotal, crTotal));
      return { 
        subtotal: total, 
        amountAfterDiscount: total,
        discount: 0, 
        postTaxDiscount: 0,
        voucherDiscount: 0,
        taxableVoucherDiscount: 0,
        nonTaxableVoucherDiscount: 0,
        cgst: 0, 
        sgst: 0, 
        igst: 0, 
        roundOff: 0, 
        otherAdjustment: 0,
        nonTaxableAdjustment: 0,
        grandTotal: total, 
        drTotal, 
        crTotal 
      };
    }
  }, [rows, activeTab, headerDetails]);

  const handleHeaderChange = (field: string, value: any) => {
    setHeaderDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const validateVoucher = (): boolean => {
    if (!headerDetails.voucherDate) {
      setFormError('Voucher Date is required.');
      return false;
    }

    const isInventoryType = ['sales', 'purchase', 'debit_note', 'credit_note'].includes(activeTab);

    if (isInventoryType) {
      const hasValidRows = rows.some(r => r.itemName && (parseFloat(r.qty) > 0 || parseFloat(r.rate) > 0));
      if (!hasValidRows) {
        setFormError('At least one item with a quantity or rate is required.');
        return false;
      }
    } else {
      // Accounting types: payment, receipt, contra, journal
      const hasValidRows = rows.some(r => r.ledgerName && parseFloat(r.amount) > 0);
      if (!hasValidRows) {
        setFormError('At least one ledger with an amount is required.');
        return false;
      }
    }

    return true;
  };

  const getEnrichedRows = () => rows.map((r, i) => {
      if (['sales', 'purchase', 'sales_order', 'purchase_order', 'debit_note', 'credit_note', 'delivery_note', 'receipt_note'].includes(activeTab)) {
          return {
              ...r,
              amount: formatNumber(Number(calculateRowNetAmount(r).toFixed(2)))
          };
      }
      return {
          ...r,
          crDr: r.crDr || (activeTab === 'payment' && i === 0 ? 'Cr' : activeTab === 'payment' ? 'Dr' : activeTab === 'receipt' && i === 0 ? 'Dr' : activeTab === 'receipt' ? 'Cr' : activeTab === 'journal' ? 'Dr' : 'Cr')
      };
  });

  const saveVoucher = (isDraft = false) => {
    if (!isDraft && !validateVoucher()) return null;
    
    const enrichedRows = getEnrichedRows();

    const entry = {
      id: currentRecordId || initialVoucher?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      type: activeTab,
      header: headerDetails,
      rows: enrichedRows,
      totals,
      isDraft,
      createdAt: initialVoucher?.createdAt || new Date().toISOString()
    };
    
    setCurrentRecordId(entry.id);
    
    if (onSaveEntry) {
        onSaveEntry(entry, !initialVoucher);
    }
    
    if (!isDraft && !initialVoucher) {
      incrementVoucherNumber(activeTab);
    }
    setFormError(null);
    return entry;
  };

  const [notification, setNotification] = useState<{ message: string; type: NotificationType; isOpen: boolean }>({
    message: '',
    type: 'success',
    isOpen: false,
  });

  const showNotify = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type, isOpen: true });
  };

  const handleSaveInfoResult = (entry: any) => {
    if (entry) {
        showNotify('Entry saved successfully!');
    }
  }

  const handleSave = () => {
    const entry = saveVoucher();
    handleSaveInfoResult(entry);
  };

  const handleSaveNew = () => {
    const entry = saveVoucher();
    if (!entry) return;
    
    setHeaderDetails({
      voucherDate: new Date().toISOString().substring(0, 10),
      voucherNumber: getNextVoucherNumber(activeTab) || '',
      referenceNo: '',
      partyName: '',
      placeOfSupply: '',
      cashBankAccount: '',
      instrumentNo: '',
      instrumentDate: '',
      narration: '',
      roundingType: 'auto',
      roundingValue: '',
      isEWayBillRequired: false,
      vehicleNo: '',
      transporterName: '',
      distance: '',
      aadhaarNo: '',
      panNo: '',
      billingPartyName: '',
      billingAddress: '',
      billingState: '',
      billingStateCode: '',
      billingPinCode: '',
      billingContact: '',
      shippingPartyName: '',
      shippingAddress: '',
      shippingState: '',
      shippingStateCode: '',
      shippingPinCode: '',
      shippingContact: '',
      shippingContactPerson: '',
      shippingMobileNumber: '',
      shippingWhatsappNumber: '',
      shippingEmailId: '',
      isShippingSameAsBilling: true,
      poNumber: '',
      poDate: '',
      creditPeriod: '',
      priceLevel: 'Standard',
      gstNumber: '',
      partyType: 'Regular',
      entityCategory: 'Customer',
      businessRole: 'Trader',
      supplyType: 'Intra-State',
      contactPerson: '',
      mobileNumber: '',
      whatsappNumber: '',
      emailId: '',
    });
    setRows([{ id: Date.now() }, { id: Date.now() + 1 }]);
    setAttachedFile(null);
    showNotify('Entry saved successfully! Starting a new one.');
  };

  const handleSavePrint = () => {
    const entry = saveVoucher();
    if (entry) {
        setIsPrinting(true);
        setShowPreview(true);
    }
  };

  const handleSaveDraft = () => {
    saveVoucher(true);
    showNotify('Entry saved as draft!', 'info');
  };

  const [showPreview, setShowPreview] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const handlePreview = () => {
    setIsPrinting(false);
    setShowPreview(true);
  };

  const [isSection0Collapsed, setIsSection0Collapsed] = useState(true);
  const [isSection1Collapsed, setIsSection1Collapsed] = useState(true);
  const [isSection2Collapsed, setIsSection2Collapsed] = useState(true);
  const [isSection3Collapsed, setIsSection3Collapsed] = useState(true);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(initialVoucher?.id || null);

  const loadRecord = (voucher: any | null) => {
    if (!voucher) {
      setCurrentRecordId(null);
      setHeaderDetails({
        voucherDate: new Date().toISOString().substring(0, 10),
        voucherNumber: getNextVoucherNumber(activeTab) || '',
        referenceNo: '',
        partyName: '',
        placeOfSupply: '',
        cashBankAccount: '',
        instrumentNo: '',
        instrumentDate: '',
        narration: '',
        taxableOtherAdjustment: '',
        taxableOtherAdjustmentPct: '',
        taxableAdjustmentRemarks: '',
        isEWayBillRequired: false,
        vehicleNo: '',
        transporterName: '',
        distance: '',
        aadhaarNo: '',
        panNo: '',
        billingPartyName: '',
        billingAddress: '',
        billingState: '',
        billingStateCode: '',
        billingPinCode: '',
        billingContact: '',
        shippingPartyName: '',
        shippingAddress: '',
        shippingState: '',
        shippingStateCode: '',
        shippingPinCode: '',
        shippingContact: '',
        shippingContactPerson: '',
        shippingMobileNumber: '',
        shippingWhatsappNumber: '',
        shippingEmailId: '',
        isShippingSameAsBilling: true,
        poNumber: '',
        poDate: '',
        creditPeriod: '',
        priceLevel: 'Standard',
        gstNumber: '',
        partyType: 'Regular',
        entityCategory: 'Customer',
        businessRole: 'Trader',
        supplyType: 'Intra-State',
        contactPerson: '',
        mobileNumber: '',
        whatsappNumber: '',
        emailId: '',
      });
      setRows([{ id: Date.now() }, { id: Date.now() + 1 }]);
      return;
    }

    setCurrentRecordId(voucher.id);
    if (voucher.header && voucher.rows) {
      // Re-derive supplyType from placeOfSupply so switching vouchers updates IGST/CGST correctly
      const loadedHeader = { ...voucher.header };
      const place = String(loadedHeader.placeOfSupply?.value || loadedHeader.placeOfSupply || '').trim().toLowerCase();
      const gstin = String(loadedHeader.gstNumber?.value || loadedHeader.gstNumber || '').trim();
      if (place) {
        const isLocal = ['maharashtra', 'mh', '27'].some(s => place.includes(s));
        loadedHeader.supplyType = isLocal ? 'Intra-State' : 'Inter-State';
      } else if (gstin.length >= 2) {
        loadedHeader.supplyType = gstin.substring(0, 2) !== '27' ? 'Inter-State' : 'Intra-State';
      }
      setHeaderDetails(loadedHeader);
      setRows(voucher.rows);
    } else {
      // For imported vouchers (no header/rows structure):
      // Extract all GST-critical fields and RESET others to prevent stale data from previous voucher
      const importedPlaceOfSupply = voucher.placeOfSupply?.value || voucher.placeOfSupply || '';
      const importedGstin = voucher.gstin?.value || voucher.gstin || voucher.gstNumber?.value || voucher.gstNumber || '';
      const importedSupplyType = voucher.supplyType?.value || voucher.supplyType || '';
      
      // Compute supply type from imported data
      let computedSupplyType = 'Intra-State';
      const posLower = String(importedPlaceOfSupply || '').trim().toLowerCase();
      if (posLower) {
        const isLocal = ['maharashtra', 'mh', '27'].some(s => posLower.includes(s));
        computedSupplyType = isLocal ? 'Intra-State' : 'Inter-State';
      } else if (importedGstin.length >= 2) {
        computedSupplyType = importedGstin.substring(0, 2) !== '27' ? 'Inter-State' : 'Intra-State';
      } else if (importedSupplyType) {
        computedSupplyType = importedSupplyType;
      }

      setHeaderDetails(prev => ({
        ...prev,
        voucherDate: voucher.date?.value || voucher.date || prev.voucherDate,
        voucherNumber: voucher.invoiceNumber?.value || voucher.invoiceNumber || getNextVoucherNumber(activeTab) || '',
        partyName: voucher.partyName?.value || voucher.partyName || prev.partyName,
        narration: voucher.narration?.value || voucher.narration || prev.narration,
        // Reset GST-critical fields from the imported voucher data
        placeOfSupply: importedPlaceOfSupply,
        gstNumber: importedGstin,
        supplyType: computedSupplyType,
      }));
      
      const isInventoryType = ['sales', 'purchase', 'debit_note', 'credit_note'].includes(activeTab);
      if (isInventoryType) {
        if (voucher.items && voucher.items.length > 0) {
          setRows(voucher.items.map((it: any, i: number) => ({
            id: Date.now() + i,
            itemName: it.name?.value || it.name || '',
            qty: it.quantity?.value || it.quantity || '',
            rate: it.rate?.value || it.rate || '',
            amount: it.amount?.value || it.amount || '',
          })));
        } else {
          setRows([{ id: Date.now() }, { id: Date.now() + 1 }]);
        }
      } else {
        if (voucher.items && voucher.items.length > 0) {
          setRows(voucher.items.map((it: any, i: number) => ({
            id: Date.now() + i,
            crDr: it.crDr?.value || it.crDr || (['payment', 'contra'].includes(activeTab) && i === 0 ? 'Cr' : ['receipt'].includes(activeTab) && i === 0 ? 'Dr' : 'Dr'),
            ledgerName: it.ledgerName?.value || it.ledgerName || it.name?.value || it.name || '',
            amount: Math.abs(it.amount?.value || it.amount || 0) || '',
          })));
        } else {
          setRows([
            { id: Date.now(), crDr: ['payment', 'contra'].includes(activeTab) ? 'Cr' : 'Dr', ledgerName: voucher.ledger?.value || voucher.ledger || '', amount: voucher.amount?.value || voucher.amount || '' },
            { id: Date.now() + 1, crDr: ['payment', 'contra'].includes(activeTab) ? 'Dr' : 'Cr' }
          ]);
        }
      }
    }
  };

  const handleNavigate = (direction: 'up' | 'down' | 'first' | 'last') => {
    const allVouchers = vouchers || [];
    if (allVouchers.length === 0) return;
    // Filter by current activeTab type
    const ofType = allVouchers.filter(v => {
      const vType = (typeof v.type === 'string' ? v.type.toLowerCase().replace(/ /g, '_') : v.type);
      return vType === activeTab;
    });

    if (ofType.length === 0) {
      if (currentRecordId !== null) loadRecord(null);
      return;
    }

    // Sort by date or ID to have a stable order
    ofType.sort((a, b) => {
      const dateA = new Date(a.date?.value || a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date?.value || b.date || b.createdAt || 0).getTime();
      return dateA - dateB;
    });

    const currentIndex = currentRecordId ? ofType.findIndex(v => v.id === currentRecordId) : -1;
    
    // Sequence: [0, 1, 2, ..., N, null (new entry)]
    let nextIndex: number;
    if (direction === 'first') {
      nextIndex = 0;
    } else if (direction === 'last') {
      nextIndex = ofType.length - 1;
    } else if (direction === 'up') { // Previous (older)
      if (currentIndex === -1) { // We were on new entry
        nextIndex = ofType.length - 1; // Go to most recent
      } else if (currentIndex === 0) { // We were on oldest
        nextIndex = -1; // Go to blank
      } else {
        nextIndex = currentIndex - 1;
      }
    } else { // Next (newer)
      if (currentIndex === -1) { // We were on new entry
        nextIndex = 0; // Go to oldest
      } else if (currentIndex === ofType.length - 1) { // We were on most recent
        nextIndex = -1; // Go to blank
      } else {
        nextIndex = currentIndex + 1;
      }
    }

    if (nextIndex === -1) {
      loadRecord(null);
    } else {
      loadRecord(ofType[nextIndex]);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        // Allow F1 for help even if typing
        if (e.key === 'F1') {
          e.preventDefault();
          setShowHelp(true);
        }
        // Allow Ctrl+S for saving even if typing
        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          if (e.shiftKey) {
             e.preventDefault();
             handleSaveNew();
          } else {
             e.preventDefault();
             handleSave();
          }
        }
        // Allow Ctrl+P for printing
        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          handlePreview();
        }
        // Allow Alt shortcuts even if typing
        else if (e.altKey) {
          const key = e.key.toLowerCase();
          if (key === 'c') { e.preventDefault(); setShowCalculator(true); }
          else if (key === 's') { e.preventDefault(); setScanningRowIndex(-1); setShowScanner(true); }
          else if (key === 'a') { e.preventDefault(); fileInputRef.current?.click(); }
          else if (key === 'h') { e.preventDefault(); setShowHistory(true); }
          else if (key === 'd') { e.preventDefault(); handleDuplicateEntry(); }
          else if (key === 'x') { e.preventDefault(); handleClearEntryClick(); }
          else if (e.key === 'Delete') { e.preventDefault(); handleDeleteEntryClick(); }
          else if (key === '0') { e.preventDefault(); setIsSection0Collapsed(prev => !prev); }
          else if (key === '1') { e.preventDefault(); setIsSection1Collapsed(prev => !prev); }
          else if (key === '2') { e.preventDefault(); setIsSection2Collapsed(prev => !prev); }
          else if (key === '3') { e.preventDefault(); setIsSection3Collapsed(prev => !prev); }
          else if (key === '4') { e.preventDefault(); setExpandedRowSection(prev => prev === 'item_selection' ? null : 'item_selection'); }
          else if (key === '5') { e.preventDefault(); setExpandedRowSection(prev => prev === 'attributes' ? null : 'attributes'); }
          else if (key === '6') { e.preventDefault(); setExpandedRowSection(prev => prev === 'quantities' ? null : 'quantities'); }
          else if (key === '7') { e.preventDefault(); setExpandedRowSection(prev => prev === 'pricing_nontax' ? null : 'pricing_nontax'); }
          else if (key === '8') { e.preventDefault(); setExpandedRowSection(prev => prev === 'pricing_tax' ? null : 'pricing_tax'); }
          else if (key === '9') { e.preventDefault(); setExpandedRowSection(prev => prev === 'tracking' ? null : 'tracking'); }
        }
        return;
      }

      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelp(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        if (e.shiftKey) {
          e.preventDefault();
          handleSaveNew();
        } else {
          e.preventDefault();
          handleSave();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewEntry();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePreview();
      } else if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setShowCalculator(true);
      } else if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setScanningRowIndex(-1);
        setShowScanner(true);
      } else if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        fileInputRef.current?.click();
      } else if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowHistory(true);
      } else if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateEntry();
      } else if (e.altKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleClearEntryClick();
      } else if (e.altKey && e.key === 'Delete') {
        e.preventDefault();
        handleDeleteEntryClick();
      } else if (e.altKey && e.key === '0') {
        e.preventDefault();
        setIsSection0Collapsed(prev => !prev);
      } else if (e.altKey && e.key === '1') {
        e.preventDefault();
        setIsSection1Collapsed(prev => !prev);
      } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        setIsSection2Collapsed(prev => !prev);
      } else if (e.altKey && e.key === '3') {
        e.preventDefault();
        setIsSection3Collapsed(prev => !prev);
      } else if (e.altKey && e.key === '4') {
        e.preventDefault();
        setExpandedRowSection(prev => prev === 'item_selection' ? null : 'item_selection');
      } else if (e.altKey && e.key === '5') {
        e.preventDefault();
        setExpandedRowSection(prev => prev === 'attributes' ? null : 'attributes');
      } else if (e.altKey && e.key === '6') {
        e.preventDefault();
        setExpandedRowSection(prev => prev === 'quantities' ? null : 'quantities');
      } else if (e.altKey && e.key === '7') {
        e.preventDefault();
        setExpandedRowSection(prev => prev === 'pricing_nontax' ? null : 'pricing_nontax');
      } else if (e.altKey && e.key === '8') {
        e.preventDefault();
        setExpandedRowSection(prev => prev === 'pricing_tax' ? null : 'pricing_tax');
      } else if (e.altKey && e.key === '9') {
        e.preventDefault();
        setExpandedRowSection(prev => prev === 'tracking' ? null : 'tracking');
      }
    };

    window.addEventListener('keydown', handleKeyDown);  return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleDuplicateEntry = () => {
    setCurrentRecordId(null);
    setHeaderDetails(prev => ({
        ...prev,
        voucherNumber: getNextVoucherNumber(activeTab) || '',
        systemStamp: undefined
    }));
    showNotify('Entry duplicated! You can now save it as a new record.');
  };

  const [showHelp, setShowHelp] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDeleteEntryClick = () => {
    if (!currentRecordId) {
      showNotify('Record not saved yet, nothing to delete.', 'info');
      handleNewEntry();
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDeleteEntry && currentRecordId) {
      onDeleteEntry(currentRecordId);
    }
    showNotify('Entry deleted!', 'error');
    handleNewEntry();
  };

  const handleClearEntryClick = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClear = () => {
    handleNewEntry();
  };

  const handleNewEntry = () => {
    loadRecord(null);
  };

  const handleGeneratePDF = async () => {
    const element = document.getElementById('voucher-to-print');
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, { 
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff'
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeTab}_${headerDetails.voucherNumber || 'voucher'}.pdf`);
      showNotify('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotify('Failed to generate PDF. Please try again.', 'error');
    }
  };

  const handleGenerateImage = async () => {
    const element = document.getElementById('voucher-to-print');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { 
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `${activeTab}_${headerDetails.voucherNumber || 'voucher'}.png`;
      link.href = dataUrl;
      link.click();
      showNotify('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      showNotify('Failed to generate image. Please try again.', 'error');
    }
  };

  const [collapsedSections, setCollapsedSections] = useState({
    systemInfo: true,
    header: true,
    party: false,
    lineItems: false,
    narration: true,
    taxableAdjustments: true,
    nonTaxableAdjustments: true,
    rounding: true,
    summary: false,
    logistics: true
  });

  const [showRequirements, setShowRequirements] = useState(false);

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return {
    t,
    formatNumber,
    activeTab,
    setActiveTab,
    showNewItemModal,
    setShowNewItemModal,
    showScanner,
    setShowScanner,
    scanningRowIndex,
    setScanningRowIndex,
    handleBarcodeScanned,
    rows,
    setRows,
    handleItemOrSkuChange,
    headerDetails,
    setHeaderDetails,
    systemStamp,
    formError,
    setFormError,
    attachedFile,
    setAttachedFile,
    fileInputRef,
    saveOptionsOpen,
    setSaveOptionsOpen,
    editingRowIndex,
    setEditingRowIndex,
    expandedRowSection,
    setExpandedRowSection,
    totals,
    handleHeaderChange,
    handleFileChange,
    validateVoucher,
    getEnrichedRows,
    saveVoucher,
    notification,
    setNotification,
    showNotify,
    handleSaveInfoResult,
    handleSave,
    handleSaveNew,
    handleSavePrint,
    handleSaveDraft,
    showPreview,
    setShowPreview,
    isPrinting,
    setIsPrinting,
    showCalculator,
    setShowCalculator,
    handlePreview,
    isSection0Collapsed,
    setIsSection0Collapsed,
    isSection1Collapsed,
    setIsSection1Collapsed,
    isSection2Collapsed,
    setIsSection2Collapsed,
    isSection3Collapsed,
    setIsSection3Collapsed,
    currentRecordId,
    setCurrentRecordId,
    loadRecord,
    handleNavigate,
    handleDuplicateEntry,
    showHelp,
    setShowHelp,
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
    showHistory,
    setShowHistory,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showClearConfirm,
    setShowClearConfirm,
    handleDeleteEntryClick,
    handleConfirmDelete,
    handleClearEntryClick,
    handleConfirmClear,
    handleNewEntry,
    handleGeneratePDF,
    handleGenerateImage,
    collapsedSections,
    setCollapsedSections,
    showRequirements,
    setShowRequirements,
    toggleSection
  };
};
