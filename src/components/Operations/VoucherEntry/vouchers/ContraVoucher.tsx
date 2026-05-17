
import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, ClipboardList, Plus, Trash2, Edit2, X, FileText, Calculator, Settings2, Users, MapPin, ChevronDown, ChevronUp, Paperclip, ScanBarcode, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Import, Printer, Eye, Image, FilePlus, Bookmark, Package, Tags, Info, HelpCircle, Keyboard, Layout, Zap } from 'lucide-react';
import { VoucherType } from '../../../../types';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';
import { NewItemModal } from '../../NewItemModal';
import { BarcodeScannerModal } from '../../BarcodeScannerModal';
import { CalculatorModal } from '../../../ui/CalculatorModal';
import { ConfirmModal } from '../../../ui/ConfirmModal';
import { HistoryModal } from '../../../ui/HistoryModal';
import { getNextVoucherNumber, incrementVoucherNumber } from '../../../../services/voucherNumbering';
import { VoucherHelpModal } from '../components/VoucherHelpModal';
import { VoucherKeyboardShortcutsModal } from '../components/VoucherKeyboardShortcutsModal';
import { VoucherItemEditModal } from '../components/VoucherItemEditModal';
import { VoucherTotalsSummary } from '../components/VoucherTotalsSummary';
import { VoucherPreview } from '../VoucherPreview';
import { WebBillRequirements } from '../components/WebBillRequirements';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Notification, NotificationType } from '../../../ui/Notification';


// Safe JSON parse helper
const safeJsonParse = <T,>(jsonString: string | null, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('JSON parse error:', e);
    return defaultValue;
  }
};

interface VoucherEntryViewProps {
  defaultType?: string;
  initialVoucher?: any;
  itemMasters?: any[];
  ledgerMasters?: any[];
  partyMasters?: any[];
  onUpdateItemMaster?: (item: any) => void;
  onAddItemMaster?: (item: any) => void;
  onSaveEntry?: (entry: any, isNew: boolean) => void;
  onOpenPrintSettings?: () => void;
}

