
import React, { useState, useEffect } from 'react';
import { 
    InventoryIcon,
    UomIcon,
    FilterListIcon,
    TrendingUpIcon,
    TaxIcon,
    BrandIcon,
    CategoryIcon
} from '../../icons/IconComponents';
import { 
    ItemMaster, 
    UomMaster, 
    GstMaster, 
    BrandMaster, 
    CategoryMaster,
    WarehouseMaster,
    StockGroupMaster
} from '../../../app/types';

import { ItemsTab } from './Tabs/ItemsTab';
import { BasicItemsTab } from './Tabs/BasicItemsTab';
import { WarehousesTab } from './Tabs/WarehousesTab';
import { UOMsTab } from './Tabs/UOMsTab';
import { StockGroupsTab } from './Tabs/StockGroupsTab';
import { HSNTab } from './Tabs/HSNTab';
import { BrandsTab } from './Tabs/BrandsTab';
import { CategoriesTab } from './Tabs/CategoriesTab';
import { AssertionCategoriesTab } from './Tabs/AssertionCategoriesTab';
import { AssertionCodesTab } from './Tabs/AssertionCodesTab';
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
import { useLanguage } from '../../../context/LanguageContext';

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
    const { t, formatNumber } = useLanguage();
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

    const validTabs = [
        'items', 'basic_items', 'bom', 'warehouses', 'uoms', 'stockGroups', 
        'gst', 'brands', 'categories', 'assertionCategories', 'assertionCodes', 
        'colors', 'sizes', 'variants', 'dimensions', 'skus', 'priceList', 
        'weights', 'volumes', 'grades'
    ];

    const [activeTab, setActiveTab] = useState<string>(
        (initialTab && validTabs.includes(initialTab)) ? initialTab : 'items'
    );
    const [hiddenMasters, setHiddenMasters] = useState<string[]>([]);

    useEffect(() => {
        const loadHidden = () => {
            const stored = localStorage.getItem("bharat_book_hidden_masters_tabs");
            if (stored) {
                try {
                    setHiddenMasters(JSON.parse(stored));
                } catch (e) {
                    console.error(e);
                }
            } else {
                setHiddenMasters([]);
            }
        };

        loadHidden();
        window.addEventListener("bharat_book_masters_tabs_trigger", loadHidden);
        return () => {
            window.removeEventListener("bharat_book_masters_tabs_trigger", loadHidden);
        };
    }, []);

    const allTabs = [
        { id: 'items', label: 'Item Hub', icon: InventoryIcon, idKey: "item_items" },
        { id: 'basic_items', label: 'Basic Item', icon: InventoryIcon, idKey: "item_basic_items" },
        { id: 'bom', label: 'Bill of Materials', icon: FilterListIcon, idKey: "item_bom" },
        { id: 'warehouses', label: 'Warehouses', icon: CategoryIcon, idKey: "item_warehouses" },
        { id: 'uoms', label: 'UOMs', icon: UomIcon, idKey: "item_uoms" },
        { id: 'stockGroups', label: 'Stock Groups', icon: CategoryIcon, idKey: "item_stockGroups" },
        { id: 'gst', label: 'HSN', icon: TaxIcon, idKey: "item_gst" },
        { id: 'brands', label: 'Brands', icon: BrandIcon, idKey: "item_brands" },
        { id: 'categories', label: 'Categories', icon: CategoryIcon, idKey: "item_categories" },
        { id: 'assertionCategories', label: 'Assertion Categories', icon: CategoryIcon, idKey: "item_assertionCategories" },
        { id: 'assertionCodes', label: 'Assertion Codes', icon: CategoryIcon, idKey: "item_assertionCodes" },
        { id: 'colors', label: 'Colors', icon: CategoryIcon, idKey: "item_colors" },
        { id: 'sizes', label: 'Sizes', icon: FilterListIcon, idKey: "item_sizes" },
        { id: 'variants', label: 'Variants', icon: FilterListIcon, idKey: "item_variants" },
        { id: 'dimensions', label: 'Dimensions', icon: FilterListIcon, idKey: "item_dimensions" },
        { id: 'skus', label: 'SKUs', icon: FilterListIcon, idKey: "item_skus" },
        { id: 'priceList', label: 'Price List', icon: TrendingUpIcon, idKey: "item_priceList" },
        { id: 'weights', label: 'Weights', icon: FilterListIcon, idKey: "item_weights" },
        { id: 'volumes', label: 'Volumes', icon: FilterListIcon, idKey: "item_volumes" },
        { id: 'grades', label: 'Grades', icon: FilterListIcon, idKey: "item_grades" },
    ];

    const displayedTabs = allTabs.filter(t => !hiddenMasters.includes(t.idKey));

    useEffect(() => {
        if (displayedTabs.length > 0 && !displayedTabs.find(t => t.id === activeTab)) {
            setActiveTab(displayedTabs[0].id);
        }
    }, [hiddenMasters, activeTab, displayedTabs]);
    
    useEffect(() => {
        if (initialTab && validTabs.includes(initialTab) && initialTab !== activeTab) {
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
                    weightMasters={weightMasters}
                />;
            case 'basic_items':
                return <BasicItemsTab 
                    data={itemMasters} 
                    onSave={setItemMasters} 
                    uomMasters={uomMasters} 
                    categoryMasters={categoryMasters}
                />;
            case 'bom':
                return <BillOfMaterialsTab data={bomMasters} onSave={setBomMasters} itemMasters={itemMasters} />;
            case 'warehouses':
                return <WarehousesTab data={warehouseMasters} onSave={setWarehouseMasters} />;
            case 'uoms':
                return <UOMsTab data={uomMasters} onSave={setUomMasters} />;
            case 'stockGroups':
                return <StockGroupsTab data={stockGroupMasters} onSave={setStockGroupMasters} />;
            case 'gst':
                return <HSNTab data={gstMasters} onSave={setGstMasters} />;
            case 'brands':
                return <BrandsTab data={brandMasters} onSave={setBrandMasters} />;
            case 'categories':
                return <CategoriesTab data={categoryMasters} onSave={setCategoryMasters} />;
            case 'assertionCategories':
                return <AssertionCategoriesTab data={assertionCategoryMasters} onSave={setAssertionCategoryMasters} />;
            case 'assertionCodes':
                return <AssertionCodesTab data={assertionCodeMasters} onSave={setAssertionCodeMasters} assertionCategoryMasters={assertionCategoryMasters} />;
            case 'colors':
                return <ColorsTab data={colorMasters} onSave={setColorMasters} />;
            case 'sizes':
                return <SizesTab data={sizeMasters} onSave={setSizeMasters} />;
            case 'variants':
                return <VariantsTab data={variantMasters} onSave={setVariantMasters} itemMasters={itemMasters} colorMasters={colorMasters} sizeMasters={sizeMasters} />;
            case 'dimensions':
                return <DimensionsTab data={dimensionMasters} onSave={setDimensionMasters} />;
            case 'skus':
                return <SKUsTab data={skuMasters} onSave={setSkuMasters} itemMasters={itemMasters} />;
            case 'priceList':
                return <PriceListTab data={priceListMasters} onSave={setPriceListMasters} />;
            case 'weights':
                return <WeightsTab data={weightMasters} onSave={setWeightMasters} />;
            case 'volumes':
                return <VolumesTab data={volumeMasters} onSave={setVolumeMasters} />;
            case 'grades':
                return <GradesTab data={gradeMasters} onSave={setGradeMasters} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto custom-scrollbar items-center pr-4 flex-shrink-0 justify-between">
                    <div className="flex">
                        {displayedTabs.map(tab => (
                            <button key={tab.id} id={`item-master-tab-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`px-6 py-4 text-sm font-bold relative transition-all whitespace-nowrap flex items-center ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                                <tab.icon className="w-4 h-4 mr-2 opacity-70" />
                                {t(tab.label)}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative bg-white dark:bg-gray-800">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};
