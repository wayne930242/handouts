"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";

import { Section } from "@/types/interfaces";
import SectionCard from "./SectionCard";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";

interface Props {
  sections: Section[];
  chapterId: number;
}

export default function SectionsArea({ sections, chapterId }: Props) {
  const supabase = createClient();

  const { campaignData, setCampaignData } = useCampaignStore();

  return (
    <Droppable droppableId={"chapter-" + chapterId} type="SECTION">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="grid grid-cols-1 gap-y-2"
        >
          {sections.map((section, index) => (
            <Draggable
              key={section.id ?? "new-" + index}
              draggableId={section.id.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <SectionCard section={section} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
