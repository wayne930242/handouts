import useCampaignStore from "@/lib/store/useCampaignStore";
import ChapterViewer from "./CampaignViewer/ChapterViewer";

export default function CampaignViewer() {
  const { campaignData } = useCampaignStore();

  return (
    <div className="flex flex-col gap-2 w-full my-2">
      <div className="flex w-full px-2 flex-col gap-y-6 mb-4">
        <h1 className="text-4xl font-bold">{campaignData?.name}</h1>
        <p className="text-muted-foreground text-sm">
          {campaignData?.description}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-y-2 w-full divide-y-2 divide-border">
        {campaignData?.chapters.map((chapter) => (
          <ChapterViewer chapter={chapter} key={chapter.id} />
        ))}
      </div>
    </div>
  );
}
