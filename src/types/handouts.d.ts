import {
  ChapterData,
  HandoutData,
  SectionData,
  MutateEventType,
  MySupabaseClient,
} from "./interfaces";

export type HandoutsTreeTable = "chapters" | "sections" | "handouts";

export type HandoutsTreeDataPayload =
  | ChapterData
  | SectionData
  | HandoutData
  | Array<ChapterData | SectionData | HandoutData>;

export type HandoutsTreeDataPayloadWithoutId =
  | Omit<ChapterData, "id">
  | Omit<SectionData, "id">
  | Omit<HandoutData, "id">
  | Array<
      | Omit<ChapterData, "id">
      | Omit<SectionData, "id">
      | Omit<HandoutData, "id">
    >;

export type SetHandoutsTreeDataPayload = <
  E extends MutateEventType,
  T extends E extends "INSERT"
    ? HandoutsTreeDataPayloadWithoutId
    : HandoutsTreeDataPayload
>(
  newData: T,
  oldData: T extends Array<any> ? Partial<T[number]>[] : Partial<T>,
  tableName: HandoutsTreeTable,
  type: E,
  supabaseClient: MySupabaseClient,
  debounce?: {
    key: string;
    delay: number;
  }
) => Promise<void>;

export type SetHandoutsTreeDataPayloadLocal = <
  E extends MutateEventType,
  T extends E extends "INSERT"
    ? HandoutsTreeDataPayloadWithoutId
    : HandoutsTreeDataPayload
>(
  newData: T,
  oldData: T extends Array<any> ? Partial<T[number]>[] : Partial<T>,
  tableName: HandoutsTreeTable,
  type: E
) => void;
