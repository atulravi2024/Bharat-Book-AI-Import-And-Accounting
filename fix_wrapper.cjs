const fs = require('fs');
const path = require('path');

const targetDir = 'components/Operations/VoucherEntry/vouchers';
const files = fs.readdirSync(targetDir);

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(targetDir, file);
    let original = fs.readFileSync(filePath, 'utf8');

    const startRegex = /<div className="max-w-\[1400px\] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-screen pb-32">[\s\S]*?\{\/\* Tabs Navigation removed for explicit ([a-zA-Z]+) component \*\/\}/;
    
    original = original.replace(startRegex, '<>');
    
    // Now we must replace the VERY LAST `</div>` with `</>`
    const lastDivIdx = original.lastIndexOf('</div>');
    if (lastDivIdx !== -1) {
        original = original.substring(0, lastDivIdx) + '</>' + original.substring(lastDivIdx + 6);
    }
    
    fs.writeFileSync(filePath, original);
});

console.log('Fixed wrapper in sub-files.');
