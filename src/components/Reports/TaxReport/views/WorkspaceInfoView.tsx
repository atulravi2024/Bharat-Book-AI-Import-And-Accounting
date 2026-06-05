import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
  FileText, ShieldCheck, HelpCircle, Landmark, BookOpen, Calculator, Info, 
  CheckCircle2, ChevronDown, ChevronUp, ChevronsUpDown, ChevronsDownUp
} from 'lucide-react';

export const WorkspaceInfoView: React.FC = () => {
  const { t } = useLanguage();
  
  const [openSections, setOpenSections] = useState({
    regime: true,
    milestones: true,
    tds: true,
    audit: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setAllStates = (state: boolean) => {
    setOpenSections({
      regime: state,
      milestones: state,
      tds: state,
      audit: state,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-sans">
      
      {/* Top Welcome Card with Global Toolbar */}
      <div className="p-5 bg-[#f8fafc] border border-slate-205 rounded-xl dark:bg-gray-900/60 dark:border-gray-750 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Info size={16} className="text-blue-600 animate-pulse" />
            {t("Workspace Overview & Guidelines")}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-455 mt-1 leading-relaxed">
            {t("Assess corporate tax projections, manage TDS/TCS ledger balances, monitor Section 115BAA status, and simulate tax due dates.")}
          </p>
        </div>
        <div className="flex gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={() => setAllStates(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 dark:bg-gray-800 dark:border-gray-700 text-slate-750 dark:text-gray-200 rounded-lg text-[10px] uppercase font-black tracking-wider transition-all hover:bg-slate-50 cursor-pointer shadow-3xs"
          >
            <ChevronsDownUp size={12} className="text-blue-600" />
            <span>{t("Expand All")}</span>
          </button>
          <button
            type="button"
            onClick={() => setAllStates(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 dark:bg-gray-800 dark:border-gray-700 text-slate-750 dark:text-gray-200 rounded-lg text-[10px] uppercase font-black tracking-wider transition-all hover:bg-slate-50 cursor-pointer shadow-3xs"
          >
            <ChevronsUpDown size={12} className="text-gray-500" />
            <span>{t("Collapse All")}</span>
          </button>
        </div>
      </div>

      {/* Grid of Bento Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Section 1: Corporate Tax Regimes */}
        <div className="bg-white border border-slate-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 shadow-3xs flex flex-col overflow-hidden">
          <div 
            onClick={() => toggleSection('regime')}
            className="p-4 bg-slate-50/40 dark:bg-gray-900/10 border-b border-transparent hover:bg-slate-50 dark:hover:bg-gray-700/30 flex justify-between items-center cursor-pointer transition-colors"
          >
            <h4 className="text-xs font-black uppercase text-blue-700 dark:text-blue-400 tracking-wider flex items-center gap-2">
              <ShieldCheck size={15} />
              {t("Statutory Section 115BAA vs Regular")}
            </h4>
            <span className="text-slate-400 hover:text-slate-650 transition">
              {openSections.regime ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
          {openSections.regime && (
            <div className="p-5 flex-1 flex flex-col justify-between animate-fadeIn">
              <div className="space-y-3 text-[11px] text-gray-655 dark:text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-gray-800 dark:text-white">{t("Section 115BAA choice:")}</strong> {t("Allows domestic firms to opt for a lower corporate income tax rate of 22% (effective 25.168% inclusive of 10% surcharge and 4% Health & Education Cess) starting FY 2019-20.")}
                </p>
                <p>
                  <strong className="text-gray-800 dark:text-white">{t("Regular Corporate regime:")}</strong> {t("Domestic companies pay a base rate of 30% plus surcharges/cess (effective 31.2%). However, choosing Section 115BAA means forfeiting certain exemptions (Section 10AA export units, Section 35AD capital allowances, etc.).")}
                </p>
              </div>
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-gray-750 text-[10px] text-gray-405 italic">
                {t("Note: Once opted, Section 115BAA choice cannot be withdrawn for subsequent assessment years.")}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Advance Tax Instalments */}
        <div className="bg-white border border-slate-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 shadow-3xs flex flex-col overflow-hidden">
          <div 
            onClick={() => toggleSection('milestones')}
            className="p-4 bg-slate-50/40 dark:bg-gray-900/10 border-b border-transparent hover:bg-slate-50 dark:hover:bg-gray-700/30 flex justify-between items-center cursor-pointer transition-colors"
          >
            <h4 className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-wider flex items-center gap-2">
              <Landmark size={15} />
              {t("Section 211 Advance Tax Milestones")}
            </h4>
            <span className="text-slate-400 hover:text-slate-650 transition">
              {openSections.milestones ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
          {openSections.milestones && (
            <div className="p-5 flex-1 flex flex-col justify-between animate-fadeIn">
              <div className="space-y-3.5">
                <p className="text-[11px] text-gray-655 dark:text-gray-400 leading-normal">
                  {t("Every corporate entity whose projected net tax liability exceeds ₹10,000 is required to pay tax in advance through 4 quarterly milestones:")}
                </p>
                <div className="grid grid-cols-2 gap-3.5 font-mono text-[10px] text-gray-550 dark:text-gray-300">
                  <div className="p-2 bg-slate-50 rounded dark:bg-gray-900/45 border border-slate-100 dark:border-gray-750">
                    <span className="font-bold text-gray-800 dark:text-indigo-300">15th June:</span> 15% cumulative
                  </div>
                  <div className="p-2 bg-slate-50 rounded dark:bg-gray-900/45 border border-slate-100 dark:border-gray-750">
                    <span className="font-bold text-gray-800 dark:text-indigo-300">15th September:</span> 45% cumulative
                  </div>
                  <div className="p-2 bg-slate-50 rounded dark:bg-gray-900/45 border border-slate-100 dark:border-gray-750">
                    <span className="font-bold text-gray-800 dark:text-indigo-300">15th December:</span> 75% cumulative
                  </div>
                  <div className="p-2 bg-slate-50 rounded dark:bg-gray-900/45 border border-slate-100 dark:border-gray-750">
                    <span className="font-bold text-gray-800 dark:text-indigo-300">15th March:</span> 100% cumulative
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-gray-750 text-[10px] text-gray-405 italic">
                {t("Caution: Delays attract penal interest computed at 1% per month under Section 234B & 234C.")}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: TDS & TCS Allocation */}
        <div className="bg-white border border-slate-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 shadow-3xs flex flex-col overflow-hidden">
          <div 
            onClick={() => toggleSection('tds')}
            className="p-4 bg-slate-50/40 dark:bg-gray-900/10 border-b border-transparent hover:bg-slate-50 dark:hover:bg-gray-700/30 flex justify-between items-center cursor-pointer transition-colors"
          >
            <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider flex items-center gap-2">
              <Calculator size={15} />
              {t("TDS matching with Traces (Form 26AS)")}
            </h4>
            <span className="text-slate-400 hover:text-slate-650 transition">
              {openSections.tds ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
          {openSections.tds && (
            <div className="p-5 flex-1 flex flex-col justify-between animate-fadeIn">
              <div className="space-y-3 text-[11px] text-gray-655 dark:text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-gray-800 dark:text-white">{t("Section 194Q / 194C matches:")}</strong> {t("Deductors are required to submit quarterly TDS returns (Form 26Q), after which they auto-populate into your Form 26AS. Real-time ledger algorithms match client invoice IDs with declared TAN credits.")}
                </p>
                <p>
                  <strong className="text-gray-800 dark:text-white">{t("Credit Allocation protocols:")}</strong> {t("TDS matching ledger allows domestic tax supervisors to reconcile active matches. Unreconciled credits are held as pending to prevent statutory disputes during assessment audits.")}
                </p>
              </div>
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-gray-750 text-[10px] text-emerald-600 font-semibold dark:text-emerald-400">
                {t("✓ Verified matches instantly offset advance liability in the planner.")}
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Export & Printing Protocols */}
        <div className="bg-white border border-slate-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 shadow-3xs flex flex-col overflow-hidden">
          <div 
            onClick={() => toggleSection('audit')}
            className="p-4 bg-slate-50/40 dark:bg-gray-900/10 border-b border-transparent hover:bg-slate-50 dark:hover:bg-gray-700/30 flex justify-between items-center cursor-pointer transition-colors"
          >
            <h4 className="text-xs font-black uppercase text-purple-700 dark:text-purple-400 tracking-wider flex items-center gap-2">
              <BookOpen size={15} />
              {t("Compliance Audit & Export Trails")}
            </h4>
            <span className="text-slate-400 hover:text-slate-650 transition">
              {openSections.audit ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
          {openSections.audit && (
            <div className="p-5 flex-1 flex flex-col justify-between animate-fadeIn">
              <div className="space-y-3 text-[11px] text-gray-655 dark:text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-gray-800 dark:text-white">{t("Multi-sheet Excel Exports:")}</strong> {t("Using the toolbar Download option, auditors can extract comprehensive books including raw matched TDS transaction registries alongside corporate tax income projections.")}
                </p>
                <p>
                  <strong className="text-gray-800 dark:text-white">{t("Physical Filing printouts:")}</strong> {t("Workspace stylesheets format prints dynamically (forcing hide of horizontal tabs & buttons), producing statutory-compliant physical copies of Form GST RFD-11 Letter of Undertaking and tax ledgers.")}
                </p>
              </div>
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-gray-750 text-[10px] text-gray-405 italic">
                {t("Certified by: Internal Regulatory Tax Audit Cell.")}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
