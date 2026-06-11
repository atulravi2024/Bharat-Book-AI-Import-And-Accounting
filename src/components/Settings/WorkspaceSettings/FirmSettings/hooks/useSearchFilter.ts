import { useLanguage } from "../../../../../context/LanguageContext";
import { ALL_SEARCH_FIELDS } from "../constants";

export const useSearchFilter = (searchTerm?: string) => {
  const { t } = useLanguage();

  const isFieldVisible = (labelKey: string, extraTerms: string[] = []) => {
    if (!searchTerm || !searchTerm.trim()) return true;
    
    const words = searchTerm.toLowerCase().trim().split(/\s+/);
    const positiveTerms: string[] = [];
    const negativeTerms: string[] = [];

    for (const word of words) {
      if (word.startsWith('!') && word.length > 1) {
        negativeTerms.push(word.substring(1));
      } else if (word.startsWith('-') && word.length > 1) {
        negativeTerms.push(word.substring(1));
      } else if (word.trim()) {
        positiveTerms.push(word);
      }
    }

    const allTermsToCheck = [
      labelKey,
      t(labelKey),
      ...(extraTerms || [])
    ].map(term => term.toLowerCase());

    if (negativeTerms.length > 0) {
      const hasNegativeMatch = negativeTerms.some(neg =>
        allTermsToCheck.some(term => term.includes(neg))
      );
      if (hasNegativeMatch) return false;
    }

    if (positiveTerms.length > 0) {
      const hasAllPositiveMatches = positiveTerms.every(pos =>
        allTermsToCheck.some(term => term.includes(pos))
      );
      if (!hasAllPositiveMatches) return false;
    }

    return true;
  };

  const isSectionVisible = (sectionId: string) => {
    if (!searchTerm || !searchTerm.trim()) return true;
    
    const words = searchTerm.toLowerCase().trim().split(/\s+/);
    const positiveTerms: string[] = [];
    const negativeTerms: string[] = [];

    for (const word of words) {
      if (word.startsWith('!') && word.length > 1) {
        negativeTerms.push(word.substring(1));
      } else if (word.startsWith('-') && word.length > 1) {
        negativeTerms.push(word.substring(1));
      } else if (word.trim()) {
        positiveTerms.push(word);
      }
    }

    const fields = ALL_SEARCH_FIELDS.filter(f => f.id === sectionId);
    
    if (fields.length === 0) {
      // Fallback check on the sectionId itself
      const checkTerms = [sectionId.toLowerCase(), t(sectionId).toLowerCase()];
      if (negativeTerms.length > 0 && negativeTerms.some(neg => checkTerms.some(ct => ct.includes(neg)))) {
        return false;
      }
      if (positiveTerms.length > 0 && !positiveTerms.every(pos => checkTerms.some(ct => ct.includes(pos)))) {
        return false;
      }
      return true;
    }

    return fields.some(field => {
      const allTermsToCheck = [
        field.label,
        t(field.label),
        field.id
      ].map(term => term.toLowerCase());

      if (negativeTerms.length > 0) {
        const hasNegativeMatch = negativeTerms.some(neg =>
          allTermsToCheck.some(term => term.includes(neg))
        );
        if (hasNegativeMatch) return false;
      }

      if (positiveTerms.length > 0) {
        const hasAllPositiveMatches = positiveTerms.every(pos =>
          allTermsToCheck.some(term => term.includes(pos))
        );
        if (!hasAllPositiveMatches) return false;
      }

      return true;
    });
  };

  return { isFieldVisible, isSectionVisible };
};
