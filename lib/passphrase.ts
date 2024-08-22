import { cookies } from "next/headers";

export const STORAGE_KEY = "id-passphrase-record";

interface Passphrase {
  [campaign_id: string | number]: string;
}

export function getPassphrase(campaign_id: string | number): string | null {
  const passphrases = cookies().get(STORAGE_KEY);
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
  const passphrases = cookies().get(STORAGE_KEY);
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

export function removePassphrase(campaign_id: string | number) {
  const passphrases = cookies().get(STORAGE_KEY);
  if (typeof passphrases === "string") {
    try {
      const parsedPassphrases: Passphrase = JSON.parse(passphrases);
      delete parsedPassphrases[campaign_id];
      cookies().set(STORAGE_KEY, JSON.stringify(parsedPassphrases));
    } catch (e) {
      console.error("Error parsing passphrase:", e);
    }
  }
}
