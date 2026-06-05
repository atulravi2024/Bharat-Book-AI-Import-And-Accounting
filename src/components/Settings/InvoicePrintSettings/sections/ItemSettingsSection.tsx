import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from '../../VisualDesignPaletteData';
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from '../components/InvoicePrintControls';

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const ItemSettingsSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Item Settings" 
                            isOpen={activeSection === 'pagination'} 
                            onToggle={() => toggleSection('pagination')}
                            icon={<FileText size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection(['itemsPerFirstPage', 'itemsPerSecondPage', 'itemsPerLastPage']);
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <RotateCcw size={10} />
                                    Reset
                                </div>
                            }
                        >
                            <div className="space-y-6">
                                <div className="form-grid gap-4">
                                    <div className="space-y-3">
                                        <label className="form-label px-1">First Page Items</label>
                                        <select 
                                            value={settings.itemsPerFirstPage || 12}
                                            onChange={(e) => setSettings(prev => ({ ...prev, itemsPerFirstPage: parseInt(e.target.value) }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                                                <option key={num} value={num}>{num} items</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Middle Pages Items</label>
                                        <select 
                                            value={settings.itemsPerSecondPage || 15}
                                            onChange={(e) => setSettings(prev => ({ ...prev, itemsPerSecondPage: parseInt(e.target.value) }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                                                <option key={num} value={num}>{num} items</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Last Page Items</label>
                                        <select 
                                            value={settings.itemsPerLastPage || 10}
                                            onChange={(e) => setSettings(prev => ({ ...prev, itemsPerLastPage: parseInt(e.target.value) }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                                                <option key={num} value={num}>{num} items</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>
    </>
  );
};
