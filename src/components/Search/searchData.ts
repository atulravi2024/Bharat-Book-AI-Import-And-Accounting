import { MainView } from '../../types';

export interface SearchItem {
  id: string;
  title: string;
  type: 'Page' | 'Master' | 'Report' | 'Operation' | 'Dashboard';
  view: MainView;
  subPage?: string;
  keywords?: string[];
}

export const GLOBAL_SEARCH_DATA: SearchItem[] = [
  // Dashboard
  { id: 'd1', title: 'Dashboard Overview', type: 'Dashboard', view: 'dashboard', subPage: 'overview' },

  // Maps to available sub-pages in SettingsView.tsx
  { id: 's1', title: 'Firm Settings', type: 'Page', view: 'settings', subPage: 'firm' },
  { id: 's2', title: 'General Settings', type: 'Page', view: 'settings', subPage: 'general' },
  { id: 's3', title: 'App Defaults', type: 'Page', view: 'settings', subPage: 'navigation' },
  { id: 's4', title: 'Voucher Numbering', type: 'Page', view: 'settings', subPage: 'vouchernumbering' },
  { id: 's5', title: 'Invoice & Print Settings', type: 'Page', view: 'settings', subPage: 'invoiceprint' },
  { id: 's6', title: 'Form Detail Settings', type: 'Page', view: 'settings', subPage: 'formdetails' },
  { id: 's7', title: 'User Management', type: 'Page', view: 'settings', subPage: 'users', keywords: ['staff', 'accounts'] },
  { id: 's8', title: 'Alert Settings', type: 'Page', view: 'settings', subPage: 'alerts' },
  { id: 's9', title: 'Security Settings', type: 'Page', view: 'settings', subPage: 'security' },
  { id: 's10', title: 'Privacy Settings', type: 'Page', view: 'settings', subPage: 'privacy' },
  { id: 's11', title: 'Import Rules', type: 'Page', view: 'settings', subPage: 'imports' },
  { id: 's12', title: 'Mapping Configuration', type: 'Page', view: 'settings', subPage: 'mapping' },
  { id: 's13', title: 'AI Engines', type: 'Page', view: 'settings', subPage: 'ai' },
  { id: 's14', title: 'Admin Rules', type: 'Page', view: 'settings', subPage: 'admin' },
  { id: 's15', title: 'Data Explorer', type: 'Page', view: 'settings', subPage: 'data' },
  
  // Operations
  { id: 'o1', title: 'Voucher Entry', type: 'Operation', view: 'voucher-entry', subPage: 'vouchers' },
  { id: 'o2', title: 'Inventory Entry', type: 'Operation', view: 'inventory-entry', subPage: 'inventory' },
  { id: 'o3', title: 'Import Data', type: 'Operation', view: 'import' },
  { id: 'o4', title: 'All Vouchers', type: 'Operation', view: 'vouchers', subPage: 'list' },
  { id: 'o5', title: 'Bulk Operation', type: 'Operation', view: 'bulk-operation' },
  { id: 'o6', title: 'Bank Reconciliation', type: 'Operation', view: 'bank', subPage: 'reconcile' },
  
  // Masters - Ledger
  { id: 'm1', title: 'General Ledgers', type: 'Master', view: 'ledger-master', subPage: 'ledgers' },
  { id: 'm2', title: 'Contacts & Parties', type: 'Master', view: 'ledger-master', subPage: 'contacts', keywords: ['customers', 'vendors', 'staff'] },
  { id: 'm3', title: 'Bank Masters', type: 'Master', view: 'ledger-master', subPage: 'banks' },
  { id: 'm4', title: 'Account Groups', type: 'Master', view: 'ledger-master', subPage: 'accountGroups' },
  { id: 'm5', title: 'Locations / Warehouses', type: 'Master', view: 'ledger-master', subPage: 'locations' },
  { id: 'm6', title: 'Cost Centers', type: 'Master', view: 'ledger-master', subPage: 'costCenters' },
  
  // Masters - Item
  { id: 'm7', title: 'Item Hub', type: 'Master', view: 'item-master', subPage: 'items' },
  { id: 'm8', title: 'Basic Items', type: 'Master', view: 'item-master', subPage: 'basic_items' },
  { id: 'm9', title: 'Bill of Materials (BOM)', type: 'Master', view: 'item-master', subPage: 'bom' },
  { id: 'm10', title: 'Warehouses', type: 'Master', view: 'item-master', subPage: 'warehouses' },
  { id: 'm11', title: 'Units of Measure (UOMs)', type: 'Master', view: 'item-master', subPage: 'uoms' },
  { id: 'm12', title: 'Stock Groups', type: 'Master', view: 'item-master', subPage: 'stockGroups' },
  { id: 'm13', title: 'HSN / GST Masters', type: 'Master', view: 'item-master', subPage: 'gst' },
  { id: 'm14', title: 'Brands', type: 'Master', view: 'item-master', subPage: 'brands' },
  { id: 'm15', title: 'Categories', type: 'Master', view: 'item-master', subPage: 'categories' },
  { id: 'm16', title: 'Assertion Categories', type: 'Master', view: 'item-master', subPage: 'assertionCategories' },
  { id: 'm17', title: 'Assertion Codes', type: 'Master', view: 'item-master', subPage: 'assertionCodes' },
  { id: 'm18', title: 'Colors', type: 'Master', view: 'item-master', subPage: 'colors' },
  { id: 'm19', title: 'Sizes', type: 'Master', view: 'item-master', subPage: 'sizes' },
  { id: 'm20', title: 'Variants', type: 'Master', view: 'item-master', subPage: 'variants' },
  { id: 'm21', title: 'Dimensions', type: 'Master', view: 'item-master', subPage: 'dimensions' },
  { id: 'm22', title: 'SKUs', type: 'Master', view: 'item-master', subPage: 'skus' },
  { id: 'm23', title: 'Price List', type: 'Master', view: 'item-master', subPage: 'priceList' },
  { id: 'm24', title: 'Weights', type: 'Master', view: 'item-master', subPage: 'weights' },
  { id: 'm25', title: 'Volumes', type: 'Master', view: 'item-master', subPage: 'volumes' },
  { id: 'm26', title: 'Grades', type: 'Master', view: 'item-master', subPage: 'grades' },

  // Reports
  { id: 'r1', title: 'Financial Reports', type: 'Report', view: 'reports', subPage: 'balance-sheet' },
  { id: 'r2', title: 'Item & Stock Reports', type: 'Report', view: 'item-report', subPage: 'stock-summary' },
  { id: 'r3', title: 'GST Reports', type: 'Report', view: 'gst-report', subPage: 'gstr1' },
];
