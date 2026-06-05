import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ZoomOut, ZoomIn, RotateCcw, Maximize } from 'lucide-react';
import { VoucherPreviewComponent } from '../VoucherPreviewComponent';

interface PreviewPanelProps {
    settings: any;
    dummyHeader: any;
    paginatedRows: any[];
    dummyRows: any[];
    dummyTotals: any;
    currentPage: number;
    totalPages: number;
    absoluteStartIndex: number;
    manualZoom: number | null;
    previewScale: number;
    previewContainerRef: React.RefObject<HTMLDivElement | null>;
    printRef: React.RefObject<HTMLDivElement | null>;
    appMode: string;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleResetZoom: () => void;
    handleFullSize: () => void;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
    settings,
    dummyHeader,
    paginatedRows,
    dummyRows,
    dummyTotals,
    currentPage,
    totalPages,
    absoluteStartIndex,
    manualZoom,
    previewScale,
    previewContainerRef,
    printRef,
    appMode,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleFullSize,
    setCurrentPage
}) => {
    return (
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
    );
};
