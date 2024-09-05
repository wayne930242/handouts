import React, { useCallback } from "react";

interface TocItem {
  title: string;
  id: string | number;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  data: TocItem[];
  path: string;
}

const Toc: React.FC<TableOfContentsProps> = ({ data, path }) => {
  const renderTocItem = useCallback(
    (item: TocItem) => (
      <li key={item.id} className={`toc-item toc-item-h${item.level}`}>
        <a
          href={`${path}#${item.id}`}
          className={`toc-link toc-link-h${item.level}`}
        >
          {item.title}
        </a>
        {item.children && item.children.length > 0 && (
          <ol className={`toc-level toc-level-${item.level + 1}`}>
            {item.children.map(renderTocItem)}
          </ol>
        )}
      </li>
    ),
    [path]
  );

  return (
    <div className="w-full">
      {data.map((item) => (
        <ol key={item.id} className="toc-level toc-level-1">
          {renderTocItem(item)}
        </ol>
      ))}
    </div>
  );
};

export default Toc;
