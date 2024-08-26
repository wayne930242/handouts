import ky from "ky";

export function safeEncodeURIComponent(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

interface UrlMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

export async function fetchUrlMetadata(
  url: string
): Promise<UrlMetadata | undefined> {
  const API_KEY = process.env.NEXT_PUBLIC_LINK_PREVIEW_KEY;
  if (!API_KEY) {
    throw new Error("API key is not defined");
  }

  const API_URL = `https://api.linkpreview.net/?q=${safeEncodeURIComponent(
    url
  )}`;

  try {
    const result = await ky
      .get(API_URL, {
        headers: {
          "X-Linkpreview-Api-Key": API_KEY,
        },
        timeout: 10000, // 10 seconds timeout
      })
      .json();

    // Type assertion to ensure the result matches our UrlMetadata interface
    return result as UrlMetadata;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching URL metadata:", error.message);
    } else {
      console.error("Unknown error occurred while fetching URL metadata");
    }
  }
}
