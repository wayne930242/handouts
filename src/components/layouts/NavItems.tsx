"use client";
import { Link, usePathname } from "@/navigation";
import { Badge } from "../ui/badge";

import { MenubarItem } from "../ui/menubar";
import { useTranslations } from "next-intl";

const Routers = [
  {
    path: "/campaigns",
    exact: false,
  },
  {
    path: "/docs",
    exact: false,
  },
] as const;

export default function NavItems() {
  const t = useTranslations("LocaleLayout");
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className="flex items-center gap-1 text-2xl font-bold grow-0 shrink-0 whitespace-nowrap"
      >
        Handouts
        <Badge variant="destructive">BETA</Badge>
      </Link>
      {Routers.map(({ path, exact }) => (
        <MenubarItem
          key={path}
          href={path}
          isActive={exact ? pathname === path : pathname.startsWith(path)}
        >
          {t(path.replace("/", ""))}
        </MenubarItem>
      ))}{" "}
    </>
  );
}
