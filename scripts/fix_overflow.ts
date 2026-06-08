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
  
  // Replace "shrink-0" with "min-w-0" in the scroll container
  content = content.replace(/justify-start shrink-0 scroll-smooth/g, 'justify-start min-w-0 scroll-smooth');
  
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log('Fixed', file);
});
