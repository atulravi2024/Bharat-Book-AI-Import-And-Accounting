
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout/Layout';
import { ThemeProvider } from './components/Layout/ThemeContext';
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
import { InfoIcon, UndoIcon } from './components/icons/IconComponents';

const DRAFT_KEY = 'bharat_book_voucher_draft';
const PARTY_MASTERS_KEY = 'bharat_book_party_masters';
const LEDGER_MASTERS_KEY = 'bharat_book_ledger_masters';
const ITEM_MASTERS_KEY = 'bharat_book_item_masters';
const UOM_MASTERS_KEY = 'bharat_book_uom_masters';
const ALL_VOUCHERS_KEY = 'bharat_book_all_vouchers';
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

const App: React.FC = () => {
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
  const [activeSamples, setActiveSamples] = useState<string[]>(() => {
    return safeJsonParse(localStorage.getItem('bharat_book_active_samples'), ['ledgers', 'items', 'parties']);
  });
  
  useEffect(() => {
    localStorage.setItem('bharat_book_active_samples', JSON.stringify(activeSamples));
  }, [activeSamples]);
  
  useEffect(() => {
    if (view !== 'ledger-master' && view !== 'item-master' && view !== 'settings') {
      setActiveMasterTab(null);
    }
  }, [view]);
  const [step, setStep] = useState<AppStep>('upload');
  const [entryStep, setEntryStep] = useState<AppStep>('upload');
  const [vouchers, setVouchers] = useState<ParsedVoucher[]>([]);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);
  const [allVouchers, setAllVouchers] = useState<ParsedVoucher[]>(() => {
    return safeJsonParse(localStorage.getItem(ALL_VOUCHERS_KEY), [] as ParsedVoucher[]);
  });
  const [voucherType, setVoucherType] = useState<VoucherType>(VoucherType.Purchase);
  const [parsingSettings, setParsingSettings] = useState<ParsingSettings | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  
  const [partyMasters, setPartyMasters] = useState(() => safeJsonParse(localStorage.getItem(PARTY_MASTERS_KEY), []));

  const [ledgerMasters, setLedgerMasters] = useState(() => safeJsonParse(localStorage.getItem(LEDGER_MASTERS_KEY), []));

  const [itemMasters, setItemMasters] = useState(() => safeJsonParse(localStorage.getItem(ITEM_MASTERS_KEY), []));

  const [uomMasters, setUomMasters] = useState(() => safeJsonParse(localStorage.getItem(UOM_MASTERS_KEY), []));

  const [gstMasters, setGstMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(GST_MASTERS_KEY), []));

  const [brandMasters, setBrandMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(BRAND_MASTERS_KEY), []));

  const [categoryMasters, setCategoryMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(CATEGORY_MASTERS_KEY), []));

  const [gradeMasters, setGradeMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(GRADE_MASTERS_KEY), []));

  const [assertionCategoryMasters, setAssertionCategoryMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(ASSERTION_CATEGORY_MASTERS_KEY), []));

  const [assertionCodeMasters, setAssertionCodeMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(ASSERTION_CODE_MASTERS_KEY), []));

  const [contactMasters, setContactMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(CONTACT_MASTERS_KEY), []));

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
        const hasLoaded = localStorage.getItem('bharat_book_samples_hydrated_v6');
        if (!hasLoaded) {
            for (const id of activeSamples) {
                await toggleSampleDataSet(id, true);
            }
            localStorage.setItem('bharat_book_samples_hydrated_v6', 'true');
        }
    };
    reloadSamples();
  }, []);

  const [skuMasters, setSkuMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem('bharat_book_sku_masters'), []));

  const [priceListMasters, setPriceListMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem('bharat_book_price_list_masters'), []));

  const [weightMasters, setWeightMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem('bharat_book_weight_masters'), []));

  const [volumeMasters, setVolumeMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem('bharat_book_volume_masters'), []));

  const [colorMasters, setColorMasters] = useState<ColorMaster[]>(() => safeJsonParse(localStorage.getItem('bharat_book_color_masters'), [] as ColorMaster[]));

  const [sizeMasters, setSizeMasters] = useState<SizeMaster[]>(() => safeJsonParse(localStorage.getItem('bharat_book_size_masters'), [] as SizeMaster[]));

  const [variantMasters, setVariantMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem('bharat_book_variant_masters'), []));

  const [dimensionMasters, setDimensionMasters] = useState<DimensionMaster[]>(() => safeJsonParse(localStorage.getItem('bharat_book_dimension_masters'), [] as DimensionMaster[]));

  useEffect(() => {
    localStorage.setItem('bharat_book_sku_masters', JSON.stringify(skuMasters));
  }, [skuMasters]);

  useEffect(() => {
    localStorage.setItem('bharat_book_price_list_masters', JSON.stringify(priceListMasters));
  }, [priceListMasters]);

  useEffect(() => {
    localStorage.setItem('bharat_book_weight_masters', JSON.stringify(weightMasters));
  }, [weightMasters]);

  useEffect(() => {
    localStorage.setItem('bharat_book_volume_masters', JSON.stringify(volumeMasters));
  }, [volumeMasters]);

  useEffect(() => {
    localStorage.setItem('bharat_book_color_masters', JSON.stringify(colorMasters));
  }, [colorMasters]);

  useEffect(() => {
    localStorage.setItem('bharat_book_size_masters', JSON.stringify(sizeMasters));
  }, [sizeMasters]);

  useEffect(() => {
    localStorage.setItem('bharat_book_variant_masters', JSON.stringify(variantMasters));
  }, [variantMasters]);

  useEffect(() => {
    localStorage.setItem('bharat_book_dimension_masters', JSON.stringify(dimensionMasters));
  }, [dimensionMasters]);

  const [locationMasters, setLocationMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(LOCATION_MASTERS_KEY), []));

  const [bomMasters, setBomMasters] = useState<BomMaster[]>(() => safeJsonParse(localStorage.getItem(BOM_MASTERS_KEY), []));

  const [stockGroupMasters, setStockGroupMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(STOCK_GROUP_MASTERS_KEY), []));

  const [costCenterMasters, setCostCenterMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(COST_CENTER_MASTERS_KEY), []));

  const [accountGroupMasters, setAccountGroupMasters] = useState<any[]>(() => safeJsonParse(localStorage.getItem(ACCOUNT_GROUP_MASTERS_KEY), []));

  useEffect(() => {
    localStorage.setItem(PARTY_MASTERS_KEY, JSON.stringify(partyMasters));
  }, [partyMasters]);

  useEffect(() => {
    localStorage.setItem(LEDGER_MASTERS_KEY, JSON.stringify(ledgerMasters));
  }, [ledgerMasters]);

  useEffect(() => {
    localStorage.setItem(ITEM_MASTERS_KEY, JSON.stringify(itemMasters));
  }, [itemMasters]);

  useEffect(() => {
    localStorage.setItem(UOM_MASTERS_KEY, JSON.stringify(uomMasters));
  }, [uomMasters]);

  useEffect(() => {
    localStorage.setItem(GST_MASTERS_KEY, JSON.stringify(gstMasters));
  }, [gstMasters]);

  useEffect(() => {
    localStorage.setItem(BRAND_MASTERS_KEY, JSON.stringify(brandMasters));
  }, [brandMasters]);

  useEffect(() => {
    localStorage.setItem(CATEGORY_MASTERS_KEY, JSON.stringify(categoryMasters));
  }, [categoryMasters]);

  useEffect(() => {
    localStorage.setItem(GRADE_MASTERS_KEY, JSON.stringify(gradeMasters));
  }, [gradeMasters]);

  useEffect(() => {
    localStorage.setItem(ASSERTION_CATEGORY_MASTERS_KEY, JSON.stringify(assertionCategoryMasters));
  }, [assertionCategoryMasters]);

  useEffect(() => {
    localStorage.setItem(ASSERTION_CODE_MASTERS_KEY, JSON.stringify(assertionCodeMasters));
  }, [assertionCodeMasters]);

  useEffect(() => {
    localStorage.setItem(CONTACT_MASTERS_KEY, JSON.stringify(contactMasters));
  }, [contactMasters]);

  useEffect(() => {
    localStorage.setItem(LOCATION_MASTERS_KEY, JSON.stringify(locationMasters));
  }, [locationMasters]);

  useEffect(() => {
    localStorage.setItem(BOM_MASTERS_KEY, JSON.stringify(bomMasters));
  }, [bomMasters]);

  useEffect(() => {
    localStorage.setItem(STOCK_GROUP_MASTERS_KEY, JSON.stringify(stockGroupMasters));
  }, [stockGroupMasters]);

  useEffect(() => {
    localStorage.setItem(COST_CENTER_MASTERS_KEY, JSON.stringify(costCenterMasters));
  }, [costCenterMasters]);

  useEffect(() => {
    localStorage.setItem(ACCOUNT_GROUP_MASTERS_KEY, JSON.stringify(accountGroupMasters));
  }, [accountGroupMasters]);

  useEffect(() => {
    localStorage.setItem(ALL_VOUCHERS_KEY, JSON.stringify(allVouchers));
  }, [allVouchers]);

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
    setVoucherEntryActiveTab(typeof voucher.type === 'string' ? voucher.type.toLowerCase().replace(' ', '_') : 'journal');
    setView('voucher-entry');
  };

  const handleAddPartyMaster = (name: string) => {
    if (!partyMasters.some((m: any) => m.name.toLowerCase() === name.toLowerCase())) {
        const newParty: any = {
            id: `p-${Date.now()}`,
            name,
            type: 'Vendor'
        };
        setPartyMasters((prev: any) => [...prev, newParty]);
    }
  };

  const handleAddLedgerMaster = (name: string) => {
    if (!ledgerMasters.some((m: any) => m.name.toLowerCase() === name.toLowerCase())) {
        const newLedger: any = {
            id: `l-${Date.now()}`,
            name,
            group: 'Indirect Expenses'
        };
        setLedgerMasters((prev: any) => [...prev, newLedger]);
    }
  };

  const handleAddUomMaster = (name: string) => {
    if (!uomMasters.some((m: any) => m.name.toLowerCase() === name.toLowerCase() || m.symbol.toLowerCase() === name.toLowerCase())) {
        const newUom: any = {
            id: `u-${Date.now()}`,
            name,
            symbol: name.substring(0, 3).toUpperCase()
        };
        setUomMasters((prev: any) => [...prev, newUom]);
    }
  };

  const handleAddItemMaster = (name: string) => {
    if (!itemMasters.some((m: any) => m.name.toLowerCase() === name.toLowerCase())) {
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

  const toggleSampleDataSet = async (id: string, forceState?: boolean) => {
    const sampleIds = [
      'uoms', 'gst', 'brands', 'categories', 'warehouses', 'skus', 'priceList', 'weights', 'volumes', 
      'colors', 'sizes', 'variants', 'dimensions', 'stockGroups', 'grades', 'assertionCategories', 
      'assertionCodes', 'items', 'bom', 'bom_advanced', 'bom_pharma', 'parties', 'vendors', 'accountGroups', 'ledgers', 'banks', 'costCenters', 
      'contacts', 'vouchers', 'financial_vouchers', 'item_vouchers', 'bank_vouchers', 'raw_bank', 'auto_match', 'missing_master', 'unidentified', 'to_classify', 'reconcile',
      'sales_register', 'purchase_register', 'day_book', 'journal_register', 'debit_note_register', 'credit_note_register',
      'stock_summary', 'item_movement', 'low_stock', 'inventory_valuation',
      'balance_sheet', 'profit_loss', 'cash_flow', 'bank_flow', 'trial_balance', 'gstr1',
      'sales_entry', 'purchase_entry', 'payment_entry', 'receipt_entry', 'journal_entry', 'contra_entry', 'debit_note_entry', 'credit_note_entry',
      'stock_journal_entry', 'physical_stock_entry', 'consumption_entry', 'scrap_entry', 'transfer_entry', 'rejections_in_entry', 'rejections_out_entry'
    ];

    if (!sampleIds.includes(id)) {
        console.warn(`No sample data loader for id: ${id}`);
        return;
    }

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
            case 'warehouses': setLocationMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
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
            case 'bom':
            case 'bom_advanced':
            case 'bom_pharma': setBomMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'parties':
            case 'vendors': setPartyMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'accountGroups': setAccountGroupMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'ledgers':
            case 'banks': setLedgerMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'costCenters': setCostCenterMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'contacts': setContactMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            default: setAllVouchers(prev => prev.filter(m => m.sampleSetId !== id)); break;
        }
    } else {
        const reportIds = ['vouchers', 'financial_vouchers', 'item_vouchers', 'bank_vouchers', 'raw_bank', 'auto_match', 'missing_master', 'unidentified', 'to_classify', 'reconcile', 'sales_register', 'purchase_register', 'day_book', 'journal_register', 'debit_note_register', 'credit_note_register', 'stock_summary', 'item_movement', 'low_stock', 'inventory_valuation', 'balance_sheet', 'profit_loss', 'cash_flow', 'bank_flow', 'trial_balance', 'gstr1'];
        const entryIds = ['sales_entry', 'purchase_entry', 'payment_entry', 'receipt_entry', 'journal_entry', 'contra_entry', 'debit_note_entry', 'credit_note_entry', 'stock_journal_entry', 'physical_stock_entry', 'consumption_entry', 'scrap_entry', 'transfer_entry', 'rejections_in_entry', 'rejections_out_entry'];
        const folder = reportIds.includes(id) ? 'reports' : (entryIds.includes(id) ? 'entries' :
                     (['items', 'bom', 'bom_advanced', 'bom_pharma', 'weights', 'volumes', 'colors', 'sizes', 'variants', 'dimensions', 'skus', 'priceList', 'uoms', 'gst', 'brands', 'categories', 'warehouses', 'stockGroups', 'grades', 'assertionCategories', 'assertionCodes'].includes(id) 
                        ? 'item-master' 
                        : 'ledger-master'));
        const filename = (reportIds.includes(id) || entryIds.includes(id)) ? id : (id === 'gst' ? 'hsn' : id);
        
        try {
            const response = await fetch(`/sample-data/${folder}/${filename}.json`);
            if (!response.ok) throw new Error(`Failed to load ${id} sample data`);
            const data = await response.json();
            if (!Array.isArray(data)) return;
            
            const sampleData = data.map((m: any) => ({ ...m, isSample: true, sampleSetId: id }));
            
            const merge = (prev: any[]) => {
                const map = new Map();
                prev.filter((m: any) => m.sampleSetId !== id).forEach(m => {
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
                case 'warehouses': setLocationMasters(merge); break;
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
                case 'bom':
                case 'bom_advanced':
                case 'bom_pharma': setBomMasters(merge); break;
                case 'parties':
                case 'vendors': setPartyMasters(merge); break;
                case 'accountGroups': setAccountGroupMasters(merge); break;
                case 'ledgers':
                case 'banks': setLedgerMasters(merge); break;
                case 'costCenters': setCostCenterMasters(merge); break;
                case 'contacts': setContactMasters(merge); break;
                default: setAllVouchers(merge); break;
            }
        } catch (e) {
            console.error("Error loading sample data", e);
            setActiveSamples(prev => prev.filter(s => s !== id));
        }
    }
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
                } else {
                    setAllVouchers(prev => [...prev, { ...mappedVoucher, isManuallyEntered: true }]);
                }
                setEditingVoucher(null);
                setView('vouchers'); // Optional: go back to ledger report after save
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
              onUpdateItemMaster={(updatedItem) => {
                setItemMasters(prev => prev.map(i => i.name === updatedItem.name ? { ...i, ...updatedItem } : i));
              }}
              onAddItemMaster={(newItem) => {
                setItemMasters(prev => [...prev, newItem]);
              }}
              onOpenPrintSettings={() => {
                setSettingsActiveTab('invoiceprint');
                setView('settings');
              }}
            />
        );
    }

    if (view === 'settings') {
        return (
            <SettingsView 
                setView={setView} 
                setActiveMasterTab={setActiveMasterTab} 
                activeSamples={activeSamples}
                onToggleSample={toggleSampleDataSet}
                setReportBankActiveTab={setReportActiveTab}
                defaultTab={settingsActiveTab}
                onTabChange={setSettingsActiveTab}
                ledgerMasters={ledgerMasters}
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
    <ThemeProvider>
      <Layout
        pageTitle={view === 'import' ? "Import" : view.charAt(0).toUpperCase() + view.slice(1)}
        activeView={view}
        onViewChange={handleViewChange}
      >
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
};

export default App;
