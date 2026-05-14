const fs = require('fs');
const data = [
  {
    "id": "gstr1-sample-1",
    "date": { "value": "2024-05-15" },
    "type": "Sales",
    "partyName": { "value": "Tech Corp Ltd" },
    "gstin": { "value": "27AAACA1234A1Z5" },
    "amount": { "value": 118000 },
    "narration": { "value": "B2B Sales" },
    "items": [
      {
        "name": { "value": "Laptop Pro" },
        "hsn": { "value": "8471" },
        "uom": { "value": "NOS" },
        "quantity": { "value": 1 },
        "rate": { "value": 100000 },
        "taxRate": { "value": 18 },
        "total": { "value": 118000 },
        "tax": { "value": 18000 },
        "cgst": { "value": 9000 },
        "sgst": { "value": 9000 },
        "igst": { "value": 0 }
      }
    ]
  },
  {
    "id": "gstr1-sample-2",
    "date": { "value": "2024-05-16" },
    "type": "Sales",
    "partyName": { "value": "Walkin Customer" },
    "gstin": { "value": "" },
    "amount": { "value": 5900 },
    "narration": { "value": "B2C Small" },
    "items": [
      {
        "name": { "value": "Wireless Mouse" },
        "hsn": { "value": "8471" },
        "uom": { "value": "NOS" },
        "quantity": { "value": 2 },
        "rate": { "value": 2500 },
        "taxRate": { "value": 18 },
        "total": { "value": 5900 },
        "tax": { "value": 900 },
        "cgst": { "value": 450 },
        "sgst": { "value": 450 },
        "igst": { "value": 0 }
      }
    ]
  }
];
fs.writeFileSync('public/sample-data/reports/gstr1.json', JSON.stringify(data, null, 2));
console.log('Done GSTR1');
