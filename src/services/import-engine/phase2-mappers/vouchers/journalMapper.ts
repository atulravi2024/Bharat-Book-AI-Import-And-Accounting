export const journalMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  return {
    _mappedAs: 'voucher',
    _type: 'Journal',
    date: getVal('date') || row['voucherDate'] || row['Date'] || row['Transaction Date'] || row['Txn Date'],
    debitLedger: getVal('debitLedger') || row['debitAccount'] || row['debit'] || row['Particulars (Debit)'] || row['debit ledger'] || row['Debit Ledger'],
    creditLedger: getVal('creditLedger') || row['creditAccount'] || row['credit'] || row['Particulars (Credit)'] || row['credit ledger'] || row['Credit Ledger'],
    amount: getVal('amount') || row['total'] || row['Value'] || row['Amount'],
    voucherNumber: getVal('voucherNumber') || row['invoiceNo'] || row['Voucher No'] || row['Voucher Number'] || row['Vch No'],
    narration: getVal('narration') || row['remarks'] || row['Notes'] || row['description'] || row['Narration'],
    referenceNo: getVal('referenceNo') || row['Ref No'] || row['UTR'] || row['Cheque No'],
    raw: row
  };
};
