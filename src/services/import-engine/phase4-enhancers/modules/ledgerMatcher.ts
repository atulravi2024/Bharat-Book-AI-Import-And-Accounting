export const matchLedger = (record: any) => {
  const enhanced = { ...record };
  const text = String(enhanced.particulars || enhanced.description || '').toLowerCase();

  // Predictive rules for automatic ledger mapping if its empty
  if (!enhanced.ledgerName && text) {
    if (text.includes('salary') || text.includes('wages')) {
      enhanced._suggestedLedger = 'Salary Account';
    } else if (text.includes('rent')) {
      enhanced._suggestedLedger = 'Rent Expense';
    } else if (text.includes('fee') || text.includes('charges') || text.includes('chg')) {
      enhanced._suggestedLedger = 'Bank Charges';
    } else if (text.includes('cash')) {
      enhanced._suggestedLedger = 'Cash Account';
    }
  }
  
  return enhanced;
};
