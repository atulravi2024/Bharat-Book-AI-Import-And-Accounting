const fs = require('fs');

const possibleItems = [
    "Lenovo ThinkPad X1", "Logitech MX Master 3S", "Dell XPS 15", "MacBook Pro 16",
    "Samsung 32-inch Monitor", "LG 27-inch 4K Monitor", "Apple Magic Keyboard",
    "Keychron K2 Mechanical Keyboard", "Sony WH-1000XM5 Headphones",
    "Jabra Evolve2 65 Headset", "WD 2TB External Hard Drive", "SanDisk 1TB SSD",
    "HDMI Cable 2m", "USB-C Hub", "Ergonomic Office Chair", "Standing Desk",
    "APC UPS 1000VA", "Netgear Nighthawk Router", "HP LaserJet Pro Printer",
    "Epson EcoTank Printer"
];

function addItemsToVouchers(filePath) {
    if (!fs.existsSync(filePath)) return;
    try {
        let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        content = content.map((v, i) => {
            const vType = (typeof v.type === 'string' ? v.type.toLowerCase().trim() : 'sales');
            const isInv = ['sales', 'purchase', 'credit note', 'debit note', 'sales order', 'purchase order', 'stock journal'].includes(vType);
            if (isInv) {
                const amt = Number(v.amount?.value || Math.floor(Math.random() * 5000) + 1000);
                
                // create 1 to 3 items
                const numItems = (i % 3) + 1;
                v.items = [];
                let remainingAmt = amt;
                
                for(let j=0; j<numItems; j++) {
                    const itemAmt = j === numItems - 1 ? remainingAmt : Math.floor(amt / numItems);
                    remainingAmt -= itemAmt;
                    
                    const qty = Math.floor(Math.random() * 3) + 1;
                    const rate = +(itemAmt / qty).toFixed(2);
                    
                    const itemName = possibleItems[(i + j * 7) % possibleItems.length];
                    v.items.push({
                        "name": { "value": itemName },
                        "quantity": { "value": qty },
                        "rate": { "value": rate },
                        "amount": { "value": itemAmt }
                    });
                }
                v.amount = { "value": v.items.reduce((s, it) => s + (it.amount?.value || 0), 0) };
            }
            return v;
        });
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        console.log(`Updated items in ${filePath}`);
    } catch(e) {
        console.log(`Failed to update ${filePath}: ${e}`);
    }
}

['public/sample-data/reports/vouchers.json', 
 'public/sample-data/reports/financial_vouchers.json', 
 'public/sample-data/reports/cr_note_reg_data.json',
 'public/sample-data/reports/purchase_register.json',
 'public/sample-data/demo_vouchers.json',
 'public/sample-data/reports/sales_register.json',
 'public/sample-data/reports/day_book.json',
 'public/sample-data/dashboard/cr_note_entry_data.json',
 'public/sample-data/dashboard/purchase_entry.json',
 'public/sample-data/dashboard/sales_entry.json',
 'public/sample-data/reports/dr_note_reg_data.json',
 'public/sample-data/dashboard/dr_note_entry_data.json'].forEach(addItemsToVouchers);
