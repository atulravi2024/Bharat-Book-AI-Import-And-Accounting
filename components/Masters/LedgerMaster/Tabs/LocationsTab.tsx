import React, { useState, useMemo } from 'react';
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
                capacity: { uomArea: 'sq ft', uomVolume: 'cu ft', uomWeight: 'kg' },
                operationalDefaults: { pickingLeadTime: 0, packingLeadTime: 0 },
                security: { hasCctv: true, hasGuard: true },
                compliance: { fireRating: 'A+' },
                storage: { rackingType: 'Selective', shelfLevels: 1, aisleWidth: 3.5 },
                commodities: { hazardous: false, fragile: false, perishable: false },
                digital: { ecomIntegrated: true, autoReplenishment: false },
                strategic: { pickingPriority: 'FIFO', putawayLogic: 'Direct' },
                fleet: { deliveryVehicles: 0, dockAssignment: 'Dynamic' },
                eco: { carbonScore: 'B', plasticUsage: 'Minimised' },
                maint: { lastService: '', nextService: '', serviceProvider: '' },
                risk: { insuranceValuation: 0, claimHistory: 'Clear' },
                labor: { minWageCompliance: true, unionized: false },
                fire: { sprinklerSystem: true, smokeDetectors: true, extinguishers: 10 },
                assets: { palletJacks: 0, reachTrucks: 0, conveyors: false },
                shifts: { morningStart: '08:00', eveningEnd: '22:00', rotationFrequency: 'Weekly' },
                returns: { rmaRequired: true, quarantineArea: true, refurbishStation: false },
                qa: { sampleSizePct: 10, weightTolerance: 1.0, qualityStandards: 'ISO9001' },
                packaging: { autoLabelling: false, multiSizeCartons: true, bubbleWrapStation: true },
                crossdock: { stagingBufferHours: 24, priorityArrival: false, directShipEnabled: true },
                inventory: { cycleCountFreq: 'Monthly', stocktakeMethod: 'Barcoding', shrinkageAllow: 0.5 },
                metering: { electricMeter: '', waterMeter: '', separateIndustrialLine: true },
                disaster: { backupSiteId: '', evacuationPlan: true, floodProtection: 'Level A' }
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
            : [...data, { ...formData, id: `wh-${Date.now()}`, isActive: true }];
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

    const locationTypes = ['Distribution Center', 'Retail Outlet', 'Cold Storage', 'Virtual Location', 'Transit/Buffer', 'Raw Material Store'];

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
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                    />
                </div>
                <button 
                    onClick={() => { 
                        setEditingId(null); 
                        setFormData({ 
                            name: "", 
                            type: 'Distribution Center', 
                            isActive: true, 
                            capacity: { uomArea: 'sq ft', uomVolume: 'cu ft', uomWeight: 'kg' },
                            operationalDefaults: { pickingLeadTime: 0, packingLeadTime: 0 },
                            security: { hasCctv: true, hasGuard: true },
                            compliance: { fireRating: 'A+' },
                            storage: { rackingType: 'Selective', shelfLevels: 1, aisleWidth: 3.5 },
                            commodities: { hazardous: false, fragile: false, perishable: false },
                            digital: { ecomIntegrated: true, autoReplenishment: false },
                            strategic: { pickingPriority: 'FIFO', putawayLogic: 'Direct' },
                            fleet: { deliveryVehicles: 0, dockAssignment: 'Dynamic' },
                            eco: { carbonScore: 'B', plasticUsage: 'Minimised' },
                            maint: { lastService: '', nextService: '', serviceProvider: '' },
                            risk: { insuranceValuation: 0, claimHistory: 'Clear' },
                            labor: { minWageCompliance: true, unionized: false },
                            fire: { sprinklerSystem: true, smokeDetectors: true, extinguishers: 10 },
                            assets: { palletJacks: 0, reachTrucks: 0, conveyors: false },
                            shifts: { morningStart: '08:00', eveningEnd: '22:00', rotationFrequency: 'Weekly' },
                            returns: { rmaRequired: true, quarantineArea: true, refurbishStation: false },
                            qa: { sampleSizePct: 10, weightTolerance: 1.0, qualityStandards: 'ISO9001' },
                            packaging: { autoLabelling: false, multiSizeCartons: true, bubbleWrapStation: true },
                            crossdock: { stagingBufferHours: 24, priorityArrival: false, directShipEnabled: true },
                            inventory: { cycleCountFreq: 'Monthly', stocktakeMethod: 'Barcoding', shrinkageAllow: 0.5 },
                            metering: { electricMeter: '', waterMeter: '', separateIndustrialLine: true },
                            disaster: { backupSiteId: '', evacuationPlan: true, floodProtection: 'Level A' }
                        }); 
                        setIsModalOpen(true); 
                        setActiveAccordion(null);
                    }} 
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center text-xs shadow-lg shadow-blue-200 dark:shadow-none whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all"
                >
                    <Plus className="mr-2 w-4 h-4" /> Add Location
                </button>
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
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 text-right">Actions</th>
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
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} 
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name})} 
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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
                                {/* Accordion 1: Basic Information */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'basic' ? null : 'basic')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                                <LocationIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">1. Identity & Type</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Core identification and location classification</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'basic' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'basic' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location Name *</label>
                                                        <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all text-sm font-bold" placeholder="e.g. Northeast Regional Hub" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location Code</label>
                                                        <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all text-sm font-mono font-bold" placeholder="e.g. WH-NER-01" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Operation Type</label>
                                                        <select value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all text-sm font-bold">
                                                            {locationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center space-x-6 h-full pt-4">
                                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                                            <div className="relative">
                                                                <input type="checkbox" checked={formData.isActive ?? true} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="sr-only" />
                                                                <div className={`w-10 h-5 rounded-full transition-colors ${formData.isActive ?? true ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.isActive ?? true ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Active</span>
                                                        </label>
                                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                                            <div className="relative">
                                                                <input type="checkbox" checked={formData.isDefault || false} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="sr-only" />
                                                                <div className={`w-10 h-5 rounded-full transition-colors ${formData.isDefault ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.isDefault ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Default</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 2: Location & Contact */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'location' ? null : 'location')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">2. Physical Location & Contact</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Address and primary contact information</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'location' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'location' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 space-y-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                                                        <textarea value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all text-sm font-medium h-20 resize-none" placeholder="123 Logistics Blvd, Supply Chain City..."></textarea>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location Manager</label>
                                                            <div className="relative">
                                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                                <input type="text" value={formData.manager || ''} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold" placeholder="e.g. Atul R." />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                                            <input type="text" value={formData.contactNumber || ''} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono font-bold" placeholder="+91 99999-00000" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 3: Capacity & Storage */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'capacity' ? null : 'capacity')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">3. Capacity & Storage Specs</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Physical limits and volume constraints</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'capacity' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'capacity' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Total Floor Area</label>
                                                        <div className="flex">
                                                            <input type="number" value={formData.capacity?.totalArea || ''} onChange={e => setFormData({...formData, capacity: {...(formData.capacity || {}), totalArea: parseFloat(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono font-bold" placeholder="0.00" />
                                                            <span className="bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-200 dark:border-gray-600 rounded-r-xl px-3 flex items-center text-[10px] font-bold text-gray-500">SQ FT</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Max Weight Cap.</label>
                                                        <div className="flex">
                                                            <input type="number" value={formData.capacity?.maxWeight || ''} onChange={e => setFormData({...formData, capacity: {...(formData.capacity || {}), maxWeight: parseFloat(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono font-bold" placeholder="0.00" />
                                                            <span className="bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-200 dark:border-gray-600 rounded-r-xl px-2 flex items-center text-[8px] font-black text-gray-500">TONS</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Max Storage Vol.</label>
                                                        <div className="flex">
                                                            <input type="number" value={formData.capacity?.totalVolume || ''} onChange={e => setFormData({...formData, capacity: {...(formData.capacity || {}), totalVolume: parseFloat(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono font-bold" placeholder="0.00" />
                                                            <span className="bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-200 dark:border-gray-600 rounded-r-xl px-2 flex items-center text-[8px] font-black text-gray-500">CU FT</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 4: Operational Settings */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'ops' ? null : 'ops')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">4. Operational Logistics</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Timing thresholds and shift management</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'ops' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'ops' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Working Hours (Shift)</label>
                                                        <input type="text" value={formData.operationalDefaults?.workingHours || ''} onChange={e => setFormData({...formData, operationalDefaults: {...(formData.operationalDefaults || {}), workingHours: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold" placeholder="e.g. 09:00 AM - 06:00 PM" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <div className="space-y-1">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center font-bold">Pick Time</label>
                                                            <div className="flex">
                                                                <input type="number" value={formData.operationalDefaults?.pickingLeadTime || ''} onChange={e => setFormData({...formData, operationalDefaults: {...(formData.operationalDefaults || {}), pickingLeadTime: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono font-bold text-center" placeholder="0" />
                                                                <span className="bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-200 dark:border-gray-600 rounded-r-xl px-2 flex items-center text-[8px] font-black text-gray-500">M</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center font-bold">Pack Time</label>
                                                            <div className="flex">
                                                                <input type="number" value={formData.operationalDefaults?.packingLeadTime || ''} onChange={e => setFormData({...formData, operationalDefaults: {...(formData.operationalDefaults || {}), packingLeadTime: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono font-bold text-center" placeholder="0" />
                                                                <span className="bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-200 dark:border-gray-600 rounded-r-xl px-2 flex items-center text-[8px] font-black text-gray-500">M</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 5: Zone & Dock Management */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'zones' ? null : 'zones')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">5. Zones & Dock Setup</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Logical zoning and loading dock configurations</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'zones' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'zones' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Total Zones</label>
                                                        <input type="number" value={formData.zones?.count || ''} onChange={e => setFormData({...formData, zones: {...(formData.zones || {}), count: parseInt(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Loading Docks</label>
                                                        <input type="number" value={formData.zones?.loadingDocks || ''} onChange={e => setFormData({...formData, zones: {...(formData.zones || {}), loadingDocks: parseInt(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Unloading Docks</label>
                                                        <input type="number" value={formData.zones?.unloadingDocks || ''} onChange={e => setFormData({...formData, zones: {...(formData.zones || {}), unloadingDocks: parseInt(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 6: Security & Safety */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'safety' ? null : 'safety')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">6. Safety & Security</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Compliance, surveillance and access control</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'safety' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'safety' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-4 mt-4">
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">CCTV Surveillance</span>
                                                            <input type="checkbox" checked={formData.security?.hasCctv || false} onChange={e => setFormData({...formData, security: {...(formData.security || {}), hasCctv: e.target.checked}})} className="w-4 h-4 accent-blue-600" />
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">24/7 Security Guard</span>
                                                            <input type="checkbox" checked={formData.security?.hasGuard || false} onChange={e => setFormData({...formData, security: {...(formData.security || {}), hasGuard: e.target.checked}})} className="w-4 h-4 accent-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center font-bold">Fire Rating</label>
                                                        <select value={formData.compliance?.fireRating || ''} onChange={e => setFormData({...formData, compliance: {...(formData.compliance || {}), fireRating: e.target.value}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold">
                                                            <option value="A+">A+ Superior</option>
                                                            <option value="A">A Standard</option>
                                                            <option value="B">B Adequate</option>
                                                            <option value="C">C Needs Upgrade</option>
                                                        </select>
                                                        <div className="mt-2 space-y-1">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center font-bold">Insurance Policy</label>
                                                            <input type="text" value={formData.compliance?.insurancePolicy || ''} onChange={e => setFormData({...formData, compliance: {...(formData.compliance || {}), insurancePolicy: e.target.value}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono" placeholder="POL-99122-XC" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 7: Equipment & Tech */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'tech' ? null : 'tech')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">7. Equipment & Tech</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Material handling and digital systems</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'tech' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'tech' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Handling Equipment</label>
                                                        <input type="text" value={formData.tech?.equipment || ''} onChange={e => setFormData({...formData, tech: {...(formData.tech || {}), equipment: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm" placeholder="e.g. 5x Forklifts, 10x Trolleys" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Scanning System</label>
                                                        <select value={formData.tech?.scanSystem || ''} onChange={e => setFormData({...formData, tech: {...(formData.tech || {}), scanSystem: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold">
                                                            <option value="QR">QR Code</option>
                                                            <option value="BARCODE">1D Barcode</option>
                                                            <option value="RFID">RFID Active/Passive</option>
                                                            <option value="VOICE">Voice Picking</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 8: Utilities & Maintenance */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'util' ? null : 'util')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">8. Utilities & Maintenance</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Environmental controls and utility specs</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'util' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'util' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-4 mt-4">
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Power Backup (UPS/Gen)</span>
                                                            <input type="checkbox" checked={formData.util?.powerBackup || false} onChange={e => setFormData({...formData, util: {...(formData.util || {}), powerBackup: e.target.checked}})} className="w-4 h-4 accent-blue-600" />
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Temp. Controlled (Cold Chain)</span>
                                                            <input type="checkbox" checked={formData.util?.tempControlled || false} onChange={e => setFormData({...formData, util: {...(formData.util || {}), tempControlled: e.target.checked}})} className="w-4 h-4 accent-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Last Structural Audit</label>
                                                        <input type="date" value={formData.util?.lastAudit || ''} onChange={e => setFormData({...formData, util: {...(formData.util || {}), lastAudit: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 9: Legal & Taxation */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'legal' ? null : 'legal')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center text-slate-600">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">9. Legal & Taxation</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Compliance numbers and property status</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'legal' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'legal' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">GSTIN / Tax ID</label>
                                                        <input type="text" value={formData.legal?.taxId || ''} onChange={e => setFormData({...formData, legal: {...(formData.legal || {}), taxId: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono tracking-wider font-bold" placeholder="07AAAAA0000A1Z5" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Lease Expiry Date</label>
                                                        <input type="date" value={formData.legal?.leaseExpiry || ''} onChange={e => setFormData({...formData, legal: {...(formData.legal || {}), leaseExpiry: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 10: Human Resources */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'hr' ? null : 'hr')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">10. Human Resources</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Headcount and labor configuration</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'hr' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'hr' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center font-bold">Pickers</label>
                                                        <input type="number" value={formData.hr?.pickersCount || ''} onChange={e => setFormData({...formData, hr: {...(formData.hr || {}), pickersCount: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center font-bold">Packers</label>
                                                        <input type="number" value={formData.hr?.packersCount || ''} onChange={e => setFormData({...formData, hr: {...(formData.hr || {}), packersCount: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center font-bold">Supervisors</label>
                                                        <input type="number" value={formData.hr?.supervisorsCount || ''} onChange={e => setFormData({...formData, hr: {...(formData.hr || {}), supervisorsCount: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center font-bold">QC Team</label>
                                                        <input type="number" value={formData.hr?.qcCount || ''} onChange={e => setFormData({...formData, hr: {...(formData.hr || {}), qcCount: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 11: Storage Systems & Racking */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'storage' ? null : 'storage')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">11. Storage & Racking</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Physical storage configurations and racking types</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'storage' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'storage' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Racking Type</label>
                                                        <select value={formData.storage?.rackingType || ''} onChange={e => setFormData({...formData, storage: {...(formData.storage || {}), rackingType: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold">
                                                            <option value="Selective">Selective Racking</option>
                                                            <option value="DoubleDeep">Double Deep</option>
                                                            <option value="DriveIn">Drive-In</option>
                                                            <option value="PalletFlow">Pallet Flow</option>
                                                            <option value="Mezzanine">Mezzanine</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold text-center">Shelf Levels</label>
                                                        <input type="number" value={formData.storage?.shelfLevels || ''} onChange={e => setFormData({...formData, storage: {...(formData.storage || {}), shelfLevels: parseInt(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold text-center">Aisle Width (M)</label>
                                                        <input type="number" step="0.1" value={formData.storage?.aisleWidth || ''} onChange={e => setFormData({...formData, storage: {...(formData.storage || {}), aisleWidth: parseFloat(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 12: Commodities & Handling */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'commodities' ? null : 'commodities')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">12. Commodities & Handling</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Handling specific item types and constraints</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'commodities' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'commodities' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-4 mt-4">
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Hazardous Materials</span>
                                                            <input type="checkbox" checked={formData.commodities?.hazardous || false} onChange={e => setFormData({...formData, commodities: {...(formData.commodities || {}), hazardous: e.target.checked}})} className="w-4 h-4 accent-orange-600" />
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Perishable / Expiring</span>
                                                            <input type="checkbox" checked={formData.commodities?.perishable || false} onChange={e => setFormData({...formData, commodities: {...(formData.commodities || {}), perishable: e.target.checked}})} className="w-4 h-4 accent-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4 mt-4">
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Fragile / High Value</span>
                                                            <input type="checkbox" checked={formData.commodities?.fragile || false} onChange={e => setFormData({...formData, commodities: {...(formData.commodities || {}), fragile: e.target.checked}})} className="w-4 h-4 accent-red-600" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Stacking Limit</label>
                                                            <input type="number" value={formData.commodities?.stackLimit || ''} onChange={e => setFormData({...formData, commodities: {...(formData.commodities || {}), stackLimit: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 13: Digital & API Settings */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'digital' ? null : 'digital')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">13. Digital & API Settings</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Integration keys and ERP connectivity</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'digital' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'digital' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-4 mt-4">
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">E-com Integrated</span>
                                                            <input type="checkbox" checked={formData.digital?.ecomIntegrated || false} onChange={e => setFormData({...formData, digital: {...(formData.digital || {}), ecomIntegrated: e.target.checked}})} className="w-4 h-4 accent-sky-600" />
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Auto Replenishment</span>
                                                            <input type="checkbox" checked={formData.digital?.autoReplenishment || false} onChange={e => setFormData({...formData, digital: {...(formData.digital || {}), autoReplenishment: e.target.checked}})} className="w-4 h-4 accent-sky-600" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">API Endpoint / Secret Key</label>
                                                        <input type="password" value={formData.digital?.apiKey || ''} onChange={e => setFormData({...formData, digital: {...(formData.digital || {}), apiKey: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white text-sm font-mono" placeholder="••••••••••••••••" />
                                                        <p className="text-[8px] text-gray-400 px-1 mt-1 font-bold flex items-center"><CheckCircle2 className="w-2 h-2 mr-1" /> Encrypted at rest</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 14: Strategic Priorities */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'strategic' ? null : 'strategic')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">14. Strategic Priorities</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Picking logic and fulfillment goals</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'strategic' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'strategic' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Picking Priority</label>
                                                        <select value={formData.strategic?.pickingPriority || ''} onChange={e => setFormData({...formData, strategic: {...(formData.strategic || {}), pickingPriority: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:text-white text-sm font-bold">
                                                            <option value="FIFO">FIFO (First-In, First-Out)</option>
                                                            <option value="LIFO">LIFO (Last-In, First-Out)</option>
                                                            <option value="FEFO">FEFO (First-Expiry, First-Out)</option>
                                                            <option value="HIFO">HIFO (High-In, First-Out)</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Putaway Strategy</label>
                                                        <select value={formData.strategic?.putawayLogic || ''} onChange={e => setFormData({...formData, strategic: {...(formData.strategic || {}), putawayLogic: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:text-white text-sm font-bold">
                                                            <option value="Direct">Direct to Bin</option>
                                                            <option value="Zone">Zone Based</option>
                                                            <option value="Velocity">Velocity (ABC Analysis)</option>
                                                            <option value="Random">Randomized (Space Optimized)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 15: Fleet & Transportation */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'fleet' ? null : 'fleet')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                                <LocationIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">15. Fleet & Transportation</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Vehicle management and shipping bay assignments</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'fleet' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'fleet' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Delivery Vehicles</label>
                                                        <input type="number" value={formData.fleet?.deliveryVehicles || ''} onChange={e => setFormData({...formData, fleet: {...(formData.fleet || {}), deliveryVehicles: parseInt(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Dock Assignment</label>
                                                        <select value={formData.fleet?.dockAssignment || 'Dynamic'} onChange={e => setFormData({...formData, fleet: {...(formData.fleet || {}), dockAssignment: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold">
                                                            <option value="Dynamic">Dynamic Allocation</option>
                                                            <option value="Fixed">Fixed Bay Assignment</option>
                                                            <option value="Priority">Priority Loading</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 16: Environmental Impact */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'eco' ? null : 'eco')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">16. Environmental Impact</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Sustainability scores and waste management</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'eco' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'eco' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Carbon Rating</label>
                                                        <select value={formData.eco?.carbonScore || 'B'} onChange={e => setFormData({...formData, eco: {...(formData.eco || {}), carbonScore: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white text-sm font-bold">
                                                            <option value="A">Grade A (Net Zero Ready)</option>
                                                            <option value="B">Grade B (Sustainable)</option>
                                                            <option value="C">Grade C (Standard)</option>
                                                            <option value="D">Grade D (Needs Improvement)</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Plastic Usage</label>
                                                        <select value={formData.eco?.plasticUsage || 'Minimised'} onChange={e => setFormData({...formData, eco: {...(formData.eco || {}), plasticUsage: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white text-sm font-bold">
                                                            <option value="None">Zero Plastic (Eco-Fibre)</option>
                                                            <option value="Minimised">Minimised (Recycled Only)</option>
                                                            <option value="Standard">Standard Packaging</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 17: Maintenance Log */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'maint' ? null : 'maint')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">17. Asset Maintenance</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Service schedules and maintenance provider details</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'maint' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'maint' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Last Service Date</label>
                                                        <input type="date" value={formData.maint?.lastService || ''} onChange={e => setFormData({...formData, maint: {...(formData.maint || {}), lastService: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm" />
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Next Planned Service</label>
                                                        <input type="date" value={formData.maint?.nextService || ''} onChange={e => setFormData({...formData, maint: {...(formData.maint || {}), nextService: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 18: Risk & Insurance */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'risk' ? null : 'risk')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center text-slate-600">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">18. Risk & Insurance</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Coverage limits and risk assessment ratings</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'risk' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'risk' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Sum Insured (Valuation)</label>
                                                        <div className="flex">
                                                            <input type="number" value={formData.risk?.insuranceValuation || ''} onChange={e => setFormData({...formData, risk: {...(formData.risk || {}), insuranceValuation: parseFloat(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono font-bold" />
                                                            <span className="bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-200 dark:border-gray-600 rounded-r-xl px-3 flex items-center text-[10px] font-bold text-gray-500">USD</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Claim History</label>
                                                        <select value={formData.risk?.claimHistory || 'Clear'} onChange={e => setFormData({...formData, risk: {...(formData.risk || {}), claimHistory: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-bold">
                                                            <option value="Clear">Clear (0 Claims)</option>
                                                            <option value="Low">Low Risk (&lt; 2 Claims)</option>
                                                            <option value="Moderate">Moderate Risk</option>
                                                            <option value="High">High Risk (&gt; 5 Claims)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 19: Labor & Compliance */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'labor' ? null : 'labor')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">19. Labor & Compliance</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Statutory labor rules and union configuration</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'labor' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'labor' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-4 mt-4">
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Min Wage Compliance</span>
                                                            <input type="checkbox" checked={formData.labor?.minWageCompliance || false} onChange={e => setFormData({...formData, labor: {...(formData.labor || {}), minWageCompliance: e.target.checked}})} className="w-4 h-4 accent-blue-600" />
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Unionized Facility</span>
                                                            <input type="checkbox" checked={formData.labor?.unionized || false} onChange={e => setFormData({...formData, labor: {...(formData.labor || {}), unionized: e.target.checked}})} className="w-4 h-4 accent-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Labor Welfare Certificate #</label>
                                                        <input type="text" value={formData.labor?.certificateNo || ''} onChange={e => setFormData({...formData, labor: {...(formData.labor || {}), certificateNo: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm font-mono" placeholder="LW/LOC/992/2026" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Accordion 20: System Logs (History) */}
                                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === 'history' ? null : 'history')}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800/30 flex items-center justify-center text-gray-400">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">20. Audit Trail & History</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">Read-only history of modifications</p>
                                            </div>
                                        </div>
                                        {activeAccordion === 'history' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'history' && (
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: 'auto' }} 
                                                exit={{ height: 0 }} 
                                                className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30"
                                            >
                                                <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3 pt-6">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-400 font-medium lowercase">Created On</span>
                                                        <span className="text-gray-900 dark:text-white font-mono">{formData.id ? '2026-05-10 16:52' : 'To be generated'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs border-t border-gray-50 dark:border-gray-800 pt-3">
                                                        <span className="text-gray-400 font-medium lowercase">Last Refreshed</span>
                                                        <span className="text-gray-900 dark:text-white font-mono">{formData.updatedAt || 'Never'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs border-t border-gray-50 dark:border-gray-800 pt-3">
                                                        <span className="text-gray-400 font-medium lowercase">Record Status</span>
                                                        <span className="text-blue-600 font-bold uppercase tracking-tighter">Verified & Locked</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                 </div>

                                 {/* Accordion 21: Fire Suppression Details */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'fire' ? null : 'fire')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                                 <Settings className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">21. Fire Suppression Details</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Automatic systems and physical extinguishers</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'fire' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'fire' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-4 mt-4">
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Automatic Sprinklers</span>
                                                             <input type="checkbox" checked={formData.fire?.sprinklerSystem || false} onChange={e => setFormData({...formData, fire: {...(formData.fire || {}), sprinklerSystem: e.target.checked}})} className="w-4 h-4 accent-orange-600" />
                                                         </div>
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Smoke Detectors</span>
                                                             <input type="checkbox" checked={formData.fire?.smokeDetectors || false} onChange={e => setFormData({...formData, fire: {...(formData.fire || {}), smokeDetectors: e.target.checked}})} className="w-4 h-4 accent-orange-600" />
                                                         </div>
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Extinguisher Count</label>
                                                         <input type="number" value={formData.fire?.extinguishers || ''} onChange={e => setFormData({...formData, fire: {...(formData.fire || {}), extinguishers: parseInt(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white text-sm font-bold" />
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 22: Material Handling Assets */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'assets' ? null : 'assets')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                                 <Box className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">22. Handling Equipment Assets</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Internal fleet of machinery and tools</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'assets' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'assets' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center">Pallet Jacks</label>
                                                         <input type="number" value={formData.assets?.palletJacks || ''} onChange={e => setFormData({...formData, assets: {...(formData.assets || {}), palletJacks: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold font-mono" />
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center">Reach Trucks</label>
                                                         <input type="number" value={formData.assets?.reachTrucks || ''} onChange={e => setFormData({...formData, assets: {...(formData.assets || {}), reachTrucks: parseInt(e.target.value) || 0}})} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white text-sm text-center font-bold font-mono" />
                                                     </div>
                                                     <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mt-4 md:mt-8">
                                                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Conveyors</span>
                                                         <input type="checkbox" checked={formData.assets?.conveyors || false} onChange={e => setFormData({...formData, assets: {...(formData.assets || {}), conveyors: e.target.checked}})} className="w-4 h-4 accent-blue-600" />
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 23: Shift & Rotation Plan */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'shifts' ? null : 'shifts')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                                 <Clock className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">23. Shift & Workforce Rotation</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Timings and operational cycles</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'shifts' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'shifts' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="grid grid-cols-2 gap-2 mt-4">
                                                         <div className="space-y-1">
                                                             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Morning Start</label>
                                                             <input type="time" value={formData.shifts?.morningStart || ''} onChange={e => setFormData({...formData, shifts: {...(formData.shifts || {}), morningStart: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white text-sm" />
                                                         </div>
                                                         <div className="space-y-1">
                                                             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Evening End</label>
                                                             <input type="time" value={formData.shifts?.eveningEnd || ''} onChange={e => setFormData({...formData, shifts: {...(formData.shifts || {}), eveningEnd: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white text-sm" />
                                                         </div>
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Rotation Frequency</label>
                                                         <select value={formData.shifts?.rotationFrequency || ''} onChange={e => setFormData({...formData, shifts: {...(formData.shifts || {}), rotationFrequency: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white text-sm font-bold">
                                                             <option value="Weekly">Weekly Rotation</option>
                                                             <option value="Bi-Weekly">Bi-Weekly</option>
                                                             <option value="Monthly">Monthly</option>
                                                             <option value="Static">Static Assignments</option>
                                                         </select>
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 24: Reverse Logistics (Returns) */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'returns' ? null : 'returns')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                                                 <Settings className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">24. Reverse Logistics Config</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Handling returned and quarantined goods</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'returns' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'returns' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-4 mt-4">
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">RMA Required</span>
                                                             <input type="checkbox" checked={formData.returns?.rmaRequired || false} onChange={e => setFormData({...formData, returns: {...(formData.returns || {}), rmaRequired: e.target.checked}})} className="w-4 h-4 accent-pink-600" />
                                                         </div>
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Quarantine Area</span>
                                                             <input type="checkbox" checked={formData.returns?.quarantineArea || false} onChange={e => setFormData({...formData, returns: {...(formData.returns || {}), quarantineArea: e.target.checked}})} className="w-4 h-4 accent-pink-600" />
                                                         </div>
                                                     </div>
                                                     <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mt-4 h-fit self-start">
                                                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Refurbish Station</span>
                                                         <input type="checkbox" checked={formData.returns?.refurbishStation || false} onChange={e => setFormData({...formData, returns: {...(formData.returns || {}), refurbishStation: e.target.checked}})} className="w-4 h-4 accent-pink-600" />
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 25: Quality Standards & QA */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'qa' ? null : 'qa')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                                 <CheckCircle2 className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">25. Quality Assurance Logic</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Sampling sizes and tolerance thresholds</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'qa' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'qa' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Sample Size (%)</label>
                                                         <input type="number" value={formData.qa?.sampleSizePct || ''} onChange={e => setFormData({...formData, qa: {...(formData.qa || {}), sampleSizePct: parseInt(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-sm font-bold" />
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Weight Tol. (±)</label>
                                                         <input type="number" step="0.1" value={formData.qa?.weightTolerance || ''} onChange={e => setFormData({...formData, qa: {...(formData.qa || {}), weightTolerance: parseFloat(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-sm font-bold" />
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Standard</label>
                                                         <select value={formData.qa?.qualityStandards || ''} onChange={e => setFormData({...formData, qa: {...(formData.qa || {}), qualityStandards: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-sm font-bold text-center">
                                                             <option value="ISO9001">ISO 9001</option>
                                                             <option value="AS9100">AS9100 Aerospace</option>
                                                             <option value="HACCP">HACCP Food Safety</option>
                                                             <option value="None">Internal Org Stds</option>
                                                         </select>
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 26: Packaging & Labelling */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'packaging' ? null : 'packaging')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
                                                 <Box className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">26. Packaging & Labelling</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Auto-labellers and multi-size support</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'packaging' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'packaging' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-4 mt-4">
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Auto Labelling</span>
                                                             <input type="checkbox" checked={formData.packaging?.autoLabelling || false} onChange={e => setFormData({...formData, packaging: {...(formData.packaging || {}), autoLabelling: e.target.checked}})} className="w-4 h-4 accent-teal-600" />
                                                         </div>
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Multi-Size Cartons</span>
                                                             <input type="checkbox" checked={formData.packaging?.multiSizeCartons || false} onChange={e => setFormData({...formData, packaging: {...(formData.packaging || {}), multiSizeCartons: e.target.checked}})} className="w-4 h-4 accent-teal-600" />
                                                         </div>
                                                     </div>
                                                     <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mt-4 h-fit">
                                                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Bubble Wrap Station</span>
                                                         <input type="checkbox" checked={formData.packaging?.bubbleWrapStation || false} onChange={e => setFormData({...formData, packaging: {...(formData.packaging || {}), bubbleWrapStation: e.target.checked}})} className="w-4 h-4 accent-teal-600" />
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 27: Cross-Docking Parameters */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'crossdock' ? null : 'crossdock')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                                 <LocationIcon className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">27. Cross-Docking Parameters</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Staging hours and direct-ship logic</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'crossdock' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'crossdock' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-4 mt-4">
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Priority Arrival</span>
                                                             <input type="checkbox" checked={formData.crossdock?.priorityArrival || false} onChange={e => setFormData({...formData, crossdock: {...(formData.crossdock || {}), priorityArrival: e.target.checked}})} className="w-4 h-4 accent-emerald-600" />
                                                         </div>
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Direct Ship Enabled</span>
                                                             <input type="checkbox" checked={formData.crossdock?.directShipEnabled || false} onChange={e => setFormData({...formData, crossdock: {...(formData.crossdock || {}), directShipEnabled: e.target.checked}})} className="w-4 h-4 accent-emerald-600" />
                                                         </div>
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Staging Buffer (Hrs)</label>
                                                         <input type="number" value={formData.crossdock?.stagingBufferHours || ''} onChange={e => setFormData({...formData, crossdock: {...(formData.crossdock || {}), stagingBufferHours: parseInt(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white text-sm font-bold text-center" />
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 28: Inventory Audit Strategy */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'inventory' ? null : 'inventory')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center text-slate-600">
                                                 <Settings className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">28. Inventory Audit Logic</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Cycle count frequency and shrinkage limits</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'inventory' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'inventory' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Cycle Counting</label>
                                                         <select value={formData.inventory?.cycleCountFreq || ''} onChange={e => setFormData({...formData, inventory: {...(formData.inventory || {}), cycleCountFreq: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 dark:text-white text-sm font-bold uppercase">
                                                             <option value="Daily">Daily A-Zone</option>
                                                             <option value="Weekly">Weekly</option>
                                                             <option value="Monthly">Monthly</option>
                                                             <option value="Annual">Annual Wall-To-Wall</option>
                                                         </select>
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Audit Method</label>
                                                         <select value={formData.inventory?.stocktakeMethod || ''} onChange={e => setFormData({...formData, inventory: {...(formData.inventory || {}), stocktakeMethod: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 dark:text-white text-sm font-bold lowercase">
                                                             <option value="Barcoding">Barcoding</option>
                                                             <option value="RFID">RFID Sweep</option>
                                                             <option value="Manual">Manual Counts</option>
                                                             <option value="Weight">Weight Sampling</option>
                                                         </select>
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Shrinkage Allow (%)</label>
                                                         <input type="number" step="0.01" value={formData.inventory?.shrinkageAllow || ''} onChange={e => setFormData({...formData, inventory: {...(formData.inventory || {}), shrinkageAllow: parseFloat(e.target.value) || 0}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 dark:text-white text-sm font-bold text-center" />
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 29: Utility Metering */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'metering' ? null : 'metering')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600">
                                                 <Settings className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">29. Utilities & Metering</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Meter numbers and industrial utility specs</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'metering' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'metering' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Electrical Meter #</label>
                                                         <input type="text" value={formData.metering?.electricMeter || ''} onChange={e => setFormData({...formData, metering: {...(formData.metering || {}), electricMeter: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white text-sm font-mono tracking-widest" placeholder="EL-29910-X" />
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Water Connection #</label>
                                                         <input type="text" value={formData.metering?.waterMeter || ''} onChange={e => setFormData({...formData, metering: {...(formData.metering || {}), waterMeter: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-white text-sm font-mono tracking-widest" placeholder="WA-1122-Z" />
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>

                                 {/* Accordion 30: Disaster Recovery Hub */}
                                 <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => setActiveAccordion(activeAccordion === 'disaster' ? null : 'disaster')}
                                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                     >
                                         <div className="flex items-center space-x-3">
                                             <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                                                 <Settings className="w-4 h-4" />
                                             </div>
                                             <div>
                                                 <h3 className="text-sm font-bold text-gray-900 dark:text-white">30. Disaster Recovery Hub</h3>
                                                 <p className="text-[10px] text-gray-400 font-medium">Backup site mapping and site-safe protocols</p>
                                             </div>
                                         </div>
                                         {activeAccordion === 'disaster' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                     </button>
                                     <AnimatePresence>
                                         {activeAccordion === 'disaster' && (
                                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/30 dark:bg-gray-800/30">
                                                 <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800">
                                                     <div className="space-y-4 mt-4">
                                                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Evacuation Plan Appr.</span>
                                                             <input type="checkbox" checked={formData.disaster?.evacuationPlan || false} onChange={e => setFormData({...formData, disaster: {...(formData.disaster || {}), evacuationPlan: e.target.checked}})} className="w-4 h-4 accent-red-600" />
                                                         </div>
                                                         <div className="space-y-1">
                                                             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Backup Site ID</label>
                                                             <input type="text" value={formData.disaster?.backupSiteId || ''} onChange={e => setFormData({...formData, disaster: {...(formData.disaster || {}), backupSiteId: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-white text-sm font-mono" placeholder="LOC-ALT-009" />
                                                         </div>
                                                     </div>
                                                     <div className="space-y-1 mt-4">
                                                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-bold">Flood Protection</label>
                                                         <select value={formData.disaster?.floodProtection || ''} onChange={e => setFormData({...formData, disaster: {...(formData.disaster || {}), floodProtection: e.target.value}})} className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-white text-sm font-bold uppercase">
                                                             <option value="Level A">Level A (Maximum)</option>
                                                             <option value="Level B">Level B (Partial)</option>
                                                             <option value="Level C">Level C (Standard)</option>
                                                             <option value="None">No Active Protection</option>
                                                         </select>
                                                     </div>
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>
                             </div>

                             {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="grid grid-cols-3 gap-3 w-full">
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
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setDeleteConfirmation(null)} className="py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all text-sm">Keep It</button>
                                <button onClick={confirmDelete} className="py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all text-sm">Confirm Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
