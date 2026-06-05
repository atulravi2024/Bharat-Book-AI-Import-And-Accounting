import { useState, useEffect } from 'react';
import { getNextVoucherNumber } from '../../../../../../services/voucherNumbering';

interface UseJournalVoucherNavigationProps {
  initialVoucher: any | null;
  activeTab: string;
  vouchers: any[];
  setHeaderDetails: (headerDetails: any | ((prev: any) => any)) => void;
  setRows: (rows: any[]) => void;
}

export const useJournalVoucherNavigation = ({
  initialVoucher,
  activeTab,
  vouchers,
  setHeaderDetails,
  setRows,
}: UseJournalVoucherNavigationProps) => {
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
      const importedPlaceOfSupply = voucher.placeOfSupply?.value || voucher.placeOfSupply || '';
      const importedGstin = voucher.gstin?.value || voucher.gstin || voucher.gstNumber?.value || voucher.gstNumber || '';
      const importedSupplyType = voucher.supplyType?.value || voucher.supplyType || '';
      
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
        placeOfSupply: importedPlaceOfSupply,
        gstNumber: importedGstin,
        supplyType: computedSupplyType,
      }));
      
      const isInventoryType = false;
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
    const ofType = allVouchers.filter(v => {
      const vType = (typeof v.type === 'string' ? v.type.toLowerCase().replace(/[\s_]+/g, '') : '');
      return ['journal', 'general'].includes(vType);
    });

    if (ofType.length === 0) {
      if (currentRecordId !== null) loadRecord(null);
      return;
    }

    ofType.sort((a, b) => {
      const dateA = new Date(a.date?.value || a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date?.value || b.date || b.createdAt || 0).getTime();
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

  return {
    currentRecordId,
    setCurrentRecordId,
    loadRecord,
    handleNavigate,
  };
};
