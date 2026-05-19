const fs = require('fs');
const path = require('path');

const partiesList = ["Vendor Party", "Client Party", "Sample Party", "Demo Party", "Tech Solutions", "Global Dist", "Prime Systems", "Apex Corp", "Nexus Ltd", "Zenith Inc"];
const ledgersList = ["Cash A/c", "Bank A/c", "Sales A/c", "Purchase A/c", ...partiesList];

const ledgerMasters = ledgersList.map((name, i) => {
    let group = 'Sundry Debtors';
    if (name.includes('Vendor')) group = 'Sundry Creditors';
    if (name === 'Cash A/c') group = 'Cash-in-hand';
    if (name === 'Bank A/c') group = 'Bank Accounts';
    if (name === 'Sales A/c') group = 'Sales Accounts';
    if (name === 'Purchase A/c') group = 'Purchase Accounts';

    return {
        id: `ldg-${i+1}`,
        name: name,
        group: group,
        openingBalance: 0,
        type: "Ledger",
        status: "Active"
    };
});

const partiesMasters = partiesList.map((name, i) => {
    let group = 'Sundry Debtors';
    if (name.includes('Vendor')) group = 'Sundry Creditors';

    return {
        id: `party-${i+1}`,
        name: name,
        group: group,
        openingBalance: 0,
        type: "Party",
        status: "Active",
        contactPerson: "Contact " + name,
        phone: "1234567890",
        email: "contact@" + name.replace(/\s+/g, '').toLowerCase() + ".com"
    };
});

// Save ldg_masters
fs.writeFileSync('public/sample-data/ledger-master/ldg_masters.json', JSON.stringify(ledgerMasters, null, 2));

// Save parties (and vendors)
const debtors = partiesMasters.filter(p => p.group === 'Sundry Debtors');
const creditors = partiesMasters.filter(p => p.group === 'Sundry Creditors');

fs.writeFileSync('public/sample-data/ledger-master/parties.json', JSON.stringify(debtors, null, 2));
fs.writeFileSync('public/sample-data/ledger-master/vendors.json', JSON.stringify(creditors, null, 2));

console.log("Master linked data created successfully.");
