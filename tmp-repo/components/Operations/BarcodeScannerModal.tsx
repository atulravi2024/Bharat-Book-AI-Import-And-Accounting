import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, ScanBarcode, Keyboard } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose, onScan }) => {
  const [manualInput, setManualInput] = useState('');
  const scannerRef = React.useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Use a small timeout to ensure the DOM element "reader" is definitely present
    const timer = setTimeout(() => {
      const readerElement = document.getElementById('reader');
      if (!readerElement) return;

      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: {width: 250, height: 250},
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE, 
            Html5QrcodeSupportedFormats.UPC_A, 
            Html5QrcodeSupportedFormats.UPC_E, 
            Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION, 
            Html5QrcodeSupportedFormats.EAN_8, 
            Html5QrcodeSupportedFormats.EAN_13, 
            Html5QrcodeSupportedFormats.CODE_39, 
            Html5QrcodeSupportedFormats.CODE_93, 
            Html5QrcodeSupportedFormats.CODE_128, 
            Html5QrcodeSupportedFormats.ITF, 
            Html5QrcodeSupportedFormats.DATA_MATRIX, 
            Html5QrcodeSupportedFormats.CODABAR 
          ],
          supportedScanTypes: [0, 1] // CAMERA and FILE
        },
        /* verbose= */ false
      );

      scannerRef.current = scanner;

      const onScanSuccess = (decodedText: string) => {
        if (scannerRef.current) {
          scannerRef.current.clear().then(() => {
            scannerRef.current = null;
            onScan(decodedText);
          }).catch(err => {
            console.error("Error clearing scanner on success:", err);
            onScan(decodedText);
          });
        }
      };

      const onScanFailure = (error: any) => {
        // Handle or ignore
      };

      scanner.render(onScanSuccess, onScanFailure);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        const currentScanner = scannerRef.current;
        scannerRef.current = null;
        currentScanner.clear().catch(error => {
          // Ignore clear errors during unmount if element is gone
          console.warn("Failed to clear html5QrcodeScanner (likely already unmounted or DOM removed). ", error);
        });
      }
    };
  }, [isOpen, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 w-full h-full">
      <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[98dvh] sm:max-h-[90vh]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 sticky top-0 z-10">
            <div>
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-2 tracking-tight">
                <ScanBarcode size={24} className="text-purple-600" />
                Select & Scan Barcode
              </h3>
              <p className="text-sm font-medium text-gray-500 mt-1">Point your camera or upload an image.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 bg-gray-50">
              <X size={20} className="stroke-[3]" />
            </button>
          </div>
          
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
            <div id="reader" className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50/50 
              [&_video]:!rounded-2xl [&_video]:!object-cover [&_video]:!w-full [&_video]:!max-h-[40vh]
              [&_#reader__dashboard_section_csr_span]:!text-gray-700 [&_#reader__dashboard_section_csr_span]:!font-medium
              [&_button]:!bg-purple-600 [&_button]:!text-white [&_button]:!rounded-xl [&_button]:!px-4 [&_button]:!py-2 [&_button]:!font-bold [&_button]:!text-sm [&_button]:!border-none [&_button]:!transition-all hover:[&_button]:!bg-purple-700 active:[&_button]:!scale-95 [&_button]:!m-1 [&_button]:!shadow-sm
              [&_select]:!rounded-xl [&_select]:!border-gray-200 [&_select]:!bg-white [&_select]:!text-sm [&_select]:!px-3 [&_select]:!py-2 [&_select]:!font-medium focus:[&_select]:!ring-2 focus:[&_select]:!ring-purple-500/20 focus:[&_select]:!border-purple-500 [&_select]:!m-1
              [&_a]:!text-purple-600 [&_a]:!font-bold hover:[&_a]:!text-purple-700 [&_a]:!no-underline
              [&_#reader__dashboard_section_swaplink]:!text-sm [&_#reader__dashboard_section_swaplink]:!mt-3 [&_#reader__dashboard_section_swaplink]:!inline-block [&_#reader__dashboard_section_swaplink]:!bg-purple-50 [&_#reader__dashboard_section_swaplink]:!px-4 [&_#reader__dashboard_section_swaplink]:!py-1.5 [&_#reader__dashboard_section_swaplink]:!rounded-lg
            "></div>
            
            <div className="mt-8 flex flex-col items-center">
              <div className="w-full h-px bg-gray-100 mb-6 relative">
                 <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Manual Entry & Demo</span>
              </div>
              
              <div className="w-full grid grid-cols-1 gap-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Keyboard size={16} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Type barcode manually..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && manualInput) {
                          onScan(manualInput);
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => manualInput && onScan(manualInput)}
                    disabled={!manualInput}
                    className="px-5 py-3 bg-gray-800 text-white font-bold text-sm rounded-xl hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
                  >
                    Submit
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    const randomBarcode = "SKU-" + Math.floor(100000 + Math.random() * 900000);
                    onScan(randomBarcode);
                  }}
                  className="w-full px-4 py-3 bg-purple-50 text-purple-700 font-bold text-sm rounded-xl hover:bg-purple-100 border border-purple-100 transition-all active:scale-95"
                 >
                  Generate Random Demo Barcode
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};
