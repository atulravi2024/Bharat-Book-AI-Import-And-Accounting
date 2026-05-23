
import React, { useState, useEffect, Component } from 'react';
import { RefreshCw } from 'lucide-react';
import { Layout } from './components/Layout/Layout';
import { ThemeProvider } from './components/Layout/ThemeContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { Step1Upload } from './components/Operations/Import/Step1Upload';
import { Step2Correction } from './components/Operations/Import/Step2Correction';
import { Step3Summary } from './components/Operations/Import/Step3Summary';
import { SuccessScreen } from './components/Operations/Import/SuccessScreen';
import { MasterView } from './components/Masters/MasterView';
import { LedgerReportView } from './components/Reports/BankVouchers/LedgerReportView';
import { BankReportView } from './components/Reports/BankVouchers/BankReportView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ReportsView } from './components/Reports/FinancialReport/FinancialReportView';
import { ItemReportView } from './components/Reports/Items/ItemReportView';
import { VoucherEntryView } from './components/Operations/VoucherEntry/VoucherEntryView';
import { InventoryEntryView } from './components/Operations/InventoryEntry/InventoryEntryView';
import { SystemDecideView } from './components/Operations/BulkOperation/SystemDecideView';
import { SettingsView } from './components/Settings/SettingsView';
import { GSTReportView } from './components/Reports/GSTReport/GSTReportView';
import { AppStep, ParsedVoucher, VoucherType, ParsingSettings, MainView, AuditLog, Confidence, ColorMaster, SizeMaster, DimensionMaster, BomMaster } from './types';
import { parseVoucherFile } from './services/aiService';
import { InfoIcon, UndoIcon, ErrorIcon } from './components/icons/IconComponents';
import { ManagedUser, INITIAL_USERS } from './components/Settings/UserSettings';

const DRAFT_KEY = 'bharat_book_voucher_draft';
const PARTY_MASTERS_KEY = 'bharat_book_party_masters';
const LEDGER_MASTERS_KEY = 'bharat_book_ledger_masters';
const ITEM_MASTERS_KEY = 'bharat_book_item_masters';
const UOM_MASTERS_KEY = 'bharat_book_uom_masters';
const ALL_VOUCHERS_KEY = 'bharat_book_all_vouchers_v2_v2';
const GST_MASTERS_KEY = 'bharat_book_gst_masters';
const BRAND_MASTERS_KEY = 'bharat_book_brand_masters';
const CATEGORY_MASTERS_KEY = 'bharat_book_category_masters';
const GRADE_MASTERS_KEY = 'bharat_book_grade_masters';
const ASSERTION_CATEGORY_MASTERS_KEY = 'bharat_book_assertion_category_masters';
const ASSERTION_CODE_MASTERS_KEY = 'bharat_book_assertion_code_masters';
const CONTACT_MASTERS_KEY = 'bharat_book_contact_masters';
const LOCATION_MASTERS_KEY = 'bharat_book_location_masters';
const STOCK_GROUP_MASTERS_KEY = 'bharat_book_stock_group_masters';
const COST_CENTER_MASTERS_KEY = 'bharat_book_cost_center_masters';
const ACCOUNT_GROUP_MASTERS_KEY = 'bharat_book_account_group_masters';
const BOM_MASTERS_KEY = 'bharat_book_bom_masters';

// Safe JSON parse helper - returns default value on parse failure
const safeJsonParse = <T,>(jsonString: string | null, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('JSON parse error:', e);
    return defaultValue;
  }
};

function useStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => safeJsonParse(localStorage.getItem(key), defaultValue));
  const isFirstRender = React.useRef(true);
  
  useEffect(() => {
      if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
      }
      try {
          localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
          console.error(`Storage error for ${key}:`, e);
      }
  }, [state, key]);
  
  return [state, setState];
}


