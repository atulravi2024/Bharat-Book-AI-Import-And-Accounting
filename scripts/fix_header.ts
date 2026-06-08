import fs from 'fs';
import path from 'path';

const files = [
  'src/components/Settings/DataEngineSettings/MappingSettings.tsx',
  'src/components/Settings/DataEngineSettings/ImportSettings.tsx',
  'src/components/Settings/WorkspaceSettings/FirmSettings/index.tsx',
  'src/components/Settings/WorkspaceSettings/GeneralSettings/index.tsx',
  'src/components/Settings/WorkspaceSettings/UISettings.tsx',
  'src/components/Settings/OrganizationSettings/UserSettings.tsx',
  'src/components/Settings/OrganizationSettings/SecuritySettings.tsx',
  'src/components/Settings/SupportSystemSettings/AlertChannel.tsx',
  'src/components/Settings/WorkspaceSettings/FormDetailSettings.tsx'
];

files.forEach(file => {
  const absolutePath = path.resolve(file);
  if (!fs.existsSync(absolutePath)) {
    console.log('Skipping', file);
    return;
  }
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // Fix parent justify-end truncating scrolling bug
  content = content.replace(/className="min-w-0 flex-1 flex items-center justify-end"/g, 'className="min-w-0 flex-1 flex items-center"');
  content = content.replace(/className="w-full sm:w-auto min-w-0 flex-1 flex justify-center sm:justify-end items-center [^"]+"/g, 'className="min-w-0 flex-1 flex items-center"');
  
  // Fix child left alignment when parent shrinks
  content = content.replace(/className="w-full sm:w-auto flex items-center bg-gray-100\/80/g, 'className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100\/80');

  // Fix 30% max-w restriction on title that causes truncation
  content = content.replace(/shrink-0 sm:max-w-\[30\%\]/g, 'shrink-0 min-w-0 md:max-w-md');
  content = content.replace(/min-w-0 sm:max-w-\[30\%\] shrink-0/g, 'shrink-0 min-w-0 md:max-w-md');

  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log('Fixed', file);
});
