import { FormMessage, Message } from "@/components/form/FormMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/form/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import { encodedRedirect } from "@/lib/route";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

interface Props {
  params: {
    locale: string;
  };
  searchParams: Message;
}

export default async function ResetPassword({
  searchParams,
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("ResetPassword");

  const resetPassword = async (formData: FormData) => {
    "use server";
    const t = await getTranslations("Login");
    const supabase = createClient();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (!password || !confirmPassword) {
      encodedRedirect("error", "/reset-password", t("passwordRequired"));
    }
    if (password !== confirmPassword) {
      encodedRedirect("error", "/reset-password", t("passwordMismatch"));
    }
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      encodedRedirect("error", "/reset-password", t("updateFailed"));
    }
    encodedRedirect("success", "/reset-password", t("updateSuccess"));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full">
      <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
        <h1 className="text-2xl font-medium">{t("title")}</h1>
        <p className="text-sm text-foreground/60">{t("description")}</p>
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input
          type="password"
          name="password"
          placeholder={t("newPassword")}
          required
        />
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder={t("confirmPassword")}
          required
        />
        <SubmitButton formAction={resetPassword}>
          {t("resetButton")}
        </SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
