import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import dynamic from "next/dynamic";

import { Section } from "@/types/interfaces";

const HandoutViewer = dynamic(() => import("./HandoutViewer"), {
  ssr: false,
});

export default function SectionViewer({ section }: Props) {
  return (
    <Card id={`handout-section-${section.id}`}>
      <CardHeader>
        <CardTitle className="text-center text-xl">{section.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {section.handouts?.length && (
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
            <Masonry gutter="20px">
              {section.handouts?.map((handout) => (
                <HandoutViewer
                  handout={handout}
                  key={handout.id}
                  chapterId={section.chapter_id}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </CardContent>
    </Card>
  );
}

interface Props {
  section: Section;
}
