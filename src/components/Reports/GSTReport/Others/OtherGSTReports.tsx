import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { 
    FileText, Loader2, Info, CheckCircle, Clock, AlertCircle, X, Layers, 
    Briefcase, FileSignature, Wallet, Search, Filter, Calculator, 
    Landmark, Plus, ArrowRight, CornerDownRight, Copy, Check, Send, 
    Sparkles, Receipt, Trash2, FileCheck, RefreshCw, BarChart2, ShieldAlert
} from 'lucide-react';

interface OtherGSTReportsProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const OtherGSTReports: React.FC<OtherGSTReportsProps> = ({ useSampleData, onToggleSampleData }) => {
    const { t, formatNumber } = useLanguage();

    const [loading, setLoading] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    // Dummy states for decommissioned Composition Dealer Portal to satisfy TypeScript
    const compActiveOption = 'cmp08' as string;
    const compCmp08Data = { financialYear: '2025-26', quarter: 'Q1 (Apr-Jun)', taxRate: '1.0', outwardSupplies: '0', rcmSupplies: '0', filed: false, arn: '', paymentDate: '' };
    const compCmp08List = [] as any[];
    const setCompCmp08Data = (() => {}) as any;
    const setCompCmp08List = (() => {}) as any;
    const compGstr4Data = { financialYear: '2025-26', outwardTaxable: '0', inwardRcm: '0', reconciled: false, filed: false, isSigning: false, otp: '', arn: '' };
    const compGstr4Archive = [] as any[];
    const setCompGstr4Data = (() => {}) as any;
    const setCompGstr4Archive = (() => {}) as any;
    const gstr4aSearch = '';
    const setGstr4aSearch = (() => {}) as any;
    const compGstr4AData = [] as any[];
    const setCompGstr4AData = (() => {}) as any;
    const cmp02Form = { fy: '2026-27', category: 'Trader', estimatedTurnover: '0', declarationAccepted: false, submitted: false, arn: '' };
    const setCmp02Form = (() => {}) as any;
    const cmp04Form = { effectiveDate: '', fy: '2025-26', reason: 'To exceed threshold limit (over 1.5 Crores INR)', declarationAccepted: false, submitted: false, arn: '' };
    const setCmp04Form = (() => {}) as any;
    const setCompActiveOption = (() => {}) as any;
    
    // Sub-tab navigation within "Others"
    const [activeTab, setActiveTab] = useState<'registry' | 'calculators' | 'lut' | 'ledgers'>('registry');

    // Filter states for Registry
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Filed' | 'Pending'>('All');

    // Dynamic state stores for records so the user can interactively add logs!
    const [tdsRows, setTdsRows] = useState([
        { id: 1, gstin: "27AAACW8823F1Z6", name: "Maharashtra State Electricity Board", gross: 1250000, rate: "2%", cgst: 12500, sgst: 12500, igst: 0 },
        { id: 2, gstin: "27AAACG4344D1Z2", name: "Pune Municipal Corporation", gross: 850000, rate: "2%", cgst: 8500, sgst: 8500, igst: 0 },
        { id: 3, gstin: "07AAACB1114A2ZP", name: "Delhi Urban Water Board Office", gross: 450000, rate: "2%", cgst: 0, sgst: 0, igst: 9000 }
    ]);

    const [tcsRows, setTcsRows] = useState([
        { id: 1, gstin: "27AAACI5544B1ZV", name: "Amazon Retail India Pvt Ltd", gross: 2450000, returned: 150000, net: 2300000, tcs: 23000 },
        { id: 2, gstin: "27AAACF8833E1ZH", name: "Flipkart Wholesale Commerce", gross: 1850000, returned: 200000, net: 1650000, tcs: 16500 },
        { id: 3, gstin: "27BBBCS4411C2ZX", name: "Tata CLiQ Enterprise Division", gross: 920000, returned: 40000, net: 880000, tcs: 8800 }
    ]);

    const [itc04Rows, setItc04Rows] = useState([
        { id: 1, gstin: "27BBBCY1122D1Z0", name: "Vikas Engineering Workshops", challan: "CH-25-01", item: "Sheet Metal Press Castings", val: 1250000, status: "Returned Fully" },
        { id: 2, gstin: "27AAACG4433E1ZM", name: "Supreme Thermal Platers Ltd", challan: "CH-25-05", item: "Raw Steel Billets Coated", val: 950000, status: "Partially Returned (80%)" },
        { id: 3, gstin: "27CCCDK7755F2Z4", name: "Rathi Extrusions and Packers", challan: "CH-25-09", item: "Packaging Cardboards", val: 340000, status: "In Transit" }
    ]);

    const [cmp08Rows, setCmp08Rows] = useState([
        { id: 1, name: "Outward taxable supplies (including exempt volume)", val: 1850000, igst: 0, cgst: 18550, sgst: 18550, cess: 0 },
        { id: 2, name: "Inward supplies attracting tax liable to Reverse Charge (RCM)", val: 150000, igst: 0, cgst: 3750, sgst: 3750, cess: 0 }
    ]);

    // Add entry local form states
    const [newTds, setNewTds] = useState({ gstin: '', name: '', gross: '', isInterstate: false });
    const [newTcs, setNewTcs] = useState({ gstin: '', name: '', gross: '', returned: '' });
    const [newItc04, setNewItc04] = useState({ gstin: '', name: '', challan: '', item: '', val: '', status: 'In Transit' });
    const [newCmp08, setNewCmp08] = useState({ name: '', val: '', cgst: '', sgst: '', igst: '', cess: '' });

    // Calculator values state
    const [calcType, setCalcType] = useState<'TDS' | 'TCS'>('TDS');
    const [tdsBase, setTdsBase] = useState('500000');
    const [tdsType, setTdsType] = useState<'intra' | 'inter'>('intra');
    const [tdsAuthority, setTdsAuthority] = useState('Government PSU');
    const [tcsGross, setTcsGross] = useState('1200000');
    const [tcsReturns, setTcsReturns] = useState('80000');
    const [tcsType, setTcsType] = useState<'intra' | 'inter'>('intra');

    // LUT Generator states
    const [lutName, setLutName] = useState('BHARAT BOOK BUREAU EXPORTS');
    const [lutFy, setLutFy] = useState('2025-26');
    const [lutIec, setLutIec] = useState('031802931D');
    const [lutPort, setLutPort] = useState('Nhava Sheva Sea Port (JNPT)');
    const [witness1, setWitness1] = useState('Amit Sharma, CA Auditor');
    const [witness2, setWitness2] = useState('Sunita Patel, Compliance Officer');
    const [lutCopied, setLutCopied] = useState(false);
    const [lutFilingStage, setLutFilingStage] = useState<'draft' | 'signing' | 'completed'>('draft');
    const [lutOtp, setLutOtp] = useState('');
    const [lutArn, setLutArn] = useState('');

    // ledgers View States
    const [cashLedger, setCashLedger] = useState({ igst: 210000, cgst: 145000, sgst: 145000, cess: 15000 });
    const [creditLedger, setCreditLedger] = useState({ igst: 420000, cgst: 280000, sgst: 280000 });
    const [challanForm, setChallanForm] = useState({ head: 'IGST', cat: 'Tax', amt: '50000', method: 'UPI' });
    const [offsetConsole, setOffsetConsole] = useState<string[]>([]);
    const [offsetApplied, setOffsetApplied] = useState(false);
    const [outstandingLiability, setOutstandingLiability] = useState({ igst: 350000, cgst: 200000, sgst: 200000 });

