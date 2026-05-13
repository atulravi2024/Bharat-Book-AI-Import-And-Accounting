
import React, { useState, useEffect } from 'react';
import { 
    InventoryIcon,
    UomIcon,
    FilterListIcon,
    TrendingUpIcon,
    TaxIcon,
    BrandIcon,
    CategoryIcon,
    DownloadIcon
} from '../../icons/IconComponents';
import { 
    ItemMaster, 
    UomMaster, 
    GstMaster, 
    BrandMaster, 
    CategoryMaster,
    WarehouseMaster,
    StockGroupMaster
} from '../../../types';

import { ItemsTab } from './Tabs/ItemsTab';
import { WarehousesTab } from './Tabs/WarehousesTab';
import { UOMsTab } from './Tabs/UOMsTab';
import { StockGroupsTab } from './Tabs/StockGroupsTab';
import { HSNTab } from './Tabs/HSNTab';
import { BrandsTab } from './Tabs/BrandsTab';
import { CategoriesTab } from './Tabs/CategoriesTab';
import { ColorsTab } from './Tabs/ColorsTab';
import { SizesTab } from './Tabs/SizesTab';
import { VariantsTab } from './Tabs/VariantsTab';
import { DimensionsTab } from './Tabs/DimensionsTab';
import { SKUsTab } from './Tabs/SKUsTab';
import { PriceListTab } from './Tabs/PriceListTab';
import { WeightsTab } from './Tabs/WeightsTab';
import { VolumesTab } from './Tabs/VolumesTab';
import { GradesTab } from './Tabs/GradesTab';
import { BillOfMaterialsTab } from './Tabs/BillOfMaterialsTab';

interface ItemMasterViewProps {
  initialTab?: string;
  itemMasters: ItemMaster[];
  uomMasters: UomMaster[];
  gstMasters: GstMaster[];
  brandMasters: BrandMaster[];
  categoryMasters: CategoryMaster[];
  bomMasters: any[];
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
  warehouseMasters: WarehouseMaster[];
  stockGroupMasters: StockGroupMaster[];
  setItemMasters: (masters: ItemMaster[]) => void;
  setUomMasters: (masters: UomMaster[]) => void;
  setGstMasters: (masters: GstMaster[]) => void;
  setBrandMasters: (masters: BrandMaster[]) => void;
  setCategoryMasters: (masters: CategoryMaster[]) => void;
  setBomMasters: (masters: any[]) => void;
  setGradeMasters: (masters: any[]) => void;
  setAssertionCategoryMasters: (masters: any[]) => void;
  setAssertionCodeMasters: (masters: any[]) => void;
  setSkuMasters: (masters: any[]) => void;
  setPriceListMasters: (masters: any[]) => void;
  setWeightMasters: (masters: any[]) => void;
  setVolumeMasters: (masters: any[]) => void;
  setColorMasters: (masters: any[]) => void;
  setSizeMasters: (masters: any[]) => void;
  setVariantMasters: (masters: any[]) => void;
  setDimensionMasters: (masters: any[]) => void;
  setWarehouseMasters: (masters: WarehouseMaster[]) => void;
  setStockGroupMasters: (masters: StockGroupMaster[]) => void;
}

