"use client";
import { useEffect, useCallback, useRef } from "react";
import useAppStore from "../store/useAppStore";

interface ConfirmProps {
  id: string;
  title: string;
  description: string;
}

export default function useConfirmDialog<T extends any>(
  onConfirm: (d: T) => Promise<any>,
  onCancel?: (d: T) => Promise<any>
) {
  const { confirmDialog, setConfirmDialog } = useAppStore();
  const dataRef = useRef<T>();

  useEffect(() => {
    if (!confirmDialog || confirmDialog.state === "pending") return;

    if (confirmDialog.state === "confirmed") {
      onConfirm(dataRef.current as T);
      setConfirmDialog(null);
    } else if (confirmDialog.state === "canceled") {
      onCancel?.(dataRef.current as T);
      setConfirmDialog(null);
    }
  }, [confirmDialog, setConfirmDialog]);

  return {
    setConfirm: (props: ConfirmProps, data: T) => {
      dataRef.current = data;
      setConfirmDialog({
        ...props,
        state: "pending",
      });
    },
  };
}
