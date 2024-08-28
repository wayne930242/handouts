"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { useTranslations } from "next-intl";

export default function ConfirmDialog() {
  const { confirmDialog, setConfirmDialog } = useAppStore();
  const t = useTranslations("ConfirmDialog");

  const { id, title, description } = confirmDialog ?? {};

  return (
    <Dialog
      open={!!confirmDialog && confirmDialog.state === "pending"}
      onOpenChange={(open) => {
        if (!open) {
          setConfirmDialog(null);
        }
      }}
    >
      <DialogContent className="flex flex-col gap-2 w-full max-w-md p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogContent>{description}</DialogContent>
        <DialogContent>
          <Button
            variant="secondary"
            onClick={() => {
              setConfirmDialog({
                id: id ?? "",
                title: title ?? "",
                description: description ?? "",
                state: "canceled",
              });
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setConfirmDialog({
                id: id ?? "",
                title: title ?? "",
                description: description ?? "",
                state: "confirmed",
              });
            }}
          >
            {t("confirm")}
          </Button>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
}