import { LoginScreen } from './LoginScreen';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('bharat_book_current_logged_in_user_id');
  });

  const handleLogin = (id: string) => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  const { addNotification } = useNotifications();
  const [view, setView] = useState<MainView>(() => {
    const saved = localStorage.getItem('bharat_book_navigation_defaults');
    if (saved) {
      try {
        const { page } = JSON.parse(saved);
        if (page) return page as MainView;
      } catch (e) {}
    }
    return 'dashboard';
  });
  const [originView, setOriginView] = useState<MainView | null>(null);
  const getSubPageForView = (viewName: string) => {
    const saved = localStorage.getItem('bharat_book_navigation_defaults');
    if (saved) {
      try {
        const { page, subPage, routing } = JSON.parse(saved);
        if (page === viewName && subPage) return subPage;
        if (routing && routing[viewName]) return routing[viewName];
      } catch (e) {}
    }
    return null;
  };

  const [activeMasterTab, setActiveMasterTab] = useState<string | null>(() => {
    const currentView = (() => {
      const saved = localStorage.getItem('bharat_book_navigation_defaults');
      if (saved) {
        try {
          const { page } = JSON.parse(saved);
          return page;
        } catch (e) {}
      }
      return 'dashboard';
    })();
    return currentView === 'ledger-master' ? getSubPageForView('ledger-master') : getSubPageForView('item-master');
  });
  const [reportActiveTab, setReportActiveTab] = useState<string | null>(() => getSubPageForView('reports'));
  const [bankActiveTab, setBankActiveTab] = useState<string | null>(() => getSubPageForView('bank'));
  const [dashboardActiveTab, setDashboardActiveTab] = useState<string | null>(() => getSubPageForView('dashboard'));
  const [vouchersActiveTab, setVouchersActiveTab] = useState<string | null>(() => getSubPageForView('vouchers'));
  const [gstActiveTab, setGstActiveTab] = useState<string | null>(() => getSubPageForView('gst-report'));
  const [itemReportActiveTab, setItemReportActiveTab] = useState<string | null>(() => getSubPageForView('item-report'));
  const [voucherEntryActiveTab, setVoucherEntryActiveTab] = useState<string | null>(() => getSubPageForView('voucher-entry'));
  const [inventoryEntryActiveTab, setInventoryEntryActiveTab] = useState<string | null>(() => getSubPageForView('inventory-entry'));
  const [settingsActiveTab, setSettingsActiveTab] = useState<string | null>(() => getSubPageForView('settings'));
  const [activeSamples, setActiveSamples] = useStorageState<string[]>('bharat_book_active_samples_v12', [
    'uoms', 'gst', 'brands', 'categories', 'warehouses', 'skus', 'priceList', 
    'weights', 'volumes', 'colors', 'sizes', 'variants', 'dimensions', 'stockGroups', 
    'grades', 'assertionCategories', 'assertionCodes', 
    'ledgers', 'items', 'bom', 'parties', 'vendors', 'partners', 'accountGroups', 'banks', 'costCenters', 'contacts',
    'balance_sheet', 'profit_loss', 'cash_flow', 'bank_flow', 'trial_balance', 
    'sales_register', 'purchase_register', 'financial_vouchers', 'gstr1',
    'day_book', 'journal_register', 'debit_note_register', 'credit_note_register',
    'payment_register', 'receipt_register', 'contra_register', 'audit_trail',
    'item_vouchers', 'stock_summary', 'item_movement', 'low_stock', 'inventory_valuation',
    'bank_vouchers', 'raw_bank', 'auto_match', 'missing_master', 'unidentified', 'to_classify', 'reconcile'
  ]);
  
  useEffect(() => {
    if (view !== 'ledger-master' && view !== 'item-master' && view !== 'settings') {
      setActiveMasterTab(null);
    }
  }, [view]);
  const [step, setStep] = useState<AppStep>('upload');
  const [entryStep, setEntryStep] = useState<AppStep>('upload');
  const [vouchers, setVouchers] = useState<ParsedVoucher[]>([]);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);
  const [allVouchers, setAllVouchers] = useStorageState<ParsedVoucher[]>(ALL_VOUCHERS_KEY, []);
  const [voucherType, setVoucherType] = useState<VoucherType>(VoucherType.Purchase);
  const [parsingSettings, setParsingSettings] = useState<ParsingSettings | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{current: number, total: number, label: string} | null>(null);
  
  const [partyMasters, setPartyMasters] = useStorageState<any[]>(PARTY_MASTERS_KEY, []);
  const [ledgerMasters, setLedgerMasters] = useStorageState<any[]>(LEDGER_MASTERS_KEY, []);
  const [itemMasters, setItemMasters] = useStorageState<any[]>(ITEM_MASTERS_KEY, []);
  const [uomMasters, setUomMasters] = useStorageState<any[]>(UOM_MASTERS_KEY, []);
  const [gstMasters, setGstMasters] = useStorageState<any[]>(GST_MASTERS_KEY, []);
  const [brandMasters, setBrandMasters] = useStorageState<any[]>(BRAND_MASTERS_KEY, []);
  const [categoryMasters, setCategoryMasters] = useStorageState<any[]>(CATEGORY_MASTERS_KEY, []);
  const [gradeMasters, setGradeMasters] = useStorageState<any[]>(GRADE_MASTERS_KEY, []);
  const [assertionCategoryMasters, setAssertionCategoryMasters] = useStorageState<any[]>(ASSERTION_CATEGORY_MASTERS_KEY, []);
  const [assertionCodeMasters, setAssertionCodeMasters] = useStorageState<any[]>(ASSERTION_CODE_MASTERS_KEY, []);
  const [contactMasters, setContactMasters] = useStorageState<any[]>(CONTACT_MASTERS_KEY, []);

  // Ensure active samples are loaded on mount and cleanup legacy hard-coded data
  useEffect(() => {
    const purgeLegacy = () => {
        const purgedKey = 'bharat_book_legacy_purged_v5';
        if (!localStorage.getItem(purgedKey)) {
            const keysToClear = [
                PARTY_MASTERS_KEY, LEDGER_MASTERS_KEY, ITEM_MASTERS_KEY, UOM_MASTERS_KEY,
                GST_MASTERS_KEY, BRAND_MASTERS_KEY, CATEGORY_MASTERS_KEY, GRADE_MASTERS_KEY,
                ASSERTION_CATEGORY_MASTERS_KEY, ASSERTION_CODE_MASTERS_KEY, CONTACT_MASTERS_KEY
            ];
            
            let hasAnyData = false;
            keysToClear.forEach(key => {
                const data = localStorage.getItem(key);
                if (data && safeJsonParse(data, []).length > 0) hasAnyData = true;
            });

            if (hasAnyData) {
                setPartyMasters([]);
                setLedgerMasters([]);
                setItemMasters([]);
                setUomMasters([]);
                setGstMasters([]);
                setBrandMasters([]);
                setCategoryMasters([]);
                setGradeMasters([]);
                setAssertionCategoryMasters([]);
                setAssertionCodeMasters([]);
                setContactMasters([]);
            }

            // Also purge allVouchers of items that look like samples but lack sampleSetId or have the old properties
            setAllVouchers(prev => prev.filter(v => {
                 // If it already has correctly set isSample and sampleSetId, it's fine
                 if (v.isSample && v.sampleSetId) return true;

                 const id = String(v.id || '');
                 const prefixes = [
                    'v-', 'bf-', 'rv-', 'bnk-', 'raw-', 'am-', 'mm-', 'uid-', 'tc-', 'rc-',
                    'fin-', 'sr-', 'pr-', 'tb-', 'cf-', 'bs-', 'iv-', 'im-', 'ls-', 'ss-',
                    'gv-', 'p-l-', 'gr-'
                 ];
                 
                 const isOldSample = prefixes.some(p => id.startsWith(p));
                 
                 // Keep it only if it's NOT an old sample ID
                 return !isOldSample;
            }));

            localStorage.setItem(purgedKey, 'true');
        }
    };

    purgeLegacy();

    const reloadSamples = async () => {
        const hasLoaded = localStorage.getItem('bharat_book_samples_hydrated_v21');
        if (!hasLoaded) {
            for (const id of activeSamples) {
                await toggleSampleDataSet(id, true);
            }
            localStorage.setItem('bharat_book_samples_hydrated_v21', 'true');
        }
    };
    reloadSamples();
  }, []);

  const [skuMasters, setSkuMasters] = useStorageState<any[]>('bharat_book_sku_masters', []);
  const [priceListMasters, setPriceListMasters] = useStorageState<any[]>('bharat_book_price_list_masters', []);
  const [weightMasters, setWeightMasters] = useStorageState<any[]>('bharat_book_weight_masters', []);
  const [volumeMasters, setVolumeMasters] = useStorageState<any[]>('bharat_book_volume_masters', []);
  const [colorMasters, setColorMasters] = useStorageState<ColorMaster[]>('bharat_book_color_masters', [] as ColorMaster[]);
  const [sizeMasters, setSizeMasters] = useStorageState<SizeMaster[]>('bharat_book_size_masters', [] as SizeMaster[]);
  const [variantMasters, setVariantMasters] = useStorageState<any[]>('bharat_book_variant_masters', []);
  const [dimensionMasters, setDimensionMasters] = useStorageState<DimensionMaster[]>('bharat_book_dimension_masters', [] as DimensionMaster[]);

  const [locationMasters, setLocationMasters] = useStorageState<any[]>(LOCATION_MASTERS_KEY, []);
  const [bomMasters, setBomMasters] = useStorageState<BomMaster[]>(BOM_MASTERS_KEY, []);
  const [stockGroupMasters, setStockGroupMasters] = useStorageState<any[]>(STOCK_GROUP_MASTERS_KEY, []);
  const [costCenterMasters, setCostCenterMasters] = useStorageState<any[]>(COST_CENTER_MASTERS_KEY, []);
  const [accountGroupMasters, setAccountGroupMasters] = useStorageState<any[]>(ACCOUNT_GROUP_MASTERS_KEY, []);



  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setHasDraft(true);
    }
  }, []);

  const resetFlow = () => {
    setStep('upload');
    setEntryStep('upload');
    setVouchers([]);
    setIsLoading(false);
    setError(null);
    if (originView && originView !== 'import') {
      setView(originView);
      setOriginView(null);
    }
  };

  const handleSaveDraft = (currentVouchers: ParsedVoucher[]) => {
    const draft = {
      vouchers: currentVouchers,
      voucherType,
      parsingSettings,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setHasDraft(true);
  };

  const resumeDraft = () => {
    const draft = safeJsonParse(localStorage.getItem(DRAFT_KEY), null);
    if (draft) {
      setVouchers(draft.vouchers || []);
      setVoucherType(draft.voucherType || VoucherType.Purchase);
      if (draft.parsingSettings) setParsingSettings(draft.parsingSettings);
      setStep('correction');
      setHasDraft(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  };

  const handleStep1Next = async (file: File, selectedVoucherType: VoucherType, mapping?: Record<string, string>, settings?: ParsingSettings, sourceBank?: string) => {
    setIsLoading(true);
    setError(null);
    setVoucherType(selectedVoucherType);
    if (settings) setParsingSettings(settings);
    try {
      if (file.name.toLowerCase().includes('error')) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        throw new Error('This file appears to be corrupted and cannot be processed.');
      }

      const appSettingsStr = localStorage.getItem('bharat_book_app_settings');
      let finalSettings = settings || { ocrSensitivity: 75, aiModel: 'Gemini 1.5 Flash', experimentalFeatures: false, customInstructions: '' };
      
      if (appSettingsStr) {
        try {
          const appSettings = JSON.parse(appSettingsStr);
          finalSettings = {
            ...finalSettings,
            customMappingRules: appSettings.customMappingRules || [],
            bankShortCodes: appSettings.bankShortCodes,
            bankIgnoreWords: appSettings.bankIgnoreWords,
            paymentModes: appSettings.paymentModes,
            paymentChannels: appSettings.paymentChannels,
            ifscPrefixes: appSettings.ifscPrefixes
          };
        } catch (e) {
          console.error("Error merging app settings", e);
        }
      }

      let parsedData = await parseVoucherFile(file, selectedVoucherType, mapping, finalSettings, sourceBank, partyMasters, ledgerMasters);
      
      if (parsedData.length === 0) {
        throw new Error('AI could not detect any valid vouchers in the uploaded file.');
      }

      let prefix = 'VCH';
      if (selectedVoucherType === VoucherType.BankStatement) prefix = 'BANK';
      else if (selectedVoucherType === VoucherType.Purchase) prefix = 'PUR';
      else if (selectedVoucherType === VoucherType.Sales) prefix = 'SALE';
      else if (selectedVoucherType === VoucherType.Payment) prefix = 'PAY';
      else if (selectedVoucherType === VoucherType.Receipt) prefix = 'RCT';
      else if (selectedVoucherType === VoucherType.Journal) prefix = 'JRNL';
      else if (selectedVoucherType === VoucherType.Contra) prefix = 'CON';

      parsedData = parsedData.map((v, index) => ({
          ...v,
          tempImportId: `${prefix}-${(index + 1).toString().padStart(3, '0')}`
      }));
      
      setVouchers(parsedData);
      setStep('correction');
    } catch (error) {
      console.error("Error parsing file:", error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Next = (updatedVouchers: ParsedVoucher[]) => {
    setVouchers(updatedVouchers);
    setStep('summary');
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      const timestamp = new Date().toLocaleString();
      
      const vouchersWithLogs = vouchers.map(v => {
          const isExisting = allVouchers.some(av => av.id === v.id);
          const log: AuditLog = {
              id: `log-${Date.now()}-${Math.random()}`,
              action: isExisting ? 'Modified' : 'Created',
              timestamp,
              user: 'Current User',
              details: isExisting ? 'Voucher details updated after review' : 'Voucher posted via AI Import'
          };
          
          return {
              ...v,
              auditLogs: [...(v.auditLogs || []), log]
          };
      });

      setAllVouchers(prev => {
          const vouchersToUpdate = new Map(vouchersWithLogs.map(v => [v.id, v]));
          const updatedList = prev.map(p => {
              const updated = vouchersToUpdate.get(p.id);
              if (updated) {
                  vouchersToUpdate.delete(p.id);
                  return updated;
              }
              return p;
          });
          const newItems = Array.from(vouchersToUpdate.values());
          return [...updatedList, ...newItems];
      });
      
      localStorage.removeItem(DRAFT_KEY);
      
      addNotification({
        title: 'Vouchers Imported',
        message: `Successfully processed ${vouchers.length} vouchers via AI Import.`,
        type: 'Alert',
        link: 'vouchers'
      });
      
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleDuplicateVoucher = (voucher: ParsedVoucher) => {
    const timestamp = new Date().toLocaleString();
    const log: AuditLog = {
        id: `log-${Date.now()}`,
        action: 'Duplicated',
        timestamp,
        user: 'Current User',
        details: `Created from original voucher #${voucher.id}`
    };

    const duplicatedVoucher: ParsedVoucher = {
       ...voucher,
       id: `voucher-copy-${Date.now()}`,
       tempImportId: `${voucher.tempImportId}-COPY`,
       date: { ...voucher.date, value: new Date().toISOString().split('T')[0] },
       auditLogs: [log]
    };
    setVouchers([duplicatedVoucher]);
    setOriginView(view);
    setEntryStep('correction');
    setStep('correction');
    setView('import');
  };

  const handleDeleteVoucher = (id: string) => {
    setAllVouchers(prev => prev.filter(v => v.id !== id));
  };

  const handleBulkDeleteVouchers = (ids: string[]) => {
    setAllVouchers(prev => prev.filter(v => !ids.includes(v.id)));
  };

  const handleBulkEditVouchers = (ids: string[]) => {
    const vouchersToEdit = allVouchers.filter(v => ids.includes(v.id));
    if (vouchersToEdit.length > 0) {
      setVoucherType(vouchersToEdit[0].type);
    }
    setVouchers(vouchersToEdit);
    setOriginView(view);
    setEntryStep('correction');
    setStep('correction');
    setView('import');
  };

  const handleBulkMapVoucher = (ids: string[], mappings: Record<string, any>) => {
    setAllVouchers(prev => prev.map(v => {
      const mappingData = mappings[v.id];
      if (ids.includes(v.id) && mappingData) {
        let updatedV = { ...v };
        
        if (mappingData.type) {
            updatedV.type = mappingData.type;
        }
        
        if (mappingData.partyName) {
            updatedV.partyName = typeof mappingData.partyName === 'object' ? mappingData.partyName : { value: mappingData.partyName, confidence: Confidence.High };
        }
        
        const isWithdrawal = Number(v.withdrawalAmount?.value || 0) > 0;
        const isDeposit = Number(v.depositAmount?.value || 0) > 0;

        if (mappingData.ledger) {
            const ledgerVal = typeof mappingData.ledger === 'object' ? mappingData.ledger : { value: mappingData.ledger, confidence: Confidence.High };
            if (isWithdrawal) {
                updatedV.toAccount = ledgerVal;
                updatedV.fromAccount = updatedV.fromAccount || { value: 'Bank A/c', confidence: Confidence.High };
            } else if (isDeposit) {
                updatedV.fromAccount = ledgerVal;
                updatedV.toAccount = updatedV.toAccount || { value: 'Bank A/c', confidence: Confidence.High };
            } else {
                updatedV.ledger = ledgerVal;
            }
        }
        if (mappingData.paymentMode) {
            updatedV.paymentMode = typeof mappingData.paymentMode === 'object' ? mappingData.paymentMode : { value: mappingData.paymentMode, confidence: Confidence.High };
        }
        if (mappingData.referenceNo) {
            updatedV.referenceNo = typeof mappingData.referenceNo === 'object' ? mappingData.referenceNo : { value: mappingData.referenceNo, confidence: Confidence.High };
        }
        if (mappingData.narration) {
            updatedV.narration = typeof mappingData.narration === 'object' ? mappingData.narration : { value: mappingData.narration, confidence: Confidence.High };
        }
        if (mappingData.bankDetails) {
            updatedV.bankDetails = typeof mappingData.bankDetails === 'object' ? mappingData.bankDetails : { value: mappingData.bankDetails, confidence: Confidence.High };
        }
        if (mappingData.fromAccount) {
            updatedV.fromAccount = typeof mappingData.fromAccount === 'object' ? mappingData.fromAccount : { value: mappingData.fromAccount, confidence: Confidence.High };
        }
        if (mappingData.toAccount) {
            updatedV.toAccount = typeof mappingData.toAccount === 'object' ? mappingData.toAccount : { value: mappingData.toAccount, confidence: Confidence.High };
        }

        const isAutoMapped = mappingData.isAutoMap || false;
        const isConfirmedAIMap = mappingData.isConfirmedAIMap || false;
        
        const detailsParts = [];
        if (mappingData.type) detailsParts.push(`Type: ${mappingData.type}`);
        if (typeof mappingData.partyName === 'object' ? mappingData.partyName?.value : mappingData.partyName) detailsParts.push(`Party: ${typeof mappingData.partyName === 'object' ? mappingData.partyName?.value : mappingData.partyName}`);
        if (typeof mappingData.ledger === 'object' ? mappingData.ledger?.value : mappingData.ledger) detailsParts.push(`Ledger: ${typeof mappingData.ledger === 'object' ? mappingData.ledger?.value : mappingData.ledger}`);
        if (typeof mappingData.fromAccount === 'object' ? mappingData.fromAccount?.value : mappingData.fromAccount) detailsParts.push(`From: ${typeof mappingData.fromAccount === 'object' ? mappingData.fromAccount?.value : mappingData.fromAccount}`);
        if (typeof mappingData.toAccount === 'object' ? mappingData.toAccount?.value : mappingData.toAccount) detailsParts.push(`To: ${typeof mappingData.toAccount === 'object' ? mappingData.toAccount?.value : mappingData.toAccount}`);

        const newLog: AuditLog = {
          id: Math.random().toString(36).substr(2, 9),
          action: isAutoMapped ? 'AI Auto-Mapped' : (isConfirmedAIMap ? 'Confirmed AI Map' : 'Manual Map'),
          timestamp: new Date().toISOString(),
          user: isAutoMapped ? 'System AI' : 'User',
          details: `Mapped properties -> ${detailsParts.join(', ')}`
        };
        updatedV.auditLogs = [...(updatedV.auditLogs || []), newLog];

        return updatedV;
      }
      return v;
    }));
  };

  const handleViewVoucher = (voucher: ParsedVoucher) => {
    setEditingVoucher(voucher);
    setVoucherEntryActiveTab(typeof voucher.type === 'string' ? voucher.type.toLowerCase().replace(/ /g, '_') : 'journal');
    setView('voucher-entry');
  };

  const handleAddPartyMaster = (name: string) => {
    if (!partyMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newParty: any = {
            id: `p-${Date.now()}`,
            name,
            type: 'Vendor'
        };
        setPartyMasters((prev: any) => [...prev, newParty]);
    }
  };

  const handleAddLedgerMaster = (name: string) => {
    if (!ledgerMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newLedger: any = {
            id: `l-${Date.now()}`,
            name,
            group: 'Indirect Expenses'
        };
        setLedgerMasters((prev: any) => [...prev, newLedger]);
    }
  };

  const handleAddUomMaster = (name: string) => {
    if (!uomMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase() || String(m.symbol || '').toLowerCase() === name.toLowerCase())) {
        const newUom: any = {
            id: `u-${Date.now()}`,
            name,
            symbol: name.substring(0, 3).toUpperCase()
        };
        setUomMasters((prev: any) => [...prev, newUom]);
    }
  };

  const handleAddItemMaster = (name: string) => {
    if (!itemMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newItem: any = {
            id: `i-${Date.now()}`,
            name,
            taxRate: 18,
            uom: 'Nos'
        };
        setItemMasters((prev: any) => [...prev, newItem]);
    }
  };

  const handleSetPartyMasters = (masters: any[]) => setPartyMasters(masters);
  const handleSetLedgerMasters = (masters: any[]) => setLedgerMasters(masters);
  const handleSetItemMasters = (masters: any[]) => setItemMasters(masters);
  const handleSetUomMasters = (masters: any[]) => setUomMasters(masters);
  const handleSetGstMasters = (masters: any[]) => setGstMasters(masters);
  const handleSetBrandMasters = (masters: any[]) => setBrandMasters(masters);
  const handleSetCategoryMasters = (masters: any[]) => setCategoryMasters(masters);
  const handleSetGradeMasters = (masters: any[]) => setGradeMasters(masters);

  const handleImportVoucher = (type: VoucherType) => {
    setVoucherType(type);
    setOriginView(view);
    setView('import');
    setStep('upload');
  };

  const wrapStorage = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>) => (data: T | ((prev: T) => T)) => {
     setter(data);
     try {
        if (typeof data !== 'function') {
            localStorage.setItem(key, JSON.stringify(data));
        }
     } catch(e) {
        console.error('Storage quota exceeded or error:', e);
     }
  };

  // Sync activeSamples to fetch them if missing
  useEffect(() => {
    let active = true;
    const fetchMissingSamples = async () => {
      // Small delay to let initial localStorage settle
      await new Promise(r => setTimeout(r, 500));
      if (!active) return;
      
      const missingSamples = activeSamples.filter(id => {
        let hasData = false;
        if (['parties', 'vendors', 'partners'].includes(id)) hasData = (Array.isArray(partyMasters) ? partyMasters : []).some((m: any) => m.sampleSetId === id);
        else if (['ledgers', 'banks'].includes(id)) hasData = (Array.isArray(ledgerMasters) ? ledgerMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'items') hasData = (Array.isArray(itemMasters) ? itemMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'uoms') hasData = (Array.isArray(uomMasters) ? uomMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'bom') hasData = (Array.isArray(bomMasters) ? bomMasters : []).some((m: any) => m.sampleSetId === id);
        else if (['warehouses', 'locations'].includes(id)) hasData = (Array.isArray(locationMasters) ? locationMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'gst') hasData = (Array.isArray(gstMasters) ? gstMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'brands') hasData = (Array.isArray(brandMasters) ? brandMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'categories') hasData = (Array.isArray(categoryMasters) ? categoryMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'skus') hasData = (Array.isArray(skuMasters) ? skuMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'priceList') hasData = (Array.isArray(priceListMasters) ? priceListMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'weights') hasData = (Array.isArray(weightMasters) ? weightMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'volumes') hasData = (Array.isArray(volumeMasters) ? volumeMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'colors') hasData = (Array.isArray(colorMasters) ? colorMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'sizes') hasData = (Array.isArray(sizeMasters) ? sizeMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'variants') hasData = (Array.isArray(variantMasters) ? variantMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'dimensions') hasData = (Array.isArray(dimensionMasters) ? dimensionMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'stockGroups') hasData = (Array.isArray(stockGroupMasters) ? stockGroupMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'grades') hasData = (Array.isArray(gradeMasters) ? gradeMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'assertionCategories') hasData = (Array.isArray(assertionCategoryMasters) ? assertionCategoryMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'assertionCodes') hasData = (Array.isArray(assertionCodeMasters) ? assertionCodeMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'accountGroups') hasData = (Array.isArray(accountGroupMasters) ? accountGroupMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'costCenters') hasData = (Array.isArray(costCenterMasters) ? costCenterMasters : []).some((m: any) => m.sampleSetId === id);
        else if (id === 'contacts') hasData = (Array.isArray(contactMasters) ? contactMasters : []).some((m: any) => m.sampleSetId === id);
        else hasData = (Array.isArray(allVouchers) ? allVouchers : []).some((v: any) => v.sampleSetId === id);
        return !hasData;
      });

      if (missingSamples.length > 0) {
        setSyncProgress({ current: 0, total: missingSamples.length, label: 'Loading Demo Mode Data...' });
        let current = 0;
        for (const id of missingSamples) {
          try {
            // Apply a 5 second timeout to prevent indefinite hanging in case of network issues
            const fetchPromise = toggleSampleDataSet(id, true);
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000));
            await Promise.race([fetchPromise, timeoutPromise]);
          } catch(e) {
             console.error('Failed to load missing sample (timeout or error):', id);
          }
          if (!active) {
            // Still clear UI if component unmounted or effect reran during await
            setSyncProgress(null);
            break;
          }
          current++;
          setSyncProgress({ current, total: missingSamples.length, label: 'Loading Demo Mode Data...' });
        }
        setTimeout(() => {
          if (active) setSyncProgress(null);
        }, 1200);
      }
    };
    fetchMissingSamples();
    return () => { active = false; };
  }, [activeSamples]);

  async function toggleSampleDataSet(id: string, forceState?: boolean) {
    const currentlyActive = activeSamples.includes(id);
    const shouldEnable = forceState !== undefined ? forceState : !currentlyActive;

    if (shouldEnable === currentlyActive && forceState === undefined) return;

    setActiveSamples(prev => {
        if (shouldEnable) {
            return prev.includes(id) ? prev : [...prev, id];
        } else {
            return prev.filter(s => s !== id);
        }
    });

    if (!shouldEnable) {
        const filterFn = (prev: any[]) => prev.filter(m => m.sampleSetId !== id);
        switch (id) {
            case 'uoms': setUomMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'gst': setGstMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'brands': setBrandMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'categories': setCategoryMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'warehouses':
            case 'locations': setLocationMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'skus': setSkuMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'priceList': setPriceListMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'weights': setWeightMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'volumes': setVolumeMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'colors': setColorMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'sizes': setSizeMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'variants': setVariantMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'dimensions': setDimensionMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'stockGroups': setStockGroupMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'grades': setGradeMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'assertionCategories': setAssertionCategoryMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'assertionCodes': setAssertionCodeMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'items': setItemMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'bom': setBomMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'parties':
            case 'vendors':
            case 'partners': setPartyMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'accountGroups': setAccountGroupMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'ledgers':
            case 'banks': setLedgerMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'costCenters': setCostCenterMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'contacts': setContactMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            default: setAllVouchers(prev => prev.filter(m => m.sampleSetId !== id)); break;
        }
    } else {
        let navMeta: any = { reportIds: [], entryIds: [], itemMasterKeys: [] };
        try {
            const navMetaResponse = await fetch('/sample-data/navigation_meta.json');
            if (navMetaResponse.ok) {
                navMeta = await navMetaResponse.json();
            }
        } catch (e) {
            console.warn("Failed to load navigation_meta.json", e);
        }

        const reportIds = navMeta?.reportIds || [];
        const entryIds = navMeta?.entryIds || [];
        const itemMasterKeys = navMeta?.itemMasterKeys || [];

        let isReport = reportIds.includes(id);
        const isEntry = entryIds.includes(id);
        const isItemMaster = itemMasterKeys.includes(id) || id === 'gst';

        if (id.endsWith('_register') || (id.endsWith('_vouchers') && id !== 'demo_vouchers') || id === 'audit_trail' || id === 'day_book' || id === 'reconcile') {
             isReport = true;
        }

        const folder = isReport ? 'reports' : (isEntry ? 'dashboard' : (isItemMaster ? 'item-master' : 'ledger-master'));
        let filename = (isReport || isEntry) ? id : (id === 'gst' ? 'hsn' : id);
        
        // Adblocker evasion or safe names
        if (id === 'payment_register') filename = 'pay_reg_data';
        if (id === 'receipt_register') filename = 'rec_reg_data';
        if (id === 'contra_register') filename = 'con_reg_data';
        if (id === 'debit_note_register') filename = 'dr_note_reg_data';
        if (id === 'credit_note_register') filename = 'cr_note_reg_data';
        if (id === 'debit_note_entry') filename = 'dr_note_entry_data';
        if (id === 'credit_note_entry') filename = 'cr_note_entry_data';
        if (id === 'gstr1') filename = 'g1_data';
        if (id === 'gstr2b') filename = 'g2b_data';
        if (id === 'gstr3b') filename = 'g3b_data';
        if (id === 'gstr9') filename = 'g9_data';
        if (id === 'gstr9c') filename = 'g9c_data';
        if (id === 'accountGroups') filename = 'acc_groups';
        if (id === 'ledgers') filename = 'ldg_masters';
        
        try {
            const url = `/sample-data/${folder}/${filename}.json`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url} (Status: ${response.status})`);
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                 console.warn(`Sample data ${url} is not JSON (possibly a 404 fallback). Ignoring.`);
                 return;
            }
            const data = await response.json();
            if (!Array.isArray(data)) return;
            
            const sampleData = data.map((m: any) => ({ ...m, isSample: true, sampleSetId: id }));
            
            const merge = (prev: any[]) => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const map = new Map();
                safePrev.filter((m: any) => m.sampleSetId !== id).forEach(m => {
                    if (m && m.id) map.set(m.id, m);
                });
                sampleData.forEach((m: any) => {
                    if (m && m.id) map.set(m.id, m);
                });
                return Array.from(map.values());
            };
            
            switch (id) {
                case 'uoms': setUomMasters(merge); break;
                case 'gst': setGstMasters(merge); break;
                case 'brands': setBrandMasters(merge); break;
                case 'categories': setCategoryMasters(merge); break;
                case 'warehouses':
                case 'locations': setLocationMasters(merge); break;
                case 'skus': setSkuMasters(merge); break;
                case 'priceList': setPriceListMasters(merge); break;
                case 'weights': setWeightMasters(merge); break;
                case 'volumes': setVolumeMasters(merge); break;
                case 'colors': setColorMasters(merge); break;
                case 'sizes': setSizeMasters(merge); break;
                case 'variants': setVariantMasters(merge); break;
                case 'dimensions': setDimensionMasters(merge); break;
                case 'stockGroups': setStockGroupMasters(merge); break;
                case 'grades': setGradeMasters(merge); break;
                case 'assertionCategories': setAssertionCategoryMasters(merge); break;
                case 'assertionCodes': setAssertionCodeMasters(merge); break;
                case 'items': setItemMasters(merge); break;
                case 'bom': setBomMasters(merge); break;
                case 'parties':
                case 'vendors':
                case 'partners': setPartyMasters(merge); break;
                case 'accountGroups': setAccountGroupMasters(merge); break;
                case 'ledgers':
                case 'banks': setLedgerMasters(merge); break;
                case 'costCenters': setCostCenterMasters(merge); break;
                case 'contacts': setContactMasters(merge); break;
                default: setAllVouchers(merge); break;
            }
        } catch (e: any) {
            console.error(`Error loading sample data for '${id}' (url: /sample-data/${folder}/${filename}.json):`, e.message);
            // By skipping the filter here, the toggle remains visually ON even if there's no specific file.
        }
    }
  };

  useEffect(() => {
    // Initial fetch of system reference data
    const initSystemData = async () => {
      try {
        const { loadDefaultMappingRules } = await import('./services/mappingService');
        const { loadMatchingRules } = await import('./services/matching/rules');
        await loadDefaultMappingRules();
        await loadMatchingRules();
      } catch (e) {
        console.error("Failed to initialize system data", e);
      }
    };
    initSystemData();
  }, []);

  const renderContent = () => {
    if (view === 'ledger-master' || view === 'item-master') {
       return (
          <MasterView 
            key="master-view"
            initialSubTab={view === 'ledger-master' ? 'ledger' : 'item'}
            initialTab={activeMasterTab}
            partyMasters={partyMasters}
            ledgerMasters={ledgerMasters}
            contactMasters={contactMasters}
            locationMasters={locationMasters}
            costCenterMasters={costCenterMasters}
            accountGroupMasters={accountGroupMasters}
            setPartyMasters={handleSetPartyMasters}
            setLedgerMasters={handleSetLedgerMasters}
            setContactMasters={wrapStorage(CONTACT_MASTERS_KEY, setContactMasters)}
            setLocationMasters={wrapStorage(LOCATION_MASTERS_KEY, setLocationMasters)}
            setCostCenterMasters={wrapStorage(COST_CENTER_MASTERS_KEY, setCostCenterMasters)}
            setAccountGroupMasters={wrapStorage(ACCOUNT_GROUP_MASTERS_KEY, setAccountGroupMasters)}
            
            itemMasters={itemMasters}
            uomMasters={uomMasters}
            gstMasters={gstMasters}
            brandMasters={brandMasters}
            categoryMasters={categoryMasters}
            gradeMasters={gradeMasters}
            assertionCategoryMasters={assertionCategoryMasters}
            assertionCodeMasters={assertionCodeMasters}
            bomMasters={bomMasters}
            skuMasters={skuMasters}
            priceListMasters={priceListMasters}
            weightMasters={weightMasters}
            volumeMasters={volumeMasters}
            colorMasters={colorMasters}
            sizeMasters={sizeMasters}
            variantMasters={variantMasters}
            dimensionMasters={dimensionMasters}
            stockGroupMasters={stockGroupMasters}
            setItemMasters={handleSetItemMasters}
            setUomMasters={handleSetUomMasters}
            setGstMasters={handleSetGstMasters}
            setBrandMasters={handleSetBrandMasters}
            setCategoryMasters={handleSetCategoryMasters}
            setGradeMasters={handleSetGradeMasters}
            setAssertionCategoryMasters={wrapStorage(ASSERTION_CATEGORY_MASTERS_KEY, setAssertionCategoryMasters)}
            setAssertionCodeMasters={wrapStorage(ASSERTION_CODE_MASTERS_KEY, setAssertionCodeMasters)}
            setBomMasters={wrapStorage(BOM_MASTERS_KEY, setBomMasters)}
            setSkuMasters={wrapStorage('bharat_book_sku_masters', setSkuMasters)}
            setPriceListMasters={wrapStorage('bharat_book_price_list_masters', setPriceListMasters)}
            setWeightMasters={wrapStorage('bharat_book_weight_masters', setWeightMasters)}
            setVolumeMasters={wrapStorage('bharat_book_volume_masters', setVolumeMasters)}
            setColorMasters={wrapStorage('bharat_book_color_masters', setColorMasters)}
            setSizeMasters={wrapStorage('bharat_book_size_masters', setSizeMasters)}
            setVariantMasters={wrapStorage('bharat_book_variant_masters', setVariantMasters)}
            setDimensionMasters={wrapStorage('bharat_book_dimension_masters', setDimensionMasters)}
            setStockGroupMasters={wrapStorage(STOCK_GROUP_MASTERS_KEY, setStockGroupMasters)}
          />
       );
    }

    if (view === 'vouchers') {
        return (
            <LedgerReportView 
                vouchers={allVouchers}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                defaultTab={vouchersActiveTab}
                onTabChange={setVouchersActiveTab}
                onDuplicate={handleDuplicateVoucher}
                onDelete={handleDeleteVoucher}
                onBulkDelete={handleBulkDeleteVouchers}
                onBulkEdit={handleBulkEditVouchers}
                onBulkMap={handleBulkMapVoucher}
                onView={handleViewVoucher}
                onImportVoucher={handleImportVoucher}
                onNavigateToMasters={() => setView('ledger-master')}
                setVouchers={wrapStorage(ALL_VOUCHERS_KEY, setAllVouchers)}
            />
        );
    }

    if (view === 'bank') {
        return (
            <BankReportView 
                vouchers={allVouchers}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                onDuplicate={handleDuplicateVoucher}
                onDelete={handleDeleteVoucher}
                onBulkDelete={handleBulkDeleteVouchers}
                onBulkEdit={handleBulkEditVouchers}
                onMapVouchers={handleBulkMapVoucher}
                onView={handleViewVoucher}
                onImportVoucher={handleImportVoucher}
                onNavigateToMasters={() => setView('ledger-master')}
                onCreatePartyMaster={handleAddPartyMaster}
                onCreateLedgerMaster={handleAddLedgerMaster}
                defaultTab={bankActiveTab}
                onTabChange={setBankActiveTab}
                setVouchers={wrapStorage(ALL_VOUCHERS_KEY, setAllVouchers)}
            />
        );
    }

    if (view === 'dashboard') {
        return (
            <DashboardView 
                vouchers={allVouchers}
                onNavigateToView={(v) => setView(v as any)}
                defaultTab={dashboardActiveTab}
                onTabChange={setDashboardActiveTab}
            />
        );
    }

    if (view === 'reports') {
        return (
            <ReportsView 
                vouchers={allVouchers}
                defaultTab={reportActiveTab}
                onTabChange={setReportActiveTab}
                activeSamples={activeSamples}
            />
        );
    }

    if (view === 'gst-report') {
        return (
            <GSTReportView 
                vouchers={allVouchers}
                activeSamples={activeSamples}
                defaultTab={gstActiveTab}
                onTabChange={setGstActiveTab}
            />
        );
    }

    if (view === 'item-report') {
        return (
            <ItemReportView 
                vouchers={allVouchers}
                defaultTab={itemReportActiveTab}
                onTabChange={setItemReportActiveTab}
            />
        );
    }

    if (view === 'bulk-operation') {
        return (
            <SystemDecideView 
                itemMasters={itemMasters}
                setItemMasters={setItemMasters}
            />
        );
    }

    if (view === 'voucher-entry') {
        return (
            <VoucherEntryView 
              defaultType={voucherEntryActiveTab || 'sales'}
              initialVoucher={editingVoucher}
              itemMasters={itemMasters}
              ledgerMasters={ledgerMasters}
              partyMasters={partyMasters}
              vouchers={allVouchers}
              onUpdateItemMaster={(updatedItem) => {
                setItemMasters(prev => prev.map(i => i.name === updatedItem.name ? { ...i, ...updatedItem } : i));
              }}
              onAddItemMaster={(newItem) => {
                setItemMasters(prev => [...prev, newItem]);
              }}
              onSaveEntry={(savedEntry, isNew) => {
                const mappedVoucher = {
                    ...savedEntry,
                    date: { value: savedEntry.header?.voucherDate || '', confidence: 'High' },
                    partyName: { value: savedEntry.header?.partyName || '', confidence: 'High' },
                    ledger: { value: savedEntry.header?.cashBankAccount || savedEntry.rows?.[0]?.ledgerName || '', confidence: 'High' },
                    amount: { value: savedEntry.totals?.grandTotal?.toString() || savedEntry.totals?.subtotal?.toString() || '', confidence: 'High' },
                    narration: { value: savedEntry.header?.narration || '', confidence: 'High' },
                    isEdited: true
                };

                if (!isNew && editingVoucher) {
                    setAllVouchers(prev => prev.map(v => v.id === editingVoucher.id ? { ...v, ...mappedVoucher } : v));
                    setEditingVoucher(null);
                    setView('vouchers');
                } else {
                    setAllVouchers(prev => {
                        const existing = prev.findIndex(v => v.id === savedEntry.id);
                        if (existing >= 0) {
                            const newArr = [...prev];
                            newArr[existing] = { ...mappedVoucher, isManuallyEntered: true };
                            return newArr;
                        }
                        return [...prev, { ...mappedVoucher, isManuallyEntered: true }];
                    });
                }
                
                addNotification({
                  title: isNew ? 'Voucher Created' : 'Voucher Updated',
                  message: `${savedEntry.type || 'Voucher'} has been ${isNew ? 'saved' : 'updated'} successfully.`,
                  type: 'Message',
                  link: 'vouchers'
                });
              }}
              onDeleteEntry={(id) => {
                  setAllVouchers(prev => prev.filter(v => v.id !== id));
                  setEditingVoucher(null);
                  setView('vouchers');
              }}
              onOpenPrintSettings={() => {
                setSettingsActiveTab('invoiceprint');
                setView('settings');
              }}
            />
        );
    }

    if (view === 'inventory-entry') {
        return (
            <InventoryEntryView 
              defaultType={inventoryEntryActiveTab || 'stock_journal'}
              itemMasters={itemMasters}
              warehouseMasters={locationMasters}
              ledgerMasters={ledgerMasters}
              partyMasters={partyMasters}
              vouchers={allVouchers}
              onUpdateItemMaster={(updatedItem) => {
                setItemMasters(prev => prev.map(i => i.name === updatedItem.name ? { ...i, ...updatedItem } : i));
              }}
              onAddItemMaster={(newItem) => {
                setItemMasters(prev => [...prev, newItem]);
              }}
              onSaveEntry={(savedEntry, isNew) => {
                  const mappedVoucher = {
                      ...savedEntry,
                      date: { value: savedEntry.header?.voucherDate || '', confidence: 'High' },
                      isEdited: true,
                      isManuallyEntered: true
                  };
                  if (!isNew && editingVoucher) {
                      setAllVouchers(prev => prev.map(v => v.id === editingVoucher.id ? { ...v, ...mappedVoucher } : v));
                      setEditingVoucher(null);
                      setView('vouchers');
                  } else {
                      setAllVouchers(prev => {
                          const existing = prev.findIndex(v => v.id === savedEntry.id);
                          if (existing >= 0) {
                              const newArr = [...prev];
                              newArr[existing] = mappedVoucher;
                              return newArr;
                          }
                          return [...prev, mappedVoucher];
                      });
                  }
              }}
              onDeleteEntry={(id) => {
                  setAllVouchers(prev => prev.filter(v => v.id !== id));
              }}
              onOpenPrintSettings={() => {
                setSettingsActiveTab('invoiceprint');
                setView('settings');
              }}
            />
        );
    }

    const handleAppModeChange = (mode: string) => {
        if (mode === 'working') {
            setSyncProgress({ current: 0, total: 24, label: 'Switching to Live Mode... Cleaning up demo data' });
            let c = 0;
            const interval = setInterval(() => {
                c += 4;
                setSyncProgress({ current: Math.min(c, 24), total: 24, label: 'Switching to Live Mode... Cleaning up demo data' });
                if (c >= 24) {
                    clearInterval(interval);
                    setTimeout(() => setSyncProgress(null), 800);
                }
            }, 100);

            setActiveSamples([]);
            const clearSamples = (prev: any[]) => prev.filter(m => !m.sampleSetId && !m.isSample);
            setUomMasters(clearSamples);
            setGstMasters(clearSamples);
            setBrandMasters(clearSamples);
            setCategoryMasters(clearSamples);
            setLocationMasters(clearSamples);
            setSkuMasters(clearSamples);
            setPriceListMasters(clearSamples);
            setWeightMasters(clearSamples);
            setVolumeMasters(clearSamples);
            setColorMasters(clearSamples);
            setSizeMasters(clearSamples);
            setVariantMasters(clearSamples);
            setDimensionMasters(clearSamples);
            setStockGroupMasters(clearSamples);
            setGradeMasters(clearSamples);
            setAssertionCategoryMasters(clearSamples);
            setAssertionCodeMasters(clearSamples);
            setItemMasters(clearSamples);
            setBomMasters(clearSamples);
            setPartyMasters(clearSamples);
            setAccountGroupMasters(clearSamples);
            setLedgerMasters(clearSamples);
            setCostCenterMasters(clearSamples);
            setContactMasters(clearSamples);
            setAllVouchers(clearSamples);
            localStorage.removeItem('bharat_book_samples_hydrated_v19');
        } else if (mode === 'demo') {
            const defaultSamples = [
                'uoms', 'gst', 'brands', 'categories', 'warehouses', 'skus', 'priceList', 
                'weights', 'volumes', 'colors', 'sizes', 'variants', 'dimensions', 'stockGroups', 
                'grades', 'assertionCategories', 'assertionCodes', 
                'ledgers', 'items', 'bom', 'parties', 'vendors', 'accountGroups', 'banks', 'costCenters', 'contacts',
                'balance_sheet', 'profit_loss', 'cash_flow', 'bank_flow', 'trial_balance', 
                'sales_register', 'purchase_register', 'financial_vouchers', 'gstr1',
                'day_book', 'journal_register', 'debit_note_register', 'credit_note_register',
                'payment_register', 'receipt_register', 'contra_register', 'audit_trail',
                'item_vouchers', 'stock_summary', 'item_movement', 'low_stock', 'inventory_valuation',
                'bank_vouchers', 'raw_bank', 'auto_match', 'missing_master', 'unidentified', 'to_classify', 'reconcile',
                'demo_vouchers', 'sales_entry', 'purchase_entry', 'payment_entry', 'receipt_entry',
                'journal_entry', 'contra_entry', 'debit_note_entry', 'credit_note_entry', 'stock_journal_entry',
                'physical_stock_entry', 'consumption_entry', 'scrap_entry', 'transfer_entry',
                'rejections_in_entry', 'rejections_out_entry', 'invoice_dummy_data'
            ];
            setActiveSamples(defaultSamples);
        }
    };

    if (view === 'settings') {
        return (
            <SettingsView 
                setView={setView} 
                setActiveMasterTab={setActiveMasterTab} 
                setReportBankActiveTab={setReportActiveTab}
                defaultTab={settingsActiveTab}
                onTabChange={setSettingsActiveTab}
                ledgerMasters={ledgerMasters}
                onAppModeChange={handleAppModeChange}
            />
        );
    }

    if (view !== 'import') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 dark:bg-gray-800">
                    <InfoIcon className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest dark:text-gray-100">{view}</h2>
                <p className="text-gray-500 mt-2 max-w-sm dark:text-gray-400">This module is currently in development. Please use the "Import" tool to process your records.</p>
                <button 
                    onClick={() => setView('import')}
                    className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg"
                >
                    Return to Import
                </button>
            </div>
        );
    }

    return renderStep();
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <>
            {hasDraft && (
              <div className="max-w-5xl mx-auto mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center text-blue-800">
                  <InfoIcon className="mr-3" />
                  <span className="text-sm font-medium">You have an unsaved draft from a previous session.</span>
                </div>
                <div className="flex space-x-3">
                  <button onClick={clearDraft} className="text-xs text-gray-500 hover:text-gray-700 font-medium dark:text-gray-400">Discard</button>
                  <button onClick={resumeDraft} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                    <UndoIcon className="mr-2 text-sm" /> Resume Draft
                  </button>
                </div>
              </div>
            )}
            <Step1Upload 
              onNext={handleStep1Next} 
              isLoading={isLoading} 
              onCancel={resetFlow} 
              error={error} 
              clearError={() => setError(null)} 
              initialSettings={parsingSettings}
              initialVoucherType={voucherType}
              ledgerMasters={ledgerMasters}
            />
          </>
        );
      case 'correction':
        return (
              <Step2Correction 
                vouchers={vouchers} 
                setVouchers={setVouchers} 
                onBack={() => { 
                  if (entryStep === 'correction') {
                    if (originView && originView !== 'import') {
                      setView(originView);
                      setOriginView(null);
                    } else {
                      setView('dashboard');
                    }
                    resetFlow();
                  } else {
                    setStep('upload'); 
                    setError(null); 
                  }
                }} 
                onNext={handleStep2Next} 
                onSaveDraft={handleSaveDraft}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                onAddParty={handleAddPartyMaster}
                onAddLedger={handleAddLedgerMaster}
                uomMasters={uomMasters}
                itemMasters={itemMasters}
                onAddUom={handleAddUomMaster}
                onAddItem={handleAddItemMaster}
                voucherType={voucherType}
                allVouchers={allVouchers}
                onNavigateToMasters={() => setView('ledger-master')}
            />
        );
      case 'summary':
        return <Step3Summary vouchers={vouchers} voucherType={voucherType} onBack={() => setStep('correction')} onSubmit={handleSubmit} isLoading={isLoading} onCancel={resetFlow} />;
      case 'success':
        const isBankImportForSuccess = vouchers.some(v => v.origin === 'bank' || v.type === VoucherType.BankStatement);
        return (
          <SuccessScreen 
            vouchers={vouchers} 
            onDone={resetFlow} 
            onGoToDashboard={() => {
              setOriginView(null);
              setView('dashboard');
              resetFlow();
            }}
            onGoToVouchers={() => {
              setOriginView(null);
              setView(isBankImportForSuccess ? 'bank' : 'vouchers');
              resetFlow();
            }}
            onUndo={handleBulkDeleteVouchers}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  const handleViewChange = (newView: MainView) => {
    if (newView === 'import' && view !== 'import') {
      setOriginView(view);
    }
    
    // Default dashboard to overview
    if (newView === 'dashboard') {
      setDashboardActiveTab('overview');
    }

    // Apply routing defaults if configured
    const savedNav = localStorage.getItem('bharat_book_navigation_defaults');
    if (savedNav) {
      try {
        const { routing } = JSON.parse(savedNav);
        if (routing && routing[newView]) {
          const subPage = routing[newView];
          
          if (newView === 'reports') setReportActiveTab(subPage);
          else if (newView === 'bank') setBankActiveTab(subPage);
          else if (newView === 'ledger-master' || newView === 'item-master') setActiveMasterTab(subPage);
          else if (newView === 'dashboard') setDashboardActiveTab(subPage);
          else if (newView === 'vouchers') setVouchersActiveTab(subPage);
          else if (newView === 'gst-report') setGstActiveTab(subPage);
          else if (newView === 'item-report') setItemReportActiveTab(subPage);
          else if (newView === 'voucher-entry') setVoucherEntryActiveTab(subPage);
          else if (newView === 'inventory-entry') setInventoryEntryActiveTab(subPage);
          else if (newView === 'settings') setSettingsActiveTab(subPage);
        }
      } catch (e) {
        console.error("Error applying routing defaults", e);
      }
    }
    
    setView(newView);
  };

  return (
    <>
      {syncProgress && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800">
              <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{syncProgress.label}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-8">Please wait while the system synchronizes data.</p>
            
            <div className="w-full relative">
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden shadow-inner flex">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out flex-shrink-0" 
                  style={{ width: `${Math.min(100, Math.max(0, (syncProgress.current / syncProgress.total) * 100))}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                <span>{Math.round((syncProgress.current / syncProgress.total) * 100)}%</span>
                <span>{syncProgress.current} / {syncProgress.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <Layout
        pageTitle={view === 'import' ? "Import" : view.charAt(0).toUpperCase() + view.slice(1)}
        activeView={view}
        onViewChange={handleViewChange}
      >
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
