"use client";

import { Eye, EyeOff } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import YouTube from "react-youtube";

import useCanEditCampaign from "@/lib/hooks/useCanEditCampaign";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Handout } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import LinkViewer from "./LinkViewer";
import dynamic from "next/dynamic";

const LightBoxWrapper = dynamic(() => import("@/components/LightBoxWrapper"), {
  ssr: false,
});

export default function HandoutViewer({ handout }: Props) {
  const { setCampaignData } = useCampaignStore();
  const canEdit = useCanEditCampaign();
  const supabase = createClient();

  return (
    <div
      className="flex flex-col gap-y-2 w-full py-2"
      id={`handout-${handout.id}`}
    >
      <div className="flex gap-2 items-center justify-between">
        <h3 className="text-lg font-bold grow">{handout.title}</h3>
        {canEdit && (
          <Button
            className={cn({
              "text-destructive hover:text-destructive/80": !handout.is_public,
              "text-green-600 hover:text-green-500": handout.is_public,
            })}
            variant="outline"
            size="icon"
            onClick={() => {
              setCampaignData(
                {
                  id: handout.id,
                  section_id: handout.section_id,
                  is_public: !handout.is_public,
                },
                supabase,
                "handouts",
                "UPDATE"
              );
            }}
          >
            {handout.is_public ? <Eye /> : <EyeOff />}
          </Button>
        )}
      </div>
      {handout.type === "text" && (
        <LightBoxWrapper>
          <Markdown
            className="prose prose-sm max-w-none"
            remarkPlugins={[remarkGfm]}
          >
            {handout.content}
          </Markdown>
        </LightBoxWrapper>
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
      {handout.type === "link" && <LinkViewer content={handout.content} />}
    </div>
  );
}

interface Props {
  handout: Handout;
  chapterId: number;
}
