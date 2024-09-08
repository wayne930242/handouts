import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Hero({
  imageClassName,
  containerClassName,
}: {
  imageClassName?: string;
  containerClassName?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full">
      <div className={cn("w-full relative aspect-[16/9] max-h-72", containerClassName)}>
        <Image
          src="/img/og-img.webp"
          alt="Handouts"
          priority
          fill
          sizes="100vw"
          className={cn("object-cover", imageClassName)}
        />
      </div>
    </div>
  );
}
