import React from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';

interface OtherSelectionGridProps {
  selectedOtherCategory: string;
  setSelectedOtherCategory: (category: string) => void;
  customCategoryName: string;
  setCustomCategoryName: (name: string) => void;
}

export const OtherSelectionGrid: React.FC<OtherSelectionGridProps> = ({
  selectedOtherCategory,
  setSelectedOtherCategory,
  customCategoryName,
  setCustomCategoryName,
}) => {
  const { t } = useLanguage();

  const cards = [
    { id: 'employees_payroll', label: 'Payroll & HR', grp: 'Enterprise', d: 'HR personal profiles & salary structures', col: 'from-violet-500/10 to-transparent' },
    { id: 'fixed_assets', label: 'Fixed Assets', grp: 'Asset Mgmt', d: 'Fixtures, equipment & depreciation', col: 'from-indigo-500/10 to-transparent' },
    { id: 'currency_rates', label: 'Forex Matrices', grp: 'Compliance', d: 'Multi-currency conversion tables', col: 'from-teal-500/10 to-transparent' },
    { id: 'projects_wbs', label: 'Projects WBS', grp: 'Operations', d: 'Client contract work breakdowns', col: 'from-amber-500/10 to-transparent' },
    { id: 'discount_rules', label: 'Discount Schemes', grp: 'Sales Slabs', d: 'Pricing markdowns & promo matrices', col: 'from-rose-500/10 to-transparent' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between px-1">
          <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">{t("Select Target Database Table")}</label>
          <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-900/30 p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">{t("Active Import Target Category")}</h4>
          <p className="text-xs text-gray-500 mt-1">
            {t("Select the structured table template you want to parse and ingest your miscellaneous data into.")}
          </p>
        </div>
        <div className="w-full md:w-72">
          <select
            value={selectedOtherCategory}
            onChange={(e) => setSelectedOtherCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer"
          >
            <optgroup label={t("Miscellaneous Databases")}>
              <option value="employees_payroll">{t("Employees & Payroll")}</option>
              <option value="fixed_assets">{t("Fixed Asset Registry")}</option>
              <option value="currency_rates">{t("Forex Rate Matrices")}</option>
              <option value="projects_wbs">{t("Projects & Contract WBS")}</option>
              <option value="barcodes_units">{t("Barcodes & Packaging Mappings")}</option>
              <option value="discount_rules">{t("Discount & Promo Schemes")}</option>
              <option value="custom_dirs">{t("Custom Directory Master")}</option>
              <option value="custom">{t("Custom Category")}</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Quick Informational Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => {
          const isSelected = selectedOtherCategory === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setSelectedOtherCategory(card.id)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-550 bg-gradient-to-br from-blue-50/50 to-white dark:bg-gray-800 dark:border-blue-400' 
                  : 'border-gray-150 bg-white hover:border-blue-300 hover:bg-gray-50/50 dark:bg-gray-850 dark:border-gray-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                  {t(card.grp)}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                )}
              </div>
              <h5 className="text-xs font-extrabold text-gray-850 dark:text-white mt-1">{t(card.label)}</h5>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">{t(card.d)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
