import { BASE_URL } from "@/config/app";
import { headers } from "next/headers";
import { encodeUrlPath } from "./route";

/**
 * Gets the current pathname and optionally includes encoded search params.
 * This function is designed to be used on the server side in Next.js applications.
 *
 * @param {Object} options - Configuration options
 * @param {boolean} [options.includeSearchParams=false] - Whether to include search params in the result
 * @param {boolean} [options.encodeUrl=true] - Whether to encode the URL (both pathname and search params)
 * @returns {string} The current pathname, optionally with encoded search params
 */
export function getCurrentUrl(
  options: {
    includeSearchParams?: boolean;
    encodeUrl?: boolean;
  } = {}
): string {
  const { includeSearchParams = false, encodeUrl = true } = options;
  const heads = headers();
  const nextUrl = heads.get("next-url") || "/";
  const urlObj = new URL(nextUrl, BASE_URL); // Dummy base for parsing

  let result = urlObj.pathname;
  if (includeSearchParams && urlObj.search) {
    // Remove the leading '?' from search params
    const searchParams = urlObj.search.slice(1);
    result = `${result}${result.endsWith("/") ? "" : "/"}?${searchParams}`;
  }

  if (encodeUrl) {
    result = encodeUrlPath(result);
  }

  return result;
}
