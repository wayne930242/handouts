import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const MenubarItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isActive?: boolean }
>(({ className, isActive, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "transition-colors hover:text-foreground cursor-pointer",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
MenubarItem.displayName = "MenubarItem";
