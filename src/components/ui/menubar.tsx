import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { forwardRef } from "react";

export const MenubarItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isActive?: boolean; href: string }
>(({ className, isActive, href, children, ...props }, ref) => {
  const Wrapper = href
    ? Link
    : ({
        children,
        href: _href,
      }: {
        children: React.ReactNode;
        href?: string;
      }) => children;
  return (
    <Wrapper href={href}>
      <div
        ref={ref}
        className={cn(
          "transition-colors hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </Wrapper>
  );
});
MenubarItem.displayName = "MenubarItem";
