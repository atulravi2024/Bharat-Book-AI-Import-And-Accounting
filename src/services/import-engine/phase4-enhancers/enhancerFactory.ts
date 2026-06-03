import { predictTax } from './modules/taxPredictor';
import { matchLedger } from './modules/ledgerMatcher';
import { enrichItemMaster } from './modules/itemEnhancer';

/**
 * Phase 4: Enhancer Factory
 * Advanced business logic applications.
 */
export const applyEnhancements = (cleanedRecord: any) => {
  let enhanced = { ...cleanedRecord };

  enhanced = predictTax(enhanced);
  enhanced = matchLedger(enhanced);
  enhanced = enrichItemMaster(enhanced);

  const itemTypes = [
    'Stock Journal',
    'Physical Stock',
    'Item Consumption',
    'Item Scrap',
    'Interlocation',
    'Rejection In',
    'Rejection Out'
  ];

  if (itemTypes.includes(enhanced._type)) {
    const tags = enhanced._tags || [];
    if (!tags.includes('Inventory Action')) tags.push('Inventory Action');
    if (!tags.includes('Stock Movement')) tags.push('Stock Movement');
    enhanced._tags = tags;
  }

  return enhanced;
};
