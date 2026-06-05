import React from 'react';
import { Printer, Download, Image as ImageIcon, X, ZoomIn, ZoomOut, Maximize, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PremiumHeaderProps {
  t: (key: string) => string;
  type: string;
  header: any;
  onClose: () => void;
  onDownloadPDF?: () => void;
  onDownloadImage?: () => void;
  handleManualPrint: () => void;
  
  // Page Navigation
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;

  // Zoom
  previewScale: number;
  manualZoom: number | null;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  handleFullSize: () => void;
}

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  t,
  type,
  header,
  onClose,
  onDownloadPDF,
  onDownloadImage,
  handleManualPrint,
  totalPages,
  currentPage,
  setCurrentPage,
  previewScale,
  manualZoom,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  handleFullSize,
}) => {
  return (
    <>
      {/* Top action header bar */}
      <div className="p-3 md:p-4 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/90 backdrop-blur-sm gap-3 sticky top-0 z-10 no-print dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleManualPrint}
            className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
            title="Print Document"
          >
            <Printer size={20} />
          </button>
          <div className="hidden sm:block text-left">
            <h3 className="text-sm md:text-lg font-black text-gray-900 uppercase tracking-tight leading-none dark:text-white">
              {t(type.replace('_', ' '))} {t("Preview")}
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">
              {header?.voucherNumber || header?.entryNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3 flex-1 justify-end">
          <div className="flex items-center gap-2">
            {onDownloadPDF && (
              <button 
                onClick={onDownloadPDF}
                className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95 shadow-blue-500/20"
              >
                <Download size={14} /> <span className="hidden sm:inline">{t("PDF")}</span>
              </button>
            )}
            {onDownloadImage && (
              <button 
                onClick={onDownloadImage}
                className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <ImageIcon size={14} /> <span className="hidden sm:inline">{t("Image")}</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 border border-gray-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95 ml-1 md:ml-4 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
              title="Close Preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom scale and page nav actions */}
      <div className="border-t border-gray-200 bg-white p-3 md:p-4 flex flex-col sm:flex-row flex-shrink-0 justify-center items-center gap-2 sm:gap-4 z-20 no-print text-black dark:border-gray-700 dark:bg-gray-800 order-last">
        {totalPages > 1 && (
          <div className="flex items-center justify-center bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-1 gap-1 dark:bg-gray-700 dark:border-gray-600">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-white rounded-md text-black disabled:opacity-50 transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
              title="First Page"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-white rounded-md text-black disabled:opacity-50 transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
              title="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="text-xs font-black px-2 tabular-nums min-w-[60px] text-center dark:text-gray-200">
              {currentPage} / {totalPages}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-white rounded-md text-black disabled:opacity-50 transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
              title="Next Page"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-white rounded-md text-black disabled:opacity-50 transition-all active:scale-95 dark:text-gray-200 dark:hover:bg-gray-600"
              title="Last Page"
            >
              <ChevronsRight size={18} />
            </button>
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
            <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">{t("Fit")}</span>
          </button>
          <button 
            onClick={handleFullSize}
            className={`p-1.5 rounded-md transition-all active:scale-95 flex items-center gap-2 px-3 ${manualZoom === 1 ? 'text-black bg-white shadow-sm font-bold dark:bg-gray-600' : 'text-black hover:bg-white dark:text-gray-200 dark:hover:bg-gray-600'} `}
            title="Actual Size (100%)"
          >
            <Maximize size={16} />
            <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">{t("100%")}</span>
          </button>
        </div>
      </div>
    </>
  );
};
