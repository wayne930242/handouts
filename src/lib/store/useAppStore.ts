import { create } from "zustand";
import { AppStore } from "@/types/interfaces";

const useAppStore = create<AppStore>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  editingCampaign: false,
  setEditingCampaign: (editingCampaign) => set({ editingCampaign }),
  passphraseDialog: false,
  setPassphraseDialog: (passphraseDialog) => set({ passphraseDialog }),
}));

export default useAppStore;
