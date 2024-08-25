import { cookies } from "next/headers";

const STORAGE_KEY = "id-passphrase-record";

interface Passphrase {
  [campaign_id: string | number]: string;
}

export function getPassphrase(campaign_id: string | number): string | null {
  const c = cookies();
  const passphrasesCookie = c.get(STORAGE_KEY);

  if (!passphrasesCookie) {
    return null;
  }

  try {
    const passphrases = passphrasesCookie.value;
    const parsedPassphrases: Passphrase = JSON.parse(passphrases);
    return parsedPassphrases[campaign_id] ?? null;
  } catch (e) {
    console.error("Error parsing passphrase:", e);
    return null;
  }
}
