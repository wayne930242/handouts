import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { Section } from "@/types/interfaces";
import HandoutViewer from "./HandoutViewer";

export default function SectionViewer({ section }: Props) {
  return (
    <Card id={`handout-section-${section.id}`}>
      <CardHeader>
        <CardTitle className="text-center text-xl">{section.title}</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

interface Props {
  section: Section;
}
