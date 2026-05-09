const fs = require('fs');

const content = fs.readFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', 'utf8');

const startStr = '{editingRowIndex !== null && (';
const endStr = '      )}\n      \n      <NewItemModal';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
    console.error('Indexes not found!');
    process.exit(1);
}

const modalJsx = content.substring(startIdx + startStr.length, endIdx);

const modalContent = `import React from 'react';
import { Package, X, ChevronDown, ScanBarcode, Calculator, ClipboardList } from 'lucide-react';
import { SearchableDropdown } from '../../ui/SearchableDropdown';

interface VoucherItemEditModalProps {
  isOpen: boolean;
  editingRowIndex: number | null;
  setEditingRowIndex: (idx: number | null) => void;
  expandedRowSection: string | null;
  setExpandedRowSection: (sec: string | null) => void;
  rows: any[];
  setRows: (rows: any[]) => void;
  itemMasters: any[];
  handleItemOrSkuChange: (rowIndex: number, value: string, field: 'itemName' | 'sku') => void;
  setScanningRowIndex: (idx: number | null) => void;
  setShowScanner: (show: boolean) => void;
  getRowPreTaxRoundOff: (row: any) => number;
  calculateRowAmount: (row: any) => number;
  getRowRoundOff: (row: any) => number;
  calculateRowNetAmount: (row: any) => number;
}

export const VoucherItemEditModal: React.FC<VoucherItemEditModalProps> = ({
  isOpen, editingRowIndex, setEditingRowIndex, expandedRowSection, setExpandedRowSection,
  rows, setRows, itemMasters, handleItemOrSkuChange, setScanningRowIndex, setShowScanner,
  getRowPreTaxRoundOff, calculateRowAmount, getRowRoundOff, calculateRowNetAmount
}) => {
  if (!isOpen || editingRowIndex === null) return null;

  return (
${modalJsx}
};
`;

fs.writeFileSync('components/Operations/VoucherEntry/components/VoucherItemEditModal.tsx', modalContent);

const newContent = content.substring(0, startIdx) + `
      <VoucherItemEditModal 
        isOpen={editingRowIndex !== null}
        editingRowIndex={editingRowIndex}
        setEditingRowIndex={setEditingRowIndex}
        expandedRowSection={expandedRowSection}
        setExpandedRowSection={setExpandedRowSection}
        rows={rows}
        setRows={setRows}
        itemMasters={itemMasters}
        handleItemOrSkuChange={handleItemOrSkuChange}
        setScanningRowIndex={setScanningRowIndex}
        setShowScanner={setShowScanner}
        getRowPreTaxRoundOff={getRowPreTaxRoundOff}
        calculateRowAmount={calculateRowAmount}
        getRowRoundOff={getRowRoundOff}
        calculateRowNetAmount={calculateRowNetAmount}
      />
` + content.substring(endIdx + 6); // +6 to skip '      )'

fs.writeFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', newContent);

// Add import
let impContent = fs.readFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', 'utf8');
const impIdx = impContent.indexOf('import { VoucherPreview } from \'./VoucherPreview\';');
if (impIdx !== -1) {
    const imps = "import { VoucherItemEditModal } from './components/VoucherItemEditModal';\n";
    fs.writeFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', impContent.substring(0, impIdx) + imps + impContent.substring(impIdx));
}

console.log('Success extracting ItemEditModal!');
