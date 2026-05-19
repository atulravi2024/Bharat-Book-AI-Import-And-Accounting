const fs = require('fs');

const C_FILE = 'src/components/Operations/VoucherEntry/vouchers/ContraVoucher.tsx';
if (fs.existsSync(C_FILE)) {
    let c = fs.readFileSync(C_FILE, 'utf8');
    c = c.replace(
        /options=\{\(activeTab === 'payment' \|\| activeTab === 'receipt'\) && index === 0 \? ledgerMasters\.filter\(l => l\.group\?\.toLowerCase\(\)\.includes\('cash'\) \|\| l\.group\?\.toLowerCase\(\)\.includes\('bank'\) \|\| l\.name\?\.toLowerCase\(\)\.includes\('cash'\) \|\| l\.name\?\.toLowerCase\(\)\.includes\('bank'\)\) : \[\.\.\.ledgerMasters, \.\.\.partyMasters\]\}/,
        `options={(activeTab === 'payment' || activeTab === 'receipt') && index === 0 ? ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank')) : ledgerMasters}`
    );
    fs.writeFileSync(C_FILE, c);
}

const PR_FILES = [
    'src/components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
    'src/components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx'
];

PR_FILES.forEach(f => {
    if (!fs.existsSync(f)) return;
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(
        /options=\{\(activeTab === 'payment' \|\| activeTab === 'receipt'\) && index === 0 \? ledgerMasters\.filter\(l => l\.group\?\.toLowerCase\(\)\.includes\('cash'\) \|\| l\.group\?\.toLowerCase\(\)\.includes\('bank'\) \|\| l\.name\?\.toLowerCase\(\)\.includes\('cash'\) \|\| l\.name\?\.toLowerCase\(\)\.includes\('bank'\)\) : \[\.\.\.ledgerMasters, \.\.\.partyMasters\]\}/,
        `options={(activeTab === 'payment' || activeTab === 'receipt') && index === 0 ? ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank')) : [...ledgerMasters.filter(l => !(l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank'))), ...partyMasters]}`
    );
    fs.writeFileSync(f, c);
});

console.log('Fixed Contra, Payment, and Receipt dropdowns.');
