import en from './en';
import hi from './hi';
import hinglish from './hinglish';

export type LanguageCode = 'en' | 'hi' | 'hinglish';

export interface Translations {
  [key: string]: {
    [key in LanguageCode]: string;
  };
}

export const translations: Translations = {};

const allKeys = new Set([
  ...Object.keys(en),
  ...Object.keys(hi),
  ...Object.keys(hinglish)
]);

for (const key of allKeys) {
  translations[key] = {
    en: en[key] !== undefined ? en[key] : key,
    hi: hi[key] !== undefined ? hi[key] : key,
    hinglish: hinglish[key] !== undefined ? hinglish[key] : key
  };
}
