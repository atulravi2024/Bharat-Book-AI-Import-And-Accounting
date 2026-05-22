import React, { useState } from 'react';
import { NotificationsIcon } from '../icons/IconComponents';

interface AlertChannelProps {
    toggles: {
        // In-App
        inApp_dailyAlerts: boolean;
        inApp_weeklyAnalysis: boolean;
        inApp_systemUpdateAlerts: boolean;
        inApp_stockThresholdAlerts: boolean;
        inApp_paymentOverdueAlerts: boolean;
        inApp_largeTransactionAlerts: boolean;
        inApp_unmappedAlerts: boolean;
        inApp_securityLoginAlerts: boolean;
        inApp_gstFilingReminders: boolean;
        inApp_incomeTaxReminders: boolean;
        inApp_bankSyncErrors: boolean;
        inApp_approvalRequests: boolean;
        inApp_dataAnomalyAlerts: boolean;
        inApp_taxComplianceAlerts: boolean;
        inApp_budgetUtilizationAlerts: boolean;
        inApp_cashflowAlerts: boolean;
        
        // Email
        email_dailyAlerts: boolean;
        email_weeklyAnalysis: boolean;
        email_systemUpdateAlerts: boolean;
        email_stockThresholdAlerts: boolean;
        email_paymentOverdueAlerts: boolean;
        email_largeTransactionAlerts: boolean;
        email_unmappedAlerts: boolean;
        email_securityLoginAlerts: boolean;
        email_gstFilingReminders: boolean;
        email_incomeTaxReminders: boolean;
        email_bankSyncErrors: boolean;
        email_approvalRequests: boolean;
        email_dataAnomalyAlerts: boolean;
        email_taxComplianceAlerts: boolean;
        email_budgetUtilizationAlerts: boolean;
        email_cashflowAlerts: boolean;
        
        // SMS
        sms_dailyAlerts: boolean;
        sms_weeklyAnalysis: boolean;
        sms_systemUpdateAlerts: boolean;
        sms_stockThresholdAlerts: boolean;
        sms_paymentOverdueAlerts: boolean;
        sms_largeTransactionAlerts: boolean;
        sms_unmappedAlerts: boolean;
        sms_securityLoginAlerts: boolean;
        sms_gstFilingReminders: boolean;
        sms_incomeTaxReminders: boolean;
        sms_bankSyncErrors: boolean;
        sms_approvalRequests: boolean;
        sms_dataAnomalyAlerts: boolean;
        sms_taxComplianceAlerts: boolean;
        sms_budgetUtilizationAlerts: boolean;
        sms_cashflowAlerts: boolean;
        
        // WhatsApp
        whatsapp_dailyAlerts: boolean;
        whatsapp_weeklyAnalysis: boolean;
        whatsapp_systemUpdateAlerts: boolean;
        whatsapp_stockThresholdAlerts: boolean;
        whatsapp_paymentOverdueAlerts: boolean;
        whatsapp_largeTransactionAlerts: boolean;
        whatsapp_unmappedAlerts: boolean;
        whatsapp_securityLoginAlerts: boolean;
        whatsapp_gstFilingReminders: boolean;
        whatsapp_incomeTaxReminders: boolean;
        whatsapp_bankSyncErrors: boolean;
        whatsapp_approvalRequests: boolean;
        whatsapp_dataAnomalyAlerts: boolean;
        whatsapp_taxComplianceAlerts: boolean;
        whatsapp_budgetUtilizationAlerts: boolean;
        whatsapp_cashflowAlerts: boolean;

        // Telegram
        telegram_dailyAlerts: boolean;
        telegram_weeklyAnalysis: boolean;
        telegram_systemUpdateAlerts: boolean;
        telegram_stockThresholdAlerts: boolean;
        telegram_paymentOverdueAlerts: boolean;
        telegram_largeTransactionAlerts: boolean;
        telegram_unmappedAlerts: boolean;
        telegram_securityLoginAlerts: boolean;
        telegram_gstFilingReminders: boolean;
        telegram_incomeTaxReminders: boolean;
        telegram_bankSyncErrors: boolean;
        telegram_approvalRequests: boolean;
        telegram_dataAnomalyAlerts: boolean;
        telegram_taxComplianceAlerts: boolean;
        telegram_budgetUtilizationAlerts: boolean;
        telegram_cashflowAlerts: boolean;
        
        [key: string]: any; // Allow other toggles implicitly
    };
    handleToggle: (key: any) => void;
}

