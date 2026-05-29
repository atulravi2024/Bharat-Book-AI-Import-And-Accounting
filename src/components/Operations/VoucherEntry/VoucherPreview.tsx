import React, { useState, useEffect, useRef } from 'react';
import { VoucherType } from '../../../app/types';
import { Printer, Download, Image as ImageIcon, X, ZoomIn, ZoomOut, Maximize, RotateCcw, FileText, GripVertical, ToggleLeft, ToggleRight, Settings, Layout, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { numberToWords } from '../../../lib/numberToWords';

interface VoucherPreviewProps {
  header: any;
  rows: any[];
  totals: any;
  type: string;
  onClose: () => void;
  onDownloadPDF?: () => void;
  onDownloadImage?: () => void;
  autoPrint?: boolean;
}

export const VoucherPreview: React.FC<VoucherPreviewProps> = ({ header = {} as any, rows = [], totals = {} as any, type = 'voucher', onClose, onDownloadPDF, onDownloadImage, autoPrint }) => {
  const isInventory = [
    'sales', 'purchase', 'sales_order', 'purchase_order', 
    'debit_note', 'credit_note', 'stock_journal', 'physical_stock', 
    'consumption', 'scrap', 'transfer', 'rejections_in', 'rejections_out',
    'delivery_note', 'receipt_note'
  ].includes((typeof type === 'string' ? type : 'voucher').toLowerCase().replace(/ /g, '_'));
  const [autoScale, setAutoScale] = useState(1);
  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const previewScale = manualZoom !== null ? manualZoom : autoScale;
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

    const [printConfig, setPrintConfig] = useState<any>({
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
        showHsnSummary: true,
        showSignature: true,
        showCustomerSign: true,
        compactMode: true,
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
        fontWeight: '400',
        textTransform: 'default',
    });

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem('bharat_book_print_settings_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPrintConfig(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to parse saved settings", e);
        }
      }
    };
    
    loadSettings();
    window.addEventListener('print_settings_updated', loadSettings);
    return () => window.removeEventListener('print_settings_updated', loadSettings);
  }, []);

  // Design Theme Logic
  const layout = (printConfig.designLayout || 'Modern') as any;

  const isTally = layout === 'Tally';
  const isVyapar = layout === 'Vyapar' || layout === 'Retail';
  const isBusy = layout === 'Busy';

  const isClassic = layout === 'Classic' || layout === 'Academic' || layout === 'Forest' || layout === 'Royal' || layout === 'Sunset' || layout === 'Midnight';
  const isTechnical = layout === 'Technical' || isTally || isBusy;
  const isModern = layout === 'Modern' || isVyapar || layout === 'Ocean' || layout === 'Eco' || layout === 'Slate';
  const isBold = layout === 'Bold' || layout === 'Crimson';
  const isSerif = isClassic;

  // Advanced Theme Mapping (Synchronized with Settings)
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

  const colorPalette = printConfig.colorPalette && printConfig.colorPalette !== 'Default' ? printConfig.colorPalette : null;
  const activeTheme = themeMap[layout] || themeMap.Modern;
  const activeColorTheme = colorPalette ? themeMap[colorPalette] || activeTheme : activeTheme;

  // Theme colors handled by ink saver
  const primaryText = printConfig.useGrayScale ? 'text-black' : activeColorTheme.text;
  const primaryBg = printConfig.useGrayScale ? 'bg-black' : activeColorTheme.bg;
  const primaryBorder = printConfig.useGrayScale ? 'border-black' : activeColorTheme.border;
  const accentBg = printConfig.useGrayScale ? 'bg-gray-100' : activeColorTheme.accent;

  const appliedFont = printConfig.fontFamily && printConfig.fontFamily !== 'Default' ? printConfig.fontFamily : activeTheme.font;
  const appliedRadius = activeTheme.radius;

  // Dynamic Typography
  const baseSize = printConfig.baseFontSize || (printConfig.compactMode ? 10 : 13);
  const lineHeightMultiplier = printConfig.lineHeight || 1;
  const headingScale = printConfig.headingScale || 1.2;
  const letterSpacing = printConfig.letterSpacing || 0;
  const wordSpacing = printConfig.wordSpacing || 0;
  const paragraphSpacing = printConfig.paragraphSpacing ?? 0;
  const headerSpacing = printConfig.headerSpacing ?? 0;
  const plainSpacing = printConfig.plainSpacing ?? 0;
  const fontWeight = printConfig.fontWeight || '400';
  const textTransform = printConfig.textTransform || 'default';

  const getSectionStyle = (key: string, baseClasses: string, styleOverrides?: React.CSSProperties) => {
      const style = (printConfig.sectionStyles as any)?.[key];
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
    switch (printConfig.pageSize) {
        case 'A5': width = 559; height = 794; break;
        case 'Letter': width = 816; height = 1056; break;
        case 'Legal': width = 816; height = 1344; break;
        case 'A4':
        default: width = 794; height = 1123; break;
    }
    
    // Exact physical dimensions for display
    let physicalWidth = '210mm';
    let physicalHeight = '297mm';
    
    switch (printConfig.pageSize) {
        case 'A5': physicalWidth = '148mm'; physicalHeight = '210mm'; break;
        case 'Letter': physicalWidth = '8.5in'; physicalHeight = '11in'; break;
        case 'Legal': physicalWidth = '8.5in'; physicalHeight = '14in'; break;
        case 'A4':
        default: physicalWidth = '210mm'; physicalHeight = '297mm'; break;
    }
    
    if (printConfig.pageOrientation === 'Landscape') {
        const tempWidth = physicalWidth;
        physicalWidth = physicalHeight;
        physicalHeight = tempWidth;
        return { A4_WIDTH: height, A4_HEIGHT: width, PHYSICAL_WIDTH: physicalWidth, PHYSICAL_HEIGHT: physicalHeight };
    }
    return { A4_WIDTH: width, A4_HEIGHT: height, PHYSICAL_WIDTH: physicalWidth, PHYSICAL_HEIGHT: physicalHeight };
  };

  const { A4_WIDTH, A4_HEIGHT, PHYSICAL_WIDTH, PHYSICAL_HEIGHT } = React.useMemo(getPageDimensions, [printConfig.pageSize, printConfig.pageOrientation]);

  const filteredRows = React.useMemo(() => rows.filter(r => (isInventory ? r.itemName : r.ledgerName)), [rows, isInventory]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleManualPrint = () => {
    console.log('Manual Print Triggered');
    window.print();
  };
  
  const itemPages = React.useMemo(() => {
      const first = printConfig.itemsPerFirstPage || 12;
      const second = printConfig.itemsPerSecondPage || 15;
      const last = printConfig.itemsPerLastPage || 10;
      
      const hsnCount = (printConfig.showHsnSummary && filteredRows.length > 0) ? new Set(filteredRows.map(r => r.hsn)).size : 0;
      const effectiveLast = Math.max(1, last - (printConfig.showHsnSummary ? Math.ceil(hsnCount * 0.5) : 0));
      
      const pages = [];
      let start = 0;
      const totalItems = filteredRows.length;
      
      if (totalItems === 0) return [[]];

      let remaining = totalItems - start;
      if (remaining <= effectiveLast) {
          pages.push(filteredRows.slice(start, start + remaining));
          return pages;
      } else {
          pages.push(filteredRows.slice(start, start + first));
          start += first;
      }
      
      while (start < totalItems) {
          remaining = totalItems - start;
          if (remaining <= effectiveLast) {
               pages.push(filteredRows.slice(start, start + remaining));
               start += remaining;
               break;
          } else {
               const limit = second > 0 ? second : 15;
               const toTake = Math.min(remaining, limit);
               pages.push(filteredRows.slice(start, start + toTake));
               start += toTake;
          }
      }
      
      if (pages.length > 0) {
          let lastPageItems = pages[pages.length - 1].length;
          if (lastPageItems > effectiveLast) {
              pages.push([]);
          }
      }
      
      return pages;
  }, [filteredRows, (printConfig as any).itemsPerFirstPage, (printConfig as any).itemsPerSecondPage, (printConfig as any).itemsPerLastPage, printConfig.showHsnSummary]);

  const totalPages = Math.max(1, itemPages.length);
  const paginatedRows = itemPages[currentPage - 1] || [];

  useEffect(() => {
      if (currentPage > totalPages) {
          setCurrentPage(totalPages);
      }
  }, [totalPages, currentPage]);

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const padding = 32; // Responsive padding
        const containerWidth = containerRef.current.offsetWidth - (padding * 2);
        const containerHeight = containerRef.current.offsetHeight - (padding * 2);
        
        const docWidth = A4_WIDTH;
        const docHeight = A4_HEIGHT;

        const scaleW = containerWidth / docWidth;
        const scaleH = containerHeight / docHeight;
        
        // Take the minimum scale to fit entire page in view
        let newScale = Math.min(scaleW, scaleH);
        
        // Safety check for NaN or Infinity
        if (!isFinite(newScale) || isNaN(newScale)) {
            newScale = 0.5;
        }

        // We allow scaling up to filling the screen, but capped at 1.2x for quality
        const limitedScale = Math.max(0.1, Math.min(newScale, 1.2));
        
        setAutoScale(limitedScale);
      }
    };

    /*
    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    if (documentRef.current) {
      resizeObserver.observe(documentRef.current);
    }

    calculateScale();

    return () => {
      resizeObserver.disconnect();
    };
    */
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);

  }, []);

  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        handleManualPrint();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const handleZoomIn = () => setManualZoom(prev => Math.min((prev || autoScale) + 0.1, 2.5));
  const handleZoomOut = () => setManualZoom(prev => Math.max((prev || autoScale) - 0.1, 0.1));
  const handleResetZoom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
    setManualZoom(null);
    
    // Ensure scroll position is reset even after re-rendering
    requestAnimationFrame(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
            containerRef.current.scrollLeft = 0;
        }
    });
  };
  const handleFullSize = () => setManualZoom(1);

  // --- Deep Transformation Styles ---
  const tStyles = (() => {
     let c = {
        headerWrap: `flex justify-between items-start mb-2 relative z-10 border-b border-gray-200 pb-4`,
        logoBox: `${primaryBg} ${printConfig.compactMode ? 'w-10 h-10' : 'w-16 h-16'} ${appliedRadius} flex items-center justify-center text-white font-black shadow-sm`,
        titleText: `font-black ${primaryText} mb-1 uppercase tracking-tighter leading-none`,
        invoiceNumber: `font-bold text-gray-400 uppercase tracking-[0.3em]`,
        billingWrap: `grid grid-cols-2 gap-6 relative z-10 border-y border-gray-200 mb-2 py-3`,
        billingLeftBox: '',
        billingRightBox: 'flex flex-col justify-between text-right',
        billingLabel: `font-black text-gray-400 uppercase tracking-[0.2em]`,
        billingValue: `font-black text-gray-900 uppercase`,
        tableWrap: `flex-grow relative z-10`,
        tableHeadRow: `bg-gray-50 border-b border-gray-200 text-left`,
        tableHeadCell: `${printConfig.compactMode ? 'py-2 px-3' : 'py-4 px-4'} font-black text-gray-500 uppercase tracking-widest text-left`,
        tableBody: `divide-y divide-gray-100`,
        tableRow: `hover:bg-gray-50`,
        tableCellFirst: `${printConfig.compactMode ? 'py-3 px-3' : 'py-4 px-4'} font-bold text-gray-400 tabular-nums align-top`,
        tableCellLeft: `${printConfig.compactMode ? 'py-3 px-3' : 'py-4 px-4'} align-top`,
        tableCellRight: `${printConfig.compactMode ? 'py-3 px-3' : 'py-4 px-4'} font-bold text-gray-900 text-right tabular-nums align-top`,
        tableCellTotal: `font-black text-gray-900 text-right tabular-nums ${printConfig.compactMode?'py-3 px-3':'py-4 px-4'} align-top`,
        totalsWrap: `flex justify-between items-stretch pt-1 relative z-10`,
        narrationBox: `bg-gray-50/50 rounded-3xl border border-gray-100 ${printConfig.compactMode ? 'p-3' : 'p-4'} space-y-4`,
        totalsBox: `${primaryBg} text-white ${appliedRadius} shadow-2xl ${printConfig.compactMode ? 'w-64 p-4' : 'w-80 p-5'} space-y-3`,
        totalsLabel: `flex justify-between font-bold opacity-60 uppercase tracking-widest`,
        totalsDivider: `space-y-3 py-3 border-y border-white/20 my-3`,
        grandTotalLabel: `font-black text-white uppercase tracking-[0.3em] mb-1`,
        grandTotalValue: `font-black text-white tabular-nums tracking-tighter leading-none`,
        footerWrap: `flex justify-between items-end pt-1`,
        signaturesAuth: `font-black text-gray-400 uppercase tracking-widest mb-1 opacity-70`,
        signaturesBox: `space-y-2 text-right`,
        signaturesDivider: `${printConfig.compactMode ? 'w-full h-8' : 'w-full h-16'} border-b-[4px] ${primaryBorder} ${accentBg} ${appliedRadius} shadow-inner`
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
        
        c.headerWrap = `flex justify-between items-start ${printConfig.compactMode ? 'mb-2' : 'mb-4'} relative z-10 border-b-[3px] ${bdr} ${isB ? bgLight + ' p-4' : ''} pb-4`;
        c.billingWrap = `grid grid-cols-2 gap-6 relative z-10 border-b-[3px] ${bdr} ${divBdr} divide-x-[3px] mb-0`;
        c.billingLeftBox = `p-4 ${isB ? bgLight : 'py-3'}`;
        c.billingRightBox = `flex flex-col justify-between text-right p-4 ${isB ? bgMed : 'py-3 bg-gray-50'}`;
        c.tableWrap = `flex-grow relative z-10 border-b-[3px] ${bdr}`;
        c.tableHeadRow = `${bgDark} text-white border-b-[3px] ${bdr} text-left`;
        c.tableBody = `divide-y ${bdrLight}`;
        c.tableRow = `${isB ? `even:${bgLight} hover:${bgMed}` : 'hover:bg-gray-50'}`;
        c.tableCellFirst += ` border-r ${bdrLight}`;
        c.tableCellRight += ` border-x ${bdrLight}`;
        c.tableCellTotal = `font-black text-gray-900 border-l ${bdrLight} text-right tabular-nums align-top ${printConfig.compactMode?'py-4 px-3':'py-4 px-4'}`;
        c.totalsWrap = `flex justify-between items-stretch relative z-10 border-t-[3px] ${bdr} ${divBdr} divide-x-[3px]`;
        c.narrationBox = `bg-white p-0 rounded-none border-0`;
        c.totalsBox = `${colorPalette ? accentBg : (isB ? 'bg-slate-200' : 'bg-gray-50')} text-gray-900 ${printConfig.compactMode ? 'w-64 p-4' : 'w-80 p-5'} space-y-3`;
        c.totalsLabel = `flex justify-between font-bold ${textLgt} uppercase tracking-widest font-mono`;
        c.totalsDivider = `space-y-2 py-2 border-y-[2px] border-dotted ${bdr} my-2`;
        c.grandTotalLabel = `font-black text-gray-900 uppercase tracking-[0.3em] mb-1`;
        c.grandTotalValue = `font-black text-gray-900 tabular-nums tracking-tighter leading-none font-mono`;
        c.footerWrap = `flex justify-between items-end pt-1 border-t-[3px] ${bdr}`;
        c.signaturesDivider = `${printConfig.compactMode ? 'w-full h-8' : 'w-full h-16'} border-b-[3px] ${bdr}`;
     }
     else if (layout === 'Classic' || layout === 'Academic' || layout === 'Forest' || layout === 'Royal' || layout === 'Board') {
        const isBrd = layout === 'Board';
        const isFor = layout === 'Forest' || layout === 'Industrial Forest';
        const pB = colorPalette ? primaryBorder : (isFor ? 'border-emerald-800' : isBrd ? 'border-stone-800' : 'border-stone-200');
        const bg1 = colorPalette ? accentBg : (isFor?'bg-emerald-50':'bg-stone-50');
        const bg2 = colorPalette ? accentBg : 'hover:bg-stone-50';
        const text1 = colorPalette ? primaryText : (isFor?'text-emerald-900':'text-stone-700');
        
        c.headerWrap = `flex justify-between items-start mb-2 relative z-10 border-b-2 ${pB} pb-4`;
        c.titleText = `font-serif italic ${(isBrd && !colorPalette)?'text-stone-900':primaryText} mb-1 tracking-normal leading-none`;
        c.billingWrap = `grid grid-cols-2 gap-6 relative z-10 border-y-2 ${pB} mb-2 py-3`;
        c.billingLabel = `font-black italic text-stone-400`;
        c.billingValue = `font-serif font-black text-stone-900 leading-none`;
        c.tableHeadRow = `${bg1} border-b-2 ${pB}`;
        c.tableHeadCell = `${printConfig.compactMode ? 'py-2 px-3' : 'py-4 px-4'} font-serif font-black ${text1} uppercase tracking-widest text-left`;
        c.tableRow = `${bg2} border-b border-stone-100`;
        c.tableCellTotal = `font-serif italic font-black text-stone-900 text-right tabular-nums align-top ${printConfig.compactMode?'py-3 px-3':'py-4 px-4'}`;
        c.narrationBox = `${bg1} border ${pB} shadow-sm ${printConfig.compactMode ? 'p-4' : 'p-6'}`;
        c.totalsBox = `${colorPalette ? accentBg : (isFor?'bg-emerald-800 text-white':'bg-stone-100/50 text-stone-900')} border-l-2 ${pB} ${printConfig.compactMode ? 'w-64 p-4' : 'w-80 p-5'} space-y-3`;
        c.totalsLabel = `flex justify-between font-bold ${colorPalette ? primaryText : (isFor?'text-emerald-100':'text-stone-500')} uppercase tracking-widest`;
        c.totalsDivider = `space-y-2 py-2 border-y ${pB} my-2`;
        c.grandTotalLabel = `font-black ${colorPalette ? primaryText : (isFor?'text-emerald-50':'text-stone-400')} uppercase tracking-[0.3em] mb-1`;
        c.grandTotalValue = `font-serif italic font-black ${colorPalette ? primaryText : (isFor?'text-white':'text-stone-900')} tabular-nums tracking-tighter leading-none`;
        c.signaturesDivider = `${printConfig.compactMode ? 'w-full h-8' : 'w-full h-16'} border-b-2 ${pB} italic font-serif`;
     }
     else if (layout === 'Bold' || layout === 'Crimson' || layout === 'Sunset' || layout === 'Midnight') {
        const isB = layout === 'Bold' || layout === 'Crimson';
        const isS = layout === 'Sunset';
        const isM = layout === 'Midnight';
        
        const bdr = colorPalette ? primaryBorder : (isS?'border-orange-500':'border-black');
        const bgHead = colorPalette ? primaryBg : (isM?'bg-indigo-950':'bg-black');
        
        c.headerWrap = isS ? `flex justify-between items-start relative z-10 border-b-[8px] ${colorPalette ? primaryBorder : 'border-orange-500'} pb-3 mb-3` : 
                       (isM ? `flex justify-between items-start relative z-10 ${bgHead} text-white p-4 mb-3` :
                       `flex justify-between items-start relative z-10 ${bgHead} text-white p-4 mb-3`);
        c.titleText = `font-black ${colorPalette ? primaryText : (isM?'text-white':(isS?'text-orange-600':'text-white'))} mb-1 uppercase tracking-tighter leading-none`;
        c.invoiceNumber = `font-bold ${(isB||isM)?'text-white/60':'text-gray-400'} uppercase tracking-[0.3em]`;
        c.billingWrap = `grid grid-cols-2 gap-4 mb-3 py-3 relative z-10 ${colorPalette ? `border-y-4 ${primaryBorder}` : (isS?'border-y-2 border-orange-200':'border-b-4 border-black')}`;
        c.tableHeadRow = `${colorPalette ? primaryBg : (isS?'bg-orange-100 text-orange-900 border-y-2 border-orange-300':(isM?'bg-indigo-900 text-white':'bg-black text-white'))} text-left ${colorPalette ? 'text-white' : ''}`;
        c.tableHeadCell = `${printConfig.compactMode ? 'py-3 px-3' : 'py-4 px-4'} font-black ${colorPalette ? 'text-white' : (isS?'text-orange-900':'text-white')} uppercase tracking-widest text-left`;
        c.tableBody = `divide-y ${colorPalette ? primaryBorder : (isS?'divide-orange-100':(isM?'divide-indigo-100':'divide-black'))}`;
        c.tableRow = `hover:bg-gray-50`;
        c.narrationBox = `${colorPalette ? accentBg : (isS?'bg-orange-50':(isM?'bg-indigo-50':'bg-gray-50 border-t-4 border-black'))} ${printConfig.compactMode ? 'p-4 mt-4 space-y-4' : 'p-6 mt-6 space-y-4'} ${appliedRadius}`;
        c.totalsBox = `${colorPalette ? primaryBg : (isS?'bg-gradient-to-br from-orange-500 to-red-500':(isM?'bg-indigo-950':'bg-black'))} text-white ${printConfig.compactMode ? 'w-64 p-4' : 'w-80 p-5'} space-y-3 ${(!isS)?'border-l-8 border-white/20':''} shadow-2xl`;
        c.totalsDivider = `space-y-2 py-2 border-y border-white/20 my-2`;
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
           
           c.headerWrap = `flex justify-between items-start relative z-10 ${bg1} p-4 rounded-b-3xl mb-2 border-b ${bdr}`;
           c.billingWrap = `grid grid-cols-2 gap-6 relative z-10 ${bg2} rounded-2xl p-4 mx-4 mb-2 py-3`;
           c.tableHeadRow = `${bgDk} text-white rounded-t-xl text-left shadow-md`;
           c.tableHeadCell = `${printConfig.compactMode ? 'py-2 px-3' : 'py-3 px-4'} font-black text-white uppercase tracking-widest text-left first:rounded-tl-xl last:rounded-tr-xl`;
           c.tableBody = `divide-y ${bdr}`;
           c.tableRow = `even:${bg2} hover:bg-gray-50`;
           c.totalsBox = `${bgDk} text-white rounded-2xl shadow-xl ${printConfig.compactMode ? 'w-64 p-4' : 'w-80 p-5'} space-y-3`;
        }
     }
     else if (layout === 'Technical') {
        const bdr = colorPalette ? primaryBorder : 'border-black';
        const textH = colorPalette ? primaryText : 'text-white';
        
        c.headerWrap = `flex justify-between items-start ${printConfig.compactMode ? 'mb-2' : 'mb-4'} relative z-10 border-b-[3px] ${bdr} pb-4`;
        c.billingWrap = `grid grid-cols-2 gap-6 relative z-10 border-b-[3px] ${bdr} divide-x-[3px] ${bdr.replace('border-', 'divide-')} mb-0`;
        c.billingLeftBox = 'p-4 py-3';
        c.billingRightBox = `flex flex-col justify-between text-right p-4 py-3 ${colorPalette ? accentBg : 'bg-gray-50/30'}`;
        c.tableWrap = `flex-grow relative z-10 border-b-[3px] ${bdr}`;
        c.tableHeadRow = `${colorPalette ? primaryBg : 'bg-black'} ${bdr} text-white border-b-[3px] text-left`;
        c.tableBody = `divide-y ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'divide-black/10'}`;
        c.tableRow = `hover:bg-gray-50 text-gray-900 border-x ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'border-black/10'}`;
        c.tableCellFirst += ` border-r ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'border-black/10'}`;
        c.tableCellRight += ` border-x ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'border-black/10'}`;
        c.tableCellTotal = `font-black text-gray-900 border-l ${colorPalette ? primaryBorder.replace(/600|700|800|900/, '200') : 'border-black/10'} text-right tabular-nums align-top ${printConfig.compactMode?'py-4 px-3':'py-4 px-4'}`;
        c.totalsWrap = `flex justify-between items-stretch relative z-10 border-t-[3px] ${bdr} divide-x-[3px] ${bdr.replace('border-', 'divide-')}`;
        c.narrationBox = `bg-white p-0 rounded-none border-0`;
        c.totalsBox = `${colorPalette ? accentBg : 'bg-gray-50/30'} text-gray-900 ${printConfig.compactMode ? 'w-64 p-4' : 'w-80 p-5'} space-y-3`;
        c.totalsLabel = `flex justify-between font-bold ${colorPalette ? primaryText : 'text-gray-500'} uppercase tracking-widest font-mono`;
        c.totalsDivider = `space-y-2 py-2 border-y-[2px] border-dotted ${bdr} my-2`;
        c.grandTotalLabel = `font-black text-gray-900 uppercase tracking-[0.3em] mb-1`;
        c.grandTotalValue = `font-black ${colorPalette ? primaryText : 'text-gray-900 tracking-tighter '} tabular-nums leading-none font-mono`;
        c.footerWrap = `flex justify-between items-end pt-1 border-t-[3px] ${bdr}`;
        c.signaturesDivider = `${printConfig.compactMode ? 'w-full h-8' : 'w-full h-16'} border-b-[3px] ${bdr}`;
     }

     if (layout === 'Modern') {
        c.totalsBox = `bg-white border text-gray-900 border-gray-200 rounded-3xl shadow-xl ${printConfig.compactMode ? 'w-64 p-4 bg-white' : 'w-80 p-5 bg-white'} space-y-3`;
        c.totalsLabel = `flex justify-between font-bold text-gray-600 uppercase tracking-widest`;
        c.totalsDivider = `space-y-2 py-2 border-y border-gray-200 my-2`;
        c.grandTotalLabel = `font-black ${colorPalette ? primaryText : 'text-blue-600'} uppercase tracking-[0.3em] mb-1`;
        c.grandTotalValue = `font-black ${colorPalette ? primaryText : 'text-blue-600'} tabular-nums tracking-tighter leading-none`;
     }

     return c;
  })();
  
    const isERPTheme = ['Modern', 'Tally', 'Vyapar', 'Busy', 'Academic'].includes(layout);

    const parseSafe = (val: any): number => {
        if (typeof val === 'string') {
            val = val.replace(/,/g, '');
        }
        const parsed = parseFloat(val);
        return isFinite(parsed) && !isNaN(parsed) ? parsed : 0;
    };

    const handleToggleSetting = (key: keyof typeof printConfig) => {
        setPrintConfig(prev => {
            const next = { ...prev, [key]: !prev[key as keyof typeof printConfig] };
            localStorage.setItem('bharat_book_print_settings_v3', JSON.stringify(next));
            window.dispatchEvent(new Event('print_settings_updated'));
            return next;
        });
    };

    const SETTING_SECTIONS = [
        {
            title: 'Layout & Density',
            settings: [
                { key: 'compactMode', label: 'Compact Mode' },
                { key: 'useGrayScale', label: 'Grayscale Output' }
            ]
        },
        {
            title: 'Header & Details',
            settings: [
                { key: 'showLogo', label: 'Company Logo' },
                { key: 'showHeader', label: 'Company Header' },
                { key: 'showBilling', label: 'Billing Details' }
            ]
        },
        {
            title: 'Table Columns',
            settings: [
                { key: 'showHSN', label: 'HSN/SAC Code' },
                { key: 'showQty', label: 'Quantity' },
                { key: 'showRate', label: 'Rate' },
                { key: 'showDiscountPercentage', label: 'Discount %' },
                { key: 'showDiscountAmount', label: 'Discount Amount' }
            ]
        },
        {
            title: 'Footer & Summaries',
            settings: [
                { key: 'showAmountInWords', label: 'Amount in Words' },
                { key: 'showTaxDetails', label: 'Tax Details' },
                { key: 'showHsnSummary', label: 'HSN Summary' },
                { key: 'showNarration', label: 'Narration / Remarks' },
                { key: 'showCustomerSign', label: 'Customer Signature' },
                { key: 'showSignature', label: 'Authorized Signature' },
                { key: 'showFooterNotes', label: 'Footer Notes' }
            ]
        }
    ];

    return (
      <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-[100vw] lg:max-w-7xl h-[100dvh] md:h-[95dvh] md:rounded-3xl shadow-2xl overflow-hidden flex border border-white/20 relative dark:bg-gray-800">
          
          {/* Settings Side Panel */}
          <div className="hidden lg:flex w-72 flex-col border-r border-gray-200 bg-gray-50 overflow-y-auto no-print shrink-0 dark:border-gray-700 dark:bg-gray-900">
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 flex items-center gap-2 dark:border-gray-700 dark:bg-gray-800">
              <Settings size={18} className="text-gray-500 dark:text-gray-400" />
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-100">
                Print Configuration
              </h2>
            </div>
            
            <div className="p-4 space-y-6">
                {SETTING_SECTIONS.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{section.title}</h3>
                        <div className="space-y-1">
                            {section.settings.map(setting => (
                                <button
                                    key={setting.key}
                                    onClick={() => handleToggleSetting(setting.key as keyof typeof printConfig)}
                                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors group dark:hover:bg-gray-600"
                                >
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-200">{setting.label}</span>
                                    {printConfig[setting.key as keyof typeof printConfig] ? (
                                        <ToggleRight size={20} className="text-blue-500 transition-transform active:scale-90" />
                                    ) : (
                                        <ToggleLeft size={20} className="text-gray-300 transition-transform active:scale-90" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Main Preview Panel */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Actions */}
        <div className="p-3 md:p-4 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/90 backdrop-blur-sm gap-3 sticky top-0 z-10 no-print dark:border-gray-800">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleManualPrint}
              className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
              title="Print Document"
            >
              <Printer size={20} />
            </button>
            <div className="hidden sm:block">
              <h3 className="text-sm md:text-lg font-black text-gray-900 uppercase tracking-tight leading-none dark:text-white">{type.replace('_', ' ')} Preview</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{header?.voucherNumber || header?.entryNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 flex-1 justify-end">
            <div className="flex items-center gap-2">
              {onDownloadPDF && (
                <button 
                  onClick={onDownloadPDF}
                  className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95 shadow-blue-500/20"
                >
                  <Download size={14} /> <span className="hidden sm:inline">PDF</span>
                </button>
              )}
              {onDownloadImage && (
                <button 
                  onClick={onDownloadImage}
                  className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <ImageIcon size={14} /> <span className="hidden sm:inline">Image</span>
                </button>
              )}
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 border border-gray-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95 ml-1 md:ml-4 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div 
          ref={containerRef} 
          className="flex-1 bg-gray-200/40 relative scroll-smooth overflow-auto p-4 md:p-8"
        >
          <div className="min-h-full flex flex-col justify-center items-center">
            <div 
              className="transition-all duration-300 relative flex-shrink-0" 
              style={{ 
                width: `${A4_WIDTH * (previewScale || 1)}px`, 
                height: `${A4_HEIGHT * (previewScale || 1)}px`, 
                margin: '0 auto' 
              }}
            >
              <div 
                className="shadow-[0_30px_100px_rgba(0,0,0,0.15)] bg-white transition-transform duration-300 ease-out flex flex-col absolute top-0 left-0 origin-top-left dark:bg-gray-800"
                style={{ 
                  transform: `scale(${previewScale || 1})`,
                  width: PHYSICAL_WIDTH,
                  minWidth: PHYSICAL_WIDTH,
                  minHeight: PHYSICAL_HEIGHT,
                }}
              >
            <style>{`
                @media print {
                  @page { size: ${printConfig.pageSize || 'A4'} ${printConfig.pageOrientation?.toLowerCase() || 'portrait'}; margin: 0mm; }
                  body { margin: 0; padding: 0; }
                  body * {
                    visibility: hidden;
                  }
                  #voucher-to-print, #voucher-to-print * {
                    visibility: visible;
                  }
                  #voucher-to-print {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100% !important;
                  }
                  .voucher-print-page {
                    width: ${PHYSICAL_WIDTH} !important;
                    max-width: ${PHYSICAL_WIDTH} !important;
                    min-height: ${PHYSICAL_HEIGHT} !important;
                    height: auto !important;
                    overflow: visible !important;
                    margin: 0 !important;
                    box-sizing: border-box !important;
                    padding-top: calc(${(printConfig.marginTop ?? 0.5)}in + ${plainSpacing}px) !important;
                    padding-bottom: calc(${(printConfig.marginBottom ?? 0.5)}in + ${plainSpacing}px) !important;
                    padding-left: calc(${(printConfig.marginLeft ?? 0.5)}in + ${plainSpacing}px) !important;
                    padding-right: calc(${(printConfig.marginRight ?? 0.5)}in + ${plainSpacing}px) !important;
                    font-size: ${baseSize}px !important;
                    line-height: ${lineHeightMultiplier} !important;
                    letter-spacing: ${letterSpacing}px !important;
                    word-spacing: ${wordSpacing}px !important;
                    font-weight: ${fontWeight} !important;
                    ${textTransform !== 'default' ? `text-transform: ${textTransform} !important;` : ''}
                    border: none !important;
                    box-shadow: none !important;
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                    page-break-after: always;
                    ${printConfig.useGrayScale ? 'filter: grayscale(1) contrast(1.25) !important;' : ''}
                  }
                  .voucher-print-page:last-child {
                    page-break-after: auto;
                  }
                  .no-print {
                    display: none !important;
                  }
                }
              `}</style>
        <div id="voucher-to-print" ref={documentRef} className="w-full h-full">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                const isLastPage = pageNum === totalPages;
                const pageRows = itemPages[pageNum - 1] || [];
                const absoluteStartIndex = itemPages.slice(0, pageNum - 1).reduce((sum, page) => sum + page.length, 0);
                
                return (
                    <div 
                        key={pageNum}
                            className={`voucher-print-page bg-white flex-col min-h-full border border-gray-100 select-text transition-all duration-300 relative ${printConfig.useGrayScale ? 'grayscale contrast-125' : ''} ${isTechnical ? 'border-[3px] border-black' : ''} ${textTransform !== 'default' ? `text-transform-${textTransform}` : ''} ${pageNum === currentPage ? 'flex' : 'hidden print:flex'}`}
                            style={{ 
                                boxSizing: 'border-box',
                                width: PHYSICAL_WIDTH, 
                                minHeight: PHYSICAL_HEIGHT,
                                height: 'auto',
                                overflow: 'visible',
                                fontSize: `${baseSize}px`,
                                lineHeight: lineHeightMultiplier,
                                letterSpacing: `${letterSpacing}px`,
                                wordSpacing: `${wordSpacing}px`,
                                fontWeight: fontWeight as any,
                                paddingTop: `calc(${(printConfig.marginTop ?? 0.5)}in + ${plainSpacing}px)`,
                                paddingBottom: `calc(${(printConfig.marginBottom ?? 0.5)}in + ${plainSpacing}px)`,
                                paddingLeft: `calc(${(printConfig.marginLeft ?? 0.5)}in + ${plainSpacing}px)`,
                                paddingRight: `calc(${(printConfig.marginRight ?? 0.5)}in + ${plainSpacing}px)`,
                                fontFamily: appliedFont,
                                backgroundColor: 'white'
                            }}
                        >

              {/* Technical grid background */}
              <style>{`
                  #voucher-to-print h1, #voucher-to-print h2, #voucher-to-print h3, #voucher-to-print h4, #voucher-to-print h5, #voucher-to-print h6 {
                      margin-bottom: ${headerSpacing}px !important;
                  }
                  #voucher-to-print p, #voucher-to-print .paragraph {
                      margin-bottom: ${paragraphSpacing}px !important;
                  }
              `}</style>
              {isTechnical && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
              )}

              {/* Page Number Top */}
              {(printConfig as any).showPageNumber === 'Yes' && (printConfig as any).pageNumberLocation === 'Top' && (
                  <div className={`w-full ${(printConfig as any).pageNumberAlignment === 'Center' ? 'text-center' : (printConfig as any).pageNumberAlignment === 'Left' ? 'text-left' : 'text-right'} font-bold text-gray-500 mb-2 uppercase tracking-widest`} style={{ fontSize: `${baseSize * 0.7}px` }}>
                      {(printConfig as any).pageNumberFormat === '1' ? pageNum : (printConfig as any).pageNumberFormat === 'Page 1' ? `Page ${pageNum}` : (printConfig as any).pageNumberFormat === '- 1 -' ? `- ${pageNum} -` : `Page ${pageNum} of ${totalPages}`}
                  </div>
              )}

              {((printConfig as any).headerDisplay === 'All Pages' || (!('headerDisplay' in printConfig) && pageNum === 1) || ((printConfig as any).headerDisplay === 'First Page Only' && pageNum === 1) || ((printConfig as any).headerDisplay === 'First & Last Page' && (pageNum === 1 || isLastPage))) && (
                <>
                  {/* Invoice Header */}
                  {printConfig.showHeader && (
                    <div className={tStyles.headerWrap}>
                      <div className="flex items-start gap-4">
                        {printConfig.showLogo && (
                          <div className={tStyles.logoBox}>
                            <FileText size={printConfig.compactMode ? 20 : 32} />
                          </div>
                        )}
                        <div>
                          <h1 
                            {...getSectionStyle('header', tStyles.titleText, { fontSize: `${baseSize * headingScale * 2}px` })}
                          >
                            {isSerif ? type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1) : type.replace('_', ' ').toUpperCase()}
                          </h1>
                          <p {...getSectionStyle('header', tStyles.invoiceNumber, { fontSize: `${baseSize * 0.7}px` })}>{header?.voucherNumber || header?.entryNumber}</p>
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

                  {printConfig.showBilling && (
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
                </>
              )}

              {/* Table */}
              <div className={tStyles.tableWrap}>
                <table className="w-full h-full border-collapse">
                    <thead>
                        <tr className={tStyles.tableHeadRow}>
                            <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell, { fontSize: `${baseSize * 0.7}px` })}>SR.</th>
                            <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' w-1/2', { fontSize: `${baseSize * 0.7}px` })}>Description of Goods/Services</th>
                            {isInventory ? (
                                <>
                                    {printConfig.showMrp && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>MRP</th>
                                    )}
                                    {printConfig.showQty && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Quantity</th>
                                    )}
                                    {printConfig.showRate && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Rate</th>
                                    )}
                                    {printConfig.showDiscountPercentage && (
                                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Disc (%)</th>
                                    )}
                                    {printConfig.showDiscountAmount && (
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
                        {pageRows.map((row, index) => (
                            <tr key={index} className={tStyles.tableRow}>
                                <td className={tStyles.tableCellFirst} style={{ fontSize: `${baseSize * 0.9}px` }}>{String(absoluteStartIndex + index + 1).padStart(2, '0')}</td>
                                <td className={tStyles.tableCellLeft}>
                                    <div {...getSectionStyle('lineItem', `font-black text-gray-900 uppercase tracking-tight ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * (printConfig.compactMode ? 1.0 : 1.33)}px` })}>{isInventory ? row.itemName : row.ledgerName}</div>
                                    {printConfig.showHSN && row.hsn && <div className={`${primaryText} font-black uppercase tracking-widest opacity-60`} style={{ fontSize: `${baseSize * 0.66}px`, marginTop: `${baseSize * 0.15}px` }}>HSN Code: {row.hsn}</div>}
                                </td>
                                {isInventory ? (
                                    <>
                                        {printConfig.showMrp && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.mrp ? parseSafe(row.mrp).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                                        )}
                                        {printConfig.showQty && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.qty} {row.uom}</td>
                                        )}
                                        {printConfig.showRate && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{parseSafe(row.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        )}
                                        {printConfig.showDiscountPercentage && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.discountPercent ? `${row.discountPercent}%` : '-'}</td>
                                        )}
                                        {printConfig.showDiscountAmount && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.discountAmount ? parseSafe(row.discountAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                                        )}
                                        <td className={`${printConfig.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-600 text-right tabular-nums align-top dark:text-gray-300`} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.tax}%</td>
                                    </>
                                ) : (
                                    <td className={`${printConfig.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-black ${primaryText} text-right tracking-widest uppercase align-top`} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.crDr || (type === 'payment' && index === 0 ? 'Cr' : type === 'payment' ? 'Dr' : type === 'receipt' && index === 0 ? 'Dr' : type === 'receipt' ? 'Cr' : type === 'journal' ? 'Dr' : 'Cr')}</td>
                                )}
                                <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 1.2}px` }}>{parseSafe(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        {((printConfig as any).pageSubtotalDisplay === 'All Pages' || isLastPage) && (
                            <tr className={`${tStyles.tableRow} bg-gray-50/50`}>
                                <td className={tStyles.tableCellFirst}></td>
                                <td className={tStyles.tableCellLeft}>
                                    <div className={`${isSerif ? 'font-serif' : 'font-black'} text-gray-500 uppercase tracking-widest`} style={{ fontSize: `${baseSize * 0.9}px` }}>Page Subtotal ({pageRows.length} Item{pageRows.length !== 1 ? 's' : ''})</div>
                                </td>
                                {isInventory ? (
                                    <>
                                        {printConfig.showMrp && <td className={tStyles.tableCellRight}></td>}
                                        {printConfig.showQty && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{pageRows.reduce((a, b) => a + (Number(b.qty) || 0), 0)}</td>
                                        )}
                                        {printConfig.showRate && <td className={tStyles.tableCellRight}></td>}
                                        {printConfig.showDiscountPercentage && <td className={tStyles.tableCellRight}></td>}
                                        {printConfig.showDiscountAmount && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{pageRows.reduce((a, b) => a + parseSafe(b.discountAmount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        )}
                                        <td className={`${printConfig.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-600 text-right tabular-nums align-top`}></td>
                                    </>
                                ) : (
                                    <td className={`${printConfig.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-black ${primaryText} text-right tracking-widest uppercase align-top`}></td>
                                )}
                                <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 1.2}px` }}>{pageRows.reduce((a, b) => a + parseSafe(b.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
              </div>

              {isLastPage ? (
                <>
                  {printConfig.showHsnSummary && (
                        <div className={`${isTechnical ? 'border-t md:border-t-2 border-black pt-2 md:pt-3' : 'border-t md:border-t-2 border-gray-200/50 pt-2 md:pt-3'} relative z-10 mt-2`}>
                          <div className={`font-black text-gray-400 uppercase tracking-widest mb-1`} style={{ fontSize: `${baseSize * 0.75}px` }}>HSN-wise Summary</div>
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
                              const rate = parseSafe(row.rate);
                              const amount = row.amount !== undefined ? parseSafe(row.amount) : qty * rate;
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
                      <div className={isTechnical ? 'p-4 flex-1' : 'pr-8 flex-1'}>
                        {(printConfig.showAmountInWords || (header.narration && printConfig.showNarration)) && (
                            <div className={tStyles.narrationBox}>
                              {printConfig.showAmountInWords && (
                                <div>
                                    <div className={`font-black text-gray-400 uppercase tracking-[0.2em] mb-1`} style={{ fontSize: `${baseSize * 0.7}px` }}>Total amount in words</div>
                                    <div {...getSectionStyle('amountInWords', `font-black text-gray-800 italic leading-snug uppercase tracking-tight ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                      Indian Rupees {numberToWords(Math.floor(totals.grandTotal || totals.finalValue))}
                                    </div>
                                </div>
                              )}
                              
                              {header.narration && printConfig.showNarration && (
                                <div className={`${printConfig.showAmountInWords ? 'pt-1 mt-1 border-t border-gray-200/40' : ''} ${isTechnical ? 'border-black' : ''}`}>
                                  <div className={`font-black text-gray-400 uppercase tracking-[0.2em] mb-1`} style={{ fontSize: `${baseSize * 0.7}px` }}>Official Narration</div>
                                  <div {...getSectionStyle('narration', `text-gray-600 leading-relaxed font-bold uppercase tracking-tight ${isTechnical ? 'font-mono' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>{header.narration}</div>
                                </div>
                              )}
                            </div>
                        )}
                      </div>
                      <div className={tStyles.totalsBox}>
                        <div className={`${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`} style={{ fontSize: `${baseSize * 0.9}px` }}>
                          <span>Taxable Amount</span>
                          <span className="tabular-nums">₹{parseSafe(totals.taxableValue || totals.estValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        {printConfig.showTaxDetails && (
                            <div className={tStyles.totalsDivider}>
                                {(totals.computedSupplyType === 'Inter-State') ? (
                                <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                    <span>IGST</span>
                                    <span className="tabular-nums">₹{parseSafe(totals.igst).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                ) : (
                                <>
                                    <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                    <span>CGST</span>
                                    <span className="tabular-nums">₹{parseSafe(totals.cgst).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                    <span>SGST</span>
                                    <span className="tabular-nums">₹{parseSafe(totals.sgst).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </>
                                )}
                            </div>
                        )}
                        
                        <div className={tStyles.totalsDivider + " mt-2"}>
                          {(totals.otherAdjustment || 0) !== 0 && (
                            <div {...getSectionStyle('adjustment', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                              <span>{header.taxableAdjustmentRemarks || "Taxable Adjustments"}</span>
                              <span className="tabular-nums">₹{parseSafe(totals.otherAdjustment).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          {(totals.nonTaxableAdjustment || 0) !== 0 && (
                            <div {...getSectionStyle('adjustment', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                              <span>{header.nonTaxableAdjustmentRemarks || "Non-Taxable Adjustments"}</span>
                              <span className="tabular-nums">₹{parseSafe(totals.nonTaxableAdjustment).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          {(totals.voucherDiscount || 0) !== 0 && (
                            <div {...getSectionStyle('discount', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                              <span>Voucher Discount</span>
                              <span className="tabular-nums mb-1">- ₹{parseSafe(totals.voucherDiscount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 items-end pt-2">
                          <div className={tStyles.grandTotalLabel} style={{ fontSize: `${baseSize * 0.9}px` }}>{layout === 'Modern' ? 'Net invoice amount' : 'Payable'}</div>
                          <div {...getSectionStyle('grandTotal', tStyles.titleText.replace('mb-1', ''), { 
                            fontSize: `${baseSize * headingScale * 2 * (
                              parseSafe(totals.grandTotal || totals.finalValue).toLocaleString(undefined, { minimumFractionDigits: 2 }).length > 15 ? 0.6 :
                              parseSafe(totals.grandTotal || totals.finalValue).toLocaleString(undefined, { minimumFractionDigits: 2 }).length > 12 ? 0.75 : 
                              parseSafe(totals.grandTotal || totals.finalValue).toLocaleString(undefined, { minimumFractionDigits: 2 }).length > 10 ? 0.85 : 
                              1.0
                            )}px`,
                            lineHeight: '1.1'
                          })}>₹{parseSafe(totals.grandTotal || totals.finalValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        </div>
                      </div>
                    </div>

                  {/* Footers */}
                  <div className={`relative z-10 mt-0 break-inside-avoid`}>
                    <div className={tStyles.footerWrap}>
                      <div className="text-left w-1/3">
                        {printConfig.showCustomerSign && (
                          <div className={isTechnical ? 'border-2 border-black p-4 inline-block' : ''}>
                            <div {...getSectionStyle('signatures', tStyles.signaturesAuth, { fontSize: `${baseSize * 0.7}px` })}>Customer Authorization</div>
                            <div className={tStyles.signaturesDivider}></div>
                          </div>
                        )}
                      </div>
                      <div className="text-right w-1/2">
                        {printConfig.showSignature && (
                          <div className={tStyles.signaturesBox}>
                            <div {...getSectionStyle('signatures', `font-black text-gray-900 uppercase tracking-widest`, { fontSize: `${baseSize * 0.8}px` })}>Authorized For BHARAT BOOK</div>
                            <div className={tStyles.signaturesDivider}></div>
                            <div {...getSectionStyle('signatures', `font-black ${primaryText} uppercase tracking-[0.4em] opacity-100 mt-2`, { fontSize: `${baseSize * 0.8}px` })}>
                                {(printConfig as any).selectedUser ? (printConfig as any).selectedUser : 'Official Stamp & Sign'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {printConfig.showFooterNotes && (
                    <div className="w-full pt-4 pb-2 mt-4 border-t border-gray-100/50">
                      <p className={`${printConfig.compactMode ? 'text-[8px]' : 'text-[10px]'} font-black text-gray-400 text-center uppercase tracking-[0.5em]`}>
                        Computer Generated Official Document
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 mt-auto text-center font-black uppercase text-gray-400 tracking-[0.2em] opacity-50" style={{ fontSize: `${baseSize * 0.8}px` }}>Continued to Page {pageNum + 1}...</div>
              )}

              {/* Page Number Bottom */}
              {(printConfig as any).showPageNumber === 'Yes' && (printConfig as any).pageNumberLocation === 'Bottom' && (
                  <div className={`w-full mt-auto pt-2 pb-2 ${(printConfig as any).pageNumberAlignment === 'Center' ? 'text-center' : (printConfig as any).pageNumberAlignment === 'Left' ? 'text-left' : 'text-right'} font-bold text-gray-500 uppercase tracking-widest bg-white`} style={{ fontSize: `${baseSize * 0.7}px` }}>
                      {(printConfig as any).pageNumberFormat === '1' ? pageNum : (printConfig as any).pageNumberFormat === 'Page 1' ? `Page ${pageNum}` : (printConfig as any).pageNumberFormat === '- 1 -' ? `- ${pageNum} -` : `Page ${pageNum} of ${totalPages}`}
                  </div>
              )}
            </div>
          );
        })}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Bottom Zoom Controls Section */}
        <div className="border-t border-gray-200 bg-white p-3 md:p-4 flex flex-col sm:flex-row flex-shrink-0 justify-center items-center gap-2 sm:gap-4 z-20 no-print text-black dark:border-gray-700 dark:bg-gray-800">
          {totalPages > 1 && (
              <div className="flex items-center justify-center bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-1 gap-1 dark:bg-gray-700 dark:border-gray-600">
                  <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1.5 hover:bg-white rounded-md text-black disabled:opacity-50 transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
                      title="First Page"
                  ><ChevronsLeft size={18} /></button>
                  <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 hover:bg-white rounded-md text-black disabled:opacity-50 transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
                      title="Previous Page"
                  ><ChevronLeft size={18} /></button>
                  
                  <div className="text-xs font-black px-2 tabular-nums min-w-[60px] text-center dark:text-gray-200">
                      {currentPage} / {totalPages}
                  </div>
                  
                  <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 hover:bg-white rounded-md text-black disabled:opacity-50 transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
                      title="Next Page"
                  ><ChevronRight size={18} /></button>
                  <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 hover:bg-white rounded-md text-black disabled:opacity-50 transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
                      title="Last Page"
                  ><ChevronsRight size={18} /></button>
              </div>
          )}
          
          <div className="flex items-center justify-center bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-1 gap-1 dark:bg-gray-700 dark:border-gray-600">
              <button 
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-white rounded-md text-black transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <div className="w-16 text-center text-sm font-black text-black tabular-nums dark:text-gray-200">
                {Math.round(previewScale * 100)}%
              </div>
              <button 
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-white rounded-md text-black transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1 md:mx-2 dark:bg-gray-600" />
              <button 
                onClick={handleResetZoom}
                className={`p-1.5 rounded-md transition-all active:scale-95 flex items-center gap-2 px-3 ${manualZoom === null ? 'text-black bg-white shadow-sm font-bold dark:bg-gray-600' : 'text-black hover:bg-white dark:text-gray-200 dark:hover:bg-gray-600'} `}
                title="Fit to Screen"
              >
                <RotateCcw size={16} />
                <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">Fit</span>
              </button>
              <button 
                onClick={handleFullSize}
                className={`p-1.5 rounded-md transition-all active:scale-95 flex items-center gap-2 px-3 ${manualZoom === 1 ? 'text-black bg-white shadow-sm font-bold dark:bg-gray-600' : 'text-black hover:bg-white dark:text-gray-200 dark:hover:bg-gray-600'} `}
                title="Actual Size (100%)"
              >
                <Maximize size={16} />
                <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">100%</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
