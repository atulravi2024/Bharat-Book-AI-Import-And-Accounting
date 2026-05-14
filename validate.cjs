const fs = require('fs');
['payment_register', 'receipt_register', 'contra_register'].forEach(name => {
  try {
    JSON.parse(fs.readFileSync('public/sample-data/reports/' + name + '.json'));
    console.log(name + ' is valid');
  } catch (e) {
    console.log(name + ' is INVALID: ' + e.message);
  }
});
