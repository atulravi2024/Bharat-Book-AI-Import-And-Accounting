
import React, { useState, useEffect, useMemo } from 'react';
import { CodeIcon, CheckCircleIcon, ExpandMoreIcon, ChevronRightIcon, ContentCopyIcon, SortIcon, FilterListIcon } from '../icons/IconComponents';
import { useLanguage } from '../../context/LanguageContext';

interface SubPageGroup {
    title: string;
    keys: string[];
}

interface KeyGroup {
    title: string;
    subPages: SubPageGroup[];
}

export const DataExplorer: React.FC = () => {
    const { t } = useLanguage();
    const [keys, setKeys] = useState<string[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'Dashboard': false,
        'Ledger Masters': false,
        'Item Masters': false,
        'Reports': false,
        'Vouchers': false,
        'Settings': false,
        'Other': false
    });
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [fileTypeFilter, setFileTypeFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'type-asc' | 'tier-asc' | 'source-asc' | 'depth-asc' | 'group-asc'>('name-asc');
    const [filterType, setFilterType] = useState<'all' | 'file' | 'storage' | 'json' | 'typescript' | 'styles' | 'reports' | 'masters' | 'config' | 'audits' | 'samples' | 'database'>('all');
    const [jsonContent, setJsonContent] = useState<string>('');
    const [isImage, setIsImage] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [fileType, setFileType] = useState<string>('Unknown');

    const getFileTypeLabel = (fileName: string) => {
        if (!fileName) return 'Unknown';
        if (!fileName.startsWith('/')) return 'Object';
        
        const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
        return ext;
    };

    const getStorageSource = (key: string) => {
        if (!key) return '';
        if (!key.startsWith('/')) return 'Browser Local Storage';
        if (key.startsWith('/sample-data')) return 'Database Assets';
        return 'Server Filesystem';
    };

    const getLogicTier = (key: string) => {
        if (!key) return '';
        if (!key.startsWith('/')) return 'Frontend Logical Unit';
        
        const lowKey = key.toLowerCase();
        if (lowKey.includes('server.ts')) return 'Backend Infrastructure';
        if (lowKey.endsWith('.tsx') || lowKey.endsWith('.ts')) return 'UI/Component Logic';
        if (lowKey.endsWith('.json')) return 'Data Persistence';
        if (lowKey.endsWith('.css') || lowKey.endsWith('.html')) return 'Styling Template';
        return 'System Framework';
    };

    const SAMPLE_PATHS: Record<string, string[]> = {
        'Report Section with Financial Report': [
            '/sample-data/reports/vouchers.json',
            '/sample-data/reports/financial_vouchers.json',
            '/sample-data/reports/bank_vouchers.json',
            '/sample-data/reports/day_book.json',
            '/sample-data/reports/sales_register.json',
            '/sample-data/reports/purchase_register.json',
            '/sample-data/reports/cash_flow.json',
            '/sample-data/reports/profit_loss.json',
            '/sample-data/reports/balance_sheet.json',
            '/sample-data/reports/trial_balance.json',
            '/sample-data/reports/g1_data.json',
            '/sample-data/reports/stock_summary.json',
            '/sample-data/reports/item_vouchers.json',
            '/sample-data/reports/bank_flow.json',
            '/sample-data/reports/journal_register.json',
            '/sample-data/reports/reconcile.json'
        ],
        'Master Ledger': [
            '/sample-data/ledger-master/ldg_masters.json',
            '/sample-data/ledger-master/parties.json',
            '/sample-data/ledger-master/banks.json',
            '/sample-data/ledger-master/costCenters.json',
            '/sample-data/ledger-master/contacts.json',
            '/sample-data/ledger-master/acc_groups.json',
            '/sample-data/ledger-master/vendors.json'
        ],
        'Master Item': [
            '/sample-data/item-master/items.json',
            '/sample-data/item-master/uoms.json',
            '/sample-data/item-master/hsn.json',
            '/sample-data/item-master/brands.json',
            '/sample-data/item-master/categories.json',
            '/sample-data/item-master/warehouses.json',
            '/sample-data/item-master/skus.json',
            '/sample-data/item-master/priceList.json',
            '/sample-data/item-master/stockGroups.json',
            '/sample-data/item-master/variants.json',
            '/sample-data/item-master/sizes.json',
            '/sample-data/item-master/colors.json',
            '/sample-data/item-master/grades.json',
            '/sample-data/item-master/assertionCategories.json',
            '/sample-data/item-master/assertionCodes.json',
            '/sample-data/item-master/weights.json',
            '/sample-data/item-master/volumes.json',
            '/sample-data/item-master/dimensions.json'
        ],
        'All types of pages': [
            '/metadata.json',
            '/package.json',
            '/App.tsx',
            '/server.ts',
            '/tsconfig.json',
            '/index.css',
            '/index.html',
            '/constants.ts'
        ]
    };

    const loadKeys = () => {
        const availableKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                availableKeys.push(key);
            }
        }
        const sortedKeys = availableKeys.sort();
        setKeys(sortedKeys);
    };

    useEffect(() => {
        loadKeys();
    }, []);

    const processedKeys = useMemo(() => {
        // Collect all possible keys
        const allKeys = [...keys];
        Object.values(SAMPLE_PATHS).flat().forEach(path => {
            if (!allKeys.includes(path)) allKeys.push(path);
        });

        let result = [...allKeys];

        // 1. Filter by Main Type (filterType)
        if (filterType !== 'all') {
            const matchesFilter = (path: string) => {
                if (filterType === 'file') return path.startsWith('/');
                if (filterType === 'storage') return !path.startsWith('/');
                if (filterType === 'json') return path.toLowerCase().endsWith('.json');
                if (filterType === 'typescript') return path.toLowerCase().endsWith('.tsx') || path.toLowerCase().endsWith('.ts');
                if (filterType === 'styles') return path.toLowerCase().endsWith('.css') || path.toLowerCase().endsWith('.html');
                if (filterType === 'reports') return path.toLowerCase().includes('/reports/') || path.toLowerCase().includes('vouchers');
                if (filterType === 'masters') return path.toLowerCase().includes('-master/') || path.toLowerCase().includes('ledger') || path.toLowerCase().includes('item');
                if (filterType === 'config') {
                    const configFiles = ['metadata.json', 'package.json', 'tsconfig.json', 'vite.config.ts', 'components.json'];
                    return configFiles.some(cfg => path.endsWith(cfg)) || path.includes('settings');
                }
                if (filterType === 'audits') return path.toLowerCase().includes('log') || path.toLowerCase().includes('draft') || path.toLowerCase().includes('active_samples');
                if (filterType === 'samples') return path.startsWith('/sample-data/');
                if (filterType === 'database') return !path.startsWith('/') && !path.includes('bharat_book_');
                return true;
            };
            result = result.filter(matchesFilter);
        }

        // 2. Filter by File Type/Ext (fileTypeFilter)
        if (fileTypeFilter !== 'All') {
            if (fileTypeFilter === 'JSON') {
                result = result.filter(k => k.toLowerCase().endsWith('.json'));
            } else if (fileTypeFilter === 'Memory') {
                result = result.filter(k => !k.startsWith('/'));
            } else if (fileTypeFilter === 'CSV') {
                result = result.filter(k => k.toLowerCase().endsWith('.csv'));
            } else if (fileTypeFilter === 'Excel') {
                result = result.filter(k => k.toLowerCase().endsWith('.xlsx') || k.toLowerCase().endsWith('.xls'));
            } else if (fileTypeFilter === 'TypeScript') {
                result = result.filter(k => k.toLowerCase().endsWith('.ts') || k.toLowerCase().endsWith('.tsx'));
            } else if (fileTypeFilter === 'CSS') {
                result = result.filter(k => k.toLowerCase().endsWith('.css') || k.toLowerCase().endsWith('.scss'));
            } else if (fileTypeFilter === 'HTML') {
                result = result.filter(k => k.toLowerCase().endsWith('.html'));
            } else if (fileTypeFilter === 'JavaScript') {
                result = result.filter(k => k.toLowerCase().endsWith('.js') || k.toLowerCase().endsWith('.jsx'));
            } else if (fileTypeFilter === 'Markdown') {
                result = result.filter(k => k.toLowerCase().endsWith('.md'));
            } else if (fileTypeFilter === 'Images') {
                result = result.filter(k => k.toLowerCase().endsWith('.png') || k.toLowerCase().endsWith('.jpg') || k.toLowerCase().endsWith('.jpeg') || k.toLowerCase().endsWith('.svg') || k.toLowerCase().endsWith('.ico'));
            } else if (fileTypeFilter === 'Text') {
                result = result.filter(k => k.toLowerCase().endsWith('.txt'));
            } else if (fileTypeFilter === 'Other') {
                result = result.filter(k => {
                    const lk = k.toLowerCase();
                    return k.startsWith('/') && 
                           !lk.endsWith('.json') && !lk.endsWith('.csv') && !lk.endsWith('.xlsx') && !lk.endsWith('.xls') && 
                           !lk.endsWith('.ts') && !lk.endsWith('.tsx') && !lk.endsWith('.css') && !lk.endsWith('.scss') &&
                           !lk.endsWith('.html') && !lk.endsWith('.md') && !lk.endsWith('.js') && !lk.endsWith('.jsx') &&
                           !lk.endsWith('.png') && !lk.endsWith('.jpg') && !lk.endsWith('.jpeg') && !lk.endsWith('.svg') && !lk.endsWith('.ico') &&
                           !lk.endsWith('.txt');
                });
            }
        }

        // 3. Search
        if (searchQuery) {
            result = result.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // 4. Sort
        result.sort((a, b) => {
            if (sortOrder === 'name-asc') return a.toLowerCase().localeCompare(b.toLowerCase());
            if (sortOrder === 'name-desc') return b.toLowerCase().localeCompare(a.toLowerCase());
            if (sortOrder === 'type-asc') return getFileTypeLabel(a).localeCompare(getFileTypeLabel(b));
            if (sortOrder === 'tier-asc') return getLogicTier(a).localeCompare(getLogicTier(b));
            if (sortOrder === 'source-asc') return getStorageSource(a).localeCompare(getStorageSource(b));
            if (sortOrder === 'depth-asc') return a.split('/').length - b.split('/').length;
            if (sortOrder === 'group-asc') {
                const groupA = a.toLowerCase().includes('ledger') ? 0 : a.toLowerCase().includes('item') ? 1 : a.toLowerCase().includes('report') ? 2 : a.toLowerCase().includes('settings') ? 3 : 4;
                const groupB = b.toLowerCase().includes('ledger') ? 0 : b.toLowerCase().includes('item') ? 1 : b.toLowerCase().includes('report') ? 2 : b.toLowerCase().includes('settings') ? 3 : 4;
                return groupA - groupB;
            }
            return 0;
        });

        return result;
    }, [keys, searchQuery, sortOrder, filterType, fileTypeFilter]);

    const groupedKeys = useMemo(() => {
        const groups: KeyGroup[] = [
            { title: 'Dashboard', subPages: [{ title: 'Overview', keys: [] }] },
            { title: 'Ledger Masters', subPages: [{ title: 'Ledgers', keys: [] }, { title: 'Parties', keys: [] }, { title: 'Other', keys: [] }] },
            { title: 'Item Masters', subPages: [{ title: 'Items', keys: [] }, { title: 'Attributes', keys: [] }, { title: 'Other', keys: [] }] },
            { title: 'Reports', subPages: [{ title: 'Financial', keys: [] }, { title: 'Vouchers', keys: [] }, { title: 'Inventory', keys: [] }, { title: 'Other', keys: [] }] },
            { title: 'Vouchers', subPages: [{ title: 'All', keys: [] }] },
            { title: 'Settings', subPages: [{ title: 'General', keys: [] }, { title: 'Audit', keys: [] }] },
            { title: 'Other', subPages: [{ title: 'Files', keys: [] }] },
        ];

        const getGroupForPath = (path: string) => {
            const lowKey = path.toLowerCase();
            
            // Settings (including config/metadata)
            if (lowKey.includes('settings') || lowKey.includes('draft') || lowKey.includes('active_samples') || 
                lowKey.includes('metadata') || lowKey.includes('package') || lowKey.includes('tsconfig') || 
                lowKey.includes('vite') || lowKey.includes('components') || lowKey.includes('constants')) {
                return groups[5];
            }

            // Ledger Masters
            if (lowKey.includes('ledger') || lowKey.includes('parties') || lowKey.includes('contact') || lowKey.includes('account_group') || lowKey.includes('cost_center')) {
                return groups[1];
            }
            
            // Item Masters
            if (lowKey.includes('item') || lowKey.includes('uom') || lowKey.includes('brand') || lowKey.includes('category') || 
                lowKey.includes('sku') || lowKey.includes('stock_group') || lowKey.includes('warehouse') || lowKey.includes('price_list') ||
                lowKey.includes('weight') || lowKey.includes('volume') || lowKey.includes('color') || lowKey.includes('size') || 
                lowKey.includes('variant') || lowKey.includes('dimension') || lowKey.includes('grade') || lowKey.includes('assertion')) {
                return groups[2];
            }
            
            // Vouchers
            if (lowKey.includes('voucher')) {
                return groups[4];
            }

            // Reports
            if (lowKey.includes('/reports/') || lowKey.includes('gstr') || lowKey.includes('profit_loss') || lowKey.includes('balance_sheet') || 
                lowKey.includes('trial_balance') || lowKey.includes('cash_flow') || lowKey.includes('day_book') || lowKey.includes('register')) {
                return groups[3];
            }
            
            return groups[6];
        };

        const getSubPageForPath = (group: KeyGroup, path: string) => {
            const lowKey = path.toLowerCase();
            
            // Ledger / Item specific subpages
            if (group.title === 'Ledger Masters') {
                if (lowKey.includes('ledger')) return group.subPages[0];
                if (lowKey.includes('party')) return group.subPages[1];
                return group.subPages[2];
            }
            if (group.title === 'Item Masters') {
                if (lowKey.includes('item')) return group.subPages[0];
                if (lowKey.includes('attribute') || lowKey.includes('color') || lowKey.includes('size') || lowKey.includes('variant') || lowKey.includes('dimension')) return group.subPages[1];
                return group.subPages[2];
            }
            // Reports specific subpages
            if (group.title === 'Reports') {
                if (lowKey.includes('financial') || lowKey.includes('profit_loss') || lowKey.includes('balance_sheet') || lowKey.includes('trial_balance') || lowKey.includes('cash_flow')) return group.subPages[0];
                if (lowKey.includes('voucher') || lowKey.includes('day_book') || lowKey.includes('register')) return group.subPages[1];
                if (lowKey.includes('stock') || lowKey.includes('item_movement')) return group.subPages[2];
                return group.subPages[3];
            }
            // Settings
            if (group.title === 'Settings') {
                if (lowKey.includes('audit')) return group.subPages[1];
                return group.subPages[0];
            }
            
            return group.subPages[0];
        };

        processedKeys.forEach(key => {
            const group = getGroupForPath(key);
            const subPage = getSubPageForPath(group, key);
            subPage.keys.push(key);
        });
        
        return groups.map(g => ({
            ...g,
            subPages: g.subPages.filter(s => s.keys.length > 0)
        })).filter(g => g.subPages.length > 0);
    }, [processedKeys]);

    const toggleGroup = (title: string) => {
        setExpandedGroups(prev => {
            const isCurrentlyExpanded = prev[title];
            const nextState: Record<string, boolean> = {};
            // Close all others to ensure only one section is open at a time
            Object.keys(prev).forEach(key => {
                nextState[key] = false;
            });
            // Toggle the clicked one
            nextState[title] = !isCurrentlyExpanded;
            return nextState;
        });
    };

    const handleKeySelect = async (key: string) => {
        setSelectedKey(key);
        setIsLoadingData(true);
        setFileType(getFileTypeLabel(key));
        setIsImage(false);
        setJsonContent('');
        
        // Scroll to viewer on mobile
        if (window.innerWidth < 768) {
            const viewer = document.getElementById('data-viewer-container');
            if (viewer) {
                viewer.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Handle Paths (starting with /)
        if (key.startsWith('/')) {
            // EXCLUDE .tsx files from preview
            if (key.toLowerCase().endsWith('.tsx')) {
                setJsonContent('// Preview for .tsx files is disabled.');
                setIsLoadingData(false);
                return;
            }

            const isImg = /\.(png|jpg|jpeg|svg|ico)$/i.test(key);
            setIsImage(isImg);

            if (isImg) {
                setIsLoadingData(false);
                return;
            }

            try {
                const response = await fetch(`/api/raw-file?path=${encodeURIComponent(key)}`);
                if (!response.ok) throw new Error('Failed to fetch file');
                const text = await response.text();
                
                // Attempt to format if JSON (mostly for sample-data)
                if (key.endsWith('.json')) {
                    try {
                        const data = JSON.parse(text);
                        setJsonContent(JSON.stringify(data, null, 2));
                    } catch (e) {
                        setJsonContent(text);
                    }
                } else {
                    setJsonContent(text);
                }
            } catch (err) {
                setJsonContent(`// Error loading file: ${key}\n// This file might not exist on the server or is not accessible.`);
            } finally {
                setIsLoadingData(false);
            }
            return;
        }

        // Handle LocalStorage Keys
        const content = localStorage.getItem(key);
        if (content) {
            if (content.startsWith('data:image/')) {
                setIsImage(true);
                setJsonContent(content); // Store base64
            } else {
                try {
                    const parsed = JSON.parse(content);
                    setJsonContent(JSON.stringify(parsed, null, 2));
                } catch (e) {
                    setJsonContent(content);
                }
            }
        } else {
            setJsonContent('');
        }
        setIsLoadingData(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonContent);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const storageSource = selectedKey ? getStorageSource(selectedKey) : '';
    const logicTier = selectedKey ? getLogicTier(selectedKey) : '';

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-800">
                <div className="flex flex-row items-center gap-6">
                    {/* Header */}
                    <div className="flex flex-col gap-1 w-64">
                         <h3 className="font-bold text-gray-900 flex items-center text-xl dark:text-white">
                            <CodeIcon className="mr-2 text-blue-600 w-6 h-6" />
                            {t("System Browser")}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">{t("Browse and analyze system data")}</p>
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder={t("Search database...")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input rounded-2xl px-5 text-sm placeholder:text-gray-400 font-medium"
                        />
                    </div>

                    {/* Refresh */}
                </div>

                <div className="flex flex-row items-center gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    {/* Filter Section */}
                    <div className="flex flex-col gap-2 w-40">
                         <div className="relative">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="form-input rounded-2xl text-[11px] font-black text-gray-600 appearance-none cursor-pointer uppercase tracking-wider pr-8 dark:text-gray-300"
                            >
                                <option value="all">{t("All Items")}</option>
                                <option value="file">{t("Server Files")}</option>
                                <option value="storage">{t("Browser Storage")}</option>
                                <option value="json">{t("JSON Data")}</option>
                                <option value="typescript">{t("Typescript")}</option>
                                <option value="styles">{t("Styles & HTML")}</option>
                                <option value="reports">{t("Reports")}</option>
                                <option value="masters">{t("Masters")}</option>
                                <option value="config">{t("Config")}</option>
                                <option value="audits">{t("Audits")}</option>
                                <option value="database">{t("Database")}</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ExpandMoreIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* New File Type Filter */}
                    <div className="flex flex-col gap-2 w-40">
                         <div className="relative">
                            <select
                                value={fileTypeFilter}
                                onChange={(e) => setFileTypeFilter(e.target.value)}
                                className="form-input rounded-2xl text-[11px] font-black text-gray-600 appearance-none cursor-pointer uppercase tracking-wider pr-8 dark:text-gray-300"
                            >
                                <option value="All">{t("All Types")}</option>
                                <option value="JSON">{t("JSON")}</option>
                                <option value="Memory">{t("Memory")}</option>
                                <option value="CSV">{t("CSV")}</option>
                                <option value="Excel">{t("Excel")}</option>
                                <option value="TypeScript">{t("TypeScript")}</option>
                                <option value="CSS">{t("CSS")}</option>
                                <option value="HTML">{t("HTML")}</option>
                                <option value="JavaScript">{t("JavaScript")}</option>
                                <option value="Markdown">{t("Markdown")}</option>
                                <option value="Images">{t("Images")}</option>
                                <option value="Text">{t("Text")}</option>
                                <option value="Other">{t("Other")}</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ExpandMoreIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Sort Section */}
                    <div className="flex flex-col gap-2 w-40">
                         <div className="relative">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as any)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-[11px] font-black text-gray-600 appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none transition-all uppercase tracking-wider pr-8 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                            >
                                <option value="name-asc">Alphabetical (A-Z)</option>
                                <option value="name-desc">Alphabetical (Z-A)</option>
                                <option value="type-asc">{t("Group by Ext")}</option>
                                <option value="tier-asc">{t("Group by Logic")}</option>
                                <option value="source-asc">{t("Group by Source")}</option>
                                <option value="depth-asc">{t("Path Complexity")}</option>
                                <option value="group-asc">{t("Functional Group")}</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ExpandMoreIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Refresh */}
                    <button 
                        onClick={loadKeys}
                        className="p-1.5 px-6 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all text-[11px] font-black uppercase tracking-wider border border-blue-100 flex items-center gap-2 h-[46px]"
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${isLoadingData ? 'bg-blue-400 animate-pulse' : 'bg-blue-600'}`}></div>
                        {t("Refresh")}
                    </button>
                </div>
            </div>

            {/* Section 2: Browser & Preview Panel */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[700px] dark:bg-gray-800 dark:border-gray-800">
                {/* Sidebar with Keys */}
                <div className="w-full md:w-80 bg-gray-50/50 border-r border-gray-100 flex flex-col max-h-[700px] dark:border-gray-800">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {groupedKeys.map(group => (
                            <div key={group.title} className="space-y-1">
                                <button 
                                    onClick={() => toggleGroup(group.title)}
                                    className="w-full flex items-center justify-between p-2 px-3 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-white hover:text-gray-600 transition-all border border-transparent shadow-none hover:shadow-sm"
                                >
                                    <span>{group.title} ({group.subPages.reduce((acc, sub) => acc + sub.keys.length, 0)})</span>
                                </button>
                                
                                {expandedGroups[group.title] && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200 px-1 py-1">
                                        {group.subPages.map(subPage => (
                                            <div key={subPage.title} className="space-y-1 ml-2">
                                                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider px-3">{subPage.title}</div>
                                                {subPage.keys.map(key => (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleKeySelect(key)}
                                                        className={`w-full text-left p-3 rounded-xl text-[12px] font-medium transition-all truncate flex items-center justify-between border ${selectedKey === key ? 'bg-white text-blue-600 border-blue-100 shadow-sm ring-1 ring-blue-50/50' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-100 hover:text-gray-900 group'} dark:bg-gray-800 dark:text-gray-400`}
                                                    >
                                                        <span className="truncate">
                                                            {key.startsWith('/') 
                                                                ? key.split('/').pop()
                                                                : key.replace('bharat_book_', '')}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {keys.length === 0 && (
                            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{t("No application data found.")}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Viewer Content */}
                <div id="data-viewer-container" className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 h-[90px] dark:border-gray-800 dark:bg-gray-800">
                        <div className="min-w-0 flex-1 mr-4">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                {selectedKey && (
                                    <>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter shadow-sm border ${selectedKey.startsWith('/') ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {selectedKey.startsWith('/') ? 'FILE' : 'STORAGE'}
                                        </span>
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter bg-gray-50 text-gray-400 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                            {fileType}
                                        </span>
                                    </>
                                )}
                                <h4 className="font-bold text-gray-900 truncate text-base ml-1 dark:text-white">
                                    {selectedKey ? (selectedKey.startsWith('/') ? selectedKey.split('/').pop() : selectedKey.replace('bharat_book_', '')) : 'Entry Viewer'}
                                </h4>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedKey && (
                                    <>
                                        <div className="flex items-center gap-1.5 grayscale opacity-70">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Source:</span>
                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{storageSource}</span>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="flex items-center gap-1.5 grayscale opacity-70">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Tier:</span>
                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{logicTier}</span>
                                        </div>
                                    </>
                                )}
                                {!selectedKey && <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{t("Select an item from the browser to inspect its content")}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={handleCopy}
                                disabled={!jsonContent}
                                title="Copy Content"
                                className={`p-2.5 rounded-xl transition-all border ${copySuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-blue-600 hover:border-blue-100'} disabled:opacity-30 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-800`}
                            >
                                {copySuccess ? <CheckCircleIcon className="w-5 h-5" /> : <ContentCopyIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative bg-gray-900 min-h-[500px]">
                        {isLoadingData && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <div className="absolute inset-0 overflow-auto p-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {isImage ? (
                                <div className="flex items-center justify-center min-h-full">
                                    <img src={selectedKey?.startsWith('/') ? selectedKey : jsonContent} alt="Preview" className="max-w-full max-h-full object-contain" />
                                </div>
                            ) : (
                                <pre className="text-emerald-400/90 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words min-h-full selection:bg-emerald-500/20 selection:text-emerald-300">
                                    {jsonContent || '// No data selected or file is empty\n// Choose an entry from the system browser to the left'}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
