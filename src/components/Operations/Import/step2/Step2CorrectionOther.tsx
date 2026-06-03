import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { ParsedVoucher } from '../../../../app/types';
import { 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Settings, 
  Grid, 
  FolderPlus, 
  Info,
  Database
} from 'lucide-react';
import { CorrectionGuideVideo } from './CorrectionGuideVideo';

interface Step2CorrectionOtherProps {
  vouchers: ParsedVoucher[];
  onBack: () => void;
  onSuccess: (message: string) => void;
  // Master Setters passed from App.tsx
  ledgerMasters: any[];
  setLedgerMasters: React.Dispatch<React.SetStateAction<any[]>>;
  itemMasters: any[];
  setItemMasters: React.Dispatch<React.SetStateAction<any[]>>;
  uomMasters: any[];
  setUomMasters: React.Dispatch<React.SetStateAction<any[]>>;
  partyMasters: any[];
  setPartyMasters: React.Dispatch<React.SetStateAction<any[]>>;
  locationMasters: any[];
  setLocationMasters: React.Dispatch<React.SetStateAction<any[]>>;
  bomMasters: any[];
  setBomMasters: React.Dispatch<React.SetStateAction<any[]>>;
  stockGroupMasters: any[];
  setStockGroupMasters: React.Dispatch<React.SetStateAction<any[]>>;
  costCenterMasters: any[];
  setCostCenterMasters: React.Dispatch<React.SetStateAction<any[]>>;
  accountGroupMasters: any[];
  setAccountGroupMasters: React.Dispatch<React.SetStateAction<any[]>>;
  categoryMasters: any[];
  setCategoryMasters: React.Dispatch<React.SetStateAction<any[]>>;
  brandMasters: any[];
  setBrandMasters: React.Dispatch<React.SetStateAction<any[]>>;
  gradeMasters: any[];
  setGradeMasters: React.Dispatch<React.SetStateAction<any[]>>;
  gstMasters: any[];
  setGstMasters: React.Dispatch<React.SetStateAction<any[]>>;
  skuMasters: any[];
  setSkuMasters: React.Dispatch<React.SetStateAction<any[]>>;
  priceListMasters: any[];
  setPriceListMasters: React.Dispatch<React.SetStateAction<any[]>>;
  variantMasters: any[];
  setVariantMasters: React.Dispatch<React.SetStateAction<any[]>>;
  sizeMasters: any[];
  setSizeMasters: React.Dispatch<React.SetStateAction<any[]>>;
  colorMasters: any[];
  setColorMasters: React.Dispatch<React.SetStateAction<any[]>>;
  customMasters: Record<string, any[]>;
  setCustomMasters: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  initialSettings?: any;
  importCategory?: string;
  contactMasters?: any[];
  setContactMasters?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const Step2CorrectionOther: React.FC<Step2CorrectionOtherProps> = ({
  vouchers,
  onBack,
  onSuccess,
  ledgerMasters,
  setLedgerMasters,
  itemMasters,
  setItemMasters,
  uomMasters,
  setUomMasters,
  partyMasters,
  setPartyMasters,
  contactMasters = [],
  setContactMasters = () => {},
  locationMasters,
  setLocationMasters,
  bomMasters,
  setBomMasters,
  stockGroupMasters,
  setStockGroupMasters,
  costCenterMasters,
  setCostCenterMasters,
  accountGroupMasters,
  setAccountGroupMasters,
  categoryMasters,
  setCategoryMasters,
  brandMasters,
  setBrandMasters,
  gradeMasters,
  setGradeMasters,
  gstMasters,
  setGstMasters,
  skuMasters,
  setSkuMasters,
  priceListMasters,
  setPriceListMasters,
  variantMasters,
  setVariantMasters,
  sizeMasters,
  setSizeMasters,
  colorMasters,
  setColorMasters,
  customMasters,
  setCustomMasters,
  initialSettings,
  importCategory,
}) => {
  const { t } = useLanguage();

  // Selected Target Category
  const [targetCategory, setTargetCategory] = useState<string>(() => {
    if (initialSettings?.selectedOtherCategory) {
      return initialSettings.selectedOtherCategory;
    }
    if (importCategory === 'ledger_master') {
      return 'ledgers';
    }
    if (importCategory === 'item_master') {
      return 'items';
    }
    return 'employees_payroll';
  });
  const [customCategoryName, setCustomCategoryName] = useState<string>(initialSettings?.customCategoryName || '');
  
  // Available categories list
  const categoriesList = useMemo(() => [
    // Ledger Masters
    { key: 'ledgers', labelKey: 'General Ledgers', description: 'Create and align standard ledger entries under expense/asset groups', group: 'ledger_master' },
    { key: 'banks', labelKey: 'Bank Masters', description: 'Configure banking and treasury accounts with IFS codes and branch details', group: 'ledger_master' },
    { key: 'contacts', labelKey: 'Contacts & Parties', description: 'Address book profiles, customers, vendors, suppliers, staff, and directors', group: 'ledger_master' },
    { key: 'contacts_staff', labelKey: 'Staff Contacts', description: 'Address book profiles for staff, members, employees, and operations team', group: 'ledger_master' },
    { key: 'contacts_customers', labelKey: 'Customer Contacts', description: 'Address book profiles for buyers, retail/wholesale consumers and recurring debtors', group: 'ledger_master' },
    { key: 'contacts_vendors', labelKey: 'Vendor Contacts', description: 'Address book profiles for active suppliers, direct distributors and trade creditors', group: 'ledger_master' },
    { key: 'contacts_partners', labelKey: 'Partner Contacts', description: 'Address book profiles for enterprise shareholders, advisory board directors and partners', group: 'ledger_master' },
    { key: 'accountGroups', labelKey: 'Account Groups', description: 'Define primary or sub-hierarchies of accounts in ledgers classification', group: 'ledger_master' },
    { key: 'locations', labelKey: 'Locations & Godowns', description: 'Storage warehouses, godowns, locations and inventory bins registers', group: 'ledger_master' },
    { key: 'godowns', labelKey: 'Godowns', description: 'Identify active warehouse units, distribution godowns, and storage terminals', group: 'ledger_master' },
    { key: 'warehouses', labelKey: 'Warehouses', description: 'In-house storage depots, inventory containment areas, and processing fulfillment facilities', group: 'ledger_master' },
    { key: 'costCenters', labelKey: 'Cost Centers', description: 'Corporate departments, project segments, or regional revenue allocation centers', group: 'ledger_master' },

    // Inventory Masters
    { key: 'items', labelKey: 'Stock Items', description: 'Store-keeping unit records of raw materials, assemblies or finished products', group: 'item_master' },
    { key: 'basic_items', labelKey: 'Basic Item', description: 'Direct standard stock variables with custom pricing parameters and standard taxes', group: 'item_master' },
    { key: 'uom', labelKey: 'Units of Measure', description: 'Configure unit variables (PCS, BOX, BAG, NOS) for inventory counts', group: 'item_master' },
    { key: 'uoms', labelKey: 'UOMs', description: 'Alternative alias counts for secondary and tertiary units of packaging measures', group: 'item_master' },
    { key: 'stockGroups', labelKey: 'Stock Groups', description: 'Classify inventory SKU profiles under unified parent categories', group: 'item_master' },
    { key: 'categories', labelKey: 'Stock Categories', description: 'Map inventory items by grade, physical properties, or product families', group: 'item_master' },
    { key: 'bom', labelKey: 'Bill of Materials', description: 'Verify assembly blueprints and raw material recipe registers', group: 'item_master' },
    { key: 'brands', labelKey: 'Brands', description: 'Product brands, manufacturers, label directories, and commercial product names', group: 'item_master' },
    { key: 'variants', labelKey: 'Variants', description: 'Specific SKU color/size combinations, item matrices, or custom configurations', group: 'item_master' },
    { key: 'sizes', labelKey: 'Sizes', description: 'Product size scales, measurements, and physical size specifications', group: 'item_master' },
    { key: 'colors', labelKey: 'Colors', description: 'Product colors, visual style references, and fabric/plastic tint masters', group: 'item_master' },
    { key: 'gst', labelKey: 'HSN & Tax Codes', description: 'HSN/SAC codes, standard Goods and Services Tax rates registry', group: 'item_master' },
    { key: 'skus', labelKey: 'SKU Masters', description: 'Store-keeping unit identification codes and unique identifier databases', group: 'item_master' },
    { key: 'grades', labelKey: 'Grades', description: 'Material grades, purity ratings, crop qualities, and manufacturing strength scales', group: 'item_master' },
    { key: 'priceLists', labelKey: 'Price Lists', description: 'Multi-tier pricing structures, retail cost books, dealer margins, and distributor discount tables', group: 'item_master' },

    // Miscellaneous Masters
    { key: 'employees_payroll', labelKey: 'Employees & Payroll', description: 'HR Personnel, Employee directory profiles, designations and salary codes', group: 'other' },
    { key: 'fixed_assets', labelKey: 'Fixed Asset Registry', description: 'Capital machinery, devices, assets, fixtures, properties and depreciation registers', group: 'other' },
    { key: 'currency_rates', labelKey: 'Forex Rate Matrices', description: 'Foreign exchange currency conversion codes and exchange rate parameter tables', group: 'other' },
    { key: 'projects_wbs', labelKey: 'Projects & Contract WBS', description: 'Contract projects registry, operational work breakdown tasks, and client milestones', group: 'other' },
    { key: 'barcodes_units', labelKey: 'Barcodes & Packaging Mappings', description: 'EAN/UPC barcode numbers, packaging units, carton multipliers and box weights', group: 'other' },
    { key: 'discount_rules', labelKey: 'Discount & Promo Schemes', description: 'Promotional schemes, pricing loyalty slabs, seasonal markdown or markup matrices', group: 'other' },
    { key: 'custom_dirs', labelKey: 'Custom Directory Master', description: 'Unstructured miscellaneous custom key-value indexing and tag registries', group: 'other' },
    { key: 'custom', labelKey: 'Custom Category', description: 'Define your own database table prefix and configure dynamic layouts', group: 'other' }
  ], []);

  // Columns found inside parsed vouchers
  const parsedHeaders = useMemo(() => {
    if (!vouchers || vouchers.length === 0) return [];
    
    // We try to find non-empty keys across the parsed records
    const keys = new Set<string>();
    vouchers.forEach(v => {
      Object.keys(v).forEach(k => {
        const val = v[k as keyof ParsedVoucher];
        if (val !== undefined && val !== null) {
          if (typeof val === 'object' && !Array.isArray(val)) {
            if ((val as any).value !== undefined && (val as any).value !== '') {
              keys.add(k);
            }
          } else if (val !== '') {
            keys.add(k);
          }
        }
      });
    });

    // Also check first item attributes if present
    if (vouchers[0].items && vouchers[0].items.length > 0) {
      Object.keys(vouchers[0].items[0]).forEach(k => {
        keys.add(`item_${k}`);
      });
    }

    return Array.from(keys);
  }, [vouchers]);

  // Mapping configurations
  const [mapNameField, setMapNameField] = useState<string>(
    parsedHeaders.find(h => ['partyName', 'ledger', 'name', 'particulars'].includes(h)) || parsedHeaders[0] || ''
  );
  const [mapCodeField, setMapCodeField] = useState<string>(
    parsedHeaders.find(h => ['referenceNo', 'invoiceNumber', 'id', 'sku', 'code'].includes(h)) || ''
  );
  const [mapGroupField, setMapGroupField] = useState<string>(
    parsedHeaders.find(h => ['supplyType', 'parent', 'group', 'category'].includes(h)) || ''
  );
  const [mapValueField, setMapValueField] = useState<string>(
    parsedHeaders.find(h => ['amount', 'closingBalance', 'rate', 'value'].includes(h)) || ''
  );

  // Parse vouchers based on the mapping
  const initialItemsFromVouchers = useMemo(() => {
    return vouchers.map((v, index) => {
      const getFieldValue = (fieldKey: string): string => {
        if (!fieldKey) return '';
        if (fieldKey.startsWith('item_')) {
          const itemKey = fieldKey.replace('item_', '');
          return String(v.items?.[0]?.[itemKey as keyof any]?.value || '');
        }
        const valObj = v[fieldKey as keyof ParsedVoucher];
        if (typeof valObj === 'object' && valObj !== null && 'value' in valObj) {
          return String((valObj as any).value || '');
        }
        return String(valObj || '');
      };

      const name = getFieldValue(mapNameField) || `Custom Item ${index + 1}`;
      const code = getFieldValue(mapCodeField);
      const group = getFieldValue(mapGroupField);
      const val = getFieldValue(mapValueField);

      return {
        id: `custom-import-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
        name,
        code: code || '',
        group: group || '',
        value: val || '',
      };
    });
  }, [vouchers, mapNameField, mapCodeField, mapGroupField, mapValueField]);

  const [items, setItems] = useState<Array<{ id: string; name: string; code: string; group: string; value: string }>>(
    initialItemsFromVouchers
  );

  // Sync state if column maps change
  React.useEffect(() => {
    setItems(initialItemsFromVouchers);
  }, [initialItemsFromVouchers]);

  // Handlers
  const handleAddRow = () => {
    setItems(prev => [
      ...prev,
      {
        id: `custom-row-${Date.now()}-${Math.random()}`,
        name: 'New Custom Entry',
        code: '',
        group: '',
        value: ''
      }
    ]);
  };

  const handleDeleteRow = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRowChange = (id: string, field: 'name' | 'code' | 'group' | 'value', val: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  // Perform import
  const handleImport = () => {
    const finalCategory = targetCategory === 'custom' ? customCategoryName.trim() : targetCategory;
    if (!finalCategory) {
      alert('Please specify a valid category name.');
      return;
    }

    const itemsToImport = items.filter(i => i.name && i.name.trim().length > 0).map(i => ({
      id: i.id,
      name: i.name.trim(),
      ...(i.code ? { code: i.code.trim(), sku: i.code.trim() } : {}),
      ...(i.group ? { group: i.group.trim(), parent: i.group.trim(), category: i.group.trim() } : {}),
      ...(i.value ? { value: i.value.trim(), rate: i.value.trim() } : {})
    }));

    if (itemsToImport.length === 0) {
      alert('No valid items (possessing names) were entered to import.');
      return;
    }

    // Save items to the correct master array
    switch (targetCategory) {
      case 'ledgers':
        setLedgerMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `l-${Date.now()}-${Math.random()}`, name: item.name, group: item.group || 'Indirect Expenses' });
            }
          });
          return merged;
        });
        break;
      case 'parties':
      case 'vendors':
      case 'partners':
      case 'banks':
      case 'contacts':
      case 'contacts_staff':
      case 'contacts_customers':
      case 'contacts_vendors':
      case 'contacts_partners':
        setPartyMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              const defaultType = 
                targetCategory === 'vendors' || targetCategory === 'contacts_vendors' ? 'Vendor' : 
                targetCategory === 'partners' || targetCategory === 'contacts_partners' ? 'Partner' : 
                targetCategory === 'banks' ? 'Bank' : 
                targetCategory === 'contacts_staff' ? 'Staff' : 'Customer';
              merged.push({ id: `p-${Date.now()}-${Math.random()}`, name: item.name, type: item.group || defaultType });
            }
          });
          return merged;
        });

        if (targetCategory === 'banks') {
          // Dual save banks in ledgerMasters under Bank Accounts so they show up under Bank Masters
          setLedgerMasters(prev => {
            const merged = [...prev];
            itemsToImport.forEach(item => {
              if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
                merged.push({ 
                  id: `l-${Date.now()}-${Math.random()}`, 
                  name: item.name, 
                  group: 'Bank Accounts', 
                  openingBalance: item.value || '0.00'
                });
              }
            });
            return merged;
          });
        } else {
          // Dual save contacts in contactMasters so they show up under Contacts Tab
          setContactMasters(prev => {
            const merged = [...prev];
            itemsToImport.forEach(item => {
              if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
                merged.push({
                  id: `c-${Date.now()}-${Math.random()}`,
                  name: item.name,
                  code: item.code || '',
                  status: 'Active',
                  contactType: 'External',
                  role: item.group || (targetCategory === 'contacts_staff' ? 'Staff' : 'Customer')
                });
              }
            });
            return merged;
          });
        }
        break;
      case 'items':
      case 'basic_items':
        setItemMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `it-${Date.now()}-${Math.random()}`, name: item.name, sku: item.code || '', baseUnit: 'PCS', category: item.group || 'General' });
            }
          });
          return merged;
        });
        break;
      case 'bom':
        setBomMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `bom-${Date.now()}-${Math.random()}`, name: item.name });
            }
          });
          return merged;
        });
        break;
      case 'uom':
      case 'uoms':
        setUomMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `uom-${Date.now()}-${Math.random()}`, name: item.name, symbol: item.name, decimalPlaces: 0 });
            }
          });
          return merged;
        });
        break;
      case 'costCenters':
        setCostCenterMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `cc-${Date.now()}-${Math.random()}`, name: item.name, code: item.code || item.name.toLowerCase().replace(/\s+/g, '-'), category: item.group || 'General' });
            }
          });
          return merged;
        });
        break;
      case 'stockGroups':
        setStockGroupMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `sg-${Date.now()}-${Math.random()}`, name: item.name, parentName: item.group || 'Primary' });
            }
          });
          return merged;
        });
        break;
      case 'stockCategories':
      case 'categories':
        setCategoryMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `cat-${Date.now()}-${Math.random()}`, name: item.name });
            }
          });
          return merged;
        });
        break;
      case 'godowns':
      case 'locations':
      case 'warehouses':
        setLocationMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `loc-${Date.now()}-${Math.random()}`, name: item.name, type: item.group || 'Storage' });
            }
          });
          return merged;
        });
        break;
      case 'accountGroups':
        setAccountGroupMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `ag-${Date.now()}-${Math.random()}`, name: item.name, parentGroup: item.group || 'Primary' });
            }
          });
          return merged;
        });
        break;
      case 'priceLists':
        setPriceListMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `pl-${Date.now()}-${Math.random()}`, name: item.name });
            }
          });
          return merged;
        });
        break;
      case 'brands':
        setBrandMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `br-${Date.now()}-${Math.random()}`, name: item.name });
            }
          });
          return merged;
        });
        break;
      case 'grades':
        setGradeMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `gr-${Date.now()}-${Math.random()}`, name: item.name });
            }
          });
          return merged;
        });
        break;
      case 'gst':
        setGstMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `gst-${Date.now()}-${Math.random()}`, name: item.name, rate: parseFloat(item.value || '18') });
            }
          });
          return merged;
        });
        break;
      case 'skus':
        setSkuMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `sku-${Date.now()}-${Math.random()}`, name: item.name, skuCode: item.code || '' });
            }
          });
          return merged;
        });
        break;
      case 'variants':
        setVariantMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `vr-${Date.now()}-${Math.random()}`, name: item.name });
            }
          });
          return merged;
        });
        break;
      case 'sizes':
        setSizeMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `sz-${Date.now()}-${Math.random()}`, name: item.name });
            }
          });
          return merged;
        });
        break;
      case 'colors':
        setColorMasters(prev => {
          const merged = [...prev];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `cl-${Date.now()}-${Math.random()}`, name: item.name });
            }
          });
          return merged;
        });
        break;
      default:
        // Save to dynamic Custom Masters Category list!
        setCustomMasters(prev => {
          const existingCategoryList = prev[finalCategory] || [];
          const merged = [...existingCategoryList];
          itemsToImport.forEach(item => {
            if (!merged.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push({ id: `cstm-${Date.now()}-${Math.random()}`, name: item.name, code: item.code || '', group: item.group || '' });
            }
          });
          return {
            ...prev,
            [finalCategory]: merged
          };
        });
    }

    onSuccess(`Successfully parsed & imported ${itemsToImport.length} elements into your '${finalCategory}' master directory.`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white p-3 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700 text-left">
      {/* Target Category Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t("Miscellaneous Import Configurator")}</h2>
            <p className="text-[11px] text-gray-500 font-medium tracking-wide block leading-none mt-1">
              {t("Select the target data category & verify custom logs inline before committing values to storage.")}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("Back to Upload")}
        </button>
      </div>

      {/* Dynamic Walkthrough Tutorial Video just after Header Area (on top) */}
      <CorrectionGuideVideo />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
        {/* Left Settings Sidebar Panel */}
        <div className="lg:col-span-1 bg-gray-50/50 p-4 border border-gray-100 rounded-xl flex flex-col gap-5 dark:bg-gray-900/30 dark:border-gray-700 overflow-y-auto">
          <div>
            <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
              {t("Import Destination")}
            </span>
            
            <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Database className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <label className="block text-[8px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider mb-0.5">
                  {t("Active Database Table")}
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-xs font-black text-gray-900 dark:text-white focus:ring-0 outline-none cursor-pointer text-ellipsis overflow-hidden"
                >
                  <optgroup label={t("Ledger Master Directories")}>
                    {categoriesList.filter(c => c.group === 'ledger_master').map(c => (
                      <option key={c.key} value={c.key} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">{t(c.labelKey)}</option>
                    ))}
                  </optgroup>
                  <optgroup label={t("Inventory Master Directories")}>
                    {categoriesList.filter(c => c.group === 'item_master').map(c => (
                      <option key={c.key} value={c.key} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">{t(c.labelKey)}</option>
                    ))}
                  </optgroup>
                  <optgroup label={t("Miscellaneous Registers")}>
                    {categoriesList.filter(c => c.group === 'other').map(c => (
                      <option key={c.key} value={c.key} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">{t(c.labelKey)}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed font-medium">
              {t(categoriesList.find(c => c.key === targetCategory)?.description || '')}
            </p>
          </div>

          <div className="border-t border-gray-200/50 pt-4 dark:border-gray-700">
            <span className="text-[10px] font-black uppercase text-purple-500 tracking-widest bg-purple-50 dark:bg-purple-950 px-1.5 py-0.5 rounded">
              {t("Step 2")}
            </span>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mt-2 mb-1.5 dark:text-gray-300">
              {t("Field Alignment Mapping")}
            </label>
            <p className="text-[11px] text-gray-400 mb-3 leading-tight">
              {t("Map parsing indices from your miscellaneous columns to values.")}
            </p>

            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t("Master Record Name")}</label>
                <select
                  value={mapNameField}
                  onChange={(e) => setMapNameField(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-[11px] font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t("Code / ID / SKU (Optional)")}</label>
                <select
                  value={mapCodeField}
                  onChange={(e) => setMapCodeField(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-[11px] font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">{t("-- Auto Detect --")}</option>
                  {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t("Group / Category (Optional)")}</label>
                <select
                  value={mapGroupField}
                  onChange={(e) => setMapGroupField(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-[11px] font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">{t("-- Auto Detect --")}</option>
                  {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t("Value / Balance (Optional)")}</label>
                <select
                  value={mapValueField}
                  onChange={(e) => setMapValueField(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-[11px] font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">{t("-- Auto Detect --")}</option>
                  {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Verification Grid Panel */}
        <div className="lg:col-span-2 flex flex-col min-h-0 overflow-hidden border border-gray-100 rounded-xl dark:border-gray-700">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 shrink-0">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-widest dark:text-gray-300">
                {t("Verify items ({count} rows found)", { count: items.length })}
              </span>
            </div>
            <button
              onClick={handleAddRow}
              className="px-2.5 py-1 border border-blue-500 hover:bg-blue-500 hover:text-white transition-all rounded-md text-xs font-bold text-blue-500 flex items-center gap-1 cursor-pointer dark:hover:bg-blue-600 dark:hover:border-blue-600"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("Add Entry")}
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-gray-50/20 custom-scrollbar p-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-850 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                <Info className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{t("No mapped records available.")}</p>
                <p className="text-xs text-gray-400 mt-1">{t("Please verify column alignment mapping on the left panel.")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3 hover:border-gray-200 transition-all dark:bg-gray-800 dark:border-gray-750 group relative"
                  >
                    <div className="text-[10px] font-black text-gray-300 dark:text-gray-600 w-5 shrink-0 select-none">
                      #{index + 1}
                    </div>

                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-1.5">
                        <label className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block mb-0.5 sm:hidden">{t("Name")}</label>
                        <input
                          type="text"
                          required
                          value={item.name}
                          onChange={(e) => handleRowChange(item.id, 'name', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs font-bold focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                          placeholder={t("Master Item Name")}
                        />
                      </div>

                      <div>
                        <label className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block mb-0.5 sm:hidden">{t("Code / SKU")}</label>
                        <input
                          type="text"
                          value={item.code}
                          onChange={(e) => handleRowChange(item.id, 'code', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs font-semibold focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white text-gray-600 dark:text-gray-300"
                          placeholder={t("Code / ID")}
                        />
                      </div>

                      <div>
                        <label className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block mb-0.5 sm:hidden">{t("Group / Category")}</label>
                        <input
                          type="text"
                          value={item.group}
                          onChange={(e) => handleRowChange(item.id, 'group', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs font-semibold focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white text-gray-600 dark:text-gray-300"
                          placeholder={t("Classification / Group")}
                        />
                      </div>

                      <div>
                        <label className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block mb-0.5 sm:hidden">{t("Opening / Value")}</label>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleRowChange(item.id, 'value', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs font-semibold focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white text-gray-600 dark:text-gray-300"
                          placeholder={t("Raw rate / balance")}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer dark:hover:bg-red-950/30"
                      title={t("Delete Entry")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Trigger committed directly to AppState */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end shrink-0">
            <button
              onClick={handleImport}
              disabled={items.length === 0}
              className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed text-xs font-black uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t("Complete Import & Sync Category")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
