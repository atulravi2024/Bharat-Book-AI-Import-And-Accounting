import React from 'react';
import { Package, X, ChevronDown, ScanBarcode, Calculator, ClipboardList, Tags } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';
import { useLanguage } from '../../../../context/LanguageContext';


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
  activeTab?: string;
  ledgerMasters?: any[];
}

export const VoucherItemEditModal: React.FC<VoucherItemEditModalProps> = ({
  isOpen, editingRowIndex, setEditingRowIndex, expandedRowSection, setExpandedRowSection,
  rows, setRows, itemMasters, handleItemOrSkuChange, setScanningRowIndex, setShowScanner,
  getRowPreTaxRoundOff, calculateRowAmount, getRowRoundOff, calculateRowNetAmount,
  activeTab = 'sales',
  ledgerMasters = []
}) => {
  const { t } = useLanguage();
  if (!isOpen || editingRowIndex === null) return null;

  const isInventory = ['sales', 'purchase', 'debit_note', 'credit_note'].includes(activeTab);

  return (

        <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 dark:bg-gray-900">
          <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10 relative dark:border-gray-700 dark:bg-gray-800">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight dark:text-gray-100">{t("Edit Line Item")}</h3>
              <p className="text-xs md:text-sm font-medium text-gray-500 mt-1 dark:text-gray-400">{t("Update transaction details for this specific entry.")}</p>
            </div>
            <button onClick={() => { setEditingRowIndex(null); setExpandedRowSection(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:bg-gray-800 dark:border-gray-700">
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
                      {isInventory ? (
                        <>
                          <Package size={16} className="mr-2 text-blue-500"/> {t("Item Selection")}
                        </>
                      ) : (
                        <>
                          <ClipboardList size={16} className="mr-2 text-blue-500"/> {t("Account Selection")}
                        </>
                      )}
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'item_selection' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'item_selection' && (
                  <div className="form-grid gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="form-field-wrapper col-span-1 md:col-span-1">
                      <label className="form-label">{isInventory ? t("Item Name") : t("Ledger Name")}</label>
                      <div className="flex items-center gap-2">
                        {isInventory && (
                          <button className="form-input text-gray-400 hover:text-blue-500 transition-colors shrink-0" title={t("Scan Barcode")} onClick={(e) => { e.stopPropagation(); setScanningRowIndex(editingRowIndex); setShowScanner(true); }}>
                            <ScanBarcode size={20} />
                          </button>
                        )}
                        <div className="flex-1">
                          <SearchableDropdown
                            options={isInventory ? itemMasters : ledgerMasters}
                            value={isInventory ? (rows[editingRowIndex]?.itemName || '') : (rows[editingRowIndex]?.ledgerName || '')}
                            onChange={(val) => {
                              if (isInventory) {
                                handleItemOrSkuChange(editingRowIndex, val, 'itemName');
                              } else {
                                const r = [...rows];
                                r[editingRowIndex].ledgerName = val;
                                setRows(r);
                              }
                            }}
                            placeholder={isInventory ? t("Search for an item...") : t("Search for a ledger...")}
                            buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>

                    {isInventory && (
                      <div className="form-field-wrapper col-span-1 md:col-span-1">
                        <label className="form-label">{t("Godown / Location")}</label>
                        <input 
                          type="text" 
                          value={rows[editingRowIndex]?.godown || ''} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].godown = e.target.value;
                            setRows(r);
                          }}
                          className="form-input text-sm font-semibold dark:focus:bg-gray-700"
                          placeholder={t("Main Location")}
                        />
                      </div>
                    )}

                    <div className="form-field-wrapper col-span-1 md:col-span-2">
                       <label className="form-label">{t("Remarks / Narration")}</label>
                       <textarea 
                         value={rows[editingRowIndex]?.additionalDescription || ''} 
                         onChange={(e) => {
                           const r = [...rows];
                           r[editingRowIndex].additionalDescription = e.target.value;
                           setRows(r);
                         }}
                         className="form-input text-sm font-medium resize-none h-20 dark:focus:bg-gray-700"
                         placeholder={t("Enter additional details about this item...")}
                       />
                     </div>
                  </div>
                  )}
                </section>

                {/* Advanced Item Attributes */}
                {isInventory && (
                  <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'attributes' ? null : 'attributes')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                      <Tags size={16} className="mr-2 text-indigo-500"/> {t("Attributes & Classification")}
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'attributes' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'attributes' && (
                  <div className="form-grid gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                    {/* SKU */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("SKU / Barcode")}</label>
                      <SearchableDropdown
                        options={itemMasters.filter(i => i.sku)}
                        value={rows[editingRowIndex]?.sku || ''}
                        onChange={(value) => handleItemOrSkuChange(editingRowIndex, value, 'sku')}
                        placeholder={t("e.g. TS-BLU-M")}
                        labelKey="sku"
                        buttonClassName="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                      />
                    </div>
                    
                    {/* Category */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("Category")}</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.category || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].category = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        placeholder={t("Category")}
                      />
                    </div>

                    {/* Subcategory */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("Subcategory")}</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.subcategory || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].subcategory = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        placeholder={t("Subcategory")}
                      />
                    </div>

                    {/* Brand */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("Brand")}</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.brand || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].brand = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        placeholder={t("Brand Name")}
                      />
                    </div>

                    {/* Color */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("Color")}</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.color || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].color = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        placeholder={t("e.g. Navy Blue")}
                      />
                    </div>

                    {/* Variant */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("Variant")}</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.variant || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].variant = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        placeholder={t("e.g. V2, Pro")}
                      />
                    </div>

                    {/* Size */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("Size")}</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.size || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].size = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        placeholder={t("e.g. XL, 42")}
                      />
                    </div>

                    {/* Dimensions */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("Dimensions")}</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.dimension || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].dimension = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        placeholder={t("L x W x H")}
                      />
                    </div>

                    {/* Material */}
                    <div className="form-field-wrapper">