    const [reportsList, setReportsList] = useState<any[]>([]);

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/others.json')
                .then(res => res.json())
                .then(res => {
                    setReportsList(res.reports);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load Others sample data", err);
                    setLoading(false);
                });
        } else {
            setReportsList([]);
        }
    }, [useSampleData]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Filed':
                return <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />;
            case 'Pending':
                return <Clock className="w-3.5 h-3.5 text-amber-500 mr-1.5" />;
            default:
                return <AlertCircle className="w-3.5 h-3.5 text-gray-400 mr-1.5" />;
        }
    };

    // Calculate details popup structures based on current interactive React state
    const getReportDetails = (id: string) => {
        switch (id) {
            case 'GSTR-7':
                const tdsTotal = tdsRows.reduce((acc, cur) => acc + cur.cgst + cur.sgst + cur.igst, 0);
                return {
                    title: 'GSTR-7 Return Details (TDS Ledger)',
                    desc: 'Details of Tax Deducted at Source (TDS) by government agencies, bodies, or authorities.',
                    headers: ['Deductee GSTIN', 'Deductee Corporate Name', 'Total Gross Value', 'TDS Rate', 'TDS Amount Deducted (Integrated / Central / State)'],
                    rows: tdsRows,
                    summary: { label: "Total TDS Net Balance", value: tdsTotal }
                };
            case 'GSTR-8':
                const tcsTotal = tcsRows.reduce((acc, cur) => acc + cur.tcs, 0);
                return {
                    title: 'GSTR-8 Return Details (TCS E-Commerce Ledger)',
                    desc: 'Details of Tax Collected at Source (TCS) on supplies channeled through major online e-commerce platforms.',
                    headers: ['Operator GSTIN', 'E-Commerce Platform Name', 'Gross Supplies Sold', 'Value of Returns', 'Net Taxable Supplies', 'TCS Collected (1%)'],
                    rows: tcsRows,
                    summary: { label: "Total TCS Received", value: tcsTotal }
                };
            case 'GST ITC-04':
                const itc04Total = itc04Rows.reduce((acc, cur) => acc + cur.val, 0);
                return {
                    title: 'GST ITC-04 Return Details (Job Work Tracker)',
                    desc: 'Quarterly statement for raw materials or capital goods dispatched to subcontractors for processing stages.',
                    headers: ['Job Worker GSTIN', 'Job Worker Name', 'Challan No', 'Items Sent', 'Total Value Sent', 'Current Status / Returned'],
                    rows: itc04Rows,
                    summary: { label: "Total Asset Value Distributed", value: itc04Total }
                };
            default:
                const cmpTotal = cmp08Rows.reduce((acc, cur) => acc + cur.cgst + cur.sgst + cur.igst, 0);
                return {
                    title: 'CMP-08 Output Details (Composition Return Scheme)',
                    desc: 'Quarterly payment ledger statement for composition dealers filing simplified self-assessed tax ratios.',
                    headers: ['Nature of Supplies', 'Total Value', 'IGST Balance', 'CGST Ratio Balance', 'SGST Ratio Balance', 'Cess Ratio'],
                    rows: cmp08Rows,
                    summary: { label: "Total Composition Self-Assessed Payable", value: cmpTotal }
                };
        }
    };

    const selectedDetails = selectedReportId ? getReportDetails(selectedReportId) : null;

    // Helper to calculate TDS/TCS for dynamic inserts
    const handleAddTdsRow = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTds.gstin || !newTds.name || !newTds.gross) return;
        const grossValue = Number(newTds.gross);
        const ratePct = 2; // Fixed Section 51 general TDS rate
        const gstDeducted = grossValue * (ratePct / 100);

        const newEntry = {
            id: Date.now(),
            gstin: newTds.gstin.toUpperCase(),
            name: newTds.name,
            gross: grossValue,
            rate: `${ratePct}%`,
            cgst: newTds.isInterstate ? 0 : Math.round(gstDeducted / 2),
            sgst: newTds.isInterstate ? 0 : Math.round(gstDeducted / 2),
            igst: newTds.isInterstate ? Math.round(gstDeducted) : 0
        };

        setTdsRows([...tdsRows, newEntry]);
        setNewTds({ gstin: '', name: '', gross: '', isInterstate: false });
    };

    const handleAddTcsRow = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTcs.gstin || !newTcs.name || !newTcs.gross) return;
        const grossSold = Number(newTcs.gross);
        const returned = Number(newTcs.returned || 0);
        const netValue = grossSold - returned;
        const tcsDeduction = netValue * 0.01; // Section 52 general TCS rate is 1% net

        const newEntry = {
            id: Date.now(),
            gstin: newTcs.gstin.toUpperCase(),
            name: newTcs.name,
            gross: grossSold,
            returned: returned,
            net: netValue,
            tcs: Math.round(tcsDeduction)
        };

        setTcsRows([...tcsRows, newEntry]);
        setNewTcs({ gstin: '', name: '', gross: '', returned: '' });
    };

    const handleAddItc04Row = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItc04.gstin || !newItc04.name || !newItc04.challan || !newItc04.val) return;

        const newEntry = {
            id: Date.now(),
            gstin: newItc04.gstin.toUpperCase(),
            name: newItc04.name,
            challan: newItc04.challan.toUpperCase(),
            item: newItc04.item || 'Raw items',
            val: Number(newItc04.val),
            status: newItc04.status
        };

        setItc04Rows([...itc04Rows, newEntry]);
        setNewItc04({ gstin: '', name: '', challan: '', item: '', val: '', status: 'In Transit' });
    };

    // Math outputs for calculators view
    const calculatedTds = () => {
        const base = Number(tdsBase) || 0;
        const rate = 2; // Section 51
        const totalTax = base * (rate / 100);
        if (tdsType === 'inter') {
            return { cgst: 0, sgst: 0, igst: totalTax, total: totalTax };
        } else {
            return { cgst: totalTax / 2, sgst: totalTax / 2, igst: 0, total: totalTax };
        }
    };

    const calculatedTcs = () => {
        const gross = Number(tcsGross) || 0;
        const returns = Number(tcsReturns) || 0;
        const net = Math.max(0, gross - returns);
        const tcsVal = net * 0.01; // 1%
        if (tcsType === 'inter') {
            return { cgst: 0, sgst: 0, igst: tcsVal, total: tcsVal, net };
        } else {
            return { cgst: tcsVal / 2, sgst: tcsVal / 2, igst: 0, total: tcsVal, net };
        }
    };

    // Auto load current calculation into the logs to show integrated functionality
    const handlePostCalcToLog = () => {
        if (calcType === 'TDS') {
            const vals = calculatedTds();
            setTdsRows([...tdsRows, {
                id: Date.now(),
                gstin: "27DESTE5544A1ZA",
                name: `Obligation: ${tdsAuthority}`,
                gross: Number(tdsBase),
                rate: "2%",
                cgst: vals.cgst,
                sgst: vals.sgst,
                igst: vals.igst
            }]);
            alert(t("Calculation Posted successfully as a new draft record inside your GSTR-7 TDS Registry!"));
        } else {
            const vals = calculatedTcs();
            setTcsRows([...tcsRows, {
                id: Date.now(),
                gstin: "27TCSOP3311E2ZX",
                name: "E-Commerce Market Channel Calc Log",
                gross: Number(tcsGross),
                returned: Number(tcsReturns),
                net: vals.net,
                tcs: vals.total
            }]);
            alert(t("Calculation Posted successfully as a new draft record inside your GSTR-8 TCS Registry!"));
        }
    };

    // LUT Application Generator function
    const generateLutApplicationText = () => {
        return `FORM GST RFD-11
[See Rule 96A]
FURNISHING OF LETTER OF UNDERTAKING FOR EXPORT OF GOODS OR SERVICES WITHOUT PAYMENT OF INTEGRATED TAX

1. GSTIN: 27AAAFB6318C1Z4
2. Legal Name: BHARAT BOOK BUREAU AI CORP
3. Address: Mumbai Technical Gateway Plaza, Sector-11, Maharashtra
4. Financial Year: FY ${lutFy}
5. Importer Exporter Code (IEC): ${lutIec}

DECLARATION & UNDERTAKING:
We, ${lutName}, hereby declare that we are registered exporters under GST laws, and intend to export goods or services out of local territorial bounds of India without payment of integrated tax under the provisions of Section 16(3)(a) of the IGST Act, 2017.

We bind ourselves to:
(a) Export the goods or services within the period prescribed of 15 days or 3 months from issuance.
(b) Pay the Integrated Tax along with interest at the rate of 18% per annum in case of failure of export.
(c) Comply with the rules, conditions and shipping protocols registered at Port: "${lutPort}"

WITNESSES OF DEED:
1. First Witness Name/Profession: ${witness1}
2. Second Witness Name/Profession: ${witness2}

Verification Status: Digitally generated inside Bharat Book ERP on ${new Date().toISOString().split('T')[0]}`;
    };

    const handleCopyLut = () => {
        const text = generateLutApplicationText();
        navigator.clipboard.writeText(text);
        setLutCopied(true);
        setTimeout(() => setLutCopied(false), 2000);
    };

    const handleSimulateLutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLutFilingStage('signing');
    };

    const handleConfirmLutSigning = () => {
        if (!lutOtp) {
            alert(t("Please type the OTP verification code first."));
            return;
        }
        setLutFilingStage('completed');
        const randArn = `AD270626${Math.floor(100000 + Math.random() * 900000)}D`;
        setLutArn(randArn);

        // Update the static export status inside local returns lists
        const updatedList = reportsList.map(item => {
            if (item.id === 'GSTR-9' || item.id === 'GSTR-9C') {
                return { ...item, status: 'Filed' }; // Simulates filing action
            }
            return item;
        });
        setReportsList(updatedList);
    };

    // e-Ledger challan generation simulator
    const handleGenChallan = (e: React.FormEvent) => {
        e.preventDefault();
        const depositAmt = Number(challanForm.amt) || 0;
        const currentHead = challanForm.head;

        setLoading(true);
        setTimeout(() => {
            if (currentHead === 'IGST') {
                setCashLedger(prev => ({ ...prev, igst: prev.igst + depositAmt }));
            } else if (currentHead === 'CGST') {
                setCashLedger(prev => ({ ...prev, cgst: prev.cgst + depositAmt }));
            } else if (currentHead === 'SGST') {
                setCashLedger(prev => ({ ...prev, sgst: prev.sgst + depositAmt }));
            } else {
                setCashLedger(prev => ({ ...prev, cess: prev.cess + depositAmt }));
            }
            setLoading(false);
            alert(`${t("Challan Deposit successful!")} ₹${formatNumber(depositAmt)} ${t("loaded to your online Electronic Cash Ledger.")}`);
        }, 1200);
    };

    // Section 49 Auto-Offset routine calculation simulator
    const triggerAutoOffsetOffset = () => {
        let consolLog: string[] = [];
        consolLog.push("🟢 Initiating Section 49 Auto-Reckoner Offset Sequence...");
        
        let pendingIgst = outstandingLiability.igst;
        let pendingCgst = outstandingLiability.cgst;
        let pendingSgst = outstandingLiability.sgst;

        let workingCredit = { ...creditLedger };
        let workingCash = { ...cashLedger };

        // STEP 1: Settle IGST Liability against IGST Credit
        if (pendingIgst > 0 && workingCredit.igst > 0) {
            const igstCharged = Math.min(pendingIgst, workingCredit.igst);
            pendingIgst -= igstCharged;
            workingCredit.igst -= igstCharged;
            consolLog.push(`✓ Submerged ₹${formatNumber(igstCharged)} IGST liability against IGST input credit.`);
        }

        // STEP 2: IGST credit can absorb CGST or SGST
        if (workingCredit.igst > 0) {
            if (pendingCgst > 0) {
                const cgstAbsorbed = Math.min(pendingCgst, workingCredit.igst);
                pendingCgst -= cgstAbsorbed;
                workingCredit.igst -= cgstAbsorbed;
                consolLog.push(`✓ Allocated ₹${formatNumber(cgstAbsorbed)} IGST residual credit to Central Tax (CGST) liability.`);
            }
            if (pendingSgst > 0 && workingCredit.igst > 0) {
                const sgstAbsorbed = Math.min(pendingSgst, workingCredit.igst);
                pendingSgst -= sgstAbsorbed;
                workingCredit.igst -= sgstAbsorbed;
                consolLog.push(`✓ Allocated ₹${formatNumber(sgstAbsorbed)} IGST leftover credit to State Tax (SGST) liability.`);
            }
        }

        // STEP 3: CGST Liability offset against CGST Credit
        if (pendingCgst > 0 && workingCredit.cgst > 0) {
            const cgstSelf = Math.min(pendingCgst, workingCredit.cgst);
            pendingCgst -= cgstSelf;
            workingCredit.cgst -= cgstSelf;
            consolLog.push(`✓ Offset ₹${formatNumber(cgstSelf)} CGST liability against CGST credit ledger.`);
        }

        // STEP 4: SGST Liability offset against SGST Credit
        if (pendingSgst > 0 && workingCredit.sgst > 0) {
            const sgstSelf = Math.min(pendingSgst, workingCredit.sgst);
            pendingSgst -= sgstSelf;
            workingCredit.sgst -= sgstSelf;
            consolLog.push(`✓ Offset ₹${formatNumber(sgstSelf)} SGST liability against SGST credit ledger.`);
        }

        // STEP 5: Settle leftover liabilities using online cash balances
        if (pendingIgst > 0 && workingCash.igst > 0) {
            const paidIgsh = Math.min(pendingIgst, workingCash.igst);
            pendingIgst -= paidIgsh;
            workingCash.igst -= paidIgsh;
            consolLog.push(`✓ Settled remaining IGST ₹${formatNumber(paidIgsh)} with Electronic Cash balances.`);
        }

        if (pendingCgst > 0 && workingCash.cgst > 0) {
            const paidCgsh = Math.min(pendingCgst, workingCash.cgst);
            pendingCgst -= paidCgsh;
            workingCash.cgst -= paidCgsh;
            consolLog.push(`✓ Settled remaining CGST ₹${formatNumber(paidCgsh)} with Central Cash balances.`);
        }

        if (pendingSgst > 0 && workingCash.sgst > 0) {
            const paidSgsh = Math.min(pendingSgst, workingCash.sgst);
            pendingSgst -= paidSgsh;
            workingCash.sgst -= paidSgsh;
            consolLog.push(`✓ Settled remaining SGST ₹${formatNumber(paidSgsh)} with State Cash balances.`);
        }

        // Update working balances
        setCreditLedger(workingCredit);
        setCashLedger(workingCash);
        setOutstandingLiability({ igst: pendingIgst, cgst: pendingCgst, sgst: pendingSgst });

        consolLog.push("🏆 Audit reconciliation offset task complete.");
        setOffsetConsole(consolLog);
        setOffsetApplied(true);
    };

    // Filter reports list based on interactive state search & status checkbox
    const filteredReports = reportsList.filter(item => {
        const matchesQuery = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Elegant Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-850">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center dark:text-gray-100">
                        <FileText className="mr-2 text-indigo-600" size={24} />
                        {t("Auxiliary GST Suite & Ledger Consoles")}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">
                        {t("Manage tax-deductions, jobworks, Letter of Undertakings, and online electronic cash balances.")}
                    </p>
                </div>
                {/* Horizontal pill navigator of functional blocks */}
                <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100 dark:bg-gray-900/60 dark:border-gray-750">
                    <button
                        onClick={() => setActiveTab('registry')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center ${activeTab === 'registry' ? 'bg-white text-gray-800 shadow-xs dark:bg-gray-800 dark:text-white' : 'text-gray-550 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        <Layers size={13.5} className="mr-1.5 text-indigo-600" />
                        {t("Compliance Registries")}
                    </button>
                    <button
                        onClick={() => setActiveTab('calculators')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center ${activeTab === 'calculators' ? 'bg-white text-gray-800 shadow-xs dark:bg-gray-800 dark:text-white' : 'text-gray-550 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        <Calculator size={13.5} className="mr-1.5 text-indigo-600" />
                        {t("TDS/TCS Calculator")}
                    </button>
                    <button
                        onClick={() => setActiveTab('lut')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center ${activeTab === 'lut' ? 'bg-white text-gray-800 shadow-xs dark:bg-gray-800 dark:text-white' : 'text-gray-550 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        <FileSignature size={13.5} className="mr-1.5 text-indigo-600" />
                        {t("LUT Application")}
                    </button>
                    <button
                        onClick={() => setActiveTab('ledgers')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center ${activeTab === 'ledgers' ? 'bg-white text-gray-800 shadow-xs dark:bg-gray-800 dark:text-white' : 'text-gray-550 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        <Wallet size={13.5} className="mr-1.5 text-indigo-600" />
                        {t("e-Ledger Simulator")}
                    </button>
                </div>
            </div>

            {/* TAB 1: Statuary Compliance Registries */}
            {activeTab === 'registry' && (
                <div className="space-y-6">
                    {/* Filter and search utilities bar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs dark:bg-gray-800 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder={t("Search by ID or name...")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-1.5 w-full text-xs rounded-lg border border-gray-200 outline-hidden focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <Filter size={14} className="text-gray-400 mr-1" />
                            {['All', 'Filed', 'Pending'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st as any)}
                                    className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border transition-all ${statusFilter === st ? 'bg-indigo-50/60 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-400' : 'bg-transparent border-gray-100 text-gray-400 hover:text-gray-600 dark:border-transparent dark:hover:text-gray-255'}`}
                                >
                                    {t(st)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : filteredReports.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-750 text-xs dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200 uppercase tracking-widest flex justify-between items-center">
                                <span>{t("Statutory Compliance Registry")}</span>
                                <span className="text-[10px] font-black tracking-widest text-[#2f3542] dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                                    {filteredReports.length} {t("REPORTS")}
                                </span>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredReports.map((report: any, i: number) => (
                                    <div key={i} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors dark:hover:bg-gray-700/50">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md dark:bg-indigo-950/40 dark:text-indigo-400">{report.id}</span>
                                            <h4 className="font-bold text-gray-800 mt-1 dark:text-gray-100 text-sm">{t(report.name)}</h4>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                                            <div className="flex items-center">
                                                <span className="text-[10px] font-bold text-gray-400 w-24 uppercase tracking-widest dark:text-gray-500">{t("Due Date:")}</span>
                                                <span className="text-xs font-semibold text-gray-800 dark:text-gray-105">{t(report.due_date) || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center w-32">
                                                {getStatusIcon(report.status)}
                                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                                    report.status === 'Filed' ? 'text-emerald-700 dark:text-emerald-450' :
                                                    report.status === 'Pending' ? 'text-amber-700 dark:text-amber-450' : 'text-gray-600'
                                                }`}>
                                                    {t(report.status)}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => setSelectedReportId(report.id)}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors dark:bg-gray-900 dark:text-indigo-400 dark:hover:bg-gray-750"
                                            >
                                                {t("View Details")}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                            <Info className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium dark:text-gray-400">{t("No return items found. Adjust filters or enable sample dataset in settings.")}</p>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: Live TDS/TCS calculators */}
            {activeTab === 'calculators' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                        <div className="flex items-center justify-between border-b pb-4 mb-6 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Calculator className="text-indigo-600 w-5 h-5" />
                                <h3 className="font-extrabold text-gray-850 dark:text-gray-100 text-sm">
                                    {t("Liability Estimator & Draft Generator")}
                                </h3>
                            </div>
                            <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
                                <button
                                    onClick={() => setCalcType('TDS')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md ${calcType === 'TDS' ? 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white shadow-xs' : 'text-gray-400 hover:text-gray-650'}`}
                                >
                                    {t("TDS (Sec 51)")}
                                </button>
                                <button
                                    onClick={() => setCalcType('TCS')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md ${calcType === 'TCS' ? 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white shadow-xs' : 'text-gray-400 hover:text-gray-650'}`}
                                >
                                    {t("TCS (Sec 52)")}
                                </button>
                            </div>
                        </div>

                        <div className="form-grid gap-6 md:grid-cols-2">
                            {/* Inputs column */}
                            <div className="space-y-4">
                                {calcType === 'TDS' ? (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{t("Supply Contract Base Value (₹)")}</label>
                                            <input
                                                type="number"
                                                value={tdsBase}
                                                onChange={(e) => setTdsBase(e.target.value)}
                                                className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{t("Type of Supply Jurisdiction")}</label>
                                            <select
                                                value={tdsType}
                                                onChange={(e: any) => setTdsType(e.target.value)}
                                                className="w-full text-xs font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            >
                                                <option value="intra">{t("Intra-State Supply (CGST 1% + SGST 1%)")}</option>
                                                <option value="inter">{t("Inter-State Supply (IGST 2%)")}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{t("Deducting Authority Nature")}</label>
                                            <select
                                                value={tdsAuthority}
                                                onChange={(e) => setTdsAuthority(e.target.value)}
                                                className="w-full text-xs mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            >
                                                <option value="Government Dept">{t("Central / State Government Department")}</option>
                                                <option value="Government PSU">{t("Public Sector Undertaking (PSU)")}</option>
                                                <option value="Local Authority">{t("Municipal Corporation / Local Body")}</option>
                                                <option value="Government Aided Society">{t("Society established by Govt under Societies Act")}</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{t("Gross Supplies Value sold via E-Comm (₹)")}</label>
                                            <input
                                                type="number"
                                                value={tcsGross}
                                                onChange={(e) => setTcsGross(e.target.value)}
                                                className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{t("Deduct Supply Sales Returns / Credits (₹)")}</label>
                                            <input
                                                type="number"
                                                value={tcsReturns}
                                                onChange={(e) => setTcsReturns(e.target.value)}
                                                className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{t("TCS Transaction State Category")}</label>
                                            <select
                                                value={tcsType}
                                                onChange={(e: any) => setTcsType(e.target.value)}
                                                className="w-full text-xs font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            >
                                                <option value="intra">{t("Intra-State Channel (CGST 0.5% + SGST 0.5%)")}</option>
                                                <option value="inter">{t("Inter-State Channel (IGST 1.0%)")}</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Outputs and integration posting column */}
                            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 dark:bg-gray-900/40 dark:border-gray-750 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black tracking-widest uppercase text-indigo-650 text-indigo-600 block">{t("Estimated Obligation Result")}</h4>
                                    
                                    <div className="space-y-2 border-b pb-4">
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{calcType === 'TDS' ? t("GST TDS Rate") : t("GST TCS Rate")}</span>
                                            <span className="font-bold text-gray-700 dark:text-gray-300">
                                                {calcType === 'TDS' ? '2.0% Fixed' : '1.0% Net'}
                                            </span>
                                        </div>
                                        {calcType === 'TCS' && (
                                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>{t("Net Taxable Supplies")}</span>
                                                <span className="font-mono font-bold text-gray-800 dark:text-gray-100">
                                                    ₹{formatNumber(calculatedTcs().net)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{t("CGST Component")}</span>
                                            <span className="font-mono text-gray-800 dark:text-gray-100">
                                                ₹{formatNumber(calcType === 'TDS' ? calculatedTds().cgst : calculatedTcs().cgst)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{t("SGST Component")}</span>
                                            <span className="font-mono text-gray-800 dark:text-gray-100">
                                                ₹{formatNumber(calcType === 'TDS' ? calculatedTds().sgst : calculatedTcs().sgst)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{t("IGST Component")}</span>
                                            <span className="font-mono text-gray-800 dark:text-gray-100">
                                                ₹{formatNumber(calcType === 'TDS' ? calculatedTds().igst : calculatedTcs().igst)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-2.5">
                                        <span className="text-xs font-bold text-gray-800 dark:text-gray-205">{t("Total Statutory Deduction (₹)")}</span>
                                        <span className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                                            ₹{formatNumber(calcType === 'TDS' ? calculatedTds().total : calculatedTcs().total)}
                                        </span>
                                    </div>

                                    <div className="p-3.5 bg-indigo-50/50 rounded-lg text-[11px] text-indigo-755 leading-relaxed dark:bg-indigo-950/20 dark:text-indigo-350 border border-indigo-100 dark:border-indigo-900/30">
                                        {calcType === 'TDS' ? (
                                            <p>ℹ️ <strong>{t("Compliance Rule:")}</strong> {t("TDS u/s 51 is mandatory when single contract supplies exceed ₹2.5 Lakhs base value. Form GSTR-7 must be certified within 10 days of upcoming month.")}</p>
                                        ) : (
                                            <p>ℹ️ <strong>{t("Compliance Rule:")}</strong> {t("E-Commerce market operations u/s 52 must collect and remit TCS (Form GSTR-8) at 1% of net supplies, ensuring marketplace reconciliation matches perfectly with supplier sales records.")}</p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handlePostCalcToLog}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                                >
                                    <Sparkles size={14} />
                                    {t("Post Calculated Obligation to Session Logs")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: LUT application Constructor */}
            {activeTab === 'lut' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                        <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-800 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <FileSignature className="text-indigo-600" size={16} />
                                {t("Zero-Rated Export Letter of Undertaking (LUT) Generator - RFD-11")}
                            </span>
                            <span className="text-[10px] font-black tracking-widest text-[#2f3542] dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded uppercase">
                                {t("Rule 96A Compliance")}
                            </span>
                        </div>

                        {lutFilingStage === 'completed' ? (
                            <div className="p-12 text-center max-w-xl mx-auto space-y-4">
                                <div className="inline-flex items-center justify-center p-4 bg-emerald-50 rounded-full text-emerald-500 mb-2">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-lg font-black text-gray-800 dark:text-gray-100">{t("LUT Application Filed & Approved!")}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {t("Your statutory Letter of Undertaking (RFD-11) has been verified and stamped by digital signature. Zero-Rated export transactions are now validated under LUT without tax payment obligations.")}
                                </p>
                                <div className="bg-gray-50 dark:bg-gray-905 p-3.5 rounded-lg border text-xs font-mono select-all text-center">
                                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">{t("Government Application Reference (ARN)")}</p>
                                    <p className="font-extrabold text-indigo-600 mt-1">{lutArn}</p>
                                </div>
                                <div className="pt-4 flex gap-3 justify-center">
                                    <button
                                        onClick={() => setLutFilingStage('draft')}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-lg hover:bg-indigo-100"
                                    >
                                        {t("Create New LUT Application")}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-150">
                                {/* Form Inputs (Left) */}
                                <form onSubmit={handleSimulateLutSubmit} className="p-6 lg:col-span-5 space-y-4">
                                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">{t("Application Metadata")}</h4>
                                    
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500">{t("Authorized Exporting Company Name")}</label>
                                        <input
                                            type="text"
                                            value={lutName}
                                            onChange={(e) => setLutName(e.target.value)}
                                            required
                                            className="w-full text-xs font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-505 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500">{t("Importer Exporter Code (IEC)")}</label>
                                            <input
                                                type="text"
                                                value={lutIec}
                                                onChange={(e) => setLutIec(e.target.value)}
                                                required
                                                className="w-full text-xs mt-1 px-3 py-2 border rounded-lg focus:border-indigo-505 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500">{t("Target Financial Year")}</label>
                                            <select
                                                value={lutFy}
                                                onChange={(e) => setLutFy(e.target.value)}
                                                className="w-full text-xs mt-1 px-3 py-2 border rounded-lg focus:border-indigo-505 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                            >
                                                <option value="2025-26">FY 2025-26</option>
                                                <option value="2026-27">FY 2026-27</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500">{t("Principal Customs / Shipping Port")}</label>
                                        <input
                                            type="text"
                                            value={lutPort}
                                            onChange={(e) => setLutPort(e.target.value)}
                                            required
                                            className="w-full text-xs mt-1 px-3 py-2 border rounded-lg focus:border-indigo-505 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-500 block">{t("Signatory Witnesses (Minimum Two)")}</label>
                                        <input
                                            type="text"
                                            placeholder="Witness 1 name & designation"
                                            value={witness1}
                                            onChange={(e) => setWitness1(e.target.value)}
                                            required
                                            className="w-full text-xs px-3 py-1.5 border rounded-lg focus:border-indigo-505 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Witness 2 name & designation"
                                            value={witness2}
                                            onChange={(e) => setWitness2(e.target.value)}
                                            required
                                            className="w-full text-xs px-3 py-1.5 border rounded-lg focus:border-indigo-505 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                                        />
                                    </div>

                                    {lutFilingStage === 'signing' ? (
                                        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 space-y-3 dark:bg-amber-950/20 dark:border-amber-900/35">
                                            <div className="flex gap-2 text-amber-800 dark:text-amber-400">
                                                <ShieldAlert size={18} className="flex-shrink-0" />
                                                <div className="text-xs">
                                                    <p className="font-extrabold">{t("Awaiting OTP Authentication Signature")}</p>
                                                    <p className="text-[10px] mt-0.5">{t("An OTP security code has been routed to CA signatory registered email / mobile." )}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Type OTP Code (e.g. 5403)"
                                                    value={lutOtp}
                                                    onChange={(e) => setLutOtp(e.target.value)}
                                                    className="w-full text-xs text-center font-bold px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-800 outline-hidden focus:border-indigo-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleConfirmLutSigning}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
                                                >
                                                    {t("Verfiy")}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                                        >
                                            <Send size={13.5} />
                                            {t("Proceed to Digital Signature Remit")}
                                        </button>
                                    )}
                                </form>

                                {/* Live Document Blueprint Layout (Right) */}
                                <div className="p-6 lg:col-span-7 bg-gray-50/40 dark:bg-gray-900/10 flex flex-col justify-between">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                                            <Receipt size={14} className="text-indigo-600" />
                                            {t("RFD-11 Draft Document Blueprint")}
                                        </h4>
                                        <button
                                            onClick={handleCopyLut}
                                            className="px-2.5 py-1 text-[11px] font-bold border rounded-lg hover:bg-white dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 flex items-center gap-1 bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                                        >
                                            {lutCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                            {lutCopied ? t("Copied") : t("Copy Text")}
                                        </button>
                                    </div>

                                    <pre className="p-4 bg-white border border-gray-150 rounded-xl font-mono text-[9.5px] leading-relaxed dark:bg-gray-900 dark:border-gray-750 text-gray-650 select-all overflow-auto h-[320px] scrollbar-thin max-w-full">
                                        {generateLutApplicationText()}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 4: Ledger Simulator */}
            {activeTab === 'ledgers' && (
                <div className="space-y-6">
                    {/* Running Balances of e-Ledgers */}
                    <div className="form-grid gap-4 md:grid-cols-2">
                        {/* Cash Ledger */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-100 text-sm">
                                    <Landmark className="text-emerald-600 dark:text-emerald-400" size={18} />
                                    {t("Electronic Cash Ledger")}
                                </span>
                                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded dark:bg-emerald-950/40 dark:text-emerald-400">
                                    {t("Sec 49(1)")}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="p-2bg-gray-50 bg-gray-50/50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-750">
                                    <p className="text-[9px] text-gray-400 lowercase font-extrabold tracking-wider">IGST</p>
                                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-100 mt-1">₹{formatNumber(cashLedger.igst)}</p>
                                </div>
                                <div className="p-2 bg-gray-50 bg-gray-50/50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-750">
                                    <p className="text-[9px] text-gray-400 lowercase font-extrabold tracking-wider">CGST</p>
                                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-100 mt-1">₹{formatNumber(cashLedger.cgst)}</p>
                                </div>
                                <div className="p-2 bg-gray-50 bg-gray-50/50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-750">
                                    <p className="text-[9px] text-gray-400 lowercase font-extrabold tracking-wider">SGST</p>
                                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-100 mt-1">₹{formatNumber(cashLedger.sgst)}</p>
                                </div>
                                <div className="p-2 bg-gray-50 bg-gray-50/50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-750">
                                    <p className="text-[9px] text-gray-400 lowercase font-extrabold tracking-wider">Cess</p>
                                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-100 mt-1">₹{formatNumber(cashLedger.cess)}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t text-xs">
                                <span className="text-gray-500">{t("Total cash online:")}</span>
                                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                    ₹{formatNumber(cashLedger.igst + cashLedger.cgst + cashLedger.sgst + cashLedger.cess)}
                                </span>
                            </div>
                        </div>

                        {/* Credit Ledger */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-100 text-sm">
                                    <Layers className="text-indigo-600 dark:text-indigo-400" size={18} />
                                    {t("Electronic Credit Ledger (ITC)")}
                                </span>
                                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                                    {t("Sec 49(2)")}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 bg-gray-50 bg-gray-50/50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-750">
                                    <p className="text-[9px] text-gray-400 lowercase font-extrabold tracking-wider">IGST</p>
                                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-100 mt-1">₹{formatNumber(creditLedger.igst)}</p>
                                </div>
                                <div className="p-2 bg-gray-50 bg-gray-50/50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-750">
                                    <p className="text-[9px] text-gray-400 lowercase font-extrabold tracking-wider">CGST</p>
                                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-100 mt-1">₹{formatNumber(creditLedger.cgst)}</p>
                                </div>
                                <div className="p-2 bg-gray-50 bg-gray-50/50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-750">
                                    <p className="text-[9px] text-gray-400 lowercase font-extrabold tracking-wider">SGST</p>
                                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-100 mt-1">₹{formatNumber(creditLedger.sgst)}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t text-xs">
                                <span className="text-gray-500">{t("Total input credit ledger:")}</span>
                                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                                    ₹{formatNumber(creditLedger.igst + creditLedger.cgst + creditLedger.sgst)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Tools */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* deposit gateway form */}
                        <form onSubmit={handleGenChallan} className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 lg:col-span-4 space-y-4">
                            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5 border-b pb-2 mb-2">
                                <Plus size={14} className="text-emerald-500" />
                                {t("Generate Deposit Challan")}
                            </h4>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block">{t("Tax Head to Deposit")}</label>
                                <select
                                    value={challanForm.head}
                                    onChange={(e) => setChallanForm({ ...challanForm, head: e.target.value })}
                                    className="w-full text-xs mt-1 px-3 py-2 border rounded-lg outline-hidden focus:border-indigo-505 bg-white dark:bg-gray-900 dark:border-gray-700"
                                >
                                    <option value="IGST">IGST (Integrated Tax)</option>
                                    <option value="CGST">CGST (Central Tax)</option>
                                    <option value="SGST">SGST (State Tax)</option>
                                    <option value="CESS">CESS (Compensational Cess)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block">{t("Sub-category Account")}</label>
                                <select
                                    value={challanForm.cat}
                                    onChange={(e) => setChallanForm({ ...challanForm, cat: e.target.value })}
                                    className="w-full text-xs mt-1 px-3 py-2 border rounded-lg outline-hidden focus:border-indigo-505 bg-white dark:bg-gray-900 dark:border-gray-700"
                                >
                                    <option value="Tax">Tax (Principal Ledger)</option>
                                    <option value="Interest">Interest (Late penalty credit)</option>
                                    <option value="Penalty">Penalty (Filing defaults)</option>
                                    <option value="Fee">Fee (Late fee rates)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block">{t("Deposit Amount (₹)")}</label>
                                <input
                                    type="number"
                                    value={challanForm.amt}
                                    onChange={(e) => setChallanForm({ ...challanForm, amt: e.target.value })}
                                    className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg outline-hidden focus:border-indigo-505 dark:bg-gray-900 dark:border-gray-700"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block">{t("Payment Channel gateway")}</label>
                                <select
                                    value={challanForm.method}
                                    onChange={(e) => setChallanForm({ ...challanForm, method: e.target.value })}
                                    className="w-full text-xs mt-1 px-3 py-2 border rounded-lg outline-hidden focus:border-indigo-505 bg-white dark:bg-gray-900 dark:border-gray-700"
                                >
                                    <option value="NetBanking">Net Banking (SBI / HDFC / ICICI)</option>
                                    <option value="UPI">UPI Payment Instant G-Pay / PhonePe</option>
                                    <option value="NEFT">NEFT / RTGS Wire Transfer Transfer</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                            >
                                <Landmark size={14} />
                                {t("Generate Challan & Fund Ledger")}
                            </button>
                        </form>

                        {/* Liability Offset Simulator console */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-850 lg:col-span-8 flex flex-col justify-between space-y-4">
                            <div>
                                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center justify-between border-b pb-2 mb-2">
                                    <span className="flex items-center gap-1.5">
                                        <BarChart2 size={14} className="text-indigo-600" />
                                        {t("Portal Section 49 Tax liability offset engine")}
                                    </span>
                                    <span className="text-[9px] font-black tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase dark:bg-indigo-950 dark:text-indigo-400">
                                        {t("Liability Offsetting Rule")}
                                    </span>
                                </h4>
                                
                                <div className="grid grid-cols-3 gap-3 bg-indigo-50/20 p-3 rounded-lg border border-indigo-100/40 dark:bg-gray-900 dark:border-gray-750 mb-4 text-center">
                                    <div>
                                        <p className="text-[9px] uppercase font-black tracking-wider text-rose-500">{t("IGST Outstanding")}</p>
                                        <p className="text-xs font-mono font-bold mt-1 text-gray-800 dark:text-gray-100">₹{formatNumber(outstandingLiability.igst)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black tracking-wider text-rose-500">{t("CGST Outstanding")}</p>
                                        <p className="text-xs font-mono font-bold mt-1 text-gray-800 dark:text-gray-100">₹{formatNumber(outstandingLiability.cgst)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black tracking-wider text-rose-500">{t("SGST Outstanding")}</p>
                                        <p className="text-xs font-mono font-bold mt-1 text-gray-800 dark:text-gray-100">₹{formatNumber(outstandingLiability.sgst)}</p>
                                    </div>
                                </div>

                                {offsetApplied ? (
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-widest">{t("Allocation and accounting breakdown:")}</p>
                                        <div className="p-3 bg-gray-950 text-emerald-400 font-mono text-[10px] rounded-lg border space-y-1 overflow-y-auto max-h-[140px] leading-relaxed select-all">
                                            {offsetConsole.map((line, lIdx) => (
                                                <p key={lIdx} className="flex items-center gap-1.5">
                                                    <CornerDownRight size={10} className="text-indigo-400" />
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 border border-dashed rounded-xl dark:border-gray-700 space-y-2">
                                        <AlertCircle className="w-10 h-10 text-indigo-400 mx-auto" />
                                        <h5 className="font-extrabold text-xs text-gray-700 dark:text-gray-250">{t("Unreconciled liabilities in ledger")}</h5>
                                        <p className="text-[10px] text-gray-500 max-w-sm mx-auto">
                                            {t("Offset sequence u/r 88A dictates that IGST credit must be fully leveraged before taking CGST or SGST credit credits.")}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {offsetApplied && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOutstandingLiability({ igst: 350000, cgst: 200000, sgst: 200000 });
                                            setOffsetApplied(false);
                                            setOffsetConsole([]);
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 rounded-lg dark:bg-gray-750 dark:text-gray-100 transition whitespace-nowrap"
                                    >
                                        {t("Reset Liabilities")}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={triggerAutoOffsetOffset}
                                    disabled={outstandingLiability.igst === 0 && outstandingLiability.cgst === 0 && outstandingLiability.sgst === 0}
                                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${outstandingLiability.igst === 0 && outstandingLiability.cgst === 0 && outstandingLiability.sgst === 0 ? 'bg-gray-150 text-gray-400 cursor-not-allowed dark:bg-gray-755 dark:text-gray-600' : 'bg-indigo-600 outline-hidden hover:bg-indigo-700 text-white'}`}
                                >
                                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                    {t("Engage Automatic Section 49 Credit Offset Reconcile")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 5: Composition Dealer Portal (Decommissioned - Handled in standalone CompositionReport.tsx) */}
            {false && (
                <div />
            )}
            {/* Consolidated old content bypassed */}
            {false && (
                <div className="lg:col-span-8 bg-white rounded-xl border border-gray-100 p-6 shadow-xs dark:bg-gray-800 dark:border-gray-800">
                            {/* Option 1: CMP-08 */}
                            {compActiveOption === 'cmp08' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("CMP-08: Self-Assessed Tax (Quarterly)")}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{t("Quarterly payment declaration for self-assessed supplies under Rule 62.")}</p>
                                        </div>
                                        <Sparkles className="text-indigo-600 animate-pulse" size={18} />
                                    </div>

                                    {/* Calculated Outputs Preview */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3 p-4 bg-gray-50/50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-750">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-indigo-755 dark:text-indigo-400">{t("Filing Configuration")}</p>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Financial Year")}</label>
                                                    <select
                                                        value={compCmp08Data.financialYear}
                                                        onChange={(e) => setCompCmp08Data({ ...compCmp08Data, financialYear: e.target.value })}
                                                        className="w-full text-xs mt-1 px-2.5 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden dark:border-gray-700 font-bold"
                                                    >
                                                        <option value="2025-26">FY 2025-26</option>
                                                        <option value="2024-25">FY 2024-25</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Quarter Selector")}</label>
                                                    <select
                                                        value={compCmp08Data.quarter}
                                                        onChange={(e) => setCompCmp08Data({ ...compCmp08Data, quarter: e.target.value })}
                                                        className="w-full text-xs mt-1 px-2.5 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden dark:border-gray-700 font-bold"
                                                    >
                                                        <option value="Q1 (Apr-Jun)">Q1 (Apr-Jun)</option>
                                                        <option value="Q2 (Jul-Sep)">Q2 (Jul-Sep)</option>
                                                        <option value="Q3 (Oct-Dec)">Q3 (Oct-Dec)</option>
                                                        <option value="Q4 (Jan-Mar)">Q4 (Jan-Mar)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 block">{t("Dealer Category Tax Rate")}</label>
                                                <select
                                                    value={compCmp08Data.taxRate}
                                                    onChange={(e) => setCompCmp08Data({ ...compCmp08Data, taxRate: e.target.value })}
                                                    className="w-full text-xs mt-1 px-2.5 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden dark:border-gray-700"
                                                >
                                                    <option value="1.0">1.0% Outward (Traders and Manufacturers)</option>
                                                    <option value="5.0">5.0% Outward (Restaurant Services)</option>
                                                    <option value="6.0">6.0% Outward (Other Service Providers - Sec 10(2A))</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 block">{t("Outward taxable supplies (including exempt)")}</label>
                                                <div className="relative mt-1">
                                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={compCmp08Data.outwardSupplies}
                                                        onChange={(e) => setCompCmp08Data({ ...compCmp08Data, outwardSupplies: e.target.value })}
                                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 block">{t("Inward supplies attracting Reverse Charge (RCM)")}</label>
                                                <div className="relative mt-1">
                                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={compCmp08Data.rcmSupplies}
                                                        onChange={(e) => setCompCmp08Data({ ...compCmp08Data, rcmSupplies: e.target.value })}
                                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Calculation Output Card */}
                                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold">₹</div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] uppercase tracking-widest font-black text-indigo-250 bg-indigo-950/40 px-2.5 py-0.5 rounded">
                                                        {t("Reckoned Tax Liability")}
                                                    </span>
                                                    <span className="text-indigo-400 text-xs font-bold">{compCmp08Data.quarter}</span>
                                                </div>

                                                {/* Calculation Formula Results */}
                                                <div className="space-y-2 text-xs">
                                                    <div className="flex justify-between items-center text-gray-300">
                                                        <span>{t("Outward Supplies CGST ({rate}%)", { rate: (parseFloat(compCmp08Data.taxRate) / 2).toFixed(2) })}</span>
                                                        <span className="font-mono">₹{formatNumber(Math.round((Number(compCmp08Data.outwardSupplies) * (parseFloat(compCmp08Data.taxRate) / 100)) / 2))}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-gray-300">
                                                        <span>{t("Outward Supplies SGST ({rate}%)", { rate: (parseFloat(compCmp08Data.taxRate) / 2).toFixed(2) })}</span>
                                                        <span className="font-mono">₹{formatNumber(Math.round((Number(compCmp08Data.outwardSupplies) * (parseFloat(compCmp08Data.taxRate) / 100)) / 2))}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-gray-300 border-b border-indigo-750 pb-1">
                                                        <span>{t("Inward Supplies RCM Liability (5% RCM average)")}</span>
                                                        <span className="font-mono">₹{formatNumber(Math.round(Number(compCmp08Data.rcmSupplies) * 0.05))}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 text-sm">
                                                        <span className="font-extrabold">{t("Total Central Tax payable (CGST)")}</span>
                                                        <span className="font-mono font-black text-amber-300">
                                                            ₹{formatNumber(
                                                                Math.round((Number(compCmp08Data.outwardSupplies) * (parseFloat(compCmp08Data.taxRate) / 100)) / 2 + (Number(compCmp08Data.rcmSupplies) * 0.05) / 2)
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="font-extrabold">{t("Total State Tax payable (SGST)")}</span>
                                                        <span className="font-mono font-black text-amber-300">
                                                            ₹{formatNumber(
                                                                Math.round((Number(compCmp08Data.outwardSupplies) * (parseFloat(compCmp08Data.taxRate) / 100)) / 2 + (Number(compCmp08Data.rcmSupplies) * 0.05) / 2)
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-indigo-800/40">
                                                {compCmp08Data.filed ? (
                                                    <div className="p-3 bg-emerald-950/45 text-emerald-300 border border-emerald-800/40 rounded-lg text-xs flex items-center justify-between gap-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                            <div>
                                                                <p className="font-extrabold">{t("Statement Filed Successfully")}</p>
                                                                <p className="text-[10px] text-gray-400">ARN: {compCmp08Data.arn}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10.5px] font-mono leading-none">{compCmp08Data.paymentDate}</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const outwardVal = Number(compCmp08Data.outwardSupplies);
                                                            const rcmVal = Number(compCmp08Data.rcmSupplies);
                                                            const ratePct = parseFloat(compCmp08Data.taxRate);

                                                            const cgstPay = Math.round((outwardVal * (ratePct / 100)) / 2 + (rcmVal * 0.05) / 2);
                                                            const sgstPay = Math.round((outwardVal * (ratePct / 100)) / 2 + (rcmVal * 0.05) / 2);

                                                            // Check cash ledger balances
                                                            if (cashLedger.cgst < cgstPay || cashLedger.sgst < sgstPay) {
                                                                alert(t("Insufficient balance in your Electronic Cash Ledger! Required: CGST ₹{cgst}, SGST ₹{sgst}. Please head over to the 'e-Ledger Simulator' tab to deposit funds first.", { cgst: formatNumber(cgstPay), sgst: formatNumber(sgstPay) }));
                                                                return;
                                                            }

                                                            // Deduct from cash ledger
                                                            setCashLedger(prev => ({
                                                                ...prev,
                                                                cgst: prev.cgst - cgstPay,
                                                                sgst: prev.sgst - sgstPay
                                                            }));

                                                            const randArn = `CP0827${Math.floor(100000 + Math.random() * 900000)}B`;
                                                            const todayStr = new Date().toISOString().split('T')[0];

                                                            setCompCmp08Data(prev => ({
                                                                ...prev,
                                                                filed: true,
                                                                paymentDate: todayStr,
                                                                arn: randArn
                                                            }));

                                                            // Insert log in compCmp08List
                                                            const newLog = {
                                                                id: String(Date.now()),
                                                                fy: compCmp08Data.financialYear,
                                                                quarter: compCmp08Data.quarter.split(' ')[0],
                                                                outward: outwardVal,
                                                                rcm: rcmVal,
                                                                rate: ratePct,
                                                                cgst: cgstPay,
                                                                sgst: sgstPay,
                                                                status: 'Filed',
                                                                date: todayStr
                                                            };
                                                            setCompCmp08List([newLog, ...compCmp08List]);

                                                            alert(t("Form GST CMP-08 was successfully authorized using Electronic Cash Ledger offsets. ARN {arn} issued.", { arn: randArn }));
                                                        }}
                                                        className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                                    >
                                                        <FileCheck size={14} />
                                                        {t("Authorize and File CMP-08")}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sub-tab Historical records */}
                                    <div className="space-y-3">
                                        <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">{t("Form CMP-08 Filing History Log")}</h5>
                                        <div className="overflow-x-auto border rounded-xl">
                                            <table className="w-full text-xs text-left whitespace-nowrap">
                                                <thead className="bg-gray-50 dark:bg-gray-950/40 text-gray-500 font-bold border-b">
                                                    <tr>
                                                        <th className="px-4 py-2 text-center">{t("Quarter")}</th>
                                                        <th className="px-4 py-2">{t("Financial Year")}</th>
                                                        <th className="px-4 py-2 text-right">{t("Outward taxable")}</th>
                                                        <th className="px-4 py-2 text-right">{t("Inward RCM")}</th>
                                                        <th className="px-4 py-2 text-right">{t("Tax CGST/SGST")}</th>
                                                        <th className="px-4 py-2 text-center">{t("Filing Status")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                                                    {compCmp08List.map((row) => (
                                                        <tr key={row.id} className="hover:bg-gray-50/50">
                                                            <td className="px-4 py-2.5 text-center font-bold text-gray-800 dark:text-white">{row.quarter}</td>
                                                            <td className="px-4 py-2.5 text-gray-550 dark:text-gray-400">FY {row.fy}</td>
                                                            <td className="px-4 py-2.5 text-right font-mono">₹{formatNumber(row.outward)}</td>
                                                            <td className="px-4 py-2.5 text-right font-mono text-gray-500">₹{formatNumber(row.rcm)}</td>
                                                            <td className="px-4 py-2.5 text-right font-mono text-indigo-600 font-semibold">₹{formatNumber(row.cgst)} + ₹{formatNumber(row.sgst)}</td>
                                                            <td className="px-4 py-2.5 text-center">
                                                                <span className="px-2 py-0.5 rounded text-[9px] uppercase font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30">
                                                                    {t(row.status)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Option 2: GSTR-4 */}
                            {compActiveOption === 'gstr4' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("GSTR-4: Composition Annual Return Return")}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{t("Consolidated annual declaration statement for composition suppliers under Section 44.")}</p>
                                        </div>
                                        <Briefcase className="text-indigo-600" size={18} />
                                    </div>

                                    {/* Action controls */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4 p-4 bg-gray-50/50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-750">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-[#2f3542] dark:text-indigo-400">{t("Return Parameter Setup")}</p>
                                            
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-450 block">{t("Filing Period Year")}</label>
                                                <select
                                                    value={compGstr4Data.financialYear}
                                                    onChange={(e) => setCompGstr4Data({ ...compGstr4Data, financialYear: e.target.value })}
                                                    className="w-full text-xs mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden dark:border-gray-700 font-extrabold"
                                                >
                                                    <option value="2025-26">FY 2025-26 (Drafting)</option>
                                                    <option value="2024-25">FY 2024-25 (Archived)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-gray-450 block">{t("Aggregate Outward Supplies FY (Dynamic Sum)")}</label>
                                                <div className="relative mt-1">
                                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={compGstr4Data.outwardTaxable}
                                                        onChange={(e) => setCompGstr4Data({ ...compGstr4Data, outwardTaxable: e.target.value })}
                                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono font-bold text-gray-800 dark:text-white"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-gray-450 block">{t("Adjusted Inward Supplies Attracting RCM Sum")}</label>
                                                <div className="relative mt-1">
                                                    <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={compGstr4Data.inwardRcm}
                                                        onChange={(e) => setCompGstr4Data({ ...compGstr4Data, inwardRcm: e.target.value })}
                                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCompGstr4Data(prev => ({ ...prev, reconciled: true }));
                                                        alert(t("CMP-08 quarterly aggregates matched against outward Sales Vouchers successfully. All discrepancies resolved. Ready for DSC signing."));
                                                    }}
                                                    className="w-full py-2 border hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
                                                >
                                                    {t("Reconcile CMP-08")}
                                                </button>
                                            </div>
                                        </div>

                                        {/* OTP Verification & Form Filing Simulator */}
                                        <div className="bg-gradient-to-br from-indigo-50/50 to-slate-100 dark:from-slate-900 dark:to-gray-950 rounded-xl p-5 border border-indigo-100 dark:border-gray-800 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between border-b pb-2">
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-700 dark:text-indigo-400">{t("Verification console")}</span>
                                                    <span className="text-[10.5px] font-bold text-gray-500">{t("Form GSTR-4 Sign")}</span>
                                                </div>

                                                <div className="space-y-1 text-xs">
                                                    <p className="font-bold text-gray-700 dark:text-gray-300">{t("Declared Tax Obligations summary:")}</p>
                                                    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg space-y-1 font-mono text-[10.5px] border">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">{t("Annual Outward Tax:")}</span>
                                                            <span className="font-bold text-gray-800 dark:text-white">₹{formatNumber(Math.round(Number(compGstr4Data.outwardTaxable) * 0.01))}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">{t("RCM Tax Inward:")}</span>
                                                            <span className="font-bold text-gray-800 dark:text-white">₹{formatNumber(Math.round(Number(compGstr4Data.inwardRcm) * 0.05))}</span>
                                                        </div>
                                                        <div className="flex justify-between pt-1 border-t text-indigo-650 dark:text-indigo-400 font-extrabold font-semibold">
                                                            <span>{t("Consolidated Tax Balance:")}</span>
                                                            <span>₹{formatNumber(Math.round(Number(compGstr4Data.outwardTaxable) * 0.01 + Number(compGstr4Data.inwardRcm) * 0.05))}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {compGstr4Data.filed ? (
                                                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-150 text-xs dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60">
                                                        <p className="font-bold flex items-center gap-1.5">
                                                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                                                            {t("Successfully Filed for Period {period}", { period: compGstr4Data.financialYear })}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 mt-1">ARN: {compGstr4Data.arn}</p>
                                                    </div>
                                                ) : compGstr4Data.isSigning ? (
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-bold text-gray-400 block">{t("Enter EVC OTP code (Sent to registered mobile/email)")}</label>
                                                        <input
                                                            type="text"
                                                            placeholder="123456"
                                                            value={compGstr4Data.otp}
                                                            onChange={(e) => setCompGstr4Data({ ...compGstr4Data, otp: e.target.value })}
                                                            className="w-full text-center tracking-widest font-mono text-base font-black px-3 py-1 border rounded-lg bg-white dark:bg-gray-850 dark:border-gray-700 outline-hidden"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (!compGstr4Data.otp) {
                                                                    alert(t("Please enter OTP code for digital signature verification."));
                                                                    return;
                                                                }
                                                                const randArn = `CP4A27${Math.floor(100000 + Math.random() * 900000)}B`;
                                                                const todayStr = new Date().toISOString().split('T')[0];

                                                                setCompGstr4Data(prev => ({
                                                                    ...prev,
                                                                    filed: true,
                                                                    isSigning: false,
                                                                    arn: randArn
                                                                }));

                                                                setCompGstr4Archive([
                                                                    {
                                                                        id: `G4-${Date.now()}`,
                                                                        fy: compGstr4Data.financialYear,
                                                                        outward: Number(compGstr4Data.outwardTaxable),
                                                                        rcm: Number(compGstr4Data.inwardRcm),
                                                                        cgst: Math.round((Number(compGstr4Data.outwardTaxable) * 0.01) / 2),
                                                                        sgst: Math.round((Number(compGstr4Data.outwardTaxable) * 0.01) / 2),
                                                                        status: 'Filed',
                                                                        date: todayStr
                                                                    },
                                                                    ...compGstr4Archive
                                                                ]);

                                                                alert(t("Annual return GSTR-4 filed successfully with ARN {arn}!", { arn: randArn }));
                                                            }}
                                                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition-all"
                                                        >
                                                            {t("Verify OTP & Submit return")}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={!compGstr4Data.reconciled}
                                                        onClick={() => {
                                                            setCompGstr4Data(prev => ({ ...prev, isSigning: true }));
                                                        }}
                                                        className={`w-full py-2.5 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                                                            compGstr4Data.reconciled
                                                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <Send size={13} />
                                                        {t("Authorize and Sign GSTR-4 (EVC)")}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Annual returns archive */}
                                    <div className="space-y-3">
                                        <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">{t("Form GSTR-4 Annual Filing Archives")}</h5>
                                        <div className="overflow-x-auto border rounded-xl">
                                            <table className="w-full text-xs text-left whitespace-nowrap font-medium">
                                                <thead className="bg-gray-50 dark:bg-gray-950/40 text-gray-500 font-bold border-b">
                                                    <tr>
                                                        <th className="px-4 py-2">{t("Financial Period")}</th>
                                                        <th className="px-4 py-2 text-right">{t("Aggregate Outward")}</th>
                                                        <th className="px-4 py-2 text-right">{t("Aggregate Inward RCM")}</th>
                                                        <th className="px-4 py-2 text-right">{t("CGST / SGST Assessed")}</th>
                                                        <th className="px-4 py-2 text-right">{t("Submission Date")}</th>
                                                        <th className="px-4 py-2 text-center">{t("Status")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                                                    {compGstr4Archive.map((row) => (
                                                        <tr key={row.id} className="hover:bg-gray-55/40">
                                                            <td className="px-4 py-2.5 font-bold text-gray-900 dark:text-white">FY {row.fy}</td>
                                                            <td className="px-4 py-2.5 text-right font-mono">₹{formatNumber(row.outward)}</td>
                                                            <td className="px-4 py-2.5 text-right font-mono text-gray-500">₹{formatNumber(row.rcm)}</td>
                                                            <td className="px-4 py-2.5 text-right font-mono text-indigo-650">₹{formatNumber(row.cgst)} + ₹{formatNumber(row.sgst)}</td>
                                                            <td className="px-4 py-2.5 text-right text-gray-500">{row.date}</td>
                                                            <td className="px-4 py-2.5 text-center">
                                                                <span className="px-2.5 py-0.5 rounded text-[9px] uppercase font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20">
                                                                    {t(row.status)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Option 3: GSTR-4A */}
                            {compActiveOption === 'gstr4a' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("GSTR-4A: Auto-Drafted Inward Details Portal")}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{t("Auto-drafted inward invoices uploaded by respective suppliers for reference.")}</p>
                                        </div>
                                        <Layers className="text-indigo-600 animate-pulse" size={18} />
                                    </div>

                                    {/* Search bar inside option */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder={t("Filter by supplier name or invoice...")}
                                            value={gstr4aSearch}
                                            onChange={(e) => setGstr4aSearch(e.target.value)}
                                            className="pl-9 pr-4 py-1.5 w-full text-xs rounded-lg border outline-hidden focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700"
                                        />
                                    </div>

                                    {/* Table with custom reconcile action buttons */}
                                    <div className="overflow-x-auto border rounded-xl">
                                        <table className="w-full text-xs text-left whitespace-nowrap">
                                            <thead className="bg-gray-50 dark:bg-gray-950/30 text-gray-500 font-bold border-b">
                                                <tr>
                                                    <th className="px-4 py-2">{t("Invoice / Supplier Details")}</th>
                                                    <th className="px-4 py-2">{t("Date")}</th>
                                                    <th className="px-4 py-2 text-right">{t("Taxable value")}</th>
                                                    <th className="px-4 py-2 text-center">{t("RCM Mode")}</th>
                                                    <th className="px-4 py-2 text-right">{t("Tax CGST/SGST")}</th>
                                                    <th className="px-4 py-2 text-center">{t("Alignment Action")}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                                                {compGstr4AData
                                                    .filter(item => item.name.toLowerCase().includes(gstr4aSearch.toLowerCase()) || item.invNo.toLowerCase().includes(gstr4aSearch.toLowerCase()))
                                                    .map((row) => (
                                                        <tr key={row.id} className="hover:bg-gray-50/50">
                                                            <td className="px-4 py-3">
                                                                <div className="font-bold text-gray-800 dark:text-white">{row.name}</div>
                                                                <div className="text-[10px] text-gray-400 font-bold font-mono">GSTIN: {row.supplierGstin} • No: {row.invNo}</div>
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-500 font-medium">{row.date}</td>
                                                            <td className="px-4 py-3 text-right font-mono font-bold">₹{formatNumber(row.value)}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                                                                    row.rcmApplicable === 'Yes' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-gray-100 text-gray-500 dark:bg-gray-900'
                                                                }`}>
                                                                    {row.rcmApplicable === 'Yes' ? 'Reverse Charge' : 'Normal'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-mono text-gray-650">₹{formatNumber(row.cgst)}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                {row.status === 'Auto-Matched' ? (
                                                                    <span className="px-2.5 py-1 text-[9px] uppercase font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 inline-flex items-center gap-1">
                                                                        <CheckCircle className="w-3 h-3" />
                                                                        {t("Matched")}
                                                                    </span>
                                                                ) : row.status === 'Disputed' ? (
                                                                    <span className="px-2.5 py-1 text-[9px] uppercase font-black bg-rose-50 text-rose-700 dark:bg-rose-950/25 inline-flex items-center gap-1">
                                                                        <X className="w-3 h-3" />
                                                                        {t("Disputed")}
                                                                    </span>
                                                                ) : (
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const updated = compGstr4AData.map(item =>
                                                                                    item.id === row.id ? { ...item, status: 'Auto-Matched' } : item
                                                                                );
                                                                                setCompGstr4AData(updated);
                                                                            }}
                                                                            className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold hover:bg-indigo-700"
                                                                        >
                                                                            {t("Approve Choice")}
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const updated = compGstr4AData.map(item =>
                                                                                    item.id === row.id ? { ...item, status: 'Disputed' } : item
                                                                                );
                                                                                setCompGstr4AData(updated);
                                                                            }}
                                                                            className="px-2 py-1 border text-gray-600 rounded text-[10px] font-bold hover:bg-gray-100 dark:border-gray-750 dark:text-gray-300 dark:hover:bg-gray-900"
                                                                        >
                                                                            {t("Dispute")}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Option 4: CMP-02 (Opt-In) */}
                            {compActiveOption === 'cmp02' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("CMP-02: Intimation to Opt-Into Composition Scheme")}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{t("Select option to opt into the simplified composition levy for the upcoming financial period.")}</p>
                                        </div>
                                        <CheckCircle className="text-emerald-500 animate-pulse" size={18} />
                                    </div>

                                    {cmp02Form.submitted ? (
                                        <div className="p-8 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-center space-y-3 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900">
                                            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                                            <h5 className="font-black text-sm">{t("Opt-In Application Inward Registered Successfully!")}</h5>
                                            <p className="text-xs text-gray-600">
                                                {t("Your application under Form GST CMP-02 was authorized using EVC Signature for period FY {period}. Certificate generated.", { period: cmp02Form.fy })}
                                            </p>
                                            <p className="font-mono text-xs font-black text-indigo-600 bg-white/60 dark:bg-gray-900/60 py-2 rounded-lg max-w-sm mx-auto">
                                                ARN: {cmp02Form.arn}
                                            </p>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (!cmp02Form.declarationAccepted) {
                                                    alert(t("You must accept the statutory eligibility qualifications first."));
                                                    return;
                                                }
                                                const randArn = `CO0227${Math.floor(100000 + Math.random() * 900000)}Y`;
                                                setCmp02Form(prev => ({ ...prev, submitted: true, arn: randArn }));
                                                alert(t("GST CMP-02 Opt-In authorized. Your registration is locked under Composition bounds starting FY {period}.", { period: cmp02Form.fy }));
                                            }}
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Opting starting FY Period")}</label>
                                                    <select
                                                        value={cmp02Form.fy}
                                                        onChange={(e) => setCmp02Form({ ...cmp02Form, fy: e.target.value })}
                                                        className="w-full text-xs mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                                                    >
                                                        <option value="2026-27">FY 2026-27 (Upcoming Cycle)</option>
                                                        <option value="2025-26">FY 2025-26 (Immediate Lock)</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Estimated Corporate Turnover (₹)")}</label>
                                                    <input
                                                        type="number"
                                                        value={cmp02Form.estimatedTurnover}
                                                        onChange={(e) => setCmp02Form({ ...cmp02Form, estimatedTurnover: e.target.value })}
                                                        className="w-full mt-1 px-3 py-1.5 border rounded-lg outline-hidden text-xs bg-white dark:bg-gray-850 dark:border-gray-700 font-mono"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 block">{t("Business Option Class Category")}</label>
                                                <select
                                                    value={cmp02Form.category}
                                                    onChange={(e) => setCmp02Form({ ...cmp02Form, category: e.target.value })}
                                                    className="w-full text-xs mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 font-bold text-gray-800 dark:text-white"
                                                >
                                                    <option value="Manufacturer">Manufacturer (Prescribed 1% Tax Ratio)</option>
                                                    <option value="Trader">Regular Retail Trader (Prescribed 1% Tax Ratio)</option>
                                                    <option value="Restaurant">Restaurant Food Provider (Prescribed 5% Tax Ratio)</option>
                                                    <option value="Service Provider">Other Service Professional (Prescribed 6% Tax Ratio)</option>
                                                </select>
                                            </div>

                                            {/* Checklist of Eligibility constraints */}
                                            <div className="bg-gray-50/50 dark:bg-gray-900/60 p-4 rounded-xl border space-y-2.5 text-xs">
                                                <p className="font-extrabold text-gray-700 dark:text-gray-300">{t("Verify Eligibility Checklist:")}</p>
                                                <div className="space-y-1.5 text-gray-500">
                                                    <p className="flex items-start gap-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                        <span>{t("Aggregate turnover doesn't exceed 1.5 Crores INR (75 Lakhs for Special Category States)")}</span>
                                                    </p>
                                                    <p className="flex items-start gap-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                        <span>{t("No execution of interstate outward taxable supplies of goods or services")}</span>
                                                    </p>
                                                    <p className="flex items-start gap-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                        <span>{t("No distribution of tobacco, pan masala, ice-cream, aerated waters, or non-taxable petroleum")}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Declaration checkbox */}
                                            <div className="flex items-start gap-2 p-1.5">
                                                <input
                                                    type="checkbox"
                                                    id="cmp02dec"
                                                    checked={cmp02Form.declarationAccepted}
                                                    onChange={(e) => setCmp02Form({ ...cmp02Form, declarationAccepted: e.target.checked })}
                                                    className="rounded border mt-1 shrink-0"
                                                />
                                                <label htmlFor="cmp02dec" className="text-[10.5px] text-gray-500 leading-normal select-none">
                                                    {t("I hereby declare that our business parameters meet Section 10 rules. Any discrepancy discovered during statutory audit will trigger regular scheme offsets and penalties.")}
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition-all"
                                            >
                                                {t("Authorize and Lodge Opt-In App Option")}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Option 5: CMP-04 (Opt-Out) */}
                            {compActiveOption === 'cmp04' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("CMP-04: Notice of Withdrawal from Composition Scheme")}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{t("Report structural withdrawal or voluntary opt-out to transfer onto regular tax schedules.")}</p>
                                        </div>
                                        <ShieldAlert className="text-rose-500" size={18} />
                                    </div>

                                    {cmp04Form.submitted ? (
                                        <div className="p-8 bg-rose-50 text-rose-800 rounded-xl border border-rose-100 text-center space-y-3 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900">
                                            <CheckCircle className="w-12 h-12 text-rose-605 mx-auto text-rose-500" />
                                            <h5 className="font-black text-sm">{t("Withdrawal Intimation Logged Successfully!")}</h5>
                                            <p className="text-xs text-gray-600">
                                                {t("Composition limits successfully waived. Business status shifted to standard GST schedules starting {effDate}.", { effDate: cmp04Form.effectiveDate })}
                                            </p>
                                            <p className="font-mono text-xs font-black text-rose-650 bg-white/60 dark:bg-gray-900/60 py-2 rounded-lg max-w-sm mx-auto">
                                                ARN: {cmp04Form.arn}
                                            </p>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (!cmp04Form.declarationAccepted) {
                                                    alert(t("Please accept the statutory conversion rules first."));
                                                    return;
                                                }
                                                const randArn = `CW0427${Math.floor(100000 + Math.random() * 900000)}P`;
                                                setCmp04Form(prev => ({ ...prev, submitted: true, arn: randArn }));
                                                alert(t("LODGED. Form GST CMP-04 registered starting {effDate}. File standard monthly GSTR-1 & GSTR-3B registers.", { effDate: cmp04Form.effectiveDate }));
                                            }}
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Effective date of Withdrawal")}</label>
                                                    <input
                                                        type="date"
                                                        value={cmp04Form.effectiveDate}
                                                        onChange={(e) => setCmp04Form({ ...cmp04Form, effectiveDate: e.target.value })}
                                                        className="w-full text-xs mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 font-bold"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 block">{t("Financial Period Cycle")}</label>
                                                    <select
                                                        value={cmp04Form.fy}
                                                        onChange={(e) => setCmp04Form({ ...cmp04Form, fy: e.target.value })}
                                                        className="w-full text-xs mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                                                    >
                                                        <option value="2025-26">FY 2025-26</option>
                                                        <option value="2024-25">FY 2024-25</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 block">{t("Reason for Opt-Out Intimation Choice")}</label>
                                                <select
                                                    value={cmp04Form.reason}
                                                    onChange={(e) => setCmp04Form({ ...cmp04Form, reason: e.target.value })}
                                                    className="w-full text-xs mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                                                >
                                                    <option value="To exceed threshold limit (over 1.5 Crores INR)">Exceeded aggregate turnover limit (&gt; 1.5 Crores INR)</option>
                                                    <option value="Voluntary conversion to standard cycle">Voluntary Conversion to regular taxing scheme</option>
                                                    <option value="Excusable manufacturing change constraints">Interstate outward supplies or e-commerce channeling transition</option>
                                                </select>
                                            </div>

                                            {/* Warning detail */}
                                            <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100 text-xs text-rose-800 dark:bg-slate-900 dark:border-rose-950 dark:text-rose-450 leading-relaxed">
                                                ℹ️ <strong>{t("Compliance Warning:")}</strong> {t("Upon submission under CMP-04, you must file Form GST ITC-01 summarizing raw material stock, in-process goods, and semi-finished stock within 30 days to transfer input credits legally.")}
                                            </div>

                                            {/* Declaration */}
                                            <div className="flex items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="cmp04dec"
                                                    checked={cmp04Form.declarationAccepted}
                                                    onChange={(e) => setCmp04Form({ ...cmp04Form, declarationAccepted: e.target.checked })}
                                                    className="rounded border mt-1 shrink-0"
                                                />
                                                <label htmlFor="cmp04dec" className="text-[10px] text-gray-500 leading-normal select-none">
                                                    {t("I hereby confirm structural withdrawal from the composition regime and acknowledge my liability to collect and deposit tax as a regular dealer from the chosen date.")}
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg transition-all"
                                            >
                                                {t("Lodge Voluntary Scheme Withdrawal Option")}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Option 6: Calendar and Rules */}
                            {compActiveOption === 'calendar' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-850 dark:text-gray-100">{t("Composition Scheme Statutory Parameters Option")}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{t("Deadlines, rules, forms and rates checklist prescribed under SGST/CGST Act Section 10.")}</p>
                                        </div>
                                        <Info className="text-indigo-600 animate-pulse" size={18} />
                                    </div>

                                    {/* Table of different Forms */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("Form Register Reference Book")}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50/50 dark:bg-gray-900 rounded-xl border border-gray-105 space-y-2">
                                                <p className="font-bold text-xs text-gray-800 dark:text-gray-100 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                                    {t("FORM GST CMP-08")}
                                                </p>
                                                <p className="text-xs text-gray-500 leading-normal">
                                                    {t("Quarterly Statement of payment of self-assessed tax. Due on the 18th of the month following the end of the quarter. Late fees: ₹100/day up to a maximum of ₹5,000.")}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gray-50/50 dark:bg-gray-900 rounded-xl border border-gray-105 space-y-2">
                                                <p className="font-bold text-xs text-gray-800 dark:text-gray-100 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                                    {t("FORM GSTR-4 (Annual)")}
                                                </p>
                                                <p className="text-xs text-gray-500 leading-normal">
                                                    {t("Annual Return for Composition Dealers summarizing aggregate supplies, inward RCM details, and taxes. Due on 30th April following the close of the financial year.")}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gray-50/50 dark:bg-gray-900 rounded-xl border border-gray-105 space-y-2">
                                                <p className="font-bold text-xs text-gray-805 dark:text-gray-100 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                                    {t("FORM GSTR-4A (Auto-Drafted)")}
                                                </p>
                                                <p className="text-xs text-gray-500 leading-normal">
                                                    {t("Auto-drafted outward supplies compiled dynamically based on suppliers' records under Form GSTR-1/5. Contains reverse charge details.")}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gray-50/50 dark:bg-gray-900 rounded-xl border border-gray-105 space-y-2">
                                                <p className="font-bold text-xs text-gray-805 dark:text-gray-100 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                                    {t("FORM GST CMP-02 (Opt-In)")}
                                                </p>
                                                <p className="text-xs text-gray-500 leading-normal">
                                                    {t("Intimation of option to levy composition tax under Sec 10. Must be lodged prior to the commencement of the financial year for which the scheme option is exercised.")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs text-indigo-850 dark:bg-indigo-950/20 dark:border-indigo-950 dark:text-indigo-400 space-y-2">
                                            <p className="font-black uppercase tracking-wider">{t("Tax Rate Prescribed Limits (Schedule 10)")}:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li><strong>1%</strong> {t("for Manufacturers & retail traders (0.5% Central + 0.5% State Tax)")}</li>
                                                <li><strong>5%</strong> {t("for Restaurants not serving alcohol (2.5% Central + 2.5% State Tax)")}</li>
                                                <li><strong>6%</strong> {t("for Mixed Service providers, builders and small service practitioners (3% Central + 3% State Tax)")}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
            )}

            {/* Expanded Detailed Audit Dialog */}
            {selectedDetails && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl border border-gray-150 shadow-2xl dark:bg-gray-800 dark:border-gray-750 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-755 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                    <Layers size={18} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-base">{t(selectedDetails.title)}</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-normal dark:text-gray-400">{t(selectedDetails.desc)}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedReportId(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Interactive Dynamic Form for Inserting Entries (New feature requested) */}
                        <div className="px-6 py-4 bg-gray-50/55 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-750">
                            {selectedReportId === 'GSTR-7' && (
                                <form onSubmit={handleAddTdsRow} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Deductee GSTIN")}</label>
                                        <input
                                            type="text"
                                            placeholder="27AAACW8823F1Z6"
                                            required
                                            value={newTds.gstin}
                                            onChange={(e) => setNewTds({ ...newTds, gstin: e.target.value })}
                                            className="w-full text-xs font-mono font-bold mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-500 text-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Deductee Name")}</label>
                                        <input
                                            type="text"
                                            placeholder="Kirloskar Engines Ltd"
                                            required
                                            value={newTds.name}
                                            onChange={(e) => setNewTds({ ...newTds, name: e.target.value })}
                                            className="w-full text-xs mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-500 text-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Gross value")}</label>
                                            <input
                                                type="number"
                                                placeholder="920000"
                                                required
                                                value={newTds.gross}
                                                onChange={(e) => setNewTds({ ...newTds, gross: e.target.value })}
                                                className="w-full text-xs font-mono mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-500 text-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{t("Is interstate")}</label>
                                            <input
                                                type="checkbox"
                                                checked={newTds.isInterstate}
                                                onChange={(e) => setNewTds({ ...newTds, isInterstate: e.target.checked })}
                                                className="rounded border duration-100"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Plus size={14} />
                                        {t("Add TDS Record")}
                                    </button>
                                </form>
                            )}

                            {selectedReportId === 'GSTR-8' && (
                                <form onSubmit={handleAddTcsRow} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Operator GSTIN")}</label>
                                        <input
                                            type="text"
                                            placeholder="27AAACI5544B1ZV"
                                            required
                                            value={newTcs.gstin}
                                            onChange={(e) => setNewTcs({ ...newTcs, gstin: e.target.value })}
                                            className="w-full text-xs font-mono font-bold mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-505 text-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Platform Name")}</label>
                                        <input
                                            type="text"
                                            placeholder="Meesho Marketplace Logistics"
                                            required
                                            value={newTcs.name}
                                            onChange={(e) => setNewTcs({ ...newTcs, name: e.target.value })}
                                            className="w-full text-xs mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-505 text-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Gross Sold Value")}</label>
                                        <input
                                            type="number"
                                            placeholder="1450000"
                                            required
                                            value={newTcs.gross}
                                            onChange={(e) => setNewTcs({ ...newTcs, gross: e.target.value })}
                                            className="w-full text-xs font-mono mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-505 text-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-1/2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Returns Credit")}</label>
                                            <input
                                                type="number"
                                                placeholder="90000"
                                                value={newTcs.returned}
                                                onChange={(e) => setNewTcs({ ...newTcs, returned: e.target.value })}
                                                className="w-full text-xs font-mono mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-505 text-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
                                        >
                                            <Plus size={14} />
                                            {t("Add TCS")}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {selectedReportId === 'GST ITC-04' && (
                                <form onSubmit={handleAddItc04Row} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Worker GSTIN")}</label>
                                        <input
                                            type="text"
                                            placeholder="27BBBCY1122D1Z0"
                                            required
                                            value={newItc04.gstin}
                                            onChange={(e) => setNewItc04({ ...newItc04, gstin: e.target.value })}
                                            className="w-full text-xs font-mono font-bold mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-505"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Worker Name")}</label>
                                        <input
                                            type="text"
                                            placeholder="Apex Plating Ltd"
                                            required
                                            value={newItc04.name}
                                            onChange={(e) => setNewItc04({ ...newItc04, name: e.target.value })}
                                            className="w-full text-xs mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-505"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 col-span-2">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Challan No / Item")}</label>
                                            <input
                                                type="text"
                                                placeholder="CH-25-15"
                                                required
                                                value={newItc04.challan}
                                                onChange={(e) => setNewItc04({ ...newItc04, challan: e.target.value })}
                                                className="w-full text-xs mt-1 px-2.5 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-505 placeholder-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Value Sent (₹)")}</label>
                                            <input
                                                type="number"
                                                placeholder="450000"
                                                required
                                                value={newItc04.val}
                                                onChange={(e) => setNewItc04({ ...newItc04, val: e.target.value })}
                                                className="w-full text-xs font-mono font-bold mt-1 px-2.5 py-1.5 border rounded-lg bg-white dark:bg-gray-800 outline-hidden focus:border-indigo-505"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                                    >
                                        <Plus size={14} />
                                        {t("Add Delivery")}
                                    </button>
                                </form>
                            )}

                            {selectedReportId !== 'GSTR-7' && selectedReportId !== 'GSTR-8' && selectedReportId !== 'GST ITC-04' && (
                                <p className="text-xs text-gray-400 font-medium py-1.5">
                                    ℹ️ {t("This standard statutory report configuration references consolidated GST portal statements. Transactions are automatically managed via system databases during closing runs.")}
                                </p>
                            )}
                        </div>

                        {/* Responsive detailed records table list inside popup */}
                        <div className="p-6 overflow-x-auto">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950/50 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        {selectedDetails.headers.map((hdr, idx) => (
                                            <th key={idx} className={`px-4 py-3 font-semibold ${idx > 1 ? 'text-right' : ''}`}>{t(hdr)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {selectedDetails.rows.map((row: any, rIdx: number) => (
                                        <tr key={rIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/55">
                                            {selectedReportId === 'GSTR-7' && (
                                                <>
                                                    <td className="px-4 py-3 font-semibold text-gray-705 dark:text-gray-300">{row.gstin}</td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate font-medium">{t(row.name)}</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(Number(row.gross))}</td>
                                                    <td className="px-4 py-3 text-right text-gray-500 font-bold">{row.rate}</td>
                                                    <td className="px-4 py-3 text-right text-indigo-600 font-extrabold font-mono">
                                                        ₹{formatNumber(Number(row.cgst || row.igst || row.sgst || 0))}
                                                        {row.igst > 0 ? ' (IGST)' : ' (CGST+SGST)'}
                                                    </td>
                                                </>
                                            )}
                                            {selectedReportId === 'GSTR-8' && (
                                                <>
                                                    <td className="px-4 py-3 font-semibold text-gray-705 dark:text-gray-300">{row.gstin}</td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">{t(row.name)}</td>
                                                    <td className="px-4 py-3 text-right font-mono text-gray-500">₹{formatNumber(Number(row.gross))}</td>
                                                    <td className="px-4 py-3 text-right text-rose-500 font-semibold">- ₹{formatNumber(Number(row.returned))}</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(Number(row.net))}</td>
                                                    <td className="px-4 py-3 text-right text-indigo-600 font-extrabold font-mono">₹{formatNumber(Number(row.tcs))}</td>
                                                </>
                                            )}
                                            {selectedReportId === 'GST ITC-04' && (
                                                <>
                                                    <td className="px-4 py-3 font-semibold text-gray-755 dark:text-gray-300">{row.gstin}</td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">{t(row.name)}</td>
                                                    <td className="px-4 py-3 font-mono font-semibold text-gray-500">{row.challan}</td>
                                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{t(row.item)}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-850 dark:text-gray-100 font-mono">₹{formatNumber(Number(row.val))}</td>
                                                    <td className={`px-4 py-3 text-right font-black uppercase text-[10px] tracking-wider`}>
                                                        <span className={`px-2 py-0.5 rounded-md ${
                                                            row.status.includes('Fully') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30' :
                                                            row.status.includes('Partially') ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30' : 'bg-gray-100 text-gray-600 dark:bg-gray-700'
                                                        }`}>
                                                            {t(row.status)}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            {selectedReportId !== 'GSTR-7' && selectedReportId !== 'GSTR-8' && selectedReportId !== 'GST ITC-04' && (
                                                <>
                                                    <td className="px-4 py-3 font-semibold text-gray-750 dark:text-gray-300">{t(row.name)}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-850 dark:text-gray-100 font-mono">₹{formatNumber(Number(row.val))}</td>
                                                    <td className="px-4 py-1.5 text-right text-indigo-600 font-medium font-mono">₹{formatNumber(Number(row.igst))}</td>
                                                    <td className="px-4 py-1.5 text-right text-blue-650 font-medium font-mono">₹{formatNumber(Number(row.cgst))}</td>
                                                    <td className="px-4 py-1.5 text-right text-blue-650 font-medium font-mono">₹{formatNumber(Number(row.sgst))}</td>
                                                    <td className="px-4 py-1.5 text-right text-gray-400 font-mono">₹{formatNumber(Number(row.cess))}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Popup Footer checklist and summary action layout */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-xl dark:bg-gray-900/65 dark:border-gray-750">
                            <div>
                                <h4 className="font-extrabold text-gray-800 text-xs dark:text-gray-200">{t("Statuary Audit Compliance Certificate")}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">{t("All listed entries dynamically recalculate offsets instantly against original monthly voucher entries.")}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">{t(selectedDetails.summary.label)}</p>
                                    <p className="text-base font-extrabold text-indigo-600 font-mono">₹{formatNumber(selectedDetails.summary.value)}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedReportId(null)}
                                    className="px-5 py-2.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-indigo-650 hover:bg-indigo-600 transition duration-150 dark:bg-indigo-600"
                                >
                                    {t("Close Ledger Records")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
