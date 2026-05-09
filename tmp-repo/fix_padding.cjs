const fs = require('fs');
const files = [
  'components/Operations/VoucherEntry/VoucherPreview.tsx',
  'components/Settings/InvoicePrintSettings.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/mb-12/g, 'mb-6');
  content = content.replace(/py-12/g, 'py-6');
  content = content.replace(/py-8/g, 'py-4');
  content = content.replace(/p-10/g, 'p-6');
  content = content.replace(/gap-12/g, 'gap-6');
  
  content = content.replace(/w-96/g, 'w-80');
  fs.writeFileSync(file, content, 'utf8');
}
