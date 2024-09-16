import { locales } from "@/navigation";
import { Database } from "./database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  HandoutsTreeTable,
  SetHandoutsTreeDataPayload,
  SetHandoutsTreeDataPayloadLocal,
} from "./handouts";
import { DeepPartial } from "react-hook-form";

export type MySupabaseClient = SupabaseClient<Database>;

export type Locale = (typeof locales)[number];

export type FullCampaignData = Omit<
  Database["public"]["Tables"]["campaigns"]["Row"],
  "created_at"
>;
export type CampaignData = Omit<
  Database["public"]["Tables"]["campaigns"]["Row"],
  "passphrase" | "created_at"
>;

export type Profile = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "display_name" | "avatar_url"
>;

export type Player = {
  user: Profile | null;
};

type Favorite = {
  id: string;
  added_at: string | null;
};

export type GeneratorFieldData = Pick<
  Database["public"]["Tables"]["generator_fields"]["Row"],
  "id" | "name" | "content" | "order_num"
>;

export type GeneratorData = Pick<
  Database["public"]["Tables"]["generators"]["Row"],
  "id" | "name" | "description" | "type"
>;

export type Generator = GeneratorData & {
  fields?: GeneratorFieldData[];
};

export type CampaignDoc = Pick<
  Database["public"]["Tables"]["docs"]["Row"],
  "id" | "title" | "description" | "is_public" | "content"
>;

export type Campaign = Omit<
  Database["public"]["Tables"]["campaigns"]["Row"],
  "created_at"
> & {
  gm: Profile | null;
  players?: Player[];
  chapters: Chapter[];
  favorite?: Favorite[];
  docs?: {
    doc: CampaignDoc | null;
  }[];
};

export type Chapter = ChapterData & {
  sections: Section[];
};

export type Section = SectionData & {
  handouts: Handout[];
};

export type Handout = HandoutData;

export type ChapterData = Database["public"]["Tables"]["chapters"]["Row"];

export type SectionData = Database["public"]["Tables"]["sections"]["Row"];

export type HandoutData = Omit<
  Database["public"]["Tables"]["handouts"]["Row"],
  "updated_at" | "created_at"
>;

export type HandoutType = "text" | "image" | "link" | "youtube";

export type RealtimePayload<T> = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: MutateEventType;
  new: Partial<T>;
  old: Partial<T>;
  errors?: string[];
};

export type MutateEventType = "INSERT" | "UPDATE" | "DELETE";

export interface CampaignStore {
  campaignData: Campaign | null;
  initCampaignData: (campaignData: Campaign | null) => any;
  setCampaignDataLocal: SetHandoutsTreeDataPayloadLocal;
  setCampaignDataRemote: SetHandoutsTreeDataPayload;
  setCampaignData: SetHandoutsTreeDataPayload;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  error: Error | null;
  handleRealtimeUpdate: <T extends { id: string }>(
    table: HandoutsTreeTable,
    payload: RealtimePayload<T>
  ) => void;
}

export interface ConfirmDialogData<T extends any = any> {
  id: string;
  title: string;
  description: string;
  state: "confirmed" | "canceled" | "pending";
  data?: T;
  onConfirm: (data: T) => Promise<void>;
  onCancel?: (data: T) => Promise<void>;
}

type PassphraseDialogKey = "docs" | "campaigns" | "games";
export type PassphraseId = `${PassphraseDialogKey}-${string}`;

export type Passphrase = {
  [key in PassphraseId]: string;
};

export interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  editingId: string | null;
  setEditingId: (editingId: string | null) => void;
  editingStage: "campaign" | "screen" | "doc" | null;
  setEditingStage: (editingStage: "campaign" | "screen" | "doc" | null) => void;
  addPassphraseDialog: PassphraseDialogKey | null;
  setAddPassphraseDialog: (
    passphraseDialog: PassphraseDialogKey | null
  ) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  identities: Array<{
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
  }>;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}

export type ProfileData = Database["public"]["Tables"]["profiles"]["Row"];

