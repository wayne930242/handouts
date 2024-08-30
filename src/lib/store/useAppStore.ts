import { create } from "zustand";
import { AppStore } from "@/types/interfaces";

const useAppStore = create<AppStore>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  editingCampaign: false,
  setEditingCampaign: (editingCampaign) => set({ editingCampaign }),
  editingRule: false,
  setEditingRule: (editingRule) => set({ editingRule }),
  addPassphraseDialog: null,
  setAddPassphraseDialog: (passphraseDialog) => set({ addPassphraseDialog: passphraseDialog }),
  confirmDialog: null,
  setConfirmDialog: (comfirmDialog) => set({ confirmDialog: comfirmDialog }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAppStore;
