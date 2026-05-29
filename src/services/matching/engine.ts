
import { ParsedVoucher, VoucherType, PartyMaster, LedgerMaster, Confidence } from '../../app/types';
import { extractValidName, isValidIndianEntity } from '../NameExtractor';
import { calculateMatchScore } from './fuzzy';
import { 
    PAYMENT_MODE_PATTERNS, 
    REFERENCE_NO_PATTERNS, 
    BANK_KEYWORD_RULES, 
    EXTRACTION_PATTERNS,
    EXCLUDED_WORDS,
    NOISE_PREFIXES
} from './rules';
import { extractEntityWithAI, matchEntityWithAI } from '../geminiService';

export interface MatchingResult {
    type?: VoucherType;
    referenceNo?: { value: string; confidence: Confidence };
    partyName?: { value: string; confidence: Confidence; isMismatch?: boolean; suggestion?: string };
    ledger?: { value: string; confidence: Confidence; isMismatch?: boolean; suggestion?: string };
}


export const extractReferenceNo = (narration: string): string | null => {
    for (const pattern of REFERENCE_NO_PATTERNS) {
        const match = narration.match(pattern);
        if (match && match[1]) return match[1];
    }
    return null;
};

export const applyKeywordRules = (narration: string): Partial<MatchingResult> | null => {
    const upper = narration.toUpperCase();
    for (const rule of BANK_KEYWORD_RULES) {
        if (rule.keywords.some(kw => upper.includes(kw))) {
            const result: Partial<MatchingResult> = {
                type: rule.type
            };
            if (rule.ledger) {
                result.ledger = { value: rule.ledger, confidence: rule.confidence };
            }
            return result;
        }
    }
    return null;
};

const isExcludedWordMatch = (name: string) => {
    const upper = name.toUpperCase();
    return EXCLUDED_WORDS.some(word => {
        // More aggressive: Check if the excluded word is contained in the name at all
        return upper.includes(word.toUpperCase());
    });
};

export const findBestMasterMatch = (
    narration: string, 
    partyMasters: PartyMaster[], 
    ledgerMasters: LedgerMaster[]
): Partial<MatchingResult> | null => {
    let bestPartyMatch: PartyMaster | null = null;
    let bestPartyScore = 0;
    let bestLedgerMatch: LedgerMaster | null = null;
    let bestLedgerScore = 0;

    const threshold = 0.4;

    // Check for IFSC matches first (High Confidence)
    for (const l of ledgerMasters) {
        if (l.bankDetails?.ifsc) {
            const ifscPrefix = l.bankDetails.ifsc.substring(0, 4).toUpperCase();
            if (narration.toUpperCase().includes(ifscPrefix)) {
                return {
                    ledger: {
                        value: String(l.name),
                        confidence: Confidence.High
                    }
                };
            }
        }
    }

    partyMasters.forEach(p => {
        const score = calculateMatchScore(narration, p.name);
        if (score > bestPartyScore && score >= threshold) {
            bestPartyScore = score;
            bestPartyMatch = p;
        }
    });

    ledgerMasters.forEach(l => {
        // Skip generic ledgers
        if (['Cash A/c', 'Sales A/c', 'Purchase A/c'].includes(String(l.name))) return;
        const score = calculateMatchScore(narration, l.name);
        if (score > bestLedgerScore && score >= threshold) {
            bestLedgerScore = score;
            bestLedgerMatch = l;
        }
    });

    const bestScore = Math.max(bestPartyScore, bestLedgerScore);
    if (bestScore < threshold) return null;

    if (bestPartyScore >= bestLedgerScore && bestPartyMatch) {
        const name = String(bestPartyMatch.name);
        const isBankMatch = isExcludedWordMatch(name);
        
        // If it's a bank account match, we don't treat it as a valid party match at all
        if (isBankMatch) return null;

        return {
            partyName: {
                value: name,
                confidence: bestPartyScore >= 0.85 ? Confidence.High : Confidence.Medium,
                isMismatch: bestPartyScore < 0.85
            }
        };
    } else if (bestLedgerMatch) {
        const name = String(bestLedgerMatch.name);
        const isBankMatch = isExcludedWordMatch(name);
        
        // Banks can be ledgers (e.g. for Contra or Bank Charges), that's fine
        return {
            ledger: {
                value: name,
                confidence: (bestLedgerScore >= 0.85 && !isBankMatch) ? Confidence.High : Confidence.Medium,
                isMismatch: bestLedgerScore < 0.85 || isBankMatch
            }
        };
    }

    return null;
};

