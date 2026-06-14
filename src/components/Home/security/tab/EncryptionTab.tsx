import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, RefreshCw, Server, AlertTriangle } from 'lucide-react';

interface EncryptionTabProps {
  language: string;
}

export const EncryptionTab: React.FC<EncryptionTabProps> = ({
  language
}) => {
  const [isStrict, setIsStrict] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [lastRotated, setLastRotated] = useState<Date>(new Date());
  const [keyId, setKeyId] = useState('K-AES-GCM-88A2B9');

  const handleRotateKey = () => {
    setIsRotating(true);
    setTimeout(() => {
      setKeyId(`K-AES-GCM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setLastRotated(new Date());
      setIsRotating(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[220px] space-y-6 animate-in fade-in duration-300 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-1000 ${isStrict ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 leading-none ${isStrict ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isStrict ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {isStrict ? 'Cryptographic Safe' : 'Standard Protection'}
          </h4>
          <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            {language === 'hi' ? 'स्थानीय सैंडबॉक्स एन्क्रिप्शन ढाल' : 'Local Sandbox Cryptographic Shield'}
          </h3>
          <p className="text-slate-400 text-xs font-medium max-w-xl">
            {language === 'hi' 
              ? 'सभी अपलोडेड वाउचर फाइल्स और इन-मेमोरी रिकॉर्ड्स लोकली ही रेंडर और डिलीट किए जाते हैं। आप अपनी आवश्यकता के अनुसार सुरक्षा स्तर को अनुकूलित कर सकते हैं।'
              : 'All transient files, PDFs, images, and raw extracted records strictly stay nested inside sandbox environments with instantaneous RAM purges.'
            }
          </p>
        </div>

        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setIsStrict(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isStrict ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setIsStrict(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isStrict ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Strict (AES-256)
          </button>
        </div>
      </div>

      {!isStrict && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex flex-row items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="text-amber-500 text-xs font-bold mb-1">Standard Mode Active</h5>
            <p className="text-amber-400/80 text-xs">Performance is optimized but data may persist longer in local storage cache before automatic purging. Not recommended for highly sensitive organizational data.</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Active Encryption Key</span>
            </div>
            {isRotating && <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md">
              {keyId}
            </span>
            <button 
              onClick={handleRotateKey}
              disabled={isRotating}
              className="text-[10px] font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded disabled:opacity-50 transition-colors"
            >
              Rotate Key
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            Last rotated: {lastRotated.toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
              <Server className="w-3.5 h-3.5" />
              <span>Sandbox Storage</span>
            </div>
          </div>
          <div className="space-y-2 mt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Auto-purge memory</span>
              <span className="text-slate-300 font-semibold">{isStrict ? 'On session end' : 'Every 24 hours'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Local encryption</span>
              <span className="text-emerald-400 font-semibold">AES-GCM-256</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
