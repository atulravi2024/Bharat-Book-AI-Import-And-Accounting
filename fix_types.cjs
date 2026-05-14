const fs = require('fs');

function fixType(file, type) {
  const p = 'public/sample-data/reports/' + file;
  if (!fs.existsSync(p)) return;
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const updated = data.map(v => ({ ...v, type: type }));
  fs.writeFileSync(p, JSON.stringify(updated, null, 2));
  console.log('Fixed', p);
}

fixType('debit_note_register.json', 'Debit Note');
fixType('credit_note_register.json', 'Credit Note');
