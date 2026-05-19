const fs = require('fs');

const historyFile = 'src/components/ui/HistoryModal.tsx';
let historyContent = fs.readFileSync(historyFile, 'utf8');

if (!historyContent.includes('onDeleteRecord?:')) {
    historyContent = historyContent.replace(/onSelectRecord: \(record: any\) => void;/, 'onSelectRecord: (record: any) => void;\n  onDeleteRecord?: (id: string) => void;');
}

historyContent = historyContent.replace(/onSelectRecord,\n  title\n}\) => \{/, 'onSelectRecord,\n  onDeleteRecord,\n  title\n}) => {');

historyContent = historyContent.replace(/const confirmDelete = \(\) => \{\n\s*if \(docToDelete\) \{\n[^]*?\s*setDocToDelete\(null\);\n\s*\}\n\s*\};/, `const confirmDelete = () => {
    if (docToDelete) {
      if (onDeleteRecord) {
        onDeleteRecord(docToDelete);
      } else {
        const updated = historyDocs.filter(doc => doc.id !== docToDelete);
        setHistoryDocs(updated);
        if (storageKey) {
          const onlyNonSample = updated.filter(doc => !doc.isSample && !doc.sampleSetId);
          localStorage.setItem(storageKey, JSON.stringify([...onlyNonSample].reverse()));
        }
      }
      setDocToDelete(null);
    }
  };`);

fs.writeFileSync(historyFile, historyContent);
console.log('done!');
