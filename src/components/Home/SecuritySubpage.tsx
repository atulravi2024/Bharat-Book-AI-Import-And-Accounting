import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Lock, CheckCircle, Globe, Settings } from 'lucide-react';

interface SecuritySubpageProps {
  searchTerm?: string;
}

export const SecuritySubpage: React.FC<SecuritySubpageProps> = ({ searchTerm = "" }) => {
  const { language, setLanguage } = useLanguage();

  const term = searchTerm.toLowerCase();

  const showEncryptionCard = !term || 
    "cryptographic safe encryption end-to-end active shield local sandbox raw extracted records".toLowerCase().includes(term);

  const showLocalizationCard = !term ||
    "system settings language panel global locale settings localization dynamic display languages locale".toLowerCase().includes(term);

  const showGDPRCard = !term ||
    "gdpr zero-retention compliance agreement zero logging sandbox environment sovereignty private".toLowerCase().includes(term);

  const anyVisible = showEncryptionCard || showLocalizationCard || showGDPRCard;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {anyVisible ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Encryption card */}
            {showEncryptionCard && (
              <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-850 flex flex-col justify-between min-h-[220px]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    <ShieldCheck className="w-4 h-4" />
                    Cryptographic Safe
                  </h4>
                  <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                    {language === 'hi' ? 'एंड-टू-एंड एन्क्रिप्शन सक्रिय' : 'Local Sandbox Cryptographic Shield'}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    {language === 'hi' 
                      ? 'सभी अपलोडेड वाउचर फाइल्स और इन-मेमोरी रिकॉर्ड्स लोकली ही रेंडर और डिलीट किए जाते हैं। कोई भी अनधिकृत रिमोट सर्वर एक्सेस की अनुमति नहीं है।'
                      : 'All transient files, PDFs, images, and raw extracted records strictly stay nested inside sandbox environments, with instantaneous RAM purges on session completions.'
                    }
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-450">
                  <span>HASH ALGORITHM:</span>
                  <span className="text-emerald-400 font-bold">AES-GCM-256 SECURE</span>
                </div>
              </div>
            )}

            {/* System Settings & Language Panel */}
            {showLocalizationCard && (
              <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[220px] space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    {language === 'hi' ? 'वैश्विक लोकेल सेटिंग' : 'System Localization Hub'}
                  </h4>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                    {language === 'hi'
                      ? 'अपनी सुविधानुसार प्रणाली की भाषा बदलें। यह पूरी ऐप में अनुवाद अपडेट कर देगा।'
                      : 'Modify localized display languages dynamically. All registered tax rules, headers, and AI translation steps adapt to your chosen localization dialect.'
                    }
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-gray-700/60">
                  <div className="flex justify-between items-center text-xs justify-wrap gap-2">
                    <span className="text-slate-400 font-bold">{language === 'hi' ? 'सक्रिय प्रणाली भाषा' : 'Current Codec Dialect'}</span>
                    <div className="flex items-center bg-gray-50/85 dark:bg-gray-800/80 p-1 rounded-lg gap-1 border border-gray-200/40 dark:border-gray-700/40 overflow-x-auto custom-scrollbar shrink-0">
                      <button 
                        onClick={() => setLanguage('en')}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          language === 'en'
                            ? 'bg-white dark:bg-gray-750 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        English (EN)
                      </button>
                      <button 
                        onClick={() => setLanguage('hi')}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          language === 'hi'
                            ? 'bg-white dark:bg-gray-750 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        हिंदी (HI)
                      </button>
                      <button 
                        onClick={() => setLanguage('hinglish')}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          language === 'hinglish'
                            ? 'bg-white dark:bg-gray-750 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        Hinglish (HNG)
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">{language === 'hi' ? 'प्रणाली संस्करण' : 'Technical version tag'}</span>
                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-lg">v2.0.4 r10</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Compliance specification card */}
          {showGDPRCard && (
            <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-500" />
                GDPR Zero-Retention Compliance Agreement
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                <div className="space-y-1.5 p-4 bg-slate-50/50 dark:bg-slate-700/20 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
                  <h5 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    NO LOGGING GUIDELINES
                  </h5>
                  <p>Our servers never cache file assets, personal tax identifiers, or bank transactions to persistent databases without your active user authorization.</p>
                </div>

                <div className="space-y-1.5 p-4 bg-slate-50/50 dark:bg-slate-700/20 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
                  <h5 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    RAM SANDBOX ENVIRONMENT
                  </h5>
                  <p>All AI analysis parsing operations are performed using transactional, private instances. Your private credentials never leak into other models.</p>
                </div>

                <div className="space-y-1.5 p-4 bg-slate-50/50 dark:bg-slate-700/20 rounded-xl border border-slate-100/60 dark:border-gray-700/60">
                  <h5 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    USER CONTROL SOVEREIGNTY
                  </h5>
                  <p>You have full data custody. Purge, clean, delete, resetting or re-indexing files completely removes tracks instantly, ensuring complete privacy.</p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-50/50 dark:bg-gray-800/40 p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
            {language === 'hi'
              ? 'खोज से मिलता कोई सुरक्षा नियम नहीं मिला।'
              : 'No security compliance features matched your current search term.'
            }
          </p>
        </div>
      )}

    </div>
  );
};
