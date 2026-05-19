const fs = require('fs');

const banksList = [
    { id: 'bank-1', name: 'Bank A/c', group: 'Bank Accounts', accountNo: '123456789', ifsc: 'HDFC0001', branch: 'Main' },
    { id: 'bank-2', name: 'HDFC Bank', group: 'Bank Accounts', accountNo: '987654321', ifsc: 'HDFC0002', branch: 'East' }
];

fs.writeFileSync('public/sample-data/ledger-master/banks.json', JSON.stringify(banksList, null, 2));
console.log("banks created.");
