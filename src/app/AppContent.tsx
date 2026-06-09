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
import { HelpSettings } from "../components/Settings/SupportSystemSettings/HelpSettings";
import { SupportSettings } from "../components/Settings/SupportSystemSettings/SupportSettings";
import { GSTReportView } from '../components/Reports/GSTReport/GSTReportView';
import { AppStep, ParsedVoucher, VoucherType, ParsingSettings, MainView, AuditLog, Confidence, ColorMaster, SizeMaster, DimensionMaster, BomMaster } from './types';
import { parseVoucherFile } from '../services/aiService';
import { InfoIcon, UndoIcon, ErrorIcon } from '../components/icons/IconComponents';
import { ManagedUser, INITIAL_USERS } from "../components/Settings/OrganizationSettings/UserSettings";
import { LoginScreen } from './LoginScreen';
import { getEffectivePolicy, isWithinAllowedHours, getCurrentUser, getVouchersPostedTodayCount } from '../utils/security';



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





import { useAppLogic } from './useAppLogic';
import { AppViewRouter } from './AppViewRouter';

export const AppContent: React.FC = () => {
  const appLogic = useAppLogic();
  const { 
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
    itemReportActiveTab,
    setItemReportActiveTab,
    voucherEntryActiveTab,
    setVoucherEntryActiveTab,
    inventoryEntryActiveTab,
    setInventoryEntryActiveTab,
    settingsActiveTab,
    setSettingsActiveTab,
    supportActiveTab,
    setSupportActiveTab,
    activeSamples,
    setActiveSamples,
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
    partyMasters,
    setPartyMasters,
    ledgerMasters,
    setLedgerMasters,
    itemMasters,
    setItemMasters,
    uomMasters,
    setUomMasters,
    gstMasters,
    setGstMasters,
    brandMasters,
    setBrandMasters,
    categoryMasters,
    setCategoryMasters,
    gradeMasters,
    setGradeMasters,
    assertionCategoryMasters,
    setAssertionCategoryMasters,
    assertionCodeMasters,
    setAssertionCodeMasters,
    contactMasters,
    setContactMasters,
    skuMasters,
    setSkuMasters,
    priceListMasters,
    setPriceListMasters,
    weightMasters,
    setWeightMasters,
    volumeMasters,
    setVolumeMasters,
    colorMasters,
    setColorMasters,
    sizeMasters,
    setSizeMasters,
    variantMasters,
    setVariantMasters,
    dimensionMasters,
    setDimensionMasters,
    locationMasters,
    setLocationMasters,
    bomMasters,
    setBomMasters,
    stockGroupMasters,
    setStockGroupMasters,
    costCenterMasters,
    setCostCenterMasters,
    accountGroupMasters,
    setAccountGroupMasters,
    customMasters,
    setCustomMasters,
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
    handleAddPartyMaster,
    handleAddLedgerMaster,
    handleAddUomMaster,
    handleAddItemMaster,
    handleSetPartyMasters,
    handleSetLedgerMasters,
    handleSetItemMasters,
    handleSetUomMasters,
    handleSetGstMasters,
    handleSetBrandMasters,
    handleSetCategoryMasters,
    handleSetGradeMasters,
    handleImportVoucher,
    handleViewChange,
  } = appLogic;

  return (
    <>
      {/* Background Syncing (Hidden from UI to prevent blocking and confusion about missing sample counts) */}

      <Layout
        pageTitle={view === 'index' ? "Home" : view === 'import' ? "Import" : view.charAt(0).toUpperCase() + view.slice(1)}
        activeView={view}
        settingsActiveTab={settingsActiveTab}
        onViewChange={handleViewChange}
      >
        <AppViewRouter appState={appLogic} />
      </Layout>
    </>
  );
};


