export const sanitizeAmount = (rawAmount: any): number => {
  if (typeof rawAmount === 'number') return rawAmount;
  if (!rawAmount) return 0;
  
  let strAmount = String(rawAmount).trim().toLowerCase();
  
  let isNegative = false;
  if (strAmount.startsWith('(') && strAmount.endsWith(')')) {
    isNegative = true;
    strAmount = strAmount.slice(1, -1);
  } else if (strAmount.startsWith('-')) {
    isNegative = true;
    strAmount = strAmount.substring(1);
  } else if (strAmount.endsWith('dr')) {
    isNegative = true;
    strAmount = strAmount.replace('dr', '').trim();
  } else if (strAmount.endsWith('cr')) {
    strAmount = strAmount.replace('cr', '').trim();
  }
  
  const cleaned = strAmount.replace(/[^\d.]/g, '');
  let parsed = parseFloat(cleaned);
  if (isNaN(parsed)) parsed = 0;
  
  return isNegative ? -Math.abs(parsed) : parsed;
};
