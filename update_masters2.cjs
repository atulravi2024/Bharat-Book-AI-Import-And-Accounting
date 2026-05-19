const fs = require('fs');

const vendors = [
  {
    "id": "vendor-1",
    "name": "Dell India Pvt Ltd",
    "group": "Sundry Creditors",
    "openingBalance": 150000,
    "type": "Vendor",
    "status": "Active",
    "contactPerson": "Ramesh Kumar",
    "phone": "9876543210",
    "email": "sales@dell.co.in",
    "address": "12/A, Electronic City, Bangalore"
  },
  {
    "id": "vendor-2",
    "name": "Samsung Electronics",
    "group": "Sundry Creditors",
    "openingBalance": 75000,
    "type": "Vendor",
    "status": "Active",
    "contactPerson": "Shivani Singh",
    "phone": "9812345670",
    "email": "orders@samsung.com",
    "address": "Sector 62, Noida, UP"
  },
  {
    "id": "vendor-3",
    "name": "Supertech Logistics",
    "group": "Sundry Creditors",
    "openingBalance": 20000,
    "type": "Party",
    "status": "Active",
    "contactPerson": "Vikram Singh",
    "phone": "9765412345",
    "email": "billing@supertechlog.in",
    "address": "Andheri East, Mumbai"
  }
];

const customers = [
  {
    "id": "party-1",
    "name": "Reliance Retail Ltd",
    "group": "Sundry Debtors",
    "openingBalance": 250000,
    "type": "Party",
    "status": "Active",
    "contactPerson": "Amit Sharma",
    "phone": "9988776655",
    "email": "accounts@relianceretail.com",
    "address": "Navi Mumbai, Maharashtra"
  },
  {
    "id": "party-2",
    "name": "Tata Consultancy Services",
    "group": "Sundry Debtors",
    "openingBalance": 500000,
    "type": "Party",
    "status": "Active",
    "contactPerson": "Meera Iyer",
    "phone": "9123456780",
    "email": "vendor.payments@tcs.com",
    "address": "TCS Synergy Park, Hyderabad"
  },
  {
    "id": "party-3",
    "name": "Future Group",
    "group": "Sundry Debtors",
    "openingBalance": 0,
    "type": "Party",
    "status": "Active",
    "contactPerson": "Rahul Bajaj",
    "phone": "9876123450",
    "email": "finance@futuregroup.in",
    "address": "Lower Parel, Mumbai"
  }
];

const banks = [
  {
    "id": "bank-1",
    "name": "HDFC Bank (Current A/c)",
    "group": "Bank Accounts",
    "accountNo": "50200012345678",
    "ifsc": "HDFC0000123",
    "branch": "Fort, Mumbai",
    "openingBalance": 1250000
  },
  {
    "id": "bank-2",
    "name": "ICICI Bank (CC A/c)",
    "group": "Bank OCC A/c",
    "accountNo": "001105001234",
    "ifsc": "ICIC0000011",
    "branch": "Nariman Point",
    "openingBalance": -500000
  },
  {
    "id": "bank-3",
    "name": "State Bank of India (OD)",
    "group": "Bank OD A/c",
    "accountNo": "30123456789",
    "ifsc": "SBIN0001234",
    "branch": "Connaught Place",
    "openingBalance": -150000
  }
];

const costCenters = [
  {
    "id": "cc-1",
    "name": "Mumbai Branch",
    "group": "Branches",
    "address": "Bandra Kurla Complex, Mumbai"
  },
  {
    "id": "cc-2",
    "name": "Delhi Sales Office",
    "group": "Branches",
    "address": "Nehru Place, New Delhi"
  },
  {
    "id": "cc-3",
    "name": "Marketing Department",
    "group": "Departments",
    "address": "HQ, Mumbai"
  },
  {
    "id": "cc-4",
    "name": "Production Unit 1",
    "group": "Manufacturing",
    "address": "Pune Industrial Area"
  }
];

fs.writeFileSync('public/sample-data/ledger-master/vendors.json', JSON.stringify(vendors, null, 2));
fs.writeFileSync('public/sample-data/ledger-master/parties.json', JSON.stringify(customers, null, 2));
fs.writeFileSync('public/sample-data/ledger-master/banks.json', JSON.stringify(banks, null, 2));
fs.writeFileSync('public/sample-data/ledger-master/costCenters.json', JSON.stringify(costCenters, null, 2));

console.log("Master linked data updated.");
