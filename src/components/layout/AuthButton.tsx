"use client";

import { Link } from "@/navigation";
import { redirect } from "@/navigation";
import { Button, ItemButton } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProfileStore from "@/lib/store/useProfileStore";
import { useClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import useSessionUser from "@/lib/hooks/useSession";

export default function AuthButton() {
  const supabase = useClient();
  const t = useTranslations("LocaleLayout");
  const user = useSessionUser();

  const { profile } = useProfileStore((state) => ({
    profile: state.profile,
  }));

  const signOut = async () => {
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={profile?.avatar_url ?? ""} />
            <AvatarFallback>
              {profile?.display_name ?? profile?.email ?? "GM"}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
        <Link href="/profile">
          <ItemButton>{t("profile")}</ItemButton>
        </Link>
        <DropdownMenuSeparator />
        <form action={signOut}>
          <ItemButton>{t("logout")}</ItemButton>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex gap-2">
      <Link href="/login">
        <Button size="sm">{t("login")}</Button>
      </Link>
      <Link href="/signup">
        <Button size="sm" variant="outline">
          {t("signup")}
        </Button>
      </Link>
    </div>
  );
}
