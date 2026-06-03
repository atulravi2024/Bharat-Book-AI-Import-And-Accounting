export const paymentMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  return {
    _mappedAs: 'voucher',
    _type: 'Payment',
    date: getVal('date') || row['voucherDate'] || row['Date'] || row['Transaction Date'] || row['Txn Date'],
    particulars: getVal('particulars') || row['partyName'] || row['ledgerName'] || row['ledger'] || row['debitLedger'] || row['Account'] || row['Paid To'],
    amount: getVal('amount') || row['total'] || row['Value'] || row['Amount'] || row['Amount Paid'],
    voucherNumber: getVal('voucherNumber') || row['invoiceNo'] || row['Voucher No'] || row['Voucher Number'] || row['Vch No'],
    narration: getVal('narration') || row['remarks'] || row['Notes'] || row['description'] || row['Narration'],
    referenceNo: getVal('referenceNo') || row['Ref No'] || row['Cheque No'] || row['utr'] || row['UTR'],
    bankDetails: getVal('bankDetails') || row['Bank'] || row['Cash/Bank'] || row['creditLedger'] || row['fromAccount'],
    paymentMode: getVal('paymentMode') || row['paymentMode'] || row['paymentType'] || row['Mode'],
    raw: row
  };
};
