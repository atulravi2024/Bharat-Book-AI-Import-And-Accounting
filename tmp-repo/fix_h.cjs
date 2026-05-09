const fs = require('fs');

const fixFile = (path) => {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/w-full h-16/g, 'w-full h-12');
  content = content.replace(/w-full h-24/g, 'w-full h-16');
  fs.writeFileSync(path, content, 'utf8');
};

fixFile('components/Operations/VoucherEntry/VoucherPreview.tsx');
fixFile('components/Settings/InvoicePrintSettings.tsx');
