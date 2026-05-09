
import React, { useState, useEffect } from 'react';
import { Package, Trash2, Edit2, X, ArrowRightLeft, Move, Database, Warehouse, Zap, Plus, Save, MapPin, ClipboardList, Settings2, Users, ChevronDown, ChevronUp, ScanBarcode, Import, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Printer, Eye, Image, FileText, FilePlus, Bookmark, Calculator, Tags, Info, HelpCircle, Paperclip, PlusCircle, Keyboard, Layout } from 'lucide-react';
import { SearchableDropdown } from '../../ui/SearchableDropdown';
import { NewItemModal } from '../NewItemModal';
import { BarcodeScannerModal } from '../BarcodeScannerModal';
import { CalculatorModal } from '../../ui/CalculatorModal';
import { ConfirmModal } from '../../ui/ConfirmModal';
import { HistoryModal } from '../../ui/HistoryModal';
import { getNextVoucherNumber, incrementVoucherNumber } from '../../../services/voucherNumbering';
import { VoucherPreview } from '../VoucherEntry/VoucherPreview';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Notification, NotificationType } from '../../ui/Notification';
import { EntryDetailsSection } from './components/EntryDetailsSection';
import { LocationSection } from './components/LocationSection';
import { PartySection } from './components/PartySection';
import { LogisticsSection } from './components/LogisticsSection';
import { ItemTableSection } from './components/ItemTableSection';
import { AdjustmentsSection } from './components/AdjustmentsSection';
import { SummarySection } from './components/SummarySection';
import { RemarksSection } from './components/RemarksSection';
import { InventoryActionMenu } from './components/InventoryActionMenu';
import { ItemEditModal } from './components/ItemEditModal';
import { InventoryEditModal } from './components/InventoryEditModal';
import { InventoryHelpModal } from './components/InventoryHelpModal';

interface InventoryEntryViewProps {
  defaultType?: string;
  itemMasters?: any[];
  warehouseMasters?: any[];
  ledgerMasters?: any[];
  partyMasters?: any[];
  onUpdateItemMaster?: (item: any) => void;
  onAddItemMaster?: (item: any) => void;
  onOpenPrintSettings?: () => void;
}

