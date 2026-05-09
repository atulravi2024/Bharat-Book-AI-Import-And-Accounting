const fs = require('fs');

const files = [
    'components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/PurchaseVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/JournalVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/ContraVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/DebitNoteVoucher.tsx',
    'components/Operations/VoucherEntry/vouchers/CreditNoteVoucher.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Explicit multi-line replacement
    let newContent = content;
    const lines = content.split('\n');
    let outLines = [];
    let skip = 0;
    
    for (let i = 0; i < lines.length; i++) {
        if (skip > 0) {
            skip--;
            continue;
        }
        if (lines[i].includes('title="Import"')) {
            if (lines[i+1] && lines[i+1].includes('<Import')) {
                if (lines[i+2] && lines[i+2].includes('</button>')) {
                    skip = 2; // skip the next 2 lines
                    continue; // skip current line
                }
            }
        }
        outLines.push(lines[i]);
    }
    
    const newFileContent = outLines.join('\n');
    if (newFileContent !== content) {
        fs.writeFileSync(file, newFileContent);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find button in ${file}`);
    }
});
