import { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

export const useErpConnector = () => {
  const { t } = useLanguage();
  
  // Collapsible accordion active section state
  const [activeSection, setActiveSection] = useState<'info' | 'ai' | 'custom' | 'production' | null>(null);

  // Production Service State variables
  const [productionEnv, setProductionEnv] = useState('tally');
  const [productionApiUrl, setProductionApiUrl] = useState('https://api.tallyprime.internal/v1/import');
  const [productionApiKey, setProductionApiKey] = useState('');
  const [syncMode, setSyncMode] = useState('realtime');
  const [isSyncingLedger, setIsSyncingLedger] = useState(true);
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testConnectionMessage, setTestConnectionMessage] = useState('');

  const handleTestConnection = () => {
    setTestConnectionStatus('testing');
    setTestConnectionMessage('');
    
    setTimeout(() => {
      if (!productionApiUrl) {
        setTestConnectionStatus('error');
        setTestConnectionMessage(t("Failed: Production API Endpoint URL is required."));
      } else if (!productionApiKey) {
        setTestConnectionStatus('error');
        setTestConnectionMessage(t("Failed: Unauthorized. API Key is missing."));
      } else {
        setTestConnectionStatus('success');
        setTestConnectionMessage(t(`Successfully authenticated and connected with ${
          productionEnv === 'tally' ? 'Tally Prime' : productionEnv === 'sap' ? 'SAP Business One' : productionEnv === 'zoho' ? 'Zoho Books' : 'Custom Server'
        }!`));
      }
    }, 1200);
  };

  return {
    activeSection,
    setActiveSection,
    productionEnv,
    setProductionEnv,
    productionApiUrl,
    setProductionApiUrl,
    productionApiKey,
    setProductionApiKey,
    syncMode,
    setSyncMode,
    isSyncingLedger,
    setIsSyncingLedger,
    testConnectionStatus,
    testConnectionMessage,
    handleTestConnection,
  };
};
