
import React, { useState } from 'react';
import { LedgerMasterView } from './LedgerMaster/LedgerMasterView';
import { ItemMasterView } from './ItemMaster/ItemMasterView';
import { Layers, Package } from 'lucide-react';

interface MasterViewProps {
  // Pass all the props required by both sub-views
  partyMasters: any[];
  ledgerMasters: any[];
  contactMasters: any[];
  warehouseMasters: any[];
  costCenterMasters: any[];
  accountGroupMasters: any[];
  setPartyMasters: any;
  setLedgerMasters: any;
  setContactMasters: any;
  setWarehouseMasters: any;
  setCostCenterMasters: any;
  setAccountGroupMasters: any;

  itemMasters: any[];
  uomMasters: any[];
  gstMasters: any[];
  brandMasters: any[];
  categoryMasters: any[];
  gradeMasters: any[];
  assertionCategoryMasters: any[];
  assertionCodeMasters: any[];
  skuMasters: any[];
  priceListMasters: any[];
  weightMasters: any[];
  volumeMasters: any[];
  colorMasters: any[];
  sizeMasters: any[];
  variantMasters: any[];
  dimensionMasters: any[];
  stockGroupMasters: any[];
  setItemMasters: any;
  setUomMasters: any;
  setGstMasters: any;
  setBrandMasters: any;
  setCategoryMasters: any;
  setGradeMasters: any;
  setAssertionCategoryMasters: any;
  setAssertionCodeMasters: any;
  setSkuMasters: any;
  setPriceListMasters: any;
  setWeightMasters: any;
  setVolumeMasters: any;
  setColorMasters: any;
  setSizeMasters: any;
  setVariantMasters: any;
  setDimensionMasters: any;
  setStockGroupMasters: any;
  
  initialSubTab?: 'ledger' | 'item';
  initialTab?: any;
}

export const MasterView: React.FC<MasterViewProps> = (props) => {
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'item'>(props.initialSubTab || 'ledger');

  // Sync state if props change (since sidebar handles switching now)
  React.useEffect(() => {
    if (props.initialSubTab) {
      setActiveSubTab(props.initialSubTab);
    }
  }, [props.initialSubTab]);

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="flex-1 overflow-y-auto">
        {activeSubTab === 'ledger' ? (
          <LedgerMasterView
            initialTab={props.initialTab}
            partyMasters={props.partyMasters}
            ledgerMasters={props.ledgerMasters}
            contactMasters={props.contactMasters}
            warehouseMasters={props.warehouseMasters}
            costCenterMasters={props.costCenterMasters}
            accountGroupMasters={props.accountGroupMasters}
            setPartyMasters={props.setPartyMasters}
            setLedgerMasters={props.setLedgerMasters}
            setContactMasters={props.setContactMasters}
            setWarehouseMasters={props.setWarehouseMasters}
            setCostCenterMasters={props.setCostCenterMasters}
            setAccountGroupMasters={props.setAccountGroupMasters}
          />
        ) : (
          <ItemMasterView
            initialTab={props.initialTab}
            itemMasters={props.itemMasters}
            uomMasters={props.uomMasters}
            gstMasters={props.gstMasters}
            brandMasters={props.brandMasters}
            categoryMasters={props.categoryMasters}
            gradeMasters={props.gradeMasters}
            assertionCategoryMasters={props.assertionCategoryMasters}
            assertionCodeMasters={props.assertionCodeMasters}
            skuMasters={props.skuMasters}
            priceListMasters={props.priceListMasters}
            weightMasters={props.weightMasters}
            volumeMasters={props.volumeMasters}
            colorMasters={props.colorMasters}
            sizeMasters={props.sizeMasters}
            variantMasters={props.variantMasters}
            dimensionMasters={props.dimensionMasters}
            warehouseMasters={props.warehouseMasters}
            stockGroupMasters={props.stockGroupMasters}
            setItemMasters={props.setItemMasters}
            setUomMasters={props.setUomMasters}
            setGstMasters={props.setGstMasters}
            setBrandMasters={props.setBrandMasters}
            setCategoryMasters={props.setCategoryMasters}
            setGradeMasters={props.setGradeMasters}
            setAssertionCategoryMasters={props.setAssertionCategoryMasters}
            setAssertionCodeMasters={props.setAssertionCodeMasters}
            setSkuMasters={props.setSkuMasters}
            setPriceListMasters={props.setPriceListMasters}
            setWeightMasters={props.setWeightMasters}
            setVolumeMasters={props.setVolumeMasters}
            setColorMasters={props.setColorMasters}
            setSizeMasters={props.setSizeMasters}
            setVariantMasters={props.setVariantMasters}
            setDimensionMasters={props.setDimensionMasters}
            setStockGroupMasters={props.setStockGroupMasters}
          />
        )}
      </div>
    </div>
  );
};