<label className="form-label">{t("Material")}</label>
                      <input 
                        type="text" 
                        value={rows[editingRowIndex]?.material || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].material = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        placeholder={t("e.g. Cotton, Steel")}
                      />
                    </div>
                  </div>
                  )}
                </section>
                )}

                {/* Quantity and Price */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'quantities' ? null : 'quantities')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                      <Calculator size={16} className="mr-2 text-rose-500"/> {isInventory ? t("Quantity and Price") : t("Transaction Amount")}
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'quantities' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'quantities' && (
                  <div className="p-6 space-y-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="form-grid gap-6">
                      {!isInventory && (
                        <div className="form-field-wrapper col-span-1 md:col-span-2">
                          <label className="form-label">{t("Cr / Dr")}</label>
                          <select 
                            value={rows[editingRowIndex]?.crDr || 'Dr'} 
                            onChange={(e) => {
                              const r = [...rows];
                              r[editingRowIndex].crDr = e.target.value;
                              setRows(r);
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                          >
                            <option value="Dr">{t("Debit (Dr)")}</option>
                            <option value="Cr">{t("Credit (Cr)")}</option>
                          </select>
                        </div>
                      )}

                      <div className="form-field-wrapper">
                        <label className="form-label">{t("Amount (₹)")}</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={rows[editingRowIndex]?.amount || ''} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].amount = e.target.value;
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                        />
                      </div>
                      
                      {isInventory && (
                        <div className="form-field-wrapper">
                          <label className="form-label">{t("Quantity")}</label>
                          <input 
                            type="number" 
                            value={rows[editingRowIndex]?.qty || ''} 
                            onChange={(e) => {
                              const r = [...rows];
                              r[editingRowIndex].qty = e.target.value;
                              setRows(r);
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
                          />
                        </div>
                      )}
                      
                      {isInventory && (
                        <div className="form-field-wrapper">
                          <label className="form-label">{t("Unit")}</label>
                          <select 
                            value={rows[editingRowIndex]?.unit || 'PCS'} 
                            onChange={(e) => {
                              const r = [...rows];
                              r[editingRowIndex].unit = e.target.value;
                              setRows(r);
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700"
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
                      )}
                    </div>

                    {isInventory && (
                      <div className="form-grid gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="form-field-wrapper">
  <label className="form-label">{t("MRP (₹)")}</label>
                          <input 
                            type="number" 
                            step="0.01"
                            value={rows[editingRowIndex]?.mrp || ''} 
                            onChange={(e) => {
                              const r = [...rows];
                              r[editingRowIndex].mrp = e.target.value;
                              setRows(r);
                            }}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                          />
                        </div>

                        <div className="form-field-wrapper">
  <label className="form-label">{t("Rate (₹) [Excl. Tax]")}</label>
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
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                          />
                        </div>
                        
                        <div className="form-field-wrapper">
  <label className="form-label">{t("Tax %")}</label>
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
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                        </div>

                        <div className="form-field-wrapper">
  <label className="form-label">{t("HSN / SAC")}</label>
                          <input 
                            type="text" 
                            value={rows[editingRowIndex]?.hsn || ''} 
                            onChange={(e) => {
                              const r = [...rows];
                              r[editingRowIndex].hsn = e.target.value;
                              setRows(r);
                            }}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                            placeholder={t("HSN Code")}
                          />
                        </div>

                        <div className="form-field-wrapper">
  <label className="form-label">{t("Rate w/ Tax (₹)")}</label>
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
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                          />
                        </div>

                        <div className="form-field-wrapper">
  <label className="form-label">{t("Tax Amount (₹)")}</label>
                          <input 
                            type="number" 
                            step="0.01"
                            readOnly
                            value={((parseFloat(rows[editingRowIndex]?.rate || '0') * (parseFloat(rows[editingRowIndex]?.tax || '18') / 100))).toFixed(2)} 
                            className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-sm font-black text-gray-500 outline-none dark:bg-gray-800 dark:text-gray-400"
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-field-wrapper bg-rose-50/50 rounded-xl p-4 border border-rose-100 flex items-center justify-between mt-4 md:col-span-2">
                       <span className="text-sm font-bold text-rose-800 uppercase tracking-widest">{isInventory ? t("Net Row Amount") : t("Entry Amount")}</span>
                       <span className="text-xl font-black text-gray-900 dark:text-white">
                         ₹ {isInventory ? calculateRowNetAmount(rows[editingRowIndex]).toFixed(2) : (parseFloat(rows[editingRowIndex]?.amount || '0').toFixed(2))}
                       </span>
                    </div>
                  </div>
                  )}
                </section>

                {/* Pricing & Adjustments */}
                {isInventory && (
                  <>
                    <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'pricing_nontax' ? null : 'pricing_nontax')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                      <Calculator size={16} className="mr-2 text-rose-500"/> {t("Pre-Tax Details")}
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'pricing_nontax' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'pricing_nontax' && (
                  <div className="p-6 space-y-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="form-grid gap-6">
                      <div className="form-field-wrapper">
<label className="form-label">{t("Pre-Tax Disc %")}</label>
                        <input type="number" step="0.01" value={rows[editingRowIndex]?.discountPct || ''} onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].discountPct = e.target.value;
                          r[editingRowIndex].discountAmount = '';
                          setRows(r);
                        }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"/>
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">{t("Pre-Tax Disc (₹)")}</label>
                        <input type="number" step="0.01" value={rows[editingRowIndex]?.discountAmount || ''} onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].discountAmount = e.target.value;
                          r[editingRowIndex].discountPct = '';
                          setRows(r);
                        }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"/>
                      </div>
                    </div>
                    
                    <div className="form-grid gap-6">
                      <div className="form-field-wrapper">
<label className="form-label">{t("Pre-Tax Rounding")}</label>
                        <select 
                          value={rows[editingRowIndex]?.preTaxRoundType || 'none'}
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].preTaxRoundType = e.target.value;
                            if (e.target.value !== 'manual') r[editingRowIndex].preTaxRoundOff = '';
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        >
                          <option value="none">{t("None")}</option>
                          <option value="normal">{t("Round Off")}</option>
                          <option value="up">{t("Round Up")}</option>
                          <option value="down">{t("Round Down")}</option>
                          <option value="manual">{t("Manual")}</option>
                        </select>
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">{t("Round Off Amount (±)")}</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={rows[editingRowIndex]?.preTaxRoundType === 'manual' ? (rows[editingRowIndex]?.preTaxRoundOff || '') : ((rows[editingRowIndex] && getRowPreTaxRoundOff(rows[editingRowIndex]) !== undefined) ? getRowPreTaxRoundOff(rows[editingRowIndex]).toFixed(2) : '')} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].preTaxRoundType = 'manual';
                            r[editingRowIndex].preTaxRoundOff = e.target.value;
                            setRows(r);
                          }} 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" 
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                       <div>
                         <span className="block text-xs font-bold text-blue-800/60 uppercase">{t("Gross Amount")}</span>
                         <span className="text-sm font-bold text-blue-900">₹ {((parseFloat(rows[editingRowIndex]?.qty || '0') * parseFloat(rows[editingRowIndex]?.rate || '0')) || 0).toFixed(2)}</span>
                       </div>
                       <div className="text-right">
                          <span className="block text-xs font-black text-blue-800 uppercase tracking-widest">{t("Net Taxable Amount")}</span>
                          <span className="text-xl font-black text-blue-900">
                            ₹ {calculateRowAmount(rows[editingRowIndex]).toFixed(2)}
                          </span>
                       </div>
                    </div>
                  </div>
                  )}
                </section>

                {/* Post-Tax Details */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'pricing_tax' ? null : 'pricing_tax')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                      <Calculator size={16} className="mr-2 text-rose-500"/> {t("Post-Tax Details")}
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'pricing_tax' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'pricing_tax' && (
                  <div className="p-6 space-y-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="form-grid gap-6">
                      <div className="form-field-wrapper">
<label className="form-label">{t("Post-Tax Disc %")}</label>
                        <input type="number" step="0.01" value={rows[editingRowIndex]?.postTaxDiscountPct || ''} onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].postTaxDiscountPct = e.target.value;
                          r[editingRowIndex].postTaxDiscountAmount = '';
                          setRows(r);
                        }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"/>
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">{t("Post-Tax Disc (₹)")}</label>
                        <input type="number" step="0.01" value={rows[editingRowIndex]?.postTaxDiscountAmount || ''} onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].postTaxDiscountAmount = e.target.value;
                          r[editingRowIndex].postTaxDiscountPct = '';
                          setRows(r);
                        }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"/>
                      </div>
                    </div>
 
                    <div className="form-grid gap-6">
                      <div className="form-field-wrapper">
