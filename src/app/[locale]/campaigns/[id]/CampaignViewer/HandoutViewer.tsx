"use client";

import { Eye, EyeOff } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import YouTube from "react-youtube";

import useCanEditCampaign from "@/lib/hooks/useCanEditCampaign";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Handout } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LinkViewer from "./LinkViewer";
import dynamic from "next/dynamic";
import { useClient } from "@/lib/supabase/client";

const LightBoxWrapper = dynamic(() => import("@/components/LightBoxWrapper"), {
  ssr: false,
});

export default function HandoutViewer({ handout }: Props) {
  const { setCampaignData } = useCampaignStore((state) => ({
    setCampaignData: state.setCampaignData,
  }));
  const canEdit = useCanEditCampaign();
  const supabase = useClient();

  const Wrapper =
    handout.type === "text" || handout.type === "youtube"
      ? LightBoxWrapper
      : ({ children }: any) => children;

  return (
    (handout.content || handout.title) && (
      <Wrapper>
        <div
          className="flex flex-col gap-y-2 w-full h-full p-2 rounded-sm"
          id={`handout-${handout.id}`}
        >
          <div className="flex gap-2 items-center justify-between">
            <h3 className="text-lg font-bold grow">{handout.title}</h3>
            {canEdit && (
              <Button
                className={cn({
                  "text-destructive hover:text-destructive/80":
                    !handout.is_public,
                  "text-green-600 hover:text-green-500": handout.is_public,
                })}
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setCampaignData(
                    {
                      ...handout,
                      is_public: !handout.is_public,
                    },
                    {
                      id: handout.id,
                      section_id: handout.section_id,
                      is_public: handout.is_public,
                    },
                    supabase,
                    "handouts",
                    "UPDATE"
                  );
                }}
              >
                {handout.is_public ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
          {handout.type === "text" && (
            <Markdown
              className="prose prose-sm max-w-none dark:prose-invert"
              remarkPlugins={[remarkGfm]}
            >
              {handout.content}
            </Markdown>
          )}
          {handout.type === "youtube" && (
            <YouTube
              videoId={handout.content}
              opts={{
                width: "100%",
                playerVars: {
                  // https://developers.google.com/youtube/player_parameters
                  autoplay: 0,
                },
              }}
            />
          )}
          {handout.type === "link" && (
            <LinkViewer content={handout.content ?? ""} />
          )}
        </div>
      </Wrapper>
    )
  );
}

interface Props {
  handout: Handout;
  chapterId: number;
}
