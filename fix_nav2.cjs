const fs = require('fs');

const voucherFiles = [
  'src/components/Operations/VoucherEntry/vouchers/ContraVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/CreditNoteVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/DebitNoteVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/JournalVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/PurchaseVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx',
  'src/components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx'
];

for (const file of voucherFiles) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix handleNavigate
  content = content.replace(/const allVouchersRaw = localStorage\.getItem\('bharat_book_all_vouchers_v2'\);\n\s*if \(\!allVouchersRaw\) return;\n\s*const allVouchers = JSON\.parse\(allVouchersRaw\) as any\[\];/s, 'const allVouchers = vouchers || [];\n    if (allVouchers.length === 0) return;');

  content = content.replace(/const allVouchersRaw = localStorage\.getItem\('bharat_book_all_vouchers_v2'\);\n\s*if \(\!allVouchersRaw\) return;\n\s*const allVouchers = safeJsonParse\(allVouchersRaw, \[\] as any\[\]\);/s, 'const allVouchers = vouchers || [];\n    if (allVouchers.length === 0) return;');

  fs.writeFileSync(file, content);
}
console.log('done!');
