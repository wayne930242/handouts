"use client";

import { Link, usePathname, useRouter } from "@/navigation";
import { Badge } from "../ui/badge";

import { MenubarItem } from "../ui/menubar";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import OverlayLoading from "./OverlayLoading";
import { Button } from "../ui/button";

const Routers = [
  {
    path: "/campaigns",
    exact: false,
  },
  {
    path: "/docs",
    exact: false,
  },
  {
    path: "/games",
    exact: false,
  },
] as const;

export default function NavItems() {
  const t = useTranslations("LocaleLayout");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        className="flex items-center gap-1 text-2xl font-bold grow-0 shrink-0 whitespace-nowrap px-0"
        variant="ghost"
        onClick={() => {
          startTransition(() => {
            router.push("/");
          });
        }}
      >
        RpgHandouts
        <Badge variant="destructive">BETA</Badge>
      </Button>
      {Routers.map(({ path, exact }) => (
        <MenubarItem
          className="whitespace-nowrap"
          key={path}
          onClick={() => {
            startTransition(() => {
              router.push(path);
            });
          }}
          isActive={exact ? pathname === path : pathname.startsWith(path)}
        >
          {t(path.replace("/", ""))}
        </MenubarItem>
      ))}{" "}
      {isPending && <OverlayLoading />}
    </>
  );
}
