import React, { useState } from 'react';
import { X, Package, Save } from 'lucide-react';
import { ItemMaster } from '../../app/types';


interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ItemMaster>) => void;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<ItemMaster>>({
    name: '',
    hsnCode: '',
    taxRate: 18,
    uom: 'PCS',
    purchaseRate: 0,
    salesRate: 0,
    category: '',
    minStock: 0,
    sku: '',
  });

  if (!isOpen) return null;  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-black text-gray-800 tracking-tight flex items-center dark:text-gray-100">
              <Package className="mr-2 text-purple-600" size={20} />
              Create New Item Master
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1 dark:text-gray-400">Add a new item to your inventory catalog.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 h-full bg-white dark:bg-gray-800">
          <div className="form-grid gap-6">
            <div className="form-field-wrapper col-span-1 md:col-span-2">
              <label className="form-label">Item Name / Description <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.name || ''} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="form-field-wrapper">
<label className="form-label">SKU / Code</label>
              <input 
                type="text" 
                value={formData.sku || ''} 
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                placeholder="Product code"
              />
            </div>

            <div className="form-field-wrapper">
<label className="form-label">UOM (Unit of Measure)</label>
              <select 
                value={formData.uom || 'PCS'} 
                onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
              >
                <option value="PCS">Pieces (PCS)</option>
                <option value="KG">Kilograms (KG)</option>
                <option value="MTR">Meters (MTR)</option>
                <option value="LTR">Liters (LTR)</option>
                <option value="BOX">Box</option>
                <option value="NOS">Numbers (NOS)</option>
              </select>
            </div>

            <div className="form-field-wrapper">
<label className="form-label">HSN / SAC Code</label>
              <input 
                type="text" 
                value={formData.hsnCode || ''} 
                onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                placeholder="e.g. 1234"
              />
            </div>

            <div className="form-field-wrapper">
<label className="form-label">Tax Rate (%)</label>
              <select 
                value={formData.taxRate || 0} 
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
            </div>

            <div className="form-field-wrapper">
<label className="form-label">Purchase Rate (₹)</label>
              <input 
                type="number" 
                value={formData.purchaseRate || ''} 
                onChange={(e) => setFormData({ ...formData, purchaseRate: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                placeholder="0.00"
              />
            </div>

            <div className="form-field-wrapper">
<label className="form-label">Sales Rate (₹)</label>
              <input 
                type="number" 
                value={formData.salesRate || ''} 
                onChange={(e) => setFormData({ ...formData, salesRate: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                placeholder="0.00"
              />
            </div>
            
            <div className="form-field-wrapper">
<label className="form-label">Category</label>
              <input 
                type="text" 
                value={formData.category || ''} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                placeholder="e.g. Electronics"
              />
            </div>

            <div className="form-field-wrapper">
<label className="form-label">Minimum Stock</label>
              <input 
                type="number" 
                value={formData.minStock || ''} 
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-3xl dark:border-gray-800">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              if (formData.name) {
                onSave({
                  ...formData,
                  id: Date.now().toString(),
                });
                onClose();
              }
            }}
            disabled={!formData.name}
            className="flex items-center px-8 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} className="mr-2" /> Save Item
          </button>
        </div>
      </div>
    </div>
  );
};
