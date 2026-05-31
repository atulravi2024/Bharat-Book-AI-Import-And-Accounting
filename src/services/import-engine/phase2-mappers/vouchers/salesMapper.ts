export const salesMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  return {
    _mappedAs: 'voucher',
    _type: 'Sales',
    date: getVal('date') || row['voucherDate'] || row['Date'],
    particulars: getVal('particulars') || row['partyName'] || row['customerName'] || row['Customer'],
    amount: getVal('amount') || row['total'] || row['Amount'],
    voucherNumber: getVal('voucherNumber') || row['invoiceNo'] || row['Invoice No'],
    narration: getVal('narration') || row['remarks'] || row['Notes'],
    raw: row
  };
};
