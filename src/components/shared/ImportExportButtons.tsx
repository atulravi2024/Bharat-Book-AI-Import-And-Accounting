import React, { useState, useRef } from 'react';
import { DownloadIcon, UploadIcon } from '../icons/IconComponents';

interface ImportExportButtonsProps {
  data: any[];
  onSave: (data: any[]) => void;
  entityName: string;
}

export const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({ data, onSave, entityName }) => {
  const [modalType, setModalType] = useState<'import' | 'export' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export.');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val !== null && val !== undefined ? val : '').replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    
    downloadFile(csvRows.join('\n'), `${entityName}.csv`, 'text/csv');
  };

  const exportJSON = () => {
    downloadFile(JSON.stringify(data, null, 2), `${entityName}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAction = (format: 'json' | 'csv') => {
    if (modalType === 'export') {
      if (format === 'json') exportJSON();
      else exportCSV();
      setModalType(null);
    } else if (modalType === 'import') {
      if (fileInputRef.current) {
        fileInputRef.current.accept = format === 'json' ? '.json' : '.csv';
        fileInputRef.current.dataset.format = format;
        fileInputRef.current.click();
      }
      setModalType(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const format = e.target.dataset.format;
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let parsedData: any[] = [];

        if (format === 'json') {
          parsedData = JSON.parse(content);
          if (!Array.isArray(parsedData)) parsedData = [parsedData];
        } else if (format === 'csv') {
          const lines = content.split('\n').filter(l => l.trim() !== '');
          if (lines.length > 1) {
            const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
            for (let i = 1; i < lines.length; i++) {
              // Basic CSV parsing
              const obj: any = {};
              const currentLine = lines[i].split(',');
              for (let j = 0; j < headers.length; j++) {
                 const rawValue = (currentLine[j] || '').replace(/^"|"$/g, '').trim();
                 try {
                     obj[headers[j]] = JSON.parse(rawValue);
                 } catch {
                     obj[headers[j]] = rawValue;
                 }
              }
              parsedData.push(obj);
            }
          }
        }

        if (parsedData.length > 0) {
           onSave([...data, ...parsedData]);
           alert(`Successfully imported ${parsedData.length} records.`);
        }
      } catch (err) {
        alert('Failed to parse file. Please check the format.');
        console.error(err);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div className="flex items-center space-x-2 mr-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileUpload} 
        />
        <button
          onClick={() => setModalType('import')}
          className="bg-white text-gray-700 border border-gray-200 px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-sm whitespace-nowrap hover:bg-gray-50 active:scale-95 transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:dark:bg-gray-700"
        >
          <UploadIcon className="text-[18px] leading-none lg:mr-2" />
          <span className="hidden lg:inline-block">Import</span>
        </button>
        <button
          onClick={() => setModalType('export')}
          className="bg-white text-gray-700 border border-gray-200 px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-sm whitespace-nowrap hover:bg-gray-50 active:scale-95 transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:dark:bg-gray-700"
        >
          <DownloadIcon className="text-[18px] leading-none lg:mr-2" />
          <span className="hidden lg:inline-block">Export</span>
        </button>
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-xl mb-2 text-gray-900 flex items-center dark:text-white">
              {modalType === 'import' ? 'Select Import Format' : 'Select Export Format'}
            </h2>
            <p className="text-gray-500 mb-6 text-sm dark:text-gray-400">
              {modalType === 'import' ? 'Which version you have to input' : 'Which version you do export'}
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleAction('json')}
                className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition flex items-center justify-center"
              >
                JSON Format
              </button>
              <button
                onClick={() => handleAction('csv')}
                className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition flex items-center justify-center"
              >
                CSV Format
              </button>
              <button
                onClick={() => setModalType(null)}
                className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 hover:dark:bg-red-900/40 transition mt-2 flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

