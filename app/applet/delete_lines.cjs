const fs = require('fs');
const file = 'components/Masters/LedgerMaster/Tabs/LocationsTab.tsx';
let data = fs.readFileSync(file, 'utf8');
const lines = data.split('\n');
const start = 588; // 0-indexed is 588 for line 589
const end = 1759;
lines.splice(start, end - start + 1);
fs.writeFileSync(file, lines.join('\n'));
