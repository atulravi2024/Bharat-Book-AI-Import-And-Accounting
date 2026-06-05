import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from '../../VisualDesignPaletteData';
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from '../components/InvoicePrintControls';

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const DataVisibilitySection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Data Visibility" 
                            isOpen={activeSection === 'data'} 
                            onToggle={() => toggleSection('data')}
                            icon={<Calculator size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection(['showHSN', 'showQty', 'showRate', 'showMrp', 'showDiscountPercentage', 'showDiscountAmount', 'showHsnSummary', 'showTaxDetails', 'showAmountInWords', 'showNarration']);
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
                                    icon={<Hash size={18} />}
                                    label="HSN Codes"
                                    active={settings.showHSN}
                                    onClick={() => toggleSetting('showHSN')}
                                />
                                <ToggleButton 
                                    icon={<Calculator size={18} />}
                                    label="Quantity"
                                    active={settings.showQty}
                                    onClick={() => toggleSetting('showQty')}
                                />
                                <ToggleButton 
                                    icon={<Calculator size={18} />}
                                    label="Rate"
                                    active={settings.showRate}
                                    onClick={() => toggleSetting('showRate')}
                                />
                                <ToggleButton 
                                    icon={<Calculator size={18} />}
                                    label="MRP"
                                    active={settings.showMrp}
                                    onClick={() => toggleSetting('showMrp')}
                                />
                                <ToggleButton 
                                    icon={<Calculator size={18} />}
                                    label="Disc. (%)"
                                    active={settings.showDiscountPercentage}
                                    onClick={() => toggleSetting('showDiscountPercentage')}
                                />
                                <ToggleButton 
                                    icon={<Calculator size={18} />}
                                    label="Disc. (Amt)"
                                    active={settings.showDiscountAmount}
                                    onClick={() => toggleSetting('showDiscountAmount')}
                                />
                                <ToggleButton 
                                    icon={<FileText size={18} />}
                                    label="HSN Summary"
                                    active={settings.showHsnSummary}
                                    onClick={() => toggleSetting('showHsnSummary')}
                                />
                                <ToggleButton 
                                    icon={<FileText size={18} />}
                                    label="Tax Detail"
                                    active={settings.showTaxDetails}
                                    onClick={() => toggleSetting('showTaxDetails')}
                                />
                                <ToggleButton 
                                    icon={<Type size={18} />}
                                    label="Amount Words"
                                    active={settings.showAmountInWords}
                                    onClick={() => toggleSetting('showAmountInWords')}
                                />
                                <ToggleButton 
                                    icon={<FileText size={18} />}
                                    label="Narration"
                                    active={settings.showNarration}
                                    onClick={() => toggleSetting('showNarration')}
                                />
                            </div>
                        </CollapsibleSection>
    </>
  );
};
