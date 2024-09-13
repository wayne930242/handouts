import { create } from "zustand";
import { debouncify } from "@/lib/debounce";
import {
  GameStore,
  RealtimePayload,
  Handout,
  Chapter,
  Section,
} from "@/types/interfaces";

export const useGameStore = create<GameStore>((set, get) => ({
  gameData: null,
  setDocs: (docs) =>
    set({
      gameData: {
        ...get().gameData!,
        docs,
      },
    }),
  initGameData: (gameData) => set({ gameData }),
  currentCampaignId: null,
  setCurrentCampaignId: (currentCampaignId) => set({ currentCampaignId }),

  setCampaignHandouts: async () => {},
  setCampaignHandoutsLocal: async () => {},
  setCampaignHandoutsRemote: async () => {},
  handleRealtimeUpdateCampaignHandouts: async () => {},

  setScreenHandouts: async () => {},
  setGenerators: async () => {},

  setNotes: async () => {},
  setNotesLocal: async () => {},
  setNotesRemote: async () => {},
  handleRealtimeUpdateNotes: async () => {},

  loading: false,
  setLoading: (loading) => set({ loading }),
  connected: false,
  setConnected: (connected) => set({ connected }),
  needConnect: false,
  setNeedConnect: (needConnect) => set({ needConnect }),
  error: null,
}));

export default useGameStore;
