import React from 'react';
import { X, Package, ScanBarcode, Tags, ClipboardList, Calculator, ChevronDown } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';

interface InventoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: any[];
  editingRowIndex: number;
  expandedRowSection: string | null;
  setExpandedRowSection: (section: string | null) => void;
  handleItemOrSkuChange: (index: number, value: string, field: 'itemName' | 'sku') => void;
  setRows: (rows: any[]) => void;
  setShowScanner: (show: boolean) => void;
  setScanningRowIndex: (index: number | null) => void;
  itemMasters: any[];
  warehouseMasters: any[];
  activeTab: string;
}

export const InventoryEditModal: React.FC<InventoryEditModalProps> = ({
  isOpen,
  onClose,
  rows,
  editingRowIndex,
  expandedRowSection,
  setExpandedRowSection,
  handleItemOrSkuChange,
  setRows,
  setShowScanner,
  setScanningRowIndex,
  itemMasters,
  warehouseMasters,
  activeTab
}) => {
  if (!isOpen || editingRowIndex === null) return null;

  const currentRow = rows[editingRowIndex];

  const updateRow = (field: string, value: any) => {
    const r = [...rows];
    r[editingRowIndex] = { ...r[editingRowIndex], [field]: value };
    setRows(r);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 dark:bg-gray-900">
      <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10 relative dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight dark:text-gray-100">Edit Inventory Entry</h3>
          <p className="text-xs md:text-sm font-medium text-gray-500 mt-1 dark:text-gray-400">Update transaction details for this specific entry.</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:bg-gray-800 dark:border-gray-700">
          <X size={20} />
        </button>
      </div>
      
      <div className="py-4 md:py-8 overflow-y-auto flex-1 h-full w-full">
        <div className="space-y-6 w-full max-w-none">
          {/* Basic Item Info */}
          <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <header 
              className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              onClick={() => setExpandedRowSection(expandedRowSection === 'item_selection' ? null : 'item_selection')}
            >
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                <Package size={16} className="mr-2 text-purple-500"/> Item Selection
              </h4>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'item_selection' ? 'rotate-180' : ''}`} />
            </header>
            {expandedRowSection === 'item_selection' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                <div className="col-span-1 sm:col-span-1">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Item Name / SKU</label>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-purple-500 transition-colors shrink-0 bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:border-gray-700" title="Scan Barcode" onClick={(e) => { e.stopPropagation(); setScanningRowIndex(editingRowIndex); setShowScanner(true); }}>
                      <ScanBarcode size={20} />
                    </button>
                    <div className="flex-1">
                      <SearchableDropdown
                        options={itemMasters}
                        value={currentRow?.itemName || ''}
                        onChange={(val) => handleItemOrSkuChange(editingRowIndex, val, 'itemName')}
                        placeholder="Search for an item..."
                        buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-left dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-1">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Godown / Location</label>
                  <SearchableDropdown
                    options={warehouseMasters}
                    value={currentRow?.godown || ''}
                    onChange={(val) => updateRow('godown', val)}
                    placeholder="Select Godown..."
                    buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-left dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                   <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Remarks / Note</label>
                   <textarea 
                     value={currentRow?.remarks || ''} 
                     onChange={(e) => updateRow('remarks', e.target.value)}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none h-20 dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                     placeholder="Enter remarks for this entry..."
                   />
                 </div>
              </div>
            )}
          </section>

          {/* Advanced Item Attributes */}
          <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <header 
              className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              onClick={() => setExpandedRowSection(expandedRowSection === 'attributes' ? null : 'attributes')}
            >
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                <Tags size={16} className="mr-2 text-indigo-500"/> Attributes & Classification
              </h4>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'attributes' ? 'rotate-180' : ''}`} />
            </header>
            {expandedRowSection === 'attributes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">SKU / Barcode</label>
                  <SearchableDropdown
                    options={itemMasters.filter(i => i.sku)}
                    value={currentRow?.sku || ''}
                    onChange={(value) => handleItemOrSkuChange(editingRowIndex, value, 'sku')}
                    placeholder="e.g. TS-BLU-M"
                    labelKey="sku"
                    buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-left dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                  />
                </div>
                
                {['category', 'subcategory', 'brand', 'color', 'variant', 'size', 'dimension', 'material'].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 capitalize dark:text-gray-400">{field}</label>
                    <input 
                      type="text" 
                      value={currentRow?.[field] || ''} 
                      onChange={(e) => updateRow(field, e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Tracking Details */}
          <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <header 
              className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              onClick={() => setExpandedRowSection(expandedRowSection === 'tracking' ? null : 'tracking')}
            >
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                <ClipboardList size={16} className="mr-2 text-blue-500"/> Tracking & Details
              </h4>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'tracking' ? 'rotate-180' : ''}`} />
            </header>
            {expandedRowSection === 'tracking' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Batch / Lot Number</label>
                  <input 
                    type="text" 
                    value={currentRow?.batch || ''} 
                    onChange={(e) => updateRow('batch', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="e.g. BATCH-001"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Manufacturing Date</label>
                  <input 
                    type="date" 
                    value={currentRow?.mfgDate || ''} 
                    onChange={(e) => updateRow('mfgDate', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Expiry Date</label>
                  <input 
                    type="date" 
                    value={currentRow?.expiryDate || ''} 
                    onChange={(e) => updateRow('expiryDate', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Quantities & Pricing */}
          <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <header 
              className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              onClick={() => setExpandedRowSection(expandedRowSection === 'quantities' ? null : 'quantities')}
            >
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                <Calculator size={16} className="mr-2 text-rose-500"/> Quantity & Pricing
              </h4>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'quantities' ? 'rotate-180' : ''}`} />
            </header>
            {expandedRowSection === 'quantities' && (
              <div className="p-6 space-y-6 border-t border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Unit</label>
                    <select 
                      value={currentRow?.unit || 'PCS'} 
                      onChange={(e) => updateRow('unit', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    >
                      {['PCS', 'NOS', 'KG', 'BOX', 'LTR', 'MTR', 'PKT', 'DOZ', 'ROLL', 'SET'].map(unit => (
                        <option key={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {activeTab === 'physical_stock' ? (
                    <>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Book Quantity</label>
                        <input 
                          type="number" 
                          value={currentRow?.qty || '0'} 
                          readOnly
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-600 outline-none transition-all opacity-70 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Physical Quantity</label>
                        <input 
                          type="number" 
                          value={currentRow?.physicalQty || currentRow?.qty || ''} 
                          onChange={(e) => updateRow('physicalQty', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Quantity</label>
                      <input 
                        type="number" 
                        value={currentRow?.qty || ''} 
                        onChange={(e) => updateRow('qty', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 dark:text-gray-400">Rate (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={currentRow?.rate || ''} 
                      onChange={(e) => updateRow('rate', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                    />
                  </div>
                </div>

                {activeTab !== 'physical_stock' && (
                  <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between mt-4">
                    <span className="text-sm font-bold text-purple-800 uppercase tracking-widest">Calculated Amount</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                      ₹ {((parseFloat(currentRow?.qty || '0') * parseFloat(currentRow?.rate || '0')) || 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative dark:border-gray-800 dark:bg-gray-800">
        <button 
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-200"
        >
          Cancel
        </button>
        <button 
          onClick={onClose}
          className="px-8 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-colors shadow-sm active:scale-95 text-center"
        >
          Update Details
        </button>
      </div>
    </div>
  );
};
