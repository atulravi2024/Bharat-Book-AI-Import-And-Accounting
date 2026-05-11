import React from 'react';
import { MapPin, ChevronUp } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';

interface LogisticsSectionProps {
  collapsedSections: any;
  toggleSection: (section: string) => void;
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
  partyMasters: any[];
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange,
  partyMasters
}) => {
  return (
    <div className={`bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[37] mb-6 ${collapsedSections.logistics ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
       <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-[inherit]"></div>
       <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.logistics ? '' : 'mb-5'}`} onClick={() => toggleSection('logistics')}>
         <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
           <MapPin size={16} className="mr-2 text-blue-600"/> Address & Logistics
         </h3>
         <button className="text-gray-400 hover:text-gray-600 transition-colors">
           <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.logistics ? 'rotate-180' : ''}`} />
         </button>
      </div>
      {!collapsedSections.logistics && (
      <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center">
            <span className="bg-blue-600 w-2 h-2 rounded-full mr-2"></span> Billing Address
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SearchableDropdown
                label="Billing Party Name"
                options={partyMasters}
                value={headerDetails.billingPartyName}
                onChange={(value) => handleHeaderChange('billingPartyName', value)}
                placeholder="Select Party..."
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Street Address</label>
              <input type="text" value={headerDetails.billingAddress} onChange={(e) => handleHeaderChange('billingAddress', e.target.value)} placeholder="Full address" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">State</label>
              <input type="text" value={headerDetails.billingState} onChange={(e) => handleHeaderChange('billingState', e.target.value)} placeholder="e.g. Maharashtra" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">State Code / Pin Code</label>
              <div className="flex space-x-2">
                <input type="text" value={headerDetails.billingStateCode} onChange={(e) => handleHeaderChange('billingStateCode', e.target.value)} placeholder="Code" className="w-20 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                <input type="text" value={headerDetails.billingPinCode} onChange={(e) => handleHeaderChange('billingPinCode', e.target.value)} placeholder="Pin" className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Contact Person</label>
              <input type="text" value={headerDetails.contactPerson} onChange={(e) => handleHeaderChange('contactPerson', e.target.value)} placeholder="Name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
              <input type="text" value={headerDetails.mobileNumber} onChange={(e) => handleHeaderChange('mobileNumber', e.target.value)} placeholder="10-digit number" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">WhatsApp Number</label>
              <input type="text" value={headerDetails.whatsappNumber} onChange={(e) => handleHeaderChange('whatsappNumber', e.target.value)} placeholder="WhatsApp number" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email ID</label>
              <input type="email" value={headerDetails.emailId} onChange={(e) => handleHeaderChange('emailId', e.target.value)} placeholder="email@example.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={headerDetails.isShippingSameAsBilling} 
              onChange={(e) => handleHeaderChange('isShippingSameAsBilling', e.target.checked)}
              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer dark:border-gray-600"
            />
            <span className="text-xs font-black text-gray-700 uppercase tracking-widest dark:text-gray-200">Shipping address is same as billing</span>
          </label>
        </div>

        {/* E-Way Bill Toggle */}
        <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={headerDetails.isEWayBillRequired} 
                onChange={(e) => handleHeaderChange('isEWayBillRequired', e.target.checked)}
                className="w-6 h-6 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer dark:border-gray-600"
              />
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-800 uppercase tracking-widest dark:text-gray-100">Generate E-Way Bill</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Required for interstate transport &gt; ₹50,000</span>
              </div>
            </label>

            {headerDetails.isEWayBillRequired && (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in zoom-in-95 duration-300">
                <div>
                  <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Vehicle No</label>
                  <input type="text" value={headerDetails.vehicleNo} onChange={(e) => handleHeaderChange('vehicleNo', e.target.value)} placeholder="MH 12 AB 1234" className="w-full px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Transporter</label>
                  <input type="text" value={headerDetails.transporterName} onChange={(e) => handleHeaderChange('transporterName', e.target.value)} placeholder="Transporter Name" className="w-full px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Distance (KM)</label>
                  <input type="number" value={headerDetails.distance} onChange={(e) => handleHeaderChange('distance', e.target.value)} placeholder="Distance" className="w-full px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800" />
                </div>
              </div>
            )}
          </div>
        </div>

        {!headerDetails.isShippingSameAsBilling && (
          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500 dark:border-gray-800">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center">
              <span className="bg-indigo-600 w-2 h-2 rounded-full mr-2"></span> Shipping Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <SearchableDropdown
                  label="Shipping Party Name"
                  options={partyMasters}
                  value={headerDetails.shippingPartyName}
                  onChange={(value) => handleHeaderChange('shippingPartyName', value)}
                  placeholder="Select Party..."
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Street Address</label>
                <input type="text" value={headerDetails.shippingAddress} onChange={(e) => handleHeaderChange('shippingAddress', e.target.value)} placeholder="Full address" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">State</label>
                <input type="text" value={headerDetails.shippingState} onChange={(e) => handleHeaderChange('shippingState', e.target.value)} placeholder="e.g. Karnataka" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">State Code / Pin Code</label>
                <div className="flex space-x-2">
                  <input type="text" value={headerDetails.shippingStateCode} onChange={(e) => handleHeaderChange('shippingStateCode', e.target.value)} placeholder="Code" className="w-20 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                  <input type="text" value={headerDetails.shippingPinCode} onChange={(e) => handleHeaderChange('shippingPinCode', e.target.value)} placeholder="Pin" className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Contact Info</label>
                <input type="text" value={headerDetails.shippingContact} onChange={(e) => handleHeaderChange('shippingContact', e.target.value)} placeholder="Phone or Email" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Contact Person</label>
                <input type="text" value={headerDetails.shippingContactPerson} onChange={(e) => handleHeaderChange('shippingContactPerson', e.target.value)} placeholder="Name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                <input type="text" value={headerDetails.shippingMobileNumber} onChange={(e) => handleHeaderChange('shippingMobileNumber', e.target.value)} placeholder="10-digit number" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">WhatsApp Number</label>
                <input type="text" value={headerDetails.shippingWhatsappNumber} onChange={(e) => handleHeaderChange('shippingWhatsappNumber', e.target.value)} placeholder="WhatsApp number" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email ID</label>
                <input type="email" value={headerDetails.shippingEmailId} onChange={(e) => handleHeaderChange('shippingEmailId', e.target.value)} placeholder="email@example.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