export const extractMissingName = (narration: string): string | null => {
    const options = {
        excludedWords: EXCLUDED_WORDS,
        noisePrefixes: NOISE_PREFIXES
    };
    const extracted = extractValidName(narration, options);
    if (extracted && isValidIndianEntity(extracted, options) && !isExcludedWordMatch(extracted)) {
        return extracted;
    }
    return null;
};

export const matchVoucher = (
    v: ParsedVoucher,
    partyMasters: PartyMaster[],
    ledgerMasters: LedgerMaster[]
): MatchingResult => {
    const narration = String(v.narration?.value || v.partyName?.value || '');
    const result: MatchingResult = {};

    // 1. Reference Number
    if (!v.referenceNo?.value) {
        const ref = extractReferenceNo(narration);
        if (ref) result.referenceNo = { value: ref, confidence: Confidence.Medium };
    }

    // 2. Keyword Rules
    const kwMatch = applyKeywordRules(narration);
    if (kwMatch) {
        return { ...result, ...kwMatch };
    }

    // 3. Master Match
    const masterMatch = findBestMasterMatch(narration, partyMasters, ledgerMasters);
    if (masterMatch) {
        return { ...result, ...masterMatch };
    }

    // 4. Try extract as missing master
    const extractedName = extractMissingName(narration);
    if (extractedName) {
        result.partyName = {
            value: extractedName,
            confidence: Confidence.Low,
            isMismatch: true,
            suggestion: 'Extracted from narration'
        };
    }

    return result;
};

export const matchVoucherAsync = async (
    v: ParsedVoucher,
    partyMasters: PartyMaster[],
    ledgerMasters: LedgerMaster[]
): Promise<MatchingResult> => {
    const narration = String(v.narration?.value || v.partyName?.value || '');
    const result: MatchingResult = {};

    // 1. Reference Number & Keyword Rules (Fast passes)
    if (!v.referenceNo?.value) {
        const ref = extractReferenceNo(narration);
        if (ref) result.referenceNo = { value: ref, confidence: Confidence.Medium };
    }

    const kwMatch = applyKeywordRules(narration);
    if (kwMatch) return { ...result, ...kwMatch };

    // 2. STEP 1: EXTRACTION
    // First try local extraction
    const extractionOptions = {
        excludedWords: EXCLUDED_WORDS,
        noisePrefixes: NOISE_PREFIXES
    };
    let extractedName = extractValidName(narration, extractionOptions);
    
    // If local extraction fails or is weak, try AI extraction
    if (!extractedName || extractedName.length < 3) {
        const aiEntity = await extractEntityWithAI(narration);
        if (aiEntity && aiEntity.name) {
            extractedName = aiEntity.name;
        }
    }

    // FINAL GUARD: Even if AI extracted it, check if it's a noise word/bank code
    if (extractedName && !isValidIndianEntity(extractedName, extractionOptions)) {
        extractedName = null;
    }

    // IF Still no name -> Stage 1: Unmap
    if (!extractedName || extractedName.length < 3) {
        return result; // No partyName set means it goes to Unmap
    }

    // 3. STEP 2: MATCHING
    // Prepare list of master names
    const partyNames = partyMasters.map(p => String(p.name));
    const ledgerNames = ledgerMasters
        .filter(l => !['Cash A/c', 'Sales A/c', 'Purchase A/c'].includes(String(l.name)))
        .map(l => String(l.name));
    
    const allMasters = [...partyNames, ...ledgerNames];
    
    // Use AI to match with >75% confidence
    const aiMatch = await matchEntityWithAI(extractedName, allMasters);

    if (aiMatch.isMatch && aiMatch.matchedName) {
        // Stage 3: Automate
        const matchedAsParty = partyNames.includes(aiMatch.matchedName);
        
        if (matchedAsParty) {
            result.partyName = {
                value: aiMatch.matchedName,
                confidence: Confidence.High,
                isMismatch: false,
                suggestion: `Matched with ${aiMatch.confidenceScore}% confidence`
            };
        } else {
            result.ledger = {
                value: aiMatch.matchedName,
                confidence: Confidence.High,
                isMismatch: false,
                suggestion: `Matched with ${aiMatch.confidenceScore}% confidence`
            };
        }
    } else {
        // Stage 2: Missing Master
        result.partyName = {
            value: extractedName,
            confidence: Confidence.Low,
            isMismatch: true,
            suggestion: 'Extracted name found but no matching master (>75% confidence)'
        };
    }

    return result;
};
