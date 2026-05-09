import React from 'react';
import { Package, X, ChevronDown, ScanBarcode, Calculator, ClipboardList, Tags } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';

interface VoucherItemEditModalProps {
  isOpen: boolean;
  editingRowIndex: number | null;
  setEditingRowIndex: (idx: number | null) => void;
  expandedRowSection: string | null;
  setExpandedRowSection: (sec: string | null) => void;
  rows: any[];
  setRows: (rows: any[]) => void;
  itemMasters: any[];
  handleItemOrSkuChange: (rowIndex: number, value: string, field: 'itemName' | 'sku') => void;
  setScanningRowIndex: (idx: number | null) => void;
  setShowScanner: (show: boolean) => void;
  getRowPreTaxRoundOff: (row: any) => number;
  calculateRowAmount: (row: any) => number;
  getRowRoundOff: (row: any) => number;
  calculateRowNetAmount: (row: any) => number;
}

export const VoucherItemEditModal: React.FC<VoucherItemEditModalProps> = ({
  isOpen, editingRowIndex, setEditingRowIndex, expandedRowSection, setExpandedRowSection,
  rows, setRows, itemMasters, handleItemOrSkuChange, setScanningRowIndex, setShowScanner,
  getRowPreTaxRoundOff, calculateRowAmount, getRowRoundOff, calculateRowNetAmount
}) => {
  if (!isOpen || editingRowIndex === null) return null;

  return (

        <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10 relative">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Edit Line Item</h3>
              <p className="text-xs md:text-sm font-medium text-gray-500 mt-1">Update transaction details for this specific entry.</p>
            </div>
            <button onClick={() => { setEditingRowIndex(null); setExpandedRowSection(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20">
              <X size={20} />
            </button>
          </div>
          
          <div className="py-4 md:py-8 overflow-y-auto flex-1 h-full w-full">
            <div className="space-y-6 w-full max-w-none">
                {/* Basic Item Info */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'item_selection' ? null : 'item_selection')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0">
                      <Package size={16} className="mr-2 text-blue-500"/> Item Selection
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'item_selection' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'item_selection' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-t border-gray-100">
                    <div className="col-span-1 md:col-span-1">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Item Name</label>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-blue-500 transition-colors shrink-0 bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" title="Scan Barcode" onClick={(e) => { e.stopPropagation(); setScanningRowIndex(editingRowIndex); setShowScanner(true); }}>
                          <ScanBarcode size={20} />
                        </button>
                        <div className="flex-1">
                          <SearchableDropdown
                            options={itemMasters}
                            value={rows[editingRowIndex]?.itemName || ''}
                            onChange={(val) => handleItemOrSkuChange(editingRowIndex, val, 'itemName')}
                            placeholder="Search for an item..."
                            buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-1">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Godown / Location</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.godown || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].godown = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Main Location"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                       <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Remarks / Narration</label>
                       <textarea 
                         value={rows[editingRowIndex]?.additionalDescription || ''} 
                         onChange={(e) => {
                           const r = [...rows];
                           r[editingRowIndex].additionalDescription = e.target.value;
                           setRows(r);
                         }}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none h-20"
                         placeholder="Enter additional details about this item..."
                       />
                     </div>
                  </div>
                  )}
                </section>

                {/* Advanced Item Attributes */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'attributes' ? null : 'attributes')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0">
                      <Tags size={16} className="mr-2 text-indigo-500"/> Attributes & Classification
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'attributes' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'attributes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-t border-gray-100">
                    {/* SKU */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">SKU / Barcode</label>
                      <SearchableDropdown
                        options={itemMasters.filter(i => i.sku)}
                        value={rows[editingRowIndex]?.sku || ''}
                        onChange={(value) => handleItemOrSkuChange(editingRowIndex, value, 'sku')}
                        placeholder="e.g. TS-BLU-M"
                        labelKey="sku"
                        buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.category || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].category = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="Category"
                      />
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Subcategory</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.subcategory || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].subcategory = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="Subcategory"
                      />
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Brand</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.brand || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].brand = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="Brand Name"
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Color</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.color || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].color = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Navy Blue"
                      />
                    </div>

                    {/* Variant */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Variant</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.variant || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].variant = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g. V2, Pro"
                      />
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Size</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.size || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].size = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g. XL, 42"
                      />
                    </div>

                    {/* Dimensions */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Dimensions</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.dimension || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].dimension = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="L x W x H"
                      />
                    </div>

                    {/* Material */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Material</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.material || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].material = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Cotton, Steel"
                      />
                    </div>
                  </div>
                  )}
                </section>

                {/* Quantity and Price */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'quantities' ? null : 'quantities')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0">
                      <Calculator size={16} className="mr-2 text-rose-500"/> Quantity and Price
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'quantities' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'quantities' && (
                  <div className="p-6 space-y-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Quantity</label>
                        <input 
                          type="number" 
                          value={rows[editingRowIndex]?.qty || ''} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].qty = e.target.value;
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Unit</label>
                        <select 
                          value={rows[editingRowIndex]?.unit || 'PCS'} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].unit = e.target.value;
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">MRP (₹)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={rows[editingRowIndex]?.mrp || ''} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].mrp = e.target.value;
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Rate (₹) [Excl. Tax]</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={rows[editingRowIndex]?.rate || ''} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].rate = e.target.value;
                            const tax = parseFloat(r[editingRowIndex].tax || '18');
                            const rate = parseFloat(e.target.value) || 0;
                            r[editingRowIndex].rateWithTax = (rate * (1 + tax / 100)).toFixed(2);
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tax %</label>
                        <select 
                          value={rows[editingRowIndex]?.tax || '18'} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].tax = e.target.value;
                            const tax = parseFloat(e.target.value) || 0;
                            const rate = parseFloat(r[editingRowIndex].rate) || 0;
                            r[editingRowIndex].rateWithTax = (rate * (1 + tax / 100)).toFixed(2);
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">HSN / SAC</label>
                        <input 
                          type="text" 
                          value={rows[editingRowIndex]?.hsn || ''} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].hsn = e.target.value;
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                          placeholder="HSN Code"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Rate w/ Tax (₹)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={rows[editingRowIndex]?.rateWithTax || ''} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].rateWithTax = e.target.value;
                            const tax = parseFloat(r[editingRowIndex].tax || '18');
                            const rwt = parseFloat(e.target.value) || 0;
                            r[editingRowIndex].rate = (rwt / (1 + tax / 100)).toFixed(2);
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tax Amount (₹)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          readOnly
                          value={((parseFloat(rows[editingRowIndex]?.rate || '0') * (parseFloat(rows[editingRowIndex]?.tax || '18') / 100))).toFixed(2)} 
                          className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-sm font-black text-gray-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100 flex items-center justify-between mt-4 md:col-span-2">
                       <span className="text-sm font-bold text-rose-800 uppercase tracking-widest">Net Row Amount</span>
                       <span className="text-xl font-black text-gray-900">
                         ₹ {calculateRowNetAmount(rows[editingRowIndex]).toFixed(2)}
                       </span>
                    </div>
                  </div>
                  )}
                </section>

                {/* Non-Tax Related */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'pricing_nontax' ? null : 'pricing_nontax')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0">
                      <Calculator size={16} className="mr-2 text-rose-500"/> Pre-Tax Details
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'pricing_nontax' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'pricing_nontax' && (
                  <div className="p-6 space-y-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Pre-Tax Disc %</label>
                        <input type="number" step="0.01" value={rows[editingRowIndex]?.discountPct || ''} onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].discountPct = e.target.value;
                          r[editingRowIndex].discountAmount = '';
                          setRows(r);
                        }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"/>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Pre-Tax Disc (₹)</label>
                        <input type="number" step="0.01" value={rows[editingRowIndex]?.discountAmount || ''} onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].discountAmount = e.target.value;
                          r[editingRowIndex].discountPct = '';
                          setRows(r);
                        }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"/>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Pre-Tax Rounding</label>
                        <select 
                          value={rows[editingRowIndex]?.preTaxRoundType || 'none'}
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].preTaxRoundType = e.target.value;
                            if (e.target.value !== 'manual') r[editingRowIndex].preTaxRoundOff = '';
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        >
                          <option value="none">None</option>
                          <option value="normal">Round Off</option>
                          <option value="up">Round Up</option>
                          <option value="down">Round Down</option>
                          <option value="manual">Manual Rounding</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Round Off Amount (±)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={rows[editingRowIndex]?.preTaxRoundType === 'manual' ? (rows[editingRowIndex]?.preTaxRoundOff || '') : (rows[editingRowIndex] ? getRowPreTaxRoundOff(rows[editingRowIndex]).toFixed(2) : '')} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].preTaxRoundType = 'manual';
                            r[editingRowIndex].preTaxRoundOff = e.target.value;
                            setRows(r);
                          }} 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                       <div>
                         <span className="block text-xs font-bold text-blue-800/60 uppercase">Gross Amount</span>
                         <span className="text-sm font-bold text-blue-900">₹ {((parseFloat(rows[editingRowIndex]?.qty || '0') * parseFloat(rows[editingRowIndex]?.rate || '0')) || 0).toFixed(2)}</span>
                       </div>
                       <div className="text-right">
                          <span className="block text-xs font-black text-blue-800 uppercase tracking-widest">Net Taxable Amount</span>
                          <span className="text-xl font-black text-blue-900">
                            ₹ {calculateRowAmount(rows[editingRowIndex]).toFixed(2)}
                          </span>
                       </div>
                    </div>
                  </div>
                  )}
                </section>

                {/* Post-Tax Details */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'pricing_tax' ? null : 'pricing_tax')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0">
                      <Calculator size={16} className="mr-2 text-rose-500"/> Post-Tax Details
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'pricing_tax' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'pricing_tax' && (
                  <div className="p-6 space-y-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Post-Tax Disc %</label>
                        <input type="number" step="0.01" value={rows[editingRowIndex]?.postTaxDiscountPct || ''} onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].postTaxDiscountPct = e.target.value;
                          r[editingRowIndex].postTaxDiscountAmount = '';
                          setRows(r);
                        }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"/>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Post-Tax Disc (₹)</label>
                        <input type="number" step="0.01" value={rows[editingRowIndex]?.postTaxDiscountAmount || ''} onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].postTaxDiscountAmount = e.target.value;
                          r[editingRowIndex].postTaxDiscountPct = '';
                          setRows(r);
                        }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Rounding Type</label>
                        <select 
                          value={rows[editingRowIndex]?.roundType || 'none'}
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].roundType = e.target.value;
                            if (e.target.value !== 'manual') r[editingRowIndex].roundOff = '';
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        >
                          <option value="none">None</option>
                          <option value="normal">Round Off</option>
                          <option value="up">Round Up</option>
                          <option value="down">Round Down</option>
                          <option value="manual">Manual Rounding</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Round Off Amount (±)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={rows[editingRowIndex]?.roundType === 'manual' ? (rows[editingRowIndex]?.roundOff || '') : (rows[editingRowIndex] ? getRowRoundOff(rows[editingRowIndex]).toFixed(2) : '')} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].roundType = 'manual';
                            r[editingRowIndex].roundOff = e.target.value;
                            setRows(r);
                          }} 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                       <div>
                         <span className="block text-xs font-bold text-slate-800/60 uppercase">Total with Tax</span>
                         <span className="text-sm font-bold text-slate-900">
                           ₹ {(() => {
                             const taxableAmount = calculateRowAmount(rows[editingRowIndex]);
                             const taxPct = parseFloat(rows[editingRowIndex]?.tax || '18') || 0;
                             const taxAmount = taxableAmount * (taxPct / 100);
                             return (taxableAmount + taxAmount).toFixed(2);
                           })()}
                         </span>
                       </div>
                       <div className="text-right">
                          <span className="block text-xs font-black text-slate-800 uppercase tracking-widest">Net Amount</span>
                          <span className="text-xl font-black text-slate-900">
                            ₹ {calculateRowNetAmount(rows[editingRowIndex]).toFixed(2)}
                          </span>
                       </div>
                    </div>
                  </div>
                  )}
                </section>

                {/* Additional Details */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'tracking' ? null : 'tracking')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0">
                      <ClipboardList size={16} className="mr-2 text-purple-500"/> Tracking & Details
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'tracking' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'tracking' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-t border-gray-100">
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Batch / Lot Number</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.batch || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].batch = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        placeholder="e.g. BATCH-001"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Manufacturing Date</label>
                      <input 
                        type="date" 
                        value={rows[editingRowIndex]?.mfgDate || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].mfgDate = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Expiry Date</label>
                      <input 
                        type="date" 
                        value={rows[editingRowIndex]?.expiryDate || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].expiryDate = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>
                  )}
                </section>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative">
              <button 
                onClick={() => setEditingRowIndex(null)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setEditingRowIndex(null)}
                className="px-8 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
              >
                Update Details
              </button>
            </div>
          </div>
  );
};
