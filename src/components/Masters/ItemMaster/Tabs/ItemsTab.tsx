import { Edit2, Trash2 } from 'lucide-react';
import { createPortal } from "react-dom";
import React, { useState, useMemo } from "react";
import { useFormSettings } from '../../../../app/useFormSettings';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  CancelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "../../../icons/IconComponents";

interface ItemsTabProps {
  data: any[];
  onSave: (items: any[]) => void;
  uomMasters?: any[];
  categoryMasters?: any[];
  brandMasters?: any[];
  stockGroupMasters?: any[];
  gradeMasters?: any[];
  assertionCategoryMasters?: any[];
  assertionCodeMasters?: any[];
  gstMasters?: any[];
  weightMasters?: any[];
}

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
  const formSettings = useFormSettings();

  const { layoutType } = useFormSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  } | null>(null);
  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? "" : section));
  };

  const filteredData = useMemo(() => {
    return (data || []).filter((m: any) =>
      String(m.name || m.code || m.id || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const handleSave = () => {
    if (!formData.name?.trim() && !formData.code?.trim()) return;
    const newList = editingId
      ? data.map((m: any) => (m.id === editingId ? { ...formData } : m))
      : [...data, { ...formData, id: `${Date.now()}` }];
    onSave(newList);
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    onSave(data.filter((m: any) => m.id !== deleteConfirmation.id));
    setDeleteConfirmation(null);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center dark:bg-gray-800/30 dark:border-gray-800">
        <div className="relative max-w-md w-full mr-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center">
                    <ImportExportButtons data={data} onSave={onSave} entityName="ItemsTab" />
                    <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "" });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all"
        >
          <AddIcon className="lg:mr-2" /> <span className="hidden lg:inline-block">Add Item
        </span></button>
                </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
        {filteredData.length > 0 ? (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Name
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Code
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  SKU
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  HSN
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Category
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Brand
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  UOM
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Min Stock
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Max Stock
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Reorder Level
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Tax Rate
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Costing Method
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Sales Rate
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Purchase Rate
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  MRP
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Item Type
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Flags
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  Tracking
                </th>

                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
              {filteredData.map((m: any) => (
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
                    {m.minStock}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
                    {m.maxStock}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
                    {m.reorderLevel}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    {m.taxRate !== undefined && (
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 ring-1 ring-amber-100 rounded text-[10px] font-bold">
                        {m.taxRate}% GST
                      </span>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
                    {m.costingMethod}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono font-medium">
                    {m.salesRate ? `₹${m.salesRate.toFixed(2)}` : "-"}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
                    {m.purchaseRate ? `₹${m.purchaseRate.toFixed(2)}` : "-"}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono text-purple-600 dark:text-purple-400">
                    {m.mrp ? `₹${m.mrp.toFixed(2)}` : "-"}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    {m.itemType || "Inventory"}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    <div className="flex gap-1 flex-nowrap">
                      {m.isECommerceItem && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-medium">
                          E-Comm
                        </span>
                      )}
                      {m.drugLicenseRequired && (
                        <span className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-medium">
                          Rx
                        </span>
                      )}
                      {m.fssaiRequired && (
                        <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded text-[10px] font-medium">
                          FSSAI
                        </span>
                      )}
                      {m.isFoodGrade && (
                        <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded text-[10px] font-medium">
                          Food Grade
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    <div className="flex gap-1 flex-nowrap">
                      {m.batchTracking && (
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-medium">
                          Batch
                        </span>
                      )}
                      {m.expiryTracking && (
                        <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-medium">
                          Expiry
                        </span>
                      )}
                      {m.serialTracking && (
                        <span className="px-1.5 py-0.5 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 rounded text-[10px] font-medium">
                          Serial
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 align-middle">
                                        <div className="flex items-center justify-center space-x-2 w-full h-full m-auto">
                                            <button
                        onClick={() => {
                          setEditingId(m.id);
                          setFormData(m);
                          setIsModalOpen(true);
                        }}
                        className="mx-auto flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95"
                        title="Edit"
                      >
                        <Edit2 size={16} className="m-auto" />
                      </button>
                                            <button
                        onClick={() =>
                          setDeleteConfirmation({
                            isOpen: true,
                            id: m.id,
                            name: m.name || m.code,
                          })
                        }
                        className="mx-auto flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95"
                        title="Delete"
                      >
                        <Trash2 size={16} className="m-auto" />
                      </button>
                                        </div>
                                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center flex flex-col justify-center items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
              <SearchIcon className="text-gray-300 text-3xl" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No data found matching your search
            </p>
          </div>
        )}
      </div>

      {isModalOpen && typeof document !== "undefined" && document.getElementById("main-content") ? createPortal(
   <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center ${formSettings.currentModalMode === 'fullscreen' ? 'p-0' : 'p-4 sm:p-6 md:p-8'}`}>
          <div className={`bg-white w-full h-full overflow-hidden flex flex-col dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl animate-in zoom-in-95 ${formSettings.currentModalMode === 'fullscreen' ? 'rounded-none max-w-full max-h-full' : 'rounded-2xl max-w-5xl max-h-[90vh]'}`}>
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
              <h2 className="font-bold text-base text-gray-900 flex items-center dark:text-white">
                {editingId ? "Edit" : "Add"} Item
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-600"
              >
                <CancelIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {/* Section 1: Basic Information */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => toggleSection("basic")}
                  className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Basic Information
                  </h3>
                  {activeSection === "basic" ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {activeSection === "basic" && (
                  <div className="form-grid">
                    <div className={`col-span-1 md:col-span-2 flex items-start gap-4 ${layoutType === 'stacked' ? 'flex-col sm:flex-row' : ''}`}>
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 dark:bg-gray-800 dark:border-gray-600 flex-shrink-0 relative overflow-hidden">
                        {formData.imageUrl ? (
                          <img
                            src={formData.imageUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-center px-1">
                            Img
                          </span>
                        )}
                      </div>
                      <div className={`flex-1 ${layoutType === 'compact' ? 'space-y-2' : 'space-y-4'} w-full`}>
                        <div className="form-field-wrapper">
                            <label className="form-label">
                            Item Code *
                            </label>
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
                            placeholder="e.g. ITM-001"
                            autoFocus
                            />
                        </div>
                        <div className="form-field-wrapper">
                            <label className="form-label">
                            Item Name *
                            </label>
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
                            placeholder="e.g. Widget A"
                            />
                        </div>
                      </div>
                    </div>
                    <div className="form-field-wrapper form-grid col-span-1 md:col-span-2 gap-4">
                      <div className={`col-span-1 md:col-span-2 $"form-field-wrapper"`}>
                        <label className="form-label">
                          Description / Notes
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
                          placeholder="Add any extra details..."
                        />
                      </div>
                      <div className={`col-span-1 $"form-field-wrapper"`}>
                        <label className="form-label">
                          Status
                        </label>
                        <select
                          value={formData.status || "Active"}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="form-input dark:bg-gray-800"
                        >
                          <option value="Active">Active / Enable</option>
                          <option value="Inactive">Inactive / Disable</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Item Type
                      </label>
                      <select
                        value={formData.itemType || "Inventory"}
                        onChange={(e) =>
                          setFormData({ ...formData, itemType: e.target.value })
                        }
                        className="form-input bg-white dark:bg-gray-800"
                      >
                        <option value="Inventory">
                          Inventory (Stock tracking)
                        </option>
                        <option value="Service">
                          Service (Labor, Consulting)
                        </option>
                        <option value="Non-Inventory">
                          Non-Inventory (Consumables)
                        </option>
                        <option value="Assembly">
                          Assembly (Manufactured/BOM)
                        </option>
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Unit of Measure (UOM)
                      </label>
                      <select
                        value={formData.uom || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, uom: e.target.value })
                        }
                        className="form-input bg-white dark:bg-gray-800"
                      >
                        <option value="">Select UOM...</option>
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

              {/* Section 2: Identifiers & Grouping */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => toggleSection("classification")}
                  className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Classification & Identifiers
                  </h3>
                  {activeSection === "classification" ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {activeSection === "classification" && (
                  <div className="form-grid">
                    <div className="form-field-wrapper">
<label className="form-label">
                        Category
                      </label>
                      <select
                        value={formData.category || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="form-input bg-white dark:bg-gray-800"
                      >
                        <option value="">Select Category...</option>
                        {categoryMasters?.map((c: any) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Stock Group
                      </label>
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
                        <option value="">Select Stock Group...</option>
                        {stockGroupMasters?.map((sg: any) => (
                          <option key={sg.id} value={sg.name}>
                            {sg.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Brand
                      </label>
                      <select
                        value={formData.brand || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className="form-input bg-white dark:bg-gray-800"
                      >
                        <option value="">Select Brand...</option>
                        {brandMasters?.map((b: any) => (
                          <option key={b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Grade / Quality
                      </label>
                      <select
                        value={formData.grade || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, grade: e.target.value })
                        }
                        className="form-input bg-white dark:bg-gray-800"
                      >
                        <option value="">Select Grade...</option>
                        {gradeMasters?.map((g: any) => (
                          <option key={g.id} value={g.name}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={formData.sku || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        className="form-input"
                        placeholder="Enter SKU..."
                      />
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Part Number / MPN
                      </label>
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
                        placeholder="Part No."
                      />
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Barcode / UPC / EAN
                      </label>
                      <input
                        type="text"
                        value={formData.barcode || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, barcode: e.target.value })
                        }
                        className="form-input"
                        placeholder="Barcode"
                      />
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Assertion Code
                      </label>
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
                        <option value="">Select Assertion Code...</option>
                        {assertionCodeMasters?.map((a: any) => (
                          <option key={a.id} value={a.name}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Assertion Category
                      </label>
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
                        <option value="">Select Assertion Category...</option>
                        {assertionCategoryMasters?.map((a: any) => (
                          <option key={a.id} value={a.name}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Costing Method
                      </label>
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
                        <option value="FIFO">FIFO</option>
                        <option value="LIFO">LIFO</option>
                        <option value="Average">Average</option>
                        <option value="Standard">Standard</option>
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        Substitute Item
                      </label>
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
                        <option value="">No Substitute...</option>
                        {data
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

              {/* Section 3: Pricing & Tax */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => toggleSection("pricing")}
                  className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Pricing & Taxation
                  </h3>
                  {activeSection === "pricing" ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {activeSection === "pricing" && (
                  <div className="form-grid p-6 gap-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="form-field-wrapper col-span-1 md:col-span-2">
                      <label className="form-label">
                        Tax Rate / GST (%)
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
                      <label className="form-label">
                        HSN/SAC Code
                      </label>
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
                        <option value="">Select HSN...</option>
                        {gstMasters?.map((g: any) => (
                          <option key={g.id} value={g.hsnCode}>
                            {g.hsnCode} ({g.taxRate}% GST) - {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-wrapper">
<label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">
                        Purchase Rate
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
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-field-wrapper">
<label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">
                        Sales Rate (Standard)
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
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-field-wrapper">
<label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-1">
                        Wholesale Rate
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
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-field-wrapper">
<label className="form-label">
                        MRP
                      </label>
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
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-field-wrapper">
<label className="block text-xs font-bold text-teal-600 dark:text-teal-400 uppercase mb-1">
                        Dealer Rate
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
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Inventory limits */}
              {formData.itemType !== "Service" && (
                <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <button
                    type="button"
                    onClick={() => toggleSection("inventory")}
                    className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      Inventory Management
                    </h3>
                    {activeSection === "inventory" ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {activeSection === "inventory" && (
                    <div className="form-grid p-6 gap-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="form-field-wrapper">
<label className="form-label">
                          Min Stock
                        </label>
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
                          placeholder="0.00"
                        />
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">
                          Max Stock
                        </label>
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
                          placeholder="0.00"
                        />
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">
                          Reorder Lvl
                        </label>
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
                          placeholder="0.00"
                        />
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">
                          Lead Time (Days)
                        </label>
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
                          placeholder="Days"
                        />
                      </div>
                      <div className="form-field-wrapper form-grid col-span-1 md:col-span-4 gap-4 mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
                        <div className="form-field-wrapper">
<label className="form-label">Maintain in Batches</label>
                          <select
                            value={formData.batchTracking === true ? 'true' : 'false'}
                            onChange={e => setFormData({...formData, batchTracking: e.target.value === 'true'})}
                            className="form-input text-sm"
                          >
                            <option value="true">Enable (Yes)</option>
                            <option value="false">Disable (No)</option>
                          </select>
                        </div>
                        <div className="form-field-wrapper">
<label className="form-label">Maintain Expiry Dates</label>
                          <select
                            value={formData.expiryTracking === true ? 'true' : 'false'}
                            onChange={e => setFormData({
                                ...formData, 
                                expiryTracking: e.target.value === 'true',
                                batchTracking: e.target.value === 'true' ? true : formData.batchTracking
                            })}
                            className="form-input text-sm"
                          >
                            <option value="true">Enable (Yes)</option>
                            <option value="false">Disable (No)</option>
                          </select>
                        </div>
                        <div className="form-field-wrapper">
<label className="form-label">Track Serial Numbers</label>
                          <select
                            value={formData.serialTracking === true ? 'true' : 'false'}
                            onChange={e => setFormData({...formData, serialTracking: e.target.value === 'true'})}
                            className="form-input text-sm"
                          >
                            <option value="true">Enable (Yes)</option>
                            <option value="false">Disable (No)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section 5: Ecommerce & Compliance */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => toggleSection("ecommerce")}
                  className="w-full flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    E-Commerce & Compliance
                  </h3>
                  {activeSection === "ecommerce" ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {activeSection === "ecommerce" && (
                  <div className="form-grid p-6 gap-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="form-field-wrapper col-span-1 md:col-span-4 flex flex-col gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg dark:bg-blue-900/10 dark:border-blue-900/30">
                      <div className="form-field-wrapper">
<label className="block text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-1">Sell Online / E-commerce Sync</label>
                          <select
                            value={formData.isECommerceItem === true ? 'true' : 'false'}
                            onChange={e => setFormData({...formData, isECommerceItem: e.target.value === 'true'})}
                            className="form-input md:w-1/3 border-blue-200 dark:border-blue-800 text-sm"
                          >
                            <option value="true">Enable / Synced</option>
                            <option value="false">Disable / Not Synced</option>
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
                                <option value="Active">Active / Visible</option>
                                <option value="Draft">Draft</option>
                                <option value="Hidden">Hidden</option>
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
                              placeholder="https://store.example.com/item"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="form-field-wrapper form-grid col-span-1 md:col-span-4 gap-4">
                      <div className="form-field-wrapper col-span-2 md:col-span-2">
                        <label className="form-label">
                          Dimensions (LxWxH)
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            placeholder="L"
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
                            placeholder="W"
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
                            placeholder="H"
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
<label className="form-label">
                          Weight
                        </label>
                        <div className="flex">
                          <input
                            type="number"
                            placeholder="0.0"
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
                            <option value="">Unit</option>
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
                          Pack Size (Retail)
                        </label>
                        <input
                          type="number"
                          value={formData.packSize || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packSize: parseInt(e.target.value),
                            })
                          }
                          className="form-input"
                          placeholder="Pieces per pack"
                        />
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">
                          Master Carton Qty
                        </label>
                        <input
                          type="number"
                          value={formData.outerCartonQuantity || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              outerCartonQuantity: parseInt(e.target.value),
                            })
                          }
                          className="form-input"
                          placeholder="Qty for wholesale"
                        />
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">
                          Warranty Details
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
                          placeholder="e.g. 1 Year"
                        />
                      </div>
                    </div>
                    <div className="form-field-wrapper form-grid col-span-1 md:col-span-4 gap-4 mt-2 p-3 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/10 dark:border-red-900/30">
                      <div className="form-field-wrapper col-span-1 md:col-span-3 flex w-full items-center mb-1 border-b border-red-200/50 pb-2">
                        <span className="text-xs font-bold text-red-800 uppercase tracking-wider dark:text-red-400">
                          Industry Constraints / Medical / Food
                        </span>
                      </div>
                      <div className="form-field-wrapper">
<label className="block text-[10px] font-bold text-red-900 dark:text-red-300 uppercase tracking-widest mb-1">Requires Drug License (Pharma)</label>
                        <select
                          value={formData.drugLicenseRequired === true ? 'true' : 'false'}
                          onChange={e => setFormData({...formData, drugLicenseRequired: e.target.value === 'true'})}
                          className="w-full p-2 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:text-white text-sm"
                        >
                          <option value="true">Enable (Yes)</option>
                          <option value="false">Disable (No)</option>
                        </select>
                      </div>
                      <div className="form-field-wrapper">
<label className="block text-[10px] font-bold text-red-900 dark:text-red-300 uppercase tracking-widest mb-1">Needs Prescription (Rx)</label>
                        <select
                          value={formData.prescriptionRequired === true ? 'true' : 'false'}
                          onChange={e => setFormData({...formData, prescriptionRequired: e.target.value === 'true'})}
                          className="w-full p-2 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:text-white text-sm"
                        >
                          <option value="true">Enable (Yes)</option>
                          <option value="false">Disable (No)</option>
                        </select>
                      </div>
                      <div className="form-field-wrapper">
<label className="block text-[10px] font-bold text-orange-900 dark:text-orange-300 uppercase tracking-widest mb-1">FSSAI Relevant (Food/Grocery)</label>
                        <select
                          value={formData.fssaiRequired === true ? 'true' : 'false'}
                          onChange={e => setFormData({...formData, fssaiRequired: e.target.value === 'true'})}
                          className="w-full p-2 bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 dark:text-white text-sm"
                        >
                          <option value="true">Enable (Yes)</option>
                          <option value="false">Disable (No)</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-field-wrapper col-span-1 md:col-span-4 flex flex-wrap gap-4 mt-2 p-3 bg-teal-50 border border-teal-100 rounded-lg dark:bg-teal-900/10 dark:border-teal-900/30">
                      <div className="flex w-full items-center mb-1">
                        <span className="text-xs font-bold text-teal-800 uppercase tracking-wider dark:text-teal-400">
                          Kitchenware & Utensils Attributes
                        </span>
                      </div>
                      <div className="w-full mb-2 lg:w-1/3">
                        <label className="block text-xs font-bold text-teal-700 uppercase mb-1 dark:text-teal-500">
                          Material
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
                          placeholder="Stainless Steel, Glass, Ceramic..."
                        />
                      </div>
                      <div className="form-grid flex w-full flex-wrap gap-4">
                        <div className="form-field-wrapper">
<label className="block text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-widest mb-1">Food Grade Safe</label>
                          <select
                            value={formData.isFoodGrade === true ? 'true' : 'false'}
                            onChange={e => setFormData({...formData, isFoodGrade: e.target.value === 'true'})}
                            className="w-full p-2 bg-white dark:bg-gray-900 border border-teal-200 dark:border-teal-800 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-sm"
                          >
                            <option value="true">Enable (Yes)</option>
                            <option value="false">Disable (No)</option>
                          </select>
                        </div>
                        <div className="form-field-wrapper">
<label className="block text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-widest mb-1">Dishwasher Safe</label>
                          <select
                            value={formData.isDishwasherSafe === true ? 'true' : 'false'}
                            onChange={e => setFormData({...formData, isDishwasherSafe: e.target.value === 'true'})}
                            className="w-full p-2 bg-white dark:bg-gray-900 border border-teal-200 dark:border-teal-800 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-sm"
                          >
                            <option value="true">Enable (Yes)</option>
                            <option value="false">Disable (No)</option>
                          </select>
                        </div>
                        <div className="form-field-wrapper">
<label className="block text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-widest mb-1">Microwave Safe</label>
                          <select
                            value={formData.isMicrowaveSafe === true ? 'true' : 'false'}
                            onChange={e => setFormData({...formData, isMicrowaveSafe: e.target.value === 'true'})}
                            className="w-full p-2 bg-white dark:bg-gray-900 border border-teal-200 dark:border-teal-800 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-sm"
                          >
                            <option value="true">Enable (Yes)</option>
                            <option value="false">Disable (No)</option>
                          </select>
                        </div>
                        <div className="form-field-wrapper">
<label className="block text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-widest mb-1">Oven Safe</label>
                          <select
                            value={formData.isOvenSafe === true ? 'true' : 'false'}
                            onChange={e => setFormData({...formData, isOvenSafe: e.target.value === 'true'})}
                            className="w-full p-2 bg-white dark:bg-gray-900 border border-teal-200 dark:border-teal-800 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-sm"
                          >
                            <option value="true">Enable (Yes)</option>
                            <option value="false">Disable (No)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      , document.getElementById("main-content")!) : null}

      {deleteConfirmation?.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 dark:bg-gray-800">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <DeleteIcon className="text-3xl" />
            </div>
            <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
              Delete Item?
            </h2>
            <p className="text-gray-500 mb-6 text-sm dark:text-gray-400">
              Are you sure you want to delete "{deleteConfirmation.name}"?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
