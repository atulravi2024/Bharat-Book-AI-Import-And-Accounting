const fs = require('fs');
const path = require('path');

const possibleItems = [
    { name: "MacBook Pro 14", rate: 120000 },
    { name: "Dell XPS 15", rate: 145000 },
    { name: "Lenovo ThinkPad X1", rate: 135000 },
    { name: "HP Spectre x360", rate: 115000 },
    { name: "Asus ROG Zephyrus", rate: 160000 },
    { name: "Acer Predator Helios", rate: 125000 },
    { name: "Netgear Router", rate: 5000 },
    { name: "Logitech MX Master 3S", rate: 8500 },
    { name: "Office Chair Ergonomic", rate: 12000 },
    { name: "Standing Desk", rate: 35000 },
];

const partyVendors = [
    "Dell India Pvt Ltd", 
    "Samsung Electronics", 
    "Supertech Logistics",
    "Tech Data India",
    "Redington India"
];

const partyCustomers = [
    "Reliance Retail Ltd",
    "Tata Consultancy Services",
    "Future Group",
    "Infosys Ltd",
    "Wipro Technologies"
];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

function generateVouchers(type, count, isPurchase) {
    const vouchers = [];
    const parties = isPurchase ? partyVendors : partyCustomers;
    
    for (let i = 1; i <= count; i++) {
        const date = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
        const numItems = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let totalAmount = 0;
        
        for (let j = 0; j < numItems; j++) {
            const itemDef = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            const qty = Math.floor(Math.random() * 5) + 1;
            const amount = qty * itemDef.rate;
            totalAmount += amount;
            
            items.push({
                name: { value: itemDef.name },
                quantity: { value: qty },
                rate: { value: itemDef.rate },
                amount: { value: amount }
            });
        }
        
        const partyName = parties[Math.floor(Math.random() * parties.length)];
        const voucherNo = `${type.toUpperCase().substring(0, 3)}-${1000 + i}`;
        
        const v = {
            id: `${type.toLowerCase().replace(/ /g, '_')}-${i}`,
            date: { value: date },
            type: type,
            partyName: { value: partyName },
            voucherNumber: { value: voucherNo },
            amount: { value: totalAmount },
            narration: { value: `${type} for ${partyName} No. ${voucherNo}` },
            items: items
        };
        vouchers.push(v);
    }
    return vouchers;
}

const purchaseData = generateVouchers('Purchase', 10, true);
const salesData = generateVouchers('Sales', 15, false);
const debitNoteData = generateVouchers('Debit Note', 8, true); // Purchase Returns etc to vendor
const creditNoteData = generateVouchers('Credit Note', 7, false); // Sales Returns from customer

fs.writeFileSync('public/sample-data/reports/purchase_register.json', JSON.stringify(purchaseData, null, 2));
fs.writeFileSync('public/sample-data/reports/sales_register.json', JSON.stringify(salesData, null, 2));
fs.writeFileSync('public/sample-data/reports/dr_note_reg_data.json', JSON.stringify(debitNoteData, null, 2));
fs.writeFileSync('public/sample-data/reports/cr_note_reg_data.json', JSON.stringify(creditNoteData, null, 2));

// For dashboard
fs.writeFileSync('public/sample-data/dashboard/purchase_entry.json', JSON.stringify(purchaseData.slice(0, 5), null, 2));
fs.writeFileSync('public/sample-data/dashboard/sales_entry.json', JSON.stringify(salesData.slice(0, 5), null, 2));
fs.writeFileSync('public/sample-data/dashboard/dr_note_entry_data.json', JSON.stringify(debitNoteData.slice(0, 5), null, 2));
fs.writeFileSync('public/sample-data/dashboard/cr_note_entry_data.json', JSON.stringify(creditNoteData.slice(0, 5), null, 2));

console.log("Regenerated varied sample data for vouchers and notes.");
