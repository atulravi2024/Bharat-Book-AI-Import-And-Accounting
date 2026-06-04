import { useState, useMemo } from 'react';

export const useItemsTab = (data: any[], onSave: (items: any[]) => void) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  } | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? "" : section));
  };

  const filteredData = useMemo(() => {
    return (data || []).filter((m: any) =>
      String(m.name || m.code || m.id || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const handleSave = () => {
    if (!formData.name?.trim() && !formData.code?.trim()) return;
    const newList = editingId
      ? data.map((m: any) => (m.id === editingId ? { ...formData } : m))
      : [...data, { ...formData, id: `${Date.now()}` }];
    onSave(newList);
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    onSave(data.filter((m: any) => m.id !== deleteConfirmation.id));
    setDeleteConfirmation(null);
  };

  const triggerEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const triggerAdd = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const triggerDeleteRequest = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      name,
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    activeSection,
    toggleSection,
    deleteConfirmation,
    setDeleteConfirmation,
    filteredData,
    handleSave,
    confirmDelete,
    triggerEdit,
    triggerAdd,
    triggerDeleteRequest,
  };
};
