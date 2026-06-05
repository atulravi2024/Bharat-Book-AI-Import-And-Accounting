import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';

export interface UseVoucherPreviewLogicProps {
  header: any;
  rows: any[];
  totals: any;
  type: string;
  onClose: () => void;
  autoPrint?: boolean;
}

export const useVoucherPreviewLogic = ({
  header = {},
  rows = [],
  totals = {},
  type = 'voucher',
  onClose,
  autoPrint
}: UseVoucherPreviewLogicProps) => {
  const { t, formatNumber } = useLanguage();
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
          setPrintConfig((prev: any) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to parse saved settings", e);
        }
      }
    };
    
    loadSettings();
    window.addEventListener('print_settings_updated', loadSettings);
    return () => window.removeEventListener('print_settings_updated', loadSettings);
  }, []);

  // Theme configuration variables
  const layout = printConfig.designLayout || 'Modern';
  const isTally = layout === 'Tally';
  const isBusy = layout === 'Busy';
  const isClassic = ['Classic', 'Academic', 'Forest', 'Royal', 'Sunset', 'Midnight'].includes(layout);
  const isTechnical = ['Technical', 'Tally', 'Busy'].includes(layout);
  const isBold = ['Bold', 'Crimson'].includes(layout);
  const isSerif = isClassic;

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

  const primaryText = printConfig.useGrayScale ? 'text-black' : activeColorTheme.text;
  const primaryBg = printConfig.useGrayScale ? 'bg-black' : activeColorTheme.bg;
  const primaryBorder = printConfig.useGrayScale ? 'border-black' : activeColorTheme.border;
  const accentBg = printConfig.useGrayScale ? 'bg-gray-100' : activeColorTheme.accent;

  const appliedFont = printConfig.fontFamily && printConfig.fontFamily !== 'Default' ? printConfig.fontFamily : activeTheme.font;
  const appliedRadius = activeTheme.radius;

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
  }, [filteredRows, printConfig.itemsPerFirstPage, printConfig.itemsPerSecondPage, printConfig.itemsPerLastPage, printConfig.showHsnSummary]);

  const totalPages = Math.max(1, itemPages.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const padding = 32;
        const containerWidth = containerRef.current.offsetWidth - (padding * 2);
        const containerHeight = containerRef.current.offsetHeight - (padding * 2);
        
        const docWidth = A4_WIDTH;
        const docHeight = A4_HEIGHT;

        const scaleW = containerWidth / docWidth;
        const scaleH = containerHeight / docHeight;
        
        let newScale = Math.min(scaleW, scaleH);
        
        if (!isFinite(newScale) || isNaN(newScale)) {
          newScale = 0.5;
        }

        const limitedScale = Math.max(0.1, Math.min(newScale, 1.2));
        setAutoScale(limitedScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [A4_WIDTH, A4_HEIGHT]);

  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        handleManualPrint();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const handleZoomIn = () => setManualZoom((prev: any) => Math.min((prev || autoScale) + 0.1, 2.5));
  const handleZoomOut = () => setManualZoom((prev: any) => Math.max((prev || autoScale) - 0.1, 0.1));
  const handleResetZoom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
    setManualZoom(null);
    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
        containerRef.current.scrollLeft = 0;
      }
    });
  };
  const handleFullSize = () => setManualZoom(1);

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
    setPrintConfig((prev: any) => {
      const next = { ...prev, [key]: !prev[key as keyof typeof printConfig] };
      localStorage.setItem('bharat_book_print_settings_v3', JSON.stringify(next));
      window.dispatchEvent(new Event('print_settings_updated'));
      return next;
    });
  };

  return {
    t,
    formatNumber,
    isInventory,
    previewScale,
    containerRef,
    documentRef,
    printConfig,
    layout,
    isTally,
    isBusy,
    isClassic,
    isTechnical,
    isBold,
    isSerif,
    primaryText,
    primaryBg,
    primaryBorder,
    accentBg,
    appliedFont,
    appliedRadius,
    baseSize,
    lineHeightMultiplier,
    headingScale,
    letterSpacing,
    wordSpacing,
    paragraphSpacing,
    headerSpacing,
    plainSpacing,
    fontWeight,
    textTransform,
    getSectionStyle,
    A4_WIDTH,
    A4_HEIGHT,
    PHYSICAL_WIDTH,
    PHYSICAL_HEIGHT,
    filteredRows,
    currentPage,
    setCurrentPage,
    handleManualPrint,
    itemPages,
    totalPages,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleFullSize,
    tStyles,
    isERPTheme,
    parseSafe,
    handleToggleSetting,
  };
};
