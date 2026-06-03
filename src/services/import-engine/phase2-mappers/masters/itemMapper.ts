export const itemMapper = (row: any, mapping?: Record<string, string>, specificType?: string) => {
  const getVal = (key: string) => mapping?.[key] ? row[mapping[key]] : row[key];
  
  // Custom smart heuristics to resolve fields if mapping isn't set
  const rawName = getVal('name') || row['itemName'] || row['Item Name'] || row['ItemName'] || row['brandName'] || row['Brand'] || row['Category'] || row['UOM'] || row['Name'] || '';
  const rawCode = getVal('code') || row['sku'] || row['code'] || row['SKU'] || row['Code'] || row['partNumber'] || row['PartNumber'] || row['Barcode'] || row['HSN'] || '';
  const rawGroup = getVal('group') || row['parent'] || row['category'] || row['under'] || row['group'] || row['Group'] || row['Parent'] || '';
  const rawValue = getVal('value') || row['rate'] || row['price'] || row['openingBalance'] || row['Balance'] || row['Value'] || '';

  return {
    _mappedAs: 'master',
    _type: specificType || 'items',
    name: String(rawName).trim(),
    code: String(rawCode).trim(),
    group: String(rawGroup).trim(),
    value: String(rawValue).trim(),
    raw: row
  };
};