export const ItemMasterView: React.FC<ItemMasterViewProps> = (props) => {
    const { 
        itemMasters, uomMasters, gstMasters, brandMasters, categoryMasters, bomMasters, gradeMasters, 
        assertionCategoryMasters, assertionCodeMasters, skuMasters, priceListMasters, 
        weightMasters, volumeMasters, colorMasters, sizeMasters, variantMasters, 
        dimensionMasters, warehouseMasters, stockGroupMasters,
        setItemMasters, setUomMasters, setGstMasters, setBrandMasters, setCategoryMasters,
        setBomMasters, setGradeMasters, setAssertionCategoryMasters, setAssertionCodeMasters, setSkuMasters,
        setPriceListMasters, setWeightMasters, setVolumeMasters, setColorMasters,
        setSizeMasters, setVariantMasters, setDimensionMasters, setWarehouseMasters, setStockGroupMasters,
        initialTab
    } = props;

    const [activeTab, setActiveTab] = useState<string>(initialTab || 'items');
    
    useEffect(() => {
        if (initialTab && initialTab !== activeTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    useEffect(() => {
        const scrollToTab = () => {
            const el = document.getElementById(`item-master-tab-${activeTab}`);
            const container = el?.closest('.overflow-x-auto') as HTMLElement;
            if (el && container) {
                const cRect = container.getBoundingClientRect();
                const eRect = el.getBoundingClientRect();
                if (cRect.width === 0 || eRect.width === 0) return;
                
                const offset = (eRect.left + eRect.width / 2) - (cRect.left + cRect.width / 2);
                
                if (Math.abs(offset) > 2) {
                    container.scrollBy({ left: offset, behavior: 'smooth' });
                }
            }
        };

        scrollToTab();
        const t1 = setTimeout(scrollToTab, 100);
        const t2 = setTimeout(scrollToTab, 300);
        const t3 = setTimeout(scrollToTab, 500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [activeTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'items':
                return <ItemsTab 
                    data={itemMasters} 
                    onSave={setItemMasters} 
                    uomMasters={uomMasters} 
                    categoryMasters={categoryMasters} 
                    brandMasters={brandMasters}
                    stockGroupMasters={stockGroupMasters}
                    gradeMasters={gradeMasters}
                    assertionCategoryMasters={assertionCategoryMasters}
                    assertionCodeMasters={assertionCodeMasters}
                    gstMasters={gstMasters}
                />;
            case 'bom':
                return <BillOfMaterialsTab data={bomMasters} onSave={setBomMasters} itemMasters={itemMasters} />;
            case 'warehouses':
                return <WarehousesTab data={warehouseMasters} onSave={setWarehouseMasters} />;
            case 'uoms':
                return <UOMsTab data={uomMasters} onSave={setUomMasters} />;
            case 'stockGroup':
                return <StockGroupsTab data={stockGroupMasters} onSave={setStockGroupMasters} />;
            case 'gst':
                return <HSNTab data={gstMasters} onSave={setGstMasters} />;
            case 'brands':
                return <BrandsTab data={brandMasters} onSave={setBrandMasters} />;
            case 'categories':
                return <CategoriesTab data={categoryMasters} onSave={setCategoryMasters} />;
            case 'color':
                return <ColorsTab data={colorMasters} onSave={setColorMasters} />;
            case 'size':
                return <SizesTab data={sizeMasters} onSave={setSizeMasters} />;
            case 'variant':
                return <VariantsTab data={variantMasters} onSave={setVariantMasters} itemMasters={itemMasters} colorMasters={colorMasters} sizeMasters={sizeMasters} />;
            case 'dimension':
                return <DimensionsTab data={dimensionMasters} onSave={setDimensionMasters} />;
            case 'sku':
                return <SKUsTab data={skuMasters} onSave={setSkuMasters} itemMasters={itemMasters} />;
            case 'priceList':
                return <PriceListTab data={priceListMasters} onSave={setPriceListMasters} />;
            case 'weight':
                return <WeightsTab data={weightMasters} onSave={setWeightMasters} />;
            case 'volume':
                return <VolumesTab data={volumeMasters} onSave={setVolumeMasters} />;
            case 'grades':
                return <GradesTab data={gradeMasters} onSave={setGradeMasters} />;
            default:
                return null;
        }
    };

    const exportData = () => {
        let exportData: any[] = [];
        let filename = 'export.json';
        switch (activeTab) {
            case 'items': exportData = itemMasters; filename = 'Items.json'; break;
            case 'bom': exportData = bomMasters; filename = 'BOMs.json'; break;
            case 'warehouses': exportData = warehouseMasters; filename = 'Warehouses.json'; break;
            case 'uoms': exportData = uomMasters; filename = 'UOMs.json'; break;
            case 'stockGroup': exportData = stockGroupMasters; filename = 'StockGroups.json'; break;
            case 'gst': exportData = gstMasters; filename = 'HSN_GST.json'; break;
            case 'brands': exportData = brandMasters; filename = 'Brands.json'; break;
            case 'categories': exportData = categoryMasters; filename = 'Categories.json'; break;
            case 'color': exportData = colorMasters; filename = 'Colors.json'; break;
            case 'size': exportData = sizeMasters; filename = 'Sizes.json'; break;
            case 'variant': exportData = variantMasters; filename = 'Variants.json'; break;
            case 'dimension': exportData = dimensionMasters; filename = 'Dimensions.json'; break;
            case 'sku': exportData = skuMasters; filename = 'SKUs.json'; break;
            case 'priceList': exportData = priceListMasters; filename = 'PriceLists.json'; break;
            case 'weight': exportData = weightMasters; filename = 'Weights.json'; break;
            case 'volume': exportData = volumeMasters; filename = 'Volumes.json'; break;
            case 'grades': exportData = gradeMasters; filename = 'Grades.json'; break;
            default: break;
        }

        if(!exportData || exportData.length === 0) {
            alert('No data available to export for this section.');
            return;
        }

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto custom-scrollbar items-center pr-4 flex-shrink-0 justify-between">
                    <div className="flex">
                        {[
                            { id: 'items', label: 'Items', icon: InventoryIcon },
                            { id: 'bom', label: 'Bill of Materials', icon: FilterListIcon },
                            { id: 'warehouses', label: 'Warehouses', icon: CategoryIcon },
                            { id: 'uoms', label: 'UOMs', icon: UomIcon },
                            { id: 'stockGroup', label: 'Stock Groups', icon: CategoryIcon },
                            { id: 'gst', label: 'HSN', icon: TaxIcon },
                            { id: 'brands', label: 'Brands', icon: BrandIcon },
                            { id: 'categories', label: 'Categories', icon: CategoryIcon },
                            { id: 'color', label: 'Colors', icon: CategoryIcon },
                            { id: 'size', label: 'Sizes', icon: FilterListIcon },
                            { id: 'variant', label: 'Variants', icon: FilterListIcon },
                            { id: 'dimension', label: 'Dimensions', icon: FilterListIcon },
                            { id: 'sku', label: 'SKUs', icon: FilterListIcon },
                            { id: 'priceList', label: 'Price List', icon: TrendingUpIcon },
                            { id: 'weight', label: 'Weights', icon: FilterListIcon },
                            { id: 'volume', label: 'Volumes', icon: FilterListIcon },
                            { id: 'grades', label: 'Grades', icon: FilterListIcon },
                        ].map(tab => (
                            <button key={tab.id} id={`item-master-tab-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`px-6 py-4 text-sm font-bold relative transition-all whitespace-nowrap flex items-center ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                                <tab.icon className="w-4 h-4 mr-2 opacity-70" />
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>
                    <button onClick={exportData} title="Export Active Tab to JSON" className="ml-4 flex-shrink-0 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg flex items-center text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:dark:bg-gray-600">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download
                    </button>
                </div>
                <div className="flex-1 overflow-hidden relative bg-white dark:bg-gray-800">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};
