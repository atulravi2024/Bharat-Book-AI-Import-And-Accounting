const XLSX = require('xlsx');

// Create a workbook with weird sparse rows
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([
  ['Index', undefined, 'Name', 'Amount'],
  [1, 2, 'Alice', 100],
  [2, 3, 'Bob', 200]
]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
console.log(rows);
