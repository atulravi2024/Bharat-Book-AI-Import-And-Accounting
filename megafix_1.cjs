const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components/Masters/ItemMaster/Tabs');

function processFile(filename, replacements) {
    const p = path.join(dir, filename);
    if (!fs.existsSync(p)) return;
    let code = fs.readFileSync(p, 'utf8');
    
    // global table fixes
    code = code.replace(/<table className="w-full text-left border-collapse">/g, '<table className="w-full text-left border-collapse whitespace-nowrap">');
    
    for (let r of replacements) {
        code = code.split(r[0]).join(r[1]);
    }
    fs.writeFileSync(p, code);
    console.log("Processed " + filename);
}

// 1. BillOfMaterialsTab.tsx
processFile('BillOfMaterialsTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">BOM Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product / Output</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Materials & Routing</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">BOM Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Description</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Product</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Output</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Components</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Routing</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Status</th>`
],
[
`<td className="p-4">
                                        <div className="font-bold text-gray-900 text-sm dark:text-white">{m.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{m.description}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="font-medium">{getItemName(m.itemId)}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Produces: {m.quantityProduced} units</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex gap-2">
                                            <div className="bg-gray-100 inline-block px-2 py-1 rounded font-mono text-[10px] font-bold dark:bg-gray-900">{m.components?.length || 0} Components</div>
                                            {m.routing && m.routing.length > 0 && <div className="bg-purple-50 text-purple-700 inline-block px-2 py-1 rounded font-mono text-[10px] font-bold dark:bg-purple-900/30 dark:text-purple-400">{m.routing.length} Operations</div>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        {m.isActive ? 
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold ring-1 ring-green-100">Active</span> :
                                            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs font-bold ring-1 ring-gray-200">Inactive</span>
                                        }
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm dark:text-white">{m.name}</td>
                                    <td className="p-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{m.description}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-medium">{getItemName(m.itemId)}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.quantityProduced} units</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200"><span className="bg-gray-100 inline-block px-2 py-1 rounded font-mono text-[10px] font-bold dark:bg-gray-900">{m.components?.length || 0}</span></td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.routing && m.routing.length > 0 ? <span className="bg-purple-50 text-purple-700 inline-block px-2 py-1 rounded font-mono text-[10px] font-bold dark:bg-purple-900/30 dark:text-purple-400">{m.routing.length}</span> : null}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                        {m.isActive ? 
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-bold ring-1 ring-green-100 uppercase">Active</span> :
                                            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-[10px] font-bold ring-1 ring-gray-200 uppercase">Inactive</span>
                                        }
                                    </td>`
]
]);

// CategoriesTab.tsx
processFile('CategoriesTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tree & Status</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Status</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Parent</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">HSN</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex space-x-2">
                <span className={\`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase \${m.status==='Inactive' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}\`}>{m.status || 'Active'}</span>
            </div>
            {m.parentCategory && <div className="text-[11px] mt-1 text-gray-500 font-medium">Parent: {m.parentCategory}</div>}
            {m.hsnCode && <div className="text-[10px] mt-0.5 font-mono text-gray-400">HSN: {m.hsnCode}</div>}
        </td>`,
`<td className="p-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                    {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                </div>
                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</div>
            </div>
        </td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            <span className={\`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase \${m.status==='Inactive' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}\`}>{m.status || 'Active'}</span>
        </td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-medium">{m.parentCategory}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.hsnCode}</td>`
]
]);

// ColorsTab.tsx
processFile('ColorsTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Hex View</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Color</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Hex</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Family</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded border border-gray-200 shadow-sm" style={{backgroundColor: m.hex || '#000'}}></div>
                <span className="font-mono text-xs">{m.hex}</span>
            </div>
            {m.colorFamily && <div className="text-[10px] mt-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded inline-block dark:bg-gray-700 dark:text-gray-300">Family: {m.colorFamily}</div>}
        </td>`,
`<td className="p-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</div>
            </div>
        </td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            <div className="w-6 h-6 rounded border border-gray-200 shadow-sm" style={{backgroundColor: m.hex || '#000'}}></div>
        </td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono text-xs">{m.hex}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.colorFamily && <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] dark:bg-gray-700 dark:text-gray-300">{m.colorFamily}</span>}</td>`
]
]);

// DimensionsTab.tsx
processFile('DimensionsTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">L x W x H</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Length</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Width</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Height</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Unit</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200"><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">{m.l || 0} x {m.w || 0} x {m.h || 0} {m.unit || ''}</span></td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.l || 0}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.w || 0}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.h || 0}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.unit}</td>`
]
]);

// GradesTab.tsx
processFile('GradesTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Quality Score</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Quality Score</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Standard</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Tolerance</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex flex-col space-y-1">
                                            <span className="font-bold text-gray-900 text-sm dark:text-white">{m.qualityScore ? \`\${m.qualityScore} / 10 Score\` : 'No Score'}</span>
                                            {m.standard && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit dark:bg-blue-900/30 dark:text-blue-400">{m.standard}</span>}
                                            {m.tolerance && <span className="text-[10px] text-gray-500 font-mono">Tol: {m.tolerance}</span>}
                                        </div>
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-bold">{m.qualityScore ? \`\${m.qualityScore} / 10\` : '-'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.standard && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">{m.standard}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.tolerance}</td>`
]
]);

// HSNTab.tsx
processFile('HSNTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Rate & Type</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Rate</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Type</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-mono bg-amber-50 text-amber-700 ring-1 ring-amber-100 px-2 py-1 rounded text-xs font-bold mr-2">{m.rate ? \`\${m.rate}%\` : '-'}</span>
            <span className="text-xs uppercase tracking-widest text-gray-500">{m.type || '-'}</span>
        </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200"><span className="font-mono bg-amber-50 text-amber-700 ring-1 ring-amber-100 px-2 py-1 rounded text-xs font-bold">{m.rate ? \`\${m.rate}%\` : '-'}</span></td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 uppercase">{m.type || '-'}</td>`
]
]);

