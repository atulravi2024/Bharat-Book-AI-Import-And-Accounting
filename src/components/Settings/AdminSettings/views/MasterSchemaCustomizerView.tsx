import React from 'react';
import { Database, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react';
import { SystemLog } from '../types';

interface MasterSchemaCustomizerViewProps {
  t: (key: string) => string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  activeSchemaTemplate: string;
  setActiveSchemaTemplate: (template: string) => void;
  setSystemLogs: React.Dispatch<React.SetStateAction<SystemLog[]>>;
}

export const MasterSchemaCustomizerView: React.FC<MasterSchemaCustomizerViewProps> = ({
  t,
  expandedSection,
  setExpandedSection,
  activeSchemaTemplate,
  setActiveSchemaTemplate,
  setSystemLogs,
}) => {
  const isOpen = expandedSection === 'schemaTemplate';

  return (
    <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'schemaTemplate')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Active Master Schema Customizer")}</h4>
            <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Manage relational database tables and apply regional ERP schemas")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-amber-500/10 text-amber-600 border border-amber-500/25 dark:bg-amber-950/45 dark:text-amber-400 shrink-0">{t("SIMULATED MODULE")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
          <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/30 dark:border-blue-900/30 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">{t("Multi-Schema Engine Selection")}</span>
              {t("You can instantly switch the active layout models to fit a specific regional tax directive. Choosing a schema re-indexes secondary keys (e.g. GSTIN, PAN, HSN structures) or unlocks custom experimental columns dynamically.")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { key: 'GAAP', title: 'Indian GST / GAAP Schema', desc: 'Standard double-entry Ledger mapping with full CGST/SGST/IGST compliance frameworks and HSN table catalogs.', active: activeSchemaTemplate === 'GAAP' },
              { key: 'RETAIL', title: 'B2C Simplified Retail Schema', desc: 'Pre-configures cash journal transactions, skipping secondary bulk ledger confirmations for high-volume transactions.', active: activeSchemaTemplate === 'RETAIL' },
              { key: 'MFG', title: 'Enterprise Logistics & Manufacturing', desc: 'Enables custom raw materials bill-of-materials ledger mapping, inventory cost tracking, and unit factors.', active: activeSchemaTemplate === 'MFG' }
            ].map((template) => (
              <div 
                key={template.key}
                onClick={() => {
                  setActiveSchemaTemplate(template.key);
                  setSystemLogs(prev => [
                    { time: new Date().toISOString().replace('T', ' ').substring(0, 19), event: `Schema Altered to ${template.key}`, user: 'Atul Ravi (SA)', status: 'Active' },
                    ...prev
                  ]);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  template.active 
                    ? 'bg-blue-50/30 border-blue-400 dark:bg-blue-950/20 dark:border-blue-700' 
                    : 'bg-white border-gray-150 dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50/50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-950 dark:text-white">{template.title}</span>
                    {template.active && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{template.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Schema columns validation checklist */}
          <div className="bg-gray-50/55 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-900/60 mt-2">
            <h5 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{t("Currently Loaded Table Definitions")}</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-200 block">transactions_v2</span>
                <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{t("22 active variables")}</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-200 block">party_profiles</span>
                <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{t("15 active variables")}</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-200 block">item_catalogs</span>
                <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{t("11 active variables")}</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-200 block">ledger_master_v3</span>
                <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{t("8 active variables")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
