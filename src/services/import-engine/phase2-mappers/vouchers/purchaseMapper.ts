export const purchaseMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  return {
    _mappedAs: 'voucher',
    _type: 'Purchase',
    date: getVal('date') || row['voucherDate'] || row['Date'],
    particulars: getVal('particulars') || row['partyName'] || row['Supplier'],
    amount: getVal('amount') || row['total'] || row['Total Amount'],
    voucherNumber: getVal('voucherNumber') || row['invoiceNo'] || row['Bill No'],
    narration: getVal('narration') || row['remarks'] || row['Notes'],
    raw: row
  };
};
