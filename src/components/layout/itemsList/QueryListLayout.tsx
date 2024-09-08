import { cn } from "@/lib/utils";
import React from "react";
import { PacmanLoader } from "react-spinners";

export default function QueryListLayout({
  isLoading,
  noItemTitle,
  noItemDescription,
  hasNoItem,
  items,
}: Props) {
  return isLoading ? (
    <div className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isLoading} size={24} />
    </div>
  ) : hasNoItem ? (
    <div className="flex flex-col items-center justify-center gap-2 text-center py-12">
      <div className="text-2xl font-bold">{noItemTitle}</div>
      <div className="text-sm text-muted-foreground">{noItemDescription}</div>
    </div>
  ) : (
    <div className="grid grid-cols-1 divide-y gap-y-4">
      {items.map((item) => (
        <CardsArea title={item.title} icon={item.icon} key={item.title}>
          {item.children}
        </CardsArea>
      ))}
    </div>
  );
}

interface Props {
  isLoading?: boolean;
  noItemTitle?: string;
  noItemDescription?: string;
  hasNoItem?: boolean;
  items: ItemProps[];
}

const CardsArea = ({ title, children, icon }: ItemProps) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div
      className={cn("w-full flex flex-col gap-2 py-4 px-2", {
        hidden: childrenArray.length === 0,
      })}
    >
      <h2 className="text-2xl font-bold flex items-center gap-x-2">
        <span>{title}</span>
        <span>{icon}</span>
      </h2>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
};

interface ItemProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}
