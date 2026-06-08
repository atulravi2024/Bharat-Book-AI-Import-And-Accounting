import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from "../../VisualDesignPaletteData";
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from "../components/InvoicePrintControls";

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const AccountingERPThemesSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Accounting & ERP Themes" 
                            isOpen={activeSection === 'design-accounting'} 
                            onToggle={() => toggleSection('design-accounting')}
                            icon={<Focus size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection(['designLayout']);
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <RotateCcw size={10} />
                                    Default
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="form-grid gap-2 pr-1">
                                        {VISUAL_THEME_PALETTES.filter(t => ['Modern', 'Tally', 'Vyapar', 'Busy', 'Academic', 'Classic', 'Technical', 'Bold'].includes(t.id)).map((opt) => {
                                            const active = settings.designLayout === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setSettings(prev => ({ ...prev, designLayout: opt.id as any }))}
                                                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                                        active 
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                                                        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/10'
                                                    } dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400`}
                                                >
                                                    <div className={`p-1 rounded-lg transition-colors shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-gray-50 text-blue-600'} dark:bg-gray-900`}>
                                                        {React.isValidElement(opt.icon) ? React.cloneElement(opt.icon as any, { size: 12 }) : opt.icon}
                                                    </div>
                                                    <div className="flex-grow text-left overflow-hidden">
                                                        <span className={`block text-[8px] font-black uppercase tracking-tight whitespace-nowrap mb-[-2px] ${active ? 'text-white' : 'text-gray-900'} dark:text-white`}>{opt.label}</span>
                                                        <span className={`text-[6px] font-bold uppercase opacity-60 ${active ? 'text-blue-100' : 'text-gray-400'}`}>{opt.sub}</span>
                                                    </div>
                                                    <div className={`w-5 h-2.5 rounded-full relative transition-colors shrink-0 ${active ? 'bg-white/30' : 'bg-gray-200'} dark:bg-gray-700`}>
                                                        <div className={`absolute top-0.5 w-1.5 h-1.5 rounded-full bg-white transition-all shadow-sm ${active ? 'right-0.5' : 'left-0.5'} dark:bg-gray-800`} />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>
    </>
  );
};
