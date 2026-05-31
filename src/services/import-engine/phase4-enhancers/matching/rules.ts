
import { VoucherType, Confidence } from '../../../../app/types';

export const PAYMENT_MODE_PATTERNS: any[] = [];

export let REFERENCE_NO_PATTERNS: RegExp[] = [
  /(?:UPI|IMPS|NEFT|RTGS|Ref|REF|Txn|CHQ|No|UTR)(?:[^\w]*?)(\b[a-zA-Z0-9]{6,16}\b)/i,
];

export interface KeywordRule {
  keywords: string[];
  type: VoucherType;
  ledger?: string;
  confidence: Confidence;
}

export let BANK_KEYWORD_RULES: KeywordRule[] = [];

export let EXTRACTION_PATTERNS: any[] = [];

export let EXCLUDED_WORDS: string[] = [];

export let NOISE_PREFIXES: string[] = [];

// Helper to load reference data
export const loadMatchingRules = async () => {
    try {
        const response = await fetch('/sample-data/ledger-master/bank_reference.json');
        if (response.ok) {
            const data = await response.json();
            // In a real app we might map these to the patterns above
            // For now, we clear the defaults or merge
            EXCLUDED_WORDS = data.bankIgnoreWords || [];
            NOISE_PREFIXES = data.bankIgnoreWords || [];
        }
    } catch (e) {
        // Log it as debug or warn instead of error to avoid console pollution when file is missing
        console.warn("Matching rules data not found, skipping.");
    }
};
