import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageTabProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export const LanguageTab: React.FC<LanguageTabProps> = ({
  language,
  setLanguage
}) => {
  return (
    <div className="bg-white dark:bg-gray-850 border border-slate-100 dark:border-gray-750 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[220px] space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          {language === 'hi' ? 'वैश्विक लोकेल सेटिंग' : 'System Localization Hub'}
        </h4>
        
        <p className="text-slate-550 dark:text-slate-400 text-xs font-semibold leading-relaxed">
          {language === 'hi'
            ? 'अपनी सुविधानुसार प्रणाली की भाषा बदलें। यह पूरी ऐप में अनुवाद अपडेट कर देगा।'
            : 'Modify localized display languages dynamically. All registered tax rules, headers, and AI translation steps adapt to your chosen localization dialect.'
          }
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-gray-700/60">
        <div className="flex flex-wrap justify-between items-center text-xs gap-3">
          <span className="text-slate-500 dark:text-slate-400 font-bold">{language === 'hi' ? 'सक्रिय प्रणाली भाषा' : 'Current Codec Dialect'}</span>
          <div className="flex bg-slate-100 dark:bg-gray-950 p-1 rounded-xl gap-1 border border-slate-200/50 dark:border-gray-800 shrink-0 shadow-xs">
            <button 
              onClick={() => setLanguage('en')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                language === 'en'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              English (EN)
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                language === 'hi'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              हिंदी (HI)
            </button>
            <button 
              onClick={() => setLanguage('hinglish')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                language === 'hinglish'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              Hinglish (HNG)
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-bold">{language === 'hi' ? 'प्रणाली संस्करण' : 'Technical version tag'}</span>
          <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-lg">v2.0.4 r10</span>
        </div>
      </div>
    </div>
  );
};
