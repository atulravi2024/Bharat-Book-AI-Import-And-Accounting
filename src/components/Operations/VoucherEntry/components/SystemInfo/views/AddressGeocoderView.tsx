
import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

export const AddressGeocoderView: React.FC<any> = ({ 
  locationData, 
  latitude, longitude, 
  addressSearchQuery, setAddressSearchQuery, 
  isSearchingAddress, setIsSearchingAddress,
  manualLat, setManualLat, manualLng, setManualLng,
  isGeoOfflineMapVisible, setIsGeoOfflineMapVisible
}) => {
  return (
    <div className="w-full mt-4 border p-4 bg-gray-50 flex flex-col gap-4">
       <div className="font-semibold text-sm">Location Services</div>
       <div className="flex flex-wrap gap-4 items-center">
         <input 
           className="border px-2 py-1 flex-grow font-mono text-sm" 
           value={addressSearchQuery || ''} 
           onChange={(e) => setAddressSearchQuery(e.target.value)} 
           placeholder="Search Address..." 
         />
       </div>
       <div className="h-64 bg-gray-200 border flex items-center justify-center text-sm font-mono relative">
         <MapPin className="w-6 h-6 absolute text-red-500" />
         Map Preview Placeholder
       </div>
       <div className="flex gap-4">
         <input type="text" className="border px-2 py-1 font-mono text-sm w-1/2" placeholder="Latitude" value={manualLat || ''} onChange={e => setManualLat(e.target.value)} />
         <input type="text" className="border px-2 py-1 font-mono text-sm w-1/2" placeholder="Longitude" value={manualLng || ''} onChange={e => setManualLng(e.target.value)} />
       </div>
    </div>
  );
};
