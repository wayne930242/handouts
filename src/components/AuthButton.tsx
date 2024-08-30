import { createClient } from "@/lib/supabase/server";
import { Link } from "@/navigation";
import { redirect } from "@/navigation";
import { Button } from "./ui/button";
import { getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function AuthButton() {
  const supabase = createClient();
  const t = await getTranslations("LocaleLayout");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="/img/default-avatar.webp" />
            <AvatarFallback>GM</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <form action={signOut}>
          <Button
            className="w-full border-none justify-start cursor-default px-2 py-1.5"
            variant="outline"
            size="sm"
          >
            {t("logout")}
          </Button>
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
