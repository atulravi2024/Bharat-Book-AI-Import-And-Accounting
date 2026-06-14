import { LevelOneConfig } from "./types";

export const getExpandedLevels = (language: string): LevelOneConfig[] => [
  {
    id: "general",
    label: language === "hi" ? "सामान्य सेटिंग्स" : "General Settings",
    description: language === "hi" ? "सामान्य और मूल अनुप्रयोग सेटिंग्स" : "Core workspace, numbering, printing, forms and navigation",
    iconName: "settings",
    subpages: [
      {
        id: "general_sub_0",
        label: "Currency & Indian Numbering Style",
        description: "Manage currency & indian numbering style configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_0_tab_0",
            label: "Indian System (Lakh & Crore)",
            description: "Configure the indian system (lakh & crore) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_0_tab_1",
            label: "International System (Million)",
            description: "Configure the international system (million) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_0_tab_2",
            label: "Business Date Format",
            description: "Configure the business date format applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_0_tab_3",
            label: "Mask Proprietary Balances",
            description: "Configure the mask proprietary balances applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_1",
        label: "System Language & Dialect",
        description: "Manage system language & dialect configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_1_tab_0",
            label: "Typography Pairings",
            description: "Configure the typography pairings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_2",
        label: "Home",
        description: "Manage home configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_2_tab_0",
            label: "Dashboard",
            description: "Configure the dashboard applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_1",
            label: "Transactions",
            description: "Configure the transactions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_2",
            label: "Inventory Trans.",
            description: "Configure the inventory trans. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_3",
            label: "Bulk Operation",
            description: "Configure the bulk operation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_4",
            label: "Ledger Master",
            description: "Configure the ledger master applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_5",
            label: "Item Master",
            description: "Configure the item master applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_6",
            label: "Bank Vouchers",
            description: "Configure the bank vouchers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_7",
            label: "Ledger Report",
            description: "Configure the ledger report applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_8",
            label: "GST Report",
            description: "Configure the gst report applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_9",
            label: "Tax Report",
            description: "Configure the tax report applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_10",
            label: "Item Report",
            description: "Configure the item report applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_11",
            label: "Financial Report",
            description: "Configure the financial report applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_12",
            label: "Help Hub",
            description: "Configure the help hub applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_13",
            label: "AI Diagnostic Chat",
            description: "Configure the ai diagnostic chat applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_14",
            label: "Systems Integrity Suite",
            description: "Configure the systems integrity suite applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_15",
            label: "Submit & Track Tickets",
            description: "Configure the submit & track tickets applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_16",
            label: "Overview",
            description: "Configure the overview applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_17",
            label: "Sales",
            description: "Configure the sales applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_18",
            label: "Purchase",
            description: "Configure the purchase applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_19",
            label: "Payment",
            description: "Configure the payment applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_20",
            label: "Receipt",
            description: "Configure the receipt applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_21",
            label: "Bank Report",
            description: "Configure the bank report applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_22",
            label: "Journal",
            description: "Configure the journal applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_23",
            label: "Contra",
            description: "Configure the contra applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_24",
            label: "Sales Entry",
            description: "Configure the sales entry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_25",
            label: "Purchase Entry",
            description: "Configure the purchase entry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_26",
            label: "Payment Entry",
            description: "Configure the payment entry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_27",
            label: "Receipt Entry",
            description: "Configure the receipt entry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_28",
            label: "Journal Entry",
            description: "Configure the journal entry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_29",
            label: "Contra Entry",
            description: "Configure the contra entry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_30",
            label: "Debit Note",
            description: "Configure the debit note applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_31",
            label: "Credit Note",
            description: "Configure the credit note applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_32",
            label: "Stock Journal",
            description: "Configure the stock journal applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_33",
            label: "Physical Stock",
            description: "Configure the physical stock applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_34",
            label: "Item Consumption",
            description: "Configure the item consumption applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_35",
            label: "Item Scrap",
            description: "Configure the item scrap applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_36",
            label: "Inter-Location",
            description: "Configure the inter-location applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_37",
            label: "Rejections In",
            description: "Configure the rejections in applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_38",
            label: "Rejections Out",
            description: "Configure the rejections out applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_39",
            label: "Upload",
            description: "Configure the upload applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_40",
            label: "Correction",
            description: "Configure the correction applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_41",
            label: "Summary",
            description: "Configure the summary applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_42",
            label: "Success",
            description: "Configure the success applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_43",
            label: "Smart Pricing Strategy",
            description: "Configure the smart pricing strategy applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_44",
            label: "AI Anomaly Detection",
            description: "Configure the ai anomaly detection applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_45",
            label: "Smart Reconcile",
            description: "Configure the smart reconcile applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_46",
            label: "Auto Categorize",
            description: "Configure the auto categorize applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_47",
            label: "Bulk Tax Update",
            description: "Configure the bulk tax update applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_48",
            label: "Batch Approvals",
            description: "Configure the batch approvals applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_49",
            label: "Batch E-Invoice",
            description: "Configure the batch e-invoice applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_50",
            label: "Mass Archival",
            description: "Configure the mass archival applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_51",
            label: "Date Repair",
            description: "Configure the date repair applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_52",
            label: "Party Categorization",
            description: "Configure the party categorization applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_53",
            label: "Currency Revaluation",
            description: "Configure the currency revaluation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_54",
            label: "GSTIN Verification",
            description: "Configure the gstin verification applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_55",
            label: "Inventory Reval",
            description: "Configure the inventory reval applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_56",
            label: "Customers",
            description: "Configure the customers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_57",
            label: "Vendors",
            description: "Configure the vendors applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_58",
            label: "General Ledgers",
            description: "Configure the general ledgers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_59",
            label: "Bank Masters",
            description: "Configure the bank masters applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_60",
            label: "Contacts",
            description: "Configure the contacts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_61",
            label: "Groups",
            description: "Configure the groups applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_62",
            label: "Locations",
            description: "Configure the locations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_63",
            label: "Cost Centers",
            description: "Configure the cost centers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_64",
            label: "Item Hub",
            description: "Configure the item hub applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_65",
            label: "Basic Item",
            description: "Configure the basic item applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_66",
            label: "Bill of Materials",
            description: "Configure the bill of materials applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_67",
            label: "Warehouses",
            description: "Configure the warehouses applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_68",
            label: "UOMs",
            description: "Configure the uoms applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_69",
            label: "Stock Groups",
            description: "Configure the stock groups applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_70",
            label: "Brands",
            description: "Configure the brands applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_71",
            label: "Categories",
            description: "Configure the categories applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_72",
            label: "Assertion Categories",
            description: "Configure the assertion categories applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_73",
            label: "Assertion Codes",
            description: "Configure the assertion codes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_74",
            label: "Colors",
            description: "Configure the colors applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_75",
            label: "Sizes",
            description: "Configure the sizes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_76",
            label: "Variants",
            description: "Configure the variants applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_77",
            label: "Dimensions",
            description: "Configure the dimensions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_78",
            label: "SKUs",
            description: "Configure the skus applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_79",
            label: "Price List",
            description: "Configure the price list applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_80",
            label: "Weights",
            description: "Configure the weights applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_81",
            label: "Volumes",
            description: "Configure the volumes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_82",
            label: "Grades",
            description: "Configure the grades applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_83",
            label: "Bank",
            description: "Configure the bank applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_84",
            label: "To Classify",
            description: "Configure the to classify applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_85",
            label: "Reconcile",
            description: "Configure the reconcile applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_86",
            label: "Matched",
            description: "Configure the matched applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_87",
            label: "Exceptions",
            description: "Configure the exceptions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_88",
            label: "Unidentified",
            description: "Configure the unidentified applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_89",
            label: "General Ledger",
            description: "Configure the general ledger applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_90",
            label: "Purchase Register",
            description: "Configure the purchase register applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_91",
            label: "Sales Register",
            description: "Configure the sales register applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_92",
            label: "Payment Register",
            description: "Configure the payment register applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_93",
            label: "Receipt Register",
            description: "Configure the receipt register applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_94",
            label: "Journal Register",
            description: "Configure the journal register applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_95",
            label: "Contra Register",
            description: "Configure the contra register applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_96",
            label: "Day Book",
            description: "Configure the day book applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_97",
            label: "Audit Trail",
            description: "Configure the audit trail applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_98",
            label: "Generate GST",
            description: "Configure the generate gst applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_99",
            label: "Filing",
            description: "Configure the filing applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_100",
            label: "Invoice Detail",
            description: "Configure the invoice detail applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_101",
            label: "HSN Detail",
            description: "Configure the hsn detail applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_102",
            label: "GSTR-2B",
            description: "Configure the gstr-2b applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_103",
            label: "GSTR-3B",
            description: "Configure the gstr-3b applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_104",
            label: "GSTR-9",
            description: "Configure the gstr-9 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_105",
            label: "GSTR-9C",
            description: "Configure the gstr-9c applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_106",
            label: "Others",
            description: "Configure the others applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_107",
            label: "Tax KPI",
            description: "Configure the tax kpi applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_108",
            label: "Advance Tax",
            description: "Configure the advance tax applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_109",
            label: "TDS Ledger",
            description: "Configure the tds ledger applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_110",
            label: "Projections",
            description: "Configure the projections applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_111",
            label: "TDS/TCS Calc",
            description: "Configure the tds/tcs calc applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_112",
            label: "Presumptive Tax",
            description: "Configure the presumptive tax applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_113",
            label: "Asset Depreciation",
            description: "Configure the asset depreciation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_114",
            label: "Expense Audit",
            description: "Configure the expense audit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_115",
            label: "Losses Set-off",
            description: "Configure the losses set-off applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_116",
            label: "LUT Application",
            description: "Configure the lut application applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_117",
            label: "e-Ledger Sim",
            description: "Configure the e-ledger sim applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_118",
            label: "Workspace Guide",
            description: "Configure the workspace guide applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_119",
            label: "Stock Summary",
            description: "Configure the stock summary applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_120",
            label: "Rate Analysis",
            description: "Configure the rate analysis applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_121",
            label: "Stock Movement",
            description: "Configure the stock movement applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_122",
            label: "Stock Aging",
            description: "Configure the stock aging applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_123",
            label: "Reorder List",
            description: "Configure the reorder list applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_124",
            label: "Category View",
            description: "Configure the category view applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_125",
            label: "HSN/SAC Summary",
            description: "Configure the hsn/sac summary applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_126",
            label: "Tax Rate Wise",
            description: "Configure the tax rate wise applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_127",
            label: "Brand Analysis",
            description: "Configure the brand analysis applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_128",
            label: "Location View",
            description: "Configure the location view applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_129",
            label: "Unit Wise",
            description: "Configure the unit wise applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_130",
            label: "Batch Wise",
            description: "Configure the batch wise applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_131",
            label: "Negative Stock",
            description: "Configure the negative stock applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_132",
            label: "Fast Moving",
            description: "Configure the fast moving applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_133",
            label: "Slow Moving",
            description: "Configure the slow moving applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_134",
            label: "Item Profitability",
            description: "Configure the item profitability applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_135",
            label: "Stock Valuation",
            description: "Configure the stock valuation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_136",
            label: "Top Selling",
            description: "Configure the top selling applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_137",
            label: "Dead Stock",
            description: "Configure the dead stock applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_138",
            label: "Reconciliation",
            description: "Configure the reconciliation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_139",
            label: "Procurement",
            description: "Configure the procurement applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_140",
            label: "Lead Time",
            description: "Configure the lead time applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_141",
            label: "Profit & Loss",
            description: "Configure the profit & loss applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_142",
            label: "Balance Sheet",
            description: "Configure the balance sheet applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_143",
            label: "Cash Flow",
            description: "Configure the cash flow applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_144",
            label: "Bank Flow",
            description: "Configure the bank flow applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_145",
            label: "Trial Balance",
            description: "Configure the trial balance applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_146",
            label: "Setting Explorer",
            description: "Configure the setting explorer applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_147",
            label: "Firm",
            description: "Configure the firm applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_148",
            label: "General",
            description: "Configure the general applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_149",
            label: "Form Detail",
            description: "Configure the form detail applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_150",
            label: "App Defaults",
            description: "Configure the app defaults applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_151",
            label: "Invoice & Print",
            description: "Configure the invoice & print applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_152",
            label: "Voucher Numbering",
            description: "Configure the voucher numbering applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_153",
            label: "Users",
            description: "Configure the users applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_154",
            label: "Alert Channel",
            description: "Configure the alert channel applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_155",
            label: "Security",
            description: "Configure the security applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_156",
            label: "Privacy",
            description: "Configure the privacy applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_157",
            label: "Import Rules",
            description: "Configure the import rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_158",
            label: "Mapping",
            description: "Configure the mapping applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_159",
            label: "AI Engines",
            description: "Configure the ai engines applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_160",
            label: "Admin",
            description: "Configure the admin applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_161",
            label: "Data Explorer",
            description: "Configure the data explorer applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_162",
            label: "Help Center",
            description: "Configure the help center applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_163",
            label: "Support",
            description: "Configure the support applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_164",
            label: "About",
            description: "Configure the about applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_165",
            label: "Main Pages",
            description: "Configure the main pages applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_166",
            label: "Subpages",
            description: "Configure the subpages applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_167",
            label: "Active Tabs",
            description: "Configure the active tabs applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_168",
            label: "Key Performance Indicators",
            description: "Configure the key performance indicators applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_169",
            label: "Sales & Receipts Trend",
            description: "Configure the sales & receipts trend applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_170",
            label: "Outstanding Receivables",
            description: "Configure the outstanding receivables applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_171",
            label: "YoY Growth Comparison",
            description: "Configure the yoy growth comparison applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_172",
            label: "Cash & Bank Position",
            description: "Configure the cash & bank position applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_173",
            label: "Recent Inflow/Outflow",
            description: "Configure the recent inflow/outflow applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_174",
            label: "Key Sales Metrics",
            description: "Configure the key sales metrics applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_175",
            label: "Sales Register Details",
            description: "Configure the sales register details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_176",
            label: "Customer Wise Summary",
            description: "Configure the customer wise summary applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_177",
            label: "Item Variant Breakdowns",
            description: "Configure the item variant breakdowns applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_178",
            label: "Key Purchase Metrics",
            description: "Configure the key purchase metrics applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_179",
            label: "Purchase Register Details",
            description: "Configure the purchase register details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_180",
            label: "Vendor Wise Summary",
            description: "Configure the vendor wise summary applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_181",
            label: "Direct/Indirect Expenses",
            description: "Configure the direct/indirect expenses applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_182",
            label: "Payment Operations",
            description: "Configure the payment operations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_183",
            label: "Outstanding Payables",
            description: "Configure the outstanding payables applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_184",
            label: "Advance Disbursements",
            description: "Configure the advance disbursements applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_185",
            label: "Account Payee Ledgers",
            description: "Configure the account payee ledgers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_186",
            label: "Collection Operations",
            description: "Configure the collection operations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_187",
            label: "Advance Receipts",
            description: "Configure the advance receipts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_188",
            label: "Aged Debtor Ledgers",
            description: "Configure the aged debtor ledgers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_189",
            label: "Statement Ingestion",
            description: "Configure the statement ingestion applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_190",
            label: "Reconciliation Board",
            description: "Configure the reconciliation board applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_191",
            label: "Automated Matches",
            description: "Configure the automated matches applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_192",
            label: "Exception Registers",
            description: "Configure the exception registers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_193",
            label: "Journal Adjustments",
            description: "Configure the journal adjustments applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_194",
            label: "Prepaid & Provisional Entries",
            description: "Configure the prepaid & provisional entries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_195",
            label: "Regulatory Audits",
            description: "Configure the regulatory audits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_196",
            label: "Cash & Contra Transits",
            description: "Configure the cash & contra transits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_197",
            label: "Bank-to-Bank Transits",
            description: "Configure the bank-to-bank transits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_198",
            label: "Purchase Returns",
            description: "Configure the purchase returns applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_199",
            label: "Dr Note Reconciliations",
            description: "Configure the dr note reconciliations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_200",
            label: "Sales Returns",
            description: "Configure the sales returns applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_201",
            label: "Cr Note Reconciliations",
            description: "Configure the cr note reconciliations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_202",
            label: "Stock Items Grid",
            description: "Configure the stock items grid applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_203",
            label: "Warehouse & Location Selection",
            description: "Configure the warehouse & location selection applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_204",
            label: "Valuation & Rates",
            description: "Configure the valuation & rates applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_205",
            label: "Counting Records",
            description: "Configure the counting records applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_206",
            label: "Discrepancy Audit",
            description: "Configure the discrepancy audit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_207",
            label: "Production Consumptions",
            description: "Configure the production consumptions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_208",
            label: "General Store Consumption",
            description: "Configure the general store consumption applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_209",
            label: "Scrap Register",
            description: "Configure the scrap register applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_210",
            label: "Value Write-offs",
            description: "Configure the value write-offs applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_211",
            label: "Stock in Transit",
            description: "Configure the stock in transit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_212",
            label: "Receipt and Allocations",
            description: "Configure the receipt and allocations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_213",
            label: "Customer Material Returned",
            description: "Configure the customer material returned applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_214",
            label: "Quality Audit Checklist",
            description: "Configure the quality audit checklist applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_215",
            label: "Debit Memo Return Shipments",
            description: "Configure the debit memo return shipments applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_216",
            label: "Discrepant Materials Logs",
            description: "Configure the discrepant materials logs applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_217",
            label: "Select Document Category",
            description: "Configure the select document category applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_218",
            label: "Choose Template File",
            description: "Configure the choose template file applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_219",
            label: "Analyze Sample Data",
            description: "Configure the analyze sample data applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_220",
            label: "Upload Excel/PDF Ingestion",
            description: "Configure the upload excel/pdf ingestion applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_221",
            label: "Verify Column Mapping",
            description: "Configure the verify column mapping applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_222",
            label: "Configure Script Pipeline",
            description: "Configure the configure script pipeline applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_223",
            label: "Unmapped Core Fields",
            description: "Configure the unmapped core fields applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_224",
            label: "Missing Ledger Masters",
            description: "Configure the missing ledger masters applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_225",
            label: "AI-repaired Alignments",
            description: "Configure the ai-repaired alignments applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_226",
            label: "Summary Charts & Trends",
            description: "Configure the summary charts & trends applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_227",
            label: "Group Tabular Summary",
            description: "Configure the group tabular summary applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_228",
            label: "Anomalies & Audit Trails",
            description: "Configure the anomalies & audit trails applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_229",
            label: "Absorption Status",
            description: "Configure the absorption status applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_230",
            label: "Transaction Telemetry",
            description: "Configure the transaction telemetry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_231",
            label: "Focus Selling Margins",
            description: "Configure the focus selling margins applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_232",
            label: "Tax Slab Base Index",
            description: "Configure the tax slab base index applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_233",
            label: "Highlight Core Outliers",
            description: "Configure the highlight core outliers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_234",
            label: "GSTIN Missing Gaps",
            description: "Configure the gstin missing gaps applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_235",
            label: "Active Auto-matching Rules",
            description: "Configure the active auto-matching rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_236",
            label: "Matching Simulation Engine",
            description: "Configure the matching simulation engine applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_237",
            label: "Heuristic Text Groupers",
            description: "Configure the heuristic text groupers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_238",
            label: "Deep Association Trees",
            description: "Configure the deep association trees applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_239",
            label: "Update by HSN Code",
            description: "Configure the update by hsn code applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_240",
            label: "Update by Item Group",
            description: "Configure the update by item group applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_241",
            label: "Queue of Entries for Review",
            description: "Configure the queue of entries for review applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_242",
            label: "Audits of Prior Batches",
            description: "Configure the audits of prior batches applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_243",
            label: "Pending E-Invoices Ready",
            description: "Configure the pending e-invoices ready applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_244",
            label: "Registered NIC Transits",
            description: "Configure the registered nic transits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_245",
            label: "Consolidation Archives",
            description: "Configure the consolidation archives applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_246",
            label: "Pruned Ledger Logs",
            description: "Configure the pruned ledger logs applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_247",
            label: "Batch Date Offsets",
            description: "Configure the batch date offsets applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_248",
            label: "Temporal Out-of-Sequence Gaps",
            description: "Configure the temporal out-of-sequence gaps applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_249",
            label: "Categorize Parties Segmentately",
            description: "Configure the categorize parties segmentately applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_250",
            label: "Unified Email Lists",
            description: "Configure the unified email lists applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_251",
            label: "Daily Exchange Indexes",
            description: "Configure the daily exchange indexes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_252",
            label: "Unrealized Forex Ledger",
            description: "Configure the unrealized forex ledger applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_253",
            label: "Register GSTR Inquiries",
            description: "Configure the register gstr inquiries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_254",
            label: "Active Taxpayer Registries",
            description: "Configure the active taxpayer registries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_255",
            label: "FIFO/LIFO Transition Indexes",
            description: "Configure the fifo/lifo transition indexes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_256",
            label: "Asset Revaluation Adjustments",
            description: "Configure the asset revaluation adjustments applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_257",
            label: "Create Custom Batch Script",
            description: "Configure the create custom batch script applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_258",
            label: "Background Task Schedulers",
            description: "Configure the background task schedulers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_259",
            label: "Business Profile",
            description: "Configure the business profile applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_260",
            label: "Finance & Banking Details",
            description: "Configure the finance & banking details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_261",
            label: "Code",
            description: "Configure the code applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_262",
            label: "Name",
            description: "Configure the name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_263",
            label: "Description / Notes",
            description: "Configure the description / notes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_264",
            label: "Group",
            description: "Configure the group applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_265",
            label: "Opening Balance",
            description: "Configure the opening balance applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_266",
            label: "Account No",
            description: "Configure the account no applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_267",
            label: "IFSC Code",
            description: "Configure the ifsc code applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_268",
            label: "Account Type",
            description: "Configure the account type applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_269",
            label: "All Contacts",
            description: "Configure the all contacts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_270",
            label: "Staff",
            description: "Configure the staff applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_271",
            label: "Partners",
            description: "Configure the partners applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_272",
            label: "Parent Group",
            description: "Configure the parent group applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_273",
            label: "Nature of Group",
            description: "Configure the nature of group applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_274",
            label: "Pin Code",
            description: "Configure the pin code applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_275",
            label: "Description",
            description: "Configure the description applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_276",
            label: "Core Identification",
            description: "Configure the core identification applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_277",
            label: "Tax & Tariff Rules",
            description: "Configure the tax & tariff rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_278",
            label: "Standard Price List",
            description: "Configure the standard price list applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_279",
            label: "Measurements & Weights",
            description: "Configure the measurements & weights applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_280",
            label: "Input Component List",
            description: "Configure the input component list applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_281",
            label: "Manufacturing Overhead",
            description: "Configure the manufacturing overhead applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_282",
            label: "Co-products & By-products",
            description: "Configure the co-products & by-products applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_283",
            label: "Available Entries",
            description: "Configure the available entries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_284",
            label: "Register New Entry",
            description: "Configure the register new entry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_285",
            label: "Revision Audits",
            description: "Configure the revision audits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_286",
            label: "Core Unclassified",
            description: "Configure the core unclassified applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_287",
            label: "Threshold Outliers",
            description: "Configure the threshold outliers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_288",
            label: "Manual Reconciliation Grid",
            description: "Configure the manual reconciliation grid applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_289",
            label: "AI Reconciliation Suggestions",
            description: "Configure the ai reconciliation suggestions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_290",
            label: "Auto-reconciliation Rules",
            description: "Configure the auto-reconciliation rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_291",
            label: "Matched Log Audits",
            description: "Configure the matched log audits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_292",
            label: "Missing Account Setup Ledger",
            description: "Configure the missing account setup ledger applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_293",
            label: "Missing Inventory Masters Setup",
            description: "Configure the missing inventory masters setup applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_294",
            label: "Unidentified Suspense Records",
            description: "Configure the unidentified suspense records applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_295",
            label: "Force Manual Debit/Credit",
            description: "Configure the force manual debit/credit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_296",
            label: "Monthly Inward/Outward Activity",
            description: "Configure the monthly inward/outward activity applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_297",
            label: "Detailed General Ledger List",
            description: "Configure the detailed general ledger list applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_298",
            label: "Group-wise Ledger Summaries",
            description: "Configure the group-wise ledger summaries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_299",
            label: "User Alteration Records",
            description: "Configure the user alteration records applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_300",
            label: "Daily Voucher Timeline",
            description: "Configure the daily voucher timeline applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_301",
            label: "Cash versus Accrual splits",
            description: "Configure the cash versus accrual splits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_302",
            label: "Compliance Chronological Log",
            description: "Configure the compliance chronological log applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_303",
            label: "Telemetry Location & User Sessions",
            description: "Configure the telemetry location & user sessions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_304",
            label: "Outward Supplies (GSTR-1)",
            description: "Configure the outward supplies (gstr-1) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_305",
            label: "Inward Supplies & ITC (GSTR-2B)",
            description: "Configure the inward supplies & itc (gstr-2b) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_306",
            label: "Filing Outward (GSTR-1)",
            description: "Configure the filing outward (gstr-1) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_307",
            label: "Tax Settlement (GSTR-3B)",
            description: "Configure the tax settlement (gstr-3b) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_308",
            label: "Business-to-Business Invoices",
            description: "Configure the business-to-business invoices applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_309",
            label: "Consumer Direct Invoices",
            description: "Configure the consumer direct invoices applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_310",
            label: "HSN Summary for Goods",
            description: "Configure the hsn summary for goods applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_311",
            label: "SAC Summary for Services",
            description: "Configure the sac summary for services applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_312",
            label: "Auto-matched Inward Credits",
            description: "Configure the auto-matched inward credits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_313",
            label: "Mismatched Inward Ledgers",
            description: "Configure the mismatched inward ledgers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_314",
            label: "Compute Consolidated Tax Liability",
            description: "Configure the compute consolidated tax liability applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_315",
            label: "ITC Input Credit Allocation",
            description: "Configure the itc input credit allocation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_316",
            label: "Annual Consolidated Statement",
            description: "Configure the annual consolidated statement applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_317",
            label: "Statutory Tax Audits",
            description: "Configure the statutory tax audits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_318",
            label: "Annual Reconciliation Audits",
            description: "Configure the annual reconciliation audits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_319",
            label: "GST Cash and Credit Ledgers",
            description: "Configure the gst cash and credit ledgers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_320",
            label: "Quarterly Tax Indicators",
            description: "Configure the quarterly tax indicators applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_321",
            label: "Credit Utilization Trends",
            description: "Configure the credit utilization trends applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_322",
            label: "Advance Tax Estimation",
            description: "Configure the advance tax estimation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_323",
            label: "Challan Records Matcher",
            description: "Configure the challan records matcher applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_324",
            label: "Tax Deducted by Buyers (26AS)",
            description: "Configure the tax deducted by buyers (26as) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_325",
            label: "Withholding Tax Deductions",
            description: "Configure the withholding tax deductions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_326",
            label: "Estimated Profit Trend",
            description: "Configure the estimated profit trend applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_327",
            label: "Proposed Taxation Brackets",
            description: "Configure the proposed taxation brackets applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_328",
            label: "Deduction Rates Engine",
            description: "Configure the deduction rates engine applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_329",
            label: "Presumptive Taxation Schemes",
            description: "Configure the presumptive taxation schemes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_330",
            label: "Income Tax Block Depreciation",
            description: "Configure the income tax block depreciation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_331",
            label: "Companies Act SLM/WDV Schedules",
            description: "Configure the companies act slm/wdv schedules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_332",
            label: "Inadmissible Expense Audits",
            description: "Configure the inadmissible expense audits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_333",
            label: "Business Loss Set-off Registers",
            description: "Configure the business loss set-off registers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_334",
            label: "Zero-Rated Export Bond Forms",
            description: "Configure the zero-rated export bond forms applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_335",
            label: "NSDL Electronic Account Simulator",
            description: "Configure the nsdl electronic account simulator applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_336",
            label: "Regulatory Help Guidelines",
            description: "Configure the regulatory help guidelines applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_337",
            label: "Rate Analysis & Sales Margins",
            description: "Configure the rate analysis & sales margins applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_338",
            label: "Inward-Outward Movement Register",
            description: "Configure the inward-outward movement register applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_339",
            label: "Aging Distribution Blocks",
            description: "Configure the aging distribution blocks applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_340",
            label: "Critical Target Levels",
            description: "Configure the critical target levels applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_341",
            label: "Product Inward Breakdown",
            description: "Configure the product inward breakdown applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_342",
            label: "VAT/GST Output Allocation",
            description: "Configure the vat/gst output allocation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_343",
            label: "Brand Performance Reports",
            description: "Configure the brand performance reports applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_344",
            label: "Inter-godown Ledger Position",
            description: "Configure the inter-godown ledger position applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_345",
            label: "Alternative Conversion Factors",
            description: "Configure the alternative conversion factors applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_346",
            label: "Lot/Batch Expiry Registers",
            description: "Configure the lot/batch expiry registers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_347",
            label: "Overdraft Negative Inventories",
            description: "Configure the overdraft negative inventories applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_348",
            label: "Velocity Ranks",
            description: "Configure the velocity ranks applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_349",
            label: "Stagnant & Slow Ranks",
            description: "Configure the stagnant & slow ranks applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_350",
            label: "SKU Gross Profit Margins",
            description: "Configure the sku gross profit margins applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_351",
            label: "Value Computation Metrics",
            description: "Configure the value computation metrics applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_352",
            label: "Volume Rankings",
            description: "Configure the volume rankings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_353",
            label: "Write-off Projections",
            description: "Configure the write-off projections applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_354",
            label: "Adjustment Audit Registers",
            description: "Configure the adjustment audit registers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_355",
            label: "Lead-time and Delivery Logs",
            description: "Configure the lead-time and delivery logs applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_356",
            label: "Supplier Transit Logs",
            description: "Configure the supplier transit logs applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_357",
            label: "Operating Revenues & Direct Cost",
            description: "Configure the operating revenues & direct cost applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_358",
            label: "Operating Overhead & EBITDA",
            description: "Configure the operating overhead & ebitda applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_359",
            label: "Sources of Capital & Funding",
            description: "Configure the sources of capital & funding applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_360",
            label: "Application of Funds & Assets",
            description: "Configure the application of funds & assets applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_361",
            label: "Cash from Operating Activities",
            description: "Configure the cash from operating activities applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_362",
            label: "Cash from Investment Activities",
            description: "Configure the cash from investment activities applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_363",
            label: "Cash from Financing Activities",
            description: "Configure the cash from financing activities applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_364",
            label: "Detailed Bank Receipts Inward",
            description: "Configure the detailed bank receipts inward applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_365",
            label: "Detailed Bank Expenses Outward",
            description: "Configure the detailed bank expenses outward applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_366",
            label: "General Ledger Balances Grouped",
            description: "Configure the general ledger balances grouped applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_367",
            label: "Colors & Themes",
            description: "Configure the colors & themes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_368",
            label: "Layout Density",
            description: "Configure the layout density applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_369",
            label: "Data Fonts & Formats",
            description: "Configure the data fonts & formats applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_370",
            label: "Localization",
            description: "Configure the localization applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_371",
            label: "More Options",
            description: "Configure the more options applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_372",
            label: "Maximum Design",
            description: "Configure the maximum design applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_373",
            label: "Basic Details",
            description: "Configure the basic details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_374",
            label: "Profile Details",
            description: "Configure the profile details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_375",
            label: "Primary Contacts",
            description: "Configure the primary contacts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_376",
            label: "Alert Channels",
            description: "Configure the alert channels applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_377",
            label: "Registered Address",
            description: "Configure the registered address applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_378",
            label: "Tax Registrations",
            description: "Configure the tax registrations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_379",
            label: "Business Licenses",
            description: "Configure the business licenses applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_380",
            label: "Payroll Setup",
            description: "Configure the payroll setup applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_381",
            label: "Financial General",
            description: "Configure the financial general applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_382",
            label: "Financial Taxation",
            description: "Configure the financial taxation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_383",
            label: "Financial Formatting",
            description: "Configure the financial formatting applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_384",
            label: "Financial Advanced",
            description: "Configure the financial advanced applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_385",
            label: "Bank Details",
            description: "Configure the bank details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_386",
            label: "Social Presence",
            description: "Configure the social presence applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_387",
            label: "Operational Preferences",
            description: "Configure the operational preferences applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_388",
            label: "Billing Sales",
            description: "Configure the billing sales applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_389",
            label: "Inventory Logistics",
            description: "Configure the inventory logistics applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_390",
            label: "Branding Assets",
            description: "Configure the branding assets applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_391",
            label: "Legal Remarks",
            description: "Configure the legal remarks applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_392",
            label: "System Backup",
            description: "Configure the system backup applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_393",
            label: "Company & Fiscal Year",
            description: "Configure the company & fiscal year applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_394",
            label: "Decimal & Global Options",
            description: "Configure the decimal & global options applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_395",
            label: "Predefined Ledger defaults",
            description: "Configure the predefined ledger defaults applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_396",
            label: "Main Landing Default",
            description: "Configure the main landing default applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_397",
            label: "Contextual Routing Settings",
            description: "Configure the contextual routing settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_398",
            label: "Invoice PDF Banner & Header",
            description: "Configure the invoice pdf banner & header applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_399",
            label: "Standard Letterhead Margins",
            description: "Configure the standard letterhead margins applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_400",
            label: "POS & Invoice Receipt Print",
            description: "Configure the pos & invoice receipt print applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_401",
            label: "Behaviors",
            description: "Configure the behaviors applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_402",
            label: "Accounting Vouchers",
            description: "Configure the accounting vouchers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_403",
            label: "Inventory Vouchers",
            description: "Configure the inventory vouchers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_404",
            label: "Active Users",
            description: "Configure the active users applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_405",
            label: "My Account",
            description: "Configure the my account applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_406",
            label: "Company Directory",
            description: "Configure the company directory applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_407",
            label: "Group Rules",
            description: "Configure the group rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_408",
            label: "Super Admin",
            description: "Configure the super admin applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_409",
            label: "User Help Center",
            description: "Configure the user help center applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_410",
            label: "SMS & Email Notification Gateways",
            description: "Configure the sms & email notification gateways applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_411",
            label: "Real-time In-App Flags",
            description: "Configure the real-time in-app flags applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_412",
            label: "Advanced Password Rules",
            description: "Configure the advanced password rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_413",
            label: "Multi-Factor Setup",
            description: "Configure the multi-factor setup applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_414",
            label: "Secure IP Access Restrictions",
            description: "Configure the secure ip access restrictions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_415",
            label: "Core Integrity Rules",
            description: "Configure the core integrity rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_416",
            label: "Data Processing Consent Forms",
            description: "Configure the data processing consent forms applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_417",
            label: "Import Pipeline Defaults",
            description: "Configure the import pipeline defaults applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_418",
            label: "Data Validation Failure Flags",
            description: "Configure the data validation failure flags applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_419",
            label: "Automatic Headers Auto-alignment",
            description: "Configure the automatic headers auto-alignment applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_420",
            label: "Fallback Reconciliation Mapping",
            description: "Configure the fallback reconciliation mapping applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_421",
            label: "Transcription Ingestion Models",
            description: "Configure the transcription ingestion models applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_422",
            label: "Auto-repair Verification Tuning",
            description: "Configure the auto-repair verification tuning applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_423",
            label: "Database Index Tune",
            description: "Configure the database index tune applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_424",
            label: "Manual Snapshots & Restore",
            description: "Configure the manual snapshots & restore applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_425",
            label: "Universal Data Exporters",
            description: "Configure the universal data exporters applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_426",
            label: "Custom Application API Integrations",
            description: "Configure the custom application api integrations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_427",
            label: "Explorer",
            description: "Configure the explorer applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_428",
            label: "Trainer",
            description: "Configure the trainer applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_429",
            label: "Knowledge",
            description: "Configure the knowledge applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_430",
            label: "Chatbot",
            description: "Configure the chatbot applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_431",
            label: "Integrity",
            description: "Configure the integrity applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_432",
            label: "Tickets",
            description: "Configure the tickets applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_433",
            label: "System Info",
            description: "Configure the system info applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_434",
            label: "Terms & Conditions",
            description: "Configure the terms & conditions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_435",
            label: "Release Notes",
            description: "Configure the release notes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_436",
            label: "Privacy Policy",
            description: "Configure the privacy policy applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_437",
            label: "License",
            description: "Configure the license applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_438",
            label: "Startup Priority",
            description: "Configure the startup priority applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_439",
            label: "Routing Rules",
            description: "Configure the routing rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_440",
            label: "Configure default startups and sidebar routing rules.",
            description: "Configure the configure default startups and sidebar routing rules. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_441",
            label: "Search app defaults and routing rules...",
            description: "Configure the search app defaults and routing rules... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_442",
            label: "Clear search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_443",
            label: "Simple Input and Output",
            description: "Configure the simple input and output applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_444",
            label: "Import Settings",
            description: "Configure the import settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_445",
            label: "Export Settings",
            description: "Configure the export settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_446",
            label: "Clear All Settings",
            description: "Configure the clear all settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_447",
            label: "Reset Settings",
            description: "Configure the reset settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_448",
            label: "Global Entry Point",
            description: "Configure the global entry point applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_449",
            label: "Main Landing Category",
            description: "Configure the main landing category applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_450",
            label: "Target Sub-Section",
            description: "Configure the target sub-section applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_451",
            label: "Access Section",
            description: "Configure the access section applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_452",
            label: "Focus View Subtab",
            description: "Configure the focus view subtab applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_453",
            label: "Focus View",
            description: "Configure the focus view applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_454",
            label: "None",
            description: "Configure the none applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_455",
            label: "Try clearing your query or typing different search terms.",
            description: "Configure the try clearing your query or typing different search terms. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_456",
            label: "Routing Intelligence",
            description: "Configure the routing intelligence applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_2_tab_457",
            label: "Automated Contextual Navigation",
            description: "Configure the automated contextual navigation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_2_tab_458",
            label: "Default Route",
            description: "Configure the default route applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_2_tab_459",
            label: "Architectural Integrity",
            description: "Configure the architectural integrity applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_3",
        label: "bharat_book_form_settings_updated",
        description: "Manage bharat_book_form_settings_updated configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_3_tab_0",
            label: "Failed to parse file",
            description: "Configure the failed to parse file applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_3_tab_1",
            label: "Form Detail Settings",
            description: "Configure the form detail settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_3_tab_2",
            label: "Manage fields alignment, layout and UI behavior defaults",
            description: "Configure the manage fields alignment, layout and ui behavior defaults applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_3_tab_3",
            label: "Behaviors",
            description: "Configure the behaviors applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_3_tab_4",
            label: "Search form settings...",
            description: "Configure the search form settings... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_3_tab_5",
            label: "Clear search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_3_tab_6",
            label: "Simple Input and Output",
            description: "Configure the simple input and output applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_3_tab_7",
            label: "Import (JSON/CSV)",
            description: "Configure the import (json/csv) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_3_tab_8",
            label: "Clear All Fields",
            description: "Configure the clear all fields applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_3_tab_9",
            label: "Reset to Defaults",
            description: "Configure the reset to defaults applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_3_tab_10",
            label: "Saved Configuration",
            description: "Configure the saved configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_3_tab_11",
            label: "Save Configuration",
            description: "Configure the save configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_3_tab_12",
            label: "No settings found",
            description: "Configure the no settings found applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_3_tab_13",
            label: "Clear Search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "general_sub_4",
        label: "Input Validation",
        description: "Manage input validation configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_4_tab_0",
            label: "Form Mechanics",
            description: "Configure the form mechanics applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_5",
        label: "Layout Options",
        description: "Manage layout options configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_5_tab_0",
            label: "Primary Form Layout",
            description: "Configure the primary form layout applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_5_tab_1",
            label: "Side-by-Side (Grid)",
            description: "Configure the side-by-side (grid) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_5_tab_2",
            label: "Vertical (Stacked)",
            description: "Configure the vertical (stacked) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_5_tab_3",
            label: "Controls how labels and inputs align.",
            description: "Configure the controls how labels and inputs align. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_5_tab_4",
            label: "Sizing",
            description: "Configure the sizing applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_5_tab_5",
            label: "Input Field Size",
            description: "Configure the input field size applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_5_tab_6",
            label: "Compact (Small)",
            description: "Configure the compact (small) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_5_tab_7",
            label: "Comfortable (Medium)",
            description: "Configure the comfortable (medium) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_5_tab_8",
            label: "Spacious (Large)",
            description: "Configure the spacious (large) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "general_sub_6",
        label: "Mobile Ergonomics",
        description: "Manage mobile ergonomics configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_6_tab_0",
            label: "Modal Behavior",
            description: "Configure the modal behavior applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_6_tab_1",
            label: "Pop-up Mode",
            description: "Configure the pop-up mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_6_tab_2",
            label: "Full Screen Mode",
            description: "Configure the full screen mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_6_tab_3",
            label: "Display Toggles",
            description: "Configure the display toggles applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_7",
        label: "Tablet Optimization",
        description: "Manage tablet optimization configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_7_tab_0",
            label: "Input Controls",
            description: "Configure the input controls applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_8",
        label: "Failed to parse file",
        description: "Manage failed to parse file configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_8_tab_0",
            label: "Appearance",
            description: "Configure the appearance applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_8_tab_1",
            label: "Regional",
            description: "Configure the regional applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_8_tab_2",
            label: "System Core",
            description: "Configure the system core applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_8_tab_3",
            label: "General Settings",
            description: "Configure the general settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_8_tab_4",
            label: "Manage structural preferences and behaviors",
            description: "Configure the manage structural preferences and behaviors applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_8_tab_5",
            label: "Search general settings...",
            description: "Configure the search general settings... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_8_tab_6",
            label: "Clear search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_8_tab_7",
            label: "Simple Input and Output",
            description: "Configure the simple input and output applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_8_tab_8",
            label: "Import (JSON/CSV)",
            description: "Configure the import (json/csv) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_8_tab_9",
            label: "Clear All Fields",
            description: "Configure the clear all fields applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_8_tab_10",
            label: "Appearance & UI",
            description: "Configure the appearance & ui applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_8_tab_11",
            label: "Customize User Interface",
            description: "Configure the customize user interface applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_8_tab_12",
            label: "Regional Formats",
            description: "Configure the regional formats applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_8_tab_13",
            label: "Localization Options",
            description: "Configure the localization options applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_8_tab_14",
            label: "System Core Features",
            description: "Configure the system core features applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_8_tab_15",
            label: "Advanced Operations",
            description: "Configure the advanced operations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_8_tab_16",
            label: "No settings found",
            description: "Configure the no settings found applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_8_tab_17",
            label: "Clear Search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "general_sub_9",
        label: "Theme Mode",
        description: "Manage theme mode configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_9_tab_0",
            label: "System Default",
            description: "Configure the system default applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_9_tab_1",
            label: "Light Mode",
            description: "Configure the light mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_9_tab_2",
            label: "Dark Mode",
            description: "Configure the dark mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_9_tab_3",
            label: "Display Density",
            description: "Configure the display density applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_9_tab_4",
            label: "Compact (More Data)",
            description: "Configure the compact (more data) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_9_tab_5",
            label: "Standard (Default)",
            description: "Configure the standard (default) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_9_tab_6",
            label: "Comfortable (Spacious)",
            description: "Configure the comfortable (spacious) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_9_tab_7",
            label: "Controls spacing across tables.",
            description: "Configure the controls spacing across tables. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_9_tab_8",
            label: "UI Animations",
            description: "Configure the ui animations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_9_tab_9",
            label: "Enabled (Smooth)",
            description: "Configure the enabled (smooth) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_9_tab_10",
            label: "Disabled (Fast)",
            description: "Configure the disabled (fast) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_9_tab_11",
            label: "Sound Effects",
            description: "Configure the sound effects applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_9_tab_12",
            label: "Enabled",
            description: "Configure the enabled applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_9_tab_13",
            label: "Disabled (Muted)",
            description: "Configure the disabled (muted) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "general_sub_10",
        label: "Display Language",
        description: "Manage display language configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_10_tab_0",
            label: "English",
            description: "Configure the english applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_10_tab_1",
            label: "Hindi",
            description: "Configure the hindi applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_10_tab_2",
            label: "Hinglish",
            description: "Configure the hinglish applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_10_tab_3",
            label: "Date Format",
            description: "Configure the date format applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_10_tab_4",
            label: "DD/MM/YYYY",
            description: "Configure the dd/mm/yyyy applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_10_tab_5",
            label: "MM/DD/YYYY",
            description: "Configure the mm/dd/yyyy applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_10_tab_6",
            label: "YYYY-MM-DD",
            description: "Configure the yyyy-mm-dd applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_10_tab_7",
            label: "Default Timezone",
            description: "Configure the default timezone applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_10_tab_8",
            label: "Asia/Kolkata (IST)",
            description: "Configure the asia/kolkata (ist) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_10_tab_9",
            label: "UTC / GMT",
            description: "Configure the utc / gmt applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_10_tab_10",
            label: "America/New_York",
            description: "Configure the america/new_york applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_10_tab_11",
            label: "Europe/London",
            description: "Configure the europe/london applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_10_tab_12",
            label: "Start Week On",
            description: "Configure the start week on applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_10_tab_13",
            label: "Sunday",
            description: "Configure the sunday applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_10_tab_14",
            label: "Monday",
            description: "Configure the monday applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "general_sub_11",
        label: "Display ID Prefix",
        description: "Manage display id prefix configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_11_tab_0",
            label: "e.g. BBE-JV-001",
            description: "Configure the e.g. bbe-jv-001 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_11_tab_1",
            label: "Application Mode",
            description: "Configure the application mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_11_tab_2",
            label: "DEMO (Sandboxed)",
            description: "Configure the demo (sandboxed) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_11_tab_3",
            label: "Production (Live)",
            description: "Configure the production (live) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_11_tab_4",
            label: "System Info View",
            description: "Configure the system info view applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_11_tab_5",
            label: "Show Details",
            description: "Configure the show details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_11_tab_6",
            label: "Hide Details",
            description: "Configure the hide details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_11_tab_7",
            label: "Auto-Lock Timeout",
            description: "Configure the auto-lock timeout applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_11_tab_8",
            label: "5 Minutes",
            description: "Configure the 5 minutes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_11_tab_9",
            label: "15 Minutes",
            description: "Configure the 15 minutes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_11_tab_10",
            label: "30 Minutes",
            description: "Configure the 30 minutes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_11_tab_11",
            label: "1 Hour",
            description: "Configure the 1 hour applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_11_tab_12",
            label: "Never",
            description: "Configure the never applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_11_tab_13",
            label: "Pagination Size",
            description: "Configure the pagination size applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_11_tab_14",
            label: "10 items",
            description: "Configure the 10 items applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_11_tab_15",
            label: "25 items",
            description: "Configure the 25 items applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_11_tab_16",
            label: "50 items",
            description: "Configure the 50 items applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_11_tab_17",
            label: "100 items",
            description: "Configure the 100 items applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_11_tab_18",
            label: "Keyboard Shortcuts",
            description: "Configure the keyboard shortcuts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_11_tab_19",
            label: "Enabled",
            description: "Configure the enabled applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_11_tab_20",
            label: "Disabled",
            description: "Configure the disabled applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "general_sub_14",
        label: "Currency & Indian Numbering Style",
        description: "Manage currency & indian numbering style configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_14_tab_0",
            label: "Indian System (Lakh & Crore)",
            description: "Configure the indian system (lakh & crore) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_14_tab_1",
            label: "International System (Million)",
            description: "Configure the international system (million) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_14_tab_2",
            label: "Business Date Format",
            description: "Configure the business date format applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_14_tab_3",
            label: "Mask Proprietary Balances",
            description: "Configure the mask proprietary balances applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_15",
        label: "System Language & Dialect",
        description: "Manage system language & dialect configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_15_tab_0",
            label: "Typography Pairings",
            description: "Configure the typography pairings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_16",
        label: "bharat_book_navigation_sync",
        description: "Manage bharat_book_navigation_sync configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_16_tab_0",
            label: "Voucher Numbering",
            description: "Configure the voucher numbering applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_16_tab_1",
            label: "Configure series, starting codes and prefixes",
            description: "Configure the configure series, starting codes and prefixes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_16_tab_2",
            label: "Accounting",
            description: "Configure the accounting applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_16_tab_3",
            label: "Inventory",
            description: "Configure the inventory applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_16_tab_4",
            label: "Search voucher types...",
            description: "Configure the search voucher types... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_16_tab_5",
            label: "Clear search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_16_tab_6",
            label: "Simple Input and Output",
            description: "Configure the simple input and output applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_16_tab_7",
            label: "Import Settings",
            description: "Configure the import settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_16_tab_8",
            label: "Clear search query",
            description: "Configure the clear search query applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_16_tab_9",
            label: "Reset Settings",
            description: "Configure the reset settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_16_tab_10",
            label: "Save Configuration",
            description: "Configure the save configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "general_sub_17",
        label: "Sales",
        description: "Manage sales configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_17_tab_0",
            label: "Purchase",
            description: "Configure the purchase applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_17_tab_1",
            label: "Payment",
            description: "Configure the payment applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_17_tab_2",
            label: "Receipt",
            description: "Configure the receipt applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_17_tab_3",
            label: "Journal",
            description: "Configure the journal applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_17_tab_4",
            label: "Contra",
            description: "Configure the contra applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_17_tab_5",
            label: "Debit Note",
            description: "Configure the debit note applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_17_tab_6",
            label: "Credit Note",
            description: "Configure the credit note applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_17_tab_7",
            label: "No voucher types match your search.",
            description: "Configure the no voucher types match your search. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_17_tab_8",
            label: "Auto Generate",
            description: "Configure the auto generate applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_17_tab_9",
            label: "Prefix",
            description: "Configure the prefix applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_17_tab_10",
            label: "Starting No.",
            description: "Configure the starting no. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_17_tab_11",
            label: "Zero Padding",
            description: "Configure the zero padding applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_17_tab_12",
            label: "Suffix",
            description: "Configure the suffix applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_17_tab_13",
            label: "Restart",
            description: "Configure the restart applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_17_tab_14",
            label: "Preview",
            description: "Configure the preview applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_17_tab_15",
            label: "Auto-generated",
            description: "Configure the auto-generated applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "general_sub_18",
        label: "Stock Journal",
        description: "Manage stock journal configurations",
        progress: 100,
        tabs: [
          {
            id: "general_sub_18_tab_0",
            label: "Material Transfer",
            description: "Configure the material transfer applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_18_tab_1",
            label: "Physical Stock",
            description: "Configure the physical stock applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_18_tab_2",
            label: "Item Consumption",
            description: "Configure the item consumption applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_18_tab_3",
            label: "Item Scrap",
            description: "Configure the item scrap applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_18_tab_4",
            label: "Rejections In",
            description: "Configure the rejections in applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_18_tab_5",
            label: "Rejections Out",
            description: "Configure the rejections out applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_18_tab_6",
            label: "No voucher types match your search.",
            description: "Configure the no voucher types match your search. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_18_tab_7",
            label: "Auto Generate",
            description: "Configure the auto generate applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_18_tab_8",
            label: "Prefix",
            description: "Configure the prefix applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_18_tab_9",
            label: "Starting No.",
            description: "Configure the starting no. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_18_tab_10",
            label: "Zero Padding",
            description: "Configure the zero padding applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_18_tab_11",
            label: "Suffix",
            description: "Configure the suffix applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "general_sub_18_tab_12",
            label: "Restart",
            description: "Configure the restart applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "general_sub_18_tab_13",
            label: "Preview",
            description: "Configure the preview applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "general_sub_18_tab_14",
            label: "Auto-generated",
            description: "Configure the auto-generated applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
    ]
  },
  {
    id: "ui",
    label: language === "hi" ? "यूआई लेआउट और रंग" : "UI Schemes & Theme",
    description: language === "hi" ? "लेआउट घनत्व, प्राथमिक रंग पैलेट" : "Navigation layouts, density controls and brand color palettes",
    iconName: "paint",
    subpages: [
      {
        id: "ui_sub_0",
        label: "Classic Amber-Blue",
        description: "Manage classic amber-blue configurations",
        progress: 100,
        tabs: [
          {
            id: "ui_sub_0_tab_0",
            label: "Charcoal Slate",
            description: "Configure the charcoal slate applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_0_tab_1",
            label: "Cobalt ERP Premium",
            description: "Configure the cobalt erp premium applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_0_tab_2",
            label: "Financial Mint",
            description: "Configure the financial mint applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_0_tab_3",
            label: "Application Design Palettes",
            description: "Configure the application design palettes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_0_tab_4",
            label: "Contrast & Dark Theme Support",
            description: "Configure the contrast & dark theme support applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_0_tab_5",
            label: "Light Mode",
            description: "Configure the light mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_0_tab_6",
            label: "Deep Dark Mode",
            description: "Configure the deep dark mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_0_tab_7",
            label: "Follow System",
            description: "Configure the follow system applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "ui_sub_1",
        label: "Interface Density",
        description: "Manage interface density configurations",
        progress: 100,
        tabs: [
          {
            id: "ui_sub_1_tab_0",
            label: "High Density (Compact)",
            description: "Configure the high density (compact) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_1_tab_1",
            label: "Balanced (Standard)",
            description: "Configure the balanced (standard) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_1_tab_2",
            label: "Editorial (Spacious)",
            description: "Configure the editorial (spacious) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_1_tab_3",
            label: "Sidebar Navigation Behavior",
            description: "Configure the sidebar navigation behavior applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_1_tab_4",
            label: "Fixed Sidebar",
            description: "Configure the fixed sidebar applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_1_tab_5",
            label: "Auto-Collapsing",
            description: "Configure the auto-collapsing applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_1_tab_6",
            label: "Icon-Only Mode",
            description: "Configure the icon-only mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_1_tab_7",
            label: "Header Environment Details",
            description: "Configure the header environment details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "ui_sub_2",
        label: "Maximum Sheet Workspace Scaling",
        description: "Manage maximum sheet workspace scaling configurations",
        progress: 100,
        tabs: [
          {
            id: "ui_sub_2_tab_0",
            label: "High Efficiency (85%)",
            description: "Configure the high efficiency (85%) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_2_tab_1",
            label: "Standard Scaled (100%)",
            description: "Configure the standard scaled (100%) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_2_tab_2",
            label: "Enlarged Text (115%)",
            description: "Configure the enlarged text (115%) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_2_tab_3",
            label: "Grid Outline Weight Options",
            description: "Configure the grid outline weight options applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_2_tab_4",
            label: "Thin Border (1px)",
            description: "Configure the thin border (1px) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_2_tab_5",
            label: "Medium Border (1.5px)",
            description: "Configure the medium border (1.5px) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_2_tab_6",
            label: "Legacy Strong (2px)",
            description: "Configure the legacy strong (2px) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_2_tab_7",
            label: "Enable Maximum Performance Mode",
            description: "Configure the enable maximum performance mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_2_tab_8",
            label: "Maximum",
            description: "Configure the maximum applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "ui_sub_3",
        label: "Classic Amber-Blue",
        description: "Manage classic amber-blue configurations",
        progress: 100,
        tabs: [
          {
            id: "ui_sub_3_tab_0",
            label: "Charcoal Slate",
            description: "Configure the charcoal slate applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_3_tab_1",
            label: "Cobalt ERP Premium",
            description: "Configure the cobalt erp premium applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_3_tab_2",
            label: "Financial Mint",
            description: "Configure the financial mint applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_3_tab_3",
            label: "Application Design Palettes",
            description: "Configure the application design palettes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_3_tab_4",
            label: "Contrast & Dark Theme Support",
            description: "Configure the contrast & dark theme support applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_3_tab_5",
            label: "Light Mode",
            description: "Configure the light mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_3_tab_6",
            label: "Deep Dark Mode",
            description: "Configure the deep dark mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_3_tab_7",
            label: "Follow System",
            description: "Configure the follow system applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "ui_sub_4",
        label: "Interface Density",
        description: "Manage interface density configurations",
        progress: 100,
        tabs: [
          {
            id: "ui_sub_4_tab_0",
            label: "High Density (Compact)",
            description: "Configure the high density (compact) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_4_tab_1",
            label: "Balanced (Standard)",
            description: "Configure the balanced (standard) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_4_tab_2",
            label: "Editorial (Spacious)",
            description: "Configure the editorial (spacious) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_4_tab_3",
            label: "Sidebar Navigation Behavior",
            description: "Configure the sidebar navigation behavior applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_4_tab_4",
            label: "Fixed Sidebar",
            description: "Configure the fixed sidebar applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_4_tab_5",
            label: "Auto-Collapsing",
            description: "Configure the auto-collapsing applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_4_tab_6",
            label: "Icon-Only Mode",
            description: "Configure the icon-only mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_4_tab_7",
            label: "Header Environment Details",
            description: "Configure the header environment details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "ui_sub_5",
        label: "Maximum Sheet Workspace Scaling",
        description: "Manage maximum sheet workspace scaling configurations",
        progress: 100,
        tabs: [
          {
            id: "ui_sub_5_tab_0",
            label: "High Efficiency (85%)",
            description: "Configure the high efficiency (85%) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_5_tab_1",
            label: "Standard Scaled (100%)",
            description: "Configure the standard scaled (100%) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_5_tab_2",
            label: "Enlarged Text (115%)",
            description: "Configure the enlarged text (115%) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_5_tab_3",
            label: "Grid Outline Weight Options",
            description: "Configure the grid outline weight options applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_5_tab_4",
            label: "Thin Border (1px)",
            description: "Configure the thin border (1px) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_5_tab_5",
            label: "Medium Border (1.5px)",
            description: "Configure the medium border (1.5px) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "ui_sub_5_tab_6",
            label: "Legacy Strong (2px)",
            description: "Configure the legacy strong (2px) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "ui_sub_5_tab_7",
            label: "Enable Maximum Performance Mode",
            description: "Configure the enable maximum performance mode applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "ui_sub_5_tab_8",
            label: "Maximum",
            description: "Configure the maximum applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
    ]
  },
  {
    id: "firm",
    label: language === "hi" ? "ऑडिट फर्म विनिर्देश" : "Firm & Company Profile",
    description: language === "hi" ? "कंपनी की मूल जानकारी, जीएसटी नंबर और वित्तीय वर्ष प्रबंधन" : "Company metadata, corporate addresses and fiscal cycles",
    iconName: "dollar",
    subpages: [
      {
        id: "firm_sub_0",
        label: "Alert Channels",
        description: "Manage alert channels configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_0_tab_0",
            label: "Email Alerts",
            description: "Configure the email alerts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_0_tab_1",
            label: "Email for Alert",
            description: "Configure the email for alert applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_0_tab_2",
            label: "SMS Alerts",
            description: "Configure the sms alerts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_0_tab_3",
            label: "SMS Number for Alert",
            description: "Configure the sms number for alert applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_0_tab_4",
            label: "WhatsApp Alerts",
            description: "Configure the whatsapp alerts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_0_tab_5",
            label: "WhatsApp Number for Alert",
            description: "Configure the whatsapp number for alert applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_0_tab_6",
            label: "Telegram Alerts",
            description: "Configure the telegram alerts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_0_tab_7",
            label: "Telegram handle/ID",
            description: "Configure the telegram handle/id applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "firm_sub_1",
        label: "Bank Details",
        description: "Manage bank details configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_1_tab_0",
            label: "Bank Name",
            description: "Configure the bank name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_1_tab_1",
            label: "Account Number",
            description: "Configure the account number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_1_tab_2",
            label: "IFSC Code",
            description: "Configure the ifsc code applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_1_tab_3",
            label: "SWIFT Code",
            description: "Configure the swift code applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_1_tab_4",
            label: "MICR Code",
            description: "Configure the micr code applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_1_tab_5",
            label: "Account Type",
            description: "Configure the account type applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_1_tab_6",
            label: "Savings",
            description: "Configure the savings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_1_tab_7",
            label: "Current",
            description: "Configure the current applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_1_tab_8",
            label: "Overdraft",
            description: "Configure the overdraft applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_1_tab_9",
            label: "Cash Credit",
            description: "Configure the cash credit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_1_tab_10",
            label: "Branch Name",
            description: "Configure the branch name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_1_tab_11",
            label: "UPI / VPA ID",
            description: "Configure the upi / vpa id applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "firm_sub_2",
        label: "Basic Details",
        description: "Manage basic details configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_2_tab_0",
            label: "Company Name",
            description: "Configure the company name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_2_tab_1",
            label: "Enter Company Name",
            description: "Configure the enter company name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_2_tab_2",
            label: "Trade Name / Brand Name",
            description: "Configure the trade name / brand name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_2_tab_3",
            label: "Enter Trade Name",
            description: "Configure the enter trade name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_2_tab_4",
            label: "Business Slogan / Tagline",
            description: "Configure the business slogan / tagline applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_2_tab_5",
            label: "Enter Business Slogan",
            description: "Configure the enter business slogan applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_2_tab_6",
            label: "Date of Incorporation",
            description: "Configure the date of incorporation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_2_tab_7",
            label: "Employee Count",
            description: "Configure the employee count applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_2_tab_8",
            label: "Select Size",
            description: "Configure the select size applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_2_tab_9",
            label: "Annual Turnover",
            description: "Configure the annual turnover applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_2_tab_10",
            label: "Select Turnover Range",
            description: "Configure the select turnover range applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_2_tab_11",
            label: "Up to ₹10 Lakhs",
            description: "Configure the up to ₹10 lakhs applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_2_tab_12",
            label: "₹10 Lakhs - ₹50 Lakhs",
            description: "Configure the ₹10 lakhs - ₹50 lakhs applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_2_tab_13",
            label: "₹50 Lakhs - ₹5 Crores",
            description: "Configure the ₹50 lakhs - ₹5 crores applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_2_tab_14",
            label: "₹5 Crores - ₹50 Crores",
            description: "Configure the ₹5 crores - ₹50 crores applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_2_tab_15",
            label: "Above ₹50 Crores",
            description: "Configure the above ₹50 crores applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "firm_sub_3",
        label: "Billing Sales",
        description: "Manage billing sales configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_3_tab_0",
            label: "Invoice Prefix",
            description: "Configure the invoice prefix applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_3_tab_1",
            label: "Quotation Prefix",
            description: "Configure the quotation prefix applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_3_tab_2",
            label: "Default Payment Terms",
            description: "Configure the default payment terms applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_3_tab_3",
            label: "Due on Receipt",
            description: "Configure the due on receipt applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_3_tab_4",
            label: "Net 15",
            description: "Configure the net 15 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_3_tab_5",
            label: "Net 30",
            description: "Configure the net 30 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_3_tab_6",
            label: "Net 45",
            description: "Configure the net 45 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_3_tab_7",
            label: "Net 60",
            description: "Configure the net 60 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_3_tab_8",
            label: "Net 90",
            description: "Configure the net 90 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_3_tab_9",
            label: "Late Payment Penalty Rate",
            description: "Configure the late payment penalty rate applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_3_tab_10",
            label: "Prices are Tax Inclusive by default",
            description: "Configure the prices are tax inclusive by default applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_3_tab_11",
            label: "Default Terms and Conditions",
            description: "Configure the default terms and conditions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "firm_sub_4",
        label: "Branding Assets",
        description: "Manage branding assets configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_4_tab_0",
            label: "Company Logo URL",
            description: "Configure the company logo url applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_4_tab_1",
            label: "Theme Color",
            description: "Configure the theme color applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_4_tab_2",
            label: "Authorized Signature URL",
            description: "Configure the authorized signature url applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_4_tab_3",
            label: "Company Stamp URL",
            description: "Configure the company stamp url applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "firm_sub_5",
        label: "Primary Contacts",
        description: "Manage primary contacts configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_5_tab_0",
            label: "Primary Contact Name",
            description: "Configure the primary contact name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_5_tab_1",
            label: "Enter Full Name",
            description: "Configure the enter full name applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_5_tab_2",
            label: "Contact Designation",
            description: "Configure the contact designation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_5_tab_3",
            label: "Primary Email",
            description: "Configure the primary email applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_5_tab_4",
            label: "Phone Number",
            description: "Configure the phone number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_5_tab_5",
            label: "WhatsApp Business Number",
            description: "Configure the whatsapp business number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_5_tab_6",
            label: "Support Email",
            description: "Configure the support email applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_5_tab_7",
            label: "Support Phone Number",
            description: "Configure the support phone number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_5_tab_8",
            label: "Website",
            description: "Configure the website applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "firm_sub_6",
        label: "Financial Advanced",
        description: "Manage financial advanced configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_6_tab_0",
            label: "Show Currency Symbol",
            description: "Configure the show currency symbol applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_6_tab_1",
            label: "Enable Discounts",
            description: "Configure the enable discounts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_6_tab_2",
            label: "Enable Tax Columns",
            description: "Configure the enable tax columns applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_6_tab_3",
            label: "Auto Round Off",
            description: "Configure the auto round off applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_6_tab_4",
            label: "Allow Backdated Entries",
            description: "Configure the allow backdated entries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_6_tab_5",
            label: "Backdated Grace Period",
            description: "Configure the backdated grace period applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_6_tab_6",
            label: "Enable Multi-Currency",
            description: "Configure the enable multi-currency applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_6_tab_7",
            label: "Auto TDS Calculation",
            description: "Configure the auto tds calculation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_6_tab_8",
            label: "Voucher Approval Worklow",
            description: "Configure the voucher approval worklow applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_6_tab_9",
            label: "Currency & Exchange",
            description: "Configure the currency & exchange applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_6_tab_10",
            label: "Exchange Rate Update",
            description: "Configure the exchange rate update applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_6_tab_11",
            label: "Manual Entry",
            description: "Configure the manual entry applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_6_tab_12",
            label: "TDS / TCS Compliance",
            description: "Configure the tds / tcs compliance applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_6_tab_13",
            label: "Threshold Limit",
            description: "Configure the threshold limit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_6_tab_14",
            label: "Approval Control",
            description: "Configure the approval control applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_6_tab_15",
            label: "Interest Calculation",
            description: "Configure the interest calculation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_6_tab_16",
            label: "Method",
            description: "Configure the method applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_6_tab_17",
            label: "Simple",
            description: "Configure the simple applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_6_tab_18",
            label: "Compliance & Closing",
            description: "Configure the compliance & closing applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_6_tab_19",
            label: "Soft Close Date",
            description: "Configure the soft close date applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_6_tab_20",
            label: "Hard Freeze Date",
            description: "Configure the hard freeze date applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "firm_sub_7",
        label: "Financial Formatting",
        description: "Manage financial formatting configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_7_tab_0",
            label: "Currency Symbol Position",
            description: "Configure the currency symbol position applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_7_tab_1",
            label: "Decimal Precision",
            description: "Configure the decimal precision applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_7_tab_2",
            label: "Rounding Method",
            description: "Configure the rounding method applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_7_tab_3",
            label: "Round to Nearest",
            description: "Configure the round to nearest applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_7_tab_4",
            label: "Round Up",
            description: "Configure the round up applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_7_tab_5",
            label: "Round Down",
            description: "Configure the round down applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_7_tab_6",
            label: "Number System",
            description: "Configure the number system applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_7_tab_7",
            label: "Thousand Separator",
            description: "Configure the thousand separator applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_7_tab_8",
            label: "Decimal Separator",
            description: "Configure the decimal separator applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "firm_sub_8",
        label: "Financial General",
        description: "Manage financial general configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_8_tab_0",
            label: "Financial Year",
            description: "Configure the financial year applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_8_tab_1",
            label: "April - March",
            description: "Configure the april - march applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_8_tab_2",
            label: "January - December",
            description: "Configure the january - december applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_8_tab_3",
            label: "July - June",
            description: "Configure the july - june applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_8_tab_4",
            label: "October - September",
            description: "Configure the october - september applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_8_tab_5",
            label: "Base Currency",
            description: "Configure the base currency applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_8_tab_6",
            label: "Date Format",
            description: "Configure the date format applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_8_tab_7",
            label: "DD/MM/YYYY",
            description: "Configure the dd/mm/yyyy applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_8_tab_8",
            label: "MM/DD/YYYY",
            description: "Configure the mm/dd/yyyy applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_8_tab_9",
            label: "YYYY-MM-DD",
            description: "Configure the yyyy-mm-dd applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_8_tab_10",
            label: "Accounting Method",
            description: "Configure the accounting method applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_8_tab_11",
            label: "Cash Accounting",
            description: "Configure the cash accounting applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_8_tab_12",
            label: "Accrual Accounting",
            description: "Configure the accrual accounting applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "firm_sub_9",
        label: "Financial Taxation",
        description: "Manage financial taxation configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_9_tab_0",
            label: "Tax Filing Frequency",
            description: "Configure the tax filing frequency applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_9_tab_1",
            label: "Monthly",
            description: "Configure the monthly applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_9_tab_2",
            label: "Quarterly",
            description: "Configure the quarterly applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_9_tab_3",
            label: "Annually",
            description: "Configure the annually applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_9_tab_4",
            label: "Default Tax System",
            description: "Configure the default tax system applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_9_tab_5",
            label: "Sales Tax",
            description: "Configure the sales tax applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_9_tab_6",
            label: "Tax Exempt",
            description: "Configure the tax exempt applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "firm_sub_10",
        label: "Payroll Setup",
        description: "Manage payroll setup configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_10_tab_0",
            label: "ESIC Number",
            description: "Configure the esic number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "firm_sub_11",
        label: "Inventory Logistics",
        description: "Manage inventory logistics configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_11_tab_0",
            label: "Inventory Valuation Method",
            description: "Configure the inventory valuation method applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_11_tab_1",
            label: "Weighted Average Cost",
            description: "Configure the weighted average cost applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_11_tab_2",
            label: "Enable Negative Stock Billing",
            description: "Configure the enable negative stock billing applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_11_tab_3",
            label: "Preferred Shipping Partner",
            description: "Configure the preferred shipping partner applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_11_tab_4",
            label: "Standard Delivery Time",
            description: "Configure the standard delivery time applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "firm_sub_12",
        label: "Legal Remarks",
        description: "Manage legal remarks configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_12_tab_0",
            label: "Notes / Description",
            description: "Configure the notes / description applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "firm_sub_13",
        label: "Operational Licenses",
        description: "Manage operational licenses configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_13_tab_0",
            label: "CIN (Corporate Identity Number)",
            description: "Configure the cin (corporate identity number) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_13_tab_1",
            label: "MSME / Udyam Number",
            description: "Configure the msme / udyam number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_13_tab_2",
            label: "IEC (Import Export Code)",
            description: "Configure the iec (import export code) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_13_tab_3",
            label: "Trade License Number",
            description: "Configure the trade license number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_13_tab_4",
            label: "FSSAI License Number (If Applicable)",
            description: "Configure the fssai license number (if applicable) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_13_tab_5",
            label: "Drug License No. (If applicable)",
            description: "Configure the drug license no. (if applicable) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "firm_sub_14",
        label: "Operational Settings",
        description: "Manage operational settings configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_14_tab_0",
            label: "Timezone",
            description: "Configure the timezone applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_14_tab_1",
            label: "Working Days",
            description: "Configure the working days applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_14_tab_2",
            label: "Monday - Friday",
            description: "Configure the monday - friday applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_14_tab_3",
            label: "Monday - Saturday",
            description: "Configure the monday - saturday applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_14_tab_4",
            label: "Custom",
            description: "Configure the custom applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_14_tab_5",
            label: "Custom Working Days",
            description: "Configure the custom working days applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_14_tab_6",
            label: "Working Hours",
            description: "Configure the working hours applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_14_tab_7",
            label: "From",
            description: "Configure the from applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_14_tab_8",
            label: "Holidays",
            description: "Configure the holidays applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "firm_sub_15",
        label: "Business Profile",
        description: "Manage business profile configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_15_tab_0",
            label: "Business Constitution",
            description: "Configure the business constitution applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_15_tab_1",
            label: "Sole Proprietorship",
            description: "Configure the sole proprietorship applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_15_tab_2",
            label: "Partnership",
            description: "Configure the partnership applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_15_tab_3",
            label: "LLP / LLC",
            description: "Configure the llp / llc applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_15_tab_4",
            label: "Private Limited",
            description: "Configure the private limited applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_15_tab_5",
            label: "Public Limited",
            description: "Configure the public limited applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_15_tab_6",
            label: "Trust / NGO",
            description: "Configure the trust / ngo applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_15_tab_7",
            label: "Nature of Business",
            description: "Configure the nature of business applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_15_tab_8",
            label: "Inventory / Product Based",
            description: "Configure the inventory / product based applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_15_tab_9",
            label: "Service Provider",
            description: "Configure the service provider applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_15_tab_10",
            label: "Professional / Consultation",
            description: "Configure the professional / consultation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_15_tab_11",
            label: "Sales Channel / E-Commerce",
            description: "Configure the sales channel / e-commerce applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_15_tab_12",
            label: "Offline / Physical Store Only",
            description: "Configure the offline / physical store only applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_15_tab_13",
            label: "Online / E-Commerce Only",
            description: "Configure the online / e-commerce only applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_15_tab_14",
            label: "Select the Business Type",
            description: "Configure the select the business type applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_15_tab_15",
            label: "What business is involved?",
            description: "Configure the what business is involved? applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_15_tab_16",
            label: "Specific Business Type",
            description: "Configure the specific business type applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "firm_sub_16",
        label: "Social Presence",
        description: "Manage social presence configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_16_tab_0",
            label: "LinkedIn Page",
            description: "Configure the linkedin page applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_16_tab_1",
            label: "Twitter / X Handle",
            description: "Configure the twitter / x handle applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_16_tab_2",
            label: "Facebook Page",
            description: "Configure the facebook page applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_16_tab_3",
            label: "Instagram Handle",
            description: "Configure the instagram handle applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_16_tab_4",
            label: "YouTube Channel",
            description: "Configure the youtube channel applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_16_tab_5",
            label: "WhatsApp Number",
            description: "Configure the whatsapp number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "firm_sub_17",
        label: "System Backup",
        description: "Manage system backup configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_17_tab_0",
            label: "Enable Action Logic Audit",
            description: "Configure the enable action logic audit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_17_tab_1",
            label: "Enforce Strict Format Validation",
            description: "Configure the enforce strict format validation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_17_tab_2",
            label: "Export 3D Backup",
            description: "Configure the export 3d backup applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_17_tab_3",
            label: "Restore Backup",
            description: "Configure the restore backup applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_17_tab_4",
            label: "Factory Reset Tooling",
            description: "Configure the factory reset tooling applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_17_tab_5",
            label: "Data Retention Period",
            description: "Configure the data retention period applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_17_tab_6",
            label: "1 Year",
            description: "Configure the 1 year applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_17_tab_7",
            label: "3 Years",
            description: "Configure the 3 years applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_17_tab_8",
            label: "7 Years",
            description: "Configure the 7 years applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_17_tab_9",
            label: "Enable Auto Scheduled Backup",
            description: "Configure the enable auto scheduled backup applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_17_tab_10",
            label: "Auto Backup Frequency",
            description: "Configure the auto backup frequency applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_17_tab_11",
            label: "Daily",
            description: "Configure the daily applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_17_tab_12",
            label: "Weekly",
            description: "Configure the weekly applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_17_tab_13",
            label: "Monthly",
            description: "Configure the monthly applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "firm_sub_18",
        label: "Tax Registration",
        description: "Manage tax registration configurations",
        progress: 100,
        tabs: [
          {
            id: "firm_sub_18_tab_0",
            label: "GSTIN / Tax ID",
            description: "Configure the gstin / tax id applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_18_tab_1",
            label: "PAN Number",
            description: "Configure the pan number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "firm_sub_18_tab_2",
            label: "TAN Number",
            description: "Configure the tan number applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "firm_sub_18_tab_3",
            label: "LUT Number (For Exports)",
            description: "Configure the lut number (for exports) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "firm_sub_18_tab_4",
            label: "Professional Tax (PT) Reg No.",
            description: "Configure the professional tax (pt) reg no. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
    ]
  },
  {
    id: "data_engine",
    label: language === "hi" ? "आयात नियम व एआई" : "AI & Ingestion Pipeline Settings",
    description: language === "hi" ? "एआई मॉडल नियंत्रण, डेटा आयात नीतियां" : "Gemini parameters, document parsers and dynamic mapping controls",
    iconName: "sliders",
    subpages: [
      {
        id: "data_engine_sub_0",
        label: "List",
        description: "Manage list configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_0_tab_0",
            label: "Failed to parse AI Settings file.",
            description: "Configure the failed to parse ai settings file. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_0_tab_1",
            label: "Google Gemini",
            description: "Configure the google gemini applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_0_tab_2",
            label: "Custom Provider",
            description: "Configure the custom provider applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_0_tab_3",
            label: "Local Host Provider",
            description: "Configure the local host provider applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_0_tab_4",
            label: "ActiveProvider",
            description: "Configure the activeprovider applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_0_tab_5",
            label: "API Keys",
            description: "Configure the api keys applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_0_tab_6",
            label: "AI Engines",
            description: "Configure the ai engines applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_0_tab_7",
            label: "Manage model providers and task settings.",
            description: "Configure the manage model providers and task settings. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_0_tab_8",
            label: "Search AI engine settings...",
            description: "Configure the search ai engine settings... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_0_tab_9",
            label: "Clear search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_0_tab_10",
            label: "Simple Input and Output",
            description: "Configure the simple input and output applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_0_tab_11",
            label: "Import (JSON/CSV)",
            description: "Configure the import (json/csv) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_0_tab_12",
            label: "Clear All Fields",
            description: "Configure the clear all fields applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_0_tab_13",
            label: "Settings Saved",
            description: "Configure the settings saved applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_0_tab_14",
            label: "Active Provider Selection",
            description: "Configure the active provider selection applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_0_tab_15",
            label: "No settings found",
            description: "Configure the no settings found applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_0_tab_16",
            label: "Clear Search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_0_tab_17",
            label: "Security Note",
            description: "Configure the security note applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_0_tab_18",
            label: "Testing Connect...",
            description: "Configure the testing connect... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_0_tab_19",
            label: "Test Connection",
            description: "Configure the test connection applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_0_tab_20",
            label: "Integration Pipelines Verification Details",
            description: "Configure the integration pipelines verification details applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "data_engine_sub_1",
        label: "Google Gemini",
        description: "Manage google gemini configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_1_tab_0",
            label: "ActiveProvider Configuration",
            description: "Configure the activeprovider configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_1_tab_1",
            label: "Configure Pipelines Service Providers",
            description: "Configure the configure pipelines service providers applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_1_tab_2",
            label: "System Task",
            description: "Configure the system task applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_1_tab_3",
            label: "Synced",
            description: "Configure the synced applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_1_tab_4",
            label: "Override",
            description: "Configure the override applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_1_tab_5",
            label: "Google Gemini",
            description: "Configure the google gemini applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_1_tab_6",
            label: "Custom Provider",
            description: "Configure the custom provider applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_1_tab_7",
            label: "Local Host Provider",
            description: "Configure the local host provider applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_1_tab_8",
            label: "* Target provider for payload parsing & validation.",
            description: "Configure the * target provider for payload parsing & validation. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_1_tab_9",
            label: "Chatbot Model",
            description: "Configure the chatbot model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_1_tab_10",
            label: "* Powers conversation and user assistance tasks.",
            description: "Configure the * powers conversation and user assistance tasks. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_1_tab_11",
            label: "Banking Import Modal",
            description: "Configure the banking import modal applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_1_tab_12",
            label: "* Resolves statement classification ranks.",
            description: "Configure the * resolves statement classification ranks. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_1_tab_13",
            label: "Audit Import Modal",
            description: "Configure the audit import modal applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_1_tab_14",
            label: "* Performs tax compliance checker & general audit loops.",
            description: "Configure the * performs tax compliance checker & general audit loops. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_1_tab_15",
            label: "Voucher Import Modal",
            description: "Configure the voucher import modal applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "data_engine_sub_2",
        label: "Key Registry / API Credentials",
        description: "Manage key registry / api credentials configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_2_tab_0",
            label: "Manage and preload API keys for all compatible models",
            description: "Configure the manage and preload api keys for all compatible models applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_2_tab_1",
            label: "Keys Configured",
            description: "Configure the keys configured applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_2_tab_2",
            label: "Filter keys by provider name or description...",
            description: "Configure the filter keys by provider name or description... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_2_tab_3",
            label: "Active",
            description: "Configure the active applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_2_tab_4",
            label: "Hide Key",
            description: "Configure the hide key applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_2_tab_5",
            label: "Show Key",
            description: "Configure the show key applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_2_tab_6",
            label: "Copied",
            description: "Configure the copied applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_2_tab_7",
            label: "Copy Key",
            description: "Configure the copy key applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_2_tab_8",
            label: "Paste from clipboard",
            description: "Configure the paste from clipboard applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_2_tab_9",
            label: "Current Selected",
            description: "Configure the current selected applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_2_tab_10",
            label: "Select Provider",
            description: "Configure the select provider applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_2_tab_11",
            label: "No providers match your filter",
            description: "Configure the no providers match your filter applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "data_engine_sub_3",
        label: "Custom Model Configuration",
        description: "Manage custom model configuration configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_3_tab_0",
            label: "External API Integration",
            description: "Configure the external api integration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_3_tab_1",
            label: "Provider Service",
            description: "Configure the provider service applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_3_tab_2",
            label: "Secret API Key",
            description: "Configure the secret api key applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_3_tab_3",
            label: "Base URL Configuration",
            description: "Configure the base url configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_3_tab_4",
            label: "Custom Provider Model Slots",
            description: "Configure the custom provider model slots applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_3_tab_5",
            label: "Select Model (System Tasks)",
            description: "Configure the select model (system tasks) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_3_tab_6",
            label: "* Used for background parsing and generic prompt mappings.",
            description: "Configure the * used for background parsing and generic prompt mappings. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_3_tab_7",
            label: "Chatbot Model",
            description: "Configure the chatbot model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_3_tab_8",
            label: "* Powers the active system chatbot.",
            description: "Configure the * powers the active system chatbot. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_3_tab_9",
            label: "Banking Import Model",
            description: "Configure the banking import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_3_tab_10",
            label: "Audit Import Model",
            description: "Configure the audit import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_3_tab_11",
            label: "Voucher Import Model",
            description: "Configure the voucher import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "data_engine_sub_4",
        label: "Google Gemini Configuration",
        description: "Manage google gemini configuration configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_4_tab_0",
            label: "Built-in Model Slots",
            description: "Configure the built-in model slots applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_4_tab_1",
            label: "Provider Service",
            description: "Configure the provider service applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_4_tab_2",
            label: "Google Gemini",
            description: "Configure the google gemini applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_4_tab_3",
            label: "Select Model (System Tasks)",
            description: "Configure the select model (system tasks) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_4_tab_4",
            label: "* Internal models are optimized for system parsing.",
            description: "Configure the * internal models are optimized for system parsing. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_4_tab_5",
            label: "Chatbot Model",
            description: "Configure the chatbot model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_4_tab_6",
            label: "supported models",
            description: "Configure the supported models applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_4_tab_7",
            label: "* This model powers the support chatbot.",
            description: "Configure the * this model powers the support chatbot. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_4_tab_8",
            label: "Banking Import Model",
            description: "Configure the banking import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_4_tab_9",
            label: "Audit Import Model",
            description: "Configure the audit import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_4_tab_10",
            label: "Voucher Import Model",
            description: "Configure the voucher import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_4_tab_11",
            label: "* Secondary parsing engine mapping line items and receipts.",
            description: "Configure the * secondary parsing engine mapping line items and receipts. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "data_engine_sub_5",
        label: "Local Host Model Configuration",
        description: "Manage local host model configuration configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_5_tab_0",
            label: "Local API Integration",
            description: "Configure the local api integration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_5_tab_1",
            label: "Provider Service",
            description: "Configure the provider service applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_5_tab_2",
            label: "API Key (Managed)",
            description: "Configure the api key (managed) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_5_tab_3",
            label: "Secret API Key",
            description: "Configure the secret api key applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_5_tab_4",
            label: "Base URL Configuration",
            description: "Configure the base url configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_5_tab_5",
            label: "Local Provider Model Slots",
            description: "Configure the local provider model slots applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_5_tab_6",
            label: "Select Model (System Tasks)",
            description: "Configure the select model (system tasks) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_5_tab_7",
            label: "* Used for background parsing and generic prompt mappings.",
            description: "Configure the * used for background parsing and generic prompt mappings. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_5_tab_8",
            label: "Chatbot Model",
            description: "Configure the chatbot model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_5_tab_9",
            label: "* Powers the active system chatbot.",
            description: "Configure the * powers the active system chatbot. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_5_tab_10",
            label: "Banking Import Model",
            description: "Configure the banking import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_5_tab_11",
            label: "Audit Import Model",
            description: "Configure the audit import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_5_tab_12",
            label: "Voucher Import Model",
            description: "Configure the voucher import model applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
        ]
      },
      {
        id: "data_engine_sub_6",
        label: "// Preview for .tsx files is disabled.",
        description: "Manage // preview for .tsx files is disabled. configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_6_tab_0",
            label: "System Browser",
            description: "Configure the system browser applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_1",
            label: "Browse and analyze system data",
            description: "Configure the browse and analyze system data applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_2",
            label: "Search database...",
            description: "Configure the search database... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_3",
            label: "All Items",
            description: "Configure the all items applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_4",
            label: "Server Files",
            description: "Configure the server files applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_5",
            label: "Browser Storage",
            description: "Configure the browser storage applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_6",
            label: "JSON Data",
            description: "Configure the json data applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_7",
            label: "Typescript",
            description: "Configure the typescript applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_8",
            label: "Styles & HTML",
            description: "Configure the styles & html applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_9",
            label: "Reports",
            description: "Configure the reports applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_10",
            label: "Masters",
            description: "Configure the masters applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_11",
            label: "Config",
            description: "Configure the config applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_12",
            label: "Audits",
            description: "Configure the audits applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_13",
            label: "Database",
            description: "Configure the database applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_14",
            label: "All Types",
            description: "Configure the all types applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_15",
            label: "Memory",
            description: "Configure the memory applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_16",
            label: "Excel",
            description: "Configure the excel applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_17",
            label: "TypeScript",
            description: "Configure the typescript applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_18",
            label: "HTML",
            description: "Configure the html applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_19",
            label: "JavaScript",
            description: "Configure the javascript applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_20",
            label: "Markdown",
            description: "Configure the markdown applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_21",
            label: "Images",
            description: "Configure the images applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_22",
            label: "Text",
            description: "Configure the text applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_23",
            label: "Other",
            description: "Configure the other applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_24",
            label: "Alphabetical (A-Z)",
            description: "Configure the alphabetical (a-z) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_25",
            label: "Alphabetical (Z-A)",
            description: "Configure the alphabetical (z-a) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_26",
            label: "Group by Ext",
            description: "Configure the group by ext applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_27",
            label: "Group by Logic",
            description: "Configure the group by logic applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_28",
            label: "Group by Source",
            description: "Configure the group by source applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_29",
            label: "Path Complexity",
            description: "Configure the path complexity applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_30",
            label: "Functional Group",
            description: "Configure the functional group applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_31",
            label: "Refresh",
            description: "Configure the refresh applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_32",
            label: "No application data found.",
            description: "Configure the no application data found. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_33",
            label: "Source:",
            description: "Configure the source: applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_34",
            label: "Tier:",
            description: "Configure the tier: applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_6_tab_35",
            label: "Select an item from the browser to inspect its content",
            description: "Configure the select an item from the browser to inspect its content applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_6_tab_36",
            label: "No data selected or file is empty",
            description: "Configure the no data selected or file is empty applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_6_tab_37",
            label: "Choose an entry from the system browser to the left",
            description: "Configure the choose an entry from the system browser to the left applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "data_engine_sub_7",
        label: "Purchase Import Configuration",
        description: "Manage purchase import configuration configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_7_tab_0",
            label: "Sales Import Configuration",
            description: "Configure the sales import configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_1",
            label: "Payment Import Configuration",
            description: "Configure the payment import configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_2",
            label: "Receipt Import Configuration",
            description: "Configure the receipt import configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_3",
            label: "Journal Import Configuration",
            description: "Configure the journal import configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_4",
            label: "Contra Import Configuration",
            description: "Configure the contra import configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_5",
            label: "Bank Import Configuration",
            description: "Configure the bank import configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_6",
            label: "Import rules configuration imported from CSV successfully!",
            description: "Configure the import rules configuration imported from csv successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_7",
            label: "Import rules configuration imported from JSON successfully!",
            description: "Configure the import rules configuration imported from json successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_8",
            label: "Failed to parse configurations file.",
            description: "Configure the failed to parse configurations file. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_9",
            label: "Configuration exported successfully!",
            description: "Configure the configuration exported successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_10",
            label: "All configurations cleared.",
            description: "Configure the all configurations cleared. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_11",
            label: "Configuration restored to factory defaults.",
            description: "Configure the configuration restored to factory defaults. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_12",
            label: "Configurations saved successfully!",
            description: "Configure the configurations saved successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_13",
            label: "Import Controls",
            description: "Configure the import controls applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_14",
            label: "Manage automatic voucher and transaction ingestion",
            description: "Configure the manage automatic voucher and transaction ingestion applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_15",
            label: "Global Rules",
            description: "Configure the global rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_16",
            label: "Voucher Specific",
            description: "Configure the voucher specific applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_17",
            label: "Filter import parameters...",
            description: "Configure the filter import parameters... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_18",
            label: "Simple Input and Output",
            description: "Configure the simple input and output applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_19",
            label: "Import Configurations",
            description: "Configure the import configurations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_20",
            label: "Export Configurations",
            description: "Configure the export configurations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_21",
            label: "Clear Settings",
            description: "Configure the clear settings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_22",
            label: "Reset Defaults",
            description: "Configure the reset defaults applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_23",
            label: "Saved Configuration",
            description: "Configure the saved configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_24",
            label: "Save Configuration",
            description: "Configure the save configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_25",
            label: "Voucher Specific Rules",
            description: "Configure the voucher specific rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_7_tab_26",
            label: "Global AI Import Rules",
            description: "Configure the global ai import rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_7_tab_27",
            label: "Configuration Import Portal",
            description: "Configure the configuration import portal applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_7_tab_28",
            label: "Import Settings Profile",
            description: "Configure the import settings profile applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
        ]
      },
      {
        id: "data_engine_sub_8",
        label: "Basic Rules",
        description: "Manage basic rules configurations",
        progress: 100,
        tabs: [
          {
            id: "data_engine_sub_8_tab_0",
            label: "Auto Contra Detection",
            description: "Configure the auto contra detection applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_1",
            label: "Identify Mobile Transfer",
            description: "Configure the identify mobile transfer applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_2",
            label: "Auto Detect GSTIN",
            description: "Configure the auto detect gstin applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_3",
            label: "Auto Detect PAN TAN",
            description: "Configure the auto detect pan tan applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_4",
            label: "List Exclusions",
            description: "Configure the list exclusions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_5",
            label: "Advanced Parsing & Extraction",
            description: "Configure the advanced parsing & extraction applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_6",
            label: "Custom Settings List",
            description: "Configure the custom settings list applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_7",
            label: "Simulator Sandbox",
            description: "Configure the simulator sandbox applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_8",
            label: "bharat_book_settings_updated",
            description: "Configure the bharat_book_settings_updated applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_9",
            label: "Mapping settings saved successfully!",
            description: "Configure the mapping settings saved successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_10",
            label: "Mapping configurations cleared.",
            description: "Configure the mapping configurations cleared. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_11",
            label: "Restored mapping presets to defaults.",
            description: "Configure the restored mapping presets to defaults. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_12",
            label: "Mapping configurations exported successfully!",
            description: "Configure the mapping configurations exported successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_13",
            label: "Mapping configuration loaded from CSV successfully!",
            description: "Configure the mapping configuration loaded from csv successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_14",
            label: "Mapping configuration loaded from JSON successfully!",
            description: "Configure the mapping configuration loaded from json successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_15",
            label: "Failed to parse configuration file.",
            description: "Configure the failed to parse configuration file. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_16",
            label: "Mapping & Narration Parsing",
            description: "Configure the mapping & narration parsing applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_17",
            label: "Define rule pipelines and run sandbox simulations.",
            description: "Configure the define rule pipelines and run sandbox simulations. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_18",
            label: "Basic Rules",
            description: "Configure the basic rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_19",
            label: "Lists & Exclusions",
            description: "Configure the lists & exclusions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_20",
            label: "Patterns",
            description: "Configure the patterns applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_21",
            label: "Direct Mappings",
            description: "Configure the direct mappings applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_22",
            label: "Sandbox",
            description: "Configure the sandbox applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_23",
            label: "Filter mapping rules...",
            description: "Configure the filter mapping rules... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_24",
            label: "Format Source",
            description: "Configure the format source applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_25",
            label: "Import Mapping Rules",
            description: "Configure the import mapping rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_26",
            label: "Export Mapping Rules",
            description: "Configure the export mapping rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "data_engine_sub_8_tab_27",
            label: "Clear All Mapping Configurations",
            description: "Configure the clear all mapping configurations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "data_engine_sub_8_tab_28",
            label: "Reset Presets to Defaults",
            description: "Configure the reset presets to defaults applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "data_engine_sub_8_tab_29",
            label: "Saved Configuration",
            description: "Configure the saved configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
    ]
  },
  {
    id: "security_vault",
    label: language === "hi" ? "सुरक्षा व विनियामक लॉग" : "Security & Vault Controls",
    description: language === "hi" ? "डुअल- प्रमाणीकरण, डेटा एन्क्रिप्शन और विनियामक अनुपालन पैरामीटर" : "Multi-factor locks, data encryption vaults and statutory logging",
    iconName: "maximize",
    subpages: [
      {
        id: "security_vault_sub_0",
        label: "bharat_book_settings_updated",
        description: "Manage bharat_book_settings_updated configurations",
        progress: 100,
        tabs: [
          {
            id: "security_vault_sub_0_tab_0",
            label: "Failed to parse privacy configuration file.",
            description: "Configure the failed to parse privacy configuration file. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_0_tab_1",
            label: "Core Integrity Rules",
            description: "Configure the core integrity rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_0_tab_2",
            label: "Data Processing Consent Forms",
            description: "Configure the data processing consent forms applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_0_tab_3",
            label: "Privacy & Compliance",
            description: "Configure the privacy & compliance applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_0_tab_4",
            label: "Configure logs and processing consents",
            description: "Configure the configure logs and processing consents applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_0_tab_5",
            label: "Search privacy controls...",
            description: "Configure the search privacy controls... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_0_tab_6",
            label: "Clear search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_0_tab_7",
            label: "Simple Input and Output",
            description: "Configure the simple input and output applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_0_tab_8",
            label: "Import (JSON/CSV)",
            description: "Configure the import (json/csv) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_0_tab_9",
            label: "Clear All Fields",
            description: "Configure the clear all fields applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_0_tab_10",
            label: "Settings Saved",
            description: "Configure the settings saved applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_0_tab_11",
            label: "Clear Search",
            description: "Configure the clear search applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
      {
        id: "security_vault_sub_1",
        label: "Action Settings",
        description: "Manage action settings configurations",
        progress: 100,
        tabs: [
          {
            id: "security_vault_sub_1_tab_0",
            label: "Global security policies updated successfully.",
            description: "Configure the global security policies updated successfully. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_1",
            label: "Auto logout inactivity window set to",
            description: "Configure the auto logout inactivity window set to applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_2",
            label: "minutes",
            description: "Configure the minutes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_3",
            label: "Lockout status cleared and failed attempts reset to 0 for",
            description: "Configure the lockout status cleared and failed attempts reset to 0 for applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_4",
            label: "Insufficient Privileges: You cannot decide limits for",
            description: "Configure the insufficient privileges: you cannot decide limits for applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_5",
            label: "Custom login attempt policy updated for",
            description: "Configure the custom login attempt policy updated for applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_6",
            label: "Security configuration imported from CSV successfully!",
            description: "Configure the security configuration imported from csv successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_7",
            label: "Security configuration imported from JSON successfully!",
            description: "Configure the security configuration imported from json successfully! applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_8",
            label: "Failed to parse configurations file.",
            description: "Configure the failed to parse configurations file. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_9",
            label: "Security settings restored to factory defaults.",
            description: "Configure the security settings restored to factory defaults. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_10",
            label: "Security Controls",
            description: "Configure the security controls applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_11",
            label: "Manage security rules, lockout limits, and session timeouts",
            description: "Configure the manage security rules, lockout limits, and session timeouts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_12",
            label: "Policies & Thresholds",
            description: "Configure the policies & thresholds applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_13",
            label: "User Specific Locks",
            description: "Configure the user specific locks applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_14",
            label: "Filter security preferences...",
            description: "Configure the filter security preferences... applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_15",
            label: "Simple Input and Output",
            description: "Configure the simple input and output applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_16",
            label: "Import Configurations",
            description: "Configure the import configurations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_17",
            label: "Export Configurations",
            description: "Configure the export configurations applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_18",
            label: "Clear Custom Locks",
            description: "Configure the clear custom locks applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_19",
            label: "Reset Defaults",
            description: "Configure the reset defaults applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_20",
            label: "Saved Configuration",
            description: "Configure the saved configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_21",
            label: "Save Configuration",
            description: "Configure the save configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_22",
            label: "Active Administrator Role Context:",
            description: "Configure the active administrator role context: applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_23",
            label: "Session Timeout Configuration",
            description: "Configure the session timeout configuration applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_24",
            label: "Timeout Limit",
            description: "Configure the timeout limit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_25",
            label: "Active browser context resets this limit automatically",
            description: "Configure the active browser context resets this limit automatically applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_26",
            label: "10 Minutes",
            description: "Configure the 10 minutes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_27",
            label: "15 Minutes",
            description: "Configure the 15 minutes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_28",
            label: "30 Minutes (Recommended)",
            description: "Configure the 30 minutes (recommended) applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_29",
            label: "45 Minutes",
            description: "Configure the 45 minutes applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_30",
            label: "1 Hour",
            description: "Configure the 1 hour applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_31",
            label: "2 Hours",
            description: "Configure the 2 hours applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_32",
            label: "6 Hours",
            description: "Configure the 6 hours applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_33",
            label: "Role Default Limits & Rules",
            description: "Configure the role default limits & rules applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_34",
            label: "Default baseline safety bounds",
            description: "Configure the default baseline safety bounds applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_35",
            label: "Tries:",
            description: "Configure the tries: applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_36",
            label: "3 Tries",
            description: "Configure the 3 tries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_37",
            label: "5 Tries",
            description: "Configure the 5 tries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_38",
            label: "10 Tries",
            description: "Configure the 10 tries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_39",
            label: "15 Tries",
            description: "Configure the 15 tries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_40",
            label: "Unlimited",
            description: "Configure the unlimited applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_41",
            label: "Idle:",
            description: "Configure the idle: applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_42",
            label: "10 Min",
            description: "Configure the 10 min applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_43",
            label: "15 Min",
            description: "Configure the 15 min applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_44",
            label: "30 Min",
            description: "Configure the 30 min applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_45",
            label: "45 Min",
            description: "Configure the 45 min applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_46",
            label: "Active Portal Lockouts & Overrides",
            description: "Configure the active portal lockouts & overrides applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_47",
            label: "Lockout Security Rules Enforced",
            description: "Configure the lockout security rules enforced applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_48",
            label: "User Profile",
            description: "Configure the user profile applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_49",
            label: "Role baseline",
            description: "Configure the role baseline applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_50",
            label: "Custom Tries Limit",
            description: "Configure the custom tries limit applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_51",
            label: "Failed Attempts",
            description: "Configure the failed attempts applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_52",
            label: "Account Lock Status",
            description: "Configure the account lock status applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_53",
            label: "Quick Actions",
            description: "Configure the quick actions applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_54",
            label: "No users found matching query",
            description: "Configure the no users found matching query applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_55",
            label: "Default Role",
            description: "Configure the default role applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_56",
            label: "Max 3",
            description: "Configure the max 3 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_57",
            label: "Max 5",
            description: "Configure the max 5 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_58",
            label: "Max 10",
            description: "Configure the max 10 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_59",
            label: "Max 15",
            description: "Configure the max 15 applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_60",
            label: "Locked Out",
            description: "Configure the locked out applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_61",
            label: "Active / OK",
            description: "Configure the active / ok applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_62",
            label: "Unlock Portal",
            description: "Configure the unlock portal applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
          {
            id: "security_vault_sub_1_tab_63",
            label: "Reset Tries",
            description: "Configure the reset tries applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "security_vault_sub_1_tab_64",
            label: "Role Restrict",
            description: "Configure the role restrict applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "security_vault_sub_1_tab_65",
            label: "Administrative Advice:",
            description: "Configure the administrative advice: applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
    ]
  },
  {
    id: "support_alerts",
    label: language === "hi" ? "वेबहुक, अलर्ट व फीडबैक" : "Support & Alerts Channels",
    description: language === "hi" ? "अलर्ट चैनल अधिसूचना, बाहरी एपीआई वेबहुक" : "System notification toasts, failsafe webhook endpoints and tickets",
    iconName: "globe",
    subpages: [
      {
        id: "support_alerts_sub_0",
        label: "Content not found.",
        description: "Manage content not found. configurations",
        progress: 100,
        tabs: [
          {
            id: "support_alerts_sub_0_tab_0",
            label: "Error loading content.",
            description: "Configure the error loading content. applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "toggle",
            currentValue: true,
            
          },
          {
            id: "support_alerts_sub_0_tab_1",
            label: "About the Applet",
            description: "Configure the about the applet applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "select",
            currentValue: "Configured Value",
            options: ["Configured Value", "Alternative Option", "System Default"]
          },
          {
            id: "support_alerts_sub_0_tab_2",
            label: "Application build details and documentation",
            description: "Configure the application build details and documentation applied to the workspace environment",
            status: "Configured",
            lastUpdated: "2026-06-12",
            type: "input",
            currentValue: "Configured Value",
            
          },
        ]
      },
    ]
  },
];
