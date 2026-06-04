import React from 'react';
import { 
  ChevronRight, Settings, Database, ShieldCheck 
} from 'lucide-react';
import { FEATURES_LIST } from '../constants/featuresList';

interface ExplorerSegmentProps {
  t: (key: string) => string;
  selectedFeatureId: string;
  setSelectedFeatureId: (id: string) => void;
  explorerGroups: { config: boolean; data: boolean; security: boolean };
  toggleExpGroup: (group: 'config' | 'data' | 'security') => void;
}

export const ExplorerSegment: React.FC<ExplorerSegmentProps> = ({
  t,
  selectedFeatureId,
  setSelectedFeatureId,
  explorerGroups,
  toggleExpGroup,
}) => {
  return (
    <div className="space-y-5">
      {/* Group 1: Configuration & UI */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${explorerGroups.config ? 'border-blue-200 dark:border-blue-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
         <button 
            onClick={() => toggleExpGroup('config')}
            className="w-full flex items-center justify-between p-5 focus:outline-none"
         >
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg transition-colors ${explorerGroups.config ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}`}>
                  <Settings className="w-5 h-5" />
               </div>
               <div className="text-left">
                  <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Configuration & UI")}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Firm Setup, Numbers & Visuals")}</p>
               </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${explorerGroups.config ? 'rotate-90 text-blue-500' : ''}`} />
         </button>
         {explorerGroups.config && (
            <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
               {FEATURES_LIST.filter(f => ['firm', 'general', 'vouchernumbering', 'invoiceprint', 'navigation'].includes(f.id)).map(feat => {
                 const isExpanded = selectedFeatureId === feat.id;
                 const FeatureIcon = feat.icon;
                 return (
                    <div key={feat.id} className={`border rounded-lg transition-colors ${isExpanded ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-blue-200 cursor-pointer'}`}>
                       <button onClick={() => setSelectedFeatureId(isExpanded ? '' : feat.id)} className="w-full p-4 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 focus:outline-none">
                          <div className="flex items-center gap-3">
                             <div className={`p-2.5 rounded-md transition-colors ${isExpanded ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400'}`}>
                                <FeatureIcon className="w-5 h-5" />
                             </div>
                             <div className="text-left">
                                <h4 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{t(feat.name)}</h4>
                             </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${isExpanded ? 'rotate-90 text-blue-500' : ''}`} />
                       </button>
                       {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200 space-y-3">
                             <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{t(feat.description)}</p>
                             <div className="p-3 bg-white dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 font-semibold">
                                <span className="font-bold uppercase text-[9px] text-blue-600 block mb-1">Concept:</span>
                                {t(feat.concept)}
                             </div>
                          </div>
                       )}
                    </div>
                 );
               })}
            </div>
         )}
      </div>

      {/* Group 2: Data & Imports */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${explorerGroups.data ? 'border-indigo-200 dark:border-indigo-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
         <button 
            onClick={() => toggleExpGroup('data')}
            className="w-full flex items-center justify-between p-5 focus:outline-none"
         >
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg transition-colors ${explorerGroups.data ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'}`}>
                  <Database className="w-5 h-5" />
               </div>
               <div className="text-left">
                  <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Data & Imports")}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Schemas, Aliases & AI Engine")}</p>
               </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${explorerGroups.data ? 'rotate-90 text-indigo-500' : ''}`} />
         </button>
         {explorerGroups.data && (
            <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
               {FEATURES_LIST.filter(f => ['imports', 'mapping', 'ai', 'data', 'formdetails'].includes(f.id)).map(feat => {
                 const isExpanded = selectedFeatureId === feat.id;
                 const FeatureIcon = feat.icon;
                 return (
                    <div key={feat.id} className={`border rounded-lg transition-colors ${isExpanded ? 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-indigo-200 cursor-pointer'}`}>
                       <button onClick={() => setSelectedFeatureId(isExpanded ? '' : feat.id)} className="w-full p-4 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 focus:outline-none">
                          <div className="flex items-center gap-3">
                             <div className={`p-2.5 rounded-md transition-colors ${isExpanded ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400'}`}>
                                <FeatureIcon className="w-5 h-5" />
                             </div>
                             <div className="text-left">
                                <h4 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{t(feat.name)}</h4>
                             </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${isExpanded ? 'rotate-90 text-indigo-500' : ''}`} />
                       </button>
                       {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200 space-y-3">
                             <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{t(feat.description)}</p>
                             <div className="p-3 bg-white dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 font-semibold">
                                <span className="font-bold uppercase text-[9px] text-indigo-600 block mb-1">Concept:</span>
                                {t(feat.concept)}
                             </div>
                          </div>
                       )}
                    </div>
                 );
               })}
            </div>
         )}
      </div>

      {/* Group 3: Security & Admins */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${explorerGroups.security ? 'border-amber-200 dark:border-amber-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
         <button 
            onClick={() => toggleExpGroup('security')}
            className="w-full flex items-center justify-between p-5 focus:outline-none"
         >
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg transition-colors ${explorerGroups.security ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}`}>
                  <ShieldCheck className="w-5 h-5" />
               </div>
               <div className="text-left">
                  <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Security & Access")}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Privacy, Alerts & Directory")}</p>
               </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${explorerGroups.security ? 'rotate-90 text-amber-500' : ''}`} />
         </button>
         {explorerGroups.security && (
            <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
               {FEATURES_LIST.filter(f => ['users', 'alerts', 'security', 'privacy', 'admin'].includes(f.id)).map(feat => {
                 const isExpanded = selectedFeatureId === feat.id;
                 const FeatureIcon = feat.icon;
                 return (
                    <div key={feat.id} className={`border rounded-lg transition-colors ${isExpanded ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-amber-200 cursor-pointer'}`}>
                       <button onClick={() => setSelectedFeatureId(isExpanded ? '' : feat.id)} className="w-full p-4 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 focus:outline-none">
                          <div className="flex items-center gap-3">
                             <div className={`p-2.5 rounded-md transition-colors ${isExpanded ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-amber-600 dark:text-amber-400'}`}>
                                <FeatureIcon className="w-5 h-5" />
                             </div>
                             <div className="text-left">
                                <h4 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{t(feat.name)}</h4>
                             </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${isExpanded ? 'rotate-90 text-amber-500' : ''}`} />
                       </button>
                       {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200 space-y-3">
                             <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{t(feat.description)}</p>
                             <div className="p-3 bg-white dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 font-semibold">
                                <span className="font-bold uppercase text-[9px] text-amber-600 block mb-1">Concept:</span>
                                {t(feat.concept)}
                             </div>
                          </div>
                       )}
                    </div>
                 );
               })}
            </div>
         )}
      </div>
    </div>
  );
};
