const fs = require('fs');
const file = 'src/components/Reports/BankVouchers/LedgerReportView.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /if \(activeTab === 'purchase'\) list = list\.filter\(v => v\.type === VoucherType\.Purchase\);/,
    `if (activeTab === 'purchase') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'purchase');`
);

fs.writeFileSync(file, content);
console.log('done!');
