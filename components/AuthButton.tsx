import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const supabase = createClient();

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
      歡迎
      <form action={signOut}>
        <Button variant="outline">登出</Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/login">
        <Button>登入</Button>
      </Link>
      <Link href="/signup">
        <Button variant="outline">註冊</Button>
      </Link>
    </div>
  );
}
