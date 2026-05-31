import { hdfcV1Mapper } from './banks/hdfc/v1_mapper';
import { hdfcV2Mapper } from './banks/hdfc/v2_mapper';
import { sbiDefaultMapper } from './banks/sbi/default_mapper';
import { iciciDefaultMapper } from './banks/icici/default_mapper';
import { purchaseMapper } from './vouchers/purchaseMapper';
import { salesMapper } from './vouchers/salesMapper';
import { ledgerMapper } from './masters/ledgerMapper';

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
    return { ...rawRow, _mappedAs: 'voucher', _type: specificType };
  }
  
  if (dataType === 'master') {
     return ledgerMapper(rawRow, mapping);
  }

  return { ...rawRow, _mappedAs: 'miscellaneous' };
};
