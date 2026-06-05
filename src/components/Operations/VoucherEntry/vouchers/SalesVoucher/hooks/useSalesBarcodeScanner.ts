import { useState } from 'react';

interface UseSalesBarcodeScannerProps {
  itemMasters: any[];
  rows: any[];
  setRows: (rows: any[]) => void;
  handleItemOrSkuChange: (rowIndex: number, value: string, field: 'itemName' | 'sku') => void;
}

export const useSalesBarcodeScanner = ({
  itemMasters,
  rows,
  setRows,
  handleItemOrSkuChange,
}: UseSalesBarcodeScannerProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scanningRowIndex, setScanningRowIndex] = useState<number | null>(null);

  const handleBarcodeScanned = (decodedText: string) => {
    setShowScanner(false);
    const item = itemMasters?.find(i => 
      i.name?.toLowerCase() === decodedText.toLowerCase() || 
      i.sku?.toLowerCase() === decodedText.toLowerCase() ||
      i.barcode?.toLowerCase() === decodedText.toLowerCase()
    );
    const matchedName = item ? (item.name || item.item_name) : decodedText;

    if (scanningRowIndex !== null && scanningRowIndex >= 0) {
      handleItemOrSkuChange(scanningRowIndex, matchedName, 'itemName');
    } else {
      const emptyRowIndex = rows.findIndex(r => !r.itemName);
      if (emptyRowIndex !== -1) {
        handleItemOrSkuChange(emptyRowIndex, matchedName, 'itemName');
      } else {
        const newIndex = rows.length;
        setRows([...rows, { id: Date.now(), itemName: matchedName }]);
        setTimeout(() => handleItemOrSkuChange(newIndex, matchedName, 'itemName'), 0);
      }
    }
  };

  return {
    showScanner,
    setShowScanner,
    scanningRowIndex,
    setScanningRowIndex,
    handleBarcodeScanned,
  };
};
