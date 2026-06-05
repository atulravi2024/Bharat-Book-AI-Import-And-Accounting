import React from 'react';
import { Focus, RotateCcw, Palette, Layout, Grid, Type, Droplet, Hash, CheckSquare, Image as ImageIcon, MapPin, Phone, Mail, Globe, Receipt, Box, Scale, CheckCircle2, Factory, CreditCard, Building2, User, Truck, Calendar, Key, AlertCircle, FileText, QrCode as QRIcon, ListTodo, FileSignature, ReceiptText, Stamp, History, TableProperties, AlignLeft, AlignCenter, AlignRight, Calculator, Columns, Signature, Maximize, ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { VISUAL_THEME_PALETTES } from '../../VisualDesignPaletteData';
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from '../components/InvoicePrintControls';

// Fallbacks for any missing icons used in views
const CheckCircleIcon = CheckCircle2;
const SettingsIcon = FileText;

export const AdvancedPaginationHeadersSection: React.FC<any> = (props) => {
  const { 
    settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
    handleLogoUpload, removeLogo, formatLogoSize, logoInputRef, 
    PlannerVisualizer, plannerPageType, setPlannerPageType, toggleSetting, calculatePageStats,
    INVOICE_FONTS, getSectionStyle
  } = props;
  
  return (
    <>
      <CollapsibleSection 
                            title="Advanced Pagination & Headers" 
                            isOpen={activeSection === 'advanced_pagination'} 
                            onToggle={() => toggleSection('advanced_pagination')}
                            icon={<FileText size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection(['selectedUser', 'headerDisplay', 'pageSubtotalDisplay', 'showPageNumber', 'pageNumberLocation', 'pageNumberAlignment', 'pageNumberFormat']);
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
                                        <label className="form-label px-1">Header Section Display</label>
                                        <select 
                                            value={settings.headerDisplay || 'First Page Only'}
                                            onChange={(e) => setSettings(prev => ({ ...prev, headerDisplay: e.target.value }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            <option value="All Pages">All Pages</option>
                                            <option value="First Page Only">First Page Only</option>
                                            <option value="First & Last Page">First & Last Page Only</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Page Subtotals</label>
                                        <select 
                                            value={settings.pageSubtotalDisplay || 'All Pages'}
                                            onChange={(e) => setSettings(prev => ({ ...prev, pageSubtotalDisplay: e.target.value }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            <option value="All Pages">All Pages</option>
                                            <option value="Last Page Only">Last Page Only</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Select User</label>
                                        <select 
                                            value={settings.selectedUser || 'Admin'}
                                            onChange={(e) => setSettings(prev => ({ ...prev, selectedUser: e.target.value }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Staff">Staff</option>
                                            <option value="System">System</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Show Page Number</label>
                                        <select 
                                            value={settings.showPageNumber || 'Yes'}
                                            onChange={(e) => setSettings(prev => ({ ...prev, showPageNumber: e.target.value }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Page Number Location</label>
                                        <select 
                                            value={settings.pageNumberLocation || 'Bottom'}
                                            onChange={(e) => setSettings(prev => ({ ...prev, pageNumberLocation: e.target.value }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            <option value="Top">Top</option>
                                            <option value="Bottom">Bottom</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Page Number Alignment</label>
                                        <select 
                                            value={settings.pageNumberAlignment || 'Right'}
                                            onChange={(e) => setSettings(prev => ({ ...prev, pageNumberAlignment: e.target.value }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            <option value="Left">Left</option>
                                            <option value="Center">Center</option>
                                            <option value="Right">Right</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="form-label px-1">Page Number Format</label>
                                        <select 
                                            value={settings.pageNumberFormat || 'Page 1 of 3'}
                                            onChange={(e) => setSettings(prev => ({ ...prev, pageNumberFormat: e.target.value }))}
                                            className="form-input text-xs font-bold shadow-sm"
                                        >
                                            <option value="1">1</option>
                                            <option value="Page 1">Page 1</option>
                                            <option value="Page 1 of 3">Page 1 of 3</option>
                                            <option value="- 1 -">- 1 -</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>
    </>
  );
};