export const ContraVoucher: React.FC<VoucherEntryViewProps> = ({ defaultType, initialVoucher, itemMasters = [], ledgerMasters = [], partyMasters = [], onUpdateItemMaster, onAddItemMaster, onSaveEntry, onOpenPrintSettings }) => {
  const activeTab = 'contra' as string;
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
        const place = (loadedHeader.placeOfSupply || '').trim().toLowerCase();
        const gstin = (loadedHeader.gstNumber || '').trim();
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
        const typeFromInit = (typeof initialVoucher.type === 'string' ? initialVoucher.type.toLowerCase().replace(' ', '_') : initialVoucher.type) || defaultType;
        if (typeFromInit) setActiveTab(typeFromInit);

        // Extract GST-critical fields from imported voucher data
        const importedPlaceOfSupply = initialVoucher.placeOfSupply?.value || initialVoucher.placeOfSupply || '';
        const importedGstin = initialVoucher.gstin?.value || initialVoucher.gstin || initialVoucher.gstNumber?.value || initialVoucher.gstNumber || '';
        const importedSupplyType = initialVoucher.supplyType?.value || initialVoucher.supplyType || '';
        let computedSupplyType = 'Intra-State';
        const posLower = (importedPlaceOfSupply || '').trim().toLowerCase();
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
            setRows([
              { id: Date.now(), ledgerName: initialVoucher.ledger?.value || initialVoucher.ledger || '', amount: initialVoucher.amount?.value || initialVoucher.amount || '' },
              { id: Date.now() + 1 }
            ]);
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

  const [headerDetails, setHeaderDetails] = useState({
    voucherDate: new Date().toISOString().substring(0, 10),
    voucherNumber: getNextVoucherNumber(defaultType || 'sales') || '',
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
    nonTaxableOtherAdjustment: '',
    nonTaxableOtherAdjustmentPct: '',
    nonTaxableAdjustmentRemarks: '',
    nonTaxableVoucherDiscountPct: '',
    nonTaxableVoucherDiscountAmount: '',
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
    const currentPlace = headerDetails.placeOfSupply?.trim();
    
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
      const _place = (headerDetails.placeOfSupply || '').trim().toLowerCase();
      const _ledger = (headerDetails.salesLedger || headerDetails.purchaseLedger || '').toLowerCase();
      const _gstin = (headerDetails.gstNumber || '').trim();
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
              amount: calculateRowNetAmount(r).toFixed(2)
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
      id: currentRecordId || initialVoucher?.id || Date.now().toString(),
      type: activeTab,
      header: headerDetails,
      rows: enrichedRows,
      totals,
      isDraft,
      createdAt: initialVoucher?.createdAt || new Date().toISOString()
    };
    
    const saved = safeJsonParse(localStorage.getItem('bharat_book_all_vouchers_v2'), [] as any[]);
    const lookupId = currentRecordId || initialVoucher?.id;
    if (lookupId && saved.some((v: any) => v.id === lookupId)) {
        const idx = saved.findIndex((v: any) => v.id === lookupId);
        saved[idx] = entry;
    } else {
        saved.push(entry);
    }
    localStorage.setItem('bharat_book_all_vouchers_v2', JSON.stringify(saved));
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
      taxableOtherAdjustment: '',
      taxableOtherAdjustmentPct: '',
      taxableAdjustmentRemarks: '',
      nonTaxableOtherAdjustment: '',
      nonTaxableOtherAdjustmentPct: '',
      nonTaxableAdjustmentRemarks: '',
      nonTaxableVoucherDiscountPct: '',
      nonTaxableVoucherDiscountAmount: '',
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
      const place = (loadedHeader.placeOfSupply || '').trim().toLowerCase();
      const gstin = (loadedHeader.gstNumber || '').trim();
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
      const posLower = (importedPlaceOfSupply || '').trim().toLowerCase();
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
        setRows([
          { id: Date.now(), ledgerName: voucher.ledger?.value || voucher.ledger || '', amount: voucher.amount?.value || voucher.amount || '' },
          { id: Date.now() + 1 }
        ]);
      }
    }
  };

  const handleNavigate = (direction: 'up' | 'down' | 'first' | 'last') => {
    const allVouchersRaw = localStorage.getItem('bharat_book_all_vouchers_v2');
    if (!allVouchersRaw) return;
    
    const allVouchers = JSON.parse(allVouchersRaw) as any[];
    // Filter by current activeTab type
    const ofType = allVouchers.filter(v => {
      const vType = (typeof v.type === 'string' ? v.type.toLowerCase().replace(' ', '_') : v.type);
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
    const savedStr = localStorage.getItem('bharat_book_all_vouchers_v2');
    if (savedStr) {
      let saved: any[] = JSON.parse(savedStr);
      saved = saved.filter((v: any) => v.id !== currentRecordId);
      localStorage.setItem('bharat_book_all_vouchers_v2', JSON.stringify(saved));
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

  const renderAccountingForm = () => (
    <div className="space-y-6">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="bg-red-100 p-2 rounded-full shrink-0">
                    <X size={16} className="text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Transaction Failed</h4>
                  <p className="text-sm">{formError}</p>
                </div>
            </div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-widest bg-white/60 px-3 py-1.5 rounded-lg border border-red-100 shrink-0 text-center">
                {systemStamp}
            </div>
        </div>
      )}
      <div className={`bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[50] ${collapsedSections.header ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-[inherit]"></div>
        <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.header ? '' : 'mb-5'}`} onClick={() => toggleSection('header')}>
           <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
             <Settings2 size={16} className="mr-2 text-amber-500"/> <span className="hidden sm:inline">Voucher&nbsp;</span>Header
           </h3>
           <button className="text-gray-400 hover:text-gray-600 transition-colors">
             <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.header ? 'rotate-180' : ''}`} />
           </button>
        </div>
        {!collapsedSections.header && (
        <div className="form-grid gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="form-field-wrapper">
<label className="form-label flex justify-between items-center">
              <span>Voucher Date</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input type="date" value={headerDetails.voucherDate || ''} onChange={(e) => handleHeaderChange('voucherDate', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
              <div className="sm:w-32 flex items-center justify-center px-4 py-3 bg-amber-50 border border-amber-100/50 rounded-xl text-sm font-black text-amber-700 shadow-sm shrink-0 whitespace-nowrap uppercase tracking-wider">
                  {(() => {
                    const d = new Date(headerDetails.voucherDate);
                    return isNaN(d.getTime()) ? 'Invalid' : d.toLocaleDateString('en-US', { weekday: 'long' });
                  })()}
              </div>
            </div>
          </div>
          <div className="form-field-wrapper">
<label className="form-label">Voucher Number</label>
            <input type="text" value={headerDetails.voucherNumber || ''} onChange={(e) => handleHeaderChange('voucherNumber', e.target.value)} placeholder="Auto-generated" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
          </div>
          <div className="form-field-wrapper">
<label className="form-label">Creation Stamp (System)</label>
            <input type="text" value={systemStamp || ''} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed select-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" />
          </div>
          {activeTab !== 'journal' && (
            <>
              <div className="form-field-wrapper">
<label className="form-label">Account (Cash/Bank)</label>
                <input list="ledger-list" value={headerDetails.cashBankAccount || ''} onChange={(e) => handleHeaderChange('cashBankAccount', e.target.value)} placeholder="Search Cash/Bank Account..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">Instrument No.</label>
                <input type="text" value={headerDetails.instrumentNo || ''} onChange={(e) => handleHeaderChange('instrumentNo', e.target.value)} placeholder="Cheque/UTR/Ref No." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">Instrument Date</label>
                <input type="date" value={headerDetails.instrumentDate || ''} onChange={(e) => handleHeaderChange('instrumentDate', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
              </div>
            </>
          )}
        </div>
        )}
      </div>

      <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[40] ${collapsedSections.lineItems ? 'rounded-xl' : 'rounded-2xl'} dark:bg-gray-800`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-[inherit]"></div>
        <div className={`border-b border-gray-100 flex justify-between items-center bg-gray-50/50 cursor-pointer ${collapsedSections.lineItems ? 'px-4 py-3' : 'px-6 py-5'} dark:border-gray-800`} onClick={() => toggleSection('lineItems')}>
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
             <Calculator size={16} className="mr-2 text-rose-500"/> <span className="sm:hidden">Items</span><span className="hidden sm:inline">Particulars</span>
           </h3>
           <div className="flex items-center space-x-2 md:space-x-4">
             <button onClick={(e) => { e.stopPropagation(); setRows([...rows, { id: Date.now() }]); }} className="flex items-center px-4 md:px-4 py-2 md:py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-rose-200 transition-colors" title="Add Item">
               <Plus size={16} className="md:mr-1" /> <span className="hidden md:inline">Add Item</span>
             </button>
             <button className="text-gray-400 hover:text-gray-600 transition-colors pl-2">
               <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.lineItems ? 'rotate-180' : ''}`} />
             </button>
           </div>
        </div>
        
        {!collapsedSections.lineItems && (
        <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-300">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 uppercase text-[10px] tracking-[0.2em] font-black text-gray-400 dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 w-20 text-center">Cr/Dr</th>
                <th className="px-6 py-4">Particulars (Ledger)</th>
                <th className="px-6 py-4 text-right w-48">Amount (₹)</th>
                <th className="px-6 py-4 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-amber-50/30 transition-colors group">
                  <td className="px-6 py-3">
                    <select 
                      value={row.crDr || (activeTab === 'payment' && index === 0 ? 'Cr' : activeTab === 'payment' ? 'Dr' : activeTab === 'receipt' && index === 0 ? 'Dr' : activeTab === 'receipt' ? 'Cr' : activeTab === 'journal' ? 'Dr' : 'Cr')} 
                      onChange={(e) => { const r = [...rows]; r[index].crDr = e.target.value; setRows(r); }} 
                      disabled={(activeTab === 'payment' || activeTab === 'receipt') && index === 0}
                      className="w-full px-2 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-black uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer text-center disabled:opacity-50 dark:focus:bg-gray-700"
                    >
                      <option value="Dr">Dr</option>
                      <option value="Cr">Cr</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <SearchableDropdown
                      options={(activeTab === 'payment' || activeTab === 'receipt') && index === 0 ? ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank')) : ledgerMasters}
                      value={row.ledgerName || ''}
                      onChange={(value) => { const r = [...rows]; r[index].ledgerName = value; setRows(r); }}
                      placeholder="Select ledger..."
                      buttonClassName="w-full min-w-[300px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all dark:focus-within:bg-gray-700"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input type="number" placeholder="0.00" value={row.amount || ''} onChange={(e) => { const r = [...rows]; r[index].amount = e.target.value; setRows(r); }} className="w-full px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-bold text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:focus:bg-gray-700" />
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="flex items-center justify-center gap-3">
                      <button onClick={() => setEditingRowIndex(index)} className="text-amber-500 hover:text-amber-700 hover:bg-amber-50 p-1.5 rounded-lg transition-colors border border-amber-100" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setRows(rows.filter(r => r.id !== row.id))} className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all border border-red-100" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );

  return (
    <>

      <div className="flex flex-col gap-6 items-stretch">
        <div className="w-full">
          {renderAccountingForm()}
          
          <VoucherTotalsSummary rows={rows} 
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            ledgerMasters={ledgerMasters}
            totals={totals}
            activeTab={activeTab}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] md:sticky md:bottom-0 md:-mx-6 lg:-mx-8 md:-mb-6 lg:-mb-8 z-[60] md:z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-2 md:p-1.5 flex justify-end md:justify-between items-center px-4 md:px-6 lg:px-8 mt-4 md:mt-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest">
           {activeTab.replace('_', ' ')}
        </div>
        <div className="flex gap-1 overflow-x-auto custom-scrollbar py-0.5 items-center">
           <button 
             onClick={() => setIsSection0Collapsed(!isSection0Collapsed)} 
             title="Toggle Navigation & Save"
             className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             {isSection0Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </button>
           <div className={`${isSection0Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
             <button 
               onClick={() => handleNavigate('first')} 
               title="First Record"
               className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
             >
               <ChevronsLeft size={18} />
             </button>
             <button 
               onClick={() => handleNavigate('up')} 
               title="Previous Record"
               className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
             >
               <ChevronLeft size={18} />
             </button>

             <button onClick={handleSave} title="Save" className="p-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm active:scale-95 shrink-0">
               <Save size={18} />
             </button>

             <button 
               onClick={() => handleNavigate('down')} 
               title="Next Record"
               className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
             >
               <ChevronRight size={18} />
             </button>
             <button 
               onClick={() => handleNavigate('last')} 
               title="Last Record"
               className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
             >
               <ChevronsRight size={18} />
             </button>
           </div>

           <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

           <button 
             onClick={() => setIsSection1Collapsed(!isSection1Collapsed)} 
             title="Toggle Tools"
             className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             {isSection1Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </button>
           <div className={`${isSection1Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
             <button onClick={() => setShowHistory(true)} title="View History" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <ClipboardList size={18} />
             </button>
             <button onClick={(e) => { e.stopPropagation(); setScanningRowIndex(-1); setShowScanner(true); }} title="Scan Barcode" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <ScanBarcode size={18} />
             </button>
             <button onClick={() => fileInputRef.current?.click()} title="Attach Files" className="relative p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               {attachedFile && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
               <Paperclip size={18} />
             </button>
             <button onClick={() => setShowCalculator(true)} title="Calculator" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Calculator size={18} />
             </button>
             <button onClick={handleDuplicateEntry} title="Duplicate Entry" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <PlusCircle size={18} />
             </button>
           </div>
           
           <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

           <button 
             onClick={() => setIsSection2Collapsed(!isSection2Collapsed)} 
             title="Toggle Export Options"
             className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             {isSection2Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </button>
           <div className={`${isSection2Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
             <button 
               onClick={handleNewEntry} 
               title="New Entry"
               className="block p-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
             >
               <Plus size={18} />
             </button>
             <button onClick={handleSavePrint} title="Save & Print" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Printer size={18} />
             </button>
             <button onClick={handleSaveNew} title="Save & New" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <FilePlus size={18} />
             </button>
             <button onClick={handleSaveDraft} title="Save as Draft" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Bookmark size={18} />
             </button>
             <button onClick={handlePreview} title="Print Preview" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Eye size={18} />
             </button>
             <button onClick={handleGeneratePDF} title="Generate PDF" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <FileText size={18} />
             </button>
             <button onClick={handleGenerateImage} title="Generate Image" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Image size={18} />
             </button>
           </div>
           
           <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

           <button 
             onClick={() => setIsSection3Collapsed(!isSection3Collapsed)} 
             title="Toggle Settings & Actions"
             className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             {isSection3Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </button>
           <div className={`${isSection3Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
             <button onClick={handleClearEntryClick} title="Clear Entry" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
               <X size={18} />
             </button>
             <button onClick={handleDeleteEntryClick} title="Delete Entry" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
               <Trash2 size={18} />
             </button>
             <button onClick={() => setShowKeyboardShortcuts(true)} title="Keyboard Shortcuts" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Keyboard size={18} />
             </button>
             <button onClick={() => setShowHelp(true)} title="Help" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <HelpCircle size={18} />
             </button>
             <button onClick={() => onOpenPrintSettings && onOpenPrintSettings()} title="Print Settings" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Settings2 size={18} />
             </button>
           </div>
        </div>
      </div>

      
      <VoucherItemEditModal 
        isOpen={editingRowIndex !== null}
        editingRowIndex={editingRowIndex}
        setEditingRowIndex={setEditingRowIndex}
        expandedRowSection={expandedRowSection}
        setExpandedRowSection={setExpandedRowSection}
        rows={rows}
        setRows={setRows}
        itemMasters={itemMasters}
        handleItemOrSkuChange={handleItemOrSkuChange}
        setScanningRowIndex={setScanningRowIndex}
        setShowScanner={setShowScanner}
        getRowPreTaxRoundOff={getRowPreTaxRoundOff}
        calculateRowAmount={calculateRowAmount}
        getRowRoundOff={getRowRoundOff}
        calculateRowNetAmount={calculateRowNetAmount}
      />
      
      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        onSave={(item) => {
          if (onAddItemMaster) {
            onAddItemMaster(item);
            alert(`New item "${item.name}" created successfully!`);
          }
        }}
      />
      <BarcodeScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleBarcodeScanned}
      />
      {showCalculator && (
        <CalculatorModal 
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />
      )}
      <VoucherHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <VoucherKeyboardShortcutsModal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />
      
      {/* Hidden file input for file attachments */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      
      <HistoryModal 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        storageKey="bharat_book_all_vouchers_v2" 
        onSelectRecord={(record) => loadRecord(record)}
        title="Voucher History" 
      />
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Voucher"
        message="Are you sure you want to delete this voucher? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        isDestructive={true}
      />
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Entry"
        message="Are you sure you want to clear all fields? Any unsaved changes will be lost."
        onConfirm={handleConfirmClear}
        onCancel={() => setShowClearConfirm(false)}
        confirmText="Clear Form"
        isDestructive={true}
      />
      {showPreview && (
        <VoucherPreview 
          header={headerDetails}
          rows={getEnrichedRows()}
          totals={totals}
          type={activeTab}
          onClose={() => setShowPreview(false)}
          onDownloadPDF={handleGeneratePDF}
          onDownloadImage={handleGenerateImage}
          autoPrint={isPrinting}
        />
      )}
      <Notification 
        message={notification.message}
        type={notification.type}
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </>
  );
};

