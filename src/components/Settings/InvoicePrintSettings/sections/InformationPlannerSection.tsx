import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from '../../VisualDesignPaletteData';
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from '../components/InvoicePrintControls';
import { PageStatsVisualizer } from '../components/PageStatsVisualizer';

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const InformationPlannerSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Information Planner" 
                            isOpen={activeSection === 'planner'} 
                            onToggle={() => toggleSection('planner')}
                            icon={<Calculator size={18} />}
                            headerActions={null}
                        >
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <label className="form-label px-1">Select Page to Analyze</label>
                                    <select 
                                        value={plannerPageType}
                                        onChange={(e) => setPlannerPageType(e.target.value as any)}
                                        className="form-input text-xs font-bold shadow-sm"
                                    >
                                        <option value="First">First Page items setting</option>
                                        <option value="Middle">Middle Page items setting</option>
                                        <option value="Last">Last Page items setting</option>
                                    </select>
                                </div>
                                <PageStatsVisualizer settings={settings} pageType={plannerPageType} />
                            </div>
                        </CollapsibleSection>
    </>
  );
};
