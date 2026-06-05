import React from "react";
import { useLanguage } from "../../../../../../../context/LanguageContext";
import { ChevronDownIcon, ChevronRightIcon } from "../../../../../../icons/IconComponents";

interface InventorySectionProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  toggleSection: (section: string) => void;
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  formData,
  setFormData,
  activeSection,
  toggleSection,
}) => {
  const { t } = useLanguage();

  if (formData.itemType === "Service") return null;

  const isOpen = activeSection === "inventory";

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button
        type="button"
        onClick={() => toggleSection("inventory")}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {t("Inventory Management")}
        </h3>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="form-grid p-6 gap-6 border-t border-gray-200 dark:border-gray-700">
          <div className="form-field-wrapper">
            <label className="form-label">{t("Min Stock")}</label>
            <input
              type="number"
              value={formData.minStock || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minStock: parseFloat(e.target.value),
                })
              }
              className="w-full p-2 border border-red-200 bg-red-50/30 dark:bg-red-900/10 dark:border-red-900/30 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
              placeholder={t("0.00")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Max Stock")}</label>
            <input
              type="number"
              value={formData.maxStock || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxStock: parseFloat(e.target.value),
                })
              }
              className="form-input"
              placeholder={t("0.00")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Reorder Lvl")}</label>
            <input
              type="number"
              value={formData.reorderLevel || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reorderLevel: parseFloat(e.target.value),
                })
              }
              className="w-full p-2 border border-amber-200 bg-amber-50/30 dark:bg-amber-900/10 dark:border-amber-900/30 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
              placeholder={t("0.00")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Lead Time (Days)")}</label>
            <input
              type="number"
              value={formData.leadTime || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  leadTime: parseInt(e.target.value, 10),
                })
              }
              className="form-input"
              placeholder={t("Days")}
            />
          </div>
          <div className="form-field-wrapper form-grid col-span-1 md:col-span-4 gap-4 mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
            <div className="form-field-wrapper">
              <label className="form-label">{t("Maintain in Batches")}</label>
              <select
                value={formData.batchTracking === true ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    batchTracking: e.target.value === "true",
                  })
                }
                className="form-input text-sm"
              >
                <option value="true">{t("Enable (Yes)")}</option>
                <option value="false">{t("Disable (No)")}</option>
              </select>
            </div>
            <div className="form-field-wrapper">
              <label className="form-label">
                {t("Maintain Expiry Dates")}
              </label>
              <select
                value={formData.expiryTracking === true ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiryTracking: e.target.value === "true",
                    batchTracking:
                      e.target.value === "true"
                        ? true
                        : formData.batchTracking,
                  })
                }
                className="form-input text-sm"
              >
                <option value="true">{t("Enable (Yes)")}</option>
                <option value="false">{t("Disable (No)")}</option>
              </select>
            </div>
            <div className="form-field-wrapper">
              <label className="form-label">
                {t("Track Serial Numbers")}
              </label>
              <select
                value={formData.serialTracking === true ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serialTracking: e.target.value === "true",
                  })
                }
                className="form-input text-sm"
              >
                <option value="true">{t("Enable (Yes)")}</option>
                <option value="false">{t("Disable (No)")}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