export const InventoryEntryView: React.FC<InventoryEntryViewProps> = ({ defaultType, itemMasters = [], warehouseMasters = [], ledgerMasters = [], partyMasters = [], onUpdateItemMaster, onAddItemMaster, onOpenPrintSettings }) => {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [expandedRowSection, setExpandedRowSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(defaultType || 'stock_journal');
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
    if (defaultType) {
      setActiveTab(defaultType);
      setRows([{id: Date.now()}, {id: Date.now() + 1}]);
    }
  }, [defaultType]);

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
    logistics: true
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

  const tabs = [
    { id: 'stock_journal', label: 'Stock Journal', icon: ArrowRightLeft },
    { id: 'physical_stock', label: 'Physical Stock', icon: Database },
    { id: 'consumption', label: 'Item Consumption', icon: Zap },
    { id: 'scrap', label: 'Item Scrap', icon: Trash2 },
    { id: 'transfer', label: 'Inter-Warehouse', icon: Move },
    { id: 'rejections_in', label: 'Rejections In', icon: Warehouse },
    { id: 'rejections_out', label: 'Rejections Out', icon: Warehouse },
  ];

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
    // Update default business role when entity category changes
    let defaultRole = 'Trader';
    if (headerDetails.entityCategory === 'Vendor') {
      defaultRole = 'Supplier';
    }
    setHeaderDetails(prev => ({ ...prev, businessRole: defaultRole }));
  }, [headerDetails.entityCategory]);

  useEffect(() => {
    // Auto-detect supply type based on Place of Supply
    // Assuming company base state is Maharashtra (27) for this implementation
    const currentPlace = (headerDetails.placeOfSupply || '').trim().toLowerCase();
    
    if (!currentPlace) {
      handleHeaderChange('supplyType', 'Intra-State');
      return;
    }

    // Comprehensive check for Maharashtra (27)
    const isLocal = ['maharashtra', 'mh', '27'].some(s => currentPlace.includes(s));
    const isInterState = !isLocal;
    
    const newSupplyType = isInterState ? 'Inter-State' : 'Intra-State';
    if (headerDetails.supplyType !== newSupplyType) {
      handleHeaderChange('supplyType', newSupplyType);
    }
  }, [headerDetails.placeOfSupply]);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Default entity category based on active tab
    let category = 'Customer';
    let role = 'Trader';
    
    // Inventory types logic
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

  const [submitOptionsOpen, setSubmitOptionsOpen] = useState(false);

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

  const totals = React.useMemo(() => {
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
    if (!hasValidRows) {
      setFormError('At least one item with a quantity is required.');
      return false;
    }
    return true;
  };

  const WebBillRequirements = () => (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start space-x-3">
        <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
          <HelpCircle size={18} className="text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider mb-2">Inventory Bill Requirements</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {[
              'Unique sequential Entry Number',
              'Valid Warehouse/Location identification',
              'Batch/Lot Tracking details',
              'Accurate Stock Item units',
              'System-generated Date & Time Stamp',
              'Supervisor/Authorized verification',
              'Transit Vehicle number (if applicable)',
              'E-Waybill verification for transfers',
              'Real-time Stock adjustment records'
            ].map((req, i) => (
              <li key={i} className="flex items-center text-xs font-bold text-emerald-700/70">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
        <button 
          onClick={() => setShowRequirements(false)}
          className="ml-auto text-emerald-400 hover:text-emerald-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );

  const getEnrichedRows = () => rows.map(r => ({
      ...r,
      amount: (parseSafe(r.qty) * parseSafe(r.rate)).toFixed(2)
  }));

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
    const saved = JSON.parse(localStorage.getItem('bharat_book_inventory_entries') || '[]');
    if (currentRecordId && saved.some((v: any) => v.id === currentRecordId)) {
        const idx = saved.findIndex((v: any) => v.id === currentRecordId);
        saved[idx] = entry;
    } else {
        saved.push(entry);
    }
    localStorage.setItem('bharat_book_inventory_entries', JSON.stringify(saved));
    setCurrentRecordId(entry.id);
    
    if (!isDraft) {
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
    const entry = saveInventoryEntry();
    handleSaveInfoResult(entry);
  };

  const handleSaveNew = () => {
    const entry = saveInventoryEntry();
    if (!entry) return;
    
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
    showNotify('Entry saved successfully! Starting a new one.');
  };

  const handleSavePrint = () => {
    const entry = saveInventoryEntry();
    if (entry) {
        setIsPrinting(true);
        setShowPreview(true);
    }
  };

  const handleSaveDraft = () => {
    saveInventoryEntry(true);
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
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);

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
    }
  };

  const handleNavigate = (direction: 'up' | 'down' | 'first' | 'last') => {
    const allEntriesRaw = localStorage.getItem('bharat_book_inventory_entries');
    if (!allEntriesRaw) return;
    
    const allEntries = JSON.parse(allEntriesRaw) as any[];
    const ofType = allEntries.filter(v => v.type === activeTab);

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
          handleSavePrint();
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
          else if (key === '7') { e.preventDefault(); setExpandedRowSection(prev => prev === 'pricing' ? null : 'pricing'); }
          else if (key === '8') { e.preventDefault(); setExpandedRowSection(prev => prev === 'tracking' ? null : 'tracking'); }
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
        handleSavePrint();
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
        setExpandedRowSection(prev => prev === 'pricing' ? null : 'pricing');
      } else if (e.altKey && e.key === '8') {
        e.preventDefault();
        setExpandedRowSection(prev => prev === 'tracking' ? null : 'tracking');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleDuplicateEntry = () => {
    setCurrentRecordId(null);
    setHeaderDetails(prev => ({
        ...prev,
        entryNumber: getNextVoucherNumber(activeTab) || '',
        systemStamp: undefined
    }));
    showNotify('Entry duplicated! You can now save it as a new record.');
  };

  const [showSectionShortcuts, setShowSectionShortcuts] = useState(false);
  const [showHelpFunctionality, setShowHelpFunctionality] = useState(false);
  const [showHelpGeneral, setShowHelpGeneral] = useState(false);
  const [showHelpDocShortcuts, setShowHelpDocShortcuts] = useState(false);
  const [showHelpToolShortcuts, setShowHelpToolShortcuts] = useState(false);
  const [showHelpProTips, setShowHelpProTips] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleDeleteEntryClick = () => {
    if (!currentRecordId) {
      showNotify('Record not saved yet, nothing to delete.', 'info');
      handleNewEntry();
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    const savedStr = localStorage.getItem('bharat_book_inventory_entries');
    if (savedStr) {
      let saved: any[] = JSON.parse(savedStr);
      saved = saved.filter((v: any) => v.id !== currentRecordId);
      localStorage.setItem('bharat_book_inventory_entries', JSON.stringify(saved));
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
      pdf.save(`${activeTab}_${headerDetails.entryNumber || 'inventory'}.pdf`);
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
      link.download = `${activeTab}_${headerDetails.entryNumber || 'inventory'}.png`;
      link.href = dataUrl;
      link.click();
      showNotify('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      showNotify('Failed to generate image. Please try again.', 'error');
    }
  };


  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
            <span>Operations</span> <span className="text-gray-300">/</span> <span>Inventory</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center tracking-tight">
             Stock Transactions
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Manage item movements, taxable adjustments, and non-monetary stock updates</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 font-medium">
           Workspace / Inventory
        </div>
      </div>

      <div className="sticky top-0 z-[40] md:static -mx-4 px-4 -mt-4 pt-4 bg-gray-100/95 backdrop-blur-md pb-4 mb-4 md:-mx-0 md:px-0 md:-mt-0 md:pt-0 md:bg-transparent md:pb-0 md:mb-8 overflow-x-auto no-scrollbar w-full">
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm inline-flex min-w-max">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setRows([{id: Date.now()}, {id: Date.now() + 1}]); }}
                className={`
                  whitespace-nowrap py-2.5 px-5 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all flex items-center
                  ${activeTab === tab.id 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20' 
                    : 'bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
              >
                <tab.icon size={14} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-stretch pb-24 md:pb-0">
        <div className="w-full">
          <EntryDetailsSection
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            systemStamp={systemStamp}
            formError={formError}
            showRequirements={showRequirements}
            setShowRequirements={setShowRequirements}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            fileInputRef={fileInputRef}
            attachedFile={attachedFile}
            setAttachedFile={setAttachedFile}
            activeTab={activeTab}
          />
          <LocationSection
            activeTab={activeTab}
            headerDetails={headerDetails}
            warehouseMasters={warehouseMasters}
            handleHeaderChange={handleHeaderChange}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
          />
          <PartySection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            partyMasters={partyMasters}
            handleHeaderChange={handleHeaderChange}
            activeTab={activeTab}
          />
          <LogisticsSection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
          />
          <ItemTableSection
            activeTab={activeTab}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            rows={rows}
            setRows={setRows}
            itemMasters={itemMasters}
            warehouseMasters={warehouseMasters}
            handleItemOrSkuChange={handleItemOrSkuChange}
            setEditingRowIndex={setEditingRowIndex}
            setExpandedRowSection={setExpandedRowSection}
            setShowScanner={setShowScanner}
            setScanningRowIndex={setScanningRowIndex}
            showRequirements={showRequirements}
            setShowNewItemModal={setShowNewItemModal}
          />
          
          <RemarksSection
             collapsedSections={collapsedSections}
             toggleSection={toggleSection}
             headerDetails={headerDetails}
             handleHeaderChange={handleHeaderChange}
          />
        </div>
        
        {activeTab !== 'physical_stock' && (
        <div className="w-full">
          <AdjustmentsSection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            ledgerMasters={ledgerMasters}
          />
        </div>
        )}

        <div className="w-full">
          <SummarySection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            totals={totals}
            activeTab={activeTab}
            headerDetails={headerDetails}
            rows={rows}
          />
        </div>
      </div>

      <InventoryActionMenu
        activeTab={activeTab}
        isSection0Collapsed={isSection0Collapsed} setIsSection0Collapsed={setIsSection0Collapsed}
        isSection1Collapsed={isSection1Collapsed} setIsSection1Collapsed={setIsSection1Collapsed}
        isSection2Collapsed={isSection2Collapsed} setIsSection2Collapsed={setIsSection2Collapsed}
        isSection3Collapsed={isSection3Collapsed} setIsSection3Collapsed={setIsSection3Collapsed}
        handleNavigate={handleNavigate}
        handleSave={handleSave}
        setShowHistory={setShowHistory}
        setScanningRowIndex={setScanningRowIndex}
        setShowScanner={setShowScanner}
        fileInputRef={fileInputRef}
        attachedFile={attachedFile}
        setShowCalculator={setShowCalculator}
        handleDuplicateEntry={handleDuplicateEntry}
        handleNewEntry={handleNewEntry}
        handleSavePrint={handleSavePrint}
        handleSaveNew={handleSaveNew}
        handleSaveDraft={handleSaveDraft}
        handlePreview={handlePreview}
        handleGeneratePDF={handleGeneratePDF}
        handleGenerateImage={handleGenerateImage}
        handleClearEntryClick={handleClearEntryClick}
        handleDeleteEntryClick={handleDeleteEntryClick}
        setShowKeyboardShortcuts={setShowKeyboardShortcuts}
        setShowHelp={setShowHelp}
        onOpenPrintSettings={onOpenPrintSettings}
      />
      
      <InventoryEditModal
        isOpen={editingRowIndex !== null}
        onClose={() => { setEditingRowIndex(null); setExpandedRowSection(null); }}
        rows={rows}
        editingRowIndex={editingRowIndex!}
        expandedRowSection={expandedRowSection}
        setExpandedRowSection={setExpandedRowSection}
        handleItemOrSkuChange={handleItemOrSkuChange}
        setRows={setRows}
        setShowScanner={setShowScanner}
        setScanningRowIndex={setScanningRowIndex}
        itemMasters={itemMasters}
        warehouseMasters={warehouseMasters}
        activeTab={activeTab}
      />
      
      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        onSave={(item) => {
          if (onAddItemMaster) {
            onAddItemMaster(item);
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
      <InventoryHelpModal
        isOpen={showHelp || showKeyboardShortcuts}
        onClose={() => { setShowHelp(false); setShowKeyboardShortcuts(false); }}
      />

      <HistoryModal 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        storageKey="bharat_book_inventory_entries" 
        onSelectRecord={(record) => loadRecord(record)}
        title="Inventory History" 
      />

      {/* Hidden file input for attachments */}
      <input type="file" id="inventory-file-upload" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Entry"
        message="Are you sure you want to delete this inventory entry? This action cannot be undone."
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
    </div>
  );
};

