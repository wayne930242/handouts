import { create } from "zustand";
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

const updateNestedArray = <T extends { id: number | string }>(
  array: T[],
  newRecord: T,
  oldRecord: T,
  eventType: "INSERT" | "UPDATE" | "DELETE"
): T[] => {
  switch (eventType) {
    case "INSERT":
      return [...array, newRecord];
    case "UPDATE":
      return array.map((item) =>
        item.id === newRecord.id ? { ...item, ...newRecord } : item
      );
    case "DELETE":
      return array.filter((item) => item.id !== oldRecord.id);
    default:
      return array;
  }
};

const updateCampaignNestedData = (
  campaignData: Campaign | null,
  table: string,
  newRecord: any,
  oldRecord: any,
  eventType: "INSERT" | "UPDATE" | "DELETE"
): Campaign | null => {
  if (!campaignData) return null;

  let updatedData = { ...campaignData };

  switch (table) {
    case "chapters":
      updatedData.chapters = updateNestedArray(
        updatedData.chapters,
        newRecord as Chapter,
        oldRecord as Chapter,
        eventType
      );
      break;
    case "sections":
      updatedData.chapters = updatedData.chapters.map((chapter) => ({
        ...chapter,
        sections: updateNestedArray(
          chapter.sections,
          newRecord as Section,
          oldRecord as Section,
          eventType
        ),
      }));
      break;
    case "handouts":
      updatedData.chapters = updatedData.chapters.map((chapter) => ({
        ...chapter,
        sections: chapter.sections.map((section) => ({
          ...section,
          handouts: updateNestedArray(
            section.handouts,
            newRecord as Handout,
            oldRecord as Handout,
            eventType
          ),
        })),
      }));
      break;
    case "handout_images":
      updatedData.chapters = updatedData.chapters.map((chapter) => ({
        ...chapter,
        sections: chapter.sections.map((section) => ({
          ...section,
          handouts: section.handouts.map((handout) => ({
            ...handout,
            images: updateNestedArray(
              handout.images,
              newRecord as HandoutImage,
              oldRecord as HandoutImage,
              eventType
            ),
          })),
        })),
      }));
      break;
  }

  return updatedData;
};

const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaignData: null,
  loading: false,
  error: null,
  setCampaignData: async (newData, currentData, supabaseClient, tableName) => {
    set({ loading: true, error: null });

    try {
      let result;
      let eventType: "INSERT" | "UPDATE";

      if (currentData.id === "new") {
        result = await supabaseClient
          .from(tableName)
          .insert({ ...newData, id: undefined })
          .select()
          .single();
        eventType = "INSERT";
      } else {
        result = await supabaseClient
          .from(tableName)
          .update(newData)
          .eq("id", currentData.id)
          .select()
          .single();
        eventType = "UPDATE";
      }

      if (result.error) {
        throw result.error;
      }

      const updatedCampaign = updateCampaignNestedData(
        get().campaignData,
        tableName,
        result.data,
        currentData,
        eventType
      );

      set({ campaignData: updatedCampaign, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
        loading: false,
      });
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
}));

export default useCampaignStore;
