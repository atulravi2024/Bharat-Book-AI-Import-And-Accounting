import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  FileSpreadsheet, 
  Users, 
  Briefcase, 
  Layers,
  TrendingUp,
  Cpu,
  Fingerprint,
  Sparkles,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ParsedVoucher } from '../../../app/types';
import { getCurrentUser } from '../../../utils/security';

interface SystemInfoSubpageProps {
  allVouchers: ParsedVoucher[];
  partyMasters: any[];
  ledgerMasters: any[];
  itemMasters: any[];
  searchTerm?: string;
}

export const SystemInfoSubpage: React.FC<SystemInfoSubpageProps> = ({
  allVouchers = [],
  partyMasters = [],
  ledgerMasters = [],
  itemMasters = [],
  searchTerm = ""
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
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const metrics = [
    {
      id: 'vouchers',
      label: language === 'hi' ? 'कुल संकलित वाउचर' : 'Ingested Vouchers',
      heading: language === 'hi' ? 'संचित वाउचर्स डेटा' : 'Accrued Vouchers Data',
      count: allVouchers.length,
      unit: 'Units',
      color: 'text-blue-650 bg-blue-50/50 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800/40',
      icon: FileSpreadsheet,
      desc: language === 'hi' ? 'एआई इंजन द्वारा सत्यापित और बहीखाता में दर्ज प्रविष्टियाँ।' : 'Vouchers verified and ledgerized via the Gemini AI processor.'
    },
    {
      id: 'parties',
      label: language === 'hi' ? 'ऑडिट फर्म / पार्टियाँ' : 'Audit Parties',
      heading: language === 'hi' ? 'सक्रिय बहीखाता कंपनियाँ' : 'Active Account Firms',
      count: partyMasters.length,
      unit: 'Firms',
      color: 'text-emerald-650 bg-emerald-50/50 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40',
      icon: Users,
      desc: language === 'hi' ? 'पंजीकृत विक्रेता, ग्राहक और सेवा प्रदाता व्यावसायिक निकाय।' : 'Registered vendors, clients and contracting entities in the directory.'
    },
    {
      id: 'ledgers',
      label: language === 'hi' ? 'खाता नियम / श्रेणियाँ' : 'Ledger Accounts',
      heading: language === 'hi' ? 'एकाउंटिंग लेजर रूल्स' : 'Accounting Ledger Rules',
      count: ledgerMasters.length,
      unit: 'Rules',
      color: 'text-amber-650 bg-amber-50/50 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-800/40',
      icon: Briefcase,
      desc: language === 'hi' ? 'दोहरी प्रविष्टि नियंत्रण के लिए मैप की गई खाता बही श्रेणियां।' : 'Configured double-entry chart categories synchronized in memory.'
    },
    {
      id: 'inventory',
      label: language === 'hi' ? 'सक्रिय उत्पाद मास्टर' : 'Inventory Master',
      heading: language === 'hi' ? 'इन्वेंट्री स्टॉक मदें' : 'Inventory Stock Items',
      count: itemMasters.length,
      unit: 'Items',
      color: 'text-purple-650 bg-purple-50/50 dark:bg-purple-900/30 dark:text-purple-400 border-purple-100 dark:border-purple-800/40',
      icon: Layers,
      desc: language === 'hi' ? 'एकीकृत जीएसटी एचएसएन वर्गीकरण वाली सक्रिय इन्वेंट्री आइटम।' : 'Active stock materials with matched HSN/SAC GST codes.'
    }
  ];

  // Dynamic search filtering
  const filteredMetrics = metrics.filter(m => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.label.toLowerCase().includes(term) ||
      m.heading.toLowerCase().includes(term) ||
      m.desc.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Display Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-sm border border-slate-800 animate-in fade-in slide-in-from-top-1 duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {language === 'hi' ? 'सिस्टम डैशबोर्ड सक्रिय' : 'Enterprise Core Hub'}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans">
              {language === 'hi' ? 'नमस्ते, ' : 'Welcome, '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-350">
                {currentUser?.name || 'Authorized Member'}
              </span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
              {language === 'hi' 
                ? 'भारत बुक एआई वाउचर स्वचालित प्रबंधन केंद्र में आपका स्वागत है। बहीखाता नियंत्रण और वाउचर डिजिटलीकरण शुरू करने के लिए अपना विकल्प चुनें।'
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
                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded leading-none">
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

      {/* Dynamic Summary Panel */}
      <div className="bg-slate-50 dark:bg-gray-905 border border-slate-200/50 dark:border-gray-805 rounded-2xl p-5 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest leading-none flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              {language === 'hi' ? 'डेटाबेस रियल-टाइम स्थिति' : 'Database Real-Time Health'}
            </span>
            <h2 className="text-base font-black text-slate-800 dark:text-white leading-tight">
              {language === 'hi' ? 'संग्रहीत उद्यम बहीखाता सारांश' : 'Aggregated Enterprise Ledger Summary'}
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 font-medium">
              {language === 'hi' 
                ? 'सिस्टम के मुख्य घटकों और पंजीकृत रिकॉर्ड्स की लाइव मात्रात्मक जानकारी नीचे प्रदर्शित है।'
                : 'Live structural distribution breakdown of key database registers compiled in local cache.'
              }
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-gray-750 shrink-0 self-start md:self-center">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'एकीकरण: सक्रिय' : 'INTEGRATION: ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredMetrics.length > 0 ? (
          filteredMetrics.map((item) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750/70 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                    {item.label}
                  </span>
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${item.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                      {item.count}
                    </span>
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      {item.unit}
                    </span>
                  </div>
                  <h4 className="text-[11px] font-black text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                    {item.heading}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-450 dark:text-slate-500 font-bold bg-slate-50/50 dark:bg-gray-800/35 rounded-2xl border border-dashed border-slate-200 dark:border-gray-750 text-xs">
            {language === 'hi' ? 'कोई मेल खाता सारांश नहीं मिला।' : 'No analytical summary matches your current search filters.'}
          </div>
        )}
      </div>

      {/* Decorative enterprise security stamp */}
      <div className="pt-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
        <span className="flex items-center gap-1">
          <Fingerprint className="w-3.5 h-3.5 text-blue-500" />
          {language === 'hi' ? 'एंटरप्राइज ऑडिट सुरक्षा टोकन: जीएसी-२५६' : 'ENTERPRISE AUDIT INTEGRITY SIGN: GAC-256'}
        </span>
        <span>{new Date().toISOString().substring(0, 10)}</span>
      </div>

    </div>
  );
};
