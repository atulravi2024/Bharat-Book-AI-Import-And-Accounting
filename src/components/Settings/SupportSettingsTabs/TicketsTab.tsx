import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertTriangle, AlertCircle, FileText, Send, ChevronDown, ChevronRight, X } from 'lucide-react';

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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showNewSection, setShowNewSection] = useState(false);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

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

  const activeTickets = tickets.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()));

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
               Submit New Support Ticket
             </h3>
             <p className="text-[10px] md:text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5 ml-6 md:ml-7">Open a new request to get help from our agents.</p>
           </div>
           <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm">
             {showNewSection ? <ChevronDown className="w-4 h-4 text-blue-600"/> : <ChevronRight className="w-4 h-4 text-blue-600"/>}
           </div>
        </div>
        {showNewSection && (
           <form onSubmit={handleCreateTicket} className="p-4 md:p-5 space-y-4 border-t border-blue-100 dark:border-blue-900/50">
             <div>
               <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
               <input required type="text" value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium" placeholder="E.g. Cannot access supplier ledger..." />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Module</label>
                 <select value={newTicket.module} onChange={e => setNewTicket({...newTicket, module: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium text-gray-700 dark:text-gray-300">
                   <option>General</option>
                   <option>Accounting</option>
                   <option>Inventory</option>
                   <option>Reports</option>
                   <option>Banking</option>
                   <option>Settings</option>
                 </select>
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Priority</label>
                 <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium text-gray-700 dark:text-gray-300">
                   <option>Low</option>
                   <option>Medium</option>
                   <option>High</option>
                   <option>Critical</option>
                 </select>
               </div>
             </div>
             <div>
               <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
               <textarea required rows={3} value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium resize-none resize-y" placeholder="Please provide detailed steps to reproduce the issue..." />
             </div>
             <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewSection(false)} className="px-4 py-1.5 font-bold text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-1.5 font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">Submit Ticket</button>
             </div>
           </form>
        )}
      </div>

      {/* Existing Tickets List - Accordion Style */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
           <div>
             <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 text-xl">
                <FileText className="w-6 h-6 text-blue-500" /> My Tickets
             </h3>
             <p className="text-sm text-gray-500 mt-1 mb-0">View and manage your support history.</p>
           </div>
           <div className="w-full sm:w-64">
             <input 
               type="text"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               placeholder="Search tickets..."
               className="w-full bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 shadow-sm"
             />
           </div>
        </div>
        
        {activeTickets.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <AlertCircle className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-sm font-medium">No tickets found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTickets.map(ticket => {
              const isOpen = selectedTicket === ticket.id;
              
              return (
                <div 
                  key={ticket.id} 
                  className={`border rounded-2xl overflow-hidden shadow-sm transition-all ${
                    isOpen 
                      ? 'border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 ring-2 ring-blue-50 dark:ring-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  {/* Collapsible Ticket Header */}
                  <div 
                    onClick={() => setSelectedTicket(isOpen ? null : ticket.id)}
                    className="p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full uppercase">{ticket.id}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                          {ticket.status}
                        </span>
                        <span className="text-xs font-bold text-gray-500 ml-auto md:ml-0">{ticket.module}</span>
                      </div>
                      <h4 className={`font-bold text-sm ${isOpen ? 'text-blue-800 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
                        {ticket.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-4 md:min-w-44">
                      <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(ticket.timestamp).toLocaleDateString()}</span>
                        <span className={`font-bold flex items-center gap-1.5 ${ticket.priority === 'High' ? 'text-red-500' : ticket.priority === 'Medium' ? 'text-orange-500' : 'text-gray-500'}`}>
                          {ticket.priority === 'High' ? <AlertTriangle className="w-3 h-3" /> : ticket.priority === 'Medium' ? <AlertCircle className="w-3 h-3" /> : ''} 
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="p-1 bg-gray-50 dark:bg-gray-800 rounded-full shrink-0">
                        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Ticket Body */}
                  {isOpen && (
                    <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col">
                      <div className="p-4 md:p-5 pb-2">
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Original Request</h5>
                        <p className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg leading-relaxed whitespace-pre-wrap border border-gray-100 dark:border-gray-700 shadow-sm">{ticket.description}</p>
                      </div>
                      
                      <div className="px-4 md:px-5 py-2">
                        <div 
                          className="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg px-2 transition-colors -ml-2 select-none"
                          onClick={() => toggleHistory(ticket.id)}
                        >
                          <h5 className="font-black text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            Activity Log
                            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full text-[9px]">{ticket.history.length} updates</span>
                          </h5>
                          {showHistory[ticket.id] ? <ChevronDown className="w-4 h-4 text-gray-400"/> : <ChevronRight className="w-4 h-4 text-gray-400"/>}
                        </div>
                        
                        {showHistory[ticket.id] && (
                          <div className="mt-3 space-y-4 px-2 pb-2">
                             {ticket.history.length === 0 ? (
                               <p className="text-xs text-gray-500 italic">No activity yet. A representative will review this shortly.</p>
                             ) : (
                               <div className="space-y-4">
                                 {ticket.history.map((h, i) => (
                                   <div key={i} className={`flex flex-col ${h.author === 'You' ? 'items-end' : 'items-start'}`}>
                                     <div className="flex items-baseline gap-1 mb-1 px-1">
                                       <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{h.author}</span>
                                       <span className="text-[9px] text-gray-400">{new Date(h.date).toLocaleString([], {hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric'})}</span>
                                     </div>
                                     <div className={`p-2.5 rounded-xl max-w-[90%] md:max-w-[75%] text-xs shadow-sm ${
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
                                <span className="sm:hidden font-bold text-xs">Reply</span>
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
    </div>
  );
};
