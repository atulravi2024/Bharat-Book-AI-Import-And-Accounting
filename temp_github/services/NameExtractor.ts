/**
 * NameExtractor - Specialized utility for extracting Indian person or firm names from bank narrations.
 * 
 * Logic Goals:
 * 1. Isolate genuine identity from bank-specific noise (IFSC, Txn IDs, Account numbers).
 * 2. Handle common Indian name formats (First Last, First Middle Last).
 * 3. Recognize common Indian firm identifiers (Pvt Ltd, Enterprises, Traders, etc.).
 * 4. Clean noise from both front and back (e.g., "UBIAV" prefix or "HDFC" suffix).
 */

const COMMON_INDIAN_FIRST_NAMES = [
  'AMIT', 'RAJESH', 'SURESH', 'ANIL', 'VIJAY', 'SUNIL', 'ARUN', 'SANJAY', 'MANOJ', 'RAHUL',
  'PRIYA', 'SUMIT', 'NEHA', 'RUDRA', 'KUMAR', 'SINGH', 'SHARMA', 'PATEL', 'GUPTA', 'VERMA',
  'CHOUDHARY', 'YADAV', 'KHAN', 'ALI', 'MOHAMMED', 'FARID', 'HUMAKANT', 'RADHIKA', 'POOJA',
  'DEEPAK', 'RAVI', 'KIRAN', 'SANDIP', 'PARAS', 'JAIN', 'MEHTA', 'SHAH', 'DAVE', 'MISHRA',
  'SARAVANAN', 'KASHYAP', 'TIWARI', 'SINGHAL', 'AGRAWAL', 'BANSAL', 'CHAWLA', 'MALHOTRA',
  'RAM', 'KRISHNA', 'OM', 'GANESH', 'SITA', 'GEETA', 'ANJALI', 'VIKRAM', 'ADITYA',
  'REDDY', 'NAIR', 'IYER', 'KAUR', 'GILL', 'SIDHU', 'CHOPRA', 'KAPOOR', 'KHANNA', 'MEHRA',
  'SETHI', 'MALIK', 'GOEL', 'MITTAL', 'SAXENA', 'PANDEY', 'SHUKLA', 'TRIPATHI', 'JOSHI',
  'DESAI', 'KULKARNI', 'PATILE', 'BHAT', 'HEGDE', 'RAO', 'MENON', 'PILLAI', 'DAS', 'CHATTERJEE',
  'BANERJEE', 'MUKHERJEE', 'BOSE', 'SEN', 'DUTTA', 'KUNDU', 'PAL', 'SARKAR', 'BISWAS'
];

const FIRM_SUFFIXES = [
  'ENTERPRISES', 'TRADERS', 'SOLUTIONS', 'SERVICES', 'ENTERPRISE', 'AGENCIES', 'AGENCY',
  'STORES', 'STORE', 'MART', 'EMPORIUM', 'INDUSTRIES', 'WORKS', 'PROPERTIES', 'VENTURES',
  'PVT', 'LTD', 'LIMITED', 'LLP', 'CO', 'CORP', 'CORPORATION', 'GROUP', 'ASSOCIATES',
  'SYSTEMS', 'LOGISTICS', 'MARKETING', 'PHARMA', 'FASHION', 'LIFESTYLE', 'STILL', 'CORNER',
  'KISAN', 'KRISHI', 'AGRO', 'FARMS', 'FARM', 'FERTILIZERS', 'SEEDS', 'DAIRY', 'ORGANICS',
  'CLOTHING', 'TEXTILES', 'ELECTRONICS', 'AUTOMOBILES', 'MOTORS', 'CONSTRUCTIONS', 'BUILDERS',
  'DEVELOPERS', 'TECHNOLOGIES', 'INFRA', 'INFRASTRUCTURE', 'TRADING', 'MARKET', 'BAZAR',
  'INC', 'ESTATE', 'HOLDINGS', 'INDIA'
];

import { BANK_SHORT_CODES, BANK_IGNORE_WORDS } from './matching/bankCodes';
import { PAYMENT_MODES, PAYMENT_CHANNELS } from './matching/paymentModes';
import { IFSC_PREFIXES } from './matching/ifscCodes';

const BANK_NOISE = [
  ...BANK_IGNORE_WORDS,
  ...PAYMENT_MODES,
  ...PAYMENT_CHANNELS,
  ...IFSC_PREFIXES
];

interface ExtractionOptions {
  bankShortCodes?: string[];
  bankIgnoreWords?: string[];
  paymentModes?: string[];
  paymentChannels?: string[];
  ifscPrefixes?: string[];
}

/**
 * Stage 1: Extraction Logic
 * Identify person/firm names while strictly excluding numbers, symbols, and bank noise
 */
export const extractValidName = (narration: string, options: ExtractionOptions = {}): string | null => {
  if (!narration) return null;

  const bShortCodes = options.bankShortCodes || BANK_SHORT_CODES;
  const bIgnore = options.bankIgnoreWords || BANK_IGNORE_WORDS;
  const pModes = options.paymentModes || PAYMENT_MODES;
  const pChannels = options.paymentChannels || PAYMENT_CHANNELS;
  const iPrefixes = options.ifscPrefixes || IFSC_PREFIXES;

  const bNoise = [
    ...bIgnore,
    ...pModes,
    ...pChannels,
    ...iPrefixes
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
  
  const bShortCodes = options.bankShortCodes || BANK_SHORT_CODES;
  const bIgnore = options.bankIgnoreWords || BANK_IGNORE_WORDS;
  const pModes = options.paymentModes || PAYMENT_MODES;
  const pChannels = options.paymentChannels || PAYMENT_CHANNELS;
  const iPrefixes = options.ifscPrefixes || IFSC_PREFIXES;

  const bNoise = [
    ...bIgnore,
    ...pModes,
    ...pChannels,
    ...iPrefixes
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
