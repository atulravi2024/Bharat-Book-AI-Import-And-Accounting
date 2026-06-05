import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
  FileText, Loader2, Info, CheckCircle, Clock, AlertCircle, X, Search, Filter, 
  Plus, CornerDownRight, Trash2, Layers 
} from 'lucide-react';
import { TdsRow, TcsRow, Itc04Row, Cmp08Row, ReportItem, ComplianceRegistriesProps } from './types';

export const ComplianceRegistries: React.FC<ComplianceRegistriesProps> = ({ useSampleData }) => {
  const { t, formatNumber } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Filed' | 'Pending'>('All');

  // Dynamic state stores for records so the user can interactively add logs!
  const [tdsRows, setTdsRows] = useState<TdsRow[]>([
    { id: 1, gstin: "27AAACW8823F1Z6", name: "Maharashtra State Electricity Board", gross: 1250000, rate: "2%", cgst: 12500, sgst: 12500, igst: 0 },
    { id: 2, gstin: "27AAACG4344D1Z2", name: "Pune Municipal Corporation", gross: 850000, rate: "2%", cgst: 8500, sgst: 8500, igst: 0 },
    { id: 3, gstin: "07AAACB1114A2ZP", name: "Delhi Urban Water Board Office", gross: 450000, rate: "2%", cgst: 0, sgst: 0, igst: 9000 }
  ]);

  const [tcsRows, setTcsRows] = useState<TcsRow[]>([
    { id: 1, gstin: "27AAACI5544B1ZV", name: "Amazon Retail India Pvt Ltd", gross: 2450000, returned: 150000, net: 2300000, tcs: 23000 },
    { id: 2, gstin: "27AAACF8833E1ZH", name: "Flipkart Wholesale Commerce", gross: 1850000, returned: 200000, net: 1650000, tcs: 16500 },
    { id: 3, gstin: "27BBBCS4411C2ZX", name: "Tata CLiQ Enterprise Division", gross: 920000, returned: 40000, net: 880000, tcs: 8800 }
  ]);

  const [itc04Rows, setItc04Rows] = useState<Itc04Row[]>([
    { id: 1, gstin: "27BBBCY1122D1Z0", name: "Vikas Engineering Workshops", challan: "CH-25-01", item: "Sheet Metal Press Castings", val: 1250000, status: "Returned Fully" },
    { id: 2, gstin: "27AAACG4433E1ZM", name: "Supreme Thermal Platers Ltd", challan: "CH-25-05", item: "Raw Steel Billets Coated", val: 950000, status: "Partially Returned (80%)" },
    { id: 3, gstin: "27CCCDK7755F2Z4", name: "Rathi Extrusions and Packers", challan: "CH-25-09", item: "Packaging Cardboards", val: 340000, status: "In Transit" }
  ]);

  const [cmp08Rows, setCmp08Rows] = useState<Cmp08Row[]>([
    { id: 1, name: "Outward taxable supplies (including exempt volume)", val: 1850000, igst: 0, cgst: 18550, sgst: 18550, cess: 0 },
    { id: 2, name: "Inward supplies attracting tax liable to Reverse Charge (RCM)", val: 150000, igst: 0, cgst: 3750, sgst: 3750, cess: 0 }
  ]);

  // Add entry local form states
  const [newTds, setNewTds] = useState({ gstin: '', name: '', gross: '', isInterstate: false });
  const [newTcs, setNewTcs] = useState({ gstin: '', name: '', gross: '', returned: '' });
  const [newItc04, setNewItc04] = useState({ gstin: '', name: '', challan: '', item: '', val: '', status: 'In Transit' });

  const [reportsList, setReportsList] = useState<ReportItem[]>([
    { id: "GSTR-7", name: "GST TDS Compliance Register", due_date: "10th of upcoming month", status: "Filed" },
    { id: "GSTR-8", name: "GST TCS Marketplace Register", due_date: "10th of upcoming month", status: "Filed" },
    { id: "GST ITC-04", name: "Job Work Dispatch Statement", due_date: "25th of quarter end", status: "Filed" },
    { id: "CMP-08", name: "Quarterly Composition return Scheme", due_date: "18th of quarter end", status: "Filed" }
  ]);

  useEffect(() => {
    if (useSampleData) {
      setLoading(true);
      fetch('/sample-data/reports/others.json')
        .then(res => res.json())
        .then(res => {
          if (res && res.reports) {
            setReportsList(res.reports);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load Compliance Registries sample data", err);
          setLoading(false);
        });
    } else {
      setReportsList([
        { id: "GSTR-7", name: "GST TDS Compliance Register", due_date: "10th of upcoming month", status: "Pending" },
        { id: "GSTR-8", name: "GST TCS Marketplace Register", due_date: "10th of upcoming month", status: "Pending" },
        { id: "GST ITC-04", name: "Job Work Dispatch Statement", due_date: "25th of quarter end", status: "Pending" },
        { id: "CMP-08", name: "Quarterly Composition return Scheme", due_date: "18th of quarter end", status: "Pending" }
      ]);
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

  const getReportDetails = (id: string) => {
    switch (id) {
      case 'GSTR-7':
        const tdsTotal = tdsRows.reduce((acc, cur) => acc + cur.cgst + cur.sgst + cur.igst, 0);
        return {
          id: 'GSTR-7',
          title: t('GSTR-7 Return Details (TDS Ledger)'),
          desc: t('Details of Tax Deducted at Source (TDS) by government agencies, bodies, or authorities.'),
          headers: [t('Deductee GSTIN'), t('Deductee Corporate Name'), t('Total Gross Value'), t('TDS Rate'), t('TDS Amount Deducted (Integrated / Central / State)')],
          rows: tdsRows,
          summary: { label: t("Total TDS Net Balance"), value: tdsTotal }
        };
      case 'GSTR-8':
        const tcsTotal = tcsRows.reduce((acc, cur) => acc + cur.tcs, 0);
        return {
          id: 'GSTR-8',
          title: t('GSTR-8 Return Details (TCS E-Commerce Ledger)'),
          desc: t('Details of Tax Collected at Source (TCS) on supplies channeled through major online e-commerce platforms.'),
          headers: [t('Operator GSTIN'), t('E-Commerce Platform Name'), t('Gross Supplies Sold'), t('Value of Returns'), t('Net Taxable Supplies'), t('TCS Collected (1%)')],
          rows: tcsRows,
          summary: { label: t("Total TCS Received"), value: tcsTotal }
        };
      case 'GST ITC-04':
        const itc04Total = itc04Rows.reduce((acc, cur) => acc + cur.val, 0);
        return {
          id: 'GST ITC-04',
          title: t('GST ITC-04 Return Details (Job Work Tracker)'),
          desc: t('Quarterly statement for raw materials or capital goods dispatched to subcontractors for processing stages.'),
          headers: [t('Job Worker GSTIN'), t('Job Worker Name'), t('Challan No'), t('Items Sent'), t('Total Value Sent'), t('Current Status / Returned')],
          rows: itc04Rows,
          summary: { label: t("Total Asset Value Distributed"), value: itc04Total }
        };
      default:
        const cmpTotal = cmp08Rows.reduce((acc, cur) => acc + cur.cgst + cur.sgst + cur.igst, 0);
        return {
          id: 'CMP-08',
          title: t('CMP-08 Output Details (Composition Return Scheme)'),
          desc: t('Quarterly payment ledger statement for composition dealers filing simplified self-assessed tax ratios.'),
          headers: [t('Nature of Supplies'), t('Total Value'), t('IGST Balance'), t('CGST Ratio Balance'), t('SGST Ratio Balance'), t('Cess Ratio')],
          rows: cmp08Rows,
          summary: { label: t("Total Composition Self-Assessed Payable"), value: cmpTotal }
        };
    }
  };

  const selectedDetails = selectedReportId ? getReportDetails(selectedReportId) : null;

  const handleAddTdsRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTds.gstin || !newTds.name || !newTds.gross) return;
    const grossValue = Number(newTds.gross);
    const ratePct = 2; // Fixed general TDS rate
    const gstDeducted = grossValue * (ratePct / 100);

    const newEntry: TdsRow = {
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
    const tcsDeduction = netValue * 0.01; // 1% net TCS rate

    const newEntry: TcsRow = {
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

    const newEntry: Itc04Row = {
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

  const handleDeleteRow = (type: string, id: number) => {
    if (type === 'GSTR-7') {
      setTdsRows(tdsRows.filter(r => r.id !== id));
    } else if (type === 'GSTR-8') {
      setTcsRows(tcsRows.filter(r => r.id !== id));
    } else if (type === 'GST ITC-04') {
      setItc04Rows(itc04Rows.filter(r => r.id !== id));
    }
  };

  const filteredReports = reportsList.filter(item => {
    const matchesQuery = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-xs dark:bg-gray-800 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-800 flex items-center dark:text-gray-100">
          <Layers className="mr-2 text-indigo-600" size={24} />
          {t("Auxiliary Statutory Compliance Registries")}
        </h2>
        <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">
          {t("Audit GSTR-7 (TDS), GSTR-8 (TCS), ITC-04 (Job Work), and CMP-08 quarterly registries with live transactional entry logs.")}
        </p>
      </div>

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
          {(['All', 'Filed', 'Pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border transition-all ${statusFilter === st ? 'bg-indigo-50/60 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-400' : 'bg-transparent border-gray-100 text-gray-405 hover:text-gray-600 dark:border-transparent dark:hover:text-gray-200'}`}
            >
              {t(st)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
          <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
          <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-750 text-xs dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200 uppercase tracking-widest flex justify-between items-center">
            <span>{t("Statutory Compliance Registries")}</span>
            <span className="text-[10px] font-black tracking-widest text-[#2f3542] dark:text-gray-405 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
              {filteredReports.length} {t("REPORTS")}
            </span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredReports.map((report, i) => (
              <div key={i} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors dark:hover:bg-gray-700/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md dark:bg-indigo-950/40 dark:text-indigo-400">{report.id}</span>
                  <h4 className="font-bold text-gray-800 mt-1 dark:text-gray-100 text-sm">{t(report.name)}</h4>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  <div className="flex items-center">
                    <span className="text-[10px] font-bold text-gray-400 w-24 uppercase tracking-widest dark:text-gray-550">{t("Due Date:")}</span>
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-105">{t(report.due_date) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center w-32">
                    {getStatusIcon(report.status)}
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      report.status === 'Filed' ? 'text-emerald-700 dark:text-emerald-450' :
                      report.status === 'Pending' ? 'text-amber-700 dark:text-amber-450' : 'text-gray-650'
                    }`}>
                      {t(report.status)}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedReportId(report.id)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors dark:bg-gray-900 dark:text-indigo-400 dark:hover:bg-gray-750"
                  >
                    {t("View Audits")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-101 shadow-sm dark:bg-gray-800 dark:border-gray-800">
          <Info className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium dark:text-gray-400">{t("No return items found. Adjust filters.")}</p>
        </div>
      )}

      {/* Expanded Detailed Audit Dialog */}
      {selectedDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xl dark:bg-gray-800 dark:border-gray-750 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-755 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-base">{selectedDetails.title}</h3>
                  <p className="text-xs text-gray-505 dark:text-gray-400 mt-1">{selectedDetails.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReportId(null)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:text-gray-500 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <div className="overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-805">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-950/40 text-gray-500 font-bold border-b">
                    <tr>
                      {selectedDetails.headers.map((h, i) => (
                        <th key={i} className="px-4 py-3">{h}</th>
                      ))}
                      {['GSTR-7', 'GSTR-8', 'GST ITC-04'].includes(selectedDetails.id) && (
                        <th className="px-4 py-3 text-center">{t("Actions")}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                    {selectedDetails.rows.map((row: any) => (
                      <tr key={row.id} className="hover:bg-gray-10/40 dark:hover:bg-gray-900/30">
                        {selectedDetails.id === 'GSTR-7' && (
                          <>
                            <td className="px-4 py-3.5 font-bold font-mono text-gray-800 dark:text-white">{row.gstin}</td>
                            <td className="px-4 py-3.5 font-medium text-gray-700 dark:text-gray-250 truncate max-w-xs">{row.name}</td>
                            <td className="px-4 py-3.5 font-mono">₹{formatNumber(row.gross)}</td>
                            <td className="px-4 py-3.5"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-705 dark:bg-indigo-950/30 dark:text-indigo-400 rounded text-[10px] font-bold">{row.rate}</span></td>
                            <td className="px-4 py-3.5 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                              {row.igst > 0 ? `IGST ₹${formatNumber(row.igst)}` : `CGST ₹${formatNumber(row.cgst)} + SGST ₹${formatNumber(row.sgst)}`}
                            </td>
                          </>
                        )}
                        {selectedDetails.id === 'GSTR-8' && (
                          <>
                            <td className="px-4 py-3.5 font-bold font-mono text-gray-800 dark:text-white">{row.gstin}</td>
                            <td className="px-4 py-3.5 font-medium text-gray-700 dark:text-gray-250 truncate max-w-xs">{row.name}</td>
                            <td className="px-4 py-3.5 font-mono">₹{formatNumber(row.gross)}</td>
                            <td className="px-4 py-3.5 text-rose-500 font-mono">-₹{formatNumber(row.returned)}</td>
                            <td className="px-4 py-3.5 font-mono font-bold">₹{formatNumber(row.net)}</td>
                            <td className="px-4 py-3.5 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">₹{formatNumber(row.tcs)}</td>
                          </>
                        )}
                        {selectedDetails.id === 'GST ITC-04' && (
                          <>
                            <td className="px-4 py-3.5 font-bold font-mono text-gray-800 dark:text-white">{row.gstin}</td>
                            <td className="px-4 py-3.5 font-medium text-gray-700 dark:text-gray-250 truncate max-w-xs">{row.name}</td>
                            <td className="px-4 py-3.5 font-bold font-mono text-indigo-650 dark:text-indigo-400">{row.challan}</td>
                            <td className="px-4 py-3.5 font-medium text-gray-500">{row.item}</td>
                            <td className="px-4 py-3.5 font-mono font-bold">₹{formatNumber(row.val)}</td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                                row.status.includes('Fully') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' :
                                row.status.includes('Partially') ? 'bg-amber-50 text-amber-705 dark:bg-amber-950/20' : 'bg-gray-100 text-gray-500'
                              }`}>{row.status}</span>
                            </td>
                          </>
                        )}
                        {selectedDetails.id === 'CMP-08' && (
                          <>
                            <td className="px-4 py-3.5 font-bold text-gray-700 dark:text-gray-200">{row.name}</td>
                            <td className="px-4 py-3.5 font-mono font-bold">₹{formatNumber(row.val)}</td>
                            <td className="px-4 py-3.5 font-mono text-gray-500">₹{formatNumber(row.igst)}</td>
                            <td className="px-4 py-3.5 font-mono text-indigo-650 dark:text-indigo-400">₹{formatNumber(row.cgst)}</td>
                            <td className="px-4 py-3.5 font-mono text-indigo-650 dark:text-indigo-400">₹{formatNumber(row.sgst)}</td>
                            <td className="px-4 py-3.5 font-mono text-gray-500">₹{formatNumber(row.cess)}</td>
                          </>
                        )}

                        {['GSTR-7', 'GSTR-8', 'GST ITC-04'].includes(selectedDetails.id) && (
                          <td className="px-4 py-3.5 text-center">
                            <button 
                              onClick={() => handleDeleteRow(selectedDetails.id, row.id)}
                              className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition"
                              title={t("Delete statement record entry")}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic live input fields form in selected ledger popup */}
              {selectedDetails.id === 'GSTR-7' && (
                <form onSubmit={handleAddTdsRow} className="bg-gray-50/55 p-5 rounded-xl border dark:bg-gray-900/40 dark:border-gray-750 space-y-4">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-xs">
                    <Plus size={14} />
                    <span>{t("Add New Deductee Record to Active Session GSTR-7")}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Deductee GSTIN")}</label>
                      <input
                        type="text"
                        placeholder="e.g. 27AAACW8823F1Z6"
                        value={newTds.gstin}
                        onChange={(e) => setNewTds({ ...newTds, gstin: e.target.value })}
                        required
                        className="w-full text-xs font-mono px-3 py-1.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Corporate Name")}</label>
                      <input
                        type="text"
                        placeholder="e.g. Power Corporation"
                        value={newTds.name}
                        onChange={(e) => setNewTds({ ...newTds, name: e.target.value })}
                        required
                        className="w-full text-xs px-3 py-1.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Gross Supplies (₹)")}</label>
                      <input
                        type="number"
                        placeholder="Gross Amount"
                        value={newTds.gross}
                        onChange={(e) => setNewTds({ ...newTds, gross: e.target.value })}
                        required
                        className="w-full text-xs font-mono px-3 py-1.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div className="flex items-end gap-3 justify-between">
                      <div className="flex items-center gap-1.5 py-2 select-none">
                        <input
                          type="checkbox"
                          id="newTdsJurisdiction"
                          checked={newTds.isInterstate}
                          onChange={(e) => setNewTds({ ...newTds, isInterstate: e.target.checked })}
                          className="rounded border"
                        />
                        <label htmlFor="newTdsJurisdiction" className="text-[10.5px] font-bold text-gray-550">{t("Inter-State (IGST 2%)")}</label>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus size={13} />
                        {t("Insert")}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {selectedDetails.id === 'GSTR-8' && (
                <form onSubmit={handleAddTcsRow} className="bg-gray-50/55 p-5 rounded-xl border dark:bg-gray-900/40 dark:border-gray-750 space-y-4">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-xs">
                    <Plus size={14} />
                    <span>{t("Add New Operator Record to Active Session GSTR-8")}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Operator GSTIN")}</label>
                      <input
                        type="text"
                        placeholder="e.g. 27AAACI5544B1ZV"
                        value={newTcs.gstin}
                        onChange={(e) => setNewTcs({ ...newTcs, gstin: e.target.value })}
                        required
                        className="w-full text-xs font-mono px-3 py-1.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("E-Commerce Portal Marketplace")}</label>
                      <input
                        type="text"
                        placeholder="e.g. JioMart Wholesale"
                        value={newTcs.name}
                        onChange={(e) => setNewTcs({ ...newTcs, name: e.target.value })}
                        required
                        className="w-full text-xs px-3 py-1.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Gross Value Sold (₹)")}</label>
                      <input
                        type="number"
                        placeholder="Gross Sales"
                        value={newTcs.gross}
                        onChange={(e) => setNewTcs({ ...newTcs, gross: e.target.value })}
                        required
                        className="w-full text-xs font-mono px-3 py-1.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500">{t("Returns (₹)")}</label>
                        <input
                          type="number"
                          placeholder="Returns Value"
                          value={newTcs.returned}
                          onChange={(e) => setNewTcs({ ...newTcs, returned: e.target.value })}
                          className="w-full text-xs font-mono px-3 py-1.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus size={13} />
                        {t("Insert")}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {selectedDetails.id === 'GST ITC-04' && (
                <form onSubmit={handleAddItc04Row} className="bg-gray-50/55 p-5 rounded-xl border dark:bg-gray-900/40 dark:border-gray-750 space-y-4">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-xs">
                    <Plus size={14} />
                    <span>{t("Add Job Work Dispatch Challan Entries")}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Worker GSTIN")}</label>
                      <input
                        type="text"
                        placeholder="GSTIN"
                        value={newItc04.gstin}
                        onChange={(e) => setNewItc04({ ...newItc04, gstin: e.target.value })}
                        required
                        className="w-full text-xs font-mono px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Worker Corporate Name")}</label>
                      <input
                        type="text"
                        placeholder="Name"
                        value={newItc04.name}
                        onChange={(e) => setNewItc04({ ...newItc04, name: e.target.value })}
                        required
                        className="w-full text-xs px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Challan No")}</label>
                      <input
                        type="text"
                        placeholder="CH-25-X"
                        value={newItc04.challan}
                        onChange={(e) => setNewItc04({ ...newItc04, challan: e.target.value })}
                        required
                        className="w-full text-xs font-mono px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Dispatched Items Specification")}</label>
                      <input
                        type="text"
                        value={newItc04.item}
                        onChange={(e) => setNewItc04({ ...newItc04, item: e.target.value })}
                        required
                        placeholder="Material details"
                        className="w-full text-xs px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">{t("Challan Material value (₹)")}</label>
                      <input
                        type="number"
                        value={newItc04.val}
                        onChange={(e) => setNewItc04({ ...newItc04, val: e.target.value })}
                        required
                        className="w-full text-xs font-mono px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                      />
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500">{t("Consigned Status")}</label>
                        <select
                          value={newItc04.status}
                          onChange={(e) => setNewItc04({ ...newItc04, status: e.target.value })}
                          className="w-full text-xs px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 font-bold"
                        >
                          <option value="In Transit">{t("In Transit")}</option>
                          <option value="Partially Returned (50%)">{t("Partially Returned (50%)")}</option>
                          <option value="Returned Fully">{t("Returned Fully")}</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus size={13} />
                        {t("Insert")}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="bg-indigo-50/50 p-4 rounded-xl border flex justify-between items-center dark:bg-indigo-950/20 dark:border-indigo-950">
                <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider">{selectedDetails.summary.label}:</span>
                <span className="text-lg font-mono font-black text-indigo-700 dark:text-indigo-300">₹{formatNumber(selectedDetails.summary.value)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
