import React, { useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { Eye, DollarSign, Calendar, EyeOff } from "lucide-react";

export const DataDisplayTab: React.FC = () => {
  const { t } = useLanguage();
  const [currencyStyle, setCurrencyStyle] = useState<"indian" | "intl">("indian");
  const [dateFormat, setDateFormat] = useState<"DD-MM-YYYY" | "YYYY-MM-DD" | "MM-DD-YYYY">("DD-MM-YYYY");
  const [hideSalaries, setHideSalaries] = useState(false);

  return (
    <div className="space-y-6">
      {/* Number and Currency Style */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-500" />
            {t("Currency & Indian Numbering Style")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Choose how ledger balances and amounts are format-partitioned across statements.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: "indian", title: t("Indian System (Lakh & Crore)"), preview: "₹12,34,56,789.00", desc: t("Use Indian local comma dividers (e.g. 10 Lakh = 10,00,000). Ideal for local GST audit trails.") },
            { id: "intl", title: t("International System (Million)"), preview: "₹123,456,789.00", desc: t("Standard western thousand delimiters (e.g. 1 Million = 1,000,000). Highly compliant with international stakeholders.") }
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setCurrencyStyle(style.id as any)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                currencyStyle === style.id
                  ? "border-blue-600 bg-blue-50/20 dark:bg-blue-900/10 dark:border-blue-500"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">{style.title}</span>
                <span className="text-[11px] font-mono font-bold bg-gray-150 px-2 py-0.5 rounded text-gray-700 dark:bg-gray-800 dark:text-gray-300">{style.preview}</span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Date-time Format */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            {t("Business Date Format")}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t("Choose the default date layout applied across import screens and generated vouchers.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "DD-MM-YYYY", label: "DD-MM-YYYY", example: "06-06-2026" },
            { id: "YYYY-MM-DD", label: "YYYY-MM-DD", example: "2026-06-06" },
            { id: "MM-DD-YYYY", label: "MM-DD-YYYY", example: "06-06-2026" }
          ].map((format) => (
            <button
              key={format.id}
              onClick={() => setDateFormat(format.id as any)}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                dateFormat === format.id
                  ? "border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 dark:border-emerald-500"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              }`}
            >
              <div>
                <p className="text-[12px] font-bold text-gray-900 dark:text-white">{format.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{format.example}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${dateFormat === format.id ? "border-emerald-500 bg-emerald-600 text-white" : "border-gray-300"}`}>
                {dateFormat === format.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sensitive Ledger masking */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div className="max-w-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
            {hideSalaries ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </div>
          <div>
            <h5 className="text-[13px] font-bold text-gray-900 dark:text-white">{t("Mask Proprietary Balances")}</h5>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              {t("Securely blur or hide sensitive internal partner salaries, employee commissions, or high-value ledger lines during live client presentations/imports.")}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setHideSalaries(!hideSalaries)}
          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${hideSalaries ? "bg-red-500" : "bg-gray-200 dark:bg-gray-700"}`}
        >
          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${hideSalaries ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
    </div>
  );
};
