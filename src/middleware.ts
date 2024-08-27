import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { locales } from "./navigation";

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix: "as-needed",
  defaultLocale: "en",
});

const publicPages = [
  "/",
  "/campaigns",
  "/campaigns/info/[id]",
  "/campaigns/[id]",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

function isPublicPage(pathname: string): boolean {
  // Remove locale prefix if present
  const path =
    pathname.replace(new RegExp(`^/(${locales.join("|")})`), "") || "/";

  return publicPages.some((page) => {
    // Convert route pattern to regex
    const routePattern = `^${page
      .replace(/\[.*?\]/g, "[^/]+")
      .replace(/\/$/, "")}/?$`;
    const regex = new RegExp(routePattern);
    return regex.test(path);
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Apply internationalization first
  const intlResult = intlMiddleware(request);

  // Then check if it's a public page
  const pathnameIsPublic = isPublicPage(pathname);

  // Handle Supabase session
  let response = await updateSession(request);

  // If no response from updateSession, use the intlResult
  if (!response) {
    response = intlResult;
  } else {
    // Merge headers from intlResult into our response
    intlResult.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }

  // If it's not a public page, you might want to add additional auth checks here
  if (!pathnameIsPublic) {
    // Add your auth logic here
    // For example, redirect to login if not authenticated
    // const session = await getSession(request);
    // if (!session) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
