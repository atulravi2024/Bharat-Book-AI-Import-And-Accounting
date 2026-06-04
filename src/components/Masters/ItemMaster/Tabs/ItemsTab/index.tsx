import React from "react";
import { findDOMNode } from "react-dom";
import { useLanguage } from "../../../../../context/LanguageContext";
import { ImportExportButtons } from "../../../../shared/ImportExportButtons";
import {
  AddIcon,
  SearchIcon,
  DeleteIcon,
} from "../../../../icons/IconComponents";
import { ItemsTabProps } from "./types";
import { useItemsTab } from "./hooks/useItemsTab";
import { ItemTable } from "./views/ItemTable";
import { ItemModal } from "./views/ItemModal";

export const ItemsTab: React.FC<ItemsTabProps> = ({
  data,
  onSave,
  uomMasters = [],
  categoryMasters = [],
  brandMasters = [],
  stockGroupMasters = [],
  gradeMasters = [],
  assertionCategoryMasters = [],
  assertionCodeMasters = [],
  gstMasters = [],
  weightMasters = [],
}) => {
  const { t } = useLanguage();

  const {
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    activeSection,
    toggleSection,
    deleteConfirmation,
    setDeleteConfirmation,
    filteredData,
    handleSave,
    confirmDelete,
    triggerEdit,
    triggerAdd,
    triggerDeleteRequest,
  } = useItemsTab(data, onSave);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center dark:bg-gray-800/30 dark:border-gray-800">
        <div className="relative max-w-md w-full mr-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("Search Items...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center">
          <ImportExportButtons
            data={data}
            onSave={onSave}
            entityName="ItemsTab"
          />
          <button
            onClick={triggerAdd}
            className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all"
          >
            <AddIcon className="lg:mr-2" />{" "}
            <span className="hidden lg:inline-block">{t("Add Item")}</span>
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
        <ItemTable
          data={filteredData}
          onEdit={triggerEdit}
          onDeleteRequest={triggerDeleteRequest}
        />
      </div>

      {/* Form Input Modal (Portal inside) */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        activeSection={activeSection}
        toggleSection={toggleSection}
        allItems={data}
        uomMasters={uomMasters}
        categoryMasters={categoryMasters}
        brandMasters={brandMasters}
        stockGroupMasters={stockGroupMasters}
        gradeMasters={gradeMasters}
        assertionCategoryMasters={assertionCategoryMasters}
        assertionCodeMasters={assertionCodeMasters}
        gstMasters={gstMasters}
        weightMasters={weightMasters}
      />

      {/* Delete Confirmation Overlays */}
      {deleteConfirmation?.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 dark:bg-gray-800">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <DeleteIcon className="text-3xl" />
            </div>
            <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
              {t("Delete Item?")}
            </h2>
            <p className="text-gray-500 mb-6 text-sm dark:text-gray-400">
              {t("Are you sure you want to delete")} "{deleteConfirmation.name}
              "?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-200 transition"
              >
                {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
