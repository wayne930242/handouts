import { create } from "zustand";
import {
  CampaignStore,
  RealtimePayload,
  HandoutData,
  ChapterData,
  SectionData,
} from "@/types/interfaces";
import { HandoutsTreeTable } from "@/types/handouts";
import { CampaignService } from "../services/campaign";

const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaignData: null,
  initCampaignData: (campaignData) => set({ campaignData }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  connected: false,
  setConnected: (connected) => set({ connected }),
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  editingId: null,
  setEditingId: (editingId) => set({ editingId }),
  editingStage: null,
  setEditingStage: (editingStage) => set({ editingStage }),
  setCampaignData: async (
    newData,
    oldData,
    tableName,
    type,
    supabaseClient,
    debounce
  ) => {
    const campaignService = new CampaignService(
      get().campaignData,
      supabaseClient
    );
    await campaignService.update(
      newData,
      oldData,
      tableName,
      type,
      (loading) => set({ loading }),
      debounce
    );
    const updated = campaignService.getCampaignData();
    set({ campaignData: updated });
  },
  handleRealtimeUpdate: <T extends HandoutData | ChapterData | SectionData>(
    table: HandoutsTreeTable,
    payload: RealtimePayload<T>
  ) => {
    const campaignService = new CampaignService(get().campaignData);
    campaignService.realtimeUpdate(table, payload);
  },
}));

export default useCampaignStore;
