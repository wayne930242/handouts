import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { locales } from "./navigation";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix: "as-needed",
  defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    await supabase.auth.getUser();

    const intlResponse = intlMiddleware(request);

    if (intlResponse.headers.get("Location")) {
      response = NextResponse.redirect(
        new URL(intlResponse.headers.get("Location")!, request.url)
      );
    } else {
      response = NextResponse.rewrite(new URL(request.url));
    }

    intlResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    // Copy all cookies from response
    const updatedCookies = response.cookies.getAll();
    updatedCookies.forEach((cookie) => {
      if (intlResponse.cookies.get(cookie.name)?.value !== cookie.value) {
        intlResponse.cookies.set(cookie.name, cookie.value, cookie);
      }
    });

    return intlResponse;
  } catch (error) {
    return response;
  }
}

// config 部分保持不變
export const config = {
  matcher: [
    "/",
    "/(tw|en)/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
