const fs = require('fs');

const FILES = [
    'src/components/Operations/VoucherEntry/vouchers/PaymentVoucher.tsx',
    'src/components/Operations/VoucherEntry/vouchers/ReceiptVoucher.tsx'
];

FILES.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');

    const oldStr = `<SearchableDropdown
                      options={(activeTab === 'payment' || activeTab === 'receipt') && index === 0 ? ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank')) : [...ledgerMasters.filter(l => !(l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank'))), ...partyMasters]}
                      value={row.ledgerName || ''}
                      onChange={(value) => { 
                        const r = [...rows]; 
                        r[index].ledgerName = value; 
                        if (index === 0) handleHeaderChange('cashBankAccount', value);
                        setRows(r); 
                      }}
                      placeholder="Select ledger..."
                      buttonClassName="w-full min-w-[300px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all dark:focus-within:bg-gray-700"
                    />`;

    const newCode = `{((activeTab === 'payment' || activeTab === 'receipt') && index === 0) ? (
                      <div className="w-full min-w-[300px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        {row.ledgerName || 'Select Cash/Bank in Header'}
                      </div>
                    ) : (
                      <SearchableDropdown
                        options={[...ledgerMasters.filter(l => !(l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank'))), ...partyMasters]}
                        value={row.ledgerName || ''}
                        onChange={(value) => { 
                          const r = [...rows]; 
                          r[index].ledgerName = value; 
                          setRows(r); 
                        }}
                        placeholder="Select ledger..."
                        buttonClassName="w-full min-w-[300px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all dark:focus-within:bg-gray-700"
                      />
                    )}`;

    if (c.includes(oldStr)) {
        c = c.replace(oldStr, newCode);
        fs.writeFileSync(f, c);
        console.log('Fixed', f);
    } else {
        console.log('Could not find string in', f);
    }
});
