import React from 'react';
import { calculateRowAmountBeforePreTaxRoundOff, calculateRowAmount, getRowPostTaxDiscount, getRowRoundOff, getRowPreTaxRoundOff } from '../../VoucherCalculations';

interface UseSalesVoucherTotalsProps {
  rows: any[];
  activeTab: string;
  headerDetails: any;
}

export const useSalesVoucherTotals = ({
  rows,
  activeTab,
  headerDetails,
}: UseSalesVoucherTotalsProps) => {
  return React.useMemo(() => {
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
};
