import React from 'react';

interface PageStatsVisualizerProps {
    settings: any;
    pageType: 'First' | 'Middle' | 'Last';
}

export const PageStatsVisualizer: React.FC<PageStatsVisualizerProps> = ({ settings, pageType }) => {
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
