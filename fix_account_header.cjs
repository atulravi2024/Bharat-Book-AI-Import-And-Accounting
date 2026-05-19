const fs = require('fs');

const files = [
    'src/components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
    'src/components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx',
    'src/components/Operations/VoucherEntry/vouchers/ContraVoucher.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace the input with SearchableDropdown
    const oldInput = `<input list="ledger-list" value={headerDetails.cashBankAccount || ''} onChange={(e) => handleHeaderChange('cashBankAccount', e.target.value)} placeholder="Search Cash/Bank Account..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />`;
    
    const newDropdown = `<SearchableDropdown
                  options={ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank'))}
                  value={headerDetails.cashBankAccount || ''}
                  onChange={(value) => {
                    handleHeaderChange('cashBankAccount', value);
                    const r = [...rows];
                    if (r.length > 0) {
                      r[0].ledgerName = value;
                      r[0].crDr = activeTab === 'payment' ? 'Cr' : (activeTab === 'receipt' ? 'Dr' : 'Cr');
                      setRows(r);
                    }
                  }}
                  placeholder="Select Cash/Bank Account..."
                  buttonClassName="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus-within:bg-gray-800 text-left flex justify-between items-center"
                />`;

    content = content.replace(oldInput, newDropdown);
    
    // Also update the grid's handle row 0 change to update cashBankAccount if it's the first row
    // In grid: onChange={(value) => { const r = [...rows]; r[index].ledgerName = value; setRows(r); }}
    const oldRowChange = `onChange={(value) => { const r = [...rows]; r[index].ledgerName = value; setRows(r); }}`;
    const newRowChange = `onChange={(value) => { 
                        const r = [...rows]; 
                        r[index].ledgerName = value; 
                        if (index === 0) handleHeaderChange('cashBankAccount', value);
                        setRows(r); 
                      }}`;
                      
    content = content.split(oldRowChange).join(newRowChange);

    fs.writeFileSync(file, content);
});
console.log('Fixed account header inputs');
