import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info } from 'lucide-react';

interface GSTR3BReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR3BReport: React.FC<GSTR3BReportProps> = ({ useSampleData, onToggleSampleData }) => {
  const { t, formatNumber  } = useLanguage();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/g3b_data.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR3B sample data", err);
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
                        {t("GSTR-3B Report")}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">{t("Monthly Return Data Summary")}</p>
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
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("Taxable Value")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.outward_supplies?.taxable))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("CGST")}</span>
                                <span className="font-medium text-blue-600">₹{formatNumber(Number(data.outward_supplies?.cgst))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("SGST")}</span>
                                <span className="font-medium text-blue-600">₹{formatNumber(Number(data.outward_supplies?.sgst))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("IGST")}</span>
                                <span className="font-medium text-blue-600">₹{formatNumber(Number(data.outward_supplies?.igst))}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">{t("Eligible ITC")}</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("Import Goods")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.eligible_itc?.import_goods))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("Import Services")}</span>
                                <span className="font-medium">₹{formatNumber(Number(data.eligible_itc?.import_services))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t("Inward Supplies")}</span>
                                <span className="font-medium text-emerald-600">₹{formatNumber(Number(data.eligible_itc?.inward_supplies))}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-field-wrapper bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:col-span-2 dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">{t("Payment of Tax")}</h3>
                        <div className="form-grid gap-4">
                            <div className="bg-emerald-50 p-4 rounded-lg flex justify-between items-center border border-emerald-100">
                                <span className="text-sm font-bold text-emerald-800">{t("Paid through ITC")}</span>
                                <span className="text-lg font-black text-emerald-600">₹{formatNumber(Number(data.payment_of_tax?.paid_through_itc))}</span>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg flex justify-between items-center border border-amber-100">
                                <span className="text-sm font-bold text-amber-800">{t("Paid in Cash")}</span>
                                <span className="text-lg font-black text-amber-600">₹{formatNumber(Number(data.payment_of_tax?.paid_in_cash))}</span>
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
