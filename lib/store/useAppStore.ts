import { create } from "zustand";
import { AppStore } from "@/types/interfaces";

const useAppStore = create<AppStore>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  editingCampaign: false,
  setEditingCampaign: (editingCampaign) => set({ editingCampaign }),
}));

export default useAppStore;
