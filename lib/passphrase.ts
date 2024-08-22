import { cookies } from "next/headers";

export const STORAGE_KEY = "id-passphrase-record";

interface Passphrase {
  [campaign_id: string | number]: string;
}

function getCookies() {
  try {
    return cookies();
  } catch (e) {
    console.warn(
      "User cookies are not available, falling back to search params"
    );
    return false;
  }
}

export function getPassphrase(campaign_id: string | number): string | null {
  const c = getCookies();
  if (c === false) {
    return null;
  }
  const passphrases = c.get(STORAGE_KEY);
  if (typeof passphrases === "string") {
    try {
      const parsedPassphrases: Passphrase = JSON.parse(passphrases);
      return parsedPassphrases[campaign_id] ?? null;
    } catch (e) {
      console.error("Error parsing passphrase:", e);
    }
  }
  return null;
}

export function addPassphrase(
  campaign_id: string | number,
  passphrase: string
) {
  const c = getCookies();
  if (c === false) {
    const searchParams = new URLSearchParams();
    searchParams.set("passphrase", passphrase);
    return;
  }
  const passphrases = c.get(STORAGE_KEY);
  if (typeof passphrases === "string") {
    try {
      const parsedPassphrases: Passphrase = JSON.parse(passphrases);
      parsedPassphrases[campaign_id] = passphrase;
      cookies().set(STORAGE_KEY, JSON.stringify(parsedPassphrases));
    } catch (e) {
      console.error("Error parsing passphrase:", e);
    }
  }
}
