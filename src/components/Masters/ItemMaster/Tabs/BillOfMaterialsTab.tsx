import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState } from 'react';
import { useFormSettings } from "../../../../app/useFormSettings";

import { createPortal } from 'react-dom';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CancelIcon, InfoIcon, UndoIcon, SaveIcon } from '../../../icons/IconComponents';
import { ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BomMaster, ItemMaster } from '../../../../app/types';

interface BillOfMaterialsTabProps {
    data: BomMaster[];
    onSave: (boms: BomMaster[]) => void;
    itemMasters: ItemMaster[];
}

export const BillOfMaterialsTab: React.FC<BillOfMaterialsTabProps> = ({ data, onSave, itemMasters }) => {
  const { t, formatNumber  } = useLanguage();

  const formSettings = useFormSettings();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<BomMaster>>({});
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    const filteredData = (data || []).filter(m => 
        String(m.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        if (editingId) {
            const original = data.find(m => m.id === editingId);
            setFormData(original ? { ...original } : {});
        } else {
            setFormData({
                name: '',
                isActive: true,
                components: [],
                routing: [],
                byProducts: [],
                quantityProduced: 1,
                revision: '1.0'
            });
        }
    };

    const handleSave = () => {
        if (!formData.name?.trim() || !formData.itemId) return;
        const newBom: BomMaster = {
            id: editingId || `bom-${Date.now()}`,
            name: formData.name,
            code: formData.code,
            itemId: formData.itemId,
            quantityProduced: formData.quantityProduced || 1,
            components: formData.components || [],
            routing: formData.routing || [],
            description: formData.description || '',
            status: formData.status || 'Active',
            revision: formData.revision || '1.0',
            type: formData.type || 'Manufacturing',
            validFrom: formData.validFrom,
            validTo: formData.validTo,
            isDefault: formData.isDefault || false,
            byProducts: formData.byProducts || []
        };

        const newList = editingId 
            ? data.map(m => m.id === editingId ? newBom : m)
            : [...data, newBom];
        
        onSave(newList);
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({});
    };

    const confirmDelete = () => {
        if (!deleteConfirmation) return;
        onSave(data.filter(m => m.id !== deleteConfirmation.id));
        setDeleteConfirmation(null);
    };

    const addComponent = () => {
        setFormData({
            ...formData,
            components: [...(formData.components || []), { itemId: '', quantity: 1, uom: '', scrapPercentage: 0, instructions: '' }]
        });
    };

    const updateComponent = (index: number, field: string, value: any) => {
        const newComponents = [...(formData.components || [])];
        newComponents[index] = { ...newComponents[index], [field]: value };
        
        // Auto-fill UOM if item changes
        if (field === 'itemId') {
            const selectedItem = itemMasters.find(i => i.id === value);
            if (selectedItem) {
                newComponents[index].uom = selectedItem.uom;
            }
        }
        
        setFormData({ ...formData, components: newComponents });
    };

    const removeComponent = (index: number) => {
        const newComponents = [...(formData.components || [])];
        newComponents.splice(index, 1);
        setFormData({ ...formData, components: newComponents });
    };

    const addRoutingStep = () => {
        const currentRouting = formData.routing || [];
        setFormData({
            ...formData,
            routing: [...currentRouting, { 
                step: currentRouting.length + 1, 
                operation: '', 
                laborCostPerHour: 0, 
                overheadCostPerHour: 0, 
                runTime: 0, 
                setupTime: 0 
            }]
        });
    };

    const updateRoutingStep = (index: number, field: string, value: any) => {
        const newRouting = [...(formData.routing || [])];
        newRouting[index] = { ...newRouting[index], [field]: value };
        setFormData({ ...formData, routing: newRouting });
    };

    const removeRoutingStep = (index: number) => {
        const newRouting = [...(formData.routing || [])];
        newRouting.splice(index, 1);
        // Correct step numbers
        const normalizedRouting = newRouting.map((r, i) => ({ ...r, step: i + 1 }));
        setFormData({ ...formData, routing: normalizedRouting });
    };
    
    const addByProduct = () => {
        setFormData({
            ...formData,
            byProducts: [...(formData.byProducts || []), { itemId: '', quantity: 0, uom: '' }]
        });
    };

    const updateByProduct = (index: number, field: string, value: any) => {
        const newByProducts = [...(formData.byProducts || [])];
        newByProducts[index] = { ...newByProducts[index], [field]: value };
        if (field === 'itemId') {
            const selectedItem = itemMasters.find(i => i.id === value);
            if (selectedItem) newByProducts[index].uom = selectedItem.uom;
        }
        setFormData({ ...formData, byProducts: newByProducts });
    };

    const removeByProduct = (index: number) => {
        const newByProducts = [...(formData.byProducts || [])];
        newByProducts.splice(index, 1);
        setFormData({ ...formData, byProducts: newByProducts });
    };

    const calculateTotalCost = () => {
        let materialCost = 0;
        let laborCost = 0;
        let overheadCost = 0;

        formData.components?.forEach(comp => {
            const item = itemMasters.find(i => i.id === comp.itemId);
            if (item?.purchaseRate) {
                materialCost += item.purchaseRate * comp.quantity * (1 + (comp.scrapPercentage || 0) / 100);
            }
        });

        formData.routing?.forEach(op => {
            const batchQty = formData.quantityProduced || 1;
            laborCost += (op.setupTime || 0) * (op.laborCostPerHour || 0);
            laborCost += ((op.runTime || 0) * batchQty) * (op.laborCostPerHour || 0);
            
            overheadCost += (op.setupTime || 0) * (op.overheadCostPerHour || 0);
            overheadCost += ((op.runTime || 0) * batchQty) * (op.overheadCostPerHour || 0);
        });

        return {
            material: materialCost,
            labor: laborCost,
            overhead: overheadCost,
            total: materialCost + laborCost + overheadCost,
            perUnit: (materialCost + laborCost + overheadCost) / (formData.quantityProduced || 1)
        };
    };

    const getItemName = (id: string) => itemMasters.find(i => i.id === id)?.name || id;

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center dark:bg-gray-800/30 dark:border-gray-800">
                <div className="relative max-w-md w-full mr-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder={t("Search BOMs...")} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-10 pr-4 text-sm" />
                </div>
                <div className="flex items-center">
                    <ImportExportButtons data={data} onSave={onSave} entityName="BillOfMaterialsTab" />
                    <button onClick={() => { setEditingId(null); setFormData({name: '', isActive: true, components: []}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all">
                    <AddIcon className="lg:mr-2" /> <span className="hidden lg:inline-block">{t("Create BOM")}</span></button>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                {filteredData.length > 0 ? (
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("BOM Name")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Description")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Product")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Output")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Components")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Routing")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Status")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">{t("Actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                            {filteredData.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm dark:text-white">{m.name}</td>
                                    <td className="p-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{m.description}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-medium">{getItemName(m.itemId)}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.quantityProduced} {t("units")}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200"><span className="bg-gray-100 inline-block px-2 py-1 rounded font-mono text-[10px] font-bold dark:bg-gray-900">{m.components?.length || 0}</span></td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.routing && m.routing.length > 0 ? <span className="bg-purple-50 text-purple-700 inline-block px-2 py-1 rounded font-mono text-[10px] font-bold dark:bg-purple-900/30 dark:text-purple-400">{m.routing.length}</span> : null}</td>
                                                                <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                        {m.status === 'Active' ? 
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-bold ring-1 ring-green-100 uppercase">{t("Active")}</span> :
                                            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-[10px] font-bold ring-1 ring-gray-200 uppercase">{t("Inactive")}</span>
                                        }
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center justify-center space-x-2 w-full h-full m-auto">
                                            <button onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95" title={t("Edit")}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name})} className="flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95" title={t("Delete")}>
                                                <Trash2 size={16} />
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
                        <p className="text-gray-500 dark:text-gray-400">{t("No Bill of Materials found")}</p>
                    </div>
                )}
            </div>

            {isModalOpen && typeof document !== "undefined" && document.getElementById("main-content") ? createPortal(
   <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center ${formSettings.currentModalMode === 'fullscreen' ? 'p-0' : 'p-4 sm:p-6 md:p-8'}`}>
                    <div className={`bg-white w-full h-full overflow-hidden flex flex-col dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl animate-in zoom-in-95 ${formSettings.currentModalMode === 'fullscreen' ? 'rounded-none max-w-full max-h-full' : 'rounded-[1.5rem] max-w-5xl max-h-[95vh] m-2 sm:m-0'}`}>
                        {/* Header */}
                        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50/80 dark:bg-gray-800/50 dark:border-gray-800 shrink-0">
                            <div>
                                <h2 className="font-bold text-base sm:text-xl text-gray-900 flex items-center dark:text-white tracking-tight">
                                    {editingId ? t('Edit') : t('Create')} {t('Bill of Materials (BOM)')}
                                </h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-all p-1.5 sm:p-2 hover:bg-red-50 rounded-full dark:hover:bg-red-900/30">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-3 custom-scrollbar bg-white dark:bg-gray-900">
                            {/* Accordion 1: Identity & Lifecycle */}
                            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 'basic' ? null : 'basic')}
                                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                            <InfoIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{t("1. Identity & Lifecycle")}</h3>
                                        </div>
                                    </div>
                                    {activeAccordion === 'basic' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                
                                <AnimatePresence>
                                    {activeAccordion === 'basic' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="p-4 sm:p-6 pt-0 space-y-6 border-t border-gray-100 dark:border-gray-800">
                                                <div className="form-grid gap-4 sm:gap-6 pt-4">
                                                    <div className="space-y-1.5">
                                                        <label className="form-label ml-1">{t("BOM Code")}</label>
                                                        <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="form-input p-2.5 sm:p-3 font-mono text-sm" placeholder={t("e.g. BOM-001")} />
                                                    </div>
                                                    <div className="form-field-wrapper space-y-1.5 md:col-span-2">
                                                        <label className="form-label ml-1">{t("BOM Name *")}</label>
                                                        <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input p-2.5 sm:p-3 font-medium text-sm" placeholder={t("e.g. Standard PC Build")} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="form-label ml-1">{t("Revision / Version")}</label>
                                                        <input type="text" value={formData.revision || ''} onChange={e => setFormData({...formData, revision: e.target.value})} className="form-input p-2.5 sm:p-3 font-mono text-sm" placeholder={t("e.g. v1.2")} />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">{t("BOM Type")}</label>
                                                        <select value={formData.type || 'Manufacturing'} onChange={e => setFormData({...formData, type: e.target.value as any})} className="form-input p-2.5 sm:p-3 font-medium text-sm">
                                                            <option value="Manufacturing">{t("Manufacturing")}</option>
                                                            <option value="Engineering">{t("Engineering")}</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">{t("Finished Good *")}</label>
                                                        <select value={formData.itemId || ''} onChange={e => setFormData({...formData, itemId: e.target.value})} className="form-input p-2.5 sm:p-3 font-medium text-sm">
                                                            <option value="">{t("Select Item...")}</option>
                                                            {itemMasters.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">{t("Batch Qty")}</label>
                                                        <input type="number" value={formData.quantityProduced || 1} onChange={e => setFormData({...formData, quantityProduced: parseFloat(e.target.value) || 1})} className="form-input p-2.5 sm:p-3 font-mono text-sm" min={1} />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">{t("Valid From")}</label>
                                                        <input type="date" value={formData.validFrom || ''} onChange={e => setFormData({...formData, validFrom: e.target.value})} className="form-input p-2.5 sm:p-3 font-medium text-sm" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">{t("Valid Until")}</label>
                                                        <input type="date" value={formData.validTo || ''} onChange={e => setFormData({...formData, validTo: e.target.value})} className="form-input p-2.5 sm:p-3 font-medium text-sm" />
                                                    </div>
                                                    
                                                    <div className="flex flex-col space-y-3 justify-center">
                                                        <div className="space-y-1.5">
                                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">{t("Status")}</label>
                                                            <select value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value as any})} className="form-input p-2.5 sm:p-3 font-medium text-sm">
                                                                <option value="Active">{t("Active")}</option>
                                                                <option value="Inactive">{t("Inactive")}</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">{t("Default for Product")}</label>
                                                            <select value={formData.isDefault === true ? 'true' : 'false'} onChange={e => setFormData({...formData, isDefault: e.target.value === 'true'})} className="form-input p-2.5 sm:p-3 font-medium text-sm">
                                                                <option value="true">{t("Enable / Yes")}</option>
                                                                <option value="false">{t("Disable / No")}</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Accordion 2: Materials & Components */}
                            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 'materials' ? null : 'materials')}
                                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                            <div className="font-black text-[10px]">{t("RM")}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{t("2. Material and Component")}</h3>
                                        </div>
                                    </div>
                                    {activeAccordion === 'materials' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                
                                <AnimatePresence>
                                    {activeAccordion === 'materials' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="p-4 sm:p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex justify-between items-center py-4">
                                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("Main Component List")}</h3>
                                                    <button onClick={addComponent} className="flex items-center space-x-2 text-[10px] text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-lg dark:bg-blue-900/30 transition-all">
                                                        <span>{t("+ Add Material")}</span>
                                                    </button>
                                                </div>
                                                
                                                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                                                    <div className="hidden grid grid-cols-[2fr_1fr_80px_80px_1fr_50px] bg-gray-50 dark:bg-gray-800/80 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("Material")}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">{t("Qty")}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">{t("UOM")}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">{t("Scrp%")}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">{t("Gross")}</div>
                                                        <div></div>
                                                    </div>

                                                    <div className="divide-y divide-gray-50 dark:divide-gray-800 overflow-x-auto min-w-[600px] sm:min-w-0">
                                                        {formData.components?.length === 0 && (
                                                            <div className="text-center py-12">
                                                                <p className="text-gray-400 font-medium text-xs">{t("No materials added to this BOM")}</p>
                                                            </div>
                                                        )}
                                                        {formData.components?.map((comp, idx) => (
                                                            <div key={idx} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors grid grid-cols-[2fr_1fr_80px_80px_1fr_50px] items-center">
                                                                <div className="px-3 py-2">
                                                                    <select value={comp.itemId} onChange={e => updateComponent(idx, 'itemId', e.target.value)} className="form-input text-xs border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-transparent focus:ring-1 font-medium">
                                                                        <option value="">{t("Item...")}</option>
                                                                        {itemMasters.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                                                    </select>
                                                                </div>
                                                                
                                                                <div className="px-2 py-2">
                                                                    <input type="number" value={comp.quantity} onChange={e => updateComponent(idx, 'quantity', parseFloat(e.target.value))} className="form-input text-xs border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-transparent text-center font-mono focus:ring-1" />
                                                                </div>

                                                                <div className="px-2 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                                    {comp.uom || '-'}
                                                                </div>

                                                                <div className="px-2 py-2">
                                                                    <input type="number" value={comp.scrapPercentage || 0} onChange={e => updateComponent(idx, 'scrapPercentage', parseFloat(e.target.value))} className="form-input text-xs border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-transparent text-center font-mono focus:ring-1" />
                                                                </div>

                                                                <div className="px-2 py-2">
                                                                    <div className="w-full p-2 text-xs text-center font-mono text-gray-500 dark:text-gray-400 bg-transparent">
                                                                        {Number((comp.quantity * (1 + (comp.scrapPercentage || 0) / 100)).toFixed(3))}
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-center">
                                                                    <button onClick={() => removeComponent(idx)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all" title={t("Remove")}><DeleteIcon className="w-3 h-3" /></button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Accordion 3: Manufacturing Process */}
                            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 'process' ? null : 'process')}
                                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                            <div className="font-black text-[10px]">{t("M")}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{t("3. Manufacturing Process")}</h3>
                                        </div>
                                    </div>
                                    {activeAccordion === 'process' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                
                                <AnimatePresence>
                                    {activeAccordion === 'process' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="p-4 sm:p-6 pt-0 space-y-6 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex justify-between items-center py-4">
                                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("Routing Steps")}</h3>
                                                    <button onClick={addRoutingStep} className="flex items-center space-x-2 text-[10px] text-purple-600 hover:text-purple-700 font-bold bg-purple-50 px-3 py-1.5 rounded-lg dark:bg-purple-900/30 transition-all">
                                                        <span>{t("+ Add Step")}</span>
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    {formData.routing?.length === 0 && (
                                                        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 font-medium text-xs text-gray-400">{t("No operations defined yet.")}</div>
                                                    )}
                                                    {formData.routing?.map((op, idx) => (
                                                        <div key={idx} className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 relative shadow-sm">
                                                            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black shadow-lg">{op.step}</div>
                                                            <div className="form-grid gap-4">
                                                                <div className="space-y-1">
                                                                    <label className="block text-[9px] font-bold text-gray-400 uppercase ml-1">{t("Operation Name")}</label>
                                                                    <input type="text" value={op.operation} onChange={e => updateRoutingStep(idx, 'operation', e.target.value)} placeholder={t("e.g. Injection Molding")} className="w-full p-2 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-purple-500 outline-none transition-all dark:text-white font-bold text-sm" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="block text-[9px] font-bold text-gray-400 uppercase ml-1">{t("Work Center / Machine")}</label>
                                                                    <input type="text" value={op.workCenter || ''} onChange={e => updateRoutingStep(idx, 'workCenter', e.target.value)} placeholder={t("e.g. Press #4")} className="w-full p-2 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-purple-500 outline-none transition-all dark:text-white font-bold text-sm" />
                                                                </div>
                                                                <div className="form-field-wrapper form-grid gap-3 md:col-span-2">
                                                                    <div className="space-y-1">
                                                                        <label className="block text-[8px] font-bold text-gray-400 uppercase text-center">{t("Setup (H)")}</label>
                                                                        <input type="number" value={op.setupTime || ''} onChange={e => updateRoutingStep(idx, 'setupTime', parseFloat(e.target.value))} className="w-full p-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-center font-mono text-xs dark:text-white" placeholder={t("0")} />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="block text-[8px] font-bold text-gray-400 uppercase text-center">{t("Run (H/U)")}</label>
                                                                        <input type="number" value={op.runTime || ''} onChange={e => updateRoutingStep(idx, 'runTime', parseFloat(e.target.value))} className="w-full p-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-center font-mono text-xs dark:text-white" placeholder={t("0")} />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="block text-[8px] font-bold text-gray-400 uppercase text-center">{t("Labor (₹/H)")}</label>
                                                                        <input type="number" value={op.laborCostPerHour || ''} onChange={e => updateRoutingStep(idx, 'laborCostPerHour', parseFloat(e.target.value))} className="w-full p-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-center font-mono text-xs dark:text-white" placeholder={t("0")} />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="block text-[8px] font-bold text-gray-400 uppercase text-center">{t("Ovhd (₹/H)")}</label>
                                                                        <input type="number" value={op.overheadCostPerHour || ''} onChange={e => updateRoutingStep(idx, 'overheadCostPerHour', parseFloat(e.target.value))} className="w-full p-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-center font-mono text-xs dark:text-white" placeholder={t("0")} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => removeRoutingStep(idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1" title={t("Remove")}><DeleteIcon className="w-4 h-4" /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Accordion 4: Secondary Output (By-products) */}
                            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 'secondary' ? null : 'secondary')}
                                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                            <div className="font-black text-[10px]">{t("CO")}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{t("4. Secondary Outputs")}</h3>
                                        </div>
                                    </div>
                                    {activeAccordion === 'secondary' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                
                                <AnimatePresence>
                                    {activeAccordion === 'secondary' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="p-4 sm:p-6 pt-0 space-y-4 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex justify-between items-center py-4">
                                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("By-product List")}</h3>
                                                    <button onClick={addByProduct} className="flex items-center space-x-2 text-[10px] text-orange-600 hover:text-orange-700 font-bold bg-orange-50 px-3 py-1.5 rounded-lg dark:bg-orange-900/30 transition-all">
                                                        <span>{t("+ Add Product")}</span>
                                                    </button>
                                                </div>
                                                
                                                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                                    <div className="hidden sm:grid sm:grid-cols-[1fr_120px_80px_50px] bg-gray-50 dark:bg-gray-800/80 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase">{t("Item")}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase text-center">{t("Batch Yield")}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase text-center">{t("UOM")}</div>
                                                        <div></div>
                                                    </div>

                                                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                                        {(!formData.byProducts || formData.byProducts.length === 0) && (
                                                            <div className="text-center py-8">
                                                                <p className="text-gray-400 font-medium text-xs">{t("No by-products tracked")}</p>
                                                            </div>
                                                        )}
                                                        {formData.byProducts?.map((bp, idx) => (
                                                            <div key={idx} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 p-4 sm:p-0 sm:grid sm:grid-cols-[1fr_120px_80px_50px] sm:items-center">
                                                                <div className="sm:px-4 sm:py-2">
                                                                    <select value={bp.itemId} onChange={e => updateByProduct(idx, 'itemId', e.target.value)} className="w-full p-2 text-xs border border-gray-100 sm:border-0 bg-transparent rounded-lg dark:text-white">
                                                                        <option value="">{t("Select Item...")}</option>
                                                                        {itemMasters.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                                                    </select>
                                                                </div>
                                                                <div className="sm:px-4 sm:py-2">
                                                                    <input type="number" value={bp.quantity} onChange={e => updateByProduct(idx, 'quantity', parseFloat(e.target.value))} className="w-full p-2 text-xs border border-gray-100 sm:border-0 bg-transparent text-center font-mono dark:text-white" />
                                                                </div>
                                                                <div className="sm:px-4 sm:py-2 text-center text-[10px] font-bold text-gray-400">
                                                                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">{bp.uom || '-'}</span>
                                                                </div>
                                                                <div className="flex justify-end pr-4">
                                                                    <button onClick={() => removeByProduct(idx)} className="p-1.5 text-gray-300 hover:text-red-500" title={t("Remove")}><DeleteIcon className="w-4 h-4" /></button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Accordion 5: Financials & Notes */}
                            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 'finance' ? null : 'finance')}
                                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                                            <div className="font-bold text-[10px]">₹</div>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{t("5. Financials & Notes")}</h3>
                                        </div>
                                    </div>
                                    {activeAccordion === 'finance' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                
                                <AnimatePresence>
                                    {activeAccordion === 'finance' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="p-4 sm:p-6 pt-0 space-y-6 border-t border-gray-100 dark:border-gray-800">
                                                <div className="form-grid pt-4 gap-6">
                                                    {/* Cost Summary */}
                                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm text-gray-900 dark:text-white">
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t("Estimated Cost (Per Batch)")}</h4>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-500">{t("Material Cost:")}</span>
                                                                <span className="font-mono font-bold">₹{formatNumber(Number(calculateTotalCost().material))}</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-500">{t("Labor Cost:")}</span>
                                                                <span className="font-mono font-bold">₹{formatNumber(Number(calculateTotalCost().labor))}</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-500">{t("Overhead Cost:")}</span>
                                                                <span className="font-mono font-bold">₹{formatNumber(Number(calculateTotalCost().overhead))}</span>
                                                            </div>
                                                            <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                                                            <div className="flex justify-between text-base">
                                                                <span className="font-bold">{t("Total Estimate:")}</span>
                                                                <span className="font-mono font-black text-blue-600">₹{formatNumber(Number(calculateTotalCost().total))}</span>
                                                            </div>
                                                            <div className="text-[10px] text-right text-gray-400 font-medium">
                                                                ~ ₹{formatNumber(Number(calculateTotalCost().perUnit))} {t("per unit")}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="form-label ml-1">{t("Manufacturing Instructions")}</label>
                                                            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input sm:p-4 dark:bg-gray-900/50 rounded-2xl focus:ring-blue-500/10 h-32 resize-none font-medium text-xs shadow-inner" placeholder={t("Add critical assembly sequences, QA steps, or material handling notes...")}></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-100 bg-gray-50/80 dark:bg-gray-800/80 dark:border-gray-800 shrink-0">
                             <button onClick={resetForm} className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm sm:text-base">
                                 <UndoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                 {t("Reset")}
                             </button>
                             <button onClick={handleSave} className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-[0.98] text-sm sm:text-base">
                                 <SaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                 {t("Save")}
                             </button>
                             <button onClick={() => setIsModalOpen(false)} className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition-all text-sm sm:text-base">
                                 <CancelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                 {t("Cancel")}
                             </button>
                        </div>
                    </div>
                </div>
            , document.getElementById("main-content")!) : null}

            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmation(null)}></div>
                    
                    <div className="relative transform overflow-hidden rounded-[1.5rem] bg-white p-8 w-full max-w-sm text-center shadow-2xl transition-all dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
                             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 dark:bg-red-900/30">
                                <DeleteIcon className="text-3xl" />
                            </div>
                            <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{t("Delete BOM?")}</h2>
                            <p className="text-gray-500 mb-6 text-sm dark:text-gray-400">{t("Are you sure you want to delete")} "{deleteConfirmation.name}"?</p>
                            <div className="flex space-x-3">
                                 <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition">{t("Cancel")}</button>
                                 <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-200 transition">{t("Delete")}</button>
                            </div>
                        </div>
                    </div>
            )}
        </div>
    );
};
