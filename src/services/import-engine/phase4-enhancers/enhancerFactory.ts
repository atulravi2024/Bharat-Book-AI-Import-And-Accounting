import { predictTax } from './modules/taxPredictor';
import { matchLedger } from './modules/ledgerMatcher';

/**
 * Phase 4: Enhancer Factory
 * Advanced business logic applications.
 */
export const applyEnhancements = (cleanedRecord: any) => {
  let enhanced = { ...cleanedRecord };

  enhanced = predictTax(enhanced);
  enhanced = matchLedger(enhanced);

  return enhanced;
};
