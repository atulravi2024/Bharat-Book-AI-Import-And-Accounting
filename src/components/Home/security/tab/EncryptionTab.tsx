import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface EncryptionTabProps {
  language: string;
}

export const EncryptionTab: React.FC<EncryptionTabProps> = ({
  language
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between min-h-[220px] animate-in fade-in duration-300">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <ShieldCheck className="w-4 h-4" />
          Cryptographic Safe
        </h4>
        <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
          {language === 'hi' ? 'एंड-टू-एंड एन्क्रिप्शन सक्रिय' : 'Local Sandbox Cryptographic Shield'}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed font-semibold">
          {language === 'hi' 
            ? 'सभी अपलोडेड वाउचर फाइल्स और इन-मेमोरी रिकॉर्ड्स लोकली ही रेंडर और डिलीट किए जाते हैं। कोई भी अनधिकृत रिमोट सर्वर एक्सेस की अनुमति नहीं है।'
            : 'All transient files, PDFs, images, and raw extracted records strictly stay nested inside sandbox environments, with instantaneous RAM purges on session completions.'
          }
        </p>
      </div>
      
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-450 mt-6">
        <span>HASH ALGORITHM:</span>
        <span className="text-emerald-400 font-bold">AES-GCM-256 SECURE</span>
      </div>
    </div>
  );
};
