"use client";
import { useEffect, useCallback, useRef } from "react";
import useAppStore from "../store/useAppStore";

export default function useConfirmDialog() {
  const { confirmDialog, setConfirmDialog } = useAppStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeoutSafely = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimeoutSafely();
  }, []);

  const waitForConfirmDialog = useCallback(
    ({
      id,
      title,
      description,
    }: {
      id: string;
      title: string;
      description: string;
    }) => {
      return new Promise<boolean>((resolve) => {
        setConfirmDialog({
          id,
          title,
          description,
          state: "pending",
        });

        const checkState = () => {
          if (confirmDialog?.id === id) {
            if (confirmDialog.state === "confirmed") {
              setConfirmDialog(null);
              resolve(true);
            } else if (confirmDialog.state === "canceled") {
              setConfirmDialog(null);
              resolve(false);
            } else {
              clearTimeoutSafely();
              timeoutRef.current = setTimeout(checkState, 100);
            }
          } else {
            resolve(false);
          }
        };

        clearTimeoutSafely();
        timeoutRef.current = setTimeout(checkState, 0);
      });
    },
    [confirmDialog, setConfirmDialog]
  );

  return waitForConfirmDialog;
}
