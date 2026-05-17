import React from 'react';
import { Package, X, ScanBarcode, ChevronDown, Tags, ClipboardList, Calculator } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';


interface ItemEditModalProps {
  editingRowIndex: number;
  setEditingRowIndex: (idx: number | null) => void;
  expandedRowSection: string | null;
  setExpandedRowSection: (sec: string | null) => void;
  rows: any[];
  setRows: React.Dispatch<React.SetStateAction<any[]>>;
  itemMasters: any[];
  warehouseMasters: any[];
  handleItemOrSkuChange: (index: number, value: string, field: 'itemName' | 'sku') => void;
  setScanningRowIndex: (idx: number) => void;
  setShowScanner: (val: boolean) => void;
  activeTab: string;
}

export const ItemEditModal: React.FC<ItemEditModalProps> = ({
  editingRowIndex,
  setEditingRowIndex,
  expandedRowSection,
  setExpandedRowSection,
  rows,
  setRows,
  itemMasters,
  warehouseMasters,
  handleItemOrSkuChange,
  setScanningRowIndex,
  setShowScanner,
  activeTab
}) => {  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 dark:bg-gray-900">
      <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10 relative dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight dark:text-gray-100">Edit Inventory Entry</h3>
          <p className="text-xs md:text-sm font-medium text-gray-500 mt-1 dark:text-gray-400">Update transaction details for this specific entry.</p>
        </div>
        <button onClick={() => { setEditingRowIndex(null); setExpandedRowSection(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:bg-gray-800 dark:border-gray-700">
          <X size={20} />
        </button>
      </div>
      
      <div className="py-4 md:py-8 overflow-y-auto flex-1 h-full w-full px-4 md:px-8">
        <div className="space-y-6 w-full max-w-5xl mx-auto">
            {/* Basic Item Info */}
            <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden rounded-2xl dark:bg-gray-800 dark:border-gray-700">
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
              <div className="form-grid gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                <div className="form-field-wrapper col-span-1 sm:col-span-1">
                  <label className="form-label">Item Name / SKU</label>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-purple-500 transition-colors shrink-0 bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-900 dark:border-gray-700" title="Scan Barcode" onClick={(e) => { e.stopPropagation(); setScanningRowIndex(editingRowIndex); setShowScanner(true); }}>
                      <ScanBarcode size={20} />
                    </button>
                    <div className="flex-1">
                      <SearchableDropdown
                        options={itemMasters}
                        value={rows[editingRowIndex]?.itemName || ''}
                        onChange={(val) => handleItemOrSkuChange(editingRowIndex, val, 'itemName')}
                        placeholder="Search for an item..."
                        buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-left dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-field-wrapper col-span-1 sm:col-span-1">
                  <label className="form-label">Godown / Location</label>
                  <SearchableDropdown
                    options={warehouseMasters}
                    value={rows[editingRowIndex]?.godown || ''}
                    onChange={(val) => {
                      const r = [...rows];
                      r[editingRowIndex].godown = val;
                      setRows(r);
                    }}
                    placeholder="Select Godown..."
                    buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-left dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                  />
                </div>

                <div className="form-field-wrapper col-span-1 sm:col-span-2">
                   <label className="form-label">Remarks / Note</label>
                   <textarea 
                     value={rows[editingRowIndex]?.remarks || ''} 
                     onChange={(e) => {
                       const r = [...rows];
                       r[editingRowIndex].remarks = e.target.value;
                       setRows(r);
                     }}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none h-20 dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                     placeholder="Enter remarks for this entry..."
                   />
                 </div>
              </div>
              )}
            </section>

            {/* Advanced Item Attributes */}
            <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden rounded-2xl dark:bg-gray-800 dark:border-gray-700">
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
              <div className="form-grid gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                {/* SKU */}
                <div className="form-field-wrapper">
<label className="form-label">SKU / Barcode</label>
                  <SearchableDropdown
                    options={itemMasters.filter(i => i.sku)}
                    value={rows[editingRowIndex]?.sku || ''}
                    onChange={(value) => handleItemOrSkuChange(editingRowIndex, value, 'sku')}
                    placeholder="e.g. TS-BLU-M"
                    labelKey="sku"
                    buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                  />
                </div>
                
                {/* Category */}
                <div className="form-field-wrapper">
<label className="form-label">Category</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.category || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].category = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="Category"
                  />
                </div>

                {/* Subcategory */}
                <div className="form-field-wrapper">
<label className="form-label">Subcategory</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.subcategory || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].subcategory = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="Subcategory"
                  />
                </div>

                {/* Brand */}
                <div className="form-field-wrapper">
<label className="form-label">Brand</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.brand || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].brand = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="Brand Name"
                  />
                </div>

                {/* Color */}
                <div className="form-field-wrapper">
<label className="form-label">Color</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.color || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].color = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="e.g. Navy Blue"
                  />
                </div>

                {/* Variant */}
                <div className="form-field-wrapper">
<label className="form-label">Variant</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.variant || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].variant = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="e.g. V2, Pro"
                  />
                </div>

                {/* Size */}
                <div className="form-field-wrapper">
<label className="form-label">Size</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.size || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].size = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="e.g. XL, 42"
                  />
                </div>

                {/* Dimensions */}
                <div className="form-field-wrapper">
