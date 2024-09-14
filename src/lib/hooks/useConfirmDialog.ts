"use client";
import { useCallback, useEffect } from "react";
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

  const handleConfirm = useCallback(
    async (data: T) => {
      onConfirm(data);
    },
    [onConfirm]
  );

  const handleCancel = useCallback(
    async (data: T) => {
      onCancel?.(data);
    },
    [onCancel]
  );

  useEffect(() => {
    if (!confirmDialog || confirmDialog.state === "pending") return;

    if (confirmDialog.state === "confirmed") {
      handleConfirm(confirmDialog.data).then(() => {
        setConfirmDialog(null);
      });
    } else if (confirmDialog.state === "canceled") {
      handleCancel?.(confirmDialog.data).then(() => {
        setConfirmDialog(null);
      });
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
