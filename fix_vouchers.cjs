const fs = require('fs');

const parties = ["Vendor Party", "Client Party", "Sample Party", "Demo Party", "Tech Solutions", "Global Dist", "Prime Systems", "Apex Corp", "Nexus Ltd", "Zenith Inc"];
const items = ["iPhone 15 Pro 256GB", "Samsung Galaxy S23 Ultra", "Sony Bravia 65\\\" 4K Smart TV", "LG 55\\\" OLED TV C3", "Dell XPS 15 Laptop", "MacBook Air M2", "Lenovo ThinkPad X1 Carbon", "Canon EOS R5 Mirrorless Camera", "Nikon Z8 Body Only", "Sony WH-1000XM5 Headphones"];

const newVouchers = [];
for (let i = 0; i < 10; i++) {
    const id = 'vouchers-sample-' + (i + 1);
    const party = parties[i % parties.length];
    const item = items[i % items.length];
    
    // Mix types
    const types = ['Purchase', 'Payment', 'Receipt', 'Journal', 'Contra', 'Credit Note', 'Debit Note'];
    const type = types[i % types.length];

    let newEntry = {
        id: id,
        date: { value: `2024-05-${String(10 + i).padStart(2, '0')}` },
        type: type,
        amount: { value: 1500 * (i + 1) },
        narration: { value: `Generated for ${type}` }
    };

    if (['Purchase', 'Credit Note', 'Debit Note'].includes(type)) {
        newEntry.partyName = { value: party };
        newEntry.items = [
            {
                name: { value: item },
                quantity: { value: 10 },
                rate: { value: (150 * (i + 1)) },
                amount: { value: 1500 * (i + 1) }
            }
        ];
    } else {
        newEntry.partyName = { value: party };
        if (type === 'Contra') {
            newEntry.debitLedger = { value: 'Cash A/c' };
            newEntry.creditLedger = { value: 'Bank A/c' };
            newEntry.ledger = { value: 'Bank A/c' };
        } else if (type === 'Journal') {
            newEntry.debitLedger = { value: party };
            newEntry.creditLedger = { value: 'Sales A/c' };
            newEntry.ledger = { value: party };
        } else {
            newEntry.ledger = { value: party };
        }
    }
    
    newVouchers.push(newEntry);
}

fs.writeFileSync('public/sample-data/reports/vouchers.json', JSON.stringify(newVouchers, null, 2));
console.log("Updated vouchers.json");
