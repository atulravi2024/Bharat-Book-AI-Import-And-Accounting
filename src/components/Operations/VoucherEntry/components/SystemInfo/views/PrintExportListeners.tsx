
import React, { useEffect } from 'react';

export const PrintExportListeners: React.FC<{
  incrementPrintCount: () => void;
  incrementExportCount: () => void;
  incrementModCount: () => void;
}> = ({ incrementPrintCount, incrementExportCount, incrementModCount }) => {
  useEffect(() => {
    const handleBeforePrint = () => incrementPrintCount();
    window.addEventListener('beforeprint', handleBeforePrint);
    
    const handleExport = () => incrementExportCount();
    window.addEventListener('export_voucher', handleExport);
    
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('export_voucher', handleExport);
    };
  }, [incrementPrintCount, incrementExportCount]);
  return null;
};
