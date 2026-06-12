import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Clock, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Fingerprint
} from 'lucide-react';
import { ParsedVoucher } from '../../app/types';
import { getCurrentUser } from '../../utils/security';
import { OverviewTab } from './info/tab/OverviewTab';
import { TransactionAnalysisTab } from './info/tab/TransactionAnalysisTab';

interface InfoSubpageProps {
  allVouchers: ParsedVoucher[];
  partyMasters: any[];
  ledgerMasters: any[];
  itemMasters: any[];
  searchTerm?: string;
  activeTab?: 'overview' | 'analysis';
}

export const InfoSubpage: React.FC<InfoSubpageProps> = ({
  allVouchers = [],
  partyMasters = [],
  ledgerMasters = [],
  itemMasters = [],
  searchTerm = "",
  activeTab = "overview"
}) => {
  const { language } = useLanguage();
  const currentUser = getCurrentUser();
  const [currentTime, setCurrentTime] = useState<string>('');

  // Dynamic live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  return (
    <div className="space-y-6 max-w-full">
      
      {/* Decorative user credential summary banner */}
      {currentUser && activeTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl border-b-[5px] border-b-blue-650 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 font-sans hover:transition-all hover:scale-[1.01] duration-300">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                {language === 'hi' ? 'स्वागत है, ' : 'Welcome, '} 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  {currentUser?.name || 'Authorized Member'}
                </span>
              </h1>
              <p className="text-slate-350 text-xs sm:text-sm max-w-2xl font-semibold leading-relaxed tracking-wide">
                {language === 'hi' 
                  ? 'भारत बुक एआई वाउचर स्वचालित प्रबंधन केंद्र में स्वागत है। लेखा परीक्षा डेटा, लेजर विश्लेषण और रीयल-टाइम डिवाइस सिंक की रिपोर्ट नीचे जांचें।'
                  : 'Accelerate your double-entry ledger flow with state-of-the-art AI parsing, automatic entity mapping, and real-time validation compliance.'
                }
              </p>
            </div>

            {/* Real-time System Status Panel */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/60 space-y-2 shrink-0 md:min-w-[260px]">
              <div className="flex items-center justify-between border-b border-slate-700/40 pb-1.5">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {language === 'hi' ? 'स्थानीय समय' : 'System Clock'}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-300">{currentTime || '...'}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-bold">{language === 'hi' ? 'सुरक्षा स्थिति' : 'Security Engine'}</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-50/10 px-2 py-0.5 rounded leading-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Secure Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-bold">{language === 'hi' ? 'एआई इंजन' : 'AI Model'}</span>
                  <span className="text-[10px] font-black text-blue-400 font-mono">Gemini-2.5-Flash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Summary Panel - ONLY on Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-slate-50 dark:bg-gray-905 border border-slate-200/50 dark:border-gray-850 rounded-2xl p-5 shadow-inner animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 bg-transparent">
              <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest leading-none flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 animate-pulse" />
                {language === 'hi' ? 'डेटाबेस रियल-टाइम स्थिति' : 'Database Real-Time Health'}
              </span>
              <h2 className="text-base font-black text-slate-800 dark:text-white leading-tight">
                {language === 'hi' ? 'संग्रहीत उद्यम बहीखाता सारांश' : 'Aggregated Enterprise Ledger Summary'}
              </h2>
              <p className="text-xs text-slate-455 dark:text-slate-500 font-medium">
                {language === 'hi' ? 'सिस्टम के मुख्य घटकों और पंजीकृत रिकॉर्ड्स की लाइव मात्रात्मक जानकारी नीचे प्रदर्शित है।' : 'Live structural distribution breakdown of key database registers compiled in local cache.'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-gray-755 shrink-0 self-start md:self-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'एकीकरण: सक्रिय' : 'INTEGRATION: ACTIVE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT WORKSPACE --- */}

      {activeTab === 'overview' ? (
        <OverviewTab 
          allVouchers={allVouchers}
          partyMasters={partyMasters}
          ledgerMasters={ledgerMasters}
          itemMasters={itemMasters}
          searchTerm={searchTerm}
          language={language}
        />
      ) : (
        <TransactionAnalysisTab 
          allVouchers={allVouchers}
          language={language}
        />
      )}

      {/* Decorative enterprise security stamp */}
      <div className="pt-4 border-t border-slate-100 dark:border-gray-850 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
        <span className="flex items-center gap-1">
          <Fingerprint className="w-3.5 h-3.5 text-blue-550" />
          {language === 'hi' ? 'एंटरप्राइज ऑडिट सुरक्षा टोकन: जीएसी-२५६' : 'ENTERPRISE AUDIT INTEGRITY SIGN: GAC-256'}
        </span>
        <span>{new Date().toISOString().substring(0, 10)}</span>
      </div>

    </div>
  );
};
