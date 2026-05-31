export const iciciDefaultMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (defaultKey: string) => mapping?.[defaultKey] ? row[mapping[defaultKey]] : row[defaultKey];
  return {
    _mappedAs: 'bank_transaction',
    _bankSource: 'icici',
    date: getVal('date') || row['Value Date'] || row['Transaction Date'] || row['Date'],
    description: getVal('description') || row['Description'] || row['Particulars'] || row['Remarks'],
    withdrawal: getVal('withdrawal') || row['Withdrawal Amount (INR )'] || row['Withdrawals'] || row['Debit'],
    deposit: getVal('deposit') || row['Deposit Amount (INR )'] || row['Deposits'] || row['Credit'],
    balance: getVal('balance') || row['Balance (INR )'] || row['Balance'],
    reference: getVal('reference') || row['Cheque Number'] || row['Ref No./Cheque No.'],
    raw: row
  };
};
