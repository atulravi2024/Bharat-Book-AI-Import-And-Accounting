export const sbiDefaultMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (defaultKey: string) => mapping?.[defaultKey] ? row[mapping[defaultKey]] : row[defaultKey];
  return {
    _mappedAs: 'bank_transaction',
    _bankSource: 'sbi',
    date: getVal('date') || row['Txn Date'] || row['Value Date'],
    description: getVal('description') || row['Description'],
    withdrawal: getVal('withdrawal') || row['Debit'],
    deposit: getVal('deposit') || row['Credit'],
    balance: getVal('balance') || row['Balance'],
    reference: getVal('reference') || row['Ref No./Cheque No.'],
    raw: row
  };
};
