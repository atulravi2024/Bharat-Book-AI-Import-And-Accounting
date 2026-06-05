import React from "react";
import { useLanguage } from "../../../../../../../context/LanguageContext";
import { ChevronDownIcon, ChevronRightIcon } from "../../../../../../icons/IconComponents";

interface EcommerceSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  toggleSection: (section: string) => void;
  weightMasters: any[];
}

export const EcommerceSection: React.FC<EcommerceSectionProps> = ({
  formData,
  setFormData,
  activeSection,
  toggleSection,
  weightMasters,
}) => {
  const { t } = useLanguage();
  const isOpen = activeSection === "ecommerce";

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button
        type="button"
        onClick={() => toggleSection("ecommerce")}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {t("E-Commerce & Compliance")}
        </h3>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="form-grid p-6 gap-6 border-t border-gray-200 dark:border-gray-700">
          <div className="form-field-wrapper col-span-1 md:col-span-4 flex flex-col gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg dark:bg-blue-900/10 dark:border-blue-900/30">
            <div className="form-field-wrapper">
              <label className="block text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-1">
                {t("Sell Online / E-commerce Sync")}
              </label>
              <select
                value={formData.isECommerceItem === true ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isECommerceItem: e.target.value === "true",
                  })
                }
                className="form-input md:w-1/3 border-blue-200 dark:border-blue-800 text-sm"
              >
                <option value="true">{t("Enable / Synced")}</option>
                <option value="false">{t("Disable / Not Synced")}</option>
              </select>
            </div>
            {formData.isECommerceItem && (
              <>
                <div className="flex bg-white px-2 py-1 rounded border border-blue-200 dark:bg-gray-800 dark:border-gray-700">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <span className="text-xs font-bold text-gray-500">
                      Status:{" "}
                    </span>
                    <select
                      value={formData.onlineStatus || "Active"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          onlineStatus: e.target.value,
                        })
                      }
                      className="text-sm bg-transparent outline-none dark:text-white font-medium"
                    >
                      <option value="Active">{t("Active / Visible")}</option>
                      <option value="Draft">{t("Draft")}</option>
                      <option value="Hidden">{t("Hidden")}</option>
                    </select>
                  </label>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="url"
                    value={formData.productUrl || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productUrl: e.target.value,
                      })
                    }
                    className="form-input py-1.5 text-sm border-blue-200 rounded"
                    placeholder={t("https://store.example.com/item")}
                  />
                </div>
              </>
            )}
          </div>
          <div className="form-field-wrapper form-grid col-span-1 md:col-span-4 gap-4">
            <div className="form-field-wrapper col-span-2 md:col-span-2">
              <label className="form-label">
                {t("Dimensions (LxWxH)")}
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder={t("L")}
                  value={formData.dimensions?.length || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        length: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="form-input min-w-0 bg-transparent text-center"
                />
                <span className="text-gray-400 self-center">×</span>
                <input
                  type="number"
                  placeholder={t("W")}
                  value={formData.dimensions?.width || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        width: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="form-input min-w-0 bg-transparent text-center"
                />
                <span className="text-gray-400 self-center">×</span>
                <input
                  type="number"
                  placeholder={t("H")}
                  value={formData.dimensions?.height || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        height: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="form-input min-w-0 bg-transparent text-center"
                />
              </div>
            </div>
            <div className="form-field-wrapper">
              <label className="form-label">{t("Weight")}</label>
              <div className="flex">
                <input
                  type="number"
                  placeholder={t("0.0")}
                  value={formData.weight?.value || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: {
                        ...formData.weight,
                        value: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="form-input rounded-l-lg bg-transparent border-r-0"
                />
                <select
                  value={formData.weight?.unit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: {
                        ...formData.weight,
                        unit: e.target.value,
                      },
                    })
                  }
                  className="form-input w-16 rounded-r-lg text-xs"
                >
                  <option value="">{t("Unit")}</option>
                  {weightMasters?.map((w: any) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-field-wrapper">
              <label className="form-label">
                {t("Pack Size (Retail)")}
              </label>
              <input
                type="number"
                value={formData.packSize || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    packSize: parseInt(e.target.value, 10),
                  })
                }
                className="form-input"
                placeholder={t("Pieces per pack")}
              />
            </div>
            <div className="form-field-wrapper">
              <label className="form-label">
                {t("Master Carton Qty")}
              </label>
              <input
                type="number"
                value={formData.outerCartonQuantity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    outerCartonQuantity: parseInt(e.target.value, 10),
                  })
                }
                className="form-input"
                placeholder={t("Qty for wholesale")}
              />
            </div>
            <div className="form-field-wrapper">
              <label className="form-label">
                {t("Warranty Details")}
              </label>
              <input
                type="text"
                value={formData.warrantyPeriod || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warrantyPeriod: e.target.value,
                  })
                }
                  className="form-input"
                  placeholder={t("e.g. 1 Year")}
                />
              </div>
            </div>
            <div className="form-field-wrapper form-grid col-span-1 md:col-span-4 gap-4 mt-2 p-3 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/10 dark:border-red-900/30">
              <div className="form-field-wrapper col-span-1 md:col-span-3 flex w-full items-center mb-1 border-b border-red-200/50 pb-2">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider dark:text-red-400">
                  {t("Industry Constraints / Medical / Food")}
                </span>
              </div>
              <div className="form-field-wrapper">
                <label className="block text-[10px] font-bold text-red-900 dark:text-red-300 uppercase tracking-widest mb-1">
                  {t("Requires Drug License (Pharma)")}
                </label>
                <select
                  value={formData.drugLicenseRequired === true ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      drugLicenseRequired: e.target.value === "true",
                    })
                  }
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:text-white text-sm"
                >
                  <option value="true">{t("Enable (Yes)")}</option>
                  <option value="false">{t("Disable (No)")}</option>
                </select>
              </div>
              <div className="form-field-wrapper">
                <label className="block text-[10px] font-bold text-red-900 dark:text-red-300 uppercase tracking-widest mb-1">
                  {t("Needs Prescription (Rx)")}
                </label>
                <select
                  value={formData.prescriptionRequired === true ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prescriptionRequired: e.target.value === "true",
                    })
                  }
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:text-white text-sm"
                >
                  <option value="true">{t("Enable (Yes)")}</option>
                  <option value="false">{t("Disable (No)")}</option>
                </select>
              </div>
              <div className="form-field-wrapper">
                <label className="block text-[10px] font-bold text-orange-900 dark:text-orange-300 uppercase tracking-widest mb-1">
                  {t("FSSAI Relevant (Food/Grocery)")}
                </label>
                <select
                  value={formData.fssaiRequired === true ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fssaiRequired: e.target.value === "true",
                    })
                  }
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 dark:text-white text-sm"
                >
                  <option value="true">{t("Enable (Yes)")}</option>
                  <option value="false">{t("Disable (No)")}</option>
                </select>
              </div>
            </div>
            <div className="form-field-wrapper col-span-1 md:col-span-4 flex flex-wrap gap-4 mt-2 p-3 bg-teal-50 border border-teal-100 rounded-lg dark:bg-teal-900/10 dark:border-teal-900/30">
              <div className="flex w-full items-center mb-1">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider dark:text-teal-400">
                  {t("Kitchenware & Utensils Attributes")}
                </span>
              </div>
              <div className="w-full mb-2 lg:w-1/3">
                <label className="block text-xs font-bold text-teal-700 uppercase mb-1 dark:text-teal-500">
                  {t("Material")}
                </label>
                <input
                  type="text"
                  value={formData.material || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      material: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-teal-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 dark:border-teal-800/50 dark:text-white"
                  placeholder={t("Stainless Steel, Glass, Ceramic...")}
                />
              </div>
              <div className="form-grid flex w-full flex-wrap gap-4">
                <div className="form-field-wrapper">
                  <label className="block text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-widest mb-1">
                    {t("Food Grade Safe")}
                  </label>
                  <select
                    value={formData.isFoodGrade === true ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isFoodGrade: e.target.value === "true",
                      })
                    }
                    className="w-full p-2 bg-white dark:bg-gray-900 border border-teal-200 dark:border-teal-800 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-sm"
                  >
                    <option value="true">{t("Enable (Yes)")}</option>
                    <option value="false">{t("Disable (No)")}</option>
                  </select>
                </div>
                <div className="form-field-wrapper">
                  <label className="block text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-widest mb-1">
                    {t("Dishwasher Safe")}
                  </label>
                  <select
                    value={formData.isDishwasherSafe === true ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isDishwasherSafe: e.target.value === "true",
                      })
                    }
                    className="w-full p-2 bg-white dark:bg-gray-900 border border-teal-200 dark:border-teal-800 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-sm"
                  >
                    <option value="true">{t("Enable (Yes)")}</option>
                    <option value="false">{t("Disable (No)")}</option>
                  </select>
                </div>
                <div className="form-field-wrapper">
                  <label className="block text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-widest mb-1">
                    {t("Microwave Safe")}
                  </label>
                  <select
                    value={formData.isMicrowaveSafe === true ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isMicrowaveSafe: e.target.value === "true",
                      })
                    }
                    className="w-full p-2 bg-white dark:bg-gray-900 border border-teal-200 dark:border-teal-800 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-sm"
                  >
                    <option value="true">{t("Enable (Yes)")}</option>
                    <option value="false">{t("Disable (No)")}</option>
                  </select>
                </div>
                <div className="form-field-wrapper">
                  <label className="block text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-widest mb-1">
                    {t("Oven Safe")}
                  </label>
                  <select
                    value={formData.isOvenSafe === true ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isOvenSafe: e.target.value === "true",
                      })
                    }
                    className="w-full p-2 bg-white dark:bg-gray-900 border border-teal-200 dark:border-teal-800 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-sm"
                  >
                    <option value="true">{t("Enable (Yes)")}</option>
                    <option value="false">{t("Disable (No)")}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
