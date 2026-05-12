import React, { useState, useEffect, useRef } from 'react';
import { numberToWords } from '../../lib/numberToWords';
import { SettingsIcon, CheckCircleIcon } from '../icons/IconComponents';
import { ToggleLeft, ToggleRight, Layout, Type, FileText, Image as ImageIcon, Signature, Hash, Calculator, Printer, Maximize, Focus, Palette, Columns, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { VoucherPreview } from '../Operations/VoucherEntry/VoucherPreview';
import { VISUAL_THEME_PALETTES } from './VisualDesignPaletteData';

const INVOICE_FONTS = [
    { id: 'Default', label: 'Theme Default', category: 'Smart' },
    { id: 'Inter', label: 'Inter', category: 'Modern Sans' },
    { id: 'Roboto', label: 'Roboto', category: 'Clean Sans' },
    { id: 'Open Sans', label: 'Open Sans', category: 'Neutral Sans' },
    { id: 'Montserrat', label: 'Montserrat', category: 'Geometric Sans' },
    { id: 'Lato', label: 'Lato', category: 'Friendly Sans' },
    { id: 'Poppins', label: 'Poppins', category: 'Geometric Sans' },
    { id: 'Playfair Display', label: 'Playfair Display', category: 'Elegant Serif' },
    { id: 'Merriweather', label: 'Merriweather', category: 'Readable Serif' },
    { id: 'PT Serif', label: 'PT Serif', category: 'Classic Serif' },
    { id: 'Source Serif Pro', label: 'Source Serif Pro', category: 'Formal Serif' },
    { id: 'JetBrains Mono', label: 'JetBrains Mono', category: 'Developer Mono' },
    { id: 'Roboto Mono', label: 'Roboto Mono', category: 'Technical Mono' },
    { id: 'Space Grotesk', label: 'Space Grotesk', category: 'Display Art' },
    { id: 'Oswald', label: 'Oswald', category: 'Display Narrow' },
    { id: 'Raleway', label: 'Raleway', category: 'Display Thin' },
    { id: 'Work Sans', label: 'Work Sans', category: 'Display Bold' },
    { id: 'Ubuntu', label: 'Ubuntu', category: 'Brand Sans' },
    { id: 'Fira Sans', label: 'Fira Sans', category: 'Technical Sans' },
    { id: 'Nunito', label: 'Nunito', category: 'Rounded' },
    { id: 'Quicksand', label: 'Quicksand', category: 'Soft Rounded' },
    { id: 'Josefin Sans', label: 'Josefin Sans', category: 'Vintage Sans' },
    { id: 'PT Sans', label: 'PT Sans', category: 'Modern Sans' },
    { id: 'Source Sans Pro', label: 'Source Sans Pro', category: 'Professional Sans' },
];

export const InvoicePrintSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        showLogo: true,
        showHeader: true,
        showBilling: true,
        showHSN: true,
        showQty: true,
        showRate: true,
        showMrp: true,
        showDiscountPercentage: true,
        showDiscountAmount: true,
        showTaxDetails: true,
        showAmountInWords: true,
        showNarration: true,
        showFooterNotes: true,
        showTaxSummary: true,
        showHsnSummary: true,
        showSignature: true,
        showCustomerSign: true,
        compactMode: true,
        ultraCompactMode: false,
        ultraCleanMode: false,
        useGrayScale: false,
        pageSize: 'A4',
        pageOrientation: 'Portrait',
        pageMargin: 'Narrow',
        marginTop: 0.5,
        marginBottom: 0.5,
        marginLeft: 0.5,
        marginRight: 0.5,
        designLayout: 'Modern',
        colorPalette: 'Default',
        fontFamily: 'Default',
        baseFontSize: 10,
        headingScale: 1.2,
        lineHeight: 1,
        letterSpacing: 0,
        wordSpacing: 0,
        paragraphSpacing: 0,
        headerSpacing: 0,
        plainSpacing: 0,
        fontWeight: '400',
        textTransform: 'default',
        sectionStyles: {
            lineItem: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            header: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            subheader: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            companyName: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            companyAddress: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            partyName: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            partyAddress: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            tableHeader: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            amountInWords: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            narration: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            taxDetails: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            signatures: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            grandTotal: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 }
        }
    });

    const [isSaved, setIsSaved] = useState(false);

    const DEFAULT_SETTINGS = {
        showLogo: true,
        showHeader: true,
        showBilling: true,
        showHSN: true,
        showQty: true,
        showRate: true,
        showMrp: true,
        showDiscountPercentage: true,
        showDiscountAmount: true,
        showTaxDetails: true,
        showAmountInWords: true,
        showNarration: true,
        showFooterNotes: true,
        showTaxSummary: true,
        showHsnSummary: true,
        showSignature: true,
        showCustomerSign: true,
        compactMode: true,
        ultraCompactMode: false,
        ultraCleanMode: false,
        useGrayScale: false,
        pageSize: 'A4',
        pageOrientation: 'Portrait',
        pageMargin: 'Narrow',
        marginTop: 0.5,
        marginBottom: 0.5,
        marginLeft: 0.5,
        marginRight: 0.5,
        designLayout: 'Modern',
        colorPalette: 'Default',
        fontFamily: 'Default',
        baseFontSize: 10,
        headingScale: 1.2,
        lineHeight: 1,
        letterSpacing: 0,
        wordSpacing: 0,
        paragraphSpacing: 0,
        headerSpacing: 0,
        plainSpacing: 0,
        fontWeight: '400',
        textTransform: 'default',
        sectionStyles: {
            lineItem: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            header: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            subheader: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            companyName: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            companyAddress: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            partyName: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            partyAddress: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            tableHeader: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            amountInWords: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            narration: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            taxDetails: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            signatures: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 },
            grandTotal: { color: '', weight: '', transform: 'default', family: 'Default', size: '', marginTop: '', marginBottom: '', verticalShift: 0, height: 0 }
        }
    };

    const resetSettingsForSection = (keys: (keyof typeof settings)[], sectionStylesKeys?: string[]) => {
        setSettings(prev => {
            const next = { ...prev };
            keys.forEach(key => {
                (next as any)[key] = (DEFAULT_SETTINGS as any)[key];
            });
            if (sectionStylesKeys) {
                sectionStylesKeys.forEach(key => {
                    next.sectionStyles[key as keyof typeof next.sectionStyles] = (DEFAULT_SETTINGS.sectionStyles as any)[key];
                });
            }
            return next;
        });
    };

    useEffect(() => {
        const saved = localStorage.getItem('bharat_book_print_settings_v3');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse saved settings", e);
            }
        }
    }, []);

    const resetAllSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    const handleSave = () => {
        localStorage.setItem('bharat_book_print_settings_v3', JSON.stringify(settings));
        setIsSaved(true);
        window.dispatchEvent(new Event('print_settings_updated'));
        setTimeout(() => setIsSaved(false), 2000);
    };

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const [autoScale, setAutoScale] = useState(0.4);
    const [manualZoom, setManualZoom] = useState<number | null>(null);
    const previewScale = isNaN(manualZoom !== null ? (manualZoom as number) : autoScale) ? 0.4 : (manualZoom !== null ? manualZoom : autoScale);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = () => setManualZoom(prev => Math.min((prev || autoScale) + 0.1, 2));
    const handleZoomOut = () => setManualZoom(prev => Math.max((prev || autoScale) - 0.1, 0.2));
    const handleResetZoom = () => {
        if (previewContainerRef.current) {
            previewContainerRef.current.scrollTop = 0;
            previewContainerRef.current.scrollLeft = 0;
        }
        setManualZoom(null);
        
        requestAnimationFrame(() => {
            if (previewContainerRef.current) {
                previewContainerRef.current.scrollTop = 0;
                previewContainerRef.current.scrollLeft = 0;
            }
        });
    };
    const handleFullSize = () => setManualZoom(1);

    useEffect(() => {
        const updateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.clientWidth - 32;
                const containerHeight = previewContainerRef.current.clientHeight - 32;
                
                // Use dimensions of current pageSize instead of dynamic content height
                let docWidth = 794;
                let docHeight = 1123;
                switch (settings.pageSize) {
                    case 'A5': docWidth = 559; docHeight = 794; break;
                    case 'Letter': docWidth = 816; docHeight = 1056; break;
                    case 'Legal': docWidth = 816; docHeight = 1344; break;
                    case 'A4':
                    default: docWidth = 794; docHeight = 1123; break;
                }
                if (settings.pageOrientation === 'Landscape') {
                    const temp = docWidth;
                    docWidth = docHeight;
                    docHeight = temp;
                }

                // We want zero padding to maximize scale on small screens.
                const scaleW = containerWidth / docWidth;
                const scaleH = containerHeight / docHeight;
                setAutoScale(Math.min(scaleW, scaleH, 1.5));
            }
        };

        const observer = new ResizeObserver(updateScale);
        if (previewContainerRef.current) observer.observe(previewContainerRef.current);
        
        const previewDoc = document.getElementById('voucher-preview-document');
        if (previewDoc) observer.observe(previewDoc);
        
        // Use a small timeout to ensure initial layout is stable
        const timer = setTimeout(updateScale, 100);
        
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [settings]);

    const [dummyHeader, setDummyHeader] = useState<any>({
        voucherNumber: '-',
        entryNumber: '-',
        voucherDate: '-',
        partyName: '-',
        billingPartyName: '-',
        billingAddress: '-',
        billingState: '-',
        billingPinCode: '-',
        billingContact: '-',
        gstNumber: '-',
        narration: '-',
        referenceNo: '-',
        poNumber: '-'
    });

    const [dummyRows, setDummyRows] = useState<any[]>([]);
    const [dummyTotals, setDummyTotals] = useState<any>({
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        grandTotal: 0,
        finalValue: 0
    });

    useEffect(() => {
        const loadDummyData = async () => {
            try {
                const response = await fetch('/sample-data/reports/invoice_dummy_data.json');
                if (response.ok) {
                    const data = await response.json();
                    setDummyHeader(data.header);
                    setDummyRows(data.rows);
                    setDummyTotals(data.totals);
                }
            } catch (e) {
                console.error("Failed to load dummy invoice data", e);
            }
        };
        loadDummyData();
    }, []);

    const [activeSection, setActiveSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Configuration Section */}
            <div className="flex-1 space-y-6">
                <div className="bg-white rounded-[2rem] py-4 border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                    <div className="flex items-center gap-4 mb-8 px-8">
                        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <Layout size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight dark:text-white">Print Layout Configuration</h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customize what appears on your generated invoices and vouchers</p>
                        </div>
                    </div>

                    <div className="flex flex-col border-t border-gray-100 dark:border-gray-800">
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
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pr-1">
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
                                                        {React.isValidElement(opt.icon) ? React.cloneElement(opt.icon as React.ReactElement, { size: 12 }) : opt.icon}
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

                        <CollapsibleSection 
                            title="Color Spectrum Palettes" 
                            isOpen={activeSection === 'design-colors'} 
                            onToggle={() => toggleSection('design-colors')}
                            icon={<Palette size={18} />}
                            headerActions={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSettingsForSection(['colorPalette']);
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
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pr-1">
                                        {VISUAL_THEME_PALETTES.filter(t => ['Eco', 'Royal', 'Sunset', 'Ocean', 'Midnight', 'Slate', 'Crimson', 'Forest', 'Minimal', 'Professional', 'Retail'].includes(t.id)).map((opt) => {
                                            const active = settings.colorPalette === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setSettings(prev => ({ ...prev, colorPalette: active ? 'Default' : opt.id as any }))}
                                                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                                        active 
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                                                        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/10'
                                                    } dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400`}
                                                >
                                                    <div className={`p-1 rounded-lg transition-colors shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-gray-50 text-blue-600'} dark:bg-gray-900`}>
                                                        {React.isValidElement(opt.icon) ? React.cloneElement(opt.icon as React.ReactElement, { size: 12 }) : opt.icon}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Primary Font Family</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none group-focus-within:scale-110 transition-transform">
                                            <Type size={18} />
                                        </div>
                                        <select
                                            value={settings.fontFamily}
                                            onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-xs font-black text-gray-900 uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all appearance-none cursor-pointer shadow-sm hover:border-blue-200 dark:bg-gray-800 dark:border-gray-800 dark:text-white"
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100 mt-4 dark:border-gray-800">
                                    <div className="space-y-3 mt-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Base Font size (px)</label>
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
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Heading Scale</label>
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

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Font Weight</label>
                                        <select 
                                            value={settings.fontWeight}
                                            onChange={(e) => setSettings(prev => ({ ...prev, fontWeight: e.target.value }))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm dark:bg-gray-900 dark:border-gray-800"
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
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Text Transform</label>
                                        <select 
                                            value={settings.textTransform}
                                            onChange={(e) => setSettings(prev => ({ ...prev, textTransform: e.target.value }))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm dark:bg-gray-900 dark:border-gray-800"
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Plain Spacing</label>
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
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Line Spacing</label>
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
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Text Spacing (px)</label>
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
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Paragraph Spacing (px)</label>
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
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Header Spacing (px)</label>
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
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Character Spacing (px)</label>
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
                                            <div className="grid grid-cols-2 gap-3">
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
                                                <div className="space-y-1 col-span-1">
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
                                                <div className="space-y-1 col-span-1">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Paper Standard</label>
                                    <SegmentedControl 
                                        options={[
                                            { id: 'A4', label: 'A4', sub: 'Standard' },
                                            { id: 'A5', label: 'A5', sub: 'Small' },
                                            { id: 'Letter', label: 'Letter', sub: 'US' },
                                            { id: 'Legal', label: 'Legal', sub: 'Long' }
                                        ]}
                                        value={settings.pageSize}
                                        onChange={(val) => setSettings(prev => ({ ...prev, pageSize: val }))}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Page Orientation</label>
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
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Margin Profile</label>
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
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-4 px-8 dark:border-gray-800">
                        <div className={`transition-all duration-500 flex items-center justify-center gap-2 ${isSaved ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                            <CheckCircleIcon size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Settings Synchronized</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                             <button 
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-2 px-5 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                             >
                                <Printer size={16} /> TEST
                             </button>
                             <button 
                                onClick={handleSave}
                                className="px-5 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                SAVE
                                <Layout size={14} />
                            </button>
                            <button 
                                onClick={resetAllSettings}
                                className="px-5 py-4 bg-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 dark:bg-gray-800 dark:text-gray-300"
                            >
                                <RotateCcw size={14} />
                                DEFAULT
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4 items-start">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                        <InfoIcon size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Expert Formatting Tip</h4>
                        <p className="text-xs text-amber-700 font-medium leading-relaxed uppercase tracking-tighter opacity-80 italic">
                            Disabling HSN/SAC and Tax details creates a cleaner "Commercial Invoice" look for non-taxable transactions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Live Preview Section */}
            <div className="w-full lg:w-[480px] xl:w-[600px] shrink-0 sticky top-8 flex flex-col gap-4">
                <div className="bg-gray-200/50 rounded-[2.5rem] shadow-inner border border-gray-100 overflow-hidden h-[85vh] min-h-[600px] max-h-[1000px] flex flex-col items-center justify-center relative dark:border-gray-800">
                    <div className="absolute top-6 left-10 text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">
                        Live Engine Output
                    </div>

                    <div ref={previewContainerRef} className={`w-full h-full p-4 flex ${manualZoom === null ? 'items-center justify-center overflow-hidden' : 'items-start overflow-auto'} pointer-events-auto`}>
                        {manualZoom === null ? (
                            <div 
                                className="origin-center pointer-events-none transition-transform duration-300 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15),0_18px_36px_-18px_rgba(0,0,0,0.2)] bg-white dark:bg-gray-800"
                                style={{ transform: `scale(${previewScale})` }}
                            >
                                <VoucherPreviewComponent 
                                    header={dummyHeader}
                                    rows={dummyRows}
                                    totals={dummyTotals}
                                    type="Sales_Invoice"
                                    config={settings}
                                />
                            </div>
                        ) : (
                            <div className="transition-all duration-300 relative flex-shrink-0" style={{ width: `${(settings.pageSize === 'A5' ? 559 : settings.pageSize === 'Letter' ? 816 : 794) * previewScale}px`, height: `${(settings.pageSize === 'A5' ? 794 : settings.pageSize === 'Letter' ? 1056 : 1123) * previewScale}px`, margin: '0 auto' }}>
                                <div 
                                    className="transition-transform duration-300 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15),0_18px_36px_-18px_rgba(0,0,0,0.2)] bg-white absolute top-0 left-0 origin-top-left dark:bg-gray-800"
                                    style={{ transform: `scale(${previewScale})` }}
                                >
                                    <VoucherPreviewComponent 
                                        header={dummyHeader}
                                        rows={dummyRows}
                                        totals={dummyTotals}
                                        type="Sales_Invoice"
                                        config={settings}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center bg-white border border-gray-200 shadow-sm rounded-full p-2 gap-2 mx-auto no-print dark:bg-gray-800 dark:border-gray-700">
                    <button 
                        onClick={handleZoomOut}
                        className="p-2.5 hover:bg-gray-100 rounded-full text-black transition-all active:scale-95 dark:hover:bg-gray-600"
                        title="Zoom Out"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <div className="w-16 text-center text-sm font-black text-black tabular-nums">
                        {Math.round(previewScale * 100)}%
                    </div>
                    <button 
                        onClick={handleZoomIn}
                        className="p-2.5 hover:bg-gray-100 rounded-full text-black transition-all active:scale-95 dark:hover:bg-gray-600"
                        title="Zoom In"
                    >
                        <ZoomIn size={18} />
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-2 dark:bg-gray-700" />
                    <button 
                        onClick={handleResetZoom}
                        className={`p-2 rounded-full transition-all active:scale-95 flex items-center justify-center px-4 gap-2 ${manualZoom === null ? 'bg-gray-100 font-bold text-black' : 'text-black hover:bg-gray-100'} dark:bg-gray-800 dark:hover:bg-gray-600`}
                        title="Fit to Screen"
                    >
                        <RotateCcw size={16} />
                        <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">Fit</span>
                    </button>
                    <button 
                        onClick={handleFullSize}
                        className={`p-2 rounded-full transition-all active:scale-95 flex items-center justify-center px-4 gap-2 ${manualZoom === 1 ? 'bg-gray-100 font-bold text-black' : 'text-black hover:bg-gray-100'} dark:bg-gray-800 dark:hover:bg-gray-600`}
                        title="Actual Size (100%)"
                    >
                        <Maximize size={16} />
                        <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">100%</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const CollapsibleSection: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode; 
    isOpen: boolean; 
    onToggle: () => void;
    headerActions?: React.ReactNode;
}> = ({ title, icon, children, isOpen, onToggle, headerActions }) => (
    <div className={`border-b transition-all duration-300 ${isOpen ? 'bg-white' : 'hover:bg-gray-50/50'} border-gray-100 dark:bg-gray-800 dark:border-gray-800`}>
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-6 px-8 text-left focus:outline-none"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'} dark:bg-gray-800`}>
                    {icon}
                </div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest dark:text-white">{title}</h3>
            </div>
            <div className="flex items-center gap-4">
                {headerActions && <div onClick={(e) => e.stopPropagation()}>{headerActions}</div>}
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
        </button>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100 px-8 pb-8' : 'max-h-0 opacity-0 pb-0'}`}>
            <div className="pt-2">
                {children}
            </div>
        </div>
    </div>
);

const ToggleButton: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    active: boolean; 
    onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
            active 
            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
            : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/10'
        } dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400`}
    >
        <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-white/20 text-white' : 'bg-gray-50 text-blue-600'} dark:bg-gray-900`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 14 }) : icon}
        </div>
        <div className="flex-grow text-left flex items-center gap-2 overflow-hidden">
            <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${active ? 'text-white' : 'text-gray-900'} dark:text-white`}>{label}</span>
            <span className={`text-[7px] font-black uppercase tracking-tight opacity-70 ${active ? 'text-blue-100' : 'text-gray-400'}`}>
                {active ? 'Active' : 'Off'}
            </span>
        </div>
        <div className={`w-8 h-4 rounded-full relative transition-colors shrink-0 ${active ? 'bg-white/30' : 'bg-gray-200'} dark:bg-gray-700`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${active ? 'right-0.5' : 'left-0.5'} dark:bg-gray-800`} />
        </div>
    </button>
);

