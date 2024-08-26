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
      asGM: false,
      loading: false,
      error: null,
      connected: false,
      connectedAtempts: 0,
      setAsGM: (asGM) => set({ asGM }),
      setCampaignDataLocal: async (newData, tableName, type) => {
        if (Array.isArray(newData)) {
          for (const item of newData) {
            set((state) => {
              if (!state.campaignData) return state;
              let updatedData = updateCampaignNestedData(
                state.campaignData,
                tableName,
                item,
                {},
                type
              );
              return { campaignData: updatedData };
            });
          }
        } else {
          set((state) => {
            if (!state.campaignData) return state;
            let updatedData = updateCampaignNestedData(
              state.campaignData,
              tableName,
              newData,
              {},
              type
            );
            return { campaignData: updatedData };
          });
        }
      },
      setCampaignDataRemote: async (
        newData,
        supabaseClient,
        tableName,
        type,
        debounce
      ) => {
        const updateRemote = async () => {
          set({ loading: true, error: null });
          let result: any;
          try {
            if (Array.isArray(newData)) {
              result = await supabaseClient
                .from(tableName)
                .upsert(newData)
                .select();
              for (const item of result.data ?? []) {
                set((state) => {
                  if (!state.campaignData) return state;
                  let updatedData = updateCampaignNestedData(
                    state.campaignData,
                    tableName,
                    item,
                    {},
                    type
                  );
                  return { campaignData: updatedData };
                });
              }
            } else {
              if (type === "INSERT") {
                result = await supabaseClient
                  .from(tableName)
                  .insert({ ...newData, id: undefined })
                  .select()
                  .single();
              } else if (type === "UPDATE") {
                result = await supabaseClient
                  .from(tableName)
                  .update(newData)
                  .eq("id", newData.id)
                  .select()
                  .single();
              } else if (type === "DELETE") {
                result = await supabaseClient
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
        supabaseClient,
        tableName,
        type,
        debounce
      ) => {
        if (type === "INSERT") {
          // Update by subscription
        } else if (type === "UPDATE") {
          get().setCampaignDataLocal(newData, tableName, type);
        } else if (type === "DELETE") {
          // Update by subscription
        }

        get().setCampaignDataRemote(
          newData,
          supabaseClient,
          tableName,
          type,
          debounce
        );

        if (process.env.NODE_ENV === "development") {
          console.info(get().campaignData);
        }
      },
      fetchCampaignData: async (supabase, campaignId) => {
        set({ loading: true });
        try {
          const { data: campaignData } = await supabase
            .from("campaigns")
            .select(
              `
                id,
                gm_id,
                name,
                description,
                passphrase,
                chapters:chapters (
                  id,
                  campaign_id,
                  title,
                  order_num,
                  sections:sections (
                    id,
                    chapter_id,
                    title,
                    order_num,
                    handouts:handouts (
                      id,
                      title,
                      content,
                      is_public,
                      section_id,
                      type,
                      owner_id,
                      note,
                      order_num
                    )
                  )
                )
              `
            )
            .eq("id", campaignId)
            .order("order_num", {
              referencedTable: "chapters",
              ascending: true,
            })
            .order("order_num", {
              referencedTable: "chapters.sections",
              ascending: true,
            })
            .order("order_num", {
              referencedTable: "chapters.sections.handouts",
              ascending: true,
            })
            .single();

          if (campaignData) {
            if (process.env.NODE_ENV === "development") {
              console.info("Init CampaignData:", campaignData);
            }

            set({ campaignData, error: null });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error("Unknown error"),
          });
        }
        set({ loading: false });
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
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "handout_images" },
            (payload) =>
              get().handleRealtimeUpdate("handout_images", payload as any)
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              set({ connected: true });
              console.info("Successfully subscribed");
            } else if (status === "CLOSED") {
              set({ connected: false });
              console.info("Subscription closed, retrying in 3s...");
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
