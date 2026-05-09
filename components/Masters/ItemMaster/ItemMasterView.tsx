
import React, { useState, useMemo, useEffect } from 'react';
import { 
    AddIcon, 
    EditIcon, 
    DeleteIcon, 
    SearchIcon, 
    CancelIcon,
    InventoryIcon,
    UomIcon,
    FilterListIcon,
    TrendingUpIcon,
    TaxIcon,
    WarningIcon,
    BrandIcon,
    CategoryIcon
} from '../../icons/IconComponents';
import { 
    ItemMaster, 
    UomMaster, 
    GstMaster, 
    BrandMaster, 
    CategoryMaster,
    WarehouseMaster,
    StockGroupMaster
} from '../../../types';

interface ItemMasterViewProps {
  initialTab?: string;
  itemMasters: ItemMaster[];
  uomMasters: UomMaster[];
  gstMasters: GstMaster[];
  brandMasters: BrandMaster[];
  categoryMasters: CategoryMaster[];
  gradeMasters: any[];
  assertionCategoryMasters: any[];
  assertionCodeMasters: any[];
  skuMasters: any[];
  priceListMasters: any[];
  weightMasters: any[];
  volumeMasters: any[];
  colorMasters: any[];
  sizeMasters: any[];
  variantMasters: any[];
  dimensionMasters: any[];
  warehouseMasters: WarehouseMaster[];
  stockGroupMasters: StockGroupMaster[];
  setItemMasters: (masters: ItemMaster[]) => void;
  setUomMasters: (masters: UomMaster[]) => void;
  setGstMasters: (masters: GstMaster[]) => void;
  setBrandMasters: (masters: BrandMaster[]) => void;
  setCategoryMasters: (masters: CategoryMaster[]) => void;
  setGradeMasters: (masters: any[]) => void;
  setAssertionCategoryMasters: (masters: any[]) => void;
  setAssertionCodeMasters: (masters: any[]) => void;
  setSkuMasters: (masters: any[]) => void;
  setPriceListMasters: (masters: any[]) => void;
  setWeightMasters: (masters: any[]) => void;
  setVolumeMasters: (masters: any[]) => void;
  setColorMasters: (masters: any[]) => void;
  setSizeMasters: (masters: any[]) => void;
  setVariantMasters: (masters: any[]) => void;
  setDimensionMasters: (masters: any[]) => void;
  setWarehouseMasters: (masters: WarehouseMaster[]) => void;
  setStockGroupMasters: (masters: StockGroupMaster[]) => void;
}

