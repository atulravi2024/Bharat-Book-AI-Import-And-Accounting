import { useState, useEffect } from 'react';
import { useStorageState } from './useStorageState';
import { ColorMaster, SizeMaster, DimensionMaster, BomMaster, ParsedVoucher } from '../types';
import { useNotifications } from '../../context/NotificationContext';

export const ALL_VOUCHERS_KEY = 'bharat_book_all_vouchers_v2_v2';
export const PARTY_MASTERS_KEY = 'bharat_book_party_masters';
export const LEDGER_MASTERS_KEY = 'bharat_book_ledger_masters';
export const ITEM_MASTERS_KEY = 'bharat_book_item_masters';
export const UOM_MASTERS_KEY = 'bharat_book_uom_masters';
export const GST_MASTERS_KEY = 'bharat_book_gst_masters';
export const BRAND_MASTERS_KEY = 'bharat_book_brand_masters';
export const CATEGORY_MASTERS_KEY = 'bharat_book_category_masters';
export const GRADE_MASTERS_KEY = 'bharat_book_grade_masters';
export const ASSERTION_CATEGORY_MASTERS_KEY = 'bharat_book_assertion_category_masters';
export const ASSERTION_CODE_MASTERS_KEY = 'bharat_book_assertion_code_masters';
export const CONTACT_MASTERS_KEY = 'bharat_book_contact_masters';
export const LOCATION_MASTERS_KEY = 'bharat_book_location_masters';
export const STOCK_GROUP_MASTERS_KEY = 'bharat_book_stock_group_masters';
export const COST_CENTER_MASTERS_KEY = 'bharat_book_cost_center_masters';
export const ACCOUNT_GROUP_MASTERS_KEY = 'bharat_book_account_group_masters';
export const BOM_MASTERS_KEY = 'bharat_book_bom_masters';