<label className="form-label">Dimensions</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.dimension || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].dimension = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="L x W x H"
                  />
                </div>

                {/* Material */}
                <div className="form-field-wrapper">
<label className="form-label">Material</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.material || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].material = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="e.g. Cotton, Steel"
                  />
                </div>
              </div>
              )}
            </section>

            {/* Tracking Details */}
            <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden rounded-2xl dark:bg-gray-800 dark:border-gray-700">
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
              <div className="form-grid gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                <div className="form-field-wrapper">
<label className="form-label">Batch / Lot Number</label>
                  <input 
                    type="text" 
                    value={rows[editingRowIndex]?.batch || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].batch = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    placeholder="e.g. BATCH-001"
                  />
                </div>
                
                <div className="form-field-wrapper">
<label className="form-label">Manufacturing Date</label>
                  <input 
                    type="date" 
                    value={rows[editingRowIndex]?.mfgDate || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].mfgDate = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                  />
                </div>
                
                <div className="form-field-wrapper">
<label className="form-label">Expiry Date</label>
                  <input 
                    type="date" 
                    value={rows[editingRowIndex]?.expiryDate || ''} 
                    onChange={(e) => {
                      const r = [...rows];
                      r[editingRowIndex].expiryDate = e.target.value;
                      setRows(r);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                  />
                </div>
              </div>
              )}
            </section>

            {/* Quantities */}
            <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden rounded-2xl dark:bg-gray-800 dark:border-gray-700">
              <header 
                className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                onClick={() => setExpandedRowSection(expandedRowSection === 'quantities' ? null : 'quantities')}
              >
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                  <Calculator size={16} className="mr-2 text-rose-500"/> Quantity
                </h4>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'quantities' ? 'rotate-180' : ''}`} />
              </header>
              {expandedRowSection === 'quantities' && (
              <div className="p-6 space-y-6 border-t border-gray-100 dark:border-gray-800">
                <div className="form-grid gap-6 items-end">
                  <div className="form-field-wrapper">
<label className="form-label">Unit</label>
                    <select 
                      value={rows[editingRowIndex]?.unit || 'PCS'} 
                      onChange={(e) => {
                        const r = [...rows];
                        r[editingRowIndex].unit = e.target.value;
                        setRows(r);
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    >
                      <option>PCS</option>
                      <option>NOS</option>
                      <option>KG</option>
                      <option>BOX</option>
                      <option>LTR</option>
                      <option>MTR</option>
                      <option>PKT</option>
                      <option>DOZ</option>
                      <option>ROLL</option>
                      <option>SET</option>
                    </select>
                  </div>

                  {activeTab === 'physical_stock' ? (
                    <>
                      <div className="form-field-wrapper">
<label className="form-label">Book Quantity</label>
                        <input 
                          type="number" 
                          value={rows[editingRowIndex]?.qty || ''} 
                          readOnly
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-600 outline-none transition-all opacity-70 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                        />
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">Physical Quantity</label>
                        <input 
                          type="number" 
                          value={rows[editingRowIndex]?.physicalQty || rows[editingRowIndex]?.qty || ''} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].physicalQty = e.target.value;
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="form-field-wrapper">
<label className="form-label">Quantity</label>
                      <input 
                        type="number" 
                        value={rows[editingRowIndex]?.qty || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].qty = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>
              )}
            </section>

            {/* Pricing */}
            <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden rounded-2xl dark:bg-gray-800 dark:border-gray-700">
              <header 
                className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                onClick={() => setExpandedRowSection(expandedRowSection === 'pricing' ? null : 'pricing')}
              >
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                  <Calculator size={16} className="mr-2 text-rose-500"/> Pricing
                </h4>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'pricing' ? 'rotate-180' : ''}`} />
              </header>
              {expandedRowSection === 'pricing' && (
              <div className="p-6 space-y-6 border-t border-gray-100 dark:border-gray-800">
                <div className="form-grid gap-6 items-end">
                  <div className="form-field-wrapper">
<label className="form-label">MRP (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={rows[editingRowIndex]?.mrp || ''} 
                      onChange={(e) => {
                        const r = [...rows];
                        r[editingRowIndex].mrp = e.target.value;
                        setRows(r);
                      }}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                  </div>
                  {activeTab !== 'physical_stock' && (
                    <div className="form-field-wrapper">
<label className="form-label">Rate (₹)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={rows[editingRowIndex]?.rate || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].rate = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                      />
                    </div>
                  )}
                </div>
                {activeTab !== 'physical_stock' && (
                  <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between mt-4">
                    <span className="text-sm font-bold text-purple-800 uppercase tracking-widest">Calculated Amount</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                      ₹ {((parseFloat(rows[editingRowIndex]?.qty || '0') * parseFloat(rows[editingRowIndex]?.rate || '0')) || 0).toFixed(2)}
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
          onClick={() => setEditingRowIndex(null)}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-200"
        >
          Cancel
        </button>
        <button 
          onClick={() => setEditingRowIndex(null)}
          className="px-8 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-colors shadow-sm active:scale-95"
        >
          Update Details
        </button>
      </div>
    </div>
  );
};
