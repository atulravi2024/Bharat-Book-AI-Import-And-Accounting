export const creditNoteMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  return {
    _mappedAs: 'voucher',
    _type: 'Credit Note',
    date: getVal('date') || row['voucherDate'] || row['Date'] || row['Transaction Date'] || row['Txn Date'] || row['Credit Note Date'],
    particulars: getVal('particulars') || row['partyName'] || row['customerName'] || row['Customer'] || row['Paid To'] || row['Received From'],
    amount: getVal('amount') || row['total'] || row['Amount'] || row['Total Amount'] || row['Value'],
    voucherNumber: getVal('voucherNumber') || row['invoiceNo'] || row['Credit Note No'] || row['Credit Note Number'] || row['CN No'],
    narration: getVal('narration') || row['remarks'] || row['Notes'] || row['description'] || row['Narration'],
    tax: getVal('tax') || row['taxAmount'] || row['Tax'] || row['GST'] || row['CGST'] || row['SGST'] || row['IGST'],
    supplyType: getVal('supplyType') || row['supplyType'] || row['Supply Type'],
    placeOfSupply: getVal('placeOfSupply') || row['placeOfSupply'] || row['Place of Supply'] || row['POS'],
    raw: row
  };
};
