import React, { useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";

interface MultiDOMPortalProps {
  sourceId: string;
  targetIds: string[];
  removeOriginal?: boolean;
}

const createReactElementFromNode = (node: Node, index: number): ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    return <React.Fragment key={index}>{node.textContent}</React.Fragment>;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    const props: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name === "class") {
        props.className = attr.value;
      } else {
        props[attr.name] = attr.value;
      }
    });
    return React.createElement(
      element.tagName.toLowerCase(),
      { ...props, key: index },
      Array.from(element.childNodes).map((child, childIndex) =>
        createReactElementFromNode(child, childIndex)
      )
    );
  }
  return null;
};

export const MultiDOMPortal: React.FC<MultiDOMPortalProps> = ({
  sourceId,
  targetIds,
  removeOriginal = false,
}) => {
  const [sourceContent, setSourceContent] = useState<React.ReactNode | null>(
    null
  );
  const [targetElements, setTargetElements] = useState<HTMLElement[]>([]);
  const [originalElement, setOriginalElement] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    const source = document.getElementById(sourceId);
    if (source) {
      setOriginalElement(source);
      setSourceContent(
        Array.from(source.childNodes).map((node, index) =>
          createReactElementFromNode(node, index)
        )
      );
      if (removeOriginal) {
        source.remove();
      }
    }
    const targets = targetIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    setTargetElements(targets);
  }, [sourceId, targetIds, removeOriginal]);

  if (!sourceContent) {
    return null;
  }

  return (
    <>
      {targetElements.map((target, index) =>
        ReactDOM.createPortal(<div key={index}>{sourceContent}</div>, target)
      )}
    </>
  );
};
