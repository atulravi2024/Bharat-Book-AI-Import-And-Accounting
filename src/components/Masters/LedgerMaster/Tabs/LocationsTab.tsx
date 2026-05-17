import React, { useState, useMemo, useEffect } from 'react';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import { 
    Plus, 
    Search, 
    X, 
    Edit2, 
    Trash2, 
    ChevronDown, 
    ChevronUp, 
    MapPin as LocationIcon, 
    MapPin, 
    User, 
    Settings, 
    Box, 
    Clock, 
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LocationsTabProps {
    data: any[];
    onSave: (items: any[]) => void;
}

export const LocationsTab: React.FC<LocationsTabProps> = ({ data, onSave }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

    const resetForm = () => {
        if (editingId) {
            const original = data.find(m => m.id === editingId);
            setFormData(original ? { ...original } : {});
        } else {
            setFormData({ 
                name: "", 
                type: 'Distribution Center', 
                isActive: true, 
                capacity: { totalArea: 0, uomArea: 'sq ft', maxWeight: 0, totalVolume: 0 },
                contact: { manager: '', number: '', address: '' },
                ops: { pickingLeadTime: 0, packingLeadTime: 0, workingHours: '', zones: 0, docks: 0 },
                security: { hasCctv: true, hasGuard: true, fireRating: 'A', hasSprinklers: true },
                tech: { equipment: '', scanSystem: 'BARCODE', ecomIntegrated: false },
                inventory: { cycleCountFreq: 'Monthly', shrinkageAllow: 0.5, qaSampleSize: 10 },
                logistics: { isHazardous: false, isFragile: false, rmaRequired: true, crossDockEnabled: false },
                compliance: { taxId: '', leaseExpiry: '', headcount: 0 }
            });
        }
    };

    const filteredData = useMemo(() => {
        return (data || []).filter((m: any) => 
            String(m.name || m.code || m.id || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const handleSave = () => {
        if (!formData.name?.trim()) return;
        const newList = editingId 
            ? data.map((m: any) => m.id === editingId ? { ...formData } : m)
            : [...data, { ...formData, id: `loc-${Date.now()}`, isActive: true }];
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

    const [locationTypes, setLocationTypes] = useState<string[]>(['Distribution Center', 'Retail Outlet', 'Cold Storage', 'Virtual Location', 'Transit/Buffer', 'Raw Material Store']);

    useEffect(() => {
        const loadMeta = async () => {
            try {
                const response = await fetch('/sample-data/masters/metadata.json');
                if (response.ok) {
                    const meta = await response.json();
                    if (meta.locationTypes) setLocationTypes(meta.locationTypes);
                }
            } catch (e) {
                console.error("Failed to load master metadata", e);
            }
        };
        loadMeta();
    }, []);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header controls */}
            <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center dark:bg-gray-800/30 dark:border-gray-800">
                <div className="relative max-w-md w-full mr-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search Locations..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="form-input pl-10 pr-4 text-sm font-medium" 
                    />
                </div>
                <div className="flex items-center">
                    <ImportExportButtons data={data} onSave={onSave} entityName="LocationsTab" />
                    <button 
                    onClick={() => { 
                        setEditingId(null); 
                        setFormData({ 
                            name: "", 
                            type: 'Distribution Center', 
                            isActive: true, 
                            capacity: { totalArea: 0, uomArea: 'sq ft', maxWeight: 0, totalVolume: 0 },
                            contact: { manager: '', number: '', address: '' },
                            ops: { pickingLeadTime: 0, packingLeadTime: 0, workingHours: '', zones: 0, docks: 0 },
                            security: { hasCctv: true, hasGuard: true, fireRating: 'A', hasSprinklers: true },
                            tech: { equipment: '', scanSystem: 'BARCODE', ecomIntegrated: false },
                            inventory: { cycleCountFreq: 'Monthly', shrinkageAllow: 0.5, qaSampleSize: 10 },
                            logistics: { isHazardous: false, isFragile: false, rmaRequired: true, crossDockEnabled: false },
                            compliance: { taxId: '', leaseExpiry: '', headcount: 0 }
                        }); 
                        setIsModalOpen(true); 
                        setActiveAccordion(null);
                    }} 
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center text-xs shadow-lg shadow-blue-200 dark:shadow-none whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all"
                >
                    <Plus className="mr-2 w-4 h-4" /> Add Location
                </button>
                </div>
            </div>

            {/* List Table */}
            <div className="flex-1 overflow-auto custom-scrollbar min-h-0 bg-white dark:bg-gray-900">
                {filteredData.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Location Details</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Type & Status</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Contact Person</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredData.map((m: any) => (
                                <tr key={m.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-xl ${m.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center font-bold text-sm shadow-sm transition-colors`}>
                                                <LocationIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">{m.name}</div>
                                                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{m.code || 'NO CODE'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-[10px] font-bold uppercase tracking-tight">
                                                {m.type || 'Standard'}
                                            </span>
                                            <div className="flex items-center space-x-1.5 pt-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${m.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                <span className="text-[10px] font-bold text-gray-500">{m.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{m.manager || '-'}</span>
                                            <span className="text-xs text-gray-400 font-mono">{m.contactNumber || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button 
                                                onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} 
                                                className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95" title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name})} 
                                                className="flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95" title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-300 w-8 h-8" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-bold mb-2">No Locations Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">Try adjusting your search or add a new location to your system.</p>
                    </div>
                )}
            </div>

            {/* Editing / Addition Modal with Accordions */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-4xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[95vh] border border-white/20 ml-0 sm:ml-16 lg:ml-64"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                                        <LocationIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-xl text-gray-900 dark:text-white tracking-tight">
                                            {editingId ? 'Edit Location' : 'Create New Location'}
                                        </h2>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{formData.name || 'Unnamed Asset'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar bg-white dark:bg-gray-900">
                                {/* Category 1: Identity */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'identity' ? null : 'identity')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 border border-blue-100/50">
                                                <LocationIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Identity & Status</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Base configuration and access</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'identity' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'identity' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Location Name *</label>
                                                        <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" placeholder="e.g. Master Distribution Center" />
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Location Code</label>
                                                        <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-mono font-bold shadow-sm" placeholder="e.g. LOC-001" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="form-label ml-1">Location Type</label>
                                                        <select value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                            {locationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col space-y-4 pt-4">
                                                        <div className="space-y-1.5">
                                                            <label className="form-label ml-1">Status</label>
                                                            <select value={formData.isActive === false ? 'false' : 'true'} onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                                <option value="true">Active</option>
                                                                <option value="false">Inactive</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="form-label ml-1">Default</label>
                                                            <select value={formData.isDefault === true ? 'true' : 'false'} onChange={e => setFormData({...formData, isDefault: e.target.value === 'true'})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                                <option value="true">Yes (Default)</option>
                                                                <option value="false">No / Disabled</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category 2: Contact */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'contact' ? null : 'contact')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 border border-orange-100/50">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Contact Information</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Management and address details</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'contact' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'contact' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Manager Name</label>
                                                        <input type="text" value={formData.manager || ''} onChange={e => setFormData({...formData, manager: e.target.value})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" placeholder="Primary Supervisor" />
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Contact Number</label>
                                                        <input type="text" value={formData.contactNumber || ''} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" placeholder="+1 (555) 000-0000" />
                                                    </div>
                                                    <div className="form-field-wrapper space-y-1.5 md:col-span-2">
                                                        <label className="form-label ml-1">Full Address</label>
                                                        <textarea rows={2} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-medium shadow-sm resize-none" placeholder="Street, City, State, ZIP, Country" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category 3: Capacity */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'capacity' ? null : 'capacity')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 border border-purple-100/50">
                                                <Box className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Capacity & Dimensions</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Physical constraints and storage limits</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'capacity' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'capacity' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Total Area (sq ft)</label>
                                                        <input type="number" value={formData.capacity?.totalArea || 0} onChange={e => setFormData({...formData, capacity: {...formData.capacity, totalArea: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Max Weight (kg)</label>
                                                        <input type="number" value={formData.capacity?.maxWeight || 0} onChange={e => setFormData({...formData, capacity: {...formData.capacity, maxWeight: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Total Volume (cu ft)</label>
                                                        <input type="number" value={formData.capacity?.totalVolume || 0} onChange={e => setFormData({...formData, capacity: {...formData.capacity, totalVolume: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category 4: Operations */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'ops' ? null : 'ops')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Operations & Scheduling</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Workflow and efficiency parameters</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'ops' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'ops' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Working Hours</label>
                                                        <input type="text" value={formData.ops?.workingHours || ''} onChange={e => setFormData({...formData, ops: {...formData.ops, workingHours: e.target.value}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" placeholder="e.g. 08:00 - 20:00" />
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Picking Lead Time (min)</label>
                                                        <input type="number" value={formData.ops?.pickingLeadTime || 0} onChange={e => setFormData({...formData, ops: {...formData.ops, pickingLeadTime: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="form-label ml-1">Packing Lead Time (min)</label>
                                                        <input type="number" value={formData.ops?.packingLeadTime || 0} onChange={e => setFormData({...formData, ops: {...formData.ops, packingLeadTime: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category 5: Zoning */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'zoning' ? null : 'zoning')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Zoning & Docks</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Internal organization and loading bays</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'zoning' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'zoning' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Total Zones</label>
                                                        <input type="number" value={formData.ops?.zones || 0} onChange={e => setFormData({...formData, ops: {...formData.ops, zones: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Loading Docks</label>
                                                        <input type="number" value={formData.ops?.docks || 0} onChange={e => setFormData({...formData, ops: {...formData.ops, docks: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category 6: Security */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'security' ? null : 'security')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 border border-red-100/50">
                                                <Settings className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Security & Safety</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Asset protection and hazard controls</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'security' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'security' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="flex flex-col space-y-4 pt-4">
                                                        <div className="space-y-1.5">
                                                            <label className="form-label ml-1">CCTV</label>
                                                            <select value={formData.security?.hasCctv === true ? 'true' : 'false'} onChange={e => setFormData({...formData, security: {...formData.security, hasCctv: e.target.value === 'true'}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                                <option value="true">Enable / Installed</option>
                                                                <option value="false">Disable / None</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="form-label ml-1">Guards</label>
                                                            <select value={formData.security?.hasGuard === true ? 'true' : 'false'} onChange={e => setFormData({...formData, security: {...formData.security, hasGuard: e.target.value === 'true'}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                                <option value="true">Enable / Assigned</option>
                                                                <option value="false">Disable / None</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Fire Rating</label>
                                                        <select value={formData.security?.fireRating || 'A'} onChange={e => setFormData({...formData, security: {...formData.security, fireRating: e.target.value}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                            <option value="A">A (Superior)</option>
                                                            <option value="B">B (Standard)</option>
                                                            <option value="C">C (Basic)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category 7: Technology */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'tech' ? null : 'tech')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 border border-cyan-100/50">
                                                <Settings className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Technology & Assets</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Digital stack and material handling</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'tech' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'tech' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Scanning System</label>
                                                        <select value={formData.tech?.scanSystem || 'BARCODE'} onChange={e => setFormData({...formData, tech: {...formData.tech, scanSystem: e.target.value}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                            <option value="BARCODE">Barcode</option>
                                                            <option value="RFID">RFID</option>
                                                            <option value="QR">QR Code</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">E-commerce Integrated</label>
                                                        <select value={formData.tech?.ecomIntegrated === true ? 'true' : 'false'} onChange={e => setFormData({...formData, tech: {...formData.tech, ecomIntegrated: e.target.value === 'true'}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                            <option value="true">Integrated (Yes)</option>
                                                            <option value="false">Not Integrated (No)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category 8: Inventory */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'inventory' ? null : 'inventory')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 border border-amber-100/50">
                                                <Box className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Inventory & Auditing</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Stock management and quality assurance</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'inventory' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'inventory' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Cycle Count Frequency</label>
                                                        <select value={formData.inventory?.cycleCountFreq || 'Monthly'} onChange={e => setFormData({...formData, inventory: {...formData.inventory, cycleCountFreq: e.target.value}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm">
                                                            <option value="Daily">Daily</option>
                                                            <option value="Weekly">Weekly</option>
                                                            <option value="Monthly">Monthly</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">QA Sample Size (%)</label>
                                                        <input type="number" value={formData.inventory?.qaSampleSize || 10} onChange={e => setFormData({...formData, inventory: {...formData.inventory, qaSampleSize: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category 9: Compliance */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'compliance' ? null : 'compliance')}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-bold"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-center text-zinc-600 border border-zinc-100/50">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Compliance & HR</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Legal and labor requirements</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'compliance' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'compliance' && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/20 dark:bg-gray-800/20">
                                                <div className="form-grid p-6 pt-2 gap-5 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Tax ID</label>
                                                        <input type="text" value={formData.compliance?.taxId || ''} onChange={e => setFormData({...formData, compliance: {...formData.compliance, taxId: e.target.value}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                    <div className="space-y-1.5 mt-4">
                                                        <label className="form-label ml-1">Headcount</label>
                                                        <input type="number" value={formData.compliance?.headcount || 0} onChange={e => setFormData({...formData, compliance: {...formData.compliance, headcount: Number(e.target.value)}})} className="form-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm font-bold shadow-sm" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                             {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="form-grid gap-3 w-full">
                                    <button 
                                        onClick={resetForm} 
                                        className="py-2.5 md:py-3 text-[10px] md:text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center justify-center"
                                    >
                                        Reset
                                    </button>
                                    <button 
                                        onClick={handleSave} 
                                        disabled={!formData.name?.trim()}
                                        className="py-2.5 md:py-3 text-[10px] md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center space-x-1 md:space-x-2"
                                    >
                                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                                        <span>Save</span>
                                    </button>
                                    <button 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="py-2.5 md:py-3 text-[10px] md:text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {deleteConfirmation?.isOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                                <Trash2 className="w-10 h-10" />
                            </div>
                            <h2 className="font-black text-2xl mb-2 text-gray-900 dark:text-white tracking-tight">Decommission?</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm font-medium">
                                Are you sure you want to delete <span className="text-gray-900 dark:text-white font-bold">"{deleteConfirmation.name}"</span>? This will remove all associated routing and storage records.
                            </p>
                            <div className="space-x-3 flex items-center">
                                <button onClick={() => setDeleteConfirmation(null)} className="flex-1 px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all uppercase tracking-widest text-[10px]">
                                    Keep It
                                </button>
                                <button onClick={confirmDelete} className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-none uppercase tracking-widest text-[10px]">
                                    Confirm Decommission
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
