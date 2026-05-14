const fs = require('fs');

const dayBook = JSON.parse(fs.readFileSync('public/sample-data/reports/day_book.json', 'utf8'));

const auditTrailData = dayBook.map((v, i) => ({
  ...v,
  id: 'audit_trail-' + v.id,
  auditLogs: [
    {
      "id": "al-1-" + i,
      "action": "CREATE",
      "timestamp": "2024-05-10T10:00:00Z",
      "user": "System Auto",
      "changes": { "status": "Created" }
    },
    {
      "id": "al-2-" + i,
      "action": "UPDATE",
      "timestamp": "2024-05-11T12:30:00Z",
      "user": "Admin User",
      "changes": { "amount": "Updated amount" }
    }
  ]
}));

fs.writeFileSync('public/sample-data/reports/audit_trail.json', JSON.stringify(auditTrailData, null, 2));
console.log('Modified audit_trail.json to have auditLogs on all entries');
