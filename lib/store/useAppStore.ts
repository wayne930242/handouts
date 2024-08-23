import { create } from "zustand";
import { AppStore } from "@/types/interfaces";

const useAppStore = create<AppStore>((set) => ({
  editingCampaign: false,
  setEditingCampaign: (editingCampaign) => set({ editingCampaign }),
}));

export default useAppStore;
