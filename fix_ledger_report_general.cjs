const fs = require('fs');

const file = 'src/components/Reports/BankVouchers/LedgerReportView.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldJournal = `else if (activeTab === 'journal') list = list.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/ /g, '_') === 'journal');`;
const newJournal = `else if (activeTab === 'journal') list = list.filter(v => typeof v.type === 'string' && ['journal', 'general'].includes(v.type.toLowerCase().replace(/[\\s_]+/g, '')));`;
content = content.replace(oldJournal, newJournal);

fs.writeFileSync(file, content);
console.log('Fixed journal in LedgerReportView');
