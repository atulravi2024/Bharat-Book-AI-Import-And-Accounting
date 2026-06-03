import React, { useMemo } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    UploadFileIcon, 
    DeleteIcon, 
    FileIcon, 
    PdfIcon, 
    ExcelIcon, 
    ImageIcon,
} from '../../../icons/IconComponents';
import { Check } from 'lucide-react';

interface SubStepUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isDragOver: boolean;
  isStructuredFile: boolean;
  fileHeaders: string[];
  previewData: any[][];
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  gstSyncStatus?: {
    status: 'idle' | 'syncing' | 'success' | 'error';
    message?: string;
    blankPath?: string;
    filledPath?: string;
  };
}

export const SubStepUpload: React.FC<SubStepUploadProps> = ({
  file,
  setFile,
  isDragOver,
  isStructuredFile,
  fileHeaders,
  previewData,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileChange,
  gstSyncStatus,
}) => {
  const { t } = useLanguage();

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'pdf')  return <PdfIcon className="text-red-500" />;
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) return <ExcelIcon className="text-green-600" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return <ImageIcon className="text-blue-500" />;
    return <FileIcon className="text-gray-500 dark:text-gray-400" />;
  };

  const previewContent = useMemo(() => {
    if (!file) return null;

    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      return (
         <div className="w-full flex items-center justify-center p-2 bg-gray-100/50 dark:bg-gray-800/30 rounded-xl">
             <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-[300px] sm:max-h-[400px] object-contain rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"/>
         </div>
      );
    }
    if (fileType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return (
         <div className="w-full h-[300px] sm:h-[450px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center relative">
             <object data={URL.createObjectURL(file)} type="application/pdf" className="w-full h-full absolute inset-0 z-10" aria-label="PDF Preview">
                  <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg absolute inset-0 z-0 p-6 text-center">
                      <FileIcon className="text-4xl text-gray-400 mb-3" />
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Preview not available in this browser</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">File: {file.name}</p>
                  </div>
             </object>
         </div>
      );
    }
    
    return (
        <div className="w-full text-center p-6 sm:p-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
               {getFileIcon(file.name)}
            </div>
            <p className="font-black text-gray-800 dark:text-gray-100 text-sm sm:text-base">{file.name}</p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{(file.size / 1024).toFixed(2)} KB • {file.name.split('.').pop()?.toUpperCase()}</p>
        </div>
    );
  }, [file]);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none min-h-0 overflow-y-auto custom-scrollbar shrink-0 text-left">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl sm:rounded-[1.5rem] transition-all duration-300 ${file ? 'mb-3' : 'mb-6'} shrink-0 ${isDragOver ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'} dark:border-gray-700 dark:bg-gray-800/50 overflow-hidden shadow-sm`}
      >
        {file ? (
          <label htmlFor="file-upload" className="flex items-center justify-between cursor-pointer p-3 sm:px-6 py-3 w-full min-h-[64px] sm:min-h-[70px] group text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-800/30 group-hover:scale-105 transition-transform duration-300">
                <UploadFileIcon className="text-2xl text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-900 dark:text-white font-black tracking-tight leading-tight">{t("Want to upload a different file?")}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 font-semibold dark:text-gray-400 leading-normal">{t("Drag new file here or click to browse")}</p>
              </div>
            </div>
            <span className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-650 dark:bg-blue-900/40 dark:text-blue-300 text-[11px] font-black px-3.5 py-1.5 rounded-lg shadow-sm transition-all shrink-0">{t("Change File")}</span>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.xls,.xlsx,.xlsm,.csv,.txt,.json,.xml,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.img"/>
          </label>
        ) : (
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer p-4 sm:p-6 lg:p-8 w-full h-full min-h-[140px] sm:min-h-[160px] group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 dark:bg-blue-900/30 rounded-[1.2rem] flex items-center justify-center mb-3 shadow-sm border border-blue-100/50 dark:border-blue-800/30 group-hover:scale-105 transition-transform duration-300">
                <UploadFileIcon className="text-3xl sm:text-4xl text-blue-500" />
            </div>
            
            {/* Desktop text */}
            <div className="hidden min-[600px]:flex flex-col items-center">
               <p className="mb-0.5 text-base text-gray-900 dark:text-white font-black tracking-tight">{t("Drag & drop to upload")}</p>
               <p className="text-xs text-gray-500 mb-4 font-medium dark:text-gray-400">{t("or click to browse your system (PDF, Excel, JPG)")}</p>
               <span className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow hover:bg-blue-700 transition-all active:scale-95">{t("Browse Files")}</span>
            </div>

            {/* Mobile text */}
            <div className="flex min-[600px]:hidden flex-col items-center text-center">
               <span className="bg-blue-600 text-white text-[11px] font-bold px-4 py-2 rounded-xl shadow-sm mb-3 transition-transform active:scale-95">{t("Choose a File")}</span>
               <p className="mb-0.5 text-[11px] text-gray-800 dark:text-gray-200 font-bold">{t("Tap here to upload")}</p>
               <p className="text-[10px] text-gray-500 font-medium">{t("Supports PDF, Excel, JPG, PNG")}</p>
            </div>
            
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.xls,.xlsx,.xlsm,.csv,.txt,.json,.xml,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.img"/>
          </label>
        )}
      </div>
      
      {file && (
        <div className="mt-3 p-3 sm:p-5 lg:p-6 bg-white sm:bg-premium-slate-50 rounded-2xl sm:rounded-[2rem] border border-gray-200 sm:border-premium-slate-100 shadow-sm sm:shadow-none animate-in fade-in slide-in-from-top-4 duration-500 dark:bg-gray-800/80 dark:border-gray-700 overflow-hidden relative group shrink-0">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 hidden sm:block"></div>
            <div className="flex items-center sm:items-start gap-3 sm:gap-5 relative z-10 w-full">
                <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-blue-50/70 sm:bg-white rounded-xl sm:rounded-2xl border border-blue-100/50 sm:border-premium-slate-200 flex items-center justify-center shadow-sm dark:bg-gray-900/50 dark:border-gray-700 transition-transform group-hover:scale-105">
                    {React.cloneElement(getFileIcon(file.name) as any, { className: 'text-2xl sm:text-3xl ' + ((getFileIcon(file.name) as any).props?.className || '') })}
                </div>
                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-center sm:justify-start">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-0.5 sm:mb-1.5 w-full">
                        <h4 className="text-[13px] sm:text-lg font-black text-gray-900 truncate tracking-tight dark:text-white max-w-[90%] sm:max-w-full leading-tight">{file.name}</h4>
                        <span className="hidden sm:inline-flex shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-md tracking-widest border border-blue-200 items-center">
                            <Check className="w-3 h-3 mr-1" /> {t("Live Asset")}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-4 mt-0.5 sm:mt-1">
                        <span className="sm:hidden inline-flex items-center px-1.5 py-0.5 bg-blue-100/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[9px] font-black uppercase rounded tracking-widest leading-none">
                            {t("Live Asset")}
                        </span>
                        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full sm:hidden"></div>
                        
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest mr-1.5 opacity-50">{t("Type")}</span>
                            <span className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 sm:bg-transparent dark:bg-gray-700 sm:dark:bg-transparent px-1.5 sm:px-0 py-0.5 sm:py-0 rounded">{file.name.split('.').pop()?.toUpperCase() || 'Unknown'}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest mr-1.5 opacity-50">{t("Volume")}</span>
                            <span className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 sm:bg-transparent dark:bg-gray-700 sm:dark:bg-transparent px-1.5 sm:px-0 py-0.5 sm:py-0 rounded">{(file.size / 1024).toFixed(2)} KB</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setFile(null)}
                    className="shrink-0 w-9 h-9 sm:w-auto sm:h-auto sm:p-3 bg-red-50 sm:bg-white border border-red-100/50 sm:border-premium-slate-200 text-red-500 sm:text-gray-400 hover:text-white sm:hover:text-red-500 hover:bg-red-500 sm:hover:bg-red-50 sm:hover:border-red-100 rounded-lg sm:rounded-2xl transition-all shadow-sm dark:bg-gray-700 dark:border-gray-600 flex items-center justify-center self-center sm:self-start cursor-pointer"
                    aria-label="Remove file"
                >
                    <DeleteIcon className="text-base sm:text-xl" />
                </button>
            </div>
        </div>
      )}

      {file && gstSyncStatus && gstSyncStatus.status !== 'idle' && (
        <div className={`mt-3 p-4 rounded-xl border flex items-start gap-3.5 transition-all text-sm leading-relaxed ${
          gstSyncStatus.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300' :
          gstSyncStatus.status === 'syncing' ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-300 animate-pulse' :
          'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-300'
        }`}>
          <div className={`p-2 rounded-lg ${
            gstSyncStatus.status === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' :
            gstSyncStatus.status === 'syncing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
            'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'
          }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 4h18" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h5 className="font-extrabold uppercase tracking-wider text-[11px] mb-1">
              {gstSyncStatus.status === 'success' ? t("GST Active Ingest Archive Successful") :
               gstSyncStatus.status === 'syncing' ? t("GST Archiving Session...") :
               t("GST Sync Failure alert")}
            </h5>
            <p className="text-xs font-semibold leading-relaxed mb-2.5">
              {gstSyncStatus.message}
            </p>
            {gstSyncStatus.status === 'success' && (
              <div className="flex flex-wrap gap-2 mt-1">
                {gstSyncStatus.blankPath && (
                  <a
                    href={gstSyncStatus.blankPath}
                    download
                    className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <span>Download Blank Template</span>
                  </a>
                )}
                {gstSyncStatus.filledPath && (
                  <a
                    href={gstSyncStatus.filledPath}
                    download
                    className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <span>Download Refilled Dataset</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {file && isStructuredFile && (fileHeaders.length > 0 || previewData.length > 0) && (
        <div className="mt-6 border border-gray-200 p-4 min-[600px]:p-5 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-gray-900/60 dark:border-gray-700 overflow-hidden animate-in fade-in duration-300 shrink-0">
            <h4 className="text-[13px] sm:text-sm font-black text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">{t("Data Preview")}</h4>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs uppercase font-bold">
                  <tr>
                    {fileHeaders.slice(0, 8).map((header, i) => (
                       <th key={i} className="px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">{header}</th>
                    ))}
                    {fileHeaders.length > 8 && <th className="px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 italic">...</th>}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900/50">
                  {previewData.length > 0 ? previewData.map((row, rIndex) => (
                     <tr key={rIndex} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors font-mono">
                       {fileHeaders.slice(0, 8).map((_, i) => (
                          <td key={i} className="px-4 py-2 sm:py-2.5 text-xs text-gray-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-xs">{String(row[i] || '')}</td>
                       ))}
                       {fileHeaders.length > 8 && <td className="px-4 py-2 text-xs text-gray-500 italic">...</td>}
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={Math.min(9, fileHeaders.length)} className="px-4 py-6 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                           {t("No data rows found below the header.")}
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      )}

      {file && !isStructuredFile && previewContent && (
        <div className="mt-6 border border-gray-200 p-4 min-[600px]:p-5 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-gray-900/60 dark:border-gray-700 overflow-hidden animate-in fade-in duration-300 flex flex-col items-center shrink-0">
            <h4 className="text-[13px] sm:text-sm font-black text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 self-start">{t("File Preview")}</h4>
            {previewContent}
        </div>
      )}
    </div>
  );
};
