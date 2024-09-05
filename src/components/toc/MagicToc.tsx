"use client";

import TocContainer from "./TocContainer";
import { MultiDOMPortal } from "../Portal";

interface Props {
  sourceId: string;
  id: string;
}

export default function MagicToc({ sourceId, id }: Props) {
  return (
    <>
      <TocContainer
        mobileChildren={
          <>
            <MultiDOMPortal
              sourceId={sourceId}
              targetIds={[`mobile-${id}`]}
              hideOriginal
            />
            <div className="w-full flex flex-col" id={`mobile-${id}`}></div>
          </>
        }
      >
        <div id={`desktop-${id}`} className="w-full flex flex-col" />
      </TocContainer>
      <MultiDOMPortal
        sourceId={sourceId}
        targetIds={[`desktop-${id}`]}
        hideOriginal
      />
    </>
  );
}
