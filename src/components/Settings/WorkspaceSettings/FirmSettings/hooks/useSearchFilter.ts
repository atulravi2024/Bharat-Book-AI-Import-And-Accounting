import { useLanguage } from "../../../../../context/LanguageContext";
import { ALL_SEARCH_FIELDS } from "../constants";

export const useSearchFilter = (searchTerm?: string) => {
  const { t } = useLanguage();

  const isFieldVisible = (labelKey: string, extraTerms: string[] = []) => {
    if (!searchTerm || !searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    const labelText = t(labelKey).toLowerCase();
    
    if (labelText.includes(query) || labelKey.toLowerCase().includes(query)) return true;
    
    return extraTerms.some(term => {
      const termTranslated = t(term).toLowerCase();
      return term.toLowerCase().includes(query) || termTranslated.includes(query);
    });
  };

  const isSectionVisible = (sectionId: string) => {
    if (!searchTerm || !searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    const fields = ALL_SEARCH_FIELDS.filter(f => f.id === sectionId);
    return fields.some(field => {
      const translatedLabel = t(field.label).toLowerCase();
      return translatedLabel.includes(query) || field.label.toLowerCase().includes(query) || field.id.toLowerCase().includes(query);
    });
  };

  return { isFieldVisible, isSectionVisible };
};
