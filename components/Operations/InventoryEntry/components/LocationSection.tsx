import React from 'react';
import { MapPin, ChevronUp } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';

interface LocationSectionProps {
  activeTab: string;
  collapsedSections: any;
  toggleSection: (section: string) => void;
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
  warehouseMasters: any[];
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  activeTab,
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange,
  warehouseMasters
}) => {
  if (activeTab === 'stock_journal' || activeTab === 'transfer') {
    return (
      <div className={`bg-white border border-gray-200/60 shadow-sm relative mb-6 transition-all duration-300 z-[40] ${collapsedSections.location ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'}`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-[inherit]"></div>
        <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.location ? '' : 'mb-5'}`} onClick={() => toggleSection('location')}>
           <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center">
             <MapPin size={16} className="mr-2 text-blue-500"/> Locations
           </h3>
           <button className="text-gray-400 hover:text-gray-600 transition-colors">
             <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.location ? 'rotate-180' : ''}`} />
           </button>
        </div>
        {!collapsedSections.location && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <SearchableDropdown
              label="Source Location"
              options={warehouseMasters}
              value={headerDetails.sourceLocation}
              onChange={(value) => handleHeaderChange('sourceLocation', value)}
              placeholder="Search Origin..."
            />
          </div>
          <div>
            <SearchableDropdown
              label="Destination Location"
              options={warehouseMasters}
              value={headerDetails.destinationLocation}
              onChange={(value) => handleHeaderChange('destinationLocation', value)}
              placeholder="Search Destination..."
            />
          </div>
        </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`bg-white border border-gray-200/60 shadow-sm relative mb-6 transition-all duration-300 z-[40] ${collapsedSections.location ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'}`}>
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-[inherit]"></div>
      <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.location ? '' : 'mb-5'}`} onClick={() => toggleSection('location')}>
         <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center">
           <MapPin size={16} className="mr-2 text-blue-500"/> Location
         </h3>
         <button className="text-gray-400 hover:text-gray-600 transition-colors">
           <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.location ? 'rotate-180' : ''}`} />
         </button>
      </div>
      {!collapsedSections.location && (
      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
        <SearchableDropdown
          label="Warehouse / Location"
          options={warehouseMasters}
          value={headerDetails.location}
          onChange={(value) => handleHeaderChange('location', value)}
          placeholder="Search Location..."
        />
      </div>
      )}
    </div>
  );
};
