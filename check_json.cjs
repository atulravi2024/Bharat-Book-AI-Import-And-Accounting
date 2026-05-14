const fs = require('fs');
const navMeta = JSON.parse(fs.readFileSync('src/sample-data/navigation_meta.json', 'utf8'));
const activeSamples = [
    'ledgers', 'items', 'bom', 'warehouses', 'parties', 
    'balance_sheet', 'profit_loss', 'cash_flow', 'bank_flow', 'trial_balance', 
    'sales_register', 'purchase_register', 'financial_vouchers', 'gstr1',
    'day_book', 'journal_register', 'debit_note_register', 'credit_note_register',
    'payment_register', 'receipt_register', 'contra_register', 'audit_trail',
    'item_vouchers', 'stock_summary', 'item_movement', 'low_stock', 'inventory_valuation',
    'bank_vouchers', 'raw_bank', 'auto_match', 'missing_master', 'unidentified', 'to_classify', 'reconcile'
];
let hasError = false;
activeSamples.forEach(id => {
    const isReport = navMeta.reportIds.includes(id);
    const isEntry = navMeta.entryIds.includes(id);
    const isItemMaster = navMeta.itemMasterKeys.includes(id);

    const folder = isReport ? 'reports' : (isEntry ? 'dashboard' : (isItemMaster ? 'item-master' : 'ledger-master'));
    const filename = (isReport || isEntry) ? id : (id === 'gst' ? 'hsn' : id);
    const p = `public/sample-data/${folder}/${filename}.json`;
    if (fs.existsSync(p)) {
        try {
            JSON.parse(fs.readFileSync(p, 'utf8'));
        } catch (e) {
            console.log('INVALID JSON:', p);
            hasError = true;
        }
    }
});
if (!hasError) console.log('All files are valid JSON!');
