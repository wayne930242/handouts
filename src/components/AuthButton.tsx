import { createClient } from "@/lib/supabase/server";
import { Link } from "@/navigation";
import { redirect } from "@/navigation";
import { Button } from "./ui/button";
import { getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import VisuallyHidden from "./ui/visuallyhidden";
import { DialogDescription, DialogTitle } from "./ui/dialog";

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
    <div className="flex items-center gap-4">
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
          <VisuallyHidden>
            <DialogTitle>User menu</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <DialogDescription>User menu</DialogDescription>
          </VisuallyHidden>
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
    </div>
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