const SegmentedControl: React.FC<{
    options: { id: string, label: string, sub?: string, icon?: React.ReactNode }[];
    value: string;
    onChange: (val: string) => void;
}> = ({ options, value, onChange }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((opt) => {
            const active = value === opt.id;
            return (
                <button
                    key={opt.id}
                    onClick={() => onChange(opt.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                        active 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/10'
                    } dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400`}
                >
                    {opt.icon && (
                        <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-gray-50 text-blue-600'} dark:bg-gray-900`}>
                            {React.isValidElement(opt.icon) ? React.cloneElement(opt.icon as React.ReactElement, { size: 14 }) : opt.icon}
                        </div>
                    )}
                    <div className="flex-grow text-left flex items-baseline gap-1.5 overflow-hidden">
                        <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${active ? 'text-white' : 'text-gray-900'} dark:text-white`}>{opt.label}</span>
                        {opt.sub && (
                            <span className={`text-[7px] font-black uppercase tracking-tight opacity-70 whitespace-nowrap ${active ? 'text-blue-100' : 'text-gray-400'}`}>
                                {opt.sub}
                            </span>
                        )}
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors shrink-0 ${active ? 'bg-white/30' : 'bg-gray-200'} dark:bg-gray-700`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${active ? 'right-0.5' : 'left-0.5'} dark:bg-gray-800`} />
                    </div>
                </button>
            );
        })}
    </div>
);

const MarginInput: React.FC<{ label: string, value: number, onChange: (val: number) => void }> = ({ label, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
        <div className="relative group">
            <input 
                type="number" 
                step="0.1" 
                min="0"
                value={value ?? ''} 
                onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                        onChange(0);
                    } else {
                        onChange(parseFloat(val) || 0);
                    }
                }}
                className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-200 transition-all dark:bg-gray-800 dark:border-gray-800 dark:text-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300 pointer-events-none group-focus-within:text-blue-400">IN</div>
        </div>
    </div>
);

// Internal simplified version of VoucherPreview for settings preview only
// We don't want to use the full modal version here to avoid recursion/portal issues in a small frame
const VoucherPreviewComponent: React.FC<{ header: any, rows: any[], totals: any, type: string, config: any }> = ({ header, rows, totals, type, config }) => {
    const getSectionStyle = (key: string, baseClasses: string, styleOverrides?: React.CSSProperties) => {
        const style = (config.sectionStyles as any)?.[key];
        let classes = baseClasses;
        let inlineStyle: React.CSSProperties = { ...styleOverrides };

        if (!style) return { className: classes, style: inlineStyle };

        if (style.color) inlineStyle.color = style.color;
        if (style.weight) inlineStyle.fontWeight = style.weight;
        if (style.family && style.family !== 'Default') inlineStyle.fontFamily = style.family;
        if (style.size && style.size !== '') inlineStyle.fontSize = `${style.size}px`;
        
        if (style.transform && style.transform !== 'default') {
            inlineStyle.textTransform = style.transform as any;
        }
        
        if (style.marginTop && style.marginTop !== '') inlineStyle.marginTop = `${style.marginTop}px`;
        let marginBottomVal = parseFloat(style.marginBottom || '0');
        if (style.height !== undefined && style.height !== 0) {
            if (style.height > 0) inlineStyle.paddingBottom = `${style.height * 3.78}px`;
            else marginBottomVal += (style.height * 3.78);
        }
        inlineStyle.marginBottom = `${marginBottomVal}px`;
        
        if (style.verticalShift !== undefined && style.verticalShift !== 0) inlineStyle.transform = `translateY(${style.verticalShift * 3.78}px)`;

        return { className: classes, style: inlineStyle };
    };

    const getPageDimensions = () => {
        let width = 794;
        let height = 1123;
        switch (config.pageSize) {
            case 'A5': width = 559; height = 794; break;
            case 'Letter': width = 816; height = 1056; break;
            case 'Legal': width = 816; height = 1344; break;
            case 'A4':
            default: width = 794; height = 1123; break;
        }

        // Exact physical dimensions for display
        let physicalWidth = '210mm';
        let physicalHeight = '297mm';
        
        switch (config.pageSize) {
            case 'A5': physicalWidth = '148mm'; physicalHeight = '210mm'; break;
            case 'Letter': physicalWidth = '8.5in'; physicalHeight = '11in'; break;
            case 'Legal': physicalWidth = '8.5in'; physicalHeight = '14in'; break;
            case 'A4':
            default: physicalWidth = '210mm'; physicalHeight = '297mm'; break;
        }

        if (config.pageOrientation === 'Landscape') {
            const tempWidth = physicalWidth;
            physicalWidth = physicalHeight;
            physicalHeight = tempWidth;
            return { A4_WIDTH: height, A4_HEIGHT: width, PHYSICAL_WIDTH: physicalWidth, PHYSICAL_HEIGHT: physicalHeight };
        }
        return { A4_WIDTH: width, A4_HEIGHT: height, PHYSICAL_WIDTH: physicalWidth, PHYSICAL_HEIGHT: physicalHeight };
    };

    const { A4_WIDTH, A4_HEIGHT, PHYSICAL_WIDTH, PHYSICAL_HEIGHT } = getPageDimensions();
    
    // Design Theme Logic
    const layout = config.designLayout || 'Modern';

    const isTally = layout === 'Tally';
    const isVyapar = layout === 'Vyapar';
    const isBusy = layout === 'Busy';

    const isClassic = layout === 'Classic' || layout === 'Academic' || layout === 'Forest' || layout === 'Royal' || layout === 'Sunset' || layout === 'Midnight';
    const isTechnical = layout === 'Technical' || isTally;
    const isModern = layout === 'Modern' || isVyapar || layout === 'Ocean' || layout === 'Eco' || layout === 'Slate';
    const isBold = layout === 'Bold' || layout === 'Crimson';
    const isSerif = isClassic || layout === 'Forest';

    // Advanced Theme Mapping
    const themeMap: Record<string, { text: string, bg: string, border: string, accent: string, font: string, radius: string }> = {
        Modern: { text: 'text-blue-600', bg: 'bg-blue-600', border: 'border-blue-100', accent: 'bg-blue-50/20', font: 'Inter', radius: 'rounded-full' },
        Tally: { text: 'text-teal-700', bg: 'bg-teal-700', border: 'border-teal-800', accent: 'bg-yellow-50', font: 'JetBrains Mono', radius: 'rounded-none' },
        Vyapar: { text: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-200', accent: 'bg-blue-50/10', font: 'Inter', radius: 'rounded-lg' },
        Busy: { text: 'text-slate-700', bg: 'bg-slate-700', border: 'border-slate-800', accent: 'bg-slate-50', font: 'Inter', radius: 'rounded-sm' },
        Classic: { text: 'text-stone-900', bg: 'bg-stone-900', border: 'border-stone-800', accent: 'bg-stone-50', font: 'Playfair Display', radius: 'rounded-2xl' },
        Technical: { text: 'text-gray-900', bg: 'bg-gray-900', border: 'border-black', accent: 'bg-gray-50', font: 'JetBrains Mono', radius: 'rounded-none' },
        Minimal: { text: 'text-gray-400', bg: 'bg-gray-400', border: 'border-gray-100', accent: 'bg-gray-50/50', font: 'Inter', radius: 'rounded-lg' },
        Bold: { text: 'text-black', bg: 'bg-black', border: 'border-black', accent: 'bg-gray-100', font: 'Inter', radius: 'rounded-none' },
        Eco: { text: 'text-emerald-600', bg: 'bg-emerald-600', border: 'border-emerald-100', accent: 'bg-emerald-50/20', font: 'Inter', radius: 'rounded-full' },
        Royal: { text: 'text-purple-600', bg: 'bg-purple-600', border: 'border-purple-100', accent: 'bg-purple-50/20', font: 'Playfair Display', radius: 'rounded-2xl' },
        Sunset: { text: 'text-orange-600', bg: 'bg-orange-600', border: 'border-orange-100', accent: 'bg-orange-50/20', font: 'Space Grotesk', radius: 'rounded-2xl' },
        Ocean: { text: 'text-teal-600', bg: 'bg-teal-600', border: 'border-teal-100', accent: 'bg-teal-50/20', font: 'Inter', radius: 'rounded-full' },
        Midnight: { text: 'text-indigo-900', bg: 'bg-indigo-900', border: 'border-indigo-100', accent: 'bg-indigo-50/20', font: 'Space Grotesk', radius: 'rounded-xl' },
        Professional: { text: 'text-slate-800', bg: 'bg-slate-800', border: 'border-slate-200', accent: 'bg-slate-50', font: 'Inter', radius: 'rounded-lg' },
        Retail: { text: 'text-amber-600', bg: 'bg-amber-600', border: 'border-amber-100', accent: 'bg-amber-50/30', font: 'Inter', radius: 'rounded-md' },
        Academic: { text: 'text-stone-800', bg: 'bg-stone-800', border: 'border-stone-200', accent: 'bg-stone-50', font: 'Playfair Display', radius: 'rounded-sm' },
        Slate: { text: 'text-slate-500', bg: 'bg-slate-500', border: 'border-slate-100', accent: 'bg-slate-50/50', font: 'Inter', radius: 'rounded-lg' },
        Crimson: { text: 'text-red-700', bg: 'bg-red-700', border: 'border-red-100', accent: 'bg-red-50/10', font: 'Inter', radius: 'rounded-none' },
        Forest: { text: 'text-green-900', bg: 'bg-green-900', border: 'border-green-800', accent: 'bg-green-50/10', font: 'Playfair Display', radius: 'rounded-2xl' }
    };

    const colorPalette = config.colorPalette && config.colorPalette !== 'Default' ? config.colorPalette : null;
    const activeTheme = themeMap[layout] || themeMap.Modern;
    const activeColorTheme = colorPalette ? themeMap[colorPalette] || activeTheme : activeTheme;

    // Theme colors handled by ink saver
    const primaryText = config.useGrayScale ? 'text-black' : activeColorTheme.text;
    const primaryBg = config.useGrayScale ? 'bg-black' : activeColorTheme.bg;
    const primaryBorder = config.useGrayScale ? 'border-black' : activeColorTheme.border;
    const accentBg = config.useGrayScale ? 'bg-gray-100' : activeColorTheme.accent;

    const appliedFont = config.fontFamily && config.fontFamily !== 'Default' ? config.fontFamily : activeTheme.font;
    const appliedRadius = activeTheme.radius;
    
    // Dynamic Typography
    const baseSize = config.baseFontSize || (config.ultraCleanMode ? 6.5 : config.ultraCompactMode ? 7.5 : (config.compactMode ? 10 : 13));
    const lineHeight = config.lineHeight || 1;
    const headingScale = config.headingScale || 1.2;
    const letterSpacing = config.letterSpacing || 0;
    const wordSpacing = config.wordSpacing || 0;
    const paragraphSpacing = config.paragraphSpacing ?? 0;
    const headerSpacing = config.headerSpacing ?? 0;
    const plainSpacing = config.plainSpacing ?? 0;
    const fontWeight = config.fontWeight || '400';
    const textTransform = config.textTransform || 'default';
  // --- Deep Transformation Styles ---
  const tStyles = (() => {
     let c = {
        headerWrap: `flex justify-between items-start ${config.ultraCompactMode ? 'mb-2' : config.compactMode ? 'mb-4' : 'mb-6'} relative z-10 border-b border-gray-200 pb-8`,
        logoBox: `${primaryBg} ${config.ultraCompactMode ? 'w-6 h-6' : config.compactMode ? 'w-10 h-10' : 'w-16 h-16'} ${appliedRadius} flex items-center justify-center text-white font-black shadow-sm`,
        titleText: `font-black ${primaryText} mb-1 uppercase tracking-tighter leading-none`,
        invoiceNumber: `font-bold text-gray-400 uppercase tracking-[0.3em]`,
        billingWrap: `grid grid-cols-2 gap-6 relative z-10 border-y border-gray-200 ${config.compactMode ? 'mb-4 py-6' : 'mb-6 py-6'}`,
        billingLeftBox: '',
        billingRightBox: 'flex flex-col justify-between text-right',
        billingLabel: `font-black text-gray-400 uppercase tracking-[0.2em]`,
        billingValue: `font-black text-gray-900 uppercase`,
        tableWrap: `flex-grow relative z-10`,
        tableHeadRow: `bg-gray-50 border-b border-gray-200 text-left`,
        tableHeadCell: `${config.ultraCompactMode ? 'py-1.5 px-2 text-[8px]' : config.compactMode ? 'py-3 px-3' : 'py-6 px-4'} font-black text-gray-500 uppercase tracking-widest text-left`,
        tableBody: `divide-y divide-gray-100`,
        tableRow: `hover:bg-gray-50`,
        tableCellFirst: `${config.ultraCompactMode ? 'py-2 px-2' : config.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-400 tabular-nums`,
        tableCellLeft: `${config.ultraCompactMode ? 'py-2 px-2' : config.compactMode ? 'py-4 px-3' : 'py-4 px-4'}`,
        tableCellRight: `${config.ultraCompactMode ? 'py-2 px-2' : config.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-900 text-right tabular-nums`,
        tableCellTotal: `font-black text-gray-900 text-right tabular-nums ${config.ultraCompactMode ? 'py-2 px-2' : config.compactMode ? 'py-4 px-3' : 'py-4 px-4'}`,
        totalsWrap: `flex justify-between items-stretch ${config.ultraCompactMode ? 'pt-4' : config.compactMode ? 'pt-8' : 'pt-16'} relative z-10`,
        narrationBox: `bg-gray-50/50 rounded-3xl border border-gray-100 ${config.ultraCompactMode ? 'p-2' : config.compactMode ? 'p-4' : 'p-6'} space-y-6`,
        totalsBox: `${primaryBg} text-white ${appliedRadius} shadow-2xl ${config.ultraCompactMode ? 'w-48 p-4' : config.compactMode ? 'w-64 p-6' : 'w-80 p-6'} space-y-4`,
        totalsLabel: `flex justify-between font-bold opacity-60 uppercase tracking-widest`,
        totalsDivider: `space-y-3 py-4 border-y border-white/20 my-4`,
        grandTotalLabel: `font-black text-white uppercase tracking-[0.3em] mb-1`,
        grandTotalValue: `font-black text-white tabular-nums tracking-tighter leading-none`,
        footerWrap: `flex justify-between items-end pt-6`,
        signaturesAuth: `font-black text-gray-400 uppercase tracking-widest mb-1 opacity-70`,
        signaturesBox: `space-y-2 text-right`,
        signaturesDivider: `${config.compactMode ? 'w-full h-12' : 'w-full h-24'} border-b-[4px] ${primaryBorder} ${accentBg} ${appliedRadius} shadow-inner`
     };

      if (layout === 'Tally' || layout === 'Busy') {
        const isB = layout === 'Busy';
        const bdr = colorPalette ? primaryBorder : (isB ? 'border-slate-400' : 'border-black');
        const divBdr = colorPalette ? `divide-${primaryBorder.split('-')[1]}-${primaryBorder.split('-')[2]}` : (isB ? 'divide-slate-400' : 'divide-black');
        const bdrLight = colorPalette ? primaryBorder.replace(/600|700|800|900/, '300') : (isB ? 'border-slate-300' : 'border-black/10');
        const bgLight = colorPalette ? accentBg : (isB ? 'bg-slate-50' : 'bg-white');
        const bgMed = colorPalette ? accentBg : (isB ? 'bg-slate-100' : 'bg-gray-50');
        const textLgt = colorPalette ? primaryText.replace(/800|900/, '600') : (isB ? 'text-slate-600' : 'text-gray-500');
        const bgDark = colorPalette ? primaryBg : (isB ? 'bg-slate-700' : 'bg-black');
        
        c.headerWrap = `flex justify-between items-start ${config.compactMode ? 'mb-4' : 'mb-6'} relative z-10 border-b-[3px] ${bdr} ${isB ? bgLight + ' p-6' : ''} pb-6`;
        c.billingWrap = `grid grid-cols-2 gap-6 relative z-10 border-b-[3px] ${bdr} ${divBdr} divide-x-[3px] mb-0`;
        c.billingLeftBox = `p-6 ${isB ? bgLight : 'py-4'}`;
        c.billingRightBox = `flex flex-col justify-between text-right p-6 ${isB ? bgMed : 'py-4 bg-gray-50'}`;
        c.tableWrap = `flex-grow relative z-10 border-b-[3px] ${bdr}`;
        c.tableHeadRow = `${bgDark} text-white border-b-[3px] ${bdr} text-left`;
        c.tableBody = `divide-y ${bdrLight}`;
        c.tableRow = `${isB ? `even:${bgLight} hover:${bgMed}` : 'hover:bg-gray-50'}`;
        c.tableCellFirst += ` border-r ${bdrLight}`;
        c.tableCellRight += ` border-x ${bdrLight}`;
        c.tableCellTotal = `font-black text-gray-900 border-l ${bdrLight} text-right tabular-nums ${config.compactMode?'py-4 px-3':'py-4 px-4'}`;
        c.totalsWrap = `flex justify-between items-stretch relative z-10 border-t-[3px] ${bdr} ${divBdr} divide-x-[3px]`;
        c.narrationBox = `bg-white p-0 rounded-none border-0`;
        c.totalsBox = `${colorPalette ? accentBg : (isB ? 'bg-slate-200' : 'bg-gray-50')} text-gray-900 ${config.compactMode ? 'w-64 p-6' : 'w-80 p-6'} space-y-4`;
        c.totalsLabel = `flex justify-between font-bold ${textLgt} uppercase tracking-widest font-mono`;
        c.totalsDivider = `space-y-3 py-4 border-y-[2px] border-dotted ${bdr} my-4`;
        c.grandTotalLabel = `font-black text-gray-900 uppercase tracking-[0.3em] mb-1`;
        c.grandTotalValue = `font-black text-gray-900 tabular-nums tracking-tighter leading-none font-mono`;
        c.footerWrap = `flex justify-between items-end pt-10 border-t-[3px] ${bdr}`;
        c.signaturesDivider = `${config.compactMode ? 'w-full h-12' : 'w-full h-24'} border-b-[3px] ${bdr}`;
     }
     else if (layout === 'Classic' || layout === 'Academic' || layout === 'Forest' || layout === 'Royal') {
        const isFor = layout === 'Forest';
        const pB = colorPalette ? primaryBorder : (isFor ? 'border-emerald-800' : 'border-stone-200');
        const bg1 = colorPalette ? accentBg : (isFor?'bg-emerald-50':'bg-stone-50');
        const bg2 = colorPalette ? accentBg : 'hover:bg-stone-50';
        const text1 = colorPalette ? primaryText : (isFor?'text-emerald-900':'text-stone-700');
        
        c.headerWrap = `flex justify-between items-start ${config.compactMode ? 'mb-4' : 'mb-6'} relative z-10 border-b-2 ${pB} pb-8`;
        c.titleText = `font-serif italic ${primaryText} mb-1 tracking-normal leading-none`;
        c.billingWrap = `grid grid-cols-2 gap-6 relative z-10 border-y-2 ${pB} ${config.compactMode ? 'mb-4 py-6' : 'mb-6 py-6'}`;
        c.billingLabel = `font-black italic text-stone-400`;
        c.billingValue = `font-serif font-black text-stone-900 leading-none`;
        c.tableHeadRow = `${bg1} border-b-2 ${pB}`;
        c.tableHeadCell = `${config.compactMode ? 'py-3 px-3' : 'py-6 px-4'} font-serif font-black ${text1} uppercase tracking-widest text-left`;
        c.tableRow = `${bg2} border-b border-stone-100`;
        c.tableCellTotal = `font-serif italic font-black text-stone-900 text-right tabular-nums ${config.compactMode?'py-4 px-3':'py-4 px-4'}`;
        c.narrationBox = `${bg1} border ${pB} shadow-sm ${config.compactMode ? 'p-4' : 'p-6'}`;
        c.totalsBox = `${colorPalette ? accentBg : (isFor?'bg-emerald-800 text-white':'bg-stone-100/50 text-stone-900')} border-l-2 ${pB} ${config.compactMode ? 'w-64 p-6' : 'w-80 p-6'} space-y-4`;
        c.totalsLabel = `flex justify-between font-bold ${colorPalette ? primaryText : (isFor?'text-emerald-100':'text-stone-500')} uppercase tracking-widest`;
        c.totalsDivider = `space-y-3 py-4 border-y ${pB} my-4`;
        c.grandTotalLabel = `font-black ${colorPalette ? primaryText : (isFor?'text-emerald-50':'text-stone-400')} uppercase tracking-[0.3em] mb-1`;
        c.grandTotalValue = `font-serif italic font-black ${colorPalette ? primaryText : (isFor?'text-white':'text-stone-900')} tabular-nums tracking-tighter leading-none`;
        c.signaturesDivider = `${config.compactMode ? 'w-full h-12' : 'w-full h-24'} border-b-2 ${pB} italic font-serif`;
     }
     else if (layout === 'Bold' || layout === 'Crimson' || layout === 'Sunset' || layout === 'Midnight') {
        const isB = layout === 'Bold' || layout === 'Crimson';
        const isS = layout === 'Sunset';
        const isM = layout === 'Midnight';
        
        const bdr = colorPalette ? primaryBorder : (isS?'border-orange-500':'border-black');
        const bgHead = colorPalette ? primaryBg : (isM?'bg-indigo-950':'bg-black');
        
        c.headerWrap = isS ? `flex justify-between items-start relative z-10 border-b-[8px] ${colorPalette ? primaryBorder : 'border-orange-500'} ${config.compactMode ? 'pb-4 mb-4' : 'pb-6 mb-6'}` : 
                       (isM ? `flex justify-between items-start relative z-10 ${bgHead} text-white ${config.compactMode ? 'p-6 mb-4' : 'p-6 mb-6'}` :
                       `flex justify-between items-start relative z-10 ${bgHead} text-white ${config.compactMode ? 'p-6 mb-4' : 'p-6 mb-6'}`);
        c.titleText = `font-black ${colorPalette ? primaryText : (isM?'text-white':(isS?'text-orange-600':'text-white'))} mb-1 uppercase tracking-tighter leading-none`;
        c.invoiceNumber = `font-bold ${(isB||isM)?'text-white/60':'text-gray-400'} uppercase tracking-[0.3em]`;
        c.billingWrap = `grid grid-cols-2 ${config.compactMode ? 'gap-4 mb-4 py-4' : 'gap-6 mb-6 py-4'} relative z-10 ${colorPalette ? `border-y-4 ${primaryBorder}` : (isS?'border-y-2 border-orange-200':'border-b-4 border-black')}`;
        c.tableHeadRow = `${colorPalette ? primaryBg : (isS?'bg-orange-100 text-orange-900 border-y-2 border-orange-300':(isM?'bg-indigo-900 text-white':'bg-black text-white'))} text-left ${colorPalette ? 'text-white' : ''}`;
        c.tableHeadCell = `${config.compactMode ? 'py-3 px-3' : 'py-4 px-4'} font-black ${colorPalette ? 'text-white' : (isS?'text-orange-900':'text-white')} uppercase tracking-widest text-left`;
        c.tableBody = `divide-y ${colorPalette ? primaryBorder : (isS?'divide-orange-100':(isM?'divide-indigo-100':'divide-black'))}`;
        c.tableRow = `hover:bg-gray-50`;
        c.narrationBox = `${colorPalette ? accentBg : (isS?'bg-orange-50':(isM?'bg-indigo-50':'bg-gray-50 border-t-4 border-black'))} ${config.compactMode ? 'p-4 mt-4 space-y-4' : 'p-6 mt-6 space-y-4'} ${appliedRadius}`;
        c.totalsBox = `${colorPalette ? primaryBg : (isS?'bg-gradient-to-br from-orange-500 to-red-500':(isM?'bg-indigo-950':'bg-black'))} text-white ${config.compactMode ? 'w-64 p-6' : 'w-80 p-8'} space-y-4 ${(!isS)?'border-l-8 border-white/20':''} shadow-2xl`;
        c.totalsDivider = `space-y-3 py-4 border-y border-white/20 my-4`;
     }
     else if (layout === 'Vyapar' || layout === 'Ocean' || layout === 'Eco' || layout === 'Slate' || layout === 'Modern') {
        const isO = layout === 'Ocean';
        const isE = layout === 'Eco';
        const isS = layout === 'Slate';
        const isV = layout === 'Vyapar';
        if (isO || isE || isS || isV) {
           const bdr = colorPalette ? primaryBorder : (isO?'border-teal-200':(isE?'border-emerald-200':(isS?'border-slate-200':'border-blue-200')));
           const bg1 = colorPalette ? accentBg : (isO?'bg-teal-50':(isE?'bg-emerald-50':(isS?'bg-slate-100':'bg-blue-50')));
           const bg2 = colorPalette ? (accentBg + '/50') : (isO?'bg-teal-50/40':(isE?'bg-emerald-50/40':(isS?'bg-slate-50':'bg-blue-50/40')));
           const bgDk = colorPalette ? primaryBg : (isO?'bg-teal-600':(isE?'bg-emerald-600':(isS?'bg-slate-700':'bg-blue-600')));
           
           c.headerWrap = `flex justify-between items-start relative z-10 ${bg1} p-6 rounded-b-3xl mb-8 border-b ${bdr}`;
           c.billingWrap = `grid grid-cols-2 gap-6 relative z-10 ${bg2} rounded-2xl p-6 mx-4 ${config.compactMode ? 'mb-4 py-6' : 'mb-8 py-4'}`;
           c.tableHeadRow = `${bgDk} text-white rounded-t-xl text-left shadow-md`;
           c.tableHeadCell = `${config.compactMode ? 'py-3 px-3' : 'py-6 px-4'} font-black text-white uppercase tracking-widest text-left first:rounded-tl-xl last:rounded-tr-xl`;
           c.tableBody = `divide-y ${bdr}`;
           c.tableRow = `even:${bg2} hover:bg-gray-50`;
           c.totalsBox = `${bgDk} text-white rounded-2xl shadow-xl ${config.compactMode ? 'w-64 p-6' : 'w-80 p-6'} space-y-4`;
        }
     }
     else if (layout === 'Technical') {
        const bdr = colorPalette ? primaryBorder : 'border-black';
        const textH = colorPalette ? primaryText : 'text-white';
        
        c.headerWrap = `flex justify-between items-start ${config.compactMode ? 'mb-4' : 'mb-6'} relative z-10 border-b-[3px] ${bdr} pb-6`;
        c.billingWrap = `grid grid-cols-2 gap-6 relative z-10 border-b-[3px] ${bdr} divide-x-[3px] ${bdr.replace('border-', 'divide-')} mb-0`;
        c.billingLeftBox = 'p-6 py-4';
        c.billingRightBox = `flex flex-col justify-between text-right p-6 py-4 ${colorPalette ? accentBg : 'bg-gray-50/30'}`;
        c.tableWrap = `flex-grow relative z-10 border-b-[3px] ${bdr}`;
        c.tableHeadRow = `${colorPalette ? primaryBg : 'bg-black'} ${bdr} text-white border-b-[3px] text-left`;
        c.tableBody = `divide-y ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'divide-black/10'}`;
        c.tableRow = `hover:bg-gray-50 text-gray-900 border-x ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'border-black/10'}`;
        c.tableCellFirst += ` border-r ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'border-black/10'}`;
        c.tableCellRight += ` border-x ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'border-black/10'}`;
        c.tableCellTotal = `font-black text-gray-900 border-l ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'border-black/10'} text-right tabular-nums ${config.compactMode?'py-4 px-3':'py-4 px-4'}`;
        c.totalsWrap = `flex justify-between items-stretch relative z-10 border-t-[3px] ${bdr} divide-x-[3px] ${bdr.replace('border-', 'divide-')}`;
        c.narrationBox = `bg-white p-0 rounded-none border-0`;
        c.totalsBox = `${colorPalette ? accentBg : 'bg-gray-50/30'} text-gray-900 ${config.compactMode ? 'w-64 p-6' : 'w-80 p-6'} space-y-4`;
        c.totalsLabel = `flex justify-between font-bold ${colorPalette ? primaryText : 'text-gray-500'} uppercase tracking-widest font-mono`;
        c.totalsDivider = `space-y-3 py-4 border-y-[2px] border-dotted ${bdr} my-4`;
        c.grandTotalLabel = `font-black text-gray-900 uppercase tracking-[0.3em] mb-1`;
        c.grandTotalValue = `font-black ${colorPalette ? primaryText : 'text-gray-900 tracking-tighter '} tabular-nums leading-none font-mono`;
        c.footerWrap = `flex justify-between items-end pt-10 border-t-[3px] ${bdr}`;
        c.signaturesDivider = `${config.compactMode ? 'w-full h-8' : 'w-full h-16'} border-b-[3px] ${bdr}`;
     }

     if (layout === 'Modern') {
        c.totalsBox = `bg-white border text-gray-900 border-gray-200 rounded-3xl shadow-xl ${config.compactMode ? 'w-64 p-5 bg-white' : 'w-80 p-6 bg-white'} space-y-4`;
        c.totalsLabel = `flex justify-between font-bold text-gray-600 uppercase tracking-widest`;
        c.totalsDivider = `space-y-3 py-4 border-y border-gray-200 my-4`;
        c.grandTotalLabel = `font-black ${colorPalette ? primaryText : 'text-blue-600'} uppercase tracking-[0.3em] mb-1`;
        c.grandTotalValue = `font-black ${colorPalette ? primaryText : 'text-blue-600'} tabular-nums tracking-tighter leading-none`;
     }

     if (config.ultraCleanMode) {
        c.headerWrap = `flex justify-between items-start mb-1 relative z-10 border-b border-black pb-2`;
        c.logoBox = `w-8 h-8 flex items-center justify-center text-black font-bold`;
        c.titleText = `font-bold text-black mb-0 uppercase leading-none`;
        c.invoiceNumber = `font-bold text-black uppercase`;
        c.billingWrap = `flex justify-between mb-2 pb-2 relative z-10 border-b border-black pt-2`;
        c.billingLeftBox = ``;
        c.billingRightBox = `flex flex-col justify-between text-right`;
        c.billingLabel = `font-bold text-black uppercase`;
        c.billingValue = `text-black uppercase`;
        c.tableWrap = `flex-grow relative z-10`;
        c.tableHeadRow = `border-b border-black text-left text-black`;
        c.tableHeadCell = `py-1 px-1 font-bold text-black uppercase text-left text-[8px]`;
        c.tableBody = `divide-y divide-black/20`;
        c.tableRow = `text-black`;
        c.tableCellFirst = `py-1 px-1 text-black tabular-nums`;
        c.tableCellLeft = `py-1 px-1 text-black`;
        c.tableCellRight = `py-1 px-1 text-black text-right tabular-nums`;
        c.tableCellTotal = `font-bold text-black text-right tabular-nums py-1 px-1`;
        c.totalsWrap = `flex justify-between items-stretch pt-2 relative z-10 border-t border-black`;
        c.narrationBox = `border border-black p-1 space-y-2 mt-2`;
        c.totalsBox = `text-black w-48 p-2 space-y-1 block`;
        c.totalsLabel = `flex justify-between text-black uppercase font-bold`;
        c.totalsDivider = `space-y-1 py-1 border-y border-black my-1`;
        c.grandTotalLabel = `font-bold text-black uppercase mb-0`;
        c.grandTotalValue = `font-bold text-black tabular-nums leading-none`;
        c.footerWrap = `flex justify-between items-end pt-2 border-t border-black mt-2`;
        c.signaturesAuth = `font-bold text-black uppercase mb-1`;
        c.signaturesBox = `space-y-1 text-right mt-2`;
        c.signaturesDivider = `w-full h-8 border-b border-black`;
     }

     return c;
  })();


    const isERPTheme = ['Modern', 'Tally', 'Vyapar', 'Busy', 'Academic'].includes(layout);
    
    return (
        <div 
            id="voucher-preview-document"
            className={`bg-white flex flex-col text-gray-900 shadow-2xl transition-all duration-500 relative ${config.useGrayScale ? 'grayscale contrast-125' : ''} ${isTechnical ? 'border-[3px] border-black' : ''} ${textTransform !== 'default' ? `text-transform-${textTransform}` : ''}`}
            style={{ 
                boxSizing: 'border-box',
                width: PHYSICAL_WIDTH, 
                height: PHYSICAL_HEIGHT,
                minHeight: PHYSICAL_HEIGHT,
                maxHeight: PHYSICAL_HEIGHT,
                overflow: 'hidden',
                fontSize: `${baseSize}px`,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}px`,
                wordSpacing: `${wordSpacing}px`,
                fontWeight: fontWeight as any,
                paddingTop: config.ultraCleanMode ? '0.2in' : `calc(${(config.marginTop ?? 0.5)}in + ${plainSpacing}px)`,
                paddingBottom: config.ultraCleanMode ? '0.2in' : `calc(${(config.marginBottom ?? 0.5)}in + ${plainSpacing}px)`,
                paddingLeft: config.ultraCleanMode ? '0.2in' : `calc(${(config.marginLeft ?? 0.5)}in + ${plainSpacing}px)`,
                paddingRight: config.ultraCleanMode ? '0.2in' : `calc(${(config.marginRight ?? 0.5)}in + ${plainSpacing}px)`,
                fontFamily: appliedFont,
                backgroundColor: 'white'
            }}
        >
            {/* Technical grid background */}
            <style>{`
                #voucher-preview-document h1, #voucher-preview-document h2, #voucher-preview-document h3, #voucher-preview-document h4, #voucher-preview-document h5, #voucher-preview-document h6 {
                    margin-bottom: ${headerSpacing}px !important;
                }
                #voucher-preview-document p, #voucher-preview-document .paragraph {
                    margin-bottom: ${paragraphSpacing}px !important;
                }
            `}</style>
            {isTechnical && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
            )}

            \n
            {/* Invoice Header */}
            {config.showHeader && (
                <div className={tStyles.headerWrap}>
                  <div className="flex items-start gap-4">
                    {config.showLogo && (
                      <div className={tStyles.logoBox}>
                        <FileText size={config.ultraCompactMode ? 16 : config.compactMode ? 20 : 32} />
                      </div>
                    )}
                    <div>
                      <h1 
                        {...getSectionStyle('header', tStyles.titleText, { fontSize: `${baseSize * headingScale * 2}px` })}
                      >
                        {isSerif ? type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1) : type.replace('_', ' ').toUpperCase()}
                      </h1>
                      <p {...getSectionStyle('header', tStyles.invoiceNumber, { fontSize: `${baseSize * 0.7}px` })}>{header.voucherNumber || header.entryNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div {...getSectionStyle('companyName', `font-black ${isBold ? 'text-white' : 'text-gray-900'} mb-1 tracking-tighter ${isSerif ? 'font-serif underline underline-offset-8' : ''}`, { fontSize: `${baseSize * headingScale * 1.5}px` })}>BHARAT BOOK</div>
                    <div {...getSectionStyle('companyAddress', `font-bold ${isBold ? 'text-white/60' : 'text-gray-500'} leading-tight uppercase tracking-widest opacity-80 ${isTechnical ? 'font-mono' : ''}`, { fontSize: `${baseSize * 0.7}px` })}>
                      Industrial Area, Phase 1<br/>
                      New Delhi, Delhi 110001, India<br/>
                      GSTIN: 07AAACB1234A1Z1<br/>
                      <span className={isBold ? 'text-white' : primaryText}>contact@bharatbook.com</span>
                    </div>
                  </div>
                </div>
              )}

              {config.showBilling && (
                <div className={tStyles.billingWrap}>
                  <div className={tStyles.billingLeftBox}>
                    <div className={tStyles.billingLabel} style={{ fontSize: `${baseSize * 0.7}px`, marginBottom: `${baseSize * 0.5}px` }}>Bill To / Recipient</div>
                    <div {...getSectionStyle('partyName', tStyles.billingValue, { fontSize: `${baseSize * headingScale * 1.5}px` })}>{header.billingPartyName || header.partyName || 'Cash Sales'}</div>
                    <div {...getSectionStyle('partyAddress', `text-gray-500 font-bold leading-relaxed max-w-sm ${isTechnical ? 'font-mono uppercase tracking-tight' : ''}`, { fontSize: `${baseSize}px` })}>
                      {header.billingAddress || 'Local Customer'}<br/>
                      {header.billingState} {header.billingPinCode}, India<br/>
                      {header.billingContact && <span className={primaryText}>Contact: {header.billingContact}</span>}
                    </div>
                    {header.gstNumber && <div className={`mt-4 inline-block px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 font-black rounded-lg uppercase tracking-widest dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600`} style={{ fontSize: `${baseSize * 0.7}px` }}>GSTIN: {header.gstNumber}</div>}
                  </div>
                  <div className={tStyles.billingRightBox}>
                    <div className="space-y-8">
                      <div className={isTechnical ? 'border-b border-black/10 pb-4 flex justify-between items-end text-left' : ''}>
                        <div className={tStyles.billingLabel} style={{ fontSize: `${baseSize * 0.7}px` }}>Document Date</div>
                        <div {...getSectionStyle('subheader', tStyles.billingValue, { fontSize: `${baseSize * headingScale}px` })}>{header.voucherDate || header.entryDate}</div>
                      </div>
                      {header.referenceNo && (
                        <div className={isTechnical ? 'border-b border-black/10 pb-4 flex justify-between items-end text-left' : ''}>
                          <div className={tStyles.billingLabel} style={{ fontSize: `${baseSize * 0.7}px` }}>Ref / Invoice No</div>
                          <div {...getSectionStyle('subheader', tStyles.billingValue, { fontSize: `${baseSize * headingScale * 0.8}px` })}>{header.referenceNo}</div>
                        </div>
                      )}
                      {header.poNumber && (
                        <div className={isTechnical ? 'border-b border-black/10 pb-4 flex justify-between items-end text-left' : ''}>
                          <div className={tStyles.billingLabel} style={{ fontSize: `${baseSize * 0.7}px` }}>Purchase Order</div>
                          <div {...getSectionStyle('subheader', tStyles.billingValue, { fontSize: `${baseSize * headingScale * 0.8}px` })}>{header.poNumber}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className={tStyles.tableWrap}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className={tStyles.tableHeadRow}>
                            <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell, { fontSize: `${baseSize * 0.7}px` })}>SR.</th>
                            <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' w-1/2', { fontSize: `${baseSize * 0.7}px` })}>Description of Goods/Services</th>
                            {true ? (
                                <>
                                    {config.showMrp && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>MRP</th>
                                    )}
                                    {config.showQty && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Quantity</th>
                                    )}
                                    {config.showRate && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Rate</th>
                                    )}
                                    {config.showDiscountPercentage && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Disc (%)</th>
                                    )}
                                    {config.showDiscountAmount && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Disc (₹)</th>
                                    )}
                                    <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Tax (%)</th>
                                </>
                            ) : (
                                <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Type</th>
                            )}
                            <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody className={tStyles.tableBody}>
                        {rows.filter(r => (true ? r.itemName : r.ledgerName)).map((row, index) => (
                            <tr key={index} className={tStyles.tableRow}>
                                <td className={tStyles.tableCellFirst} style={{ fontSize: `${baseSize * 0.9}px` }}>{String(index + 1).padStart(2, '0')}</td>
                                <td className={tStyles.tableCellLeft}>
                                    <div {...getSectionStyle('lineItem', `font-black text-gray-900 uppercase tracking-tight ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * (config.ultraCompactMode ? 0.8 : config.compactMode ? 1.0 : 1.33)}px` })}>{true ? row.itemName : row.ledgerName}</div>
                                    {config.showHSN && row.hsn && <div className={`${primaryText} font-black uppercase tracking-widest opacity-60`} style={{ fontSize: `${baseSize * 0.66}px`, marginTop: `${baseSize * 0.15}px` }}>HSN Code: {row.hsn}</div>}
                                </td>
                                {true ? (
                                    <>
                                        {config.showMrp && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.mrp ? parseFloat(row.mrp.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                                        )}
                                        {config.showQty && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.qty} {row.uom}</td>
                                        )}
                                        {config.showRate && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{parseFloat(row.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        )}
                                        {config.showDiscountPercentage && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.discountPercent ? `${row.discountPercent}%` : '-'}</td>
                                        )}
                                        {config.showDiscountAmount && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.discountAmount ? parseFloat(row.discountAmount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                                        )}
                                        <td className={`${config.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-600 text-right tabular-nums dark:text-gray-300`} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.tax}%</td>
                                    </>
                                ) : (
                                    <td className={`${config.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-black ${primaryText} text-right tracking-widest uppercase`} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.crDr || 'Dr'}</td>
                                )}
                                <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 1.2}px` }}>{parseFloat(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>

              {config.ultraCleanMode && <div className="flex-grow"></div>}

              {config.showHsnSummary && (
                <div className={`mt-8 ${isTechnical ? 'border-t-3 border-black pt-6' : 'border-t-2 border-gray-200/50 pt-8'} relative z-10`}>
                  <div className={`font-black text-gray-400 uppercase tracking-widest mb-4`} style={{ fontSize: `${baseSize * 0.8}px` }}>HSN-wise Summary</div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className={tStyles.tableHeadRow}>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell, { fontSize: `${baseSize * 0.7}px` })}>HSN / SAC</th>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Taxable Value</th>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Rate</th>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>CGST Amount</th>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>SGST Amount</th>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Total Tax</th>
                      </tr>
                    </thead>
                    <tbody className={tStyles.tableBody}>
                      {rows.reduce((acc: any[], row) => {
                          if (!row.hsn) return acc;
                          const existing = acc.find(x => x.hsn === row.hsn);
                          const taxRate = row.tax || 0;
                          const qty = row.qty || 1;
                          const rate = parseFloat(row.rate?.toString() || '0');
                          const amount = row.amount !== undefined ? parseFloat(row.amount.toString()) : qty * rate;
                          const taxAmount = (amount * taxRate) / 100;
                          
                          if (existing) {
                              existing.taxable += amount;
                              existing.taxAmount += taxAmount;
                          } else {
                              acc.push({ hsn: row.hsn, taxRate, taxable: amount, taxAmount });
                          }
                          return acc;
                      }, []).map((hsn, idx) => (
                        <tr key={`hsn-${idx}`} className={tStyles.tableRow}>
                          <td className={tStyles.tableCellLeft} style={{ fontSize: `${baseSize * 0.9}px` }}>{hsn.hsn}</td>
                          <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{hsn.taxable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{hsn.taxRate}%</td>
                          <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{(hsn.taxAmount/2).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{(hsn.taxAmount/2).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 0.9}px` }}>{hsn.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals Section */}
              <div className={tStyles.totalsWrap}>
                  <div className={isTechnical ? 'p-6 flex-1' : 'pr-16 flex-1'}>
                    {(config.showAmountInWords || (header.narration && config.showNarration)) && (
                        <div className={tStyles.narrationBox}>
                          {config.showAmountInWords && (
                            <div>
                                <div className={`font-black text-gray-400 uppercase tracking-[0.2em] mb-3`} style={{ fontSize: `${baseSize * 0.7}px` }}>Total amount in words</div>
                                <div {...getSectionStyle('amountInWords', `font-black text-gray-800 italic leading-snug uppercase tracking-tight ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                  Indian Rupees {numberToWords(Math.floor(totals.grandTotal || totals.finalValue))}
                                </div>
                            </div>
                          )}
                          
                          {header.narration && config.showNarration && (
                            <div className={`${config.showAmountInWords ? (config.ultraCompactMode ? 'pt-2 mt-2 border-t border-gray-200/20' : config.compactMode ? 'pt-4 mt-4 border-t border-gray-200/40' : 'pt-8 mt-8 border-t border-gray-200/60') : ''} ${isTechnical ? 'border-black' : ''}`}>
                              <div className={`font-black text-gray-400 uppercase tracking-[0.2em] mb-2`} style={{ fontSize: `${baseSize * 0.7}px` }}>Official Narration</div>
                              <div {...getSectionStyle('narration', `text-gray-600 leading-relaxed font-bold uppercase tracking-tight ${isTechnical ? 'font-mono' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>{header.narration}</div>
                            </div>
                          )}
                        </div>
                    )}
                  </div>
                  <div className={tStyles.totalsBox}>
                    <div className={tStyles.totalsLabel} style={{ fontSize: `${baseSize * 0.8}px` }}>
                      <span>{layout === 'Modern' ? 'Total taxable amount' : 'Subtotal Value'}</span>
                      <span className="tabular-nums">₹{(totals.taxableValue || totals.estValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    {config.showTaxDetails && (
                        <div className={tStyles.totalsDivider}>
                            {(totals.igst || 0) > 0 && (
                            <div {...getSectionStyle('taxDetails', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                                <span>IGST (Integrated)</span>
                                <span className="tabular-nums">₹{totals.igst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            )}
                            {(totals.cgst || 0) > 0 && (
                            <>
                                <div {...getSectionStyle('taxDetails', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                                <span>CGST (Central)</span>
                                <span className="tabular-nums">₹{totals.cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div {...getSectionStyle('taxDetails', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                                <span>SGST (State)</span>
                                <span className="tabular-nums">₹{totals.sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col gap-1 items-end pt-4">
                      <div className={tStyles.grandTotalLabel} style={{ fontSize: `${baseSize * 0.8}px` }}>{layout === 'Modern' ? 'Total net invoice amount' : 'Total Payable'}</div>
                      <div {...getSectionStyle('grandTotal', tStyles.titleText.replace('mb-1', ''), { fontSize: `${baseSize * headingScale * 2}px` })}>₹{(totals.grandTotal || totals.finalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                </div>

              {/* Footers */}
              <div className={`relative z-10 ${config.ultraCleanMode ? 'mt-2' : 'mt-6'} break-inside-avoid`}>
                <div className={tStyles.footerWrap}>
                  <div className="text-left w-1/3">
                    {config.showCustomerSign && (
                      <div className={isTechnical ? 'border-2 border-black p-4 inline-block' : ''}>
                        <div {...getSectionStyle('signatures', tStyles.signaturesAuth, { fontSize: `${baseSize * 0.7}px` })}>Customer Authorization</div>
                        <div className={tStyles.signaturesDivider}></div>
                      </div>
                    )}
                  </div>
                  <div className="text-right w-1/2">
                    {config.showSignature && (
                      <div className={tStyles.signaturesBox}>
                        <div {...getSectionStyle('signatures', `font-black text-gray-900 uppercase tracking-widest`, { fontSize: `${baseSize * 0.8}px` })}>Authorized For BHARAT BOOK</div>
                        <div className={tStyles.signaturesDivider}></div>
                        <div {...getSectionStyle('signatures', `font-black ${primaryText} uppercase tracking-[0.4em] opacity-100 mt-2`, { fontSize: `${baseSize * 0.8}px` })}>Official Stamp & Sign</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Final Note at absolute bottom of content area */}
              {config.ultraCleanMode ? (
                <div className="h-4"></div>
              ) : (
                <div className="flex-grow min-h-[10px]"></div>
              )}

              {config.showFooterNotes && (
                <div className="w-full pt-4 pb-2 mt-4 border-t border-gray-100/50">
                  <p className={`${config.ultraCompactMode ? 'text-[6px]' : config.compactMode ? 'text-[8px]' : 'text-[10px]'} font-black text-gray-400 text-center uppercase tracking-[0.5em]`}>
                    Computer Generated Official Document
                  </p>
                </div>
              )}

        </div>
    );
};

const InfoIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
