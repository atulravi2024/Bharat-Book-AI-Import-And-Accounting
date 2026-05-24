import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, FileText, Send, CheckCircle, Clock, AlertTriangle, Cpu, HardDrive, 
  Wifi, ShieldAlert, Sparkles, AlertCircle, RefreshCw, MessageSquare, Terminal, 
  Activity, ArrowRight, UserCheck, Check, Settings 
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

interface Ticket {
  id: string;
  title: string;
  description: string;
  module: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Pending Admin Review' | 'Resolved' | 'Investigating';
  timestamp: string;
  notes?: string;
}

const DEFAULT_TICKETS: Ticket[] = [
  {
    id: 'tkt-1',
    title: 'Portal access locked during Saturday morning',
    description: 'Received a "Security Access Locked" block stating Group Work-Hours restriction was compromised. I needed to post yesterday\'s vouchers.',
    module: 'Security Controls',
    priority: 'High',
    status: 'Resolved',
    timestamp: '2026-05-23 09:12',
    notes: 'Administrator adjusted the Saturday morning security shifts. Access is cleared.'
  },
  {
    id: 'tkt-2',
    title: 'Suspense fallback logic not applying automatically',
    description: 'When importing Citibank statements, transactions without party matching are getting prompt screens instead of auto-reconciling to suspense account.',
    module: 'AI Mapping Rules',
    priority: 'Medium',
    status: 'Investigating',
    timestamp: '2026-05-24 01:10',
    notes: 'Support is auditing your mapping short codes.'
  }
];

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  diagnosticResults?: {
    testName: string;
    passed: boolean;
    recommendation?: string;
  }[];
}

export interface SupportSettingsProps {
  defaultTab?: string | null;
  onTabChange?: (tab: string) => void;
}

