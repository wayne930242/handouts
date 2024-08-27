"use client";

import Cookies from "js-cookie";

const STORAGE_KEY = "id-passphrase-record";

interface Passphrase {
  [campaign_id: string | number]: string;
}

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
  campaign_id: string | number,
  passphrase: string | undefined = ""
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

  if (campaign_id in parsedPassphrases) {
    parsedPassphrases[campaign_id] = passphrase;
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    Cookies.set(STORAGE_KEY, JSON.stringify(parsedPassphrases), {
      expires: 30, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  } else {
    Cookies.set(STORAGE_KEY, JSON.stringify({ [campaign_id]: passphrase }), {
      expires: 30, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  return Promise.resolve();
}
