import React, { useState, useEffect, Component } from 'react';
import { RefreshCw, Lock, Shield, Check, Layers, ListTodo, FileSpreadsheet, Upload, Sliders, Settings, Cpu, Database, ShieldAlert, ClipboardCheck } from 'lucide-react';
import { Layout } from '../components/Layout/Layout';
import { ThemeProvider } from '../components/Layout/ThemeContext';
import { NotificationProvider, useNotifications } from '../context/NotificationContext';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { Step1Upload } from '../components/Operations/Import/Step1Upload';
import { Step1Processing } from '../components/Operations/Import/Step1Processing';
import { Step2Correction } from '../components/Operations/Import/Step2Correction';
import { Step3Summary } from '../components/Operations/Import/Step3Summary';
import { SuccessScreen } from '../components/Operations/Import/SuccessScreen';
import { processConfigurationImport } from '../services/import-engine/configurationImport';
import { MasterView } from '../components/Masters/MasterView';
import { LedgerReportView } from '../components/Reports/BankVouchers/LedgerReportView';
import { BankReportView } from '../components/Reports/BankVouchers/BankReportView';
import { DashboardView } from '../components/Dashboard/DashboardView';
import { ReportsView } from '../components/Reports/FinancialReport/FinancialReportView';
import { ItemReportView } from '../components/Reports/Items/ItemReportView';
import { VoucherEntryView } from '../components/Operations/VoucherEntry/VoucherEntryView';
import { InventoryEntryView } from '../components/Operations/InventoryEntry/InventoryEntryView';
import { SettingsView } from '../components/Settings/SettingsView';
import { HelpSettings } from '../components/Settings/HelpSettings';
import { SupportSettings } from '../components/Settings/SupportSettings';
import { GSTReportView } from '../components/Reports/GSTReport/GSTReportView';
import { AppStep, ParsedVoucher, VoucherType, ParsingSettings, MainView, AuditLog, Confidence, ColorMaster, SizeMaster, DimensionMaster, BomMaster } from './types';
import { parseVoucherFile } from '../services/aiService';
import { InfoIcon, UndoIcon, ErrorIcon } from '../components/icons/IconComponents';
import { ManagedUser, INITIAL_USERS } from '../components/Settings/UserSettings';
import { LoginScreen } from './LoginScreen';
import { getEffectivePolicy, isWithinAllowedHours, getCurrentUser, getVouchersPostedTodayCount } from '../utils/security';



const DRAFT_KEY = 'bharat_book_voucher_draft';

import { safeJsonParse, useStorageState } from './hooks/useStorageState';
import { useMasterState, ALL_VOUCHERS_KEY, PARTY_MASTERS_KEY, LEDGER_MASTERS_KEY, ITEM_MASTERS_KEY, UOM_MASTERS_KEY, GST_MASTERS_KEY, BRAND_MASTERS_KEY, CATEGORY_MASTERS_KEY, GRADE_MASTERS_KEY, ASSERTION_CATEGORY_MASTERS_KEY, ASSERTION_CODE_MASTERS_KEY, CONTACT_MASTERS_KEY, LOCATION_MASTERS_KEY, STOCK_GROUP_MASTERS_KEY, COST_CENTER_MASTERS_KEY, ACCOUNT_GROUP_MASTERS_KEY, BOM_MASTERS_KEY } from './hooks/useMasterState';

