import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from "../../VisualDesignPaletteData";
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from "../components/InvoicePrintControls";

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const LayoutComponentsSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Layout Components" 
                            isOpen={activeSection === 'layout'} 
                            onToggle={() => toggleSection('layout')}
                            icon={<Layout size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection(['showLogo', 'showHeader', 'showBilling', 'showSignature', 'showCustomerSign', 'showFooterNotes']);
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <RotateCcw size={10} />
                                    Default
                                </div>
                            }
                        >
                            <div className="form-grid gap-3">
                                <ToggleButton 
                                    icon={<ImageIcon size={18} />}
                                    label="Logo"
                                    active={settings.showLogo}
                                    onClick={() => toggleSetting('showLogo')}
                                />
                                <ToggleButton 
                                    icon={<FileText size={18} />}
                                    label="Header"
                                    active={settings.showHeader}
                                    onClick={() => toggleSetting('showHeader')}
                                />
                                <ToggleButton 
                                    icon={<Layout size={18} />}
                                    label="Billing"
                                    active={settings.showBilling}
                                    onClick={() => toggleSetting('showBilling')}
                                />
                                <ToggleButton 
                                    icon={<Signature size={18} />}
                                    label="Seal"
                                    active={settings.showSignature}
                                    onClick={() => toggleSetting('showSignature')}
                                />
                                <ToggleButton 
                                    icon={<Signature size={18} />}
                                    label="Rec. Sign"
                                    active={settings.showCustomerSign}
                                    onClick={() => toggleSetting('showCustomerSign')}
                                />
                                <ToggleButton 
                                    icon={<FileText size={18} />}
                                    label="Comp. Note"
                                    active={settings.showFooterNotes}
                                    onClick={() => toggleSetting('showFooterNotes')}
                                />
                            </div>
                        </CollapsibleSection>
    </>
  );
};
