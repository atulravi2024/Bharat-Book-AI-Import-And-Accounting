import React, { useState } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { 
  Building, 
  Users, 
  ShieldAlert, 
  Info, 
  Sliders, 
  Navigation, 
  Hash, 
  FileSpreadsheet, 
  Shuffle, 
  Cpu, 
  Database, 
  Printer, 
  FormInput, 
  Palette, 
  Shield, 
  EyeOff, 
  Bell, 
  LifeBuoy, 
  HelpCircle,
  Settings
} from 'lucide-react';
import { getActiveSettingStyles } from '../utils/step1Utils';

interface SettingsSelectionPanelProps {
  selectedSettingsSubpage: string;
  setSelectedSettingsSubpage?: (subpage: string) => void;
  theme: any;
}

export const SettingsSelectionPanel: React.FC<SettingsSelectionPanelProps> = ({
  selectedSettingsSubpage,
  setSelectedSettingsSubpage,
  theme,
}) => {
  const { t } = useLanguage();

  const settingsSubpages = [
    { id: 'pref_firm', label: t("Firm Import"), group: t("Management & Organization"), icon: Building, color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50', accent: 'bg-indigo-600', desc: t("Address, contact details, regional taxes, and organizational profile configurations.") },
    { id: 'pref_users', label: t("User Account Import"), group: t("Management & Organization"), icon: Users, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50', accent: 'bg-emerald-600', desc: t("User directory records, operational roles, permissions, and group policies.") },
    { id: 'pref_admin', label: t("Admin Import"), group: t("Management & Organization"), icon: ShieldAlert, color: 'text-red-500 bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/50', accent: 'bg-red-500', desc: t("Super admin privileges, direct database triggers, and master system tools.") },
    { id: 'pref_about', label: t("About Import"), group: t("Management & Organization"), icon: Info, color: 'text-blue-500 bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50', accent: 'bg-blue-500', desc: t("Application build details, local client configurations, and active package licenses.") },

    { id: 'pref_general', label: t("General Import"), group: t("System & Navigation Defaults"), icon: Sliders, color: 'text-purple-600 bg-purple-50/50 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/50', accent: 'bg-purple-600', desc: t("System-wide language selections, notification banners, and background tasks.") },
    { id: 'pref_app_defaults', label: t("App Defaults Import"), group: t("System & Navigation Defaults"), icon: Navigation, color: 'text-cyan-600 bg-cyan-50/50 border-cyan-100 dark:bg-cyan-950/20 dark:border-cyan-900/50', accent: 'bg-cyan-600', desc: t("Primary entry navigation paths, workspace layouts, and landing configurations.") },
    { id: 'pref_voucher_numbering', label: t("Voucher Numbering Import"), group: t("System & Navigation Defaults"), icon: Hash, color: 'text-amber-600 bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/50', accent: 'bg-amber-600', desc: t("Sequence numbering protocols, custom auto-number structures per voucher type.") },

    { id: 'pref_import_rules', label: t("Import Rules Import"), group: t("Operations & Data Integration"), icon: FileSpreadsheet, color: 'text-sky-600 bg-sky-50/50 border-sky-100 dark:bg-sky-950/20 dark:border-sky-900/50', accent: 'bg-sky-600', desc: t("Validation requirements, OCR confidence bars, and standard posting constraints.") },
    { id: 'pref_mapping', label: t("Mapping Import"), group: t("Operations & Data Integration"), icon: Shuffle, color: 'text-lime-600 bg-lime-50/50 border-lime-100 dark:bg-lime-950/20 dark:border-lime-900/50', accent: 'bg-lime-600', desc: t("Static value aliases, field-to-field alignment rules, and automated auto-completions.") },
    { id: 'pref_ai_engines', label: t("AI Engines Import"), group: t("Operations & Data Integration"), icon: Cpu, color: 'text-violet-600 bg-violet-50/50 border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/50', accent: 'bg-violet-600', desc: t("Active LLM models, routing pipelines, extraction levels, and response parameters.") },
    { id: 'pref_data_explorer', label: t("Data Explorer Import"), group: t("Operations & Data Integration"), icon: Database, color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50', accent: 'bg-indigo-600', desc: t("Raw JSON schemas, data diagnostics, and database diagnostics tools.") },

    { id: 'pref_invoice_print', label: t("Invoice Print Import"), group: t("Aesthetics, Forms & Printing"), icon: Printer, color: 'text-fuchsia-600 bg-fuchsia-50/50 border-fuchsia-100 dark:bg-fuchsia-950/20 dark:border-fuchsia-900/50', accent: 'bg-fuchsia-600', desc: t("Aesthetic layout presets, custom logos, fonts, thermal page sizing, and signature templates.") },
    { id: 'pref_form_detail', label: t("Form Import"), group: t("Aesthetics, Forms & Printing"), icon: FormInput, color: 'text-rose-600 bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50', accent: 'bg-rose-600', desc: t("Active input elements, custom field parameters, and dynamic item layouts.") },
    { id: 'pref_design_palette', label: t("Visual Palette Import"), group: t("Aesthetics, Forms & Printing"), icon: Palette, color: 'text-yellow-600 bg-yellow-50/50 border-yellow-100 dark:bg-yellow-950/20 dark:border-yellow-900/50', accent: 'bg-yellow-600', desc: t("Custom workspace color schema, luxury dense theme palettes, dark/light ambient rules.") },

    { id: 'pref_security', label: t("Security Import"), group: t("Security, Governance & Support"), icon: Shield, color: 'text-rose-600 bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50', accent: 'bg-rose-600', desc: t("Authentication restrictions, allowed network ranges, and strict lockouts.") },
    { id: 'pref_privacy', label: t("Privacy Import"), group: t("Security, Governance & Support"), icon: EyeOff, color: 'text-orange-600 bg-orange-50/50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/50', accent: 'bg-orange-600', desc: t("Confidentiality options, PII masking rules, and automated session clearances.") },
    { id: 'pref_alerts', label: t("Alert Channel Import"), group: t("Security, Governance & Support"), icon: Bell, color: 'text-yellow-600 bg-yellow-50/50 border-yellow-101 dark:bg-yellow-950/20 dark:border-yellow-900/50', accent: 'bg-yellow-505', desc: t("Email alert thresholds, real-time trigger rules, and system event notifications.") },
    { id: 'pref_support', label: t("Support Import"), group: t("Security, Governance & Support"), icon: LifeBuoy, color: 'text-pink-600 bg-pink-50/50 border-pink-100 dark:bg-pink-950/20 dark:border-pink-900/50', accent: 'bg-pink-600', desc: t("Technical service tickets, chat configuration settings, and system integration integrity logs.") },
    { id: 'pref_help', label: t("Help Center Import"), group: t("Security, Governance & Support"), icon: HelpCircle, color: 'text-teal-600 bg-teal-50/50 border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/50', accent: 'bg-teal-600', desc: t("FAQ guides, documentation reference tables, and support category structures.") },
  ];

  const [lastSelectedSubpage, setLastSelectedSubpage] = useState(selectedSettingsSubpage);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("all");

  if (selectedSettingsSubpage !== lastSelectedSubpage) {
    setLastSelectedSubpage(selectedSettingsSubpage);
    const matchedItem = settingsSubpages.find(item => item.id === selectedSettingsSubpage);
    if (matchedItem && selectedGroupFilter !== 'all') {
      setSelectedGroupFilter(matchedItem.group);
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-top-2 duration-300 text-left">
      <div className="flex items-center justify-between px-1">
          <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">
            {t("Select settings, sub-pages")}
          </label>
          <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
      </div>

       {/* Quick dropdown select bar for speed selection */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/30 dark:from-gray-900/40 dark:to-gray-900/10 p-5 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 text-left">
          <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded tracking-widest inline-block mb-1.5 label-test">
            {t("Select settings, sub-pages")}
          </span>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t("Active Group Filters instantly restrict available subpages listed underneath.")}
          </p>
        </div>

        <div className="w-full md:w-[420px] shrink-0 flex items-center gap-3">
          <span className="text-xs font-black text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {t("Choose Category:")}
          </span>
          <select
            value={selectedGroupFilter}
            onChange={(e) => {
              const newGroup = e.target.value;
              setSelectedGroupFilter(newGroup);
              if (newGroup !== 'all') {
                // Dynamically update the selected settings subpage to the first page in the newly selected group
                const groupItems = settingsSubpages.filter(item => item.group === newGroup);
                if (groupItems.length > 0 && setSelectedSettingsSubpage) {
                  setSelectedSettingsSubpage(groupItems[0].id);
                }
              }
            }}
            className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer transition-all duration-200"
          >
            <option value="all">{t("All (Show All)")}</option>
            <option value={t("Management & Organization")}>{t("Management & Organization")}</option>
            <option value={t("System & Navigation Defaults")}>{t("System & Navigation Defaults")}</option>
            <option value={t("Operations & Data Integration")}>{t("Operations & Data Integration")}</option>
            <option value={t("Aesthetics, Forms & Printing")}>{t("Aesthetics, Forms & Printing")}</option>
            <option value={t("Security, Governance & Support")}>{t("Security, Governance & Support")}</option>
          </select>
        </div>
      </div>

      {/* Visual Interactive Cards with Category Group Tabs */}
      <div className="space-y-6">
        {(selectedGroupFilter === 'all'
          ? [
              t("Management & Organization"),
              t("System & Navigation Defaults"),
              t("Operations & Data Integration"),
              t("Aesthetics, Forms & Printing"),
              t("Security, Governance & Support")
            ]
          : [selectedGroupFilter]
        ).map((groupName) => {
          const groupItems = settingsSubpages.filter(item => item.group === groupName);
          if (groupItems.length === 0) return null;
          return (
            <div key={groupName} className="space-y-3">
              <h5 className="text-[10px] font-black tracking-wider uppercase text-gray-400 dark:text-gray-500 flex items-center px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></span>
                {groupName}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupItems.map((item) => {
                  const isSelected = selectedSettingsSubpage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSettingsSubpage && setSelectedSettingsSubpage(item.id)}
                      className={`group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex cursor-pointer w-full ${
                        isSelected
                          ? getActiveSettingStyles(item.id) + ' scale-[1.01]'
                          : 'bg-white hover:bg-gray-50/50 border-gray-100 hover:border-gray-300/80 hover:shadow-sm dark:bg-gray-850 dark:border-gray-700/60 dark:hover:border-gray-600'
                      }`}
                    >
                      {/* Accent highlight strip on side */}
                      <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${isSelected ? item.accent : 'bg-transparent'}`}></div>

                      <div className="flex gap-4 w-full">
                        {/* Icon container */}
                        <div className={`p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105 ${item.color} flex items-center justify-center h-11 w-11`}>
                          <item.icon className="w-5 h-5" />
                        </div>

                        {/* Text details */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center justify-between gap-1">
                            <h6 className={`text-xs font-black truncate leading-tight ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                              {item.label}
                            </h6>
                            {isSelected && (
                              <span className={`text-[10px] ${item.accent} text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase shrink-0 tracking-wide scale-90`}>
                                {t("Active")}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium Guide notice */}
      <div className={`p-5 transition-all duration-500 rounded-2xl border ${theme.bg} ${theme.border} ${theme.darkBorder}`}>
        <div className="flex gap-4">
          <div className={`p-3 bg-white dark:bg-gray-800 rounded-xl border shadow-sm self-start shrink-0 transition-colors duration-500 ${theme.border} ${theme.darkBorder} ${theme.text} ${theme.darkText}`}>
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h4 className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors duration-500 ${theme.text} ${theme.darkText}`}>
              {t("Selected Pipeline Destination")}
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-300 mt-1.5 leading-relaxed">
              {t("You have selected: ")} <strong className={`uppercase tracking-wider transition-colors duration-500 ${theme.text} ${theme.darkText}`}>{selectedSettingsSubpage.replace(/_/g, ' ').toUpperCase()}</strong>.
              {t(" On the next pages, the parse matrix validation controls will align perfectly against the parameters and variables of this subpage configuration.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
