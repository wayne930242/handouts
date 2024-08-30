import { Passphrase, PassphraseDialogKey } from "@/types/interfaces";
import { cookies } from "next/headers";

const STORAGE_KEY = "id-passphrase-record";

export async function getPassphrase(id: string | number, key: PassphraseDialogKey): Promise<string | null> {
  const c = cookies();
  const passphrasesCookie = c.get(STORAGE_KEY);

  if (!passphrasesCookie) {
    return null;
  }

  try {
    const passphrases = passphrasesCookie.value;
    const parsedPassphrases: Passphrase = JSON.parse(passphrases);
    return parsedPassphrases[`${key}-${id}`] ?? null;
  } catch (e) {
    console.error("Error parsing passphrase:", e);
    return null;
  }
}
