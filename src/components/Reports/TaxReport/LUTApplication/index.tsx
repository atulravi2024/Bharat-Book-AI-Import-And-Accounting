import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { FileSignature, ShieldAlert, CheckCircle, Clock, FileText, Send, RefreshCw, X, ArrowRight, AlertCircle, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { LutFilingStage } from './types';

export const LUTApplication: React.FC = () => {
  const { t } = useLanguage();

  const [lutFilingStage, setLutFilingStage] = useState<LutFilingStage>('draft');
  const [historyOpen, setHistoryOpen] = useState(true);
  const [lutName, setLutName] = useState('BHARAT BOOK BUREAU EXPORTS');
  const [lutFy, setLutFy] = useState('2025-26');
  const [lutIec, setLutIec] = useState('0316503922');
  const [lutPort, setLutPort] = useState('Nhava Sheva JNPT (INNSA1)');
  const [witness1, setWitness1] = useState('Rajesh Sharma, Director HR');
  const [witness2, setWitness2] = useState('Sanjay Mehta, VP Operations');
  const [lutOtp, setLutOtp] = useState('');
  const [lutArn, setLutArn] = useState('');
  const [banner, setBanner] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const [preFilings, setPreFilings] = useState<Array<{ fy: string; arn: string; date: string; status: string }>>([
    { fy: "2024-25", arn: "LU2704240034292F", date: "2024-04-02", status: "Approved" }
  ]);

  const triggerBanner = (type: 'success' | 'error' | 'info', text: string) => {
    setBanner({ type, text });
    setTimeout(() => setBanner(null), 5000);
  };

  const handleSimulateLutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lutName || !lutIec || !lutPort || !witness1 || !witness2) {
      triggerBanner('error', t("Please fill in all mandatory Letter of Undertaking fields."));
      return;
    }
    // Set signing stage
    setLutFilingStage('signing');
    triggerBanner('success', t("Statutory Form RFD-11 constructed successfully! Awaiting OTP digital verification code."));
  };

  const handleConfirmLutSigning = () => {
    if (!lutOtp) {
      triggerBanner('error', t("Please enter the 4-digit EVC OTP security code."));
      return;
    }

    const randArn = `LUT${lutFy.replace('-', '')}00${Math.floor(100000 + Math.random() * 900000)}B`;
    setLutArn(randArn);
    setLutFilingStage('completed');

    setPreFilings([
      { fy: lutFy, arn: randArn, date: new Date().toISOString().split('T')[0], status: "Approved" },
      ...preFilings
    ]);

    triggerBanner('success', t("Letter of Undertaking (LUT) Form GST RFD-11 approved! Government authorized ARN is {{arn}}.", { arn: randArn }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 flex items-center dark:text-gray-100">
          <FileSignature className="mr-2 text-indigo-600 animate-pulse" size={24} />
          {t("RFD-11 Export Letter of Undertaking (LUT)")}
        </h2>
        <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">
          {t("Submit statutory drafts of LUT (RFD-11) for Zero-Rated exports of books & educational materials, completely exempt from IGST payments.")}
        </p>
      </div>

      {banner && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs animate-fadeIn ${
          banner.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-405' 
            : banner.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-405'
            : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-405'
        }`}>
          {banner.type === 'success' ? <Check className="shrink-0 text-emerald-600" size={16} /> : <AlertCircle className="shrink-0 text-rose-600" size={16} />}
          <span>{banner.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 bg-indigo-50/50 border-b border-gray-100 font-bold text-gray-850 text-xs dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileSignature className="text-indigo-600" size={16} />
            {t("Zero-Rated Export Letter of Undertaking (LUT) Generator - RFD-11")}
          </span>
          <span className="text-[10px] font-black tracking-widest text-[#2f3542] dark:text-gray-405 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded uppercase">
            {t("Rule 96A Compliance")}
          </span>
        </div>

        {lutFilingStage === 'completed' ? (
          <div className="p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-50 rounded-full text-emerald-500 mb-2 dark:bg-emerald-950/20">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-lg font-black text-gray-850 dark:text-gray-100">{t("LUT Application Filed & Approved!")}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-455 leading-relaxed">
              {t("Your statutory Letter of Undertaking (RFD-11) has been verified and stamped by digital signature. Zero-Rated export transactions are now validated under LUT without tax payment obligations.")}
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-3.5 rounded-lg border text-xs font-mono select-all text-center">
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">{t("Government Application Reference (ARN)")}</p>
              <p className="font-extrabold text-indigo-655 dark:text-indigo-400 mt-1">{lutArn}</p>
            </div>
            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => setLutFilingStage('draft')}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 font-extrabold text-xs rounded-lg hover:bg-indigo-100 transition"
              >
                {t("Construct New LUT Draft")}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-150 dark:divide-gray-700">
            {/* Form Inputs (Left) */}
            <form onSubmit={handleSimulateLutSubmit} className="p-6 lg:col-span-5 space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">{t("Application Details Metadata")}</h4>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500">{t("Authorized Exporting Company Name")}</label>
                <input
                  type="text"
                  value={lutName}
                  onChange={(e) => setLutName(e.target.value)}
                  required
                  className="w-full text-xs font-extrabold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 border-slate-200"
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
                    className="w-full text-xs font-mono mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500">{t("Target Financial Year")}</label>
                  <select
                    value={lutFy}
                    onChange={(e) => setLutFy(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2.5 border rounded-lg focus:border-indigo-500 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 font-bold border-slate-200"
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
                  className="w-full text-xs mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 block">{t("Signatory Witnesses (Minimum Two Required)")}</label>
                <input
                  type="text"
                  placeholder="Witness 1 name & designation"
                  value={witness1}
                  onChange={(e) => setWitness1(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-1.5 border rounded-lg focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 border-slate-200"
                />
                <input
                  type="text"
                  placeholder="Witness 2 name & designation"
                  value={witness2}
                  onChange={(e) => setWitness2(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-1.5 border rounded-lg focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 border-slate-200"
                />
              </div>

              {lutFilingStage === 'signing' ? (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 space-y-3 dark:bg-amber-950/20 dark:border-amber-900/30">
                  <div className="flex gap-2 text-amber-800 dark:text-amber-400">
                    <ShieldAlert size={18} className="flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-extrabold">{t("Awaiting OTP Authentication Signature")}</p>
                      <p className="text-[10px] mt-0.5">{t("An OTP security code has been routed to registered mobile/email." )}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type OTP Code (e.g. 9934)"
                      value={lutOtp}
                      onChange={(e) => setLutOtp(e.target.value)}
                      className="w-full text-xs text-center font-bold px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmLutSigning}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
                    >
                      {t("Verify")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send size={13} />
                  {t("File Form RFD-11 Export LUT")}
                </button>
              )}
            </form>

            {/* Legal Draft View (Right) */}
            <div className="p-6 lg:col-span-7 bg-gray-50/50 dark:bg-gray-901 space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-404 tracking-wider">{t("Formatted Legal Under-Taking Draft Preview (RFD-11)")}</h4>
              <div className="p-6 bg-white border dark:bg-gray-900 dark:border-gray-750 font-serif text-[11px] text-gray-805 leading-relaxed space-y-4 shadow-xs rounded-xl max-h-[460px] overflow-y-auto custom-scrollbar relative select-text">
                <div className="text-center font-bold text-sm uppercase tracking-wider underline border-b pb-3 mb-4">
                  {t("FORM GST RFD-11")} <br />
                  <span className="text-[10px] font-normal italic lowercase">{t("[See rule 96A]")}</span> <br />
                  {t("Letter of Undertaking for Export of Goods u/s Section 16")}
                </div>

                <p>
                  To: <br />
                  <strong>The President of India</strong> (acting through the Jurisdictional GST Commissioner).
                </p>

                <p>
                  We, <strong>{lutName || '[Company Name]'}</strong> holding valid Importer Exporter Code <strong>{lutIec || '[IEC Code]'}</strong>, hereby stand declared, bound and contractually committed to the Government for the Financial Year <strong>FY {lutFy}</strong> for dispatch of educational literatures, book publications, and scholastic materials through <strong>{lutPort || '[Principal Customs Port]'}</strong> without payment of IGST under Rule 96A.
                </p>

                <p className="font-bold underline">
                  We solemnly declare and undertake that:
                </p>

                <p>
                  1. All items, books, and scientific journals dispatched under zero-ratings shall be fully exported within three months from the issue date of individual invoice bills of lading. <br />
                  2. In failure of compliance, we bind ourselves to deposit the entire tax liability along with 18% statutory interest within fifteen days of expiration.
                </p>

                <div className="pt-4 border-t space-y-1 font-sans">
                  <p className="font-bold text-gray-500 uppercase text-[9px] tracking-wider">{t("Designated Witness Declarations:")}</p>
                  <p>1. Witness One: <span className="font-bold italic text-indigo-600">{witness1 || t("Undefinded")}</span></p>
                  <p>2. Witness Two: <span className="font-bold italic text-indigo-600">{witness2 || t("Undefinded")}</span></p>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400 font-sans border-t mt-4">
                  <span>SYSTEM DRAFT PREVIEW</span>
                  <span>IP AUTHENTICATED: SECURE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historical Logs of Approved LUTs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700 animate-fadeIn">
        <div 
          onClick={() => setHistoryOpen(!historyOpen)}
          className="p-4 bg-gray-50 border-b border-slate-200 font-black text-gray-700 text-[10.5px] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 uppercase tracking-widest flex justify-between items-center cursor-pointer select-none hover:bg-gray-100/50 transition-colors"
        >
          <span>{t("Approved RFD-11 Letters of Undertaking History")}</span>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-705 px-2 py-0.5 rounded text-[10px] uppercase font-bold dark:bg-emerald-950/20 dark:text-emerald-400">
              {preFilings.length} {t("Active")}
            </span>
            <span className="text-gray-400">
              {historyOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
          </div>
        </div>
        
        {historyOpen && (
          <div className="overflow-x-auto animate-fadeIn">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-[#f8fafc] text-gray-500 border-b border-slate-205 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t("Filing Period Year")}</th>
                  <th className="px-5 py-3 font-semibold">{t("Government Issued ARN")}</th>
                  <th className="px-5 py-3 font-semibold">{t("Submission Approved Date")}</th>
                  <th className="px-5 py-3 text-center font-semibold">{t("Filing Status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                {preFilings.map((f, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-bold text-gray-850 dark:text-white">FY {f.fy}</td>
                    <td className="px-5 py-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{f.arn}</td>
                    <td className="px-5 py-3.5 text-gray-500 font-mono">{f.date}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 rounded font-black uppercase text-[10px] tracking-wider">{t(f.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
