const fs = require('fs');

const dFile = 'src/components/Dashboard/DashboardView.tsx';
let dContent = fs.readFileSync(dFile, 'utf8');

dContent = dContent.replace(
    /typeof v\.type === 'string' && v\.type\.toLowerCase\(\)\.replace\(' ', ''\) === '([a-zA-Z]+)'\.toLowerCase\(\)/g,
    "typeof v.type === 'string' && v.type.toLowerCase().replace(/[\\s_]+/g, '') === '$1'.toLowerCase()"
);

fs.writeFileSync(dFile, dContent);
console.log('done dashboard counts update!');
