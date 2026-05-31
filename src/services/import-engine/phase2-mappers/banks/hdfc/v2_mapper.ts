export const hdfcV2Mapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (defaultKey: string) => mapping?.[defaultKey] ? row[mapping[defaultKey]] : row[defaultKey];
  return {
    _mappedAs: 'bank_transaction',
    _bankSource: 'hdfc_v2',
    date: getVal('date') || row['Transaction Date'] || row['Value Date'],
    description: getVal('description') || row['Transaction Description'] || row['Narration'],
    withdrawal: getVal('withdrawal') || row['Debit Amount'] || row['Withdrawal Amount'],
    deposit: getVal('deposit') || row['Credit Amount'] || row['Deposit Amount'],
    balance: getVal('balance') || row['Closing Balance'],
    reference: getVal('reference') || row['Cheque Number'] || row['Reference No'],
    raw: row
  };
};
