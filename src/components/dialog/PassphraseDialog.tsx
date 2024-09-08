"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import useAppStore from "@/lib/store/useAppStore";
import PassphraseForm from "@/components/form/PassphraseForm";

import { useTranslations } from "next-intl";

export default function PassphraseDialog() {
  const { passphraseDialog, setPassphraseDialog } = useAppStore((state) => ({
    passphraseDialog: state.addPassphraseDialog,
    setPassphraseDialog: state.setAddPassphraseDialog,
  }));
  const t = useTranslations("PassphraseDialog");

  return (
    <Dialog
      open={!!passphraseDialog}
      onOpenChange={(b) => {
        if (!b) setPassphraseDialog(null);
      }}
    >
      <DialogContent className="flex flex-col gap-2 w-full max-w-md p-4">
        <DialogHeader>
          <DialogTitle>
            {passphraseDialog === "campaigns"
              ? t("campaignTitle")
              : passphraseDialog === "docs"
              ? t("docTitle")
              : passphraseDialog === "games"
              ? t("gameTitle")
              : t("title")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {passphraseDialog === "campaigns"
            ? t("campaignDescription")
            : passphraseDialog === "docs"
            ? t("docDescription")
            : passphraseDialog === "games"
            ? t("gameDescription")
            : t("description")}
        </DialogDescription>
        {passphraseDialog && (
          <PassphraseForm
            afterSubmit={() => setPassphraseDialog(null)}
            afterCancel={() => setPassphraseDialog(null)}
            tableKey={passphraseDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
