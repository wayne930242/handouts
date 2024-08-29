import { create } from "zustand";
import { AppStore } from "@/types/interfaces";

const useAppStore = create<AppStore>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  editingCampaign: false,
  setEditingCampaign: (editingCampaign) => set({ editingCampaign }),
  passphraseDialog: false,
  setPassphraseDialog: (passphraseDialog) => set({ passphraseDialog }),
  confirmDialog: null,
  setConfirmDialog: (comfirmDialog) => set({ confirmDialog: comfirmDialog }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAppStore;
