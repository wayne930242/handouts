import { Link } from "@/navigation";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/navigation";
import { SubmitButton } from "../../../components/form/submit-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormMessage, Message } from "@/components/form/form-message";
import { headers } from "next/headers";
import { encodedRedirect } from "@/lib/route";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

interface Props {
  params: {
    locale: string;
  };
  searchParams: Message;
}

export default async function ForgotPassword({
  searchParams,
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations("ForgotPassword");

  const forgotPassword = async (formData: FormData) => {
    "use server";
    const t = await getTranslations("Login");
    const email = formData.get("email")?.toString();
    const supabase = createClient();
    const origin = headers().get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();
    if (!email) {
      return encodedRedirect("error", "/forgot-password", t("emailRequired"));
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
    });
    if (error) {
      console.error(error.message);
      return encodedRedirect(
        "error",
        "/forgot-password",
        t("resetPasswordError")
      );
    }
    if (callbackUrl) {
      return redirect(callbackUrl);
    }
    return encodedRedirect(
      "success",
      "/forgot-password",
      t("checkEmailMessage")
    );
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
        <h1 className="text-2xl font-medium">{t("heading")}</h1>
        <p className="text-sm text-foreground/60">
          {t("alreadyHaveAccount")}{" "}
          <Link className="text-blue-600 font-medium underline" href="/login">
            {t("login")}
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input name="email" placeholder={t("emailPlaceholder")} required />
          <SubmitButton formAction={forgotPassword}>
            {t("submitButton")}
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
