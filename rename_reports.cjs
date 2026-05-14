const fs = require('fs');

const renames = {
  'payment_register.json': 'pay_reg_data.json',
  'receipt_register.json': 'rec_reg_data.json',
  'contra_register.json': 'con_reg_data.json'
};

for (const [oldName, newName] of Object.entries(renames)) {
  const pOld = `public/sample-data/reports/${oldName}`;
  const pNew = `public/sample-data/reports/${newName}`;
  if (fs.existsSync(pOld)) {
    fs.renameSync(pOld, pNew);
    console.log(`Renamed ${oldName} to ${newName}`);
  }
}
