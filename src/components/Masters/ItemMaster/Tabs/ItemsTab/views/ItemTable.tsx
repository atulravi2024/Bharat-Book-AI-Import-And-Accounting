import React from "react";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { Edit2, Trash2 } from "lucide-react";
import { SearchIcon } from "../../../../../icons/IconComponents";
import { ItemTableProps } from "../types";

export const ItemTable: React.FC<ItemTableProps> = ({
  data,
  onEdit,
  onDeleteRequest,
}) => {
  const { t, formatNumber } = useLanguage();

  if (data.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
          <SearchIcon className="text-gray-300 text-3xl" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {t("No data found matching your search")}
        </p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse whitespace-nowrap">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Name")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Code")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("SKU")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("HSN")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Category")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Brand")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("UOM")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Min Stock")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Max Stock")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Reorder Level")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Tax Rate")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Costing Method")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Sales Rate")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Purchase Rate")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("MRP")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Item Type")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Flags")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            {t("Tracking")}
          </th>
          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">
            {t("Actions")}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
        {data.map((m: any) => (
          <tr
            key={m.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
          >
            <td className="p-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                  {m.name?.[0]?.toUpperCase() ||
                    m.code?.[0]?.toUpperCase() ||
                    "M"}
                </div>
                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">
                  {m.name}
                </div>
              </div>
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.code}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.sku}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.hsnCode}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
              {m.category && (
                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {m.category}
                </span>
              )}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
              {m.brand}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.uom}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.minStock !== undefined && m.minStock !== null
                ? formatNumber(Number(m.minStock))
                : m.minStock}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.maxStock !== undefined && m.maxStock !== null
                ? formatNumber(Number(m.maxStock))
                : m.maxStock}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.reorderLevel !== undefined && m.reorderLevel !== null
                ? formatNumber(Number(m.reorderLevel))
                : m.reorderLevel}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
              {m.taxRate !== undefined && m.taxRate !== null && (
                <span className="px-2 py-1 bg-amber-50 text-amber-700 ring-1 ring-amber-100 rounded text-[10px] font-bold">
                  {formatNumber(Number(m.taxRate))}% GST
                </span>
              )}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.costingMethod}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono font-medium">
              {m.salesRate
                ? `₹${formatNumber(Number(m.salesRate), {
                    minimumFractionDigits: 2,
                  })}`
                : "-"}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
              {m.purchaseRate
                ? `₹${formatNumber(Number(m.purchaseRate), {
                    minimumFractionDigits: 2,
                  })}`
                : "-"}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono text-purple-600 dark:text-purple-400">
              {m.mrp
                ? `₹${formatNumber(Number(m.mrp), {
                    minimumFractionDigits: 2,
                  })}`
                : "-"}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
              {m.itemType || "Inventory"}
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
              <div className="flex gap-1 flex-nowrap">
                {m.isECommerceItem && (
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-medium">
                    {t("E-Comm")}
                  </span>
                )}
                {m.drugLicenseRequired && (
                  <span className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-medium">
                    {t("Rx")}
                  </span>
                )}
                {m.fssaiRequired && (
                  <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded text-[10px] font-medium">
                    {t("FSSAI")}
                  </span>
                )}
                {m.isFoodGrade && (
                  <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded text-[10px] font-medium">
                    {t("Food Grade")}
                  </span>
                )}
              </div>
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
              <div className="flex gap-1 flex-nowrap">
                {m.batchTracking && (
                  <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-medium">
                    {t("Batch")}
                  </span>
                )}
                {m.expiryTracking && (
                  <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-medium">
                    {t("Expiry")}
                  </span>
                )}
                {m.serialTracking && (
                  <span className="px-1.5 py-0.5 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 rounded text-[10px] font-medium">
                    {t("Serial")}
                  </span>
                )}
              </div>
            </td>
            <td className="p-4 align-middle">
              <div className="flex items-center justify-center space-x-2 w-full h-full m-auto">
                <button
                  onClick={() => onEdit(m)}
                  className="mx-auto flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95"
                  title={t("Edit")}
                >
                  <Edit2 size={16} className="m-auto" />
                </button>
                <button
                  onClick={() => onDeleteRequest(m.id, m.name || m.code)}
                  className="mx-auto flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95"
                  title={t("Delete")}
                >
                  <Trash2 size={16} className="m-auto" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
