import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from '../../VisualDesignPaletteData';
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from '../components/InvoicePrintControls';

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const SpaceandMarginSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Space and Margin" 
                            isOpen={activeSection === 'text_styling'} 
                            onToggle={() => toggleSection('text_styling')}
                            icon={<Columns size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection([
                                            'plainSpacing', 
                                            'lineHeight', 
                                            'wordSpacing', 
                                            'paragraphSpacing', 
                                            'headerSpacing', 
                                            'letterSpacing'
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
                                <div className="form-grid gap-6 pt-2">
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Plain Spacing</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="20" 
                                                step="1"
                                                value={settings.plainSpacing ?? 0}
                                                onChange={(e) => setSettings(prev => ({ ...prev, plainSpacing: parseFloat(e.target.value) }))}
                                                className="flex-grow accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                                            />
                                            <span className="text-xs font-black text-gray-900 w-8 tabular-nums dark:text-white">{settings.plainSpacing ?? 0}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="form-label px-1">Line Spacing</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="0.25" 
                                                max="2" 
                                                step="0.05"
                                                value={settings.lineHeight}
                                                onChange={(e) => setSettings(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) }))}
                                                className="flex-grow accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                                            />
                                            <span className="text-xs font-black text-gray-900 w-8 tabular-nums dark:text-white">{settings.lineHeight}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="form-label px-1">Text Spacing (px)</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="10" 
                                                step="0.5"
                                                value={settings.wordSpacing ?? 0}
                                                onChange={(e) => setSettings(prev => ({ ...prev, wordSpacing: parseFloat(e.target.value) }))}
                                                className="flex-grow accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                                            />
                                            <span className="text-xs font-black text-gray-900 w-8 tabular-nums dark:text-white">{settings.wordSpacing ?? 0}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="form-label px-1">Paragraph Spacing (px)</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="20" 
                                                step="1"
                                                value={settings.paragraphSpacing ?? 0}
                                                onChange={(e) => setSettings(prev => ({ ...prev, paragraphSpacing: parseFloat(e.target.value) }))}
                                                className="flex-grow accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                                            />
                                            <span className="text-xs font-black text-gray-900 w-8 tabular-nums dark:text-white">{settings.paragraphSpacing ?? 0}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="form-label px-1">Header Spacing (px)</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="20" 
                                                step="1"
                                                value={settings.headerSpacing ?? 0}
                                                onChange={(e) => setSettings(prev => ({ ...prev, headerSpacing: parseFloat(e.target.value) }))}
                                                className="flex-grow accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                                            />
                                            <span className="text-xs font-black text-gray-900 w-8 tabular-nums dark:text-white">{settings.headerSpacing ?? 0}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="form-label px-1">Character Spacing (px)</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="-1" 
                                                max="5" 
                                                step="0.5"
                                                value={settings.letterSpacing}
                                                onChange={(e) => setSettings(prev => ({ ...prev, letterSpacing: parseFloat(e.target.value) }))}
                                                className="flex-grow accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                                            />
                                            <span className="text-xs font-black text-gray-900 w-8 tabular-nums dark:text-white">{settings.letterSpacing}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>
    </>
  );
};
