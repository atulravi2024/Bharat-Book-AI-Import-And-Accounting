export interface TdsRow {
  id: number;
  gstin: string;
  name: string;
  gross: number;
  rate: string;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface TcsRow {
  id: number;
  gstin: string;
  name: string;
  gross: number;
  returned: number;
  net: number;
  tcs: number;
}

export interface Itc04Row {
  id: number;
  gstin: string;
  name: string;
  challan: string;
  item: string;
  val: number;
  status: string;
}

export interface Cmp08Row {
  id: number;
  name: string;
  val: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
}

export interface ReportItem {
  id: string;
  name: string;
  due_date: string;
  status: 'Filed' | 'Pending';
}

export interface ComplianceRegistriesProps {
  useSampleData: boolean;
  onToggleSampleData?: (enabled: boolean) => void;
}
