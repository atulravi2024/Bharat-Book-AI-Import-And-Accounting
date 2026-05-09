
const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
                results = results.concat(walk(file));
            }
        } else {
            results.push(file);
        }
    });
    return results;
}

const allFiles = walk('.');
allFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('innerText') && content.match(/innerText\s*=/)) {
            console.log(`FOUND in ${file}`);
            const lines = content.split('\n');
            lines.forEach((line, i) => {
                if (line.includes('innerText') && line.match(/innerText\s*=/)) {
                    console.log(`  L${i+1}: ${line.trim()}`);
                }
            });
        }
    } catch (e) {}
});
