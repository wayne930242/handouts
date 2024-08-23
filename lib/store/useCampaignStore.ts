import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "./storage";
import { debounce } from "@/lib/debounce";
import {
  Campaign,
  CampaignStore,
  RealtimePayload,
  CampaignSubTable,
  Chapter,
  Section,
  Handout,
  HandoutImage,
} from "@/types/interfaces";

const sortByOrderNum = <T extends { order_num: number }>(arr: T[]): T[] => {
  return [...arr].sort((a, b) => a.order_num - b.order_num);
};

const sortHandoutImages = (images: HandoutImage[]): HandoutImage[] => {
  return [...images].sort((a, b) => a.display_order - b.display_order);
};

const updateCampaignNestedData = (
  campaignData: Campaign | null,
  table: CampaignSubTable,
  newRecord: any,
  oldRecord: any,
  eventType: "INSERT" | "UPDATE" | "DELETE"
): Campaign | null => {
  if (!campaignData) return null;

  const updatedData = { ...campaignData };

  const updateArray = <T extends { id: number | string }>(
    array: T[],
    record: T
  ): T[] => {
    switch (eventType) {
      case "INSERT":
        return [...array, record];
      case "UPDATE":
        return array.map((item) =>
          item.id === record.id ? { ...item, ...record } : item
        );
      case "DELETE":
        return array.filter((item) => item.id !== record.id);
      default:
        return array;
    }
  };

  switch (table) {
    case "chapters":
      updatedData.chapters = sortByOrderNum(
        updateArray(updatedData.chapters, newRecord as Chapter)
      );
      break;
    case "sections":
      updatedData.chapters = updatedData.chapters.map((chapter) =>
        chapter.id === (newRecord as Section).chapter_id
          ? {
              ...chapter,
              sections: sortByOrderNum(
                updateArray(chapter.sections, newRecord as Section)
              ),
            }
          : chapter
      );
      break;
    case "handouts":
      updatedData.chapters = updatedData.chapters.map((chapter) => ({
        ...chapter,
        sections: chapter.sections.map((section) =>
          section.id === (newRecord as Handout).section_id
            ? {
                ...section,
                handouts: updateArray(section.handouts, newRecord as Handout),
              }
            : section
        ),
      }));
      break;
    case "handout_images":
      updatedData.chapters = updatedData.chapters.map((chapter) => ({
        ...chapter,
        sections: chapter.sections.map((section) => ({
          ...section,
          handouts: section.handouts.map((handout) =>
            handout.id === (newRecord as HandoutImage).handout_id
              ? {
                  ...handout,
                  images: sortHandoutImages(
                    updateArray(handout.images, newRecord as HandoutImage)
                  ),
                }
              : handout
          ),
        })),
      }));
      break;
    case "campaigns":
      // Update campaign-level properties
      return { ...updatedData, ...newRecord };
  }

  return updatedData;
};

const useCampaignStore = create(
  persist<CampaignStore>(
    (set, get) => ({
      campaignData: null,
      loading: false,
      error: null,
      setCampaignData: async (
        newData,
        supabaseClient,
        tableName,
        type,
        key,
        debounceTime
      ) => {
        const updateLocal = () => {
          if (type === "INSERT") {
            // Update by subscription
          } else if (type === "UPDATE") {
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
          } else if (type === "DELETE") {
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
          }
        };

        const updateDatabase = async () => {
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

        updateLocal();
        const [debouncedFn] = debounce(updateDatabase, debounceTime, key);
        debouncedFn();
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
                    images:handout_images (
                      id,
                      handout_id,
                      image_url,
                      display_order,
                      caption,
                      type
                    )
                  )
                )
              )
            `
            )
            .eq("id", campaignId)
            .single();

          if (campaignData) {
            // Sort chapters
            campaignData.chapters.sort((a, b) => a.order_num - b.order_num);

            // Sort sections within each chapter
            campaignData.chapters.forEach((chapter) => {
              chapter.sections.sort((a, b) => a.order_num - b.order_num);

              // Sort handout images within each handout
              chapter.sections.forEach((section) => {
                section.handouts.forEach((handout) => {
                  handout.images.sort(
                    (a, b) => a.display_order - b.display_order
                  );
                });
              });
            });

            set({ campaignData, loading: false, error: null });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error("Unknown error"),
            loading: false,
          });
        }
      },
      handleRealtimeUpdate: <T extends { id: string | number }>(
        table: CampaignSubTable,
        payload: RealtimePayload<T>
      ) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;

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
          .subscribe();

        return () => {
          supabase.removeChannel(campaignChannel);
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
