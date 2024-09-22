import { create } from "zustand";
import merge from "lodash/merge";
import { produce } from "immer";
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
  setGameData: (partialGameData) =>
    set((state) => ({
      gameData: produce(state.gameData, (draft) => {
        if (draft && partialGameData) {
          merge(draft, partialGameData);
        }
      }),
    })),

  setScreenHandouts: async () => {},
  setGenerators: async () => {},

  setNotes: async () => {},
  setNotesLocal: async () => {},
  setNotesRemote: async () => {},
  handleRealtimeUpdateNotes: async () => {},

  loading: false,
  setLoading: (loading) => set({ loading }),
  notesConnected: false,
  setNotesConnected: (connected) => set({ notesConnected: connected }),
  error: null,
}));

export default useGameStore;
