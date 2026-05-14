const fs = require('fs');
['payment_register', 'receipt_register', 'contra_register', 'credit_note_register', 'debit_note_register'].forEach(name => {
  const p = 'public/sample-data/reports/' + name + '.json';
  if (fs.existsSync(p)) {
    console.log(name, fs.statSync(p).size);
  } else {
    console.log(name, 'Missing');
  }
});
