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
  onUpdateItemMaster?: (item: any) => void;
  onAddItemMaster?: (item: any) => void;
  onSaveEntry?: (entry: any, isNew: boolean) => void;
  onOpenPrintSettings?: () => void;
}

export const VoucherEntryView: React.FC<VoucherEntryViewProps> = (props) => {
  const type = props.initialVoucher?.type || props.defaultType || 'sales';
  const normalizedType = typeof type === 'string' ? type.toLowerCase().replace(' ', '_') : type;

  const tabs = [
    { id: 'sales', label: 'Sales' },
    { id: 'purchase', label: 'Purchase' },
    { id: 'payment', label: 'Payment' },
    { id: 'receipt', label: 'Receipt' },
    { id: 'journal', label: 'General / Journal' },
    { id: 'contra', label: 'Contra' },
    { id: 'debit_note', label: 'Debit Note' },
    { id: 'credit_note', label: 'Credit Note' },
  ];

  const [activeTab, setActiveTabWrapper] = React.useState(normalizedType);

  React.useEffect(() => {
    setActiveTabWrapper(normalizedType);
  }, [normalizedType]);

  const propsToPass = { ...props, defaultType: activeTab };

  const renderVoucher = () => {
     switch (activeTab) {
        case 'sales': return <SalesVoucher {...propsToPass} />;
        case 'purchase': return <PurchaseVoucher {...propsToPass} />;
        case 'payment': return <PaymentVoucher {...propsToPass} />;
        case 'receipt': return <ReceiptVoucher {...propsToPass} />;
        case 'journal': return <JournalVoucher {...propsToPass} />;
        case 'contra': return <ContraVoucher {...propsToPass} />;
        case 'debit_note': return <DebitNoteVoucher {...propsToPass} />;
        case 'credit_note': return <CreditNoteVoucher {...propsToPass} />;
        default: return <SalesVoucher {...propsToPass} />;
     }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
            <span>Operations</span> <span className="text-gray-300">/</span> <span>Financial Entry</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center tracking-tight">
            Transactions
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Record and manage financial vouchers manually</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 font-medium">
           Workspace / Vouchers
        </div>
      </div>

      <div className="sticky top-0 z-[40] md:static -mx-4 px-4 -mt-4 pt-4 bg-gray-100/95 backdrop-blur-md pb-4 mb-4 md:-mx-0 md:px-0 md:-mt-0 md:pt-0 md:bg-transparent md:pb-0 md:mb-8 overflow-x-auto no-scrollbar w-full">
         <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm inline-flex min-w-max">
            <nav className="flex space-x-1">
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
                    `}
                >
                    {tab.label}
                </button>
                ))}
            </nav>
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
