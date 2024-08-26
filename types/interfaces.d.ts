import { SupabaseClient } from "@supabase/supabase-js";

export interface CampaignBase {
  id: string | "new";
  gm_id: string;
  name: string;
  description?: string;
  passphrase?: string;
}

export interface Campaign extends CampaignBase {
  chapters: Chapter[];
}

export interface Chapter extends ChapterBase {
  sections: Section[];
}

export interface Section extends SectionBase {
  handouts: Handout[];
}

export interface Handout extends HandoutBase {
  images: HandoutImages[];
}

export interface ChapterBase {
  id: number | "new";
  campaign_id: string;
  title?: string;
  order_num: number;
}

export interface SectionBase {
  id: number | "new";
  chapter_id: number;
  title?: string;
  order_num: number;
}

export interface HandoutBase {
  id: string | "new";
  title?: string;
  content?: string;
  is_public: boolean;
  section_id: number;
  type: HandoutType;
  owner_id: string;
  note?: string;
  order_num: number;
}

export type HandoutType = "text" | "image" | "link" | "youtube";

export interface HandoutImagesBase {
  id: string | "new";
  handout_id: string;
  image_url: string;
  display_order: number;
  caption?: string;
  type: HandoutImageType;
}

export interface HandoutImage extends HandoutImagesBase {}

export interface Image {
  id: number;
  related_id: number | string;
  related_table: string;
  image_url: string;
  image_type: string;
  description: string;
  metadata: {
    fileName: string;
    contentType: string;
    size: number;
  };
  created_at: string;
}

export type HandoutImageType = "normal" | "map" | "scene" | "letter" | "ticket";

export type RealtimePayload<T> = {
  schema: "public";
  table: string;
  commit_timestamp: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
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
  | Partial<Campaign | Chapter | Section | Handout | HandoutImage>
  | Array<Partial<Chapter | Section | Handout | HandoutImage>>;

export type SetCampaignData = (
  newData: SetCampaignPayload,
  supabaseClient: SupabaseClient,
  tableName: CampaignSubTable,
  type: "INSERT" | "UPDATE" | "DELETE",
  debounce?: {
    key: string;
    delay: number;
  }
) => Promise<void>;

export interface CampaignStore {
  campaignData: Campaign | null;
  asGM: boolean;
  setAsGM: (asGM: boolean) => void;
  setCampaignDataLocal: (
    newData: SetCampaignPayload,
    tableName: CampaignSubTable,
    type: "INSERT" | "UPDATE" | "DELETE"
  ) => void;
  setCampaignDataRemote: (
    newData: SetCampaignPayload,
    supabaseClient: SupabaseClient,
    tableName: CampaignSubTable,
    type: "INSERT" | "UPDATE" | "DELETE",
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

export interface AppStore {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  editingCampaign: boolean;
  setEditingCampaign: (editingCampaign: boolean) => void;
  passphraseDialog: boolean;
  setPassphraseDialog: (passphraseDialog: boolean) => void;
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
