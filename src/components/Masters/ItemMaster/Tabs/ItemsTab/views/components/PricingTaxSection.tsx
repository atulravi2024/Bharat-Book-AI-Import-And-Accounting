import React from "react";
import { useLanguage } from "../../../../../../../context/LanguageContext";
import { ChevronDownIcon, ChevronRightIcon } from "../../../../../../icons/IconComponents";

interface PricingTaxSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  toggleSection: (section: string) => void;
  gstMasters: any[];
}

export const PricingTaxSection: React.FC<PricingTaxSectionProps> = ({
  formData,
  setFormData,
  activeSection,
  toggleSection,
  gstMasters,
}) => {
  const { t } = useLanguage();
  const isOpen = activeSection === "pricing";

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button
        type="button"
        onClick={() => toggleSection("pricing")}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {t("Pricing & Taxation")}
        </h3>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="form-grid p-6 gap-6 border-t border-gray-200 dark:border-gray-700">
          <div className="form-field-wrapper col-span-1 md:col-span-2">
            <label className="form-label">
              {t("Tax Rate / GST (%)")}
            </label>
            <input
              type="number"
              value={formData.taxRate || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  taxRate: parseFloat(e.target.value) || 0,
                })
              }
              className="form-input"
            />
          </div>
          <div className="form-field-wrapper col-span-1 md:col-span-2">
            <label className="form-label">{t("HSN/SAC Code")}</label>
            <select
              value={formData.hsnCode || ""}
              onChange={(e) => {
                const hsn = e.target.value;
                const matchedGst = gstMasters.find(
                  (g: any) => g.hsnCode === hsn,
                );
                setFormData({
                  ...formData,
                  hsnCode: hsn,
                  taxRate: matchedGst
                    ? matchedGst.taxRate
                    : formData.taxRate,
                });
              }}
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">{t("Select HSN...")}</option>
              {gstMasters?.map((g: any) => (
                <option key={g.id} value={g.hsnCode}>
                  {g.hsnCode} ({g.taxRate}% GST) - {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">
              {t("Purchase Rate")}
            </label>
            <input
              type="number"
              value={formData.purchaseRate || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  purchaseRate: parseFloat(e.target.value),
                })
              }
              className="w-full p-2 border border-emerald-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 dark:border-emerald-800/50 bg-emerald-50/30 dark:bg-emerald-900/10 dark:text-white"
              placeholder={t("0.00")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">
              {t("Sales Rate (Standard)")}
            </label>
            <input
              type="number"
              value={formData.salesRate || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salesRate: parseFloat(e.target.value),
                })
              }
              className="form-input border-blue-200 dark:border-blue-800/50 bg-blue-50/30 dark:bg-blue-900/10"
              placeholder={t("0.00")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-1">
              {t("Wholesale Rate")}
            </label>
            <input
              type="number"
              value={formData.wholesaleRate || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  wholesaleRate: parseFloat(e.target.value),
                })
              }
              className="w-full p-2 border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-800/50 bg-purple-50/30 dark:bg-purple-900/10 dark:text-white"
              placeholder={t("0.00")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("MRP")}</label>
            <input
              type="number"
              value={formData.mrp || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mrp: parseFloat(e.target.value),
                })
              }
              className="form-input"
              placeholder={t("0.00")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="block text-xs font-bold text-teal-600 dark:text-teal-400 uppercase mb-1">
              {t("Dealer Rate")}
            </label>
            <input
              type="number"
              value={formData.dealerRate || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dealerRate: parseFloat(e.target.value),
                })
              }
              className="w-full p-2 border border-teal-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:border-teal-800/50 bg-teal-50/30 dark:bg-teal-900/10 dark:text-white"
              placeholder={t("0.00")}
            />
          </div>
        </div>
      )}
    </div>
  );
};
