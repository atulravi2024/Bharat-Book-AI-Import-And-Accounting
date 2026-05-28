import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { translations, LanguageCode } from './translations';

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export type { LanguageCode };

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    // Load language from the general settings if it exists
    const savedSettings = localStorage.getItem('bharat_book_general_settings');
    if (savedSettings) {
      try {
         const parsed = JSON.parse(savedSettings);
         const savedLang = parsed.language;
         if (savedLang === 'en' || savedLang === 'hi' || savedLang === 'hinglish') {
           setLanguageState(savedLang as LanguageCode);
         }
      } catch (e) {}
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    
    // Also try to update it in localStorage so the whole app remembers
    try {
      const savedSettings = localStorage.getItem('bharat_book_general_settings');
      let parsed = {};
      if (savedSettings) {
        parsed = JSON.parse(savedSettings);
      }
      localStorage.setItem('bharat_book_general_settings', JSON.stringify({
        ...parsed,
        language: lang
      }));
    } catch (e) {}
  };

  const t = (key: string) => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // fallback to showing the key
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
