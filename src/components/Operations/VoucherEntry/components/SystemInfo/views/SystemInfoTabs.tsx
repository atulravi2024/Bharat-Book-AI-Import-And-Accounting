import React from 'react';
import { ChevronUp, Activity, Database, Server, RefreshCw } from 'lucide-react';
export const SystemInfoTabs: React.FC<any> = (props) => {
  return (
    <div className="mt-4 border bg-white shadow-sm overflow-hidden animate-in fade-in">
      <div className="bg-gray-100 p-3 font-semibold text-gray-800 flex justify-between items-center border-b font-mono text-sm tracking-tight uppercase">
        <span>System Details</span>
      </div>
      <div className="p-4 space-y-4">
        <p className="font-mono text-xs text-gray-500">System information tabs initialized.</p>
      </div>
    </div>
  );
};
