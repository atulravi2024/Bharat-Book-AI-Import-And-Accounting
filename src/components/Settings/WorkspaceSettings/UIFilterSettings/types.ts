export type UIFilterType = "masters" | "transactions" | "operations" | "reports" | "settings";

export interface FilterItem {
  id: string;
  label: string;
  category: string;
}
