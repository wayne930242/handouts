import { createClient } from "@/lib/supabase/server";
import { Link } from "@/navigation";
import { redirect } from "@/navigation";
import { Button } from "./ui/button";
import { getTranslations } from "next-intl/server";

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
      {t("welcome")}
      <form action={signOut}>
        <Button variant="outline">{t("logout")}</Button>
      </form>
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
