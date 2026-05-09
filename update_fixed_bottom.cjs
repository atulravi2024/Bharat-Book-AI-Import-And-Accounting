const fs = require('fs');

const files = [
    'components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/PurchaseVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/JournalVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/ContraVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/DebitNoteVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/CreditNoteVoucher.tsx',
    'components/Operations/InventoryEntry/components/InventoryActionMenu.tsx',
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    const regex = /className="[^\"]*sticky bottom-0[^\"]*bg-white border-t border-gray-200[^\"]*"/g;
    
    const newClass = 'className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] md:sticky md:bottom-0 md:-mx-6 lg:-mx-8 md:-mb-6 lg:-mb-8 z-[60] md:z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-2 md:p-1.5 flex justify-end md:justify-between items-center px-4 md:px-6 lg:px-8 mt-4 md:mt-4"';

    if (content.match(regex)) {
        content = content.replace(regex, newClass);
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find regex in ${file}`);
    }
});
