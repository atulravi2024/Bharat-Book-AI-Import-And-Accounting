import { AccountingERPThemesSection } from './AccountingERPThemesSection';
import { ColorSpectrumPalettesSection } from './ColorSpectrumPalettesSection';
import { AestheticPresetsSection } from './AestheticPresetsSection';
import { FontSelectionSection } from './FontSelectionSection';
import { SpaceandMarginSection } from './SpaceandMarginSection';
import { SectionSpecificStylingSection } from './SectionSpecificStylingSection';
import { LayoutComponentsSection } from './LayoutComponentsSection';
import { DataVisibilitySection } from './DataVisibilitySection';
import { PageDimensionsSection } from './PageDimensionsSection';
import { ItemSettingsSection } from './ItemSettingsSection';
import { InformationPlannerSection } from './InformationPlannerSection';
import { AdvancedPaginationHeadersSection } from './AdvancedPaginationHeadersSection';
import { useLanguage } from '../../../context/LanguageContext';
import { numberToWords } from '../../../lib/numberToWords';
import { SettingsIcon, CheckCircleIcon } from '../../icons/IconComponents';
import { ToggleLeft, ToggleRight, Layout, Type, FileText, Image as ImageIcon, Signature, Hash, Calculator, Printer, Maximize, Focus, Palette, Columns, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Upload, Download } from 'lucide-react';
import { VoucherPreview } from '../../Operations/VoucherEntry/VoucherPreview';
import { VISUAL_THEME_PALETTES } from '../VisualDesignPaletteData';
import React, { useState, useEffect, useRef } from 'react';

