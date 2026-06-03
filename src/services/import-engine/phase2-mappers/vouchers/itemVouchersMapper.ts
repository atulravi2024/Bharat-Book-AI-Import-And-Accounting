import { VoucherType } from '../../../../app/types';

export const itemVouchersMapper = (row: any, mapping?: Record<string, string>, specificType?: string) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  
  // Custom heuristics for item vouchers
  const date = getVal('date') || row['Date'] || row['date'] || row['voucherDate'] || row['Date'];
  const referenceNo = getVal('referenceNo') || row['ReferenceNo'] || row['referenceNo'] || row['ScrapReference'] || row['TransferID'] || row['RejectionID'] || row['rejectionId'] || row['Ref No'];
  const narration = getVal('narration') || row['Narration'] || row['narration'] || row['Reason'] || row['ReasonForRejection'] || row['remarks'] || row['Notes'];
  const partyName = getVal('partyName') || row['PartyName'] || row['partyName'] || row['AuditorName'] || row['TransitCarrier'] || row['particulars'] || row['Supplier'];
  
  const itemName = getVal('itemName') || row['ItemName'] || row['itemName'] || row['item'] || row['Item'];
  const quantity = parseFloat(getVal('quantity') || row['QuantityIn'] || row['QuantityOut'] || row['ActualStockCount'] || row['QuantityConsumed'] || row['QuantityScrapped'] || row['QuantityTransferred'] || row['QuantityRejected'] || '0') || 0;
  const rate = parseFloat(getVal('rate') || row['Rate'] || row['rate'] || row['UnitCost'] || row['unitCost'] || row['ScrapValueCollected'] || row['scrapValueCollected'] || '0') || 0;
  
  return {
    _mappedAs: 'voucher',
    _type: specificType || 'Stock Journal',
    date,
    referenceNo,
    narration,
    partyName,
    itemName,
    quantity,
    rate,
    amount: quantity * rate,
    raw: row
  };
};
