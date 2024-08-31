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

export async function removePassphrase(id: string | number, key: PassphraseDialogKey): Promise<void> {
  const c = cookies();
  const passphrasesCookie = c.get(STORAGE_KEY);

  if (!passphrasesCookie) {
    return; // No passphrases stored, nothing to remove
  }

  try {
    const passphrases = passphrasesCookie.value;
    const parsedPassphrases: Passphrase = JSON.parse(passphrases);
    const idKey = `${key}-${id}`;

    if (idKey in parsedPassphrases) {
      delete parsedPassphrases[idKey as keyof typeof parsedPassphrases];

      // Update the cookie with the new passphrases object
      c.set(STORAGE_KEY, JSON.stringify(parsedPassphrases), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: "/",
      });
    }
  } catch (e) {
    console.error("Error removing passphrase:", e);
    throw e; // Rethrow the error for the caller to handle
  }
}
