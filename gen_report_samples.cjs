const fs = require('fs');
const path = require('path');

const dir = 'public/sample-data/reports';

const filesToUpdate = [
   'con_reg_data.json',
   'cr_note_reg_data.json',
   'dr_note_reg_data.json',
   'journal_register.json',
   'pay_reg_data.json',
   'purchase_register.json',
   'rec_reg_data.json'
];

const parties = ["Vendor Party", "Client Party", "Sample Party", "Demo Party", "Tech Solutions", "Global Dist", "Prime Systems", "Apex Corp", "Nexus Ltd", "Zenith Inc"];
const items = ["iPhone 15 Pro 256GB", "Samsung Galaxy S23 Ultra", "Sony Bravia 65\\\" 4K Smart TV", "LG 55\\\" OLED TV C3", "Dell XPS 15 Laptop", "MacBook Air M2", "Lenovo ThinkPad X1 Carbon", "Canon EOS R5 Mirrorless Camera", "Nikon Z8 Body Only", "Sony WH-1000XM5 Headphones"];

filesToUpdate.forEach(file => {
  const filePath = path.join(dir, file);
  try {
    let type = 'Journal';
    if (file === 'con_reg_data.json') type = 'Contra';
    else if (file === 'cr_note_reg_data.json') type = 'Credit Note';
    else if (file === 'dr_note_reg_data.json') type = 'Debit Note';
    else if (file === 'journal_register.json') type = 'Journal';
    else if (file === 'pay_reg_data.json') type = 'Payment';
    else if (file === 'rec_reg_data.json') type = 'Receipt';
    else if (file === 'purchase_register.json') type = 'Purchase';

    const isInv = ['Purchase', 'Credit Note', 'Debit Note'].includes(type);

    const newEntries = [];
    
    for (let i = 0; i < 10; i++) {
        const id = file.replace('.json', '') + '-' + (i + 1);
        const party = parties[i % parties.length];
        const item = items[i % items.length];
        
        // Base structure based on what loadRecord expects for registers/vouchers
        let newEntry = {
            id: id,
            date: { value: `2024-05-${String(10 + i).padStart(2, '0')}` },
            type: type,
            amount: { value: 2000 * (i + 1) }
        };

        if (isInv) {
            newEntry.partyName = { value: party };
            newEntry.items = [
                {
                    name: { value: item },
                    quantity: { value: 10 },
                    rate: { value: (200 * (i + 1)) },
                    amount: { value: 2000 * (i + 1) }
                }
            ];
        } else {
            // Accounting types
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
        
        newEntries.push(newEntry);
    }

    fs.writeFileSync(filePath, JSON.stringify(newEntries, null, 2));
    console.log("Updated", file);
  } catch (e) {
    if (e.code === 'ENOENT') {
        console.warn("Skipping file not found:", file);
    } else {
        console.error("Error reading", file, e);
    }
  }
});
