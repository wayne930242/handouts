"use client";

import { ContentFieldProps } from "../HandoutCard";
import YouTube, { YouTubeProps } from "react-youtube";
import { Input } from "@/components/ui/input";

const extractYoutubeId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function YoutubeEditor({ field }: Props) {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  return (
    <div className="grid grid-cols-1 gap-y-2 w-full">
      <Input
        placeholder="Youtube Id"
        {...field}
        onChange={(e) => {
          const inputValue = e.target.value;
          const youtubeId = extractYoutubeId(inputValue);

          e.target.value = youtubeId ?? "";

          // Call the original onBlur from the field prop
          field.onChange(e);
        }}
      />
      <YouTube
        className="aspect-video"
        videoId={field.value}
        onReady={onPlayerReady}
        opts={{
          width: "100%",
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
          },
        }}
      />
    </div>
  );
}

interface Props {
  field: ContentFieldProps;
}
