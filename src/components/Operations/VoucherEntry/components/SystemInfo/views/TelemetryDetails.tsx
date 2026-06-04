
import React from 'react';
import { Activity, Clock, FileText, Download } from 'lucide-react';

export const TelemetryDetails: React.FC<any> = ({ telemetry, customModCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
      <div className="border p-4 flex flex-col items-center">
        <Activity className="w-5 h-5 mb-2" />
        <span className="font-mono text-sm">{customModCount} Edits</span>
      </div>
      <div className="border p-4 flex flex-col items-center">
        <FileText className="w-5 h-5 mb-2" />
        <span className="font-mono text-sm">{telemetry?.printCount || 0} Prints</span>
      </div>
      <div className="border p-4 flex flex-col items-center">
        <Download className="w-5 h-5 mb-2" />
        <span className="font-mono text-sm">{telemetry?.exportCount || 0} Exports</span>
      </div>
    </div>
  );
};
