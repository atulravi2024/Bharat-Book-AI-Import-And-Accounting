export const hdfcV1Mapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (defaultKey: string) => mapping?.[defaultKey] ? row[mapping[defaultKey]] : row[defaultKey];
  return {
    _mappedAs: 'bank_transaction',
    _bankSource: 'hdfc_v1',
    date: getVal('date') || row['Date'] || row['Txn Date'] || row['txnDate'],
    description: getVal('description') || row['Narration'] || row['Description'] || row['particulars'] || row['Narration '],
    withdrawal: getVal('withdrawal') || row['Withdrawal'] || row['Debit'] || row['Withdrawal Amt.'] || row['dr'],
    deposit: getVal('deposit') || row['Deposit'] || row['Credit'] || row['Deposit Amt.'] || row['cr'],
    balance: getVal('balance') || row['Balance'] || row['Closing Balance'] || row['closingBalance'],
    reference: getVal('reference') || row['Chq/Ref Number'] || row['Ref No.'] || row['Chq/Ref No.'],
    raw: row
  };
};
