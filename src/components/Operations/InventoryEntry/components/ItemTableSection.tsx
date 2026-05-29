import { useLanguage } from '../../../../context/LanguageContext';
import React from 'react';
import { ClipboardList, ScanBarcode, Import, Plus, Settings2, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';

interface ItemTableSectionProps {
  activeTab: string;
  collapsedSections: any;
  toggleSection: (section: string) => void;
  rows: any[];
  setRows: React.Dispatch<React.SetStateAction<any[]>>;
  itemMasters: any[];
  handleItemOrSkuChange: (index: number, value: string, field: 'itemName' | 'sku') => void;
  setEditingRowIndex: (idx: number) => void;
  setScanningRowIndex: (idx: number) => void;
  setShowScanner: (val: boolean) => void;
  setShowNewItemModal: (val: boolean) => void;
  warehouseMasters?: any[];
  setExpandedRowSection?: any;
  showRequirements?: any;
}

export const ItemTableSection: React.FC<ItemTableSectionProps> = ({
  activeTab,
  collapsedSections,
  toggleSection,
  rows,
  setRows,
  itemMasters,
  handleItemOrSkuChange,
  setEditingRowIndex,
  setScanningRowIndex,
  setShowScanner,
  setShowNewItemModal
}) => {
  const { t, formatNumber  } = useLanguage();

  return (
    <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[30] ${collapsedSections.lineItems ? 'rounded-xl' : 'rounded-2xl'} dark:bg-gray-800`}>

      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-[inherit]"></div>
      <div className={`border-b border-gray-100 flex justify-between items-center bg-gray-50/50 cursor-pointer ${collapsedSections.lineItems ? 'px-4 py-3' : 'px-6 py-5'} dark:border-gray-800`} onClick={() => toggleSection('lineItems')}>
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
           <ClipboardList size={16} className="mr-2 text-purple-500"/> {t("Item Details")}
         </h3>
         <div className="flex gap-2 items-center">
           <button onClick={(e) => { e.stopPropagation(); setScanningRowIndex(-1); setShowScanner(true); }} className="flex items-center px-3 md:px-3 py-2 md:py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700" title={t("Scan")}>
             <ScanBarcode size={16} /> 
           </button>
           <button onClick={(e) => {
             e.stopPropagation();
             setShowNewItemModal(true);
           }} className="flex items-center px-4 md:px-3 py-2 md:py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors" title={t("New Item")}>
             <Settings2 size={16} className="md:mr-1" /> <span className="hidden md:inline">{t("New Item")}</span>
           </button>
           <button onClick={(e) => { e.stopPropagation(); setRows([...rows, { id: Date.now() }]); }} className="flex items-center px-4 md:px-3 py-2 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-purple-200 transition-colors" title={t("Add Item")}>
             <Plus size={16} className="md:mr-1" /> <span className="hidden md:inline">{t("Add Item")}</span>
           </button>
           <button className="text-gray-400 hover:text-gray-600 transition-colors pl-2">
             <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.lineItems ? 'rotate-180' : ''}`} />
           </button>
         </div>
      </div>
      
      {!collapsedSections.lineItems && (
      <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-300">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50/80 border-b border-gray-100 uppercase text-[10px] tracking-[0.2em] font-black text-gray-400 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 w-12 text-center">#</th>
              <th className="px-6 py-4 min-w-[300px]">{t("Item Description")}</th>
              <th className="px-6 py-4 min-w-[150px]">{t("SKU")}</th>
              <th className="px-6 py-4 min-w-[120px] hidden md:table-cell">{t("Batch/Lot")}</th>
              {activeTab === 'physical_stock' ? (
                <>
                  <th className="px-6 py-4 text-right min-w-[120px]">{t("Book Qty")}</th>
                  <th className="px-6 py-4 text-right min-w-[120px]">{t("Physical Qty")}</th>
                </>
              ) : (
                <th className="px-6 py-4 text-right min-w-[120px]">{t("Quantity")}</th>
              )}
              <th className="px-6 py-4 min-w-[100px]">{t("Unit")}</th>
              {activeTab !== 'physical_stock' && <th className="px-6 py-4 text-right min-w-[120px]">{t("Rate/Value (₹)")}</th>}
              <th className="px-6 py-4 w-24 text-center">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row, index) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-purple-50/30 transition-colors group">
                  <td className="px-6 py-4 text-center text-xs font-bold text-gray-400 items-center justify-center">
                    <span>{index + 1}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-purple-500 transition-colors shrink-0" title="Scan Barcode" onClick={(e) => { e.stopPropagation(); setScanningRowIndex(index); setShowScanner(true); }}>
                        <ScanBarcode size={18} />
                      </button>
                      <div className="flex-1">
                        <SearchableDropdown
                          options={itemMasters}
                          value={row.itemName || ''}
                          onChange={(value) => handleItemOrSkuChange(index, value, 'itemName')}
                          placeholder={t("Select or type item...")}
                          buttonClassName="w-full min-w-[300px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all text-left dark:focus-within:bg-gray-700"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-left">
                    <SearchableDropdown
                      options={itemMasters.filter(i => i.sku)}
                      value={row.sku || ''}
                      onChange={(value) => handleItemOrSkuChange(index, value, 'sku')}
                      placeholder={t("SKU...")}
                      labelKey="sku"
                      buttonClassName="w-full px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-700 text-left dark:focus:bg-gray-700 dark:text-gray-200"
                    />
                  </td>
                  <td className="px-6 py-3 hidden md:table-cell">
                    <input type="text" placeholder={t("B-")} value={row.batch || ''} onChange={(e) => { const r = [...rows]; r[index].batch = e.target.value; setRows(r); }} className="w-full min-w-[100px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:font-normal placeholder:opacity-50 text-gray-500 dark:focus:bg-gray-700 dark:text-gray-400" />
                  </td>
                  
                  {activeTab === 'physical_stock' ? (
                    <>
                      <td className="px-6 py-3">
                        <input type="number" placeholder={t("0")} className="w-full min-w-[80px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all opacity-70 dark:focus:bg-gray-700" readOnly />
                      </td>
                      <td className="px-6 py-3">
                        <input type="number" placeholder={t("0")} value={row.qty || ''} onChange={(e) => { const r = [...rows]; r[index].qty = e.target.value; setRows(r); }} className="w-full min-w-[80px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-bold text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:focus:bg-gray-700" />
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-3">
                      <input type="number" placeholder={t("0")} value={row.qty || ''} onChange={(e) => { const r = [...rows]; r[index].qty = e.target.value; setRows(r); }} className="w-full min-w-[80px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-bold text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:focus:bg-gray-700" />
                    </td>
                  )}
                  
                  <td className="px-6 py-3">
                    <select value={row.unit || 'PCS'} onChange={(e) => { const r = [...rows]; r[index].unit = e.target.value; setRows(r); }} className="w-full min-w-[80px] px-2 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none cursor-pointer dark:focus:bg-gray-700">
                      <option>{t("PCS")}</option>
                      <option>{t("KG")}</option>
                      <option>{t("BOX")}</option>
                      <option>{t("MTR")}</option>
                    </select>
                  </td>
                  
                  {activeTab !== 'physical_stock' && (
                    <td className="px-6 py-3">
                      <input type="number" placeholder={t("0.00")} value={row.rate || ''} onChange={(e) => { const r = [...rows]; r[index].rate = e.target.value; setRows(r); }} className="w-full min-w-[100px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:font-normal placeholder:opacity-50 dark:focus:bg-gray-700" />
                    </td>
                  )}

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => setEditingRowIndex(index)} className="flex items-center justify-center w-8 h-8 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all border border-purple-100" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setRows(rows.filter(r => r.id !== row.id))} className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all border border-red-100" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};
