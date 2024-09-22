import { create } from "zustand";
import { DocStore } from "@/types/interfaces";

const useDocStore = create<DocStore>((set) => ({
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  editingId: null,
  setEditingId: (editingId) => set({ editingId }),
  currentDoc: null,
}));

export default useDocStore;
