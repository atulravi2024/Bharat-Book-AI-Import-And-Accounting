import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { ParsingSettings } from '../../../../app/types';
import { INTERNAL_GEMINI_MODELS } from '../../../../services/AIConfig';
import { 
    SettingsIcon, 
    InfoIcon 
} from '../../../icons/IconComponents';

interface SubStepSettingsProps {
  file: File | null;
  parsingSettings: ParsingSettings;
  setParsingSettings: React.Dispatch<React.SetStateAction<ParsingSettings>>;
  activeSection: 'info' | 'ai' | 'custom' | 'production' | null;
  setActiveSection: (sec: 'info' | 'ai' | 'custom' | 'production' | null) => void;
  productionEnv: string;
  setProductionEnv: (env: string) => void;
  syncMode: string;
  setSyncMode: (mode: string) => void;
  productionApiUrl: string;
  setProductionApiUrl: (url: string) => void;
  productionApiKey: string;
  setProductionApiKey: (key: string) => void;
  isSyncingLedger: boolean;
  setIsSyncingLedger: (sync: boolean) => void;
  handleTestConnection: () => void;
  testConnectionStatus: 'idle' | 'testing' | 'success' | 'error';
  testConnectionMessage: string;
}

export const SubStepSettings: React.FC<SubStepSettingsProps> = ({
  file,
  parsingSettings,
  setParsingSettings,
  activeSection,
  setActiveSection,
  productionEnv,
  setProductionEnv,
  syncMode,
  setSyncMode,
  productionApiUrl,
  setProductionApiUrl,
  productionApiKey,
  setProductionApiKey,
  isSyncingLedger,
  setIsSyncingLedger,
  handleTestConnection,
  testConnectionStatus,
  testConnectionMessage,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none min-h-0 overflow-y-auto custom-scrollbar shrink-0 text-left">
      <div className="flex items-center mb-6 text-gray-800 dark:text-gray-100">
        <SettingsIcon className="mr-3 text-2xl text-blue-500" />
        <h3 className="text-lg md:text-xl font-black">{t("Advanced Ingestion Settings")}</h3>
      </div>

      <div className="space-y-4">
        {/* ACCORDION 1: AI Suggestions & Process Info */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'info' ? null : 'info')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <InfoIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("AI Suggestions & Process Info")}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Helpful guidelines, limits, and sandbox information")}</p>
              </div>
            </div>
            {activeSection === 'info' ? (
              <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </button>

          {activeSection === 'info' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 space-y-4 animate-in fade-in duration-200 text-left">
              <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside dark:text-gray-300 ml-1">
                <li>{t("For best results, upload clear, high-resolution images or machine-readable PDFs.")}</li>
                <li>{t("Ensure the voucher type matches the uploaded document.")}</li>
                <li>{t("Our AI will attempt to automatically recognize all fields.")}</li>
                {file && <li className="font-semibold text-green-700 mt-4 dark:text-green-400">{t("AI analysis ready. Proceed to the next step to review extracted data.")}</li>}
              </ul>
              <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40">
                <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 tracking-wider flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  {t("Simulated Sandbox Parser Mode")}
                </span>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed font-semibold">
                  {t("Excel/CSV formats are parsed directly to standard ledger models. Other source formats (Images, PDFs) run under a")} <strong>{t("simulated OCR Sandbox sequence")}</strong> {t("with mock values to demonstrate enterprise AI mapping pipelines.")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 2: AI Model Engine */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'ai' ? null : 'ai')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg animate-pulse">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("AI Engine Settings")}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Model selection, vision features and sensitivity thresholds")}</p>
              </div>
            </div>
            {activeSection === 'ai' ? (
              <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </button>

          {activeSection === 'ai' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2 text-left bg-transparent">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider dark:text-gray-300">{t("OCR Sensitivity")} ({parsingSettings.ocrSensitivity}%)</label>
                  <InfoIcon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={parsingSettings.ocrSensitivity}
                  onChange={(e) => setParsingSettings(prev => ({ ...prev, ocrSensitivity: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-gray-700"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-wide">
                  <span>{t("Performance Focus")}</span>
                  <span>{t("Accuracy Focus")}</span>
                </div>
              </div>

              <div className="space-y-2 text-left bg-transparent">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider dark:text-gray-300">{t("AI Model Engine")}</label>
                <select 
                  value={parsingSettings.aiModel}
                  onChange={(e) => setParsingSettings(prev => ({ ...prev, aiModel: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-600"
                >
                  {INTERNAL_GEMINI_MODELS.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                  <option value="Vision Transformer-L">{t("Vision Transformer-L (Best for Complex Tables)")}</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <div className="text-xs pr-4 text-left">
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{t("Experimental Vision Engine")}</p>
                  <p className="text-gray-500 font-semibold">{t("Enhanced layout recovery & tabular structure detection")}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setParsingSettings(prev => ({ ...prev, experimentalFeatures: !prev.experimentalFeatures }))}
                  className={`w-14 h-7 rounded-full transition-all relative shrink-0 cursor-pointer ${parsingSettings.experimentalFeatures ? 'bg-blue-600 shadow-inner' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${parsingSettings.experimentalFeatures ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 3: Custom Extraction Cues */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'custom' ? null : 'custom')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("Custom Ingestion Cues")}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Custom instructions, prompts or extraction triggers for AI")}</p>
              </div>
            </div>
            {activeSection === 'custom' ? (
              <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </button>

          {activeSection === 'custom' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 space-y-3 animate-in fade-in duration-200 text-left">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider dark:text-gray-300">{t("Custom Extraction Cues")}</label>
              <textarea 
                value={parsingSettings.customInstructions}
                onChange={(e) => setParsingSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
                placeholder={t("e.g. 'Always look for GSTIN in the footer', 'Ignore previous balance in total'...")}
                className="w-full h-24 text-sm font-semibold p-4 bg-white border border-gray-300 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          )}
        </div>

        {/* ACCORDION 4: Production Service Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/10 dark:bg-gray-900/20">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'production' ? null : 'production')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("Production Service Integration")}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("Synchronize parsed voucher objects back to production ERPs")}</p>
              </div>
            </div>
            {activeSection === 'production' ? (
              <svg className="w-4 h-4 text-gray-500 transform rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </button>

          {activeSection === 'production' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 space-y-4 animate-in fade-in duration-200 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider dark:text-gray-400">{t("Target Accounting API ERP")}</label>
                  <select 
                    value={productionEnv}
                    onChange={(e) => {
                      setProductionEnv(e.target.value);
                      if (e.target.value === 'tally') setProductionApiUrl('https://api.tallyprime.internal/v1/import');
                      else if (e.target.value === 'sap') setProductionApiUrl('https://sap-gateway.enterprise.corp/api/v2/vouchers');
                      else if (e.target.value === 'zoho') setProductionApiUrl('https://books.zoho.in/api/v3/documents');
                      else setProductionApiUrl('');
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="tally">{t("Tally Prime Server")}</option>
                    <option value="sap">{t("SAP Business One ERP")}</option>
                    <option value="zoho">{t("Zoho Books Endpoint")}</option>
                    <option value="custom">{t("-- Custom Webhook URL --")}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider dark:text-gray-400">{t("Synchronization Strategy")}</label>
                  <select 
                    value={syncMode}
                    onChange={(e) => setSyncMode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="realtime">{t("Real-time Direct Push")}</option>
                    <option value="batch">{t("EOD Nightly Batch Queue")}</option>
                    <option value="manual">{t("Manual Human-in-The-Loop Signoff")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider dark:text-gray-400">{t("Production Integration Endpoint URL")}</label>
                  <input 
                    type="text"
                    value={productionApiUrl}
                    onChange={(e) => setProductionApiUrl(e.target.value)}
                    placeholder="https://sync.yourdomain.com/api/v1/ledger"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-850 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider dark:text-gray-400">{t("Bearer Access Key / API Token")}</label>
                  <input 
                    type="password"
                    value={productionApiKey}
                    onChange={(e) => setProductionApiKey(e.target.value)}
                    placeholder="••••••••••••••••••••••••••••••••"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-850 dark:border-gray-750"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-905 rounded-xl border border-gray-200 dark:border-gray-750 mt-2">
                <div className="text-[11px] pr-2 text-left">
                  <p className="font-bold text-gray-800 dark:text-gray-200 mb-0.5">{t("Sync Unmapped Ledgers Automatically")}</p>
                  <p className="text-gray-450 dark:text-gray-400">{t("Create non-existent party & bank accounts in secondary ERP in real-time")}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsSyncingLedger(!isSyncingLedger)}
                  className={`w-10 h-5.5 rounded-full transition-all relative shrink-0 cursor-pointer ${isSyncingLedger ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-750'}`}
                >
                  <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isSyncingLedger ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testConnectionStatus === 'testing'}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {testConnectionStatus === 'testing' ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-gray-600 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("Connecting...")}
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      {t("Test Service connectivity")}
                    </>
                  )}
                </button>

                {testConnectionStatus !== 'idle' && (
                  <div className={`p-2.5 rounded-lg border text-[11px] font-medium text-left ${
                    testConnectionStatus === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-300' 
                      : testConnectionStatus === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-300'
                      : 'bg-blue-50 border-blue-105 text-blue-800'
                  }`}>
                    {testConnectionMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
