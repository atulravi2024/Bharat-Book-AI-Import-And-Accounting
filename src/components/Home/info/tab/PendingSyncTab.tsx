import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, CloudOff, Database, CheckCircle2, ArrowRightLeft, 
  HelpCircle, AlertTriangle, Search, FileText, Plus, Trash2, 
  Edit2, Check, X, ShieldAlert, Wifi, Info, Layers, CheckCircle,
  TrendingDown
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

export interface PendingSyncItem {
  id: string;
  type: 'voucher' | 'party' | 'ledger' | 'item';
  name: string;
  details: string;
  lastModified: string;
  status: 'offline_created' | 'offline_modified' | 'diff_detected';
  reason: string;
  confidence?: number;
}

interface PendingSyncTabProps {
  language: string;
}

export const PendingSyncTab: React.FC<PendingSyncTabProps> = ({ language }) => {
  const { addNotification } = useNotifications();
  const [queue, setQueue] = useState<PendingSyncItem[]>([]);

  const loadFromSampleFile = async () => {
    try {
      const response = await fetch('/sample-data/pending-sync.json');
      if (response.ok) {
        const data = await response.json();
        const processed = data.map((item: any) => ({
          ...item,
          lastModified: new Date(Date.now() - 1000 * 60 * (item.relativeMinutesAgo || 45)).toLocaleString()
        }));
        setQueue(processed);
        localStorage.setItem('bharat_book_pending_sync_queue', JSON.stringify(processed));
      } else {
        setQueue([]);
      }
    } catch (e) {
      console.error("Failed to load demo sync data", e);
      setQueue([]);
    }
  };
  const [syncFilter, setSyncFilter] = useState<'all' | 'transactions' | 'masters'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & States
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncPercentage, setSyncPercentage] = useState(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [activeSyncItem, setActiveSyncItem] = useState<PendingSyncItem | null>(null);
  
  // Adding custom simulated records
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<'voucher' | 'party' | 'ledger' | 'item'>('voucher');
  const [newName, setNewName] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newStatus, setNewStatus] = useState<'offline_created' | 'offline_modified' | 'diff_detected'>('offline_created');

  // Inline editing records
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDetails, setEditingDetails] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('bharat_book_pending_sync_queue');
    if (saved) {
      try {
        setQueue(JSON.parse(saved));
      } catch (err) {
        loadFromSampleFile();
      }
    } else {
      loadFromSampleFile();
    }
  }, []);

  // Sync helpers to update LocalStorage
  const updateQueue = (newQ: PendingSyncItem[]) => {
    setQueue(newQ);
    localStorage.setItem('bharat_book_pending_sync_queue', JSON.stringify(newQ));
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addNotification({
        title: language === 'hi' ? 'सुरक्षित सिंक जांच' : 'Integrity Audit Completed',
        message: language === 'hi'
          ? 'सिंक्रनाइज़ेशन कतार स्वस्थ है। कोई सुरक्षा विसंगति नहीं मिली।'
          : 'Integrity audit completed. Verification reports standard local data buffers.',
        type: 'System'
      });
    }, 1000);
  };

  const generateDemoRecords = async () => {
    try {
      const response = await fetch('/sample-data/pending-sync.json');
      if (response.ok) {
        const data = await response.json();
        const processed = data.map((item: any) => ({
          ...item,
          lastModified: new Date(Date.now() - 1000 * 60 * (item.relativeMinutesAgo || 45)).toLocaleString()
        }));
        updateQueue(processed);
        addNotification({
          title: language === 'hi' ? 'डेमो प्रविष्टियाँ बहाल' : 'Demo Records Restored',
          message: language === 'hi' ? 'सिंक करने के लिए कतार में 5 डिफ़ॉल्ट आइटम जोड़े गए।' : 'Loaded 5 pending items into replication manager.',
          type: 'Alert'
        });
      }
    } catch (e) {
      console.error("Failed to restore demo records", e);
    }
  };

  const clearAllQueue = () => {
    updateQueue([]);
    addNotification({
      title: language === 'hi' ? 'कतार खाली की गई' : 'Queue Cleared',
      message: language === 'hi' ? 'लंबित सिंक्रनाइज़ेशन डेटा हटाया गया।' : 'All pending sandbox registers discarded.',
      type: 'Alert'
    });
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    let defaultReason = 'User created manual pending entry mock.';
    if (newStatus === 'offline_created') {
      defaultReason = language === 'hi' 
        ? 'ऑफ़लाइन बनाया गया रिकॉर्ड, जिसे क्लाउड सिंक की आवश्यकता है।' 
        : 'Offline Created record needing cloud replication.';
    } else if (newStatus === 'offline_modified') {
      defaultReason = language === 'hi' 
        ? 'बिना नेटवर्क के स्थानीय रूप से संशोधित किया गया।' 
        : 'Modified locally without network. Dynamic conflict.';
    } else if (newStatus === 'diff_detected') {
      defaultReason = language === 'hi'
        ? 'स्थानीय तथा क्लाउड डेटाबेस में विषमता पाई गई।'
        : 'Database sync mismatch detected.';
    }

    const newItem: PendingSyncItem = {
      id: `SIM-${Math.floor(Math.random() * 9000) + 1000}-${newType.substring(0, 1).toUpperCase()}`,
      type: newType,
      name: newName,
      details: newDetails || (newType === 'voucher' ? 'Sales Ledger Entry - SimValue ₹45,000' : 'Registered Office Address'),
      lastModified: new Date().toLocaleString(),
      status: newStatus,
      reason: newReason || defaultReason,
      confidence: Math.floor(Math.random() * 20) + 80
    };

    updateQueue([newItem, ...queue]);
    setIsAdding(false);
    setNewName('');
    setNewDetails('');
    setNewReason('');
    setNewStatus('offline_created');

    addNotification({
      title: language === 'hi' ? 'नया लंबित आइटम' : 'Simulated Pending Item',
      message: language === 'hi' 
        ? `लंबित सिंक में "${newName}" शामिल किया गया।`
        : `Added simulated pending offline component: "${newName}"`,
      type: 'Alert'
    });
  };

  const handleDeleteItem = (id: string, name: string) => {
    const updated = queue.filter(item => item.id !== id);
    updateQueue(updated);
    addNotification({
      title: language === 'hi' ? 'प्रविष्टि हटाई गई' : 'Item Discarded',
      message: language === 'hi' 
        ? `आइटम "${name}" कतार से हटा दिया गया है।`
        : `Component "${name}" removed from local synchronization cache.`,
      type: 'Task'
    });
  };

  const startInlineEdit = (item: PendingSyncItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingDetails(item.details);
  };

  const saveInlineEdit = (id: string) => {
    const updated = queue.map(item => {
      if (item.id === id) {
        return {
          ...item,
          name: editingName,
          details: editingDetails,
          lastModified: new Date().toLocaleString()
        };
      }
      return item;
    });
    updateQueue(updated);
    setEditingId(null);
    addNotification({
      title: language === 'hi' ? 'विवरण अपडेट किया गया' : 'Record Adjusted',
      message: language === 'hi' ? 'स्थानीय प्रविष्टि में सफलतापूर्वक संशोधन किया गया।' : 'Offline buffer changes updated locally.',
      type: 'System'
    });
  };

  // Run complex high-fidelity synchronization sequence
  const executeReplication = (itemsToSync: PendingSyncItem[], runAll: boolean) => {
    if (itemsToSync.length === 0) return;
    setIsSyncing(true);
    setSyncPercentage(0);
    setSyncLogs([]);

    const totalSteps = itemsToSync.length;
    let currentItemIndex = 0;

    const logStatements = (step: number, item: PendingSyncItem) => {
      const logsMap: Record<number, string[]> = {
        1: [
          `📡 CONNECTING: Cloud Run Server Node API Handshake...`,
          `🔐 AUTH: Handshaking secure tokens, user role authorized.`
        ],
        2: [
          `🧐 AUDIT: Running structural checks on [${item.name}] (${item.type.toUpperCase()})`,
          `🛡️ CONSTRAINT: Unique Voucher Reference validated, no duplicates in DB.`
        ],
        3: [
          `⚙️ REPLICATING: Flushing buffered client delta logs to backend Cloud SQL storage...`,
          `📝 WRITE: Committed transaction hash to persistent tables metadata index.`
        ],
        4: [
          `💎 VERIFIED: Perfect ledger balance alignment recorded. Sync success.`
        ]
      };
      return logsMap[step] || [];
    };

    const runSyncProcess = () => {
      if (currentItemIndex >= itemsToSync.length) {
        // Finishing
        setTimeout(() => {
          setSyncPercentage(100);
          setSyncLogs(prev => [...prev, `🎉 SUCCESS: All operations processed with 100% integrity.`]);
          
          setTimeout(() => {
            setIsSyncing(false);
            // Remove synchronized items from state
            const idsToRemove = itemsToSync.map(it => it.id);
            const remaining = queue.filter(item => !idsToRemove.includes(item.id));
            updateQueue(remaining);

            addNotification({
              title: language === 'hi' ? 'सिंक्रनाइज़ेशन सफल!' : 'Cloud Ledgers In Sync!',
              message: language === 'hi' 
                ? `${itemsToSync.length} प्रविष्टियां सुरक्षित रूप से हमारे क्लाउड डेटाबेस पर सिंक हो गई हैं!`
                : `Successfully synchronized ${itemsToSync.length} buffers to online relational repository.`,
              type: 'System'
            });
            setActiveSyncItem(null);
          }, 1000);
        }, 500);
        return;
      }

      const activeItem = itemsToSync[currentItemIndex];
      let stepNum = 1;
      
      const stepInterval = setInterval(() => {
        const statements = logStatements(stepNum, activeItem);
        setSyncLogs(prev => [...prev, ...statements]);
        
        const calculatedProgress = Math.floor(
          ((currentItemIndex * 4 + stepNum) / (totalSteps * 4)) * 95
        );
        setSyncPercentage(calculatedProgress);

        stepNum++;
        if (stepNum > 4) {
          clearInterval(stepInterval);
          currentItemIndex++;
          setTimeout(runSyncProcess, 400);
        }
      }, 350);
    };

    // Initialize sync process
    setSyncLogs([
      `🚀 REPLICATION ENGINE ON: Dispatching Sync Broker at ${new Date().toLocaleTimeString()}...`,
      `🔍 TARGET: Relational Database Sync Manager.`
    ]);
    
    setTimeout(runSyncProcess, 500);
  };

  // Filter items in UI
  const filteredQueue = queue.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (syncFilter === 'all') return matchesSearch;
    if (syncFilter === 'transactions') return matchesSearch && item.type === 'voucher';
    if (syncFilter === 'masters') return matchesSearch && item.type !== 'voucher';
    return matchesSearch;
  });

  const transactionCount = queue.filter(it => it.type === 'voucher').length;
  const masterCount = queue.filter(it => it.type !== 'voucher').length;

  return (
    <div className="space-y-6">
      
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-gray-800 p-4.5 rounded-xl border border-gray-100 dark:border-gray-750 shadow-sm flex items-start gap-3.5">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30">
            <CloudOff className="w-5 h-5 shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold truncate">
              {language === 'hi' ? 'लंबित सिंक वाउचर' : 'Pending Local Vouchers'}
            </p>
            <p className="text-2xl font-extrabold dark:text-white mt-0.5 tracking-tight">{transactionCount}</p>
            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1">
              <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              {language === 'hi' ? `${transactionCount} प्रविष्टियां लंबित` : `${transactionCount} vouchers safely cached`}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-gray-800 p-4.5 rounded-xl border border-gray-100 dark:border-gray-750 shadow-sm flex items-start gap-3.5">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
            <Database className="w-5 h-5 shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold truncate">
              {language === 'hi' ? 'लंबित मास्टर डेटा' : 'Pending Masters'}
            </p>
            <p className="text-2xl font-extrabold dark:text-white mt-0.5 tracking-tight">{masterCount}</p>
            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {language === 'hi' ? `${masterCount} मास्टर लंबित` : `${masterCount} offline structures`}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-gray-800 p-4.5 rounded-xl border border-gray-100 dark:border-gray-750 shadow-sm flex items-start gap-3.5">
          <div className="bg-purple-50 dark:bg-purple-950/30 p-2.5 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30">
            <ArrowRightLeft className="w-5 h-5 shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold truncate">
              {language === 'hi' ? 'पाइपलाइन स्वास्थ्य' : 'Pipeline Health Status'}
            </p>
            <p className="text-xs font-bold dark:text-white mt-2 font-mono tracking-tight text-emerald-500 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              {language === 'hi' ? 'सुरक्षित और सक्रिय' : 'REPLICATION ACTIVE'}
            </p>
            <span className="text-[10px] text-blue-500 font-medium flex items-center gap-0.5 mt-1 truncate">
              {language === 'hi' ? 'रीयल-टाइम क्लाउड सिंक' : 'Cloud Run API Tunnel Verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Panel */}
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Main Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-750 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <CloudOff className="w-4 h-4 text-amber-500 shrink-0" />
                {language === 'hi' ? 'डेटाबेस सिंक्रोनाइज़ेशन कतार' : 'Offline Register Queue Map'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-550 dark:text-gray-400 mt-0.5 leading-tight">
                {language === 'hi' 
                  ? 'वे ऑफलाइन प्रविष्टियां जो स्थानीय बफर पर हैं परंतु डेटाबेस से सिंक नहीं हैं' 
                  : 'Manage local transactions or master changes captured offline or waiting for DB ingestion.'
                }
              </p>
            </div>
            
            {/* Toolbar Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'ऑफलाइन प्रविष्टि जोड़ें' : 'Simulate Offline'}</span>
              </button>

              <button
                onClick={generateDemoRecords}
                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                <span>{language === 'hi' ? 'डेमो रिस्टोर' : 'Demo Queue'}</span>
              </button>

              {queue.length > 0 && (
                <button
                  onClick={clearAllQueue}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-450 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पूरी कतार साफ करें' : 'Clear Queue'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
            
            {/* Live Category Filter Controls conforming to custom settings */}
            <div className="flex bg-gray-150 dark:bg-gray-900/50 p-1 rounded-xl gap-1 border border-gray-200/10 self-start">
              <button 
                onClick={() => setSyncFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  syncFilter === 'all' 
                    ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-xs' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {language === 'hi' ? `सभी (${queue.length})` : `All (${queue.length})`}
              </button>
              <button 
                onClick={() => setSyncFilter('transactions')}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  syncFilter === 'transactions' 
                    ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-xs' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {language === 'hi' ? `लेनदेन (${transactionCount})` : `Transactions (${transactionCount})`}
              </button>
              <button 
                onClick={() => setSyncFilter('masters')}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  syncFilter === 'masters' 
                    ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-xs' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {language === 'hi' ? `मास्टर्स (${masterCount})` : `Masters (${masterCount})`}
              </button>
            </div>

            {/* Compact Same-Row Actions and Filter search */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder={language === 'hi' ? 'विवरण या संदर्भ खोजें...' : 'Search pending registry...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              {filteredQueue.length > 0 && (
                <button
                  onClick={() => executeReplication(filteredQueue, true)}
                  disabled={isSyncing}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-750 text-white rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0 select-none"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span>{language === 'hi' ? 'सभी सिंक करें' : 'Sync All Match'}</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Collapsible Adding Offline Simulated Record Panel */}
        {isAdding && (
          <form onSubmit={handleAddRecord} className="p-4 border-b border-gray-100 dark:border-gray-750 bg-blue-50/20 dark:bg-slate-900/30 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-blue-500" />
                {language === 'hi' ? 'नई ऑफलाइन प्रविष्टि का अनुकरण करें' : 'Simulate Offline Record Event'}
              </h4>
              <button type="button" onClick={() => setIsAdding(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">{language === 'hi' ? 'प्रविष्टि प्रकार' : 'Record Type'}</label>
                <select 
                  value={newType} 
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="voucher">{language === 'hi' ? 'वाउचर प्रविष्टि (Voucher)' : 'Ledger Voucher'}</option>
                  <option value="party">{language === 'hi' ? 'पार्टी मास्टर (Party)' : 'Party Contact'}</option>
                  <option value="ledger">{language === 'hi' ? 'लेजर खाता (Ledger)' : 'Accounting Account'}</option>
                  <option value="item">{language === 'hi' ? 'स्टॉक आइटम (Item)' : 'Inventory Component'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">{language === 'hi' ? 'प्रविष्टि का नाम / संदर्भ' : 'Ref Name / Reference'}</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Sales PV-2026-902, Swastik Traders, etc"
                  required
                  className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">{language === 'hi' ? 'विवरण (Details)' : 'Accounting Details'}</label>
                <input 
                  type="text" 
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="₹1,250.00 Ledger Balance, GST No, or HSN Code"
                  className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">{language === 'hi' ? 'सिंक संघर्ष स्थिति' : 'Conflict / Reason'}</label>
                <select 
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="offline_created">{language === 'hi' ? 'ऑफलाइन निर्मित (Created)' : 'Offline Created'}</option>
                  <option value="offline_modified">{language === 'hi' ? 'ऑफलाइन संशोधित (Modified)' : 'Offline Modified'}</option>
                  <option value="diff_detected">{language === 'hi' ? 'डेटाबेस विसंगति (Diff Conflict)' : 'Data Difference Conflict'}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-bold"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button 
                type="submit" 
                className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
              >
                {language === 'hi' ? 'कतार में जोड़ें' : 'Inject Queue Register'}
              </button>
            </div>
          </form>
        )}

        {/* List of pending records mapping closely to custom user schemas */}
        {filteredQueue.length === 0 ? (
          /* Empty Sandbox State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-full text-emerald-500 dark:text-emerald-400 border border-emerald-100/30 mb-4 scale-100 animate-pulse duration-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {language === 'hi' ? 'सभी रिकॉर्ड सिंक हो गए हैं' : 'No unsynchronized data elements'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-1 mb-6 font-medium leading-relaxed">
              {language === 'hi' 
                ? 'बधाई हो, आपका सुरक्षित क्लाउड डेटाबेस रिस्टोर स्थिति में सिंक है।' 
                : 'All your vouchers, transaction ledgers, and master configurations correspond with production databases.'
              }
            </p>

            <button 
              onClick={generateDemoRecords}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-105 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-905 border border-blue-200/50 dark:border-blue-800/40 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              {language === 'hi' ? 'सिंक करने के लिए कतार डेमो पुनः लोड करें' : 'Reload Simulated Sync Queue'}
            </button>
          </div>
        ) : (
          /* Interactive Queue Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-750 bg-gray-50/40 dark:bg-gray-800/20 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono whitespace-nowrap font-sans">
                  <th className="p-3 pl-4">{language === 'hi' ? 'संदर्भ आईडी' : 'Ref ID'}</th>
                  <th className="p-3">{language === 'hi' ? 'नाम / संदर्भ' : 'Ref Name'}</th>
                  <th className="p-3">{language === 'hi' ? 'प्रकार' : 'Type'}</th>
                  <th className="p-3">{language === 'hi' ? 'खाता विवरण' : 'Accounting Details'}</th>
                  <th className="p-3">{language === 'hi' ? 'सिंक स्थिति' : 'Conflict Status'}</th>
                  <th className="p-3">{language === 'hi' ? 'बदलाव का कारण' : 'Ingestion Alert / Reason'}</th>
                  <th className="p-3">{language === 'hi' ? 'समानता मैच' : 'Auto-Map Match'}</th>
                  <th className="p-3">{language === 'hi' ? 'अंतिम संशोधन समय' : 'Last Local Capture'}</th>
                  <th className="p-3 pr-4 text-right">{language === 'hi' ? 'क्रियाएँ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-750 font-sans">
                {filteredQueue.map((item) => {
                  const isEditing = editingId === item.id;
                  
                  // Setup type badges
                  let typeColor = 'bg-blue-50 text-blue-600 border-blue-200/30';
                  let TypeIcon = FileText;
                  if (item.type === 'party') {
                    typeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200/30';
                    TypeIcon = Layers;
                  } else if (item.type === 'ledger') {
                    typeColor = 'bg-purple-50 text-purple-600 border-purple-200/30';
                    TypeIcon = Database;
                  } else if (item.type === 'item') {
                    typeColor = 'bg-amber-50 text-amber-600 border-amber-200/30';
                    TypeIcon = Info;
                  }

                  // Setup status badges
                  let statusBadgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400';
                  let statusLabel = 'Created Offline';
                  if (item.status === 'offline_modified') {
                    statusBadgeColor = 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-450';
                    statusLabel = 'Modified Offline';
                  } else if (item.status === 'diff_detected') {
                    statusBadgeColor = 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400';
                    statusLabel = 'Database Match Alert';
                  }

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors text-xs">
                      
                      {/* Ref ID Column */}
                      <td className="p-3 pl-4 whitespace-nowrap">
                        <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-550 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                      </td>

                      {/* Name / Reference Column */}
                      <td className="p-3 whitespace-nowrap">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editingName} 
                            onChange={(e) => setEditingName(e.target.value)}
                            className="block w-48 border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-900 p-1 text-xs font-semibold rounded text-gray-900 dark:text-white"
                          />
                        ) : (
                          <span className="font-bold text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                        )}
                      </td>

                      {/* Type Column */}
                      <td className="p-3 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${typeColor}`}>
                          <TypeIcon className="w-3 h-3 shrink-0" />
                          <span>{item.type}</span>
                        </div>
                      </td>

                      {/* Accounting Details Column */}
                      <td className="p-3 whitespace-nowrap">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editingDetails} 
                            onChange={(e) => setEditingDetails(e.target.value)}
                            className="block w-64 border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-900 p-1 text-xs rounded text-gray-900 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-sm block">
                            {item.details}
                          </span>
                        )}
                      </td>

                      {/* Conflict Status Column */}
                      <td className="p-3 whitespace-nowrap">
                        <div className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded ${statusBadgeColor}`}>
                          {statusLabel}
                        </div>
                      </td>

                      {/* Ingestion Alert / Reason Column */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex gap-1.5 items-center">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            {item.reason}
                          </span>
                        </div>
                      </td>

                      {/* Auto-Map Match Column */}
                      <td className="p-3 whitespace-nowrap">
                        {item.confidence ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.confidence}%</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600 font-bold">-</span>
                        )}
                      </td>

                      {/* Last Captures Column */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-gray-400 dark:text-gray-550 font-mono text-[10px]">
                          {item.lastModified}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="p-3 pr-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isEditing ? (
                            <>
                              <button 
                                onClick={() => saveInlineEdit(item.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg cursor-pointer"
                                title="Save changes"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingId(null)}
                                className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                                title="Cancel editing"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startInlineEdit(item)}
                                className="p-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-700/30 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-all cursor-pointer"
                                title={language === 'hi' ? 'संशोधित करें' : 'Edit item detail'}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => executeReplication([item], false)}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-105 active:bg-blue-110 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-0.5 select-none"
                                title="Synchronize single item"
                              >
                                <RefreshCw className="w-3 h-3 text-blue-500 shrink-0" />
                                <span>{language === 'hi' ? 'सिंक' : 'Sync'}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="p-1 bg-rose-50/10 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 rounded-lg transition-all cursor-pointer"
                                title={language === 'hi' ? 'हटाएं' : 'Delete item'}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Sync Backdrop & Modal Dialogue Processing Engine */}
      {isSyncing && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-5 space-y-4 relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                <RefreshCw className="w-5 h-5 animate-spin shrink-0" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white leading-normal">
                  {language === 'hi' ? 'सुरक्षित प्रतिकृति सिंक्रनाइज़ेशन चालू...' : 'Secure Replication In Progress...'}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                  {language === 'hi' 
                    ? 'स्थानीय ऑफ़लाइन बफ़र को सुरक्षित क्लाउड लेज़र से समन्वित किया जा रहा है।' 
                    : 'Tunneling client delta storage logs to persistent database repositories safely.'
                  }
                </p>
              </div>
            </div>

            {/* Simulated progress slider bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400 font-mono">
                <span>{language === 'hi' ? 'स्थानांतरण प्रगति:' : 'REPLICATION PROGRESS'}</span>
                <span>{syncPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                  style={{ width: `${syncPercentage}%` }}
                />
              </div>
            </div>

            {/* Dynamic Real-time log logs console output */}
            <div className="bg-slate-950 text-slate-100/90 rounded-xl p-3 text-[10px] font-mono space-y-1 max-h-52 overflow-y-auto border border-gray-800/80 scrollbar-thin scrollbar-thumb-gray-800">
              {syncLogs.map((log, i) => (
                <div key={i} className="flex gap-1">
                  <span className="text-gray-500 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="h-1 animate-pulse bg-blue-500 w-1 rounded" />
            </div>

            {/* Compliance message */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl flex gap-2 items-center text-[10px] text-gray-500 dark:text-gray-400 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{language === 'hi' ? 'सुरक्षित प्रमाणीकरण SSL टनल अधिकृत।' : 'Bharat Book Secure SSL Tunnel Auth Validated.'}</span>
            </div>

          </div>
        </div>
      )}

      {/* Warning Notice Frame */}
      <div className="bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/10 dark:border-amber-400/10 rounded-2xl p-4 flex gap-3.5 items-start">
        <AlertTriangle className="w-5 h-5 text-amber-550 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-[11px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest font-mono">
            {language === 'hi' ? 'ऑफलाइन संरक्षण और डेटा अखंडता' : 'Offline Buffer Replication Policy'}
          </h5>
          <p className="text-xs text-amber-700/95 dark:text-amber-300/80 font-medium leading-relaxed">
            {language === 'hi'
              ? 'अखंडता सुरक्षा नीति प्रविष्टियों को अस्थायी स्थानीय स्तर पर सुरक्षित रखती है ताकि बिना नेटवर्क रुकावट के काम चलता रहे।'
              : 'Our replication architecture holds local transactions securely in internal memory so that your branch accounting offices can work unfailingly during complete network downtime.'
            }
          </p>
        </div>
      </div>

    </div>
  );
};
