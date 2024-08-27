import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Section } from "@/types/interfaces";
import HandoutViewer from "./HandoutViewer";

export default function SectionViewer({ section }: Props) {
  return (
    <Card id={`handout-section-${section.id}`}>
      <CardHeader>
        <CardTitle className="text-center text-xl">{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-y-2 w-full divide-y">
        {section.handouts?.map((handout) => (
          <HandoutViewer
            handout={handout}
            key={handout.id}
            chapterId={section.chapter_id}
          />
        ))}
      </CardContent>
    </Card>
  );
}

interface Props {
  section: Section;
}