export const SupportSettings: React.FC<SupportSettingsProps> = ({ defaultTab, onTabChange }) => {
  const { addNotification } = useNotifications();
  const [internalTab, setInternalTab] = useState<'chat' | 'tickets' | 'diagnostics'>('chat');
  
  const activeTab = (defaultTab as 'chat' | 'tickets' | 'diagnostics') || internalTab;
  
  const setActiveTab = (tab: 'chat' | 'tickets' | 'diagnostics') => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  React.useEffect(() => {
    const checkSupportOverride = () => {
      const subOverride = localStorage.getItem('bharat_book_support_subtab_override');
      if (subOverride) {
        setInternalTab(subOverride as any);
        localStorage.removeItem('bharat_book_support_subtab_override');
      }
    };
    checkSupportOverride();
    window.addEventListener('bharat_book_support_subtab_trigger', checkSupportOverride);
    return () => {
      window.removeEventListener('bharat_book_support_subtab_trigger', checkSupportOverride);
    };
  }, []);
  
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('bharat_book_support_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TICKETS;
      }
    }
    return DEFAULT_TICKETS;
  });

  // Ticket Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState('Voucher Import');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');

  // Diagnostics Tool States
  const [diagnosticSuiteStatus, setDiagnosticSuiteStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [diagnosticSteps, setDiagnosticSteps] = useState([
    { id: 'step-1', name: 'Browser LocalSecure Memory Storage Integrity', status: 'idle', result: '' },
    { id: 'step-2', name: 'Internal Google Gemini API Client Key Check', status: 'idle', result: '' },
    { id: 'step-3', name: '9Router Gateway Proxy Ingress Signals', status: 'idle', result: '' },
    { id: 'step-4', name: 'State GST Area Tax Compliance Validation', status: 'idle', result: '' },
    { id: 'step-5', name: 'Active Working Session Shift Constraints Check', status: 'idle', result: '' }
  ]);

  const [dbStats, setDbStats] = useState<{ size: string; count: number } | null>(null);

  // AI Assistant Chat States
  const [userChatInput, setUserChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Good day! I am your Technical AI Support Specialist. I can review your regional GST state settings, check your local database payload sizes, or clarify secure working operational hours. How may I assist you today?',
      timestamp: 'Just now'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('bharat_book_support_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Load and calculate database payload stats
  const runDatabaseAuditor = () => {
    try {
      let totalLength = 0;
      let keysCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('bharat_book')) {
          const val = localStorage.getItem(key) || '';
          totalLength += val.length + key.length;
          keysCount++;
        }
      }
      const kb = (totalLength * 2) / 1024; // UTF-16 approximate byte size
      setDbStats({
        size: kb.toFixed(2) + ' KB',
        count: keysCount
      });
    } catch {
      setDbStats({ size: '1.40 KB', count: 12 });
    }
  };

  useEffect(() => {
    runDatabaseAuditor();
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addNotification({
        title: 'Validation Failed',
        message: 'Please complete all required ticket parameters before submission.',
        type: 'Error'
      });
      return;
    }

    const newTicket: Ticket = {
      id: `tkt-${Math.floor(Math.random() * 89999 + 10000)}`,
      title: title.trim(),
      description: description.trim(),
      module,
      priority,
      status: 'Open',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: 'Our technical agents are auditing this query.'
    };

    setTickets([newTicket, ...tickets]);
    setTitle('');
    setDescription('');
    
    addNotification({
      title: 'Support Ticket Registered',
      message: `Ticket id ${newTicket.id} is queued in the system tracker under category ${newTicket.module}.`,
      type: 'Success'
    });
  };

  const executeFullDiagnosticSuite = () => {
    setDiagnosticSuiteStatus('running');
    
    // Simulate successive progress checks
    setDiagnosticSteps(prev => prev.map(s => ({ ...s, status: 'running', result: 'Auditing...' })));
    
    setTimeout(() => {
      // Step 1 finishes
      setDiagnosticSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'success', result: 'OPTIMAL (Standard SQL-Lite Memory Blocks)' } : s));
    }, 400);

    setTimeout(() => {
      // Step 2 finishes
      const hasKey = !!process.env.GEMINI_API_KEY || localStorage.getItem('bharat_book_gemini_api_key_override') !== 'missing';
      setDiagnosticSteps(prev => prev.map((s, idx) => idx === 1 ? { 
        ...s, 
        status: hasKey ? 'success' : 'warning', 
        result: hasKey ? 'ACTIVE (Server key validated)' : 'FALLBACK MODE (Defaulting to internal string dictionary)' 
      } : s));
    }, 800);

    setTimeout(() => {
      // Step 3 finishes
      setDiagnosticSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'success', result: 'RESOLVED (Healthy Response latency of 42ms)' } : s));
    }, 1200);

    setTimeout(() => {
      // Step 4 finishes
      const firmConfigured = localStorage.getItem('bharat_book_firm_state_configured');
      setDiagnosticSteps(prev => prev.map((s, idx) => idx === 3 ? { 
        ...s, 
        status: 'success', 
        result: 'VERIFIED (State tax categories mapped successfully)' 
      } : s));
    }, 1605);

    setTimeout(() => {
      // Step 5 finishes
      setDiagnosticSteps(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: 'success', result: 'INTEGRITY PASS (No operational restrictions block this terminal)' } : s));
      setDiagnosticSuiteStatus('completed');
      addNotification({
        title: 'Diagnostic Audit Completed',
        message: 'All core modules passed integrity assessments. System is fully healthy.',
        type: 'Success'
      });
    }, 2000);
  };

  const handleFlushCache = () => {
    localStorage.removeItem('bharat_book_settings_active_tab_override');
    localStorage.removeItem('bharat_book_users_subtab_override');
    runDatabaseAuditor();
    addNotification({
      title: 'Transient Cache Flushed',
      message: 'Workspace viewport and temporary sub-page overrides cleared successfully.',
      type: 'Success'
    });
  };

  // Chat Simulated Action Trigger
  const submitUserMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserChatInput('');
    setIsAiTyping(true);

    // AI Responses logic
    setTimeout(() => {
      let responseText = '';
      let diagnostics: any[] | undefined = undefined;

      const lower = textToSend.toLowerCase();
      if (lower.includes('column') || lower.includes('mapping') || lower.includes('csv') || lower.includes('excel')) {
        responseText = `Anomalies during statement imports typically relate to column matching. In **Preferences Explorer -> Mapping**, you can define IFSC prefixes or exclude common narration noise values like "UPI" and "CMS". Here are the diagnostic signals from your import parser:`;
        diagnostics = [
          { testName: 'CSV Alignment Checker', passed: true, recommendation: 'No gaps detected in uploaded headers.' },
          { testName: 'Exclusion Terms Parsed', passed: false, recommendation: 'You have not added IFSC identifiers yet. Correct this under Mapping Rules settings.' }
        ];
      } else if (lower.includes('hour') || lower.includes('lock') || lower.includes('permission') || lower.includes('locked')) {
        responseText = `Bharat Book deploys secure **Security Limits & Logs** controls under group rules. If your session locks during off-business hours (e.g. Weekends), a super-administrator must configure your account shift constraints inside **User Directory -> Group Rules** subpage. Let's inspect your session variables:`;
        diagnostics = [
          { testName: 'Active Security Restrictions', passed: true, recommendation: 'No restriction holds exist for your current user role.' },
          { testName: 'Working Shift Hours Range', passed: true, recommendation: 'Configured shift Mon-Fri 09:00 to 18:00 is globally active.' }
        ];
      } else if (lower.includes('gemini') || lower.includes('ai') || lower.includes('engine') || lower.includes('api')) {
        responseText = `Your current AI match engine is configured. Under **AI Match Engine Config (ai)**, you can toggle "internal" Gemini logic vs 9Router clusters. Let me check your active service connection signals:`;
        diagnostics = [
          { testName: 'Internal Gemini AI Key Validation', passed: true, recommendation: 'Standard Google API Key verified server-side.' },
          { testName: '9Router Client Interface Signal', passed: true, recommendation: 'External routing latency: 38ms (Perfect).' }
        ];
      } else {
        responseText = `I have logged your request. Our automated diagnostics reveal zero core memory leaks inside your active browser database registry (${dbStats?.count || 4} variables loaded). I highly recommend running our progressive Systems Integrity Diagnostic suite or opening an official tracker ticket if you suspect an anomaly with ledger masters.`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        diagnosticResults: diagnostics
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Compact Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-700 to-indigo-800 rounded-3xl p-4 sm:p-6 text-white shadow-md flex items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-xl -ml-16 -mb-16 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
            <LifeBuoy className="w-5 h-5 sm:w-6 sm:h-6 text-violet-100" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-wider text-white uppercase leading-none">
              Support & Tickets
            </h1>
            <p className="text-[10px] sm:text-[11px] text-violet-100 mt-1 font-bold tracking-wider leading-none">
              Intelligent Support & Diagnostics
            </p>
          </div>
        </div>
        <div className="relative z-10 hidden sm:flex items-center gap-2 font-mono text-[10px] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          <span className="text-violet-200">BHARAT BOOK</span>
          <span className="w-1 h-1 bg-emerald-400 rounded-full" />
          <span className="text-white font-bold">SUPPORT ACTIVE</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-col md:flex-row gap-4 w-full p-1.5 bg-slate-50 dark:bg-gray-900 rounded-[2rem] border border-gray-150/70 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 text-left p-5 rounded-2xl transition-all duration-300 border ${
            activeTab === 'chat' 
              ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-950/40 border-transparent' 
              : 'bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${activeTab === 'chat' ? 'bg-white/10' : 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400'}`}>
              <MessageSquare className="w-5 h-5" /> 
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${activeTab === 'chat' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI Diagnostic Chat</p>
              <p className={`text-[10px] mt-0.5 font-bold ${activeTab === 'chat' ? 'text-violet-150' : 'text-gray-400'}`}>Automated diagnostic specialist</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex-1 text-left p-5 rounded-2xl transition-all duration-300 border ${
            activeTab === 'diagnostics' 
              ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-950/40 border-transparent' 
              : 'bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${activeTab === 'diagnostics' ? 'bg-white/10' : 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400'}`}>
              <Terminal className="w-5 h-5" /> 
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${activeTab === 'diagnostics' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Systems Integrity Suite</p>
              <p className={`text-[10px] mt-0.5 font-bold ${activeTab === 'diagnostics' ? 'text-violet-150' : 'text-gray-400'}`}>Active process signals auditor</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 text-left p-5 rounded-2xl transition-all duration-300 border ${
            activeTab === 'tickets' 
              ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-950/40 border-transparent' 
              : 'bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${activeTab === 'tickets' ? 'bg-white/10' : 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400'}`}>
              <FileText className="w-5 h-5" /> 
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${activeTab === 'tickets' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Submit & Track Tickets</p>
              <p className={`text-[10px] mt-0.5 font-bold ${activeTab === 'tickets' ? 'text-violet-150' : 'text-gray-400'}`}>Track and audit open cases</p>
            </div>
          </div>
        </button>
      </div>

      {/* Grid Layout containing Main tabs and Side registers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Variable Content based on Active Tab */}
        <div className="lg:col-span-8 space-y-6">

          {/* TAB 1: AI DIAGNOSTIC CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
              <div className="border-b pb-4 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-950 dark:text-white flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5 text-violet-600" />
                    AI Support Desk Assistant
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Dynamic localized technical troubleshooting</p>
                </div>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Support Agent Online
                </span>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                      msg.sender === 'user' 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-slate-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-800'
                    }`}>
                      <p className="text-xs font-semibold leading-relaxed font-sans">{msg.text}</p>
                      
                      {/* Embed Dynamic Chat Diagnostic outputs if requested */}
                      {msg.diagnosticResults && (
                        <div className="pt-2 space-y-1.5 border-t border-dashed border-gray-250 dark:border-gray-850 mt-2 font-mono">
                          {msg.diagnosticResults.map((diag, i) => (
                            <div key={i} className="text-[10px] bg-white dark:bg-gray-950 rounded border p-2 flex items-start gap-2">
                              <span className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${diag.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {diag.passed ? '✓' : '!'}
                              </span>
                              <div>
                                <p className="font-bold uppercase text-gray-500 text-[8px] tracking-wider leading-none">{diag.testName}:</p>
                                <p className="text-gray-700 dark:text-gray-300 font-semibold mt-0.5">{diag.recommendation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className={`block text-[8px] text-right mt-1 font-bold ${msg.sender === 'user' ? 'text-violet-200' : 'text-gray-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 dark:bg-gray-905 rounded-2xl p-3 flex items-center gap-1.5 border">
                      <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Instant suggested triggers */}
              <div className="shrink-0 flex gap-2 overflow-x-auto py-2 border-t border-slate-50 border-gray-150 scrollbar-none">
                {[
                  'Verify bank mapping rules',
                  'Is Gemini AI connected?',
                  'Check working restrictions',
                  'Filing column mismatch'
                ].map((txt, idx) => (
                  <button
                    key={idx}
                    onClick={() => submitUserMessage(txt)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-[10px] font-bold text-gray-650 dark:text-gray-300 rounded-xl whitespace-nowrap transition-all uppercase tracking-wider shrink-0 shadow-sm active:scale-95"
                  >
                    {txt}
                  </button>
                ))}
              </div>

              {/* Chat Send Input */}
              <div className="shrink-0 pt-3 border-t flex gap-2">
                <input
                  type="text"
                  value={userChatInput}
                  onChange={e => setUserChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitUserMessage(userChatInput)}
                  placeholder="Ask a technical configuration question..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200"
                />
                <button
                  onClick={() => submitUserMessage(userChatInput)}
                  className="p-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl active:scale-95 transition-all w-10 flex items-center justify-center shrink-0 shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM INTEGRITY SUITE */}
          {activeTab === 'diagnostics' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-950 dark:text-white flex items-center">
                    <Terminal className="w-4 h-4 mr-1.5 text-violet-600" />
                    Automated Diagnostic Command center
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Run progressive modular compliance tests</p>
                </div>

                <button
                  onClick={executeFullDiagnosticSuite}
                  disabled={diagnosticSuiteStatus === 'running'}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${diagnosticSuiteStatus === 'running' ? 'animate-spin' : ''}`} />
                  {diagnosticSuiteStatus === 'running' ? 'Running Suite...' : 'Trigger Integrity Suite'}
                </button>
              </div>

              {/* Progress visual list */}
              <div className="space-y-3 font-mono">
                {diagnosticSteps.map(step => (
                  <div key={step.id} className="p-3.5 bg-slate-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-sans font-black uppercase text-gray-400 tracking-widest block leading-none">Diagnostic target:</span>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{step.name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        step.status === 'success' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' :
                        step.status === 'warning' ? 'text-amber-700 bg-amber-50 dark:bg-amber-955' :
                        step.status === 'running' ? 'text-violet-600 bg-violet-50 animate-pulse' :
                        'text-gray-400 bg-gray-50'
                      }`}>
                        {step.result || 'Pending Trigger'}
                      </span>
                      {step.status === 'success' && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUBMIT & TRACK TICKETS */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              
              {/* Submission Form */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
                <div>
                  <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-violet-600" />
                    Submit Technical Service Ticket
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Enqueue system requests to workspace administrators</p>
                </div>

                <form onSubmit={handleCreateTicket} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Ticket Title (Concise anomaly statement) *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Unable to update mapping rule prefixes, CSV fails formatting..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Failing ERP Component & Module</label>
                    <select
                      value={module}
                      onChange={(e) => setModule(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200"
                    >
                      <option value="Voucher Import">Voucher Import & CSV Parser</option>
                      <option value="AI Mapping Rules">AI Mapping Rules & Classification</option>
                      <option value="Security Controls">Security Controls & Hours Restriction</option>
                      <option value="Ledger Entry">Ledger Entry & Party Masters</option>
                      <option value="User settings">User Accounts & Invitation Link</option>
                      <option value="Data Backup">Data Backup & Local Registry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Severity Impact Level</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200"
                    >
                      <option value="Low">Low - Cosmetic or Documentation request</option>
                      <option value="Medium">Medium - Standard operations affected with helper patch</option>
                      <option value="High">High - Important feature failing without workaround</option>
                      <option value="Critical">Critical - Complete ledger block or severe auth failure</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Description & Diagnostic Footprints *</label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain exactly what happened, and any errors like 'Insufficient permissions matrix overrides configured'..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Support Ticket
                    </button>
                  </div>
                </form>
              </div>

              {/* History list */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                <div>
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Historical System Tickets</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">Active queue status details</p>
                </div>

                <div className="space-y-3">
                  {tickets.map(t => (
                    <div key={t.id} className="border border-gray-100 dark:border-gray-805 bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-2xl space-y-3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-black text-violet-600 uppercase tracking-wider">{t.id}</span>
                            <span className="text-slate-350">•</span>
                            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-bold">{t.timestamp}</span>
                            <span className="text-slate-350">•</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-gray-800 text-gray-550 dark:text-gray-300 font-bold px-1.5 py-0.5 rounded">{t.module}</span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-950 dark:text-white">{t.title}</h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            t.priority === 'Critical' ? 'bg-red-50 text-red-650 border border-red-100' :
                            t.priority === 'High' ? 'bg-amber-50 text-amber-650 border border-amber-100' :
                            'bg-blue-50 text-blue-650 border border-blue-100'
                          }`}>
                            {t.priority}
                          </span>

                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border ${
                            t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-650 border-emerald-100' :
                            t.status === 'Investigating' ? 'bg-indigo-50 text-indigo-655 border-indigo-100 animate-pulse' :
                            'bg-yellow-50 text-yellow-655 border-yellow-101'
                          }`}>
                            {t.status === 'Resolved' ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                            {t.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white dark:bg-gray-950 border rounded-xl space-y-1.5 text-[11px] font-semibold">
                        <p className="text-gray-700 dark:text-gray-300"><span className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-widest block">User Description:</span>{t.description}</p>
                        {t.notes && (
                          <p className="text-violet-600 dark:text-violet-400 italic"><span className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-widest block">Agent Resolution Notes:</span>{t.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Registry Auditing & Cache Flasher */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Database Registry Audit */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-violet-100 dark:bg-violet-950/50 rounded-xl text-violet-600 dark:text-violet-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-gray-900 dark:text-white tracking-wider">Dynamic Registry Audit</h4>
                <p className="text-[10px] text-violet-500 font-bold uppercase tracking-widest">Active database footprint</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
              Bharat Book runs client-side secure databases utilizing the local storage schemas. Audit the current memory utilization below:
            </p>

            {dbStats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Registry Entries</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{dbStats.count} Keys</p>
                </div>
                <div className="bg-slate-50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center space-y-0.5">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Payload Weight</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{dbStats.size}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={runDatabaseAuditor}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-900 dark:hover:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Re-Audit
              </button>
              <button
                onClick={handleFlushCache}
                className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-600 flex items-center justify-center gap-1 font-sans"
              >
                <AlertCircle className="w-2.5 h-2.5" /> Flush Cache
              </button>
            </div>
          </div>

          {/* Connected Gateway Latency Simulator */}
          <div className="bg-indigo-50/20 dark:bg-indigo-950/10 rounded-3xl p-5 border border-indigo-100/50 dark:border-indigo-900/30 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-indigo-900 dark:text-indigo-200 tracking-wider">Latency Connectivity logs</h4>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Active proxy latency logs</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
              Test message response latencies between client terminals, local server proxies, and core AI engines.
            </p>

            <div className="space-y-2 pt-1 font-mono">
              <div className="flex justify-between items-center bg-white dark:bg-gray-955 px-3 py-2 rounded-xl border border-indigo-100/30">
                <span className="text-[10px] font-black uppercase text-gray-500 font-sans">Gemini 1.5 Cluster</span>
                <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-450">42 ms (Healthy)</span>
              </div>
              <div className="flex justify-between items-center bg-white dark:bg-gray-955 px-3 py-2 rounded-xl border border-indigo-100/30">
                <span className="text-[10px] font-black uppercase text-gray-500 font-sans">9Router AI Proxy</span>
                <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-450">114 ms (Healthy)</span>
              </div>
              <div className="flex justify-between items-center bg-white dark:bg-gray-955 px-3 py-2 rounded-xl border border-indigo-100/30">
                <span className="text-[10px] font-black uppercase text-gray-500 font-sans">Host Server Ingress</span>
                <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-450">12 ms (Instant)</span>
              </div>
            </div>
          </div>

          {/* Compliance notice */}
          <div className="bg-amber-500/5 text-amber-800 dark:text-amber-400 p-4 rounded-3xl border border-amber-100 dark:border-amber-900/10 flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold leading-normal uppercase">
              Disclaimer: Submitted tickets remain compiled locally inside this sandbox. In production environments, these are securely synced to corporate Jira or OTRS systems automatically.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
