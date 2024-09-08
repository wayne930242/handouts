"use client";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "../ui/button";

import { Star } from "lucide-react";

export default function FavoriteButton(
  props: ButtonProps & {
    isFavorite: boolean;
  }
) {
  const { isFavorite, className, ...rest } = props;
  return (
    <Button
      className={cn(
        "flex gap-1.5 items-center",
        "text-yellow-300 hover:text-yellow-300",
        "transition-colors duration-200",
        className
      )}
      size="icon"
      variant="link"
      {...rest}
    >
      <Star
        className={cn("h-6 w-6", {
          "fill-yellow-300 hover:fill-yellow-transparent": isFavorite,
          "fill-transparent hover:fill-yellow-300": !isFavorite,
        })}
        strokeWidth={2}
      />
    </Button>
  );
}
