import React from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { useFormSettings } from "../../../../../../app/useFormSettings";
import { CancelIcon } from "../../../../../icons/IconComponents";
import { ItemModalProps } from "../types";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { ClassificationSection } from "./components/ClassificationSection";
import { PricingTaxSection } from "./components/PricingTaxSection";
import { InventorySection } from "./components/InventorySection";
import { EcommerceSection } from "./components/EcommerceSection";

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingId,
  formData,
  setFormData,
  activeSection,
  toggleSection,
  allItems,
  uomMasters,
  categoryMasters,
  brandMasters,
  stockGroupMasters,
  gradeMasters,
  assertionCategoryMasters,
  assertionCodeMasters,
  gstMasters,
  weightMasters,
}) => {
  const { t } = useLanguage();
  const formSettings = useFormSettings();

  if (!isOpen || typeof document === "undefined") return null;

  const mainContentEl = document.getElementById("main-content");
  if (!mainContentEl) return null;

  return createPortal(
    <div
      className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center ${
        formSettings.currentModalMode === "fullscreen"
          ? "p-0"
          : "p-4 sm:p-6 md:p-8"
      }`}
    >
      <div
        className={`bg-white w-full h-full overflow-hidden flex flex-col dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl animate-in zoom-in-95 ${
          formSettings.currentModalMode === "fullscreen"
            ? "rounded-none max-w-full max-h-full"
            : "rounded-2xl max-w-5xl max-h-[90vh]"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
          <h2 className="font-bold text-base text-gray-900 flex items-center dark:text-white">
            {editingId ? t("Edit") : t("Add")} {t("Item")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-600"
          >
            <CancelIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Section 1: Basic Information */}
          <BasicInfoSection
            formData={formData}
            setFormData={setFormData}
            activeSection={activeSection}
            toggleSection={toggleSection}
            uomMasters={uomMasters}
          />

          {/* Section 2: Classification & Identifiers */}
          <ClassificationSection
            formData={formData}
            setFormData={setFormData}
            activeSection={activeSection}
            toggleSection={toggleSection}
            categoryMasters={categoryMasters}
            stockGroupMasters={stockGroupMasters}
            brandMasters={brandMasters}
            gradeMasters={gradeMasters}
            assertionCodeMasters={assertionCodeMasters}
            assertionCategoryMasters={assertionCategoryMasters}
            allItems={allItems}
            editingId={editingId}
          />

          {/* Section 3: Pricing & Taxation */}
          <PricingTaxSection
            formData={formData}
            setFormData={setFormData}
            activeSection={activeSection}
            toggleSection={toggleSection}
            gstMasters={gstMasters}
          />

          {/* Section 4: Inventory Management */}
          <InventorySection
            formData={formData}
            setFormData={setFormData}
            activeSection={activeSection}
            toggleSection={toggleSection}
          />

          {/* Section 5: E-Commerce & Compliance */}
          <EcommerceSection
            formData={formData}
            setFormData={setFormData}
            activeSection={activeSection}
            toggleSection={toggleSection}
            weightMasters={weightMasters}
          />
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition"
          >
            {t("Save Changes")}
          </button>
        </div>
      </div>
    </div>,
    mainContentEl
  );
};
