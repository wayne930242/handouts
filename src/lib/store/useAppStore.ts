import { create } from "zustand";
import { AppStore } from "@/types/interfaces";

const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  addPassphraseDialog: null,
  setAddPassphraseDialog: (passphraseDialog) =>
    set({ addPassphraseDialog: passphraseDialog }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAppStore;
