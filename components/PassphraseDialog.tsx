"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAppStore from "@/lib/store/useAppStore";

import PassphraseForm from "./PassphraseForm";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function PassphraseDialog() {
  const { passphraseDialog, setPassphraseDialog } = useAppStore();

  return (
    <Dialog open={passphraseDialog} onOpenChange={setPassphraseDialog}>
      <DialogContent className="flex flex-col gap-2 w-full max-w-md p-4">
        <DialogHeader>
          <DialogTitle>通關密語</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          請輸入 GM 提供給你的戰役 ID 與通關密語。
        </DialogDescription>
        <PassphraseForm
          afterSubmit={() => setPassphraseDialog(false)}
          afterCancel={() => setPassphraseDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
