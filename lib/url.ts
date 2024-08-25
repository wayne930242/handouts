import ky from "ky";

export function safeEncodeURIComponent(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

export async function fetchUrlMetadata(url: string): Promise<any> {
  const API_KEY = process.env.NEXT_PUBLIC_LINK_PREVIEW_KEY;
  const API_URL = `https://api.linkpreview.net/?q=${safeEncodeURIComponent(
    url
  )}`;

  const result = await ky.get(API_URL, {
    headers: {
      "X-Linkpreview-Api-Key": API_KEY,
    },
  });

  return result.json;
}
