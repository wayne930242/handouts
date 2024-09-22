import {
  MySupabaseClient,
  Campaign,
  RealtimePayload,
  MutateEventType,
  HandoutData,
  ChapterData,
  SectionData,
  Section,
  Chapter,
} from "@/types/interfaces";
import {
  HandoutsTreeTable,
  HandoutsTreeDataPayload,
  HandoutsTreeDataPayloadWithoutId,
} from "@/types/handouts";
import { updateArray } from "../data/arraryUpdater";
import { debouncify } from "@/lib/debounce";

export class CampaignService {
  private data: Campaign | null = null;
  private supabase: MySupabaseClient | undefined;

  constructor(
    campaignData: Campaign | null,
    supabaseClient?: MySupabaseClient
  ) {
    this.data = campaignData;
    this.supabase = supabaseClient;
  }

  public update = async <
    E extends MutateEventType,
    T extends E extends "INSERT"
      ? HandoutsTreeDataPayloadWithoutId
      : HandoutsTreeDataPayload
  >(
    newData: T,
    oldData: T extends Array<any> ? Partial<T[number]>[] : Partial<T>,
    tableName: HandoutsTreeTable,
    type: E,
    setLoading?: (loading: boolean) => void,
    debounce?: {
      key: string;
      delay: number;
    }
  ): Promise<void> => {
    if (type === "UPDATE") {
      this.setCampaignDataLocal<E, T>(newData, oldData, tableName, type);
    }
    setLoading?.(true);
    await this.setCampaignDataRemote<E, T>(newData, tableName, type, debounce);
    setLoading?.(false);
  };

  public getCampaignData = (): Campaign | null => this.data;

  public realtimeUpdate = <T extends HandoutData | ChapterData | SectionData>(
    table: HandoutsTreeTable,
    payload: RealtimePayload<T>
  ): void => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (process.env.NODE_ENV === "development") {
      console.info("handleRealtimeUpdate:", table, payload);
    }

    this.updateNestedData(table, newRecord as any, oldRecord, eventType);
  };

  private setCampaignDataLocal = <
    E extends MutateEventType,
    T extends E extends "INSERT"
      ? HandoutsTreeDataPayloadWithoutId
      : HandoutsTreeDataPayload
  >(
    newData: T,
    oldData: T extends Array<any> ? Partial<T[number]>[] : Partial<T>,
    tableName: HandoutsTreeTable,
    type: E
  ): void => {
    if (Array.isArray(newData)) {
      newData.forEach((item, index) => {
        this.updateNestedData(
          tableName,
          item as any,
          Array.isArray(oldData) ? oldData[index] : oldData,
          type
        );
      });
    } else {
      this.updateNestedData(tableName, newData as any, oldData as any, type);
    }
  };

  private setCampaignDataRemote = async <
    E extends MutateEventType,
    T extends E extends "INSERT"
      ? HandoutsTreeDataPayloadWithoutId
      : HandoutsTreeDataPayload
  >(
    newData: T,
    tableName: HandoutsTreeTable,
    type: E,
    debounce?: {
      key: string;
      delay: number;
    }
  ): Promise<void> => {
    const updateRemote = async () => {
      try {
        if (!this.supabase) throw new Error("Supabase client not found");
        if (Array.isArray(newData)) {
          await this.supabase
            .from(tableName)
            .upsert(newData as any[])
            .select();
        } else {
          switch (type) {
            case "INSERT":
              await this.supabase
                .from(tableName)
                .insert({ ...newData, id: undefined })
                .select()
                .single();
              break;
            case "UPDATE":
              if (!("id" in newData)) {
                throw new Error("New data must have an ID for UPDATE");
              }
              await this.supabase
                .from(tableName)
                .update(newData)
                .eq("id", (newData as any).id)
                .select()
                .single();
              break;
            case "DELETE":
              if (!("id" in newData)) {
                throw new Error("New data must have an ID for DELETE");
              }
              await this.supabase
                .from(tableName)
                .delete()
                .eq("id", (newData as any).id)
                .select()
                .single();
              break;
          }
        }
      } catch (error) {
        console.error("Error updating remote data:", error);
      }
    };

    if (debounce) {
      const [debouncedFn] = debouncify(
        updateRemote,
        debounce.delay,
        debounce.key
      );
      debouncedFn();
    } else {
      await updateRemote();
    }
  };

  private updateNestedData = <T extends Chapter | Section | HandoutData>(
    table: HandoutsTreeTable,
    newRecord: T,
    oldRecord: Partial<T>,
    eventType: "INSERT" | "UPDATE" | "DELETE"
  ): void => {
    if (!this.data) return;
    switch (table) {
      case "chapters":
        this.data.chapters = updateArray(
          this.data.chapters,
          newRecord as Chapter,
          oldRecord as { id: number },
          eventType
        );
        break;
      case "sections":
        this.data.chapters = this.data.chapters?.map((chapter) => {
          if (eventType === "DELETE") {
            return {
              ...chapter,
              sections: chapter.sections?.filter(
                (section) => section.id !== oldRecord.id
              ),
            };
          } else {
            if (chapter.id === (newRecord as Section).chapter_id) {
              return {
                ...chapter,
                sections: updateArray(
                  chapter.sections,
                  newRecord as Section,
                  oldRecord as { id: number },
                  eventType
                ),
              };
            } else {
              return {
                ...chapter,
                sections: chapter.sections?.filter(
                  (section) => section.id !== newRecord.id
                ),
              };
            }
          }
        });
        break;
      case "handouts":
        this.data.chapters = this.data.chapters?.map((chapter) => ({
          ...chapter,
          sections: chapter.sections?.map((section) => {
            if (eventType === "DELETE") {
              return {
                ...section,
                handouts: section.handouts?.filter(
                  (handout) => handout.id !== oldRecord.id
                ),
              };
            } else {
              if (section.id === (newRecord as HandoutData).section_id) {
                return {
                  ...section,
                  handouts: updateArray(
                    section.handouts,
                    newRecord as HandoutData,
                    oldRecord as { id: string },
                    eventType
                  ),
                };
              } else {
                return {
                  ...section,
                  handouts: section.handouts?.filter(
                    (handout) => handout.id !== newRecord.id
                  ),
                };
              }
            }
          }),
        }));
        break;
    }
  };
}
