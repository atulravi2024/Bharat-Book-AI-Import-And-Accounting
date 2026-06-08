import fs from 'fs';
import path from 'path';

const files = [
  'src/components/Settings/SettingsView/index.tsx',
  'src/components/Dashboard/DashboardView.tsx',
  'src/app/AppViewRouter.tsx',
  'src/components/Masters/ItemMaster/ItemMasterView.tsx',
  'src/components/Masters/LedgerMaster/LedgerMasterView.tsx',
  'src/components/Operations/BulkOperation/BulkOperationView.tsx',
  'src/components/Reports/Items/ItemReportView.tsx',
  'src/components/Reports/BankVouchers/LedgerReportView.tsx',
];

files.forEach(file => {
  const absolutePath = path.resolve(file);
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  content = content.replace(/max-w-7xl mr-auto/g, 'max-w-7xl mx-auto');
  content = content.replace(/max-w-\[1600px\] mr-auto/g, 'max-w-[1600px] mx-auto');
  
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log('Fixed', file);
});
