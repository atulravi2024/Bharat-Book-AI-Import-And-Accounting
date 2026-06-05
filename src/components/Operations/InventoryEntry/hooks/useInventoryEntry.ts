import { useState, useEffect, useMemo, useRef } from 'react';
import { getNextVoucherNumber, incrementVoucherNumber } from '../../../../services/voucherNumbering';
import { NotificationType } from '../../../ui/Notification';

export const useInventoryEntry = ({
  defaultType,
  itemMasters = [],
  partyMasters = [],
  vouchers = [],
  onSaveEntry,
}: {
  defaultType?: string;
  itemMasters?: any[];
  partyMasters?: any[];
  vouchers?: any[];
  onSaveEntry?: (entry: any, isNew: boolean) => void;
}) => {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [expandedRowSection, setExpandedRowSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(defaultType || 'stock_journal');
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanningRowIndex, setScanningRowIndex] = useState<number | null>(null);

  const [rows, setRows] = useState<any[]>([{ id: Date.now() }, { id: Date.now() + 1 }]);

  const [collapsedSections, setCollapsedSections] = useState({
    header: true,
    location: false,
    lineItems: false,
    remarks: true,
    taxableAdjustments: true,
    nonTaxableAdjustments: true,
    rounding: true,
    summary: false,
    party: false,
    logistics: true,
    systemInfo: true
  });

  const [showRequirements, setShowRequirements] = useState(false);

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleItemOrSkuChange = (rowIndex: number, value: string, field: 'itemName' | 'sku') => {
    const newRows = [...rows];
    const row = newRows[rowIndex];
    
    if (field === 'itemName') {
      row.itemName = value;
    } else {
      row.sku = value;
    }
    
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
      row.unit = item.uom || item.unit || 'PCS';
      row.rate = item.price || item.sales_rate || item.purchase_rate || '';
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
        setRows(prev => [...prev, { id: Date.now(), itemName: matchedName }]);
        setTimeout(() => handleItemOrSkuChange(newIndex, matchedName, 'itemName'), 0);
      }
    }
  };

  const [headerDetails, setHeaderDetails] = useState<{ [key: string]: any }>({
    entryDate: new Date().toISOString().substring(0, 10),
    entryNumber: getNextVoucherNumber(defaultType || 'stock_journal') || '',
    referenceNo: '',
    sourceLocation: '',
    destinationLocation: '',
    location: '',
    remarks: '',
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
    voucherDiscountPct: '',
    voucherDiscountAmount: '',
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
        placeOfSupply: selectedParty.state || prev.placeOfSupply,
        billingState: selectedParty.state || prev.billingState,
        billingAddress: selectedParty.address || prev.billingAddress,
        billingPinCode: selectedParty.pincode || prev.billingPinCode,
        gstNumber: selectedParty.gstin || prev.gstNumber,
        panNo: selectedParty.pan || (selectedParty.gstin && selectedParty.gstin.length >= 12 ? selectedParty.gstin.substring(2, 12) : prev.panNo),
        creditPeriod: selectedParty.creditDays || prev.creditPeriod,
        billingPartyName: selectedParty.name,
        contactPerson: selectedParty.contactPerson || prev.contactPerson,
        mobileNumber: selectedParty.mobile || prev.mobileNumber,
        whatsappNumber: selectedParty.whatsapp || prev.whatsappNumber,
        emailId: selectedParty.email || prev.emailId
      }));
    }
  }, [headerDetails.partyName, partyMasters]);

  useEffect(() => {
    let defaultRole = 'Trader';
    if (headerDetails.entityCategory === 'Vendor') {
      defaultRole = 'Supplier';
    }
    setHeaderDetails(prev => ({ ...prev, businessRole: defaultRole }));
  }, [headerDetails.entityCategory]);

  useEffect(() => {
    const currentPlace = String(headerDetails.placeOfSupply?.value || headerDetails.placeOfSupply || '').trim().toLowerCase();
    if (!currentPlace) {
      setHeaderDetails(prev => ({ ...prev, supplyType: 'Intra-State' }));
      return;
    }
    const isLocal = ['maharashtra', 'mh', '27'].some(s => currentPlace.includes(s));
    const isInterState = !isLocal;
    const newSupplyType = isInterState ? 'Inter-State' : 'Intra-State';
    if (headerDetails.supplyType !== newSupplyType) {
      setHeaderDetails(prev => ({ ...prev, supplyType: newSupplyType }));
    }
  }, [headerDetails.placeOfSupply]);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let category = 'Customer';
    let role = 'Trader';
    
    if (activeTab === 'transfer' || activeTab === 'rejections_out' || activeTab === 'scrap') {
      category = 'Vendor';
      role = 'Supplier';
    } else if (activeTab === 'rejections_in') {
      category = 'Customer';
      role = 'Trader';
    } else if (activeTab === 'physical_stock') {
      category = 'Both';
      role = 'Trader';
    } else {
      category = 'Internal';
      role = 'Trader';
    }

    setHeaderDetails(prev => ({
        ...prev,
        entryNumber: getNextVoucherNumber(activeTab) || '',
        entityCategory: category,
        businessRole: role
    }));
    setFormError(null);
  }, [activeTab]);

  const handleHeaderChange = (field: string, value: any) => {
    setHeaderDetails(prev => ({ ...prev, [field]: value }));
  };

  const parseSafe = (val: any): number => {
    if (typeof val === 'string') {
        val = val.replace(/,/g, '');
    }
    const parsed = parseFloat(val);
    return isFinite(parsed) && !isNaN(parsed) ? parsed : 0;
  };

  const totals = useMemo(() => {
    const totalItems = rows.filter(r => r.itemName).length;
    const totalQty = rows.reduce((sum, row) => sum + parseSafe(row.qty), 0);
    const estValue = rows.reduce((sum, row) => sum + (parseSafe(row.qty) * parseSafe(row.rate)), 0);
    
    let voucherDiscountAmt = 0;
    if (headerDetails.voucherDiscountPct) {
      voucherDiscountAmt += estValue * (parseSafe(headerDetails.voucherDiscountPct) / 100);
    }
    if (headerDetails.voucherDiscountAmount) {
      voucherDiscountAmt += parseSafe(headerDetails.voucherDiscountAmount);
    }
    let taxableOtherAdjustmentAmount = 0;
    if (headerDetails.taxableOtherAdjustmentPct) {
      taxableOtherAdjustmentAmount += estValue * (parseSafe(headerDetails.taxableOtherAdjustmentPct) / 100);
    }
    if (headerDetails.taxableOtherAdjustment) {
      taxableOtherAdjustmentAmount += parseSafe(headerDetails.taxableOtherAdjustment);
    }
    
    let nonTaxableOtherAdjustmentAmount = 0;
    if (headerDetails.nonTaxableOtherAdjustmentPct) {
      nonTaxableOtherAdjustmentAmount += estValue * (parseSafe(headerDetails.nonTaxableOtherAdjustmentPct) / 100);
    }
    if (headerDetails.nonTaxableOtherAdjustment) {
      nonTaxableOtherAdjustmentAmount += parseSafe(headerDetails.nonTaxableOtherAdjustment);
    }

    let nonTaxableVoucherDiscountAmt = 0;
    if (headerDetails.nonTaxableVoucherDiscountPct) {
      nonTaxableVoucherDiscountAmt += estValue * (parseSafe(headerDetails.nonTaxableVoucherDiscountPct) / 100);
    }
    if (headerDetails.nonTaxableVoucherDiscountAmount) {
      nonTaxableVoucherDiscountAmt += parseSafe(headerDetails.nonTaxableVoucherDiscountAmount);
    }
    
    const preRoundValue = estValue - voucherDiscountAmt - nonTaxableVoucherDiscountAmt + taxableOtherAdjustmentAmount + nonTaxableOtherAdjustmentAmount;
    let finalValue = isFinite(preRoundValue) && !isNaN(preRoundValue) ? Math.max(0, preRoundValue) : 0;
    let roundOff = 0;

    if (headerDetails.roundingType === 'auto') {
      const rounded = Math.round(finalValue);
      roundOff = rounded - finalValue;
      finalValue = rounded;
    } else if (headerDetails.roundingType === 'up') {
      const rounded = Math.ceil(finalValue);
      roundOff = rounded - finalValue;
      finalValue = rounded;
    } else if (headerDetails.roundingType === 'down') {
      const rounded = Math.floor(finalValue);
      roundOff = rounded - finalValue;
      finalValue = rounded;
    } else if (headerDetails.roundingType === 'manual') {
      roundOff = parseSafe(headerDetails.roundingValue);
      finalValue += roundOff;
    }

    return { 
      totalItems, 
      totalQty, 
      estValue, 
      voucherDiscount: voucherDiscountAmt + nonTaxableVoucherDiscountAmt,
      taxableVoucherDiscount: voucherDiscountAmt,
      nonTaxableVoucherDiscount: nonTaxableVoucherDiscountAmt,
      otherAdjustment: taxableOtherAdjustmentAmount,
      nonTaxableAdjustment: nonTaxableOtherAdjustmentAmount,
      roundOff,
      finalValue 
    };
  }, [rows, headerDetails]);

  const validateEntry = (): boolean => {
    if (!headerDetails.entryDate) {
      setFormError('Entry Date is required.');
      return false;
    }
    const hasValidRows = rows.some(r => r.itemName && r.quantity);
    if (!hasValidRows && rows.length > 0) { // wait, previously it was r.quantity but we used r.qty 
      const hasQtyRows = rows.some(r => r.itemName && (r.qty || r.quantity));
      if(!hasQtyRows){
        setFormError('At least one item with a quantity is required.');
        return false;
      }
    }
    return true;
  };

  const getEnrichedRows = () => rows.map(r => ({
      ...r,
      amount: (parseSafe(r.qty) * parseSafe(r.rate)).toFixed(2)
  }));

  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType; isOpen: boolean }>({
    message: '',
    type: 'success',
    isOpen: false,
  });

  const showNotify = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type, isOpen: true });
  };

  const saveInventoryEntry = (isDraft = false) => {
    if (!isDraft && !validateEntry()) return null;
    
    const enrichedRows = getEnrichedRows();

    const entry = {
      id: currentRecordId || Date.now().toString(),
      type: activeTab,
      header: headerDetails,
      rows: enrichedRows,
      totals,
      isDraft,
      createdAt: new Date().toISOString()
    };
    setCurrentRecordId(entry.id);
    if (onSaveEntry) onSaveEntry(entry, !currentRecordId);
    
    if (!isDraft) {
      incrementVoucherNumber(activeTab);
    }
    setFormError(null);
    return entry;
  };

  const loadRecord = (entry: any | null) => {
    if (!entry) {
      setCurrentRecordId(null);
      setHeaderDetails({
        entryDate: new Date().toISOString().substring(0, 10),
        entryNumber: getNextVoucherNumber(activeTab) || '',
        referenceNo: '',
        sourceLocation: '',
        destinationLocation: '',
        location: '',
        remarks: '',
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
        voucherDiscountPct: '',
        voucherDiscountAmount: '',
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

    setCurrentRecordId(entry.id);
    if (entry.header && entry.rows) {
      setHeaderDetails(entry.header);
      setRows(entry.rows);
    } else {
      setHeaderDetails(prev => ({
        ...prev,
        entryDate: entry.date?.value || entry.date || prev.entryDate,
        entryNumber: entry.invoiceNumber?.value || entry.invoiceNumber || getNextVoucherNumber(activeTab) || '',
        location: entry.location?.value || entry.location || prev.location,
        remarks: entry.narration?.value || entry.narration || prev.remarks
      }));
      
      if (entry.items && entry.items.length > 0) {
        setRows(entry.items.map((it: any, i: number) => ({
          id: Date.now() + i,
          itemName: it.name?.value || it.name || '',
          qty: it.quantity?.value || it.quantity || '',
          rate: it.rate?.value || it.rate || '',
          amount: it.amount?.value || it.amount || '',
        })));
      } else {
        setRows([{ id: Date.now() }, { id: Date.now() + 1 }]);
      }
    }
  };

  const handleNavigate = (direction: 'up' | 'down' | 'first' | 'last') => {
    const allEntries = vouchers || [];
    if (allEntries.length === 0) return;
    const ofType = allEntries.filter(v => {
        const vType = (typeof v.type === 'string' ? v.type.toLowerCase().replace(/ /g, '_') : v.type);
        return vType === activeTab;
    });

    if (ofType.length === 0) {
      if (currentRecordId !== null) loadRecord(null);
      return;
    }

    ofType.sort((a, b) => {
      const dateA = new Date(a.header?.entryDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.header?.entryDate || b.createdAt || 0).getTime();
      return dateA - dateB;
    });

    const currentIndex = currentRecordId ? ofType.findIndex(v => v.id === currentRecordId) : -1;
    
    let nextIndex: number;
    if (direction === 'first') {
      nextIndex = 0;
    } else if (direction === 'last') {
      nextIndex = ofType.length - 1;
    } else if (direction === 'up') {
      if (currentIndex === -1) {
        nextIndex = ofType.length - 1;
      } else if (currentIndex === 0) {
        nextIndex = -1;
      } else {
        nextIndex = currentIndex - 1;
      }
    } else {
      if (currentIndex === -1) {
        nextIndex = 0;
      } else if (currentIndex === ofType.length - 1) {
        nextIndex = -1;
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

  const handleDuplicateEntry = () => {
    setCurrentRecordId(null);
    setHeaderDetails(prev => ({
        ...prev,
        entryNumber: getNextVoucherNumber(activeTab) || '',
        systemStamp: undefined
    }));
    showNotify('Entry duplicated! You can now save it as a new record.');
  };

  const handleNewEntry = () => {
    loadRecord(null);
  };

  const handleClearEntryClick = () => setShowClearConfirm(true);
  const handleDeleteEntryClick = () => {
    if (!currentRecordId) {
      showNotify('Record not saved yet, nothing to delete.', 'info');
      handleNewEntry();
      return;
    }
    setShowDeleteConfirm(true);
  };

  const [showPreview, setShowPreview] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSection0Collapsed, setIsSection0Collapsed] = useState(true);
  const [isSection1Collapsed, setIsSection1Collapsed] = useState(true);
  const [isSection2Collapsed, setIsSection2Collapsed] = useState(true);
  const [isSection3Collapsed, setIsSection3Collapsed] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  useEffect(() => {
    if (defaultType) {
      setActiveTab(defaultType);
      setRows([{id: Date.now()}, {id: Date.now() + 1}]);
    }
  }, [defaultType]);

  return {
    editingRowIndex, setEditingRowIndex,
    expandedRowSection, setExpandedRowSection,
    activeTab, setActiveTab,
    showNewItemModal, setShowNewItemModal,
    showScanner, setShowScanner,
    scanningRowIndex, setScanningRowIndex,
    rows, setRows,
    collapsedSections, toggleSection,
    showRequirements, setShowRequirements,
    headerDetails, handleHeaderChange,
    systemStamp,
    formError, setFormError,
    totals,
    notification, setNotification, showNotify,
    showPreview, setShowPreview,
    isPrinting, setIsPrinting,
    showCalculator, setShowCalculator,
    currentRecordId,
    showHistory, setShowHistory,
    showHelp, setShowHelp,
    showKeyboardShortcuts, setShowKeyboardShortcuts,
    showDeleteConfirm, setShowDeleteConfirm,
    showClearConfirm, setShowClearConfirm,
    isSection0Collapsed, setIsSection0Collapsed,
    isSection1Collapsed, setIsSection1Collapsed,
    isSection2Collapsed, setIsSection2Collapsed,
    isSection3Collapsed, setIsSection3Collapsed,
    fileInputRef,
    attachedFile, setAttachedFile,
    handleBarcodeScanned,
    handleItemOrSkuChange,
    saveInventoryEntry,
    getEnrichedRows,
    loadRecord,
    handleNavigate,
    handleDuplicateEntry,
    handleNewEntry,
    handleClearEntryClick,
    handleDeleteEntryClick
  };
};
