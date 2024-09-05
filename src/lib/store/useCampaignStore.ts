import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "./storage";
import { debouncify } from "@/lib/debounce";
import {
  CampaignStore,
  RealtimePayload,
  CampaignSubTable,
} from "@/types/interfaces";
import { updateCampaignNestedData } from "../supabase/dataUpdater";

const useCampaignStore = create(
  persist<CampaignStore>(
    (set, get) => ({
      campaignData: null,
      initCampaignData: (campaignData) => set({ campaignData }),
      asGM: false,
      loading: false,
      setLoading: (loading) => set({ loading }),
      error: null,
      connected: false,
      connectedAtempts: 0,
      inWhiteList: false,
      fetchWhiteList: async (supabase) => {
        const { data: inWhiteList, error } = await supabase.rpc(
          "is_current_user_whitelisted"
        );

        if (error) {
          console.error(error);
        } else {
          set({ inWhiteList });
        }
      },
      resetConnectedAttempts: () => set({ connectedAtempts: 0 }),
      setAsGM: (asGM) => set({ asGM }),
      setCampaignDataLocal: async (newData, oldData, tableName, type) => {
        if (Array.isArray(newData)) {
          newData.forEach((item, index) => {
            set((state) => {
              if (!state.campaignData) return state;
              if (!Array.isArray(oldData)) return state;
              let updatedData = updateCampaignNestedData(
                state.campaignData,
                tableName,
                item,
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
              newData,
              oldData,
              type
            );
            return { campaignData: updatedData };
          });
        }
      },
      setCampaignDataRemote: async (
        newData,
        oldData,
        supabaseClient,
        tableName,
        type,
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
                    item,
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
                if (!('id' in newData)) {
                  throw new Error("New data must have an ID for UPDATE");
                }
                await supabaseClient
                  .from(tableName)
                  .update(newData)
                  .eq("id", newData.id)
                  .select()
                  .single();
              } else if (type === "DELETE") {
                if (!('id' in newData)) {
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
        supabaseClient,
        tableName,
        type,
        debounce
      ) => {
        if (type === "UPDATE") {
          get().setCampaignDataLocal(newData, oldData, tableName, type);
        }
        get().setCampaignDataRemote(
          newData,
          oldData,
          supabaseClient,
          tableName,
          type,
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
      setupRealtimeSubscription: (supabase, campaignId) => {
        if (get().connected) return () => { };
        const campaignChannel = supabase
          .channel("campaign-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "chapters",
              filter: `campaign_id=eq.${campaignId}`,
            },
            (payload) => get().handleRealtimeUpdate("chapters", payload as any)
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "sections" },
            (payload) => get().handleRealtimeUpdate("sections", payload as any)
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "handouts" },
            (payload) => get().handleRealtimeUpdate("handouts", payload as any)
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              set({ connected: true });
              console.info("Successfully subscribed");
            } else if (status === "CLOSED") {
              console.info("Subscription closed");
              set({ connected: false });

              setTimeout(() => {
                const connectedAtempts = get().connectedAtempts;
                if (connectedAtempts <= 5) {
                  get().setupRealtimeSubscription(supabase, campaignId);
                  set({ connectedAtempts: connectedAtempts + 1 });
                }
              }, 3000);
            }
          });

        return () => {
          supabase.removeChannel(campaignChannel);
          set({ connected: false });
          console.info("unsubscribed setupRealtimeSubscription");
        };
      },
    }),
    {
      name: "campaign-store",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

export default useCampaignStore;
