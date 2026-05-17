import React from 'react';
import { Users, ChevronUp } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';


interface PartySectionProps {
  collapsedSections: any;
  toggleSection: (section: string) => void;
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
  partyMasters: any[];
}

export const PartySection: React.FC<PartySectionProps> = ({
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange,
  partyMasters
}) => {  return (
    <div className={`bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[38] mb-6 ${collapsedSections.party ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
       <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-[inherit]"></div>
       <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.party ? '' : 'mb-5'}`} onClick={() => toggleSection('party')}>
         <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
           <Users size={16} className="mr-2 text-indigo-500"/> Party <span className="hidden sm:inline">&nbsp;Details</span>
         </h3>
         <button className="text-gray-400 hover:text-gray-600 transition-colors">
           <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.party ? 'rotate-180' : ''}`} />
         </button>
      </div>
      {!collapsedSections.party && (
      <div className="form-grid gap-x-6 gap-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="form-field-wrapper">
<label className="form-label">Entity Category</label>
          <select 
            value={headerDetails.entityCategory || ''} 
            onChange={(e) => handleHeaderChange('entityCategory', e.target.value)} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
          >
            <option value="Customer">Customer</option>
            <option value="Vendor">Vendor</option>
            <option value="Both">Both</option>
            <option value="Internal">Internal</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <SearchableDropdown
            label="Party A/c Name"
            options={partyMasters.filter(p => {
              const cat = headerDetails.entityCategory;
              if (cat === 'Both') return true;
              if (cat === 'Customer' && (p.type === 'Customer' || p.type === 'Both')) return true;
              if (cat === 'Vendor' && (p.type === 'Vendor' || p.type === 'Both')) return true;
              if (cat === 'Internal' && p.type === 'Internal') return true;
              if (cat === 'Hybrid' && p.type === 'Hybrid') return true;
              return p.type === cat;
            })}
            value={headerDetails.partyName || ''}
            onChange={(value) => handleHeaderChange('partyName', value)}
            placeholder={`Search ${headerDetails.entityCategory}...`}
          />
        </div>
        <div className="form-field-wrapper">
<label className="form-label">Business Role</label>
          <select 
            value={headerDetails.businessRole || ''} 
            onChange={(e) => handleHeaderChange('businessRole', e.target.value)} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
          >
            {(headerDetails.entityCategory === 'Customer' || headerDetails.entityCategory === 'Both') && (
              <>
                <option value="Trader">Trader</option>
                <option value="Consumer">Consumer</option>
              </>
            )}
            {(headerDetails.entityCategory === 'Vendor' || headerDetails.entityCategory === 'Both') && (
              <>
                <option value="Supplier">Supplier</option>
                <option value="Manufacturer">Manufacturer</option>
              </>
            )}
            {(headerDetails.entityCategory === 'Internal' || headerDetails.entityCategory === 'Hybrid') && (
              <>
                <option value="Operator">Operator</option>
                <option value="Staff">Staff</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Contractor">Contractor</option>
              </>
            )}
          </select>
        </div>
        <div className="form-field-wrapper">
<label className="form-label">GST Number</label>
          <input type="text" value={headerDetails.gstNumber || ''} onChange={(e) => handleHeaderChange('gstNumber', e.target.value)} placeholder="22AAAAA0000A1Z5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
        </div>

        <div className="form-field-wrapper">
<label className="form-label">Aadhaar Card No.</label>
          <input type="text" value={headerDetails.aadhaarNo || ''} onChange={(e) => handleHeaderChange('aadhaarNo', e.target.value)} placeholder="12-digit number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
        </div>
        <div className="form-field-wrapper">
<label className="form-label">PAN Card No.</label>
          <input type="text" value={headerDetails.panNo || ''} onChange={(e) => handleHeaderChange('panNo', e.target.value)} placeholder="ABCDE1234F" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
        </div>
        <div className="form-field-wrapper">
<label className="form-label">Party Type</label>
          <select value={headerDetails.partyType || ''} onChange={(e) => handleHeaderChange('partyType', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700">
            <option value="Regular">Regular</option>
            <option value="Composition">Composition</option>
            <option value="Unregistered">Unregistered</option>
            <option value="Consumer">Consumer</option>
          </select>
        </div>

        <div className="form-field-wrapper">
<label className="form-label">Place of Supply</label>
          <input 
            type="text" 
            value={headerDetails.placeOfSupply || ''} 
            onChange={(e) => handleHeaderChange('placeOfSupply', e.target.value)} 
            placeholder="e.g. Maharashtra"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" 
          />
        </div>
        <div className="form-field-wrapper">
<label className="form-label">Supply Classification (System)</label>
          <input 
            type="text" 
            value={headerDetails.supplyType || ''} 
            readOnly 
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-black text-gray-500 uppercase tracking-widest text-center cursor-not-allowed select-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          />
        </div>
        <div className="form-field-wrapper form-grid md:col-span-3 gap-4 p-4 bg-indigo-50/20 rounded-2xl border border-indigo-100/50 mt-2">
          <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">PO Number</label>
            <input type="text" value={headerDetails.poNumber || ''} onChange={(e) => handleHeaderChange('poNumber', e.target.value)} placeholder="PO-001" className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-800" />
          </div>
          <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">PO Date</label>
            <input type="date" value={headerDetails.poDate || ''} onChange={(e) => handleHeaderChange('poDate', e.target.value)} className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-800" />
          </div>
          <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Credit Period (Days)</label>
            <input type="number" value={headerDetails.creditPeriod || ''} onChange={(e) => handleHeaderChange('creditPeriod', e.target.value)} placeholder="30" className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-800" />
          </div>
          <div className="hidden sm:block">
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Price Level</label>
            <select value={headerDetails.priceLevel || ''} onChange={(e) => handleHeaderChange('priceLevel', e.target.value)} className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-800">
              <option value="Standard">Standard</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Retail">Retail</option>
              <option value="Consumer">Consumer</option>
            </select>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
