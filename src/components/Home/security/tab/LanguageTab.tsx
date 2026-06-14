import React, { useState } from 'react';
import { Globe, Clock, CalendarDays, Hash } from 'lucide-react';

interface LanguageTabProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export const LanguageTab: React.FC<LanguageTabProps> = ({
  language,
  setLanguage
}) => {
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [numberFormat, setNumberFormat] = useState('en-IN');

  return (
    <div className="bg-white dark:bg-gray-850 border border-slate-100 dark:border-gray-750 rounded-2xl p-6 shadow-sm flex flex-col min-h-[220px] space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5 flex-1">
          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            {language === 'hi' ? 'वैश्विक लोकेल सेटिंग' : 'System Localization Hub'}
          </h4>
          <p className="text-slate-550 dark:text-slate-400 text-xs font-semibold leading-relaxed max-w-xl">
            {language === 'hi'
              ? 'अपनी सुविधानुसार प्रणाली की भाषा, समय और प्रारूप बदलें। यह पूरी ऐप में अनुवाद और डेटा प्रस्तुति को अनुकूलित कर देगा।'
              : 'Modify localized display languages and region formats dynamically. Core tax rules, headers, and UI components adapt to your chosen parameters.'
            }
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-gray-950 p-1.5 rounded-xl gap-1.5 border border-slate-200/50 dark:border-gray-800 shrink-0 shadow-sm">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
            }`}
          >
            ENG
          </button>
          <button 
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
              language === 'hi'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
            }`}
          >
            हिंदी
          </button>
          <button 
            onClick={() => setLanguage('hinglish')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
              language === 'hinglish'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
            }`}
          >
            HNG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-gray-700/60 pt-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Timezone Priority
          </label>
          <select 
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
            <option value="UTC">UTC Standard</option>
            <option value="America/New_York">EST (America/New_York)</option>
            <option value="Europe/London">GMT (Europe/London)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
            Date Format
          </label>
          <select 
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
            <option value="DD MMM YYYY">DD MMM YYYY (e.g. 15 Jan 2024)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-purple-500" />
            Number System
          </label>
          <select 
            value={numberFormat}
            onChange={(e) => setNumberFormat(e.target.value)}
            className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="en-IN">Indian / Vedic (Lakhs, Crores)</option>
            <option value="en-US">International (Millions, Billions)</option>
            <option value="de-DE">European (Decimal comma)</option>
          </select>
        </div>
      </div>
      
      <div className="pt-2 border-t border-slate-100 dark:border-gray-700/60 mt-2 flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-bold">{language === 'hi' ? 'प्रणाली संस्करण' : 'Technical version tag'}</span>
          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-lg">v2.0.4 r10</span>
      </div>
    </div>
  );
};
