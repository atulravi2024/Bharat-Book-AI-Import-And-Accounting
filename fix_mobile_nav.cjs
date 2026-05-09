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
    'components/Operations/InventoryEntry/components/InventoryActionMenu.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace sticky with fixed for mobile, sticky for desktop
    const oldClass = 'className="sticky bottom-0 -mx-4 md:-mx-6 lg:-mx-8 -mb-24 md:-mb-8 z-[60] md:z-50 bg-white border-t border-gray-200';
    const newClass = 'className="fixed bottom-0 left-0 right-0 md:sticky md:bottom-0 md:-mx-6 lg:-mx-8 md:-mb-8 z-[60] md:z-50 bg-white border-t border-gray-200';
    
    if (content.indexOf(oldClass) !== -1) {
        content = content.replace(oldClass, newClass);
        fs.writeFileSync(file, content, 'utf8');
        console.log("Updated", file);
    }
});
