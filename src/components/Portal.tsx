import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface MultiDOMPortalProps {
  sourceId: string;
  targetIds: string[];
  hideOriginal?: boolean;
}

const createReactElementFromNode = (node: Node, index: number): React.ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    return React.createElement(
      element.tagName.toLowerCase(),
      { key: index, ...Array.from(element.attributes).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}) },
      Array.from(element.childNodes).map((child, childIndex) => createReactElementFromNode(child, childIndex))
    );
  }
  return null;
};

export const MultiDOMPortal: React.FC<MultiDOMPortalProps> = ({
  sourceId,
  targetIds,
  hideOriginal = true,
}) => {
  const [sourceContent, setSourceContent] = useState<React.ReactNode | null>(null);
  const [targetElements, setTargetElements] = useState<HTMLElement[]>([]);
  const [originalElement, setOriginalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const source = document.getElementById(sourceId);
    if (source) {
      setOriginalElement(source);
      setSourceContent(
        Array.from(source.childNodes).map((node, index) =>
          createReactElementFromNode(node, index)
        )
      );
      if (hideOriginal) {
        source.style.display = 'none';
      }
    }
    const targets = targetIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    setTargetElements(targets);
  }, [sourceId, targetIds, hideOriginal]);

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
