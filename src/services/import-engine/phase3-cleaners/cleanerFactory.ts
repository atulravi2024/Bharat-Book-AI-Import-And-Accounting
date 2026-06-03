import { normalizeDate } from './rules/dateNormalizer';
import { sanitizeAmount } from './rules/amountSanitizer';
import { validateGst } from './validators/gstValidator';
import { checkBalance } from './validators/balanceChecker';

/**
 * Phase 3: Cleaner Factory
 * Applies rules and validators to standardized row structures.
 */
export const applyCleaningRules = (mappedRecord: any) => {
  const cleaned = { ...mappedRecord };

  // Dates
  if (cleaned.date) cleaned.date = normalizeDate(cleaned.date);
  
  // Amounts
  if (cleaned.amount !== undefined) cleaned.amount = sanitizeAmount(cleaned.amount);
  if (cleaned.withdrawal !== undefined) cleaned.withdrawal = sanitizeAmount(cleaned.withdrawal);
  if (cleaned.deposit !== undefined) cleaned.deposit = sanitizeAmount(cleaned.deposit);
  if (cleaned.balance !== undefined) cleaned.balance = sanitizeAmount(cleaned.balance);
  if (cleaned.openingBalance !== undefined) cleaned.openingBalance = sanitizeAmount(cleaned.openingBalance);
  if (cleaned.value !== undefined) cleaned.value = sanitizeAmount(cleaned.value);

  // Text Extractor / Cleaner
  if (typeof cleaned.particulars === 'string') cleaned.particulars = cleaned.particulars.trim();
  if (typeof cleaned.description === 'string') cleaned.description = cleaned.description.trim();
  if (typeof cleaned.name === 'string') cleaned.name = cleaned.name.trim();
  if (typeof cleaned.itemName === 'string') cleaned.itemName = cleaned.itemName.trim();

  // Item Quantities & Rates
  if (cleaned.quantity !== undefined) cleaned.quantity = sanitizeAmount(cleaned.quantity);
  if (cleaned.rate !== undefined) cleaned.rate = sanitizeAmount(cleaned.rate);

  // Validate
  if (cleaned.gstin) {
    cleaned._isGstinValid = validateGst(cleaned.gstin);
  }

  // Record structural checks via rules could be applied continuously
  return cleaned;
};
