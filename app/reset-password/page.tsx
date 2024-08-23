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
        "Password and confirm password are required",
      );
    }

    if (password !== confirmPassword) {
      encodedRedirect(
        "error",
        "/reset-password",
        "Passwords do not match",
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      encodedRedirect(
        "error",
        "/reset-password",
        "Password update failed",
      );
    }

    encodedRedirect("success", "/reset-password", "Password updated");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full">
      <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
        <h1 className="text-2xl font-medium">Reset password</h1>
        <p className="text-sm text-foreground/60">
          Please enter your new password below.
        </p>

        <Label htmlFor="password">New password</Label>
        <Input
          type="password"
          name="password"
          placeholder="New password"
          required
        />
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
        />
        <SubmitButton formAction={resetPassword}>Reset password</SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
