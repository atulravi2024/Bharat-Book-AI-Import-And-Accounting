const fs = require('fs');
const files = [
  'components/Operations/VoucherEntry/vouchers/ContraVoucher.tsx',
  'components/Operations/VoucherEntry/vouchers/CreditNoteVoucher.tsx',
  'components/Operations/VoucherEntry/vouchers/DebitNoteVoucher.tsx',
  'components/Operations/VoucherEntry/vouchers/JournalVoucher.tsx',
  'components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
  'components/Operations/VoucherEntry/vouchers/PurchaseVoucher.tsx',
  'components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx',
  'components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/parseFloat\(row\.tax \?\? '18'\) \|\| 0/g, "parseFloat(row.tax || '18') || 0");
    content = content.replace(/parseSafe\(row\.tax \?\? '18'\)/g, "parseSafe(row.tax || '18')");
    content = content.replace(/parseFloat\(r\[index\]\.tax \?\? '18'\)/g, "parseFloat(r[index].tax || '18')");
    fs.writeFileSync(file, content);
  }
});
console.log('done');
