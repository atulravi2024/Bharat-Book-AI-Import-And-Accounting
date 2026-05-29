import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Plus, Clock, AlertTriangle, AlertCircle, FileText, Send, ChevronDown, ChevronRight, X, Download, Upload, CheckCircle } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';

interface Ticket {
  id: string;
  title: string;
  description: string;
  module: string;
  priority: string;
  status: string;
  timestamp: string;
  history: { date: string, note: string, author: string }[];
}

export const TicketsTab = () => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showNewSection, setShowNewSection] = useState(false);
  const [showTicketsList, setShowTicketsList] = useState(true);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const [newTicket, setNewTicket] = useState({
    title: '', description: '', module: 'General', priority: 'Medium'
  });

  const [showHistory, setShowHistory] = useState<Record<string, boolean>>({});

  const toggleHistory = (id: string) => {
    setShowHistory(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const saved = localStorage.getItem('ai_support_tickets');
    if (saved) {
      setTickets(JSON.parse(saved));
    } else {
      const dummy: Ticket[] = [
        {
          id: 'TKT-1002',
          title: 'Bank sync disconnecting frequently',
          description: 'The bank sync module disconnects every 2 hours and requires re-authentication. Please investigate.',
          module: 'Banking',
          priority: 'High',
          status: 'Open',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          history: [{ date: new Date(Date.now() - 80000000).toISOString(), note: 'We have identified an upstream rate limit issue and are actively patching it.', author: 'Support Agent' }]
        },
        {
          id: 'TKT-1001',
          title: 'How to export GST report?',
          description: 'I need to export GSTR-1 in JSON format but only see Excel.',
          module: 'Reports',
          priority: 'Low',
          status: 'Resolved',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          history: [{ date: new Date(Date.now() - 170000000).toISOString(), note: 'The JSON export feature is currently located inside the precise "GSTR-1" view under the top-right export menu.', author: 'Support Agent' }]
        }
      ];
      setTickets(dummy);
      localStorage.setItem('ai_support_tickets', JSON.stringify(dummy));
    }
  }, []);

  const saveTickets = (updated: Ticket[]) => {
    setTickets(updated);
    localStorage.setItem('ai_support_tickets', JSON.stringify(updated));
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title.trim()) return;
    const t: Ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicket.title,
      description: newTicket.description,
      module: newTicket.module,
      priority: newTicket.priority,
      status: 'Open',
      timestamp: new Date().toISOString(),
      history: []
    };
    saveTickets([t, ...tickets]);
    setShowNewSection(false);
    setSelectedTicket(t.id);
    setNewTicket({ title: '', description: '', module: 'General', priority: 'Medium' });
  };

  const handleAddNote = (ticketId: string) => {
    const text = noteInputs[ticketId];
    if (!text || !text.trim()) return;

    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, history: [...t.history, { date: new Date().toISOString(), note: text, author: 'You' }] };
      }
      return t;
    });
    saveTickets(updated);
    setNoteInputs({ ...noteInputs, [ticketId]: '' });
  };

  const handleExport = () => {
    let data = '';
    let mimeType = '';
    let extension = '';

    if (exportFormat === 'json') {
      data = JSON.stringify(tickets, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      const headers = ['id', 'title', 'description', 'module', 'priority', 'status', 'timestamp', 'history'];
      const rows = tickets.map(t => {
        return headers.map(h => {
          let val = (t as any)[h];
          if (typeof val === 'object') val = JSON.stringify(val);
          val = String(val || '').replace(/"/g, '""');
          return `"${val}"`;
        }).join(',');
      });
      data = [headers.join(','), ...rows].join('\n');
      mimeType = 'text/csv';
      extension = 'csv';
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support_tickets_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification({ title: 'Export Generated', message: `Tickets exported successfully as ${extension.toUpperCase()}`, type: 'Alert' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.toLowerCase().endsWith('.csv');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let imported: any[] = [];
        const content = event.target?.result as string;

        if (isCSV) {
          const result: any[] = [];
          let row: string[] = [];
          let inQuotes = false;
          let val = '';
          
          for (let i = 0; i < content.length; i++) {
            const c = content[i];
            const nextCode = content[i+1];
            if (inQuotes) {
              if (c === '"' && nextCode === '"') {
                val += '"';
                i++;
              } else if (c === '"') {
                inQuotes = false;
              } else {
                val += c;
              }
            } else {
              if (c === '"') {
                inQuotes = true;
              } else if (c === ',') {
                row.push(val);
                val = '';
              } else if (c === '\n' || c === '\r') {
                row.push(val);
                val = '';
                if (row.length > 0 && row.some(x => x)) result.push(row);
                row = [];
                if (c === '\r' && nextCode === '\n') i++;
              } else {
                val += c;
              }
            }
          }
          row.push(val);
          if (row.length > 0 && row.some(x => x)) result.push(row);
          
          const headers = result[0] || [];
          imported = result.slice(1).map(r => {
            const obj: any = {};
            headers.forEach((h: string, idx: number) => {
              let parsedVal = r[idx];
              if (h.trim() === 'history') {
                try { parsedVal = JSON.parse(parsedVal); } catch (e) { parsedVal = []; }
              }
              obj[h.trim()] = parsedVal;
            });
            return obj;
          });
        } else {
          imported = JSON.parse(content);
        }

        if (Array.isArray(imported)) {
          const merged = [...imported, ...tickets];
          const unique = merged.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
          const validTickets = unique.map(t => ({
            id: t.id || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            title: t.title || 'Untitled',
            description: t.description || '',
            module: t.module || 'General',
            priority: t.priority || 'Medium',
            status: t.status || 'Open',
            timestamp: t.timestamp || new Date().toISOString(),
            history: Array.isArray(t.history) ? t.history : []
          }));
          saveTickets(validTickets);
          addNotification({ title: 'Import Successful', message: `Imported ${imported.length} tickets successfully`, type: 'Alert' });
        }
      } catch (err) {
        addNotification({ title: 'Import Failed', message: 'Failed to import tickets. Invalid format.', type: 'Alert' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  let activeTickets = tickets.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()));

  activeTickets.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (sortBy === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    if (sortBy === 'priority_high') {
        const pMap: Record<string, number> = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    }
    if (sortBy === 'priority_low') {
        const pMap: Record<string, number> = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return (pMap[a.priority] || 0) - (pMap[b.priority] || 0);
    }
    if (sortBy === 'status_open') return a.status.localeCompare(b.status);
    if (sortBy === 'status_closed') return b.status.localeCompare(a.status);
    if (sortBy === 'module_az') return a.module.localeCompare(b.module);
    if (sortBy === 'module_za') return b.module.localeCompare(a.module);
    if (sortBy === 'title_az') return a.title.localeCompare(b.title);
    if (sortBy === 'title_za') return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-6 pt-2">
      {/* Create Ticket Collapsible Section */}
      <div className="border border-blue-100 dark:border-blue-900/50 rounded-2xl bg-white dark:bg-gray-800/80 overflow-hidden shadow-sm transition-all">
        <div 
           className="p-3 md:p-4 cursor-pointer flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
           onClick={() => setShowNewSection(!showNewSection)}
        >
           <div>
             <h3 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 text-sm md:text-base">
               <Plus className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" /> 
               {t("Submit New Support Ticket")}
             </h3>
             <p className="text-[10px] md:text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5 ml-6 md:ml-7">{t("Open a new request to get help from our agents.")}</p>
           </div>
           <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm">
             {showNewSection ? <ChevronDown className="w-4 h-4 text-blue-600"/> : <ChevronRight className="w-4 h-4 text-blue-600"/>}
           </div>
        </div>
        {showNewSection && (
           <form onSubmit={handleCreateTicket} className="p-4 md:p-5 space-y-4 border-t border-blue-100 dark:border-blue-900/50">
             <div>
               <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t("Subject")}</label>
               <input required type="text" value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium" placeholder="E.g. Cannot access supplier ledger..." />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t("Module")}</label>
                 <select value={newTicket.module} onChange={e => setNewTicket({...newTicket, module: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium text-gray-700 dark:text-gray-300">
                   <option>{t("General")}</option>
                   <option>{t("Accounting")}</option>
                   <option>{t("Inventory")}</option>
                   <option>{t("Reports")}</option>
                   <option>{t("Banking")}</option>
                   <option>{t("Settings")}</option>
                 </select>
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t("Priority")}</label>
                 <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium text-gray-700 dark:text-gray-300">
                   <option>{t("Low")}</option>
                   <option>{t("Medium")}</option>
                   <option>{t("High")}</option>
                   <option>{t("Critical")}</option>
                 </select>
               </div>
             </div>
             <div>
               <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t("Description")}</label>
               <textarea required rows={3} value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium resize-none resize-y" placeholder="Please provide detailed steps to reproduce the issue..." />
             </div>
             <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewSection(false)} className="px-4 py-1.5 font-bold text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">{t("Cancel")}</button>
                <button type="submit" className="px-4 py-1.5 font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">{t("Submit Ticket")}</button>
             </div>
           </form>
        )}
      </div>

      {/* Existing Tickets List - Accordion Style */}
      <div className="border border-blue-100 dark:border-blue-900/50 rounded-2xl bg-white dark:bg-gray-800/80 overflow-hidden shadow-sm transition-all">
        <div 
           className="p-3 md:p-4 cursor-pointer flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
           onClick={() => setShowTicketsList(!showTicketsList)}
        >
           <div>
             <h3 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 text-sm md:text-base">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" /> 
                {t("My Tickets")}
             </h3>
             <p className="text-[10px] md:text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5 ml-6 md:ml-7">{t("View and manage your support history.")}</p>
           </div>
           <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm">
             {showTicketsList ? <ChevronDown className="w-4 h-4 text-blue-600"/> : <ChevronRight className="w-4 h-4 text-blue-600"/>}
           </div>
        </div>

        {showTicketsList && (
          <div className="p-4 md:p-5 border-t border-blue-100 dark:border-blue-900/50 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
               <div className="w-full md:w-auto flex-1">
                 <input 
                   type="text"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   placeholder="Search tickets..."
                   className="w-full bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 shadow-sm"
                 />
               </div>
               <div className="flex w-full md:w-auto gap-2">
                 <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="flex-1 md:flex-none bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 shadow-sm min-w-0 md:min-w-[140px]">
                   <option value="newest">{t("Newest First")}</option>
                   <option value="oldest">{t("Oldest First")}</option>
                   <option value="priority_high">Priority (Highest)</option>
                   <option value="priority_low">Priority (Lowest)</option>
                   <option value="status_open">{t("Status: Open")}</option>
                   <option value="status_closed">{t("Status: Closed")}</option>
                   <option value="module_az">Module (A-Z)</option>
                   <option value="module_za">Module (Z-A)</option>
                   <option value="title_az">Title (A-Z)</option>
                   <option value="title_za">Title (Z-A)</option>
                 </select>
                 <select value={exportFormat} onChange={e => setExportFormat(e.target.value as 'json' | 'csv')} className="flex-1 md:flex-none bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 shadow-sm min-w-0 md:w-[75px]">
                   <option value="json">{t("JSON")}</option>
                   <option value="csv">{t("CSV")}</option>
                 </select>
                 <button onClick={handleExport} title="Export Tickets" className="shrink-0 p-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
                   <Download className="w-4 h-4 md:w-5 md:h-5"/>
                 </button>
                 <div className="relative shrink-0 flex">
                   <button onClick={() => fileInputRef.current?.click()} title="Import Tickets" className="p-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
                     <Upload className="w-4 h-4 md:w-5 md:h-5"/>
                   </button>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept=".json,.csv" onChange={handleImport} />
               </div>
            </div>
            
            {activeTickets.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <AlertCircle className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-xs font-medium">{t("No tickets found matching your search.")}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
            {activeTickets.map(ticket => {
              const isOpen = selectedTicket === ticket.id;
              
              return (
                <div 
                  key={ticket.id} 
                  className={`group transition-colors ${
                    isOpen 
                      ? 'bg-blue-50/40 dark:bg-blue-900/10' 
                      : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {/* Collapsible Ticket Header */}
                  <div 
                    onClick={() => setSelectedTicket(isOpen ? null : ticket.id)}
                    className="p-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-2 sm:gap-4"
                  >
                    <div className="flex-1 min-w-0 flex items-start gap-3">
                       <div className="mt-0.5 shrink-0 w-5 flex justify-center">
                          {ticket.status === 'Resolved' || ticket.status === 'Closed' ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 ring-4 ring-blue-50 dark:ring-blue-900/30" />
                          )}
                       </div>
                       <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400">{ticket.id}</span>
                            <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                              {t(ticket.status)}
                            </span>
                            <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : ticket.priority === 'Medium' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                              {ticket.priority === 'High' || ticket.priority === 'Critical' ? <AlertTriangle className="w-2.5 h-2.5" /> : null}
                              {t(ticket.priority)}
                            </span>
                            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 hidden sm:inline-block ml-1">
                                {t(ticket.module)}
                            </span>
                          </div>
                          <h4 className={`text-sm font-semibold truncate ${isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {ticket.title}
                          </h4>
                          {!isOpen && ticket.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{ticket.description}</p>
                          )}
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-8 sm:pl-0 shrink-0">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        {new Date(ticket.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Ticket Body */}
                  {isOpen && (
                    <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col px-3 sm:px-12 pb-4 pt-2">
                      <div className="py-2">
                        <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                      </div>
                      
                      <div className="py-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                        <div 
                          className="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg -mx-2 px-2 transition-colors select-none"
                          onClick={() => toggleHistory(ticket.id)}
                        >
                          <h5 className="font-semibold text-xs tracking-wide text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            {t("Activity Log")}
                            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full text-[9px] font-bold">{ticket.history.length} updates</span>
                          </h5>
                          {showHistory[ticket.id] ? <ChevronDown className="w-4 h-4 text-gray-400"/> : <ChevronRight className="w-4 h-4 text-gray-400"/>}
                        </div>
                        
                        {showHistory[ticket.id] && (
                          <div className="mt-4 space-y-4 pb-2">
                             {ticket.history.length === 0 ? (
                               <p className="text-[13px] text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {t("No activity yet. A representative will review this shortly.")}
                               </p>
                             ) : (
                               <div className="space-y-4">
                                 {ticket.history.map((h, i) => (
                                   <div key={i} className={`flex flex-col ${h.author === 'You' ? 'items-end' : 'items-start'}`}>
                                     <div className="flex items-baseline gap-1.5 mb-1 px-1">
                                       <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{h.author}</span>
                                       <span className="text-[10px] text-gray-400">{new Date(h.date).toLocaleString([], {hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric'})}</span>
                                     </div>
                                     <div className={`p-3 rounded-2xl max-w-[90%] md:max-w-[85%] text-[13px] leading-relaxed shadow-sm ${
                                       h.author === 'You' 
                                        ? 'bg-blue-600 text-white rounded-br-sm' 
                                        : 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                                     }`}>
                                       {h.note}
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             )}
                          </div>
                        )}
                      </div>

                      {/* Reply Box */}
                      {ticket.status !== 'Resolved' && (
                        <div className="p-3 md:p-4 m-3 md:m-4 mt-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <textarea 
                              rows={1}
                              value={noteInputs[ticket.id] || ''}
                              onChange={e => setNoteInputs({...noteInputs, [ticket.id]: e.target.value})}
                              placeholder="Type a reply..."
                              className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 resize-none min-h-[40px]"
                            />
                            <div className="flex sm:flex-col justify-end">
                              <button 
                                disabled={!(noteInputs[ticket.id] || '').trim()}
                                onClick={() => handleAddNote(ticket.id)}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 sm:px-0 sm:w-10 sm:h-10 bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                <Send className="w-3.5 h-3.5 ml-0.5" />
                                <span className="sm:hidden font-bold text-xs">{t("Reply")}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
};
