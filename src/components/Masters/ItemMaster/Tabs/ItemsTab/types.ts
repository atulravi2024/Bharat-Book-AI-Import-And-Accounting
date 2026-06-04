export interface ItemsTabProps {
  data: any[];
  onSave: (items: any[]) => void;
  uomMasters?: any[];
  categoryMasters?: any[];
  brandMasters?: any[];
  stockGroupMasters?: any[];
  gradeMasters?: any[];
  assertionCategoryMasters?: any[];
  assertionCodeMasters?: any[];
  gstMasters?: any[];
  weightMasters?: any[];
}

export interface ItemTableProps {
  data: any[];
  onEdit: (item: any) => void;
  onDeleteRequest: (id: string, name: string) => void;
}

export interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingId: string | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  activeSection: string;
  toggleSection: (section: string) => void;
  allItems: any[];
  uomMasters: any[];
  categoryMasters: any[];
  brandMasters: any[];
  stockGroupMasters: any[];
  gradeMasters: any[];
  assertionCategoryMasters: any[];
  assertionCodeMasters: any[];
  gstMasters: any[];
  weightMasters: any[];
}
