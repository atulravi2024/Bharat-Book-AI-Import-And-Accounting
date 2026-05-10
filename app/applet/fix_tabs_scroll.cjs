const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (let item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content.replace(/scrollbar-none/g, 'custom-scrollbar');
            newContent = newContent.replace(/no-scrollbar/g, 'custom-scrollbar');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Fixed', fullPath);
            }
        }
    }
}

walkDir(path.join(__dirname, 'components'));
