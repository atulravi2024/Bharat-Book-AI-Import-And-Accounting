const fs = require('fs');

const voucherFiles = [
  'src/components/Operations/VoucherEntry/vouchers/ContraVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/CreditNoteVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/DebitNoteVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/JournalVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/PurchaseVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx',
  'src/components/Operations/InventoryEntry/InventoryEntryView.tsx'
];

for (const file of voucherFiles) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/<HistoryModal items=\{/g, '<HistoryModal onDeleteRecord={onDeleteEntry} items={');

  fs.writeFileSync(file, content);
}
console.log('done!');
