const fs = require('fs');

const files = [
    'src/components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
    'src/components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx',
    'src/components/Operations/VoucherEntry/vouchers/ContraVoucher.tsx',
    'src/components/Operations/VoucherEntry/vouchers/JournalVoucher.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // For the grid SearchableDropdown
    // We want to replace the `ledgerMasters` at the end of the ternary with `[...ledgerMasters, ...partyMasters]`
    const oldOptionPattern = `options={(activeTab === 'payment' || activeTab === 'receipt') && index === 0 ? ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank')) : ledgerMasters}`;
    const newOptionPattern = `options={(activeTab === 'payment' || activeTab === 'receipt') && index === 0 ? ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank')) : [...ledgerMasters, ...partyMasters]}`;
    
    // In JournalVoucher.tsx before my change, it might be exactly the oldOptionPattern.
    let updated = content.replace(oldOptionPattern, newOptionPattern);

    fs.writeFileSync(file, updated);
});
console.log('Fixed party masters in grid dropdowns');
