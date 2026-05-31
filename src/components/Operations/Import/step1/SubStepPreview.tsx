import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    InfoIcon, 
    ExcelIcon,
} from '../../../icons/IconComponents';

interface SubStepPreviewProps {
  templateConfig: {
    title: string;
    description: string;
    headers: string[];
    sampleRows: Record<string, string>[];
    instructions: string[];
  };
  handleDownloadTemplate: () => void;
}

export const SubStepPreview: React.FC<SubStepPreviewProps> = ({
  templateConfig,
  handleDownloadTemplate,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col min-h-0 overflow-y-auto custom-scrollbar relative animate-in fade-in duration-300">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
       
       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 gap-4 text-left">
          <div>
             <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">
                {t(templateConfig.title)}
             </h2>
             <p className="text-xs text-gray-400 mt-2 font-medium">
                {t(templateConfig.description)}
             </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="shrink-0 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all hover:scale-102 hover:-translate-y-0.5 cursor-pointer"
          >
            <ExcelIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span>{t("Download CSV Template")}</span>
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4 text-left">
             <h3 className="text-xs font-black uppercase tracking-widest text-[11px] text-gray-500 opacity-60 dark:text-gray-300">{t("Live Interactive Data Schema Matrix")}</h3>
             <div className="border border-premium-slate-150 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm max-w-full">
                {/* Desktop view (Table) */}
                <div className="hidden border-collapse text-left text-xs font-medium text-gray-600 dark:text-gray-300 w-full overflow-x-auto min-[600px]:block">
                    <table className="min-w-full">
                       <thead>
                          <tr className="bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 text-[9px] md:text-[10px] font-black uppercase tracking-wider">
                             {templateConfig.headers.map((hdr) => (
                                <th key={hdr} className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap">{hdr.replace(/([A-Z])/g, ' $1')}</th>
                             ))}
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-mono text-[10px] md:text-[11px]">
                          {templateConfig.sampleRows.map((row, idx) => (
                             <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                                {templateConfig.headers.map((hdr) => (
                                   <td key={hdr} className="px-2 py-2 md:px-4 md:py-3 text-gray-800 dark:text-gray-200 max-w-[120px] md:max-w-xs truncate">{row[hdr] !== undefined ? row[hdr] : <span className="text-gray-300 dark:text-gray-600">—</span>}</td>
                                ))}
                             </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
                
                {/* Mobile view (Cards) */}
                <div className="block min-[600px]:hidden divide-y divide-gray-100 dark:divide-gray-850 bg-gray-50/30 dark:bg-gray-900/50">
                   {templateConfig.sampleRows.map((row, idx) => (
                      <div key={idx} className="p-3 space-y-2.5">
                         <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Row {idx + 1}</div>
                         <div className="flex flex-col space-y-1.5 font-mono text-[10px]">
                            {templateConfig.headers.map((hdr) => (
                               <div key={hdr} className="flex flex-col min-[360px]:flex-row min-[360px]:items-center justify-between pb-1.5 border-b border-gray-100/80 dark:border-gray-800/80 last:border-0 last:pb-0 gap-1 min-[360px]:gap-2">
                                  <span className="self-start min-[360px]:self-auto text-[9px] text-gray-500 dark:text-gray-400 uppercase font-sans font-black bg-gray-200/60 dark:bg-gray-800 px-1.5 py-0.5 rounded shrink-0 border border-gray-200/80 dark:border-gray-700">{hdr.replace(/([A-Z])/g, ' $1')}</span>
                                  <span className="text-gray-900 dark:text-gray-100 font-semibold min-[360px]:text-right flex-1 truncate pl-1 min-[360px]:pl-0">{row[hdr] !== undefined ? row[hdr] : <span className="text-gray-400 dark:text-gray-600">—</span>}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-4 text-left">
             <h3 className="text-xs font-black uppercase tracking-widest text-[11px] text-gray-500 opacity-60 dark:text-gray-300">{t("Preparation Guidelines")}</h3>
             <div className="bg-blue-50/10 border border-blue-105 dark:bg-blue-950/10 dark:border-blue-900/20 p-5 rounded-2xl space-y-3.5 shadow-sm">
                <p className="text-[12px] text-blue-900 dark:text-blue-300 font-bold leading-none">{t("Standard Ingestion Rule Checklists")}</p>
                <ul className="space-y-3">
                   {templateConfig.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start text-[11px] font-medium text-gray-600 dark:text-gray-300 leading-normal">
                         <span className="shrink-0 flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-full mr-3 border border-blue-200 dark:border-blue-900/40">{i + 1}</span>
                         <span className="pt-0.5 leading-normal">{t(inst)}</span>
                      </li>
                   ))}
                </ul>
             </div>
          </div>
       </div>

       <div className="w-full bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-850 dark:to-gray-900 border border-gray-150 dark:border-gray-700/60 p-5 rounded-2xl text-left flex items-start gap-4 mt-auto">
          <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 shadow-sm shrink-0">
             <InfoIcon className="text-blue-500 text-lg" />
          </div>
          <div>
             <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest text-[10px] mb-1.5">{t("Dynamic Column Matching Support")}</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                {t("Don't worry if your columns do not perfectly match our titles! In the next step, our Intelligent Field Parser will automatically analyze column headers, auto-map matching terms, and list unmatched fields for custom mapping.")}
             </p>
          </div>
       </div>
    </div>
  );
};
