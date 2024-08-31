"use client";

import { Passphrase, PassphraseDialogKey, PassphraseId } from "@/types/interfaces";
import Cookies from "js-cookie";

const STORAGE_KEY = "id-passphrase-record";

const getCookies = () => {
  try {
    return Cookies.get(STORAGE_KEY);
  } catch (e) {
    console.warn(
      "User cookies are not available, falling back to search params"
    );
    return false;
  }
};

export async function updatePassphrase(
  id: string,
  passphrase: string | undefined = "",
  key: PassphraseDialogKey
) {
  const cookieValue = getCookies();
  if (cookieValue === false) {
    const searchParams = new URLSearchParams();
    searchParams.set("passphrase", passphrase);
    return Promise.resolve();
  }

  let parsedPassphrases: Passphrase = {};
  if (cookieValue) {
    try {
      parsedPassphrases = JSON.parse(cookieValue);
    } catch (e) {
      console.error("Error parsing passphrase:", e);
      return Promise.reject();
    }
  }
  const idKey: PassphraseId = `${key}-${id}`;

  if (idKey in parsedPassphrases) {
    parsedPassphrases[idKey] = passphrase;
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    Cookies.set(STORAGE_KEY, JSON.stringify(parsedPassphrases), {
      expires: 30, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  } else {
    Cookies.set(STORAGE_KEY, JSON.stringify({ [idKey]: passphrase }), {
      expires: 30, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  return Promise.resolve();
}

export const checkPassphraseExists = (id: string | number, key: PassphraseDialogKey): boolean => {
  const cookieValue = getCookies();
  if (!cookieValue) {
    // If cookies are not available, we assume the passphrase doesn't exist
    return false;
  }

  try {
    const parsedPassphrases: Passphrase = JSON.parse(cookieValue);
    const idKey: PassphraseId = `${key}-${id}`;
    return idKey in parsedPassphrases;
  } catch (e) {
    console.error("Error checking passphrase existence:", e);
    return false;
  }
};