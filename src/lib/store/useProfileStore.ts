import { create } from "zustand";
import { ProfileStore } from "@/types/interfaces";

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));

export default useProfileStore;
