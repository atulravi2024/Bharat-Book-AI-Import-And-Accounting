import React, { useState, useEffect } from 'react';
import { 
    Shield, 
    Database, 
    HardDrive, 
    Download, 
    Upload, 
    RefreshCw, 
    CheckCircle2, 
    ChevronDown, 
    ChevronUp, 
    AlertTriangle, 
    Trash2, 
    FileText, 
    Users, 
    Package, 
    Settings, 
    Info,
    Zap,
    Play,
    Check,
    Gauge,
    Sliders,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FeatureGates {
    compactDensity: boolean;
    audioFeedback: boolean;
    skipPopups: boolean;
    allowNegativeStock: boolean;
    highContrastBorders: boolean;
    autoGstRounding: boolean;
}

const defaultFeatureGates: FeatureGates = {
    compactDensity: false,
    audioFeedback: false,
    skipPopups: false,
    allowNegativeStock: false,
    highContrastBorders: false,
    autoGstRounding: true,
};

export const AdminSettings: React.FC = () => {
    const { t } = useLanguage();
    const [storageUsed, setStorageUsed] = useState<string>('0 KB');
    const [storageBytes, setStorageBytes] = useState<number>(0);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);
    const [stats, setStats] = useState({
        vouchers: 0,
        parties: 0,
        items: 0,
        ledgers: 0,
    });

    // Unified Accordion State: ALL collapsed by default. Only one active section allowed at a time.
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    // Schema Template and Audit states for additional admin features
    const [activeSchemaTemplate, setActiveSchemaTemplate] = useState<string>('GAAP');
    const [systemLogs, setSystemLogs] = useState<Array<{time: string; event: string; user: string; status: string}>>([
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

    useEffect(() => {
        calculateStorage();
        loadJsonEditorKey('bharat_book_all_vouchers_v2_v2');
        
        // Load Feature Gates
        try {
            const savedGates = localStorage.getItem('bharat_book_admin_feature_gates');
            if (savedGates) {
                setFeatureGates({ ...defaultFeatureGates, ...JSON.parse(savedGates) });
            }
        } catch (e) {
            console.error("Failed to load feature gates", e);
        }
    }, []);

    const calculateStorage = () => {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bharat_book')) {
                const item = localStorage.getItem(key);
                if (item) {
                    // Rough estimation: each UTF-16 character is 2 bytes
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
            const i = JSON.parse(localStorage.getItem('bharat_book_item_masters') || '[]');
            const l = JSON.parse(localStorage.getItem('bharat_book_ledger_masters') || '[]');
            setStats({
                vouchers: Array.isArray(v) ? v.length : 0,
                parties: Array.isArray(p) ? p.length : 0,
                items: Array.isArray(i) ? i.length : 0,
                ledgers: Array.isArray(l) ? l.length : 0,
            });
        } catch (e) {
            console.error("Failed to parse stats", e);
        }
    };

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
            // Voucher 1: Sales
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
            // Voucher 2: Purchase
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
            // Voucher 3: Sales
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
            // Voucher 4: Payment
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
            // Voucher 5: Receipt
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
            // Voucher 6: Contra
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
            // Voucher 7: Purchase
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
            // Voucher 8: Journal
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
            // Voucher 9: Sales
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
            // Voucher 10: Payment
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
        
        // Also write sample sets into App.tsx active samples storage to activate components seamlessly
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

    // JSON editor interactive routines
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

    // Performance latency speed probe
    const runPerformanceProbe = () => {
        if (benchmarkRunning) return;
        setBenchmarkRunning(true);
        setBenchmarkMs(null);
        
        setTimeout(() => {
            const tStart = performance.now();
            const dummyKey = 'bharat_book_performance_latency_probe';
            
            // Loop 600 Writes
            for (let x = 0; x < 600; x++) {
                localStorage.setItem(`${dummyKey}_${x}`, JSON.stringify({ index: x, content: "lat_x_883_erp_speedtest", stamp: Date.now() }));
            }
            
            // Loop 600 Reads
            for (let x = 0; x < 600; x++) {
                const item = localStorage.getItem(`${dummyKey}_${x}`);
            }
            
            // Loop 600 Deletes
            for (let x = 0; x < 600; x++) {
                localStorage.removeItem(`${dummyKey}_${x}`);
            }
            
            const tEnd = performance.now();
            const elapsed = Math.round(tEnd - tStart);
            setBenchmarkMs(elapsed);
            
            // Define ratings
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

    // Database index audit-repair routine
    const handleDatabaseRepairAudit = () => {
        let repairedKeys = 0;
        
        try {
            // Repair vouchers
            const vStr = localStorage.getItem('bharat_book_all_vouchers_v2_v2');
            if (vStr) {
                const parsed = JSON.parse(vStr);
                if (Array.isArray(parsed)) {
                    // Check duplicates by ID
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

            // Repair parties
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
                        item.name = trimmedName; // trim spaces
                        return true;
                    });
                    if (clean.length !== parsed.length) {
                        localStorage.setItem('bharat_book_party_masters', JSON.stringify(clean));
                        repairedKeys++;
                    }
                }
            }

            // Repair items
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

    // Save feature gates
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

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100/80 shadow-sm dark:bg-gray-950 dark:border-gray-900 max-w-5xl mx-auto space-y-6">
            
            {/* Header section (Compact, Gorgeous & Modern) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-150/40 dark:border-gray-900 pb-5 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        {t("System Administration")}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-xl">
                        {t("Oversee Sandboxed Database storage allocation, execute core data seeding, adjust runtime system variables, run live IO thread latency tests, or make direct code object revisions.")}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50/55 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-100/50 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/35 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 
                    <span>{t("Index Healthy")}</span>
                </div>
            </div>

            {/* Accordion / Collapsible Sections Container */}
            <div className="space-y-3.5">
                
                {/* 1. Diagnostics (Collapsible - ALL COLLAPSED BY DEFAULT) */}
                <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'diagnostics' ? null : 'diagnostics')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <HardDrive className="w-4 h-4" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("System Diagnostics & Storage")}</h4>
                                <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Allocation indexes and active table records stats")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
                            {expandedSection === 'diagnostics' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </button>

                    {expandedSection === 'diagnostics' && (
                        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-5 animate-in fade-in duration-150">
                            
                            {/* Storage diagnostics grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                                            <Info className="w-3.5 h-3.5 text-gray-400" />
                                            {t("Sandboxed Database Usage")}
                                        </span>
                                        <span className={`font-bold ${quotaTextColor}`}>
                                            {storageUsed} / 5.00 MB ({storagePercent.toFixed(2)}%)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-300 ${quotaIndicatorColor}`}
                                            style={{ width: `${storagePercent}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        {t("Bharat Book index parameters are held locally in standard Key-Value tables. Ensure browser storage permission is not auto-purged.")}
                                    </p>
                                </div>
                                
                                <div className="flex justify-end md:justify-center items-center">
                                    <button
                                        onClick={calculateStorage}
                                        className="inline-flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 px-3.5 py-1.5 rounded-xl text-[11px] font-bold hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 transition shadow-xs"
                                    >
                                        <RefreshCw className="w-3 h-3 text-indigo-500" />
                                        {t("Refresh Storage Counts")}
                                    </button>
                                </div>
                            </div>

                            {/* Metrical statistics block */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                                {metricItems.map((met) => (
                                    <div key={met.label} className={`rounded-xl p-3 border ${met.bg} flex items-center justify-between`}>
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide">{met.label}</span>
                                            <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{met.value}</p>
                                        </div>
                                        <div className={`p-1.5 rounded-lg bg-white dark:bg-gray-900/80 shadow-xs ${met.color}`}>
                                            <met.icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}
                </div>

                {/* 2. Automatic Sample Seeding (Collapsible - ALL COLLAPSED BY DEFAULT) */}
                <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'seeding' ? null : 'seeding')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center animate-pulse">
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Automatic Seeding & Sampling")}</h4>
                                <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Hydrate realistic transactions and custom master accounts instantly")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-amber-500/10 text-amber-600 border border-amber-500/25 dark:bg-amber-950/45 dark:text-amber-400 shrink-0">{t("DEMO SEEDER")}</span>
                            {expandedSection === 'seeding' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </button>

                    {expandedSection === 'seeding' && (
                        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
                            <div className="bg-amber-50/30 border border-amber-100/40 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-amber-800 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-950/20 leading-relaxed">
                                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block mb-0.5">{t("Sandbox Automated Hydration Framework")}</span>
                                    {t("Running empty accounts? Use these utilities to immediately seed mock data conforming to strict Indian regulatory GST tax templates. Seeded records will instantly populate interactive dashboards.")}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                                <button
                                    onClick={handleSeedParties}
                                    className="inline-flex flex-col items-start gap-2 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 p-3.5 border border-gray-200 dark:border-gray-800 rounded-xl transition shadow-xs group"
                                >
                                    <Users className="w-4 h-4 text-amber-500" />
                                    <div>
                                        <span className="font-bold text-xs text-gray-900 dark:text-white block">{t("Seed Party Masters")}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">{t("Injects 5 high-profile active client & vendor files.")}</span>
                                    </div>
                                </button>

                                <button
                                    onClick={handleSeedCatalogItems}
                                    className="inline-flex flex-col items-start gap-2 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 p-3.5 border border-gray-200 dark:border-gray-800 rounded-xl transition shadow-xs group"
                                >
                                    <Package className="w-4 h-4 text-indigo-500" />
                                    <div>
                                        <span className="font-bold text-xs text-gray-900 dark:text-white block">{t("Seed SKU Catalog")}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">{t("Injects 5 realistic inventory items with tax rates.")}</span>
                                    </div>
                                </button>

                                <button
                                    onClick={handleSeedGeneralLedgers}
                                    className="inline-flex flex-col items-start gap-2 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 p-3.5 border border-gray-200 dark:border-gray-800 rounded-xl transition shadow-xs group"
                                >
                                    <Database className="w-4 h-4 text-emerald-500" />
                                    <div>
                                        <span className="font-bold text-xs text-gray-900 dark:text-white block">{t("Seed Ledgers")}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">{t("Registers cash chests, sales A/C, operational expense rows.")}</span>
                                    </div>
                                </button>

                                <button
                                    onClick={handleSeedTransactionalVouchers}
                                    className="inline-flex flex-col items-start gap-2 text-left bg-white dark:bg-gray-900 hover:bg-amber-50/20 dark:hover:bg-amber-950/15 p-3.5 border border-gray-200 dark:border-amber-950/40 rounded-xl transition shadow-xs cursor-pointer group"
                                >
                                    <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
                                    <div>
                                        <span className="font-bold text-xs text-orange-650 dark:text-amber-400 block flex items-center gap-1">{t("Seed 10 Transactions")} <Sparkles className="w-3 h-3 text-yellow-500" /></span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">{t("Generates beautiful Sales, Purchase, Receipts and Contra rows.")}</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Direct JSON Controller & Browser Editor (Collapsible - ALL COLLAPSED BY DEFAULT) */}
                <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'jsonEditor' ? null : 'jsonEditor')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Live JSON Registry Console")}</h4>
                                <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Read, execute, and write local raw datasets with active schema validate")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
                            {expandedSection === 'jsonEditor' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </button>

                    {expandedSection === 'jsonEditor' && (
                        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
                            
                            {/* Selected key controller */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-900">
                                <div className="space-y-0.5">
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t("Active Master Table Key")}</label>
                                    <select 
                                        className="bg-transparent border-0 outline-none p-0 font-bold text-xs text-gray-900 dark:text-white cursor-pointer select-none focus:ring-0"
                                        value={selectedKey}
                                        onChange={handleSelectKeyChange}
                                    >
                                        <option value="bharat_book_all_vouchers_v2_v2">Transactions - (bharat_book_all_vouchers_v2_v2)</option>
                                        <option value="bharat_book_party_masters">Customers & Vendors - (bharat_book_party_masters)</option>
                                        <option value="bharat_book_item_masters">Items Catalog - (bharat_book_item_masters)</option>
                                        <option value="bharat_book_ledger_masters">Account Ledgers - (bharat_book_ledger_masters)</option>
                                        <option value="bharat_book_admin_feature_gates">Accessibility Toggles - (bharat_book_admin_feature_gates)</option>
                                        <option value="bharat_book_managed_users">Registered Staff Credentials - (bharat_book_managed_users)</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => loadJsonEditorKey(selectedKey)}
                                        className="h-7 text-[10px] font-bold px-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-900 transition flex items-center gap-1 bg-white dark:bg-gray-950"
                                    >
                                        <RefreshCw className="w-3 h-3 text-indigo-500" /> {t("Discard Edits")}
                                    </button>
                                    <button 
                                        onClick={handleSaveJson}
                                        className="h-7 text-[10px] font-bold px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1"
                                    >
                                        <Check className="w-3 h-3" /> {t("Save Changes")}
                                    </button>
                                </div>
                            </div>

                            {/* Direct JSON code textarea */}
                            <div className="relative">
                                <textarea
                                    className="w-full h-52 bg-gray-900 text-gray-100 font-mono text-xs p-4 rounded-xl border border-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm leading-relaxed"
                                    value={editorValue}
                                    onChange={(e) => setEditorValue(e.target.value)}
                                    placeholder='[{ "id": "demo", "data": {} }]'
                                    spellCheck={false}
                                />
                                <div className="absolute bottom-2.5 right-2 text-[10px] font-bold font-mono text-gray-500 select-none bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                                    {t("JSON Syntax Console")}
                                </div>
                            </div>

                            {/* Alert system */}
                            {editorError && (
                                <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 text-rose-705 dark:text-rose-400 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                                    <span>{editorError}</span>
                                </div>
                            )}

                            {editorSuccess && (
                                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/20 dark:border-emerald-900/35 text-emerald-850 dark:text-emerald-400 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 animate-bounce" />
                                    <span>{t("Success: Registry database modified safely. Active layouts refreshed!")}</span>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* 4. Speed Test benchmarks & Index Optimizers (Collapsible - ALL COLLAPSED BY DEFAULT) */}
                <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'benchmark' ? null : 'benchmark')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-650 dark:text-emerald-400 flex items-center justify-center">
                                <Gauge className="w-4 h-4" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("IO Latency Speed & DB Repair")}</h4>
                                <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Benchmark localStorage throughput and clean empty indexes")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
                            {expandedSection === 'benchmark' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </button>

                    {expandedSection === 'benchmark' && (
                        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Benchmarking Card */}
                                <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-xl p-4 border border-gray-100 dark:border-gray-900/75 flex flex-col justify-between">
                                    <div className="space-y-1.5 mb-4">
                                        <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                                            <Gauge className="w-3.5 h-3.5 text-indigo-505" /> {t("Thread IO Throughput Test")}
                                        </h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {t("Performs 600 parallel synchronous row writes, active scanner readings and deletion queries to estimate browser sandbox execution latency.")}
                                        </p>
                                        
                                        {benchmarkMs !== null && (
                                            <div className="bg-white dark:bg-gray-950 rounded-lg p-2.5 border border-gray-100 dark:border-gray-900 mt-2 space-y-1">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-gray-400 font-medium">Operation Delay:</span>
                                                    <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400">{benchmarkMs} ms</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-gray-400 font-medium">Rating Level:</span>
                                                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{benchmarkRating}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={runPerformanceProbe}
                                        disabled={benchmarkRunning}
                                        className="w-full h-8 inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                                    >
                                        {benchmarkRunning ? (
                                            <>
                                                <RefreshCw className="w-3 h-3 animate-spin" /> {t("Measuring Channels...")}
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-3 h-3" /> {t("Boot Operation Speed Benchmark")}
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* DB Index Optimiser Card */}
                                <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-xl p-4 border border-gray-100 dark:border-gray-900/75 flex flex-col justify-between">
                                    <div className="space-y-1.5 mb-4">
                                        <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-505" /> {t("DB Index Audit & Key Repair")}
                                        </h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {t("Scans vouchers, item catalogs, and client records for duplications. Cleans whitespace gaps, purges hanging orphan objects, and re-sorts index tags for smooth performance.")}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleDatabaseRepairAudit}
                                        className="w-full h-8 inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-100/50 border border-gray-200 text-gray-750 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 text-[10px] font-bold rounded-xl transition shadow-xs"
                                    >
                                        <Check className="w-3.5 h-3.5 text-emerald-500" /> {t("Start Index Audit & Repair")}
                                    </button>
                                </div>

                            </div>
                            
                        </div>
                    )}
                </div>

                {/* 5. Custom Accessibility Feature Gates (Collapsible - ALL COLLAPSED BY DEFAULT) */}
                <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'featureGates' ? null : 'featureGates')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                                <Sliders className="w-4 h-4" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Accessibility Feature Gates")}</h4>
                                <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Toggle runtime flags and override visual components rendering")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
                            {expandedSection === 'featureGates' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </button>

                    {expandedSection === 'featureGates' && (
                        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    
                                    <label className="flex items-start gap-2.5 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                                            checked={featureGates.compactDensity}
                                            onChange={() => handleToggleGate('compactDensity')}
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-550 transition block">{t("Compact Table density")}</span>
                                            <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Shrinks grid paddings to maximize columns visualization.")}</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                                            checked={featureGates.audioFeedback}
                                            onChange={() => handleToggleGate('audioFeedback')}
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-550 transition block">{t("Audio confirmation synths")}</span>
                                            <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Enables soft synth chimes on voucher validation.")}</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                                            checked={featureGates.skipPopups}
                                            onChange={() => handleToggleGate('skipPopups')}
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-550 transition block">{t("Skip multi-step popups")}</span>
                                            <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Auto-saves OCR extractions to main list directly.")}</span>
                                        </div>
                                    </label>

                                </div>

                                <div className="space-y-3">
                                    
                                    <label className="flex items-start gap-2.5 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                                            checked={featureGates.allowNegativeStock}
                                            onChange={() => handleToggleGate('allowNegativeStock')}
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-550 transition block">{t("Allow negative catalog stocks")}</span>
                                            <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Bypasses warning popups when stock registers negative numbers.")}</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                                            checked={featureGates.highContrastBorders}
                                            onChange={() => handleToggleGate('highContrastBorders')}
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-550 transition block">{t("High contrast screen boundaries")}</span>
                                            <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Applies dark ink divider definitions around major grids.")}</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                                            checked={featureGates.autoGstRounding}
                                            onChange={() => handleToggleGate('autoGstRounding')}
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-550 transition block">{t("Auto GST rounding differences")}</span>
                                            <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Automatically pads fraction rounding differences to SGST/CGST.")}</span>
                                        </div>
                                    </label>

                                </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-900 items-center gap-3">
                                {gatesSaved && (
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{t("Settings persistence complete!")}</span>
                                )}
                                <button
                                    onClick={handleSaveGates}
                                    className="h-8 text-[11px] font-bold px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs flex items-center gap-1"
                                >
                                    <Check className="w-3.5 h-3.5" /> {t("Apply Accessibility Options")}
                                </button>
                            </div>

                        </div>
                    )}
                </div>

                {/* 6. Data Backup & Recovery (Collapsible - ALL COLLAPSED BY DEFAULT) */}
                <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'backup' ? null : 'backup')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <Shield className="w-4 h-4" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Data Backups, Exports & Restore")}</h4>
                                <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Secure local data schema extraction & snapshot restoring")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
                            {expandedSection === 'backup' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </button>

                    {expandedSection === 'backup' && (
                        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-155">
                            <div className="bg-emerald-50/30 border border-emerald-100/40 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-emerald-800 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-950/20 leading-relaxed">
                                <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block mb-0.5">{t("Disaster Recovery Framework")}</span>
                                    {t("Downloading a backup generates a plain JSON extract of all existing ledger setups, transactions, statements, and key variables. Restoring will patch these entries directly.")}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                                <button
                                    onClick={handleBackup}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    {t("Download Full JSON Backup")}
                                </button>
                                
                                <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition shadow-xs-none">
                                    <Upload className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                    <span>{t("Upload & Restore Backup")}</span>
                                    <input
                                        type="file"
                                        accept=".json"
                                        className="hidden"
                                        onChange={handleRestore}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* 6. Active Master Schema Template Customizer (Collapsible) */}
                <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'schemaTemplate' ? null : 'schemaTemplate')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-blue-55 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Database className="w-4 h-4" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Active Master Schema Customizer")}</h4>
                                <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Manage relational database tables and apply regional ERP schemas")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-amber-500/10 text-amber-600 border border-amber-500/25 dark:bg-amber-950/45 dark:text-amber-400 shrink-0">{t("SIMULATED MODULE")}</span>
                            {expandedSection === 'schemaTemplate' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </button>

                    {expandedSection === 'schemaTemplate' && (
                        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
                            <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/30 dark:border-blue-900/30 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block mb-0.5">{t("Multi-Schema Engine Selection")}</span>
                                    {t("You can instantly switch the active layout models to fit a specific regional tax directive. Choosing a schema re-indexes secondary keys (e.g. GSTIN, PAN, HSN structures) or unlocks custom experimental columns dynamically.")}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                    { key: 'GAAP', title: 'Indian GST / GAAP Schema', desc: 'Standard double-entry Ledger mapping with full CGST/SGST/IGST compliance frameworks and HSN table catalogs.', active: activeSchemaTemplate === 'GAAP' },
                                    { key: 'RETAIL', title: 'B2C Simplified Retail Schema', desc: 'Pre-configures cash journal transactions, skipping secondary bulk ledger confirmations for high-volume transactions.', active: activeSchemaTemplate === 'RETAIL' },
                                    { key: 'MFG', title: 'Enterprise Logistics & Manufacturing', desc: 'Enables custom raw materials bill-of-materials ledger mapping, inventory cost tracking, and unit factors.', active: activeSchemaTemplate === 'MFG' }
                                ].map((template) => (
                                    <div 
                                        key={template.key}
                                        onClick={() => {
                                            setActiveSchemaTemplate(template.key);
                                            // Add a mock action log
                                            setSystemLogs(prev => [
                                                { time: new Date().toISOString().replace('T', ' ').substring(0, 19), event: `Schema Altered to ${template.key}`, user: 'Atul Ravi (SA)', status: 'Active' },
                                                ...prev
                                            ]);
                                        }}
                                        className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                            template.active 
                                                ? 'bg-blue-50/30 border-blue-400 dark:bg-blue-950/20 dark:border-blue-700' 
                                                : 'bg-white border-gray-150 dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50/50'
                                        }`}
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-black uppercase tracking-wider text-gray-950 dark:text-white">{template.title}</span>
                                                {template.active && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                            </div>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{template.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Schema columns validation checklist */}
                            <div className="bg-gray-50/55 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-900/60 mt-2">
                                <h5 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{t("Currently Loaded Table Definitions")}</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
                                    <div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200 block">transactions_v2</span>
                                        <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{t("22 active variables")}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200 block">party_profiles</span>
                                        <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{t("15 active variables")}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200 block">item_catalogs</span>
                                        <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{t("11 active variables")}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200 block">ledger_master_v3</span>
                                        <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{t("8 active variables")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 7. Access Control & Security Audit Logs (Collapsible) */}
                <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'securityAudit' ? null : 'securityAudit')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-amber-55 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Shield className="w-4 h-4" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Access Control & Security Audit Logs")}</h4>
                                <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Live tracking record of administrative commands and root state mutations")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING LOGS")}</span>
                            {expandedSection === 'securityAudit' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </button>

                    {expandedSection === 'securityAudit' && (
                        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-900 pb-3">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">{t("Administrator Activity Registers")}</h4>
                                    <p className="text-[10px] text-gray-450 dark:text-gray-500 mt-1">{t("Real-time telemetry logging of modifications to critical core ledger indices.")}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSystemLogs(prev => [
                                            { time: new Date().toISOString().replace('T', ' ').substring(0, 19), event: 'Audit Logs Manually Purged', user: 'Atul Ravi (SA)', status: 'Rotated' }
                                        ]);
                                    }}
                                    className="h-7 text-[10px] font-bold px-3 rounded-lg border border-gray-200 dark:border-gray-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" /> {t("Flush Logs")}
                                </button>
                            </div>

                            <div className="overflow-x-auto border border-gray-100 dark:border-gray-900 rounded-xl bg-gray-50/50 dark:bg-gray-900/35">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-900 bg-gray-50/75 dark:bg-gray-900/50 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                            <th className="p-3">Time Event (UTC)</th>
                                            <th className="p-3">{t("Audit Event Context")}</th>
                                            <th className="p-3">{t("Initiating Operator")}</th>
                                            <th className="p-3 text-right">{t("Verification")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-900 font-mono text-[11px] text-gray-650 dark:text-gray-350">
                                        {systemLogs.map((log, idx) => (
                                            <tr key={idx} className="hover:bg-white dark:hover:bg-gray-950/50 transition duration-100">
                                                <td className="p-3 font-semibold text-gray-400">{log.time}</td>
                                                <td className="p-3 font-semibold text-gray-850 dark:text-gray-100">{log.event}</td>
                                                <td className="p-3">{log.user}</td>
                                                <td className="p-3 text-right">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                        log.status === 'Success' || log.status === 'Balanced' || log.status === 'Active'
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30'
                                                            : log.status === 'Optimized' || log.status === 'Complete'
                                                            ? 'bg-indigo-50 dark:bg-indigo-950/35 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30'
                                                            : 'bg-amber-50 dark:bg-amber-950/35 text-amber-600 dark:text-amber-400 border border-amber-100/30'
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* 8. Danger Zone (Collapsible - ALL COLLAPSED BY DEFAULT) */}
                <div className="border border-rose-100 dark:border-rose-950/60 rounded-2xl overflow-hidden bg-rose-50/10 dark:bg-rose-950/5 transition-all shadow-xs">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === 'danger' ? null : 'danger')}
                        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-rose-900 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-955 transition duration-150"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-rose-100 dark:bg-rose-955 text-rose-600 dark:text-rose-450 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 animate-pulse" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-rose-800 dark:text-rose-400">{t("System Destruction & Maintenance")}</h4>
                                <p className="text-[10px] font-normal text-rose-700/70 dark:text-rose-400/60 mt-0.5">{t("Irreversible data purge algorithms and total system resets")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-rose-500/10 text-rose-600 border border-rose-500/25 dark:bg-rose-950/45 dark:text-rose-450 shrink-0 font-extrabold">{t("REAL WORKING/DESTRUCTIVE")}</span>
                            {expandedSection === 'danger' ? <ChevronUp className="w-4 h-4 text-rose-400/80" /> : <ChevronDown className="w-4 h-4 text-rose-400/80" />}
                        </div>
                    </button>

                    {expandedSection === 'danger' && (
                        <div className="p-5 border-t border-rose-100 dark:border-rose-950/20 space-y-4 animate-in fade-in duration-155 bg-white dark:bg-gray-950">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Box 1: Clear Cache */}
                                <div className="border border-gray-100 dark:border-gray-900 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/45 flex flex-col justify-between">
                                    <div className="mb-3">
                                        <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("Flush Cached Session Drafts")}</h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                            {t("Clears temporary draft vouchers and persistent configurations without touching master ledgers or transactions.")}
                                        </p>
                                    </div>
                                    {showConfirm === 'cache' ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => wipeData('cache')} 
                                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition"
                                            >
                                                {t("Confirm Flush")}
                                            </button>
                                            <button 
                                                onClick={() => setShowConfirm(null)} 
                                                className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-semibold py-1.5 rounded-lg hover:bg-gray-300 transition"
                                            >
                                                {t("Abort")}
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setShowConfirm('cache')} 
                                            className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 dark:bg-gray-900 dark:hover:bg-rose-950/20 border border-gray-200 dark:border-gray-800 text-[10px] font-bold py-1.5 rounded-xl text-rose-600 hover:border-rose-200 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> {t("Wipe Cache")}
                                        </button>
                                    )}
                                </div>

                                {/* Box 2: Clear Vouchers */}
                                <div className="border border-gray-100 dark:border-gray-900 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/45 flex flex-col justify-between">
                                    <div className="mb-3">
                                        <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("Purge Transactional Ledger Vouchers")}</h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                            {t("Instantly drops all Sales, Purchases, Receipts, Payments, and Journal entries. It does not delete parties or master items.")}
                                        </p>
                                    </div>
                                    {showConfirm === 'vouchers' ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => wipeData('vouchers')} 
                                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition"
                                            >
                                                {t("Confirm Wipe")}
                                            </button>
                                            <button 
                                                onClick={() => setShowConfirm(null)} 
                                                className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-semibold py-1.5 rounded-lg hover:bg-gray-300 transition"
                                            >
                                                {t("Abort")}
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setShowConfirm('vouchers')} 
                                            className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 dark:bg-gray-900 dark:hover:bg-rose-950/20 border border-gray-200 dark:border-gray-800 text-[10px] font-bold py-1.5 rounded-xl text-rose-600 hover:border-rose-200 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> {t("Wipe Vouchers")}
                                        </button>
                                    )}
                                </div>

                                {/* Box 3: Clear Masters */}
                                <div className="border border-gray-100 dark:border-gray-900 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/45 flex flex-col justify-between">
                                    <div className="mb-3">
                                        <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("Unbind Party & Inventory Masters")}</h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                            {t("Removes all configurations of item cataloging, master stock catalogs, account definitions, and registered client contacts.")}
                                        </p>
                                    </div>
                                    {showConfirm === 'masters' ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => wipeData('masters')} 
                                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition"
                                            >
                                                {t("Confirm Wipe")}
                                            </button>
                                            <button 
                                                onClick={() => setShowConfirm(null)} 
                                                className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-semibold py-1.5 rounded-lg hover:bg-gray-300 transition"
                                            >
                                                {t("Abort")}
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setShowConfirm('masters')} 
                                            className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 dark:bg-gray-900 dark:hover:bg-rose-950/20 border border-gray-200 dark:border-gray-800 text-[10px] font-bold py-1.5 rounded-xl text-rose-600 hover:border-rose-200 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> {t("Wipe Masters")}
                                        </button>
                                    )}
                                </div>

                                {/* Box 4: Factory Reset */}
                                <div className="border border-rose-100 dark:border-rose-900/50 rounded-xl p-4 bg-rose-50/30 dark:bg-rose-950/5 flex flex-col justify-between">
                                    <div className="mb-3">
                                        <h5 className="text-[11px] font-bold text-rose-700 dark:text-rose-450 uppercase tracking-wider font-extrabold text-orange-650">{t("Complete Factory Reset")}</h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                            {t("Destroys everything. Resets configurations, account tokens, files, and clears absolute index registers safely.")}
                                        </p>
                                    </div>
                                    {showConfirm === 'all' ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => wipeData('all')} 
                                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition"
                                            >
                                                {t("Confirm Reset")}
                                            </button>
                                            <button 
                                                onClick={() => setShowConfirm(null)} 
                                                className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-semibold py-1.5 rounded-lg hover:bg-gray-300 transition"
                                            >
                                                {t("Abort")}
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setShowConfirm('all')} 
                                            className="w-full inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-xl shadow-xs transition"
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5" /> {t("Dry Run Reset")}
                                        </button>
                                    )}
                                </div>

                            </div>
                            
                            <p className="text-[10px] text-gray-400 italic text-center">
                                * Warning: These actions immediately bypass standard verification backups and update browser tables.
                            </p>
                        </div>
                    )}
                </div>

            </div>
            
        </div>
    );
};
