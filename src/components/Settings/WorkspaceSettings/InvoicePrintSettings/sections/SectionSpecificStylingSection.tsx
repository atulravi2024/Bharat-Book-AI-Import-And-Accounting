import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from "../../VisualDesignPaletteData";
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from "../components/InvoicePrintControls";

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const SectionSpecificStylingSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Section-Specific Styling" 
                            isOpen={activeSection === 'granular_styling'} 
                            onToggle={() => toggleSection('granular_styling')}
                            icon={<Palette size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection([], [
                                            'lineItem', 'header', 'subheader', 'companyName', 'companyAddress', 
                                            'partyName', 'partyAddress', 'tableHeader', 'amountInWords', 
                                            'narration', 'taxDetails', 'signatures', 'grandTotal'
                                        ]);
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <RotateCcw size={10} />
                                    Default
                                </div>
                            }
                        >
                            <div className="space-y-6">
                                {[
                                    { key: 'companyName', label: 'Company Name' },
                                    { key: 'companyAddress', label: 'Company Address' },
                                    { key: 'header', label: 'Header (Voucher Title/No)' },
                                    { key: 'subheader', label: 'Subheader (Dates/Refs)' },
                                    { key: 'partyName', label: 'Party Name (Bill To)' },
                                    { key: 'partyAddress', label: 'Party Address' },
                                    { key: 'tableHeader', label: 'Table Headers' },
                                    { key: 'lineItem', label: 'Line Items' },
                                    { key: 'amountInWords', label: 'Amount in Words' },
                                    { key: 'taxDetails', label: 'Tax Details' },
                                    { key: 'narration', label: 'Narration / Notes' },
                                    { key: 'signatures', label: 'Signatures / Authorization' },
                                    { key: 'grandTotal', label: 'Grand Total' }
                                ].map((section) => {
                                    const style = (settings.sectionStyles as any)?.[section.key] || { color: '', weight: '', transform: 'default', family: 'Default', size: '' };
                                    return (
                                        <div key={section.key} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4 hover:border-blue-200 transition-colors dark:bg-gray-900 dark:border-gray-800">
                                            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                                                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest dark:text-white">{section.label}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        onClick={() => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 } } 
                                                        }))}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                                                    >
                                                        <RotateCcw size={10} />
                                                        Default
                                                    </div>
                                                    <input 
                                                        type="color" 
                                                        value={style.color || '#000000'}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, color: e.target.value } } 
                                                        }))}
                                                        className="w-6 h-6 p-0 border-0 rounded cursor-pointer border-none bg-transparent"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-grid gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Font Family</label>
                                                    <select 
                                                        value={style.family}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, family: e.target.value } } 
                                                        }))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                                    >
                                                        <option value="Default">Theme Default</option>
                                                        {INVOICE_FONTS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Font Weight</label>
                                                    <select 
                                                        value={style.weight}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, weight: e.target.value } } 
                                                        }))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                                    >
                                                        <option value="">Default</option>
                                                        <option value="300">Light</option>
                                                        <option value="400">Regular</option>
                                                        <option value="500">Medium</option>
                                                        <option value="600">Semi Bold</option>
                                                        <option value="700">Bold</option>
                                                        <option value="800">Extra Bold</option>
                                                        <option value="900">Black</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Transform</label>
                                                    <select 
                                                        value={style.transform}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, transform: e.target.value } } 
                                                        }))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                                    >
                                                        <option value="default">Default</option>
                                                        <option value="uppercase">ALL CAPS</option>
                                                        <option value="lowercase">lower case</option>
                                                        <option value="capitalize">Capitalize Words</option>
                                                        <option value="none">Sentence case</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Font Size (px)</label>
                                                    <select 
                                                        value={style.size || ''}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, size: e.target.value } } 
                                                        }))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                                    >
                                                        <option value="">Default</option>
                                                        <option value="8">8 px</option>
                                                        <option value="9">9 px</option>
                                                        <option value="10">10 px</option>
                                                        <option value="11">11 px</option>
                                                        <option value="12">12 px</option>
                                                        <option value="14">14 px</option>
                                                        <option value="16">16 px</option>
                                                        <option value="18">18 px</option>
                                                        <option value="20">20 px</option>
                                                        <option value="24">24 px</option>
                                                        <option value="28">28 px</option>
                                                        <option value="32">32 px</option>
                                                        <option value="36">36 px</option>
                                                        <option value="40">40 px</option>
                                                        <option value="48">48 px</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Margin Top (px)</label>
                                                    <input 
                                                        type="number"
                                                        value={style.marginTop || ''}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, marginTop: e.target.value } } 
                                                        }))}
                                                        placeholder="Default"
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Margin Bottom (px)</label>
                                                    <input 
                                                        type="number"
                                                        value={style.marginBottom || ''}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, marginBottom: e.target.value } } 
                                                        }))}
                                                        placeholder="Default"
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                                    />
                                                </div>
                                                <div className="form-field-wrapper space-y-1 col-span-1">
                                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Vertical Shift (mm)</label>
                                                    <input 
                                                        type="range"
                                                        min="-20"
                                                        max="20"
                                                        step="0.5"
                                                        value={style.verticalShift ?? 0}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, verticalShift: parseFloat(e.target.value) } } 
                                                        }))}
                                                        className="w-full h-1 bg-gray-200 accent-blue-600 appearance-none rounded-lg cursor-pointer dark:bg-gray-700"
                                                    />
                                                    <div className="text-right text-[8px] font-bold text-gray-500 dark:text-gray-400">{style.verticalShift ?? 0}mm</div>
                                                </div>
                                                <div className="form-field-wrapper space-y-1 col-span-1">
                                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Height Adjustment (mm)</label>
                                                    <input 
                                                        type="range"
                                                        min="-10"
                                                        max="10"
                                                        step="0.5"
                                                        value={style.height ?? 0}
                                                        onChange={(e) => setSettings(prev => ({ 
                                                            ...prev, 
                                                            sectionStyles: { ...prev.sectionStyles, [section.key]: { ...style, height: parseFloat(e.target.value) } } 
                                                        }))}
                                                        className="w-full h-1 bg-gray-200 accent-blue-600 appearance-none rounded-lg cursor-pointer dark:bg-gray-700"
                                                    />
                                                    <div className="text-right text-[8px] font-bold text-gray-500 dark:text-gray-400">{style.height ?? 0}mm</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CollapsibleSection>
    </>
  );
};
