const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components/Masters/ItemMaster/Tabs');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (let f of files) {
    let p = path.join(dir, f);
    let code = fs.readFileSync(p, 'utf8');
    
    // Replace the problematic hover opacity logic with always-visible layout
    let search1 = 'className="flex items-center justify-end space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"';
    let replace1 = 'className="flex items-center justify-end space-x-2"';
    
    // Also check for older versions if they exist
    let search2 = 'className={"flex items-center justify-end space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"}';
    let replace2 = 'className={"flex items-center justify-end space-x-2"}';
    
    // Wait, the table might not have sticky last column. Since they horizontal scroll, the action column might be pushed far right. Did the user mean it's invisible because they have to scroll? Or just invisible because of opacity? "not displaying my action button, a visibility issue. On both modes." Both modes might refer to light/dark mode, or desktop/mobile mode!
    // Mobile definitely doesn't have hover, and on desktop the hover was probably laggy.
    code = code.split(search1).join(replace1).split(search2).join(replace2);
    
    // Also, if the table has horizontal scroll, the Action column should probably be sticky to the right so they can always see it.
    // Replace `text-right">Actions</th>` with `text-right sticky right-0 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">Actions</th>`
    code = code.split('text-right">Actions</th>').join('text-right sticky right-0 z-10 bg-gray-50 dark:bg-gray-900 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">Actions</th>');
    
    code = code.replace(/<td className="p-4">[\s]*<div className="flex items-center justify-end space-x-2"/g, '<td className="p-4 sticky right-0 z-10 bg-white dark:bg-gray-800 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors">\n                                        <div className="flex items-center justify-end space-x-2"');
    
    code = code.replace(/<td className="p-4 text-right">[\s]*<div className="flex items-center justify-end space-x-2"/g, '<td className="p-4 text-right sticky right-0 z-10 bg-white dark:bg-gray-800 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors">\n                                        <div className="flex items-center justify-end space-x-2"');

    // Also strip generic "group-hover" out of the TD so that it doesn't conflict
    
    fs.writeFileSync(p, code);
}
console.log('Action buttons fixed!');
