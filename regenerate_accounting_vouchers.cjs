const fs = require('fs');
const path = require('path');

const vendors = ['Dell India Pvt Ltd', 'Samsung Electronics', 'Supertech Logistics'];
const customers = ['Reliance Retail Ltd', 'Tata Consultancy Services', 'Future Group'];
const banks = ['HDFC Bank (Current A/c)', 'ICICI Bank (CC A/c)'];
const expenses = ['Office Rent', 'Electricity Charges', 'Internet Expenses'];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

function generateAccountingVouchers(type, count) {
    const vouchers = [];
    
    for (let i = 1; i <= count; i++) {
        const date = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
        const amount = Math.floor(Math.random() * 50000) + 5000;
        const items = [];
        let mainParty = '';
        
        if (type === 'Payment') {
            mainParty = vendors[Math.floor(Math.random() * vendors.length)];
            const bank = banks[Math.floor(Math.random() * banks.length)];
            items.push(
                { crDr: { value: 'Cr' }, ledgerName: { value: bank }, amount: { value: amount } },
                { crDr: { value: 'Dr' }, ledgerName: { value: mainParty }, amount: { value: amount } }
            );
        } else if (type === 'Receipt') {
            mainParty = customers[Math.floor(Math.random() * customers.length)];
            const bank = banks[Math.floor(Math.random() * banks.length)];
            items.push(
                { crDr: { value: 'Dr' }, ledgerName: { value: bank }, amount: { value: amount } },
                { crDr: { value: 'Cr' }, ledgerName: { value: mainParty }, amount: { value: amount } }
            );
        } else if (type === 'Contra') {
            const bank = banks[Math.floor(Math.random() * banks.length)];
            // Cash deposit or withdrawal
            const isDeposit = Math.random() > 0.5;
            
            mainParty = isDeposit ? 'Cash Deposit' : 'Cash Withdrawal';
            
            items.push(
                { crDr: { value: 'Cr' }, ledgerName: { value: isDeposit ? 'Cash A/c' : bank }, amount: { value: amount } },
                { crDr: { value: 'Dr' }, ledgerName: { value: isDeposit ? bank : 'Cash A/c' }, amount: { value: amount } }
            );
        } else if (type === 'Journal') {
            const expense = expenses[Math.floor(Math.random() * expenses.length)];
            mainParty = vendors[Math.floor(Math.random() * vendors.length)];
            items.push(
                { crDr: { value: 'Dr' }, ledgerName: { value: expense }, amount: { value: amount } },
                { crDr: { value: 'Cr' }, ledgerName: { value: mainParty }, amount: { value: amount } }
            );
        }
        
        const typeSlug = type.toLowerCase().replace(/ /g, '_');
        const voucherNo = `${type.substring(0, 3).toUpperCase()}-${2000 + i}`;
        
        const v = {
            id: `${typeSlug}-${i}`,
            date: { value: date },
            type: type,
            partyName: { value: mainParty },
            ledger: { value: mainParty }, // legacy compat
            voucherNumber: { value: voucherNo },
            amount: { value: amount },
            narration: { value: `${type} Entry No. ${voucherNo}` },
            items: items
        };
        vouchers.push(v);
    }
    return vouchers;
}

const payments = generateAccountingVouchers('Payment', 12);
const receipts = generateAccountingVouchers('Receipt', 15);
const contras = generateAccountingVouchers('Contra', 8);
const journals = generateAccountingVouchers('Journal', 10);

fs.writeFileSync('public/sample-data/reports/pay_reg_data.json', JSON.stringify(payments, null, 2));
fs.writeFileSync('public/sample-data/reports/rec_reg_data.json', JSON.stringify(receipts, null, 2));
fs.writeFileSync('public/sample-data/reports/con_reg_data.json', JSON.stringify(contras, null, 2));
fs.writeFileSync('public/sample-data/reports/journal_register.json', JSON.stringify(journals, null, 2));

// For dashboard
fs.writeFileSync('public/sample-data/dashboard/payment_entry.json', JSON.stringify(payments.slice(0, 5), null, 2));
fs.writeFileSync('public/sample-data/dashboard/receipt_entry.json', JSON.stringify(receipts.slice(0, 5), null, 2));
fs.writeFileSync('public/sample-data/dashboard/contra_entry.json', JSON.stringify(contras.slice(0, 5), null, 2));
fs.writeFileSync('public/sample-data/dashboard/journal_entry.json', JSON.stringify(journals.slice(0, 5), null, 2));

console.log("Regenerated varied sample data for accounting vouchers.");
