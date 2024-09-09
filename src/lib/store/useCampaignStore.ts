import { create } from "zustand";
import { debouncify } from "@/lib/debounce";
import {
  CampaignStore,
  RealtimePayload,
  CampaignSubTable,
  Handout,
  Chapter,
  Section,
  Campaign,
} from "@/types/interfaces";
import { updateCampaignNestedData } from "../supabase/updateCampaignData";

const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaignData: null,
  initCampaignData: (campaignData) => set({ campaignData }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  connected: false,
  setConnected: (connected) => set({ connected }),
  setCampaignDataLocal: async (newData, oldData, tableName, type) => {
    if (Array.isArray(newData)) {
      newData.forEach((item, index) => {
        set((state) => {
          if (!state.campaignData) return state;
          if (!Array.isArray(oldData)) return state;
          let updatedData = updateCampaignNestedData(
            state.campaignData,
            tableName,
            item as Handout | Chapter | Section | Campaign,
            oldData[index] as typeof item,
            type
          );
          return { campaignData: updatedData };
        });
      });
    } else {
      set((state) => {
        if (!state.campaignData) return state;
        let updatedData = updateCampaignNestedData(
          state.campaignData,
          tableName,
          newData as Handout | Chapter | Section | Campaign,
          oldData as Partial<Handout | Chapter | Section | Campaign>,
          type
        );
        return { campaignData: updatedData };
      });
    }
  },
  setCampaignDataRemote: async (
    newData,
    oldData,
    tableName,
    type,
    supabaseClient,
    debounce
  ) => {
    const updateRemote = async () => {
      set({ loading: true, error: null });
      try {
        if (Array.isArray(newData)) {
          await supabaseClient.from(tableName).upsert(newData).select();
          newData.forEach((item, index) => {
            set((state) => {
              if (!state.campaignData) return state;
              if (!Array.isArray(oldData)) return state;
              let updatedData = updateCampaignNestedData(
                state.campaignData,
                tableName,
                item as Handout | Chapter | Section | Campaign,
                oldData[index] as typeof item,
                type
              );
              return { campaignData: updatedData };
            });
          });
        } else {
          if (type === "INSERT") {
            await supabaseClient
              .from(tableName)
              .insert({ ...newData, id: undefined })
              .select()
              .single();
          } else if (type === "UPDATE") {
            if (!("id" in newData)) {
              throw new Error("New data must have an ID for UPDATE");
            }
            await supabaseClient
              .from(tableName)
              .update(newData)
              .eq("id", newData.id)
              .select()
              .single();
          } else if (type === "DELETE") {
            if (!("id" in newData)) {
              throw new Error("New data must have an ID for DELETE");
            }
            await supabaseClient
              .from(tableName)
              .delete()
              .eq("id", newData.id)
              .select()
              .single();
          }
        }
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error
              : new Error("Unknown error occurred"),
        });
      }

      set({ loading: false });
    };
    const [debouncedFn] = debouncify(
      updateRemote,
      debounce?.delay,
      debounce?.key
    );
    debouncedFn();
  },
  setCampaignData: async (
    newData,
    oldData,
    tableName,
    type,
    supabaseClient,
    debounce
  ) => {
    if (type === "UPDATE") {
      // Let INSERT, DELETE be handled by realtime
      get().setCampaignDataLocal(newData, oldData, tableName, type);
    }
    get().setCampaignDataRemote(
      newData,
      oldData,
      tableName,
      type,
      supabaseClient,
      debounce
    );
  },
  handleRealtimeUpdate: <T extends { id: string | number }>(
    table: CampaignSubTable,
    payload: RealtimePayload<T>
  ) => {
    const { eventType, new: newRecord, old: oldRecord } = payload as any;

    if (process.env.NODE_ENV === "development") {
      console.info("handleRealtimeUpdate:", table, payload);
    }

    set((state) => {
      if (!state.campaignData) return state;

      let updatedData = updateCampaignNestedData(
        state.campaignData,
        table,
        newRecord,
        oldRecord,
        eventType
      );

      return { campaignData: updatedData };
    });
  },
}));

export default useCampaignStore;
