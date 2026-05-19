const fs = require('fs');
const path = require('path');

const dir = 'public/sample-data/dashboard';

const inventoryTypes = ['Purchase', 'Sales', 'Debit Note', 'Credit Note', 'Physical Stock', 'Stock Journal', 'Delivery Note', 'Receipt Note', 'Rejections In', 'Rejections Out', 'Consumption', 'Scrap', 'Transfer'];

fs.readdirSync(dir).filter(f => f.endsWith('.json')).forEach(file => {
  const filePath = path.join(dir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(data)) return;

    data.forEach(entry => {
      const isInv = inventoryTypes.includes(entry.type) || file.includes('stock') || file.includes('scrap') || file.includes('transfer') || file.includes('rejections') || file.includes('consumption');
      
      if (isInv) {
        if (!entry.items) {
           entry.items = [
             {
               "name": { "value": "Sample Item " + entry.type },
               "quantity": { "value": 10 },
               "rate": { "value": (entry.amount?.value || 1000) / 10 },
               "amount": { "value": (entry.amount?.value || 1000) }
             }
           ];
        }
      } else {
        // Remove items if mistakenly added
        if (entry.items && entry.type === 'Journal') {
           delete entry.items;
        }

        // Accounting types: payment, receipt, contra, journal
        if (!entry.ledger && entry.partyName) {
           entry.ledger = entry.partyName;
        }
        if (!entry.ledger && entry.type === 'Contra') {
           entry.ledger = entry.creditLedger || { value: 'Bank A/c' };
        }
        if (!entry.ledger && entry.type === 'Journal') {
           entry.ledger = entry.debitLedger || { value: 'Bank A/c' };
        }
      }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Updated", file);
  } catch (e) {
    console.error("Error reading", file, e);
  }
});
