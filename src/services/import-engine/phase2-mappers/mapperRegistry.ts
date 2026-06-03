import { hdfcV1Mapper } from './banks/hdfc/v1_mapper';
import { hdfcV2Mapper } from './banks/hdfc/v2_mapper';
import { sbiDefaultMapper } from './banks/sbi/default_mapper';
import { iciciDefaultMapper } from './banks/icici/default_mapper';
import { purchaseMapper } from './vouchers/purchaseMapper';
import { salesMapper } from './vouchers/salesMapper';
import { paymentMapper } from './vouchers/paymentMapper';
import { receiptMapper } from './vouchers/receiptMapper';
import { journalMapper } from './vouchers/journalMapper';
import { contraMapper } from './vouchers/contraMapper';
import { creditNoteMapper } from './vouchers/creditNoteMapper';
import { debitNoteMapper } from './vouchers/debitNoteMapper';
import { ledgerMapper } from './masters/ledgerMapper';
import { itemMapper } from './masters/itemMapper';
import { itemVouchersMapper } from './vouchers/itemVouchersMapper';

export const routeToMapper = (
  rawRow: any,
  dataType: string,
  specificType?: string,
  mapping?: Record<string, string>
) => {
  if (dataType === 'bank_transaction') {
    if (specificType === 'hdfc_v1') return hdfcV1Mapper(rawRow, mapping);
    if (specificType === 'hdfc_v2') return hdfcV2Mapper(rawRow, mapping);
    if (specificType === 'sbi') return sbiDefaultMapper(rawRow, mapping);
    if (specificType === 'icici') return iciciDefaultMapper(rawRow, mapping);
    return { ...rawRow, _mappedAs: 'bank_transaction' };
  }
  
  if (dataType === 'voucher') {
    if (specificType === 'Purchase') return purchaseMapper(rawRow, mapping);
    if (specificType === 'Sales') return salesMapper(rawRow, mapping);
    if (specificType === 'Payment') return paymentMapper(rawRow, mapping);
    if (specificType === 'Receipt') return receiptMapper(rawRow, mapping);
    if (specificType === 'Journal') return journalMapper(rawRow, mapping);
    if (specificType === 'Contra') return contraMapper(rawRow, mapping);
    if (specificType === 'Credit Note' || specificType === 'CreditNote') return creditNoteMapper(rawRow, mapping);
    if (specificType === 'Debit Note' || specificType === 'DebitNote' || specificType === 'Purchase Note') return debitNoteMapper(rawRow, mapping);
    if (
      specificType === 'Stock Journal' ||
      specificType === 'Physical Stock' ||
      specificType === 'Item Consumption' ||
      specificType === 'Item Scrap' ||
      specificType === 'Interlocation' ||
      specificType === 'Rejection In' ||
      specificType === 'Rejection Out'
    ) {
      return itemVouchersMapper(rawRow, mapping, specificType);
    }
    return { ...rawRow, _mappedAs: 'voucher', _type: specificType };
  }
  
  if (dataType === 'master') {
    const isItemMaster = [
      'items', 'basic_items', 'bom', 'uom', 'uoms', 'stockGroups', 'categories', 'stockCategories', 'brands', 'variants', 'sizes', 'colors', 'gst', 'skus', 'grades', 'priceLists'
    ].includes(specificType || '');

    if (isItemMaster) {
      return itemMapper(rawRow, mapping, specificType);
    }
    return ledgerMapper(rawRow, mapping);
  }

  return { ...rawRow, _mappedAs: 'miscellaneous' };
};
