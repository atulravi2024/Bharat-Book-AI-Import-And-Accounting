const fs = require('fs');

const file = 'src/components/Dashboard/DashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// For vol
const oldVol = `journal: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'Journal'.toLowerCase()).reduce((sum, v) => sum + Number(v.amount?.value || 0), 0),`;
const newVol = `journal: vouchers.filter(v => typeof v.type === 'string' && ['journal', 'general'].includes(v.type.toLowerCase().replace(/[\\s_]+/g, ''))).reduce((sum, v) => sum + Number(v.amount?.value || 0), 0),`;
content = content.replace(oldVol, newVol);

// For counts
const oldCount = `journal: vouchers.filter(v => typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'Journal'.toLowerCase()).length,`;
const newCount = `journal: vouchers.filter(v => typeof v.type === 'string' && ['journal', 'general'].includes(v.type.toLowerCase().replace(/[\\s_]+/g, ''))).length,`;
content = content.replace(oldCount, newCount);

// For trends
const oldTrend = `if (typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === 'journal') acc[d].journal += Number(v.amount?.value || 0);`;
const newTrend = `if (typeof v.type === 'string' && ['journal', 'general'].includes(v.type.toLowerCase().replace(/[\\s_]+/g, ''))) acc[d].journal += Number(v.amount?.value || 0);`;
content = content.replace(oldTrend, newTrend);

fs.writeFileSync(file, content);
console.log('Fixed journal filter in DashboardView');
