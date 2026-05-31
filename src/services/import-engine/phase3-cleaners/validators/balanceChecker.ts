export const checkBalance = (record: any): boolean => {
  // If voucher has an array of debits and credits, check if they match. (Complex Voucher entry arrays)
  if (record.debits && record.credits) {
    const totalDr = record.debits.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    const totalCr = record.credits.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    return totalDr === totalCr;
  }
  
  // Otherwise if we have amount natively, trust the mapping, but in advanced accounting contexts we could check arrays.
  return true;
};
