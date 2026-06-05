import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from '../../VisualDesignPaletteData';
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from '../components/InvoicePrintControls';

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const PageDimensionsSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Page Dimensions" 
                            isOpen={activeSection === 'theme'} 
                            onToggle={() => toggleSection('theme')}
                            icon={<Columns size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection(['pageSize', 'pageOrientation', 'pageMargin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight']);
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <RotateCcw size={10} />
                                    Default
                                </div>
                            }
                        >
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="form-label px-1">Paper Standard</label>
                                    <SegmentedControl 
                                        options={[
                                            { id: 'A4', label: 'A4', sub: 'Standard' },
                                            { id: 'A5', label: 'A5', sub: 'Small' },
                                            { id: 'Letter', label: 'Letter', sub: 'US' },
                                            { id: 'Legal', label: 'Legal', sub: 'Long' },
                                            { id: 'Thermal', label: 'Thermal', sub: 'Heat POS' }
                                        ]}
                                        value={settings.pageSize}
                                        onChange={(val) => setSettings(prev => ({ ...prev, pageSize: val }))}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="form-label px-1">Page Orientation</label>
                                    <SegmentedControl 
                                        options={[
                                            { id: 'Portrait', label: 'Portrait', sub: 'Vertical' },
                                            { id: 'Landscape', label: 'Landscape', sub: 'Horizontal' }
                                        ]}
                                        value={settings.pageOrientation || 'Portrait'}
                                        onChange={(val) => setSettings(prev => ({ ...prev, pageOrientation: val }))}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="form-label px-1">Margin Profile</label>
                                    <SegmentedControl 
                                        options={[
                                            { id: 'Zero', label: 'Zero', sub: '0"' },
                                            { id: 'Minimal', label: 'Min', sub: '.25"' },
                                            { id: 'Narrow', label: 'Nar', sub: '.5"' },
                                            { id: 'Normal', label: 'Reg', sub: '1.0"' },
                                            { id: 'Wide', label: 'Wide', sub: '1.5"' },
                                            { id: 'Custom', label: 'Cst', sub: '...' }
                                        ]}
                                        value={settings.pageMargin}
                                        onChange={(val) => {
                                            let margins = { top: 1.0, bottom: 1.0, left: 1.0, right: 1.0 };
                                            if (val === 'Zero') margins = { top: 0, bottom: 0, left: 0, right: 0 };
                                            if (val === 'Minimal') margins = { top: 0.25, bottom: 0.25, left: 0.25, right: 0.25 };
                                            if (val === 'Narrow') margins = { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 };
                                            if (val === 'Wide') margins = { top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 };
                                            
                                            setSettings(prev => ({ 
                                                ...prev, 
                                                pageMargin: val,
                                                marginTop: margins.top,
                                                marginBottom: margins.bottom,
                                                marginLeft: margins.left,
                                                marginRight: margins.right
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Maximize size={14} className="text-blue-600" />
                                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest dark:text-white">Custom Margins (Inches)</h4>
                                    </div>
                                    <div className="form-grid gap-4">
                                        <MarginInput 
                                            label="Top" 
                                            value={settings.marginTop} 
                                            onChange={(val) => setSettings(prev => ({ ...prev, marginTop: val, pageMargin: 'Custom' }))} 
                                        />
                                        <MarginInput 
                                            label="Bottom" 
                                            value={settings.marginBottom} 
                                            onChange={(val) => setSettings(prev => ({ ...prev, marginBottom: val, pageMargin: 'Custom' }))} 
                                        />
                                        <MarginInput 
                                            label="Left" 
                                            value={settings.marginLeft} 
                                            onChange={(val) => setSettings(prev => ({ ...prev, marginLeft: val, pageMargin: 'Custom' }))} 
                                        />
                                        <MarginInput 
                                            label="Right" 
                                            value={settings.marginRight} 
                                            onChange={(val) => setSettings(prev => ({ ...prev, marginRight: val, pageMargin: 'Custom' }))} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>
    </>
  );
};
