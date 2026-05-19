const fs = require('fs');

const file = 'src/components/Reports/BankVouchers/LedgerReportView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add "Inventory Register" to tabs
content = content.replace(
    /\{\ id:\ 'day_book',\ label:\ 'Day Book'\ \},/,
    `{ id: 'inventory', label: 'Inventory Register' },\n        { id: 'day_book', label: 'Day Book' },`
);

// Add filtering logic for inventory
const inventoryTypes = [
    'stock_journal', 'physical_stock', 'delivery_note', 'receipt_note', 
    'material_in', 'material_out', 'rejections_in', 'rejections_out', 
    'manufacturing_journal', 'consumption'
];

const inventoryCondition = inventoryTypes.map(t => `v.type.toLowerCase().replace(' ', '_') === '${t}'`).join(' || ');

content = content.replace(
    /else if \(activeTab === 'credit_note'\) list = list\.filter\(v => v\.type === VoucherType\.CreditNote\);/,
    `else if (activeTab === 'credit_note') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'credit_note');\n        else if (activeTab === 'inventory') list = list.filter(v => { const t = (v.type || '').toString().toLowerCase().replace(' ', '_'); return [${inventoryTypes.map(t=>`'${t}'`).join(', ')}].includes(t); });`
);

// We should also fix filtering for other types where they might be strings because imported Excel data etc might not rigorously match VoucherType ENUMS EXACTLY.
content = content.replace(
    /else if \(activeTab === 'purchase'\) list = list\.filter\(v => v\.type === VoucherType\.Purchase\);/,
    `else if (activeTab === 'purchase') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'purchase');`
);
content = content.replace(
    /else if \(activeTab === 'sales'\) list = list\.filter\(v => v\.type === VoucherType\.Sales\);/,
    `else if (activeTab === 'sales') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'sales');`
);
content = content.replace(
    /else if \(activeTab === 'payment'\) list = list\.filter\(v => v\.type === VoucherType\.Payment\);/,
    `else if (activeTab === 'payment') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'payment');`
);
content = content.replace(
    /else if \(activeTab === 'receipt'\) list = list\.filter\(v => v\.type === VoucherType\.Receipt\);/,
    `else if (activeTab === 'receipt') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'receipt');`
);
content = content.replace(
    /else if \(activeTab === 'journal'\) list = list\.filter\(v => v\.type === VoucherType\.Journal\);/,
    `else if (activeTab === 'journal') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'journal');`
);
content = content.replace(
    /else if \(activeTab === 'contra'\) list = list\.filter\(v => v\.type === VoucherType\.Contra\);/,
    `else if (activeTab === 'contra') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'contra');`
);
content = content.replace(
    /else if \(activeTab === 'debit_note'\) list = list\.filter\(v => v\.type === VoucherType\.DebitNote\);/,
    `else if (activeTab === 'debit_note') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'debit_note');`
);
content = content.replace(
    /else if \(activeTab === 'credit_note'\) list = list\.filter\(v => v\.type === VoucherType\.CreditNote\);/,
    `else if (activeTab === 'credit_note') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(' ', '_') === 'credit_note');`
);


fs.writeFileSync(file, content);
console.log('Done!');
