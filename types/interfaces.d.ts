export interface CampaignBase {
  id: number | "new";
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
  id: number;
  campaign_id: number;
  title?: string;
  order_num?: number;
}

export interface SectionBase {
  id: number;
  chapter_id: number;
  title?: string;
  order_num?: number;
}

export interface HandoutBase {
  id: string;
  title?: string;
  content?: string;
  is_public: boolean;
  section_id: number;
  type: HandoutType;
  owner_id: string;
  note?: string;
}

export type HandoutType = "image" | "link" | "youtube" | "file";

export interface HandoutImagesBase {
  id: string;
  handout_id: string;
  image_url: string;
  display_order?: number;
  caption?: string;
  type: HandoutImageType;
}

export type HandoutImageType = "normal" | "map" | "scene" | "letter" | "ticket";