export type DocInList = Database["public"]["Tables"]["docs"]["Row"] & {
  owner: Pick<ProfileData, "display_name" | "avatar_url" | "id"> | null;
};

export type CampaignInList =
  Database["public"]["Tables"]["campaigns"]["Row"] & {
    gm: Pick<ProfileData, "display_name" | "avatar_url" | "id"> | null;
  };

export interface ProfileStore {
  profile: ProfileData | null;
  setProfile: (profile: ProfileData | null) => void;
}

// Game types
export type GameInList = Database["public"]["Tables"]["games"]["Row"] & {
  gm: Pick<ProfileData, "display_name" | "avatar_url" | "id"> | null;
};

export type GameData = Database["public"]["Tables"]["games"]["Row"];

export type Game = GameData & {
  campaign: CampaignInGame | null;
  screen: ScreenInGame | null;
  notes: NoteData[];
  docs: { doc: DocInGame | null }[];

  favorite: Favorite[];
  gm: Profile | null;
  players: {
    player: Profile | null;
  }[];
};

export type DocInGame = Pick<
  Database["public"]["Tables"]["docs"]["Row"],
  "id" | "title" | "description" | "banner_url" | "content"
> & {
  owner: Pick<ProfileData, "display_name" | "avatar_url" | "id"> | null;
};

export type CampaignInGameData = Pick<
  Database["public"]["Tables"]["campaigns"]["Row"],
  "id" | "name" | "description" | "banner_url"
>;
export type CampaignInGame = CampaignInGameData & {
  chapters: Chapter[];
};

export type ScreenInGameData = Pick<
  Database["public"]["Tables"]["screens"]["Row"],
  "id"
>;

export type ScreenInGame = ScreenInGameData & {
  chapters: Chapter[];
  generators: {
    generator: Generator | null;
  }[];
};

export type NoteData = Pick<
  Database["public"]["Tables"]["notes"]["Row"],
  | "id"
  | "owner_id"
  | "order_num"
  | "type"
  | "content"
  | "is_public"
  | "metadata"
>;

export type GeneratorTableDataPayload =
  | GeneratorData
  | GeneratorFieldData
  | Array<GeneratorData | GeneratorFieldData>;

export type GeneratorTableDataPayloadWithoutId =
  | Omit<GeneratorData, "id">
  | Omit<GeneratorFieldData, "id">
  | Array<Omit<GeneratorData, "id"> | Omit<GeneratorFieldData, "id">>;

export type SetGeneratorsPayload = <
  E extends MutateEventType,
  T extends E extends "INSERT"
    ? GeneratorTableDataPayloadWithoutId
    : GeneratorTableDataPayload
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

export type NoteDataPayload = NoteData | Array<NoteData>;

export type NoteDataPayloadWithoutId =
  | Omit<NoteData, "id">
  | Array<Omit<NoteData, "id">>;

export type SetNoteDataPayloadLocal = <
  E extends MutateEventType,
  T extends E extends "INSERT" ? NoteDataPayloadWithoutId : NoteDataPayload
>(
  newData: T,
  oldData: T extends Array<any> ? Partial<T[number]>[] : Partial<T>,
  tableName: HandoutsTreeTable,
  type: E
) => void;

export type SetNoteDataPayload = <
  E extends MutateEventType,
  T extends E extends "INSERT" ? NoteDataPayloadWithoutId : NoteDataPayload
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

export interface GameStore {
  gameData: Game | null;
  initGameData: (gameData: Game | null) => void;
  setGameData: (partialGameData: DeepPartial<Game>) => void;

  setScreenHandouts: SetHandoutsTreeDataPayload;

  setGenerators: SetGeneratorsPayload;

  setNotes: SetNoteDataPayload;
  setNotesLocal: SetNoteDataPayloadLocal;
  setNotesRemote: SetNoteDataPayload;
  handleRealtimeUpdateNotes: <T extends NoteData>(
    payload: RealtimePayload<T>
  ) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  needConnect: boolean;
  setNeedConnect: (needConnect: boolean) => void;
  error: Error | null;
}
