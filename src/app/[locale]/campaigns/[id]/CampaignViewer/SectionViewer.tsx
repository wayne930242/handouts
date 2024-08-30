import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import dynamic from "next/dynamic";

import { Section } from "@/types/interfaces";
import { cn } from "@/lib/utils";

const HandoutViewer = dynamic(() => import("./HandoutViewer"), {
  ssr: false,
});

export default function SectionViewer({ section }: Props) {
  return section.handouts?.length ? (
    <Card id={`handout-section-${section.id}`}>
      {section.title && (
        <CardHeader>
          <CardTitle className="text-center text-xl">{section.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("p-3", { "pt-3": !section.title })}>
        {section.handouts?.length && (
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
            <Masonry gutter="20px">
              {section.handouts?.map((handout) => (
                <HandoutViewer
                  handout={handout}
                  key={handout.id}
                  chapterId={section.chapter_id!}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </CardContent>
    </Card>
  ) : null;
}

interface Props {
  section: Section;
}
