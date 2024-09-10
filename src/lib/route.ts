import { redirect } from "@/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Decodes a URL-encoded path and removes any leading slash.
 * @param path - The URL-encoded path to decode.
 * @returns The decoded URL path without a leading slash.
 */
export function decodeUrlPath(path: string | null | undefined): string {
  if (path == null) {
    return "";
  }

  try {
    // Split the path and search params
    const [pathPart, ...searchParts] = path.split("?");

    // Decode the path part and remove leading slash if present
    const decodedPath = pathPart
      .split("/")
      .map((segment) => decodeURIComponent(segment))
      .join("/")
      .replace(/^\//, "");

    // If there are search params, decode them
    if (searchParts.length) {
      const searchParams = new URLSearchParams(searchParts.join("?"));
      return `${decodedPath}${
        decodedPath ? "?" : ""
      }${searchParams.toString()}`;
    }

    return decodedPath;
  } catch (error) {
    console.error("Error decoding URL path:", error);
    return path.replace(/^\//, ""); // Return the original path without leading slash if decoding fails
  }
}

/**
 * Encodes a URL path and its query parameters if present.
 * @param path - The URL path to encode, can include query parameters.
 * @returns The encoded URL path with encoded query parameters if present, without a leading slash.
 */
export function encodeUrlPath(path: string | null | undefined): string {
  if (path == null) {
    return "";
  }

  // Split the path and search params
  const [pathPart, ...searchParts] = path.split("?");

  // Encode the path part and remove leading slash if present
  const encodedPath = pathPart
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
    .replace(/^\//, "");

  // If there are search params, encode them
  if (searchParts.length) {
    const searchParams = new URLSearchParams(searchParts.join("?"));
    return `${encodedPath}${encodedPath ? "?" : ""}${searchParams.toString()}`;
  }

  return encodedPath;
}
