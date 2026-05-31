export const ledgerMapper = (row: any, mapping?: Record<string, string>) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  return {
    _mappedAs: 'master',
    name: getVal('name') || row['ledgerName'] || row['Name'],
    group: getVal('group') || row['under'] || row['Group'],
    openingBalance: getVal('openingBalance') || row['balance'] || row['Opening Balance'],
    gstin: getVal('gstin') || row['taxId'] || row['GSTIN/UIN'],
    raw: row
  };
};
