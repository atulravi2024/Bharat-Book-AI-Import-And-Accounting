import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useNotifications } from '../../../context/NotificationContext';
import { 
  Cpu, 
  PlusCircle, 
  Database, 
  Layers, 
  ArrowRight,
  Activity,
  ShieldCheck,
  Archive,
  FileText,
  Sparkles,
  Inbox,
  Lock,
  Plus,
  FolderOpen,
  Settings2,
  ListTodo,
  FileSearch,
  BookOpen,
  PieChart,
  Users,
  LineChart,
  UserCheck
} from 'lucide-react';
import { MainView } from '../../../app/types';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationHubSubpageProps {
  setView: (view: MainView) => void;
  searchTerm?: string;
  onNavigateToSubpage: (subpage: 'telemetry' | 'security' | 'info') => void;
}

export const NavigationHubSubpage: React.FC<NavigationHubSubpageProps> = ({
  setView,
  searchTerm = "",
  onNavigateToSubpage
}) => {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'drafts' | 'archives'>('modules');

  // Selection States for drill-down approach
  const [selectedMainPageId, setSelectedMainPageId] = useState<string | null>(null);
  const [selectedSubpageId, setSelectedSubpageId] = useState<string | null>(null);

  const allTiles = [
    {
      id: 'import',
      title: language === 'hi' ? 'डेटा आयात' : 'Data Import',
      desc: language === 'hi' ? 'Gemini AI की सहायता से PDF, Excel या छवियों को ऑटो-प्रोसेस करें।' : 'Batch ingest & auto-map vouchers, bank statements or GSTR schemas via Gemini AI.',
      icon: Cpu,
      color: 'from-blue-500 to-indigo-600',
      tag: language === 'hi' ? 'त्वरित काम' : 'Smart Pipeline',
      onClick: () => setView('import' as MainView),
      subpages: [
        {
          id: 'import-setup', title: language === 'hi' ? 'इन्जेशन सेटअप' : 'Ingestion Setup', desc: language === 'hi' ? 'फ़ाइलें अपलोड करें और नियम बनाएँ।' : 'Upload documents and set mapping rules.', icon: FileText,
          tabs: [
            { id: 'tab-dropzone', title: language === 'hi' ? 'फ़ाइल ड्रॉपज़ोन' : 'File DropZone', desc: language === 'hi' ? 'नई फाइलें यहां जोड़ें' : 'Add new files here', icon: Inbox, action: () => setView('import' as MainView) },
            { id: 'tab-ocr', title: language === 'hi' ? 'ओसीआर कॉन्फ़िगरेशन' : 'OCR Config', desc: language === 'hi' ? 'टेक्स्ट निकालने की सेटिंग्स' : 'Text extraction settings', icon: Settings2, action: () => setView('import' as MainView) }
          ]
        },
        {
          id: 'import-logs', title: language === 'hi' ? 'प्रोसेसिंग लॉग्स' : 'Processing Logs', desc: language === 'hi' ? 'सफल और त्रुटिपूर्ण प्रविष्टियों की निगरानी करें।' : 'Monitor successful and failed entries.', icon: ListTodo,
          tabs: [
            { id: 'tab-success', title: language === 'hi' ? 'सफल लेजर' : 'Success Ledger', desc: language === 'hi' ? 'सफलतापूर्वक प्रोसेस्ड डेटा' : 'Successfully processed data', icon: Database, action: () => setView('import' as MainView) },
            { id: 'tab-error', title: language === 'hi' ? 'त्रुटि कतार' : 'Error Queue', desc: language === 'hi' ? 'विफल प्रविष्टियों को ठीक करें' : 'Fix failed entries', icon: Activity, action: () => setView('import' as MainView) }
          ]
        }
      ]
    },
    {
      id: 'voucher-entry',
      title: language === 'hi' ? 'लेनदेन' : 'Transactions',
      desc: language === 'hi' ? 'कैश, बैंक, और जर्नल प्रविष्टियों की त्वरित मैन्युअल रिकॉर्डिंग।' : 'Record debit/credit entries with real-time balance calculations & master checks.',
      icon: PlusCircle,
      color: 'from-emerald-500 to-teal-600',
      tag: language === 'hi' ? 'ऑफ़लाइन सक्षम' : 'Direct Journal',
      onClick: () => setView('voucher-entry' as MainView),
      subpages: [
        {
          id: 'voucher-standard', title: language === 'hi' ? 'मानक प्रविष्टि' : 'Standard Entry', desc: language === 'hi' ? 'एकल वाउचर रिकॉर्ड करें।' : 'Record single vouchers.', icon: FileText,
          tabs: [
            { id: 'tab-payment', title: language === 'hi' ? 'भुगतान / रसीद' : 'Payment / Receipt', desc: language === 'hi' ? 'नकद और बैंक लेनदेन' : 'Cash & Bank transactions', icon: Plus, action: () => setView('voucher-entry' as MainView) },
            { id: 'tab-contra', title: language === 'hi' ? 'जर्नल / कॉन्ट्रा' : 'Journal / Contra', desc: language === 'hi' ? 'आंतरिक समायोजन' : 'Internal adjustments', icon: ArrowRight, action: () => setView('voucher-entry' as MainView) }
          ]
        },
        {
          id: 'voucher-bulk', title: language === 'hi' ? 'थोक प्रविष्टि' : 'Bulk Entry', desc: language === 'hi' ? 'एकाधिक वाउचर तेज़ी से दर्ज करें।' : 'Enter multiple vouchers rapidly.', icon: Layers,
          tabs: [
            { id: 'tab-bulk-grid', title: language === 'hi' ? 'फास्ट ग्रिड' : 'Fast Grid Entry', desc: language === 'hi' ? 'स्प्रेडशीट जैसी प्रविष्टि' : 'Spreadsheet-like entry', icon: Database, action: () => setView('voucher-entry' as MainView) }
          ]
        }
      ]
    },
    {
      id: 'ledger-master',
      title: language === 'hi' ? 'खाता मास्टर' : 'Ledger Master',
      desc: language === 'hi' ? 'पार्टियों, बैंक खातों, और इन्वेंट्री मदों की पूरी सूची।' : 'Coordinate masters for ledgers, GST classifications, parts, and active clients.',
      icon: Database,
      color: 'from-amber-500 to-orange-600',
      tag: language === 'hi' ? 'स्थायी' : 'Corporate Records',
      onClick: () => setView('ledger-master' as MainView),
      subpages: [
        {
          id: 'master-accounts', title: language === 'hi' ? 'खाता समूह' : 'Account Groups', desc: language === 'hi' ? 'प्राथमिक और उप-समूह प्रबंधित करें।' : 'Manage primary and sub-groups.', icon: FolderOpen,
          tabs: [
            { id: 'tab-primary-grp', title: language === 'hi' ? 'प्राथमिक समूह' : 'Primary Groups', desc: language === 'hi' ? 'शीर्ष स्तरीय वर्गीकरण' : 'Top-level classifications', icon: BookOpen, action: () => setView('ledger-master' as MainView) },
            { id: 'tab-sub-grp', title: language === 'hi' ? 'उप समूह' : 'Sub Groups', desc: language === 'hi' ? 'विस्तृत खाता वर्गीकरण' : 'Detailed account sorting', icon: Layers, action: () => setView('ledger-master' as MainView) }
          ]
        },
        {
          id: 'master-parties', title: language === 'hi' ? 'पार्टी मास्टर्स' : 'Party Masters', desc: language === 'hi' ? 'देनदारों और लेनदारों का प्रबंधन।' : 'Management of debtors and creditors.', icon: Users,
          tabs: [
            { id: 'tab-debtors', title: language === 'hi' ? 'देनदार' : 'Sundry Debtors', desc: language === 'hi' ? 'ग्राहक खाते' : 'Customer accounts', icon: UserCheck, action: () => setView('ledger-master' as MainView) },
            { id: 'tab-creditors', title: language === 'hi' ? 'लेनदार' : 'Sundry Creditors', desc: language === 'hi' ? 'आपूर्तिकर्ता खाते' : 'Supplier accounts', icon: Inbox, action: () => setView('ledger-master' as MainView) }
          ]
        }
      ]
    },
    {
      id: 'reports',
      title: language === 'hi' ? 'वित्तीय रिपोर्ट' : 'Financial Report',
      desc: language === 'hi' ? 'जीएसटी, कर विवरण, स्टॉक मूवमेंट और संपूर्ण वित्तीय रिपोर्ट्स।' : 'Query dynamic GSTR breakdowns, item margins, tax summaries, and posted ledger balances.',
      icon: Layers,
      color: 'from-purple-500 to-pink-600',
      tag: language === 'hi' ? 'सटीक डेटा' : 'Audit Reporting',
      onClick: () => setView('bank' as MainView),
      subpages: [
        {
          id: 'reports-tax', title: language === 'hi' ? 'कराधान रिपोर्ट' : 'Taxation Reports', desc: language === 'hi' ? 'जीएसटी और अन्य वैधानिक रिपोर्ट।' : 'GST & other statutory reports.', icon: FileSearch,
          tabs: [
            { id: 'tab-gstr1', title: language === 'hi' ? 'GSTR-1 सारांश' : 'GSTR-1 Summary', desc: language === 'hi' ? 'आउटवर्ड सप्लाई डेटा' : 'Outward supplies data', icon: PieChart, action: () => setView('bank' as MainView) },
            { id: 'tab-gstr3b', title: language === 'hi' ? 'GSTR-3B रिटर्न' : 'GSTR-3B Return', desc: language === 'hi' ? 'मासिक कर सारांश' : 'Monthly tax summary', icon: FileText, action: () => setView('bank' as MainView) }
          ]
        },
        {
          id: 'reports-fin', title: language === 'hi' ? 'वित्तीय विवरण' : 'Financial Statements', desc: language === 'hi' ? 'बैलेंस शीट और पीएंडएल।' : 'Balance sheet & P&L.', icon: LineChart,
          tabs: [
            { id: 'tab-bs', title: language === 'hi' ? 'बैलेंस शीट' : 'Balance Sheet', desc: language === 'hi' ? 'सिस्टम वित्तीय स्थिति' : 'System financial position', icon: Layers, action: () => setView('bank' as MainView) },
            { id: 'tab-pl', title: language === 'hi' ? 'लाभ और हानि' : 'Profit & Loss', desc: language === 'hi' ? 'ऑपरेटिंग परिणाम' : 'Operating results', icon: Activity, action: () => setView('bank' as MainView) }
          ]
        }
      ]
    },
    {
      id: 'telemetry',
      title: language === 'hi' ? 'टेलीमेट्री और लॉग्स' : 'Telemetry & Logs',
      desc: language === 'hi' ? 'सुरक्षित सिस्टम प्रदर्शन संकेतक, ऑडिट ट्रेल्स और त्रुटि नियंत्रण।' : 'Monitor server-level sync consensus, decentralized audit trails, and data reconciling logs.',
      icon: Activity,
      color: 'from-cyan-500 to-blue-600',
      tag: language === 'hi' ? 'सक्रिय मॉनिटर' : 'Health Unit',
      onClick: () => onNavigateToSubpage('telemetry'),
      subpages: [
        {
          id: 'telemetry-live', title: language === 'hi' ? 'लाइव मॉनिटर' : 'Live Monitor', desc: language === 'hi' ? 'वास्तविक समय प्रणाली स्वास्थ्य।' : 'Real-time system health.', icon: Activity,
          tabs: [
            { id: 'tab-api', title: language === 'hi' ? 'API स्वास्थ्य' : 'API Health', desc: language === 'hi' ? 'सिस्टम एंडपॉइंट्स' : 'System endpoints', icon: Sparkles, action: () => onNavigateToSubpage('telemetry') }
          ]
        },
        {
          id: 'telemetry-audit', title: language === 'hi' ? 'ऑडिट पुरालेख' : 'Audit Archive', desc: language === 'hi' ? 'ऐतिहासिक प्रणाली घटनाएं।' : 'Historical system events.', icon: Archive,
          tabs: [
            { id: 'tab-users', title: language === 'hi' ? 'उपयोगकर्ता गतिविधि' : 'User Activity', desc: language === 'hi' ? 'लॉगिन और बदलाव' : 'Logins and changes', icon: Users, action: () => onNavigateToSubpage('telemetry') }
          ]
        }
      ]
    },
    {
      id: 'security',
      title: language === 'hi' ? 'सुरक्षा और पहुँच' : 'Security & Access',
      desc: language === 'hi' ? 'AES-GCM-256 गोपनीयता एल्गोरिथ्म, जीडीपीआर नीति और भाषा टूल।' : 'Inspect cryptographic data protection layers, zero-retention compliance, and localized dialects.',
      icon: ShieldCheck,
      color: 'from-slate-600 to-slate-800',
      tag: language === 'hi' ? 'सुरक्षित मोड' : 'Safe Sandbox',
      onClick: () => onNavigateToSubpage('security'),
      subpages: [
        {
          id: 'security-access', title: language === 'hi' ? 'पहुंच नियंत्रण' : 'Access Control', desc: language === 'hi' ? 'अनुमतियां और भूमिकाएं कॉन्फ़िगर करें।' : 'Configure permissions & roles.', icon: Lock,
          tabs: [
            { id: 'tab-roles', title: language === 'hi' ? 'भूमिका नीतियां' : 'Role Policies', desc: language === 'hi' ? 'सुरक्षा पदानुक्रम' : 'Security hierarchy', icon: ShieldCheck, action: () => onNavigateToSubpage('security') }
          ]
        },
        {
          id: 'security-crypto', title: language === 'hi' ? 'डेटा एन्क्रिप्शन' : 'Data Encryption', desc: language === 'hi' ? 'क्रिप्टोग्राफिक कुंजियों का प्रबंधन करें।' : 'Manage cryptographic keys.', icon: Cpu,
          tabs: [
            { id: 'tab-keys', title: language === 'hi' ? 'कुंजी प्रबंधन' : 'Key Management', desc: language === 'hi' ? 'सुरक्षित एन्क्रिप्शन कुंजियां' : 'Secure encryption keys', icon: Lock, action: () => onNavigateToSubpage('security') }
          ]
        }
      ]
    }
  ];

  // Dynamic search filtering
  const actionTiles = allTiles.filter(tile => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = tile.title.toLowerCase().includes(term);
    const descMatch = tile.desc.toLowerCase().includes(term);
    const tagMatch = tile.tag.toLowerCase().includes(term);
    return titleMatch || descMatch || tagMatch;
  });

  const handleExploreMainPage = (mainPageId: string) => {
    setSelectedMainPageId(mainPageId);
    setActiveSubTab('drafts'); // Subpages tab
  };

  const handleExploreSubpage = (subpageId: string) => {
    setSelectedSubpageId(subpageId);
    setActiveSubTab('archives'); // Tabs tab
  };

  const selectedMainPage = allTiles.find(t => t.id === selectedMainPageId);
  const availableSubpages = selectedMainPage ? selectedMainPage.subpages : [];

  let selectedSubpage = null;
  for (const tile of allTiles) {
    const sub = tile.subpages.find(s => s.id === selectedSubpageId);
    if (sub) {
      selectedSubpage = sub;
      break;
    }
  }
  const availableTabs = selectedSubpage ? selectedSubpage.tabs : [];

  const handleCreateDraft = () => {
    addNotification({
      title: language === 'hi' ? 'नया ड्राफ्ट बनाया गया' : 'New Draft Initialized',
      message: language === 'hi' ? 'भविष्य के एआई क्रेडेंशियल के लिए एक खाली ड्राफ्ट तैयार किया जा रहा है।' : 'An empty blueprint has been created for future AI workflows.',
      type: 'System'
    });
  };

  const handleSyncArchives = () => {
    addNotification({
      title: language === 'hi' ? 'पुरालेख सर्वर सिंक' : 'Archives Synced',
      message: language === 'hi' ? 'स्थानीय पुरालेख डेटाबेस सुरक्षित सर्वर के साथ सिंक है।' : 'Local historical entries verified and synced securely with active vault.',
      type: 'System'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Dense Local Sub-Page Tab Selector Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50/50 dark:bg-gray-800/40 p-2 rounded-xl border border-gray-200/40 dark:border-gray-700/45">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none">
              {language === 'hi' ? 'इंडेक्स सब-पेज कैटलॉग' : 'Index Subpage Catalog'}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate mt-0.5 whitespace-nowrap">
              {language === 'hi' ? 'सुरक्षित वित्तीय और बही क्रेडेंशियल प्रबंधन' : 'Secure bookkeeping registries & modular integrations'}
            </p>
          </div>
        </div>

        {/* Dense Tabs Selector Header Selection Alignment Directive (flush right) */}
        <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-0.5 rounded-lg ml-auto">
          <button
            onClick={() => setActiveSubTab('modules')}
            className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-black rounded-md tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer ${
              activeSubTab === 'modules'
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-855'
            }`}
          >
            {language === 'hi' ? 'मुख्य पृष्ठ' : 'Main Page'}
          </button>
          <button
            onClick={() => setActiveSubTab('drafts')}
            className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-black rounded-md tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer ${
              activeSubTab === 'drafts'
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-855'
            }`}
          >
            {language === 'hi' ? 'उपपृष्ठ' : 'Subpages'}
          </button>
          <button
            onClick={() => setActiveSubTab('archives')}
            className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-black rounded-md tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer ${
              activeSubTab === 'archives'
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-855'
            }`}
          >
            {language === 'hi' ? 'टैब' : 'Tabs'}
          </button>
        </div>
      </div>

      {/* Tab Contents Frame */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          
          {/* ----- Main Page Tab (Level 1) ----- */}
          {activeSubTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actionTiles.length > 0 ? (
                  actionTiles.map((tile) => {
                    const IconComponent = tile.icon;
                    return (
                      <div
                        key={tile.id}
                        className="flex flex-col text-left bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 hover:border-blue-500/40 rounded-2xl transition-all duration-300 hover:shadow-md relative overflow-hidden group h-full justify-between"
                      >
                        {/* Clickable Card Body for Subpage Drill-down */}
                        <button 
                          onClick={() => handleExploreMainPage(tile.id)}
                          className="p-6 pb-2 text-left w-full h-full cursor-pointer focus:outline-none"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 dark:bg-slate-700/10 rounded-full blur-2xl group-hover:scale-125 transition-transform -z-10 pointer-events-none" />
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tile.color} text-white flex items-center justify-center shadow-md`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] bg-slate-50 dark:bg-gray-750 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-gray-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                {tile.tag}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {tile.title}
                              </h4>
                              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
                                {tile.desc}
                              </p>
                            </div>
                          </div>
                        </button>
                        
                        {/* Direct Launch Button Footer */}
                        <div className="px-6 pb-4 pt-3 flex items-center gap-3">
                          <button 
                            onClick={tile.onClick}
                            className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{language === 'hi' ? 'सीधे खोलें' : 'Direct Launch'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleExploreMainPage(tile.id)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-100 dark:border-slate-700 cursor-pointer"
                            title="Explore Subpages"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full bg-slate-50/50 dark:bg-gray-800/40 p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-750">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 animate-pulse">
                      {language === 'hi' 
                        ? 'अफ़सोस! आपकी खोज से मेल खाता कोई क्रेडेंशियल नहीं मिला।' 
                        : 'No dynamic index modules match your current filtering criteria.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ----- Subpages Tab (Level 2) ----- */}
          {activeSubTab === 'drafts' && (
            <motion.div
              key="drafts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              {!selectedMainPageId ? (
                <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 p-8 sm:p-12 text-center rounded-2xl space-y-5 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/35 border border-blue-100 dark:border-blue-900/20 text-blue-600 dark:text-blue-450 flex items-center justify-center mx-auto shadow-xs">
                    <Layers className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h4 className="text-base font-black text-slate-800 dark:text-white">
                      {language === 'hi' ? 'कोई मुख्य पृष्ठ चयनित नहीं है' : 'No Main Page Selected'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                      {language === 'hi' 
                        ? 'उपपृष्ठों को देखने के लिए कृपया \'Main Page\' टैब से किसी मॉड्यूल का चयन करें।' 
                        : 'Please select a module from the \'Main Page\' tab to explore its subpages.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('modules')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>{language === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Return to Main Pages'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => setActiveSubTab('modules')}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                        {selectedMainPage?.title} <span className="text-slate-400 dark:text-slate-500 mx-1">›</span> {language === 'hi' ? 'उपपृष्ठ सूची' : 'Subpages List'}
                      </h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {availableSubpages.map((sub) => {
                      const SubIcon = sub.icon || FolderOpen;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleExploreSubpage(sub.id)}
                          className="flex items-start text-left bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 hover:border-indigo-400/50 rounded-xl p-5 transition-all duration-200 hover:shadow-md group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                            <SubIcon className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {sub.title}
                            </h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {sub.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ----- Tabs Tab (Level 3) ----- */}
          {activeSubTab === 'archives' && (
            <motion.div
              key="archives"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              {!selectedSubpageId ? (
                <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-750 p-8 sm:p-12 text-center rounded-2xl space-y-5 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/35 border border-blue-100 dark:border-blue-900/20 text-blue-600 dark:text-blue-450 flex items-center justify-center mx-auto shadow-xs">
                    <ListTodo className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h4 className="text-base font-black text-slate-800 dark:text-white">
                      {language === 'hi' ? 'कोई उपपृष्ठ चयनित नहीं है' : 'No Subpage Selected'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                      {language === 'hi' 
                        ? 'विशिष्ट टैब देखने के लिए कृपया Subpages टैब से किसी उपपृष्ठ का चयन करें।' 
                        : 'Please select a subpage from the \'Subpages\' tab to explore its specific tabs.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('drafts')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>{language === 'hi' ? 'उपपृष्ठों पर लौटें' : 'Return to Subpages'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => setActiveSubTab('drafts')}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                        {selectedSubpage?.title} <span className="text-slate-400 dark:text-slate-500 mx-1">›</span> {language === 'hi' ? 'सक्रिय टैब' : 'Active Tabs'}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {availableTabs.map((tab) => {
                      const TabIcon = tab.icon || Inbox;
                      return (
                        <button
                          key={tab.id}
                          onClick={tab.action}
                          className="flex items-center text-left bg-white dark:bg-gray-800 border-2 border-transparent border-dashed hover:border-emerald-400/50 dark:hover:border-emerald-500/40 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer relative"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4 shrink-0 transition-transform group-hover:scale-110">
                            <TabIcon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                            <h5 className="text-sm font-bold text-slate-800 dark:text-white transition-colors">
                              {tab.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {tab.desc}
                            </p>
                          </div>
                          <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4 text-emerald-500" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