<label className="form-label">{t("Rounding Type")}</label>
                        <select 
                          value={rows[editingRowIndex]?.roundType || 'none'}
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].roundType = e.target.value;
                            if (e.target.value !== 'manual') r[editingRowIndex].roundOff = '';
                            setRows(r);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        >
                          <option value="none">{t("None")}</option>
                          <option value="normal">{t("Round Off")}</option>
                          <option value="up">{t("Round Up")}</option>
                          <option value="down">{t("Round Down")}</option>
                          <option value="manual">{t("Manual")}</option>
                        </select>
                      </div>
                      <div className="form-field-wrapper">
<label className="form-label">{t("Round Off Amount (±)")}</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={rows[editingRowIndex]?.roundType === 'manual' ? (rows[editingRowIndex]?.roundOff || '') : ((rows[editingRowIndex] && getRowRoundOff(rows[editingRowIndex]) !== undefined) ? getRowRoundOff(rows[editingRowIndex]).toFixed(2) : '')} 
                          onChange={(e) => {
                            const r = [...rows];
                            r[editingRowIndex].roundType = 'manual';
                            r[editingRowIndex].roundOff = e.target.value;
                            setRows(r);
                          }} 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" 
                          placeholder="0.00"
                        />
                      </div>
                    </div>
 
                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                       <div>
                         <span className="block text-xs font-bold text-slate-800/60 uppercase">{t("Total with Tax")}</span>
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
                          <span className="block text-xs font-black text-slate-800 uppercase tracking-widest">{t("Net Amount")}</span>
                          <span className="text-xl font-black text-slate-900">
                            ₹ {calculateRowNetAmount(rows[editingRowIndex]).toFixed(2)}
                          </span>
                       </div>
                    </div>
                  </div>
                  )}
                </section>

                {/* Additional Details */}
                <section className="bg-white border-y border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <header 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                    onClick={() => setExpandedRowSection(expandedRowSection === 'tracking' ? null : 'tracking')}
                  >
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center m-0 dark:text-gray-100">
                      <ClipboardList size={16} className="mr-2 text-purple-500"/> {t("Tracking & Details")}
                    </h4>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedRowSection === 'tracking' ? 'rotate-180' : ''}`} />
                  </header>
                  {expandedRowSection === 'tracking' && (
                  <div className="form-grid gap-6 p-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="form-field-wrapper">
<label className="form-label">{t("Batch / Lot Number")}</label>
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
<label className="form-label">{t("Manufacturing Date")}</label>
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
<label className="form-label">{t("Expiry Date")}</label>
                      <input 
                        type="date" 
                        value={rows[editingRowIndex]?.expiryDate || ''} 
                        onChange={(e) => {
                          const r = [...rows];
                          r[editingRowIndex].expiryDate = e.target.value;
                          setRows(r);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus-within:bg-gray-700"
                      />
                    </div>
                  </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
            
            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative dark:border-gray-800 dark:bg-gray-800">
              <button 
                onClick={() => setEditingRowIndex(null)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-200"
              >
                {t("Cancel")}
              </button>
              <button 
                onClick={() => setEditingRowIndex(null)}
                className="px-8 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
              >
                {t("Update Details")}
              </button>
            </div>
          </div>
  );
};
