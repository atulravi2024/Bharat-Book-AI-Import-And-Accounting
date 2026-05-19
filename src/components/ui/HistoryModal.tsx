import React, { useState, useEffect } from 'react';
import { X, ClipboardList, Trash2, ArrowRight } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageKey?: string;
  items?: any[];
  onSelectRecord: (record: any) => void;
  onDeleteRecord?: (id: string) => void;
  title: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  storageKey,
  items,
  onSelectRecord,
  onDeleteRecord,
  title
}) => {
  const [historyDocs, setHistoryDocs] = useState<any[]>([]);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      let combined: any[] = [];
      if (storageKey) {
        const savedStr = localStorage.getItem(storageKey);
        if (savedStr) {
          try {
            const parsed = JSON.parse(savedStr);
            if (Array.isArray(parsed)) {
              combined = [...parsed].reverse();
            }
          } catch (e) {
            console.error("Failed to parse history.");
          }
        }
      }
      if (items && Array.isArray(items)) {
         // Filter out duplicates if present in both
         const existingIds = new Set(combined.map(c => c.id));
         const toAdd = items.filter(i => !existingIds.has(i.id)).reverse();
         combined = [...combined, ...toAdd];
      }
      setHistoryDocs(combined);
    }
  }, [isOpen, storageKey, items]);

  if (!isOpen) return null;

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDocToDelete(id);
  };

  const confirmDelete = () => {
    if (docToDelete) {
      if (onDeleteRecord) {
        onDeleteRecord(docToDelete);
      } else {
        const updated = historyDocs.filter(doc => doc.id !== docToDelete);
        setHistoryDocs(updated);
        if (storageKey) {
          const onlyNonSample = updated.filter(doc => !doc.isSample && !doc.sampleSetId);
          localStorage.setItem(storageKey, JSON.stringify([...onlyNonSample].reverse()));
        }
      }
      setDocToDelete(null);
    }
  };

  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    const onlySamples = historyDocs.filter(doc => doc.isSample || doc.sampleSetId);
    setHistoryDocs(onlySamples);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify([]));
    }
    setShowClearConfirm(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 dark:bg-gray-800">
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 dark:text-white">
              <ClipboardList size={20} className="text-blue-500" /> {title}
            </h3>
            <div className="flex items-center gap-2">
               {historyDocs.length > 0 && (
                 <button 
                   onClick={handleClearClick}
                   className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer mr-2"
                 >
                   Clear History
                 </button>
               )}
               <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={20} /></button>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2">
            {historyDocs.length === 0 ? (
              <div className="text-sm text-gray-500 py-16 text-center dark:text-gray-400">
                <p>No saved entries found in local history.</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {historyDocs.map((doc, idx) => (
                  <div 
                    key={doc.id || idx} 
                    onClick={() => {
                      onSelectRecord(doc);
                      onClose();
                    }}
                    className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group dark:bg-gray-800 dark:border-gray-800"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">
                           {doc.header?.voucherNumber || doc.header?.entryNumber || 'Draft Entry'}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium uppercase tracking-wider dark:bg-gray-800 dark:text-gray-300">
                           {doc.type || 'Unknown'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium dark:text-gray-400">
                        Date: {doc.header?.voucherDate || doc.header?.entryDate || 'N/A'} • 
                        Items: {doc.rows?.filter((r: any) => r.item).length || 0}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleDeleteClick(e, doc.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                      <button className="flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 p-2">
                        Load <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={!!docToDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this entry from history? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDocToDelete(null)}
        confirmText="Delete"
        isDestructive={true}
      />
      
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear History"
        message="Are you sure you want to clear all history for this module? This action cannot be undone."
        onConfirm={confirmClear}
        onCancel={() => setShowClearConfirm(false)}
        confirmText="Clear All"
        isDestructive={true}
      />
    </>
  );
};

