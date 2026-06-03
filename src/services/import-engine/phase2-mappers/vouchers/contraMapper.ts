export const contraMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  return {
    _mappedAs: 'voucher',
    _type: 'Contra',
    date: getVal('date') || row['voucherDate'] || row['Date'] || row['Transaction Date'] || row['Txn Date'],
    toAccount: getVal('toAccount') || row['to'] || row['debitLedger'] || row['Received In'] || row['Cash/Bank (Debit)'] || row['Deposit To'],
    fromAccount: getVal('fromAccount') || row['from'] || row['creditLedger'] || row['Paid From'] || row['Cash/Bank (Credit)'] || row['Withdraw From'],
    amount: getVal('amount') || row['total'] || row['Value'] || row['Amount'],
    voucherNumber: getVal('voucherNumber') || row['invoiceNo'] || row['Voucher No'] || row['Voucher Number'] || row['Vch No'],
    narration: getVal('narration') || row['remarks'] || row['Notes'] || row['description'] || row['Narration'],
    referenceNo: getVal('referenceNo') || row['Ref No'] || row['UTR'] || row['Cheque No'],
    raw: row
  };
};
