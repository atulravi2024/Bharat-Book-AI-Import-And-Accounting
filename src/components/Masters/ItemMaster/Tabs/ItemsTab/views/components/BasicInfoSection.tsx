import React from "react";
import { useLanguage } from "../../../../../../../context/LanguageContext";
import { useFormSettings } from "../../../../../../../app/useFormSettings";
import { ChevronDownIcon, ChevronRightIcon } from "../../../../../../icons/IconComponents";

interface BasicInfoSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  toggleSection: (section: string) => void;
  uomMasters: any[];
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  setFormData,
  activeSection,
  toggleSection,
  uomMasters,
}) => {
  const { t } = useLanguage();
  const { layoutType } = useFormSettings();

  const isOpen = activeSection === "basic";

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button
        type="button"
        onClick={() => toggleSection("basic")}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {t("Basic Information")}
        </h3>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="form-grid">
          <div
            className={`col-span-1 md:col-span-2 flex items-start gap-4 ${
              layoutType === "stacked" ? "flex-col sm:flex-row" : ""
            }`}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 dark:bg-gray-800 dark:border-gray-600 flex-shrink-0 relative overflow-hidden">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-[10px] text-center px-1">
                  {t("Img")}
                </span>
              )}
            </div>
            <div
              className={`flex-1 ${
                layoutType === "compact" ? "space-y-2" : "space-y-4"
              } w-full`}
            >
              <div className="form-field-wrapper">
                <label className="form-label">{t("Item Code *")}</label>
                <input
                  type="text"
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value,
                    })
                  }
                  className="form-input font-mono"
                  placeholder={t("e.g. ITM-001")}
                  autoFocus
                />
              </div>
              <div className="form-field-wrapper">
                <label className="form-label">{t("Item Name *")}</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder={t("e.g. Widget A")}
                />
              </div>
            </div>
          </div>
          <div className="form-field-wrapper form-grid col-span-1 md:col-span-2 gap-4">
            <div className={"col-span-1 md:col-span-2 form-field-wrapper"}>
              <label className="form-label">
                {t("Description / Notes")}
              </label>
              <input
                type="text"
                value={formData.description || ""}
                onChange={(e) =>
                 setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="form-input"
                placeholder={t("Add any extra details...")}
              />
            </div>
            <div className={"col-span-1 form-field-wrapper"}>
              <label className="form-label">{t("Status")}</label>
              <select
                value={formData.status || "Active"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="form-input dark:bg-gray-800"
              >
                <option value="Active">{t("Active / Enable")}</option>
                <option value="Inactive">
                  {t("Inactive / Disable")}
                </option>
              </select>
            </div>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Item Type")}</label>
            <select
              value={formData.itemType || "Inventory"}
              onChange={(e) =>
                setFormData({ ...formData, itemType: e.target.value })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="Inventory">
                {t("Inventory (Stock tracking)")}
              </option>
              <option value="Service">
                {t("Service (Labor, Consulting)")}
              </option>
              <option value="Non-Inventory">
                {t("Non-Inventory (Consumables)")}
              </option>
              <option value="Assembly">
                {t("Assembly (Manufactured/BOM)")}
              </option>
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">
              {t("Unit of Measure (UOM)")}
            </label>
            <select
              value={formData.uom || ""}
              onChange={(e) =>
                setFormData({ ...formData, uom: e.target.value })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">{t("Select UOM...")}</option>
              {uomMasters?.map((u: any) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
