import { locales } from "@/navigation";
import { Database } from "./database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export type MySupabaseClient = SupabaseClient<Database>;

export type Locale = (typeof locales)[number];

export type FullCampaignData = Omit<Database["public"]["Tables"]["campaigns"]["Row"], 'created_at'>
export type CampaignData = Omit<Database["public"]["Tables"]["campaigns"]["Row"], 'passphrase' | 'created_at'>

export type Campaign = CampaignData & {
  chapters: Chapter[];
}

export type Chapter = ChapterData & {
  sections: Section[];
}

export type Section = SectionData & {
  handouts: Handout[];
}

export type Handout = HandoutData

export type ChapterData = Database["public"]["Tables"]["chapters"]["Row"]

export type SectionData = Database["public"]["Tables"]["sections"]["Row"]

export type HandoutData = Omit<Database["public"]["Tables"]["handouts"]["Row"], 'updated_at' | 'created_at'>

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
  | CampaignData | ChapterData | SectionData | HandoutData
  | Omit<CampaignData, 'id'> | Omit<ChapterData, 'id'> | Omit<SectionData, 'id'> | Omit<HandoutData, 'id'>
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
  initCampaignData: (campaignData: Campaign) => any;
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
  connectedAtempts: number;
  resetConnectedAttempts: () => void;
  error: Error | null;
  handleRealtimeUpdate: <T extends { id: string }>(
    table: CampaignSubTable,
    payload: RealtimePayload<T>
  ) => void;
  setupRealtimeSubscription: (
    supabase: MySupabaseClient,
    campaignId: string
  ) => () => void;
}

export interface ConfirmDialogData {
  id: string;
  title: string;
  description: string;
  state: "confirmed" | "canceled" | "pending";
}

type PassphraseDialogKey = "rules" | "campaigns";
export type PassphraseId = `${PassphraseDialogKey}-${string}`;

export type Passphrase = {
  [key in PassphraseId]: string;
};

export interface AppStore {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  editingCampaign: boolean;
  setEditingCampaign: (editingCampaign: boolean) => void;
  editingRule: boolean;
  setEditingRule: (editingRule: boolean) => void;
  addPassphraseDialog: PassphraseDialogKey | null;
  setAddPassphraseDialog: (passphraseDialog: PassphraseDialogKey | null) => void;
  confirmDialog: ConfirmDialogData | null;
  setConfirmDialog: (confirmDialog: ConfirmDialogData | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: {
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
  };
}

// Rules Data
export type Rule = Database["public"]["Tables"]["rules"]["Row"];
