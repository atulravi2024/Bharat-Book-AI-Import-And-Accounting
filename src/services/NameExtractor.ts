/**
 * NameExtractor - Specialized utility for extracting Indian person or firm names from bank narrations.
 * 
 * Logic Goals:
 * 1. Isolate genuine identity from bank-specific noise (IFSC, Txn IDs, Account numbers).
 * 2. Handle common Indian name formats (First Last, First Middle Last).
 * 3. Recognize common Indian firm identifiers (Pvt Ltd, Enterprises, Traders, etc.).
 * 4. Clean noise from both front and back (e.g., "UBIAV" prefix or "HDFC" suffix).
 */

interface ExtractionOptions {
  bankShortCodes?: string[];
  bankIgnoreWords?: string[];
  paymentModes?: string[];
  paymentChannels?: string[];
  ifscPrefixes?: string[];
  commonIndianFirstNames?: string[];
  firmSuffixes?: string[];
  excludedWords?: string[];
  noisePrefixes?: string[];
}

/**
 * Stage 1: Extraction Logic
 * Identify person/firm names while strictly excluding numbers, symbols, and bank noise
 */
export const extractValidName = (narration: string, options: ExtractionOptions = {}): string | null => {
  if (!narration) return null;

  const bShortCodes = options.bankShortCodes || [];
  const bIgnore = options.bankIgnoreWords || [];
  const pModes = options.paymentModes || [];
  const pChannels = options.paymentChannels || [];
  const iPrefixes = options.ifscPrefixes || [];
  
  const bNoise = [
    ...bIgnore,
    ...pModes,
    ...pChannels,
    ...iPrefixes,
    ...(options.noisePrefixes || [])
  ];

  // 1. Pre-cleaning: Remove anything that is NOT a letter or space
  let cleaned = narration.toUpperCase()
    .replace(/[^A-Z\s]/g, ' ') 
    .replace(/\s+/g, ' ')      
    .trim();

  // 2. Tokenize and filter out bank codes, modes, and short codes
  let tokens = cleaned.split(' ').filter(t => {
    // Skip very short words
    if (t.length <= 2) return false;
    
    // Explicitly skip words in the combined noise list
    if (bNoise.includes(t)) return false;

    // Skip if it is a known Bank Short Code (IFSC Prefix)
    if (bShortCodes.includes(t)) return false;

    // Logic: Skip if part of alphabetical token matches patterns like UBIN00... or UPIAR
    const isLikelyBankCode = bShortCodes.some(code => t.startsWith(code) && t.length <= code.length + 2);
    const isLikelyPayMode = pModes.some(mode => t.startsWith(mode) && t.length <= mode.length + 2);
    const isLikelyIfsc = iPrefixes.some(prefix => t === prefix || (t.startsWith(prefix) && t.length <= prefix.length + 2));
    
    if (isLikelyBankCode || isLikelyPayMode || isLikelyIfsc) return false;

    return true;
  });

  if (tokens.length === 0) return null;

  // 3. Final construction
  const result = tokens.join(' ');
  
  if (result.length < 3) return null;

  return result;
};

export const isValidIndianEntity = (name: string, options: ExtractionOptions = {}): boolean => {
  if (!name) return false;
  const upper = name.toUpperCase();
  
  const bShortCodes = options.bankShortCodes || [];
  const bIgnore = options.bankIgnoreWords || [];
  const pModes = options.paymentModes || [];
  const pChannels = options.paymentChannels || [];
  const iPrefixes = options.ifscPrefixes || [];

  const bNoise = [
    ...bIgnore,
    ...pModes,
    ...pChannels,
    ...iPrefixes,
    ...(options.noisePrefixes || [])
  ];

  // Strict check: Should ONLY contain letters and spaces
  if (/[^A-Z\s]/.test(upper)) return false;

  // Name should be at least 3 chars
  if (upper.length < 3) return false;
  
  // Should not be just a bank name or noise
  if (bNoise.includes(upper)) return false;
  if (bShortCodes.includes(upper)) return false;
  if (iPrefixes.includes(upper)) return false;

  return true;
};
