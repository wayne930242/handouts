import { Link } from "@/navigation";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/navigation";
import { SubmitButton } from "../../../components/forms/submit-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormMessage, Message } from "@/components/forms/form-message";
import { encodedRedirect } from "@/lib/route";
import { getTranslations } from "next-intl/server";

export default async function Login({
  searchParams,
}: {
  searchParams: Message;
}) {
  const t = await getTranslations("Login");

  const signIn = async (formData: FormData) => {
    "use server";
    const t = await getTranslations("Login");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return encodedRedirect("error", "/login", t("authError"));
    }
    return redirect("/campaigns");
  };

  return (
    <div className="flex flex-col flex-1 p-4 w-full items-center">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        {t("backButton")}
      </Link>
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground [&>input]:mb-6 max-w-md p-4">
        <h1 className="text-2xl font-medium">{t("title")}</h1>
        <p className="text-sm text-foreground/60">
          {t("subtitle")}{" "}
          <Link className="text-blue-600 font-medium underline" href="/signup">
            {t("signupLink")}
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">{t("email")}</Label>
          <Input name="email" placeholder={t("emailPlaceholder")} required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">{t("password")}</Label>
            <Link
              className="text-sm text-blue-600 underline"
              href="/forgot-password"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder={t("passwordPlaceholder")}
            required
          />
          <SubmitButton formAction={signIn} pendingText={t("loginPending")}>
            {t("loginButton")}
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
