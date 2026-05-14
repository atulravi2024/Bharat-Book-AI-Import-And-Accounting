const fs = require('fs');

function addAuditLog(file) {
  const p = `public/sample-data/reports/${file}`;
  if (!fs.existsSync(p)) return;
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  let changed = false;
  if (data.length > 0 && !data[0].auditLogs) {
    data[0].auditLogs = [
      {
        "id": "al-1",
        "action": "CREATE",
        "timestamp": "2024-05-10T10:00:00Z",
        "user": "System Auto",
        "changes": { "status": "Created" }
      },
       {
        "id": "al-2",
        "action": "UPDATE",
        "timestamp": "2024-05-11T12:30:00Z",
        "user": "Admin User",
        "changes": { "amount": "Updated amount" }
      }
    ];
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    console.log("Updated", file);
  }
}

addAuditLog('day_book.json');
addAuditLog('journal_register.json');
addAuditLog('financial_vouchers.json');
addAuditLog('bank_vouchers.json');
addAuditLog('sales_register.json');
addAuditLog('purchase_register.json');

// Now let's populate the empty dashbaord arrays!
function writeDash(name, data) {
  const p = `public/sample-data/dashboard/${name}.json`;
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
  console.log(`Wrote dashboard/${name}.json`);
}

writeDash('sales_entry', [
  { "id": "se-1", "date": {"value": "2024-05-15"}, "type": "Sales", "partyName": {"value": "Demo Party"}, "amount": {"value": 10000} }
]);
writeDash('purchase_entry', [
  { "id": "pe-1", "date": {"value": "2024-05-15"}, "type": "Purchase", "partyName": {"value": "Demo Party"}, "amount": {"value": 10000} }
]);
writeDash('payment_entry', [
    { "id": "pay-1", "date": {"value": "2024-05-15"}, "type": "Payment", "partyName": {"value": "Vendor Party"}, "amount": {"value": 5000} }
]);
writeDash('receipt_entry', [
    { "id": "rec-1", "date": {"value": "2024-05-15"}, "type": "Receipt", "partyName": {"value": "Client Party"}, "amount": {"value": 15000} }
]);
writeDash('journal_entry', [
    { "id": "jou-1", "date": {"value": "2024-05-15"}, "type": "Journal", "debitLedger": {"value": "Bank A/c"}, "creditLedger": {"value": "Cash A/c"}, "amount": {"value": 2000} }
]);
writeDash('contra_entry', [
    { "id": "con-1", "date": {"value": "2024-05-15"}, "type": "Contra", "debitLedger": {"value": "Cash A/c"}, "creditLedger": {"value": "Bank A/c"}, "amount": {"value": 1000} }
]);
writeDash('debit_note_entry', [
    { "id": "dn-1", "date": {"value": "2024-05-15"}, "type": "Debit Note", "partyName": {"value": "Vendor Party"}, "amount": {"value": 500} }
]);
writeDash('credit_note_entry', [
    { "id": "cn-1", "date": {"value": "2024-05-15"}, "type": "Credit Note", "partyName": {"value": "Client Party"}, "amount": {"value": 500} }
]);

console.log("Done");
