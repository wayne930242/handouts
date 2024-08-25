import { Chapter } from "@/types/interfaces";
import SectionViewer from "./SectionViewer";

export default function ChapterViewer({ chapter }: Props) {
  return (
    <div
      className="grid grid-cols-1 gap-y-2 w-full py-6"
      id={`handout-chapter-${chapter.id}`}
    >
      <h2 className="text-2xl font-bold text-center">{chapter.title}</h2>
      {chapter.sections?.map((section) => (
        <SectionViewer section={section} key={section.id} />
      ))}
    </div>
  );
}

interface Props {
  chapter: Chapter;
}
