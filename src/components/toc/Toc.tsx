import React, { useCallback } from "react";

interface TocItem {
  title: string;
  id: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  data: TocItem[];
  pathname: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  data,
  pathname,
}) => {
  const renderTocItem = useCallback(
    (item: TocItem) => (
      <li key={item.id} className={`toc-item toc-item-h${item.level}`}>
        <a
          href={`${pathname}#${item.id}`}
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
    [pathname]
  );

  return (
    <div>
      {data.map((item) => (
        <ol key={item.id} className="toc-level toc-level-1">
          {renderTocItem(item)}
        </ol>
      ))}
    </div>
  );
};

export default TableOfContents;
