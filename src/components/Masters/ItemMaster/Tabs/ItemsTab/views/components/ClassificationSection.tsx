import React from "react";
import { useLanguage } from "../../../../../../../context/LanguageContext";
import { ChevronDownIcon, ChevronRightIcon } from "../../../../../../icons/IconComponents";

interface ClassificationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  toggleSection: (section: string) => void;
  categoryMasters: any[];
  stockGroupMasters: any[];
  brandMasters: any[];
  gradeMasters: any[];
  assertionCodeMasters: any[];
  assertionCategoryMasters: any[];
  allItems: any[];
  editingId: string | null;
}

export const ClassificationSection: React.FC<ClassificationSectionProps> = ({
  formData,
  setFormData,
  activeSection,
  toggleSection,
  categoryMasters,
  stockGroupMasters,
  brandMasters,
  gradeMasters,
  assertionCodeMasters,
  assertionCategoryMasters,
  allItems,
  editingId,
}) => {
  const { t } = useLanguage();
  const isOpen = activeSection === "classification";

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button
        type="button"
        onClick={() => toggleSection("classification")}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {t("Classification & Identifiers")}
        </h3>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="form-grid">
          <div className="form-field-wrapper">
            <label className="form-label">{t("Category")}</label>
            <select
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">{t("Select Category...")}</option>
              {categoryMasters?.map((c: any) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Stock Group")}</label>
            <select
              value={formData.stockGroup || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockGroup: e.target.value,
                })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">{t("Select Stock Group...")}</option>
              {stockGroupMasters?.map((sg: any) => (
                <option key={sg.id} value={sg.name}>
                  {sg.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Brand")}</label>
            <select
              value={formData.brand || ""}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">{t("Select Brand...")}</option>
              {brandMasters?.map((b: any) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Grade / Quality")}</label>
            <select
              value={formData.grade || ""}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">{t("Select Grade...")}</option>
              {gradeMasters?.map((g: any) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("SKU")}</label>
            <input
              type="text"
              value={formData.sku || ""}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="form-input"
              placeholder={t("Enter SKU...")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Part Number / MPN")}</label>
            <input
              type="text"
              value={formData.partNumber || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  partNumber: e.target.value,
                })
              }
              className="form-input"
              placeholder={t("Part No.")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Barcode / UPC / EAN")}</label>
            <input
              type="text"
              value={formData.barcode || ""}
              onChange={(e) =>
                setFormData({ ...formData, barcode: e.target.value })
              }
              className="form-input"
              placeholder={t("Barcode")}
            />
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Assertion Code")}</label>
            <select
              value={formData.assertionCode || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assertionCode: e.target.value,
                })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">{t("Select Assertion Code...")}</option>
              {assertionCodeMasters?.map((a: any) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Assertion Category")}</label>
            <select
              value={formData.assertionCategory || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assertionCategory: e.target.value,
                })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">
                {t("Select Assertion Category...")}
              </option>
              {assertionCategoryMasters?.map((a: any) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Costing Method")}</label>
            <select
              value={formData.costingMethod || "FIFO"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  costingMethod: e.target.value,
                })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="FIFO">{t("FIFO")}</option>
              <option value="LIFO">{t("LIFO")}</option>
              <option value="Average">{t("Average")}</option>
              <option value="Standard">{t("Standard")}</option>
            </select>
          </div>
          <div className="form-field-wrapper">
            <label className="form-label">{t("Substitute Item")}</label>
            <select
              value={formData.substituteItemId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  substituteItemId: e.target.value,
                })
              }
              className="form-input bg-white dark:bg-gray-800"
            >
              <option value="">{t("No Substitute...")}</option>
              {allItems
                ?.filter((i: any) => i.id !== editingId)
                .map((i: any) => (
                  <option key={i.id} value={i.id}>
                    {i.name || i.code}
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
