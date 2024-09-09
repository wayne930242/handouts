"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "../ui/use-toast";
import { useTranslations } from "next-intl";
import { ToastAction } from "../ui/toast";

export default function CookieConsent({}: Props) {
  const [isAccepted, setIsAccepted] = useState<boolean | null>(null);

  const t = useTranslations("CookieConsent");

  useEffect(() => {
    const cookieValue = Cookies.get("cookie-consent");
    if (cookieValue === "accepted") {
      setIsAccepted(true);
    } else {
      setIsAccepted(false);
    }
  }, []);

  useEffect(() => {
    if (isAccepted === null) return;
    if (!isAccepted) {
      toast({
        title: t("title"),
        description: t("message"),
        action: (
          <ToastAction
            altText={t("confirm")}
            onClick={() => Cookies.set("cookie-consent", "accepted")}
          >
            {t("confirm")}
          </ToastAction>
        ),
      });
    }
  }, [isAccepted]);

  return <></>;
}

interface Props {}
