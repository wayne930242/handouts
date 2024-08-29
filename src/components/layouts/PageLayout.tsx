import { redirect } from "@/navigation";
import { createClient } from "@/lib/supabase/server";
import PassphraseDialog from "@/components/PassphraseDialog";

import Footer from "./Footer";
import NavBar from "./NavBar";

export default async function PageLayout({
  header,
  children,
  sidebar,
  needsAuth = false,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  needsAuth?: boolean;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (needsAuth) {
    if (!user) {
      return redirect("/login");
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <div className="mt-2 max-w-6xl w-full mx-auto flex flex-col gap-2">
        <div className="w-full">
          <NavBar />
        </div>
        {header}
      </div>
      <div className="flex-1 flex flex-col gap-8 max-w-6xl px-3 w-full">
        {children}
      </div>
      <Footer />
      <PassphraseDialog />
    </div>
  );
}
