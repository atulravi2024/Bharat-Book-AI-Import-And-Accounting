const fs = require('fs');
const path = require('path');

const tabsDir = path.join(__dirname, 'components', 'Masters', 'ItemMaster', 'Tabs');

function processFile(filename, replacements) {
    const p = path.join(tabsDir, filename);
    if (!fs.existsSync(p)) return;
    let code = fs.readFileSync(p, 'utf-8');
    
    code = code.replace(/<table className="w-full text-left border-collapse">/g, '<table className="w-full text-left border-collapse whitespace-nowrap">');
    
    for (const [search, replace] of replacements) {
        if (typeof search === 'string') {
             code = code.split(search).join(replace);
        } else {
             code = code.replace(search, replace);
        }
    }
    
    fs.writeFileSync(p, code);
    console.log("Processed", filename);
}

processFile('BrandsTab.tsx', [
    [`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Info</th>`,
    `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Tier</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Origin</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Manufacturer</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Website</th>`],
    
    [`<td className="p-4">
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
                {m.tier && <span className={\`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase \${m.tier==='Premium' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}\`}>{m.tier}</span>}
                {m.origin && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{m.origin}</span>}
            </div>
            {m.manufacturer && <div className="text-[11px] mt-1 text-gray-500 font-medium line-clamp-1">{m.manufacturer}</div>}
            {m.website && <div className="text-[10px] mt-0.5 text-blue-500"><a href={m.website} target="_blank" rel="noreferrer" className="hover:underline">{m.website}</a></div>}
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
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.tier && <span className={\`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase \${m.tier==='Premium' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}\`}>{m.tier}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.origin && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{m.origin}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-medium">{m.manufacturer}</td>
        <td className="p-4 whitespace-nowrap text-sm text-blue-500">{m.website && <a href={m.website} target="_blank" rel="noreferrer" className="hover:underline">{m.website}</a>}</td>`
    ]
]);
