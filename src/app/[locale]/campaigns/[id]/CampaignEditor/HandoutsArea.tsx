"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";

import { Section } from "@/types/interfaces";

import HandoutCard from "./HandoutCard";

interface Props {
  section: Section;
}

export default function HandoutsArea({ section }: Props) {
  return (
    <Droppable
      droppableId={"chapter-" + section.chapter_id + "-section-" + section.id}
      type="HANDOUT"
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="grid grid-cols-1 gap-y-3"
        >
          {section.handouts?.map((handout, index) => (
            <Draggable
              key={handout.id ?? "new-" + index}
              draggableId={handout.id.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <HandoutCard
                    handout={handout}
                    chapterId={section.chapter_id}
                  />
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
