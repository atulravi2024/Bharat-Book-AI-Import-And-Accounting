import React from 'react';
import { FileText, ChevronDown, ChevronUp, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface RegistryConsoleViewProps {
  t: (key: string) => string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  selectedKey: string;
  handleSelectKeyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loadJsonEditorKey: (key: string) => void;
  handleSaveJson: () => void;
  editorValue: string;
  setEditorValue: (value: string) => void;
  editorError: string | null;
  editorSuccess: boolean;
}

export const RegistryConsoleView: React.FC<RegistryConsoleViewProps> = ({
  t,
  expandedSection,
  setExpandedSection,
  selectedKey,
  handleSelectKeyChange,
  loadJsonEditorKey,
  handleSaveJson,
  editorValue,
  setEditorValue,
  editorError,
  editorSuccess,
}) => {
  const isOpen = expandedSection === 'jsonEditor';

  return (
    <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'jsonEditor')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Live JSON Registry Console")}</h4>
            <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Read, execute, and write local raw datasets with active schema validate")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
          
          {/* Selected key controller */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-900">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t("Active Master Table Key")}</label>
              <select 
                className="bg-transparent border-0 outline-none p-0 font-bold text-xs text-gray-900 dark:text-white cursor-pointer select-none focus:ring-0"
                value={selectedKey}
                onChange={handleSelectKeyChange}
              >
                <option value="bharat_book_all_vouchers_v2_v2">Transactions - (bharat_book_all_vouchers_v2_v2)</option>
                <option value="bharat_book_party_masters">Customers & Vendors - (bharat_book_party_masters)</option>
                <option value="bharat_book_item_masters">Items Catalog - (bharat_book_item_masters)</option>
                <option value="bharat_book_ledger_masters">Account Ledgers - (bharat_book_ledger_masters)</option>
                <option value="bharat_book_admin_feature_gates">Accessibility Toggles - (bharat_book_admin_feature_gates)</option>
                <option value="bharat_book_managed_users">Registered Staff Credentials - (bharat_book_managed_users)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => loadJsonEditorKey(selectedKey)}
                className="h-7 text-[10px] font-bold px-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-900 transition flex items-center gap-1 bg-white dark:bg-gray-950"
              >
                <RefreshCw className="w-3 h-3 text-indigo-500" /> {t("Discard Edits")}
              </button>
              <button 
                onClick={handleSaveJson}
                className="h-7 text-[10px] font-bold px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> {t("Save Changes")}
              </button>
            </div>
          </div>

          {/* Direct JSON code textarea */}
          <div className="relative">
            <textarea
              className="w-full h-52 bg-gray-900 text-gray-100 font-mono text-xs p-4 rounded-xl border border-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm leading-relaxed"
              value={editorValue}
              onChange={(e) => setEditorValue(e.target.value)}
              placeholder='[{ "id": "demo", "data": {} }]'
              spellCheck={false}
            />
            <div className="absolute bottom-2.5 right-2 text-[10px] font-bold font-mono text-gray-500 select-none bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
              {t("JSON Syntax Console")}
            </div>
          </div>

          {/* Alert system */}
          {editorError && (
            <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{editorError}</span>
            </div>
          )}

          {editorSuccess && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-450 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{t("Raw JSON payload validated & committed into Local Storage sandbox keys!")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
