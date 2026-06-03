export const debitNoteMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  return {
    _mappedAs: 'voucher',
    _type: 'Debit Note',
    date: getVal('date') || row['voucherDate'] || row['Date'] || row['Transaction Date'] || row['Txn Date'] || row['Debit Note Date'] || row['Purchase Note Date'],
    particulars: getVal('particulars') || row['partyName'] || row['SupplierName'] || row['Supplier'] || row['Paid To'] || row['Received From'],
    amount: getVal('amount') || row['total'] || row['Amount'] || row['Total Amount'] || row['Value'],
    voucherNumber: getVal('voucherNumber') || row['invoiceNo'] || row['Debit Note No'] || row['Debit Note Number'] || row['DN No'] || row['Purchase Note No'] || row['Purchase Note Number'],
    narration: getVal('narration') || row['remarks'] || row['Notes'] || row['description'] || row['Narration'],
    tax: getVal('tax') || row['taxAmount'] || row['Tax'] || row['GST'] || row['CGST'] || row['SGST'] || row['IGST'],
    supplyType: getVal('supplyType') || row['supplyType'] || row['Supply Type'],
    placeOfSupply: getVal('placeOfSupply') || row['placeOfSupply'] || row['Place of Supply'] || row['POS'],
    raw: row
  };
};
