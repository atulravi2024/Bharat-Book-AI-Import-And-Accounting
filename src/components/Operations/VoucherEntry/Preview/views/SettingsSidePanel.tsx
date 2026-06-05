import React from 'react';
import { Settings, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsSidePanelProps {
  t: (key: string) => string;
  printConfig: any;
  handleToggleSetting: (key: any) => void;
}

export const SettingsSidePanel: React.FC<SettingsSidePanelProps> = ({
  t,
  printConfig,
  handleToggleSetting,
}) => {
  const SETTING_SECTIONS = [
    {
      title: 'Layout & Density',
      settings: [
        { key: 'compactMode', label: 'Compact Mode' },
        { key: 'useGrayScale', label: 'Grayscale Output' }
      ]
    },
    {
      title: 'Header & Details',
      settings: [
        { key: 'showLogo', label: 'Company Logo' },
        { key: 'showHeader', label: 'Company Header' },
        { key: 'showBilling', label: 'Billing Details' }
      ]
    },
    {
      title: 'Table Columns',
      settings: [
        { key: 'showHSN', label: 'HSN/SAC Code' },
        { key: 'showQty', label: 'Quantity' },
        { key: 'showRate', label: 'Rate' },
        { key: 'showDiscountPercentage', label: 'Discount %' },
        { key: 'showDiscountAmount', label: 'Discount Amount' }
      ]
    },
    {
      title: 'Footer & Summaries',
      settings: [
        { key: 'showAmountInWords', label: 'Amount in Words' },
        { key: 'showTaxDetails', label: 'Tax Details' },
        { key: 'showHsnSummary', label: 'HSN Summary' },
        { key: 'showNarration', label: 'Narration / Remarks' },
        { key: 'showCustomerSign', label: 'Customer Signature' },
        { key: 'showSignature', label: 'Authorized Signature' },
        { key: 'showFooterNotes', label: 'Footer Notes' }
      ]
    }
  ];

  return (
    <div className="hidden lg:flex w-72 flex-col border-r border-gray-200 bg-gray-50 overflow-y-auto no-print shrink-0 dark:border-gray-700 dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 flex items-center gap-2 dark:border-gray-700 dark:bg-gray-800">
        <Settings size={18} className="text-gray-500 dark:text-gray-400" />
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-100">
          {t("Print Configuration")}
        </h2>
      </div>
      
      <div className="p-4 space-y-6">
        {SETTING_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t(section.title)}</h3>
            <div className="space-y-1">
              {section.settings.map(setting => (
                <button
                  key={setting.key}
                  onClick={() => handleToggleSetting(setting.key)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors group dark:hover:bg-gray-600 animate-in fade-in slide-in-from-left-2 duration-200"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-200">{t(setting.label)}</span>
                  {printConfig[setting.key] ? (
                    <ToggleRight size={20} className="text-blue-500 transition-transform active:scale-90" />
                  ) : (
                    <ToggleLeft size={20} className="text-gray-300 transition-transform active:scale-90" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
