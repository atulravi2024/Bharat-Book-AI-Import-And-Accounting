import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from "../../VisualDesignPaletteData";
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from "../components/InvoicePrintControls";

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const AestheticPresetsSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Aesthetic Presets" 
                            isOpen={activeSection === 'theme_main'} 
                            onToggle={() => toggleSection('theme_main')}
                            icon={<Palette size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection(['compactMode', 'ultraCompactMode', 'ultraCleanMode', 'useGrayScale']);
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <RotateCcw size={10} />
                                    Default
                                </div>
                            }
                        >
                            <div className="form-grid gap-4">
                                <ToggleButton 
                                    icon={<Maximize size={20} />}
                                    label="Compact Layout"
                                    active={settings.compactMode}
                                    onClick={() => toggleSetting('compactMode')}
                                />
                                <ToggleButton 
                                    icon={<Focus size={20} />}
                                    label="Ultra Compact Layout"
                                    active={settings.ultraCompactMode}
                                    onClick={() => toggleSetting('ultraCompactMode')}
                                />
                                <ToggleButton 
                                    icon={<Printer size={20} />}
                                    label="Ultra Clean Layout"
                                    active={settings.ultraCleanMode}
                                    onClick={() => toggleSetting('ultraCleanMode')}
                                />
                                <ToggleButton 
                                    icon={<Focus size={20} />}
                                    label="Eco Ink Saver"
                                    active={settings.useGrayScale}
                                    onClick={() => toggleSetting('useGrayScale')}
                                />
                            </div>
                            <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <div className="flex gap-3">
                                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600 shrink-0">
                                        <Columns size={16} />
                                    </div>
                                    <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-tight">
                                        These aesthetic toggles can be enabled together or independently to transform the document's visual density and ink consumption.
                                    </p>
                                </div>
                            </div>
                        </CollapsibleSection>
    </>
  );
};
