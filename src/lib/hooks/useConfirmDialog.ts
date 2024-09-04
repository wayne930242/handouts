"use client";
import { useEffect } from "react";
import useAppStore from "../store/useAppStore";

interface ConfirmProps<T> {
  id: string;
  title: string;
  description: string;
  data: T;
}

export default function useConfirmDialog<T extends any>(
  onConfirm: (d: T) => Promise<any>,
  onCancel?: (d: T) => Promise<any>
) {
  const { confirmDialog, setConfirmDialog } = useAppStore((state) => ({
    confirmDialog: state.confirmDialog,
    setConfirmDialog: state.setConfirmDialog,
  }));

  useEffect(() => {
    if (!confirmDialog || confirmDialog.state === "pending") return;

    if (confirmDialog.state === "confirmed") {
      onConfirm(confirmDialog.data);
      setConfirmDialog(null);
    } else if (confirmDialog.state === "canceled") {
      onCancel?.(confirmDialog.data);
      setConfirmDialog(null);
    }
  }, [confirmDialog, setConfirmDialog]);

  return {
    setConfirm: (props: ConfirmProps<T>) => {
      setConfirmDialog({
        ...props,
        state: "pending",
      });
    },
  };
}
