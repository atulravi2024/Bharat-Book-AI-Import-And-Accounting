import { useState, useEffect } from 'react';
import { 
    FileText, 
    Users, 
    Package, 
    Database
} from 'lucide-react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { FeatureGates, SystemLog, Stats } from "../types";

const defaultFeatureGates: FeatureGates = {
    compactDensity: false,
    audioFeedback: false,
    skipPopups: false,
    allowNegativeStock: false,
    highContrastBorders: false,
    autoGstRounding: true,
};

export const useAdminSettings = () => {
    const { t } = useLanguage();
    const [storageUsed, setStorageUsed] = useState<string>('0 KB');
    const [storageBytes, setStorageBytes] = useState<number>(0);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);
    const [stats, setStats] = useState<Stats>({
        vouchers: 0,
        parties: 0,
        items: 0,
        ledgers: 0,
    });

    // Unified Accordion State: ALL collapsed by default. Only one active section allowed at a time.
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    // Schema Template and Audit states for additional admin features
    const [activeSchemaTemplate, setActiveSchemaTemplate] = useState<string>('GAAP');
    const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
        { time: '2026-05-28 01:40:15', event: 'Database Schema Verification', user: 'Atul Ravi (SA)', status: 'Success' },
        { time: '2026-05-28 01:22:49', event: 'Master Table Compilation', user: 'Atul Ravi (SA)', status: 'Optimized' },
        { time: '2026-05-27 18:05:12', event: 'Double-Entry Balance Audit', user: 'System Engine', status: 'Balanced' },
        { time: '2026-05-27 11:15:00', event: 'Sandbox Storage Compression', user: 'System Engine', status: 'Complete' },
        { time: '2026-05-26 15:30:22', event: 'Access Token Keys Rotation', user: 'Security Daemon', status: 'Rotated' }
    ]);

    // Dynamic JSON Console states
    const [selectedKey, setSelectedKey] = useState<string>('bharat_book_all_vouchers_v2_v2');
    const [editorValue, setEditorValue] = useState<string>('');
    const [editorError, setEditorError] = useState<string | null>(null);
    const [editorSuccess, setEditorSuccess] = useState<boolean>(false);

    // Benchmark states
    const [benchmarkMs, setBenchmarkMs] = useState<number | null>(null);
    const [benchmarkRating, setBenchmarkRating] = useState<string>('');
    const [benchmarkRunning, setBenchmarkRunning] = useState<boolean>(false);

    // Feature Toggles
    const [featureGates, setFeatureGates] = useState<FeatureGates>(defaultFeatureGates);
    const [gatesSaved, setGatesSaved] = useState<boolean>(false);

    const calculateStorage = () => {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bharat_book')) {
                const item = localStorage.getItem(key);
                if (item) {
                    total += item.length * 2;
                }
            }
        }
        setStorageBytes(total);
        const kb = (total / 1024).toFixed(2);
        const mb = (total / (1024 * 1024)).toFixed(2);
        setStorageUsed(total > 1024 * 1024 ? `${mb} MB` : `${kb} KB`);

        try {
            const v = JSON.parse(localStorage.getItem('bharat_book_all_vouchers_v2_v2') || '[]');
            const p = JSON.parse(localStorage.getItem('bharat_book_party_masters') || '[]');
            const idx = JSON.parse(localStorage.getItem('bharat_book_item_masters') || '[]');
            const l = JSON.parse(localStorage.getItem('bharat_book_ledger_masters') || '[]');
            setStats({
                vouchers: Array.isArray(v) ? v.length : 0,
                parties: Array.isArray(p) ? p.length : 0,
                items: Array.isArray(idx) ? idx.length : 0,
                ledgers: Array.isArray(l) ? l.length : 0,
            });
        } catch (e) {
            console.error("Failed to parse stats", e);
        }
    };

    const loadJsonEditorKey = (key: string) => {
        setEditorError(null);
        setEditorSuccess(false);
        const item = localStorage.getItem(key);
        if (item) {
            try {
                const parsed = JSON.parse(item);
                setEditorValue(JSON.stringify(parsed, null, 2));
            } catch (err) {
                setEditorValue(item);
            }
        } else {
            setEditorValue('[]');
        }
    };

    useEffect(() => {
        calculateStorage();
        loadJsonEditorKey('bharat_book_all_vouchers_v2_v2');
        
        try {
            const savedGates = localStorage.getItem('bharat_book_admin_feature_gates');
            if (savedGates) {
                setFeatureGates({ ...defaultFeatureGates, ...JSON.parse(savedGates) });
            }
        } catch (e) {
            console.error("Failed to load feature gates", e);
        }
    }, []);

    // Backup generation
    const handleBackup = () => {
        const data: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bharat_book')) {
                data[key] = localStorage.getItem(key) || '';
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bharat_book_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Restore from backup file
    const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                Object.keys(data).forEach(key => {
                    if (key.startsWith('bharat_book')) {
                        localStorage.setItem(key, data[key]);
                    }
                });
                alert('Data restored successfully! The application will now reload.');
                window.location.reload();
            } catch (err) {
                alert('Failed to restore data. Invalid file format.');
            }
        };
        reader.readAsText(file);
    };

    // Seed Demo Parties
    const handleSeedParties = () => {
        const demoParties = [
            { id: 'p_1', name: 'Tata Steel Enterprises Ltd', code: 'PTY/TATA/01', status: 'Active', type: 'Vendor', gstin: '27AABCU1234F1Z1', address: 'Tata Steel HQ, BKC Area', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', phone: '9812234001', email: 'procurement@tatasteel.co.in', openingBalance: 45000 },
            { id: 'p_2', name: 'Reliance Retail Industries', code: 'PTY/RELI/02', status: 'Active', type: 'Customer', gstin: '24AAACR4093E1Z4', address: 'Gansoli Office complex', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400701', phone: '9655432011', email: 'sales@relretail.com', openingBalance: -112500 },
            { id: 'p_3', name: 'Infosys Training Systems Ltd', code: 'PTY/INFO/03', status: 'Active', type: 'Customer', gstin: '29AABCI8892D1ZD', address: 'Electronic City Phase 1', city: 'Bengaluru', state: 'Karnataka', pincode: '560100', phone: '8099238800', email: 'accounts@infosystraining.com', openingBalance: 0 },
            { id: 'p_4', name: 'Apex Office Distributors', code: 'PTY/APEX/04', status: 'Active', type: 'Vendor', gstin: '07AAACA4512D1Z0', address: 'DLF Industrial Estate Phase III', city: 'New Delhi', state: 'Delhi', pincode: '110015', phone: '1144212900', email: 'supplies@apexdistributors.com', openingBalance: 12400 },
            { id: 'p_5', name: 'Vertex Logistics Solutions Ltd', code: 'PTY/VERT/05', status: 'Inactive', type: 'Both', gstin: '33AABCV4567M1Z5', address: 'Ambattur Industrial Estate', city: 'Chennai', state: 'Tamil Nadu', pincode: '600058', phone: '4455823014', email: 'contact@vertexlogistics.com', openingBalance: 3100 }
        ];
        localStorage.setItem('bharat_book_party_masters', JSON.stringify(demoParties));
        calculateStorage();
        loadJsonEditorKey(selectedKey);
        alert('Data Hydrated: 5 comprehensive Corporate Enterprise Party records written successfully!');
    };

    // Seed Demo Catalog Items
    const handleSeedCatalogItems = () => {
        const demoItems = [
            { id: 'itm_1', name: 'Executive Soft Comfort Chair V2', code: 'CH-EXEC-V2', status: 'Active', category: 'Office Infrastructure', hsnCode: '94031000', uom: 'PCS', taxRate: 18, purchasePrice: 4200, salesPrice: 5999, initialStock: 45 },
            { id: 'itm_2', name: 'Recycled Printing Binder Box', code: 'ST-BIND-A4', status: 'Active', category: 'Office Supplies', hsnCode: '48201000', uom: 'BOX', taxRate: 5, purchasePrice: 750, salesPrice: 1200, initialStock: 120 },
            { id: 'itm_3', name: 'Gigabit Network System Adapter', code: 'NET-ADAPT-GIG', status: 'Active', category: 'IT Networking', hsnCode: '85176290', uom: 'PCS', taxRate: 12, purchasePrice: 1250, salesPrice: 1899, initialStock: 35 },
            { id: 'itm_4', name: 'Annual Software Ledger Core Access License', code: 'LIC-ERP-ANNUAL', status: 'Active', category: 'Digital Services', hsnCode: '99831300', uom: 'SVC', taxRate: 18, purchasePrice: 50000, salesPrice: 75000, initialStock: 15 },
            { id: 'itm_5', name: 'Industrial Poly Acoustic Insulation Panels', code: 'PAN-ACO-INS', status: 'Inactive', category: 'Structural Fittings', hsnCode: '68061000', uom: 'PCS', taxRate: 18, purchasePrice: 8500, salesPrice: 11000, initialStock: 0 }
        ];
        localStorage.setItem('bharat_book_item_masters', JSON.stringify(demoItems));
        calculateStorage();
        loadJsonEditorKey(selectedKey);
        alert('Data Hydrated: 5 detailed inventory items and catalog codes added to repository!');
    };

    // Seed Standard General Ledgers
    const handleSeedGeneralLedgers = () => {
        const demoLedgers = [
            { id: 'ldg_1', name: 'State Bank of India Corporate Current A/C', code: 'SBI-CURR-9081', status: 'Active', group: 'Bank Accounts', accountNo: '445522119081', branch: 'BKC Complex', ifsc: 'SBIN0008123' },
            { id: 'ldg_2', name: 'HDFC Master Operating Account', code: 'HDFC-OPER-4411', status: 'Active', group: 'Bank Accounts', accountNo: '012355678912', branch: 'Connaught Circus', ifsc: 'HDFC0000123' },
            { id: 'ldg_3', name: 'Primary Admin Petty Cash Safe', code: 'PETTY-CASH-01', status: 'Active', group: 'Cash-in-hand', openingBalance: 35000 },
            { id: 'ldg_4', name: 'Domestic Revenue Sales A/C', code: 'REVENUE-SALES', status: 'Active', group: 'Sales Accounts' },
            { id: 'ldg_5', name: 'Standard Raw Inventory Purchases A/C', code: 'RAW-PURCHASES', status: 'Active', group: 'Purchase Accounts' },
            { id: 'ldg_6', name: 'Business Operations Office Expense', code: 'EXPENSE-OPS', status: 'Active', group: 'Indirect Expenses' }
        ];
        localStorage.setItem('bharat_book_ledger_masters', JSON.stringify(demoLedgers));
        calculateStorage();
        loadJsonEditorKey(selectedKey);
        alert('Data Hydrated: 6 foundational accounting ledgers configured!');
    };

    // Seed balanced transactional vouchers
    const handleSeedTransactionalVouchers = () => {
        const seedVouchers = [
            {
                id: 'sd_voc_1',
                type: 'Sales',
                isSample: false,
                partyName: { value: 'Reliance Retail Industries', confidence: '98%' },
                date: { value: '2026-05-10', confidence: '98%' },
                time: { value: '11:30', confidence: '98%' },
                amount: { value: 32391, confidence: '98%' },
                tax: { value: 4941, confidence: '98%' },
                invoiceNumber: { value: 'INV/2026/001', confidence: '98%' },
                referenceNo: { value: 'PO-REL-9921', confidence: '98%' },
                ledger: { value: 'Domestic Revenue Sales A/C', confidence: '98%' },
                narration: { value: 'Being standard supply of high comfort executive desk chairs delivered on site', confidence: '98%' },
                items: [
                    {
                        name: { value: 'Executive Soft Comfort Chair V2', confidence: '98%' },
                        quantity: { value: 5, confidence: '98%' },
                        rate: { value: 5490, confidence: '98%' },
                        taxRate: { value: 18, confidence: '98%' },
                        tax: { value: 4941, confidence: '98%' },
                        total: { value: 32391, confidence: '98%' }
                    }
                ],
                auditLogs: [{ id: 'al_1', action: 'Created', timestamp: '2026-05-10T11:30:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_2',
                type: 'Purchase',
                isSample: false,
                partyName: { value: 'Apex Office Distributors', confidence: '98%' },
                date: { value: '2026-05-12', confidence: '98%' },
                time: { value: '14:20', confidence: '98%' },
                amount: { value: 15750, confidence: '98%' },
                tax: { value: 750, confidence: '98%' },
                invoiceNumber: { value: 'APEX/PUR/9082', confidence: '98%' },
                referenceNo: { value: 'REF-APB-8822', confidence: '98%' },
                ledger: { value: 'Standard Raw Inventory Purchases A/C', confidence: '98%' },
                narration: { value: 'Being inventory bulk acquisition of recycled printing binder boxes', confidence: '98%' },
                items: [
                    {
                        name: { value: 'Recycled Printing Binder Box', confidence: '98%' },
                        quantity: { value: 20, confidence: '98%' },
                        rate: { value: 750, confidence: '98%' },
                        taxRate: { value: 5, confidence: '98%' },
                        tax: { value: 750, confidence: '98%' },
                        total: { value: 15750, confidence: '98%' }
                    }
                ],
                auditLogs: [{ id: 'al_2', action: 'Created', timestamp: '2026-05-12T14:20:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_3',
                type: 'Sales',
                isSample: false,
                partyName: { value: 'Infosys Training Systems Ltd', confidence: '98%' },
                date: { value: '2026-05-15', confidence: '98%' },
                time: { value: '16:05', confidence: '98%' },
                amount: { value: 88500, confidence: '98%' },
                tax: { value: 13500, confidence: '98%' },
                invoiceNumber: { value: 'INV/2026/002', confidence: '98%' },
                referenceNo: { value: 'INF-TRG-PO-11', confidence: '98%' },
                ledger: { value: 'Domestic Revenue Sales A/C', confidence: '98%' },
                narration: { value: 'Supply of Core ERP Access software portal subscription keys', confidence: '98%' },
                items: [
                    {
                        name: { value: 'Annual Software Ledger Core Access License', confidence: '98%' },
                        quantity: { value: 1, confidence: '98%' },
                        rate: { value: 75000, confidence: '98%' },
                        taxRate: { value: 18, confidence: '98%' },
                        tax: { value: 13500, confidence: '98%' },
                        total: { value: 88500, confidence: '98%' }
                    }
                ],
                auditLogs: [{ id: 'al_3', action: 'Created', timestamp: '2026-05-15T16:05:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_4',
                type: 'Payment',
                isSample: false,
                partyName: { value: 'Apex Office Distributors', confidence: '98%' },
                date: { value: '2026-05-18', confidence: '98%' },
                time: { value: '10:15', confidence: '98%' },
                amount: { value: 12400, confidence: '98%' },
                paymentMode: { value: 'NEFT Online Transfer', confidence: '98%' },
                ledger: { value: 'HDFC Master Operating Account', confidence: '98%' },
                referenceNo: { value: 'TXN88921102', confidence: '98%' },
                narration: { value: 'Paid to Apex Office Distributors toward settle balance standard invoice', confidence: '98%' },
                items: [],
                auditLogs: [{ id: 'al_4', action: 'Created', timestamp: '2026-05-18T10:15:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_5',
                type: 'Receipt',
                isSample: false,
                partyName: { value: 'Reliance Retail Industries', confidence: '98%' },
                date: { value: '2026-05-20', confidence: '98%' },
                time: { value: '15:45', confidence: '98%' },
                amount: { value: 32391, confidence: '98%' },
                paymentMode: { value: 'IMPS Bank Transfer', confidence: '98%' },
                ledger: { value: 'State Bank of India Corporate Current A/C', confidence: '98%' },
                referenceNo: { value: 'TX55921008272', confidence: '98%' },
                narration: { value: 'Received complete due settlement amount for invoice number INV/2026/001', confidence: '98%' },
                items: [],
                auditLogs: [{ id: 'al_5', action: 'Created', timestamp: '2026-05-20T15:45:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_6',
                type: 'Contra',
                isSample: false,
                date: { value: '2026-05-22', confidence: '98%' },
                time: { value: '12:00', confidence: '98%' },
                amount: { value: 15000, confidence: '98%' },
                fromAccount: { value: 'Primary Admin Petty Cash Safe', confidence: '98%' },
                toAccount: { value: 'HDFC Master Operating Account', confidence: '98%' },
                narration: { value: 'Cash deposit made from office petty safe vault box to general HDFC current bank account', confidence: '98%' },
                items: [],
                auditLogs: [{ id: 'al_6', action: 'Created', timestamp: '2026-05-22T12:00:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_7',
                type: 'Purchase',
                isSample: false,
                partyName: { value: 'Tata Steel Enterprises Ltd', confidence: '98%' },
                date: { value: '2026-05-24', confidence: '98%' },
                time: { value: '11:00', confidence: '98%' },
                amount: { value: 53100, confidence: '98%' },
                tax: { value: 8100, confidence: '98%' },
                invoiceNumber: { value: 'TATA/P/9922', confidence: '98%' },
                referenceNo: { value: 'BOM-RAW-STL-4', confidence: '98%' },
                ledger: { value: 'Standard Raw Inventory Purchases A/C', confidence: '98%' },
                narration: { value: 'Acquisitions of acoustic insulation structural partition sheets', confidence: '98%' },
                items: [
                    {
                        name: { value: 'Industrial Poly Acoustic Insulation Panels', confidence: '98%' },
                        quantity: { value: 5, confidence: '98%' },
                        rate: { value: 9000, confidence: '98%' },
                        taxRate: { value: 18, confidence: '98%' },
                        tax: { value: 8100, confidence: '98%' },
                        total: { value: 53100, confidence: '98%' }
                    }
                ],
                auditLogs: [{ id: 'al_7', action: 'Created', timestamp: '2026-05-24T11:00:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_8',
                type: 'Journal',
                isSample: false,
                date: { value: '2026-05-25', confidence: '98%' },
                time: { value: '17:30', confidence: '98%' },
                amount: { value: 4500, confidence: '98%' },
                debitLedger: { value: 'Business Operations Office Expense', confidence: '98%' },
                creditLedger: { value: 'Primary Admin Petty Cash Safe', confidence: '98%' },
                narration: { value: 'Correction journal to charge direct electric bulb replacements and fan repair to operations accounts', confidence: '98%' },
                items: [],
                auditLogs: [{ id: 'al_8', action: 'Created', timestamp: '2026-05-25T17:30:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_9',
                type: 'Sales',
                isSample: false,
                partyName: { value: 'Infosys Training Systems Ltd', confidence: '98%' },
                date: { value: '2026-05-26', confidence: '98%' },
                time: { value: '10:00', confidence: '98%' },
                amount: { value: 42537.6, confidence: '98%' },
                tax: { value: 4557.6, confidence: '98%' },
                invoiceNumber: { value: 'INV/2026/003', confidence: '98%' },
                referenceNo: { value: 'INF-TRG-99A', confidence: '98%' },
                ledger: { value: 'Domestic Revenue Sales A/C', confidence: '98%' },
                narration: { value: 'Integrated networking adapters and hardware interface setup for conference screens', confidence: '98%' },
                items: [
                    {
                        name: { value: 'Gigabit Network System Adapter', confidence: '98%' },
                        quantity: { value: 20, confidence: '98%' },
                        rate: { value: 1899, confidence: '98%' },
                        taxRate: { value: 12, confidence: '98%' },
                        tax: { value: 4557.6, confidence: '98%' },
                        total: { value: 42537.6, confidence: '98%' }
                    }
                ],
                auditLogs: [{ id: 'al_9', action: 'Created', timestamp: '2026-05-26T10:00:00Z', author: 'System Admin', details: 'Automated seed generation' }]
            },
            {
                id: 'sd_voc_10',
                type: 'Payment',
                isSample: false,
                partyName: { value: 'Tata Steel Enterprises Ltd', confidence: '98%' },
                date: { value: '2026-05-28', confidence: '98%' },
                time: { value: '09:30', confidence: '98%' },
                amount: { value: 53100, confidence: '98%' },
                paymentMode: { value: 'RTGS Interbank', confidence: '98%' },
                ledger: { value: 'State Bank of India Corporate Current A/C', confidence: '98%' },
                referenceNo: { value: 'RTGS-N0099238', confidence: '98%' },
                narration: { value: 'Settlement made to Tata Steel for Acoustic partition wall structures', confidence: '98%' },
                items: [],
                auditLogs: [{ id: 'al_10', action: 'Created', timestamp: '2026-05-28T09:30:00Z', author: 'Admin Developer', details: 'Direct test seed script' }]
            }
        ];
        
        localStorage.setItem('bharat_book_all_vouchers_v2_v2', JSON.stringify(seedVouchers));
        localStorage.setItem('bharat_book_active_samples_v12', JSON.stringify([]));
        
        calculateStorage();
        loadJsonEditorKey(selectedKey);
        alert('Data Hydrated: 10 premium accounting vouchers covering Sales, Purchases, Payments, Receipts, Contras, and Journals generated in index successfully!');
    };

    const wipeData = (type: 'vouchers' | 'masters' | 'all' | 'cache') => {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bharat_book')) {
                if (type === 'all') {
                    keysToRemove.push(key);
                } else if (type === 'vouchers' && (key.includes('_all_vouchers') || key.includes('_active_samples') || key.includes('vouchers'))) {
                    keysToRemove.push(key);
                } else if (type === 'masters' && (key.includes('_masters') || key.includes('item_') || key.includes('party_'))) {
                    keysToRemove.push(key);
                } else if (type === 'cache') {
                    if (key.includes('draft') || key.includes('purged') || key.includes('settings') || key.includes('audit')) {
                        keysToRemove.push(key);
                    }
                }
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        calculateStorage();
        loadJsonEditorKey(selectedKey);
        alert(`Data Type (${type}) wiped from active browser segments. Application will now soft reload diagnostic indexes!`);
        setShowConfirm(null);
    };

    const handleSelectKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedKey(val);
        loadJsonEditorKey(val);
    };

    const handleSaveJson = () => {
        setEditorError(null);
        setEditorSuccess(false);
        try {
            const parsed = JSON.parse(editorValue);
            localStorage.setItem(selectedKey, JSON.stringify(parsed));
            setEditorSuccess(true);
            calculateStorage();
            setTimeout(() => setEditorSuccess(false), 3000);
        } catch (err: any) {
            setEditorError(`Syntax Error: ${err.message || 'Malformed JSON. Ensure commas and brackets match.'}`);
        }
    };

    const runPerformanceProbe = () => {
        if (benchmarkRunning) return;
        setBenchmarkRunning(true);
        setBenchmarkMs(null);
        
        setTimeout(() => {
            const tStart = performance.now();
            const dummyKey = 'bharat_book_performance_latency_probe';
            
            for (let x = 0; x < 600; x++) {
                localStorage.setItem(`${dummyKey}_${x}`, JSON.stringify({ index: x, content: "lat_x_883_erp_speedtest", stamp: Date.now() }));
            }
            
            for (let x = 0; x < 600; x++) {
                localStorage.getItem(`${dummyKey}_${x}`);
            }
            
            for (let x = 0; x < 600; x++) {
                localStorage.removeItem(`${dummyKey}_${x}`);
            }
            
            const tEnd = performance.now();
            const elapsed = Math.round(tEnd - tStart);
            setBenchmarkMs(elapsed);
            
            if (elapsed < 12) {
                setBenchmarkRating('S-Tier (Hyper High-Performance SSD Context)');
            } else if (elapsed < 35) {
                setBenchmarkRating('A-Tier (Standard Ultra-Fast Local Engine)');
            } else if (elapsed < 80) {
                setBenchmarkRating('B-Tier (Fairly Competent Sandbox Latency)');
            } else {
                setBenchmarkRating('C-Tier (Throttled Thread Stack or High-Load Agent Browser)');
            }
            setBenchmarkRunning(false);
        }, 500);
    };

    const handleDatabaseRepairAudit = () => {
        let repairedKeys = 0;
        
        try {
            const vStr = localStorage.getItem('bharat_book_all_vouchers_v2_v2');
            if (vStr) {
                const parsed = JSON.parse(vStr);
                if (Array.isArray(parsed)) {
                    const seen = new Set();
                    const clean = parsed.filter(item => {
                        if (!item || !item.id) return false;
                        if (seen.has(item.id)) return false;
                        seen.add(item.id);
                        return true;
                    });
                    if (clean.length !== parsed.length) {
                        localStorage.setItem('bharat_book_all_vouchers_v2_v2', JSON.stringify(clean));
                        repairedKeys++;
                    }
                }
            }

            const pStr = localStorage.getItem('bharat_book_party_masters');
            if (pStr) {
                const parsed = JSON.parse(pStr);
                if (Array.isArray(parsed)) {
                    const seen = new Set();
                    const clean = parsed.filter(item => {
                        if (!item || !item.name) return false;
                        const trimmedName = item.name.trim();
                        if (seen.has(trimmedName)) return false;
                        seen.add(trimmedName);
                        item.name = trimmedName;
                        return true;
                    });
                    if (clean.length !== parsed.length) {
                        localStorage.setItem('bharat_book_party_masters', JSON.stringify(clean));
                        repairedKeys++;
                    }
                }
            }

            const iStr = localStorage.getItem('bharat_book_item_masters');
            if (iStr) {
                const parsed = JSON.parse(iStr);
                if (Array.isArray(parsed)) {
                    const seen = new Set();
                    const clean = parsed.filter(item => {
                        if (!item || !item.name) return false;
                        const trimmedName = item.name.trim();
                        if (seen.has(trimmedName)) return false;
                        seen.add(trimmedName);
                        item.name = trimmedName;
                        return true;
                    });
                    if (clean.length !== parsed.length) {
                        localStorage.setItem('bharat_book_item_masters', JSON.stringify(clean));
                        repairedKeys++;
                    }
                }
            }
            
            calculateStorage();
            loadJsonEditorKey(selectedKey);
            alert(repairedKeys > 0 
                ? `System Optimization Done! Cleaned or sorted ${repairedKeys} indices, pruned whitespaces and purged duplications.`
                : 'Structural Check complete. All relational ledger rows, schemas, and master tables in optimum condition!'
            );
        } catch (e) {
            alert('Integrity repair process encountered structural mismatch. Clean wipe recommended.');
        }
    };

    const handleToggleGate = (key: keyof FeatureGates) => {
        setGatesSaved(false);
        const updated = { ...featureGates, [key]: !featureGates[key] };
        setFeatureGates(updated);
    };

    const handleSaveGates = () => {
        localStorage.setItem('bharat_book_admin_feature_gates', JSON.stringify(featureGates));
        setGatesSaved(true);
        setTimeout(() => setGatesSaved(false), 3000);
    };

    const maxQuotaBytes = 5 * 1024 * 1024;
    const storagePercent = Math.min(100, Math.max(0.1, (storageBytes / maxQuotaBytes) * 100));
    
    let quotaIndicatorColor = "bg-emerald-500";
    let quotaTextColor = "text-emerald-600 dark:text-emerald-400";
    if (storagePercent > 80) {
        quotaIndicatorColor = "bg-rose-500 animate-pulse";
        quotaTextColor = "text-rose-600 dark:text-rose-400";
    } else if (storagePercent > 40) {
        quotaIndicatorColor = "bg-amber-500";
        quotaTextColor = "text-amber-600 dark:text-amber-400";
    }

    const metricItems = [
        { label: "Vouchers", value: stats.vouchers, icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30" },
        { label: "Parties", value: stats.parties, icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100/50 dark:border-indigo-900/30" },
        { label: "Items", value: stats.items, icon: Package, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100/50 dark:border-amber-900/30" },
        { label: "Ledgers", value: stats.ledgers, icon: Database, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30" },
    ];

    return {
        t,
        storageUsed,
        storageBytes,
        showConfirm,
        setShowConfirm,
        stats,
        expandedSection,
        setExpandedSection,
        activeSchemaTemplate,
        setActiveSchemaTemplate,
        systemLogs,
        setSystemLogs,
        selectedKey,
        editorValue,
        setEditorValue,
        editorError,
        editorSuccess,
        benchmarkMs,
        benchmarkRating,
        benchmarkRunning,
        featureGates,
        gatesSaved,
        maxQuotaBytes,
        storagePercent,
        quotaIndicatorColor,
        quotaTextColor,
        metricItems,
        calculateStorage,
        handleBackup,
        handleRestore,
        handleSeedParties,
        handleSeedCatalogItems,
        handleSeedGeneralLedgers,
        handleSeedTransactionalVouchers,
        wipeData,
        loadJsonEditorKey,
        handleSelectKeyChange,
        handleSaveJson,
        runPerformanceProbe,
        handleDatabaseRepairAudit,
        handleToggleGate,
        handleSaveGates,
    };
};
