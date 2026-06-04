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

import { InfoIcon } from './VoucherPreviewComponent';
import { CollapsibleSection, ToggleButton, SegmentedControl, MarginInput } from './components';
import { VoucherPreviewComponent } from './VoucherPreviewComponent';
import { useLanguage } from '../../../context/LanguageContext';
import { numberToWords } from '../../../lib/numberToWords';
import { SettingsIcon, CheckCircleIcon } from '../../icons/IconComponents';
import { ToggleLeft, ToggleRight, Layout, Type, FileText, Image as ImageIcon, Signature, Hash, Calculator, Printer, Maximize, Focus, Palette, Columns, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Upload, Download } from 'lucide-react';
import { VoucherPreview } from '../../Operations/VoucherEntry/VoucherPreview';
import { VISUAL_THEME_PALETTES } from '../VisualDesignPaletteData';

import React, { useState, useEffect, useRef } from 'react';

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

export const InvoicePrintSettings: React.FC<{ appMode?: string }> = ({ appMode = 'working' }) => {
  const { t, formatNumber } = useLanguage();
    const [settings, setSettings] = useState({
        itemsPerFirstPage: 12,
        itemsPerSecondPage: 15,
        itemsPerLastPage: 10,
        selectedUser: 'Admin',
        headerDisplay: 'First Page Only',
        pageSubtotalDisplay: 'All Pages',
        showPageNumber: 'Yes',
        pageNumberLocation: 'Bottom',
        pageNumberAlignment: 'Right',
        pageNumberFormat: 'Page 1 of 3',
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

    const printRef = useRef<HTMLDivElement>(null);

    const calculatePageStats = (pageType: 'First' | 'Middle' | 'Last') => {
        const s = settings as any;
        const pageHeightInches = s.pageOrientation === 'Landscape' ? 
            ({ 'A4': 8.27, 'A5': 5.83, 'Letter': 8.5, 'Legal': 8.5, 'Thermal': 3.15 }[s.pageSize as string] || 8.27) : 
            ({ 'A4': 11.69, 'A5': 8.27, 'Letter': 11.0, 'Legal': 14.0, 'Thermal': 11.0 }[s.pageSize as string] || 11.69);
        
        const marginTop = s.marginTop || 0.5;
        const marginBottom = s.marginBottom || 0.5;
        
        let items = 0;
        let hasHeader = false;
        let hasSubtotal = false;
        let hasFooter = false;
        
        if (pageType === 'First') {
            items = s.itemsPerFirstPage || 12;
            hasHeader = s.headerDisplay === 'First Page Only' || s.headerDisplay === 'First & Last Page' || s.headerDisplay === 'All Pages';
            hasSubtotal = s.pageSubtotalDisplay === 'All Pages';
        } else if (pageType === 'Middle') {
            items = s.itemsPerSecondPage || 15;
            hasHeader = s.headerDisplay === 'All Pages';
            hasSubtotal = s.pageSubtotalDisplay === 'All Pages';
        } else if (pageType === 'Last') {
            items = s.itemsPerLastPage || 10;
            hasHeader = s.headerDisplay === 'First & Last Page' || s.headerDisplay === 'All Pages';
            hasSubtotal = true; // Last page mostly has either a subtotal or is part of final totals
            hasFooter = true;
        }

        const toDpi = 96; // Standard CSS DPI for web-to-print
        const basePx = s.baseFontSize || 10;
        
        let rowPaddingPx = s.ultraCompactMode ? 16 : (s.compactMode ? 32 : 48);
        if (s.designLayout === 'Clean') rowPaddingPx = s.ultraCompactMode ? 8 : (s.compactMode ? 16 : 24);
        
        let rowContentPx = basePx * (s.ultraCompactMode ? 0.8 : s.compactMode ? 1.0 : 1.33);
        if (s.showHSN) {
             rowContentPx += (basePx * 0.66) + (basePx * 0.15) + 6; // HSN text length + margin top + visual gap
        }
        rowContentPx += 2; // Border approximation
        
        const rowHeightPx = rowPaddingPx + (rowContentPx * (s.lineHeight || 1));
        const rowHeightInches = rowHeightPx / toDpi;
        const itemsOnlyHeight = items * rowHeightInches;
        const tableHeaderPx = s.ultraCompactMode ? 30 : (s.compactMode ? 45 : 60);
        const tableHeaderInches = tableHeaderPx / toDpi;

        // TOP PART
        let headerHeightInches = 0;
        if (hasHeader) {
            const headerPx = s.ultraCompactMode ? 180 : (s.compactMode ? 260 : 350);
            headerHeightInches = headerPx / toDpi;
        }
        const topPartHeight = marginTop + headerHeightInches;

        // MIDDLE PART
        const middlePartHeight = tableHeaderInches + itemsOnlyHeight;

        // BOTTOM PART
        let subtotalHeightInches = 0;
        if (hasSubtotal) {
            const subPx = s.ultraCompactMode ? 30 : (s.compactMode ? 40 : 50);
            subtotalHeightInches = subPx / toDpi;
        }
        
        let footerHeightInches = 0;
        let footerDetails = [];
        if (hasFooter) {
            let baseFooterPx = 100;
            footerDetails.push('Totals Wrap');
            
            if (s.showHSN) { baseFooterPx += 50; footerDetails.push('HSN Summary'); }
            if (s.showTaxDetails) { baseFooterPx += 40; footerDetails.push('Tax Details'); }
            if (s.showNarration || s.showAmountInWords) { baseFooterPx += 40; footerDetails.push('Narration/Amount'); }
            if (s.showAuthSign || s.showCustomerSign) { baseFooterPx += 60; footerDetails.push('Signatures'); }

            const footerPx = s.ultraCompactMode ? baseFooterPx * 0.7 : (s.compactMode ? baseFooterPx * 0.9 : baseFooterPx * 1.2);
            footerHeightInches = footerPx / toDpi;
        }
        
        const bottomPartHeight = subtotalHeightInches + footerHeightInches + marginBottom;

        // TOTAL
        const totalUsed = topPartHeight + middlePartHeight + bottomPartHeight;
        const emptySpace = pageHeightInches - totalUsed;
        
        const toCm = (inch: number) => (inch * 2.54).toFixed(1);
        const toPctNum = (inch: number) => ((inch / pageHeightInches) * 100);
        const toPct = (inch: number) => toPctNum(inch).toFixed(1);

        // Calculate max items for a single page invoice
        const singlePageHeaderPx = s.ultraCompactMode ? 200 : (s.compactMode ? 280 : 380);
        const singlePageHeaderInches = singlePageHeaderPx / toDpi;
        const singlePageSubtotalPx = s.ultraCompactMode ? 35 : (s.compactMode ? 45 : 60);
        const singlePageSubtotalInches = singlePageSubtotalPx / toDpi;
        
        // Calculate footer without HSN Summary first
        let baseSingleFooterPx = s.ultraCompactMode ? 100 : (s.compactMode ? 140 : 180); // base for totals wrap
        if (s.showTaxDetails) { baseSingleFooterPx += 40; }
        if (s.showNarration || s.showAmountInWords) { baseSingleFooterPx += 20; }
        if (s.showAuthSign || s.showCustomerSign) { baseSingleFooterPx += s.ultraCompactMode ? 90 : (s.compactMode ? 120 : 160); }
        // Note for computer generated & page numbers
        if (s.showFooterNotes) { baseSingleFooterPx += 25; }
        
        const singlePageFooterRawPx = baseSingleFooterPx;
        const singlePageFooterInches = singlePageFooterRawPx / toDpi;

        const singlePageFixedSpace = marginTop + marginBottom + singlePageHeaderInches + tableHeaderInches + singlePageSubtotalInches + singlePageFooterInches;
        const singlePageAvailableSpace = Math.max(0, pageHeightInches - singlePageFixedSpace);
        
        // HSN Space Considerations
        let rowContentPxWithoutHsn = basePx * (s.ultraCompactMode ? 1.0 : s.compactMode ? 1.5 : 2.0);
        rowContentPxWithoutHsn += 4; // Border & Gaps
        const rowHeightPxWithoutHsn = rowPaddingPx + (rowContentPxWithoutHsn * (s.lineHeight || 1));
        const rowHeightInchesWithoutHsn = rowHeightPxWithoutHsn / toDpi;
        
        const hsnSummaryHeaderPx = s.ultraCompactMode ? 30 : (s.compactMode ? 40 : 60); 
        const hsnSummaryHeaderInches = hsnSummaryHeaderPx / toDpi;
        const hsnSummaryRowInches = rowHeightInchesWithoutHsn * 0.95; // HSN rows inside summary table

        // Calculate maximums
        // Scenario 1: Total items with NO inline HSN and NO HSN summary
        const maxItemsNoHsn = Math.floor(singlePageAvailableSpace / rowHeightInchesWithoutHsn);
        
        // Scenario 2: Total items WITH inline HSN and NO HSN summary
        const maxItemsWithHsnNoSummary = Math.floor(singlePageAvailableSpace / rowHeightInches);
        
        // Scenario 3: Total items WITH inline HSN and WITH HSN summary (1 shared HSN for all items)
        const spaceForItems1Hsn = singlePageAvailableSpace - (s.showHsnSummary ? (hsnSummaryHeaderInches + hsnSummaryRowInches) : 0);
        const maxItemsWithHsnSharedSummary = Math.floor(Math.max(0, spaceForItems1Hsn) / rowHeightInches);
        
        // Scenario 4: Total items WITH inline HSN and WITH HSN summary (Unique HSN per item)
        // Let x = number of items (and unique HSNs).
        const combinedRowHeight = rowHeightInches + (s.showHsnSummary ? hsnSummaryRowInches : 0);
        const spaceForItemsUniqueHsn = singlePageAvailableSpace - (s.showHsnSummary ? hsnSummaryHeaderInches : 0);
        const maxItemsWithHsnUniqueSummary = Math.floor(Math.max(0, spaceForItemsUniqueHsn) / combinedRowHeight);

        return (
            <div className="space-y-2 mt-2 font-mono text-[9px] leading-tight">
                {/* 0. Single Page Capacity */}
                <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 dark:bg-emerald-900/10 dark:border-emerald-800/30 text-gray-600 dark:text-gray-300 shadow-sm">
                    <div className="font-bold text-emerald-800 mb-1.5 dark:text-emerald-300 border-b border-emerald-200/50 dark:border-emerald-800/50 pb-1 uppercase tracking-wider text-[8px]">0. Single Page Capacity (Item Limits)</div>
                    <div className="text-[9px] leading-relaxed space-y-1.5">
                        <div className="mb-2">Max items a single page invoice can hold before demanding a new page:</div>
                        <div className="grid grid-cols-[1fr_auto] gap-x-2 border-b border-emerald-200/40 pb-1">
                            <span>Without HSN details:</span>
                            <span className="font-black text-emerald-700 dark:text-emerald-400">{maxItemsNoHsn} Items</span>
                        </div>
                        <div className="grid grid-cols-[1fr_auto] gap-x-2 border-b border-emerald-200/40 pb-1">
                            <span title="If HSN is enabled inline, but HSN Summary is disabled in Footer">With Inline HSN only (No Summary table):</span>
                            <span className="font-black text-emerald-700 dark:text-emerald-400">{maxItemsWithHsnNoSummary} Items</span>
                        </div>
                        <div className="grid grid-cols-[1fr_auto] gap-x-2 border-b border-emerald-200/40 pb-1">
                            <span title="If both Inline HSN and HSN Summary are enabled, and all items share the exact same HSN code">With HSN Summary (Single Shared HSN):</span>
                            <span className="font-black text-emerald-700 dark:text-emerald-400">{maxItemsWithHsnSharedSummary} Items + 1 HSN Row</span>
                        </div>
                        <div className="grid grid-cols-[1fr_auto] gap-x-2">
                            <span title="If both Inline HSN and HSN Summary are enabled, and every single item has a different HSN code">With HSN Summary (Unique HSN per Item):</span>
                            <span className="font-black text-emerald-700 dark:text-emerald-400">{maxItemsWithHsnUniqueSummary} Items + {maxItemsWithHsnUniqueSummary} HSN Rows</span>
                        </div>
                    </div>
                </div>

                {/* 1. Header (Top Part) */}
                <div className="bg-purple-50/50 p-2 rounded-lg border border-purple-100/50 dark:bg-purple-900/10 dark:border-purple-800/30 text-gray-600 dark:text-gray-300 shadow-sm">
                    <div className="font-bold text-purple-800 mb-1.5 dark:text-purple-300 border-b border-purple-200/50 dark:border-purple-800/50 pb-1 uppercase tracking-wider text-[8px]">1. Header (Top Part)</div>
                    <table className="w-full text-left">
                        <tbody>
                            <tr><td className="py-0.5">Top Margin</td><td className="py-0.5 text-right">{marginTop.toFixed(2)}"</td><td className="py-0.5 text-right opacity-80 w-12">{toPct(marginTop)}%</td></tr>
                            <tr className={hasHeader ? '' : 'opacity-40'}><td className="py-0.5">Invoice Header {hasHeader ? '' : '(N/A)'}</td><td className="py-0.5 text-right">{headerHeightInches.toFixed(2)}"</td><td className="py-0.5 text-right opacity-80">{toPct(headerHeightInches)}%</td></tr>
                        </tbody>
                    </table>
                    <div className="mt-1 pt-1 border-t border-purple-200/50 dark:border-purple-800/50 flex justify-between font-bold text-purple-900 dark:text-purple-200">
                        <span>Top Section Total:</span>
                        <span>{topPartHeight.toFixed(2)}" ({toCm(topPartHeight)} cm | {toPct(topPartHeight)}%)</span>
                    </div>
                </div>

                {/* 2. Items (Middle Part) */}
                <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/50 dark:bg-blue-900/10 dark:border-blue-800/30 text-gray-600 dark:text-gray-300 shadow-sm">
                    <div className="font-bold text-blue-800 mb-1.5 dark:text-blue-300 border-b border-blue-200/50 dark:border-blue-800/50 pb-1 uppercase tracking-wider text-[8px]">2. Line Items (Middle Part)</div>
                    <table className="w-full text-left">
                        <tbody>
                            <tr><td className="py-0.5">Columns Header</td><td className="py-0.5 text-right">{tableHeaderInches.toFixed(2)}"</td><td className="py-0.5 text-right opacity-80 w-12">{toPct(tableHeaderInches)}%</td></tr>
                            <tr><td className="py-0.5 flex flex-col"><span className="font-bold text-blue-600 dark:text-blue-400">{items} Items</span><span className="text-[7.5px] opacity-80">(~{Math.round(rowHeightPx)}px / {rowHeightInches.toFixed(2)}" each)</span></td><td className="py-0.5 text-right font-bold text-blue-600 dark:text-blue-400 align-top">{itemsOnlyHeight.toFixed(2)}"</td><td className="py-0.5 text-right opacity-80 font-bold text-blue-600 dark:text-blue-400 align-top">{toPct(itemsOnlyHeight)}%</td></tr>
                        </tbody>
                    </table>
                    <div className="mt-1 pt-1 border-t border-blue-200/50 dark:border-blue-800/50 flex justify-between font-bold text-blue-900 dark:text-blue-200">
                        <span>Middle Section Total:</span>
                        <span>{middlePartHeight.toFixed(2)}" ({toCm(middlePartHeight)} cm | {toPct(middlePartHeight)}%)</span>
                    </div>
                </div>

                {/* 3. Footer (Bottom Part) */}
                <div className="bg-orange-50/50 p-2 rounded-lg border border-orange-100/50 dark:bg-orange-900/10 dark:border-orange-800/30 text-gray-600 dark:text-gray-300 shadow-sm">
                    <div className="font-bold text-orange-800 mb-1.5 dark:text-orange-300 border-b border-orange-200/50 dark:border-orange-800/50 pb-1 uppercase tracking-wider text-[8px]">3. Footer (Bottom Part)</div>
                    <table className="w-full text-left">
                        <tbody>
                            <tr className={hasSubtotal ? '' : 'opacity-40'}><td className="py-0.5">Page Subtotal {hasSubtotal ? '' : '(N/A)'}</td><td className="py-0.5 text-right">{subtotalHeightInches.toFixed(2)}"</td><td className="py-0.5 text-right opacity-80 w-12">{toPct(subtotalHeightInches)}%</td></tr>
                            <tr className={hasFooter ? '' : 'opacity-40'}><td className="py-0.5" title={footerDetails.join(', ')}>Footer Details {hasFooter ? '' : '(N/A)'}</td><td className="py-0.5 text-right">{footerHeightInches.toFixed(2)}"</td><td className="py-0.5 text-right opacity-80">{toPct(footerHeightInches)}%</td></tr>
                            <tr><td className="py-0.5">Bottom Margin</td><td className="py-0.5 text-right">{marginBottom.toFixed(2)}"</td><td className="py-0.5 text-right opacity-80">{toPct(marginBottom)}%</td></tr>
                        </tbody>
                    </table>
                    {hasFooter && footerDetails.length > 0 && <div className="text-[7.5px] text-orange-600/80 dark:text-orange-400/80 mt-1 leading-tight border-t border-orange-200/30 pt-1">Included: {footerDetails.join(', ')}</div>}
                    <div className="mt-1 pt-1 flex justify-between font-bold text-orange-900 dark:text-orange-200 border-t border-orange-200/50 dark:border-orange-800/50">
                        <span>Bottom Section Total:</span>
                        <span>{bottomPartHeight.toFixed(2)}" ({toCm(bottomPartHeight)} cm | {toPct(bottomPartHeight)}%)</span>
                    </div>
                </div>
                
                {/* 4. Summary */}
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200/50 dark:bg-gray-800/50 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm">
                    <div className="font-bold text-gray-700 mb-1.5 dark:text-gray-200 border-b border-gray-200/50 dark:border-gray-600 pb-1 uppercase tracking-wider text-[8px]">4. Total Page Summary</div>
                    <div className="flex justify-between font-bold text-gray-800 dark:text-white">
                        <span>Total Used Space:</span>
                        <span>{totalUsed.toFixed(2)}" ({toCm(totalUsed)} cm | {toPct(totalUsed)}%)</span>
                    </div>
                    <div className={`mt-1 flex justify-between font-bold ${emptySpace < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        <span>Remaining Empty Space:</span>
                        <span>{emptySpace.toFixed(2)}" ({toCm(emptySpace)} cm | {toPct(emptySpace)}%)</span>
                    </div>
                    {pageType === 'Last' && s.showHsnSummary && (
                        <div className="mt-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md leading-relaxed text-[8.5px]">
                            <strong>ℹ️ Dynamic Last Page Capacity:</strong> The {items} item limit acts as a combined capacity container for both items AND HSN rows.<br/><br/>
                            For example, if you set this to 12, it could hold:<br/>
                            • 12 items (0 HSN strings)<br/>
                            • A combination like 7 items + 5 HSN summary rows.<br/><br/>
                            <em>If the combination exceeds {items}, the items will automatically use a full middle-page capacity, and the entire footer / HSN summary block will gracefully shift onto a new fresh page.</em>
                        </div>
                    )}
                    {emptySpace < 0 && (
                        <div className="mt-2 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 p-1.5 px-2 rounded-md leading-tight text-[8px]">
                            ⚠️ Layout Overflow Risk! Content takes more height than the physical {s.pageSize} page provides. Try reducing margins, number of items, or layout compactness.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const DEFAULT_SETTINGS = {
        itemsPerFirstPage: 12,
        itemsPerSecondPage: 15,
        itemsPerLastPage: 10,
        selectedUser: 'Admin',
        headerDisplay: 'First Page Only',
        pageSubtotalDisplay: 'All Pages',
        showPageNumber: 'Yes',
        pageNumberLocation: 'Bottom',
        pageNumberAlignment: 'Right',
        pageNumberFormat: 'Page 1 of 3',
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

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "bharat_book_print_settings.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonObj = JSON.parse(e.target?.result as string);
                setSettings(jsonObj);
            } catch (error) {
                console.error("Error parsing settings JSON", error);
            }
        };
        reader.readAsText(file);
        // Reset input so the same file could be selected again
        event.target.value = '';
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
                    case 'Thermal': docWidth = 300; docHeight = 1056; break;
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemPages = React.useMemo(() => {
        const first = settings.itemsPerFirstPage || 12;
        const second = settings.itemsPerSecondPage || 15;
        const last = settings.itemsPerLastPage || 10;
        
        const hsnCount = new Set(dummyRows.map(r => r.hsn)).size;
        const effectiveLast = settings.showHsnSummary ? Math.max(0, last - hsnCount) : last;
        
        const pages = [];
        let start = 0;
        const totalItems = dummyRows.length;
        
        if (totalItems === 0) return [[]];

        let remaining = totalItems - start;
        if (remaining <= effectiveLast) {
            pages.push(dummyRows.slice(start, start + remaining));
            return pages;
        } else {
            const firstLimit = first > 0 ? first : 12;
            const toTake = Math.min(remaining, firstLimit);
            pages.push(dummyRows.slice(start, start + toTake));
            start += toTake;
        }
        
        while (start < totalItems) {
            remaining = totalItems - start;
            if (remaining <= effectiveLast) {
                 pages.push(dummyRows.slice(start, start + remaining));
                 start += remaining;
                 break;
            } else {
                 const limit = second > 0 ? second : 15;
                 const toTake = Math.min(remaining, limit);
                 pages.push(dummyRows.slice(start, start + toTake));
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
    }, [dummyRows, settings.itemsPerFirstPage, settings.itemsPerSecondPage, settings.itemsPerLastPage, settings.showHsnSummary]);

    const totalPages = Math.max(1, itemPages.length);
    const paginatedRows = itemPages[currentPage - 1] || [];
    const absoluteStartIndex = itemPages.slice(0, currentPage - 1).reduce((sum, page) => sum + page.length, 0);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);

    const CATEGORIES: Record<string, {name: string, hsn: string, rate: number, tax: number}[]> = {
        'electronics': [
            {name: 'Premium Wireless Headphones', hsn: '8518', rate: 2499.00, tax: 18},
            {name: 'Mechanical Gaming Keyboard', hsn: '8471', rate: 5999.00, tax: 18},
            {name: '27-inch 4K Monitor', hsn: '8528', rate: 24500.00, tax: 28},
            {name: 'USB-C Hub 7-in-1', hsn: '8544', rate: 1299.00, tax: 18},
            {name: '1TB NVMe SSD', hsn: '8523', rate: 8499.00, tax: 18},
        ],
        'services': [
            {name: 'Web Development Consulting', hsn: '9983', rate: 15000.00, tax: 18},
            {name: 'Monthly SEO Maintenance', hsn: '9983', rate: 8000.00, tax: 18},
            {name: 'UI/UX Design', hsn: '9983', rate: 25000.00, tax: 18},
            {name: 'Server Config', hsn: '9983', rate: 5000.00, tax: 18},
        ],
        'groceries': [
            {name: 'Organic Basmati Rice 5kg', hsn: '1006', rate: 850.00, tax: 5},
            {name: 'Cold Pressed Olive Oil 1L', hsn: '1509', rate: 1250.00, tax: 5},
            {name: 'Premium Assam Tea 500g', hsn: '0902', rate: 450.00, tax: 5},
            {name: 'Mixed Dry Fruits 1kg', hsn: '0813', rate: 1500.00, tax: 12},
        ],
        'clothing': [
            {name: 'Cotton Formal Shirt', hsn: '6205', rate: 1499.00, tax: 12},
            {name: 'Denim Jeans Slim Fit', hsn: '6203', rate: 2499.00, tax: 12},
            {name: 'Winter Puffer Jacket', hsn: '6201', rate: 4999.00, tax: 12},
            {name: 'Running Shoes X-Pro', hsn: '6402', rate: 3599.00, tax: 18},
        ]
    };

    useEffect(() => {
        const deferredSampleItemCount = 50;
        const deferredSampleHsnCount = 5;
        const isInterstate = false;
        const sampleCategory: string = 'electronics';
        const catItems = CATEGORIES[sampleCategory] || CATEGORIES['electronics'];
        const newRows = [];
        let taxableValue = 0;
        let totalTaxAmount = 0;

        for (let i = 0; i < deferredSampleItemCount; i++) {
            const template = catItems[i % catItems.length];
            // Deterministic quantity based on index for stable previews
            const qty = (i % 5) + 1;
            const amount = qty * template.rate;
            taxableValue += amount;
            
            const rowTax = amount * (template.tax / 100);
            totalTaxAmount += rowTax;

            // Generate HSN based on sampleHsnCount regardless of template to ensure exact unique count
            const hsnIndex = i % Math.max(1, deferredSampleHsnCount);
            const baseHsn = parseInt(CATEGORIES[sampleCategory]?.[0]?.hsn || '8500');
            const hsnVal = baseHsn + hsnIndex;

            newRows.push({
                itemName: template.name + (i >= catItems.length ? ` - Variant ${Math.floor(i/catItems.length)}` : ''),
                hsn: hsnVal.toString(),
                qty: qty,
                uom: sampleCategory === 'services' ? 'Hrs' : 'Pcs',
                rate: template.rate,
                mrp: template.rate * 1.2,
                discountPercent: 0,
                discountAmount: 0,
                tax: template.tax,
                amount: amount,
                crDr: 'Dr'
            });
        }

        setDummyRows(newRows);
        setDummyTotals({
            taxableValue: taxableValue,
            cgst: isInterstate ? 0 : totalTaxAmount / 2,
            sgst: isInterstate ? 0 : totalTaxAmount / 2,
            igst: isInterstate ? totalTaxAmount : 0,
            grandTotal: taxableValue + totalTaxAmount,
            finalValue: taxableValue + totalTaxAmount
        });
        
        setDummyHeader(prev => ({
            ...prev,
            voucherNumber: 'INV-2026-001',
            entryNumber: 'INV-2026-001',
            voucherDate: '2026-05-12',
            partyName: prev.partyName === '-' ? 'Acme Corp Sample' : prev.partyName,
            billingPartyName: prev.billingPartyName === '-' ? 'Acme Corp Sample' : prev.billingPartyName,
            billingAddress: prev.billingAddress === '-' ? '123 Business Road' : prev.billingAddress,
            billingState: prev.billingState === '-' ? 'Maharashtra' : prev.billingState,
            billingPinCode: prev.billingPinCode === '-' ? '400001' : prev.billingPinCode,
            billingContact: prev.billingContact === '-' ? '+91 98765 43210' : prev.billingContact,
            gstNumber: prev.gstNumber === '-' ? '27AADCB2230M1Z2' : prev.gstNumber,
            narration: prev.narration === '-' ? 'Being goods sold as per order.' : prev.narration,
            referenceNo: prev.referenceNo === '-' ? 'REF-99201' : prev.referenceNo,
            poNumber: prev.poNumber === '-' ? 'PO-4421' : prev.poNumber,
        }));
    }, []);

    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [plannerPageType, setPlannerPageType] = useState<'First' | 'Middle' | 'Last'>('First');

    
    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const props = {
      settings, setSettings, activeSection, toggleSection, resetSettingsForSection, 
      plannerPageType, setPlannerPageType,
      INVOICE_FONTS, getSectionStyle: (key: string, baseClasses: string, overrides: any) => ({ className: baseClasses, style: overrides }),
      toggleSetting, calculatePageStats
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-0">
            {/* Configuration Section */}
            <div className="flex-1 space-y-6 relative z-10">
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
                                            <AccountingERPThemesSection {...props} />

                                            <ColorSpectrumPalettesSection {...props} />

                                            <AestheticPresetsSection {...props} />

                                            <FontSelectionSection {...props} />

                                            <SpaceandMarginSection {...props} />

                                            <SectionSpecificStylingSection {...props} />

                                            <LayoutComponentsSection {...props} />

                                            <DataVisibilitySection {...props} />

                                            <PageDimensionsSection {...props} />

                                            <ItemSettingsSection {...props} />

                                            <InformationPlannerSection {...props} />

                                            <AdvancedPaginationHeadersSection {...props} />


                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-4 px-8 dark:border-gray-800 relative z-50">
                        <div className={`transition-all duration-500 flex items-center justify-center gap-2 ${isSaved ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                            <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Settings Synchronized</span>
                        </div>
                        
                        <div className="form-grid gap-2 sm:gap-4 relative z-50">
                                <button 
                                    id="test-print-button"
                                    style={{ pointerEvents: 'auto', zIndex: 100 }}
                                    onClick={(e) => { 
                                        e.preventDefault();
                                        window.print();
                                    }}
                                    className={`flex items-center justify-center gap-2 px-2 sm:px-5 py-4 ${appMode === 'demo' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-gray-700 border-gray-200'} border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 cursor-pointer group relative z-50`}
                                    title={appMode === 'demo' ? "Demo Print (Watermarked)" : "Test Print"}
                                >
                                    <Printer size={16} className={appMode === 'demo' ? 'animate-pulse' : ''} /> 
                                    <span className="hidden sm:inline">
                                        {appMode === 'demo' ? 'DEMO PRINT' : 'TEST PRINT'}
                                    </span>
                                </button>
                             <label 
                                className="flex items-center justify-center gap-2 px-2 sm:px-5 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm cursor-pointer dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700" 
                                title="Import Settings"
                             >
                                 <Upload size={16} /> <span className="hidden lg:inline">IMPORT</span>
                                 <input type="file" accept=".json" className="hidden" onChange={handleImportSettings} />
                             </label>
                             <button 
                                onClick={handleExport}
                                className="flex items-center justify-center gap-2 px-2 sm:px-5 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                                title="Export Settings"
                             >
                                <Download size={16} /> <span className="hidden lg:inline">EXPORT</span>
                             </button>
                             <button 
                                onClick={handleSave}
                                className="px-2 sm:px-5 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
                                title="Save Settings"
                            >
                                <Layout size={14} /> <span className="hidden sm:inline">SAVE</span>
                            </button>
                            <button 
                                onClick={resetAllSettings}
                                className="px-2 sm:px-5 py-4 bg-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 dark:bg-gray-800 dark:text-gray-300"
                                title="Default Settings"
                            >
                                <RotateCcw size={14} /> <span className="hidden xl:inline">DEFAULT</span>
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
                            {t("Disabling HSN/SAC and Tax details creates a cleaner \"Commercial Invoice\" look for non-taxable transactions.")}
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
                        <div id="voucher-to-print" ref={printRef} className="relative">
                            {appMode === 'demo' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden">
                                    <div className="text-[80px] sm:text-[120px] font-black text-gray-200/20 uppercase tracking-[0.2em] -rotate-45 select-none">
                                        DEMO
                                    </div>
                                </div>
                            )}
                            {manualZoom === null ? (
                                <div 
                                    className="origin-center pointer-events-none transition-transform duration-300 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15),0_18px_36px_-18px_rgba(0,0,0,0.2)] bg-white dark:bg-gray-800"
                                    style={{ transform: `scale(${previewScale})` }}
                                >
                                    <VoucherPreviewComponent 
                                        header={dummyHeader}
                                        rows={paginatedRows}
                                        allRows={dummyRows}
                                        totals={dummyTotals}
                                        type="Sales_Invoice"
                                        config={settings}
                                        isLastPage={currentPage === totalPages}
                                        pageNum={currentPage}
                                        totalPages={totalPages}
                                        absoluteStartIndex={absoluteStartIndex}
                                    />
                                </div>
                            ) : (
                                <div className="transition-all duration-300 relative flex-shrink-0" style={{ width: `${(settings.pageSize === 'Thermal' ? 300 : settings.pageSize === 'A5' ? 559 : settings.pageSize === 'Letter' ? 816 : 794) * previewScale}px`, height: `${(settings.pageSize === 'Thermal' ? 1056 : settings.pageSize === 'A5' ? 794 : settings.pageSize === 'Letter' ? 1056 : 1123) * previewScale}px`, margin: '0 auto' }}>
                                    <div 
                                        className="transition-transform duration-300 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15),0_18px_36px_-18px_rgba(0,0,0,0.2)] bg-white absolute top-0 left-0 origin-top-left dark:bg-gray-800"
                                        style={{ transform: `scale(${previewScale})` }}
                                    >
                                        <VoucherPreviewComponent 
                                            header={dummyHeader}
                                            rows={paginatedRows}
                                            allRows={dummyRows}
                                            totals={dummyTotals}
                                            type="Sales_Invoice"
                                            config={settings}
                                            isLastPage={currentPage === totalPages}
                                            pageNum={currentPage}
                                            totalPages={totalPages}
                                            absoluteStartIndex={absoluteStartIndex}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mx-auto no-print">
                    <div className="flex items-center justify-center bg-white border border-gray-200 shadow-sm rounded-full p-2 gap-2 dark:bg-gray-800 dark:border-gray-700">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-gray-100 rounded-full text-black disabled:opacity-50 transition-all active:scale-95 dark:hover:bg-gray-600"
                            title="First Page"
                        ><ChevronsLeft size={18} /></button>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-gray-100 rounded-full text-black disabled:opacity-50 transition-all active:scale-95 dark:hover:bg-gray-600"
                            title="Previous Page"
                        ><ChevronLeft size={18} /></button>
                        
                        <div className="text-xs font-black px-2 tabular-nums">
                            {currentPage} / {totalPages}
                        </div>
                        
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-gray-100 rounded-full text-black disabled:opacity-50 transition-all active:scale-95 dark:hover:bg-gray-600"
                            title="Next Page"
                        ><ChevronRight size={18} /></button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-gray-100 rounded-full text-black disabled:opacity-50 transition-all active:scale-95 dark:hover:bg-gray-600"
                            title="Last Page"
                        ><ChevronsRight size={18} /></button>
                    </div>
                    
                    <div className="flex items-center justify-center bg-white border border-gray-200 shadow-sm rounded-full p-2 gap-2 dark:bg-gray-800 dark:border-gray-700">
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
        </div>
    );
};
