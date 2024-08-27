"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAppStore from "@/lib/store/useAppStore";
import PassphraseForm from "./PassphraseForm";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

export default function PassphraseDialog() {
  const { passphraseDialog, setPassphraseDialog } = useAppStore();
  const t = useTranslations("PassphraseDialog");

  return (
    <Dialog open={passphraseDialog} onOpenChange={setPassphraseDialog}>
      <DialogContent className="flex flex-col gap-2 w-full max-w-md p-4">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("description")}</DialogDescription>
        <PassphraseForm
          afterSubmit={() => setPassphraseDialog(false)}
          afterCancel={() => setPassphraseDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