export const AlertChannel: React.FC<AlertChannelProps> = ({ toggles, handleToggle }) => {
    const [subTab, setSubTab] = useState<'inApp' | 'email' | 'sms' | 'whatsapp' | 'telegram'>('inApp');

    const renderToggle = (prefix: string, key: string, title: string, subtitle: string) => {
        const fullKey = `${prefix}_${key}`;
        const isActive = !!toggles[fullKey as keyof typeof toggles];
        return (
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                <div>
                    <p className="font-bold text-gray-900 text-sm dark:text-white">{title}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1 dark:text-gray-400">{subtitle}</p>
                </div>
                <div onClick={() => handleToggle(fullKey)} className={`${isActive ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer shadow-inner transition-all flex-shrink-0`}>
                    <div className={`bg-white w-3 h-3 rounded-full absolute top-1 ${isActive ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-premium-slate-100 relative dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center dark:text-white">
                <NotificationsIcon className="mr-3 text-blue-600" /> Notification Rules & Channels
            </h3>
            
            {/* Sub Tabs */}
            <div className="flex space-x-2 border-b border-gray-100 dark:border-gray-700 mb-6 pb-2 overflow-x-auto custom-scrollbar">
                <button 
                    onClick={() => setSubTab('inApp')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${subTab === 'inApp' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                    In-App
                </button>
                <button 
                    onClick={() => setSubTab('email')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${subTab === 'email' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                    Email
                </button>
                <button 
                    onClick={() => setSubTab('sms')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${subTab === 'sms' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                    SMS
                </button>
                <button 
                    onClick={() => setSubTab('whatsapp')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${subTab === 'whatsapp' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                    WhatsApp
                </button>
                <button 
                    onClick={() => setSubTab('telegram')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${subTab === 'telegram' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                    Telegram
                </button>
            </div>

            {/* Provider Info per channel */}
            {subTab === 'email' && (
                <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Free Email Plan</p>
                    <p className="text-xs text-blue-800/80 dark:text-blue-400/80 leading-relaxed">
                        For Indian users, the system can utilize the free tier of providers like Resend or SendGrid (100 free daily emails). Alternatively, configure your own Gmail/SMTP for a 100% free solution.
                    </p>
                </div>
            )}
            {subTab === 'sms' && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">Free SMS Plan</p>
                    <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                        We support MSG91 or Fast2SMS for enterprise use. For an "Always Free" plan, you can integrate the "SMSGateway.me" app to route texts safely through your personal Android device's mobile plan at zero marginal cost.
                    </p>
                </div>
            )}
            {subTab === 'whatsapp' && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                    <p className="text-sm font-bold text-green-900 dark:text-green-300 mb-1">Free WhatsApp Plan</p>
                    <p className="text-xs text-green-800/80 dark:text-green-400/80 leading-relaxed">
                        Leverage the official "WhatsApp Cloud API" (Meta). It provisions 1,000 free service-tier messages every month for business support conversations, which easily handles standard use cases in India for free.
                    </p>
                </div>
            )}
            {subTab === 'telegram' && (
                <div className="mb-6 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800">
                    <p className="text-sm font-bold text-cyan-900 dark:text-cyan-300 mb-1">Free Telegram Plan</p>
                    <p className="text-xs text-cyan-800/80 dark:text-cyan-400/80 leading-relaxed">
                        Telegram provides a 100% free Bot API. By using the Telegram Bot API, you can send unlimited messages, alerts, and summaries to your business groups or personal numbers without any cost.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System & Operational Alerts */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2 dark:text-gray-400 dark:border-gray-700">System & Operations</h4>
                    {renderToggle(subTab, 'dailyAlerts', 'Daily Summary Alerts', 'Receive a morning digest of imported vouchers and ledger entries.')}
                    {renderToggle(subTab, 'weeklyAnalysis', 'Weekly Deep Analysis', 'Summarized financial growth metrics and activity for the past week.')}
                    {renderToggle(subTab, 'systemUpdateAlerts', 'System & Backup', 'Instant notifications for data backup status and application updates.')}
                    {renderToggle(subTab, 'bankSyncErrors', 'Bank Sync Errors', 'Alerts when auto-syncing with connected bank accounts fails.')}
                </div>

                {/* Financial & Inventory Alerts */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2 dark:text-gray-400 dark:border-gray-700">Financial & Inventory</h4>
                    {renderToggle(subTab, 'budgetUtilizationAlerts', 'Budget Utilization', 'Alerts when expenses exceed a certain threshold of allocated budgets.')}
                    {renderToggle(subTab, 'cashflowAlerts', 'Cash Flow & Balances', 'Get notified of critically low bank balances or abnormally high cash retention.')}
                    {renderToggle(subTab, 'stockThresholdAlerts', 'Low Stock Threshold', 'Triggers when a tracked item drops below its defined safety limit.')}
                    {renderToggle(subTab, 'largeTransactionAlerts', 'Large Transaction', 'Notifications for abnormally high value vouchers or transactions.')}
                </div>

                {/* Automation & Compliance Alerts */}
                <div className="space-y-4 md:col-span-2 mt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2 dark:text-gray-400 dark:border-gray-700">Automation & Compliance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderToggle(subTab, 'gstFilingReminders', 'GST Filing Reminders', 'Automated reminders for impending GST filing due dates.')}
                        {renderToggle(subTab, 'incomeTaxReminders', 'Income Tax & Advance Tax', 'Reminders for Advance Tax installments and Income Tax Return filing due dates.')}
                        {renderToggle(subTab, 'taxComplianceAlerts', 'Tax Compliance', 'Alerts for e-Invoice generation failures and TDS/TCS threshold limits.')}
                        {renderToggle(subTab, 'paymentOverdueAlerts', 'Payment Overdue', 'Alerts for customers with outstanding and late invoice payments.')}
                    </div>
                </div>

                {/* Security & Data Alerts */}
                <div className="space-y-4 md:col-span-2 mt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2 dark:text-gray-400 dark:border-gray-700">Security & Data</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderToggle(subTab, 'unmappedAlerts', 'Unmapped Vendor', 'Triggers when unknown or new vendors are found during standard imports.')}
                        {renderToggle(subTab, 'dataAnomalyAlerts', 'Data Anomaly & Duplicates', 'Detect duplicate voucher numbers or suspiciously similar transactions.')}
                        {renderToggle(subTab, 'approvalRequests', 'Pending Approvals', 'Notifications for items requiring Maker-Checker validation.')}
                        {renderToggle(subTab, 'securityLoginAlerts', 'Unusual Login', 'Security warnings for login attempts from unfamiliar devices or locations.')}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 flex items-center justify-center mr-2 text-xs">i</span>
                    Smart Delivery Optimization
                </h4>
                <p className="text-sm text-blue-800/80 dark:text-blue-400/80 leading-relaxed">
                    We batch non-critical notifications together into digests to prevent alert fatigue. Critical events, such as security warnings and high-value transactions, bypass batching and are delivered immediately to ensure safety.
                </p>
            </div>
        </div>
    );
};
