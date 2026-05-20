import React from 'react';
import { SalesVoucher } from './vouchers/SalesVoucher';
import { PurchaseVoucher } from './vouchers/PurchaseVoucher';
import { PaymentVoucher } from './vouchers/PaymentVoucher';
import { ReceiptVoucher } from './vouchers/ReceiptVoucher';
import { JournalVoucher } from './vouchers/JournalVoucher';
import { ContraVoucher } from './vouchers/ContraVoucher';
import { DebitNoteVoucher } from './vouchers/DebitNoteVoucher';
import { CreditNoteVoucher } from './vouchers/CreditNoteVoucher';
import { VoucherType } from '../../../types';

interface VoucherEntryViewProps {
  defaultType?: string;
  initialVoucher?: any;
  itemMasters?: any[];
  ledgerMasters?: any[];
  partyMasters?: any[];
  vouchers?: any[];
  onUpdateItemMaster?: (item: any) => void;
  onAddItemMaster?: (item: any) => void;
  onSaveEntry?: (entry: any, isNew: boolean) => void;
  onDeleteEntry?: (id: string) => void;
  onOpenPrintSettings?: () => void;
}

export const VoucherEntryView: React.FC<VoucherEntryViewProps> = (props) => {
  const type = props.initialVoucher?.type || props.defaultType || 'sales';
  const normalizedType = typeof type === 'string' ? type.toLowerCase().replace(/ /g, '_') : type;

  const tabs = [
    { id: 'sales', label: 'Sales' },
    { id: 'purchase', label: 'Purchase' },
    { id: 'payment', label: 'Payment' },
    { id: 'receipt', label: 'Receipt' },
    { id: 'journal', label: 'Journal' },
    { id: 'contra', label: 'Contra' },
    { id: 'debit_note', label: 'Debit Note' },
    { id: 'credit_note', label: 'Credit Note' },
  ];

  const [activeTab, setActiveTabWrapper] = React.useState(normalizedType);
  const [invoiceMode, setInvoiceMode] = React.useState<'item' | 'accounting'>('item');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setActiveTabWrapper(normalizedType);
    setInvoiceMode('item');
  }, [normalizedType]);

  React.useEffect(() => {
    if (['debit_note', 'credit_note'].includes(activeTab)) {
      if (scrollContainerRef.current) {
         setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({
                left: scrollContainerRef.current.scrollWidth,
                behavior: 'smooth'
              });
            }
         }, 100);
      }
    }
  }, [activeTab]);

  const propsToPass = { ...props, defaultType: activeTab };

  const renderVoucher = () => {
     switch (activeTab) {
        case 'sales': return <SalesVoucher {...propsToPass} />;
        case 'purchase': return <PurchaseVoucher {...propsToPass} />;
        case 'payment': return <PaymentVoucher {...propsToPass} />;
        case 'receipt': return <ReceiptVoucher {...propsToPass} />;
        case 'journal': return <JournalVoucher {...propsToPass} />;
        case 'contra': return <ContraVoucher {...propsToPass} />;
        case 'debit_note': return invoiceMode === 'accounting' ? <JournalVoucher type="debit_note" {...propsToPass} /> : <DebitNoteVoucher {...propsToPass} />;
        case 'credit_note': return invoiceMode === 'accounting' ? <JournalVoucher type="credit_note" {...propsToPass} /> : <CreditNoteVoucher {...propsToPass} />;
        default: return <SalesVoucher {...propsToPass} />;
     }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-full">
      <div ref={scrollContainerRef} className="sticky top-0 z-[40] md:static -mx-4 px-4 -mt-4 pt-4 bg-gray-100/95 backdrop-blur-md pb-4 mb-4 md:-mx-0 md:px-0 md:-mt-0 md:pt-0 md:bg-transparent md:pb-0 md:mb-8 overflow-x-auto custom-scrollbar w-full">
         <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm inline-flex min-w-max justify-between items-center dark:bg-gray-800 dark:border-gray-700">
            <nav className="flex space-x-1 flex-1">
                {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTabWrapper(tab.id); }}
                    className={`
                    whitespace-nowrap py-2.5 px-5 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all
                    ${activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20' 
                        : 'bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }
                     dark:text-gray-400 dark:hover:bg-gray-700`}
                >
                    {tab.label}
                </button>
                ))}
            </nav>
            {['debit_note', 'credit_note'].includes(activeTab) && (
               <div className="flex space-x-1 ml-4 border-l border-gray-200 pl-4 dark:border-gray-700">
                  <button
                     onClick={() => setInvoiceMode('item')}
                     className={`whitespace-nowrap py-2.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all ${invoiceMode === 'item' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'}`}
                  >
                     Item Invoice
                  </button>
                  <button
                     onClick={() => setInvoiceMode('accounting')}
                     className={`whitespace-nowrap py-2.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all ${invoiceMode === 'accounting' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'}`}
                  >
                     Accounting Invoice
                  </button>
               </div>
            )}
         </div>
      </div>

      <div className="flex flex-col gap-6 items-stretch pb-24 md:pb-0">
        <div className="w-full">
            {renderVoucher()}
        </div>
      </div>
    </div>
  );
};
