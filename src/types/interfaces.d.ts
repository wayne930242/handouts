import { SupabaseClient } from "@supabase/supabase-js";
import { locales } from "@/navigation";
import { Database } from "./database.types";

export type Locale = (typeof locales)[number];

export type CampaignData = Database["public"]["Tables"]["campaigns"]["Row"];

export type Campaign = Omit<CampaignData, 'passphrase' | 'created_at' | 'status'> & {
  chapters: Chapter[];
}

export type Chapter = ChapterData & {
  sections: Section[];
}

export type Section = SectionData & {
  handouts: Handout[];
}

export type Handout = Omit<HandoutData, 'updated_at' | 'created_at'>

export type ChapterData = Database["public"]["Tables"]["chapters"]["Row"]

export type SectionData = Database["public"]["Tables"]["sections"]["Row"]

export type HandoutData = Database["public"]["Tables"]["handouts"]["Row"]

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
  | "handouts"
  | "handout_images";

export type SetCampaignPayload =
  | Partial<Campaign | Chapter | Section | Handout>
  | Array<Partial<Chapter | Section | Handout>>;

export type SetCampaignData = (
  newData: SetCampaignPayload,
  oldData: SetCampaignPayload,
  supabaseClient: SupabaseClient,
  tableName: CampaignSubTable,
  type: MutateEventType,
  debounce?: {
    key: string;
    delay: number;
  }
) => Promise<void>;

export interface CampaignStore {
  campaignData: Campaign | null;
  asGM: boolean;
  setAsGM: (asGM: boolean) => void;
  inWhiteList: boolean;
  fetchWhiteList: (supabase: SupabaseClient) => void;
  setCampaignDataLocal: (
    newData: SetCampaignPayload,
    oldData: SetCampaignPayload,
    tableName: CampaignSubTable,
    type: MutateEventType
  ) => void;
  setCampaignDataRemote: (
    newData: SetCampaignPayload,
    oldData: SetCampaignPayload,
    supabaseClient: SupabaseClient,
    tableName: CampaignSubTable,
    type: MutateEventType,
    debounce?: {
      key: string;
      delay: number;
    }
  ) => Promise<void>;
  setCampaignData: SetCampaignData;
  loading: boolean;
  connected: boolean;
  connectedAtempts: number;
  resetConnectedAttempts: () => void;
  error: Error | null;
  fetchCampaignData: (supabase: SupabaseClient, campaignId: string) => void;
  handleRealtimeUpdate: <T extends { id: string }>(
    table: CampaignSubTable,
    payload: RealtimePayload<T>
  ) => void;
  setupRealtimeSubscription: (
    supabase: SupabaseClient,
    campaignId: string
  ) => () => void;
}

export interface ConfirmDialogData {
  id: string;
  title: string;
  description: string;
  state: "confirmed" | "canceled" | "pending";
}

export interface AppStore {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  editingCampaign: boolean;
  setEditingCampaign: (editingCampaign: boolean) => void;
  passphraseDialog: boolean;
  setPassphraseDialog: (passphraseDialog: boolean) => void;
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
export interface Rule {
  id: string;
  owner_id: string;
  title: string;
  content: string | null;
  passphrase: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
