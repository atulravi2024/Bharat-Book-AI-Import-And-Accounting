const fs = require('fs');

const dayBook = JSON.parse(fs.readFileSync('public/sample-data/reports/day_book.json', 'utf8'));

// Payment
const paymentData = dayBook.map((v, i) => ({
  ...v,
  id: 'pay_reg-' + i,
  type: 'Payment',
  paymentMode: { value: 'Cash' },
  ledger: { value: 'Vendor A' },
  amount: { value: 2000 }
}));
fs.writeFileSync('public/sample-data/reports/payment_register.json', JSON.stringify(paymentData, null, 2));

// Receipt
const receiptData = dayBook.map((v, i) => ({
  ...v,
  id: 'rec_reg-' + i,
  type: 'Receipt',
  paymentMode: { value: 'Bank Transfer' },
  ledger: { value: 'Customer B' },
  amount: { value: 5000 }
}));
fs.writeFileSync('public/sample-data/reports/receipt_register.json', JSON.stringify(receiptData, null, 2));

// Contra
const contraData = dayBook.map((v, i) => ({
  ...v,
  id: 'con_reg-' + i,
  type: 'Contra',
  paymentMode: { value: 'Cash' },
  debitLedger: { value: 'Bank A/c' },
  creditLedger: { value: 'Cash A/c' },
  amount: { value: 10000 }
}));
fs.writeFileSync('public/sample-data/reports/contra_register.json', JSON.stringify(contraData, null, 2));

console.log("Done");
