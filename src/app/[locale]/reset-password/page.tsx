import { FormMessage, Message } from "@/components/forms/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";
import { createClient } from "@/lib/supabase/server";
import { encodedRedirect } from "@/lib/route";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  const resetPassword = async (formData: FormData) => {
    "use server";
    const supabase = createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
      encodedRedirect(
        "error",
        "/reset-password",
        "密碼和確認密碼是必填的。",
      );
    }

    if (password !== confirmPassword) {
      encodedRedirect(
        "error",
        "/reset-password",
        "密碼不相符。",
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      encodedRedirect(
        "error",
        "/reset-password",
        "密碼更新失敗。",
      );
    }

    encodedRedirect("success", "/reset-password", "Password updated");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full">
      <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
        <h1 className="text-2xl font-medium">重設密碼</h1>
        <p className="text-sm text-foreground/60">
          請輸入新密碼。
        </p>

        <Label htmlFor="password">新密碼</Label>
        <Input
          type="password"
          name="password"
          placeholder="New password"
          required
        />
        <Label htmlFor="confirmPassword">確認密碼</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
        />
        <SubmitButton formAction={resetPassword}>重設密碼</SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
