import fs from 'fs';
import path from 'path';
function checkT(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) checkT(full);
        else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
            const content = fs.readFileSync(full, 'utf8');
            if (content.includes('t(') || content.includes('t{') || content.includes('t`')) {
                let hasImport = content.includes('useLanguage');
                let hasDecl = content.includes('const { t }') || content.includes('const { language, setLanguage, t }');
                
                if (!hasImport || !hasDecl) {
                    console.log('Error in:', full);
                    console.log('  hasImport:', hasImport);
                    console.log('  hasDecl:', hasDecl);
                }
            }
        }
    }
}
checkT('src');