export const VoucherPreviewComponent: React.FC<{ header: any, rows: any[], allRows?: any[], totals: any, type: string, config: any, isLastPage?: boolean, pageNum?: number, totalPages?: number, absoluteStartIndex?: number }> = ({ header = {} as any, rows = [], allRows = [], totals = {} as any, type = 'voucher', config, isLastPage = true, pageNum = 1, totalPages = 1, absoluteStartIndex = 0 }) => {
    const { t, formatNumber } = useLanguage();
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
            case 'Thermal': width = 300; height = 1056; break;
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
            case 'Thermal': physicalWidth = '80mm'; physicalHeight = '279mm'; break;
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
                paddingTop: config.ultraCleanMode ? '0.2in' : `calc(${(config.marginTop ?? 0.5)}in - 16px + ${plainSpacing}px)`,
                paddingBottom: config.ultraCleanMode ? '0.2in' : `calc(${(config.marginBottom ?? 0.5)}in + 16px + ${plainSpacing}px)`,
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
            
            {/* Page Number Top */}
            {config.showPageNumber === 'Yes' && config.pageNumberLocation === 'Top' && (
                <div className={`w-full ${config.pageNumberAlignment === 'Center' ? 'text-center' : config.pageNumberAlignment === 'Left' ? 'text-left' : 'text-right'} font-bold text-gray-500 mb-2 uppercase tracking-widest`} style={{ fontSize: `${baseSize * 0.7}px` }}>
                    {config.pageNumberFormat === '1' ? pageNum : config.pageNumberFormat === 'Page 1' ? `Page ${pageNum}` : config.pageNumberFormat === '- 1 -' ? `- ${pageNum} -` : `Page ${pageNum} of ${totalPages}`}
                </div>
            )}

            {(config.headerDisplay === 'All Pages' || (config.headerDisplay === 'First Page Only' && pageNum === 1) || (config.headerDisplay === 'First & Last Page' && (pageNum === 1 || isLastPage))) && (
              <>
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
              </>
            )}

              {/* Table */}
              {rows.length > 0 && (
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
                                <td className={tStyles.tableCellFirst} style={{ fontSize: `${baseSize * 0.9}px` }}>{String(absoluteStartIndex + index + 1).padStart(2, '0')}</td>
                                <td className={tStyles.tableCellLeft}>
                                    <div {...getSectionStyle('lineItem', `font-black text-gray-900 uppercase tracking-tight ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * (config.ultraCompactMode ? 0.8 : config.compactMode ? 1.0 : 1.33)}px` })}>{true ? row.itemName : row.ledgerName}</div>
                                    {config.showHSN && row.hsn && <div className={`${primaryText} font-black uppercase tracking-widest opacity-60`} style={{ fontSize: `${baseSize * 0.66}px`, marginTop: `${baseSize * 0.15}px` }}>HSN Code: {row.hsn}</div>}
                                </td>
                                {true ? (
                                    <>
                                        {config.showMrp && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.mrp ? formatNumber(Number(parseFloat(row.mrp.toString())), { minimumFractionDigits: 2 }) : '-'}</td>
                                        )}
                                        {config.showQty && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.qty} {row.uom}</td>
                                        )}
                                        {config.showRate && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(Number(parseFloat(row.rate)), { minimumFractionDigits: 2 })}</td>
                                        )}
                                        {config.showDiscountPercentage && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.discountPercent ? `${row.discountPercent}%` : '-'}</td>
                                        )}
                                        {config.showDiscountAmount && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.discountAmount ? formatNumber(Number(parseFloat(row.discountAmount.toString())), { minimumFractionDigits: 2 }) : '-'}</td>
                                        )}
                                        <td className={`${config.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-600 text-right tabular-nums dark:text-gray-300`} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.tax}%</td>
                                    </>
                                ) : (
                                    <td className={`${config.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-black ${primaryText} text-right tracking-widest uppercase`} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.crDr || 'Dr'}</td>
                                )}
                                <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 1.2}px` }}>{formatNumber(Number(parseFloat(row.amount)), { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        {rows.length > 0 && (config.pageSubtotalDisplay === 'All Pages' || isLastPage) && (
                            <tr className={`${tStyles.tableRow} bg-gray-50/50`}>
                                <td className={tStyles.tableCellFirst}></td>
                                <td className={tStyles.tableCellLeft}>
                                    <div className={`${isSerif ? 'font-serif' : 'font-black'} text-gray-500 uppercase tracking-widest`} style={{ fontSize: `${baseSize * 0.9}px` }}>Page Subtotal ({rows.length} Item{rows.length !== 1 ? 's' : ''})</div>
                                </td>
                                {true ? (
                                    <>
                                        {config.showMrp && <td className={tStyles.tableCellRight}></td>}
                                        {config.showQty && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{rows.reduce((a, b) => a + (Number(b.qty) || 0), 0)}</td>
                                        )}
                                        {config.showRate && <td className={tStyles.tableCellRight}></td>}
                                        {config.showDiscountPercentage && <td className={tStyles.tableCellRight}></td>}
                                        {config.showDiscountAmount && (
                                            <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(rows.reduce((a, b) => a + (parseFloat(b.discountAmount?.toString()) || 0), 0), { minimumFractionDigits: 2 })}</td>
                                        )}
                                        <td className={`${config.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-600 text-right tabular-nums`}></td>
                                    </>
                                ) : (
                                    <td className={`${config.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-black ${primaryText} text-right tracking-widest uppercase`}></td>
                                )}
                                <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 1.2}px` }}>{formatNumber(rows.reduce((a, b) => a + (parseFloat(b.amount?.toString()) || 0), 0), { minimumFractionDigits: 2 })}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
              </div>
              )}

              {config.ultraCleanMode && <div className="flex-grow"></div>}

              {isLastPage ? (
                <>
                  {config.showHsnSummary && (
                        <div className={`mt-4 ${isTechnical ? 'border-t-3 border-black pt-3' : 'border-t-2 border-gray-200/50 pt-4'} relative z-10`}>
                      <div className={`font-black text-gray-400 uppercase tracking-widest mb-2`} style={{ fontSize: `${baseSize * 0.8}px` }}>HSN-wise Summary</div>
                      <table className="w-full border-collapse">
                    <thead>
                      <tr className={tStyles.tableHeadRow}>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell, { fontSize: `${baseSize * 0.7}px` })}>HSN / SAC</th>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Taxable Value</th>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Rate</th>
                        {totals.igst > 0 ? (
                            <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>IGST Amount</th>
                        ) : (
                            <>
                                <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>CGST Amount</th>
                                <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>SGST Amount</th>
                            </>
                        )}
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>Total Tax</th>
                      </tr>
                    </thead>
                    <tbody className={tStyles.tableBody}>
                      {(allRows && allRows.length > 0 ? allRows : rows).reduce((acc: any[], row) => {
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
                          <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(Number(hsn.taxable), { minimumFractionDigits: 2 })}</td>
                          <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{hsn.taxRate}%</td>
                          {totals.igst > 0 ? (
                              <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(Number(hsn.taxAmount), { minimumFractionDigits: 2 })}</td>
                          ) : (
                              <>
                                  <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(hsn.taxAmount / 2, { minimumFractionDigits: 2 })}</td>
                                  <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(hsn.taxAmount / 2, { minimumFractionDigits: 2 })}</td>
                              </>
                          )}
                          <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(Number(hsn.taxAmount), { minimumFractionDigits: 2 })}</td>
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
                    <div className={`${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`} style={{ fontSize: `${baseSize * 0.9}px` }}>
                      <span>Taxable Amount</span>
                      <span className="tabular-nums">₹{formatNumber(Number(totals.taxableValue || totals.estValue || 0), { minimumFractionDigits: 2 })}</span>
                    </div>
                    {config.showTaxDetails && (
                        <div className={tStyles.totalsDivider}>
                            {(totals.igst || 0) > 0 && (
                            <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                <span>IGST</span>
                                <span className="tabular-nums">₹{formatNumber(Number(totals.igst), { minimumFractionDigits: 2 })}</span>
                            </div>
                            )}
                            {(totals.cgst || 0) > 0 && (
                            <>
                                <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                <span>CGST</span>
                                <span className="tabular-nums">₹{formatNumber(Number(totals.cgst), { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                <span>SGST</span>
                                <span className="tabular-nums">₹{formatNumber(Number(totals.sgst), { minimumFractionDigits: 2 })}</span>
                                </div>
                            </>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col gap-1 items-end pt-4">
                      <div className={tStyles.grandTotalLabel} style={{ fontSize: `${baseSize * 0.9}px` }}>{layout === 'Modern' ? 'Net invoice amount' : 'Payable'}</div>
                      <div {...getSectionStyle('grandTotal', tStyles.titleText.replace('mb-1', ''), { fontSize: `${baseSize * headingScale * 2}px` })}>₹{formatNumber(Number(totals.grandTotal || totals.finalValue || 0), { minimumFractionDigits: 2 })}</div>
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
                        <div {...getSectionStyle('signatures', `font-black ${primaryText} uppercase tracking-[0.4em] opacity-100 mt-2`, { fontSize: `${baseSize * 0.8}px` })}>
                            {config.selectedUser ? config.selectedUser : 'Official Stamp & Sign'}
                        </div>
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
                 </>
               ) : (
                 <div className="p-4 mt-auto text-center font-black uppercase text-gray-400 tracking-[0.2em] opacity-50" style={{ fontSize: `${baseSize * 0.8}px` }}>Continued to next page...</div>
               )}

            {/* Page Number Bottom */}
            {config.showPageNumber === 'Yes' && config.pageNumberLocation === 'Bottom' && (
                <div className={`w-full mt-auto pt-2 pb-2 ${config.pageNumberAlignment === 'Center' ? 'text-center' : config.pageNumberAlignment === 'Left' ? 'text-left' : 'text-right'} font-bold text-gray-500 uppercase tracking-widest bg-white`} style={{ fontSize: `${baseSize * 0.7}px` }}>
                    {config.pageNumberFormat === '1' ? pageNum : config.pageNumberFormat === 'Page 1' ? `Page ${pageNum}` : config.pageNumberFormat === '- 1 -' ? `- ${pageNum} -` : `Page ${pageNum} of ${totalPages}`}
                </div>
            )}

        </div>
    );
};

export const InfoIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
