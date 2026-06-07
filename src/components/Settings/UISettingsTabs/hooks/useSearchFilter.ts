import { useLanguage } from "../../../../context/LanguageContext";

export const useSearchFilter = (searchTerm?: string) => {
  const { t } = useLanguage();

  const isFieldVisible = (labelKey: string, extraTerms: string[] = []) => {
    if (!searchTerm || !searchTerm.trim()) return true;
    
    const query = searchTerm.toLowerCase().trim();
    const labelText = t(labelKey).toLowerCase();
    
    if (labelText.includes(query)) return true;
    
    return extraTerms.some(term => {
      const termTranslated = t(term).toLowerCase();
      return term.toLowerCase().includes(query) || termTranslated.includes(query);
    });
  };

  return { isFieldVisible };
};
