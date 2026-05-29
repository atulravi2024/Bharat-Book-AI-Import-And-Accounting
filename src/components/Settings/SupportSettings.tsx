import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Sparkles, Activity, FileText, Send, Clock, AlertTriangle, HardDrive, 
  Wifi, AlertCircle, RefreshCw, MessageSquare, Terminal, 
  Check, Trash2, CheckSquare, Plus, ActivityIcon, CheckCircle
} from 'lucide-react';
import { ChatTab } from './SupportSettingsTabs/ChatTab';
import { IntegrityTab } from './SupportSettingsTabs/IntegrityTab';
import { TicketsTab } from './SupportSettingsTabs/TicketsTab';

interface Ticket {
  id: string;
  title: string;
  description: string;
  module: string;
  priority: string;
  status: string;
  timestamp: string;
  notes?: string;
}

const DEFAULT_TICKETS: Ticket[] = [];

export const SupportSettings: React.FC<any> = ({ defaultTab, onTabChange, aiSettings, setAiSettings }) => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [internalTab, setInternalTab] = useState<'chat' | 'integrity' | 'tickets'>('chat');
  const activeTab = defaultTab === 'diagnostics' ? 'integrity' : (defaultTab || internalTab);
  
  const setActiveTab = (tab: any) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [tickets, setTickets] = useState<Ticket[]>(DEFAULT_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [currentChatInput, setCurrentChatInput] = useState('');
  
  const handleClearChat = () => setChatMessages([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const handleNewTicket = () => {};
  
  const handleSendChatMessage = async (textOverride?: string | React.MouseEvent) => {
    const text = typeof textOverride === 'string' ? textOverride : currentChatInput;
    if (!text.trim() || isAiTyping) return;
    
    // Add user message
    const newMsg = { id: Date.now().toString(), sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev: any) => [...prev, newMsg]);
    setCurrentChatInput('');
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, model: aiSettings?.chatModel || 'gemini-2.5-flash' })
      });
      const data = await response.json();
      
      const aiMsg = {
        id: Date.now().toString() + 'ai',
        sender: 'ai',
        text: data.reply || 'Sorry, an error occurred in the diagnostics server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        diagnosticResults: data.diagnosticResults
      };
      setChatMessages((prev: any) => [...prev, aiMsg]);
    } catch (e) {
      setChatMessages((prev: any) => [...prev, {
        id: Date.now().toString() + 'err',
        sender: 'ai',
        text: "Connection failed. Cannot reach AI server.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };
  const handleKeyPress = (e: any) => {
      if (e.key === 'Enter') handleSendChatMessage();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{t("Support")}</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t("Diagnostic Tools & Issue Tracking")}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2 w-full md:w-auto mt-3 md:mt-0">
          <div className="flex items-center justify-between md:justify-start gap-2 font-mono text-[10px] bg-gray-50 dark:bg-gray-800/50 px-3 py-2 md:py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shrink-0">
            <span className="text-gray-500 dark:text-gray-400 font-semibold">{t("BHARAT BOOK")}</span>
            <div className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-700 pl-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200" />
              <span className="text-gray-700 dark:text-gray-300 font-bold tracking-tight">{t("SECURE MODE")}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 md:flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shrink-0 gap-1 shadow-sm md:shadow-none">
             <button
               onClick={() => setActiveTab('chat')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeTab === 'chat' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Sparkles className="w-3 h-3" /> {t("Chatbot")}
             </button>
             <button
               onClick={() => setActiveTab('integrity')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeTab === 'integrity' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Activity className="w-3 h-3" /> {t("Integrity")}
             </button>
             <button
               onClick={() => setActiveTab('tickets')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeTab === 'tickets' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <FileText className="w-3 h-3" /> {t("Tickets")}
             </button>
          </div>
        </div>
      </div>
      <div>
        {activeTab === 'chat' && <ChatTab 
            chatMessages={chatMessages} isAiTyping={isAiTyping} 
            currentChatInput={currentChatInput} setCurrentChatInput={setCurrentChatInput} 
            handleSendChatMessage={handleSendChatMessage} handleClearChat={handleClearChat} handleKeyPress={handleKeyPress} 
            messagesEndRef={messagesEndRef} 
        />}
        {activeTab === 'integrity' && <IntegrityTab />}
        {activeTab === 'tickets' && <TicketsTab />}
      </div>
    </div>
  );
};
