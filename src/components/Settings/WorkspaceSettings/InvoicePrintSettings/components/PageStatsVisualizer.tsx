import React from 'react';
import { Layout, Columns, Check, AlertCircle } from 'lucide-react';

interface PageStatsVisualizerProps {
    settings: any;
    pageType: 'First' | 'Middle' | 'Last';
}

export const PageStatsVisualizer: React.FC<PageStatsVisualizerProps> = ({ settings, pageType }) => {
    // Determine the active item limit
    let itemLimit = 10;
    if (pageType === 'First') {
        itemLimit = settings.itemsPerFirstPage || 10;
    } else if (pageType === 'Middle') {
        itemLimit = settings.itemsPerSecondPage || 15;
    } else if (pageType === 'Last') {
        itemLimit = settings.itemsPerLastPage || 8;
    }

    // Determine density rating
    let densityRating = 'Balanced';
    let densityColor = 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
    let progressColor = 'bg-green-500';

    if (itemLimit > 18) {
        densityRating = 'Ultra Compact';
        densityColor = 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
        progressColor = 'bg-amber-500';
    } else if (itemLimit > 12) {
        densityRating = 'Dense';
        densityColor = 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30';
        progressColor = 'bg-blue-500';
    } else if (itemLimit < 6) {
        densityRating = 'Spacious';
        densityColor = 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/40';
        progressColor = 'bg-slate-400';
    }

    // Base math calculations
    const topMargin = settings.marginTop !== undefined ? settings.marginTop : 1.0;
    const bottomMargin = settings.marginBottom !== undefined ? settings.marginBottom : 1.0;
    const verticalMarginSpace = topMargin + bottomMargin;
    
    // Page height bounds based on size
    let pageHeightInches = 11.69; // A4 Standard
    if (settings.pageSize === 'A5') pageHeightInches = 8.27;
    else if (settings.pageSize === 'Letter') pageHeightInches = 11.0;
    else if (settings.pageSize === 'Legal') pageHeightInches = 14.0;
    else if (settings.pageSize === 'Thermal') pageHeightInches = 20.0; // variable POS

    const printableHeight = Math.max(1, pageHeightInches - verticalMarginSpace);
    const estimatedHeightPercent = Math.min(100, Math.round(((itemLimit * 0.45) / printableHeight) * 100));

    return (
        <div id={`stats-visualizer-${pageType.toLowerCase()}`} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/30 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layout size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Page Metrics Analysis</span>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${densityColor}`}>
                    {densityRating}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Row Capacity</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">{itemLimit} <span className="text-xs font-medium text-gray-500">Rows</span></span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Height Est.</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">{estimatedHeightPercent}% <span className="text-xs font-medium text-gray-500">Used</span></span>
                </div>
            </div>

            {/* Print fill Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Est. Space Allocation</span>
                    <span>{estimatedHeightPercent}% of Printable Area</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 ${progressColor}`}
                        style={{ width: `${estimatedHeightPercent}%` }}
                    />
                </div>
            </div>

            {/* Layout features list */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-[9px] font-semibold text-gray-600 dark:text-gray-400">
                    <Check size={12} className="text-green-500 shrink-0" />
                    <span className="uppercase tracking-wider">MARG. SPACE: {printableHeight.toFixed(2)}" PRINTABLE OUT OF {pageHeightInches.toFixed(2)}"</span>
                </div>

                {settings.showHsnSummary && pageType === 'Last' && (
                    <div className="flex items-center gap-2 text-[9px] font-semibold text-gray-600 dark:text-gray-400">
                        <Check size={12} className="text-green-500 shrink-0" />
                        <span className="uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400">GST HSN TAX BLOCK ENABLED ON END</span>
                    </div>
                )}

                {itemLimit > 20 && (
                    <div className="flex items-center gap-2 text-[9px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg">
                        <AlertCircle size={12} className="shrink-0" />
                        <span className="uppercase tracking-wide font-bold">WARNING: Dense layout config might overlap with custom signature spacing.</span>
                    </div>
                )}
            </div>
        </div>
    );
};
