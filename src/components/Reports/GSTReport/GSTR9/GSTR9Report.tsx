import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info } from 'lucide-react';

interface GSTR9ReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR9Report: React.FC<GSTR9ReportProps> = ({ useSampleData, onToggleSampleData }) => {
  const { t, formatNumber  } = useLanguage();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/g9_data.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR9 sample data", err);
                    setLoading(false);
                });
        } else {
            setData(null);
        }
    }, [useSampleData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center dark:text-gray-100">
                        <FileText className="mr-2 text-blue-600" size={20} />
                        {t("GSTR-9 Report")}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">{t("Annual Return Data Summary")}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="form-grid gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">{t("Outward Supplies")}</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("B2C Supplies")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.details_of_outward_supplies?.b2c))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("B2B Supplies")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.details_of_outward_supplies?.b2b))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("Exports")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.details_of_outward_supplies?.exports))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("SEZ Supplies")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.details_of_outward_supplies?.sez))}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">{t("Details of ITC")}</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("Inputs")}</span>
                                <span className="font-medium text-emerald-600">₹{formatNumber(Number(data.details_of_itc?.inputs))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("Capital Goods")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.details_of_itc?.capital_goods))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("Input Services")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.details_of_itc?.input_services))}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-field-wrapper bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:col-span-2 dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">{t("Tax Paid Details")}</h3>
                        <div className="form-grid gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <span className="text-xs font-bold text-blue-400 block mb-1 uppercase tracking-widest">{t("CGST")}</span>
                                <span className="text-sm font-black text-blue-700">₹{formatNumber(Number(data.tax_paid?.cgst))}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <span className="text-xs font-bold text-blue-400 block mb-1 uppercase tracking-widest">{t("SGST")}</span>
                                <span className="text-sm font-black text-blue-700">₹{formatNumber(Number(data.tax_paid?.sgst))}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <span className="text-xs font-bold text-blue-400 block mb-1 uppercase tracking-widest">{t("IGST")}</span>
                                <span className="text-sm font-black text-blue-700">₹{formatNumber(Number(data.tax_paid?.igst))}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <span className="text-xs font-bold text-blue-400 block mb-1 uppercase tracking-widest">{t("CESS")}</span>
                                <span className="text-sm font-black text-blue-700">₹{formatNumber(Number(data.tax_paid?.cess))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                    <Info className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium dark:text-gray-400">{t("No data available. Enable sample data to view the report.")}</p>
                </div>
            )}
        </div>
    );
};
