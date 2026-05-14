const fs = require('fs');
const nav = JSON.parse(fs.readFileSync('src/sample-data/navigation_meta.json', 'utf-8'));
const folders = {
  reports: nav.reportIds,
  dashboard: nav.entryIds,
  'item-master': nav.itemMasterKeys,
  'ledger-master': nav.sampleIds.filter(id => !nav.itemMasterKeys.includes(id))
};

for (const [folder, ids] of Object.entries(folders)) {
  for (let id of ids) {
    let filename = id;
    if (id === 'gst') filename = 'hsn';
    const path = `public/sample-data/${folder}/${filename}.json`;
    if (!fs.existsSync(path)) {
      // Basic dummy data generator based on folder
      let data = [];
      if (folder === 'item-master') {
         data = [{
           id: `${id}-sample-1`,
           name: `Sample ${id.charAt(0).toUpperCase() + id.slice(1)} 1`,
           code: `${id.substring(0,3).toUpperCase()}-001`,
           brand: 'Brand X',
           category: 'Category A',
           uom: 'PCS',
           minStock: 10,
           maxStock: 100,
           reorderLevel: 20,
           salesRate: 1500,
           purchaseRate: 1200,
           mrp: 1999
         }];
      } else if (folder === 'ledger-master') {
         data = [{
           id: `${id}-sample-1`,
           name: `Sample ${id} 1`,
           group: 'Sundry Debtors',
           address: 'Sample Address'
         }];
      } else if (folder === 'reports' || folder === 'dashboard') {
         data = [{
           id: `${id}-sample-1`,
           date: { value: '2024-05-15' },
           type: 'Journal',
           partyName: { value: 'Sample Party' },
           amount: { value: 1500 },
           narration: { value: `Generated for ${id}` }
         }];
      }
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      console.log(`Created: ${path} with dummy data`);
    }
  }
}
