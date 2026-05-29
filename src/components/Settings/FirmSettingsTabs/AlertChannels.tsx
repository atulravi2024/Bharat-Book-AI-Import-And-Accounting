import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Mail, MessageSquare, Phone, Send } from 'lucide-react';

interface Props {
  firmData: any;
  setFirmData: (data: any) => void;
  activeAccordion: string | null;
  toggleAccordion: (section: string) => void;
}

export const AlertChannels: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion }) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Accordion: Alert Destinations */}
      <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
        <button
          onClick={() => toggleAccordion("alertDestinations")}
          className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Send className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              {t("Alert Channels")}
            </h3>
          </div>
          {activeAccordion === "alertDestinations" ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {activeAccordion === "alertDestinations" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:px-8 bg-white dark:bg-gray-800 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 max-w-2xl">
                    {t("Configure alert delivery channels where real-time critical system notifications, automated GST filing, tax reminders, overdue tasks, and payment compliance warnings are routed.")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Channel */}
                  <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{t("Email Alerts")}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!firmData.alertEmailEnabled}
                          onChange={(e) => setFirmData({ ...firmData, alertEmailEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Email for Alert")}</label>
                      <input
                        type="email"
                        placeholder="alerts@yourfirm.com"
                        value={firmData.alertEmail || ''}
                        disabled={!firmData.alertEmailEnabled}
                        onChange={(e) => setFirmData({ ...firmData, alertEmail: e.target.value })}
                        className="w-full text-xs p-3 bg-white disabled:bg-gray-100 disabled:opacity-60 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-850 dark:border-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </div>

                  {/* SMS Channel */}
                  <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{t("SMS Alerts")}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!firmData.alertSmsEnabled}
                          onChange={(e) => setFirmData({ ...firmData, alertSmsEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("SMS Number for Alert")}</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={firmData.alertSms || ''}
                        disabled={!firmData.alertSmsEnabled}
                        onChange={(e) => setFirmData({ ...firmData, alertSms: e.target.value })}
                        className="w-full text-xs p-3 bg-white disabled:bg-gray-100 disabled:opacity-60 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-850 dark:border-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Channel */}
                  <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{t("WhatsApp Alerts")}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!firmData.alertWhatsappEnabled}
                          onChange={(e) => setFirmData({ ...firmData, alertWhatsappEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("WhatsApp Number for Alert")}</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={firmData.alertWhatsapp || ''}
                        disabled={!firmData.alertWhatsappEnabled}
                        onChange={(e) => setFirmData({ ...firmData, alertWhatsapp: e.target.value })}
                        className="w-full text-xs p-3 bg-white disabled:bg-gray-100 disabled:opacity-60 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-850 dark:border-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </div>

                  {/* Telegram Channel */}
                  <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-sky-500" />
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{t("Telegram Alerts")}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!firmData.alertTelegramEnabled}
                          onChange={(e) => setFirmData({ ...firmData, alertTelegramEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("Telegram handle/ID")}</label>
                      <input
                        type="text"
                        placeholder="@your_firm_bot"
                        value={firmData.alertTelegram || ''}
                        disabled={!firmData.alertTelegramEnabled}
                        onChange={(e) => setFirmData({ ...firmData, alertTelegram: e.target.value })}
                        className="w-full text-xs p-3 bg-white disabled:bg-gray-100 disabled:opacity-60 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-850 dark:border-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