export const useAppLogic = () => {
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
        const savedNav = JSON.parse(saved);
        const { page, subPage, subSubPage, routing } = savedNav;
        if (page === viewName && subPage) {
          if (viewName === 'settings' && subPage === 'ui' && subSubPage) {
            return `ui_${subSubPage}`;
          }
          if (viewName === 'settings' && subPage === 'users' && subSubPage) {
            localStorage.setItem('bharat_book_users_subtab_override', subSubPage);
          }
          if (viewName === 'settings' && subPage === 'support' && subSubPage) {
            localStorage.setItem('bharat_book_support_subtab_override', subSubPage);
          }
          if (viewName === 'settings' && subPage === 'about' && subSubPage) {
            localStorage.setItem('bharat_book_about_subtab_override', subSubPage);
          }
          if (viewName === 'settings' && subPage === 'vouchernumbering' && subSubPage) {
            localStorage.setItem('bharat_book_vouchernumbering_subtab_override', subSubPage);
          }
          return subPage;
        }
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
  const [taxReportActiveTab, setTaxReportActiveTab] = useState<string | null>(() => getSubPageForView('tax-report'));
  const [itemReportActiveTab, setItemReportActiveTab] = useState<string | null>(() => getSubPageForView('item-report'));
  const [bulkOperationActiveTab, setBulkOperationActiveTab] = useState<string | null>(() => getSubPageForView('bulk-operation'));
  const [voucherEntryActiveTab, setVoucherEntryActiveTab] = useState<string | null>(() => getSubPageForView('voucher-entry'));
  const [inventoryEntryActiveTab, setInventoryEntryActiveTab] = useState<string | null>(() => getSubPageForView('inventory-entry'));
  const [settingsActiveTab, setSettingsActiveTab] = useState<string | null>(() => getSubPageForView('settings'));
  const [supportActiveTab, setSupportActiveTab] = useState<string | null>(() => getSubPageForView('support'));
    
  useEffect(() => {
    if (view !== 'ledger-master' && view !== 'item-master' && view !== 'settings') {
      setActiveMasterTab(null);
    }
  }, [view]);
  const { language } = useLanguage();
  const [uploadSubStep, setUploadSubStep] = useState<'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings'>('type');
  const [correctionSubStep, setCorrectionSubStep] = useState<'unmap' | 'missing' | 'automate'>('automate');
  const [importCategory, setImportCategory] = useState<'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other'>('voucher');

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
    const masterState = useMasterState(allVouchers, setSyncProgress, setAllVouchers);
  const { toggleSampleDataSet, partyMasters, setPartyMasters, ledgerMasters, setLedgerMasters, itemMasters, setItemMasters, uomMasters, setUomMasters, gstMasters, setGstMasters, brandMasters, setBrandMasters, categoryMasters, setCategoryMasters, gradeMasters, setGradeMasters, assertionCategoryMasters, setAssertionCategoryMasters, assertionCodeMasters, setAssertionCodeMasters, contactMasters, setContactMasters, skuMasters, setSkuMasters, priceListMasters, setPriceListMasters, weightMasters, setWeightMasters, volumeMasters, setVolumeMasters, colorMasters, setColorMasters, sizeMasters, setSizeMasters, variantMasters, setVariantMasters, dimensionMasters, setDimensionMasters, locationMasters, setLocationMasters, bomMasters, setBomMasters, stockGroupMasters, setStockGroupMasters, costCenterMasters, setCostCenterMasters, accountGroupMasters, setAccountGroupMasters, customMasters, setCustomMasters, activeSamples, setActiveSamples, handleAddPartyMaster, handleAddLedgerMaster, handleAddUomMaster, handleAddItemMaster, handleSetPartyMasters, handleSetLedgerMasters, handleSetItemMasters, handleSetUomMasters, handleSetGstMasters, handleSetBrandMasters, handleSetCategoryMasters, handleSetGradeMasters } = masterState;
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingMapping, setPendingMapping] = useState<Record<string, string> | undefined>(undefined);
  const [pendingSourceBank, setPendingSourceBank] = useState<string | undefined>(undefined);
  
                      
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

                
            


  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setHasDraft(true);
    }
  }, []);

  const resetFlow = () => {
    setStep('upload');
    setUploadSubStep('type');
    setCorrectionSubStep('automate');
    setEntryStep('upload');
    setVouchers([]);
    setIsLoading(false);
    setError(null);
    setPendingFile(null);
    setPendingMapping(undefined);
    setPendingSourceBank(undefined);
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

  const handleStep1Next = (file: File, selectedVoucherType: VoucherType, mapping?: Record<string, string>, settings?: ParsingSettings, sourceBank?: string) => {
    setPendingFile(file);
    setPendingMapping(mapping);
    setVoucherType(selectedVoucherType);
    if (settings) setParsingSettings(settings);
    setPendingSourceBank(sourceBank);
    
    if (importCategory === 'tax_related' || importCategory === 'settings') {
      setVouchers([]);
      setStep('summary');
    } else {
      setStep('processing');
    }
  };

  const handleStep2Next = (updatedVouchers: ParsedVoucher[]) => {
    setVouchers(updatedVouchers);
    setStep('summary');
  };

  const handleSubmit = () => {
    const policy = getEffectivePolicy();

    // 1. Daily voucher limit check
    if (policy.dailyVoucherLimit > 0) {
      const postedCount = getVouchersPostedTodayCount(allVouchers);
      const newVouchersCount = vouchers.filter(v => !allVouchers.some(av => av.id === v.id)).length;
      if (postedCount + newVouchersCount > policy.dailyVoucherLimit) {
        addNotification({
          title: 'Daily Limit Exceeded',
          message: `Your active group security policy restricts posts to max ${policy.dailyVoucherLimit} daily vouchers. (Today: ${postedCount}, attempted: ${newVouchersCount})`,
          type: 'Alert'
        });
        return;
      }
    }

    // 2. Max transaction amount check
    if (policy.maxTransactionAmount > 0) {
      const exceedingVoucher = vouchers.find(v => {
        const amt = parseFloat(String(v.amount?.value || '0').replace(/[^0-9.]/g, ''));
        return amt > policy.maxTransactionAmount;
      });
      if (exceedingVoucher) {
        const formattedLimit = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(policy.maxTransactionAmount);
        const formattedAmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(String(exceedingVoucher.amount?.value || '0').replace(/[^0-9.]/g, '')));
        addNotification({
          title: 'Transaction Limit Violated',
          message: `Voucher amount (${formattedAmt}) exceeds single transaction limit (${formattedLimit}) configured in your group rules.`,
          type: 'Alert'
        });
        return;
      }
    }

    setIsLoading(true);

    if (importCategory === 'settings' && pendingFile) {
      processConfigurationImport(pendingFile)
        .then(() => {
          addNotification({
            title: 'Document Uploaded',
            message: `Successfully uploaded and applied configuration document.`,
            type: 'Alert'
          });
          setIsLoading(false);
          setStep('success');
        })
        .catch((error) => {
          console.error("Failed to parse configuration file:", error);
          setIsLoading(false);
          addNotification({
            title: 'Upload Failed',
            message: `Could not parse the configuration file.`,
            type: 'Alert'
          });
        });
      return;
    }

    setTimeout(() => {
      const timestamp = new Date().toLocaleString();
      
      const vouchersWithLogs = vouchers.map(v => {
          const isExisting = allVouchers.some(av => av.id === v.id);
          const log: AuditLog = {
              id: `log-${Date.now()}-${Math.random()}`,
              action: isExisting ? 'Modified' : 'Created',
                        user: 'Current User',
                        timestamp: new Date().toISOString(),
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
        title: (importCategory === 'tax_related' || importCategory === 'settings') ? 'Document Uploaded' : 'Vouchers Imported',
        message: (importCategory === 'tax_related' || importCategory === 'settings') ? `Successfully uploaded document.` : `Successfully processed ${vouchers.length} vouchers via AI Import.`,
        type: 'Alert',
        link: (importCategory === 'tax_related' || importCategory === 'settings') ? undefined : 'vouchers'
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
            user: 'Current User',
            timestamp: new Date().toISOString(),
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

  
  const handleViewChange = (newView: MainView, settingsTab?: string, usersSubTab?: string) => {
    if (newView === 'import' && view !== 'import') {
      setOriginView(view);
    }
    
    // Default dashboard to overview
    if (newView === 'dashboard') {
      setDashboardActiveTab('overview');
    }

    if (newView === 'settings' && settingsTab) {
      setSettingsActiveTab(settingsTab);
      if (settingsTab === 'users' && usersSubTab) {
        localStorage.setItem('bharat_book_users_subtab_override', usersSubTab);
        setTimeout(() => {
           window.dispatchEvent(new Event('bharat_book_users_subtab_trigger'));
        }, 50);
      } else if (settingsTab === 'support' && usersSubTab) {
        localStorage.setItem('bharat_book_support_subtab_override', usersSubTab);
        setTimeout(() => {
           window.dispatchEvent(new Event('bharat_book_support_subtab_trigger'));
        }, 50);
      }
    } else if (newView === 'support' && settingsTab) {
      setSupportActiveTab(settingsTab);
    } else {
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
            else if (newView === 'tax-report') setTaxReportActiveTab(subPage);
            else if (newView === 'item-report') setItemReportActiveTab(subPage);
            else if (newView === 'voucher-entry') setVoucherEntryActiveTab(subPage);
            else if (newView === 'inventory-entry') setInventoryEntryActiveTab(subPage);
            else if (newView === 'settings') setSettingsActiveTab(subPage);
            else if (newView === 'support') setSupportActiveTab(subPage);
          }
        } catch (e) {
          console.error("Error applying routing defaults", e);
        }
      }
    }
    
    setView(newView);
  };


  useEffect(() => {
    // Initial fetch of system reference data
    const initSystemData = async () => {
      try {
        const { loadDefaultMappingRules } = await import('../services/mappingService');
        const { loadMatchingRules } = await import('../services/import-engine/phase4-enhancers/matching/rules');
        await loadDefaultMappingRules();
        await loadMatchingRules();
      } catch (e) {
        console.error("Failed to initialize system data", e);
      }
    };
    initSystemData();
  }, []);

  return {
    view,
    setView,
    originView,
    setOriginView,
    getSubPageForView,
    activeMasterTab,
    setActiveMasterTab,
    reportActiveTab,
    setReportActiveTab,
    bankActiveTab,
    setBankActiveTab,
    dashboardActiveTab,
    setDashboardActiveTab,
    vouchersActiveTab,
    setVouchersActiveTab,
    gstActiveTab,
    setGstActiveTab,
    taxReportActiveTab,
    setTaxReportActiveTab,
    itemReportActiveTab,
    setItemReportActiveTab,
    bulkOperationActiveTab,
    setBulkOperationActiveTab,
    voucherEntryActiveTab,
    setVoucherEntryActiveTab,
    inventoryEntryActiveTab,
    setInventoryEntryActiveTab,
    settingsActiveTab,
    setSettingsActiveTab,
    supportActiveTab,
    setSupportActiveTab,
    uploadSubStep,
    setUploadSubStep,
    correctionSubStep,
    setCorrectionSubStep,
    importCategory,
    setImportCategory,
    step,
    setStep,
    entryStep,
    setEntryStep,
    vouchers,
    setVouchers,
    editingVoucher,
    setEditingVoucher,
    allVouchers,
    setAllVouchers,
    voucherType,
    setVoucherType,
    parsingSettings,
    setParsingSettings,
    isLoading,
    setIsLoading,
    error,
    setError,
    hasDraft,
    setHasDraft,
    syncProgress,
    setSyncProgress,
    pendingFile,
    setPendingFile,
    pendingMapping,
    setPendingMapping,
    pendingSourceBank,
    setPendingSourceBank,
    resetFlow,
    handleSaveDraft,
    resumeDraft,
    clearDraft,
    handleStep1Next,
    handleStep2Next,
    handleSubmit,
    handleDuplicateVoucher,
    handleDeleteVoucher,
    handleBulkDeleteVouchers,
    handleBulkEditVouchers,
    handleBulkMapVoucher,
    handleViewVoucher,
    handleImportVoucher,
    wrapStorage,
    handleViewChange,
    ...masterState,
  };
};

