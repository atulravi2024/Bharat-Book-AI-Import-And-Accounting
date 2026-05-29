import { useLanguage } from '../../../../context/LanguageContext';
import React from 'react';
import { MapPin, ChevronUp } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';


interface LogisticsSectionProps {
  collapsedSections: any;
  toggleSection: (section: string) => void;
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
  partyMasters?: any[];
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange,
  partyMasters
}) => {
  const { t, formatNumber  } = useLanguage();
  return (
    <div className={`bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[37] mb-6 ${collapsedSections.logistics ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
       <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-[inherit]"></div>
       <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.logistics ? '' : 'mb-5'}`} onClick={() => toggleSection('logistics')}>
         <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
           <MapPin size={16} className="mr-2 text-blue-600"/> {t("Address & Logistics")}
         </h3>
         <button className="text-gray-400 hover:text-gray-600 transition-colors">
           <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.logistics ? 'rotate-180' : ''}`} />
         </button>
      </div>
      {!collapsedSections.logistics && (
      <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center">
            <span className="bg-blue-600 w-2 h-2 rounded-full mr-2"></span> {t("Billing Address")}
          </h4>
          <div className="form-grid gap-6">
            <div className="form-field-wrapper lg:col-span-1">
              <SearchableDropdown
                label="Billing Party Name"
                options={partyMasters}
                value={headerDetails.billingPartyName || ''}
                onChange={(value) => handleHeaderChange('billingPartyName', value)}
                placeholder={t("Select Party...")}
              />
            </div>
            <div className="form-field-wrapper lg:col-span-2">
              <label className="form-label">{t("Street Address")}</label>
              <input type="text" value={headerDetails.billingAddress || ''} onChange={(e) => handleHeaderChange('billingAddress', e.target.value)} placeholder={t("Full address")} className="form-input text-sm font-medium" />
            </div>
            <div className="form-field-wrapper">
<label className="form-label">{t("State")}</label>
              <input type="text" value={headerDetails.billingState || ''} onChange={(e) => handleHeaderChange('billingState', e.target.value)} placeholder={t("e.g. Maharashtra")} className="form-input text-sm font-medium" />
            </div>
            <div className="form-field-wrapper">
<label className="form-label">{t("State Code / Pin Code")}</label>
              <div className="flex space-x-2">
                <input type="text" value={headerDetails.billingStateCode || ''} onChange={(e) => handleHeaderChange('billingStateCode', e.target.value)} placeholder={t("Code")} className="form-input w-20 text-sm font-medium" />
                <input type="text" value={headerDetails.billingPinCode || ''} onChange={(e) => handleHeaderChange('billingPinCode', e.target.value)} placeholder={t("Pin")} className="form-input flex-1 text-sm font-medium" />
              </div>
            </div>
            <div className="form-field-wrapper">
<label className="form-label">{t("Contact Person")}</label>
              <input type="text" value={headerDetails.contactPerson || ''} onChange={(e) => handleHeaderChange('contactPerson', e.target.value)} placeholder={t("Name")} className="form-input text-sm font-medium" />
            </div>
            <div className="form-field-wrapper">
<label className="form-label">{t("Mobile Number")}</label>
              <input type="text" value={headerDetails.mobileNumber || ''} onChange={(e) => handleHeaderChange('mobileNumber', e.target.value)} placeholder={t("10-digit number")} className="form-input text-sm font-medium" />
            </div>
            <div className="form-field-wrapper">
<label className="form-label">{t("WhatsApp Number")}</label>
              <input type="text" value={headerDetails.whatsappNumber || ''} onChange={(e) => handleHeaderChange('whatsappNumber', e.target.value)} placeholder={t("WhatsApp number")} className="form-input text-sm font-medium" />
            </div>
            <div className="form-field-wrapper">
<label className="form-label">{t("Email ID")}</label>
              <input type="email" value={headerDetails.emailId || ''} onChange={(e) => handleHeaderChange('emailId', e.target.value)} placeholder={t("email@example.com")} className="form-input text-sm font-medium" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={headerDetails.isShippingSameAsBilling || false} 
              onChange={(e) => handleHeaderChange('isShippingSameAsBilling', e.target.checked)}
              className="form-input w-5 h-5 border-2 border-gray-300 text-blue-600 cursor-pointer dark:border-gray-600"
            />
            <span className="text-xs font-black text-gray-700 uppercase tracking-widest dark:text-gray-200">{t("Shipping address is same as billing")}</span>
          </label>
        </div>

        {/* E-Way Bill Toggle */}
        <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={headerDetails.isEWayBillRequired || false} 
                onChange={(e) => handleHeaderChange('isEWayBillRequired', e.target.checked)}
                className="form-input w-6 h-6 border-2 border-gray-300 text-blue-600 cursor-pointer dark:border-gray-600"
              />
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-800 uppercase tracking-widest dark:text-gray-100">{t("Generate E-Way Bill")}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("Required for interstate transport &gt; ₹50,000")}</span>
              </div>
            </label>

            {headerDetails.isEWayBillRequired && (
              <div className="form-grid flex-1 gap-4 animate-in zoom-in-95 duration-300">
                <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t("Vehicle No")}</label>
                  <input type="text" value={headerDetails.vehicleNo || ''} onChange={(e) => handleHeaderChange('vehicleNo', e.target.value)} placeholder={t("MH 12 AB 1234")} className="form-input border-blue-100 text-sm font-bold" />
                </div>
                <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t("Transporter")}</label>
                  <input type="text" value={headerDetails.transporterName || ''} onChange={(e) => handleHeaderChange('transporterName', e.target.value)} placeholder={t("Transporter Name")} className="form-input border-blue-100 text-sm font-bold" />
                </div>
                <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t("Distance (KM)")}</label>
                  <input type="number" value={headerDetails.distance || ''} onChange={(e) => handleHeaderChange('distance', e.target.value)} placeholder={t("Distance")} className="form-input border-blue-100 text-sm font-bold" />
                </div>
              </div>
            )}
          </div>
        </div>

        {!headerDetails.isShippingSameAsBilling && (
          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500 dark:border-gray-800">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center">
              <span className="bg-indigo-600 w-2 h-2 rounded-full mr-2"></span> {t("Shipping Address")}
            </h4>
            <div className="form-grid gap-6">
              <div className="form-field-wrapper lg:col-span-1">
                <SearchableDropdown
                  label="Shipping Party Name"
                  options={partyMasters}
                  value={headerDetails.shippingPartyName || ''}
                  onChange={(value) => handleHeaderChange('shippingPartyName', value)}
                  placeholder={t("Select Party...")}
                />
              </div>
              <div className="form-field-wrapper lg:col-span-2">
                <label className="form-label">{t("Street Address")}</label>
                <input type="text" value={headerDetails.shippingAddress || ''} onChange={(e) => handleHeaderChange('shippingAddress', e.target.value)} placeholder={t("Full address")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("State")}</label>
                <input type="text" value={headerDetails.shippingState || ''} onChange={(e) => handleHeaderChange('shippingState', e.target.value)} placeholder={t("e.g. Karnataka")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("State Code / Pin Code")}</label>
                <div className="flex space-x-2">
                  <input type="text" value={headerDetails.shippingStateCode || ''} onChange={(e) => handleHeaderChange('shippingStateCode', e.target.value)} placeholder={t("Code")} className="w-20 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                  <input type="text" value={headerDetails.shippingPinCode || ''} onChange={(e) => handleHeaderChange('shippingPinCode', e.target.value)} placeholder={t("Pin")} className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Contact Info")}</label>
                <input type="text" value={headerDetails.shippingContact || ''} onChange={(e) => handleHeaderChange('shippingContact', e.target.value)} placeholder={t("Phone or Email")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Contact Person")}</label>
                <input type="text" value={headerDetails.shippingContactPerson || ''} onChange={(e) => handleHeaderChange('shippingContactPerson', e.target.value)} placeholder={t("Name")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Mobile Number")}</label>
                <input type="text" value={headerDetails.shippingMobileNumber || ''} onChange={(e) => handleHeaderChange('shippingMobileNumber', e.target.value)} placeholder={t("10-digit number")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("WhatsApp Number")}</label>
                <input type="text" value={headerDetails.shippingWhatsappNumber || ''} onChange={(e) => handleHeaderChange('shippingWhatsappNumber', e.target.value)} placeholder={t("WhatsApp number")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Email ID")}</label>
                <input type="email" value={headerDetails.shippingEmailId || ''} onChange={(e) => handleHeaderChange('shippingEmailId', e.target.value)} placeholder={t("email@example.com")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
