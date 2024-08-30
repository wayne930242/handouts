import { redirect } from "@/navigation";
import { createClient } from "@/lib/supabase/server";

import AuthButton from "../AuthButton";
import LocaleSwitcher from "../LocaleSwitcher";

import Footer from "./Footer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import NavItems from "./NavItems";
import VisuallyHidden from "../ui/visuallyhidden";

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
        <header className="justify-between sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
            <NavItems />
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <VisuallyHidden>
                <SheetTitle>Navigation</SheetTitle>
              </VisuallyHidden>
              <VisuallyHidden>
                <SheetDescription>Navigation menu</SheetDescription>
              </VisuallyHidden>
              <nav className="grid gap-6 text-lg font-medium">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 grow-0 justify-end">
            <LocaleSwitcher />
            <AuthButton />
          </div>
        </header>
        {header}
      </div>
      <div className="flex-1 flex flex-col gap-8 max-w-6xl px-3 w-full">
        <div className="flex gap-x-2 w-full">
          <div className="w-full">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
