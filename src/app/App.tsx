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

import { AppContent } from './AppContent';



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




const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('bharat_book_current_logged_in_user_id');
  });

  const handleLogin = (id: string) => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    // Initialize/update last activity on mount
    localStorage.setItem('bharat_book_last_activity', Date.now().toString());

    const handleActivity = () => {
      localStorage.setItem('bharat_book_last_activity', Date.now().toString());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    const checkInterval = setInterval(() => {
      const lastActivityStr = localStorage.getItem('bharat_book_last_activity');
      
      let userTimeout = 30; // standard 30 minutes fallback
      try {
        const policy = getEffectivePolicy();
        if (policy && policy.inactivityTimeoutMinutes) {
          userTimeout = policy.inactivityTimeoutMinutes;
        }
      } catch (err) {
        console.error("Error evaluating inactivity limits:", err);
      }

      const timeoutMs = userTimeout * 60 * 1000;
      
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        if (Date.now() - lastActivity > timeoutMs) {
          // Perform Logout due to inactivity
          const currentSessionId = localStorage.getItem('bharat_book_current_session_id');
          if (currentSessionId) {
            const existingSessions = JSON.parse(localStorage.getItem('bharat_book_sessions') || '[]');
            const sessionIndex = existingSessions.findIndex((s: any) => s.id === currentSessionId);
            if (sessionIndex >= 0) {
               existingSessions[sessionIndex].logoutTime = Date.now();
               localStorage.setItem('bharat_book_sessions', JSON.stringify(existingSessions));
            }
            localStorage.removeItem('bharat_book_current_session_id');
          }

          localStorage.removeItem('bharat_book_current_logged_in_user_id');
          localStorage.removeItem('bharat_book_session_start');
          localStorage.setItem('bharat_book_logout_due_to_inactivity', 'true');
          setIsLoggedIn(false);
          window.location.reload();
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearInterval(checkInterval);
    };
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <LoginScreen onLogin={handleLogin} />
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};


export default App;
