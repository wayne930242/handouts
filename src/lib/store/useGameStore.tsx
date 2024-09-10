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
  initGameData: (gameData) => set({ gameData }),

  setCampaignHandouts: async () => {},
  setCampaignHandoutsLocal: async () => {},
  setCampaignHandoutsRemote: async () => {},

  setScreenHandouts: async () => {},
  setScreenHandoutsLocal: async () => {},
  setScreenHandoutsRemote: async () => {},

  setGenerators: async () => {},

  setNotes: async () => {},
  setNotesLocal: async () => {},
  setNotesRemote: async () => {},

  loading: false,
  setLoading: (loading) => set({ loading }),
  connected: false,
  setConnected: (connected) => set({ connected }),
  error: null,
}));

export default useGameStore;
