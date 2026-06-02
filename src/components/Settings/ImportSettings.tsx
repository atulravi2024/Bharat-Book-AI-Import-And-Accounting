
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SettingsIcon } from '../icons/IconComponents';
import { ChevronDown, FileUp, ShoppingCart, Tag, CreditCard, Download, BookOpen, Repeat, Landmark } from 'lucide-react';
import { 
    PurchaseImport, 
    SalesImport, 
    PaymentImport, 
    ReceiptImport, 
    JournalImport, 
    ContraImport, 
    BankImport 
} from '../Operations/Import/imports/index';

interface ImportSettingsProps {
    toggles: {
        autoClassifyImports: boolean;
        autoCreateMissing: boolean;
        autoMatchLedgerGstin: boolean;
    };
    handleToggle: (key: any) => void;
    setView?: (view: any) => void;
    onImportCategoryChange?: (category: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other') => void;
}

export const ImportSettings: React.FC<ImportSettingsProps> = ({ 
  toggles, 
  handleToggle,
  setView,
  onImportCategoryChange
}) => {
  const { t } = useLanguage();
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    // Specific Import Settings State
    const [importConfigs, setImportConfigs] = useState({
        purchase: { 
            autoMatchSupplier: true, 
            validateHSN: false, 
            autoCalculateTax: true,
            deductTDS: false,
            detectRCM: true
        },
        sales: { 
            autoGenerateInvoice: true, 
            mandatoryGSTIN: true, 
            roundingStrategy: 'normal',
            inventorySync: false,
            enforcePriceList: true
        },
        payment: { 
            autoBillMatching: true, 
            paymentLimitWarning: 50000,
            complianceLimitEnabled: true,
            chequeQueue: false
        },
        receipt: { 
            autoAllocation: false, 
            allowNegativeCash: false,
            autoCashDiscount: true,
            splitMultiInvoices: true
        },
        journal: { 
            autoBalanceEntries: true, 
            mandatoryNarration: false,
            taxJournalMatch: true,
            detectDuplicates: true
        },
        contra: { 
            autoBankDetect: true, 
            cashLimitAlert: 200000,
            autoExtraceCharges: false,
            forceNarration: true
        },
        bank: { 
            autoClassify: toggles.autoClassifyImports, 
            skipDuplicates: true, 
            confidenceThreshold: 90,
            processUPI: true,
            matchInterest: true
        }
    });

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    const updateConfig = (section: string, key: string, value: any) => {
        setImportConfigs(prev => ({
            ...prev,
            [section]: {
                ...(prev as any)[section],
                [key]: value
            }
        }));
    };

    const handleConfigToggle = (section: string, key: string) => {
        const currentVal = (importConfigs as any)[section][key];
        updateConfig(section, key, !currentVal);
    };

    const importTypes = [
        { 
            id: 'purchase', 
            title: 'Purchase Import Configuration', 
            icon: <ShoppingCart size={16} />, 
            component: <PurchaseImport settings={importConfigs.purchase} onToggle={(key) => handleConfigToggle('purchase', key)} /> 
        },
        { 
            id: 'sales', 
            title: 'Sales Import Configuration', 
            icon: <Tag size={16} />, 
            component: <SalesImport settings={importConfigs.sales} onToggle={(key) => handleConfigToggle('sales', key)} onSelect={(key, val) => updateConfig('sales', key, val)} /> 
        },
        { 
            id: 'payment', 
            title: 'Payment Import Configuration', 
            icon: <CreditCard size={16} />, 
            component: <PaymentImport settings={importConfigs.payment} onToggle={(key) => handleConfigToggle('payment', key)} onNumberChange={(key, val) => updateConfig('payment', key, val)} /> 
        },
        { 
            id: 'receipt', 
            title: 'Receipt Import Configuration', 
            icon: <Download size={16} />, 
            component: <ReceiptImport settings={importConfigs.receipt} onToggle={(key) => handleConfigToggle('receipt', key)} /> 
        },
        { 
            id: 'journal', 
            title: 'Journal Import Configuration', 
            icon: <BookOpen size={16} />, 
            component: <JournalImport settings={importConfigs.journal} onToggle={(key) => handleConfigToggle('journal', key)} /> 
        },
        { 
            id: 'contra', 
            title: 'Contra Import Configuration', 
            icon: <Repeat size={16} />, 
            component: <ContraImport settings={importConfigs.contra} onToggle={(key) => handleConfigToggle('contra', key)} onNumberChange={(key, val) => updateConfig('contra', key, val)} /> 
        },
        { 
            id: 'bank', 
            title: 'Bank Import Configuration', 
            icon: <Landmark size={16} />, 
            component: <BankImport settings={importConfigs.bank} onToggle={(key) => handleConfigToggle('bank', key)} onNumberChange={(key, val) => updateConfig('bank', key, val)} /> 
        },
    ];

    return (
        <div className="bg-white w-full border-t border-b border-gray-100 relative dark:bg-gray-800 dark:border-gray-800">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest my-6 flex items-center px-4 dark:text-white">
                <SettingsIcon className="mr-3 text-blue-600" /> {t("Voucher Import Configuration")}
            </h3>
            
            {setView && onImportCategoryChange && (
              <div className="mx-4 mb-6 p-5 bg-gradient-to-r from-blue-50/50 via-blue-50/10 to-transparent dark:from-blue-950/20 dark:to-transparent rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-900/20 shadow-sm text-blue-600 self-start">
                    <FileUp className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-blue-950 dark:text-blue-300">{t("Configuration Import Portal")}</h4>
                    <p className="text-xs text-blue-700/85 dark:text-blue-400 mt-1 leading-relaxed max-w-xl">
                      {t("Want to load custom environment backups, sensitivity ratings, Auto-Numbering preferences, or firm policies? Navigate directly to the Import wizard.")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onImportCategoryChange('settings');
                    setView('import');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer flex items-center"
                >
                  <FileUp className="mr-2 w-4 h-4" />
                  {t("Import Settings Profile")}
                </button>
              </div>
            )}
            
            <div className="space-y-0">
                {/* Global Rules Section - Collapsible */}
                <div className={`overflow-hidden transition-all duration-300 border-b border-gray-100 ${expandedSection === 'global' ? 'bg-indigo-50/5' : 'bg-white hover:bg-gray-50/30'} dark:border-gray-800 dark:bg-gray-800`}>
                    <button 
                        onClick={() => toggleSection('global')}
                        className="w-full flex items-center justify-between p-4 text-left transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl transition-all border ${expandedSection === 'global' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-100 group-hover:bg-white group-hover:text-indigo-600 group-hover:border-indigo-100'} dark:bg-gray-900 dark:border-gray-800`}>
                                <Landmark size={16} />
                            </div>
                            <div>
                                <span className={`text-[11px] font-black tracking-wide uppercase ${expandedSection === 'global' ? 'text-indigo-700' : 'text-gray-800'} dark:text-gray-100`}>{t("Global AI Import Rules")}</span>
                                <p className="text-[10px] text-gray-400 font-medium">{t("Standard behavior across all voucher types")}</p>
                            </div>
                        </div>
                        <div className={`p-1 rounded-full transition-transform duration-300 ${expandedSection === 'global' ? 'rotate-180 bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-400'} dark:bg-gray-900`}>
                            <ChevronDown size={14} />
                        </div>
                    </button>
                    
                    {expandedSection === 'global' && (
                        <div className="px-5 pb-6 bg-white animate-in fade-in slide-in-from-top-1 duration-300 dark:bg-gray-800">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-100/50">
                                    <div>
                                        <p className="text-xs text-gray-800 font-bold dark:text-gray-100">{t("Auto-create missing items")}</p>
                                        <p className="text-[10px] text-gray-400 font-medium max-w-sm mt-0.5">{t("Automatically create stock items for unrecognized entries.")}</p>
                                    </div>
                                    <div onClick={() => handleToggle('autoCreateMissing')} className={`${toggles.autoCreateMissing ? 'bg-indigo-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0`}>
                                        <div className={`bg-white w-3 h-3 rounded-full absolute top-1 ${toggles.autoCreateMissing ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-100/50">
                                    <div>
                                        <p className="text-xs text-gray-800 font-bold dark:text-gray-100">{t("Auto-match ledgers by GSTIN")}</p>
                                        <p className="text-[10px] text-gray-400 font-medium max-w-sm mt-0.5">{t("Prioritize GSTIN mapping over fuzzy name matching.")}</p>
                                    </div>
                                    <div onClick={() => handleToggle('autoMatchLedgerGstin')} className={`${toggles.autoMatchLedgerGstin ? 'bg-indigo-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0`}>
                                        <div className={`bg-white w-3 h-3 rounded-full absolute top-1 ${toggles.autoMatchLedgerGstin ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-100/50">
                                    <div>
                                        <p className="text-xs text-gray-800 font-bold dark:text-gray-100">{t("Smart Narration Cleanup")}</p>
                                        <p className="text-[10px] text-gray-400 font-medium max-w-sm mt-0.5">{t("Remove dates and payment handles from extracted narrations.")}</p>
                                    </div>
                                    <div onClick={() => handleToggle('smartNarrationCleanup' as any)} className={`${(toggles as any).smartNarrationCleanup ? 'bg-indigo-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0`}>
                                        <div className={`bg-white w-3 h-3 rounded-full absolute top-1 ${(toggles as any).smartNarrationCleanup ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 py-2">
                                    <div>
                                        <p className="text-xs text-gray-800 font-bold dark:text-gray-100">{t("FileName Date Extraction")}</p>
                                        <p className="text-[10px] text-gray-400 font-medium max-w-sm mt-0.5">{t("Automatically use the date from the imported file name if missing.")}</p>
                                    </div>
                                    <div onClick={() => handleToggle('extractDateFromFileName' as any)} className={`${(toggles as any).extractDateFromFileName ? 'bg-indigo-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0`}>
                                        <div className={`bg-white w-3 h-3 rounded-full absolute top-1 ${(toggles as any).extractDateFromFileName ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Voucher-Specific Configuration - Collapsible */}
                <div className="border-t border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800">
                        {importTypes.map((type) => (
                            <div key={type.id} className={`overflow-hidden transition-all duration-300 ${expandedSection === type.id ? 'bg-indigo-50/5' : 'bg-white hover:bg-gray-50/30'} dark:bg-gray-800`}>
                                <button 
                                    onClick={() => toggleSection(type.id)}
                                    className="w-full flex items-center justify-between p-4 text-left transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all border ${expandedSection === type.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-100 group-hover:bg-white group-hover:text-indigo-600 group-hover:border-indigo-100'} dark:bg-gray-900 dark:border-gray-800`}>
                                            {type.icon}
                                        </div>
                                        <div>
                                            <span className={`text-[11px] font-black tracking-wide uppercase ${expandedSection === type.id ? 'text-indigo-700' : 'text-gray-800'} dark:text-gray-100`}>{t(type.title)}</span>
                                        </div>
                                    </div>
                                    <div className={`p-1 rounded-full transition-transform duration-300 ${expandedSection === type.id ? 'rotate-180 bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-400'} dark:bg-gray-900`}>
                                        <ChevronDown size={14} />
                                    </div>
                                </button>
                                
                                {expandedSection === type.id && (
                                    <div className="px-5 pb-6 bg-white animate-in fade-in slide-in-from-top-1 duration-300 dark:bg-gray-800">
                                        {type.component}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