export const ItemMasterView: React.FC<ItemMasterViewProps> = (props) => {
    const { 
        itemMasters, uomMasters, gstMasters, brandMasters, categoryMasters, gradeMasters, 
        assertionCategoryMasters, assertionCodeMasters, skuMasters, priceListMasters, 
        weightMasters, volumeMasters, colorMasters, sizeMasters, variantMasters, 
        dimensionMasters, warehouseMasters, stockGroupMasters,
        setItemMasters, setUomMasters, setGstMasters, setBrandMasters, setCategoryMasters,
        setGradeMasters, setAssertionCategoryMasters, setAssertionCodeMasters, setSkuMasters,
        setPriceListMasters, setWeightMasters, setVolumeMasters, setColorMasters,
        setSizeMasters, setVariantMasters, setDimensionMasters, setWarehouseMasters, setStockGroupMasters,
        initialTab
    } = props;

    const [activeTab, setActiveTab] = useState<string>(initialTab || 'items');
    
    useEffect(() => {
        if (initialTab && initialTab !== activeTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    useEffect(() => {
        const scrollToTab = () => {
            const el = document.getElementById(`item-master-tab-${activeTab}`);
            const container = el?.closest('.overflow-x-auto') as HTMLElement;
            if (el && container) {
                const cRect = container.getBoundingClientRect();
                const eRect = el.getBoundingClientRect();
                if (cRect.width === 0 || eRect.width === 0) return;
                
                const offset = (eRect.left + eRect.width / 2) - (cRect.left + cRect.width / 2);
                
                if (Math.abs(offset) > 2) {
                    container.scrollBy({ left: offset, behavior: 'smooth' });
                }
            }
        };

        scrollToTab();
        const t1 = setTimeout(scrollToTab, 100);
        const t2 = setTimeout(scrollToTab, 300);
        const t3 = setTimeout(scrollToTab, 500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [activeTab]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

    const filteredMasters = useMemo(() => {
        let list: any[] = [];
        if (activeTab === 'items') list = itemMasters || [];
        else if (activeTab === 'uoms') list = uomMasters || [];
        else if (activeTab === 'gst') list = gstMasters || [];
        else if (activeTab === 'brands') list = brandMasters || [];
        else if (activeTab === 'categories') list = categoryMasters || [];
        else if (activeTab === 'warehouse') list = warehouseMasters || [];
        else if (activeTab === 'color') list = colorMasters || [];
        else if (activeTab === 'size') list = sizeMasters || [];
        else if (activeTab === 'stockGroup') list = stockGroupMasters || [];
        else if (activeTab === 'grades') list = gradeMasters || [];
        else if (activeTab === 'assertionCategories') list = assertionCategoryMasters || [];
        else if (activeTab === 'assertionCodes') list = assertionCodeMasters || [];
        else if (activeTab === 'sku') list = skuMasters || [];
        else if (activeTab === 'priceList') list = priceListMasters || [];
        else if (activeTab === 'weight') list = weightMasters || [];
        else if (activeTab === 'volume') list = volumeMasters || [];
        else if (activeTab === 'variant') list = variantMasters || [];
        else if (activeTab === 'dimension') list = dimensionMasters || [];

        return list.filter(m => 
            String(m.name || m.code || m.id || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeTab, itemMasters, uomMasters, gstMasters, brandMasters, categoryMasters, warehouseMasters, stockGroupMasters, colorMasters, sizeMasters, gradeMasters, assertionCategoryMasters, assertionCodeMasters, skuMasters, priceListMasters, weightMasters, volumeMasters, variantMasters, dimensionMasters, searchTerm]);

    const handleSave = () => {
        if (!formData.name?.trim() && !formData.code?.trim()) return;
        const updateList = (prev: any[], prefix: string, setter: (list: any[]) => void) => {
            const newList = editingId 
                ? prev.map(m => m.id === editingId ? { ...formData } : m)
                : [...prev, { ...formData, id: `${prefix}-${Date.now()}` }];
            setter(newList);
        };

        if (activeTab === 'items') updateList(itemMasters, 'i', setItemMasters);
        else if (activeTab === 'uoms') updateList(uomMasters, 'u', setUomMasters);
        else if (activeTab === 'gst') updateList(gstMasters, 'g', setGstMasters);
        else if (activeTab === 'brands') updateList(brandMasters, 'b', setBrandMasters);
        else if (activeTab === 'categories') updateList(categoryMasters, 'cat', setCategoryMasters);
        else if (activeTab === 'warehouse') updateList(warehouseMasters, 'w', setWarehouseMasters);
        else if (activeTab === 'color') updateList(colorMasters, 'col', setColorMasters);
        else if (activeTab === 'size') updateList(sizeMasters, 'sz', setSizeMasters);
        else if (activeTab === 'stockGroup') updateList(stockGroupMasters, 'sg', setStockGroupMasters);
        else if (activeTab === 'grades') updateList(gradeMasters, 'gr', setGradeMasters);
        else if (activeTab === 'assertionCategories') updateList(assertionCategoryMasters, 'ac', setAssertionCategoryMasters);
        else if (activeTab === 'assertionCodes') updateList(assertionCodeMasters, 'aco', setAssertionCodeMasters);
        else if (activeTab === 'sku') updateList(skuMasters, 'sku', setSkuMasters);
        else if (activeTab === 'priceList') updateList(priceListMasters, 'pl', setPriceListMasters);
        else if (activeTab === 'weight') updateList(weightMasters, 'wt', setWeightMasters);
        else if (activeTab === 'volume') updateList(volumeMasters, 'vol', setVolumeMasters);
        else if (activeTab === 'variant') updateList(variantMasters, 'v', setVariantMasters);
        else if (activeTab === 'dimension') updateList(dimensionMasters, 'dim', setDimensionMasters);

        setIsModalOpen(false);
        setEditingId(null);
        setFormData({});
    };

    const confirmDelete = () => {
        if (!deleteConfirmation) return;
        const { id } = deleteConfirmation;
        const filterFn = (prev: any[]) => prev.filter(m => m.id !== id);

        if (activeTab === 'items') setItemMasters(filterFn(itemMasters));
        else if (activeTab === 'uoms') setUomMasters(filterFn(uomMasters));
        else if (activeTab === 'gst') setGstMasters(filterFn(gstMasters));
        else if (activeTab === 'brands') setBrandMasters(filterFn(brandMasters));
        else if (activeTab === 'categories') setCategoryMasters(filterFn(categoryMasters));
        else if (activeTab === 'warehouse') setWarehouseMasters(filterFn(warehouseMasters));
        else if (activeTab === 'color') setColorMasters(filterFn(colorMasters));
        else if (activeTab === 'size') setSizeMasters(filterFn(sizeMasters));
        else if (activeTab === 'stockGroup') setStockGroupMasters(filterFn(stockGroupMasters));
        else if (activeTab === 'grades') setGradeMasters(filterFn(gradeMasters));
        else if (activeTab === 'assertionCategories') setAssertionCategoryMasters(filterFn(assertionCategoryMasters));
        else if (activeTab === 'assertionCodes') setAssertionCodeMasters(filterFn(assertionCodeMasters));
        else if (activeTab === 'sku') setSkuMasters(filterFn(skuMasters));
        else if (activeTab === 'priceList') setPriceListMasters(filterFn(priceListMasters));
        else if (activeTab === 'weight') setWeightMasters(filterFn(weightMasters));
        else if (activeTab === 'volume') setVolumeMasters(filterFn(volumeMasters));
        else if (activeTab === 'variant') setVariantMasters(filterFn(variantMasters));
        else if (activeTab === 'dimension') setDimensionMasters(filterFn(dimensionMasters));
        
        setDeleteConfirmation(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto scrollbar-none justify-between items-center pr-4">
                    <div className="flex">
                        {[
                            { id: 'items', label: 'Items', icon: InventoryIcon },
                            { id: 'warehouse', label: 'Warehouses', icon: CategoryIcon },
                            { id: 'uoms', label: 'UOMs', icon: UomIcon },
                            { id: 'stockGroup', label: 'Stock Groups', icon: CategoryIcon },
                            { id: 'gst', label: 'HSN', icon: TaxIcon },
                            { id: 'brands', label: 'Brands', icon: BrandIcon },
                            { id: 'categories', label: 'Categories', icon: CategoryIcon },
                            { id: 'color', label: 'Colors', icon: CategoryIcon },
                            { id: 'size', label: 'Sizes', icon: FilterListIcon },
                            { id: 'variant', label: 'Variants', icon: FilterListIcon },
                            { id: 'dimension', label: 'Dimensions', icon: FilterListIcon },
                            { id: 'sku', label: 'SKUs', icon: FilterListIcon },
                            { id: 'priceList', label: 'Price List', icon: TrendingUpIcon },
                            { id: 'weight', label: 'Weights', icon: FilterListIcon },
                            { id: 'volume', label: 'Volumes', icon: FilterListIcon },
                            { id: 'grades', label: 'Grades', icon: FilterListIcon },
                        ].map(tab => (
                            <button key={tab.id} id={`item-master-tab-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`px-6 py-4 text-sm font-bold relative transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { setEditingId(null); setFormData({name:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center text-xs shadow-md whitespace-nowrap active:scale-95 transition-all">
                        <AddIcon className="mr-2" /> Add {activeTab}
                    </button>
                </div>

                <div className="p-4 bg-gray-50/30 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative max-w-md">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm dark:border-gray-700" />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {filteredMasters.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                    {activeTab === 'items' && (
                                        <>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Classification</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Inventory</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tax & Valuation</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</th>
                                        </>
                                    )}
                                    {activeTab === 'uoms' && <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Symbol</th>}
                                    {activeTab === 'gst' && <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Rate</th>}
                                    {activeTab === 'gst' && <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</th>}
                                    {activeTab !== 'items' && <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>}
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                                {filteredMasters.map(m => (
                                    <tr key={m.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                    {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                    {activeTab === 'items' && m.sku && <div className="text-[11px] text-gray-500 font-mono mt-0.5 dark:text-gray-400">SKU: {m.sku}</div>}
                                                    {activeTab === 'items' && m.hsnCode && <div className="text-[11px] text-gray-500 font-mono dark:text-gray-400">HSN: {m.hsnCode}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        {activeTab === 'items' && (
                                            <>
                                                <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                                    {m.category && <span className="inline-block px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-600 mb-1 dark:bg-gray-800 dark:text-gray-300">{m.category}</span>}
                                                    {m.brand && <div className="text-xs text-gray-500 dark:text-gray-400">{m.brand}</div>}
                                                </td>
                                                <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                                    {m.uom && <div>UOM: <span className="font-mono">{m.uom}</span></div>}
                                                    {m.stockGroup && <div className="text-xs text-gray-500 dark:text-gray-400">{m.stockGroup}</div>}
                                                </td>
                                                <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                                    {m.taxRate ? <span className="px-2 py-1 bg-amber-50 text-amber-700 ring-1 ring-amber-100 rounded text-xs font-bold">{m.taxRate}% GST</span> : '-'}
                                                </td>
                                                <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                                    <div className="font-mono font-medium text-gray-900 dark:text-white">{m.salesRate ? `₹${m.salesRate.toFixed(2)}` : '-'}</div>
                                                    {m.purchaseRate ? <div className="text-[11px] text-gray-500 font-mono mt-0.5 dark:text-gray-400">Cost: ₹{m.purchaseRate.toFixed(2)}</div> : null}
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'uoms' && <td className="p-4 text-sm text-gray-700 dark:text-gray-200"><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs dark:bg-gray-800">{m.symbol || '-'}</span></td>}
                                        {activeTab === 'gst' && <td className="p-4 text-sm text-gray-700 dark:text-gray-200"><span className="font-mono bg-amber-50 text-amber-700 ring-1 ring-amber-100 px-2 py-1 rounded text-xs font-bold">{m.rate ? `${m.rate}%` : '-'}</span></td>}
                                        {activeTab === 'gst' && <td className="p-4 text-xs text-gray-700 uppercase tracking-widest dark:text-gray-200">{m.type || '-'}</td>}
                                        {activeTab !== 'items' && <td className="p-4 text-xs text-gray-500 dark:text-gray-400">{m.description || '-'}</td>}
                                        <td className="p-4">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95" title="Edit"><EditIcon className="w-4 h-4" /></button>
                                                <button onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name||m.code})} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95" title="Delete"><DeleteIcon className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
                                <SearchIcon className="text-gray-300 text-3xl" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">No {activeTab} found matching your search</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[1.25rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh] dark:bg-gray-800">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
                            <h2 className="font-bold text-xl text-gray-900 font-display flex items-center dark:text-white">
                                {editingId ? 'Edit' : 'Add'} {activeTab.slice(0, activeTab.endsWith('s') ? -1 : undefined)}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full active:scale-95 dark:hover:bg-gray-600">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Name / Code *</label>
                                    <input type="text" value={formData.name || formData.code || ''} onChange={e => setFormData({...formData, name: e.target.value, code: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Enter name or code..." autoFocus />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Description / Notes</label>
                                    <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Add any extra details..." />
                                </div>
                                
                                {activeTab === 'items' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">SKU</label>
                                            <input type="text" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Enter SKU..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Unit of Measure (UOM)</label>
                                            <select value={formData.uom || ''} onChange={e => setFormData({...formData, uom: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <option value="">Select UOM...</option>
                                                {uomMasters.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Tax Rate (%)</label>
                                            <input type="number" value={formData.taxRate || 0} onChange={e => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">HSN Code</label>
                                            <input type="text" value={formData.hsnCode || ''} onChange={e => setFormData({...formData, hsnCode: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Enter HSN..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Category</label>
                                            <select value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <option value="">Select Category...</option>
                                                {categoryMasters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Brand</label>
                                            <select value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <option value="">Select Brand...</option>
                                                {brandMasters.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Purchase Rate</label>
                                            <input type="number" value={formData.purchaseRate || ''} onChange={e => setFormData({...formData, purchaseRate: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="0.00" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Sales Rate</label>
                                            <input type="number" value={formData.salesRate || ''} onChange={e => setFormData({...formData, salesRate: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="0.00" />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'uoms' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Symbol</label>
                                        <input type="text" value={formData.symbol || ''} onChange={e => setFormData({...formData, symbol: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="e.g. KG, PCS..." />
                                    </div>
                                )}

                                {activeTab === 'gst' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Rate (%)</label>
                                            <input type="number" value={formData.rate || 0} onChange={e => setFormData({...formData, rate: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Type</label>
                                            <select value={formData.type || 'Goods'} onChange={e => setFormData({...formData, type: e.target.value as 'Goods'|'Services'})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <option value="Goods">Goods</option>
                                                <option value="Services">Services</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800">
                             <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">Cancel</button>
                             <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 text-sm">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 dark:bg-gray-800">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <DeleteIcon className="text-3xl" />
                        </div>
                        <h2 className="font-bold text-xl mb-2 font-display text-gray-900 dark:text-white">Delete {activeTab.slice(0, activeTab.endsWith('s') ? -1 : undefined)}?</h2>
                        <p className="text-gray-500 mb-6 text-sm dark:text-gray-400">Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{deleteConfirmation.name}"</span>? This action cannot be undone.</p>
                        <div className="flex space-x-3">
                             <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">Cancel</button>
                             <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 active:scale-95 text-sm">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
