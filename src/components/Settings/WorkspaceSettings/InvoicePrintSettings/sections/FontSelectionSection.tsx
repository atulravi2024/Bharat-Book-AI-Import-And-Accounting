import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from "../../VisualDesignPaletteData";
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from "../components/InvoicePrintControls";

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const FontSelectionSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Font Selection" 
                            isOpen={activeSection === 'font_selection'} 
                            onToggle={() => toggleSection('font_selection')}
                            icon={<Type size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection([
                                            'fontFamily', 
                                            'baseFontSize', 
                                            'headingScale', 
                                            'fontWeight', 
                                            'textTransform'
                                        ]);
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <RotateCcw size={10} />
                                    Default
                                </div>
                            }
                        >
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="form-label px-1">Primary Font Family</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none group-focus-within:scale-110 transition-transform">
                                            <Type size={18} />
                                        </div>
                                        <select
                                            value={settings.fontFamily}
                                            onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                                            className="form-input rounded-2xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 appearance-none cursor-pointer shadow-sm hover:border-blue-200"
                                            style={{ fontFamily: settings.fontFamily !== 'Default' ? settings.fontFamily : 'inherit' }}
                                        >
                                            {INVOICE_FONTS.map((font) => (
                                                <option key={font.id} value={font.id} className="font-sans">
                                                    {font.label} ({font.category})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-hover:text-blue-400 transition-colors">
                                            <Columns size={14} className="rotate-90" />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1 px-1">
                                        {['Sans', 'Serif', 'Mono', 'Display'].map(cat => (
                                            <span key={cat} className="text-[8px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full uppercase tracking-tighter dark:bg-gray-900">
                                                {cat} Optimized
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-grid gap-6 pt-2 border-t border-gray-100 mt-4 dark:border-gray-800">
                                    <div className="space-y-3 mt-4">
                                        <label className="form-label px-1">Base Font size (px)</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="8" 
                                                max="24" 
                                                step="0.5"
                                                value={settings.baseFontSize}
                                                onChange={(e) => setSettings(prev => ({ ...prev, baseFontSize: parseFloat(e.target.value) }))}
                                                className="flex-grow accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                                            />
                                            <span className="text-xs font-black text-gray-900 w-8 tabular-nums bg-gray-50 px-2 py-1 rounded-md text-center dark:text-white dark:bg-gray-900">{settings.baseFontSize}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mt-4">
                                        <label className="form-label px-1">Heading Scale</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="1" 
                                                max="3" 
                                                step="0.1"
                                                value={settings.headingScale}
                                                onChange={(e) => setSettings(prev => ({ ...prev, headingScale: parseFloat(e.target.value) }))}
                                                className="flex-grow accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                                            />
                                            <span className="text-xs font-black text-gray-900 w-8 tabular-nums bg-gray-50 px-2 py-1 rounded-md text-center dark:text-white dark:bg-gray-900">{settings.headingScale}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-grid gap-4 pt-2">
                                    <div className="space-y-2">
                                        <label className="form-label px-1">Font Weight</label>
                                        <select 
                                            value={settings.fontWeight}
                                            onChange={(e) => setSettings(prev => ({ ...prev, fontWeight: e.target.value }))}
                                            className="form-input text-[10px] font-black uppercase tracking-widest shadow-sm"
                                        >
                                            <option value="300">Light</option>
                                            <option value="400">Regular</option>
                                            <option value="500">Medium</option>
                                            <option value="600">Semi Bold</option>
                                            <option value="700">Bold</option>
                                            <option value="800">Extra Bold</option>
                                            <option value="900">Black</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="form-label px-1">Text Transform</label>
                                        <select 
                                            value={settings.textTransform}
                                            onChange={(e) => setSettings(prev => ({ ...prev, textTransform: e.target.value }))}
                                            className="form-input text-[10px] font-black uppercase tracking-widest shadow-sm"
                                        >
                                            <option value="default">Default</option>
                                            <option value="uppercase">ALL CAPS</option>
                                            <option value="lowercase">lower case</option>
                                            <option value="capitalize">Capitalize Words</option>
                                            <option value="none">Sentence case</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>
    </>
  );
};
