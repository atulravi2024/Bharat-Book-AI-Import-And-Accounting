const fs = require('fs');
const path = require('path');

const dir = 'public/sample-data/dashboard';

const inventoryTypes = ['Purchase', 'Sales', 'Debit Note', 'Credit Note', 'Physical Stock', 'Stock Journal', 'Delivery Note', 'Receipt Note', 'Rejections In', 'Rejections Out', 'Consumption', 'Scrap', 'Transfer'];

const parties = ["Vendor Party", "Client Party", "Sample Party", "Demo Party", "Tech Solutions", "Global Dist", "Prime Systems", "Apex Corp", "Nexus Ltd", "Zenith Inc"];
const items = ["iPhone 15 Pro 256GB", "Samsung Galaxy S23 Ultra", "Sony Bravia 65\\\" 4K Smart TV", "LG 55\\\" OLED TV C3", "Dell XPS 15 Laptop", "MacBook Air M2", "Lenovo ThinkPad X1 Carbon", "Canon EOS R5 Mirrorless Camera", "Nikon Z8 Body Only", "Sony WH-1000XM5 Headphones"];

fs.readdirSync(dir).filter(f => f.endsWith('.json')).forEach(file => {
  if (file === 'sales_entry.json') return; // Skip sales entry as requested
  if (file === 'demo_vouchers.json') return; // Skip demo vouchers

  const filePath = path.join(dir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(data)) return;

    const baseEntry = data[0] || {};
    const type = baseEntry.type || "Journal";
    const isInv = inventoryTypes.includes(type) || file.includes('stock') || file.includes('scrap') || file.includes('transfer') || file.includes('rejections') || file.includes('consumption') || file.includes('note');
    
    const newEntries = [];
    
    for (let i = 0; i < 10; i++) {
        const id = file.replace('.json', '') + '-' + (i + 1);
        const party = parties[i % parties.length];
        const item = items[i % items.length];
        
        let newEntry = {
            id: id,
            date: { value: `2024-05-${String(10 + i).padStart(2, '0')}` },
            type: type,
            amount: { value: 1000 * (i + 1) }
        };

        if (isInv) {
            newEntry.partyName = { value: party };
            newEntry.items = [
                {
                    name: { value: item },
                    quantity: { value: 10 },
                    rate: { value: (100 * (i + 1)) },
                    amount: { value: 1000 * (i + 1) }
                }
            ];
            if (['Credit Note', 'Debit Note'].includes(type) || file.includes('note')) {
                 newEntry.partyName = { value: party };
            }
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
                newEntry.ledger = { value: party }; // Payment, Receipt
            }
        }
        
        // Additional specific fixes
        if (file === 'purchase_entry.json') newEntry.type = 'Purchase';
        if (file === 'receipt_entry.json') newEntry.type = 'Receipt';
        if (file === 'payment_entry.json') newEntry.type = 'Payment';
        
        newEntries.push(newEntry);
    }

    fs.writeFileSync(filePath, JSON.stringify(newEntries, null, 2));
    console.log("Updated", file);
  } catch (e) {
    console.error("Error reading", file, e);
  }
});
