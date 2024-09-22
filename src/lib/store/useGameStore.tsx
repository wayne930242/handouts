import { create } from "zustand";
import merge from "lodash/merge";
import { produce } from "immer";
import { GameStore } from "@/types/interfaces";

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

  setNotes: async (newData, oldData, type, supabaseClient, debounce) => {
    if (type === "UPDATE") {
      // Let INSERT, DELETE be handled by realtime
      get().setNotesLocal(newData, oldData, type);
    }

    get().setNotesRemote(newData, oldData, type, supabaseClient, debounce);
  },
  setNotesLocal: async (newData, oldData, type) => {},
  setNotesRemote: async (newData, oldData, type, supabaseClient, debounce) => {
    set({ loading: true, error: null });
  },
  handleRealtimeUpdateNotes: async () => {},

  loading: false,
  setLoading: (loading) => set({ loading }),
  notesConnected: false,
  setNotesConnected: (connected) => set({ notesConnected: connected }),
  error: null,
}));

export default useGameStore;