export const useMasterState = (allVouchers: ParsedVoucher[], setSyncProgress: (progress: {current: number, total: number, label: string} | null) => void, setAllVouchers: React.Dispatch<React.SetStateAction<ParsedVoucher[]>>) => {
  const { addNotification } = useNotifications();

  const [partyMasters, setPartyMasters] = useStorageState<any[]>(PARTY_MASTERS_KEY, []);
  const [ledgerMasters, setLedgerMasters] = useStorageState<any[]>(LEDGER_MASTERS_KEY, []);
  const [itemMasters, setItemMasters] = useStorageState<any[]>(ITEM_MASTERS_KEY, []);
  const [uomMasters, setUomMasters] = useStorageState<any[]>(UOM_MASTERS_KEY, []);
  const [gstMasters, setGstMasters] = useStorageState<any[]>(GST_MASTERS_KEY, []);
  const [brandMasters, setBrandMasters] = useStorageState<any[]>(BRAND_MASTERS_KEY, []);
  const [categoryMasters, setCategoryMasters] = useStorageState<any[]>(CATEGORY_MASTERS_KEY, []);
  const [gradeMasters, setGradeMasters] = useStorageState<any[]>(GRADE_MASTERS_KEY, []);
  const [assertionCategoryMasters, setAssertionCategoryMasters] = useStorageState<any[]>(ASSERTION_CATEGORY_MASTERS_KEY, []);
  const [assertionCodeMasters, setAssertionCodeMasters] = useStorageState<any[]>(ASSERTION_CODE_MASTERS_KEY, []);
  const [contactMasters, setContactMasters] = useStorageState<any[]>(CONTACT_MASTERS_KEY, []);
  const [skuMasters, setSkuMasters] = useStorageState<any[]>('bharat_book_sku_masters', []);
  const [priceListMasters, setPriceListMasters] = useStorageState<any[]>('bharat_book_price_list_masters', []);
  const [weightMasters, setWeightMasters] = useStorageState<any[]>('bharat_book_weight_masters', []);
  const [volumeMasters, setVolumeMasters] = useStorageState<any[]>('bharat_book_volume_masters', []);
  const [colorMasters, setColorMasters] = useStorageState<ColorMaster[]>('bharat_book_color_masters', [] as ColorMaster[]);
  const [sizeMasters, setSizeMasters] = useStorageState<SizeMaster[]>('bharat_book_size_masters', [] as SizeMaster[]);
  const [variantMasters, setVariantMasters] = useStorageState<any[]>('bharat_book_variant_masters', []);
  const [dimensionMasters, setDimensionMasters] = useStorageState<DimensionMaster[]>('bharat_book_dimension_masters', [] as DimensionMaster[]);
  const [locationMasters, setLocationMasters] = useStorageState<any[]>(LOCATION_MASTERS_KEY, []);
  const [bomMasters, setBomMasters] = useStorageState<BomMaster[]>(BOM_MASTERS_KEY, []);
  const [stockGroupMasters, setStockGroupMasters] = useStorageState<any[]>(STOCK_GROUP_MASTERS_KEY, []);
  const [costCenterMasters, setCostCenterMasters] = useStorageState<any[]>(COST_CENTER_MASTERS_KEY, []);
  const [accountGroupMasters, setAccountGroupMasters] = useStorageState<any[]>(ACCOUNT_GROUP_MASTERS_KEY, []);
  const [customMasters, setCustomMasters] = useStorageState<Record<string, any[]>>('bharat_book_custom_masters', {});

  const [activeSamples, setActiveSamples] = useStorageState<string[]>('bharat_book_active_samples_v12', [
      'uoms', 'gst', 'brands', 'categories', 'warehouses', 'skus', 'priceList', 
      'weights', 'volumes', 'colors', 'sizes', 'variants', 'dimensions', 'stockGroups', 
      'grades', 'assertionCategories', 'assertionCodes', 
      'ledgers', 'items', 'bom', 'parties', 'vendors', 'partners', 'accountGroups', 'banks', 'costCenters', 'contacts',
      'balance_sheet', 'profit_loss', 'cash_flow', 'bank_flow', 'trial_balance', 
      'sales_register', 'purchase_register', 'financial_vouchers', 'gstr1',
      'day_book', 'journal_register', 'debit_note_register', 'credit_note_register',
      'payment_register', 'receipt_register', 'contra_register', 'audit_trail',
      'item_vouchers', 'stock_summary', 'item_movement', 'low_stock', 'inventory_valuation',
      'bank_vouchers', 'raw_bank', 'auto_match', 'missing_master', 'unidentified', 'to_classify', 'reconcile',
      'gstr2b', 'gstr3b', 'gstr9', 'gstr9c', 'others'
    ]);

  // Sync activeSamples to fetch them if missing
    useEffect(() => {
      let active = true;
      const fetchMissingSamples = async () => {
        // Small delay to let initial localStorage settle
        await new Promise(r => setTimeout(r, 500));
        if (!active) return;
        
        const missingSamples = activeSamples.filter(id => {
          let hasData = false;
          if (['parties', 'vendors', 'partners'].includes(id)) hasData = (Array.isArray(partyMasters) ? partyMasters : []).some((m: any) => m.sampleSetId === id);
          else if (['ledgers', 'banks'].includes(id)) hasData = (Array.isArray(ledgerMasters) ? ledgerMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'items') hasData = (Array.isArray(itemMasters) ? itemMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'uoms') hasData = (Array.isArray(uomMasters) ? uomMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'bom') hasData = (Array.isArray(bomMasters) ? bomMasters : []).some((m: any) => m.sampleSetId === id);
          else if (['warehouses', 'locations'].includes(id)) hasData = (Array.isArray(locationMasters) ? locationMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'gst') hasData = (Array.isArray(gstMasters) ? gstMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'brands') hasData = (Array.isArray(brandMasters) ? brandMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'categories') hasData = (Array.isArray(categoryMasters) ? categoryMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'skus') hasData = (Array.isArray(skuMasters) ? skuMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'priceList') hasData = (Array.isArray(priceListMasters) ? priceListMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'weights') hasData = (Array.isArray(weightMasters) ? weightMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'volumes') hasData = (Array.isArray(volumeMasters) ? volumeMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'colors') hasData = (Array.isArray(colorMasters) ? colorMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'sizes') hasData = (Array.isArray(sizeMasters) ? sizeMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'variants') hasData = (Array.isArray(variantMasters) ? variantMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'dimensions') hasData = (Array.isArray(dimensionMasters) ? dimensionMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'stockGroups') hasData = (Array.isArray(stockGroupMasters) ? stockGroupMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'grades') hasData = (Array.isArray(gradeMasters) ? gradeMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'assertionCategories') hasData = (Array.isArray(assertionCategoryMasters) ? assertionCategoryMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'assertionCodes') hasData = (Array.isArray(assertionCodeMasters) ? assertionCodeMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'accountGroups') hasData = (Array.isArray(accountGroupMasters) ? accountGroupMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'costCenters') hasData = (Array.isArray(costCenterMasters) ? costCenterMasters : []).some((m: any) => m.sampleSetId === id);
          else if (id === 'contacts') hasData = (Array.isArray(contactMasters) ? contactMasters : []).some((m: any) => m.sampleSetId === id);
          else if (['gstr2b', 'gstr3b', 'gstr9', 'gstr9c', 'others'].includes(id)) hasData = true; // Handled per component
          else hasData = (Array.isArray(allVouchers) ? allVouchers : []).some((v: any) => v.sampleSetId === id);
          return !hasData;
        });
  
        if (missingSamples.length > 0) {
          setSyncProgress({ current: 0, total: missingSamples.length, label: 'Loading Demo Mode Data...' });
          let current = 0;
          for (const id of missingSamples) {
            try {
              // Apply a 5 second timeout to prevent indefinite hanging in case of network issues
              const fetchPromise = toggleSampleDataSet(id, true);
              const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000));
              await Promise.race([fetchPromise, timeoutPromise]);
  
            } catch(e) {
               console.error('Failed to load missing sample (timeout or error):', id);
            }
            if (!active) {
              // Still clear UI if component unmounted or effect reran during await
              setSyncProgress(null);
              break;
            }
            current++;
            setSyncProgress({ current, total: missingSamples.length, label: 'Loading Demo Mode Data...' });
          }
          setTimeout(() => {
            if (active) setSyncProgress(null);
          }, 1200);
        }
      };
      fetchMissingSamples();
      return () => { active = false; };
    }, [activeSamples]);
  

  const handleAddPartyMaster = (name: string) => {
      if (!partyMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newParty: any = {
            id: `p-${Date.now()}`,
            name,
            type: 'Vendor'
        };
        setPartyMasters((prev: any) => [...prev, newParty]);
    }
  };

  const handleAddLedgerMaster = (name: string) => {
      if (!ledgerMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newLedger: any = {
            id: `l-${Date.now()}`,
            name,
            group: 'Indirect Expenses'
        };
        setLedgerMasters((prev: any) => [...prev, newLedger]);
    }
  };

  const handleAddUomMaster = (name: string) => {
      if (!uomMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase() || String(m.symbol || '').toLowerCase() === name.toLowerCase())) {
        const newUom: any = {
            id: `u-${Date.now()}`,
            name,
            symbol: name.substring(0, 3).toUpperCase()
        };
        setUomMasters((prev: any) => [...prev, newUom]);
    }
  };

  const handleAddItemMaster = (name: string) => {
      if (!itemMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newItem: any = {
            id: `i-${Date.now()}`,
            name,
            taxRate: 18,
            uom: 'Nos'
        };
        setItemMasters((prev: any) => [...prev, newItem]);
    }
  };

  const handleSetPartyMasters = (masters: any[]) => setPartyMasters(masters);

  const handleSetLedgerMasters = (masters: any[]) => setLedgerMasters(masters);

  const handleSetItemMasters = (masters: any[]) => setItemMasters(masters);

  const handleSetUomMasters = (masters: any[]) => setUomMasters(masters);

  const handleSetGstMasters = (masters: any[]) => setGstMasters(masters);

  const handleSetBrandMasters = (masters: any[]) => setBrandMasters(masters);

  const handleSetCategoryMasters = (masters: any[]) => setCategoryMasters(masters);

  const handleSetGradeMasters = (masters: any[]) => setGradeMasters(masters);


    async function toggleSampleDataSet(id: string, forceState?: boolean) {
    const currentlyActive = activeSamples.includes(id);
    const shouldEnable = forceState !== undefined ? forceState : !currentlyActive;

    if (shouldEnable === currentlyActive && forceState === undefined) return;

    setActiveSamples(prev => {
        if (shouldEnable) {
            return prev.includes(id) ? prev : [...prev, id];
        } else {
            return prev.filter(s => s !== id);
        }
    });

    if (!shouldEnable) {
        const filterFn = (prev: any[]) => prev.filter(m => m.sampleSetId !== id);
        switch (id) {
            case 'uoms': setUomMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'gst': setGstMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'brands': setBrandMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'categories': setCategoryMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'warehouses':
            case 'locations': setLocationMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'skus': setSkuMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'priceList': setPriceListMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'weights': setWeightMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'volumes': setVolumeMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'colors': setColorMasters((prev: any) => prev.filter((m: any) => m.sampleSetId !== id)); break;
            case 'sizes': setSizeMasters((prev: any) => prev.filter((m: any) => m.sampleSetId !== id)); break;
            case 'variants': setVariantMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'dimensions': setDimensionMasters((prev: any) => prev.filter((m: any) => m.sampleSetId !== id)); break;
            case 'stockGroups': setStockGroupMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'grades': setGradeMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'assertionCategories': setAssertionCategoryMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'assertionCodes': setAssertionCodeMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'items': setItemMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'bom': setBomMasters((prev: any) => prev.filter((m: any) => m.sampleSetId !== id)); break;
            case 'parties':
            case 'vendors':
            case 'partners': setPartyMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'accountGroups': setAccountGroupMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'ledgers':
            case 'banks': setLedgerMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'costCenters': setCostCenterMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            case 'contacts': setContactMasters(prev => prev.filter(m => m.sampleSetId !== id)); break;
            default: setAllVouchers(prev => prev.filter(m => m.sampleSetId !== id)); break;
        }
    } else {
        let navMeta: any = { reportIds: [], entryIds: [], itemMasterKeys: [] };
        try {
            const navMetaResponse = await fetch('/sample-data/navigation_meta.json');
            if (navMetaResponse.ok) {
                navMeta = await navMetaResponse.json();
            }
        } catch (e) {
            console.warn("Failed to load navigation_meta.json", e);
        }

        const reportIds = navMeta?.reportIds || [];
        const entryIds = navMeta?.entryIds || [];
        const itemMasterKeys = navMeta?.itemMasterKeys || [];

        let isReport = reportIds.includes(id);
        const isEntry = entryIds.includes(id);
        const isItemMaster = itemMasterKeys.includes(id) || id === 'gst';

        if (id.endsWith('_register') || (id.endsWith('_vouchers') && id !== 'demo_vouchers') || id === 'audit_trail' || id === 'day_book' || id === 'reconcile') {
             isReport = true;
        }

        const folder = isReport ? 'reports' : (isEntry ? 'dashboard' : (isItemMaster ? 'item-master' : 'ledger-master'));
        let filename = (isReport || isEntry) ? id : (id === 'gst' ? 'hsn' : id);
        
        // Adblocker evasion or safe names
        if (id === 'payment_register') filename = 'pay_reg_data';
        if (id === 'receipt_register') filename = 'rec_reg_data';
        if (id === 'contra_register') filename = 'con_reg_data';
        if (id === 'debit_note_register') filename = 'dr_note_reg_data';
        if (id === 'credit_note_register') filename = 'cr_note_reg_data';
        if (id === 'debit_note_entry') filename = 'dr_note_entry_data';
        if (id === 'credit_note_entry') filename = 'cr_note_entry_data';
        if (id === 'gstr1') filename = 'g1_data';
        if (id === 'gstr2b') filename = 'g2b_data';
        if (id === 'gstr3b') filename = 'g3b_data';
        if (id === 'gstr9') filename = 'g9_data';
        if (id === 'gstr9c') filename = 'g9c_data';
        if (id === 'accountGroups') filename = 'acc_groups';
        if (id === 'ledgers') filename = 'ldg_masters';
        
        try {
            const url = `/sample-data/${folder}/${filename}.json`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url} (Status: ${response.status})`);
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                 console.warn(`Sample data ${url} is not JSON (possibly a 404 fallback). Ignoring.`);
                 return;
            }
            const data = await response.json();
            if (!Array.isArray(data)) return;
            
            const sampleData = data.map((m: any) => ({ ...m, isSample: true, sampleSetId: id }));
            
            const merge = (prev: any[]) => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const map = new Map();
                safePrev.filter((m: any) => m.sampleSetId !== id).forEach(m => {
                    if (m && m.id) map.set(m.id, m);
                });
                sampleData.forEach((m: any) => {
                    if (m && m.id) map.set(m.id, m);
                });
                return Array.from(map.values());
            };
            
            switch (id) {
                case 'uoms': setUomMasters(merge); break;
                case 'gst': setGstMasters(merge); break;
                case 'brands': setBrandMasters(merge); break;
                case 'categories': setCategoryMasters(merge); break;
                case 'warehouses':
                case 'locations': setLocationMasters(merge); break;
                case 'skus': setSkuMasters(merge); break;
                case 'priceList': setPriceListMasters(merge); break;
                case 'weights': setWeightMasters(merge); break;
                case 'volumes': setVolumeMasters(merge); break;
                case 'colors': setColorMasters(merge); break;
                case 'sizes': setSizeMasters(merge); break;
                case 'variants': setVariantMasters(merge); break;
                case 'dimensions': setDimensionMasters(merge); break;
                case 'stockGroups': setStockGroupMasters(merge); break;
                case 'grades': setGradeMasters(merge); break;
                case 'assertionCategories': setAssertionCategoryMasters(merge); break;
                case 'assertionCodes': setAssertionCodeMasters(merge); break;
                case 'items': setItemMasters(merge); break;
                case 'bom': setBomMasters(merge); break;
                case 'parties':
                case 'vendors':
                case 'partners': setPartyMasters(merge); break;
                case 'accountGroups': setAccountGroupMasters(merge); break;
                case 'ledgers':
                case 'banks': setLedgerMasters(merge); break;
                case 'costCenters': setCostCenterMasters(merge); break;
                case 'contacts': setContactMasters(merge); break;
                default: setAllVouchers(merge); break;
            }
        } catch (e: any) {
            console.error(`Error loading sample data for '${id}' (url: /sample-data/${folder}/${filename}.json):`, e.message);
            // By skipping the filter here, the toggle remains visually ON even if there's no specific file.
        }
    }
  };

  return {
    toggleSampleDataSet,
    partyMasters,
    setPartyMasters,
    ledgerMasters,
    setLedgerMasters,
    itemMasters,
    setItemMasters,
    uomMasters,
    setUomMasters,
    gstMasters,
    setGstMasters,
    brandMasters,
    setBrandMasters,
    categoryMasters,
    setCategoryMasters,
    gradeMasters,
    setGradeMasters,
    assertionCategoryMasters,
    setAssertionCategoryMasters,
    assertionCodeMasters,
    setAssertionCodeMasters,
    contactMasters,
    setContactMasters,
    skuMasters,
    setSkuMasters,
    priceListMasters,
    setPriceListMasters,
    weightMasters,
    setWeightMasters,
    volumeMasters,
    setVolumeMasters,
    colorMasters,
    setColorMasters,
    sizeMasters,
    setSizeMasters,
    variantMasters,
    setVariantMasters,
    dimensionMasters,
    setDimensionMasters,
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
    customMasters,
    setCustomMasters,
    activeSamples,
    setActiveSamples,
    handleAddPartyMaster,
    handleAddLedgerMaster,
    handleAddUomMaster,
    handleAddItemMaster,
    handleSetPartyMasters,
    handleSetLedgerMasters,
    handleSetItemMasters,
    handleSetUomMasters,
    handleSetGstMasters,
    handleSetBrandMasters,
    handleSetCategoryMasters,
    handleSetGradeMasters
  };
};
