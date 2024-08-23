import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import Footer from "./Footer";
import NavBar from "./NavBar";

export default async function PageLayout({
  children,
  header,
  needsAuth = false,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
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
      <div className="mt-2 max-w-4xl w-full mx-auto flex flex-col gap-2">
        <NavBar />
        {header}
      </div>
      <div className="flex-1 flex flex-col gap-8 max-w-4xl px-3 w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
}
