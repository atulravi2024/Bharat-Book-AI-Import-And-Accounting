const fs = require('fs');

const file = 'src/components/Operations/VoucherEntry/vouchers/JournalVoucher.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update HistoryModal items filter
const oldHistory = `items={(vouchers || []).filter(v => (typeof v.type === 'string' ? v.type.toLowerCase().replace(/ /g, '_') : v.type) === activeTab)}`;
const newHistory = `items={(vouchers || []).filter(v => ['journal', 'general'].includes(typeof v.type === 'string' ? v.type.toLowerCase().replace(/[\\s_]+/g, '') : ''))}`;
content = content.replace(oldHistory, newHistory);

// Update ofType filter
const oldOfType = `const ofType = allVouchers.filter(v => {
      const vType = (typeof v.type === 'string' ? v.type.toLowerCase().replace(/ /g, '_') : v.type);
      return vType === activeTab;
    });`;
const newOfType = `const ofType = allVouchers.filter(v => {
      const vType = (typeof v.type === 'string' ? v.type.toLowerCase().replace(/[\\s_]+/g, '') : '');
      return ['journal', 'general'].includes(vType);
    });`;
content = content.replace(oldOfType, newOfType);

fs.writeFileSync(file, content);
console.log('Fixed journal filters');
