import Image from "next/image";
import Markdown from "react-markdown";
import { usePathname } from "@/navigation";
import { useTranslations } from "next-intl";

import useCampaignStore from "@/lib/store/useCampaignStore";

import TocContainer from "@/components/toc/TocContainer";
import Toc from "@/components/toc/Toc";
import ChapterViewer from "./CampaignViewer/ChapterViewer";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CampaignViewer({
  withoutHeader = false,
}: {
  withoutHeader?: boolean;
}) {
  const t = useTranslations("DocViewer");

  const { campaignData } = useCampaignStore((state) => ({
    campaignData: state.campaignData,
  }));

  const pathname = usePathname();

  return (
    <div className="flex gap-x-2 w-full relative" id="campaign-top">
      {campaignData && (
        <TocContainer topId="campaign-top">
          <Toc
            path={pathname}
            data={campaignData.chapters?.map((chapter) => ({
              title: chapter.title,
              id: `handout-chapter-${chapter.id}`,
              level: 1,
              children: chapter.sections?.map((section) => ({
                title: section.title,
                id: `handout-section-${section.id}`,
                level: 2,
                children: section.handouts?.map((handout) => ({
                  title: handout.title,
                  id: `handout-${handout.id}`,
                  level: 3,
                })),
              })),
            }))}
          />
        </TocContainer>
      )}

      <div className="flex flex-col gap-y-2 w-full my-2 px-2">
        <div className="flex w-full px-2 flex-col gap-y-6 mb-4 border-b border-border">
          {!withoutHeader && campaignData?.banner_url && (
            <div className="w-full relative aspect-[24/9]">
              <Image
                src={campaignData.banner_url}
                alt={campaignData.name}
                loader={({ src }) => src}
                className="object-cover"
                priority
                fill
                unoptimized
              />
            </div>
          )}
          {!withoutHeader && (
            <div className="flex w-full px-2 flex-col gap-y-6 mb-4">
              <h1 className="text-4xl font-bold text-center">
                {campaignData?.name}
              </h1>
              <div className="flex justify-center items-center gap-x-2 w-full mb-4 mt-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={campaignData?.gm?.avatar_url ?? ""} />
                  <AvatarFallback>
                    {campaignData?.gm?.display_name ?? "GM"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center text-sm text-muted-foreground">
                  {t("createdBy", {
                    user: campaignData?.gm?.display_name ?? "GM",
                  })}
                </div>
              </div>
              {campaignData?.description && (
                <Markdown className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground text-center">
                  {campaignData?.description}
                </Markdown>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-y-2 w-full divide-y-2 divide-border">
          {campaignData?.chapters.map((chapter) => (
            <ChapterViewer chapter={chapter} key={chapter.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
