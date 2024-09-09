import { locales } from "@/navigation";
import { Database } from "./database.types";
import { SupabaseClient } from "@supabase/supabase-js";

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
  role: string;
  user: Profile | null;
};

type Favorite = {
  id: string;
  added_at: string | null;
};

export type GeneratorField = Pick<
  Database["public"]["Tables"]["generator_fields"]["Row"],
  "id" | "name" | "content" | "order_num"
>;

export type Generator = Pick<
  Database["public"]["Tables"]["generators"]["Row"],
  "id" | "name" | "description" | "type"
> & {
  fields?: GeneratorField[];
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
  players: Player[];
  chapters: Chapter[];
  favorite: Favorite[];
  docs: {
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
  schema: "public";
  table: string;
  commit_timestamp: string;
  eventType: MutateEventType;
  new: T;
  old: T;
  errors?: { [key: string]: string }[];
};

export type MutateEventType = "INSERT" | "UPDATE" | "DELETE";

export type CampaignSubTable =
  | "campaigns"
  | "chapters"
  | "sections"
  | "handouts";

export type CampaignTableDataPayload =
  | CampaignData
  | ChapterData
  | SectionData
  | HandoutData
  | Array<ChapterData | SectionData | HandoutData>;

export type CampaignTableDataPayloadWithoutId =
  | Omit<CampaignData, "id">
  | Omit<ChapterData, "id">
  | Omit<SectionData, "id">
  | Omit<HandoutData, "id">
  | Array<
      | Omit<ChapterData, "id">
      | Omit<SectionData, "id">
      | Omit<HandoutData, "id">
    >;

export type SetCampaignDataPayload = <
  E extends MutateEventType,
  T extends E extends "INSERT"
    ? CampaignTableDataPayloadWithoutId
    : CampaignTableDataPayload
>(
  newData: T,
  oldData: T extends Array<any> ? Partial<T[number]>[] : Partial<T>,
  tableName: CampaignSubTable,
  type: E,
  supabaseClient: MySupabaseClient,
  debounce?: {
    key: string;
    delay: number;
  }
) => Promise<void>;

export type SetCampaignDataPayloadLocal = <
  E extends MutateEventType,
  T extends E extends "INSERT"
    ? CampaignTableDataPayloadWithoutId
    : CampaignTableDataPayload
>(
  newData: T,
  oldData: T extends Array<any> ? Partial<T[number]>[] : Partial<T>,
  tableName: CampaignSubTable,
  type: E
) => void;

export interface CampaignStore {
  campaignData: Campaign | null;
  initCampaignData: (campaignData: Campaign | null) => any;
  setCampaignDataLocal: SetCampaignDataPayloadLocal;
  setCampaignDataRemote: SetCampaignDataPayload;
  setCampaignData: SetCampaignDataPayload;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  error: Error | null;
  handleRealtimeUpdate: <T extends { id: string }>(
    table: CampaignSubTable,
    payload: RealtimePayload<T>
  ) => void;
}

export interface ConfirmDialogData<T extends any = any> {
  id: string;
  title: string;
  description: string;
  state: "confirmed" | "canceled" | "pending";
  data?: T;
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
  confirmDialog: ConfirmDialogData | null;
  setConfirmDialog: (confirmDialog: ConfirmDialogData | null) => void;
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

export type Game = {
  id: string;

  title: string;
  description: string | null;

  campaigns: { campaign: CampaignInGame }[];
  docs: { doc: DocInGame }[];
  screens: ScreenInGame[];
  notes: Note[];

  favorite: Favorite[];
  gm: Profile | null;
  players: {
    player: Profile | null;
  }[];
};

export type DocInGame = Pick<
  Database["public"]["Tables"]["docs"]["Row"],
  "id" | "title" | "description" | "banner_url" | "content"
>;

export type CampaignInGameData = Pick<
  Database["public"]["Tables"]["campaigns"]["Row"],
  "id" | "name" | "description" | "banner_url"
>;
export type CampaignInGameData = CampaignInGameData & {
  chapters: Chapter[];
};

export type ScreenInGameData = Pick<"id">;

export type ScreenInGame = ScreenInGameData & {
  chapters: Chapter[];
  generators: {
    generator: Generator | null;
  }[];
};

export type Note = Pick<
  Database["public"]["Tables"]["notes"]["Row"],
  | "id"
  | "owner_id"
  | "order_num"
  | "type"
  | "content"
  | "is_public"
  | "metadata"
>;
