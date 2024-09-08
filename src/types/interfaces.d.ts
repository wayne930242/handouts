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

export type MutateEventType = "INSERT" | "UPDATE" | "DELETE";

export type RealtimePayload<T> = {
  schema: "public";
  table: string;
  commit_timestamp: string;
  eventType: MutateEventType;
  new: T;
  old: T;
  errors?: { [key: string]: string }[];
};

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
  | Omit<CampaignData, "id">
  | Omit<ChapterData, "id">
  | Omit<SectionData, "id">
  | Omit<HandoutData, "id">
  | Array<ChapterData | SectionData | HandoutData>;

export type SetCampaignDataPayload = (
  newData: CampaignTableDataPayload,
  oldData: Partial<CampaignTableDataPayload>,
  supabaseClient: MySupabaseClient,
  tableName: CampaignSubTable,
  type: MutateEventType,
  debounce?: {
    key: string;
    delay: number;
  }
) => Promise<void>;

export interface CampaignStore {
  campaignData: Campaign | null;
  initCampaignData: (campaignData: Campaign | null) => any;
  asGM: boolean;
  setAsGM: (asGM: boolean) => void;
  inWhiteList: boolean;
  fetchWhiteList: (supabase: MySupabaseClient) => void;
  setCampaignDataLocal: (
    newData: CampaignTableDataPayload,
    oldData: Partial<CampaignTableDataPayload>,
    tableName: CampaignSubTable,
    type: MutateEventType
  ) => void;
  setCampaignDataRemote: (
    newData: CampaignTableDataPayload,
    oldData: Partial<CampaignTableDataPayload>,
    supabaseClient: MySupabaseClient,
    tableName: CampaignSubTable,
    type: MutateEventType,
    debounce?: {
      key: string;
      delay: number;
    }
  ) => Promise<void>;
  setCampaignData: SetCampaignDataPayload;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  connectedAtempts: number;
  resetConnectedAttempts: () => void;
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

type PassphraseDialogKey = "docs" | "campaigns";
export type PassphraseId = `${PassphraseDialogKey}-${string}`;

export type Passphrase = {
  [key in PassphraseId]: string;
};

export interface AppStore {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  editingCampaign: boolean;
  setEditingCampaign: (editingCampaign: boolean) => void;
  editingDoc: boolean;
  setEditingDoc: (editingDoc: boolean) => void;
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
export type Game = {
  id: string;
  title: string;
  description: string | null;
  gm: Profile | null;
  players: {
    player: Profile | null;
  }[];
  campaigns: { id: string }[];
  docs: { id: string }[];
  screens: ScreenInGame[];
  notes: Note[];
  favorite: Favorite[];
};

export type ScreenInGame = Pick<
  Database["public"]["Tables"]["screens"]["Row"],
  "id"
> & {
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
