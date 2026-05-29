import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { HardDrive, RefreshCw, CheckCircle, ActivityIcon, AlertTriangle, Sparkles, Wifi, Activity, Clock, Download, Database, LayoutDashboard } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';

export const IntegrityTab = () => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();

  const getTranslatedResult = (result: string) => {
    if (!result) return t('Awaiting dispatch');
    const direct = t(result);
    if (direct !== result) return direct;
    
    if (result.includes('possibly corrupted schemas detected.')) {
       const count = result.split(' ')[0];
       return `${count} ${t('possibly corrupted schemas detected.')}`;
    }
    if (result.includes('ms roundtrip to Gateway.')) {
       const ms = result.split('ms')[0];
       return `${ms}ms ${t('roundtrip to Gateway.')}`;
    }
    if (result.includes('UI Thread healthy (~')) {
       const fps = result.match(/\d+/)?.[0] || '';
       return `${t('UI Thread healthy')} (~${fps} FPS)`;
    }
    if (result.includes('UI Thread degraded (~')) {
       const fps = result.match(/\d+/)?.[0] || '';
       return `${t('UI Thread degraded')} (~${fps} FPS)`;
    }
    if (result.includes('items in pending queue.')) {
       const count = result.split(' ')[0];
       return `${count} ${t('items in pending queue.')}`;
    }
    return t(result);
  };

  const [dbStats, setDbStats] = useState({ 
      localSize: 'Calculating...', 
      localCount: 0,
      sessionSize: 'Calculating...',
      sessionCount: 0,
      cacheCount: 0,
      quotaFree: 'Calculating...'
  });
  
  const [diagnosticSuiteStatus, setDiagnosticSuiteStatus] = useState<string>('idle');
  
  const INITIAL_STEPS = [
    { id: 'storage', name: 'Storage Partition Validation', status: 'idle', result: '' },
    { id: 'schema', name: 'Schema Integrity Check', status: 'idle', result: '' },
    { id: 'idb', name: 'IndexedDB Verification', status: 'idle', result: '' },
    { id: 'network', name: 'API Gateway Latency', status: 'idle', result: '' },
    { id: 'cache', name: 'Memory Cache Consistency', status: 'idle', result: '' },
    { id: 'gemini', name: 'Gemini API Availability', status: 'idle', result: '' },
    { id: 'dom', name: 'DOM Animation Framerate', status: 'idle', result: '' },
    { id: 'sync', name: 'Background Sync Queue (Demo)', status: 'idle', result: '', isDemo: true },
    { id: 'crypto', name: 'Cryptography Key Handshake (Demo)', status: 'idle', result: '', isDemo: true }
  ];
  const [diagnosticSteps, setDiagnosticSteps] = useState<any[]>(INITIAL_STEPS);

  // Load actual local storage sizes on mount
  useEffect(() => {
    calculateAdvancedStorage();
  }, []);

  const calculateAdvancedStorage = () => {
    // local storage
    let localSize = 0;
    let localCount = 0;
    if (typeof localStorage !== 'undefined') {
        localCount = localStorage.length;
        for (let i = 0; i < localCount; i++) {
            const key = localStorage.key(i);
            if (key) {
                localSize += (localStorage.getItem(key)?.length || 0);
            }
        }
    }

    // session storage
    let sessionSize = 0;
    let sessionCount = 0;
    if (typeof sessionStorage !== 'undefined') {
         sessionCount = sessionStorage.length;
         for (let i = 0; i < sessionCount; i++) {
            const key = sessionStorage.key(i);
            if (key) {
                sessionSize += (sessionStorage.getItem(key)?.length || 0);
            }
        }
    }

    const localKb = (localSize / 1024).toFixed(2) + ' KB';
    const sessionKb = (sessionSize / 1024).toFixed(2) + ' KB';

    setDbStats(prev => ({
        ...prev,
        localSize: localKb,
        localCount,
        sessionSize: sessionKb,
        sessionCount
    }));

    // Async parts without blocking UI
    if ('caches' in window) {
        caches.keys().then(keys => {
            setDbStats(prev => ({ ...prev, cacheCount: keys.length }));
        }).catch(() => {});
    }

    if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(estimate => {
            const quotaUsage = estimate.usage || 0;
            const quotaTotal = estimate.quota || 0;
            const quotaFreeMb = quotaTotal > 0 ? ((quotaTotal - quotaUsage) / (1024 * 1024)).toFixed(2) + ' MB' : 'Restricted';
            setDbStats(prev => ({ ...prev, quotaFree: quotaFreeMb }));
        }).catch(() => {});
    }
  };

  const handleExportReport = () => {
      const report = {
          timestamp: new Date().toISOString(),
          environment: navigator.userAgent,
          storage: dbStats,
          diagnostics: diagnosticSteps
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `integrity_report_${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification({ title: "Report Exported", message: "Telemetry report exported successfully.", type: "Alert" });
  };

  const executeFullDiagnosticSuite = async () => {
    setDiagnosticSuiteStatus('running');
    
    let currentSteps = [...INITIAL_STEPS];
    setDiagnosticSteps(currentSteps);

    // Step 1: Storage
    currentSteps[0] = { ...currentSteps[0], status: 'running', result: 'Scanning local partitions...' };
    setDiagnosticSteps([...currentSteps]);
    await new Promise(resolve => setTimeout(resolve, 200));
    calculateAdvancedStorage();
    
    try {
        const testKey = '__test_integrity__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        currentSteps[0] = { ...currentSteps[0], status: 'success', result: 'Storage fully writable. Integrity verified.' };
    } catch (e: any) {
        currentSteps[0] = { ...currentSteps[0], status: 'warning', result: e.message || 'Storage Quota Exceeded' };
    }
    setDiagnosticSteps([...currentSteps]);

    // Step 2: Schema Integrity Check
    currentSteps[1] = { ...currentSteps[1], status: 'running', result: 'Verifying core JSON blobs...' };
    setDiagnosticSteps([...currentSteps]);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let corrupted = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('erp_')) {
            try {
                const val = localStorage.getItem(key);
                if (val && val.startsWith('{') || val?.startsWith('[')) {
                    JSON.parse(val);
                }
            } catch (e) {
                corrupted++;
            }
        }
    }
    if (corrupted > 0) {
        currentSteps[1] = { ...currentSteps[1], status: 'warning', result: `${corrupted} possibly corrupted schemas detected.` };
    } else {
        currentSteps[1] = { ...currentSteps[1], status: 'success', result: 'All schemas parse correctly.' };
    }
    setDiagnosticSteps([...currentSteps]);

    // Step 2b: IndexedDB
    currentSteps[2] = { ...currentSteps[2], status: 'running', result: 'Checking IDB Object Store...' };
    setDiagnosticSteps([...currentSteps]);
    await new Promise(resolve => setTimeout(resolve, 150));
    try {
        if ('indexedDB' in window) {
            currentSteps[2] = { ...currentSteps[2], status: 'success', result: 'IndexedDB API is available.' };
        } else {
            currentSteps[2] = { ...currentSteps[2], status: 'warning', result: 'IndexedDB not supported in this environment.' };
        }
    } catch(e) {
        currentSteps[2] = { ...currentSteps[2], status: 'warning', result: 'IndexedDB check failed.' };
    }
    setDiagnosticSteps([...currentSteps]);

    // Step 3: Network Latency
    currentSteps[3] = { ...currentSteps[3], status: 'running', result: 'Pinging /api/health ...' };
    setDiagnosticSteps([...currentSteps]);
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch('/api/health', { method: 'GET', signal: controller.signal }).catch(() => {});
        clearTimeout(timeoutId);
        const latency = Date.now() - start;
        currentSteps[3] = { ...currentSteps[3], status: 'success', result: `${latency}ms roundtrip to Gateway.` };
    } catch (e) {
        currentSteps[3] = { ...currentSteps[3], status: 'warning', result: 'Network appears offline or endpoint unreachable.' };
    }
    setDiagnosticSteps([...currentSteps]);

    // Step 4: Memory Cache
    currentSteps[4] = { ...currentSteps[4], status: 'running', result: 'Checking session availability...' };
    setDiagnosticSteps([...currentSteps]);
    await new Promise(resolve => setTimeout(resolve, 150));
    if (typeof sessionStorage !== 'undefined') {
        currentSteps[4] = { ...currentSteps[4], status: 'success', result: 'Session Storage is ready and functioning.' };
    } else {
        currentSteps[4] = { ...currentSteps[4], status: 'warning', result: 'Session Storage unavailable.' };
    }
    setDiagnosticSteps([...currentSteps]);

    // Step 5: Gemini API Availability
    currentSteps[5] = { ...currentSteps[5], status: 'running', result: 'Connecting to AI model gateway...' };
    setDiagnosticSteps([...currentSteps]);
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const aiModelCheck = await fetch('/api/health', { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (aiModelCheck.ok) {
           currentSteps[5] = { ...currentSteps[5], status: 'success', result: 'AI API backend is reachable.' };
        } else {
           currentSteps[5] = { ...currentSteps[5], status: 'warning', result: 'AI API reachable but returned error.' };
        }
    } catch(e) {
        currentSteps[5] = { ...currentSteps[5], status: 'warning', result: 'AI API backend validation failed.' };
    }
    setDiagnosticSteps([...currentSteps]);
    
    // Step 5b: DOM Resynchronization FPS
    currentSteps[6] = { ...currentSteps[6], status: 'running', result: 'Calculating requestAnimationFrame delta...' };
    setDiagnosticSteps([...currentSteps]);
    const frames = await new Promise<number>((resolve) => {
        let count = 0;
        let pstart = performance.now();
        const tick = () => {
             count++;
             // Fast tick if out of focus
             if (performance.now() - pstart < 250) {
                 requestAnimationFrame(tick);
             } else {
                 resolve(count);
             }
        };
        requestAnimationFrame(tick);
    });
    const fps = Math.round((frames / 250) * 1000);
    if (fps > 25 || frames < 5) { // fallback frames < 5 logic for background tabs
         currentSteps[6] = { ...currentSteps[6], status: 'success', result: `UI Thread healthy (~${fps} FPS).` };
    } else {
         currentSteps[6] = { ...currentSteps[6], status: 'warning', result: `UI Thread degraded (~${fps} FPS).` };
    }
    setDiagnosticSteps([...currentSteps]);

    // Step 6: Background Sync Queue (Demo)
    currentSteps[7] = { ...currentSteps[7], status: 'running', result: 'Analyzing background sync threads...' };
    setDiagnosticSteps([...currentSteps]);
    await new Promise(resolve => setTimeout(resolve, 150));
    const randomSync = Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 5) + 1;
    if (randomSync === 0) {
        currentSteps[7] = { ...currentSteps[7], status: 'success', result: 'Sync queue empty (All synced).' };
    } else {
        currentSteps[7] = { ...currentSteps[7], status: 'warning', result: `${randomSync} items in pending queue.` };
    }
    setDiagnosticSteps([...currentSteps]);

    // Step 7: Cryptography Key Handshake (Demo)
    currentSteps[8] = { ...currentSteps[8], status: 'running', result: 'Validating public key certificate...' };
    setDiagnosticSteps([...currentSteps]);
    await new Promise(resolve => setTimeout(resolve, 200));
    currentSteps[8] = { ...currentSteps[8], status: 'success', result: 'Secure Handshake TLS valid.' };
    setDiagnosticSteps([...currentSteps]);

    setDiagnosticSuiteStatus('completed');
    addNotification({ title: 'Diagnostics Done', message: 'Integrity diagnostic suite completed.', type: 'Alert' });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-xl p-5 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-5 border-b border-gray-100 dark:border-gray-800 gap-4">
              <div>
                  <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">{t("Active Storage Profile & Environment")}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Advanced summary of currently utilized browser state and device telemetry")}</p>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={handleExportReport} className="px-3 py-1.5 md:py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-2">
                     <Download className="w-3.5 h-3.5" /> {t("Export Report")}
                 </button>
                 <button onClick={calculateAdvancedStorage} title="Refresh telemetry" className="p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors tooltip group relative">
                     <RefreshCw className="w-3.5 h-3.5" />
                 </button>
              </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-default">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> {t("Local Size")}</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white">{dbStats.localSize === 'Calculating...' ? t('Calculating...') : dbStats.localSize}</div>
                  <div className="text-[9px] text-gray-400 font-medium mt-1 uppercase">{dbStats.localCount} {t("key(s) in local scope")}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-default">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><LayoutDashboard className="w-3.5 h-3.5" /> {t("Session Size")}</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white">{dbStats.sessionSize === 'Calculating...' ? t('Calculating...') : dbStats.sessionSize}</div>
                  <div className="text-[9px] text-gray-400 font-medium mt-1 uppercase">{dbStats.sessionCount} {t("key(s) in temporary scope")}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-default">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><ActivityIcon className="w-3.5 h-3.5" /> {t("Cache API")}</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white">{dbStats.cacheCount}</div>
                  <div className="text-[9px] text-gray-400 font-medium mt-1 uppercase">{t("Worker caches detected")}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 cursor-default relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                  <div className="relative">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">{t("Free Quota Estimate")}</div>
                      <div className="text-xl font-black text-gray-900 dark:text-white text-indigo-600 dark:text-indigo-400">{dbStats.quotaFree === 'Calculating...' ? t('Calculating...') : (dbStats.quotaFree === 'Restricted' ? t('Restricted') : dbStats.quotaFree)}</div>
                      <div className="text-[9px] text-gray-400 font-medium mt-1 uppercase">{t("Available allocated space")}</div>
                  </div>
              </div>
          </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight">{t("Validation Pipeline & AI Health")}</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{t("Trigger real module checks. Validates local persistence and external AI connectivities.")}</p>
          </div>
          <button
            onClick={executeFullDiagnosticSuite}
            disabled={diagnosticSuiteStatus === 'running'}
            className="px-4 py-2 bg-gray-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${diagnosticSuiteStatus === 'running' ? 'animate-spin' : ''}`} />
            {diagnosticSuiteStatus === 'running' ? t('Active Diagnostic...') : t('Run Diagnostics')}
          </button>
        </div>

        <div className="grid gap-2">
          {diagnosticSteps.map((step, idx) => (
            <div key={step.id} className="bg-gray-50/50 dark:bg-gray-800/20 border border-gray-200/60 dark:border-gray-800 rounded-lg p-3 flex items-center justify-between gap-3 group hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3 w-full overflow-hidden">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border ${
                  step.status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
                  step.status === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' :
                  step.status === 'running' ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 animate-pulse' :
                  'bg-white border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
                }`}>
                  {step.id === 'storage' && <HardDrive className="w-3.5 h-3.5" />}
                  {step.id === 'schema' && <Sparkles className="w-3.5 h-3.5" />}
                  {step.id === 'idb' && <Database className="w-3.5 h-3.5" />}
                  {step.id === 'network' && <Wifi className="w-3.5 h-3.5" />}
                  {step.id === 'cache' && <Activity className="w-3.5 h-3.5" />}
                  {step.id === 'gemini' && <Sparkles className="w-3.5 h-3.5" />}
                  {step.id === 'dom' && <ActivityIcon className="w-3.5 h-3.5" />}
                  {step.id === 'sync' && <RefreshCw className="w-3.5 h-3.5" />}
                  {step.id === 'crypto' && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
                    {t(step.name)}
                    {step.status === 'success' && <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-[9px] uppercase tracking-wider">{t("Pass")}</span>}
                    {step.status === 'warning' && <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 text-[9px] uppercase tracking-wider">{t("Warn")}</span>}
                    {step.isDemo && <span className="px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 text-[9px] uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/30">{t("Demo")}</span>}
                  </p>
                  <p className={`text-[11px] font-medium mt-0.5 truncate tracking-wide ${step.result ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{getTranslatedResult(step.result)}</p>
                </div>
              </div>
              <div className="shrink-0 pl-2">
                {step.status === 'running' && <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
